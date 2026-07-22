import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

function getFirebaseApp(): App {
  if (getApps().length) return getApps()[0];
  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

interface Job {
  title: string | null;
  company: string | null;
  skills: string | null;
  location: string | null;
}

interface Prefs {
  alerts_enabled: boolean | null;
  alert_keywords: string | null;
  alert_provinces: string | null;
}

/** Split a comma-separated preference string into lowercase terms. */
function terms(raw: string | null): string[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/** Does this job match the user's keywords + provinces? Empty prefs = match all. */
function matches(job: Job, keywords: string[], provinces: string[]): boolean {
  if (keywords.length > 0) {
    const haystack = [job.title, job.company, job.skills]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (!keywords.some((k) => haystack.includes(k))) return false;
  }
  if (provinces.length > 0) {
    const loc = (job.location ?? "").toLowerCase();
    if (!provinces.some((p) => loc.includes(p))) return false;
  }
  return true;
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const app = getFirebaseApp();
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
    );

    // 1. Today's new jobs — fetched once, filtered per user in memory
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: jobs, error: jobsError } = await supabase
      .from("jobs")
      .select("title, company, skills, location")
      .gte("created_at", today.toISOString());

    if (jobsError) {
      console.error("[notify] jobs fetch error:", jobsError);
      return NextResponse.json({ error: "Job fetch failed" }, { status: 500 });
    }

    const jobCount = jobs?.length ?? 0;
    if (jobCount === 0) {
      return NextResponse.json({ message: "No new jobs today", sent: 0 });
    }

    // 2. Tokens with their owner
    const { data: tokens, error: tokenError } = await supabase
      .from("fcm_tokens")
      .select("token, user_id");

    if (tokenError || !tokens || tokens.length === 0) {
      return NextResponse.json({ message: "No FCM tokens found", sent: 0 });
    }

    // 3. Preferences for those users, in one query
    const userIds = Array.from(
      new Set(tokens.map((t) => t.user_id).filter(Boolean)),
    ) as string[];

    const prefsById = new Map<string, Prefs>();
    if (userIds.length > 0) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, alerts_enabled, alert_keywords, alert_provinces")
        .in("id", userIds);

      for (const p of profiles ?? []) {
        prefsById.set(p.id, {
          alerts_enabled: p.alerts_enabled,
          alert_keywords: p.alert_keywords,
          alert_provinces: p.alert_provinces,
        });
      }
    }

    // 4. Group tokens by the message they should receive.
    //    Users with the same match count get the same text → one multicast each.
    //    ── NEW: also remember each individual user's own title/body so we
    //    can write one notifications row per user below (Step 6). ──
    const groups = new Map<string, { tokens: string[]; count: number }>();
    const userMessages = new Map<
      string,
      { type: string; title: string; body: string }
    >();
    let skipped = 0;

    for (const row of tokens) {
      const token = row.token as string;
      if (!token) continue;

      const prefs = row.user_id ? prefsById.get(row.user_id) : undefined;

      // Opted out — skip entirely
      if (prefs?.alerts_enabled === false) {
        skipped++;
        continue;
      }

      const kw = terms(prefs?.alert_keywords ?? null);
      const pv = terms(prefs?.alert_provinces ?? null);

      // No prefs (or anonymous token) → general digest
      let count = jobCount;
      let personalized = false;

      if (kw.length > 0 || pv.length > 0) {
        const matched = (jobs as Job[]).filter((j) =>
          matches(j, kw, pv),
        ).length;
        // Fall back to the general digest when nothing matches,
        // so narrow preferences never mean silence.
        if (matched > 0) {
          count = matched;
          personalized = true;
        }
      }

      const key = `${personalized ? "p" : "g"}:${count}`;
      const group = groups.get(key);
      if (group) {
        group.tokens.push(token);
      } else {
        groups.set(key, { tokens: [token], count });
      }

      // ── NEW: record this user's in-app notification content ──
      // (skip anonymous/guest tokens with no user_id — nothing to attach the row to)
      if (row.user_id && !userMessages.has(row.user_id)) {
        userMessages.set(row.user_id, {
          type: personalized ? "job_alert" : "job_match",
          title: personalized
            ? `Matches your alert: ${count} new ${count === 1 ? "job" : "jobs"}`
            : `${count} new ${count === 1 ? "job" : "jobs"} today`,
          body: personalized
            ? `${count} new ${count === 1 ? "job matches" : "jobs match"} your alert preferences.`
            : `Fresh opportunities from jobs.af, ACBAR and LinkedIn.`,
        });
      }
    }

    // 5. Send one multicast per group, batched at 500
    const messaging = getMessaging(app);
    let totalSent = 0;
    let totalFailed = 0;
    const invalidTokens: string[] = [];

    for (const [key, group] of groups) {
      const personalized = key.startsWith("p:");
      const title = personalized
        ? `🔔 ${group.count} New ${group.count === 1 ? "Job" : "Jobs"} For You`
        : `🔔 ${group.count} New ${group.count === 1 ? "Job" : "Jobs"} Today`;
      const body = personalized
        ? `${group.count} new ${group.count === 1 ? "job matches" : "jobs match"} your alert preferences. Tap to explore!`
        : `${group.count} new job opportunities in Afghanistan. Tap to explore!`;

      for (let i = 0; i < group.tokens.length; i += 500) {
        const batch = group.tokens.slice(i, i + 500);

        const response = await messaging.sendEachForMulticast({
          tokens: batch,
          notification: { title, body },
          android: {
            priority: "high",
            notification: {
              channelId: "karjo_daily",
              color: "#059669",
              clickAction: "FLUTTER_NOTIFICATION_CLICK",
            },
          },
          data: {
            type: "daily_jobs",
            job_count: group.count.toString(),
            personalized: personalized ? "true" : "false",
            screen: "notifications",
          },
        });

        totalSent += response.successCount;
        totalFailed += response.failureCount;

        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            const code = resp.error?.code;
            if (
              code === "messaging/invalid-registration-token" ||
              code === "messaging/registration-token-not-registered"
            ) {
              invalidTokens.push(batch[idx]);
            }
          }
        });
      }
    }

    if (invalidTokens.length > 0) {
      await supabase.from("fcm_tokens").delete().in("token", invalidTokens);
    }

    // ── NEW: write one notifications row per user so the Flutter app's
    // Notifications page shows the same digest that was just pushed. ──
    if (userMessages.size > 0) {
      const rows = Array.from(userMessages.entries()).map(([user_id, msg]) => ({
        user_id,
        type: msg.type,
        title: msg.title,
        body: msg.body,
      }));

      // Insert in chunks of 500 (same batching pattern as the push above)
      for (let i = 0; i < rows.length; i += 500) {
        const chunk = rows.slice(i, i + 500);
        const { error: notifError } = await supabase
          .from("notifications")
          .insert(chunk);
        if (notifError) {
          console.error("[notify] notifications insert error:", notifError);
        }
      }
    }

    await supabase.from("job_notifications").insert({
      job_count: jobCount,
      sent_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      jobCount,
      totalTokens: tokens.length,
      groups: groups.size,
      skippedOptOut: skipped,
      sent: totalSent,
      failed: totalFailed,
      notificationsWritten: userMessages.size,
    });
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json(
      { error: "Failed to send notifications", details: String(error) },
      { status: 500 },
    );
  }
}

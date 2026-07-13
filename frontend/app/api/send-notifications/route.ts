import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { initializeApp, getApps, cert, App } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

// Lazy Firebase Admin init — only runs AFTER the auth check passes
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

export async function GET(req: NextRequest) {
  // Verify Vercel Cron authorization header — runs FIRST
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

    // Count today's new jobs
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count: jobCount } = await supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today.toISOString());

    if (!jobCount || jobCount === 0) {
      return NextResponse.json({ message: "No new jobs today", sent: 0 });
    }

    // Get all FCM tokens
    const { data: tokens, error: tokenError } = await supabase
      .from("fcm_tokens")
      .select("token");

    if (tokenError || !tokens || tokens.length === 0) {
      return NextResponse.json({ message: "No FCM tokens found", sent: 0 });
    }

    const titleEn = `🔔 ${jobCount} New Jobs Today`;
    const bodyEn = `${jobCount} new job opportunities in Afghanistan. Tap to explore!`;

    // Send in batches of 500
    const tokenList = tokens
      .map((t: { token: string }) => t.token)
      .filter(Boolean);
    const batchSize = 500;
    let totalSent = 0;
    let totalFailed = 0;
    const messaging = getMessaging(app);

    for (let i = 0; i < tokenList.length; i += batchSize) {
      const batch = tokenList.slice(i, i + batchSize);

      const response = await messaging.sendEachForMulticast({
        tokens: batch,
        notification: {
          title: titleEn,
          body: bodyEn,
        },
        android: {
          priority: "high",
          notification: {
            channelId: "karjo_daily_jobs",
            color: "#059669",
            clickAction: "FLUTTER_NOTIFICATION_CLICK",
          },
        },
        data: {
          type: "daily_jobs",
          job_count: jobCount.toString(),
          screen: "notifications",
        },
      });

      totalSent += response.successCount;
      totalFailed += response.failureCount;

      // Remove invalid tokens
      const invalidTokens: string[] = [];
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

      if (invalidTokens.length > 0) {
        await supabase.from("fcm_tokens").delete().in("token", invalidTokens);
      }
    }

    // Log to Supabase
    await supabase.from("job_notifications").insert({
      job_count: jobCount,
      sent_at: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      jobCount,
      totalTokens: tokenList.length,
      sent: totalSent,
      failed: totalFailed,
    });
  } catch (error) {
    console.error("Notification error:", error);
    return NextResponse.json(
      { error: "Failed to send notifications", details: String(error) },
      { status: 500 },
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  // 1. Verify caller is a logged-in admin
  const token = (req.headers.get("authorization") || "").replace("Bearer ", "");
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const {
    data: { user },
    error: userError,
  } = await admin.auth.getUser(token);
  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 2. Validate payload
  const { to, name, jobTitle, action } = await req.json();
  if (!to || !jobTitle || !["approved", "rejected"].includes(action)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // 3. Build the bilingual email
  const approved = action === "approved";
  const subject = approved
    ? `✅ Your job "${jobTitle}" is now live on KarJo`
    : `Your job "${jobTitle}" was not approved`;

  const greetName = name || "there";
  const jobsUrl = "https://karjo.vercel.app/jobs";
  const dashUrl = "https://karjo.vercel.app/dashboard";

  const enBlock = approved
    ? `<p>Hi ${greetName},</p>
       <p>Good news — your job posting <strong>"${jobTitle}"</strong> has been reviewed and approved. It is now live and visible to job seekers on KarJo.</p>
       <p><a href="${jobsUrl}" style="color:#059669;font-weight:bold;">View it on KarJo →</a></p>`
    : `<p>Hi ${greetName},</p>
       <p>Unfortunately your job posting <strong>"${jobTitle}"</strong> was not approved and has been removed. This usually happens when a listing is incomplete, unclear, or doesn't meet our quality guidelines.</p>
       <p>You're welcome to post it again with more details from your <a href="${dashUrl}" style="color:#059669;font-weight:bold;">dashboard</a>.</p>`;

  const faBlock = approved
    ? `<p>سلام ${greetName}،</p>
       <p>خبر خوب — آگهی شغلی شما <strong>«${jobTitle}»</strong> بررسی و تأیید شد. اکنون در کارجو فعال و برای کارجویان قابل مشاهده است.</p>`
    : `<p>سلام ${greetName}،</p>
       <p>متأسفانه آگهی شغلی شما <strong>«${jobTitle}»</strong> تأیید نشد و حذف گردید. این معمولاً زمانی اتفاق می‌افتد که آگهی ناقص، نامشخص یا خلاف معیارهای کیفی ما باشد.</p>
       <p>می‌توانید آن را با جزئیات بیشتر دوباره از داشبورد خود ثبت کنید.</p>`;

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:24px;">
    <div style="margin-bottom:24px;">
      <span style="font-size:22px;font-weight:bold;color:#1B2E4B;">Kar</span><span style="font-size:22px;font-weight:bold;color:#059669;">Jo</span>
      <span style="font-size:12px;color:#059669;background:#ecfdf5;border:1px solid #a7f3d0;border-radius:999px;padding:2px 8px;margin-left:8px;">کارجو</span>
    </div>
    <div style="color:#333;font-size:14px;line-height:1.7;">
      ${enBlock}
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
      <div dir="rtl" style="text-align:right;">
        ${faBlock}
      </div>
    </div>
    <p style="color:#999;font-size:11px;margin-top:28px;">KarJo · کارجو — Every Afghan Job, One Place.<br/>karjo.vercel.app</p>
  </div>`;

  // 4. Send via Gmail
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"KarJo کارجو" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[notify-employer] send error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}

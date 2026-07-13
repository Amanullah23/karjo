"use client";

import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { useLang } from "@/lib/language-context";

const CONTACT_EMAIL = "contact@karjo.af"; // ← use the same email as your contact page

const copy = {
  en: {
    tag: "Legal",
    title: "Privacy Policy",
    updated: "Last updated: July 2026",
    sections: [
      {
        h: "1. Who we are",
        p: "KarJo (کارجو) is a job aggregation platform for Afghanistan, available at karjo.vercel.app, as an Android app, and through Telegram. This policy explains what information we collect and how we use it.",
      },
      {
        h: "2. Information we collect",
        p: "Account information: when you sign up, we store your name, email address, and profile details you choose to add (phone, province, headline, skills, Telegram username). If you sign in with Google, we receive your name and email from Google. Usage data: jobs you save or mark as applied. Notifications: if you enable push notifications in the app, we store a device token to deliver them. Contact messages: if you use our contact form, we store your name, email, and message.",
      },
      {
        h: "3. How we use your information",
        p: "We use your information to provide KarJo's features: your account and profile, saving and tracking jobs, sending job alert notifications you've opted into, and responding to your messages. We do not sell your personal information to anyone.",
      },
      {
        h: "4. Job listings",
        p: "Job listings on KarJo are collected automatically from public sources including jobs.af, ACBAR, and LinkedIn. KarJo does not own these listings. When you apply for a job, you are redirected to the original source — any information you submit there is governed by that website's own privacy policy.",
      },
      {
        h: "5. Third-party services",
        p: "KarJo relies on trusted service providers to operate: Supabase (database and authentication), Google (optional sign-in), Firebase (push notifications), Vercel (hosting), and Telegram (job alerts). Each processes data only as needed to provide their service.",
      },
      {
        h: "6. Data retention and deletion",
        p: "Your account data is kept while your account is active. You can request deletion of your account and associated data at any time by contacting us — we will remove it within a reasonable period.",
      },
      {
        h: "7. Security",
        p: "We use industry-standard measures to protect your data, including encrypted connections (HTTPS) and access controls on our database. No method of transmission or storage is 100% secure, but we work to protect your information.",
      },
      {
        h: "8. Children",
        p: "KarJo is intended for users of working age. We do not knowingly collect information from children under 13.",
      },
      {
        h: "9. Changes to this policy",
        p: "We may update this policy from time to time. Changes will be posted on this page with an updated date.",
      },
      {
        h: "10. Contact",
        p: `Questions about this policy? Email us at ${CONTACT_EMAIL} or use the contact page.`,
      },
    ],
  },
  fa: {
    tag: "حقوقی",
    title: "حریم خصوصی",
    updated: "آخرین بروزرسانی: جولای ۲۰۲۶",
    sections: [
      {
        h: "۱. ما کی هستیم",
        p: "کارجو یک پلتفرم جمع‌آوری وظایف برای افغانستان است که در karjo.vercel.app، به صورت اپلیکیشن اندروید و از طریق تلگرام در دسترس است. این سند توضیح می‌دهد چه اطلاعاتی جمع‌آوری می‌کنیم و چگونه از آن استفاده می‌کنیم.",
      },
      {
        h: "۲. اطلاعاتی که جمع‌آوری می‌کنیم",
        p: "اطلاعات حساب: هنگام ثبت‌نام، نام، ایمیل و جزئیات پروفایلی که خودتان اضافه می‌کنید (تلفن، ولایت، عنوان شغلی، مهارت‌ها، نام کاربری تلگرام) ذخیره می‌شود. اگر با گوگل وارد شوید، نام و ایمیل شما را از گوگل دریافت می‌کنیم. داده‌های استفاده: وظایفی که ذخیره یا به عنوان درخواست‌شده علامت می‌زنید. اعلان‌ها: اگر اعلان‌های اپلیکیشن را فعال کنید، یک توکن دستگاه برای ارسال آن‌ها ذخیره می‌شود. پیام‌های تماس: اگر از فرم تماس استفاده کنید، نام، ایمیل و پیام شما ذخیره می‌شود.",
      },
      {
        h: "۳. چگونه از اطلاعات شما استفاده می‌کنیم",
        p: "از اطلاعات شما برای ارائه امکانات کارجو استفاده می‌کنیم: حساب و پروفایل شما، ذخیره و پیگیری وظایف، ارسال هشدارهایی که خودتان فعال کرده‌اید، و پاسخ به پیام‌های شما. ما اطلاعات شخصی شما را به هیچ‌کس نمی‌فروشیم.",
      },
      {
        h: "۴. آگهی‌های شغلی",
        p: "آگهی‌های شغلی در کارجو به صورت خودکار از منابع عمومی شامل jobs.af، ACBAR و LinkedIn جمع‌آوری می‌شوند. کارجو مالک این آگهی‌ها نیست. هنگام درخواست، به منبع اصلی منتقل می‌شوید — اطلاعاتی که آنجا ارسال می‌کنید تابع سیاست حریم خصوصی همان وب‌سایت است.",
      },
      {
        h: "۵. خدمات شخص ثالث",
        p: "کارجو برای فعالیت خود از ارائه‌دهندگان معتبر استفاده می‌کند: Supabase (دیتابیس و احراز هویت)، Google (ورود اختیاری)، Firebase (اعلان‌ها)، Vercel (میزبانی) و Telegram (هشدارهای شغلی). هر کدام فقط در حد ارائه خدمات‌شان داده پردازش می‌کنند.",
      },
      {
        h: "۶. نگهداری و حذف داده‌ها",
        p: "داده‌های حساب شما تا زمانی که حسابتان فعال است نگهداری می‌شود. هر زمان می‌توانید با تماس با ما درخواست حذف حساب و داده‌های مرتبط را بدهید — در مدت معقولی حذف خواهد شد.",
      },
      {
        h: "۷. امنیت",
        p: "ما از روش‌های استاندارد صنعتی برای محافظت از داده‌های شما استفاده می‌کنیم، از جمله ارتباطات رمزگذاری‌شده (HTTPS) و کنترل دسترسی به دیتابیس. هیچ روشی ۱۰۰٪ امن نیست، اما ما برای محافظت از اطلاعات شما تلاش می‌کنیم.",
      },
      {
        h: "۸. کودکان",
        p: "کارجو برای کاربران در سن کار طراحی شده است. ما آگاهانه از کودکان زیر ۱۳ سال اطلاعاتی جمع‌آوری نمی‌کنیم.",
      },
      {
        h: "۹. تغییرات این سند",
        p: "ممکن است این سند را هر از گاهی بروزرسانی کنیم. تغییرات با تاریخ جدید در همین صفحه منتشر می‌شود.",
      },
      {
        h: "۱۰. تماس",
        p: `سوالی درباره این سند دارید؟ به ${CONTACT_EMAIL} ایمیل بزنید یا از صفحه تماس استفاده کنید.`,
      },
    ],
  },
};

export default function PrivacyPage() {
  const { lang } = useLang();
  const t = copy[lang === "fa" ? "fa" : "en"];

  return (
    <div className="min-h-screen bg-cream px-4 sm:px-6 pt-24 pb-16">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-2">
            <Shield size={14} className="text-emerald" />
            <p className="text-xs font-semibold tracking-widest uppercase text-emerald">
              {t.tag}
            </p>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-2">
            {t.title}
          </h1>
          <p className="text-xs text-warm-muted">{t.updated}</p>
        </motion.div>

        <div className="bg-white border border-warm-gray rounded-2xl p-6 sm:p-8 space-y-7">
          {t.sections.map((s) => (
            <section key={s.h}>
              <h2 className="font-display font-bold text-navy text-base mb-2">
                {s.h}
              </h2>
              <p className="text-sm text-charcoal/70 leading-relaxed">{s.p}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

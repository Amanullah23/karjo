"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { useLang } from "@/lib/language-context";

const CONTACT_EMAIL = "contact@karjo.af"; // ← same email as privacy page

const copy = {
  en: {
    tag: "Legal",
    title: "Terms of Service",
    updated: "Last updated: July 2026",
    sections: [
      {
        h: "1. Acceptance of terms",
        p: "By using KarJo (کارجو) — the website, Android app, or Telegram services — you agree to these terms. If you do not agree, please do not use KarJo.",
      },
      {
        h: "2. What KarJo is",
        p: "KarJo is a free job aggregation platform. We automatically collect job listings from public sources (jobs.af, ACBAR, LinkedIn) and present them in one place, alongside scholarship information and job alert services.",
      },
      {
        h: "3. Job listings and accuracy",
        p: "Job listings are collected automatically and belong to their original sources. While we work to keep information fresh and accurate, we cannot guarantee that every listing is current, complete, or error-free. Always verify details on the original posting before applying. KarJo is not the employer and is not involved in any hiring decisions.",
      },
      {
        h: "4. Your account",
        p: "You are responsible for the accuracy of the information in your account and for keeping your login credentials secure. You must not impersonate others or provide false information. We may suspend accounts that violate these terms.",
      },
      {
        h: "5. Acceptable use",
        p: "You agree not to misuse KarJo — including attempting to disrupt the service, scraping our platform at abusive rates, posting or transmitting unlawful content through the contact form, or using KarJo for fraudulent purposes.",
      },
      {
        h: "6. Intellectual property",
        p: "The KarJo name, logo, and platform design belong to KarJo. Job listings remain the property of their original sources. Scholarship information links to official providers.",
      },
      {
        h: "7. Free service and availability",
        p: "KarJo is provided free of charge, 'as is' and 'as available.' We do not guarantee uninterrupted availability and may modify or discontinue features at any time.",
      },
      {
        h: "8. Limitation of liability",
        p: "To the maximum extent permitted by law, KarJo is not liable for any damages arising from your use of the platform, including decisions made based on job listings, interactions with employers, or service interruptions.",
      },
      {
        h: "9. Changes to these terms",
        p: "We may update these terms from time to time. Continued use of KarJo after changes means you accept the updated terms.",
      },
      {
        h: "10. Contact",
        p: `Questions about these terms? Email us at ${CONTACT_EMAIL} or use the contact page.`,
      },
    ],
  },
  fa: {
    tag: "حقوقی",
    title: "شرایط استفاده",
    updated: "آخرین بروزرسانی: جولای ۲۰۲۶",
    sections: [
      {
        h: "۱. پذیرش شرایط",
        p: "با استفاده از کارجو — وب‌سایت، اپلیکیشن اندروید یا خدمات تلگرام — شما این شرایط را می‌پذیرید. اگر موافق نیستید، لطفاً از کارجو استفاده نکنید.",
      },
      {
        h: "۲. کارجو چیست",
        p: "کارجو یک پلتفرم رایگان جمع‌آوری وظایف است. ما آگهی‌های شغلی را به صورت خودکار از منابع عمومی (jobs.af، ACBAR، LinkedIn) جمع‌آوری کرده و یک‌جا نمایش می‌دهیم، در کنار اطلاعات بورسیه‌ها و خدمات هشدار شغلی.",
      },
      {
        h: "۳. آگهی‌های شغلی و دقت اطلاعات",
        p: "آگهی‌ها به صورت خودکار جمع‌آوری می‌شوند و متعلق به منابع اصلی خود هستند. با اینکه برای تازه و دقیق نگه‌داشتن اطلاعات تلاش می‌کنیم، نمی‌توانیم تضمین کنیم هر آگهی به‌روز، کامل یا بدون خطا باشد. همیشه قبل از درخواست، جزئیات را در آگهی اصلی بررسی کنید. کارجو کارفرما نیست و در هیچ تصمیم استخدامی نقشی ندارد.",
      },
      {
        h: "۴. حساب کاربری شما",
        p: "شما مسئول درستی اطلاعات حساب خود و حفظ امنیت اطلاعات ورودتان هستید. جعل هویت دیگران یا ارائه اطلاعات نادرست مجاز نیست. حساب‌هایی که این شرایط را نقض کنند ممکن است معلق شوند.",
      },
      {
        h: "۵. استفاده قابل قبول",
        p: "شما موافقت می‌کنید از کارجو سوءاستفاده نکنید — از جمله تلاش برای اختلال در سرویس، جمع‌آوری داده از پلتفرم ما با نرخ‌های آزاردهنده، ارسال محتوای غیرقانونی از طریق فرم تماس، یا استفاده از کارجو برای اهداف کلاهبردارانه.",
      },
      {
        h: "۶. مالکیت معنوی",
        p: "نام، لوگو و طراحی پلتفرم کارجو متعلق به کارجو است. آگهی‌های شغلی در مالکیت منابع اصلی خود باقی می‌مانند. اطلاعات بورسیه‌ها به ارائه‌دهندگان رسمی لینک می‌شود.",
      },
      {
        h: "۷. سرویس رایگان و در دسترس بودن",
        p: "کارجو رایگان و «همان‌گونه که هست» ارائه می‌شود. ما دسترسی بدون وقفه را تضمین نمی‌کنیم و ممکن است هر زمان امکاناتی را تغییر دهیم یا متوقف کنیم.",
      },
      {
        h: "۸. محدودیت مسئولیت",
        p: "تا حداکثر حد مجاز قانونی، کارجو مسئول هیچ خسارتی ناشی از استفاده شما از پلتفرم نیست، از جمله تصمیمات مبتنی بر آگهی‌های شغلی، تعامل با کارفرمایان، یا وقفه‌های سرویس.",
      },
      {
        h: "۹. تغییرات این شرایط",
        p: "ممکن است این شرایط را هر از گاهی بروزرسانی کنیم. ادامه استفاده از کارجو پس از تغییرات به معنای پذیرش شرایط جدید است.",
      },
      {
        h: "۱۰. تماس",
        p: `سوالی درباره این شرایط دارید؟ به ${CONTACT_EMAIL} ایمیل بزنید یا از صفحه تماس استفاده کنید.`,
      },
    ],
  },
};

export default function TermsPage() {
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
            <FileText size={14} className="text-emerald" />
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

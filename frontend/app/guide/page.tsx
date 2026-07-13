"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  RefreshCw,
  LayoutList,
  Bell,
  Globe,
  Smartphone,
  Send,
  ChevronDown,
  Briefcase,
  GraduationCap,
  Building2,
  Download,
  Mail,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { useLang } from "@/lib/language-context";

const TELEGRAM_CHANNEL = "https://t.me/KarJoAfghanistan";
const TELEGRAM_BOT = "https://t.me/Kar_Jo_Bot";
const PORTFOLIO_URL = "https://yawari.vercel.app";

const copy = {
  en: {
    tag: "Guide",
    title: "How to use KarJo",
    subtitle:
      "Everything you need to know about finding your next opportunity with KarJo — on the web, in the app, or on Telegram.",

    how_title: "How KarJo works",
    step1_title: "We collect jobs every morning",
    step1_desc:
      "KarJo automatically scrapes jobs.af, ACBAR, and LinkedIn every day — so you don't have to open 5 websites.",
    step2_title: "Browse everything in one place",
    step2_desc:
      "All jobs appear on the website and app — search, filter by source, save the ones you like, and track your applications.",
    step3_title: "Get alerts on Telegram",
    step3_desc:
      "Every morning at 8 AM Kabul time, the freshest jobs land straight in your Telegram. Free, forever.",

    ways_title: "Three ways to use KarJo",
    web_title: "Website",
    web_desc:
      "Create a free account, browse and search all jobs, save the interesting ones, and track every application from your dashboard.",
    web_cta: "Browse jobs",
    app_title: "Android App",
    app_desc:
      "All website features plus push notifications on your phone. Download the APK directly — iOS coming soon.",
    app_cta: "Download app",
    bot_title: "Telegram Bot",
    bot_desc:
      "No signup needed. Start the bot or join the channel and receive the daily job digest at 8 AM every morning.",
    bot_cta: "Open Telegram",

    faq_title: "Frequently asked questions",
    faqs: [
      {
        q: "Is KarJo free?",
        a: "Yes — 100% free, forever. Browsing jobs, the app, and Telegram alerts all cost nothing.",
      },
      {
        q: "Where do the jobs come from?",
        a: "KarJo automatically collects jobs every morning from jobs.af, ACBAR, and LinkedIn. We don't own the listings — we help you find them faster, in one place.",
      },
      {
        q: "How do I apply for a job?",
        a: "Open any job and click Apply — you'll be taken to the original posting on the source website where you submit your application. You can mark it as Applied on KarJo to track it.",
      },
      {
        q: "How do I get daily job alerts?",
        a: "Join our Telegram channel @KarJoAfghanistan or start the bot @Kar_Jo_Bot. Every morning at 8 AM Kabul time you'll receive the newest jobs automatically.",
      },
      {
        q: "Do I need an account?",
        a: "No account is needed to browse jobs or use Telegram alerts. An account (free) lets you save jobs, track applications, and build your profile.",
      },
      {
        q: "Are there scholarships too?",
        a: "Yes — check the Scholarships page for fully funded study opportunities open to Afghan students.",
      },
      {
        q: "Which languages are supported?",
        a: "KarJo works in English and دری (Dari). Switch anytime using the language button in the top menu.",
      },
    ],

    links_title: "Quick links",
    link_jobs: "Browse jobs",
    link_scholarships: "Scholarships",
    link_companies: "Companies",
    link_download: "Download app",
    link_contact: "Contact us",
    link_channel: "Telegram channel",
    link_bot: "Telegram bot",

    built_by: "KarJo is built and maintained in Kabul by",
  },
  fa: {
    tag: "راهنما",
    title: "چگونه از کارجو استفاده کنیم",
    subtitle:
      "هر آنچه برای یافتن فرصت شغلی بعدی‌تان با کارجو نیاز دارید — در وب‌سایت، اپلیکیشن یا تلگرام.",

    how_title: "کارجو چگونه کار می‌کند",
    step1_title: "هر روز صبح وظایف را جمع‌آوری می‌کنیم",
    step1_desc:
      "کارجو هر روز به صورت خودکار وظایف را از jobs.af، ACBAR و LinkedIn جمع‌آوری می‌کند — تا شما مجبور نباشید ۵ وب‌سایت را باز کنید.",
    step2_title: "همه را یک‌جا مشاهده کنید",
    step2_desc:
      "همه وظایف در وب‌سایت و اپلیکیشن نمایش داده می‌شوند — جستجو کنید، بر اساس منبع فیلتر کنید، موارد دلخواه را ذخیره و درخواست‌هایتان را پیگیری کنید.",
    step3_title: "هشدارها را در تلگرام دریافت کنید",
    step3_desc:
      "هر روز ساعت ۸ صبح به وقت کابل، تازه‌ترین وظایف مستقیم به تلگرام شما می‌رسد. رایگان، برای همیشه.",

    ways_title: "سه روش استفاده از کارجو",
    web_title: "وب‌سایت",
    web_desc:
      "حساب رایگان بسازید، همه وظایف را جستجو کنید، موارد جالب را ذخیره کنید و همه درخواست‌هایتان را از داشبورد پیگیری کنید.",
    web_cta: "جستجوی وظایف",
    app_title: "اپلیکیشن اندروید",
    app_desc:
      "همه امکانات وب‌سایت به‌علاوه اعلان‌ها روی گوشی شما. فایل APK را مستقیم دانلود کنید — نسخه iOS به زودی.",
    app_cta: "دانلود اپلیکیشن",
    bot_title: "ربات تلگرام",
    bot_desc:
      "بدون نیاز به ثبت‌نام. ربات را شروع کنید یا به کانال بپیوندید و هر روز ساعت ۸ صبح خلاصه وظایف را دریافت کنید.",
    bot_cta: "باز کردن تلگرام",

    faq_title: "سوالات متداول",
    faqs: [
      {
        q: "آیا کارجو رایگان است؟",
        a: "بله — ۱۰۰٪ رایگان، برای همیشه. مشاهده وظایف، اپلیکیشن و هشدارهای تلگرام هیچ هزینه‌ای ندارند.",
      },
      {
        q: "وظایف از کجا می‌آیند؟",
        a: "کارجو هر روز صبح به صورت خودکار وظایف را از jobs.af، ACBAR و LinkedIn جمع‌آوری می‌کند. ما مالک آگهی‌ها نیستیم — کمک می‌کنیم آن‌ها را سریع‌تر و یک‌جا پیدا کنید.",
      },
      {
        q: "چگونه برای یک وظیفه درخواست دهم؟",
        a: "هر وظیفه را باز کنید و روی «درخواست دهید» کلیک کنید — به آگهی اصلی در وب‌سایت منبع منتقل می‌شوید و همان‌جا درخواست می‌دهید. می‌توانید آن را در کارجو به عنوان «درخواست‌شده» علامت بزنید تا پیگیری شود.",
      },
      {
        q: "چگونه هشدار روزانه دریافت کنم؟",
        a: "به کانال تلگرام @KarJoAfghanistan بپیوندید یا ربات @Kar_Jo_Bot را شروع کنید. هر روز ساعت ۸ صبح به وقت کابل، جدیدترین وظایف به صورت خودکار برایتان ارسال می‌شود.",
      },
      {
        q: "آیا به حساب کاربری نیاز دارم؟",
        a: "برای مشاهده وظایف یا هشدارهای تلگرام نیازی به حساب نیست. حساب رایگان به شما امکان ذخیره وظایف، پیگیری درخواست‌ها و ساخت پروفایل را می‌دهد.",
      },
      {
        q: "آیا بورسیه هم دارید؟",
        a: "بله — صفحه بورسیه‌ها را برای فرصت‌های تحصیلی کاملاً رایگان ویژه دانشجویان افغان ببینید.",
      },
      {
        q: "کدام زبان‌ها پشتیبانی می‌شوند؟",
        a: "کارجو به انگلیسی و دری کار می‌کند. هر زمان با دکمه زبان در منوی بالا تغییر دهید.",
      },
    ],

    links_title: "لینک‌های سریع",
    link_jobs: "جستجوی وظایف",
    link_scholarships: "بورسیه‌ها",
    link_companies: "شرکت‌ها",
    link_download: "دانلود اپلیکیشن",
    link_contact: "تماس با ما",
    link_channel: "کانال تلگرام",
    link_bot: "ربات تلگرام",

    built_by: "کارجو در کابل ساخته و نگهداری می‌شود توسط",
  },
};

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white border border-warm-gray rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-start"
      >
        <span className="text-sm font-semibold text-navy">{q}</span>
        <ChevronDown
          size={16}
          className={`text-warm-muted shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="px-5 pb-4 text-sm text-charcoal/70 leading-relaxed">
          {a}
        </p>
      )}
    </div>
  );
}

export default function GuidePage() {
  const { lang } = useLang();
  const t = copy[lang === "fa" ? "fa" : "en"];

  const steps = [
    {
      icon: <RefreshCw size={20} />,
      title: t.step1_title,
      desc: t.step1_desc,
      bg: "bg-blue-600",
    },
    {
      icon: <LayoutList size={20} />,
      title: t.step2_title,
      desc: t.step2_desc,
      bg: "bg-emerald",
    },
    {
      icon: <Bell size={20} />,
      title: t.step3_title,
      desc: t.step3_desc,
      bg: "bg-navy",
    },
  ];

  const ways = [
    {
      icon: <Globe size={22} className="text-navy" />,
      title: t.web_title,
      desc: t.web_desc,
      href: "/jobs",
      cta: t.web_cta,
      external: false,
    },
    {
      icon: <Smartphone size={22} className="text-navy" />,
      title: t.app_title,
      desc: t.app_desc,
      href: "/download",
      cta: t.app_cta,
      external: false,
    },
    {
      icon: <Send size={22} className="text-navy" />,
      title: t.bot_title,
      desc: t.bot_desc,
      href: TELEGRAM_BOT,
      cta: t.bot_cta,
      external: true,
    },
  ];

  const quickLinks = [
    {
      label: t.link_jobs,
      href: "/jobs",
      icon: <Briefcase size={14} />,
      external: false,
    },
    {
      label: t.link_scholarships,
      href: "/scholarships",
      icon: <GraduationCap size={14} />,
      external: false,
    },
    {
      label: t.link_companies,
      href: "/companies",
      icon: <Building2 size={14} />,
      external: false,
    },
    {
      label: t.link_download,
      href: "/download",
      icon: <Download size={14} />,
      external: false,
    },
    {
      label: t.link_contact,
      href: "/contact",
      icon: <Mail size={14} />,
      external: false,
    },
    {
      label: t.link_channel,
      href: TELEGRAM_CHANNEL,
      icon: <Send size={14} />,
      external: true,
    },
    {
      label: t.link_bot,
      href: TELEGRAM_BOT,
      icon: <Send size={14} />,
      external: true,
    },
  ];

  return (
    <div className="min-h-screen bg-cream px-4 sm:px-6 pt-24 pb-16">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-14"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald mb-2">
            {t.tag}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-3">
            {t.title}
          </h1>
          <p className="text-sm text-warm-muted max-w-xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </motion.div>

        {/* How it works */}
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-2xl font-bold text-navy mb-6"
        >
          {t.how_title}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="bg-white border border-warm-gray rounded-2xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center text-white`}
                >
                  {s.icon}
                </span>
                <span className="font-display text-2xl font-bold text-warm-gray">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-display font-bold text-navy text-base mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-charcoal/70 leading-relaxed">
                {s.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Three ways */}
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-2xl font-bold text-navy mb-6"
        >
          {t.ways_title}
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
          {ways.map((w, i) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="flex flex-col bg-white border border-warm-gray rounded-2xl p-6"
            >
              <span className="w-11 h-11 rounded-xl bg-navy/5 flex items-center justify-center mb-4">
                {w.icon}
              </span>
              <h3 className="font-display font-bold text-navy text-base mb-2">
                {w.title}
              </h3>
              <p className="text-sm text-charcoal/70 leading-relaxed mb-5 flex-1">
                {w.desc}
              </p>
              <Link
                href={w.href}
                target={w.external ? "_blank" : undefined}
                rel={w.external ? "noopener noreferrer" : undefined}
                className="inline-flex items-center justify-center gap-2 bg-navy text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-navy/90 transition-all"
              >
                {w.cta}
                {w.external && (
                  <ExternalLink size={13} className="opacity-60" />
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-2xl font-bold text-navy mb-6"
        >
          {t.faq_title}
        </motion.h2>
        <div className="space-y-3 mb-14 max-w-3xl">
          {t.faqs.map((f) => (
            <FaqItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>

        {/* Quick links */}
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-display text-2xl font-bold text-navy mb-6"
        >
          {t.links_title}
        </motion.h2>
        <div className="flex flex-wrap gap-2 mb-14">
          {quickLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              target={l.external ? "_blank" : undefined}
              rel={l.external ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-2 bg-white border border-warm-gray text-sm font-medium text-charcoal px-4 py-2 rounded-xl hover:border-navy hover:text-navy transition-all"
            >
              <span className="text-emerald">{l.icon}</span>
              {l.label}
              {l.external && (
                <ExternalLink size={11} className="text-warm-muted" />
              )}
            </Link>
          ))}
        </div>

        {/* Built by */}
        <div className="text-center border-t border-warm-gray pt-8">
          <p className="inline-flex items-center gap-1.5 text-xs text-warm-muted">
            <Sparkles size={12} className="text-emerald" />
            {t.built_by}{" "}
            <a
              href={PORTFOLIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-navy hover:text-emerald transition-colors"
            >
              Amanullah Yawari
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

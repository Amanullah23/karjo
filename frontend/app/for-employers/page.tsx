"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Building2,
  Users,
  Send,
  ShieldCheck,
  Clock,
  Globe,
  Smartphone,
  Bell,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useLang } from "@/lib/language-context";

const copy = {
  en: {
    tag: "For Employers",
    title: "Hire the right people, across Afghanistan.",
    subtitle:
      "Post your job on KarJo and reach thousands of Afghan job seekers on the web, in the app, and on Telegram — free.",
    cta_primary: "Post a job — free",
    cta_secondary: "See how it works",
    free_badge: "Free while we grow",

    why_title: "Why post on KarJo",
    why1_title: "Reach job seekers everywhere",
    why1_desc:
      "Your listing appears on the website, the Android app, and goes out in the daily Telegram digest at 8 AM Kabul time.",
    why2_title: "Reviewed, not spammed",
    why2_desc:
      "Every posting is reviewed by our team before going live — so job seekers trust what they find here, and your listing sits among real opportunities.",
    why3_title: "Full job details",
    why3_desc:
      "Unlike aggregated listings, jobs posted directly on KarJo show your full description, requirements, and deadline — with a direct apply link or email.",
    why4_title: "Bilingual audience",
    why4_desc:
      "KarJo works in English and دری, so your job reaches candidates in the language they're most comfortable with.",

    how_title: "How it works",
    step1_title: "Create an employer account",
    step1_desc:
      "Sign up with your email and select Employer. Confirm your email and you're in.",
    step2_title: "Post your job",
    step2_desc:
      "Add the title, location, description, deadline, and how candidates should apply — a link or an email address.",
    step3_title: "We review it",
    step3_desc:
      "Our team checks the listing — usually within 24 hours. You'll get an email as soon as it's approved.",
    step4_title: "It goes live",
    step4_desc:
      "Your job appears alongside listings from jobs.af, ACBAR, and LinkedIn — with a KarJo badge, so candidates know it's posted directly by you.",

    reach_title: "Where your job shows up",
    reach_web: "Website",
    reach_web_desc: "Searchable, filterable, and saved by candidates",
    reach_app: "Android app",
    reach_app_desc: "With push notifications to job seekers' phones",
    reach_tg: "Telegram",
    reach_tg_desc: "In the daily digest at 8 AM Kabul time",

    faq_title: "Common questions",
    faq1_q: "Is it really free?",
    faq1_a:
      "Yes. Posting jobs on KarJo is free while we grow our audience. We'll introduce optional paid features later — but you'll always be able to post a standard job for free.",
    faq2_q: "How long does approval take?",
    faq2_a:
      "Usually within 24 hours. You'll receive an email as soon as your job is approved.",
    faq3_q: "Can I edit a job after posting?",
    faq3_a:
      "Yes — edit it any time from your dashboard. Edited jobs go back for a quick review before reappearing.",
    faq4_q: "What happens when the deadline passes?",
    faq4_a:
      "Your job automatically stops showing to job seekers on its deadline. It stays in your dashboard, so you can extend the deadline and repost if you're still hiring.",
    faq5_q: "How do candidates apply?",
    faq5_a:
      "However you choose — candidates are sent to your application link, or they email you directly. KarJo doesn't sit between you and your applicants.",

    final_title: "Ready to hire?",
    final_desc:
      "Create an employer account and post your first job in a few minutes.",
    final_cta: "Get started — free",
    final_login: "Already have an account?",
    final_login_link: "Log in",
  },
  fa: {
    tag: "برای کارفرمایان",
    title: "افراد مناسب را در سراسر افغانستان استخدام کنید.",
    subtitle:
      "وظیفه خود را در کارجو ثبت کنید و به هزاران کارجوی افغان در وب‌سایت، اپلیکیشن و تلگرام دسترسی پیدا کنید — رایگان.",
    cta_primary: "ثبت وظیفه — رایگان",
    cta_secondary: "ببینید چگونه کار می‌کند",
    free_badge: "رایگان در دوره رشد ما",

    why_title: "چرا در کارجو ثبت کنید",
    why1_title: "دسترسی به کارجویان در همه‌جا",
    why1_desc:
      "آگهی شما در وب‌سایت، اپلیکیشن اندروید و در خلاصه روزانه تلگرام ساعت ۸ صبح به وقت کابل نمایش داده می‌شود.",
    why2_title: "بررسی‌شده، نه اسپم",
    why2_desc:
      "هر آگهی قبل از انتشار توسط تیم ما بررسی می‌شود — بنابراین کارجویان به آنچه اینجا می‌یابند اعتماد دارند و آگهی شما در کنار فرصت‌های واقعی قرار می‌گیرد.",
    why3_title: "جزئیات کامل وظیفه",
    why3_desc:
      "برخلاف آگهی‌های جمع‌آوری‌شده، وظایفی که مستقیماً در کارجو ثبت می‌شوند شرح کامل، شرایط و مهلت شما را نمایش می‌دهند — با لینک یا ایمیل مستقیم برای درخواست.",
    why4_title: "مخاطبان دوزبانه",
    why4_desc:
      "کارجو به انگلیسی و دری کار می‌کند، بنابراین وظیفه شما به متقاضیان در زبانی که با آن راحت‌ترند می‌رسد.",

    how_title: "چگونه کار می‌کند",
    step1_title: "حساب کارفرما بسازید",
    step1_desc:
      "با ایمیل خود ثبت‌نام کنید و «کارفرما» را انتخاب کنید. ایمیل خود را تأیید کنید و آماده‌اید.",
    step2_title: "وظیفه خود را ثبت کنید",
    step2_desc:
      "عنوان، موقعیت، شرح، مهلت و روش درخواست متقاضیان — لینک یا آدرس ایمیل — را وارد کنید.",
    step3_title: "ما آن را بررسی می‌کنیم",
    step3_desc:
      "تیم ما آگهی را بررسی می‌کند — معمولاً ظرف ۲۴ ساعت. به محض تأیید، برایتان ایمیل می‌فرستیم.",
    step4_title: "منتشر می‌شود",
    step4_desc:
      "وظیفه شما در کنار آگهی‌های jobs.af، ACBAR و LinkedIn نمایش داده می‌شود — با نشان کارجو، تا متقاضیان بدانند مستقیماً توسط شما ثبت شده است.",

    reach_title: "وظیفه شما کجا نمایش داده می‌شود",
    reach_web: "وب‌سایت",
    reach_web_desc: "قابل جستجو، فیلتر و ذخیره توسط متقاضیان",
    reach_app: "اپلیکیشن اندروید",
    reach_app_desc: "همراه با اعلان روی گوشی کارجویان",
    reach_tg: "تلگرام",
    reach_tg_desc: "در خلاصه روزانه ساعت ۸ صبح به وقت کابل",

    faq_title: "سوالات متداول",
    faq1_q: "واقعاً رایگان است؟",
    faq1_a:
      "بله. ثبت وظیفه در کارجو در دوره رشد مخاطبان ما رایگان است. بعداً امکانات پولی اختیاری اضافه خواهیم کرد — اما همیشه می‌توانید یک آگهی معمولی را رایگان ثبت کنید.",
    faq2_q: "تأیید چقدر طول می‌کشد؟",
    faq2_a: "معمولاً ظرف ۲۴ ساعت. به محض تأیید وظیفه، ایمیلی دریافت می‌کنید.",
    faq3_q: "آیا می‌توانم پس از ثبت، وظیفه را ویرایش کنم؟",
    faq3_a:
      "بله — هر زمان از داشبورد خود ویرایش کنید. وظایف ویرایش‌شده قبل از نمایش مجدد، بررسی کوتاهی می‌شوند.",
    faq4_q: "وقتی مهلت تمام شود چه می‌شود؟",
    faq4_a:
      "وظیفه شما در تاریخ مهلت به صورت خودکار از دید کارجویان خارج می‌شود. در داشبورد شما باقی می‌ماند، پس اگر هنوز در حال استخدام هستید می‌توانید مهلت را تمدید و دوباره منتشر کنید.",
    faq5_q: "متقاضیان چگونه درخواست می‌دهند؟",
    faq5_a:
      "هر طور که شما انتخاب کنید — متقاضیان به لینک درخواست شما هدایت می‌شوند یا مستقیماً به شما ایمیل می‌زنند. کارجو بین شما و متقاضیانتان قرار نمی‌گیرد.",

    final_title: "آماده استخدام هستید؟",
    final_desc:
      "حساب کارفرما بسازید و اولین وظیفه خود را در چند دقیقه ثبت کنید.",
    final_cta: "شروع کنید — رایگان",
    final_login: "قبلاً حساب دارید؟",
    final_login_link: "ورود",
  },
};

export default function ForEmployersPage() {
  const { lang } = useLang();
  const t = copy[lang === "fa" ? "fa" : "en"];

  const whys = [
    {
      icon: <Users size={20} />,
      title: t.why1_title,
      desc: t.why1_desc,
      bg: "bg-blue-600",
    },
    {
      icon: <ShieldCheck size={20} />,
      title: t.why2_title,
      desc: t.why2_desc,
      bg: "bg-emerald",
    },
    {
      icon: <Building2 size={20} />,
      title: t.why3_title,
      desc: t.why3_desc,
      bg: "bg-navy",
    },
    {
      icon: <Globe size={20} />,
      title: t.why4_title,
      desc: t.why4_desc,
      bg: "bg-purple-600",
    },
  ];

  const steps = [
    { title: t.step1_title, desc: t.step1_desc },
    { title: t.step2_title, desc: t.step2_desc },
    { title: t.step3_title, desc: t.step3_desc },
    { title: t.step4_title, desc: t.step4_desc },
  ];

  const reach = [
    {
      icon: <Globe size={22} className="text-navy" />,
      title: t.reach_web,
      desc: t.reach_web_desc,
    },
    {
      icon: <Smartphone size={22} className="text-navy" />,
      title: t.reach_app,
      desc: t.reach_app_desc,
    },
    {
      icon: <Bell size={22} className="text-navy" />,
      title: t.reach_tg,
      desc: t.reach_tg_desc,
    },
  ];

  const faqs = [
    { q: t.faq1_q, a: t.faq1_a },
    { q: t.faq2_q, a: t.faq2_a },
    { q: t.faq3_q, a: t.faq3_a },
    { q: t.faq4_q, a: t.faq4_a },
    { q: t.faq5_q, a: t.faq5_a },
  ];

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="bg-navy px-4 sm:px-6 pt-28 pb-20 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-semibold px-4 py-2 rounded-full mb-6"
          >
            <Sparkles size={12} className="text-emerald" />
            {t.free_badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight mb-4"
          >
            {t.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="text-white/60 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto mb-8"
          >
            {t.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              href="/dashboard/post-job"
              className="group inline-flex items-center justify-center gap-2 bg-emerald text-white text-sm font-bold px-7 py-3.5 rounded-2xl hover:bg-emerald/90 transition-all hover:-translate-y-0.5"
            >
              <Send size={15} />
              {t.cta_primary}
              <ArrowRight
                size={15}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
            <a
              href="#how"
              className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/20 text-white text-sm font-semibold px-7 py-3.5 rounded-2xl hover:bg-white/15 transition-all"
            >
              {t.cta_secondary}
            </a>
          </motion.div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        {/* Why */}
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-8">
          {t.why_title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16">
          {whys.map((w, i) => (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="bg-white border border-warm-gray rounded-2xl p-6"
            >
              <span
                className={`inline-flex w-11 h-11 ${w.bg} rounded-xl items-center justify-center text-white mb-4`}
              >
                {w.icon}
              </span>
              <h3 className="font-display font-bold text-navy text-base mb-2">
                {w.title}
              </h3>
              <p className="text-sm text-charcoal/70 leading-relaxed">
                {w.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* How it works */}
        <h2
          id="how"
          className="font-display text-2xl sm:text-3xl font-bold text-navy mb-8 scroll-mt-24"
        >
          {t.how_title}
        </h2>
        <div className="space-y-3 mb-16">
          {steps.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="flex gap-4 bg-white border border-warm-gray rounded-2xl p-5"
            >
              <span className="shrink-0 w-9 h-9 rounded-xl bg-navy text-white font-display font-bold text-sm flex items-center justify-center">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display font-bold text-navy text-base mb-1">
                  {s.title}
                </h3>
                <p className="text-sm text-charcoal/70 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Reach */}
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-8">
          {t.reach_title}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
          {reach.map((r, i) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="bg-white border border-warm-gray rounded-2xl p-6 text-center"
            >
              <span className="inline-flex w-12 h-12 rounded-xl bg-navy/5 items-center justify-center mb-3">
                {r.icon}
              </span>
              <h3 className="font-display font-bold text-navy text-sm mb-1">
                {r.title}
              </h3>
              <p className="text-xs text-warm-muted leading-relaxed">
                {r.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-8">
          {t.faq_title}
        </h2>
        <div className="space-y-3 mb-16 max-w-3xl">
          {faqs.map((f, i) => (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.3) }}
              className="bg-white border border-warm-gray rounded-2xl p-5"
            >
              <h3 className="flex items-start gap-2 font-display font-bold text-navy text-sm mb-2">
                <CheckCircle2
                  size={15}
                  className="text-emerald shrink-0 mt-0.5"
                />
                {f.q}
              </h3>
              <p className="text-sm text-charcoal/70 leading-relaxed ms-6">
                {f.a}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-warm-gray rounded-3xl p-10 text-center"
        >
          <span className="inline-flex w-14 h-14 rounded-2xl bg-navy items-center justify-center mb-5">
            <Building2 size={26} className="text-emerald" />
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-3">
            {t.final_title}
          </h2>
          <p className="text-sm text-charcoal/60 max-w-md mx-auto mb-7">
            {t.final_desc}
          </p>
          <Link
            href="/signup"
            className="group inline-flex items-center justify-center gap-2 bg-navy text-white text-sm font-bold px-7 py-3.5 rounded-2xl hover:bg-navy/90 transition-all hover:-translate-y-0.5"
          >
            {t.final_cta}
            <ArrowRight
              size={15}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <p className="text-xs text-warm-muted mt-5">
            {t.final_login}{" "}
            <Link
              href="/login"
              className="text-emerald font-semibold hover:underline"
            >
              {t.final_login_link}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

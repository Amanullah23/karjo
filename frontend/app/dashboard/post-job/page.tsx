"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  MapPin,
  Tag,
  Calendar,
  Link2,
  Mail,
  FileText,
  Send,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/language-context";

type ApplyMethod = "link" | "email";

const copy = {
  en: {
    tag: "Employer",
    title: "Post a job",
    subtitle:
      "Submit a job listing. Our team reviews every posting before it goes live.",
    job_title: "Job title",
    job_title_ph: "e.g. Senior Accountant",
    company: "Company name",
    company_ph: "Your organization",
    location: "Location",
    location_ph: "e.g. Kabul, Afghanistan",
    skills: "Skills / categories",
    skills_ph: "e.g. Finance, Accounting, QuickBooks (comma separated)",
    description: "Job description",
    description_ph:
      "Describe the role, responsibilities, requirements, and salary if you wish...",
    expire: "Application deadline",
    apply_method: "How should candidates apply?",
    via_link: "Website link",
    via_email: "Email",
    link_ph: "https://yourcompany.com/careers/...",
    email_ph: "hr@yourcompany.com",
    submit: "Submit for review",
    submitting: "Submitting...",
    success_title: "Job submitted!",
    success_desc:
      "Your job is pending review. It will appear on KarJo once our team approves it — usually within 24 hours.",
    post_another: "Post another job",
    to_dashboard: "Go to dashboard",
    error: "Something went wrong. Please try again.",
    not_employer_title: "Employer account required",
    not_employer_desc:
      "Only employer accounts can post jobs. Your account is registered as a job seeker.",
    back_home: "Back to home",
    login_required: "Please log in to post a job.",
    login: "Log in",
  },
  fa: {
    tag: "کارفرما",
    title: "ثبت وظیفه",
    subtitle:
      "آگهی شغلی خود را ثبت کنید. تیم ما هر آگهی را قبل از انتشار بررسی می‌کند.",
    job_title: "عنوان وظیفه",
    job_title_ph: "مثلاً: حسابدار ارشد",
    company: "نام شرکت",
    company_ph: "نام سازمان شما",
    location: "موقعیت",
    location_ph: "مثلاً: کابل، افغانستان",
    skills: "مهارت‌ها / دسته‌بندی‌ها",
    skills_ph: "مثلاً: مالی، حسابداری، QuickBooks (با کاما جدا کنید)",
    description: "شرح وظیفه",
    description_ph:
      "نقش، مسئولیت‌ها، شرایط و در صورت تمایل معاش را شرح دهید...",
    expire: "مهلت درخواست",
    apply_method: "متقاضیان چگونه درخواست دهند؟",
    via_link: "لینک وب‌سایت",
    via_email: "ایمیل",
    link_ph: "https://yourcompany.com/careers/...",
    email_ph: "hr@yourcompany.com",
    submit: "ارسال برای بررسی",
    submitting: "در حال ارسال...",
    success_title: "وظیفه ثبت شد!",
    success_desc:
      "وظیفه شما در انتظار بررسی است. پس از تأیید تیم ما — معمولاً ظرف ۲۴ ساعت — در کارجو نمایش داده می‌شود.",
    post_another: "ثبت وظیفه دیگر",
    to_dashboard: "رفتن به داشبورد",
    error: "مشکلی پیش آمد. لطفاً دوباره تلاش کنید.",
    not_employer_title: "حساب کارفرما لازم است",
    not_employer_desc:
      "فقط حساب‌های کارفرما می‌توانند وظیفه ثبت کنند. حساب شما به عنوان کارجو ثبت شده است.",
    back_home: "بازگشت به صفحه اصلی",
    login_required: "برای ثبت وظیفه لطفاً وارد شوید.",
    login: "ورود",
  },
};

export default function PostJobPage() {
  const { user, profile, loading } = useAuth();
  const { lang } = useLang();
  const router = useRouter();
  const t = copy[lang === "fa" ? "fa" : "en"];

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [description, setDescription] = useState("");
  const [expireDate, setExpireDate] = useState("");
  const [applyMethod, setApplyMethod] = useState<ApplyMethod>("link");
  const [applyValue, setApplyValue] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  // Prefill company from employer profile once loaded
  if (
    profile?.company_name &&
    company === "" &&
    status === "idle" &&
    title === ""
  ) {
    // no-op guard: prefill handled via defaultValue below instead
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setStatus("sending");

    const url =
      applyMethod === "email"
        ? `mailto:${applyValue.trim()}`
        : applyValue.trim();

    const { error } = await supabase.from("jobs").insert({
      title: title.trim(),
      company: company.trim(),
      skills: skills.trim(),
      location: location.trim() || null,
      description: description.trim() || null,
      expire_date: expireDate || null,
      url,
      source: "KarJo",
      date: new Date().toISOString().split("T")[0],
      posted_by: user.id,
      status: "pending",
    });

    if (error) {
      console.error("[PostJob] insert error:", error);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  function resetForm() {
    setTitle("");
    setLocation("");
    setSkills("");
    setDescription("");
    setExpireDate("");
    setApplyValue("");
    setStatus("idle");
  }

  // ── Guards ──
  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center pt-16">
        <p className="text-sm text-warm-muted">...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 pt-16 text-center">
        <p className="text-sm text-warm-muted mb-5">{t.login_required}</p>
        <Link
          href="/login"
          className="bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-navy/90 transition-all"
        >
          {t.login}
        </Link>
      </div>
    );
  }

  if (profile && profile.role !== "employer") {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 pt-16 text-center">
        <h1 className="font-display text-2xl font-bold text-navy mb-2">
          {t.not_employer_title}
        </h1>
        <p className="text-sm text-warm-muted mb-6 max-w-sm">
          {t.not_employer_desc}
        </p>
        <Link
          href="/"
          className="bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-navy/90 transition-all"
        >
          {t.back_home}
        </Link>
      </div>
    );
  }

  // ── Success state ──
  if (status === "sent") {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 pt-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white border border-warm-gray rounded-2xl p-10 max-w-md"
        >
          <span className="inline-flex w-14 h-14 rounded-full bg-emerald/10 items-center justify-center mb-4">
            <Clock size={26} className="text-emerald" />
          </span>
          <h1 className="font-display text-2xl font-bold text-navy mb-2">
            {t.success_title}
          </h1>
          <p className="text-sm text-charcoal/70 leading-relaxed mb-6">
            {t.success_desc}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={resetForm}
              className="text-sm font-semibold text-navy border border-warm-gray px-5 py-2.5 rounded-xl hover:border-navy transition-all"
            >
              {t.post_another}
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-navy/90 transition-all"
            >
              {t.to_dashboard}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Form ──
  const inputCls =
    "w-full px-4 py-2.5 text-sm bg-white border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal placeholder:text-warm-muted";

  return (
    <div className="min-h-screen bg-cream px-4 sm:px-6 pt-24 pb-16">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald mb-2">
            {t.tag}
          </p>
          <h1 className="font-display text-3xl font-bold text-navy mb-2">
            {t.title}
          </h1>
          <p className="text-sm text-warm-muted">{t.subtitle}</p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white border border-warm-gray rounded-2xl p-6 sm:p-8 space-y-5"
        >
          <Field icon={<Briefcase size={14} />} label={t.job_title}>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.job_title_ph}
              className={inputCls}
            />
          </Field>

          <Field icon={<Building2 size={14} />} label={t.company}>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder={profile?.company_name || t.company_ph}
              className={inputCls}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field icon={<MapPin size={14} />} label={t.location}>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t.location_ph}
                className={inputCls}
              />
            </Field>
            <Field icon={<Calendar size={14} />} label={t.expire}>
              <input
                type="date"
                required
                value={expireDate}
                onChange={(e) => setExpireDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className={inputCls}
              />
            </Field>
          </div>

          <Field icon={<Tag size={14} />} label={t.skills}>
            <input
              type="text"
              required
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder={t.skills_ph}
              className={inputCls}
            />
          </Field>

          <Field icon={<FileText size={14} />} label={t.description}>
            <textarea
              required
              rows={7}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.description_ph}
              className={`${inputCls} resize-none`}
            />
          </Field>

          {/* Apply method */}
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold text-navy mb-2">
              <Send size={14} className="text-emerald" />
              {t.apply_method}
            </p>
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setApplyMethod("link")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  applyMethod === "link"
                    ? "bg-navy text-white border-navy"
                    : "text-charcoal border-warm-gray hover:border-navy"
                }`}
              >
                <Link2 size={14} /> {t.via_link}
              </button>
              <button
                type="button"
                onClick={() => setApplyMethod("email")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                  applyMethod === "email"
                    ? "bg-navy text-white border-navy"
                    : "text-charcoal border-warm-gray hover:border-navy"
                }`}
              >
                <Mail size={14} /> {t.via_email}
              </button>
            </div>
            <input
              type={applyMethod === "email" ? "email" : "url"}
              required
              value={applyValue}
              onChange={(e) => setApplyValue(e.target.value)}
              placeholder={applyMethod === "email" ? t.email_ph : t.link_ph}
              className={inputCls}
              dir="ltr"
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-600">{t.error}</p>
          )}

          <button
            type="submit"
            disabled={status === "sending"}
            className="w-full flex items-center justify-center gap-2 bg-navy text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-navy/90 transition-all disabled:opacity-60"
          >
            <CheckCircle2 size={15} />
            {status === "sending" ? t.submitting : t.submit}
          </button>
        </motion.form>
      </div>
    </div>
  );
}

function Field({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-1.5 text-xs font-semibold text-navy mb-2">
        <span className="text-emerald">{icon}</span>
        {label}
      </label>
      {children}
    </div>
  );
}

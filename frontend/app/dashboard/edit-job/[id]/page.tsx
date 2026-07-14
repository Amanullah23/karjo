"use client";

import { use, useEffect, useState } from "react";
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
  AlertTriangle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/language-context";
import { Job } from "@/types";

type ApplyMethod = "link" | "email";

const copy = {
  en: {
    tag: "Employer",
    title: "Edit job",
    subtitle:
      "Update your job posting. Edited jobs are reviewed again before going live.",
    review_warning:
      "Note: saving changes will send this job back for review. It will be temporarily hidden from job seekers until approved again.",
    job_title: "Job title",
    company: "Company name",
    location: "Location",
    skills: "Skills / categories",
    description: "Job description",
    expire: "Application deadline",
    apply_method: "How should candidates apply?",
    via_link: "Website link",
    via_email: "Email",
    link_ph: "https://yourcompany.com/careers/...",
    email_ph: "hr@yourcompany.com",
    submit: "Save changes",
    submitting: "Saving...",
    success_title: "Changes submitted!",
    success_desc:
      "Your updated job is pending review. It will reappear on KarJo once our team approves it.",
    to_dashboard: "Back to dashboard",
    error: "Something went wrong. Please try again.",
    loading: "Loading job...",
    not_found: "Job not found",
    not_found_desc: "This job doesn't exist or doesn't belong to your account.",
    not_employer_title: "Employer account required",
    not_employer_desc: "Only employer accounts can edit jobs.",
    back_home: "Back to home",
    login_required: "Please log in to edit a job.",
    login: "Log in",
  },
  fa: {
    tag: "کارفرما",
    title: "ویرایش وظیفه",
    subtitle:
      "آگهی شغلی خود را ویرایش کنید. آگهی‌های ویرایش‌شده قبل از انتشار دوباره بررسی می‌شوند.",
    review_warning:
      "توجه: با ذخیره تغییرات، این آگهی دوباره به بررسی فرستاده می‌شود و تا تأیید مجدد، به صورت موقت از دید کارجویان پنهان می‌ماند.",
    job_title: "عنوان وظیفه",
    company: "نام شرکت",
    location: "موقعیت",
    skills: "مهارت‌ها / دسته‌بندی‌ها",
    description: "شرح وظیفه",
    expire: "مهلت درخواست",
    apply_method: "متقاضیان چگونه درخواست دهند؟",
    via_link: "لینک وب‌سایت",
    via_email: "ایمیل",
    link_ph: "https://yourcompany.com/careers/...",
    email_ph: "hr@yourcompany.com",
    submit: "ذخیره تغییرات",
    submitting: "در حال ذخیره...",
    success_title: "تغییرات ثبت شد!",
    success_desc:
      "آگهی ویرایش‌شده شما در انتظار بررسی است. پس از تأیید تیم ما دوباره در کارجو نمایش داده می‌شود.",
    to_dashboard: "بازگشت به داشبورد",
    error: "مشکلی پیش آمد. لطفاً دوباره تلاش کنید.",
    loading: "در حال بارگذاری...",
    not_found: "وظیفه یافت نشد",
    not_found_desc: "این وظیفه وجود ندارد یا متعلق به حساب شما نیست.",
    not_employer_title: "حساب کارفرما لازم است",
    not_employer_desc: "فقط حساب‌های کارفرما می‌توانند وظیفه ویرایش کنند.",
    back_home: "بازگشت به صفحه اصلی",
    login_required: "برای ویرایش وظیفه لطفاً وارد شوید.",
    login: "ورود",
  },
};

export default function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { user, profile, loading: authLoading } = useAuth();
  const { lang } = useLang();
  const router = useRouter();
  const t = copy[lang === "fa" ? "fa" : "en"];

  const [jobLoading, setJobLoading] = useState(true);
  const [found, setFound] = useState(false);

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

  useEffect(() => {
    async function fetchJob() {
      if (!user) return;
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .eq("posted_by", user.id)
        .single();

      if (error || !data) {
        console.error("[EditJob] fetch error:", error);
        setFound(false);
        setJobLoading(false);
        return;
      }

      const job = data as Job;
      setTitle(job.title ?? "");
      setCompany(job.company ?? "");
      setLocation(job.location ?? "");
      setSkills(job.skills ?? "");
      setDescription(job.description ?? "");
      setExpireDate(job.expire_date ?? "");
      if (job.url?.startsWith("mailto:")) {
        setApplyMethod("email");
        setApplyValue(job.url.replace("mailto:", ""));
      } else {
        setApplyMethod("link");
        setApplyValue(job.url ?? "");
      }
      setFound(true);
      setJobLoading(false);
    }
    if (user) fetchJob();
  }, [id, user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setStatus("sending");

    const url =
      applyMethod === "email"
        ? `mailto:${applyValue.trim()}`
        : applyValue.trim();

    const { error } = await supabase
      .from("jobs")
      .update({
        title: title.trim(),
        company: company.trim(),
        skills: skills.trim(),
        location: location.trim() || null,
        description: description.trim() || null,
        expire_date: expireDate || null,
        url,
        status: "pending",
      })
      .eq("id", id);

    if (error) {
      console.error("[EditJob] update error:", error);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  // ── Guards ──
  if (authLoading || (user && jobLoading)) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center pt-16">
        <p className="text-sm text-warm-muted">{t.loading}</p>
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
        <p className="text-sm text-warm-muted mb-6">{t.not_employer_desc}</p>
        <Link
          href="/"
          className="bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-navy/90 transition-all"
        >
          {t.back_home}
        </Link>
      </div>
    );
  }

  if (!found) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 pt-16 text-center">
        <h1 className="font-display text-2xl font-bold text-navy mb-2">
          {t.not_found}
        </h1>
        <p className="text-sm text-warm-muted mb-6">{t.not_found_desc}</p>
        <Link
          href="/dashboard"
          className="bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-navy/90 transition-all"
        >
          {t.to_dashboard}
        </Link>
      </div>
    );
  }

  // ── Success ──
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
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-navy/90 transition-all"
          >
            {t.to_dashboard}
          </button>
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
          className="mb-6"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald mb-2">
            {t.tag}
          </p>
          <h1 className="font-display text-3xl font-bold text-navy mb-2">
            {t.title}
          </h1>
          <p className="text-sm text-warm-muted">{t.subtitle}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex items-start gap-2.5 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6"
        >
          <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            {t.review_warning}
          </p>
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
              className={inputCls}
            />
          </Field>

          <Field icon={<Building2 size={14} />} label={t.company}>
            <input
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
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
                className={inputCls}
              />
            </Field>
            <Field icon={<Calendar size={14} />} label={t.expire}>
              <input
                type="date"
                required
                value={expireDate}
                onChange={(e) => setExpireDate(e.target.value)}
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
              className={inputCls}
            />
          </Field>

          <Field icon={<FileText size={14} />} label={t.description}>
            <textarea
              required
              rows={7}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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

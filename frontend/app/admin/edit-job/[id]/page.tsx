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
  CheckCircle2,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/language-context";
import { Job } from "@/types";

type ApplyMethod = "link" | "email";

const copy = {
  en: {
    tag: "Admin",
    title: "Edit job (admin)",
    subtitle:
      "Edit any employer job. Unlike employer edits, your changes keep the status you choose below.",
    job_title: "Job title",
    company: "Company name",
    location: "Location",
    skills: "Skills / categories",
    description: "Job description",
    expire: "Application deadline",
    apply_method: "How should candidates apply?",
    via_link: "Website link",
    via_email: "Email",
    status_label: "Status",
    status_pending: "Pending review",
    status_approved: "Approved (live)",
    submit: "Save changes",
    submitting: "Saving...",
    error: "Something went wrong. Please try again.",
    loading: "Loading job...",
    not_found: "Job not found",
    back_admin: "Back to admin panel",
    not_admin_title: "Admins only",
    not_admin_desc: "This page is restricted to KarJo administrators.",
    back_home: "Back to home",
    login_required: "Please log in.",
    login: "Log in",
  },
  fa: {
    tag: "مدیر",
    title: "ویرایش وظیفه (مدیر)",
    subtitle:
      "هر وظیفه کارفرما را ویرایش کنید. برخلاف ویرایش کارفرما، تغییرات شما وضعیتی را که در پایین انتخاب می‌کنید حفظ می‌کند.",
    job_title: "عنوان وظیفه",
    company: "نام شرکت",
    location: "موقعیت",
    skills: "مهارت‌ها / دسته‌بندی‌ها",
    description: "شرح وظیفه",
    expire: "مهلت درخواست",
    apply_method: "متقاضیان چگونه درخواست دهند؟",
    via_link: "لینک وب‌سایت",
    via_email: "ایمیل",
    status_label: "وضعیت",
    status_pending: "در انتظار بررسی",
    status_approved: "تأیید شده (فعال)",
    submit: "ذخیره تغییرات",
    submitting: "در حال ذخیره...",
    error: "مشکلی پیش آمد. لطفاً دوباره تلاش کنید.",
    loading: "در حال بارگذاری...",
    not_found: "وظیفه یافت نشد",
    back_admin: "بازگشت به پنل مدیریت",
    not_admin_title: "فقط مدیران",
    not_admin_desc: "این صفحه مخصوص مدیران کارجو است.",
    back_home: "بازگشت به صفحه اصلی",
    login_required: "لطفاً وارد شوید.",
    login: "ورود",
  },
};

export default function AdminEditJobPage({
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
  const [jobStatus, setJobStatus] = useState<"pending" | "approved">("pending");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  useEffect(() => {
    async function fetchJob() {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        console.error("[AdminEditJob] fetch error:", error);
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
      setJobStatus(job.status === "approved" ? "approved" : "pending");
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
    if (user && profile?.role === "admin") fetchJob();
  }, [id, user, profile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
        status: jobStatus,
      })
      .eq("id", id);

    if (error) {
      console.error("[AdminEditJob] update error:", error);
      setStatus("error");
    } else {
      router.push("/admin");
    }
  }

  // ── Guards ──
  if (authLoading || (user && profile?.role === "admin" && jobLoading)) {
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

  if (profile && profile.role !== "admin") {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 pt-16 text-center">
        <h1 className="font-display text-2xl font-bold text-navy mb-2">
          {t.not_admin_title}
        </h1>
        <p className="text-sm text-warm-muted mb-6">{t.not_admin_desc}</p>
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
        <Link
          href="/admin"
          className="bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-navy/90 transition-all"
        >
          {t.back_admin}
        </Link>
      </div>
    );
  }

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
          <p className="flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-emerald mb-2">
            <ShieldCheck size={13} />
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
              className={inputCls}
              dir="ltr"
            />
          </div>

          {/* Status selector — admin superpower */}
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold text-navy mb-2">
              <Clock size={14} className="text-emerald" />
              {t.status_label}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setJobStatus("pending")}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  jobStatus === "pending"
                    ? "bg-amber-50 text-amber-700 border-amber-400"
                    : "text-charcoal border-warm-gray hover:border-amber-400"
                }`}
              >
                {t.status_pending}
              </button>
              <button
                type="button"
                onClick={() => setJobStatus("approved")}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border transition-all ${
                  jobStatus === "approved"
                    ? "bg-emerald/10 text-emerald border-emerald"
                    : "text-charcoal border-warm-gray hover:border-emerald"
                }`}
              >
                {t.status_approved}
              </button>
            </div>
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

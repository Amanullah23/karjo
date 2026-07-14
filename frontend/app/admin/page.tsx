"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  MapPin,
  Calendar,
  Building2,
  Mail,
  User,
  Tag,
  Link2,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/language-context";
import { Job } from "@/types";

interface PosterInfo {
  full_name: string | null;
  email: string | null;
  company_name: string | null;
}

const copy = {
  en: {
    tag: "Admin",
    title: "Job approvals",
    subtitle: "Review employer-submitted jobs before they go live.",
    refresh: "Refresh",
    pending_count: "pending",
    posted_by: "Posted by",
    company: "Company",
    location: "Location",
    posted: "Posted",
    expires: "Expires",
    skills: "Skills",
    apply_via: "Apply via",
    description: "Description",
    approve: "Approve",
    reject: "Reject",
    reject_confirm:
      "Reject and permanently delete this job posting? The employer will not be notified automatically.",
    approved_msg: "Approved — now live on KarJo.",
    loading: "Loading pending jobs...",
    empty_title: "All clear!",
    empty_desc: "No jobs waiting for review right now.",
    not_admin_title: "Admins only",
    not_admin_desc: "This page is restricted to KarJo administrators.",
    back_home: "Back to home",
    login_required: "Please log in.",
    login: "Log in",
  },
  fa: {
    tag: "مدیر",
    title: "تأیید وظایف",
    subtitle: "وظایف ثبت‌شده توسط کارفرمایان را قبل از انتشار بررسی کنید.",
    refresh: "بروزرسانی",
    pending_count: "در انتظار",
    posted_by: "ثبت‌شده توسط",
    company: "شرکت",
    location: "موقعیت",
    posted: "تاریخ ثبت",
    expires: "مهلت",
    skills: "مهارت‌ها",
    apply_via: "روش درخواست",
    description: "شرح وظیفه",
    approve: "تأیید",
    reject: "رد",
    reject_confirm:
      "این آگهی رد و برای همیشه حذف شود؟ به کارفرما به صورت خودکار اطلاع داده نمی‌شود.",
    approved_msg: "تأیید شد — اکنون در کارجو فعال است.",
    loading: "در حال بارگذاری وظایف در انتظار...",
    empty_title: "همه چیز مرتب است!",
    empty_desc: "در حال حاضر وظیفه‌ای در انتظار بررسی نیست.",
    not_admin_title: "فقط مدیران",
    not_admin_desc: "این صفحه مخصوص مدیران کارجو است.",
    back_home: "بازگشت به صفحه اصلی",
    login_required: "لطفاً وارد شوید.",
    login: "ورود",
  },
};

export default function AdminPage() {
  const { user, profile, loading: authLoading } = useAuth();
  const { lang } = useLang();
  const t = copy[lang === "fa" ? "fa" : "en"];

  const [jobs, setJobs] = useState<Job[]>([]);
  const [posters, setPosters] = useState<Record<string, PosterInfo>>({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    const { data: jobRows, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[Admin] jobs fetch error:", error);
      setLoading(false);
      return;
    }

    const jobList = jobRows ?? [];
    setJobs(jobList);

    // Fetch poster profiles for the posted_by ids
    const ids = Array.from(
      new Set(jobList.map((j) => j.posted_by).filter(Boolean)),
    ) as string[];

    if (ids.length > 0) {
      const { data: profileRows, error: pErr } = await supabase
        .from("profiles")
        .select("id, full_name, email, company_name")
        .in("id", ids);
      if (pErr) console.error("[Admin] profiles fetch error:", pErr);
      const map: Record<string, PosterInfo> = {};
      (profileRows ?? []).forEach((p) => {
        map[p.id] = {
          full_name: p.full_name,
          email: p.email,
          company_name: p.company_name,
        };
      });
      setPosters(map);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (profile?.role === "admin") fetchPending();
  }, [profile, fetchPending]);
  function notifyEmployer(job: Job, action: "approved" | "rejected") {
    const poster = job.posted_by ? posters[job.posted_by] : null;
    if (!poster?.email) return;
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return;
      fetch("/api/notify-employer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          to: poster.email,
          name: poster.full_name,
          jobTitle: job.title,
          action,
        }),
      }).catch((e) => console.error("[Admin] notify error:", e));
    });
  }

  async function handleApprove(id: string) {
    setBusyId(id);
    const { error } = await supabase
      .from("jobs")
      .update({ status: "approved" })
      .eq("id", id);
    if (error) {
      console.error("[Admin] approve error:", error);
    } else {
      const job = jobs.find((j) => j.id === id);
      if (job) notifyEmployer(job, "approved");
      setJobs((prev) => prev.filter((j) => j.id !== id));
    }
    setBusyId(null);
  }

  async function handleReject(id: string) {
    if (!confirm(t.reject_confirm)) return;
    setBusyId(id);
    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (error) {
      console.error("[Admin] reject error:", error);
    } else {
      const job = jobs.find((j) => j.id === id);
      if (job) notifyEmployer(job, "rejected");
      setJobs((prev) => prev.filter((j) => j.id !== id));
    }
    setBusyId(null);
  }

  // ── Guards ──
  if (authLoading) {
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

  // ── Page ──
  return (
    <div className="min-h-screen bg-cream pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase text-emerald mb-1">
              <ShieldCheck size={13} />
              {t.tag}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy">
              {t.title}
            </h1>
            <p className="text-sm text-warm-muted mt-1">{t.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full">
              <Clock size={13} />
              {jobs.length} {t.pending_count}
            </span>
            <button
              onClick={fetchPending}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy border border-warm-gray px-3 py-2 rounded-xl hover:border-navy transition-all"
            >
              <RefreshCw size={13} />
              {t.refresh}
            </button>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <p className="text-sm text-warm-muted">{t.loading}</p>
        ) : jobs.length === 0 ? (
          <div className="bg-white border border-warm-gray rounded-2xl p-10 text-center">
            <span className="inline-flex w-14 h-14 rounded-full bg-emerald/10 items-center justify-center mb-4">
              <CheckCircle2 size={24} className="text-emerald" />
            </span>
            <h2 className="font-display text-xl font-bold text-navy mb-2">
              {t.empty_title}
            </h2>
            <p className="text-sm text-warm-muted">{t.empty_desc}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job, i) => {
              const poster = job.posted_by ? posters[job.posted_by] : null;
              const busy = busyId === job.id;
              return (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: Math.min(i * 0.05, 0.3),
                  }}
                  className="bg-white border border-warm-gray rounded-2xl p-6"
                >
                  {/* Title + poster */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div>
                      <h3 className="font-display font-bold text-navy text-lg mb-1">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-warm-muted">
                        <span className="flex items-center gap-1">
                          <Building2 size={12} />
                          {t.company}: {job.company}
                        </span>
                        {job.location && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {job.location}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {t.posted}: {job.date}
                        </span>
                        {job.expire_date && (
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {t.expires}: {job.expire_date}
                          </span>
                        )}
                      </div>
                    </div>
                    {poster && (
                      <div className="bg-cream border border-warm-gray rounded-xl px-4 py-2.5 shrink-0">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-warm-muted mb-1">
                          {t.posted_by}
                        </p>
                        <p className="flex items-center gap-1.5 text-xs font-semibold text-navy">
                          <User size={12} />
                          {poster.full_name || "—"}
                        </p>
                        <p className="flex items-center gap-1.5 text-xs text-warm-muted mt-0.5">
                          <Mail size={12} />
                          {poster.email || "—"}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Skills + apply */}
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    {job.skills && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-charcoal bg-cream border border-warm-gray px-3 py-1 rounded-full">
                        <Tag size={11} className="text-emerald" />
                        {job.skills}
                      </span>
                    )}
                    {job.url && (
                      <a
                        href={job.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-navy bg-cream border border-warm-gray px-3 py-1 rounded-full hover:border-navy transition-all"
                        dir="ltr"
                      >
                        <Link2 size={11} className="text-emerald" />
                        {job.url}
                      </a>
                    )}
                  </div>

                  {/* Description */}
                  {job.description && (
                    <div className="mb-5">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-warm-muted mb-1.5">
                        {t.description}
                      </p>
                      <p className="text-sm text-charcoal/70 leading-relaxed whitespace-pre-line bg-cream border border-warm-gray rounded-xl p-4 max-h-56 overflow-y-auto">
                        {job.description}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(job.id)}
                      disabled={busy}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-emerald text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-emerald/90 transition-all disabled:opacity-60"
                    >
                      <CheckCircle2 size={15} />
                      {t.approve}
                    </button>
                    <button
                      onClick={() => handleReject(job.id)}
                      disabled={busy}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 text-red-600 border border-red-200 text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-red-50 transition-all disabled:opacity-60"
                    >
                      <XCircle size={15} />
                      {t.reject}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

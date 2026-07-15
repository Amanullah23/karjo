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
  Pencil,
  Trash2,
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

type AdminView = "pending" | "all";

const copy = {
  en: {
    tag: "Admin",
    title: "Job approvals",
    subtitle: "Review, edit, and manage employer-submitted jobs.",
    tab_pending: "Pending review",
    tab_all: "All employer jobs",
    refresh: "Refresh",
    pending_count: "pending",
    posted_by: "Posted by",
    company: "Company",
    posted: "Posted",
    expires: "Expires",
    description: "Description",
    approve: "Approve",
    reject: "Reject",
    edit: "Edit",
    delete: "Delete",
    reject_confirm:
      "Reject and permanently delete this job posting? The employer will not be notified automatically.",
    delete_confirm: "Permanently delete this job posting?",
    status_pending: "Pending",
    status_approved: "Live",
    status_expired: "Expired",
    loading: "Loading jobs...",
    empty_pending_title: "All clear!",
    empty_pending_desc: "No jobs waiting for review right now.",
    empty_all_title: "No employer jobs yet",
    empty_all_desc: "Jobs posted by employers will appear here.",
    not_admin_title: "Admins only",
    not_admin_desc: "This page is restricted to KarJo administrators.",
    back_home: "Back to home",
    login_required: "Please log in.",
    login: "Log in",
  },
  fa: {
    tag: "مدیر",
    title: "تأیید وظایف",
    subtitle: "وظایف ثبت‌شده توسط کارفرمایان را بررسی، ویرایش و مدیریت کنید.",
    tab_pending: "در انتظار بررسی",
    tab_all: "همه وظایف کارفرمایان",
    refresh: "بروزرسانی",
    pending_count: "در انتظار",
    posted_by: "ثبت‌شده توسط",
    company: "شرکت",
    posted: "تاریخ ثبت",
    expires: "مهلت",
    description: "شرح وظیفه",
    approve: "تأیید",
    reject: "رد",
    edit: "ویرایش",
    delete: "حذف",
    reject_confirm:
      "این آگهی رد و برای همیشه حذف شود؟ به کارفرما به صورت خودکار اطلاع داده نمی‌شود.",
    delete_confirm: "این آگهی برای همیشه حذف شود؟",
    status_pending: "در انتظار",
    status_approved: "فعال",
    status_expired: "منقضی",
    loading: "در حال بارگذاری...",
    empty_pending_title: "همه چیز مرتب است!",
    empty_pending_desc: "در حال حاضر وظیفه‌ای در انتظار بررسی نیست.",
    empty_all_title: "هنوز وظیفه‌ای از کارفرمایان نیست",
    empty_all_desc: "وظایف ثبت‌شده توسط کارفرمایان اینجا نمایش داده می‌شود.",
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

  const [view, setView] = useState<AdminView>("pending");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [posters, setPosters] = useState<Record<string, PosterInfo>>({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    let query = supabase.from("jobs").select("*");
    query =
      view === "pending"
        ? query.eq("status", "pending")
        : query.not("posted_by", "is", null);

    const { data: jobRows, error } = await query.order("created_at", {
      ascending: view === "pending",
    });

    if (error) {
      console.error("[Admin] jobs fetch error:", error);
      setLoading(false);
      return;
    }

    const jobList = jobRows ?? [];
    setJobs(jobList);

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
  }, [view]);

  useEffect(() => {
    if (profile?.role === "admin") fetchJobs();
  }, [profile, fetchJobs]);

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
      if (view === "pending") {
        setJobs((prev) => prev.filter((j) => j.id !== id));
      } else {
        setJobs((prev) =>
          prev.map((j) => (j.id === id ? { ...j, status: "approved" } : j)),
        );
      }
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

  async function handleDelete(id: string) {
    if (!confirm(t.delete_confirm)) return;
    setBusyId(id);
    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (error) {
      console.error("[Admin] delete error:", error);
    } else {
      setJobs((prev) => prev.filter((j) => j.id !== id));
    }
    setBusyId(null);
  }

  function statusBadge(job: Job) {
    const today = new Date().toISOString().split("T")[0];
    const isExpired =
      job.status === "approved" && !!job.expire_date && job.expire_date < today;
    const cls = isExpired
      ? "bg-gray-100 text-gray-500 border-gray-200"
      : job.status === "approved"
        ? "bg-emerald/10 text-emerald border-emerald/30"
        : "bg-amber-50 text-amber-700 border-amber-200";
    const label = isExpired
      ? t.status_expired
      : job.status === "approved"
        ? t.status_approved
        : t.status_pending;
    return (
      <span
        className={`text-[11px] font-semibold border px-2 py-0.5 rounded-full ${cls}`}
      >
        {label}
      </span>
    );
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

  const pendingCount =
    view === "pending"
      ? jobs.length
      : jobs.filter((j) => j.status === "pending").length;

  // ── Page ──
  return (
    <div className="min-h-screen bg-cream pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
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
              {pendingCount} {t.pending_count}
            </span>
            <button
              onClick={fetchJobs}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy border border-warm-gray px-3 py-2 rounded-xl hover:border-navy transition-all"
            >
              <RefreshCw size={13} />
              {t.refresh}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-5 border-b border-warm-gray mb-6">
          {(["pending", "all"] as AdminView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`pb-2.5 text-sm font-semibold border-b-2 transition-all ${
                view === v
                  ? "text-navy border-emerald"
                  : "text-warm-muted border-transparent hover:text-navy"
              }`}
            >
              {v === "pending" ? t.tab_pending : t.tab_all}
            </button>
          ))}
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
              {view === "pending" ? t.empty_pending_title : t.empty_all_title}
            </h2>
            <p className="text-sm text-warm-muted">
              {view === "pending" ? t.empty_pending_desc : t.empty_all_desc}
            </p>
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
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-display font-bold text-navy text-lg">
                          {job.title}
                        </h3>
                        {statusBadge(job)}
                      </div>
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
                  <div className="flex flex-wrap gap-3">
                    {job.status === "pending" && (
                      <button
                        onClick={() => handleApprove(job.id)}
                        disabled={busy}
                        className="inline-flex items-center justify-center gap-2 bg-emerald text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-emerald/90 transition-all disabled:opacity-60"
                      >
                        <CheckCircle2 size={15} />
                        {t.approve}
                      </button>
                    )}
                    <Link
                      href={`/admin/edit-job/${job.id}`}
                      className="inline-flex items-center justify-center gap-2 text-navy border border-warm-gray text-sm font-semibold px-5 py-2.5 rounded-xl hover:border-navy transition-all"
                    >
                      <Pencil size={14} />
                      {t.edit}
                    </Link>
                    {job.status === "pending" ? (
                      <button
                        onClick={() => handleReject(job.id)}
                        disabled={busy}
                        className="inline-flex items-center justify-center gap-2 text-red-600 border border-red-200 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-red-50 transition-all disabled:opacity-60"
                      >
                        <XCircle size={15} />
                        {t.reject}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleDelete(job.id)}
                        disabled={busy}
                        className="inline-flex items-center justify-center gap-2 text-red-600 border border-red-200 text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-red-50 transition-all disabled:opacity-60"
                      >
                        <Trash2 size={15} />
                        {t.delete}
                      </button>
                    )}
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

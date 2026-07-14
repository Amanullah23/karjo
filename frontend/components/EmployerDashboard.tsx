"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Briefcase,
  Clock,
  CheckCircle2,
  Plus,
  MapPin,
  Calendar,
  Trash2,
  ExternalLink,
  Building2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useLang } from "@/lib/language-context";
import { Job } from "@/types";

const copy = {
  en: {
    tag: "Employer",
    title: "Your job postings",
    post_job: "Post a job",
    stat_total: "Total posted",
    stat_pending: "Pending review",
    stat_approved: "Live on KarJo",
    posted: "Posted",
    expires: "Expires",
    status_pending: "Pending review",
    status_approved: "Live",
    view: "View",
    delete_confirm: "Delete this job posting?",
    loading: "Loading your jobs...",
    empty_title: "No job postings yet",
    empty_desc:
      "Post your first job — it will be reviewed by our team and then shown to thousands of job seekers.",
    empty_cta: "Post your first job",
  },
  fa: {
    tag: "کارفرما",
    title: "آگهی‌های شغلی شما",
    post_job: "ثبت وظیفه",
    stat_total: "کل آگهی‌ها",
    stat_pending: "در انتظار بررسی",
    stat_approved: "فعال در کارجو",
    posted: "تاریخ ثبت",
    expires: "مهلت",
    status_pending: "در انتظار بررسی",
    status_approved: "فعال",
    view: "مشاهده",
    delete_confirm: "این آگهی حذف شود؟",
    loading: "در حال بارگذاری آگهی‌های شما...",
    empty_title: "هنوز آگهی‌ای ثبت نکرده‌اید",
    empty_desc:
      "اولین وظیفه خود را ثبت کنید — پس از بررسی تیم ما، به هزاران کارجو نمایش داده می‌شود.",
    empty_cta: "ثبت اولین وظیفه",
  },
};

export default function EmployerDashboard() {
  const { user, profile } = useAuth();
  const { lang } = useLang();
  const t = copy[lang === "fa" ? "fa" : "en"];

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchJobs = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .eq("posted_by", user.id)
      .order("created_at", { ascending: false });
    if (error) console.error("[EmployerDashboard] fetch error:", error);
    setJobs(data ?? []);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  async function handleDelete(id: string) {
    if (!confirm(t.delete_confirm)) return;
    setJobs((prev) => prev.filter((j) => j.id !== id));
    const { error } = await supabase.from("jobs").delete().eq("id", id);
    if (error) {
      console.error("[EmployerDashboard] delete error:", error);
      fetchJobs();
    }
  }

  const pendingCount = jobs.filter((j) => j.status === "pending").length;
  const approvedCount = jobs.filter((j) => j.status === "approved").length;

  const stats = [
    {
      icon: <Briefcase size={20} className="text-navy" />,
      label: t.stat_total,
      value: jobs.length,
      color: "bg-blue-50 border-blue-100",
    },
    {
      icon: <Clock size={20} className="text-amber-600" />,
      label: t.stat_pending,
      value: pendingCount,
      color: "bg-amber-50 border-amber-100",
    },
    {
      icon: <CheckCircle2 size={20} className="text-emerald" />,
      label: t.stat_approved,
      value: approvedCount,
      color: "bg-emerald-light border-emerald/20",
    },
  ];

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-emerald mb-1">
              {t.tag}
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy">
              {t.title}
            </h1>
            {profile?.company_name && (
              <p className="flex items-center gap-1.5 text-sm text-warm-muted mt-1">
                <Building2 size={14} />
                {profile.company_name}
              </p>
            )}
          </div>
          <Link
            href="/dashboard/post-job"
            className="inline-flex items-center justify-center gap-2 bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-navy/90 transition-all"
          >
            <Plus size={15} />
            {t.post_job}
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`border rounded-2xl p-5 ${s.color}`}
            >
              <div className="flex items-center gap-3 mb-2">{s.icon}</div>
              <p className="font-display text-2xl font-bold text-navy">
                {s.value}
              </p>
              <p className="text-xs text-warm-muted mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Job list */}
        {loading ? (
          <p className="text-sm text-warm-muted">{t.loading}</p>
        ) : jobs.length === 0 ? (
          <div className="bg-white border border-warm-gray rounded-2xl p-10 text-center">
            <span className="inline-flex w-14 h-14 rounded-full bg-navy/5 items-center justify-center mb-4">
              <Briefcase size={24} className="text-navy" />
            </span>
            <h2 className="font-display text-xl font-bold text-navy mb-2">
              {t.empty_title}
            </h2>
            <p className="text-sm text-warm-muted max-w-sm mx-auto mb-6">
              {t.empty_desc}
            </p>
            <Link
              href="/dashboard/post-job"
              className="inline-flex items-center gap-2 bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-navy/90 transition-all"
            >
              <Plus size={15} />
              {t.empty_cta}
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.4) }}
                className="bg-white border border-warm-gray rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-display font-bold text-navy text-base">
                      {job.title}
                    </h3>
                    <span
                      className={`text-[11px] font-semibold border px-2 py-0.5 rounded-full ${
                        job.status === "approved"
                          ? "bg-emerald/10 text-emerald border-emerald/30"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {job.status === "approved"
                        ? t.status_approved
                        : t.status_pending}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-warm-muted">
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

                <div className="flex items-center gap-2 shrink-0">
                  {job.status === "approved" && (
                    <Link
                      href={`/jobs/${job.id}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy border border-warm-gray px-3 py-2 rounded-xl hover:border-navy transition-all"
                    >
                      <ExternalLink size={13} />
                      {t.view}
                    </Link>
                  )}
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 border border-red-200 px-3 py-2 rounded-xl hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Clock,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Tag,
  Globe,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useJobActions } from "@/lib/use-job-actions";
import { useLang } from "@/lib/language-context";
import { Job } from "@/types";

const sourceColors: Record<string, string> = {
  "jobs.af": "bg-blue-50 text-blue-700 border-blue-200",
  "acbar.org": "bg-purple-50 text-purple-700 border-purple-200",
  LinkedIn: "bg-sky-50 text-sky-700 border-sky-200",
};

const sourceLabels: Record<string, string> = {
  "jobs.af": "jobs.af",
  "acbar.org": "ACBAR",
  LinkedIn: "LinkedIn",
};

const copy = {
  en: {
    back: "Back to jobs",
    company: "Company",
    posted: "Posted",
    added: "Added to KarJo",
    source: "Source",
    skills: "Skills & categories",
    about_title: "About this job",
    about_desc:
      "This listing was collected automatically from its original source. Full details — description, requirements, and how to apply — are on the original posting.",
    apply_note:
      "Applications are submitted on the source website, not on KarJo.",
    view_original: "View original & apply",
    save: "Save",
    saved: "Saved",
    apply: "Mark applied",
    applied: "Applied",
    loading: "Loading job...",
    not_found: "Job not found",
    not_found_desc:
      "This job may have been removed. Browse all current jobs instead.",
    browse: "Browse jobs",
  },
  fa: {
    back: "بازگشت به وظایف",
    company: "شرکت",
    posted: "تاریخ نشر",
    added: "افزوده شده به کارجو",
    source: "منبع",
    skills: "مهارت‌ها و دسته‌بندی‌ها",
    about_title: "درباره این وظیفه",
    about_desc:
      "این آگهی به صورت خودکار از منبع اصلی آن جمع‌آوری شده است. جزئیات کامل — شرح وظایف، شرایط و نحوه درخواست — در آگهی اصلی موجود است.",
    apply_note: "درخواست‌ها در وب‌سایت منبع ثبت می‌شوند، نه در کارجو.",
    view_original: "مشاهده آگهی اصلی و درخواست",
    save: "ذخیره",
    saved: "ذخیره شد",
    apply: "علامت درخواست‌شده",
    applied: "درخواست شده",
    loading: "در حال بارگذاری...",
    not_found: "وظیفه یافت نشد",
    not_found_desc: "این وظیفه ممکن است حذف شده باشد. وظایف فعلی را مرور کنید.",
    browse: "جستجوی وظایف",
  },
};

export default function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { lang } = useLang();
  const t = copy[lang === "fa" ? "fa" : "en"];
  const { savedIds, appliedIds, toggleSave, toggleApply } = useJobActions();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJob() {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", id)
        .single();
      if (error) console.error("[JobDetails] fetch error:", error);
      setJob(data ?? null);
      setLoading(false);
    }
    fetchJob();
  }, [id]);

  const BackIcon = lang === "fa" ? ArrowRight : ArrowLeft;

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center pt-16">
        <p className="text-sm text-warm-muted">{t.loading}</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-6 pt-16 text-center">
        <h1 className="font-display text-2xl font-bold text-navy mb-2">
          {t.not_found}
        </h1>
        <p className="text-sm text-warm-muted mb-6">{t.not_found_desc}</p>
        <Link
          href="/jobs"
          className="bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-navy/90 transition-all"
        >
          {t.browse}
        </Link>
      </div>
    );
  }

  const saved = savedIds.includes(job.id);
  const applied = appliedIds.includes(job.id);
  const skills =
    job.skills
      ?.split(",")
      .map((s) => s.trim())
      .filter(Boolean) || [];
  const sourceColor =
    sourceColors[job.source] || "bg-gray-50 text-gray-700 border-gray-200";
  const sourceLabel = sourceLabels[job.source] || job.source;
  const addedDate = job.created_at
    ? new Date(job.created_at).toLocaleDateString(
        lang === "fa" ? "fa-AF" : "en-US",
        { year: "numeric", month: "short", day: "numeric" },
      )
    : null;

  return (
    <div className="min-h-screen bg-cream px-4 sm:px-6 pt-24 pb-16">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-warm-muted hover:text-navy transition-colors mb-6"
          >
            <BackIcon size={15} />
            {t.back}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-warm-gray rounded-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-warm-gray">
            <span
              className={`inline-block text-[11px] font-semibold border px-2 py-0.5 rounded-full mb-3 ${sourceColor}`}
            >
              {sourceLabel}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-navy mb-3 leading-snug">
              {job.title}
            </h1>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-warm-muted">
              <span className="flex items-center gap-1.5">
                <Building2 size={14} />
                {job.company}
              </span>
              {job.date && (
                <span className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {t.posted}: {job.date}
                </span>
              )}
              {addedDate && (
                <span className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {t.added}: {addedDate}
                </span>
              )}
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 space-y-7">
            {/* Skills */}
            {skills.length > 0 && (
              <section>
                <h2 className="flex items-center gap-2 font-display font-bold text-navy text-sm mb-3">
                  <Tag size={14} className="text-emerald" />
                  {t.skills}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((s) => (
                    <span
                      key={s}
                      className="text-xs font-medium text-charcoal bg-cream border border-warm-gray px-3 py-1 rounded-full"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* About */}
            <section>
              <h2 className="flex items-center gap-2 font-display font-bold text-navy text-sm mb-3">
                <Globe size={14} className="text-emerald" />
                {t.about_title}
              </h2>
              <p className="text-sm text-charcoal/70 leading-relaxed mb-2">
                {t.about_desc}
              </p>
              <p className="text-xs text-warm-muted">{t.apply_note}</p>
            </section>

            {/* Actions */}
            <section className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={job.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-navy text-white text-sm font-semibold px-5 py-3 rounded-xl hover:bg-navy/90 transition-all"
              >
                {t.view_original}
                <ExternalLink size={14} className="opacity-70" />
              </a>
              <button
                onClick={() => toggleSave(job.id)}
                className={`inline-flex items-center justify-center gap-2 text-sm font-semibold px-5 py-3 rounded-xl border transition-all ${
                  saved
                    ? "bg-navy text-white border-navy"
                    : "text-navy border-warm-gray hover:border-navy"
                }`}
              >
                {saved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />}
                {saved ? t.saved : t.save}
              </button>
              <button
                onClick={() => toggleApply(job.id)}
                className={`inline-flex items-center justify-center gap-2 text-sm font-semibold px-5 py-3 rounded-xl border transition-all ${
                  applied
                    ? "bg-emerald text-white border-emerald"
                    : "text-emerald border-emerald/40 hover:border-emerald"
                }`}
              >
                <CheckCircle2 size={15} />
                {applied ? t.applied : t.apply}
              </button>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

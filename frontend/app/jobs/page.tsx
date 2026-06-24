"use client";

import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import JobCard from "@/components/JobCard";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Job, JobSource } from "@/types";
import { useJobActions } from "@/lib/use-job-actions";
import { useLang } from "@/lib/language-context";

const PAGE_SIZE = 9;

function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
  if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "...", current - 1, current, current + 1, "...", total];
}

export default function JobsPage() {
  const { t } = useLang();

  const sources: { value: JobSource; label: string }[] = [
    { value: "all",       label: t("jobs.all_sources") },
    { value: "jobs.af",   label: "jobs.af" },
    { value: "acbar.org", label: "ACBAR" },
    { value: "LinkedIn",  label: "LinkedIn" },
  ];

  const [jobs,       setJobs]       = useState<Job[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search,     setSearch]     = useState("");
  const [source,     setSource]     = useState<JobSource>("all");
  const [page,       setPage]       = useState(1);

  const { savedIds: saved, appliedIds: applied, toggleSave, toggleApply } = useJobActions();

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) setFetchError(error.message);
      else setJobs(data ?? []);
      setLoading(false);
    }
    fetchJobs();
  }, []);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      const matchSource = source === "all" || j.source === source;
      const matchSearch =
        !search ||
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company.toLowerCase().includes(search.toLowerCase()) ||
        j.skills.toLowerCase().includes(search.toLowerCase());
      return matchSource && matchSearch;
    });
  }, [jobs, search, source]);

  useEffect(() => { setPage(1); }, [search, source]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  function goToPage(p: number) {
    setPage(p);
    const grid = document.getElementById("jobs-grid-top");
    if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">

      {/* ── Page header ── */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-emerald mb-1">{t("jobs.browse")}</p>
        <h1 className="font-display text-4xl font-bold text-navy mb-2">{t("jobs.title")}</h1>
        <p className="text-charcoal/60 text-sm">
          {loading
            ? t("jobs.loading")
            : `${filtered.length} ${filtered.length !== 1 ? t("jobs.found") : t("jobs.found_one")}`}
        </p>
      </div>

      {/* ── Filters bar ── */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="bg-white border border-warm-gray rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("jobs.search_ph")}
              className="w-full ps-10 pe-10 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal placeholder:text-warm-muted"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute end-3 top-1/2 -translate-y-1/2 text-warm-muted hover:text-charcoal">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex gap-2 flex-wrap">
            {sources.map((s) => (
              <button
                key={s.value}
                onClick={() => setSource(s.value)}
                className={`text-sm font-medium px-4 py-2.5 rounded-xl border transition-all ${
                  source === s.value
                    ? "bg-navy text-white border-navy"
                    : "bg-white text-charcoal border-warm-gray hover:border-navy"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Job grid ── */}
      <div id="jobs-grid-top" className="max-w-7xl mx-auto px-6">
        {loading ? (
          <div className="text-center py-24">
            <p className="text-warm-muted text-sm">{t("jobs.loading")}</p>
          </div>
        ) : fetchError ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl font-bold text-navy mb-2">{t("jobs.error_title")}</p>
            <p className="text-warm-muted text-sm">{fetchError}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl font-bold text-navy mb-2">{t("jobs.no_jobs_title")}</p>
            <p className="text-warm-muted text-sm">{t("jobs.no_jobs_sub")}</p>
            <button
              onClick={() => { setSearch(""); setSource("all"); }}
              className="mt-4 text-sm font-semibold text-emerald hover:underline"
            >
              {t("jobs.clear")}
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {paginated.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <JobCard
                    job={job}
                    saved={saved.includes(job.id)}
                    applied={applied.includes(job.id)}
                    onSave={toggleSave}
                    onApply={toggleApply}
                  />
                </motion.div>
              ))}
            </div>

            {/* ── Pagination ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center flex-wrap gap-1.5 mt-10">
                <button
                  onClick={() => goToPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-warm-gray text-charcoal hover:border-navy disabled:opacity-40 disabled:hover:border-warm-gray transition-all"
                  aria-label={t("jobs.prev")}
                >
                  <ChevronLeft size={16} />
                </button>

                {getPageNumbers(page, totalPages).map((p, i) =>
                  p === "..." ? (
                    <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-warm-muted text-sm">…</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => goToPage(p)}
                      className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium border transition-all ${
                        page === p
                          ? "bg-navy text-white border-navy"
                          : "bg-white text-charcoal border-warm-gray hover:border-navy"
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                <button
                  onClick={() => goToPage(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="w-9 h-9 flex items-center justify-center rounded-lg border border-warm-gray text-charcoal hover:border-navy disabled:opacity-40 disabled:hover:border-warm-gray transition-all"
                  aria-label={t("jobs.next")}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
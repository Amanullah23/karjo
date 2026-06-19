"use client";

import { useState, useMemo } from "react";
import { mockJobs } from "@/data/mockJobs";
import JobCard from "@/components/JobCard";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { motion } from "framer-motion";
import { JobSource } from "@/types";

const sources: { value: JobSource; label: string }[] = [
  { value: "all",       label: "All Sources" },
  { value: "jobs.af",   label: "jobs.af" },
  { value: "acbar.org", label: "ACBAR" },
  { value: "LinkedIn",  label: "LinkedIn" },
];

export default function JobsPage() {
  const [search,  setSearch]  = useState("");
  const [source,  setSource]  = useState<JobSource>("all");
  const [saved,   setSaved]   = useState<string[]>([]);
  const [applied, setApplied] = useState<string[]>([]);

  const toggleSave  = (id: string) => setSaved((p)  => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const toggleApply = (id: string) => setApplied((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const filtered = useMemo(() => {
    return mockJobs.filter((j) => {
      const matchSource = source === "all" || j.source === source;
      const matchSearch =
        !search ||
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.company.toLowerCase().includes(search.toLowerCase()) ||
        j.skills.toLowerCase().includes(search.toLowerCase());
      return matchSource && matchSearch;
    });
  }, [search, source]);

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">

      {/* ── Page header ── */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <p className="text-xs font-semibold tracking-widest uppercase text-emerald mb-1">Browse</p>
        <h1 className="font-display text-4xl font-bold text-navy mb-2">All Jobs</h1>
        <p className="text-charcoal/60 text-sm">
          {filtered.length} opportunit{filtered.length !== 1 ? "ies" : "y"} found across Afghanistan
        </p>
      </div>

      {/* ── Filters bar ── */}
      <div className="max-w-7xl mx-auto px-6 mb-8">
        <div className="bg-white border border-warm-gray rounded-2xl p-4 flex flex-col sm:flex-row gap-3">

          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search jobs, companies, or skills..."
              className="w-full pl-10 pr-10 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal placeholder:text-warm-muted"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-muted hover:text-charcoal">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Source filter */}
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
      <div className="max-w-7xl mx-auto px-6">
        {filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl font-bold text-navy mb-2">No jobs found</p>
            <p className="text-warm-muted text-sm">Try a different search or source filter.</p>
            <button
              onClick={() => { setSearch(""); setSource("all"); }}
              className="mt-4 text-sm font-semibold text-emerald hover:underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((job, i) => (
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
        )}
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { mockJobs } from "@/data/mockJobs";
import JobCard from "@/components/JobCard";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AppliedPage() {
  const [saved,   setSaved]   = useState<string[]>([]);
  const [applied, setApplied] = useState<string[]>(["2", "4", "7"]);

  const toggleSave  = (id: string) => setSaved((p)  => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const toggleApply = (id: string) => setApplied((p) => p.filter((x) => x !== id));

  const appliedJobs = mockJobs.filter((j) => applied.includes(j.id));

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald mb-1">Tracking</p>
          <h1 className="font-display text-4xl font-bold text-navy mb-2">Applied Jobs</h1>
          <p className="text-charcoal/60 text-sm">{appliedJobs.length} job{appliedJobs.length !== 1 ? "s" : ""} you've applied to</p>
        </div>

        {appliedJobs.length === 0 ? (
          <div className="text-center py-24 bg-white border border-warm-gray rounded-2xl">
            <CheckCircle2 size={40} className="text-warm-gray mx-auto mb-4" />
            <p className="font-display text-2xl font-bold text-navy mb-2">No applications tracked yet</p>
            <p className="text-warm-muted text-sm mb-6">Mark jobs as applied and track your progress here.</p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy/90 transition-all"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: "Total Applied",  value: appliedJobs.length, color: "text-navy" },
                { label: "This Week",      value: appliedJobs.length, color: "text-emerald" },
                { label: "Pending Reply",  value: appliedJobs.length, color: "text-amber-600" },
              ].map((s) => (
                <div key={s.label} className="bg-white border border-warm-gray rounded-2xl p-5 text-center">
                  <p className={`font-display text-3xl font-bold mb-1 ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-warm-muted">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {appliedJobs.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                >
                  <JobCard
                    job={job}
                    saved={saved.includes(job.id)}
                    applied={true}
                    onSave={toggleSave}
                    onApply={toggleApply}
                  />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
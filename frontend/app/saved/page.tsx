"use client";

import { useState } from "react";
import { mockJobs } from "@/data/mockJobs";
import JobCard from "@/components/JobCard";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SavedPage() {
  const [saved,   setSaved]   = useState<string[]>(["1", "3", "5"]);
  const [applied, setApplied] = useState<string[]>([]);

  const toggleSave  = (id: string) => setSaved((p)  => p.filter((x) => x !== id));
  const toggleApply = (id: string) => setApplied((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  const savedJobs = mockJobs.filter((j) => saved.includes(j.id));

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald mb-1">Your List</p>
          <h1 className="font-display text-4xl font-bold text-navy mb-2">Saved Jobs</h1>
          <p className="text-charcoal/60 text-sm">{savedJobs.length} saved job{savedJobs.length !== 1 ? "s" : ""}</p>
        </div>

        {savedJobs.length === 0 ? (
          <div className="text-center py-24 bg-white border border-warm-gray rounded-2xl">
            <Bookmark size={40} className="text-warm-gray mx-auto mb-4" />
            <p className="font-display text-2xl font-bold text-navy mb-2">No saved jobs yet</p>
            <p className="text-warm-muted text-sm mb-6">Bookmark jobs you're interested in and they'll appear here.</p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy/90 transition-all"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedJobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <JobCard
                  job={job}
                  saved={true}
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
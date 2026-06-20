"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useJobActions } from "@/lib/use-job-actions";
import ProtectedRoute from "@/components/ProtectedRoute";
import JobCard from "@/components/JobCard";
import { Bookmark } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Job } from "@/types";

function SavedJobsContent() {
  const { user } = useAuth();
  const { savedIds, appliedIds, toggleSave, toggleApply } = useJobActions();
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSavedJobs() {
      if (!user) return;
      setLoading(true);
      const { data } = await supabase
        .from("saved_jobs")
        .select("job_id, jobs(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      const jobs = (data ?? []).map((row: any) => row.jobs).filter(Boolean) as Job[];
      setSavedJobs(jobs);
      setLoading(false);
    }
    fetchSavedJobs();
  }, [user, savedIds]);

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald mb-1">Your List</p>
          <h1 className="font-display text-4xl font-bold text-navy mb-2">Saved Jobs</h1>
          <p className="text-charcoal/60 text-sm">
            {loading ? "Loading…" : `${savedJobs.length} saved job${savedJobs.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        {!loading && savedJobs.length === 0 ? (
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
                  applied={appliedIds.includes(job.id)}
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

export default function SavedPage() {
  return (
    <ProtectedRoute>
      <SavedJobsContent />
    </ProtectedRoute>
  );
}
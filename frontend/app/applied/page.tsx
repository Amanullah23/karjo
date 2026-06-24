"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { useJobActions } from "@/lib/use-job-actions";
import ProtectedRoute from "@/components/ProtectedRoute";
import JobCard from "@/components/JobCard";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Job } from "@/types";
import { useLang } from "@/lib/language-context";

function AppliedJobsContent() {
  const { user } = useAuth();
  const { t } = useLang();
  const { savedIds, appliedIds, toggleSave, toggleApply } = useJobActions();
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [loading,     setLoading]     = useState(true);

  useEffect(() => {
    async function fetchAppliedJobs() {
      if (!user) return;
      setLoading(true);
      const { data } = await supabase
        .from("applied_jobs")
        .select("job_id, jobs(*)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      const jobs = (data ?? []).map((row: any) => row.jobs).filter(Boolean) as Job[];
      setAppliedJobs(jobs);
      setLoading(false);
    }
    fetchAppliedJobs();
  }, [user, appliedIds]);

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald mb-1">{t("applied.your_list")}</p>
          <h1 className="font-display text-4xl font-bold text-navy mb-2">{t("applied.title")}</h1>
          <p className="text-charcoal/60 text-sm">
            {loading
              ? t("applied.loading")
              : `${appliedJobs.length} ${appliedJobs.length !== 1 ? t("applied.count") : t("applied.count_one")}`}
          </p>
        </div>

        {!loading && appliedJobs.length === 0 ? (
          <div className="text-center py-24 bg-white border border-warm-gray rounded-2xl">
            <CheckCircle2 size={40} className="text-warm-gray mx-auto mb-4" />
            <p className="font-display text-2xl font-bold text-navy mb-2">{t("applied.empty_title")}</p>
            <p className="text-warm-muted text-sm mb-6">{t("applied.empty_sub")}</p>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 bg-navy text-white font-semibold px-6 py-3 rounded-xl hover:bg-navy/90 transition-all"
            >
              {t("applied.browse")}
            </Link>
          </div>
        ) : (
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
                  saved={savedIds.includes(job.id)}
                  applied={true}
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

export default function AppliedPage() {
  return (
    <ProtectedRoute>
      <AppliedJobsContent />
    </ProtectedRoute>
  );
}
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "./supabase";
import { useAuth } from "./auth-context";

export function useJobActions() {
  const { user } = useAuth();
  const router = useRouter();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      setSavedIds([]);
      setAppliedIds([]);
      return;
    }
    async function fetchActions() {
      const [{ data: savedRows }, { data: appliedRows }] = await Promise.all([
        supabase.from("saved_jobs").select("job_id").eq("user_id", user!.id),
        supabase.from("applied_jobs").select("job_id").eq("user_id", user!.id),
      ]);
      setSavedIds((savedRows ?? []).map((r) => r.job_id as string));
      setAppliedIds((appliedRows ?? []).map((r) => r.job_id as string));
    }
    fetchActions();
  }, [user]);

  const toggleSave = useCallback(async (jobId: string) => {
    if (!user) { router.push("/login"); return; }
    if (savedIds.includes(jobId)) {
      setSavedIds((p) => p.filter((id) => id !== jobId));
      await supabase.from("saved_jobs").delete().eq("user_id", user.id).eq("job_id", jobId);
    } else {
      setSavedIds((p) => [...p, jobId]);
      await supabase.from("saved_jobs").insert({ user_id: user.id, job_id: jobId });
    }
  }, [user, savedIds, router]);

  const toggleApply = useCallback(async (jobId: string) => {
    if (!user) { router.push("/login"); return; }
    if (appliedIds.includes(jobId)) {
      setAppliedIds((p) => p.filter((id) => id !== jobId));
      await supabase.from("applied_jobs").delete().eq("user_id", user.id).eq("job_id", jobId);
    } else {
      setAppliedIds((p) => [...p, jobId]);
      await supabase.from("applied_jobs").insert({ user_id: user.id, job_id: jobId });
    }
  }, [user, appliedIds, router]);

  return { savedIds, appliedIds, toggleSave, toggleApply };
}
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      router.replace(session ? "/dashboard" : "/login");
    }
  }, [loading, session, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-warm-muted text-sm">Signing you in…</p>
    </div>
  );
}
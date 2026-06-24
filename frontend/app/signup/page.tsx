"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Briefcase, Building2 } from "lucide-react";
import { useAuth, UserRole } from "@/lib/auth-context";
import { useLang } from "@/lib/language-context";

export default function SignupPage() {
  const { signUp, signInWithGoogle } = useAuth();
  const { t } = useLang();

  const [role,         setRole]         = useState<UserRole>("job_seeker");
  const [fullName,     setFullName]     = useState("");
  const [email,        setEmail]        = useState("");
  const [password,     setPassword]     = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState<string | null>(null);
  const [loading,      setLoading]      = useState(false);
  const [success,      setSuccess]      = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await signUp(email, password, fullName, role);
    setLoading(false);
    if (error) setError(error);
    else setSuccess(true);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6 pt-24 pb-16">
        <div className="w-full max-w-md bg-white border border-warm-gray rounded-2xl p-8 text-center">
          <h1 className="font-display text-2xl font-bold text-navy mb-2">{t("signup.check_email")}</h1>
          <p className="text-warm-muted text-sm">
            {t("signup.email_sent")} <span className="text-charcoal font-medium">{email}</span>. {t("signup.email_note")}
          </p>
          <Link href="/login" className="inline-block mt-6 text-emerald font-semibold hover:underline text-sm">
            {t("signup.back_login")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white border border-warm-gray rounded-2xl p-8"
      >
        <p className="text-xs font-semibold tracking-widest uppercase text-emerald mb-1">{t("signup.get_started")}</p>
        <h1 className="font-display text-3xl font-bold text-navy mb-6">{t("signup.title")}</h1>

        {/* Role selector */}
        <div className="grid grid-cols-2 gap-2 mb-5">
          <button
            type="button"
            onClick={() => setRole("job_seeker")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              role === "job_seeker" ? "bg-navy text-white border-navy" : "bg-white text-charcoal border-warm-gray hover:border-navy"
            }`}
          >
            <Briefcase size={15} /> {t("signup.job_seeker")}
          </button>
          <button
            type="button"
            onClick={() => setRole("employer")}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              role === "employer" ? "bg-navy text-white border-navy" : "bg-white text-charcoal border-warm-gray hover:border-navy"
            }`}
          >
            <Building2 size={15} /> {t("signup.employer")}
          </button>
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={() => signInWithGoogle()}
          className="w-full flex items-center justify-center gap-2 border border-warm-gray rounded-xl py-2.5 text-sm font-medium text-charcoal hover:border-navy transition-all mb-4"
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.61z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.33A9 9 0 0 0 9 18z"/>
            <path fill="#FBBC05" d="M3.97 10.71A5.4 5.4 0 0 1 3.68 9c0-.59.1-1.17.29-1.71V4.96H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.04l3.01-2.33z"/>
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
          </svg>
          {t("signup.google")}
        </button>
        <p className="text-[11px] text-warm-muted text-center -mt-2 mb-4">{t("signup.google_note")}</p>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-warm-gray" />
          <span className="text-xs text-warm-muted">{t("signup.or")}</span>
          <div className="flex-1 h-px bg-warm-gray" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <User size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t("signup.name_ph")}
              className="w-full ps-10 pe-4 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal placeholder:text-warm-muted"
            />
          </div>

          <div className="relative">
            <Mail size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("signup.email_ph")}
              className="w-full ps-10 pe-4 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal placeholder:text-warm-muted"
            />
          </div>

          <div className="relative">
            <Lock size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
            <input
              type={showPassword ? "text" : "password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("signup.password_ph")}
              className="w-full ps-10 pe-10 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal placeholder:text-warm-muted"
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute end-3.5 top-1/2 -translate-y-1/2 text-warm-muted hover:text-charcoal"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-navy text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-navy/90 transition-all disabled:opacity-60"
          >
            {loading
              ? t("signup.creating")
              : role === "employer" ? t("signup.as_employer") : t("signup.as_seeker")}
          </button>
        </form>

        <p className="text-sm text-warm-muted text-center mt-6">
          {t("signup.have_account")}{" "}
          <Link href="/login" className="text-emerald font-semibold hover:underline">
            {t("signup.login")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
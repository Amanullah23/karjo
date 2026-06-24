"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import {
  Briefcase,
  Menu,
  X,
  Bell,
  Bookmark,
  CheckCircle2,
  LayoutDashboard,
  Search,
  ChevronDown,
  LogOut,
  Building2,
  User,
  Globe,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, Profile } from "@/lib/auth-context";
import { useLang, Lang } from "@/lib/language-context";

function roleLabel(role?: Profile["role"], t?: (k: string) => string) {
  const _t = t ?? ((k: string) => k);
  if (role === "employer") return _t("nav.employer");
  if (role === "admin")    return _t("nav.admin");
  return _t("nav.job_seeker");
}

// ── Language Switcher ─────────────────────────────────────────────────────────

function LangSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options: { value: Lang; label: string; native: string }[] = [
    { value: "en", label: "English", native: "EN" },
    { value: "fa", label: "دری",     native: "FA" },
  ];

  const current = options.find((o) => o.value === lang)!;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-warm-gray hover:border-navy text-sm font-medium text-charcoal transition-all"
      >
        <Globe size={14} className="text-warm-muted" />
        <span>{current.native}</span>
        <ChevronDown size={12} className={`text-warm-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className={`absolute end-0 mt-2 w-36 bg-white border border-warm-gray rounded-2xl shadow-xl overflow-hidden z-50 ${lang === "fa" ? "left-0" : "right-0"}`}
          >
            {options.map((o) => (
              <button
                key={o.value}
                onClick={() => { setLang(o.value); setOpen(false); }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors ${
                  lang === o.value
                    ? "bg-navy/5 text-navy font-semibold"
                    : "text-charcoal hover:bg-cream"
                }`}
              >
                <span>{o.label}</span>
                <span className="text-xs text-warm-muted">{o.native}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Profile Menu ──────────────────────────────────────────────────────────────

function ProfileMenu({
  profile,
  email,
  onSignOut,
}: {
  profile: Profile | null;
  email?: string;
  onSignOut: () => void;
}) {
  const { t, lang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initial = (profile?.full_name || email || "?").charAt(0).toUpperCase();

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-warm-gray hover:border-navy transition-all"
      >
        <span className="w-7 h-7 rounded-full bg-navy text-white text-xs font-bold flex items-center justify-center shrink-0">
          {initial}
        </span>
        <span className="text-sm font-medium text-charcoal max-w-28 truncate">
          {profile?.full_name || t("nav.account")}
        </span>
        <ChevronDown
          size={14}
          className={`text-warm-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute end-0 mt-2 w-60 bg-white border border-warm-gray rounded-2xl shadow-xl overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-warm-gray">
              <p className="text-sm font-semibold text-navy truncate">
                {profile?.full_name || t("nav.account")}
              </p>
              <p className="text-xs text-warm-muted truncate">{email}</p>
              <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-bold uppercase tracking-wide text-emerald bg-emerald/10 px-2 py-0.5 rounded-full">
                {profile?.role === "employer" && <Building2 size={10} />}
                {roleLabel(profile?.role, t)}
              </span>
            </div>
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal hover:bg-cream transition-colors"
            >
              <User size={15} className="text-warm-muted" /> {t("nav.profile")}
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-charcoal hover:bg-cream transition-colors"
            >
              <LayoutDashboard size={15} className="text-warm-muted" />
              {t("nav.dashboard")}
            </Link>
            <button
              onClick={() => { setOpen(false); onSignOut(); }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-warm-gray"
            >
              <LogOut size={15} /> {t("nav.logout")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────

export default function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname              = usePathname();
  const { user, profile, loading, signOut } = useAuth();
  const { t, lang }           = useLang();

  const navLinks = [
    { href: "/jobs",      label: t("nav.jobs"),      icon: <Search size={15} /> },
    { href: "/dashboard", label: t("nav.dashboard"), icon: <LayoutDashboard size={15} /> },
    { href: "/saved",     label: t("nav.saved"),     icon: <Bookmark size={15} /> },
    { href: "/applied",   label: t("nav.applied"),   icon: <CheckCircle2 size={15} /> },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-lg shadow-sm border-b border-warm-gray"
          : "bg-white/80 backdrop-blur-md border-b border-warm-gray/50"
      }`}
    >
      <div className="h-0.5 bg-linear-to-r from-navy via-emerald to-navy" />

      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 bg-navy rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
            <Briefcase size={17} className="text-white" />
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald rounded-full border-2 border-white" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display font-bold text-navy text-xl tracking-tight">
              Kar<span className="text-emerald">Jo</span>
            </span>
            <span className="hidden sm:inline text-[11px] text-warm-muted font-medium bg-warm-gray/60 px-2 py-0.5 rounded-full">
              کارجو
            </span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all duration-200 ${
                  active
                    ? "text-navy bg-navy/8"
                    : "text-charcoal/70 hover:text-navy hover:bg-navy/5"
                }`}
              >
                <span className={active ? "text-emerald" : "text-warm-muted"}>
                  {l.icon}
                </span>
                {l.label}
                {active && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-emerald rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald/8 border border-emerald/20 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-emerald">
              247 {t("nav.live_jobs")}
            </span>
          </div>

          <LangSwitcher />

          {!loading && !user && (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-charcoal/70 hover:text-navy px-3 py-2 transition-colors"
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/signup"
                className="flex items-center gap-2 bg-navy text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-navy/90 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                {t("nav.signup")}
              </Link>
            </>
          )}

          {!loading && user && (
            <ProfileMenu
              profile={profile}
              email={user.email ?? undefined}
              onSignOut={signOut}
            />
          )}
        </div>

        <button
          className="md:hidden relative w-9 h-9 flex items-center justify-center rounded-xl border border-warm-gray bg-white hover:bg-cream transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={open ? "close" : "open"}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.15 }}
            >
              {open ? (
                <X size={18} className="text-charcoal" />
              ) : (
                <Menu size={18} className="text-charcoal" />
              )}
            </motion.div>
          </AnimatePresence>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-white border-t border-warm-gray"
          >
            <div className="px-4 py-4 space-y-1">
              {!loading && user && (
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-3 mb-2 bg-cream rounded-xl hover:bg-warm-gray/40 transition-colors"
                >
                  <span className="w-9 h-9 rounded-full bg-navy text-white text-sm font-bold flex items-center justify-center shrink-0">
                    {(profile?.full_name || user.email || "?").charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-navy truncate">
                      {profile?.full_name || t("nav.account")}
                    </p>
                    <p className="text-xs text-warm-muted">
                      {roleLabel(profile?.role, t)} · {t("nav.tap_profile")}
                    </p>
                  </div>
                </Link>
              )}

              {navLinks.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-navy text-white"
                        : "text-charcoal hover:bg-cream hover:text-navy"
                    }`}
                  >
                    <span className={active ? "text-emerald" : "text-warm-muted"}>
                      {l.icon}
                    </span>
                    {l.label}
                  </Link>
                );
              })}

              <div className="border-t border-warm-gray my-2" />

              <div className="px-1 pb-1">
                <LangSwitcher />
              </div>

              {!loading && !user && (
                <div className="flex gap-2 px-1">
                  <Link
                    href="/login"
                    className="flex-1 text-center text-sm font-semibold text-navy border border-warm-gray px-4 py-3 rounded-xl hover:border-navy transition-all"
                  >
                    {t("nav.login")}
                  </Link>
                  <Link
                    href="/signup"
                    className="flex-1 text-center text-sm font-semibold bg-navy text-white px-4 py-3 rounded-xl hover:bg-navy/90 transition-all"
                  >
                    {t("nav.signup")}
                  </Link>
                </div>
              )}

              {!loading && user && (
                <button
                  onClick={signOut}
                  className="w-full flex items-center justify-center gap-2 text-sm font-semibold text-red-600 border border-red-200 px-4 py-3 rounded-xl hover:bg-red-50 transition-all"
                >
                  <LogOut size={15} /> {t("nav.logout")}
                </button>
              )}

              <div className="flex items-center gap-2 px-4 py-2">
                <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-emerald">
                  247 {t("nav.live_jobs")}
                </span>
              </div>

              <Link
                href="https://t.me/KarJoAfghanistan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-navy text-white text-sm font-semibold px-4 py-3 rounded-xl hover:bg-navy/90 transition-all"
              >
                <Bell size={15} className="text-emerald" />
                {t("nav.telegram")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
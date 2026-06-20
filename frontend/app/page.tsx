"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
  Briefcase, Zap, Bell, Filter, ArrowRight, TrendingUp,
  ExternalLink, ChevronDown, Sparkles, Clock, Shield
} from "lucide-react";

import { supabase } from "@/lib/supabase";
import { Job } from "@/types";
import JobCard from "@/components/JobCard";
import { useState, useRef, useEffect } from "react";

// ── Animated counter ───────────────────────────────────────────────────────────
function Counter({ to, duration = 2 }: { to: number; duration?: number }) {
  const [count,   setCount]   = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let start = 0;
    const step = to / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [to, duration]);

  if (!mounted) return <>{to}</>;
  return <>{count}</>;
}

// ── Particle field ─────────────────────────────────────────────────────────────
function ParticleField() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 8 + 6,
    delay: Math.random() * 4,
    opacity: Math.random() * 0.4 + 0.1,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-linear-to-br from-[#0d1f35] via-navy to-[#0a2a1f]" />

      <motion.div
        className="absolute -top-32 -right-32 w-175 h-175 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(5,150,105,0.18) 0%, transparent 65%)" }}
        animate={{ scale: [1, 1.12, 1], rotate: [0, 8, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-48 -left-32 w-150 h-150 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(27,46,75,0.5) 0%, transparent 70%)" }}
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-900 h-400 rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(5,150,105,0.07) 0%, transparent 60%)" }}
        animate={{ scale: [1, 1.08, 1], rotate: [0, -5, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-emerald"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [p.opacity, p.opacity * 2.5, p.opacity],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}

      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      <motion.div
        className="absolute top-1/2 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(5,150,105,0.3), transparent)" }}
        animate={{ opacity: [0.3, 0.7, 0.3], scaleX: [0.8, 1, 0.8] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

// ── Floating job preview card ──────────────────────────────────────────────────
function FloatingCard({ job, delay, x, y, rotate }: {
  job: { title: string; company: string; source: string };
  delay: number; x: number; y: number; rotate: number;
}) {
  const sourceColor: Record<string, string> = {
    "jobs.af":  "bg-blue-500",
    "acbar.org":"bg-purple-500",
    "LinkedIn": "bg-sky-500",
  };
  return (
    <motion.div
      className="absolute bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-4 py-3 shadow-xl"
      style={{ left: `${x}%`, top: `${y}%`, rotate, width: 200 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
      transition={{
        opacity: { delay, duration: 0.6 },
        scale:   { delay, duration: 0.6 },
        y: { duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay: delay + 0.6 },
      }}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <span className={`w-5 h-5 ${sourceColor[job.source] || "bg-gray-500"} rounded-md text-white text-[9px] font-bold flex items-center justify-center shrink-0`}>
          {job.source === "LinkedIn" ? "in" : job.source[0].toUpperCase()}
        </span>
        <span className="text-white/60 text-[10px]">{job.source}</span>
      </div>
      <p className="text-white text-xs font-semibold leading-snug truncate">{job.title}</p>
      <p className="text-white/50 text-[10px] mt-0.5 truncate">{job.company}</p>
    </motion.div>
  );
}

const features = [
  {
    icon: <Zap size={20} />,
    title: "Auto-scraped daily",
    desc: "Jobs collected every morning from jobs.af, ACBAR, and LinkedIn — zero manual effort.",
    iconBg: "bg-blue-600",
  },
  {
    icon: <Bell size={20} />,
    title: "Telegram delivery",
    desc: "Get fresh Afghan opportunities sent straight to your Telegram at 8 AM every morning.",
    iconBg: "bg-emerald",
  },
  {
    icon: <Filter size={20} />,
    title: "Smart filters",
    desc: "Filter by source, skills, and category. Find the right job in seconds.",
    iconBg: "bg-purple-600",
  },
  {
    icon: <TrendingUp size={20} />,
    title: "Application tracking",
    desc: "Save jobs and track every application in one clean dashboard.",
    iconBg: "bg-amber-500",
  },
];

const floatingJobs = [
  { title: "Senior Developer",  company: "Afghan Telecom",    source: "jobs.af",   x: 2,  y: 18, rotate: -6, delay: 0.4 },
  { title: "Project Manager",   company: "UNDP Afghanistan",  source: "acbar.org", x: 72, y: 12, rotate: 5,  delay: 0.7 },
  { title: "Data Analyst",      company: "Ministry of Finance",source: "LinkedIn", x: 68, y: 65, rotate: -4, delay: 1.0 },
];

export default function HomePage() {
  const [saved,   setSaved]   = useState<string[]>([]);
  const [applied, setApplied] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [featured, setFeatured] = useState<Job[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const rawY    = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const rawOpa  = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const heroY   = useSpring(rawY,   { stiffness: 60, damping: 20 });
  const heroOpa = useSpring(rawOpa, { stiffness: 60, damping: 20 });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    async function fetchFeatured() {
      const { data } = await supabase
        .from("jobs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);
      setFeatured(data ?? []);

      const { count } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true });
      setTotalCount(count ?? 0);
    }
    fetchFeatured();
  }, []);

  const toggleSave  = (id: string) => setSaved((p)  => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  const toggleApply = (id: string) => setApplied((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  return (
    <div className="min-h-screen bg-cream overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">

        {/* Only render random particles after mount */}
        {mounted && <ParticleField />}

        {/* Static dark bg shown on server */}
        {!mounted && (
          <div className="absolute inset-0 bg-linear-to-br from-[#0d1f35] via-navy to-[#0a2a1f]" />
        )}

        {/* Floating preview cards — desktop only, client only */}
        {mounted && (
          <div className="hidden lg:block absolute inset-0 pointer-events-none z-10">
            {floatingJobs.map((j) => (
              <FloatingCard key={j.title} job={j} {...j} />
            ))}
          </div>
        )}

        <motion.div
          style={{ y: heroY, opacity: heroOpa }}
          className="relative z-20 text-center max-w-4xl mx-auto pt-24 pb-12"
        >
          {/* Eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-xs font-semibold px-4 py-2 rounded-full mb-8"
          >
            <Sparkles size={12} className="text-emerald" />
            Afghanistan's first automated job digest
            <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display font-bold text-white leading-[1.03] tracking-tight mb-6"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
          >
            Every Afghan Job,{" "}
            <br className="hidden sm:block" />
            <span className="relative">
              <span className="text-emerald">One Place.</span>
              <motion.span
                className="absolute -bottom-1 left-0 right-0 h-0.75 bg-emerald/40 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                style={{ originX: 0 }}
              />
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="text-white/55 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10"
          >
            KarJo scrapes <span className="text-white/80 font-medium">jobs.af</span>,{" "}
            <span className="text-white/80 font-medium">ACBAR</span>, and{" "}
            <span className="text-white/80 font-medium">LinkedIn</span> every morning
            and delivers the freshest Afghan opportunities straight to your Telegram.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-14"
          >
            <Link
              href="/jobs"
              className="group inline-flex items-center justify-center gap-2.5 bg-white text-navy font-bold px-8 py-4 rounded-2xl hover:bg-white/90 transition-all hover:-translate-y-1 hover:shadow-2xl shadow-black/20 text-sm"
            >
              <Briefcase size={16} />
              Browse All Jobs
              <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="https://t.me/KarJoAfghanistan"
              target="_blank"
              className="group inline-flex items-center justify-center gap-2.5 bg-emerald text-white font-bold px-8 py-4 rounded-2xl hover:bg-emerald-dark transition-all hover:-translate-y-1 hover:shadow-2xl shadow-emerald/30 text-sm"
            >
              <Bell size={16} className="group-hover:animate-bounce" />
              Get Daily Telegram Alerts
              <ExternalLink size={13} className="opacity-60" />
            </Link>
          </motion.div>

          {/* Trust row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="flex items-center justify-center gap-6 flex-wrap"
          >
            {[
              { icon: <Clock size={13} />,    text: "Updated at 8 AM daily" },
              { icon: <Shield size={13} />,   text: "Free forever" },
              { icon: <Sparkles size={13} />, text: `${totalCount} jobs available now` },
            ].map((t) => (
              <div key={t.text} className="flex items-center gap-1.5 text-white/40 text-xs">
                <span className="text-emerald">{t.icon}</span>
                {t.text}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          <span className="text-white/30 text-[10px] tracking-widest uppercase">Scroll</span>
          <ChevronDown size={18} className="text-white/30" />
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          STATS BAR
      ══════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-y border-warm-gray py-10 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: 500, suffix: "+",  label: "Jobs tracked",   color: "text-navy" },
            { value: 3,   suffix: "",   label: "Job sources",    color: "text-navy" },
            { value: 100, suffix: "%",  label: "Free forever",   color: "text-emerald" },
            { value: 8,   suffix: "AM", label: "Daily delivery", color: "text-navy" },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <p className={`font-display text-4xl font-bold mb-1 ${s.color}`}>
                <Counter to={s.value} />{s.suffix}
              </p>
              <p className="text-warm-muted text-xs font-semibold uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          LATEST JOBS
      ══════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" />
              <p className="text-xs font-bold tracking-widest uppercase text-emerald">Live Now</p>
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-navy leading-tight">
              Fresh Opportunities
            </h2>
            <p className="text-charcoal/50 text-sm mt-2">Scraped and verified every morning</p>
          </div>
          <Link
            href="/jobs"
            className="group hidden sm:flex items-center gap-2 bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-navy/90 transition-all hover:-translate-y-0.5"
          >
            All jobs <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((job, i) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.09 }}
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

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 border-2 border-navy text-navy font-bold px-8 py-3.5 rounded-2xl hover:bg-navy hover:text-white transition-all duration-200"
          >
            View all {totalCount} jobs <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle, #fff 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-1 rounded-full"
          style={{ background: "linear-gradient(90deg, transparent, rgba(5,150,105,0.6), transparent)" }}
        />

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-xs font-bold tracking-widest uppercase text-emerald mb-3">Why KarJo</p>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Stop searching.<br />Start finding.
            </h2>
            <p className="text-white/40 max-w-lg mx-auto text-sm leading-relaxed">
              Built for Afghan job seekers who are tired of opening 5 different websites every single morning.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 rounded-2xl p-6 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
                  style={{ background: "radial-gradient(circle at 20% 50%, rgba(5,150,105,0.08) 0%, transparent 60%)" }}
                />
                <div className={`relative z-10 w-11 h-11 ${f.iconBg} rounded-xl flex items-center justify-center text-white mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className="relative z-10 font-display font-bold text-white text-lg mb-2">{f.title}</h3>
                <p className="relative z-10 text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          TELEGRAM CTA
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-175 h-100 rounded-full"
            style={{ background: "radial-gradient(ellipse, rgba(5,150,105,0.08) 0%, transparent 65%)" }}
            animate={{ scale: [1, 1.2, 1], rotate: [0, 3, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto relative z-10"
        >
          <div className="bg-white border border-warm-gray rounded-3xl p-10 md:p-14 text-center shadow-xl shadow-navy/5">
            <motion.div
              className="w-20 h-20 bg-navy rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-lg"
              whileHover={{ scale: 1.05, rotate: -3 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Bell size={34} className="text-emerald" />
            </motion.div>

            <h2 className="font-display text-4xl md:text-5xl font-bold text-navy mb-4 leading-tight">
              Jobs in your Telegram,<br />every morning.
            </h2>
            <p className="text-charcoal/55 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Start the KarJo bot and receive the freshest Afghan opportunities at 8:00 AM daily — no sign-up, no fees, forever free.
            </p>

            <Link
              href="https://t.me/KarJoAfghanistan"
              target="_blank"
              className="group inline-flex items-center justify-center gap-3 bg-navy text-white font-bold px-10 py-4 rounded-2xl hover:bg-navy/90 transition-all hover:-translate-y-1 hover:shadow-xl shadow-navy/20 text-base mb-6"
            >
              <Bell size={20} className="text-emerald group-hover:animate-bounce" />
              Start @KarJoAfghanistan on Telegram
              <ExternalLink size={15} className="opacity-50" />
            </Link>

            <div className="flex items-center justify-center gap-6 flex-wrap">
              {["Free forever", "No sign-up required", "Cancel anytime"].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-xs text-warm-muted">
                  <span className="w-1 h-1 bg-emerald rounded-full" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════ */}
      <footer className="bg-navy border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                <Briefcase size={17} className="text-white" />
              </div>
              <div>
                <span className="font-display font-bold text-white text-lg">Kar<span className="text-emerald">Jo</span></span>
                <span className="text-white/30 text-xs ml-2">کارجو</span>
              </div>
            </div>

            <div className="flex items-center gap-6">
              {[
                { href: "/jobs",      label: "Browse Jobs" },
                { href: "/dashboard", label: "Dashboard" },
                { href: "/saved",     label: "Saved" },
                { href: "/applied",   label: "Applied" },
              ].map((l) => (
                <Link key={l.href} href={l.href} className="text-xs text-white/40 hover:text-white transition-colors font-medium">
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {[
                { href: "https://jobs.af",       label: "jobs.af" },
                { href: "https://acbar.org/jobs", label: "ACBAR" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  className="flex items-center gap-1.5 text-xs text-white/30 hover:text-white/70 transition-colors border border-white/10 px-3 py-1.5 rounded-lg"
                >
                  {l.label} <ExternalLink size={10} />
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-white/25 text-xs">© 2026 KarJo — کارجو. All rights reserved.</p>
            <p className="text-white/25 text-xs">
              Built with ❤️ by{" "}
              <Link href="https://yawari.vercel.app" target="_blank" className="text-white/50 hover:text-emerald transition-colors font-semibold">
                Amanullah Yawari
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Bookmark,
  CheckCircle2,
  TrendingUp,
  Bell,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { mockJobs } from "@/data/mockJobs";
import ProtectedRoute from "@/components/ProtectedRoute";

const stats = [
  {
    icon: <Briefcase size={20} className="text-navy" />,
    label: "Total Jobs",
    value: "247",
    change: "+12 today",
    color: "bg-blue-50 border-blue-100",
  },
  {
    icon: <Bookmark size={20} className="text-amber-600" />,
    label: "Saved Jobs",
    value: "3",
    change: "View saved",
    color: "bg-amber-50 border-amber-100",
  },
  {
    icon: <CheckCircle2 size={20} className="text-emerald" />,
    label: "Applied",
    value: "3",
    change: "Track all",
    color: "bg-emerald-light border-emerald/20",
  },
  {
    icon: <TrendingUp size={20} className="text-purple-600" />,
    label: "New This Week",
    value: "34",
    change: "+8 vs last",
    color: "bg-purple-50 border-purple-100",
  },
];

const sourceStats = [
  { source: "jobs.af", count: 124, color: "bg-blue-500", pct: 50 },
  { source: "ACBAR", count: 78, color: "bg-purple-500", pct: 32 },
  { source: "LinkedIn", count: 45, color: "bg-sky-500", pct: 18 },
];

const recentJobs = mockJobs.slice(0, 5);

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-cream pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-emerald mb-1">
                Overview
              </p>
              <h1 className="font-display text-4xl font-bold text-navy">
                Dashboard
              </h1>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Link
                href="https://t.me/Kar_Jo_Bot"
                target="_blank"
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-warm-gray text-charcoal text-sm font-semibold px-4 py-2.5 rounded-xl hover:border-navy transition-all"
              >
                <Bell size={15} className="text-emerald" />
                Telegram Bot
              </Link>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-navy text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-navy/90 transition-all">
                <RefreshCw size={15} />
                Refresh Jobs
              </button>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className={`bg-white border rounded-2xl p-5 ${s.color}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm">
                    {s.icon}
                  </div>
                </div>
                <p className="font-display text-3xl font-bold text-navy mb-1">
                  {s.value}
                </p>
                <p className="text-xs text-warm-muted font-medium">{s.label}</p>
                <p className="text-xs text-emerald font-semibold mt-1">
                  {s.change}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent jobs */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-warm-gray rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display font-bold text-navy text-lg">
                    Recent Jobs
                  </h2>
                  <Link
                    href="/jobs"
                    className="text-sm text-emerald font-semibold hover:underline"
                  >
                    View all
                  </Link>
                </div>
                <div className="space-y-3">
                  {recentJobs.map((job, i) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.07 }}
                      className="flex items-center justify-between p-4 bg-cream rounded-xl border border-warm-gray"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-navy text-sm truncate">
                          {job.title}
                        </p>
                        <p className="text-xs text-warm-muted mt-0.5">
                          {job.company} · {job.source}
                        </p>
                      </div>
                      <Link
                        href={job.url}
                        target="_blank"
                        className="shrink-0 ml-3 p-2 bg-white border border-warm-gray rounded-lg hover:border-navy transition-all"
                      >
                        <ExternalLink size={13} className="text-charcoal" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-5">
              {/* Source breakdown */}
              <div className="bg-white border border-warm-gray rounded-2xl p-6">
                <h2 className="font-display font-bold text-navy text-lg mb-5">
                  Jobs by Source
                </h2>
                <div className="space-y-4">
                  {sourceStats.map((s) => (
                    <div key={s.source}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-charcoal">
                          {s.source}
                        </span>
                        <span className="text-sm font-bold text-navy">
                          {s.count}
                        </span>
                      </div>
                      <div className="h-2 bg-warm-gray rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${s.color}`}
                          style={{ width: `${s.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Telegram bot card */}
              <div className="bg-navy rounded-2xl p-6 text-white">
                <Bell size={22} className="text-emerald mb-3" />
                <h3 className="font-display font-bold text-lg mb-2">
                  Daily Job Alerts
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-4">
                  Get the latest Afghan jobs sent to your Telegram every morning
                  at 8 AM.
                </p>
                <Link
                  href="https://t.me/Kar_Jo_Bot"
                  target="_blank"
                  className="flex items-center justify-center gap-2 bg-emerald text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-emerald-dark transition-all"
                >
                  Open @Kar_Jo_Bot <ExternalLink size={13} />
                </Link>
              </div>

              {/* Quick links */}
              <div className="bg-white border border-warm-gray rounded-2xl p-6">
                <h2 className="font-display font-bold text-navy text-lg mb-4">
                  Quick Links
                </h2>
                <div className="space-y-2">
                  {[
                    { label: "Browse All Jobs", href: "/jobs" },
                    { label: "Saved Jobs", href: "/saved" },
                    { label: "Applied Jobs", href: "/applied" },
                    {
                      label: "jobs.af",
                      href: "https://jobs.af",
                      external: true,
                    },
                    {
                      label: "ACBAR Jobs",
                      href: "https://acbar.org/jobs",
                      external: true,
                    },
                  ].map((l) => (
                    <Link
                      key={l.label}
                      href={l.href}
                      target={l.external ? "_blank" : undefined}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-cream transition-colors group"
                    >
                      <span className="text-sm font-medium text-charcoal group-hover:text-navy">
                        {l.label}
                      </span>
                      <ExternalLink
                        size={13}
                        className="text-warm-muted group-hover:text-navy"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

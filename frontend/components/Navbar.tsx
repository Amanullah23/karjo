"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Briefcase, Menu, X, Bell, Bookmark, CheckCircle2, LayoutDashboard, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/jobs",      label: "Browse Jobs",  icon: <Search size={15} /> },
  { href: "/dashboard", label: "Dashboard",    icon: <LayoutDashboard size={15} /> },
  { href: "/saved",     label: "Saved",        icon: <Bookmark size={15} /> },
  { href: "/applied",   label: "Applied",      icon: <CheckCircle2 size={15} /> },
];

export default function Navbar() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

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
      {/* Top accent bar */}
      <div className="h-0.5 bg-linear-to-r from-navy via-emerald to-navy" />

      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
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

        {/* Desktop links */}
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
                <span className={active ? "text-emerald" : "text-warm-muted"}>{l.icon}</span>
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

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 bg-emerald/8 border border-emerald/20 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-emerald">247 live jobs</span>
          </div>
          <Link
            href="https://t.me/KarJoAfghanistan"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-navy text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-navy/90 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <Bell size={14} className="text-emerald" />
            Get Alerts
          </Link>
        </div>

        {/* Mobile hamburger */}
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
              {open ? <X size={18} className="text-charcoal" /> : <Menu size={18} className="text-charcoal" />}
            </motion.div>
          </AnimatePresence>
        </button>
      </nav>

      {/* Mobile menu */}
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
                    <span className={active ? "text-emerald" : "text-warm-muted"}>{l.icon}</span>
                    {l.label}
                  </Link>
                );
              })}
              <div className="border-t border-warm-gray my-2" />
              <div className="flex items-center gap-2 px-4 py-2">
                <span className="w-1.5 h-1.5 bg-emerald rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-emerald">247 live jobs available</span>
              </div>
              <Link
                href="https://t.me/KarJoAfghanistan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-navy text-white text-sm font-semibold px-4 py-3 rounded-xl hover:bg-navy/90 transition-all"
              >
                <Bell size={15} className="text-emerald" />
                Get Daily Job Alerts on Telegram
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
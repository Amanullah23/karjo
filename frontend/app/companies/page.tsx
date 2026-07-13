"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, Briefcase, Search } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLang } from "@/lib/language-context";

const copy = {
  en: {
    tag: "Hiring now",
    title: "Companies",
    subtitle: "Organizations with open positions on KarJo.",
    search_ph: "Search companies...",
    jobs: "open jobs",
    job: "open job",
    loading: "Loading...",
    empty: "No companies found.",
    view: "View jobs",
  },
  fa: {
    tag: "در حال استخدام",
    title: "شرکت‌ها",
    subtitle: "سازمان‌هایی که در کارجو موقعیت شغلی باز دارند.",
    search_ph: "جستجوی شرکت‌ها...",
    jobs: "وظیفه باز",
    job: "وظیفه باز",
    loading: "در حال بارگذاری...",
    empty: "شرکتی یافت نشد.",
    view: "مشاهده وظایف",
  },
};

interface CompanyEntry {
  name: string;
  count: number;
}

export default function CompaniesPage() {
  const { lang } = useLang();
  const t = copy[lang === "fa" ? "fa" : "en"];

  const [companies, setCompanies] = useState<CompanyEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    async function fetchCompanies() {
      const { data, error } = await supabase.from("jobs").select("company");
      if (error) {
        console.error("[Companies] fetch error:", error);
        setLoading(false);
        return;
      }
      const counts = new Map<string, number>();
      (data ?? []).forEach((row: { company: string | null }) => {
        const name = row.company?.trim();
        if (!name) return;
        counts.set(name, (counts.get(name) ?? 0) + 1);
      });
      const list = Array.from(counts.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
      setCompanies(list);
      setLoading(false);
    }
    fetchCompanies();
  }, []);

  const filtered = companies.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-cream px-4 sm:px-6 pt-24 pb-16">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald mb-2">
            {t.tag}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-2">
            {t.title}
          </h1>
          <p className="text-sm text-warm-muted">{t.subtitle}</p>
        </motion.div>

        <div className="relative mb-8 max-w-md">
          <Search
            size={16}
            className="absolute start-3.5 top-1/2 -translate-y-1/2 text-warm-muted"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.search_ph}
            className="w-full ps-10 pe-4 py-2.5 text-sm bg-white border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal placeholder:text-warm-muted"
          />
        </div>

        {loading ? (
          <p className="text-sm text-warm-muted">{t.loading}</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-warm-muted">{t.empty}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((c, i) => (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.6) }}
              >
                <Link
                  href="/jobs"
                  className="group flex items-center gap-4 bg-white border border-warm-gray rounded-2xl p-4 hover:border-navy hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <span className="w-11 h-11 rounded-xl bg-navy/5 flex items-center justify-center shrink-0">
                    <Building2 size={20} className="text-navy" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-navy truncate group-hover:text-emerald transition-colors">
                      {c.name}
                    </p>
                    <p className="flex items-center gap-1 text-xs text-warm-muted mt-0.5">
                      <Briefcase size={11} />
                      {c.count} {c.count === 1 ? t.job : t.jobs}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

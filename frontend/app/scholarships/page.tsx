"use client";

import { motion } from "framer-motion";
import { GraduationCap, ExternalLink, MapPin, Calendar } from "lucide-react";
import { useLang } from "@/lib/language-context";

const copy = {
  en: {
    tag: "Study opportunities",
    title: "Scholarships",
    subtitle: "Fully funded scholarships open to Afghan students.",
    degree: "Degree",
    deadline: "Deadline",
    funding: "Fully funded",
    apply: "Learn more",
  },
  fa: {
    tag: "فرصت‌های تحصیلی",
    title: "بورسیه‌ها",
    subtitle: "بورسیه‌های کاملاً رایگان برای دانشجویان افغان.",
    degree: "مقطع",
    deadline: "مهلت",
    funding: "کاملاً رایگان",
    apply: "معلومات بیشتر",
  },
};

const scholarships = [
  {
    name: "Chevening Scholarship",
    country: "United Kingdom",
    flag: "🇬🇧",
    degree: "Master's",
    deadline: "Nov 2026",
    url: "https://www.chevening.org",
  },
  {
    name: "MEXT Scholarship",
    country: "Japan",
    flag: "🇯🇵",
    degree: "Master's / PhD",
    deadline: "May 2026",
    url: "https://www.studyinjapan.go.jp/en/planning/scholarship/",
  },
  {
    name: "DAAD Scholarships",
    country: "Germany",
    flag: "🇩🇪",
    degree: "Master's / PhD",
    deadline: "Oct 2026",
    url: "https://www.daad.de/en/",
  },
  {
    name: "Fulbright Program",
    country: "United States",
    flag: "🇺🇸",
    degree: "Master's",
    deadline: "Feb 2027",
    url: "https://foreign.fulbrightonline.org",
  },
  {
    name: "Türkiye Scholarships",
    country: "Türkiye",
    flag: "🇹🇷",
    degree: "Bachelor's – PhD",
    deadline: "Feb 2027",
    url: "https://turkiyeburslari.gov.tr",
  },
  {
    name: "Australia Awards",
    country: "Australia",
    flag: "🇦🇺",
    degree: "Master's",
    deadline: "Apr 2027",
    url: "https://www.dfat.gov.au/people-to-people/australia-awards",
  },
];

export default function ScholarshipsPage() {
  const { lang } = useLang();
  const t = copy[lang === "fa" ? "fa" : "en"];

  return (
    <div className="min-h-screen bg-cream px-4 sm:px-6 pt-24 pb-16">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-10"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald mb-2">
            {t.tag}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-2">
            {t.title}
          </h1>
          <p className="text-sm text-warm-muted">{t.subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {scholarships.map((s, i) => (
            <motion.a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: i * 0.07 }}
              className="group bg-white border border-warm-gray rounded-2xl p-5 hover:border-navy hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="w-11 h-11 rounded-xl bg-emerald/10 flex items-center justify-center text-xl">
                  {s.flag}
                </span>
                <span className="text-[11px] font-semibold text-emerald bg-emerald/10 border border-emerald/20 px-2 py-0.5 rounded-full">
                  {t.funding}
                </span>
              </div>

              <h3 className="font-display font-bold text-navy text-base mb-1 group-hover:text-emerald transition-colors">
                {s.name}
              </h3>
              <div className="flex items-center gap-1.5 text-warm-muted text-xs mb-4">
                <MapPin size={12} />
                {s.country}
              </div>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-xs text-charcoal/70">
                  <GraduationCap size={13} className="text-warm-muted" />
                  <span className="text-warm-muted">{t.degree}:</span>{" "}
                  {s.degree}
                </div>
                <div className="flex items-center gap-2 text-xs text-charcoal/70">
                  <Calendar size={13} className="text-warm-muted" />
                  <span className="text-warm-muted">{t.deadline}:</span>{" "}
                  {s.deadline}
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-navy group-hover:text-emerald transition-colors">
                {t.apply} <ExternalLink size={12} />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </div>
  );
}

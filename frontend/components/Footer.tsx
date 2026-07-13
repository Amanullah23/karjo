"use client";

import Link from "next/link";
import { useLang } from "@/lib/language-context";

function DownloadIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

const copy = {
  en: {
    brand_desc:
      "Afghanistan's job platform — connecting talent with opportunity across the country.",
    quick_links: "Quick links",
    home: "Home",
    browse_jobs: "Browse jobs",
    download_app: "Download app",
    contact_us: "Contact us",
    get_app: "Get the app",
    get_app_desc: "Available on Android. iOS coming soon.",
    download_apk: "Download APK",
    rights: "All rights reserved.",
    privacy: "Privacy",
    terms: "Terms",
    guide: "How KarJo works",
  },
  fa: {
    brand_desc:
      "پلتفرم کاریابی افغانستان — پیوند استعدادها با فرصت‌ها در سراسر کشور.",
    quick_links: "لینک‌های سریع",
    home: "صفحه اصلی",
    browse_jobs: "جستجوی وظایف",
    download_app: "دانلود اپلیکیشن",
    contact_us: "تماس با ما",
    get_app: "دریافت اپلیکیشن",
    get_app_desc: "برای اندروید موجود است. نسخه iOS به زودی.",
    download_apk: "دانلود APK",
    rights: "تمام حقوق محفوظ است.",
    privacy: "حریم خصوصی",
    terms: "شرایط استفاده",
    guide: "راهنمای کارجو",
  },
};

export default function Footer() {
  const { lang } = useLang();
  const t = copy[lang === "fa" ? "fa" : "en"];

  const quickLinks = [
    { label: t.home, href: "/" },
    { label: t.browse_jobs, href: "/jobs" },
    { label: t.download_app, href: "/download" },
    { label: t.contact_us, href: "/contact" },
    { label: t.guide, href: "/guide" },
  ];

  const legalLinks = [
    { label: t.privacy, href: "/privacy" },
    { label: t.terms, href: "/terms" },
  ];

  return (
    <footer className="bg-[#1B2E4B] border-t border-white/10">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-bold">
                <span className="text-white">Kar</span>
                <span className="text-[#059669]">Jo</span>
              </span>
              <span className="text-xs text-[#059669] font-medium bg-emerald-900/30 px-2 py-0.5 rounded-full border border-emerald-800">
                کارجو
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              {t.brand_desc}
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              {t.quick_links}
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-gray-400 hover:text-[#059669] transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get the app */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">
              {t.get_app}
            </h3>
            <p className="text-sm text-gray-400 mb-4">{t.get_app_desc}</p>
            <Link
              href="/download"
              className="inline-flex items-center gap-2 bg-[#059669] text-white text-sm px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors"
            >
              <DownloadIcon />
              {t.download_apk}
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            {new Date().getFullYear()} KarJo · کارجو. {t.rights}
          </p>
          <div className="flex items-center gap-5">
            {legalLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs text-gray-500 hover:text-[#059669] transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

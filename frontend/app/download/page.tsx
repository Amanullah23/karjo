"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useLang } from "@/lib/language-context";

type Platform = "android" | "ios";

const copy = {
  en: {
    back: "Back to site",
    free: "Free to download",
    hero_title: "Get KarJo on your device",
    hero_sub:
      "Afghanistan's job platform — find work, apply fast, and track your applications.",
    android: "Android",
    iphone: "iPhone",
    android_title: "KarJo on Android",
    android_sub: "Install from Google Play or download the APK directly.",
    get_it_on: "Get it on",
    google_play: "Google Play",
    play_soon: "Coming soon on Google Play",
    download_apk: "Download APK",
    latest_version: "Latest version",
    apk_note:
      "If Google Play is not available in your region, use the direct APK download.",
    stat_jobs: "Jobs listed",
    stat_companies: "Companies",
    stat_rating: "App rating",
    ios_title: "KarJo on iPhone",
    ios_sub:
      "We're building the iOS app. Drop your email and you'll be the first to know when it launches.",
    coming_soon: "Coming soon",
    email_ph: "your@email.com",
    notify: "Notify me",
    notify_done: "You're on the list — we'll email you when iOS launches.",
    brand_desc:
      "Afghanistan's job platform — connecting talent with opportunity across the country.",
    quick_links: "Quick links",
    link_home: "Home",
    link_jobs: "Browse jobs",
    link_download: "Download app",
    link_contact: "Contact us",
    get_app: "Get the app",
    get_app_desc: "Available on Android. iOS coming soon.",
    rights: "All rights reserved.",
    privacy: "Privacy",
    terms: "Terms",
  },
  fa: {
    back: "بازگشت به سایت",
    free: "دانلود رایگان",
    hero_title: "کارجو را روی دستگاه خود داشته باشید",
    hero_sub:
      "پلتفرم کاریابی افغانستان — کار پیدا کنید، سریع درخواست دهید و درخواست‌هایتان را پیگیری کنید.",
    android: "اندروید",
    iphone: "آیفون",
    android_title: "کارجو در اندروید",
    android_sub: "از گوگل پلی نصب کنید یا فایل APK را مستقیم دانلود کنید.",
    get_it_on: "دریافت از",
    google_play: "Google Play",
    play_soon: "به زودی در گوگل پلی",
    download_apk: "دانلود APK",
    latest_version: "آخرین نسخه",
    apk_note:
      "اگر گوگل پلی در منطقه شما در دسترس نیست، از دانلود مستقیم APK استفاده کنید.",
    stat_jobs: "وظایف ثبت‌شده",
    stat_companies: "شرکت‌ها",
    stat_rating: "امتیاز اپ",
    ios_title: "کارجو در آیفون",
    ios_sub:
      "نسخه iOS در حال ساخت است. ایمیل خود را بگذارید تا اولین نفری باشید که از عرضه آن باخبر می‌شود.",
    coming_soon: "به زودی",
    email_ph: "ایمیل شما",
    notify: "خبرم کن",
    notify_done: "در لیست هستید — با عرضه نسخه iOS برایتان ایمیل می‌فرستیم.",
    brand_desc:
      "پلتفرم کاریابی افغانستان — پیوند استعدادها با فرصت‌ها در سراسر کشور.",
    quick_links: "لینک‌های سریع",
    link_home: "صفحه اصلی",
    link_jobs: "جستجوی وظایف",
    link_download: "دانلود اپلیکیشن",
    link_contact: "تماس با ما",
    get_app: "دریافت اپلیکیشن",
    get_app_desc: "برای اندروید موجود است. نسخه iOS به زودی.",
    rights: "تمام حقوق محفوظ است.",
    privacy: "حریم خصوصی",
    terms: "شرایط استفاده",
  },
};

export default function DownloadPage() {
  const { lang } = useLang();
  const t = copy[lang === "fa" ? "fa" : "en"];

  const APK_VERSIONS = [
    {
      label: t.latest_version,
      size: "24.9 MB",
      file: "/downloads/karjo-latest.apk",
    },
  ];

  const [platform, setPlatform] = useState<Platform>("android");
  const [apkOpen, setApkOpen] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifySent, setNotifySent] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setApkOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleNotify(e: React.FormEvent) {
    e.preventDefault();
    if (!notifyEmail.includes("@")) return;
    setNotifySent(true);
    setNotifyEmail("");
  }

  return (
    <main className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">
              <span className="text-[#1B2E4B]">Kar</span>
              <span className="text-[#059669]">Jo</span>
            </span>
            <span className="text-xs text-[#059669] font-medium bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              کارجو
            </span>
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-[#1B2E4B] transition-colors"
          >
            {t.back}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-16 pb-10 px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          {t.free}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-[#1B2E4B] mb-4 tracking-tight">
          {t.hero_title}
        </h1>
        <p className="text-base text-emerald-600 max-w-md mx-auto">
          {t.hero_sub}
        </p>
      </section>

      {/* Tab switcher */}
      <section className="px-6 pb-4">
        <div className="max-w-2xl mx-auto flex justify-center gap-3">
          {(["android", "ios"] as Platform[]).map((p) => (
            <button
              key={p}
              onClick={() => {
                setPlatform(p);
                setApkOpen(false);
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium border transition-all ${
                platform === p
                  ? "bg-[#1B2E4B] text-white border-[#1B2E4B]"
                  : "bg-white text-gray-500 border-gray-200 hover:border-[#059669] hover:text-[#059669]"
              }`}
            >
              {p === "android" ? (
                <AndroidIcon active={platform === p} />
              ) : (
                <AppleIcon active={platform === p} />
              )}
              {p === "android" ? t.android : t.iphone}
            </button>
          ))}
        </div>
      </section>

      {/* Main card */}
      <section className="px-6 pb-20 flex-1">
        <div className="max-w-2xl mx-auto border border-gray-100 rounded-2xl p-8 shadow-sm bg-white">
          {/* Android panel */}
          {platform === "android" && (
            <div>
              <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs px-3 py-1 rounded-full mb-5">
                <AndroidIcon active />
                {t.android}
              </div>
              <h2 className="text-2xl font-semibold text-[#1B2E4B] mb-1">
                {t.android_title}
              </h2>
              <p className="text-sm text-gray-400 mb-7">{t.android_sub}</p>

              <div className="flex flex-wrap items-center gap-3">
                {/* Google Play button */}
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  title={t.play_soon}
                  className="flex items-center gap-3 px-5 py-3 rounded-xl border border-gray-200 hover:border-[#1B2E4B] transition-colors bg-white no-underline"
                >
                  <GooglePlayIcon />
                  <div className="leading-tight">
                    <p className="text-[10px] text-gray-400">{t.get_it_on}</p>
                    <p className="text-sm font-semibold text-[#1B2E4B]">
                      {t.google_play}
                    </p>
                  </div>
                </a>

                {/* APK Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setApkOpen((v) => !v)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      apkOpen
                        ? "bg-emerald-50 border-[#059669] text-[#059669]"
                        : "border-[#059669] text-[#059669] hover:bg-emerald-50"
                    }`}
                  >
                    <DownloadIcon />
                    {t.download_apk}
                    <ChevronIcon open={apkOpen} />
                  </button>

                  {apkOpen && (
                    <div className="absolute top-[calc(100%+8px)] start-0 bg-white border border-gray-100 rounded-xl shadow-lg min-w-[240px] z-10 overflow-hidden">
                      {APK_VERSIONS.map((v) => (
                        <a
                          key={v.label}
                          href={v.file}
                          download
                          onClick={() => setApkOpen(false)}
                          className="flex items-center justify-between px-5 py-3.5 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-50 last:border-none transition-colors no-underline"
                        >
                          <span>{v.label}</span>
                          <span className="text-xs text-gray-400">
                            {v.size}
                          </span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <p className="text-xs text-gray-400 mt-4">{t.apk_note}</p>

              {/* Stats row */}
              <div className="mt-8 pt-6 border-t border-gray-50 grid grid-cols-3 gap-4">
                {[
                  { label: t.stat_jobs, value: "500+" },
                  { label: t.stat_companies, value: "80+" },
                  { label: t.stat_rating, value: "4.8 ★" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-lg font-bold text-[#1B2E4B]">
                      {s.value}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* iOS panel */}
          {platform === "ios" && (
            <div className="flex flex-col items-center text-center py-6 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
                <AppleIcon active={false} large />
              </div>
              <h2 className="text-xl font-semibold text-[#1B2E4B]">
                {t.ios_title}
              </h2>
              <p className="text-sm text-gray-400 max-w-xs">{t.ios_sub}</p>
              <span className="inline-flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                {t.coming_soon}
              </span>

              {!notifySent ? (
                <form
                  onSubmit={handleNotify}
                  className="flex gap-2 w-full max-w-sm mt-2"
                >
                  <input
                    type="email"
                    required
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    placeholder={t.email_ph}
                    className="flex-1 px-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-[#1B2E4B] transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-[#1B2E4B] text-white text-sm rounded-lg hover:bg-[#243d63] transition-colors whitespace-nowrap"
                  >
                    {t.notify}
                  </button>
                </form>
              ) : (
                <p className="text-sm text-emerald-600 font-medium">
                  {t.notify_done}
                </p>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

// ── Icons ──────────────────────────────────────────────────────

function AndroidIcon({ active, large }: { active?: boolean; large?: boolean }) {
  const size = large ? 32 : 16;
  const color = active ? "currentColor" : "#6b7280";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zm-2.5-1C2.67 17 2 17.67 2 18.5v-9C2 8.67 2.67 8 3.5 8S5 8.67 5 9.5v9c0 .83-.67 1.5-1.5 1.5zm17 0c-.83 0-1.5-.67-1.5-1.5v-9c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v9c0 .83-.67 1.5-1.5 1.5zM15.53 2.16l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48A5.84 5.84 0 0012 1c-.96 0-1.86.23-2.66.63L7.85.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.31 1.31A5.944 5.944 0 006 7h12a5.96 5.96 0 00-2.47-4.84zM10 5H9V4h1v1zm5 0h-1V4h1v1z" />
    </svg>
  );
}

function AppleIcon({ active, large }: { active?: boolean; large?: boolean }) {
  const size = large ? 32 : 16;
  const color = active ? "currentColor" : "#6b7280";
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function GooglePlayIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.18 23.76c.3.17.64.22.99.14l12.45-7.19-2.78-2.78-10.66 9.83z"
        fill="#EA4335"
      />
      <path
        d="M20.47 10.35L17.6 8.7l-3.1 3.1 3.1 3.1 2.91-1.68c.83-.48.83-1.39-.04-1.87z"
        fill="#FBBC05"
      />
      <path
        d="M3.18.24C2.83.32 2.5.55 2.31.94L13.14 11.8l2.78-2.78L4.17.24c-.32-.18-.67-.18-.99 0z"
        fill="#4285F4"
      />
      <path
        d="M2.31 23.06c.19.39.52.62.87.7L14.5 12.43 2.31.94v22.12z"
        fill="#34A853"
      />
    </svg>
  );
}

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

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: "transform 0.2s",
        transform: open ? "rotate(180deg)" : "rotate(0deg)",
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

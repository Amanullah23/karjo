"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

export type Lang = "en" | "fa";

interface LanguageContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const translations: Record<Lang, Record<string, string>> = {
  en: {
    // Navbar
    "nav.jobs":        "Browse Jobs",
    "nav.dashboard":   "Dashboard",
    "nav.saved":       "Saved",
    "nav.applied":     "Applied",
    "nav.login":       "Log In",
    "nav.signup":      "Sign Up",
    "nav.logout":      "Log Out",
    "nav.profile":     "My Profile",
    "nav.live_jobs":   "live jobs",
    "nav.telegram":    "Get Daily Job Alerts on Telegram",
    "nav.job_seeker":  "Job Seeker",
    "nav.employer":    "Employer",
    "nav.admin":       "Admin",
    "nav.tap_profile": "Tap to view profile",
    "nav.account":     "Account",
    "nav.download": "Download App",

    // Common
    "common.search":   "Search",
    "common.loading":  "Loading...",
    "common.error":    "Something went wrong",
    "common.no_jobs":  "No jobs found",
    "common.apply":    "Apply Now",
    "common.save":     "Save",
    "common.saved":    "Saved",
    "common.deadline": "Deadline",
    "common.location": "Location",
    "common.company":  "Company",
    "common.skills":   "Skills",
    "common.source":   "Source",

    // Hero
    "hero.badge":      "Afghanistan's first automated job digest",
    "hero.headline1":  "Every Afghan Job,",
    "hero.headline2":  "One Place.",
    "hero.subtitle":   "KarJo scrapes jobs.af, ACBAR, and LinkedIn every morning and delivers the freshest Afghan opportunities straight to your Telegram.",
    "hero.browse":     "Browse All Jobs",
    "hero.telegram":   "Get Daily Telegram Alerts",
    "hero.trust1":     "Updated at 8 AM daily",
    "hero.trust2":     "Free forever",
    "hero.trust3":     "jobs available now",
    "hero.scroll":     "Scroll",

    // Stats
    "stats.jobs":      "Jobs tracked",
    "stats.sources":   "Job sources",
    "stats.free":      "Free forever",
    "stats.delivery":  "Daily delivery",

    // Latest jobs section
    "latest.live":     "Live Now",
    "latest.title":    "Fresh Opportunities",
    "latest.subtitle": "Scraped and verified every morning",
    "latest.all":      "All jobs",
    "latest.view_all": "View all",
    "latest.jobs":     "jobs",

    // Features
    "features.label":   "Why KarJo",
    "features.title1":  "Stop searching.",
    "features.title2":  "Start finding.",
    "features.subtitle":"Built for Afghan job seekers who are tired of opening 5 different websites every single morning.",
    "feat1.title":      "Auto-scraped daily",
    "feat1.desc":       "Jobs collected every morning from jobs.af, ACBAR, and LinkedIn — zero manual effort.",
    "feat2.title":      "Telegram delivery",
    "feat2.desc":       "Get fresh Afghan opportunities sent straight to your Telegram at 8 AM every morning.",
    "feat3.title":      "Smart filters",
    "feat3.desc":       "Filter by source, skills, and category. Find the right job in seconds.",
    "feat4.title":      "Application tracking",
    "feat4.desc":       "Save jobs and track every application in one clean dashboard.",

    // CTA section
    "cta.title1":      "Jobs in your Telegram,",
    "cta.title2":      "every morning.",
    "cta.subtitle":    "Start the KarJo bot and receive the freshest Afghan opportunities at 8:00 AM daily — no sign-up, no fees, forever free.",
    "cta.button":      "Start @KarJoAfghanistan on Telegram",
    "cta.trust1":      "Free forever",
    "cta.trust2":      "No sign-up required",
    "cta.trust3":      "Cancel anytime",

    // Footer
    "footer.rights":   "© 2026 KarJo — کارجو. All rights reserved.",
    "footer.built":    "Built with ❤️ by",

    // Jobs page
    "jobs.browse":        "Browse",
    "jobs.title":         "All Jobs",
    "jobs.loading":       "Loading…",
    "jobs.found":         "opportunities found across Afghanistan",
    "jobs.found_one":     "opportunity found across Afghanistan",
    "jobs.search_ph":     "Search jobs, companies, or skills...",
    "jobs.all_sources":   "All Sources",
    "jobs.no_jobs_title": "No jobs found",
    "jobs.no_jobs_sub":   "Try a different search or source filter.",
    "jobs.clear":         "Clear filters",
    "jobs.error_title":   "Couldn't load jobs",
    "jobs.prev":          "Previous page",
    "jobs.next":          "Next page",

    // Dashboard
    "dash.overview":      "Overview",
    "dash.title":         "Dashboard",
    "dash.telegram_btn":  "Telegram Bot",
    "dash.refresh":       "Refresh Jobs",
    "dash.total_jobs":    "Total Jobs",
    "dash.today":         "+12 today",
    "dash.saved_jobs":    "Saved Jobs",
    "dash.view_saved":    "View saved",
    "dash.applied":       "Applied",
    "dash.track_all":     "Track all",
    "dash.new_week":      "New This Week",
    "dash.vs_last":       "+8 vs last",
    "dash.recent_jobs":   "Recent Jobs",
    "dash.view_all":      "View all",
    "dash.by_source":     "Jobs by Source",
    "dash.alerts_title":  "Daily Job Alerts",
    "dash.alerts_desc":   "Get the latest Afghan jobs sent to your Telegram every morning at 8 AM.",
    "dash.open_bot":      "Open @Kar_Jo_Bot",
    "dash.quick_links":   "Quick Links",
    "dash.browse_all":    "Browse All Jobs",
    "dash.saved_link":    "Saved Jobs",
    "dash.applied_link":  "Applied Jobs",

    // Profile page
    "profile.account":        "Account",
    "profile.title":          "My Profile",
    "profile.subtitle":       "Manage your personal information and preferences",
    "profile.your_name":      "Your name",
    "profile.full_name":      "Full Name",
    "profile.full_name_ph":   "Your full name",
    "profile.email":          "Email",
    "profile.phone":          "Phone",
    "profile.province":       "Province",
    "profile.select_prov":    "Select province",
    "profile.headline":       "Headline",
    "profile.headline_ph":    "e.g. Frontend Developer",
    "profile.skills":         "Skills",
    "profile.skills_ph":      "e.g. React, Node.js, Project Management",
    "profile.company_name":   "Company Name",
    "profile.company_name_ph":"Your company name",
    "profile.company_web":    "Company Website",
    "profile.company_web_ph": "https://yourcompany.com",
    "profile.telegram":       "Telegram Username",
    "profile.telegram_ph":    "username (without @)",
    "profile.telegram_hint":  "Link your @Kar_Jo_Bot account for future sync.",
    "profile.save":           "Save Changes",
    "profile.saving":         "Saving...",
    "profile.saved":          "Saved",
    "profile.job_seeker":     "Job Seeker",
    "profile.employer":       "Employer",
    "profile.admin":          "Admin",

    // Saved page
    "saved.your_list":  "Your List",
    "saved.title":      "Saved Jobs",
    "saved.loading":    "Loading…",
    "saved.count":      "saved jobs",
    "saved.count_one":  "saved job",
    "saved.empty_title":"No saved jobs yet",
    "saved.empty_sub":  "Bookmark jobs you're interested in and they'll appear here.",
    "saved.browse":     "Browse Jobs",

    // Applied page
    "applied.your_list":  "Your List",
    "applied.title":      "Applied Jobs",
    "applied.loading":    "Loading…",
    "applied.count":      "applied jobs",
    "applied.count_one":  "applied job",
    "applied.empty_title":"No applied jobs yet",
    "applied.empty_sub":  "Mark jobs as applied to track them here.",
    "applied.browse":     "Browse Jobs",

    // Login page
    "login.welcome":      "Welcome back",
    "login.title":        "Log in to KarJo",
    "login.google":       "Continue with Google",
    "login.or":           "or",
    "login.email_ph":     "Email address",
    "login.password_ph":  "Password",
    "login.logging_in":   "Logging in...",
    "login.submit":       "Log In",
    "login.no_account":   "Don't have an account?",
    "login.signup":       "Sign up",

    // Signup page
    "signup.get_started":   "Get started",
    "signup.title":         "Create your account",
    "signup.job_seeker":    "Job Seeker",
    "signup.employer":      "Employer",
    "signup.google":        "Continue with Google",
    "signup.google_note":   "Google sign-up always creates a Job Seeker account",
    "signup.or":            "or",
    "signup.name_ph":       "Full name",
    "signup.email_ph":      "Email address",
    "signup.password_ph":   "Password (min. 6 characters)",
    "signup.creating":      "Creating account...",
    "signup.as_employer":   "Sign up as Employer",
    "signup.as_seeker":     "Sign up as Job Seeker",
    "signup.have_account":  "Already have an account?",
    "signup.login":         "Log in",
    "signup.check_email":   "Check your email",
    "signup.email_sent":    "We sent a confirmation link to",
    "signup.email_note":    "Click it to activate your account, then log in.",
    "signup.back_login":    "Back to login",
  },
  fa: {
    // Navbar
    "nav.jobs":        "جستجوی وظایف",
    "nav.dashboard":   "داشبورد",
    "nav.saved":       "ذخیره‌شده",
    "nav.applied":     "درخواست‌شده",
    "nav.login":       "ورود",
    "nav.signup":      "ثبت‌نام",
    "nav.logout":      "خروج",
    "nav.profile":     "پروفایل من",
    "nav.live_jobs":   "وظیفه فعال",
    "nav.telegram":    "دریافت هشدار روزانه در تلگرام",
    "nav.job_seeker":  "کارجو",
    "nav.employer":    "کارفرما",
    "nav.admin":       "مدیر",
    "nav.tap_profile": "برای مشاهده پروفایل کلیک کنید",
    "nav.account":     "حساب",
    "nav.download": "دانلود اپ",

    // Common
    "common.search":   "جستجو",
    "common.loading":  "در حال بارگذاری...",
    "common.error":    "خطایی رخ داد",
    "common.no_jobs":  "وظیفه‌ای یافت نشد",
    "common.apply":    "درخواست دهید",
    "common.save":     "ذخیره",
    "common.saved":    "ذخیره‌شده",
    "common.deadline": "مهلت",
    "common.location": "موقعیت",
    "common.company":  "شرکت",
    "common.skills":   "مهارت‌ها",
    "common.source":   "منبع",

    // Hero
    "hero.badge":      "اولین ربات خودکار کاریابی افغانستان",
    "hero.headline1":  "همه وظایف افغانستان،",
    "hero.headline2":  "یک جا.",
    "hero.subtitle":   "کارجو هر روز صبح وظایف را از jobs.af، ACBAR و LinkedIn جمع‌آوری می‌کند و تازه‌ترین فرصت‌های شغلی را مستقیم به تلگرام شما می‌فرستد.",
    "hero.browse":     "مشاهده همه وظایف",
    "hero.telegram":   "دریافت هشدار روزانه در تلگرام",
    "hero.trust1":     "بروزرسانی روزانه ساعت ۸ صبح",
    "hero.trust2":     "کاملاً رایگان",
    "hero.trust3":     "وظیفه موجود",
    "hero.scroll":     "پایین",

    // Stats
    "stats.jobs":      "وظیفه ثبت‌شده",
    "stats.sources":   "منبع کاریابی",
    "stats.free":      "کاملاً رایگان",
    "stats.delivery":  "ارسال روزانه",

    // Latest jobs section
    "latest.live":     "زنده",
    "latest.title":    "فرصت‌های تازه",
    "latest.subtitle": "هر روز صبح جمع‌آوری و تأیید می‌شود",
    "latest.all":      "همه وظایف",
    "latest.view_all": "مشاهده همه",
    "latest.jobs":     "وظیفه",

    // Features
    "features.label":   "چرا کارجو؟",
    "features.title1":  "دیگر جستجو نکنید.",
    "features.title2":  "پیدا کنید.",
    "features.subtitle":"برای کارجویان افغان ساخته شده که خسته‌اند هر روز صبح ۵ وب‌سایت مختلف را باز کنند.",
    "feat1.title":      "جمع‌آوری خودکار روزانه",
    "feat1.desc":       "وظایف هر روز صبح از jobs.af، ACBAR و LinkedIn جمع‌آوری می‌شود — بدون هیچ تلاشی.",
    "feat2.title":      "ارسال به تلگرام",
    "feat2.desc":       "تازه‌ترین فرصت‌های شغلی افغانستان هر روز ساعت ۸ صبح مستقیم به تلگرام شما فرستاده می‌شود.",
    "feat3.title":      "فیلترهای هوشمند",
    "feat3.desc":       "بر اساس منبع، مهارت‌ها و دسته‌بندی فیلتر کنید. وظیفه مناسب را در چند ثانیه پیدا کنید.",
    "feat4.title":      "پیگیری درخواست‌ها",
    "feat4.desc":       "وظایف را ذخیره کنید و همه درخواست‌هایتان را در یک داشبورد مرتب پیگیری کنید.",

    // CTA section
    "cta.title1":      "وظایف در تلگرام شما،",
    "cta.title2":      "هر روز صبح.",
    "cta.subtitle":    "ربات کارجو را شروع کنید و هر روز ساعت ۸:۰۰ صبح تازه‌ترین فرصت‌های شغلی افغانستان را دریافت کنید — بدون ثبت‌نام، بدون هزینه، برای همیشه رایگان.",
    "cta.button":      "شروع @KarJoAfghanistan در تلگرام",
    "cta.trust1":      "کاملاً رایگان",
    "cta.trust2":      "بدون نیاز به ثبت‌نام",
    "cta.trust3":      "هر زمان لغو کنید",

    // Footer
    "footer.rights":   "© ۲۰۲۶ کارجو. تمام حقوق محفوظ است.",
    "footer.built":    "ساخته شده با ❤️ توسط",

    // Jobs page
    "jobs.browse":        "جستجو",
    "jobs.title":         "همه وظایف",
    "jobs.loading":       "در حال بارگذاری...",
    "jobs.found":         "فرصت شغلی در افغانستان یافت شد",
    "jobs.found_one":     "فرصت شغلی در افغانستان یافت شد",
    "jobs.search_ph":     "جستجوی وظایف، شرکت‌ها یا مهارت‌ها...",
    "jobs.all_sources":   "همه منابع",
    "jobs.no_jobs_title": "وظیفه‌ای یافت نشد",
    "jobs.no_jobs_sub":   "فیلتر یا کلیدواژه دیگری امتحان کنید.",
    "jobs.clear":         "پاک کردن فیلترها",
    "jobs.error_title":   "بارگذاری وظایف ناموفق بود",
    "jobs.prev":          "صفحه قبلی",
    "jobs.next":          "صفحه بعدی",

    // Dashboard
    "dash.overview":      "نمای کلی",
    "dash.title":         "داشبورد",
    "dash.telegram_btn":  "ربات تلگرام",
    "dash.refresh":       "بروزرسانی وظایف",
    "dash.total_jobs":    "کل وظایف",
    "dash.today":         "+۱۲ امروز",
    "dash.saved_jobs":    "وظایف ذخیره‌شده",
    "dash.view_saved":    "مشاهده ذخیره‌شده‌ها",
    "dash.applied":       "درخواست‌شده",
    "dash.track_all":     "پیگیری همه",
    "dash.new_week":      "جدید این هفته",
    "dash.vs_last":       "+۸ نسبت به قبل",
    "dash.recent_jobs":   "وظایف اخیر",
    "dash.view_all":      "مشاهده همه",
    "dash.by_source":     "وظایف بر اساس منبع",
    "dash.alerts_title":  "هشدار روزانه وظایف",
    "dash.alerts_desc":   "هر روز ساعت ۸ صبح تازه‌ترین وظایف افغانستان به تلگرام شما فرستاده می‌شود.",
    "dash.open_bot":      "باز کردن @Kar_Jo_Bot",
    "dash.quick_links":   "لینک‌های سریع",
    "dash.browse_all":    "مشاهده همه وظایف",
    "dash.saved_link":    "وظایف ذخیره‌شده",
    "dash.applied_link":  "وظایف درخواست‌شده",

    // Profile page
    "profile.account":        "حساب",
    "profile.title":          "پروفایل من",
    "profile.subtitle":       "اطلاعات شخصی و تنظیمات خود را مدیریت کنید",
    "profile.your_name":      "نام شما",
    "profile.full_name":      "نام کامل",
    "profile.full_name_ph":   "نام کامل شما",
    "profile.email":          "ایمیل",
    "profile.phone":          "شماره تلفن",
    "profile.province":       "ولایت",
    "profile.select_prov":    "ولایت را انتخاب کنید",
    "profile.headline":       "عنوان شغلی",
    "profile.headline_ph":    "مثال: توسعه‌دهنده فرانت‌اند",
    "profile.skills":         "مهارت‌ها",
    "profile.skills_ph":      "مثال: React، Node.js، مدیریت پروژه",
    "profile.company_name":   "نام شرکت",
    "profile.company_name_ph":"نام شرکت شما",
    "profile.company_web":    "وب‌سایت شرکت",
    "profile.company_web_ph": "https://yourcompany.com",
    "profile.telegram":       "نام کاربری تلگرام",
    "profile.telegram_ph":    "نام کاربری (بدون @)",
    "profile.telegram_hint":  "حساب @Kar_Jo_Bot خود را برای همگام‌سازی لینک کنید.",
    "profile.save":           "ذخیره تغییرات",
    "profile.saving":         "در حال ذخیره...",
    "profile.saved":          "ذخیره شد",
    "profile.job_seeker":     "کارجو",
    "profile.employer":       "کارفرما",
    "profile.admin":          "مدیر",

    // Saved page
    "saved.your_list":  "لیست شما",
    "saved.title":      "وظایف ذخیره‌شده",
    "saved.loading":    "در حال بارگذاری...",
    "saved.count":      "وظیفه ذخیره‌شده",
    "saved.count_one":  "وظیفه ذخیره‌شده",
    "saved.empty_title":"هنوز وظیفه‌ای ذخیره نشده",
    "saved.empty_sub":  "وظایفی که علاقه دارید را نشانه‌گذاری کنید تا اینجا نمایش داده شوند.",
    "saved.browse":     "جستجوی وظایف",

    // Applied page
    "applied.your_list":  "لیست شما",
    "applied.title":      "وظایف درخواست‌شده",
    "applied.loading":    "در حال بارگذاری...",
    "applied.count":      "وظیفه درخواست‌شده",
    "applied.count_one":  "وظیفه درخواست‌شده",
    "applied.empty_title":"هنوز وظیفه‌ای درخواست نشده",
    "applied.empty_sub":  "وظایفی که برایشان درخواست داده‌اید را علامت‌گذاری کنید تا اینجا پیگیری شوند.",
    "applied.browse":     "جستجوی وظایف",

    // Login page
    "login.welcome":      "خوش آمدید",
    "login.title":        "ورود به کارجو",
    "login.google":       "ادامه با گوگل",
    "login.or":           "یا",
    "login.email_ph":     "آدرس ایمیل",
    "login.password_ph":  "رمز عبور",
    "login.logging_in":   "در حال ورود...",
    "login.submit":       "ورود",
    "login.no_account":   "حساب ندارید؟",
    "login.signup":       "ثبت‌نام",

    // Signup page
    "signup.get_started":   "شروع کنید",
    "signup.title":         "ایجاد حساب کاربری",
    "signup.job_seeker":    "کارجو",
    "signup.employer":      "کارفرما",
    "signup.google":        "ادامه با گوگل",
    "signup.google_note":   "ثبت‌نام با گوگل همیشه یک حساب کارجو ایجاد می‌کند",
    "signup.or":            "یا",
    "signup.name_ph":       "نام کامل",
    "signup.email_ph":      "آدرس ایمیل",
    "signup.password_ph":   "رمز عبور (حداقل ۶ کاراکتر)",
    "signup.creating":      "در حال ایجاد حساب...",
    "signup.as_employer":   "ثبت‌نام به عنوان کارفرما",
    "signup.as_seeker":     "ثبت‌نام به عنوان کارجو",
    "signup.have_account":  "قبلاً حساب دارید؟",
    "signup.login":         "ورود",
    "signup.check_email":   "ایمیل خود را بررسی کنید",
    "signup.email_sent":    "یک لینک تأیید به",
    "signup.email_note":    "فرستادیم. روی آن کلیک کنید تا حسابتان فعال شود، سپس وارد شوید.",
    "signup.back_login":    "بازگشت به ورود",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = localStorage.getItem("karjo_lang") as Lang | null;
    if (saved === "en" || saved === "fa") setLangState(saved);
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir  = lang === "fa" ? "rtl" : "ltr";
  }, [lang]);

  function setLang(l: Lang) {
    setLangState(l);
    localStorage.setItem("karjo_lang", l);
  }

  function t(key: string): string {
    return translations[lang][key] ?? translations["en"][key] ?? key;
  }

  const dir = lang === "fa" ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within LanguageProvider");
  return ctx;
}
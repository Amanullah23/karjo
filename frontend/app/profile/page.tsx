"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Briefcase, Tag, Send, Building2, Globe, Save, Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useLang } from "@/lib/language-context";

const provinces = [
  "Kabul", "Herat", "Kandahar", "Balkh", "Nangarhar", "Kunduz", "Bamyan",
  "Badakhshan", "Baghlan", "Daikundi", "Farah", "Faryab", "Ghazni", "Ghor",
  "Helmand", "Jowzjan", "Khost", "Kunar", "Laghman", "Logar", "Nimroz",
  "Nuristan", "Paktia", "Paktika", "Panjshir", "Parwan", "Samangan",
  "Sar-e Pol", "Takhar", "Urozgan", "Wardak", "Zabul", "Badghis", "Kapisa",
];

function ProfileContent() {
  const { user, profile, refreshProfile } = useAuth();
  const { t } = useLang();

  const [fullName,        setFullName]        = useState("");
  const [phone,           setPhone]           = useState("");
  const [province,        setProvince]        = useState("");
  const [headline,        setHeadline]        = useState("");
  const [skills,          setSkills]          = useState("");
  const [telegram,        setTelegram]        = useState("");
  const [companyName,     setCompanyName]     = useState("");
  const [companyWebsite,  setCompanyWebsite]  = useState("");
  const [saving,          setSaving]          = useState(false);
  const [saved,           setSaved]           = useState(false);
  const [error,           setError]           = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setPhone(profile.phone ?? "");
      setProvince(profile.province ?? "");
      setHeadline(profile.headline ?? "");
      setSkills(profile.skills ?? "");
      setTelegram(profile.telegram_username ?? "");
      setCompanyName(profile.company_name ?? "");
      setCompanyWebsite(profile.company_website ?? "");
    }
  }, [profile]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    setSaved(false);

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone,
        province,
        headline,
        skills,
        telegram_username: telegram,
        company_name:    profile?.role === "employer" ? companyName    : null,
        company_website: profile?.role === "employer" ? companyWebsite : null,
      })
      .eq("id", user.id);

    setSaving(false);
    if (error) {
      setError(error.message);
    } else {
      setSaved(true);
      await refreshProfile();
      setTimeout(() => setSaved(false), 2500);
    }
  }

  const isEmployer = profile?.role === "employer";

  const roleLabel =
    profile?.role === "admin"    ? t("profile.admin") :
    profile?.role === "employer" ? t("profile.employer") :
    t("profile.job_seeker");

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">

        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald mb-1">{t("profile.account")}</p>
          <h1 className="font-display text-4xl font-bold text-navy mb-2">{t("profile.title")}</h1>
          <p className="text-charcoal/60 text-sm">{t("profile.subtitle")}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-warm-gray rounded-2xl p-8"
        >
          {/* Avatar row */}
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-warm-gray">
            <span className="w-16 h-16 rounded-full bg-navy text-white text-2xl font-bold flex items-center justify-center shrink-0">
              {(fullName || user?.email || "?").charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="font-display text-xl font-bold text-navy">{fullName || t("profile.your_name")}</p>
              <p className="text-sm text-warm-muted">{user?.email}</p>
              <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald bg-emerald/10 px-2 py-0.5 rounded-full">
                {isEmployer && <Building2 size={10} />}
                {roleLabel}
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">

            {/* Full name */}
            <div>
              <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-2">{t("profile.full_name")}</label>
              <div className="relative">
                <User size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full ps-10 pe-4 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal"
                  placeholder={t("profile.full_name_ph")}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-2">{t("profile.email")}</label>
              <div className="relative">
                <Mail size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
                <input
                  value={user?.email ?? ""}
                  disabled
                  className="w-full ps-10 pe-4 py-2.5 text-sm border border-warm-gray rounded-xl bg-cream text-warm-muted cursor-not-allowed"
                />
              </div>
            </div>

            {/* Phone + Province */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-2">{t("profile.phone")}</label>
                <div className="relative">
                  <Phone size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07XXXXXXXX"
                    className="w-full ps-10 pe-4 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-2">{t("profile.province")}</label>
                <div className="relative">
                  <MapPin size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full ps-10 pe-4 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal bg-white appearance-none"
                  >
                    <option value="">{t("profile.select_prov")}</option>
                    {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Job seeker fields */}
            {!isEmployer && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-2">{t("profile.headline")}</label>
                  <div className="relative">
                    <Briefcase size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
                    <input
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder={t("profile.headline_ph")}
                      className="w-full ps-10 pe-4 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-2">{t("profile.skills")}</label>
                  <div className="relative">
                    <Tag size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
                    <input
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder={t("profile.skills_ph")}
                      className="w-full ps-10 pe-4 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Employer fields */}
            {isEmployer && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-2">{t("profile.company_name")}</label>
                  <div className="relative">
                    <Building2 size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
                    <input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder={t("profile.company_name_ph")}
                      className="w-full ps-10 pe-4 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-2">{t("profile.company_web")}</label>
                  <div className="relative">
                    <Globe size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
                    <input
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      placeholder={t("profile.company_web_ph")}
                      className="w-full ps-10 pe-4 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Telegram */}
            <div>
              <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-2">{t("profile.telegram")}</label>
              <div className="relative">
                <Send size={16} className="absolute start-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
                <input
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value.replace("@", ""))}
                  placeholder={t("profile.telegram_ph")}
                  className="w-full ps-10 pe-4 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal"
                />
              </div>
              <p className="text-xs text-warm-muted mt-1.5">{t("profile.telegram_hint")}</p>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-navy text-white rounded-xl py-3 text-sm font-semibold hover:bg-navy/90 transition-all disabled:opacity-60"
            >
              {saved ? (
                <><Check size={16} /> {t("profile.saved")}</>
              ) : saving ? (
                t("profile.saving")
              ) : (
                <><Save size={16} /> {t("profile.save")}</>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
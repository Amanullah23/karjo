"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Briefcase, Tag, Send, Building2, Globe, Save, Check } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import ProtectedRoute from "@/components/ProtectedRoute";

const provinces = [
  "Kabul", "Herat", "Kandahar", "Balkh", "Nangarhar", "Kunduz", "Bamyan",
  "Badakhshan", "Baghlan", "Daikundi", "Farah", "Faryab", "Ghazni", "Ghor",
  "Helmand", "Jowzjan", "Khost", "Kunar", "Laghman", "Logar", "Nimroz",
  "Nuristan", "Paktia", "Paktika", "Panjshir", "Parwan", "Samangan",
  "Sar-e Pol", "Takhar", "Urozgan", "Wardak", "Zabul", "Badghis", "Kapisa",
];

function ProfileContent() {
  const { user, profile, refreshProfile } = useAuth();

  const [fullName, setFullName]   = useState("");
  const [phone, setPhone]         = useState("");
  const [province, setProvince]   = useState("");
  const [headline, setHeadline]   = useState("");
  const [skills, setSkills]       = useState("");
  const [telegram, setTelegram]   = useState("");
  const [companyName, setCompanyName] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");

  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [error, setError]   = useState<string | null>(null);

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
        company_name: profile?.role === "employer" ? companyName : null,
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

  return (
    <div className="min-h-screen bg-cream pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">

        <div className="mb-8">
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald mb-1">Account</p>
          <h1 className="font-display text-4xl font-bold text-navy mb-2">My Profile</h1>
          <p className="text-charcoal/60 text-sm">Manage your personal information and preferences</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white border border-warm-gray rounded-2xl p-8"
        >
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-warm-gray">
            <span className="w-16 h-16 rounded-full bg-navy text-white text-2xl font-bold flex items-center justify-center shrink-0">
              {(fullName || user?.email || "?").charAt(0).toUpperCase()}
            </span>
            <div>
              <p className="font-display text-xl font-bold text-navy">{fullName || "Your name"}</p>
              <p className="text-sm text-warm-muted">{user?.email}</p>
              <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald bg-emerald/10 px-2 py-0.5 rounded-full">
                {isEmployer && <Building2 size={10} />}
                {profile?.role === "admin" ? "Admin" : isEmployer ? "Employer" : "Job Seeker"}
              </span>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">

            <div>
              <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-2">Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal"
                  placeholder="Your full name"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-2">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
                <input
                  value={user?.email ?? ""}
                  disabled
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-warm-gray rounded-xl bg-cream text-warm-muted cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-2">Phone</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="07XXXXXXXX"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-2">Province</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
                  <select
                    value={province}
                    onChange={(e) => setProvince(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal bg-white appearance-none"
                  >
                    <option value="">Select province</option>
                    {provinces.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {!isEmployer && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-2">Headline</label>
                  <div className="relative">
                    <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
                    <input
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      placeholder="e.g. Frontend Developer"
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-2">Skills</label>
                  <div className="relative">
                    <Tag size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
                    <input
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                      placeholder="e.g. React, Node.js, Project Management"
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal"
                    />
                  </div>
                </div>
              </>
            )}

            {isEmployer && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-2">Company Name</label>
                  <div className="relative">
                    <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
                    <input
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Your company name"
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-2">Company Website</label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
                    <input
                      value={companyWebsite}
                      onChange={(e) => setCompanyWebsite(e.target.value)}
                      placeholder="https://yourcompany.com"
                      className="w-full pl-10 pr-4 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-2">Telegram Username</label>
              <div className="relative">
                <Send size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-warm-muted" />
                <input
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value.replace("@", ""))}
                  placeholder="username (without @)"
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal"
                />
              </div>
              <p className="text-xs text-warm-muted mt-1.5">Link your @Kar_Jo_Bot account for future sync.</p>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 bg-navy text-white rounded-xl py-3 text-sm font-semibold hover:bg-navy/90 transition-all disabled:opacity-60"
            >
              {saved ? (<><Check size={16} /> Saved</>) : saving ? "Saving..." : (<><Save size={16} /> Save Changes</>)}
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
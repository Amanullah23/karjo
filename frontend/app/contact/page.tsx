"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  MessageCircle,
  Globe,
  Mail,
  Send,
  User,
  CheckCircle2,
} from "lucide-react";
import { useLang } from "@/lib/language-context";
import { supabase } from "@/lib/supabase";

// ⚠️ Replace these with your real details:
const WHATSAPP_NUMBER = "93787484323"; // international format, no + or spaces
const CONTACT_EMAIL = "amanyawari220@gmail.com"; // your email
const PORTFOLIO_URL = "https://yawari.vercel.app";

const copy = {
  en: {
    tag: "Get in touch",
    title: "Contact Us",
    subtitle:
      "Questions, feedback, or partnership ideas? We'd love to hear from you.",
    whatsapp: "WhatsApp",
    whatsapp_desc: "Chat with us directly",
    location: "Location",
    location_desc: "Kabul, Afghanistan",
    portfolio: "Developer",
    portfolio_desc: "View portfolio",
    email: "Email",
    form_title: "Send a message",
    name_ph: "Your name",
    email_ph: "Your email",
    subject_ph: "Subject",
    message_ph: "Write your message...",
    submit: "Send message",
    sending: "Sending...",
    success: "Message sent! We'll get back to you soon.",
    error: "Something went wrong. Please try again.",
  },
  fa: {
    tag: "در تماس باشید",
    title: "تماس با ما",
    subtitle:
      "سوال، نظر یا پیشنهاد همکاری دارید؟ خوشحال می‌شویم از شما بشنویم.",
    whatsapp: "واتساپ",
    whatsapp_desc: "مستقیم با ما گفتگو کنید",
    location: "موقعیت",
    location_desc: "کابل، افغانستان",
    portfolio: "توسعه‌دهنده",
    portfolio_desc: "مشاهده نمونه کارها",
    email: "ایمیل",
    form_title: "ارسال پیام",
    name_ph: "نام شما",
    email_ph: "ایمیل شما",
    subject_ph: "موضوع",
    message_ph: "پیام خود را بنویسید...",
    submit: "ارسال پیام",
    sending: "در حال ارسال...",
    success: "پیام ارسال شد! به زودی با شما تماس می‌گیریم.",
    error: "مشکلی پیش آمد. لطفاً دوباره تلاش کنید.",
  },
};

export default function ContactPage() {
  const { lang } = useLang();
  const t = copy[lang === "fa" ? "fa" : "en"];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      subject,
      message,
    });
    if (error) {
      console.error("[Contact] insert error:", error);
      setStatus("error");
    } else {
      setStatus("sent");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    }
  }

  const infoCards = [
    {
      icon: <MessageCircle size={20} className="text-emerald" />,
      title: t.whatsapp,
      desc: t.whatsapp_desc,
      href: `https://wa.me/${WHATSAPP_NUMBER}`,
      external: true,
    },
    {
      icon: <MapPin size={20} className="text-emerald" />,
      title: t.location,
      desc: t.location_desc,
      href: "https://maps.google.com/?q=Kabul,Afghanistan",
      external: true,
    },
    {
      icon: <Globe size={20} className="text-emerald" />,
      title: t.portfolio,
      desc: t.portfolio_desc,
      href: PORTFOLIO_URL,
      external: true,
    },
    {
      icon: <Mail size={20} className="text-emerald" />,
      title: t.email,
      desc: CONTACT_EMAIL,
      href: `mailto:${CONTACT_EMAIL}`,
      external: false,
    },
  ];

  return (
    <div className="min-h-screen bg-cream px-4 sm:px-6 pt-24 pb-16">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-10"
        >
          <p className="text-xs font-semibold tracking-widest uppercase text-emerald mb-2">
            {t.tag}
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-navy mb-3">
            {t.title}
          </h1>
          <p className="text-sm text-warm-muted max-w-md mx-auto">
            {t.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Info cards */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-3"
          >
            {infoCards.map((card) => (
              <a
                key={card.title}
                href={card.href}
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noopener noreferrer" : undefined}
                className="flex items-center gap-4 bg-white border border-warm-gray rounded-2xl p-4 hover:border-navy hover:shadow-md transition-all"
              >
                <span className="w-11 h-11 rounded-xl bg-emerald/10 flex items-center justify-center shrink-0">
                  {card.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-navy">
                    {card.title}
                  </p>
                  <p className="text-xs text-warm-muted truncate">
                    {card.desc}
                  </p>
                </div>
              </a>
            ))}
          </motion.div>

          {/* Contact form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="md:col-span-3 bg-white border border-warm-gray rounded-2xl p-6 sm:p-8"
          >
            <h2 className="font-display text-xl font-bold text-navy mb-5">
              {t.form_title}
            </h2>

            {status === "sent" ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <CheckCircle2 size={40} className="text-emerald mb-3" />
                <p className="text-sm font-medium text-charcoal">{t.success}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 text-warm-muted"
                    />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t.name_ph}
                      className="w-full ps-10 pe-4 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal placeholder:text-warm-muted"
                    />
                  </div>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute inset-s-3.5 top-1/2 -translate-y-1/2 text-warm-muted"
                    />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t.email_ph}
                      className="w-full ps-10 pe-4 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal placeholder:text-warm-muted"
                    />
                  </div>
                </div>

                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder={t.subject_ph}
                  className="w-full px-4 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal placeholder:text-warm-muted"
                />

                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.message_ph}
                  className="w-full px-4 py-2.5 text-sm border border-warm-gray rounded-xl focus:outline-none focus:border-navy text-charcoal placeholder:text-warm-muted resize-none"
                />

                {status === "error" && (
                  <p className="text-sm text-red-600">{t.error}</p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-navy text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-navy/90 transition-all disabled:opacity-60"
                >
                  <Send size={15} />
                  {status === "sending" ? t.sending : t.submit}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";

function DownloadIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#1B2E4B] border-t border-white/10">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-bold">
                <span className="text-white">Kar</span><span className="text-[#059669]">Jo</span>
              </span>
              <span className="text-xs text-[#059669] font-medium bg-emerald-900/30 px-2 py-0.5 rounded-full border border-emerald-800">
                کارجو
              </span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Afghanistan&apos;s job platform — connecting talent with opportunity across the country.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Quick links</h3>
            <ul className="space-y-2.5">
              {[
                { label: "Home",         href: "/" },
                { label: "Browse jobs",  href: "/jobs" },
                { label: "Download app", href: "/download" },
                { label: "Contact us",   href: "/contact" },
              ].map((l) => (
                <li key={l.label}>
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
            <h3 className="text-sm font-semibold text-white mb-4">Get the app</h3>
            <p className="text-sm text-gray-400 mb-4">
              Available on Android. iOS coming soon.
            </p>
            <Link
              href="/download"
              className="inline-flex items-center gap-2 bg-[#059669] text-white text-sm px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors"
            >
              <DownloadIcon />
              Download APK
            </Link>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">
            {new Date().getFullYear()} KarJo · کارجو. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {[
              { label: "Privacy", href: "/privacy" },
              { label: "Terms",   href: "/terms" },
            ].map((l) => (
              <Link
                key={l.label}
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
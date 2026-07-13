"use client";

import { Job } from "@/types";
import { Bookmark, BookmarkCheck, ExternalLink, MapPin, Calendar, Building2 } from "lucide-react";
import Link from "next/link";

interface JobCardProps {
  job: Job;
  onSave?: (id: string) => void;
  onApply?: (id: string) => void;
  saved?: boolean;
  applied?: boolean;
}

const sourceColors: Record<string, string> = {
  "jobs.af":  "bg-blue-50 text-blue-700 border-blue-200",
  "acbar.org":"bg-purple-50 text-purple-700 border-purple-200",
  "LinkedIn": "bg-sky-50 text-sky-700 border-sky-200",
};

const sourceLabels: Record<string, string> = {
  "jobs.af":  "jobs.af",
  "acbar.org":"ACBAR",
  "LinkedIn": "LinkedIn",
};

export default function JobCard({ job, onSave, onApply, saved, applied }: JobCardProps) {
  const skills = job.skills?.split(",").map((s) => s.trim()).filter(Boolean) || [];
  const sourceColor = sourceColors[job.source] || "bg-gray-50 text-gray-700 border-gray-200";
  const sourceLabel = sourceLabels[job.source] || job.source;

  return (
    <div className={`group bg-white rounded-2xl border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
      applied ? "border-emerald/30 bg-emerald-light/20" : "border-warm-gray"
    }`}>
      <div className="p-5">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            {/* Source badge */}
            <span className={`inline-block text-[11px] font-semibold border px-2 py-0.5 rounded-full mb-2 ${sourceColor}`}>
              {sourceLabel}
            </span>
            {/* Title */}
            <h3 className="font-display font-bold text-navy text-base leading-snug mb-1 group-hover:text-emerald transition-colors">
              {job.title}
            </h3>
            {/* Company */}
            <div className="flex items-center gap-1.5 text-warm-muted text-xs">
              <Building2 size={12} />
              {job.company}
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={() => onSave?.(job.id)}
            className={`shrink-0 p-2 rounded-xl transition-all ${
              saved
                ? "bg-navy text-white"
                : "bg-cream text-warm-muted hover:bg-navy hover:text-white"
            }`}
          >
            {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          </button>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {skills.slice(0, 3).map((skill) => (
              <span key={skill} className="text-[11px] font-medium bg-cream text-charcoal border border-warm-gray px-2 py-0.5 rounded-md">
                {skill}
              </span>
            ))}
            {skills.length > 3 && (
              <span className="text-[11px] text-warm-muted px-2 py-0.5">
                +{skills.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-3 border-t border-warm-gray">
          <div className="flex items-center gap-1.5 text-warm-muted text-xs">
            <Calendar size={12} />
            {new Date(job.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>

          <div className="flex items-center gap-2">
            {applied ? (
              <span className="text-xs font-semibold text-emerald bg-emerald-light px-3 py-1.5 rounded-lg">
                ✓ Applied
              </span>
            ) : (
              <button
                onClick={() => onApply?.(job.id)}
                className="text-xs font-semibold text-emerald border border-emerald/30 hover:bg-emerald hover:text-white px-3 py-1.5 rounded-lg transition-all"
              >
                Mark Applied
              </button>
            )}
            <Link
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs font-semibold bg-navy text-white px-3 py-1.5 rounded-lg hover:bg-navy/90 transition-all"
            >
              View <ExternalLink size={11} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
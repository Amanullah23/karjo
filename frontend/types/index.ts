export interface Job {
  id: string;
  title: string;
  company: string;
  skills: string;
  date: string;
  url: string;
  source: "jobs.af" | "acbar.org" | "LinkedIn" | string;
  created_at: string;
  saved?: boolean;
  applied?: boolean;
  posted_by?: string | null;
  description?: string | null;
  location?: string | null;
  expire_date?: string | null;
  status?: "pending" | "approved" | string;
}

export type JobCategory =
  | "all"
  | "technology"
  | "ngo"
  | "education"
  | "health"
  | "finance"
  | "engineering"
  | "other";

export type JobSource = "all" | "jobs.af" | "acbar.org" | "LinkedIn";

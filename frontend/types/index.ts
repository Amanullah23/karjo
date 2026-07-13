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
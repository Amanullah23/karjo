import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def save_jobs(jobs: list[dict]) -> int:
    """Save new jobs to Supabase, skip duplicates. Returns count of new jobs saved."""
    new_count = 0
    for job in jobs:
        try:
            # Check if job already exists by title + company + source
            existing = (
                supabase.table("jobs")
                .select("id")
                .eq("title", job["title"])
                .eq("company", job["company"])
                .eq("source", job["source"])
                .execute()
            )
            if existing.data:
                continue  # skip duplicate

            supabase.table("jobs").insert({
                "title":   job["title"],
                "company": job["company"],
                "skills":  job["skills"],
                "date":    job["date"],
                "url":     job["url"],
                "source":  job["source"],
            }).execute()
            new_count += 1
        except Exception as e:
            print(f"[DB] Error saving job '{job.get('title')}': {e}")
    return new_count


def get_latest_jobs(limit: int = 20) -> list[dict]:
    """Get latest jobs from Supabase ordered by created_at."""
    try:
        res = (
            supabase.table("jobs")
            .select("*")
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )
        return res.data or []
    except Exception as e:
        print(f"[DB] Error fetching jobs: {e}")
        return []


def get_todays_jobs() -> list[dict]:
    """Get only today's newly scraped jobs."""
    from datetime import date
    today = date.today().isoformat()
    try:
        res = (
            supabase.table("jobs")
            .select("*")
            .gte("created_at", f"{today}T00:00:00")
            .order("created_at", desc=True)
            .execute()
        )
        return res.data or []
    except Exception as e:
        print(f"[DB] Error fetching today's jobs: {e}")
        return []
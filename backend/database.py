import os
import requests
from datetime import datetime, date
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

BASE = f"{SUPABASE_URL}/rest/v1"


def save_jobs(jobs: list[dict]) -> int:
    """Save new jobs to Supabase, skip duplicates. Returns count of new jobs saved."""
    new_count = 0
    for job in jobs:
        try:
            # Check if already exists
            res = requests.get(
                f"{BASE}/jobs",
                headers=HEADERS,
                params={
                    "title": f"eq.{job['title']}",
                    "company": f"eq.{job['company']}",
                    "source": f"eq.{job['source']}",
                    "select": "id",
                },
            )
            if res.json():
                continue  # skip duplicate

            # Insert new job
            requests.post(
                f"{BASE}/jobs",
                headers=HEADERS,
                json={
                    "title":   job["title"],
                    "company": job["company"],
                    "skills":  job["skills"],
                    "date":    job["date"],
                    "url":     job["url"],
                    "source":  job["source"],
                },
            )
            new_count += 1
        except Exception as e:
            print(f"[DB] Error saving job '{job.get('title')}': {e}")
    return new_count


def get_latest_jobs(limit: int = 20) -> list[dict]:
    """Get latest jobs ordered by created_at."""
    try:
        res = requests.get(
            f"{BASE}/jobs",
            headers=HEADERS,
            params={
                "order": "created_at.desc",
                "limit": limit,
                "select": "*",
            },
        )
        return res.json() or []
    except Exception as e:
        print(f"[DB] Error fetching jobs: {e}")
        return []


def get_todays_jobs() -> list[dict]:
    """Get only today's jobs."""
    today = date.today().isoformat()
    try:
        res = requests.get(
            f"{BASE}/jobs",
            headers=HEADERS,
            params={
                "created_at": f"gte.{today}T00:00:00",
                "order": "created_at.desc",
                "select": "*",
            },
        )
        return res.json() or []
    except Exception as e:
        print(f"[DB] Error fetching today's jobs: {e}")
        return []
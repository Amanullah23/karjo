import os
import logging
import requests
from datetime import datetime, date
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

BASE = f"{SUPABASE_URL}/rest/v1"


def _safe_list(res: requests.Response, context: str) -> list[dict]:
    """Parse a Supabase response, guaranteeing a list of dicts or [] — never crashes the caller."""
    try:
        data = res.json()
    except ValueError:
        logger.error(f"[DB] {context}: non-JSON response (status {res.status_code}): {res.text[:300]}")
        return []

    if isinstance(data, list):
        return data

    # Supabase returns a dict on errors (bad key, bad URL, RLS denial, etc.)
    logger.error(f"[DB] {context}: expected a list, got {type(data).__name__} (status {res.status_code}): {data}")
    return []


def save_jobs(jobs: list[dict]) -> int:
    """Save new jobs to Supabase, skip duplicates. Returns count of new jobs saved."""
    new_count = 0
    for job in jobs:
        try:
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
            existing = _safe_list(res, "save_jobs duplicate check")
            if existing:
                continue  # skip duplicate

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
            logger.error(f"[DB] Error saving job '{job.get('title')}': {e}")
    return new_count


def get_latest_jobs(limit: int = 20) -> list[dict]:
    """Get latest jobs ordered by created_at."""
    try:
        res = requests.get(
            f"{BASE}/jobs",
            headers=HEADERS,
            params={"order": "created_at.desc", "limit": limit, "select": "*"},
        )
        return _safe_list(res, "get_latest_jobs")
    except Exception as e:
        logger.error(f"[DB] Error fetching jobs: {e}")
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
        return _safe_list(res, "get_todays_jobs")
    except Exception as e:
        logger.error(f"[DB] Error fetching today's jobs: {e}")
        return []
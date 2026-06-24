import os
import logging
import requests
from datetime import datetime, date
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

SUPABASE_URL         = os.getenv("SUPABASE_URL")
SUPABASE_KEY         = os.getenv("SUPABASE_KEY")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_KEY", SUPABASE_KEY)

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

# Service role headers — bypasses RLS, used only for bot user management
SERVICE_HEADERS = {
    "apikey": SUPABASE_SERVICE_KEY,
    "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal",
}

BASE = f"{SUPABASE_URL}/rest/v1"


def _safe_list(res: requests.Response, context: str) -> list[dict]:
    try:
        data = res.json()
    except ValueError:
        logger.error(f"[DB] {context}: non-JSON response (status {res.status_code}): {res.text[:300]}")
        return []
    if isinstance(data, list):
        return data
    logger.error(f"[DB] {context}: expected list, got {type(data).__name__} (status {res.status_code}): {data}")
    return []


# ── User / Language ────────────────────────────────────────────────────────────

def get_user_language(telegram_id: int) -> str:
    """Return 'fa' or 'en' for a telegram user. Defaults to 'en' if not found."""
    try:
        res = requests.get(
            f"{BASE}/bot_users",
            headers=HEADERS,
            params={
                "telegram_id": f"eq.{telegram_id}",
                "select": "language",
                "limit": 1,
            },
        )
        rows = _safe_list(res, "get_user_language")
        if rows:
            return rows[0].get("language", "en")
    except Exception as e:
        logger.error(f"[DB] get_user_language error: {e}")
    return "en"


def save_user_language(telegram_id: int, username: str | None, language: str):
    """Upsert user row with telegram_id and language preference into bot_users table."""
    try:
        upsert_res = requests.post(
            f"{BASE}/bot_users",
            headers={**HEADERS, "Prefer": "resolution=merge-duplicates,return=minimal"},
            json={
                "telegram_id": telegram_id,
                "telegram_username": username or "",
                "language": language,
            },
        )
        logger.info(f"[DB] Upserted bot_user telegram_id {telegram_id} lang '{language}' — status {upsert_res.status_code}: {upsert_res.text[:200]}")
    except Exception as e:
        logger.error(f"[DB] save_user_language error: {e}")

# ── Bot Users ─────────────────────────────────────────────────────────────────

def get_all_active_users() -> list[dict]:
    """Return all active bot users with their language preference."""
    try:
        res = requests.get(
            f"{BASE}/bot_users",
            headers=HEADERS,
            params={
                "is_active": "eq.true",
                "select": "telegram_id,language",
            },
        )
        return _safe_list(res, "get_all_active_users")
    except Exception as e:
        logger.error(f"[DB] get_all_active_users error: {e}")
        return []


def deactivate_user(telegram_id: int):
    """Mark user as inactive (they blocked the bot)."""
    try:
        requests.patch(
            f"{BASE}/bot_users",
            headers=HEADERS,
            params={"telegram_id": f"eq.{telegram_id}"},
            json={"is_active": False},
        )
        logger.info(f"[DB] Deactivated user {telegram_id}")
    except Exception as e:
        logger.error(f"[DB] deactivate_user error: {e}")

        
# ── Jobs ───────────────────────────────────────────────────────────────────────

def save_jobs(jobs: list[dict]) -> int:
    new_count = 0
    for job in jobs:
        try:
            res = requests.get(
                f"{BASE}/jobs",
                headers=HEADERS,
                params={
                    "title":   f"eq.{job['title']}",
                    "company": f"eq.{job['company']}",
                    "source":  f"eq.{job['source']}",
                    "select":  "id",
                },
            )
            if _safe_list(res, "save_jobs duplicate check"):
                continue
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
    today = date.today().isoformat()
    try:
        res = requests.get(
            f"{BASE}/jobs",
            headers=HEADERS,
            params={
                "created_at": f"gte.{today}T00:00:00",
                "order":      "created_at.desc",
                "select":     "*",
            },
        )
        return _safe_list(res, "get_todays_jobs")
    except Exception as e:
        logger.error(f"[DB] Error fetching today's jobs: {e}")
        return []
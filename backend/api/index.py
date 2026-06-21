import os
import sys
import logging
from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, Header, HTTPException
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

from scraper import collect_all_jobs
from database import save_jobs, get_latest_jobs, get_todays_jobs

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO
)
logger = logging.getLogger(__name__)

BOT_TOKEN   = os.getenv("BOT_TOKEN")
CHAT_ID_RAW = os.getenv("CHAT_ID")
CRON_SECRET = os.getenv("CRON_SECRET")  # set this in Vercel to secure the digest endpoint

missing = [name for name, val in [("BOT_TOKEN", BOT_TOKEN), ("CHAT_ID", CHAT_ID_RAW)] if not val]
if missing:
    logger.error(f"Missing required environment variable(s): {', '.join(missing)}")
    sys.exit(1)

try:
    CHAT_ID = int(CHAT_ID_RAW)
except ValueError:
    logger.error(f"CHAT_ID must be numeric. Got: '{CHAT_ID_RAW}'")
    sys.exit(1)

telegram_app = Application.builder().token(BOT_TOKEN).build()


def format_job_message(jobs: list[dict], title: str) -> list[str]:
    if not jobs:
        return [
            "*KarJo*\n"
            "No new jobs found right now — check back soon.\n\n"
            "Browse all listings: https://karjo.vercel.app/jobs"
        ]

    messages = []
    header = (
        f"*💼 {title}*\n"
        f"{datetime.now().strftime('%A, %d %B %Y')}  ·  {len(jobs)} opportunities\n"
        f"{'─' * 28}\n\n"
    )
    current = header

    for i, job in enumerate(jobs, start=1):
        source = job.get("source", "Job")
        block = (
            f"*{i}. {job.get('title', 'N/A')}*\n"
            f"{job.get('company', 'N/A')}\n"
            f"{source}  ·  {job.get('skills', 'N/A')}\n"
            f"[Apply →]({job.get('url', '#')})\n\n"
        )
        if len(current) + len(block) > 3800:
            messages.append(current.rstrip())
            current = block
        else:
            current += block

    if current:
        messages.append(current.rstrip())

    messages[-1] += f"\n\n{'─' * 28}\nkarjo.vercel.app  ·  @Kar_Jo_Bot"
    return messages


# ── Commands ──────────────────────────────────────────────────────────────────
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "👋 *Welcome to KarJo — کارجو\\!*\n\n"
        "Your personal Afghan job finder bot 🇦🇫\n\n"
        "Commands:\n"
        "• /jobs — Latest 20 jobs\n"
        "• /today — Today's new jobs\n"
        "• /refresh — Scrape fresh jobs now\n"
        "• /info — About this bot\n"
        "• /help — Show all commands\n\n"
        "📬 Auto\\-delivery every morning at *8:00 AM Kabul time\\!*",
        parse_mode="MarkdownV2",
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "📋 *KarJo Commands:*\n\n"
        "/start — Welcome message\n"
        "/jobs — Latest 20 jobs\n"
        "/today — Today's new jobs\n"
        "/refresh — Scrape fresh jobs now\n"
        "/info — About this bot\n"
        "/help — Show this message\n\n"
        "🕗 Auto\\-delivery every day at *8:00 AM*",
        parse_mode="MarkdownV2",
    )

async def info_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "ℹ️ *About KarJo — کارجو*\n\n"
        "KarJo automatically scrapes the latest Afghan job listings every "
        "morning from:\n"
        "🇦🇫 jobs\\.af\n"
        "🌍 ACBAR\n"
        "💼 LinkedIn Afghanistan\n\n"
        "It's 100% free, no sign\\-up needed\\.\n\n"
        "🌐 Website: karjo\\.vercel\\.app\n"
        "👨‍💻 Built by Amanullah Yawari\n\n"
        "Type /help to see all available commands\\.",
        parse_mode="MarkdownV2",
        disable_web_page_preview=True,
    )

async def jobs_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("⏳ Fetching latest jobs for you...")
    jobs = get_latest_jobs(limit=20)
    for msg in format_job_message(jobs, "Latest Afghan Jobs"):
        await update.message.reply_text(msg, parse_mode="Markdown", disable_web_page_preview=True)

async def today_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("⏳ Fetching today's jobs...")
    jobs = get_todays_jobs()
    for msg in format_job_message(jobs, "Today's New Jobs"):
        await update.message.reply_text(msg, parse_mode="Markdown", disable_web_page_preview=True)

async def refresh_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("🔄 Scraping fresh jobs... Please wait.")
    jobs      = collect_all_jobs()
    new_count = save_jobs(jobs)
    latest    = get_latest_jobs(limit=20)
    for msg in format_job_message(latest, f"Fresh Jobs ({new_count} new found)"):
        await update.message.reply_text(msg, parse_mode="Markdown", disable_web_page_preview=True)


telegram_app.add_handler(CommandHandler("start",   start))
telegram_app.add_handler(CommandHandler("help",    help_command))
telegram_app.add_handler(CommandHandler("info",    info_command))
telegram_app.add_handler(CommandHandler("jobs",    jobs_command))
telegram_app.add_handler(CommandHandler("today",   today_command))
telegram_app.add_handler(CommandHandler("refresh", refresh_command))


# ── FastAPI app (Vercel entrypoint) ───────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    await telegram_app.initialize()
    yield
    await telegram_app.shutdown()

app = FastAPI(lifespan=lifespan)

@app.get("/api")
async def health():
    return {"status": "KarJo bot is alive"}

@app.post("/api/webhook")
async def webhook(request: Request):
    data = await request.json()
    update = Update.de_json(data, telegram_app.bot)
    await telegram_app.process_update(update)
    return {"ok": True}

@app.get("/api/daily-digest")
async def daily_digest(authorization: str = Header(None)):
    if CRON_SECRET and authorization != f"Bearer {CRON_SECRET}":
        raise HTTPException(status_code=401, detail="Unauthorized")

    logger.info("Running scheduled daily digest...")
    jobs      = collect_all_jobs()
    new_count = save_jobs(jobs)
    latest    = get_latest_jobs(limit=20)

    for msg in format_job_message(latest, f"Daily Digest ({new_count} new)"):
        await telegram_app.bot.send_message(
            chat_id=CHAT_ID, text=msg, parse_mode="Markdown", disable_web_page_preview=True
        )

    logger.info(f"Daily digest sent — {new_count} new jobs.")
    return {"ok": True, "new_jobs": new_count}
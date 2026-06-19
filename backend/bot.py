import os
import logging
from datetime import datetime
from dotenv import load_dotenv
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

from scraper import collect_all_jobs
from database import save_jobs, get_latest_jobs, get_todays_jobs

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
CHAT_ID   = int(os.getenv("CHAT_ID"))

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO
)
logger = logging.getLogger(__name__)

SOURCE_EMOJI = {
    "jobs.af":  "🇦🇫",
    "acbar.org":"🌍",
    "LinkedIn": "💼",
}

def format_job_message(jobs: list[dict], title: str) -> list[str]:
    if not jobs:
        return ["😕 No jobs found at the moment. Try again later."]

    messages = []
    header = (
        f"🔎 *{title}*\n"
        f"📅 {datetime.now().strftime('%A, %d %B %Y')}\n"
        f"{'─' * 30}\n\n"
    )
    current = header

    for job in jobs:
        emoji   = SOURCE_EMOJI.get(job.get("source", ""), "📌")
        block = (
            f"{emoji} *{job.get('title', 'N/A')}*\n"
            f"🏢 {job.get('company', 'N/A')}\n"
            f"🛠 {job.get('skills', 'N/A')}\n"
            f"📆 {job.get('date', 'N/A')}\n"
            f"🔗 [View Job]({job.get('url', '#')})\n"
            f"━━━━━━━━━━━━━━━━━━━━\n\n"
        )
        if len(current) + len(block) > 3800:
            messages.append(current)
            current = block
        else:
            current += block

    if current:
        messages.append(current)

    messages[-1] += f"\n✅ Powered by KarJo 🚀"
    return messages


# ── Commands ───────────────────────────────────────────────────────────────────
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "👋 *Welcome to KarJo — کارجو\\!*\n\n"
        "Your personal Afghan job finder bot 🇦🇫\n\n"
        "Commands:\n"
        "• /jobs — Latest 20 jobs\n"
        "• /today — Today's new jobs\n"
        "• /refresh — Scrape fresh jobs now\n"
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
        "/help — Show this message\n\n"
        "🕗 Auto\\-delivery every day at *8:00 AM*",
        parse_mode="MarkdownV2",
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


# ── Daily auto-send using JobQueue ────────────────────────────────────────────
async def daily_job_send(context: ContextTypes.DEFAULT_TYPE):
    logger.info("⏰ Running daily job scrape...")
    jobs      = collect_all_jobs()
    new_count = save_jobs(jobs)
    latest    = get_latest_jobs(limit=20)
    for msg in format_job_message(latest, f"☀️ Daily Job Digest ({new_count} new)"):
        await context.bot.send_message(
            chat_id=CHAT_ID,
            text=msg,
            parse_mode="Markdown",
            disable_web_page_preview=True,
        )
    logger.info(f"✅ Daily digest sent — {new_count} new jobs saved.")


# ── Main ───────────────────────────────────────────────────────────────────────
def main():
    app = Application.builder().token(BOT_TOKEN).build()

    # Register commands
    app.add_handler(CommandHandler("start",   start))
    app.add_handler(CommandHandler("help",    help_command))
    app.add_handler(CommandHandler("jobs",    jobs_command))
    app.add_handler(CommandHandler("today",   today_command))
    app.add_handler(CommandHandler("refresh", refresh_command))

    # Daily job at 08:00 AM Kabul time (UTC+4:30 = 03:30 UTC)
    app.job_queue.run_daily(
        daily_job_send,
        time=datetime.strptime("08:00", "%H:%M").time(),
        job_kwargs={"misfire_grace_time": 60},
    )

    logger.info("✅ KarJo bot is running... Daily digest at 8:00 AM Kabul time.")
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
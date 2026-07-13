import os
import logging
from datetime import datetime
from dotenv import load_dotenv
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application,
    CommandHandler,
    CallbackQueryHandler,
    ContextTypes,
)

from scraper import collect_all_jobs
from database import save_jobs, get_latest_jobs, get_todays_jobs, get_user_language, save_user_language

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
CHAT_ID   = int(os.getenv("CHAT_ID"))

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO
)
logger = logging.getLogger(__name__)


# ── Translations ───────────────────────────────────────────────────────────────

TEXTS = {
    "en": {
        "welcome": (
            "🇬🇧 *Welcome to KarJo!*\n"
            "Afghanistan's smartest job finder bot 🤖\n\n"
            "━━━━━━━━━━━━━━━━━━━━━━\n"
            "📋 *Main Commands:*\n\n"
            "💼 /jobs — Latest 20 job listings\n"
            "📅 /today — Today's new jobs\n"
            "🔄 /refresh — Scrape fresh jobs now\n"
            "🌐 /language — Change language\n"
            "❓ /help — All commands\n"
            "━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "⏰ Every morning at *8:00 AM Kabul time*\n"
            "new jobs are delivered to you automatically!\n\n"
            "💡 Send /jobs now to get started 👇"
        ),
        "help": (
            "❓ *KarJo — All Commands:*\n\n"
            "━━━━━━━━━━━━━━━━━━━━━━\n"
            "💼 /jobs — Latest 20 jobs\n"
            "📅 /today — Today's new jobs\n"
            "🔄 /refresh — Scrape fresh jobs now\n"
            "🌐 /language — Change language\n"
            "🆘 /help — Show this message\n"
            "━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "⏰ Auto-delivery every day at *8:00 AM* Kabul time\n\n"
            "🌐 karjo.vercel.app"
        ),
        "fetching_jobs":    "⏳ Fetching latest jobs for you...",
        "fetching_today":   "⏳ Fetching today's jobs...",
        "scraping":         "🔄 Scraping fresh jobs... Please wait.",
        "no_jobs":          "😔 No jobs found right now — check back soon.\n\n🌐 Browse: https://karjo.vercel.app/jobs",
        "jobs_title":       "Latest Afghan Jobs",
        "today_title":      "Today's New Jobs",
        "footer":           "Powered by KarJo — karjo.vercel.app",
        "lang_saved":       "✅ Language set to English!",
        "choose_lang":      "🌐 Please choose your language:\nزبان خود را انتخاب کنید",
    },
    "fa": {
        "welcome": (
            "*به کارجو خوش آمدید!*\n"
            "هوشمندترین ربات کاریابی افغانستان 🤖\n\n"
            "━━━━━━━━━━━━━━━━━━━━━━\n"
            "📋 *دستورات اصلی:*\n\n"
            "💼 /jobs — آخرین ۲۰ فرصت شغلی\n"
            "📅 /today — فرصت‌های شغلی امروز\n"
            "🔄 /refresh — بروزرسانی فوری وظایف\n"
            "🌐 /language — تغییر زبان\n"
            "❓ /help — تمام دستورات\n"
            "━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "⏰ هر روز ساعت *۸:۰۰ صبح* وقت کابل\n"
            "فرصت‌های شغلی جدید برای شما ارسال می‌شود!\n\n"
            "💡 دستور /jobs را بفرستید و شروع کنید 👇"
        ),
        "help": (
            "❓ *کارجو — تمام دستورات:*\n\n"
            "━━━━━━━━━━━━━━━━━━━━━━\n"
            "💼 /jobs — آخرین ۲۰ فرصت شغلی\n"
            "📅 /today — فرصت‌های شغلی امروز\n"
            "🔄 /refresh — بروزرسانی فوری وظایف\n"
            "🌐 /language — تغییر زبان\n"
            "🆘 /help — نمایش این پیام\n"
            "━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "⏰ هر روز ساعت *۸:۰۰ صبح* وقت کابل\n"
            "وظایف جدید برای شما ارسال می‌شود\n\n"
            "🌐 karjo.vercel.app"
        ),
        "fetching_jobs":    "⏳ در حال دریافت آخرین وظایف...",
        "fetching_today":   "⏳ در حال دریافت وظایف امروز...",
        "scraping":         "🔄 در حال جستجوی وظایف جدید... لطفاً صبر کنید.",
        "no_jobs":          "😔 در حال حاضر وظیفه‌ای یافت نشد — بعداً دوباره تلاش کنید.\n\n🌐 مشاهده: https://karjo.vercel.app/jobs",
        "jobs_title":       "آخرین فرصت‌های شغلی افغانستان",
        "today_title":      "وظایف امروز",
        "footer":           "ساخته شده توسط کارجو — karjo.vercel.app",
        "lang_saved":       "✅ زبان به دری تنظیم شد!",
        "choose_lang":      "🌐 Please choose your language:\nزبان خود را انتخاب کنید",
    },
}

def t(telegram_id: int, key: str) -> str:
    """Get translated text for a user."""
    lang = get_user_language(telegram_id)
    return TEXTS.get(lang, TEXTS["en"]).get(key, "")


# ── Language selection keyboard ────────────────────────────────────────────────

def language_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup([
        [
            InlineKeyboardButton("🇦🇫  دری", callback_data="lang_fa"),
            InlineKeyboardButton("🇬🇧  English", callback_data="lang_en"),
        ]
    ])


# ── Job formatter ──────────────────────────────────────────────────────────────

def format_job_message(jobs: list[dict], title: str, footer: str, no_jobs_text: str) -> list[str]:
    if not jobs:
        return [no_jobs_text]

    messages = []
    header = (
        f"*💼 {title}*\n"
        f"{datetime.now().strftime('%A, %d %B %Y')}  ·  {len(jobs)} opportunities\n"
        f"{'─' * 26}\n\n"
    )
    current = header

    for i, job in enumerate(jobs, start=1):
        source = job.get("source", "Job")
        block = (
            f"*{i}. {job.get('title', 'N/A')}*\n"
            f"🏢 {job.get('company', 'N/A')}\n"
            f"📌 {source}  ·  {job.get('skills', 'N/A')}\n"
            f"[Apply →]({job.get('url', '#')})\n\n"
        )
        if len(current) + len(block) > 3800:
            messages.append(current.rstrip())
            current = block
        else:
            current += block

    if current:
        messages.append(current.rstrip())

    messages[-1] += f"\n\n{'─' * 26}\n{footer}"
    return messages


# ── Handlers ───────────────────────────────────────────────────────────────────

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Show language selection on /start."""
    await update.message.reply_text(
        "🌐 *Please choose your language:*\nزبان خود را انتخاب کنید 👇",
        parse_mode="Markdown",
        reply_markup=language_keyboard(),
    )


async def language_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle language button press."""
    query = update.callback_query
    await query.answer()

    telegram_id = query.from_user.id
    username    = query.from_user.username
    lang        = "fa" if query.data == "lang_fa" else "en"

    save_user_language(telegram_id, username, lang)

    # Edit the language selection message, then send welcome
    await query.edit_message_text(
        TEXTS[lang]["lang_saved"],
        parse_mode="Markdown",
    )
    await context.bot.send_message(
        chat_id=telegram_id,
        text=TEXTS[lang]["welcome"],
        parse_mode="Markdown",
    )


async def language_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Allow user to change language anytime via /language."""
    await update.message.reply_text(
        "🌐 *Please choose your language:*\nزبان خود را انتخاب کنید 👇",
        parse_mode="Markdown",
        reply_markup=language_keyboard(),
    )


async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    uid = update.effective_user.id
    await update.message.reply_text(t(uid, "help"), parse_mode="Markdown")


async def jobs_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    uid = update.effective_user.id
    await update.message.reply_text(t(uid, "fetching_jobs"))
    jobs = get_latest_jobs(limit=20)
    for msg in format_job_message(
        jobs,
        title=t(uid, "jobs_title"),
        footer=t(uid, "footer"),
        no_jobs_text=t(uid, "no_jobs"),
    ):
        await update.message.reply_text(msg, parse_mode="Markdown", disable_web_page_preview=True)


async def today_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    uid = update.effective_user.id
    await update.message.reply_text(t(uid, "fetching_today"))
    jobs = get_todays_jobs()
    for msg in format_job_message(
        jobs,
        title=t(uid, "today_title"),
        footer=t(uid, "footer"),
        no_jobs_text=t(uid, "no_jobs"),
    ):
        await update.message.reply_text(msg, parse_mode="Markdown", disable_web_page_preview=True)


async def refresh_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    uid = update.effective_user.id
    await update.message.reply_text(t(uid, "scraping"))
    jobs      = collect_all_jobs()
    new_count = save_jobs(jobs)
    latest    = get_latest_jobs(limit=20)

    title = t(uid, "jobs_title") + f" ({new_count} new)" if uid else f"Fresh Jobs ({new_count} new)"
    for msg in format_job_message(
        latest,
        title=title,
        footer=t(uid, "footer"),
        no_jobs_text=t(uid, "no_jobs"),
    ):
        await update.message.reply_text(msg, parse_mode="Markdown", disable_web_page_preview=True)


# ── Daily auto-send ────────────────────────────────────────────────────────────

async def daily_job_send(context: ContextTypes.DEFAULT_TYPE):
    logger.info("⏰ Running daily job scrape...")
    jobs      = collect_all_jobs()
    new_count = save_jobs(jobs)
    latest    = get_latest_jobs(limit=20)
    for msg in format_job_message(
        latest,
        title=f"Daily Digest ({new_count} new)",
        footer="Powered by KarJo — karjo.vercel.app",
        no_jobs_text="No new jobs today.",
    ):
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

    # Commands
    app.add_handler(CommandHandler("start",    start))
    app.add_handler(CommandHandler("help",     help_command))
    app.add_handler(CommandHandler("jobs",     jobs_command))
    app.add_handler(CommandHandler("today",    today_command))
    app.add_handler(CommandHandler("refresh",  refresh_command))
    app.add_handler(CommandHandler("language", language_command))

    # Inline button callback
    app.add_handler(CallbackQueryHandler(language_callback, pattern="^lang_"))

    # Daily job at 08:00 AM Kabul time (UTC+4:30 = 03:30 UTC)
    app.job_queue.run_daily(
        daily_job_send,
        time=datetime.strptime("03:30", "%H:%M").time(),
        job_kwargs={"misfire_grace_time": 60},
    )

    logger.info("✅ KarJo bot is running... Daily digest at 8:00 AM Kabul time.")
    app.run_polling(allowed_updates=Update.ALL_TYPES)


if __name__ == "__main__":
    main()
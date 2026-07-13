import os
import sys
import logging
from datetime import datetime

from fastapi import FastAPI, Request, Header, HTTPException
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, ContextTypes

from scraper import collect_all_jobs
from database import save_jobs, get_latest_jobs, get_todays_jobs, get_user_language, save_user_language, get_all_active_users, deactivate_user, search_jobs

logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    level=logging.INFO
)
logger = logging.getLogger(__name__)

BOT_TOKEN   = os.getenv("BOT_TOKEN")
CHAT_ID_RAW = os.getenv("CHAT_ID")
CRON_SECRET = os.getenv("CRON_SECRET")

missing = [name for name, val in [("BOT_TOKEN", BOT_TOKEN), ("CHAT_ID", CHAT_ID_RAW)] if not val]
if missing:
    logger.error(f"Missing required environment variable(s): {', '.join(missing)}")
    sys.exit(1)

try:
    CHAT_ID = int(CHAT_ID_RAW)
except ValueError:
    logger.error(f"CHAT_ID must be numeric. Got: '{CHAT_ID_RAW}'")
    sys.exit(1)

telegram_app = Application.builder().token(BOT_TOKEN).updater(None).build()


# ── Translations ───────────────────────────────────────────────────────────────

TEXTS = {
    "en": {
        "welcome": (
            "*Welcome to KarJo!*\n"
            "Afghanistan's smartest job finder bot 🤖\n\n"
            "📋 *Main Commands:*\n\n"
            "💼 /jobs — Latest 20 job listings\n"
            "📅 /today — Today's new jobs\n"
            "🔍 /search — Search jobs by keyword\n"
            "🔄 /refresh — Scrape fresh jobs now\n"
            "ℹ️ /info — About KarJo\n"
            "🌐 /language — Change language\n"
            "❓ /help — All commands\n\n"
            "⏰ Every morning at *8:00 AM Kabul time*\n"
            "new jobs are delivered to you automatically!\n\n"
            "💡 Send /jobs now to get started 👇"
        ),
        "help": (
            "❓ *KarJo — All Commands:*\n\n"
            "💼 /jobs — Latest 20 jobs\n"
            "📅 /today — Today's new jobs\n"
            "🔍 /search — Search jobs by keyword\n"
            "🔄 /refresh — Scrape fresh jobs now\n"
            "ℹ️ /info — About KarJo\n"
            "🌐 /language — Change language\n"
            "🆘 /help — Show this message\n\n"
            "⏰ Auto-delivery every day at *8:00 AM* Kabul time\n\n"
            "🌐 karjo.vercel.app"
        ),
        "info": (
            "ℹ️ *About KarJo*\n\n"
            "KarJo automatically scrapes the latest Afghan job listings every "
            "morning from:\n"
            "🇦🇫 jobs.af\n"
            "🌍 ACBAR\n\n"
            "100% free, no sign-up needed.\n\n"
            "🌐 karjo.vercel.app\n"
            "👨‍💻 Built by Amanullah Yawari\n\n"
            "Type /help to see all commands."
        ),
        "fetching_jobs":  "⏳ Fetching latest jobs for you...",
        "fetching_today": "⏳ Fetching today's jobs...",
        "scraping":       "🔄 Scraping fresh jobs... Please wait.",
        "no_jobs":        "😔 No jobs found right now — check back soon.\n\n🌐 https://karjo.vercel.app/jobs",
        "jobs_title":     "Latest Afghan Jobs",
        "today_title":    "Today's New Jobs",
        "footer":         "karjo.vercel.app  ·  @Kar_Jo_Bot",
        "lang_saved":     "✅ Language set to English!",
        "search_prompt":  "🔍 Please provide a keyword\nExample: /search python",
        "search_title":   "Search results for",
        "no_results":     "😔 No jobs found for that keyword\n\nTry a different search term or use /jobs to see all jobs",
        "searching":      "⏳ Searching...",
    },
    "fa": {
        "welcome": (
            "*به کارجو خوش آمدید!*\n"
            "هوشمندترین ربات کاریابی افغانستان 🤖\n\n"
            "📋 *دستورات اصلی:*\n\n"
            "💼 /jobs — آخرین ۲۰ فرصت شغلی\n"
            "📅 /today — فرصت‌های شغلی امروز\n"
            "🔍 /search — جستجوی وظایف با کلیدواژه\n"
            "🔄 /refresh — بروزرسانی فوری وظایف\n"
            "ℹ️ /info — درباره کارجو\n"
            "🌐 /language — تغییر زبان\n"
            "❓ /help — تمام دستورات\n\n"
            "⏰ هر روز ساعت *۸:۰۰ صبح* وقت کابل\n"
            "فرصت‌های شغلی جدید برای شما ارسال می‌شود!\n\n"
            "💡 دستور /jobs را بفرستید و شروع کنید 👇"
        ),
        "help": (
            "❓ *کارجو — تمام دستورات:*\n\n"
            "💼 /jobs — آخرین ۲۰ فرصت شغلی\n"
            "📅 /today — فرصت‌های شغلی امروز\n"
            "🔍 /search — جستجوی وظایف با کلیدواژه\n"
            "🔄 /refresh — بروزرسانی فوری وظایف\n"
            "ℹ️ /info — درباره کارجو\n"
            "🌐 /language — تغییر زبان\n"
            "🆘 /help — نمایش این پیام\n\n"
            "⏰ هر روز ساعت *۸:۰۰ صبح* وقت کابل\n"
            "وظایف جدید برای شما ارسال می‌شود\n\n"
            "🌐 karjo.vercel.app"
        ),
        "info": (
            "ℹ️ *درباره کارجو*\n\n"
            "کارجو هر روز صبح آخرین فرصت‌های شغلی افغانستان را از منابع زیر جمع‌آوری می‌کند:\n"
            "🇦🇫 jobs.af\n"
            "🌍 ACBAR\n\n"
            "کاملاً رایگان، بدون نیاز به ثبت‌نام.\n\n"
            "🌐 karjo.vercel.app\n"
            "👨‍💻 ساخته شده توسط امان‌الله یاوری\n\n"
            "برای دیدن تمام دستورات /help را بفرستید."
        ),
        "fetching_jobs":  "⏳ در حال دریافت آخرین وظایف...",
        "fetching_today": "⏳ در حال دریافت وظایف امروز...",
        "scraping":       "🔄 در حال جستجوی وظایف جدید... لطفاً صبر کنید.",
        "no_jobs":        "😔 در حال حاضر وظیفه‌ای یافت نشد.\n\n🌐 https://karjo.vercel.app/jobs",
        "jobs_title":     "آخرین فرصت‌های شغلی افغانستان",
        "today_title":    "وظایف امروز",
        "footer":         "karjo.vercel.app  ·  @Kar_Jo_Bot",
        "lang_saved":     "✅ زبان به دری تنظیم شد!",
        "search_prompt":  "🔍 کلیدواژه مورد جستجو را بنویسید\nمثال: /search انجینیر",
        "search_title":   "نتایج جستجو برای",
        "no_results":     "😔 وظیفه‌ای برای این کلیدواژه یافت نشد\n\nکلیدواژه دیگری امتحان کنید یا از /jobs استفاده کنید",
        "searching":      "⏳ در حال جستجو...",
    },
}

def t(telegram_id: int, key: str) -> str:
    lang = get_user_language(telegram_id)
    return TEXTS.get(lang, TEXTS["en"]).get(key, "")


# ── Keyboard ───────────────────────────────────────────────────────────────────

def language_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup([[
        InlineKeyboardButton("🇦🇫  دری", callback_data="lang_fa"),
        InlineKeyboardButton("🇬🇧  English", callback_data="lang_en"),
    ]])


# ── Job formatter ──────────────────────────────────────────────────────────────

def format_job_message(jobs: list[dict], title: str, footer: str, no_jobs_text: str) -> list[str]:
    if not jobs:
        return [no_jobs_text]

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

    messages[-1] += f"\n\n{'─' * 28}\n{footer}"
    return messages


# ── Command handlers ───────────────────────────────────────────────────────────

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        "🌐 *Please choose your language:*\nزبان خود را انتخاب کنید 👇",
        parse_mode="Markdown",
        reply_markup=language_keyboard(),
    )

async def language_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    telegram_id = query.from_user.id
    username    = query.from_user.username
    lang        = "fa" if query.data == "lang_fa" else "en"

    save_user_language(telegram_id, username, lang)

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
    await update.message.reply_text(
        "🌐 *Please choose your language:*\nزبان خود را انتخاب کنید 👇",
        parse_mode="Markdown",
        reply_markup=language_keyboard(),
    )

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    uid = update.effective_user.id
    await update.message.reply_text(t(uid, "help"), parse_mode="Markdown")

async def info_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    uid = update.effective_user.id
    await update.message.reply_text(t(uid, "info"), parse_mode="Markdown", disable_web_page_preview=True)

async def jobs_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    uid = update.effective_user.id
    await update.message.reply_text(t(uid, "fetching_jobs"))
    jobs = get_latest_jobs(limit=20)
    for msg in format_job_message(jobs, t(uid, "jobs_title"), t(uid, "footer"), t(uid, "no_jobs")):
        await update.message.reply_text(msg, parse_mode="Markdown", disable_web_page_preview=True)

async def today_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    uid = update.effective_user.id
    await update.message.reply_text(t(uid, "fetching_today"))
    jobs = get_todays_jobs()
    for msg in format_job_message(jobs, t(uid, "today_title"), t(uid, "footer"), t(uid, "no_jobs")):
        await update.message.reply_text(msg, parse_mode="Markdown", disable_web_page_preview=True)

async def refresh_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    uid = update.effective_user.id
    await update.message.reply_text(t(uid, "scraping"))
    jobs      = collect_all_jobs()
    new_count = save_jobs(jobs)
    latest    = get_latest_jobs(limit=20)
    title     = t(uid, "jobs_title") + f" ({new_count} new)"
    for msg in format_job_message(latest, title, t(uid, "footer"), t(uid, "no_jobs")):
        await update.message.reply_text(msg, parse_mode="Markdown", disable_web_page_preview=True)


async def search_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    uid = update.effective_user.id
    keyword = " ".join(context.args).strip()

    if not keyword:
        await update.message.reply_text(t(uid, "search_prompt"), parse_mode="Markdown")
        return

    await update.message.reply_text(t(uid, "searching"))
    jobs = search_jobs(keyword)
    title = f"{t(uid, 'search_title')} \"{keyword}\""
    for msg in format_job_message(jobs, title, t(uid, "footer"), t(uid, "no_results")):
        await update.message.reply_text(msg, parse_mode="Markdown", disable_web_page_preview=True)


# ── Register handlers ──────────────────────────────────────────────────────────

telegram_app.add_handler(CommandHandler("start",    start))
telegram_app.add_handler(CommandHandler("help",     help_command))
telegram_app.add_handler(CommandHandler("info",     info_command))
telegram_app.add_handler(CommandHandler("jobs",     jobs_command))
telegram_app.add_handler(CommandHandler("today",    today_command))
telegram_app.add_handler(CommandHandler("refresh",  refresh_command))
telegram_app.add_handler(CommandHandler("language", language_command))
telegram_app.add_handler(CommandHandler("search",   search_command))
telegram_app.add_handler(CallbackQueryHandler(language_callback, pattern="^lang_"))


# ── FastAPI app (Vercel entrypoint) ───────────────────────────────────────────

app = FastAPI()

_initialized = False

async def ensure_initialized():
    global _initialized
    if not _initialized:
        await telegram_app.initialize()
        _initialized = True

@app.get("/api")
async def health():
    return {"status": "KarJo bot is alive"}

@app.post("/api/webhook")
async def webhook(request: Request):
    await ensure_initialized()
    data   = await request.json()
    update = Update.de_json(data, telegram_app.bot)
    await telegram_app.process_update(update)
    return {"ok": True}

@app.get("/api/daily-digest")
async def daily_digest(authorization: str = Header(None)):
    if CRON_SECRET and authorization != f"Bearer {CRON_SECRET}":
        raise HTTPException(status_code=401, detail="Unauthorized")
    await ensure_initialized()

    logger.info("Running scheduled daily digest...")
    jobs      = collect_all_jobs()
    new_count = save_jobs(jobs)
    latest    = get_latest_jobs(limit=20)

    users       = get_all_active_users()
    sent_count  = 0
    failed_count = 0

    for user in users:
        uid  = user["telegram_id"]
        lang = user.get("language", "en")
        title = TEXTS[lang]["jobs_title"] + f" ({new_count} new)"
        footer = TEXTS[lang]["footer"]
        no_jobs = TEXTS[lang]["no_jobs"]

        try:
            for msg in format_job_message(latest, title, footer, no_jobs):
                await telegram_app.bot.send_message(
                    chat_id=uid,
                    text=msg,
                    parse_mode="Markdown",
                    disable_web_page_preview=True,
                )
            sent_count += 1
        except Exception as e:
            error_str = str(e).lower()
            if "blocked" in error_str or "chat not found" in error_str or "forbidden" in error_str:
                deactivate_user(uid)
                logger.info(f"Deactivated user {uid} — blocked the bot")
            else:
                logger.error(f"Failed to send digest to {uid}: {e}")
            failed_count += 1

    logger.info(f"Daily digest sent — {new_count} new jobs — {sent_count} users reached — {failed_count} failed.")
    return {"ok": True, "new_jobs": new_count, "sent": sent_count, "failed": failed_count}
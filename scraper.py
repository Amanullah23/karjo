import requests
from bs4 import BeautifulSoup
from datetime import datetime
import re

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                  "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
}

# ── jobs.af scraper ────────────────────────────────────────────────────────────
def scrape_jobs_af():
    jobs = []
    try:
        url = "https://jobs.af/jobs"
        res = requests.get(url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(res.text, "lxml")

        cards = soup.select("div.job-item, div.job-listing, article.job-card")
        if not cards:
            # fallback selector
            cards = soup.select("div[class*='job']")

        for card in cards[:20]:
            title_el   = card.select_one("h2, h3, a.job-title, .title")
            company_el = card.select_one(".company, .employer, .organization")
            date_el    = card.select_one(".date, .posted, time")
            link_el    = card.select_one("a[href]")
            skills_el  = card.select_one(".skills, .tags, .categories")

            title   = title_el.get_text(strip=True)   if title_el   else "N/A"
            company = company_el.get_text(strip=True)  if company_el else "N/A"
            date    = date_el.get_text(strip=True)     if date_el    else datetime.now().strftime("%Y-%m-%d")
            skills  = skills_el.get_text(strip=True)   if skills_el  else "N/A"
            href    = link_el["href"]                  if link_el    else url

            if not href.startswith("http"):
                href = "https://jobs.af" + href

            if title and title != "N/A":
                jobs.append({
                    "title":   title,
                    "company": company,
                    "skills":  skills,
                    "date":    date,
                    "url":     href,
                    "source":  "jobs.af",
                })
    except Exception as e:
        print(f"[jobs.af] Error: {e}")
    return jobs


# ── acbar.org scraper ──────────────────────────────────────────────────────────
def scrape_acbar():
    jobs = []
    try:
        url = "https://www.acbar.org/jobs"
        res = requests.get(url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(res.text, "lxml")

        cards = soup.select("div.views-row, div.job-item, tr.odd, tr.even")

        for card in cards[:20]:
            title_el   = card.select_one("a, h3, h2, .views-field-title")
            company_el = card.select_one(".organization, .company, .views-field-field-organization")
            date_el    = card.select_one(".date, .views-field-created, time")
            link_el    = card.select_one("a[href]")

            title   = title_el.get_text(strip=True)   if title_el   else "N/A"
            company = company_el.get_text(strip=True)  if company_el else "N/A"
            date    = date_el.get_text(strip=True)     if date_el    else datetime.now().strftime("%Y-%m-%d")
            href    = link_el["href"]                  if link_el    else url

            if not href.startswith("http"):
                href = "https://www.acbar.org" + href

            if title and title != "N/A":
                jobs.append({
                    "title":   title,
                    "company": company,
                    "skills":  "NGO / Development",
                    "date":    date,
                    "url":     href,
                    "source":  "acbar.org",
                })
    except Exception as e:
        print(f"[acbar.org] Error: {e}")
    return jobs


# ── LinkedIn Afghanistan scraper ───────────────────────────────────────────────
def scrape_linkedin():
    jobs = []
    try:
        url = (
            "https://www.linkedin.com/jobs/search/"
            "?keywords=Afghanistan&location=Afghanistan&f_TPR=r86400&sortBy=DD"
        )
        res = requests.get(url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(res.text, "lxml")

        cards = soup.select("div.job-search-card, li.result-card")

        for card in cards[:20]:
            title_el   = card.select_one("h3.base-search-card__title, h3")
            company_el = card.select_one("h4.base-search-card__subtitle, h4")
            date_el    = card.select_one("time")
            link_el    = card.select_one("a[href]")

            title   = title_el.get_text(strip=True)   if title_el   else "N/A"
            company = company_el.get_text(strip=True)  if company_el else "N/A"
            date    = date_el.get("datetime", datetime.now().strftime("%Y-%m-%d")) if date_el else datetime.now().strftime("%Y-%m-%d")
            href    = link_el["href"]                  if link_el    else url

            if title and title != "N/A":
                jobs.append({
                    "title":   title,
                    "company": company,
                    "skills":  "See LinkedIn",
                    "date":    date,
                    "url":     href,
                    "source":  "LinkedIn",
                })
    except Exception as e:
        print(f"[LinkedIn] Error: {e}")
    return jobs


# ── Main collect function ──────────────────────────────────────────────────────
def collect_all_jobs():
    print("🔍 Scraping jobs.af ...")
    af    = scrape_jobs_af()
    print(f"   → {len(af)} jobs found")

    print("🔍 Scraping acbar.org ...")
    acbar = scrape_acbar()
    print(f"   → {len(acbar)} jobs found")

    print("🔍 Scraping LinkedIn ...")
    li    = scrape_linkedin()
    print(f"   → {len(li)} jobs found")

    all_jobs = af + acbar + li
    print(f"✅ Total: {len(all_jobs)} jobs collected")
    return all_jobs
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
        url = "https://api.jobs.af/public/jobs"
        res = requests.get(url, headers=HEADERS, params={"itemsPerPage": 20, "page": 1}, timeout=15)
        data = res.json()

        for item in data.get("data", []):
            title = item.get("title", "N/A")
            company = item.get("company", {}).get("name", "N/A")

            provinces = item.get("provinces", [])
            province_names = ", ".join(p["province"]["name"] for p in provinces if p.get("province"))

            areas = item.get("functionalAreas", [])
            skills = ", ".join(a["area"]["name"] for a in areas if a.get("area")) or province_names or "N/A"

            publish_date = item.get("publishDate", "")
            date = publish_date.split(" ")[0] if publish_date else datetime.now().strftime("%Y-%m-%d")

            slug = item.get("slug", "")
            job_url = f"https://jobs.af/public/job/{slug}" if slug else url

            if title and title != "N/A":
                jobs.append({
                    "title":   title,
                    "company": company,
                    "skills":  skills,
                    "date":    date,
                    "url":     job_url,
                    "source":  "jobs.af",
                })
    except Exception as e:
        print(f"[jobs.af] Error: {e}")
    return jobs


# ── acbar.org scraper ──────────────────────────────────────────────────────────
def scrape_acbar():
    jobs = []
    try:
        url = "https://www.acbar.org/en/jobs"
        res = requests.get(url, headers=HEADERS, timeout=15)
        soup = BeautifulSoup(res.text, "lxml")

        title_links = soup.select("a[href*='/jobs/details/']")
        seen_urls = set()

        for link in title_links:
            href = link["href"]
            if not href.startswith("http"):
                href = "https://www.acbar.org" + href
            if href in seen_urls:
                continue
            seen_urls.add(href)

            title = link.get_text(strip=True)
            if not title:
                continue

            container = link.find_parent(["div", "li", "article"]) or link.parent
            block_text = container.get_text(" ", strip=True) if container else ""

            company = "N/A"
            if "•" in block_text:
                company = block_text.split("•")[0].replace(title, "").strip()

            jobs.append({
                "title":   title,
                "company": company or "N/A",
                "skills":  "NGO / Development",
                "date":    datetime.now().strftime("%Y-%m-%d"),
                "url":     href,
                "source":  "acbar.org",
            })

        return jobs[:20]
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
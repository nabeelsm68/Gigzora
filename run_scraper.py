#!/usr/bin/env python3
"""
run_scraper.py — Headless, non-interactive wrapper for Gigzora scraper.

Called by the Next.js dashboard via child_process.
Outputs JSON lines to stdout so the frontend can stream progress.

Usage:
    python run_scraper.py --query "cafes in hyderabad" --max 50
"""

import argparse
import json
import sys
import time

sys.stdout.reconfigure(encoding="utf-8")

# Import everything we need from the monolith
from gigzora import (
    GoogleMapsScraper,
    scrape_website_contacts,
    score_lead,
    dedupe_businesses,
    SKIP_DOMAINS,
    NIL,
    PLAYWRIGHT_AVAILABLE,
)

from database.lead_repository import save_leads


def emit(event_type: str, data: dict):
    """Print a JSON line to stdout for the Next.js SSE consumer."""
    payload = {"type": event_type, **data}
    print(json.dumps(payload, ensure_ascii=False), flush=True)


def run(query: str, max_leads: int):
    if not PLAYWRIGHT_AVAILABLE:
        emit("error", {"message": "Playwright is not installed. Run: pip install playwright && playwright install chromium"})
        sys.exit(1)

    emit("status", {"message": f"Starting scrape: \"{query}\" (max {max_leads} leads)"})

    start_time = time.time()

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        emit("error", {"message": "Playwright import failed."})
        sys.exit(1)

    with sync_playwright() as pw:

        # ── Phase 1: Google Maps ──────────────────────────────────────────
        emit("phase", {"phase": 1, "message": "Scraping Google Maps..."})
        maps = GoogleMapsScraper(pw, headless=True)
        businesses = maps.search(query, max_results=max_leads)

        if not businesses:
            emit("error", {"message": "No results found. Try a more specific query."})
            sys.exit(0)

        businesses = dedupe_businesses(businesses)
        emit("progress", {
            "phase": 1,
            "message": f"Found {len(businesses)} unique businesses",
            "count": len(businesses),
        })

        # ── Phase 2: Website scraping ─────────────────────────────────────
        emit("phase", {"phase": 2, "message": "Scraping websites for contacts..."})

        for i, biz in enumerate(businesses, 1):
            name = (biz.get("title") or "Unknown")[:40]
            website = (biz.get("website") or "").strip()

            if website and not any(d in website for d in SKIP_DOMAINS):
                contacts = scrape_website_contacts(website, pw)
                biz.update(contacts)

            email_found = (biz.get("email") or NIL) != NIL
            emit("progress", {
                "phase": 2,
                "current": i,
                "total": len(businesses),
                "name": name,
                "email_found": email_found,
                "message": f"[{i}/{len(businesses)}] {name}",
            })

            time.sleep(1.0)

        # ── Phase 3: Scoring ──────────────────────────────────────────────
        emit("phase", {"phase": 3, "message": "Scoring & ranking leads..."})

        for biz in businesses:
            scores = score_lead(biz)
            biz.update(scores)

        businesses.sort(key=lambda x: x.get("lead_score", 0), reverse=True)

        # ── Phase 4: Save to Supabase ─────────────────────────────────────
        emit("phase", {"phase": 4, "message": "Saving to database..."})

        try:
            save_leads(businesses)
            emit("progress", {"phase": 4, "message": "Leads saved to Supabase"})
        except Exception as e:
            emit("error", {"message": f"Database save failed: {str(e)}"})

    # ── Summary ───────────────────────────────────────────────────────────
    elapsed = time.time() - start_time

    hot = sum(1 for l in businesses if "HOT" in (l.get("lead_grade") or ""))
    warm = sum(1 for l in businesses if "WARM" in (l.get("lead_grade") or ""))
    with_email = sum(1 for l in businesses if (l.get("email") or NIL) != NIL)

    emit("complete", {
        "message": f"Done! {len(businesses)} leads scraped in {elapsed:.0f}s",
        "total": len(businesses),
        "hot": hot,
        "warm": warm,
        "with_email": with_email,
        "elapsed_seconds": round(elapsed),
    })


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Gigzora headless scraper")
    parser.add_argument("--query", required=True, help="Search query (e.g. 'cafes in hyderabad')")
    parser.add_argument("--max", type=int, default=50, help="Maximum leads to scrape")
    args = parser.parse_args()

    run(args.query, args.max)

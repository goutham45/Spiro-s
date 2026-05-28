#!/usr/bin/env python3
"""
Uber Eats menu scraper for Spiro's Restaurant.
Strategy: Launch a VISIBLE browser, intercept the JSON API response that
Uber Eats fires when it loads the store page, then parse it.
Outputs:
  1. spiros_scraped.json  — raw data
  2. spiros_updates.sql   — UPDATE statements ready to run
"""

import asyncio
import json
import re
import sys
from pathlib import Path

from playwright.async_api import async_playwright, TimeoutError as PWTimeout

URL = (
    "https://www.ubereats.com/store/spiros-restaurant/peYDfzFtU2WrcBxQQu2e9w"
    "?diningMode=DELIVERY"
    "&pl=JTdCJTIyYWRkcmVzcyUyMiUzQSUyMlNwaXJvcyUyMFJlc3RhdXJhbnQlMjIlMkMlMjJyZWZlcmVuY2UlMjIlM0ElMjJjNjIyMjk0ZC0wNGExLTM2ZTgtYTM4MS00MjQ4M2Y0MTcxZDklMjIlMkMlMjJyZWZlcmVuY2VUeXBlJTIyJTNBJTIydWJlcl9wbGFjZXMlMjIlMkMlMjJsYXRpdHVkZSUyMiUzQTQwLjU5OTc3MyUyQyUyMmxvbmdpdHVkZSUyMiUzQS03My45NTAyMTElN0Q%3D"
    "&sc=SEARCH_SUGGESTION"
)

OUT_DIR = Path(__file__).parent
JSON_OUT = OUT_DIR / "spiros_scraped.json"
SQL_OUT  = OUT_DIR / "spiros_updates.sql"
RAW_OUT  = OUT_DIR / "spiros_raw_api.json"

LABEL_TO_SLUG = {
    "Pancakes":                       "pancakes",
    "French Toast and Waffles":       "french-toast-waffles",
    "Eggs and 3 Egg Omelettes":       "eggs-omelettes",
    "Omelettes":                      "omelettes",
    "Spiro's Special":                "spiros-special",
    "Low Cal Omelettes":              "low-cal-omelettes",
    "Super 3 Egg Omelette Wrap":      "super-3-egg-wrap",
    "Cereal":                         "cereal",
    "Body Builder's Breakfast":       "body-builders",
    "Bagels":                         "bagels",
    "Breakfast Extras":               "breakfast-extras",
    "Appetizers and Side Orders":     "appetizers",
    "Cold Salad Platters":            "cold-salad-platters",
    "Salads":                         "salads",
    "Tasty Sandwiches":               "tasty-sandwiches",
    "Grilled Pita Sandwiches":        "grilled-pita",
    "Grilled Chicken Sandwiches":     "grilled-chicken-sandwiches",
    "Special Sandwiches":             "special-sandwiches",
    "Hot Open Sandwiches":            "hot-open-sandwiches",
    "Classic Burgers":                "classic-burgers",
    "Classic Burger Deluxe":          "classic-burger-deluxe",
    "Specialty Burgers":              "specialty-burgers",
    "Slim Line":                      "slim-line",
    "Triple Decker Clubs":            "triple-decker-clubs",
    "Carving Board Sandwiches":       "carving-board",
    "Our New Gourmet Wraps":          "gourmet-wraps",
    "Steaks and Chops":               "steaks-chops",
    "Sautes":                         "sautes",
    "Broiled Seafood":                "broiled-seafood",
    "Fried Seafood":                  "fried-seafood",
    "Entrees and Roasts":             "entrees-roasts",
    "Spaghetti":                      "spaghetti",
    "Italian Specialties":            "italian-specialties",
    "Greek Specialties":              "greek-specialties",
    "Chef Specials":                  "chef-specials",
    "Fruits and Puddings":            "fruits-puddings",
    "Danish and Muffins":             "danish-muffins",
    "Pies and Cakes":                 "pies-cakes",
    "Desserts":                       "desserts",
    "Ice Cream Sodas":                "ice-cream-sodas",
    "Juices and Fruits":              "juices-fruits",
    "Beverages":                      "beverages",
}

def label_to_slug(label: str) -> str:
    label = label.strip()
    if label in LABEL_TO_SLUG:
        return LABEL_TO_SLUG[label]
    for k, v in LABEL_TO_SLUG.items():
        if k.lower() in label.lower() or label.lower() in k.lower():
            return v
    return re.sub(r"[^a-z0-9]+", "-", label.lower()).strip("-")

def like_pct_to_stars(pct: int) -> float:
    if pct >= 98: return 5.0
    if pct >= 95: return 4.9
    if pct >= 92: return 4.8
    if pct >= 88: return 4.7
    if pct >= 85: return 4.6
    if pct >= 80: return 4.5
    return round(pct / 20, 1)

# ── Parse the UE JSON catalogue ───────────────────────────────────────────────

def parse_ue_api(raw: dict) -> list[dict]:
    """Parse the Uber Eats storefront JSON into flat item rows."""
    results = []

    # The catalogue lives at different paths depending on API version
    catalogue = (
        raw.get("data", {}).get("catalogSectionsMap") or
        raw.get("catalogSectionsMap") or
        raw.get("data", {}).get("sections") or
        raw.get("sections") or
        {}
    )

    # Try the v2 shape: { uuid: { payload: { standardItemsPayload: { catalogItems: [...] } } } }
    if isinstance(catalogue, dict):
        for sec_uuid, sec_val in catalogue.items():
            payload   = sec_val.get("payload", {})
            std       = payload.get("standardItemsPayload", {})
            title_obj = std.get("title", {}) or payload.get("title", {})
            sec_name  = (
                title_obj.get("text", "") if isinstance(title_obj, dict)
                else str(title_obj)
            )
            items_raw = std.get("catalogItems", []) or payload.get("catalogItems", [])

            for it in items_raw:
                name  = (it.get("title") or it.get("name") or "").strip()
                price_cents = it.get("price", 0) or it.get("priceCents", 0) or 0
                price = round(price_cents / 100, 2) if price_cents > 100 else price_cents
                desc  = it.get("itemDescription") or it.get("description") or ""
                # image
                img = ""
                for img_key in ("imageUrl", "image", "catalogItemImages"):
                    v = it.get(img_key)
                    if isinstance(v, str) and v.startswith("http"):
                        img = v; break
                    elif isinstance(v, list) and v:
                        img = v[0].get("url", "") if isinstance(v[0], dict) else str(v[0]); break
                # rating
                rating_pct = None
                rating_count = None
                rating_obj = it.get("itemBadge") or it.get("ratings") or {}
                if isinstance(rating_obj, dict):
                    rating_pct   = rating_obj.get("likedByPercentage") or rating_obj.get("ratingValue")
                    rating_count = rating_obj.get("totalRatings") or rating_obj.get("reviewCount")

                if name and price:
                    slug  = label_to_slug(sec_name)
                    stars = like_pct_to_stars(int(rating_pct)) if rating_pct else None
                    results.append({
                        "section":      sec_name,
                        "category":     slug,
                        "name":         name,
                        "price":        price,
                        "desc":         (desc or "")[:255],
                        "img":          img,
                        "rating_pct":   rating_pct,
                        "rating_stars": stars,
                        "rating_count": rating_count,
                    })

    # Fallback: list-of-sections shape
    elif isinstance(catalogue, list):
        for sec in catalogue:
            sec_name = sec.get("title", {}).get("text", "") if isinstance(sec.get("title"), dict) else sec.get("title", "")
            for it in sec.get("items", []) or sec.get("catalogItems", []):
                name  = (it.get("title") or it.get("name") or "").strip()
                price_cents = it.get("price", 0) or 0
                price = round(price_cents / 100, 2) if price_cents > 100 else price_cents
                if name and price:
                    slug = label_to_slug(sec_name)
                    results.append({
                        "section": sec_name, "category": slug,
                        "name": name, "price": price,
                        "desc": it.get("itemDescription", "")[:255],
                        "img":  it.get("imageUrl", ""),
                        "rating_pct": None, "rating_stars": None, "rating_count": None,
                    })

    return results

# ── SQL generation ────────────────────────────────────────────────────────────

def generate_sql(rows: list[dict]) -> str:
    lines = [
        "-- Auto-generated by ubereats_scraper.py",
        "USE qfood;",
        "",
    ]
    for r in rows:
        name  = r["name"].replace("'", "\\'")
        price = r["price"]
        cat   = r["category"]
        img   = (r.get("img") or "").replace("'", "\\'")
        desc  = (r.get("desc") or "").replace("'", "\\'")

        set_parts = [f"food_price = {price}"]
        if r.get("rating_stars"):
            set_parts.append(f"food_star = {r['rating_stars']}")
        if r.get("rating_count"):
            set_parts.append(f"food_vote = {r['rating_count']}")
        if img:
            set_parts.append(f"food_src = '{img}'")
        if desc:
            set_parts.append(f"food_desc = '{desc}'")

        set_clause = ", ".join(set_parts)
        lines.append(
            f"UPDATE food SET {set_clause} "
            f"WHERE food_name = '{name}' AND food_category = '{cat}';"
        )

    lines.append("")
    lines.append(f"-- {len(rows)} items updated")
    return "\n".join(lines)

# ── main ──────────────────────────────────────────────────────────────────────

async def main():
    captured_responses: list[dict] = []

    async with async_playwright() as pw:
        # Use headed=True — Uber Eats blocks pure headless
        browser = await pw.chromium.launch(
            headless=False,
            args=["--disable-blink-features=AutomationControlled"],
        )
        context = await browser.new_context(
            viewport={"width": 1280, "height": 900},
            user_agent=(
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
        )
        page = await context.new_page()

        # Intercept ALL JSON API responses from Uber Eats
        async def handle_response(response):
            url = response.url
            ct  = response.headers.get("content-type", "")
            if "ubereats.com" in url and "json" in ct:
                try:
                    body = await response.json()
                    captured_responses.append({"url": url, "body": body})
                    # Quick probe — does it have menu data?
                    text = json.dumps(body)
                    if "catalogItem" in text or "catalogSection" in text or "priceCents" in text:
                        print(f"   🎯 Menu API hit: {url[:90]}")
                except Exception:
                    pass

        page.on("response", handle_response)

        print("🌐 Opening browser — loading Uber Eats …")
        await page.goto(URL, wait_until="domcontentloaded", timeout=60_000)

        # Dismiss modals
        for sel in ["button[aria-label='Close']", "[data-testid='close-button']",
                    "button[aria-label='Dismiss']"]:
            try:
                btn = page.locator(sel).first
                if await btn.is_visible(timeout=2000):
                    await btn.click()
                    await page.wait_for_timeout(400)
            except Exception:
                pass

        print("⏳ Waiting for page to render (15 s) …")
        await page.wait_for_timeout(15_000)

        # Scroll to trigger lazy-load of all sections
        print("📜 Scrolling through menu …")
        for _ in range(40):
            await page.evaluate("window.scrollBy(0, 800)")
            await page.wait_for_timeout(300)

        await page.wait_for_timeout(3_000)
        await browser.close()

    print(f"\n📡 Captured {len(captured_responses)} API responses")

    # Save raw responses for debugging
    RAW_OUT.write_text(json.dumps(captured_responses, indent=2, ensure_ascii=False))
    print(f"   Raw responses saved → {RAW_OUT}")

    # Try to parse each captured response
    rows: list[dict] = []
    for resp in captured_responses:
        parsed = parse_ue_api(resp["body"])
        if parsed:
            print(f"   ✅ Parsed {len(parsed)} items from {resp['url'][:80]}")
            rows.extend(parsed)

    # Deduplicate by (category, name)
    seen = set()
    unique_rows = []
    for r in rows:
        key = (r["category"], r["name"].lower())
        if key not in seen:
            seen.add(key)
            unique_rows.append(r)
    rows = unique_rows

    if not rows:
        print("\n❌ No menu items extracted from API responses.")
        print("   Check spiros_raw_api.json to inspect what was captured.")
        sys.exit(1)

    # Save JSON
    JSON_OUT.write_text(json.dumps(rows, indent=2, ensure_ascii=False))
    print(f"\n📄 JSON saved → {JSON_OUT}  ({len(rows)} items)")

    # Save SQL
    sql = generate_sql(rows)
    SQL_OUT.write_text(sql)
    print(f"📄 SQL saved  → {SQL_OUT}")

    # Print summary table
    from collections import defaultdict
    by_section: dict[str, list] = defaultdict(list)
    for r in rows:
        by_section[r["section"]].append(r)

    print("\n── SCRAPED SUMMARY ──────────────────────────────────────────")
    for sec, items in by_section.items():
        print(f"\n  {sec} ({len(items)} items)")
        for it in items:
            stars = f"★{it['rating_stars']}" if it["rating_stars"] else "     "
            votes = f"({it['rating_count']} ratings)" if it["rating_count"] else ""
            print(f"    ${it['price']:<7}  {stars}  {it['name'][:50]}  {votes}")
    print("\n─────────────────────────────────────────────────────────────")
    print(f"\n✅ Done — {len(rows)} items across {len(by_section)} sections")
    print(f"   Run the SQL:  mysql -u root qfood < {SQL_OUT}")

if __name__ == "__main__":
    asyncio.run(main())

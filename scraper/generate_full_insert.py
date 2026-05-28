#!/usr/bin/env python3
"""
Generate a full TRUNCATE + INSERT SQL for the food table
using real Uber Eats data from test_getStoreV1.json.
375 items across 42 sections with real prices and images.
"""

import json, re
from pathlib import Path

OUT_DIR  = Path(__file__).parent
API_FILE = OUT_DIR / "test_getStoreV1.json"
SQL_OUT  = OUT_DIR / "spiros_full_insert.sql"

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

# Endorsement → star rating
def star_from_endorsement(text: str) -> str:
    t = (text or "").lower()
    if "#1" in t:   return "5.0"
    if "#2" in t:   return "4.9"
    if "#3" in t:   return "4.8"
    if "#4" in t or "#5" in t: return "4.7"
    if "popular" in t: return "4.8"
    return "4.5"   # default for Spiro's well-rated restaurant

# Simple veg/non-veg classifier
NON_VEG_KEYWORDS = {
    "beef","steak","chicken","turkey","bacon","ham","sausage","meat",
    "pastrami","corned beef","tuna","fish","salmon","seafood","sardine",
    "filet","fillet","gyro","souvlaki","meatball","brisket","roast","lox",
    "egg","eggs","omelette"
}
def classify_type(name: str, desc: str) -> str:
    combined = (name + " " + desc).lower()
    for kw in NON_VEG_KEYWORDS:
        if kw in combined:
            return "non-veg"
    return "veg"

def esc(s: str) -> str:
    return (s or "").replace("\\", "\\\\").replace("'", "\\'")

def main():
    raw = json.loads(API_FILE.read_text())
    d   = raw.get("data") or raw
    csm = d.get("catalogSectionsMap", {})
    sections_list = list(csm.values())[0]

    rows = []
    for sec in sections_list:
        payload  = sec.get("payload", {})
        std      = payload.get("standardItemsPayload", {})
        sec_name = std.get("title", {}).get("text", "").strip()
        slug     = LABEL_TO_SLUG.get(sec_name, re.sub(r"[^a-z0-9]+","-",sec_name.lower()).strip("-"))
        items    = std.get("catalogItems", [])

        for it in items:
            name        = (it.get("title") or "").strip()
            price_cents = it.get("price", 0) or 0
            price       = round(price_cents / 100, 2)
            img         = it.get("imageUrl") or ""
            desc        = (it.get("itemDescription") or
                           (it.get("itemDescriptionBadge") or {}).get("text") or "").strip()
            end_text    = ((it.get("endorsement") or {}).get("text") or
                           (it.get("endorsementV2") or {}).get("text") or "")
            star        = star_from_endorsement(end_text)
            food_type   = classify_type(name, desc)

            if not name or not price:
                continue

            rows.append({
                "name":     name,
                "star":     star,
                "vote":     "500",
                "price":    str(price),
                "discount": "0",
                "desc":     desc[:255],
                "status":   "1",
                "type":     food_type,
                "category": slug,
                "src":      img,
            })

    # ── Build SQL ──────────────────────────────────────────────────────────────
    lines = [
        "-- ============================================================",
        "-- Full food table replacement with real Uber Eats data",
        "-- Spiro's Restaurant — 375 items, 42 sections",
        "-- Generated by generate_full_insert.py",
        "-- ============================================================",
        "",
        "USE qfood;",
        "",
        "-- Back up current data just in case",
        "CREATE TABLE IF NOT EXISTS food_backup AS SELECT * FROM food;",
        "",
        "-- Clear and re-populate",
        "TRUNCATE TABLE food;",
        "",
        "INSERT INTO food",
        "  (food_name, food_star, food_vote, food_price, food_discount,",
        "   food_desc, food_status, food_type, food_category, food_src)",
        "VALUES",
    ]

    value_lines = []
    for r in rows:
        v = (
            f"  ('{esc(r['name'])}', '{r['star']}', '{r['vote']}', '{r['price']}', '{r['discount']}', "
            f"'{esc(r['desc'])}', '{r['status']}', '{r['type']}', '{r['category']}', '{esc(r['src'])}')"
        )
        value_lines.append(v)

    lines.append(",\n".join(value_lines) + ";")
    lines += [
        "",
        f"SELECT COUNT(*) AS total_items_loaded FROM food;",
        "SELECT food_category, COUNT(*) AS items FROM food GROUP BY food_category ORDER BY MIN(food_id);",
    ]

    sql = "\n".join(lines)
    SQL_OUT.write_text(sql)
    print(f"✅ SQL written → {SQL_OUT}  ({len(rows)} items)")

if __name__ == "__main__":
    main()

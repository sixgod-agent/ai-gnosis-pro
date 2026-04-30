#!/usr/bin/env python3
"""Fetch macaujc2 lottery draw history and save to public/history.json"""

import json
import urllib.request
import os
import sys

API_BASE = "https://history.macaumarksix.com"
YEAR = 2026
PREV_YEAR = 2025
OUTPUT = os.path.join(os.path.dirname(__file__), "..", "public", "history.json")

def fetch_json(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    resp = urllib.request.urlopen(req, timeout=30)
    return json.loads(resp.read().decode("utf-8"))

def main():
    all_data = []

    for year in [YEAR, PREV_YEAR]:
        url = f"{API_BASE}/history/macaujc2/y/{year}"
        print(f"Fetching {url} ...")
        data = fetch_json(url)
        records = data.get("data", [])
        print(f"  Got {len(records)} records for {year}")
        for r in records:
            all_data.append({
                "expect": r["expect"],
                "openTime": r["openTime"],
                "openCode": r["openCode"],
                "wave": r["wave"],
                "zodiac": r["zodiac"],
            })

    # Deduplicate by expect
    seen = set()
    deduped = []
    for r in all_data:
        if r["expect"] not in seen:
            seen.add(r["expect"])
            deduped.append(r)

    deduped.sort(key=lambda x: x["expect"], reverse=True)

    out_path = os.path.abspath(OUTPUT)
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(deduped, f, ensure_ascii=False, indent=2)

    print(f"Saved {len(deduped)} unique records to {out_path}")

    # Show latest record
    if deduped:
        latest = deduped[0]
        print(f"Latest: {latest['expect']} | {latest['openTime']} | {latest['openCode']}")

if __name__ == "__main__":
    main()

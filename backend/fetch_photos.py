"""
Populate real listing photos using the Pexels API (free, no attribution
required — see https://www.pexels.com/license/).

Setup:
    1. Get a free API key at https://www.pexels.com/api/ (instant approval,
       no credit card, ~200 requests/hour on the free tier).
    2. Set it as an environment variable:
           export PEXELS_API_KEY=your_key_here      (macOS/Linux)
           setx PEXELS_API_KEY your_key_here         (Windows)
       ...or create a `.env` file in backend/ with:
           PEXELS_API_KEY=your_key_here
    3. Run:
           python fetch_photos.py

This downloads one photo per listing into backend/uploads/ and updates each
Listing's image_filename in the database — the frontend already prefers a
listing's uploaded photo over its default blueprint diagram, so no frontend
changes are needed.

Re-run any time to refresh photos (it overwrites existing files by ID).
"""

import os
import sys
import time

import requests

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # python-dotenv is optional; env vars set another way still work

from app import create_app
from extensions import db
from models import Listing

PEXELS_API_KEY = os.environ.get("PEXELS_API_KEY")
PEXELS_SEARCH_URL = "https://api.pexels.com/v1/search"

# One search query per listing, hand-picked so the photo actually matches
# what that property is (a converted kiln, a barn, a mid-century semi, etc.)
# rather than a generic "house" shot.
SEARCH_TERMS = {
    "MW-014": "brick industrial building converted house",
    "PR-004": "brick rowhouse street exterior",
    "GB-021": "barn conversion glass house",
    "SC-009": "loft studio industrial windows interior",
    "FL-112": "mid century modern house exterior",
    "WD-007": "small cottage house by river",
    "WT-002": "water tower converted building",
    "FH-018": "old firehouse building exterior",
    "SH-005": "old schoolhouse building exterior",
    "CH-011": "old chapel church exterior",
    "IH-006": "small stone cottage exterior",
    "FM-023": "old mill building exterior",
    "AP-001": "industrial loft apartment interior",
    "AP-002": "brick apartment building exterior",
    "AP-003": "loft apartment exposed brick",
    "AP-004": "brick apartment building corner",
    "AP-005": "loft apartment large windows",
    "AP-006": "brick apartment building arched windows",
    "RT-001": "storefront shop exterior brick",
    "RT-002": "old pharmacy storefront building",
    "RT-003": "small town storefront exterior",
    "RT-004": "row of shopfronts street",
    "RT-005": "retail storefront brick building",
    "RT-006": "vintage shopfront storefront",
    "OF-001": "old brick office building exterior",
    "OF-002": "converted bank building exterior",
    "OF-003": "brick office building exterior",
    "OF-004": "converted warehouse office building",
    "OF-005": "small brick office building",
    "OF-006": "historic office building exterior",
    "WH-001": "warehouse building exterior brick",
    "WH-002": "old tannery warehouse building",
    "WH-003": "mill building exterior brick",
    "WH-004": "industrial warehouse building exterior",
    "WH-005": "old power station building exterior",
    "WH-006": "warehouse loading dock exterior",
}


def fetch_and_save(listing_id, query):
    headers = {"Authorization": PEXELS_API_KEY}
    params = {"query": query, "per_page": 1, "orientation": "landscape"}

    res = requests.get(PEXELS_SEARCH_URL, headers=headers, params=params, timeout=15)
    res.raise_for_status()
    photos = res.json().get("photos", [])
    if not photos:
        print(f"  no results for '{query}'")
        return None

    image_url = photos[0]["src"]["large"]
    img_res = requests.get(image_url, timeout=15)
    img_res.raise_for_status()

    filename = f"{listing_id}.jpg"
    upload_dir = os.path.join(os.path.dirname(__file__), "uploads")
    os.makedirs(upload_dir, exist_ok=True)
    with open(os.path.join(upload_dir, filename), "wb") as f:
        f.write(img_res.content)

    return filename


def main():
    if not PEXELS_API_KEY:
        print("PEXELS_API_KEY is not set.")
        print("Get a free key at https://www.pexels.com/api/, then:")
        print("    export PEXELS_API_KEY=your_key_here")
        sys.exit(1)

    app = create_app()
    with app.app_context():
        for listing_id, query in SEARCH_TERMS.items():
            listing = Listing.query.get(listing_id)
            if not listing:
                print(f"Skipping {listing_id} — no such listing in the database.")
                continue

            print(f"Fetching photo for {listing_id} ({query})...")
            filename = fetch_and_save(listing_id, query)
            if filename:
                listing.image_filename = filename
                db.session.commit()
                print(f"  saved -> uploads/{filename}")

            time.sleep(0.5)  # stay well under the free-tier rate limit

    print("Done. Restart the frontend dev server if it's already running.")


if __name__ == "__main__":
    main()

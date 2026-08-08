"""
A single protected endpoint that lets you seed the database by visiting a
URL, for hosts (like Render's free tier) that don't offer Shell/SSH access
for running one-off scripts.

Protected by the SEED_KEY environment variable — set it in your host's
environment variables, then visit:

    https://your-backend-url.onrender.com/api/admin/seed?key=YOUR_SEED_KEY

Accepts GET so it's just a URL you can paste into a browser, as well as
POST. Refuses to run if listings already exist, unless &force=true is
added, to avoid accidentally wiping data with a second visit.
"""

import os

from flask import Blueprint, jsonify, request

from models import Listing
from seed import populate

admin_bp = Blueprint("admin", __name__)


@admin_bp.route("/seed", methods=["GET", "POST"])
def run_seed():
    expected = os.environ.get("SEED_KEY")
    if not expected:
        return jsonify({"error": "SEED_KEY is not configured on the server"}), 503

    provided = request.headers.get("X-Seed-Key") or request.args.get("key")
    if provided != expected:
        return jsonify({"error": "Invalid or missing seed key"}), 403

    force = request.args.get("force", "").lower() == "true"
    existing = Listing.query.count()
    if existing > 0 and not force:
        return jsonify({
            "error": (
                f"Database already has {existing} listings. Add &force=true "
                "to the URL to reseed (this wipes existing data first)."
            ),
        }), 409

    count = populate()
    return jsonify({"ok": True, "listings_seeded": count})

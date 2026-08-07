import os

from flask import Blueprint, current_app, jsonify, request
from flask_jwt_extended import jwt_required
from werkzeug.utils import secure_filename

from extensions import db
from models import Listing

listings_bp = Blueprint("listings", __name__)

ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp"}
REQUIRED_FIELDS = [
    "id", "name", "address", "price", "type",
    "beds", "baths", "sqft", "year_built", "description",
]


@listings_bp.get("")
def get_listings():
    query = Listing.query

    status = request.args.get("status")
    listing_type = request.args.get("type")
    min_price = request.args.get("min_price", type=int)
    max_price = request.args.get("max_price", type=int)
    min_beds = request.args.get("min_beds", type=int)
    search = request.args.get("search")

    if status:
        query = query.filter(Listing.status.ilike(status))
    if listing_type:
        query = query.filter(Listing.type.ilike(listing_type))
    if min_price is not None:
        query = query.filter(Listing.price >= min_price)
    if max_price is not None:
        query = query.filter(Listing.price <= max_price)
    if min_beds is not None:
        query = query.filter(Listing.beds >= min_beds)
    if search:
        like = f"%{search}%"
        query = query.filter(
            db.or_(
                Listing.name.ilike(like),
                Listing.address.ilike(like),
                Listing.description.ilike(like),
            )
        )

    listings = query.order_by(Listing.created_at.desc()).all()
    return jsonify([l.to_dict() for l in listings])


@listings_bp.get("/<listing_id>")
def get_listing(listing_id):
    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    return jsonify(listing.to_dict())


@listings_bp.post("")
@jwt_required()
def create_listing():
    data = request.get_json(force=True, silent=True) or {}
    missing = [f for f in REQUIRED_FIELDS if data.get(f) in (None, "")]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400
    if Listing.query.get(data["id"]):
        return jsonify({"error": "A listing with that ID already exists"}), 409

    listing = Listing(
        id=data["id"],
        name=data["name"],
        address=data["address"],
        price=data["price"],
        type=data["type"],
        status=data.get("status", "For Sale"),
        beds=data["beds"],
        baths=data["baths"],
        sqft=data["sqft"],
        year_built=data["year_built"],
        description=data["description"],
    )
    db.session.add(listing)
    db.session.commit()
    return jsonify(listing.to_dict()), 201


@listings_bp.put("/<listing_id>")
@jwt_required()
def update_listing(listing_id):
    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404

    data = request.get_json(force=True, silent=True) or {}
    for field in ["name", "address", "price", "type", "status", "beds", "baths", "sqft", "year_built", "description"]:
        if field in data:
            setattr(listing, field, data[field])
    db.session.commit()
    return jsonify(listing.to_dict())


@listings_bp.delete("/<listing_id>")
@jwt_required()
def delete_listing(listing_id):
    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404
    db.session.delete(listing)
    db.session.commit()
    return jsonify({"ok": True})


@listings_bp.post("/<listing_id>/image")
@jwt_required()
def upload_image(listing_id):
    listing = Listing.query.get(listing_id)
    if not listing:
        return jsonify({"error": "Listing not found"}), 404

    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    file = request.files["image"]
    if not file.filename or "." not in file.filename:
        return jsonify({"error": "Invalid file"}), 400

    ext = file.filename.rsplit(".", 1)[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return jsonify({"error": f"Unsupported file type: .{ext}"}), 400

    filename = secure_filename(f"{listing_id}.{ext}")
    file.save(os.path.join(current_app.config["UPLOAD_DIR"], filename))
    listing.image_filename = filename
    db.session.commit()
    return jsonify(listing.to_dict())

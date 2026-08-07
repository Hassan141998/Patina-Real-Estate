from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required

from extensions import db
from models import Inquiry, Listing

inquiries_bp = Blueprint("inquiries", __name__)


@inquiries_bp.post("")
def create_inquiry():
    data = request.get_json(force=True, silent=True) or {}
    required = ["name", "email", "message"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing fields: {', '.join(missing)}"}), 400

    listing_id = data.get("listing_id") or None
    if listing_id and not Listing.query.get(listing_id):
        return jsonify({"error": "Unknown listing_id"}), 400

    inquiry = Inquiry(name=data["name"], email=data["email"], message=data["message"], listing_id=listing_id)
    db.session.add(inquiry)
    db.session.commit()
    return jsonify({"ok": True, "inquiry": inquiry.to_dict()}), 201


@inquiries_bp.get("")
@jwt_required()
def list_inquiries():
    inquiries = Inquiry.query.order_by(Inquiry.created_at.desc()).all()
    return jsonify([i.to_dict() for i in inquiries])

"""
Patina — Real Estate API

A Flask + SQLite service backing the Patina real-estate frontend.

Public endpoints:
    GET  /api/listings                 -> search/filter listings
    GET  /api/listings/<id>            -> single listing
    POST /api/inquiries                -> submit a contact / viewing request
    POST /api/auth/login               -> agent login, returns a JWT
    GET  /api/health                   -> liveness check

Agent-only endpoints (send `Authorization: Bearer <token>`):
    POST   /api/listings               -> create a listing
    PUT    /api/listings/<id>          -> update a listing
    DELETE /api/listings/<id>          -> delete a listing
    POST   /api/listings/<id>/image    -> upload a listing photo
    GET    /api/inquiries              -> view submitted inquiries
    GET    /api/auth/me                -> current agent profile

Run `python seed.py` once to create the database and demo data.
"""

import os

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS

from extensions import db, jwt
from routes.admin import admin_bp
from routes.auth import auth_bp
from routes.inquiries import inquiries_bp
from routes.listings import listings_bp

try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # python-dotenv is optional; env vars set another way still work

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, "uploads")


def create_app(test_config=None):
    app = Flask(__name__)

    db_url = os.environ.get("DATABASE_URL", f"sqlite:///{os.path.join(BASE_DIR, 'patina.db')}")
    # Neon, Heroku, and some other providers hand out postgres:// URLs, but
    # SQLAlchemy 1.4+ requires the postgresql:// scheme.
    if db_url.startswith("postgres://"):
        db_url = db_url.replace("postgres://", "postgresql://", 1)
    app.config["SQLALCHEMY_DATABASE_URI"] = db_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = os.environ.get("JWT_SECRET_KEY", "dev-secret-change-me")
    app.config["UPLOAD_DIR"] = UPLOAD_DIR

    if test_config:
        app.config.update(test_config)

    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Permissive by default (fine for a demo). In production, set
    # CORS_ORIGINS to your deployed frontend's URL, comma-separated if more
    # than one, e.g. CORS_ORIGINS=https://patina.vercel.app
    cors_origins = os.environ.get("CORS_ORIGINS")
    if cors_origins:
        CORS(app, origins=[o.strip() for o in cors_origins.split(",")])
    else:
        CORS(app)
    db.init_app(app)
    jwt.init_app(app)

    app.register_blueprint(listings_bp, url_prefix="/api/listings")
    app.register_blueprint(inquiries_bp, url_prefix="/api/inquiries")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(admin_bp, url_prefix="/api/admin")

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})

    @app.get("/uploads/<path:filename>")
    def uploaded_file(filename):
        return send_from_directory(app.config["UPLOAD_DIR"], filename)

    @app.errorhandler(404)
    def not_found(_e):
        return jsonify({"error": "Not found"}), 404

    with app.app_context():
        db.create_all()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True, port=5000)

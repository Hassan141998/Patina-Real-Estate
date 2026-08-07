"""Shared Flask extension instances, kept in their own module to avoid
circular imports between app.py, models.py, and the route blueprints."""

from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
jwt = JWTManager()

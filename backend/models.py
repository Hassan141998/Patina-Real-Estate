from datetime import datetime

from werkzeug.security import check_password_hash, generate_password_hash

from extensions import db


class Listing(db.Model):
    __tablename__ = "listings"

    id = db.Column(db.String(20), primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    type = db.Column(db.String(60), nullable=False)
    status = db.Column(db.String(30), nullable=False, default="For Sale")
    beds = db.Column(db.Integer, nullable=False)
    baths = db.Column(db.Integer, nullable=False)
    sqft = db.Column(db.Integer, nullable=False)
    year_built = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text, nullable=False)
    image_filename = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    inquiries = db.relationship("Inquiry", backref="listing", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "address": self.address,
            "price": self.price,
            "type": self.type,
            "status": self.status,
            "beds": self.beds,
            "baths": self.baths,
            "sqft": self.sqft,
            "year_built": self.year_built,
            "description": self.description,
            "image_url": f"/uploads/{self.image_filename}" if self.image_filename else None,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Agent(db.Model):
    __tablename__ = "agents"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(60), unique=True, nullable=False)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {"id": self.id, "username": self.username, "name": self.name, "email": self.email}


class Inquiry(db.Model):
    __tablename__ = "inquiries"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    message = db.Column(db.Text, nullable=False)
    listing_id = db.Column(db.String(20), db.ForeignKey("listings.id"), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "message": self.message,
            "listing_id": self.listing_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

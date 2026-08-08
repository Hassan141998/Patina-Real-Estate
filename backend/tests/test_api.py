import os
import sys

import pytest

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from app import create_app  # noqa: E402
from extensions import db  # noqa: E402
from models import Agent, Listing  # noqa: E402


@pytest.fixture
def app():
    flask_app = create_app({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
    })
    with flask_app.app_context():
        db.create_all()
        db.session.add(Listing(
            id="TST-001", name="Test House", address="1 Test St", price=100000,
            type="Detached", status="For Sale", beds=2, baths=1, sqft=900,
            year_built=2000, description="A test listing.",
        ))
        agent = Agent(username="agent", name="Test Agent", email="agent@test.com")
        agent.set_password("secret123")
        db.session.add(agent)
        db.session.commit()
    yield flask_app


@pytest.fixture
def client(app):
    return app.test_client()


def auth_headers(client):
    res = client.post("/api/auth/login", json={"username": "agent", "password": "secret123"})
    token = res.get_json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_health(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.get_json()["status"] == "ok"


def test_get_listings(client):
    res = client.get("/api/listings")
    assert res.status_code == 200
    assert len(res.get_json()) == 1


def test_get_single_listing(client):
    res = client.get("/api/listings/TST-001")
    assert res.status_code == 200
    assert res.get_json()["name"] == "Test House"


def test_get_missing_listing_404(client):
    res = client.get("/api/listings/NOPE")
    assert res.status_code == 404


def test_search_filters(client):
    res = client.get("/api/listings?min_price=200000")
    assert res.status_code == 200
    assert res.get_json() == []

    res = client.get("/api/listings?search=Test")
    assert len(res.get_json()) == 1


def test_create_listing_requires_auth(client):
    res = client.post("/api/listings", json={"id": "X"})
    assert res.status_code == 401


def test_login_invalid_credentials(client):
    res = client.post("/api/auth/login", json={"username": "agent", "password": "wrong"})
    assert res.status_code == 401


def test_login_and_crud_listing(client):
    headers = auth_headers(client)

    create_res = client.post("/api/listings", json={
        "id": "NEW-001", "name": "New House", "address": "2 New St", "price": 200000,
        "type": "Detached", "beds": 3, "baths": 2, "sqft": 1200, "year_built": 2010,
        "description": "Fresh listing.",
    }, headers=headers)
    assert create_res.status_code == 201
    assert len(client.get("/api/listings").get_json()) == 2

    update_res = client.put("/api/listings/NEW-001", json={"price": 210000}, headers=headers)
    assert update_res.status_code == 200
    assert update_res.get_json()["price"] == 210000

    delete_res = client.delete("/api/listings/NEW-001", headers=headers)
    assert delete_res.status_code == 200
    assert len(client.get("/api/listings").get_json()) == 1


def test_duplicate_listing_id_rejected(client):
    headers = auth_headers(client)
    res = client.post("/api/listings", json={
        "id": "TST-001", "name": "Dup", "address": "x", "price": 1,
        "type": "Detached", "beds": 1, "baths": 1, "sqft": 1, "year_built": 2000,
        "description": "dup",
    }, headers=headers)
    assert res.status_code == 409


def test_create_inquiry(client):
    res = client.post("/api/inquiries", json={"name": "Sam", "email": "sam@test.com", "message": "Hi"})
    assert res.status_code == 201


def test_inquiry_missing_fields(client):
    res = client.post("/api/inquiries", json={"name": "Sam"})
    assert res.status_code == 400


def test_list_inquiries_requires_auth(client):
    client.post("/api/inquiries", json={"name": "Sam", "email": "sam@test.com", "message": "Hi"})
    res = client.get("/api/inquiries")
    assert res.status_code == 401

    headers = auth_headers(client)
    res = client.get("/api/inquiries", headers=headers)
    assert res.status_code == 200
    assert len(res.get_json()) == 1


def test_admin_seed_requires_key_configured(client, monkeypatch):
    monkeypatch.delenv("SEED_KEY", raising=False)
    res = client.get("/api/admin/seed")
    assert res.status_code == 503


def test_admin_seed_rejects_wrong_key(client, monkeypatch):
    monkeypatch.setenv("SEED_KEY", "correct-key")
    res = client.get("/api/admin/seed?key=wrong-key")
    assert res.status_code == 403


def test_admin_seed_refuses_to_overwrite_without_force(client, monkeypatch):
    monkeypatch.setenv("SEED_KEY", "correct-key")
    # fixture db already has one listing (TST-001) seeded
    res = client.get("/api/admin/seed?key=correct-key")
    assert res.status_code == 409


def test_admin_seed_force_reseeds(client, monkeypatch):
    monkeypatch.setenv("SEED_KEY", "correct-key")
    res = client.get("/api/admin/seed?key=correct-key&force=true")
    assert res.status_code == 200
    assert res.get_json()["listings_seeded"] == 36

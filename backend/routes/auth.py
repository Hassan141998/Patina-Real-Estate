from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

from models import Agent

auth_bp = Blueprint("auth", __name__)


@auth_bp.post("/login")
def login():
    data = request.get_json(force=True, silent=True) or {}
    username = data.get("username", "")
    password = data.get("password", "")

    agent = Agent.query.filter_by(username=username).first()
    if not agent or not agent.check_password(password):
        return jsonify({"error": "Invalid username or password"}), 401

    token = create_access_token(identity=agent.username)
    return jsonify({"access_token": token, "agent": agent.to_dict()})


@auth_bp.get("/me")
@jwt_required()
def me():
    username = get_jwt_identity()
    agent = Agent.query.filter_by(username=username).first()
    if not agent:
        return jsonify({"error": "Not found"}), 404
    return jsonify(agent.to_dict())

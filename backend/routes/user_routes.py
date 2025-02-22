from flask import Blueprint, request, jsonify
from models import db, User

user_bp = Blueprint("user_bp", __name__)


@user_bp.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    auth0_id = data.get("auth0_id")
    username = data.get("username")

    if not auth0_id or not username:
        return jsonify({"error": "Auth0_ID or username are invalid"}), 400

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({"error": "username already exists"}), 400

    new_user = User(auth0_id=auth0_id, username=username)
    db.session.add(new_user)
    db.session.commit()

    return jsonify(new_user.to_dict()), 201

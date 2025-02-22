from flask import Blueprint, request, jsonify
from models import db, User, Topic

user_bp = Blueprint("user_bp", __name__)


@user_bp.route("/topics", methods=["POST"])
def create_user():
    data = request.get_json()
    topic_name = data.get("topic_name")
    username = data.get("username")

    if not topic_name or not username:
        return jsonify({"error": "topic name or username are invalid"}), 400

    existing_topic = Topic.query.filter_by(name=topic_name).first()
    if existing_topic:
        return jsonify({"error": "topic already exists"}), 400

    new_topic = Topic(name=topic_name)
    db.session.add(new_topic)
    db.session.commit()

    return jsonify(new_topic.to_dict()), 201

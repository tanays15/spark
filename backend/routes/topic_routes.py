from flask import Blueprint, request, jsonify
from models import Record, db, User, Topic

user_bp = Blueprint("user_bp", __name__)


@user_bp.route("/topics", methods=["POST"])
def manage_topic():
    if request.method == "POST":
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
    elif request.method == "GET":
        username = request.args.get('username')
        if not username:
            return jsonify({"error": "no username provided"})
        user = User.query.filter_by(username=username).first()
        if not user:
            return jsonify({"error": "user does not exist"})
        topics = Topic.query.filter_by(user_id=user.id).all()
        return jsonify([topic.to_dict() for topic in topics]), 200

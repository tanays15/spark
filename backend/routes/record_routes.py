from config import Config
from flask import Blueprint, request, jsonify
from models import db, Record, User

record_bp = Blueprint("record_bp", __name__)


@record_bp.route("/records", methods=["POST", "GET"])
def manage_records():
    if request.method == "GET":
        username = request.args.get('username')
        topic = request.args.get('topic')
        if not username and not topic:
            return jsonify({"error": "Invalid username or topic"}), 400
        user = User.query.filter_by(username=username)
        records = Record.query.filter_by(user_id=user, topic=topic).all()
        return jsonify([record.to_dict() for record in records]), 200
    elif request.method == "POST":
        data = request.get_json()
        username = data.get("username")
        topic = data.get("topic")
        contentScore = data.get("contentScore")
        confidenceScore = data.get("ConfidenceScore")
        totalScore = (contentScore + confidenceScore) // 2
        if not username and not topic:
            return jsonify({"error": "Invalid username or topic"}), 400
        user = User.query.filter_by(username=username)
        record = Record(user_id=user, topic=topic, contentScore=contentScore,
                        confidenceScore=confidenceScore, totalScore=totalScore)
        db.session.add(record)
        db.session.commit()

        return jsonify(record.to_dict()), 200
    else:
        return jsonify({"error": "Invalid Method"}), 400

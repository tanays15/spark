from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    auth0_id = db.Column(db.String(100), unique=True, nullable=False)
    username = db.Column(db.String(100), nullable=False)
    records = db.relationship(
        "Topic", back_populates="User", cascade="all, delete-orphan")
    records = db.relationship(
        "Record", back_populates="User", cascade="all, delete-orphan")

    def to_dict(self):
        return {"id": self.id, "username": self.username, "auth0_id": self.auth0_id}


class Topic(db.Model):
    __tablename__ = 'topics'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    records = db.relationship(
        "Record", back_populates="topic", cascade="all, delete-orphan")

    def to_dict(self):
        avg_content = sum(record.contentScore for record in self.records)
        avg_conf = sum(record.confidenceScore for record in self.records)
        avg_score = sum(record.score for record in self.records)
        record_count = len(self.records)
        if (record_count > 0):
            avg_content /= record_count
            avg_conf /= record_count
            avg_score /= record_count
        return {"id": self.id, "name": self.name,
                "avg_content_score": avg_content,
                "average_confidence_score": avg_conf,
                "avg_score": avg_score,
                "record_count": len(self.records)}


class Record(db.Model):
    __tablename__ = 'records'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    topic_id = db.Column(db.Integer, db.ForeignKey(
        "topics.id"), nullable=False)
    contentScore = db.Column(db.Integer, nullable=False)
    confidenceScore = db.Column(db.Integer, nullable=False)
    score = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True),
                           server_default=func.now())

    user = db.relationship("User", back_populates="records")
    topic = db.relationship("Topic", back_populates="records")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "topic_id": self.topic_id,
            "contentScore": self.contentScore,
            "confidenceScore": self.confidenceScore,
            "score": self.score,
            "created_at": self.created_at
        }

from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func

db = SQLAlchemy()


class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    auth0_id = db.Column(db.String(100), unique=True, nullable=False)
    username = db.Column(db.String(100), nullable=False)
    topics = db.relationship(
        "Topic", back_populates="user", cascade="all, delete-orphan")  # Fix here
    records = db.relationship(
        "Record", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {"id": self.id, "username": self.username, "auth0_id": self.auth0_id}


class Topic(db.Model):
    __tablename__ = 'topics'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    records = db.relationship(
        "Record", back_populates="topic", cascade="all, delete-orphan")
    user = db.relationship("User", back_populates="topics")  # Fix here

    def to_dict(self):
        avg_content = sum(record.contentScore for record in self.records)
        avg_audio = sum(record.audioScore for record in self.records)
        avg_visual = sum(record.visualScore for record in self.records)
        avg_score = sum(record.score for record in self.records)
        record_count = len(self.records)
        if (record_count > 0):
            avg_content /= record_count
            avg_audio /= record_count
            avg_score /= record_count
            avg_visual /= record_count
        return {"id": self.id, "name": self.name,
                "avg_content_score": avg_content,
                "avg_audio": avg_audio, "avg_visual": avg_visual,
                "avg_score": avg_score,
                "record_count": len(self.records)}


class Record(db.Model):
    __tablename__ = 'records'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    topic_id = db.Column(db.Integer, db.ForeignKey(
        "topics.id"), nullable=False)
    contentScore = db.Column(db.Integer, nullable=False)
    visualScore = db.Column(db.Integer, nullable=False)
    audioScore = db.Column(db.Integer, nullable=False)
    score = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True),
                           server_default=func.now())
    feedback = db.Column(db.String)
    resources = db.Column(db.String, nullable=False)

    user = db.relationship("User", back_populates="records")  # Fix here
    topic = db.relationship("Topic", back_populates="records")  # Fix here

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "topic_id": self.topic_id,
            "contentScore": self.contentScore,
            "visualScore": self.visualScore,
            "audioScore": self.audioScore,
            "score": self.score,
            "created_at": self.created_at,
            "feedback": self.feedback,
            "resources": self.resources,
        }

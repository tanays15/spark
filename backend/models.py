from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.sql import func

db = SQLAlchemy()


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    auth0_id = db.Column(db.String(100), unique=True, nullable=False)
    username = db.Column(db.String(100), nullable=False)

    topics = db.relationship(
        "Topic", back_populates="user", cascade="all, delete-orphan")

    def to_dict(self):
        return {"id": self.id, "username": self.username, "password": self.password}


class Record(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    topic_name = db.Column(db.String(100), nullable=False)
    contentScore = db.Column(db.Integer, nullable=False)
    confidenceScore = db.Column(db.Integer, nullable=False)
    score = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True),
                           server_default=func.now())

    user = db.relationship("User", back_populates="topics")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "name": self.name
        }

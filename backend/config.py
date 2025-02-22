import os


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", "postgresql://sparkuser:password@localhost/sparkdb")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

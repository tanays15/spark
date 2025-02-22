from flask import Blueprint
from .user_routes import user_bp
from .record_routes import record_bp


def register_routes(app):
    app.register_blueprint(user_bp)
    app.regiser_blueprint(record_bp)

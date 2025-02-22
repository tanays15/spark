from flask import Flask
from flask_migrate import Migrate
from config import Config
from models import db
from routes import register_routes

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

# Initialize Database
db.init_app(app)
migrate = Migrate(app, db)

# Register Routes
register_routes(app)

if __name__ == "__main__":
    app.run(debug=True)

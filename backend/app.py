from flask import Flask
from flask_migrate import Migrate
from flask_cors import CORS
from config import Config
from models import db
from routes import register_routes

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(Config)

CORS(app)

# Initialize Database
db.init_app(app)
migrate = Migrate(app, db)

# Register Routes
register_routes(app)

if __name__ == "__main__":
    app.run(debug=True)

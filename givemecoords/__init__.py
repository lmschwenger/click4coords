from flask import Flask
from flask_googlemaps import GoogleMaps

from config import Config


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    from click4coords.projection.routes import gmaps
    GoogleMaps(app)
    app.config['GOOGLEMAPS_API_KEY'] = Config.GOOGLE_MAPS_API_KEY
    app.register_blueprint(gmaps)

    return app

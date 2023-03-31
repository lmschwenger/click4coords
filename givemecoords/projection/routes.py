import os

import pyproj
from flask import Blueprint, render_template, request, jsonify
from flask_googlemaps import Map

gmaps = Blueprint('GoogleMaps', __name__)


@gmaps.route("/")
def map():
    # creating a map in the view
    mymap = Map(
        identifier="view-side",
        lat=57.0642,
        lng=9.8985,
        zoom=18,
        style="position: fixed; height: 89vh; padding: 0; width: 100%;",
    )
    epsg_list = get_list_of_epsg_codes()
    return render_template('googlemaps.html', API_KEY=os.environ.get("GOOGLE_MAPS_API_KEY"),
                           googlemap=mymap, epsg_list=epsg_list)


def get_list_of_epsg_codes():
    epsg_codes = ['EPSG:25832', 'EPSG:3182', 'EPSG:4326']
    return epsg_codes


@gmaps.route('/convert', methods=['POST'])
def convert():
    try:
        lat = float(request.json['latitude'])
        lon = float(request.json['longitude'])

        epsg = request.json['epsg']
        out_proj = pyproj.Proj(epsg)

        projected = out_proj(lon, lat)

        return jsonify({
            'x': projected[0],
            'y': projected[1]
        })
    except Exception as e:
        return jsonify({'error': str(e)})

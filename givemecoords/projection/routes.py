import os

import pyproj
from flask import Blueprint, render_template, request, jsonify
from flask_googlemaps import Map

gmaps = Blueprint('GoogleMaps', __name__)


@gmaps.route("/")
def mapview():
    # creating a map in the view
    mymap = Map(
        identifier="view-side",
        lat=37.4419,
        lng=-122.1419,
        markers=[(37.4419, -122.1419)]
    )
    sndmap = Map(
        identifier="sndmap",
        lat=37.4419,
        lng=-122.1419,
        markers={'http://maps.google.com/mapfiles/ms/icons/green-dot.png': [(37.4419, -122.1419)],
                 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png': [(37.4300, -122.1400)]}
    )
    epsg_list = get_list_of_epsg_codes()
    return render_template('googlemaps.html', api_key=os.environ.get("GOOGLE_MAPS_API_KEY"), epsg_list=epsg_list)


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

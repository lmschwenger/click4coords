import os

import pyproj
from flask import Blueprint, render_template, request, jsonify
from flask_googlemaps import Map
from pyproj.aoi import AreaOfInterest
from pyproj.database import query_utm_crs_info

from click4coords.projection.utm_codes import EPSGCodes

gmaps = Blueprint('GoogleMaps', __name__)


@gmaps.route("/")
def render_map():
    # creating a map in the view
    mymap = Map(
        identifier="view-side",
        lat=57.0642,
        lng=9.8985,
        zoom=18,
        style="position: fixed; height: 89vh; padding: 0; width: 100%;",
    )

    epsg_list = EPSGCodes.epsg_codes
    return render_template('googlemaps.html', API_KEY=os.environ.get("GOOGLE_MAPS_API_KEY"),
                           googlemap=mymap, epsg_list=epsg_list)


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


@gmaps.route('/get_utm', methods=['POST'])
def get_utm():
    try:
        lat = float(request.json['latitude'])
        lon = float(request.json['longitude'])

        utm_crs_list = query_utm_crs_info(
            datum_name="WGS 84",
            area_of_interest=AreaOfInterest(
                west_lon_degree=lon,
                south_lat_degree=lat,
                east_lon_degree=lon,
                north_lat_degree=lat,
            ),
        )

        crs = pyproj.CRS.from_epsg(utm_crs_list[0].code)
        utm_zone = str(crs)[-2:]

        return jsonify({'crs': f"UTM Zone: {utm_zone}"})

    except Exception as e:
        return jsonify({'error': str(e)})

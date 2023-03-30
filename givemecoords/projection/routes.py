from flask import Blueprint, render_template
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

    return render_template('googlemaps.html', mymap=mymap, sndmap=sndmap)

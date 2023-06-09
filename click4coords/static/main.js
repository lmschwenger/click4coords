function get_utm() {
    var latitude = document.getElementById('latitude').value;
    var longitude = document.getElementById('longitude').value;

    fetch('/get_utm', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'latitude': latitude,
            'longitude': longitude,
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('utm-zone').value = data.crs;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function convert() {
    var latitude = document.getElementById('latitude').value;
    var longitude = document.getElementById('longitude').value;
    var epsg = document.getElementById('epsg').value;

    fetch('/convert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'latitude': latitude,
            'longitude': longitude,
            'epsg': epsg
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result1').value = data.x;
        document.getElementById('result2').value = data.y;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function convert_to_wgs() {
    var latitude = document.getElementById('result1').value;
    var longitude = document.getElementById('result2').value;
    var epsg = document.getElementById('epsg').value;

    fetch('/convert_to_wgs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'latitude': latitude,
            'longitude': longitude,
            'epsg': epsg
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('latitude').value = data.x;
        document.getElementById('longitude').value = data.y;
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

function copyToClipboard_wgs() {
  const latitude = document.getElementById("latitude").value;
  const longitude = document.getElementById("longitude").value;
  const textToCopy = latitude + "," + longitude;

  const textarea = document.createElement("textarea");
  textarea.value = textToCopy;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

function copyToClipboard_utm() {
  const result1 = document.getElementById("result1").value;
  const result2 = document.getElementById("result2").value;
  const textToCopy = result1 + "," + result2;

  const textarea = document.createElement("textarea");
  textarea.value = textToCopy;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

var map;
var geocoder;

function initialize() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 57.0642, lng: 9.8985},
        zoom: 18,
        mapTypeId: 'satellite'
    });
    geocoder = new google.maps.Geocoder();

    // Add a search box to the map
    var searchBox = new google.maps.places.SearchBox(document.getElementById('search-input'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('search-input'));

    // Bias the search box to within the bounds of the current map
    map.addListener('bounds_changed', function() {
        searchBox.setBounds(map.getBounds());
    });

    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
        var places = searchBox.getPlaces();

        if (places.length == 0) {
            return;
        }

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
            if (!place.geometry) {
                console.log("Returned place contains no geometry");
                return;
            }
            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });

    google.maps.event.addListener(map, 'rightclick', function(event) {
        document.getElementById('latitude').value = event.latLng.lat();
        document.getElementById('longitude').value = event.latLng.lng();
        setTimeout(get_utm, 10);
        get_utm(); // call the get_utm function with the latitude and longitude values
    });
}

google.maps.event.addDomListener(window, 'load', initialize);

function showDialog() {
  var dialog = document.createElement('div');
  dialog.setAttribute('id', 'dialog');
  dialog.innerText = 'Right click to save coordinates';

  var closeButton = document.createElement('button');
  closeButton.innerText = 'Close';
  closeButton.addEventListener('click', function() {
    dialog.style.display = 'none';
  });

var otherDiv = document.getElementById("data-box");
var otherDivRect = otherDiv.getBoundingClientRect();


  dialog.appendChild(closeButton);
  document.body.appendChild(dialog);

  dialog.style.position = 'fixed';
  dialog.style.top = '32.5%';
  dialog.style.left = '20.5%';
  dialog.style.transform = 'translate(-50%, -50%)';
  dialog.style.background = '#fff';
  dialog.style.padding = '1em';
  dialog.style.border = '1px solid #000';
  dialog.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
  dialog.style.zIndex = '9999';
  dialog.style.width = '200px';
  dialog.style.height = '70px';
  dialog.style.borderRadius = '10px';
  dialog.style.top = otherDivRect.top * 1.5 + "px";
  dialog.style.left = otherDivRect.right * 1.5 + "px";
// Add speech bubble arrow
  var arrow = document.createElement('div');
  arrow.style.position = 'absolute';
  arrow.style.top = '50%';
  arrow.style.left = '-10px';
  arrow.style.marginTop = '-10px';
  arrow.style.width = '0';
  arrow.style.height = '0';
  arrow.style.borderTop = '10px solid transparent';
  arrow.style.borderBottom = '10px solid transparent';
  arrow.style.borderRight = '10px solid #fff';
  dialog.appendChild(arrow);
  setTimeout(function() {
    dialog.style.display = 'none';
  }, 5000);
}

window.onload = function() {
  showDialog();
};


function snap_to_map(map) {
    var map;
    var latitude = parseFloat(document.getElementById("latitude").value);
    var longitude = parseFloat(document.getElementById("longitude").value);

    map.setCenter({ lat: latitude, lng: longitude });

}

function snap_to_map_utm(map) {
    var latitude = document.getElementById('result1').value;
    var longitude = document.getElementById('result2').value;
    var epsg = document.getElementById('epsg').value;

    fetch('/convert_to_wgs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'latitude': latitude,
            'longitude': longitude,
            'epsg': epsg
        })
    })
    .then(response => response.json())
    .then(data => {
        map.setCenter({ lat: data.x, lng: data.y })
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
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

function copyToClipboard() {
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
function initialize() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 57.0642, lng: 9.8985},
        zoom: 12,

    });
    google.maps.event.addListener(map, 'rightclick', function(event) {
        document.getElementById('latitude').value = event.latLng.lat();
        document.getElementById('longitude').value = event.latLng.lng();
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


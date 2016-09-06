function angleFromCoordinate(latLng1, latLng2) {
    var dLon = (latLng2.lng - latLng1.lng);

    var y = Math.sin(dLon) * Math.cos(latLng2.lat);
    var x = Math.cos(latLng1.lat) * Math.sin(latLng2.lat) - Math.sin(latLng1.lat) * Math.cos(latLng2.lat) * Math.cos(dLon);

    var brng = Math.atan2(y, x);

    brng = brng * (180 / Math.PI);
    brng = (brng + 360) % 360;
    brng = 360 - brng;
    return Math.floor(brng);
}

function MoveDegrees(degrees) {
    while (degrees < 0 || degrees >= 360) {
        if(degrees < 0) 
            degrees = degrees + 360;
        if(degrees >= 360)
            degrees = degrees - 360;
    }
    return degrees;
}

function rotateMap() {
    if (bearingNow == bearingTarget || positionBefore == null)
        return;
    bearingNow = MoveDegrees(bearingNow);
    var dist = bearingTarget - bearingNow;
    if (dist < 0)
        dist += 360;
    if (dist > 180) {
        bearingNow -= 1;
        map.setBearing(bearingNow);
    } else {
        bearingNow += 1;
        map.setBearing(bearingNow);
    }
}

var rotateby = 0;

var onSuccess = function(pos) {
    document.getElementById("speedField").value = "Speed: " + (pos.coords.speed).toFixed(2);
    document.getElementById("accuracyField").value = "Accuracy: " + pos.coords.accuracy;
    if ((pos.coords.latitude == position.lat && pos.coords.longitude == position.lng))
        return;
    positionBefore = position;
    position = new L.latLng(pos.coords.latitude, pos.coords.longitude);
    naviMarker.moveTo([position.lat, position.lng], 2100);
    naviMarker.start();

    bearingTarget = 180 - angleFromCoordinate(position, positionBefore);
    bearingTarget = MoveDegrees(bearingTarget);
    bearingNow = MoveDegrees(bearingNow);
};

function onError(error) {
    alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

var parisKievLL = [
    [0, 0],
    [10, 10]
];

var navigationIcon = L.icon({
    iconUrl: 'img/navigationIcon.png',
    iconAnchor: [10, 10]
});

var naviMarker = L.Marker.movingMarker(parisKievLL, [10000], { autostart: true, icon: navigationIcon }).addTo(map);

var position = new L.latLng(0, 0);
var positionBefore;
var bearingNow = 0.0;
var bearingTarget = 0.0;

//naviMarker.setOpacity(0);
var customControl = L.Control.extend({

    options: {
        position: 'topright'
    },

    onAdd: function(map) {
        var container = L.DomUtil.create('input', 'leaflet-bar leaflet-control'); // leaflet-control-custom

        container.style.background = "rgba(100,100,100,0.4)";
        container.style.backgroundSize = "90px 20px";
        container.style.width = '90px';
        container.style.height = '20px';
        container.style.border = '0px';
        container.disabled = "true";
        container.value = value;
        container.id = id;
        return container;
    }
});

map.addControl(new customControl(id = "speedField", value = "Speed: 0"));
map.addControl(new customControl(id = "accuracyField", value = "Accuracy: 0"));

navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 2000, enableHighAccuracy: true });

var intervalVariable = window.setInterval(rotateMap, 30);

function setMapPos() {
    if (naviMarker.isRunning())
        map.panTo(naviMarker._latlng);
}
var interval = window.setInterval(setMapPos, 50);

var route = JSON.parse(localStorage.getItem("test"));

var lineStyle = {
    "color": "#ff7800",
    "weight": 4,
    "opacity": 0.65
};

for (i = 0; i < route.coordinates.length; i++) {
    L.geoJson(route.coordinates[i], {
        style: lineStyle
    }).addTo(map);
}

var returnButton = L.Control.extend({

    options: {
        position: 'bottomleft'
    },

    onAdd: function(map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

        container.style.backgroundColor = 'white';
        container.style.backgroundImage = "url(img/returnButton.png)";
        container.style.backgroundSize = "25px 25px";
        container.style.width = '25px';
        container.style.height = '25px';

        container.onclick = function() {
            window.location = "index.html";
        }
        return container;
    }
});

map.addControl(new returnButton());

var st = 0;
var st2 = 0;
//naviMarker.on('start', function(){console.log("start: " + Date.now()); st = Date.now();});
//naviMarker.on('end', function(){console.log("end: " + Date.now() + " " + (st - Date.now()));});

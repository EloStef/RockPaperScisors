var navigationIcon = L.icon({
    iconUrl: 'img/navigationIcon.png'
});

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

function rotateMap() {
    if(bearingNow == bearingTarget || positionBefore == null)
        return;
    if(bearingNow >= 360)
        bearingNow -= 360;
    if(bearingNow < 0)
        bearingNow += 360;
    var dist = bearingTarget - bearingNow;
    if (dist < 0)
            dist += 360;
    if (dist > 180) {
        bearingNow -= 1;
        map.setBearing(bearingNow);
    }
    else {
        bearingNow += 1;
        map.setBearing(bearingNow);
    }
    console.log(dist + " " + bearingNow + "->" + bearingTarget);
}

var onSuccess = function(pos) {
    //// || (pos.coords.accuracy > 150)
    if ((pos.coords.latitude == position.lat && pos.coords.longitude == position.lng))
        return;
    positionBefore = position;
    position = new L.latLng(pos.coords.latitude, pos.coords.longitude);
    map.panTo(position);
    naviMarker.setLatLng(position);
    bearingTarget = angleFromCoordinate(position, positionBefore) + 180;
    if (bearingTarget >= 360)
        bearingTarget -= 360;
    /*alert('Latitude: ' + position.coords.latitude + '\n' +
        'Longitude: ' + position.coords.longitude + '\n' +
        'Altitude: ' + position.coords.altitude + '\n' + 'Accuracy: ' + position.coords.accuracy + '\n' + 'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' + 'Heading: ' + position.coords.heading + '\n' +
        'Speed: ' + position.coords.speed + '\n' +
        'Timestamp: ' + position.timestamp + '\n');*/
};

function onError(error) {
    alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

var naviMarker = L.marker([0, 0], {
    icon: navigationIcon
}).addTo(map);

var position = new L.latLng(0, 0);
var positionBefore;
var bearingNow = 0;
var bearingTarget;

//naviMarker.setOpacity(0);

navigator.geolocation.watchPosition(onSuccess, onError, { timeout: 3000 });

var intervalVariable = window.setInterval(rotateMap, 30);

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
        if (degrees < 0)
            degrees = degrees + 360;
        if (degrees >= 360)
            degrees = degrees - 360;
    }
    return degrees;
}

/*function rotateMap() {
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
}*/

function rotateMap() {
    if (navigationSystem.bearingNow == navigationSystem.bearingTarget || navigationSystem.positionBefore == null)
        return;
    navigationSystem.bearingNow = MoveDegrees(navigationSystem.bearingNow);
    var dist = navigationSystem.bearingTarget - navigationSystem.bearingNow;
    if (dist < 0)
        dist += 360;
    if (dist > 180) {
        navigationSystem.bearingNow -= 1;
        map.setBearing(navigationSystem.bearingNow);
    } else {
        navigationSystem.bearingNow += 1;
        map.setBearing(navigationSystem.bearingNow);
    }
}

var NavigationSystem = function() {
    map.addControl(new label(id = "speedField", value = "Speed: 0"));
    map.addControl(new label(id = "accuracyField", value = "Accuracy: 0"));
    map.addControl(new returnButton());

    this.naviMarker = L.Marker.movingMarker([
        [0, 0], [0, 0]
    ], [10000], { autostart: true, icon: navigationIcon }).addTo(map);

    this.position = new L.latLng(0, 0);
    this.positionBefore;
    this.bearingNow = 0.0;
    this.bearingTarget = 0.0;

    navigator.geolocation.watchPosition(this.successGeoLocate.bind(this), this.errorGeoLocate, { timeout: 2000, enableHighAccuracy: true });
    var intervalRotateMap = window.setInterval(rotateMap, 30);
    var intervalPosMap = window.setInterval(this.setMapPos.bind(this), 50);

    this.loadRoute();
}

NavigationSystem.prototype.setMapPos = function() {
    if (this.naviMarker.isRunning())
        map.panTo(this.naviMarker._latlng);
}

NavigationSystem.prototype.loadRoute = function() {
    var route = JSON.parse(localStorage.getItem("test"));

    for (i = 0; i < route.coordinates.length; i++) {
        L.geoJson(route.coordinates[i], {
            style: lineStyle
        }).addTo(map);
    }
}

NavigationSystem.prototype.successGeoLocate = function(pos) {
    document.getElementById("speedField").value = "Speed: " + (pos.coords.speed).toFixed(2);
    document.getElementById("accuracyField").value = "Accuracy: " + pos.coords.accuracy;

    if ((pos.coords.latitude == this.position.lat && pos.coords.longitude == this.position.lng))
        return;

    this.positionBefore = this.position;
    this.position = new L.latLng(pos.coords.latitude, pos.coords.longitude);

    this.naviMarker.moveTo([this.position.lat, this.position.lng], 2100);
    this.naviMarker.start();

    this.bearingTarget = 180 - angleFromCoordinate(this.position, this.positionBefore);
    this.bearingTarget = MoveDegrees(this.bearingTarget);
    this.bearingNow = MoveDegrees(this.bearingNow);
};

NavigationSystem.prototype.errorGeoLocate = function(error) {
    alert('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}

var navigationSystem = new NavigationSystem();

//naviMarker.setOpacity(0);

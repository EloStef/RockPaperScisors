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
    this.state = "InitState";
    this.initAmount = 0;
    this.route = new Route();

    map.addControl(new label(id = "speedField", value = "Speed: 0"));
    map.addControl(new label(id = "accuracyField", value = "Accuracy: 0"));
    newButton(
        '<img id="navimg" style="margin: -1px 0px 0px -5px;" src="img/navigationButtonOff.png">',
        function() {
            if ($("#navimg").attr("src").indexOf("navigationButtonOff") !== -1) {
                navigationSystem.initNavigation();
            } else {
                navigationSystem.turnOffNavigation();
            }
        },
        'topleft',
        'navigationBtn');

    var lastCoords = getLastCoords();
    this.naviMarker = L.Marker.movingMarker([
        [lastCoords[0], lastCoords[1]],
        [lastCoords[0], lastCoords[1]]
    ], [10000], { autostart: true, icon: navigationIcon }).addTo(map);

    this.position = new L.latLng(0, 0);
    this.positionBefore;
    this.bearingNow = 0.0;
    this.bearingTarget = 0.0;

    this.watchGeoLocation;
    this.initNavigation();
    var intervalRotateMap = window.setInterval(rotateMap, 30);
    var intervalPosMap = window.setInterval(this.setMapPos.bind(this), 100);

    this.loadRoute();
}

NavigationSystem.prototype = {
    initNavigation: function() {
        this.initAmount = 0;
        this.watchGeoLocation = navigator.geolocation.watchPosition(this.initSuccessGeoLocate.bind(this), this.errorGeoLocate.bind(this), { timeout: 100, enableHighAccuracy: true });
    },
    initSuccessGeoLocate: function(pos) {
        setNavigationButtonImage("img/navigationButtonOn.png");
        this.initAmount += 1;
        this.position = new L.latLng(pos.coords.latitude, pos.coords.longitude);
        this.naviMarker.moveTo([pos.coords.latitude, pos.coords.longitude], 1);
        map.panTo(this.naviMarker._latlng);
        if (this.initAmount > 10) {
            navigator.geolocation.clearWatch(this.watchGeoLocation);
            this.watchGeoLocation = navigator.geolocation.watchPosition(this.successGeoLocate.bind(this), this.errorGeoLocate.bind(this), { timeout: 2000, enableHighAccuracy: true });
        }
    },
    turnOffNavigation: function() {
        setNavigationButtonImage("img/navigationButtonOff.png");
        navigator.geolocation.clearWatch(this.watchGeoLocation);
        this.bearingTarget = 0;
    },
    setMapPos: function() {
        if (this.naviMarker.isRunning())
            map.panTo(this.naviMarker._latlng);
    },
    loadRoute: function() {
        var routejson = localStorage.getItem(location.search.split('=')[1]);
        if (routejson != null) {
            this.route.dehydrate(routejson);
            this.route.loadOnMap(false);
        }
    },
    successGeoLocate: function(pos) {
        setNavigationButtonImage("img/navigationButtonOn.png");
        if (pos.coords.speed != undefined)
            document.getElementById("speedField").value = "Speed: " + (pos.coords.speed).toFixed(2);
        if (pos.coords.accuracy != undefined)
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

        setLastCoords(pos.coords.latitude, pos.coords.longitude);

        this.route.loadOnMap(false);

        console.log(this.distance(this.position.lat, this.position.lng, 52.2318, 21.0060, "K"));
    },
    errorGeoLocate: function(error) {
        navigator.geolocation.clearWatch(this.watchGeoLocation);
        gpsDialog();
        gpsDialog();//Nie wiem czemu tu dwa były
        setNavigationButtonImage("img/navigationButtonOff.png");
    },
    gpsDialogYes: function() {
        $(".leaflet-modal").hide();
        cordova.plugins.diagnostic.switchToLocationSettings();
    },
    gpsDialogNo: function() {
        $(".leaflet-modal").hide();
        setNavigationButtonImage("img/navigationButtonOff.png");
    },
    distance: function(lat1, lon1, lat2, lon2, unit) {
        var radlat1 = Math.PI * lat1 / 180
        var radlat2 = Math.PI * lat2 / 180
        var theta = lon1 - lon2
        var radtheta = Math.PI * theta / 180
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist)
        dist = dist * 180 / Math.PI
        dist = dist * 60 * 1.1515
        if (unit == "K") { dist = dist * 1.609344 }
        if (unit == "N") { dist = dist * 0.8684 }
        return dist
    }
}

var navigationSystem = new NavigationSystem();

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
    this.initAmount = 0;

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

    this.naviPosition = new naviPosition();

    this.watchGeoLocation;
    this.initNavigation();
    var intervalRotateMap = window.setInterval(rotateMap, 30);
    var intervalPosMap = window.setInterval(this.setMapPos.bind(this), 100);

    //Jezeli ladujemy jakas droge
    this.route = new Route(getFirstUrlArgument());
    //this.loadRoute();
    this.avspeed = 0.0;
    this.speedAmount = 0;
    this.distance = 0.0;

    if(this.route.points.length > 1){
        mapSystem.map.addControl(new wrongDirectionImg(id = "wrongWayImg"));
        activveWrongWayImg(false);
    }
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
        this.naviPosition.pushCoordDistanceIfHigher(
            new L.latLng(pos.coords.latitude, pos.coords.longitude),
            0.01);
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
        var routejson = getFirstUrlArgument();
        if (routejson != null) {
            this.route.dehydrate(routejson);
            this.route.loadOnMap(false);
        }
    },
    successGeoLocate: function(pos) {
        setNavigationButtonImage("img/navigationButtonOn.png");
        if (pos.coords.speed != undefined){
            document.getElementById("speedField").value = (pos.coords.speed).toFixed(0) + " km/h";
            this.avspeed += pos.coords.speed;
            this.speedAmount += 1;
            document.getElementById("avSpeedField").value = (this.avspeed / this.speedAmount).toFixed(0) + " km/h";
            if(this.speedAmount > 100000){
                this.avspeed = this.avspeed / this.speedAmount;
                this.speedAmount = 1;
            }
        }

        if ((pos.coords.latitude == this.position.lat && pos.coords.longitude == this.position.lng))
            return;

        if(this.positionBefore && this.position)
            this.distance += distance(this.position.lat, this.position.lng, this.positionBefore.lat, this.positionBefore.lng, "K");
        document.getElementById("distanceField").value = (this.distance).toFixed(2) + " km";

        this.positionBefore = this.position;
        this.position = new L.latLng(pos.coords.latitude, pos.coords.longitude);

        this.naviMarker.moveTo([this.position.lat, this.position.lng], 2100);
        this.naviMarker.start();

        if(this.naviPosition.pushCoordDistanceIfHigher(
            new L.latLng(pos.coords.latitude, pos.coords.longitude),
            0.01)){
                this.bearingTarget = (180 - this.naviPosition.getDirection());
        }

        this.bearingTarget = MoveDegrees(this.bearingTarget);
        this.bearingNow = MoveDegrees(this.bearingNow);

        if(this.route.points.length > 1){
            this.isRouteDone();
            this.wrongDirection();
            this.route.loadOnMapForNavigation(pos.coords.latitude, pos.coords.longitude, this.naviPosition.getDirection());
        }
    },
    errorGeoLocate: function(error) {
        document.getElementById("speedField").value = "-";
        document.getElementById("avSpeedField").value = "-";
        document.getElementById("distanceField").value = "-";

        navigator.geolocation.clearWatch(this.watchGeoLocation);
        gpsDialog();
        gpsDialog();//Nie wiem czemu tu dwa były
        setNavigationButtonImage("img/navigationButtonOff.png");
    },
    wrongDirection: function() {
        if(this.route.points.length < 2)
            return;
        if(this.naviPosition.isDirectionSet()){
            if(this.route.isDirectionCorrect()){
                activveWrongWayImg(false);
                return;
            }
        }
        activveWrongWayImg(true);
    },
    isRouteDone: function() {
        var endPoint = this.route.getLastCoords();
        if(distance(this.position.lat, this.position.lng, endPoint[1], endPoint[0], "K") < 0.02){
            routeDoneDialog();
            navigator.geolocation.clearWatch(this.watchGeoLocation);
        }
    },
    gpsDialogYes: function() {
        $(".leaflet-modal").hide();
        cordova.plugins.diagnostic.switchToLocationSettings();
    },
    gpsDialogNo: function() {
        $(".leaflet-modal").hide();
        setNavigationButtonImage("img/navigationButtonOff.png");
    },
    getNavigationIconPosition: function(){
        return this.naviMarker;
    }
}

var navigationSystem = new NavigationSystem();

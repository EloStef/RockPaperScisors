var blackosmUrl = 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    blackosmAttrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    blackosm = L.tileLayer(blackosmUrl, {
        maxZoom: 18,
        attribution: blackosmAttrib
    });

var baselayers = {
    "Map": L.tileLayer('http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: ''
    }),
    "Earth": L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '',
    maxZoom: 18,
    })
}

var overlays = {};
/*var OpenStreetMap_DE = L.tileLayer('http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
});

var HERE_hybridDay = L.tileLayer('http://{s}.{base}.maps.cit.api.here.com/maptile/2.1/{type}/{mapID}/hybrid.day/{z}/{x}/{y}/{size}/{format}?app_id={app_id}&app_code={app_code}&lg={language}', {
    attribution: 'Map &copy; 1987-2014 <a href="http://developer.here.com">HERE</a>',
    subdomains: '1234',
    mapID: 'newest',
    app_id: '<your app_id>',
    app_code: '<your app_code>',
    base: 'aerial',
    maxZoom: 18,
    type: 'maptile',
    language: 'eng',
    format: 'png8',
    size: '256'
});

var Esri_WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});*/

function getLastCoords() {
    var lastcords = localStorage.getItem("lastcoords");
    if (lastcords == null)
        return [52.2318, 21.0060, 12];
    return JSON.parse(lastcords);
}

function setLastCoords(lat, lng) {
    localStorage.setItem("lastcoords", JSON.stringify([lat, lng, map.getZoom()]));
}

var map = L.map('map', {
        rotate: true
    })
    .setView([getLastCoords()[0], getLastCoords()[1]], getLastCoords()[2]);

map.attributionControl.setPrefix("")
L.control.layers(baselayers, overlays).addTo(map);

baselayers["Map"].addTo(map);

var MapSystem = function() {
    this.map = map;

    this.markersLayer = L.layerGroup();
    this.markersLayer.addTo(this.map);

    this.linesLayer = L.layerGroup();
    this.linesLayer.addTo(this.map);

    newButton(
        '<img style="margin: -1px 0px 0px -5px;" src="img/returnButton.png">',
        function() { window.location = "index.html"; },
        'bottomleft',
        'returnBtn');
}

MapSystem.prototype = {
    addMarker: function(latlng, icon) {
        var newMarker = L.marker(latlng, { icon: icon });
        this.markersLayer.addLayer(newMarker);
        return newMarker;
    },
    addLinesFromGeoJson: function(points) {
        var newLines = L.geoJson(points, {
            style: function(feature) {
                if (feature.geometry.road_type == "cycleway")
                    return lineMainCycleRoad;
                return lineMainNormalRoad;
            }
        });
        this.linesLayer.addLayer(newLines);
        return newLines;
    },
    clearMarkers: function() {
        this.markersLayer.clearLayers();
    },
    clearLines: function() {
        this.linesLayer.clearLayers();
    },
    clearMapLayers: function() {
        this.clearMarkers();
        this.clearLines();
    },
    switchBaseMap: function() {

    }
}

var mapSystem = new MapSystem();

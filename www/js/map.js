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
    "Gray": L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: ''
    }),
    "Earth": L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: '',
    maxZoom: 18,
    })
}

var overlays = {};

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

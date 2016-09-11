var blackosmUrl = 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
    blackosmAttrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    blackosm = L.tileLayer(blackosmUrl, {
        maxZoom: 18,
        attribution: blackosmAttrib
    });

var map = L.map('map', {
        rotate: true
    })
    .setView([55, 10], 12)
    .addLayer(blackosm);

var MapSystem = function() {
    this.map = map;

    this.markersLayer = L.layerGroup();
    this.markersLayer.addTo(this.map);

    this.linesLayer = L.layerGroup();
    this.linesLayer.addTo(this.map);
}

MapSystem.prototype = {
    addMarker: function(latlng, icon) {
        var newMarker = L.marker(latlng, { icon: icon });
        this.markersLayer.addLayer(newMarker);
        return newMarker;
    },
    addLinesFromGeoJson: function(points, style) {
        var newLines = L.geoJson(points, { style: style });
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
    }
}

var mapSystem = new MapSystem();

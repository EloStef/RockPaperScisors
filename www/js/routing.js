var RoutingSystem = function() {
    this.graphhopperPrefix = "https://graphhopper.com/api/1/route?";
    this.graphhopperSuffix = "&vehicle=bike&debug=true&key=57b19165-fee6-425d-962e-b994570e34f0&type=json&points_encoded=false";

    this.saveFormat = { name: "test", coordinates: [] };

    this.lastpoint;
};

RoutingSystem.prototype.graphhopperPointString = function(latlng) {
    return "point=" + latlng.lat + "," + latlng.lng;
}

RoutingSystem.prototype.getGraphhopperUrl = function(point1, point2) {
    return this.graphhopperPrefix + point1 + '&' + point2 + this.graphhopperSuffix;
}

RoutingSystem.prototype.createNewRoute = function(clickEvent) {
    if (this.lastpoint == null) {
        this.lastpoint = clickEvent.latlng;
        L.marker(clickEvent.latlng, { icon: routingMarkIcon }).addTo(map);
    } else {
        var self = this;
        $.getJSON(
            this.getGraphhopperUrl(this.graphhopperPointString(this.lastpoint),
                this.graphhopperPointString(clickEvent.latlng)),
            function(data) {
                L.geoJson(data.paths[0].points, {
                    style: lineStyle
                }).addTo(map);
                self.lastpoint = clickEvent.latlng;
                self.saveFormat.coordinates.push(data.paths[0].points);
                L.marker(clickEvent.latlng, { icon: routingMarkIcon }).addTo(map);
            }
        );
    }
}

function saveNewRoute() {
    localStorage.setItem(routingSystem.saveFormat.name, JSON.stringify(routingSystem.saveFormat));
    window.location = "index.html";
}

var routingSystem = new RoutingSystem();
map.on('click', function(clickEvent) {
    routingSystem.createNewRoute(clickEvent);
});

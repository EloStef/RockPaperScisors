var RoutingSystem = function() {
    this.geoSystem = graphHopperSystem;

    this.route = new Route();

    this.routeCareTaker = new CareTaker();
    this.routeCareTaker.add(this.route.hydrate());

    map.on('click', function(clickEvent) {
        routingSystem.createNewRoute(clickEvent);
    });
};

RoutingSystem.prototype = {

    undo: function() {
        var memento = this.routeCareTaker.undo();
        if (memento) {
            this.route.dehydrate(memento);
            mapSystem.clearMapLayers();
            this.route.loadOnMap(true);
        }
        return;
    },

    redo: function() {
        var memento = this.routeCareTaker.redo();
        if (memento) {
            this.route.dehydrate(memento);
            mapSystem.clearMapLayers();
            this.route.loadOnMap(true);
        }
        return;
    },

    createNewRoute: function(clickEvent) {
        if (this.route.getLastPoint() == null) {
            this.route.addNewPoint(clickEvent.latlng);
            this.route.loadOnMap(true);
            this.routeCareTaker.add(this.route.hydrate());
        } else {
            var self = this;
            $.getJSON(
                this.geoSystem.getUrl(self.route.getLastPoint(), clickEvent.latlng),
                function(data) {
                    //mapSystem.addLinesFromGeoJson(data.paths[0].points);
                    self.route.addNewPoint(clickEvent.latlng);
                    self.route.addNewPath(data.paths[0].points, data.paths[0].instructions);
                    console.log(self.route.paths);
                    mapSystem.addMarker(clickEvent.latlng, routingMarkIcon);
                    self.route.loadOnMap(true);
                    self.routeCareTaker.add(self.route.hydrate());
                }
            );
        }
        setLastCoords(clickEvent.latlng.lat, clickEvent.latlng.lng);
    }
}

var routingSystem = new RoutingSystem();

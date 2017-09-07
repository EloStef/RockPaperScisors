var RoutingSystem = function() {
    this.geoSystem = GetSystem();
    this.geoSystemName = GetSystemName();

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
            this.geoSystem.getRoute(self, self.route.getLastPoint(), clickEvent.latlng);
            // if (this.geoSystemName == system_keys[1]) {
            //     $.ajax({
            //         url: this.geoSystem.getUrl(self.route.getLastPoint(), clickEvent.latlng),
            //         success: function(data) {
            //             var data_ = JSON.parse(data);
            //             self.route.addNewPoint(clickEvent.latlng);
            //             self.route.addNewPath(data_.paths[0].points, data_.paths[0].instructions);
            //             mapSystem.addMarker(clickEvent.latlng, routingMarkIcon);
            //             self.route.loadOnMap(true);
            //             self.routeCareTaker.add(self.route.hydrate());
            //         }
            //     });
            // } else {
            //     $.getJSON(
            //         this.geoSystem.getUrl(self.route.getLastPoint(), clickEvent.latlng),
            //         function(data) {
            //             //mapSystem.addLinesFromGeoJson(data.paths[0].points);
            //             self.route.addNewPoint(clickEvent.latlng);
            //             self.route.addNewPath(data.paths[0].points, data.paths[0].instructions);
            //             // console.log(self.route.paths);
            //             mapSystem.addMarker(clickEvent.latlng, routingMarkIcon);
            //             self.route.loadOnMap(true);
            //             self.routeCareTaker.add(self.route.hydrate());
            //         }
            //     );
            // }
            // var data = '{ "paths": [{ "instructions": [{ "interval": [ 0, 1 ]} ],"points": { "coordinates": [ [ 52.999950, 22.999126 ] ,[ 53.002945, 23.001317 ] ], "type": "LineString"} } ] }';
            // var data_ = JSON.parse(data);
            // console.log(data_.paths[0].points); http://localhost/geo/path/run.cgi?x1=53.11381149316824&y1=23.142700195312504&x2=53.15665305315798&y2=22.439575195312504
        }
        setLastCoords(clickEvent.latlng.lat, clickEvent.latlng.lng);
    }
}

var routingSystem = new RoutingSystem();
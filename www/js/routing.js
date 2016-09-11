$(document).ready(function () {
    $(".nav").toggle();
    $(".menu").click(function () {
        if ( $(".nav").css('display') == 'none' ){
            $(".map").css("height", "80%");
        } else {
            $(".map").css("height", "95%");
        }
        $(".nav").toggle();
    });
});

var RoutingSystem = function() {
    this.graphhopperPrefix = "https://graphhopper.com/api/1/route?";
    this.graphhopperSuffix = "&vehicle=bike&debug=true&key=57b19165-fee6-425d-962e-b994570e34f0&type=json&points_encoded=false";

    this.route = new Route();

    this.routeCareTaker = new CareTaker();
    this.routeCareTaker.add(this.route.hydrate());

    map.addControl(new returnButton());

    map.on('click', function(clickEvent) {
        routingSystem.createNewRoute(clickEvent);
    });
};

RoutingSystem.prototype = {

    graphhopperPointString: function(latlng) {
        return "point=" + latlng.lat + "," + latlng.lng;
    },

    getGraphhopperUrl: function(point1, point2) {
        return this.graphhopperPrefix + point1 + '&' + point2 + this.graphhopperSuffix;
    },

    undo: function() {
        var memento = this.routeCareTaker.undo();
        if (memento) {
            this.route.dehydrate(memento);
            mapSystem.clearMapLayers();
            this.route.loadOnMap();
        }
        return;
    },

    redo: function() {
        var memento = this.routeCareTaker.redo();
        console.log(memento);
        console.log(this.routeCareTaker);
        if (memento) {
            this.route.dehydrate(memento);
            mapSystem.clearMapLayers();
            this.route.loadOnMap();
        }
        return;
    },

    createNewRoute: function(clickEvent) {
        if (this.route.getLastPoint() == null) {
            this.route.addNewPoint(clickEvent.latlng);
            mapSystem.addMarker(clickEvent.latlng, routingMarkIcon);

            this.routeCareTaker.add(this.route.hydrate());
            console.log(this.routeCareTaker);
        } else {
            var self = this;
            $.getJSON(
                this.getGraphhopperUrl(this.graphhopperPointString(self.route.getLastPoint()),
                    this.graphhopperPointString(clickEvent.latlng)),
                function(data) {
                    mapSystem.addLinesFromGeoJson(data.paths[0].points, lineStyle);
                    self.route.addNewPoint(clickEvent.latlng);
                    self.route.addNewPath(data.paths[0].points);
                    mapSystem.addMarker(clickEvent.latlng, routingMarkIcon);

                    self.routeCareTaker.add(self.route.hydrate());
                }
            );
        }
    }
}

function saveNewRoute() {
    localStorage.setItem(routingSystem.saveFormat.name, JSON.stringify(this.route.hydrate()));
    window.location = "index.html";
}

var routingSystem = new RoutingSystem();


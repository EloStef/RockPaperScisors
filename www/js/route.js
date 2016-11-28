var Route = function() {
    this.points = [];
    this.paths = [];
    this.i = 0;
};

Route.prototype = {
    getLastPoint: function(latlng) {
        if (this.points.length > 0)
            return this.points[this.points.length - 1];
        return null;
    },
    setName: function(name) {
        this.name = name;
    },
    addNewPoint: function(point) {
        this.points.push(point);
    },
    addNewPath: function(coords, instructions) {
        for (var i = 0; i < instructions.length - 1; i++) {
            var road_type = "";
            if (instructions[i].annotation_text != undefined)
                if (instructions[i].annotation_text.indexOf("cycleway") !== -1)
                    road_type = "cycleway"
                else
                    road_type = "normal";
            else
                road_type = "normal";
            for (j = instructions[i].interval[0]; j < instructions[i].interval[1]; j++) {
                coords.coordinates[j].road_type = road_type;
            }
        }
        var self = this;
        this.separtePathByRoadType(coords.coordinates).forEach(function(path) {
            self.paths.push(path);
        });
    },
    loadOnMap: function(withMarks) {
        mapSystem.clearMapLayers();
        for (var i = 0; i < this.paths.length; i++) {
            mapSystem.addLinesFromGeoJson(this.paths[i]);
        }
            for (i = 0; i < this.points.length; i++) {
                if (i == 0)
                    mapSystem.addMarker(this.points[0], startMarkIcon);
                else if (i == this.points.length - 1)
                    mapSystem.addMarker(this.points[i], endMarkIcon);
                else
                    if (withMarks)
                        mapSystem.addMarker(this.points[i], routingMarkIcon);
            }
    },
    loadOnMapForNavigation: function() {
        var navigationPath = [];
        for (i = 0; i < this.paths.length; i++) {
            navigationPath = navigationPath.concat(this.paths[i].coordinates);
        }
        this.paths[0].coordinates = navigationPath;
        this.paths = new Array(this.paths[0]);
        this.loadOnMap(false);
        mapSystem.addLinesFromGeoJson(this.paths[0], lineMainCycleRoad);
    },
    separtePathByRoadType: function(coords) {
        var linesByRoadType = [1, 1];
        var amount = 2;
        var lastRoadType = coords[0].road_type;
        linesByRoadType.push({ coordinates: [], road_type: lastRoadType, type: "LineString" });
        linesByRoadType[amount].coordinates.push(coords[0]);
        for (var i = 1; i < coords.length; i++) {
            linesByRoadType[amount].coordinates.push(coords[i]);
            if (lastRoadType != coords[i].road_type) {
                amount++;
                lastRoadType = coords[i].road_type;
                linesByRoadType.push({ coordinates: [], road_type: lastRoadType, type: "LineString" });
                linesByRoadType[amount].coordinates.push(coords[i]);
            }
        }
        linesByRoadType.shift();
        linesByRoadType.shift();
        linesByRoadType.pop();
        return linesByRoadType;
    },
    hydrate: function() {
        var memento = JSON.stringify(this);
        return memento;
    },
    dehydrate: function(memento) {
        var m = JSON.parse(memento);
        this.name = m.name;
        this.points = m.points;
        this.paths = m.paths;
    },
    saveInTemporary: function() {
        localStorage.setItem("temporary", routingSystem.route.hydrate());
        window.location = "routeSave.html";
    },
    saveFromTemporary: function(name) {
        var route = localStorage.getItem("temporary");
        localStorage.setItem("N" + name, route);
    }
}

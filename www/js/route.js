var Route = function(routeName) {
    this.points = [];
    this.paths = [];
    this.i = 0;
    //Jezeli ladujemy jakas 
    console.log("laduje droge z URL" + routeName);
    if(routeName != "" && routeName != undefined){
        this.dehydrate(localStorage.getItem(routeName));
        this.loadOnMap(false);
    }
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
        for (var i = 0; i < coords.coordinates.length; i++) {
            if (i == 0 && this.points.length > 2) {
                coords.coordinates[i][2] =
                    distance(coords.coordinates[i][0],
                        coords.coordinates[i][1],
                        this.points[this.points.length - 2].lng,
                        this.points[this.points.length - 2].lat, 
                        "K"
                    );
            } else if(i == 0) {
                coords.coordinates[i][2] = 0;
            } else {
                coords.coordinates[i][2] =
                distance(coords.coordinates[i][0],
                    coords.coordinates[i][1],
                    coords.coordinates[i - 1][0],
                    coords.coordinates[i - 1][1], "K"
                );
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
    loadOnMapForNavigation: function(lat, lng) {
        mapSystem.clearMapLayers();
        var currentCords = this.getNextPointOfNavigationByPos(lat, lng);
        if(currentCords != undefined){
            this.paths[currentCords[0]].coordinates[currentCords[1]].road_type = "driven";
            var tempPath = [];
            var self = this;
            console.log(this.paths);
            this.paths.forEach(function (item, index) {
                self.separtePathByRoadType(item.coordinates).forEach(function(path) {
                    tempPath.push(path);
                });
                console.log(tempPath);
            });
            this.paths = tempPath;
        }

        for (var i = 0; i < this.paths.length; i++) {
            mapSystem.addLinesFromGeoJson(this.paths[i]);
        }

        mapSystem.addMarker(this.points[0], startMarkIcon);
        mapSystem.addMarker(this.points[this.points.length - 1], endMarkIcon);
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
    getNextPointOfNavigationByPos: function(lat, lon){
        var theSmallestError = minError;
        var point;
        var paths = this.paths;
        this.paths.forEach(function (item, index) {
            item.coordinates.forEach(function (coord, indexCoord) {
                var tempDist = 1000;
                if(index > 0 && indexCoord == 0){
                    console.log(lat + " "  + lon + " "  + coord[0] + " "  + coord[1]);
                    tempDist = 
                    distance(lon, lat, 
                        paths[index - 1].coordinates[paths[index - 1].coordinates.length - 1][0],
                        paths[index - 1].coordinates[paths[index - 1].coordinates.length - 1][1],
                        "K")
                    + distance(lon, lat, coord[0], coord[1], "K");
                }
                else if(indexCoord > 0){
                    tempDist = 
                    distance(lon, lat, 
                        paths[index].coordinates[indexCoord - 1][0],
                        paths[index].coordinates[indexCoord - 1][1],
                        "K")
                    + distance(lon, lat, coord[0], coord[1], "K");
                }
                if(tempDist - coord[2] < theSmallestError){
                    point = [index, indexCoord];
                    theSmallestError = tempDist - coord[2];
                }
            })
        });
    return point;
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
    },
}

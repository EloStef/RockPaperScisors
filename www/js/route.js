var Route = function(routeName) {
    this.points = [];
    this.paths = [];
    this.i = 0;

    if (routeName != "" && routeName != undefined) {
        this.dehydrate(localStorage.getItem(routeName));
        if(this.paths.length > 0)
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
        console.log(instructions);
        for (var i = 0; i < instructions.length; i++) {
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
        console.log(coords.coordinates.length);
        for (var i = 0; i < coords.coordinates.length; i++) {
            if (i == 0 && this.points.length > 2) {
                coords.coordinates[i][2] =
                    distance(coords.coordinates[i][0],
                        coords.coordinates[i][1],
                        this.points[this.points.length - 2].lng,
                        this.points[this.points.length - 2].lat,
                        "K"
                    );
            } else if (i == 0) {
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
            // console.log(this.paths[i]);
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
    loadOnMapForNavigation: function(lat, lng, dist) {
        mapSystem.clearMapLayers();

        this.nextPointId = this.getNextPointOfNavigationByPos(lat, lng, dist);

        if (this.nextPointId != undefined) {
            //tworzenie linii przejechanej trasy
            this.drivenPath = { coordinates: [], road_type: "driven", type: "LineString" };
            for (i = 0; i <= this.nextPointId[0]; i++) {
                var jLength = this.paths[i].coordinates.length;
                if (i == this.nextPointId[0]) {
                    jLength = this.nextPointId[1];
                }
                for (j = 0; j < jLength; j++) {
                    this.drivenPath.coordinates.push(this.paths[i].coordinates[j]);
                }
            }
            this.lastPoint = this.drivenPath.coordinates[this.drivenPath.coordinates.length - 1];
        }

        for (var i = 0; i < this.paths.length; i++) {
            mapSystem.addLinesFromGeoJson(this.paths[i]);
        }

        

        mapSystem.addMarker(this.points[0], startMarkIcon);
        mapSystem.addMarker(this.points[this.points.length - 1], endMarkIcon);

        this.loadOnMap(false);
        mapSystem.addLinesFromGeoJson(this.drivenPath);

        if (this.nextPointId == undefined)
            return;
        
        //this.printLinesBetweenLastAndNextPoint();
        this.runPrintingLinesFromLastToNextPoint();
    },
    runPrintingLinesFromLastToNextPoint: function() {
        /*if (this.intervalPrintingFromLastToNextPoint == undefined || this.intervalPrintingFromLastToNextPoint == null)
            clearInterval(this.intervalPrintingFromLastToNextPoint);
        
        this.intervalPrintingI = 0;
        clearInterval(this.intervalPrintingFromLastToNextPoint);*/
        if (this.intervalPrintingFromLastToNextPoint != undefined)
            return;

        this.intervalPrintingFromLastToNextPoint =
            window.setInterval(this.printLinesBetweenLastAndNextPoint.bind(this), 100);

    },
    printLinesBetweenLastAndNextPoint: function() {
        this.intervalPrintingI += 1;
        if (this.nextPointId[0] == undefined) //|| this.intervalPrintingI > 20)
            return;
            //clearInterval(this.intervalPrintingFromLastToNextPoint);

        var coords = [
            navigationSystem.naviMarker.getLatLng().lng,
            navigationSystem.naviMarker.getLatLng().lat
        ];
        this.lineFromLastPoint = {
            coordinates: [],
            road_type: "driven",
            type: "LineString"
        };
        this.lineFromLastPoint.coordinates.push(coords);
        this.lineFromLastPoint.coordinates.push(this.lastPoint);

        this.lineToNextPoint = {
            coordinates: [],
            road_type: this.paths[this.nextPointId[0]].road_type,
            type: "LineString"
        };
        this.lineToNextPoint.coordinates.push(coords);
        this.lineToNextPoint.coordinates.push(this.paths[this.nextPointId[0]].coordinates[this.nextPointId[1]]);

        if (this.mapLineFromLastPoint != undefined)
            this.mapLineFromLastPoint.clearLayers();
        if (this.mapLineToNextPoint != undefined)
            this.mapLineToNextPoint.clearLayers();

        this.mapLineFromLastPoint = mapSystem.addLinesFromGeoJson(this.lineFromLastPoint);
        this.mapLineToNextPoint = mapSystem.addLinesFromGeoJson(this.lineToNextPoint);
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
    getNextPointOfNavigationByPos: function(lat, lon, direction) {
        direction = MoveDegrees(direction);
        var theSmallestDirectionError = minError;
        var theSmallestUniversalError = minError;
        var point;
        var paths = this.paths;
        var directionState = false;
        this.paths.forEach(function(item, index) {
            item.coordinates.forEach(function(coord, indexCoord) {
                var tempDist = 1000;
                var ind = 0;
                var coordIndex = 0;

                if (index > 0 && indexCoord == 0) {
                    ind = index - 1;
                    coordIndex = paths[index - 1].coordinates.length - 1;

                } else if (indexCoord > 0) {
                    ind = index;
                    coordIndex = indexCoord - 1
                }
                tempDist = distance(lon, lat,
                    paths[ind].coordinates[coordIndex][0],
                    paths[ind].coordinates[coordIndex][1],
                    "K") + distance(lon, lat, coord[0], coord[1], "K");

                var distError = tempDist - coord[2];

                if (distError < theSmallestDirectionError) {
                    var coord2 = { lng: paths[ind].coordinates[coordIndex][0], lat: paths[ind].coordinates[coordIndex][1] };
                    var coord1 = { lng: paths[index].coordinates[indexCoord][0], lat: paths[index].coordinates[indexCoord][1] };
                    var angleCoords = MoveDegrees(angleFromCoordinate(coord1, coord2));
                    if (Math.abs(angleCoords - direction) < 60) {
                        console.log("siedzi w kierunku");
                        point = [index, indexCoord];
                        theSmallestDirectionError = distError;
                        directionState = true;
                    }
                }
                if(!directionState && distError < theSmallestUniversalError){
                    console.log("bez kierunku");
                    point = [index, indexCoord];
                    theSmallestUniversalError = distError;
                }
            })
        });
        this.correctDirection = directionState;
        return point;
    },
    isDirectionCorrect: function() {
        if(this.correctDirection == undefined)
            return false;
        return this.correctDirection;
    },
    getLastCoords: function() {
        return this.paths[this.paths.length - 1].coordinates[this.paths[this.paths.length - 1].coordinates.length - 1];
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
        if(routingSystem.route.paths.length < 1){
            emptyRouteDialog();
            emptyRouteDialog();
            return;
        }
        localStorage.setItem("temporary", routingSystem.route.hydrate());
        window.location = "routeSave.html";
    },
    saveFromTemporary: function(name) {
        var route = localStorage.getItem("temporary");
        localStorage.setItem("N" + name, route);
    },
}

var Route = function() {
    this.points = [];
    this.paths = [];
    this.i = 0;
};

Route.prototype = {
    getLastPoint: function(latlng) {
    	if(this.points.length > 0)
        	return this.points[this.points.length - 1];
        return null;
    },
    setName: function(name) {
        this.name = name;
    },
    addNewPoint: function(point){
    	this.points.push(point);
    },
    addNewPath: function(points){
    	this.paths.push(points);
    },
    loadOnMap: function() {
        for (i = 0; i < this.paths.length; i++) {
            mapSystem.addLinesFromGeoJson(this.paths[i], lineStyle);
        }
        for (i = 0; i < this.points.length; i++) {
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
        console.log(mapSystem.addLinesFromGeoJson(this.paths[0], lineStyle));
        this.paths[0].coordinates.splice(0, 1);
        console.log(this.paths[0].coordinates);
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

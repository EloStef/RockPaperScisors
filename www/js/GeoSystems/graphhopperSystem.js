var GraphhopperSystem = function() {
	this.graphhopperPrefix = "https://graphhopper.com/api/1/route?";
    this.graphhopperSuffix = "&vehicle=bike&debug=true&key=57b19165-fee6-425d-962e-b994570e34f0&type=json&points_encoded=false";
}

GraphhopperSystem.prototype = {
	graphhopperPointString: function(latlng) {
        return "point=" + latlng.lat + "," + latlng.lng;
    },

    getUrl: function(latlng1, latlng2) {
        return this.graphhopperPrefix + this.graphhopperPointString(latlng1) + '&' + this.graphhopperPointString(latlng2) + this.graphhopperSuffix;
    },
}

graphHopperSystem = new GraphhopperSystem();
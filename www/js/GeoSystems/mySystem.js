var MySystem = function() {
	this.prefix_ = "http://localhost:80/geo/path/run.cgi?";
    this.suffix_ = "";
}

MySystem.prototype = {
	graphhopperPointString: function(latlng) {
        return "point=" + latlng.lat + "," + latlng.lng;
    },

    getUrl: function(latlng1, latlng2) {
        return this.prefix_ + "x1=" + latlng1.lat + "&y1=" + latlng1.lng + "&x2=" + latlng2.lat + "&y2=" + latlng2.lng;
    },
}

mySystem = new MySystem();
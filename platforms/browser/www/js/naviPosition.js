var naviPosition = function() {
	this.coords;
	this.amountOfPushedCoords = 0;
}

naviPosition.prototype = {
	pushCoord: function(latlng) {
		this.amountOfPushedCoords += 1;
		if(this.coords == undefined){
			this.coords = [latlng, latlng, latlng];
			return;
		}
		for(i=1; i < this.coords.length; i++){
			this.coords[i] = this.coords[i-1];
		}
		this.coords[0] = latlng;
	},
	isDistanceHigher: function(latlng, dist){
		if(this.coords == undefined){
			return true;
		}
		if(dist < distance(latlng.lat, latlng.lng, this.coords[0].lat, this.coords[0].lng, "K"))
			return true;
		return false;
	},
	pushCoordDistanceIfHigher: function(latlng, distance){
		if(this.isDistanceHigher(latlng, distance)){
			this.pushCoord(latlng);
			return true;
		}
		return false;
	},
	getAverageFromLastPoints: function(){
		var newCoord = this.coords[1];
		for(i=2; i < this.coords.length; i++){
			newCoord.lng = (newCoord.lng + this.coords[i].lng) / 2;
			newCoord.lat = (newCoord.lat + this.coords[i].lat) / 2;
		}
		return newCoord;
	},
	getDirection: function(){
		var newCoord = this.getAverageFromLastPoints();
		return angleFromCoordinate(this.coords[0], newCoord);
	},
	isDirectionSet: function(){
		if(this.amountOfPushedCoords < 3)
			return false;
		return true;
	}
}
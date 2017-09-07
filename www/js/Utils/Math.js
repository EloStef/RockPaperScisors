var minError = 0.01;

function toRadians(val){
    return Math.PI * val / 180;
}

function toDegrees(val){
    return val * 180 / Math.PI;
}

var nauticalMilesToStatueMiles = 1.1515;
var minutesInDegree = 60;
var milesToKm = 1.609344;

function distance(lat1, lon1, lat2, lon2, unit) {
        var latRad1 = toRadians(lat1);
        var latRad2 = toRadians(lat2);
        var thetaRad = toRadians(lon1 - lon2);
        var dist = Math.sin(latRad1) * Math.sin(latRad2) + Math.cos(latRad1) * Math.cos(latRad2) * Math.cos(thetaRad);
        dist = Math.acos(dist);
        dist = toDegrees(dist);
        dist = dist * minutesInDegree * nauticalMilesToStatueMiles;
        if (unit == "K") 
            dist = dist * milesToKm;
        return dist;
    }

function angleFromCoordinate(latLng1, latLng2) {
    var dLon = (latLng2.lng - latLng1.lng);

    var y = Math.sin(dLon) * Math.cos(latLng2.lat);
    var x = Math.cos(latLng1.lat) * Math.sin(latLng2.lat) - Math.sin(latLng1.lat) * Math.cos(latLng2.lat) * Math.cos(dLon);

    var brng = Math.atan2(y, x);

    brng = brng * (180 / Math.PI);
    brng = (brng + 360) % 360;
    brng = 360 - brng;
    return Math.floor(brng);
}
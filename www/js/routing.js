var graphhopperPrefix = "https://graphhopper.com/api/1/route?";
var graphhopperSuffix = "&vehicle=bike&debug=true&key=57b19165-fee6-425d-962e-b994570e34f0&type=json&points_encoded=false";

var lastpoint;
var saveFormat = { name: "test", coordinates: [] };

var routingMark = L.icon({
    iconUrl: 'img/routingMark.png',
    iconAnchor: [6, 6],
});

var lineStyle = {
    "color": "#ff7800",
    "weight": 4,
    "opacity": 0.65
};

function graphhopperPointString(latlng) {
    return "point=" + latlng.lat + "," + latlng.lng;
}

function getGraphhopperUrl(point1, point2) {
    return graphhopperPrefix + point1 + '&' + point2 + graphhopperSuffix;
}

function newPoint(click) {
    if (lastpoint == null) {
        lastpoint = click.latlng;
        L.marker(click.latlng, { icon: routingMark }).addTo(map);
    } else {
        getJSON(getGraphhopperUrl(graphhopperPointString(lastpoint), graphhopperPointString(click.latlng)),
            function(err, data) {
                if (err != null) {
                    alert("Something went wrong: " + err);
                } else {
                    L.geoJson(data.paths[0].points, {
                        style: lineStyle
                    }).addTo(map);
                    lastpoint = click.latlng;
                    saveFormat.coordinates.push(data.paths[0].points);
                    L.marker(click.latlng, { icon: routingMark }).addTo(map);
                }
            });
    }
}

map.on('click', newPoint);

function save(){
	localStorage.setItem(saveFormat.name ,JSON.stringify(saveFormat));
	window.location="index.html";
}
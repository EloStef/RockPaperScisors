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

    getRoute: function(routingSys, point1, clickedPoint) {
        $.ajax({
            url: routingSys.geoSystem.getUrl(point1, clickedPoint),
            success: function(data) {
                var data_ = JSON.parse(data);
                routingSys.route.addNewPoint(clickedPoint);
                routingSys.route.addNewPath(data_.paths[0].points, data_.paths[0].instructions);
                mapSystem.addMarker(clickedPoint, routingMarkIcon);
                routingSys.route.loadOnMap(true);
                routingSys.routeCareTaker.add(routingSys.route.hydrate());
            }
        });

        // var data_ = JSON.parse('{ "paths": [{ "instructions": [{ "interval": [ 0, 48 ]}, { "annotation_text": "cycleway", "interval": [ 48, 57 ]}, { "interval": [ 57, 63 ]} ],"points": { "coordinates": [ [ 23.162491, 53.132472 ] ,[ 23.162492, 53.132521 ] ,[ 23.162414, 53.132501 ] ,[ 23.162280, 53.132464 ] ,[ 23.162272, 53.132509 ] ,[ 23.162152, 53.132508 ] ,[ 23.162148, 53.132539 ] ,[ 23.162106, 53.132535 ] ,[ 23.162097, 53.132550 ] ,[ 23.161963, 53.132538 ] ,[ 23.161626, 53.132534 ] ,[ 23.161557, 53.132536 ] ,[ 23.161342, 53.132551 ] ,[ 23.161350, 53.132516 ] ,[ 23.161044, 53.132515 ] ,[ 23.161040, 53.132470 ] ,[ 23.160790, 53.132485 ] ,[ 23.160791, 53.132529 ] ,[ 23.160850, 53.132700 ] ,[ 23.160948, 53.132794 ] ,[ 23.161154, 53.132984 ] ,[ 23.161750, 53.133535 ] ,[ 23.161910, 53.133669 ] ,[ 23.162374, 53.134089 ] ,[ 23.162506, 53.134195 ] ,[ 23.162682, 53.134336 ] ,[ 23.162853, 53.134455 ] ,[ 23.163065, 53.134602 ] ,[ 23.163110, 53.134647 ] ,[ 23.163176, 53.134652 ] ,[ 23.163245, 53.134638 ] ,[ 23.163207, 53.134844 ] ,[ 23.163237, 53.134851 ] ,[ 23.163265, 53.134871 ] ,[ 23.163270, 53.134894 ] ,[ 23.163255, 53.134917 ] ,[ 23.163228, 53.134929 ] ,[ 23.163188, 53.134933 ] ,[ 23.163154, 53.135087 ] ,[ 23.163168, 53.135151 ] ,[ 23.163146, 53.135246 ] ,[ 23.163142, 53.135268 ] ,[ 23.163173, 53.135270 ] ,[ 23.163290, 53.135288 ] ,[ 23.163354, 53.135284 ] ,[ 23.163401, 53.135289 ] ,[ 23.163451, 53.135312 ] ,[ 23.163660, 53.135432 ] ,[ 23.163721, 53.135471 ] ,[ 23.163741, 53.135508 ] ,[ 23.163756, 53.135545 ] ,[ 23.163770, 53.135559 ] ,[ 23.163795, 53.135576 ] ,[ 23.163841, 53.135609 ] ,[ 23.163903, 53.135643 ] ,[ 23.164044, 53.135720 ] ,[ 23.164123, 53.135757 ] ,[ 23.164256, 53.135785 ] ,[ 23.164333, 53.135839 ] ,[ 23.164364, 53.135863 ] ,[ 23.164417, 53.135914 ] ,[ 23.164415, 53.135937 ] ,[ 23.164409, 53.135957 ] ,[ 23.164330, 53.135917 ] ], "type": "LineString" } }] }');
        // routingSys.route.addNewPoint(clickedPoint);
        // routingSys.route.addNewPath(data_.paths[0].points, data_.paths[0].instructions);
        // mapSystem.addMarker(clickedPoint, routingMarkIcon);
        // routingSys.route.loadOnMap(true);
        // routingSys.routeCareTaker.add(routingSys.route.hydrate());

    },
}

mySystem = new MySystem();
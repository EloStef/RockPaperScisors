var osmUrl = 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        osmAttrib = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
        osm = L.tileLayer(osmUrl, {
            maxZoom: 18,
            attribution: osmAttrib
        });

    var map = L.map('map', {
            rotate: true
        })
        .setView([55, 10], 12)
        .addLayer(osm);
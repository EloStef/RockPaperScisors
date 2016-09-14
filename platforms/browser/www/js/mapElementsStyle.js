var returnButton = L.Control.extend({

    options: {
        position: 'bottomleft'
    },

    onAdd: function(map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

        container.style.backgroundColor = 'white';
        container.style.backgroundImage = "url(img/returnButton.png)";
        container.style.backgroundSize = "25px 25px";
        container.style.width = '25px';
        container.style.height = '25px';

        container.onclick = function() {
            window.location = "index.html";
        }
        return container;
    }
});

var label = L.Control.extend({

    options: {
        position: 'topright'
    },

    onAdd: function(map) {
        var container = L.DomUtil.create('input', 'leaflet-bar leaflet-control'); // leaflet-control-custom

        container.style.background = "rgba(100,100,100,0.4)";
        container.style.backgroundSize = "90px 20px";
        container.style.width = '90px';
        container.style.height = '20px';
        container.style.border = '0px';
        container.disabled = "true";
        container.value = value;
        container.id = id;
        return container;
    }
});

var lineStyle = {
        "color": "#ff7800",
        "weight": 4,
        "opacity": 0.65
    };

var routingMarkIcon = L.icon({
        iconUrl: 'img/routingMark.png',
        iconAnchor: [6, 6]
    });

var navigationIcon = L.icon({
    iconUrl: 'img/navigationIcon.png',
    iconAnchor: [10, 10]
});
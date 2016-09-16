var returnButton = L.Control.extend({

    options: {
        position: 'bottomleft'
    },

    onAdd: function(map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

        container.style.backgroundColor = 'white';
        container.style.backgroundImage = "url(img/returnButton.png)";
        container.style.backgroundSize = "25px 25px";
        container.style.width = '26px';
        container.style.height = '26px';

        container.onclick = function() {
            window.location = "index.html";
        }
        return container;
    }
});

var navigationButton = L.Control.extend({

    options: {
        position: 'topleft'
    },

    onAdd: function(map) {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

        container.id = 'navigationBtn';
        container.style.backgroundColor = 'white';
        container.style.backgroundImage = "url(img/navigationButtonOff.png)";
        container.style.backgroundSize = "25px 25px";
        container.style.width = '26px';
        container.style.height = '26px';

        container.onclick = function() {
            var bakcground = $("#navigationBtn").css("backgroundImage");
            if (bakcground.indexOf("navigationButtonOff") !== -1) {
                navigationSystem.initNavigation();
            } else {
                navigationSystem.turnOffNavigation();
            }

        }
        return container;
    }
});

function setNavigationButtonImage(img) {
    $("#navigationBtn").css("backgroundImage", img);
}

function swapNavigationButtonImage() {
    var bakcground = $("#navigationBtn").css("backgroundImage");
    if (bakcground.indexOf("navigationButtonOff") !== -1)
        $("#navigationBtn").css("backgroundImage", "url(img/navigationButtonOn.png)");
    else
        $("#navigationBtn").css("backgroundImage", "url(img/navigationButtonOff.png)");
}

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

var gpsDialog = function() {
    $(".leaflet-modal").show();
    map.fire('modal', {

        content: '<b>Gps</b><div style="text-align: center;">GPS is not working, do you want to turn on it?<button style="margin-right: 5px" onclick="navigationSystem.gpsDialogYes()">Yes</button><button onclick="navigationSystem.gpsDialogNo()">No</button></div>', // HTML string
        width: 100,
        height: 100,

        closeTitle: 'close', // alt title of the close button
        zIndex: 10000, // needs to stay on top of the things
        transitionDuration: 300, // expected transition duration

        template: '{content}', // modal body template, this doesn't include close button and wrappers

        // callbacks for convenience,
        // you can set up you handlers here for the contents
        onShow: function(evt) {
            var modal = evt.modal;
        },
        onHide: function(evt) {
            var modal = evt.modal;
            $(".leaflet-modal").hide();
        },

        // change at your own risk
        OVERLAY_CLS: 'overlay', // overlay(backdrop) CSS class
        MODAL_CLS: 'modal', // all modal blocks wrapper CSS class
        MODAL_CONTENT_CLS: 'modal-content', // modal window CSS class
        INNER_CONTENT_CLS: 'modal-inner', // inner content wrapper
        SHOW_CLS: 'show', // `modal open` CSS class, here go your transitions
        CLOSE_CLS: 'close' // `x` button CSS class
    });
}

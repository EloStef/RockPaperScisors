function newButton(icon, func, position, id) {
    return L.easyButton({
        id: id, // an id for the generated button
        position: position, // inherited from L.Control -- the corner it goes in
        type: 'replace', // set to animate when you're comfy with css
        leafletClasses: true, // use leaflet classes to style the button?
        states: [{ // specify different icons and responses for your button
            stateName: 'get-center',
            onClick: function(button, map) {
                func();
            },
            title: 'show me the middle',
            icon: icon
        }]
    }).addTo(map);
}

function setNavigationButtonImage(img) {
    $("#navimg").attr("src", img);
}

var wrongDirectionImg = L.Control.extend({

    options: {
        position: 'bottomright'
    },

    onAdd: function(map) {
        var container = L.DomUtil.create('img', 'leaflet-bar leaflet-control leaflet-control-custom');

        container.style.background = "rgba(0,0,0,0)";
        container.style.width = '90px';
        container.style.height = '90px';
        container.style.borderStyle = 'none';
        container.style.boxShadow = '0 0px 0px rgba(0,0,0,0)';
        container.src = "img/wrongway.png";
        container.disabled = "true";
        container.id = id;
        return container;
    }
});

function activveWrongWayImg(active) {
    if(active){
        $("#wrongWayImg").show();
        return;
    }
    $("#wrongWayImg").hide();
}

var lineMainNormalRoad = {
    "color": "#ff7800",
    "weight": 5,
    "opacity": 0.9
};

var lineMainCycleRoad = {
    "color": "#ADFF2F",
    "weight": 5,
    "opacity": 0.9
};

var lineMainDrivenRoad = {
    "color": "#FF0000",
    "weight": 6,
    "opacity": 0.7
};

var routingMarkIcon = L.icon({
    iconUrl: 'img/routingMark.png',
    iconAnchor: [6, 6]
});

var startMarkIcon = L.icon({
    iconUrl: 'img/startMark.png',
    iconAnchor: [6, 6]
});

var endMarkIcon = L.icon({
    iconUrl: 'img/endMark.png',
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
        closeTitle: 'close', 
        zIndex: 10000, 
        transitionDuration: 300, 
        template: '{content}', 

        onShow: function(evt) {
            var modal = evt.modal;
        },
        onHide: function(evt) {
            var modal = evt.modal;
            $(".leaflet-modal").hide();
        },

        OVERLAY_CLS: 'overlay', 
        MODAL_CLS: 'modal', 
        MODAL_CONTENT_CLS: 'modal-content', 
        INNER_CONTENT_CLS: 'modal-inner', 
        SHOW_CLS: 'show', 
        CLOSE_CLS: 'close' 
    });
}

var routeDoneDialog = function() {
    $(".leaflet-modal").show();
    map.fire('modal', {
        content: '<b>Gps</b><div style="text-align: center;">Congratulations, you finnished your route.<br><button style="margin-right: 5px" onclick="goToMenu()">Ok</button></div>', // HTML string
        width: 100,
        height: 100,
        closeTitle: 'close', 
        zIndex: 10000, 
        transitionDuration: 300, 
        template: '{content}', 

        onShow: function(evt) {
            var modal = evt.modal;
        },
        onHide: function(evt) {
            goToMenu();
            var modal = evt.modal;
            $(".leaflet-modal").hide();
        },

        OVERLAY_CLS: 'overlay', 
        MODAL_CLS: 'modal', 
        MODAL_CONTENT_CLS: 'modal-content', 
        INNER_CONTENT_CLS: 'modal-inner', 
        SHOW_CLS: 'show', 
        CLOSE_CLS: 'close' 
    });
}

function goToMenu(){
    window.location = "index.html";
}

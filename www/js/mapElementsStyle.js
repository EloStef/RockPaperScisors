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

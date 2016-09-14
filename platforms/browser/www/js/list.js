function CreateRoutesList() {
    var params = location.search.split('&');
    var suffix = params[0].split('=')[1];
    var link = params[1].split('=')[1];

    for (var i = 0; i < localStorage.length; i++) {
        var keySuffix = localStorage.key(i).slice(0, suffix.length);
        if (suffix === keySuffix) {
            button = document.createElement("button");
            buttonText = document.createTextNode(localStorage.key(i).slice(1, localStorage.key(i).length));
            button.appendChild(buttonText);
            button.id = localStorage.key(i);
            button.type = "button";

            button.onclick = function() {
                window.location = link + "?name=" + this.id;
            }

            var foo = document.getElementById("list");
            foo.appendChild(button);
        }
    }
}

function goToIndex(){
    window.location = "index.html";
}

CreateRoutesList();

function CreateRoutesList() {
    var params = location.search.split('&');
    var suffix = params[0].split('=')[1];
    var link = params[1].split('=')[1];
    var thrashSrc = "img/thrash.png";

    for (var i = 0; i < localStorage.length; i++) {
        var keySuffix = localStorage.key(i).slice(0, suffix.length);
        if (suffix === keySuffix) {
            line = document.createElement("div");

            button = document.createElement("button");
            buttonText = document.createTextNode(localStorage.key(i).slice(1, localStorage.key(i).length).split('_').join(' '));
            button.appendChild(buttonText);
            button.id = localStorage.key(i);
            button.style.width = "87%";
            button.type = "button";

            button.onclick = function() {
                window.location = link + "?name=" + this.id;
            }

            removeButton = document.createElement("button");
            buttonremoveImg = document.createElement('img');
            buttonremoveImg.style.width = "120%";
            buttonremoveImg.style.maxWidth  = "35px";
            buttonremoveImg.src = thrashSrc;
            removeButton.appendChild(buttonremoveImg);
            removeButton.style.width = "13%";
            removeButton.id = localStorage.key(i);
            removeButton.type = "button";

            removeButton.onclick = function() {
                localStorage.removeItem(this.id);
                window.location = "index.html";
            }

            line.appendChild(button);
            line.appendChild(removeButton);

            var foo = document.getElementById("list");
            foo.appendChild(line);
        }
    }
}

function goToIndex(){
    window.location = "index.html";
}

CreateRoutesList();

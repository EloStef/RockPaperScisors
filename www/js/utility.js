/*var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "json";
    xhr.onload = function() {
        var status = xhr.status;
        if (status == 200) {
            alert(xhr.response);
            callback(null, xhr.response);
        } else {
            alert(status);
            callback(status);
        }
    };
    xhr.send();
};*/

var getJSON = function(url, callback){
    $.getJSON(url, function(data)
    {
            callback(data);   
    });
}
systemClass = "inputRadio";
saveKeySystem = "system_";
system_keys = ["graph", "created"];

current_system = localStorage.getItem(saveKeySystem);

var radios = document.getElementsByName( "subject" );
var selected = false;
    for( i = 0; i < radios.length; i++ ) {
        if( radios[i].value == current_system) {
        	selected = true;
            radios[i].checked = true;
        } else { 
        	radios[i].checked = false;
        }
    }

if(!selected && radios.length > 0){
	radios[0].checked = true;
}

function SetNewSystem(){
	var radios = document.getElementsByName( "subject" );
    for( i = 0; i < radios.length; i++ ) {
        if( radios[i].checked) {
            localStorage.setItem(saveKeySystem, radios[i].value);
        } 
    }
}

function GetSystem(){
    var curSystem = localStorage.getItem(saveKeySystem);
    if(curSystem == system_keys[0]){
        return new GraphhopperSystem();
    }
    if(curSystem == system_keys[1]){
        return new MySystem();
    }
    return new GraphhopperSystem();
}

function GetSystemName(){
    var curSystem = localStorage.getItem(saveKeySystem);
    if(curSystem == system_keys[0]){
        return system_keys[0];
    }
    if(curSystem == system_keys[1]){
        return system_keys[1];
    }
    return system_keys[0];
}
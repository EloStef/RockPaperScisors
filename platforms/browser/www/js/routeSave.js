function save(){
	route = new Route();
	route.saveFromTemporary($('.input').val());
	goToIndex();
}

function goToIndex(){
	window.location = "index.html";
}
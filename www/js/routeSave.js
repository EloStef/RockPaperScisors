function validate(name){
	if(name === ""){
		$('.validateInfo').html("Name can't be empty.");
		return false;
	}

	if(name.length > 30){
		$('.validateInfo').html("Name can't be longer than 30 chars.");
		return false;
	}

	var RegExpression = /^[a-zA-Z\s]*$/;  
	if(!RegExpression.test(name)){
		$('.validateInfo').html("Name can only contains letters.");
		return false;
	}

	for (var i = 0; i < localStorage.length; i++) {
	if(("N" + name).split(' ').join('_') === localStorage.key(i)){
		$('.validateInfo').html("Name is taken.");
		return false;
	}
	}
	return true;
}

function save(){
	route = new Route();
	var saveName = $('.input').val();
	if(!validate(saveName))
		return;
	route.saveFromTemporary(saveName.split(' ').join('_'));
	goToIndex();
}

function goToIndex(){
	window.location = "index.html";
}
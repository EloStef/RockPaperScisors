var CareTaker = function() {
	this.keyNow = 0;
	this.keyMax = 0;
    this.mementos = {};
 
    this.add = function(memento) {
    	this.keyNow += 1;
    	this.keyMax = this.keyNow;
        this.mementos[this.keyNow] = memento;
    },

    this.getCurrentMemento = function(){
    	return this.mementos[this.keyNow];
    }

    this.redo = function() {
    	if(this.keyNow < this.keyMax){
    		this.keyNow += 1;
    		return this.mementos[this.keyNow];
    	}
 		return false;
    },
 
    this.undo = function() {
        if(1 < this.keyNow){
        	this.keyNow -= 1;
        	return this.mementos[this.keyNow];
        }
 		return false;
    }
}
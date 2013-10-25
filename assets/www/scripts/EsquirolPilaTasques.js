function EsquirolPilaTasques() {
	var pila = new Array();
	var selectedtask = 0;
	
	// Each element is a tuple with two components:
	// First component: the object of one class
	// Second component: the DIV with HTML

	this.lengthOfPile = function() {
		return pila.length;
	}
	
	this.lookForTask = function(id) {
		return pila[id];
	}

	this.returnTask = function(index) {
		return pila[index][0];
	}
	
	this.existTask = function(id) {
		return (id in pila);
	}
	
	this.addTask = function(id, object) {
		var div = object.basicwidget.returnBasicNode();
		pila.push([object,div]);
		if (selectedtask>0) {
			hideTask(selectedtask);
		}
		selectedtask = this.lengthOfPile();
		object.showContents();
	}
	
	this.removeTask = function(pos) {
		delete pila[pos];
	}

	var showTask = function(index) {
		var node = returnTaskNode(index);
		node.style.visibility = 'visible';
		node.style.display = 'block';		
	}
	
	var hideTask = function(index) {
		var node = returnTaskNode(index);		
		node.style.visibility = 'hidden';
		node.style.display = 'none';		
	}
	
	this.returnCurrentTask = function() {
		if (selectedtask>0) {
			return pila[selectedtask-1][0];			
		} else {
			return null;
		}
	}
	
	var returnTaskNode = function(taskIndex) {
		return pila[taskIndex-1][1];
	}
	
	this.changeTask = function(e) {
		hideTask(selectedtask);
		
		var newIndex = recoverHiddenInfo(e.currentTarget, 'select');

		selectedtask = newIndex;
		showTask(selectedtask);
	}

	this.changeToNextTask = function () {
		if (selectedtask>0) {			
			hideTask(selectedtask);
			
			selectedtask = (selectedtask) % this.lengthOfPile() + 1;
			
			showTask(selectedtask);
		}
	}
	
	this.changeToPreviousTask = function () {
		if (selectedtask>0) {
			hideTask(selectedtask);
			
			var max = this.lengthOfPile();
			selectedtask = ((selectedtask-2) % max + max) % max + 1;
			alert(selectedtask);
			
			showTask(selectedtask);			
		}
	}
	
	this.generateList = function () {
		/*
		function g() {
			for (var i=0; i<this.lengthOfPile(); i++) {
				var task = this.returnTask(i);
				var par = document.createElement('p');
				par.appendChild(document.createTextNode(task.returnText()));
				par.appendChild(document.createTextNode(' '));
				par.appendChild(document.createTextNode(task.returnState()));
				par.appendChild(createHiddenInfo('select',i+1));
				yield par;
			}
		}
		return g();
		*/
	}
}

function Generator(funcio1, funcio2) {
	this.next = function() {
		
	}
}

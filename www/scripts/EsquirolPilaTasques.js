function EsquirolWidgetStack() {
	var that = this;
	var pila = new Array();
	var selectedtask = 0;
	
	/*
	A collection of EsquirolWidget.
	Each element is a tuple with two components:
	- First component: the object of one class
	- Second component: the DIV with HTML
	Each object in the stack must have these methods:
	- returnBasicNode: to get the main HTML area
	- returnText: to convert the widget into a string
	*/

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
//		var div = object.basicwidget.returnBasicNode();
		var div = object.returnBasicNode();
		pila.push([object,div]);
		if (selectedtask>0) {
			hideTask(selectedtask);
		}
		selectedtask = that.lengthOfPile();
		object.showContents();
		that.signalAddedWidget(object,selectedtask);
	}

	this.removeTask = function(pos) {
		delete pila[pos];
	}

	var showTask = function(index) {
		selectedtask = index;
		var node = returnTaskNode(index);
		node.style.visibility = 'visible';
		node.style.display = 'block';		
		that.signalShowWidget(that.returnCurrentTask(),index);
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

	this.returnCurrentText = function() {
		var tsk = that.returnCurrentTask();
		if (tsk!=null) {
			return tsk.returnText();
		} else {
			return '';
		}
	}
	
	var returnTaskNode = function(taskIndex) {
		return pila[taskIndex-1][1];
	}
	
	this.changeTask = function(e) {
		var newIndex = recoverHiddenInfo(e.currentTarget, 'select');
		that.changeTaskToIndex(newIndex);
	}

	this.changeToIndexedTask = function(index) {
		if (selectedtask>0) {
			hideTask(selectedtask);
			var newIndex = (index - 1) % that.lengthOfPile() + 1;
			showTask(newIndex);
		}
	}

	this.changeToNextTask = function () {
		if (selectedtask>0) {			
			hideTask(selectedtask);
			
			var newIndex = (selectedtask) % that.lengthOfPile() + 1;
			
			showTask(newIndex);
		}
	}
	
	this.changeToPreviousTask = function () {
		if (selectedtask>0) {
			hideTask(selectedtask);
			
			var max = that.lengthOfPile();
			var newIndex = ((selectedtask-2) % max + max) % max + 1;
			
			showTask(newIndex);			
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

// Signals

EsquirolWidgetStack.prototype.signalAddedWidget = function(widget,index) { };
EsquirolWidgetStack.prototype.signalShowWidget = function(widget,index) { };


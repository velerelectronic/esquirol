function EsquirolWidgetStack() {
	var that = this;
	var pila = new Array();
	var selectedtask = 0;
	
	/*
	A collection of EsquirolWidget.
	Each element must have these methods:
	- returnBasicNode: to get the main HTML area
	- showContents: to regenerate the contents of the widget
	- returnText: to convert the widget into a string
	*/

	this.lengthOfPile = function() {
		return pila.length;
	}
	
	this.lookForTask = function(id) {
		return pila[id];
	}

	this.returnTask = function(index) {
		return pila[convertIndex(index) -1];
	}
	
	this.existTask = function(id) {
		return (id in pila);
	}
	
	this.addTask = function(id, object) {
//		var div = object.basicwidget.returnBasicNode();
		pila.push(object);
		if (selectedtask>0) {
			hideTask(selectedtask);
		}
		selectedtask = that.lengthOfPile();
		object.showContents();
		that.signalAddedWidget(object,selectedtask);
		that.signalShowWidget(object);
	}

	var convertIndex = function(index) {
		var newIndex;
		var max = that.lengthOfPile();
		if (selectedtask>0) {
			newIndex = ((index-1) % max + max) % max + 1;
		} else {
			newIndex = 0;
		}
		return newIndex;
	}

	this.removeCurrentTask = function() {
		removeTask(selectedtask);
		selectedtask = convertIndex(selectedtask);
		showTask(selectedtask);
	}

	var removeTask = function(index) {
/*
		var idx = convertIndex(index);
		if (idx>0) {
			delete pila[idx-1];
			selectedtask = convertIndex(selectedtask);
		}
*/
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
			return pila[selectedtask-1];
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
		return pila[taskIndex-1].returnBasicNode();
	}
	
	this.changeTask = function(e) {
		var newIndex = recoverHiddenInfo(e.currentTarget, 'select');
		that.changeTaskToIndex(newIndex);
	}

	this.changeToIndexedWidget = function(index) {
		if (selectedtask>0) {
			hideTask(selectedtask);
			showTask(convertIndex(index));
		}
	}

	this.changeToNextTask = function () {
		if (selectedtask>0) {			
			hideTask(selectedtask);
			showTask(convertIndex(selectedtask+1));
		}
	}
	
	this.changeToPreviousTask = function () {
		if (selectedtask>0) {
			hideTask(selectedtask);
			showTask(convertIndex(selectedtask-1));
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
EsquirolWidgetStack.prototype.signalShowWidget = function(widget) { };


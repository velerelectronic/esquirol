// Class for the application menu bar

function EsquirolOptions(parentNode) {
        this.createInitWidget(parentNode,null);
}

// Inheritance
EsquirolOptions.prototype = new EsquirolWidget('Menu');

// Signals

EsquirolOptions.prototype.signalOpenMain = function() { };
EsquirolOptions.prototype.signalOpenTask = function() {};
EsquirolOptions.prototype.signalSelectedTask = function(index) {};
EsquirolOptions.prototype.signalOpenShare = function() {};
EsquirolOptions.prototype.signalOpenTaskList = function() { };
EsquirolOptions.prototype.signalCloseTask = function() {};

// Functions

EsquirolOptions.prototype.createMainBar = function(name,stack) {
	var that = this;
        var node = document.getElementById('AppBar');
        node.innerHTML = '';

	// Write the name of the application
        var heading = document.createElement('h1');
        heading.appendChild( document.createTextNode(name) );
        node.appendChild( heading );

	// When we tap on the application name, the main menu must be opened
	var hammerHeading = Hammer(heading);
	hammerHeading.on("tap",this.signalOpenMain);
 
	// Create an area for the tasks being executed
	var tasks = document.createElement('div');
	tasks.className = 'tasks';
        node.appendChild( tasks );

	this.taskname = document.createElement('div');
	this.taskname.className = 'taskname';
	tasks.appendChild(this.taskname);

	this.tasklist = document.createElement('div');
	this.tasklist.className = 'tasklist';
	tasks.appendChild(this.tasklist);

	// Menu to select the task that has to be shown
	this.stack = stack;
	this.taskmenu = new EsquirolMenu(this.tasklist);
	//this.taskmenu.createHorizontalMenu(this.taskname);
	this.taskmenu.hideContainer();

	Signal.connect(this.stack,'signalShowWidget',this,'changeMainTask');
	Signal.connect(this.taskmenu,'signalSelectedItem',this.stack,'changeToIndexedWidget');

	// When we tap on the main task, the list of tasks opens
	// Swiping to the left or rigt is associated with a change of the task
	var hammerTaskname = Hammer(this.taskname,{drag: true, prevent_default: true});
	hammerTaskname.on("tap", function() { that.toggleTaskList(); });
	hammerTaskname.on("hold", function() { that.showTaskOptions(); });
	hammerTaskname.on("swipeleft", function() { that.stack.changeToNextTask(); });
	hammerTaskname.on("swiperight", function() { that.stack.changeToPreviousTask(); });

	//this.enableSwipeGestures(node);
}

EsquirolOptions.prototype.addTask = function(task,index) {
	this.taskmenu.addElement(task.returnText(),index);
	//this.taskmenu.hide();
}

EsquirolOptions.prototype.toggleTaskList = function() {
	if (this.taskmenu.isVisible()) {
		this.taskmenu.hideContainer();
	} else {
		this.taskmenu.showContainer();
		this.taskmenu.createHorizontalMenuFromStack(this.stack,this.taskname);
	}
}

EsquirolOptions.prototype.showSelectedItem = function(text) {
	this.taskname.innerHTML = text;
}

EsquirolOptions.prototype.changeMainTask = function(widget) {
	this.showSelectedItem(widget.returnText());
	this.taskmenu.hideContainer();
}

EsquirolOptions.prototype.getSelectedIndex = function(text,index) {
	this.stack.changeToIndexedTask(index);
	//this.signalSelectedTask(index);
}

EsquirolOptions.prototype.showTaskOptions = function() {
	var that = this;
	navigator.notification.confirm('Què vols fer amb el widget: ' + this.stack.returnCurrentText(),
		function(idxButton) {
			switch(idxButton) {
			case 2:
				that.stack.removeCurrentTask();
				break;
			case 3:
				that.stack.returnCurrentTask().showContents();
				break;
			default:
				break;
			};
		}, 'Accions sobre el widget', ['Enrere','Tanca','Actualitza']);
}



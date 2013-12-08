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

EsquirolOptions.prototype.createMainBar = function(name) {
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
	this.taskmenu = new EsquirolMenu(this.tasklist);
	this.taskmenu.createHorizontalMenu(this.taskname);
	this.taskmenu.hideContainer();

	Signal.connect(this.taskmenu,'signalSelectedItem',this,'getSelectedIndex');

	// When we tap on the main task, the list of tasks opens
	// Swiping to the left or rigt is associated with a change of the task
	var hammerTaskname = Hammer(this.taskname,{drag: true, prevent_default: true});
	hammerTaskname.on("tap", function() { that.toggleTaskList(); });
	hammerTaskname.on("hold", function() { that.showTaskOptions(); });
	hammerTaskname.on("swipeleft", this.signalSwipeLeft);
	hammerTaskname.on("swiperight", this.signalSwipeRight);

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
	}
}

EsquirolOptions.prototype.showSelectedItem = function(text,index) {
	this.taskname.innerHTML = text;
}

EsquirolOptions.prototype.changeMainTask = function(widget,index) {
	this.showSelectedItem(widget.returnText(),index);
	this.taskmenu.hideContainer();
}

EsquirolOptions.prototype.getSelectedIndex = function(text,index) {
	this.signalSelectedTask(index);
}

EsquirolOptions.prototype.showTaskOptions = function() {
	if (confirm('Tanca?' + this.taskname.innerHTML)) {
		this.signalCloseTask();
	}
}



// Class for the application menu bar

function EsquirolOptions(parentNode) {
        this.createInitWidget(parentNode,null);
}

// Inheritance
EsquirolOptions.prototype = new EsquirolWidget('Menu');

// Signals

EsquirolOptions.prototype.signalOpenMain = function() { };
EsquirolOptions.prototype.signalOpenTask = function() {};
EsquirolOptions.prototype.signalOpenActivity = function() {};
EsquirolOptions.prototype.signalOpenShare = function() {};

// Functions

EsquirolOptions.prototype.createMainBar = function(name) {
        //this.signalOpenMain();
        var node = document.getElementById('AppBar');
        node.innerHTML = '';
        var heading = document.createElement('h1');
        heading.appendChild( document.createTextNode(name) );
	var hammer = Hammer(heading);
	hammer.on("tap",this.signalOpenMain);
        node.appendChild( heading );
 
        var botons = document.createElement('div');
        botons.id = 'buttons';
        node.appendChild( botons );

        var tasknode = document.createElement('div');
        tasknode.id = 'taskname';
        node.appendChild( tasknode );

        this.creaBotoOpcions(botons, 'Tsk', this.signalOpenTask);
        this.creaBotoOpcions(botons, 'Act', this.signalOpenActivity);
        this.creaBotoOpcions(botons, 'Sha', this.signalOpenShare);
        this.creaBotoOpcions(botons, 'TOT', function() { alert(document.documentElement.innerHTML); });

	this.enableSwipeGestures(node);
}


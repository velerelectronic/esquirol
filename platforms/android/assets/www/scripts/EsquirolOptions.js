// Class for the application menu bar

function EsquirolOptions(parentNode) {
	// EsquirolWidget
	this.createInitWidget(parentNode,null);
	// Menus
	var mainmenu,taskmenu,actmenu;

	this.createMainBar = function(name,func_opcions,func_tasques,func_act,func_comp,prev,next) {
//		EsquirolWidget.call(this);
		var node = document.getElementById('AppBar');
        node.innerHTML = '';
        var heading = document.createElement('h1');
        heading.appendChild( document.createTextNode(name) );
        node.appendChild( heading );
        
		var botons = document.createElement('div');
		botons.id = 'buttons';
		node.appendChild( botons );

		var tasknode = document.createElement('div');
		tasknode.id = 'taskname';
		node.appendChild( tasknode );
		
		//var tmp = EsquirolWidget();
		this.creaBotoOpcions(botons, 'Menu', func_opcions);
		this.creaBotoOpcions(botons, 'Tsk', func_tasques);
		this.creaBotoOpcions(botons, 'Act', func_act);
		this.creaBotoOpcions(botons, 'Sha', func_comp);
		this.creaBotoOpcions(botons, 'TOT', function() { alert(document.documentElement.innerHTML); });

		this.addActionSwipe(node,next,prev,null,null);

//		node.addEventListener('touchstart',function() { basicwidget.touch.touchStart(event,"AppBar"); }, false);
//		node.addEventListener('touchend', function() { basicwidget.touch.touchEnd(event); }, false);
//		node.addEventListener('touchmove', function() { basicwidget.touch.touchMove(event); }, false);
//		node.addEventListener('touchcancel', function() { basicwidget.touch.touchCancel(event); }, false);
		
//		basicwidget.touch.connect(null, null, prev, next);
	}
	
}

EsquirolOptions.prototype = new EsquirolWidget('Menu');

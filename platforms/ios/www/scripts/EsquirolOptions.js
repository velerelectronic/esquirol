// Class for the application menu bar

function EsquirolOptions(parentNode) {
	// EsquirolWidget
	var basicwidget = new EsquirolWidget();
	basicwidget.createInitWidget(parentNode,null);
	// Menus
	var mainmenu,taskmenu,actmenu;
	// Variable helpers
	var that = this;

	this.createMainBar = function(name,func_opcions,func_tasques,func_act,func_comp,prev,next) {
        var node = document.getElementById('AppBar');
        node.innerHTML = '';
        var heading = document.createElement('h1');
        heading.appendChild( document.createTextNode(name) );
        node.appendChild( heading );
        
		var botons = document.createElement('div');
		botons.id = 'buttons';
		node.appendChild(botons);

		//var tmp = EsquirolWidget();
		basicwidget.creaBotoOpcions(botons, 'Menu', func_opcions);
		basicwidget.creaBotoOpcions(botons, 'Tsk', func_tasques);
		basicwidget.creaBotoOpcions(botons, 'Act', func_act);
		basicwidget.creaBotoOpcions(botons, 'Sha', func_comp);
		basicwidget.creaBotoOpcions(botons, 'TOT', function() { alert(document.documentElement.innerHTML); });

		basicwidget.addActionSwipe(node,prev,next,null,null);

//		node.addEventListener('touchstart',function() { basicwidget.touch.touchStart(event,"AppBar"); }, false);
//		node.addEventListener('touchend', function() { basicwidget.touch.touchEnd(event); }, false);
//		node.addEventListener('touchmove', function() { basicwidget.touch.touchMove(event); }, false);
//		node.addEventListener('touchcancel', function() { basicwidget.touch.touchCancel(event); }, false);
		
//		basicwidget.touch.connect(null, null, prev, next);
	}
	
}

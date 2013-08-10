function EsquirolMenu(parentNode) {
	var that = this;
	this.basicwidget = new EsquirolWidget();
	this.basicwidget.createInitWidget(parentNode);
	
	this.handleTouches = function() {
		this.basicwidget.returnBasicNode().onclick = function(e) {
			if (e) {
				e.stopPropagation();
			} else {
				window.event.cancelBubble = true;
				alert('Click inside');
			}
		};
/*
		document.onclick = function() {
			alert('Click fora');
			that.closeMenu();
		}
*/
	}
	
	var creaMenuOpcions = function (lloc, classe, func, text) {
		var li = document.createElement('li');
		li.setAttribute('class',classe);
		li.onclick = func;
		li.appendChild( document.createTextNode(text) );
		lloc.appendChild(li);
	}

	this.creaMenu = function (titol, vectoritems) {
		var nodemenu = this.basicwidget.returnBasicNode();
        nodemenu.innerHTML = '';
        this.openMenu();

		var heading = document.createElement('h2');
		
        heading.appendChild( document.createTextNode(titol) );
        nodemenu.appendChild( heading );

		ul = document.createElement('ul');
		ul.setAttribute('class','menu');
		nodemenu.appendChild(ul);
		
		for (var i=0; i<vectoritems.length; i++) {
			creaMenuOpcions(ul, 'opcions', vectoritems[i][0], vectoritems[i][1]);
		}
		this.handleTouches();

	}

	this.createMenuFromPileOfTasks = function (titol, func, pila) {
		var nodemenu = this.basicwidget.returnBasicNode();
        nodemenu.innerHTML = '';
        this.openMenu();

		var heading = document.createElement('h2');
		
        heading.appendChild( document.createTextNode(titol) );
        nodemenu.appendChild( heading );

        var quantitat = pila.lengthOfPile();
        if (quantitat>0) {
    		ul = document.createElement('ul');
    		ul.setAttribute('class','menu');
    		nodemenu.appendChild(ul);

    		for (var i=0; i<quantitat; i++) {
    			var task = pila.returnTask(i);
    			var li = document.createElement('li');
    			li.appendChild(document.createTextNode(task.returnText()));
    			li.appendChild(document.createTextNode(' '));
    			li.appendChild(document.createTextNode(task.returnState()));
    			li.appendChild(createHiddenInfo('select',i+1));
    			li.onclick = func;
    			nodemenu.appendChild(li);
    		}        	
        } else {
        	var par = document.createElement('p');
        	par.appendChild( document.createTextNode('No hi ha tasques') );
        	nodemenu.appendChild(par);
        }
	}
	
	this.creaMenuFromIterator = function (titol,func,gen) {
		var nodemenu = this.basicwidget.returnBasicNode();
        nodemenu.innerHTML = '';
        this.openMenu();

		var heading = document.createElement('h2');
		
        heading.appendChild( document.createTextNode(titol) );
        nodemenu.appendChild( heading );

		var next = gen.next();
		if (next==null) {
			// No hi ha tasques a la llista
			var par = document.createElement('p');
			par.appendChild( document.createTextNode('No hi ha tasques.') );			
		} else {
			ul = document.createElement('ul');
			ul.setAttribute('class','menu');
			nodemenu.appendChild(ul);
			
			while (next != null) {
				var li = document.createElement('li');
				li.setAttribute('class',classe);
				li.onclick = func;
				li.appendChild( next );
				lloc.appendChild(li);
				next = gen.next();
			}			
		}
	}
	
	this.isMenuOpen = function() {
	    return this.basicwidget.returnBasicNode().parentNode.style.display=='block';
	}

	this.openMenu = function() {
		this.basicwidget.returnBasicNode().parentNode.style.display = 'block';
	}

	this.closeMenu = function() {
		this.basicwidget.returnBasicNode().parentNode.style.display = 'none';
	}


}
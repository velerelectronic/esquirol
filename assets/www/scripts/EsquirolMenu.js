function EsquirolMenu(parentNode) {
	var that = this;
	this.basicwidget = new EsquirolWidget();
	this.basicwidget.createInitWidget(parentNode,null);
	
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
	
	// Builds the options for the menu
	this.creaMenu = function (titol, genCont) {
		if (this.isMenuOpen()) {
        	this.closeMenu();
        } else {
        	this.openMenu();
    		var nodemenu = this.basicwidget.returnBasicNode();
//        	this.basicwidget.returnBasicNode().onclick = that.closeMenu();
    		
            nodemenu.innerHTML = '';
        	var heading = document.createElement('h2');
    		
            heading.appendChild( document.createTextNode(titol) );
            nodemenu.appendChild( heading );
            nodemenu.appendChild ( genCont() );
    		this.handleTouches();
        }
	}

	// Builds a menu from a list
	this.creaList = function (titol, vectoritems) {
		var creaMenuOpcions = function (lloc, classe, func, text) {
			var li = document.createElement('li');
			li.setAttribute('class',classe);
			li.onclick = func;
			li.appendChild( document.createTextNode(text) );
			lloc.appendChild(li);
			lloc.onclick = function(e) { that.closeMenu(); };
		}

		this.creaMenu (titol,function() {
			var ul = document.createElement('ul');
			ul.setAttribute('class','menu');
			
			for (var i=0; i<vectoritems.length; i++) {
				creaMenuOpcions(ul, 'opcions', vectoritems[i][0], vectoritems[i][1]);
			}
			return ul;
		});
	}

	this.isMenuOpen = function() {
	    return (this.basicwidget.isVisible());
	}

	this.openMenu = function() {
		this.basicwidget.showContainer();
	}

	this.closeMenu = function() {
		this.basicwidget.hideContainer();
	}


}
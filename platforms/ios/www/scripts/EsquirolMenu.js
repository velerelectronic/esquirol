function EsquirolMenu(parentNode) {
	if (typeof parentNode === 'undefined') {
		this.createInitWidget();
	} else {
		this.createInitWidget(parentNode);		
	}
}

EsquirolMenu.prototype = new EsquirolWidget('Menu');

// Builds the options for the menu
EsquirolMenu.prototype.creaMenu = function (titol, genCont) {
	if (this.isVisible()) {
    	this.hideContainer();
    } else {
    	this.showContainer();
		var nodemenu = this.returnBasicNode();
		
        nodemenu.innerHTML = '';
    	var heading = document.createElement('h2');
		
        heading.appendChild( document.createTextNode(titol) );
        nodemenu.appendChild( heading );
        nodemenu.appendChild ( genCont() );
    }
}


// Builds a menu from a list

EsquirolMenu.prototype.creaList = function (titol, vectoritems) {
	var that = this;
	var creaMenuOpcions = function (lloc, classe, func, text) {
		var li = document.createElement('li');
		li.setAttribute('class',classe);
		li.onclick = func;
		li.appendChild( document.createTextNode(text) );
		lloc.appendChild(li);
		lloc.onclick = function(e) { that.hideContainer(); };
	}

	this.creaMenu (titol,
		function() {
			var ul = document.createElement('ul');
			ul.setAttribute('class','menu');
			
			for (var i=0; i<vectoritems.length; i++) {
				creaMenuOpcions(ul, 'opcions', vectoritems[i][0], vectoritems[i][1]);
			}
			return ul;
		});
}
	
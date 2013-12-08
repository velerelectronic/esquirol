function EsquirolMenu(parentNode) {
	var that = this;
	if (typeof(parentNode) === 'undefined') {
		this.createInitWidget();
	} else {
		this.createInitWidget(parentNode);		
	}
}

// Inheritance
EsquirolMenu.prototype = new EsquirolWidget('Menu');

// Signals
EsquirolMenu.prototype.signalSelectedItem = function (text,index) { }

// Builds the options for the menu
EsquirolMenu.prototype.creaMenu = function (titol, genCont) {
		var nodemenu = this.returnBasicNode();
		
		nodemenu.innerHTML = '';
		nodemenu.onclick = function(e) {
			e.stopPropagation();
		};
		var heading = document.createElement('h2');

		heading.appendChild( document.createTextNode(titol) );
		nodemenu.appendChild( heading );
		nodemenu.appendChild ( genCont() );
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

EsquirolMenu.prototype.createHorizontalMenu = function(showElement) {
	// Prepare a menu:
	// - Create a list with the elements to be shown
	// - Create a node where to display the list
	// - Get an area to display the main item
	this.elements = [];
	var node = this.returnBasicNode();

	this.listnode = document.createElement('ul');
	node.appendChild(this.listnode);
	this.showArea = showElement;
}

EsquirolMenu.prototype.addElement = function(element,index) {
	var that = this;
	this.showArea.innerHTML = element;
	this.elements.push(element);
	var newnode = document.createElement('li');
	Hammer(newnode).on("tap",function() { that.signalSelectedItem(element,index); });
	this.listnode.appendChild(newnode);
	newnode.appendChild( document.createTextNode(element) );
}

EsquirolMenu.prototype.openList = function() {
}




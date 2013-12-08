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
EsquirolMenu.prototype.signalSelectedItem = function (index) { };

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
		li.onclick = function(e) {
			that.hideContainer();
			func(e);
		}
		li.appendChild( document.createTextNode(text) );
		lloc.appendChild(li);
		//lloc.onclick = function(e) { that.hideContainer(); };
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

EsquirolMenu.prototype.createHorizontalMenuFromStack = function(stack,showElement) {
	// Prepare a menu:
	// - Build a list
	// - Get an area to display the main item
	var that = this;
	var node = this.returnBasicNode();
	node.innerHTML = '';

	var listnode = document.createElement('ul');
	node.appendChild(listnode);

	for (var i=1; i<=stack.lengthOfPile(); i++) {
		var object = stack.returnTask(i);
		var newnode = document.createElement('li');
		this.addHiddenInfo(newnode,'index',i);
		Hammer(newnode).on("tap",function(ev) {
			that.signalSelectedItem(that.getHiddenInfo(ev.target,'index'));
			});
		listnode.appendChild(newnode);
		newnode.appendChild( document.createTextNode(object.returnText()) );
	}
	this.showArea = showElement;
}

EsquirolMenu.prototype.openList = function() {
}



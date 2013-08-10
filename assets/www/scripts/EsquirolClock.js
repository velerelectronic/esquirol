function EsquirolClock(id,parentNode) {
	var titol = id;
	var that = this;
	this.mainClock;
	this.basicwidget = new EsquirolWidget();
	this.basicwidget.createInitWidget(parentNode);

	this.returnText = function() {
		return titol;
	}
	
	this.returnState = function() {
		return '';
	}
	
	this.mostraTauler = function() {
		var node = this.basicwidget.returnBasicNode();
		var div = document.createElement('div');
		div.id = 'superclock';
		node.appendChild(div);
		
		this.mainClock = document.createElement('div');
		this.mainClock.id = 'clock';
		div.appendChild(this.mainClock);
		this.mainClock.appendChild(document.createTextNode('Rellotge'));
		updateClock();
		window.setInterval(updateClock,1000);
	}

	var updateClock = function() {
		var tempsara = new Date ();
			
		var hores = tempsara.getHours ( );
		var minuts = tempsara.getMinutes ( );
		var segons = tempsara.getSeconds ( );
		
		// Pad the minutes and seconds with leading zeros, if required
		minuts = ( minuts < 10 ? "0" : "" ) + minuts;
		segons = ( segons < 10 ? "0" : "" ) + segons;
		
		// Choose either "AM" or "PM" as appropriate
		var timeOfDay = ( hores < 12 ) ? "AM" : "PM";
		
		// Convert the hours component to 12-hour format if needed
		hores = ( hores > 12 ) ? hores - 12 : hores;
		
		// Convert an hours component of "0" to "12"
		hores = ( hores == 0 ) ? 12 : hores;
		
		// Compose the string for display
		var cadenaTemps = hores + ":" + minuts + ":" + segons + " " + timeOfDay;
		
		// Update the time display
		that.mainClock.firstChild.nodeValue = cadenaTemps;
	}


}

function EsquirolForms(id,parentNode) {
	var titol = id;
	var that = this;
	this.basicwidget = new EsquirolWidget();
	this.basicwidget.createInitWidget(parentNode);

	this.returnText = function() {
		return titol;
	}
	
	this.returnState = function() {
		return '';
	}

	this.mostraForm = function() {
	    // node.innerHTML = '';
		var node = this.basicwidget.returnBasicNode();
		
	    var div = document.createElement('div');
	    node.appendChild(div);

        if (window.XMLHttpRequest) {
        	xhttp = new XMLHttpRequest();
        } else {
        	// IE 5/6
        	xhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        xhttp.open("GET","/storage/emulated/0/Download/xform_unit_planning v02.xml",false);
        xhttp.send();
        xmlDoc = xhttp.responseXML;
        
//	    var parser = new DOMParser();
//	    var doc = parser.parseFromString(text,"application/xml");

        div.appendChild( document.createTextNode(xmlDoc.responseText));
        var children = xmlDoc.childNodes;
        for (var i=0; i<children.length; i++) {
        	var linia = document.createTextNode('-');
        	div.appendChild(linia);
        }

	}
	
}
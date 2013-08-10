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
	    
    	text = '<h:html xmlns:h="http://www.w3.org/1999/xhtml" ';
        text += 'xmlns="http://www.w3.org/2002/xforms"> ';
        text += '<h:head>';
        text += '<h:title>Buscar</h:title>';
        text += '<model>';
        text +='<submission action="http://ejemplo.com/buscar" method="get" id="s"/>';
        text += '</model>';
        text += '</h:head>';
        text += '<h:body>';
        text += '<h:p>';
        text += '<input ref="q"><label>Buscar</label></input>';
        text += '<submit submission="s"><label>Enviar</label></submit>';
        text += '</h:p>';
        text += '</h:body>';
        text += '</h:html>';
	    div.innerHTML = text;

	}
	
}
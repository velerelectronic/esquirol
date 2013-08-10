function VisorDocument(nodeName) {
    var nodeBase = document.getElementById(nodeName);

	this.reinicia = function() {
		nodeBase.innerHTML = '';
		nodeBase.innerHTML = '<p>Carregant...</p>';
		alert('Recarregant...');
	}

	this.carrega = function(text) {
		nodeBase.innerHTML = text;
	}

	this.debug = function(text) {
		alert('Debug '+text);
	}
}

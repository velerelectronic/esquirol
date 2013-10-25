function VisorDocument(node) {
    this.nodeBase = node;
    var that = this;

	this.reinicia = function() {
		this.nodeBase.innerHTML = '';
		this.nodeBase.innerHTML = '<p>Carregant...</p>';
	}

	this.llegeix = function(entry) {
		entry.file(
			function(file) {
				var reader = new FileReader();
				reader.onloadend = function(evt) {
					that.carrega(evt.target.result);
				};
				reader.readAsText(file);
			},
			function(evt) {
				alert('Fallada llegint fitxer');
			});
	}
	
	this.carrega = function(text) {
		that.nodeBase.innerHTML = text;
	}

	this.debug = function(text) {
		alert('Debug '+text);
	}
	

}

function VisorDocument(node) {
    this.nodeBase = node;
    var that = this;
    // The place where the document will be shown
    var iframe;
    // Entry file for the document
    var docEntry;
    // Main buttons to edit and save the document
    var buttonEdit,buttonSave,buttonCancel;

    function editMode() {
    	buttonSave.style.visibility = 'visible';
    	var document = iframe.contentWindow.document;

		var fillNodes = document.querySelectorAll('*[type="fillcontents"]');
		for (var i=0; i<fillNodes.length; i++) {
			fillNodes[i].setAttribute('contenteditable','true');
		}
    }
    
    function saveMode() {
    	that.guarda();
    	viewMode();
    }
    
    function viewMode() {
    	buttonSave.style.visibility = 'hidden';
		var fillNodes = document.querySelectorAll('*[type="fillcontents"]');
		for (var i=0; i<fillNodes.length; i++) {
			fillNodes[i].removeAttribute('contenteditable');
		}
    }
    
	this.reinicia = function() {
		this.nodeBase.innerHTML = '';
		buttonEdit = document.createElement('button');
		buttonEdit.appendChild(document.createTextNode('Edita'));
		buttonEdit.onclick = editMode;
		buttonSave = document.createElement('button');
		buttonSave.appendChild(document.createTextNode('Desa'));
		buttonSave.onclick = saveMode;
		buttonSave.style.visibility = 'hidden';
		this.nodeBase.appendChild(buttonEdit);
		this.nodeBase.appendChild(buttonSave);
		
		iframe = document.createElement('iframe');
//		iframe['width'] = 400;
		iframe['height'] = 600;
//		iframe['sandbox'] = '';
		this.nodeBase.appendChild(iframe);
		
//		this.nodeBase.innerHTML = '<p>Carregant...</p>';
	}

	this.llegeix = function(entry) {
		docEntry = entry;
		docEntry.file(
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
	
	this.guarda = function() {
		docEntry.createWriter(
			function(writer) {
				writer.onwrite = function(evt) {
					alert('Desat!');
				};
				writer.write(that.getContents());
			},
			function(evt) {
				alert('Ha fallat el desat');
			});
	}
	
	this.carrega = function(text) {
		var document = iframe.contentWindow.document;
		document.open('text/html','replace');
		document.write(text);
		document.close();
	}
	this.getContents = function() {
		var document = iframe.contentWindow.document;
		var text = "";
		children = document.childNodes;
		for (var i=0; i<children.length; i++) {
			var nodetype = children[i].nodeType;
			switch(nodetype) {
			case document.ELEMENT_NODE:
				text += children[i].outerHTML + "\n";
				break;
			case document.COMMENT_NODE:
				text += "<" + children[i].nodeValue + ">\n";
				break;
			case document.DOCUMENT_TYPE_NODE:
				var node = children[i];
				var dt = "<!DOCTYPE "
			         + node.name
			         + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '')
			         + (!node.publicId && node.systemId ? ' SYSTEM' : '') 
			         + (node.systemId ? ' "' + node.systemId + '"' : '')
			         + '>';
				text += dt + '\n';
				break;
			default:
				alert('Others: '+nodetype + children[i]);
			}
		}
		return text;
	}

	this.debug = function(text) {
		alert('Debug '+text);
	}


}

function TextEditor(content) {
	var that = this;
	var div;
	var contents = content;
	var parentNode = document.getElementsByTagName('body')[0];
	
	function closeDiv() {
		if (confirm('Desa canvis?')) {
			div.parentNode.removeChild(div);			
		}
	}
	
	function openActions(e) {
		alert('Accions');
		if (e && e.stopPropagation) {
			e.stopPropagation();			
		}
	}
	
	function layers() {
		div = document.createElement('div');
		parentNode.appendChild(div);
		div.className = 'fullscreen';
		div.addEventListener('click',closeDiv,false);
		
		var editor = document.createElement('div');
		editor.className = 'editor';
		editor.setAttribute('contenteditable','true');
		editor.addEventListener('click',openActions,false);
		div.appendChild(editor);
		editor.innerHTML = contents;
	}
	
	layers();
}

function VisorDocument(node) {
    this.nodeBase = node;
    var that = this;
    // The place where the document will be shown
    var iframe;
    // Entry file for the document
    var docEntry;
    // Main buttons to edit and save the document
    var buttonEdit,buttonSave,buttonCancel;

    function nodeIsFillable(node) {
    	if (node.getAttribute('type')=='fillcontents') {
    		return true;
    	} else {
    		return false;
    	}
    }
    
    function nodeIsRepeatable(node) {
    	if (node.getAttribute('repeatable')=='true') {
    		return true;
    	} else {
    		return false;
    	}
    }
    
    function editMode() {
    	buttonSave.style.visibility = 'visible';
    	var document = iframe.contentWindow.document;

		var fillNodes = document.querySelectorAll('*[type="fillcontents"], *[repeatable="true"]');
		for (var i=0; i<fillNodes.length; i++) {
			// fillNodes[i].setAttribute('contenteditable','true');
			fillNodes[i].addEventListener('click',actionsForElement,false);
		}
    }

    function actionsForElement(e) {
    	var node = e.currentTarget;
    	var fet = false;
    	if (nodeIsFillable(node)) {
        	if (confirm('Editar Ç' + node.nodeName + 'È?')) {
        		var div = new TextEditor(node.innerHTML);
        		fet = true;
        	}
    	}
    	if (fet==false) {
            if (nodeIsRepeatable(node)) {
        		if (confirm('Duplicar Ç' + node.nodeName + 'È?')) {
        			var newnode = node.cloneNode(true);
        			node.parentNode.insertBefore(newnode,node.nextSibling);
        			fet = true;
        		}
        	}
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
		document.addEventListener('load',editMode);
		document.open('text/html','replace');
		document.write(text);
		document.close();
		editMode();
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

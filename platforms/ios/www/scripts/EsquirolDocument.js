function TextEditor(content_node,save_action) {
	var that = this;
	var parentNode = document.getElementsByTagName('body')[0];
//	this.basicwidget = new EsquirolWidget();
//	this.basicwidget.createInitWidget(parentNode);
	var div;
	var contentNode = content_node;
	var editor;
	var saveAction = save_action;
	var contentsChanged = false;

	function setCursor(el,st,end) {
		if (el.setSelectionRange) {
			el.focus();
			el.setSelectionRange(st,end);
		} else {
			if (el.createTextRange) {
				range=el.createTextRange();
				range.collapse(true);
				range.moveEnd('character',end);
				range.moveStart('character',st);
				range.select();
			}
		}
	}

	function saveDocument() {
		contentNode.innerHTML = editor.innerHTML;
		saveAction();
	}
	
	function closeEditor() {
		div.parentNode.removeChild(div);
	}
	
	function closeDiv(e) {
		if (contentsChanged) {
			navigator.notification.confirm('Desa canvis?',function(idxButton) {
				switch(idxButton) {
				case 3:
					saveDocument();
				case 2:
					closeEditor();
				case 1:
					break;
				default:
					break;
				}
				stopP(e);
			}, 'Hi ha hagut canvis', ['Torna','Rebutjar','Desar']);			
		} else {
			div.parentNode.removeChild(div);			
		}
	}
	
	function stopP(e) {
		if (e && e.stopPropagation) {
			e.stopPropagation();
		}
	}
	function openActions(e) {
		alert('Accions');
		stopP(e);
	}
	
	function canvis() {
		contentsChanged = true;
		editor.removeEventListener('DOMSubtreeModified',canvis,true);
	}
	
	function layers() {
		div = document.createElement('div');
		parentNode.appendChild(div);
		div.className = 'fullscreen';
		div.addEventListener('click',closeDiv,false);
		
		var win = document.createElement('div');
		win.className = 'window';
		win.addEventListener('click',stopP,false);
		div.appendChild(win);

		var nav = document.createElement('nav');
		win.appendChild(nav);
		tempwidget = new EsquirolWidget();
		tempwidget.createInitWidget(win);
		tempwidget.creaBotoOpcions(nav,'Desa i tanca',function() {
				if (contentsChanged) {
					saveDocument();
				}
				closeEditor();
			});
		
		editor = document.createElement('div');
		editor.setAttribute('contenteditable','true');
		editor.className = 'editor';
		editor.addEventListener('longclick',openActions,false);
		win.appendChild(editor);

		// Insert contents
		editor.innerHTML = contentNode.innerHTML;
		var l = contentNode.innerHTML.length;
		setCursor(editor,l,l);
		editor.focus();

		editor.addEventListener('DOMSubtreeModified',canvis,true);
	}

	layers();
}

function VisorDocument(id,statusAction,parentNode) {
	var titol = id;
	var that = this;
	this.basicwidget = new EsquirolWidget();
	this.basicwidget.createInitWidget(parentNode);
	var status = statusAction;
	var actionReadFile = null;

	this.returnText = function() {
		return titol;
	}
	
    var that = this;
    // The place where the document will be shown
    var iframe;
    // Entry file for the document
    var docEntry;

	function stopP(e) {
		if (e && e.stopPropagation) {
			e.stopPropagation();
		}
	}

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
    		var doc = iframe.contentWindow.document;
    		
		var fillNodes = doc.querySelectorAll('*[type="fillcontents"], *[repeatable="true"]');
		for (var i=0; i<fillNodes.length; i++) {
			// fillNodes[i].setAttribute('contenteditable','true');
			addActionToElement(fillNodes[i]);
		}
	}

    function editElement(e) {
    		var node = e.currentTarget;
		if (nodeIsFillable(node)) {
			var div = new TextEditor(node,saveMode);
		}    	
    }
	function actionsForElement(element) {
//		var node = e.currentTarget;
		var node = element;
		var fet = false;

		navigator.notification.confirm('Tria el que vols fer al node Ç' + node.nodeName + 'È',function(idxButton) {
			switch(idxButton) {
			case 3:
		    	if (nodeIsFillable(node)) {
	        		var div = new TextEditor(node,saveMode);
		    	}
		    	break;
			case 2:
				if (nodeIsRepeatable(node)) {
					var newnode = node.cloneNode(true);
					node.parentNode.insertBefore(newnode,node.nextSibling);
					addActionToElement(newnode);
					saveMode();
				}
				break;
			case 1:
				if (nodeIsRepeatable(node)) {
					node.parentNode.removeChild(node);
				}
				saveMode();
				break;
			default:
				break;
			}
		}, 'Accions sobre el node', ['Eliminar','Duplicar','Editar']);
//		if (confirm(node.nodeName + 'Aturam i no anam mŽs amunt?')) {
//			stopP(e);
//		}
    }

	function addActionToElement(element) {
		that.basicwidget.addLongPressListener(element,editElement,actionsForElement);
	}
	
	
    function saveMode() {
    	that.guarda();
    }
    
    this.showContents = function() {
    	reinicia();
    }
    
	function reinicia () {
		var node = that.basicwidget.returnBasicNode();
		node.innerHTML = '';

		iframe = document.createElement('iframe');
		iframe['seamless'] = 'seamless';
//		iframe['width'] = 400;
//		iframe['height'] = 600;
//		iframe['sandbox'] = '';
		node.appendChild(iframe);		
	}

	this.connectSignalReadFile = function(action) {
		actionReadFile = action;
	}
	
	function callSignalReadFile() {
		if (actionReadFile != null) {
			actionReadFile();			
		}
	}

	this.llegeix = function(dirEntry,file) {
		dirEntry.getFile(
				file,
				{create: false, exclusive: false},
				// Got file
				function (f) {
					titol += ' ' + file;
					var node = that.basicwidget.returnBasicNode();
					//iframe.innerHTML = '';
					docEntry = f;
					docEntry.file(
						function(file) {
							var reader = new FileReader();
							reader.onloadend = function(evt) {
								that.carrega(evt.target.result);
							};
							reader.readAsText(file);
						},
						function(evt) {
							status('Fallada llegint fitxer');
						});

				},
				that.fail);
		callSignalReadFile();
	}
	
	this.guarda = function() {
		docEntry.createWriter(
			function(writer) {
				writer.onwrite = function(evt) {
					status('Desat!');
				};
				writer.write(that.getContents());
			},
			function(evt) {
				status('Ha fallat el desat');
			});
	}
	
	this.carrega = function(text) {
		var doc = iframe.contentWindow.document;
		//doc.addEventListener('load',editMode);
		doc.open('text/html','replace');
		doc.write(text);
		doc.close();
		editMode();
	}
	this.getContents = function() {
		var doc = iframe.contentWindow.document;
		var text = "";
		children = doc.childNodes;
		for (var i=0; i<children.length; i++) {
			var nodetype = children[i].nodeType;
			switch(nodetype) {
			case doc.ELEMENT_NODE:
				text += children[i].outerHTML + "\n";
				break;
			case doc.COMMENT_NODE:
				text += "<" + children[i].nodeValue + ">\n";
				break;
			case doc.DOCUMENT_TYPE_NODE:
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

}

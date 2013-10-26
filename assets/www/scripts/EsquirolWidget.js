// The basic common class for all the objects with a visual representation

function EsquirolWidget() {
	this.basicnode;
	var that = this;
	var touch;
	
	// Graphical tools
	
	this.createInitWidget = function (parentNode) {
		this.basicnode = document.createElement('div');
		parentNode.appendChild(this.basicnode);
		touch = new EsquirolTouch();
	}

	this.returnBasicNode = function () {
		return this.basicnode;
	}

	this.showContents = function () {
		// Show the basic contents of the widget.
		// This must be implemented
		return null;
	}
	
	this.saveAsHTML = function () {
		var file = prompt('Nom de fitxer: ');
		if (file != null && file != '') {
			alert(file);
			this.saveFile(file);
		}
	}
	
	// File system tools

	this.saveFile = function(filename) {

	    function fail(error) {
	        console.log(error.code);
	    }

		function gotFS(fileSystem) {
	        function gotFileEntry(fileEntry) {
	            function gotFileWriter(writer) {
	                writer.onwriteend = function(evt) {
	                };
	            	writer.seek(writer.length);
	        		var node = that.returnBasicNode();
	                writer.write(node.innerHTML);
	            }
	            
	            fileEntry.createWriter(gotFileWriter, fail);
	        }

	        fileSystem.root.getFile(that.fullfilename, {create: true, exclusive: false}, gotFileEntry, fail);
	    }

	    this.fullfilename = '/storage/emulated/0/documents/Esquirol/' + filename;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    }
	
	this.creaBotoOpcions = function(lloc,text,func) {
		var btn = document.createElement('button');
		btn['class'] = 'botoOpcions';
		btn.onclick = func;
		btn.appendChild( document.createTextNode(text));
		lloc.appendChild(btn);
	}
	
	
	this.hideContainer = function() {
//		this.basicnode.style.visibility = 'hidden';
		this.basicnode.parentNode.style.display = 'none';
	}
	
	this.showContainer = function() {
//		this.basicnode.style.visibility = 'visible';
    	this.basicnode.parentNode.style.display = 'block';		
	}
	
	this.isVisible = function() {
		if (this.basicnode.parentNode.style.display=='block') {
			return true;
		} else {
			return false;
		}
	}
}


function commutaSeleccio(e) {
    node = e.currentTarget;
    if (node.getAttribute('class')=='selected') {
        node.setAttribute('class','noselected');
    } else {
        node.setAttribute('class','selected');
    }
}

// Quadre superposat

function emptyQuadre(node) {
    node.innerHTML = '';
}


function closeControl(nodeName) {
    var control = document.getElementById(nodeName);
    control.parentNode.removeChild(control);
}

    function creaSelect(vector1,vector2) {
        select = document.createElement('select');
        for (i=0;i<vector1.length;i++) {
            opt = document.createElement('option')
            opt.setAttribute('value',vector1[i]);
            text = document.createTextNode(vector2[i]);
            opt.appendChild(text);
            select.appendChild(opt)
        }
        return select;
    }

function listProperties(node) {
    for (var prop in node) {
        alert("Propietat '"+prop+"', valor '"+node[prop]+"'");
    }
}


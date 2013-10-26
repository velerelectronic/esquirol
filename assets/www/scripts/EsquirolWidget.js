// The basic common class for all the objects with a visual representation

function EsquirolWidget() {
	this.basicnode;
	var that = this;
	var db;
	var touch;
	
	// Graphical tools
	
	this.createInitWidget = function (parentNode,database) {
		this.basicnode = document.createElement('div');
		parentNode.appendChild(this.basicnode);
		db = database;
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
	
	this.fillBasicTable = function(desti,taula,tableClass) {
		// Basic elements of the table: thead, tbody, tfoot
		
		var taulaAnot = document.createElement('table');
		taulaAnot.className = tableClass;

		desti.appendChild(taulaAnot);
		var thead = document.createElement('thead');
		var tbody = document.createElement('tbody');
		var tfoot = document.createElement('tfoot');
		taulaAnot.appendChild(thead);	    
		taulaAnot.appendChild(tbody);	    
		taulaAnot.appendChild(tfoot);

		db.llistaNomsCamps(taula, function(tx,results) {
			var numcols = 0;
			var camps = [];
			
	    	var fila = document.createElement('tr');
			thead.appendChild(fila);
			var th = document.createElement('th');
			fila.appendChild(th);
			th.appendChild( document.createTextNode('Detalls') );
			th.onclick = that.columnOptions;
			that.addHiddenInfo(th, 'column', 'details');
			numcols = results.rows.length
			for (var i=0; i<numcols; i++) {
				th = document.createElement('th');
				fila.appendChild(th);
				th.appendChild( document.createTextNode(results.rows.item(i)['desc']));
				th.onclick = that.columnOptions;
				that.addHiddenInfo(th, 'column', results.rows.item(i)['camp']);
				camps.push(results.rows.item(i)['camp']);
			}

			// Build the footer for the table
			fila = document.createElement('tr');
			tfoot.appendChild(fila);
			var td = document.createElement('td');
			td.colSpan = (numcols + 1).toString();
			fila.appendChild(td);
			that.creaBotoOpcions(td, 'Mostra-ho tot', function() { that.fillTable(taula,tbody, 0); });
			that.creaBotoOpcions(td, '+',
					function(e) {
						var node = e.currentTarget.parentNode.parentNode;
						camps = [];
						var nextnode = node.firstChild.nextElementSibling;
						while (nextnode != null) {
							camps.push(nextnode.innerHTML);
							nextnode = nextnode.nextElementSibling;
						}
						db.afegeixRegistreTaula(taula,camps);
					});
			
		});
		
		this.fillTable(taula,tbody,5);
	}
	
	this.fillTable = function(taula,tbody, limit) {
		// Remove the contents in tbody
		tbody.innerHTML = '';
		var numcols;
		
	    db.llistaRegistresTaula(taula, 'creat', limit, function(tx,results) {
	    	var numreg = results.rows.length;
	    	if (numreg>0) {
	    		camps = [];
	    		for (var camp in results.rows.item(0)) {
	    			camps.push(camp);
	    		}
	    		numcols = camps.length;
	    		
		        for (var i=0; i<numreg; i++) {
		        	var item = results.rows.item(i);
			        var creat = item['creat'];
			        var modif = item['modif'];
			        var ref = item['ref'];

			        var fila = document.createElement('tr');
			        fila['id'] = creat;
			        tbody.appendChild(fila);
			        fila.onclick = function(e) {
			        	that.openControlRow(e,taula);
			        };

			        var td = document.createElement('td');
			        fila.appendChild(td);
			        td.appendChild( document.createTextNode(creat));
			        
			        for (var j=3; j<numcols; j++) {
			        	var td = document.createElement('td');
			        	fila.appendChild(td);
			        	td.appendChild(document.createTextNode(item[camps[j]]));
			        }

			        // that.generaFilaHTML(fila,instant,divanot);
			    }
	    	}
		});
	}

	this.columnOptions = function(e) {
		var node = e.currentTarget;
		var column = that.getHiddenInfo(node, 'column');
	}
	
	this.openControlRow = function(e,taula) {
		// Delete all the control rows
		var node = e.currentTarget;
		var parent = node.parentNode;
		var numcols = node.getElementsByTagName('td').length;

		function toggleEditable(basenode,option) {
			var nodes = basenode.getElementsByTagName('td');
			for (var i=1; i<nodes.length; i++) {
				var item = nodes[i];
				item.setAttribute('contenteditable',option);						
			}
			if (option=='false') {
				nodes[0].innerHTML = '';
			}
		}

		function closeAllControlRows(collection) {
			var llista = collection.querySelectorAll('tr[class="control"]');
			for (var i=0; i<llista.length; i++) {
				toggleEditable(llista[i].previousSibling,'false');
				collection.removeChild( llista[i] );
			}			
		}
		
		function setEditRow(fila,funcCancel) {
			var td = fila.children[0];
			td.textContent = '';
			that.creaBotoOpcions(td,
				'Desa',
				function() {
					// Save the data in the cells of the same row
					var camps = [];
					var neighboors = tr.children;
					for (i=1; i<neighboors.length; i++) {
						alert(neighboors[i].textContent);
						camps.push(neighboors[i].textContent);
					}
					db.afegeixRegistreTaula(taula, camps);
					toggleEditable(tr,'false');
				});
			that.creaBotoOpcions(td, 'Cancela', funcCancel);
			toggleEditable(fila,'true');
		}
		
		function closeEditRow(fila) {

		}
		
		closeAllControlRows(parent);
		var control = document.createElement('tr');
		control.className = 'control';
		var td = document.createElement('td');
		td.colSpan = numcols + 1;
		control.appendChild(td);
		parent.insertBefore(control, node.nextSibling);

		this.creaBotoOpcions(td,
			'Edita',
			function() {
				closeAllControlRows(parent);
				setEditRow(node, function() { toggleEditable(node,'false'); });
			});
		this.creaBotoOpcions(td,
			'Duplica',
			function() {
				var tr = node.cloneNode(true);
				var td = tr.children[0];
				td.innerHTML='';
				closeAllControlRows(parent);
				parent.insertBefore(tr, parent.children[0]);
				setEditRow(tr, function() { parent.removeChild(tr); } );
			});
	}
	
	this.addHiddenInfo = function(node,label,value) {
		node.setAttribute('data-'+label,value);
	}
	
	this.getHiddenInfo = function(node,label) {
		return node.getAttribute('data-'+label);
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


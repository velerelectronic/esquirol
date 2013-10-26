function EsquirolTables(database) {
	// Class for handling several tables simultaneously
	var that = this;
	var db = database;
	var tablename;
	var tablenamealt;
	var controlrow = null;
	var hihacanvis = false;
	var newrow = false;
	
	this.setTableName = function(name) {
		tablename = name;
	}

	function removeRow(row) {
		row.parentNode.removeChild(row);
	}
	
	function closeControlRow() {
		var tancada = true;
		if (controlrow != null) {
			// We must check if something must be done...
			if (hihacanvis) {
				if (!confirm('Es perdran els canvis. Segur?')) {
					tancada = false;
				}
			}
			if (tancada) {
				// Remove the control row
				removeRow(controlrow);
				controlrow = null;
				hihacanvis = false;
				newrow = false;
			}				
		}
		return tancada;
	}

	function controlMode(fila) {
		// Delete all the control rows
		var parent = fila.parentNode;
		var numcols = fila.getElementsByTagName('td').length;

		if (closeControlRow()) {
			// Create new control row
			controlrow = document.createElement('tr');
			controlrow.className = 'control';
			var td = document.createElement('td');
			td.colSpan = numcols + 1;
			controlrow.appendChild(td);
			parent.insertBefore(controlrow, fila.nextSibling);

			if (newrow) {
				editMode(fila);
			} else {
				creaBotoOpcions(td, 'Edita', function(e) { editMode(fila); });
				creaBotoOpcions(td,
					'Duplica',
					function(e) {
						var novafila = fila.cloneNode(true);
						var td = novafila.children[0];
						td.innerHTML='';
						if (closeControlRow()) {
							parent.insertBefore(novafila, parent.children[0]);
							newrow = true;
							controlMode(novafila);
						}
					});
				creaBotoOpcions(td,
					'Cancela',
					function(e) {
						closeControlRow();
					});				
			}
		}
	}

	function newEditableRow (creat,columns) {
		// Create row
        var fila = document.createElement('tr');
        fila['id'] = creat;

        fila.onclick = function(e) {
        	controlMode(e.currentTarget);
        };

        // Fill in the details
        var td = document.createElement('td');
        fila.appendChild(td);
        td.appendChild( document.createTextNode(creat));
        
        // Fill in the columns
        for (var i=0; i<columns.length; i++) {
        	var td = document.createElement('td');
        	fila.appendChild(td);
        	td.appendChild( document.createTextNode(columns[i]));
        }
        return fila;
	}

	
	function creaBotoOpcions (lloc,text,func) {
		var btn = document.createElement('button');
		btn['class'] = 'botoOpcions';
		btn.onclick = function (e) { e.stopPropagation(); func(); };
		btn.appendChild( document.createTextNode(text));
		lloc.appendChild(btn);
	}
	
	function addHiddenInfo (node,label,value) {
		node.setAttribute('data-'+label,value);
	}
	
	function getHiddenInfo (node,label) {
		return node.getAttribute('data-'+label);
	}
	

	this.fillBasicTable = function(desti,tableClass) {
		// Basic buttons
	    creaBotoOpcions(desti, 'Inicialitza',this.inicialitzaTaula);
		
	    var div = document.createElement('div');
	    desti.appendChild(div);
	    
	    var input = document.createElement('input');
	    var nav = document.createElement('nav');
	    div.appendChild(nav);
	    creaBotoOpcions(nav, 'Ordena', function(e) {});
	    creaBotoOpcions(nav, 'Filtra', function(e) {});
	
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

		db.llistaNomsCamps(tablename, function(tx,results) {
			var numcols = 0;
			var camps = [];
			
	    	var fila = document.createElement('tr');
			thead.appendChild(fila);
			var th = document.createElement('th');
			fila.appendChild(th);
			th.appendChild( document.createTextNode('Detalls') );
			th.onclick = that.columnOptions;
			addHiddenInfo(th, 'column', 'details');
			numcols = results.rows.length
			for (var i=0; i<numcols; i++) {
				th = document.createElement('th');
				fila.appendChild(th);
				th.appendChild( document.createTextNode(results.rows.item(i)['desc']));
				th.onclick = that.columnOptions;
				addHiddenInfo(th, 'column', results.rows.item(i)['camp']);
				camps.push(results.rows.item(i)['camp']);
			}

			// Build the footer for the table
			fila = document.createElement('tr');
			tfoot.appendChild(fila);
			var td = document.createElement('td');
			td.colSpan = (numcols + 1).toString();
			fila.appendChild(td);
			creaBotoOpcions(td, 'Mostra-ho tot', function() { that.fillTable(tbody, 0); });
			creaBotoOpcions(td, '+',
					function(e) {
						if (closeControlRow()) {
							var camps = [];
							for (var i=0; i<numcols; i++) {
								camps.push('');
							}
							var novafila = newEditableRow('',camps);
							tbody.insertBefore(novafila, tbody.children[0]);
							newrow = true;
							controlMode(novafila);
						}
				
						var node = e.currentTarget.parentNode.parentNode;
						camps = [];
						var nextnode = node.firstChild.nextElementSibling;
						while (nextnode != null) {
							camps.push(nextnode.innerHTML);
							nextnode = nextnode.nextElementSibling;
						}
						db.afegeixRegistreTaula(tablename,camps);
					});
			
		});
		
		this.fillTable(tbody,5);
	}
	
	this.fillTable = function(tbody, limit) {
		// Remove the contents in tbody
		tbody.innerHTML = '';
		var numcols;
		
	    db.llistaRegistresTaula(tablename, 'creat', limit, function(tx,results) {
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

			        var items = [];
			        for (var j=3; j<numcols; j++) {
			        	items.push(item[camps[j]]);
			        }
			        tbody.appendChild( newEditableRow(item['creat'],items) );
			    }
	    	}
		});
	}

	this.columnOptions = function(e) {
		var node = e.currentTarget;
		var column = getHiddenInfo(node, 'column');
	}

	function toggleEditable (basenode,option) {
		var nodes = basenode.getElementsByTagName('td');
		for (var i=1; i<nodes.length; i++) {
			var item = nodes[i];
			item.setAttribute('contenteditable',option);						
		}
	}



	
	function closeEditRow(fila) {

	}
	


	function editMode(fila) {
		// Set the edit focus on the previous row
		toggleEditable(fila,'true');
		var td = controlrow.children[0];
		td.innerHTML = '';
		hihacanvis = true;
		
		creaBotoOpcions(td,
				'Desa',
				function() {
					// Save the data in the cells of the same row
					var camps = [];
					var neighboors = fila.children;
					for (i=1; i<neighboors.length; i++) {
						camps.push(neighboors[i].textContent);
					}
					db.afegeixRegistreTaula(tablename, camps);
					toggleEditable(fila,'false');
					hihacanvis = false;
					closeControlRow();
				});
		creaBotoOpcions(td,
				'Esborra',
				function(e) {
					if (closeControlRow()) {
						removeRow(fila);
					}
				});
		if (!newrow) {
			creaBotoOpcions(td, 'Cancela', 
					function() {
						if (closeControlRow()) {
							toggleEditable(fila,'false');					
						}
					});
		}
	}

}
function EsquirolTable(database) {
	// Class for handling several tables simultaneously
	var that = this;
	var db = database;
	var tablename;
	var numcols;
	
	var editRow = null;
	var controlRow = null;
	var newRow = null;
	var hihacanvis = false;

	var EDITABLE = 'editableRow';
	var CONTROL = 'controlRow';
	var EDITING = 'editingRow';
	var NEWEDIT = 'newEditRow';
	var POSSIBLE = 'possibleRow';

	this.setTableName = function(name) {
		tablename = name;
	}

	function newPossibleRow (numcols) {
		var camps = [];
		for (var i=0; i<numcols; i++) {
			camps.push('');
		}
		var tr = newEditableRow ('',camps);
		tr.className = POSSIBLE;

		return tr;
	}

	function newEditableRow (creat,columns) {
		// Create row
        var fila = document.createElement('tr');
        fila.className = EDITABLE;
        fila['id'] = creat;

        fila.onclick = function (e) { controlMode(e.currentTarget); };
        
        // Fill in the details
        var td = document.createElement('td');
        fila.appendChild(td);
        td.appendChild( document.createTextNode(creat));
        
        // Fill in the columns
        for (var i=0; i<columns.length; i++) {
        	var td = document.createElement('td');
        	fila.appendChild(td);
        	td.onclick = function(e) {
        		if (e.currentTarget.parentNode.className == EDITING) {
            		e.stopPropagation();
        		}
        	};
        	td.appendChild( document.createTextNode(columns[i]));
        }
        return fila;
	}
	

	function newControlRow (numcols) {
		var row = document.createElement('tr');
		row.className = CONTROL;
		var td = document.createElement('td');
		td.colSpan = numcols + 1;
		row.appendChild(td);
		return row;
	}
	
	function newFooterRow (numcols,tbody) {
		var fila = document.createElement('tr');
		var td = document.createElement('td');
		td.colSpan = (numcols + 1).toString();
		fila.appendChild(td);
		creaBotoOpcions(td, 'Mostra-ho tot', function() { that.fillTable(tbody, 0); });
		return fila;
	}

	function closeControlRow() {
		var tancada = true;
		if (controlRow != null) {
			// We must check if something must be done...
			if (hihacanvis) {
				if (!confirm('Es perdran els canvis. Segur?')) {
					tancada = false;
				}
			}
			if (tancada) {
				// Remove the control row
				controlRow.parentNode.removeChild(controlRow);
				controlRow = null;
				hihacanvis = false;
			}				
		}
		return tancada;
	}

	function controlMode(fila) {
		// Delete all the control rows
		var parent = fila.parentNode;
		numcols = fila.getElementsByTagName('td').length;

		if (closeControlRow()) {
			// Create new control row
			controlRow = newControlRow(numcols);
			parent.insertBefore(controlRow, fila.nextSibling);

			if (fila.className == POSSIBLE) {
				// This means, the row affected is really a new row. So we must enter the edit mode.
				editMode(fila);
			} else {
				var td = controlRow.children[0];
				creaBotoOpcions(td, 'Edita', function(e) { editMode(fila); });
				creaBotoOpcions(td,
					'Duplica',
					function(e) {
						if (closeControlRow()) {
							for (var i=1; i<numcols; i++) {
								newRow.children[i].textContent = fila.children[i].textContent;
							}
							controlMode(newRow);
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

	function changeRowContents(row,contents) {
		for (var i=1; i<contents.length; i++) {
			row.children[i].textContent = contents[i];
		}
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
			var camps = [];

			// Number of columns
			numcols = results.rows.length;

			// Build the table header
	    	var fila = document.createElement('tr');
			thead.appendChild(fila);
			var th = document.createElement('th');
			fila.appendChild(th);
			th.appendChild( document.createTextNode('Detalls') );
			th.onclick = that.columnOptions;
			addHiddenInfo(th, 'column', 'details');

			for (var i=0; i<numcols; i++) {
				th = document.createElement('th');
				fila.appendChild(th);
				th.appendChild( document.createTextNode(results.rows.item(i)['desc']));
				th.onclick = that.columnOptions;
				addHiddenInfo(th, 'column', results.rows.item(i)['camp']);
				camps.push(results.rows.item(i)['camp']);
			}

			that.fillTable(tbody,5);
			
			// Build the footer for the table
			var fila = newFooterRow(numcols,tbody);
			tfoot.appendChild(fila);		
		});
	}


	this.fillTable = function(tbody, limit) {
		// Remove the contents in tbody
		tbody.innerHTML = '';
		// Special row for inserting new row
		newRow = newPossibleRow(numcols);
		tbody.appendChild(newRow);

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
		var previousClass = fila.className;
		var td = controlRow.children[0];
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
		if (previousClass != POSSIBLE) {
			creaBotoOpcions(td,
				'Esborra',
				function(e) {
					if (closeControlRow()) {
						removeRow(fila);
						toggleEditable(fila,'false');
					}
				});
		}
		creaBotoOpcions(td, 'Cancela', 
				function() {
					if (closeControlRow()) {
						toggleEditable(fila,'false');
						fila.className = previousClass;
					}
				});
		fila.className = EDITING;
		toggleEditable(fila,'true');
	}

	function insertMode(e) {
		// We must open a control row
		var cell = e.currentTarget;
		var row = cell.parentNode;
		newrow = true;
		controlMode(row);
		
		// Focus on the cell pressed
		alert(cell);
	}

}

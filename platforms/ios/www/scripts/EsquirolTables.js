function SearchFilters (parentWidget,database) {
	var that = this;
	var basicwidget = new EsquirolWidget();
	basicwidget.createInitWidget(parentWidget);
	var db = database;
	var searchArray = [];
	var actionLabels;
	var actionFiltersChange;
	
	this.addActionLabels = function(action) {
		actionLabels = action;
	}
	
	this.addActionFiltersChange = function(action) {
		actionFiltersChange = action;
	}
	
	this.showFilters = function() {
		var node = basicwidget.returnBasicNode();
		node.innerHTML = '';
		for (var i=0; i<searchArray.length; i++) {
			var div = document.createElement('div');
			div.className = 'filter';
			node.appendChild(div);
			var field = searchArray[i][0];
			var value = searchArray[i][1];
			div.textContent = field + ": '" + value + "'";
			basicwidget.addHiddenInfo(div, 'field', field);
			basicwidget.addHiddenInfo(div, 'value', value);
			div.onclick = function(e) {
				var node = e.currentTarget;
				var f = basicwidget.getHiddenInfo(node,'field');
				var v = basicwidget.getHiddenInfo(node,'value');
				actionLabels(node,f,v);
			};
		}
	}
	
	this.addFilter = function(field,value) {
		searchArray.push([field,value]);
		this.showFilters();
		actionFiltersChange();
	}

	this.substituteFilter = function(field,value) {
		for (var i=0; i<searchArray.length; i++) {
			if (searchArray[i][0] == field) {
				searchArray[i][1] = value;
			}
		}
		this.showFilters();
		actionFiltersChange();
	}
	
	this.deleteFilter = function(field) {
		for (var i=0; i<searchArray.length; i++) {
			if (searchArray[i][0] == field) {
				searchArray.splice(i,1);
			}
		}
		this.showFilters();
		actionFiltersChange();
	}

	this.getTextFromFilters = function(field) {
		var value = '';
		for (var i=0; i<searchArray.length; i++) {
			if (searchArray[i][0] == field) {
				value = searchArray[i][1];
			}
		}
		return value;
	}
	
	this.toSqlFilter = function() {
		var camps = [];
		var filterStr = " WHERE";
		for (var i=0; i<searchArray.length; i++) {
			filterStr += " " + searchArray[i][0] + "=? AND";
			camps.push(searchArray[i][1]);
		}
		filterStr += " 1=1";
		return [filterStr,camps];
	}
}

function rowEditor(id,parentWidget) {
	var that = this;
	var titol = id;
	this.basicwidget = new EsquirolWidget();
	this.basicwidget.createInitWidget(parentWidget);
	var originCells;
	var editCells = [];
	var rowid;

	this.openEditor = function(origin,rowid,fieldNames,filters,actionSave,actionDel,actionClose) {
		originCells = origin;
		editCells = [];
		var table = document.createElement('table');
		table.className = 'edit';
		var node = this.basicwidget.returnBasicNode();
		node.className = 'editor';
		node.innerHTML = '';
		node.appendChild(table);

		// Print the ROW ID
		var tr = document.createElement('tr');
		table.appendChild(tr);
		var td1 = document.createElement('th');
		var td2 = document.createElement('th');
		td1.textContent = 'Row ID';
		td2.textContent = (rowid==''?'Nou':rowid);
		tr.appendChild(td1);
		tr.appendChild(td2);
		
		// Build space for the fields
		for (var i=0; i<fieldNames.length; i++) {
			var tr = document.createElement('tr');
			table.appendChild(tr);
			var td1 = document.createElement('th');
			var td2 = document.createElement('td');
			tr.appendChild(td1);
			tr.appendChild(td2);
			td1.textContent = fieldNames[i];
			td2.textContent = filters.getTextFromFilters(fieldNames[i]);
			td2.setAttribute('contenteditable','true');
			editCells.push(td2);
		}
		
		// Get the fields
		this.getFromRow();

		// Buttons for the main actions
		var nav = document.createElement('nav');
		node.appendChild(nav);
		
		this.basicwidget.creaBotoOpcions(nav, 'Actualitza', function() {
			actionSave(editCells,rowid);
		});
		this.basicwidget.creaBotoOpcions(nav, 'Duplica', function() {
			actionSave(editCells,null);
		});
		this.basicwidget.creaBotoOpcions(nav, 'Esborra', function() {
			actionDel(rowid);
		});
		this.basicwidget.creaBotoOpcions(nav, 'Tanca', function() {
			actionClose();
		});
	}
		
	this.getFromRow = function (searchFilters) {
		for (var i=0; i<originCells.length; i++) {
			var contents = (typeof originCells[i] == 'undefined'?'':originCells[i].textContent);
			if (editCells[i].textContent == '') {
				editCells[i].textContent = contents;				
			}
		}
	}
	
	this.putToRow = function () {
		for (var i=0; i<originCells.length; i++) {
			originCells[i].textContent = editCells[i].textContent;
		}
	}
	
	this.closeEditor = function() {
		var node = this.basicwidget.autodestroy();
	}
}


function EsquirolTable(parentWidget,database) {
	// Class for handling several tables simultaneously
	var that = this;
	this.createInitWidget(parentWidget);

	var db = database;
	var tablename;
	var numcols;
	var nomsCamps;

	var thead;
	var tbody;
	var tfoot;
	
	var row_editor = null;
	var filters;

	var POSSIBLE = 'possibleRow';

	this.setTableName = function(name) {
		tablename = name;
	}


	function newPossibleRow () {
		var tr = document.createElement('tr');
		var td;
		for (var i=0; i<=numcols; i++) {
			td = document.createElement('td');
			td.textContent = '';
			tr.appendChild(td);
		}
		tr.children[0].colSpan = "3";
		tr.className = POSSIBLE;

		return tr;
	}

	function addFeatures () {
		// Feature: add new records
		if (tbody.children.length>0) {
			tbody.insertBefore(newPossibleRow(),tbody.children[0]);
		} else {
			tbody.appendChild(newPossibleRow());
		}
		// Feature: edit rows
		for (var i=0; i<tbody.children.length; i++) {
			var row = tbody.children[i];
			if (row.className=='updated') {
				row.style.display='none';
			}
			row.onclick = function(e) {
				var fila = e.currentTarget;
				if (row_editor==null) {
					row_editor = new rowEditor('Editor',tfoot,db);
				}
				
				// Prepare the origin cells
				originCells = [];
				for (var i=0; i<numcols; i++) {
					originCells.push(fila.children[i+3]);
				}

				var rowid = fila.children[0].textContent;
				row_editor.openEditor(
						originCells,
						rowid,
						nomsCamps,
						filters,
						that.saveRow,
						that.deleteRow,
						that.closeEditor);					
			};
		}
	}
	
	this.saveRow = function(cells,rowid) {
		// Save the data in the cells of the same row
		var camps = [];
		for (i=0; i<cells.length; i++) {
			camps.push(cells[i].textContent);
		}
		db.afegeixRegistreTaula(tablename, camps, rowid);
		row_editor.putToRow();
		that.closeEditor();
		that.fillTable();
	}
	
	this.deleteRow = function(rowid) {
		db.eliminaRecordDatabase(tablename,rowid);
		that.closeEditor();
		that.fillTable();
	}
	
	this.closeEditor = function() {
		row_editor.basicwidget.autodestroy();
		row_editor = null;
	}
	
	function newFooterRow () {
		var fila = document.createElement('tr');
		var td = document.createElement('td');
		td.colSpan = (numcols + 3).toString();
		fila.appendChild(td);
		creaBotoOpcions(td, 'Mostra-ho tot', function() { that.fillTable(0); } );
		return fila;
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
	};
	
	function getHiddenInfo (node,label) {
		return node.getAttribute('data-'+label);
	};

	function advancedEdit(fila) {
		var rowid = fila.children[0].textContent;
		if (confirm('Vols editar la fila amb ROWID ' + rowid + '?')) {
			var text = 0;
			for (var i=0; i<fila.children.length; i++)
				text += fila.children[i];
			var j=prompt('Quin camp vols editar: 1-' + fila.children.length+'? (0 per esborrar)');
			if (j!=null) {
				if (j==0) {
					db.advancedDeleteRecord(tablename,rowid);
				} else {
					var camp = getHiddenInfo(fila.children[j-1],'field');
					var value=prompt('Canvia el camp Ò'+camp+'Ó del registre ' + rowid + '? ', fila.children[j-1].textContent);
					if (value!=null) {
						db.advancedActualitzaCampTaula(tablename,rowid,camp,value);
					}					
				}
			}
		}
	}
	
	function advancedOptions(node) {
		var nodeList = node.getElementsByTagName('tr');
		for (var i=0; i<nodeList.length; i++) {
			nodeList[i].onclick=function(e) { advancedEdit(e.currentTarget); };
		}
		alert('Mode avanat');
	}
	
	this.botoInicialitza = function (desti,funcInit) {
		// Basic buttons
//	    creaBotoOpcions(desti, 'Inicialitza',funcInit);		
	}
	
	this.fillBasicTable = function(desti,tableClass) {
	    var div = document.createElement('div');
	    desti.appendChild(div);
	    
	    var input = document.createElement('input');
	    var nav = document.createElement('nav');
	    div.appendChild(nav);
	    creaBotoOpcions(nav, 'Ordena', function(e) {});
	    creaBotoOpcions(nav, 'Filtra', opcionsFiltra);
	    this.creaInputText(nav,'Cerca', function(e) {});
	
	    // Show filters
	    filters = new SearchFilters(desti,db);
	    filters.addActionFiltersChange(that.fillTable);
	    filters.addActionLabels(that.filterOptions);
	    filters.showFilters();
	    
		// Basic elements of the table: thead, tbody, tfoot
		
		var taulaAnot = document.createElement('table');
		taulaAnot.className = tableClass;

		desti.appendChild(taulaAnot);
		thead = document.createElement('thead');
		tbody = document.createElement('tbody');
		tfoot = document.createElement('tfoot');
		taulaAnot.appendChild(thead);	    
		taulaAnot.appendChild(tbody);	    
		taulaAnot.appendChild(tfoot);
	    creaBotoOpcions(nav, 'Avanat', function() { advancedOptions(tbody); });

		db.llistaNomsCamps(tablename, function(tx,results) {
			nomsCamps = [];

			// Number of columns
			numcols = results.rows.length;

			// Build the table header
	    	var fila = document.createElement('tr');
			thead.appendChild(fila);
			var th = document.createElement('th');
			fila.appendChild(th);
			th.appendChild( document.createTextNode('Detalls') );
			th.colSpan = "3";
			th.onclick = that.columnOptions;
			addHiddenInfo(th, 'column', 'details');

			for (var i=0; i<numcols; i++) {
				th = document.createElement('th');
				fila.appendChild(th);
				th.appendChild( document.createTextNode(results.rows.item(i)['desc']));
				th.onclick = that.columnOptions;
				addHiddenInfo(th, 'column', results.rows.item(i)['camp']);
				nomsCamps.push(results.rows.item(i)['camp']);
			}

			that.fillTable();
			
			// Build the footer for the table
			var fila = newFooterRow();
			tfoot.appendChild(fila);		
		});
	}

	this.fillTable = function(number) {
		// The default number of rows is 5;
		var limit = (typeof number == 'undefined'?5:number);
		
		// Remove the contents in tbody
		tbody.innerHTML = '';
		db.llistaRegistresXML(tablename, limit, filters.toSqlFilter(), tbody, addFeatures);
	}

	this.columnOptions = function(e) {
		var node = e.currentTarget;
		var column = getHiddenInfo(node, 'column');
		if (confirm("Filtra columna '"+column+"'?")) {
			filters.addFilter(column,'');
		}
	}

	function opcionsFiltra() {

	}
	
	this.filterOptions = function(node,field,value) {
		var values = [];

		db.llistaUnCamp(node, tablename, field, function(tx,results) {
			var ul = document.createElement('ul');
			node.appendChild(ul);
			for (var i=0; i<results.rows.length; i++) {
				var li = document.createElement('li');
				var newvalue = results.rows.item(i)[field];
				li.textContent = newvalue;
				ul.appendChild(li);
				that.addHiddenInfo(li, 'field', field);
				that.addHiddenInfo(li, 'value', newvalue);
				li.onclick = function(e) {
					var node2 = e.currentTarget;
					var f = that.getHiddenInfo(node2,'field');
					var v = that.getHiddenInfo(node2,'value');
					filters.substituteFilter(f, v);
					node.removeChild(ul);
				}
			}
			var p = document.createElement('p');
			p.textContent = 'Esborra';
			node.appendChild(p);
			that.addHiddenInfo(p,'field',field);
			p.onclick = function(e) {
				var node2 = e.currentTarget;
				filters.deleteFilter( that.getHiddenInfo(node2,'field') );
			};
		});
	}

}
EsquirolTable.prototype = new EsquirolWidget;


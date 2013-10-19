function GestorAnotacions(id,parentNode) {
	var anotador;
	var that = this;
	var taulaAnot;
	var titol = id;
	this.basicwidget = new EsquirolWidget();
	this.basicwidget.createInitWidget(parentNode);

	this.returnText = function() {
		return titol;
	}
	
	this.returnState = function() {
		return '';
	}
	
	
	this.generaQuadreAnotacions = function() {
	    // node.innerHTML = '';

		var node = this.basicwidget.returnBasicNode();
		
	    var div = document.createElement('div');
	    node.appendChild(div);
	    
	    var input = document.createElement('input');
	    div.appendChild(input);
	    input.type = 'button';
	    input.value = 'Anota...';
	    
	    var div2 = document.createElement('div');
	    div.appendChild(div2);
	    input.onclick = function(e) { that.creaAnotadorManual(div2); };

	    taulaAnot = document.createElement('table');
	    taulaAnot.id = 'totesAnotacions';
	    node.appendChild(taulaAnot);
	    readAnotacions(this.transformaAnotacionsHTML);
	}

	this.creaAnotacioBuida = function() {
		var fila = document.createElement('tr');
		var td_temps = document.createElement('td');
		var td_anot = document.createElement('td');
	}
	
	this.generaFilaHTML = function(fila,instant,nodeanotacio) {
        var td_temps = document.createElement('td');
        var td_anot = document.createElement('td');

        td_temps.setAttribute('class','temps');
        td_anot.setAttribute('class','anotacio');

        fila.appendChild(td_temps);
		fila.appendChild(td_anot);

		var temps = document.createTextNode(instant);
		var par = document.createElement('p');

		td_temps.appendChild(temps);
		td_anot.appendChild(nodeanotacio);
	}
	
	this.transformaAnotacionsHTML = function(tx,results) {
	    for (var i=0; i<results.rows.length; i++) {
	        var instant = results.rows.item(i)['instant'];

	        var fila = document.createElement('tr');
	        fila.id = instant;
	        taulaAnot.appendChild(fila);
	        fila.onclick = that.mostraControls;

	        var divanot = document.createElement('div');
	        var par = document.createElement('p');
	        par.setAttribute('class','titol');
	        par.appendChild( document.createTextNode( results.rows.item(i)['titol']) );
	        divanot.appendChild(par);

	        par = document.createElement('p');
	        par.innerHTML = results.rows.item(i)['text'];
	        divanot.appendChild(par);

	        if (results.rows.item(i)['grafic'] != null) {
		        var img = document.createElement('img');
		        img.src = results.rows.item(i)['grafic'];	        	
		        divanot.appendChild(img);
	        }

	        that.generaFilaHTML(fila,instant,divanot);
	    }
	}

	this.enregistraAnotacioAmbGrafic = function(imatge) {
	    var text = ''; // document.getElementById('anotacio').value;
	    var titol = document.getElementById('titol').value;
	    var grafic = imatge;
	    
	    recordAnotacions(titol,text,grafic);
	    alert('Desat')
	}


	this.creaAnotadorManual = function(node) {
		anotador = new AnotadorManual(node,this.enregistraAnotacioAmbGrafic);
	}

	this.mostraControls = function(e) {
		// Show a row with the controls to make a copy of an annotation
		
	    var node = e.currentTarget;

	    var instantPrevi = node.id;
	    
	    var taula = node.parentNode;
	    
	    var controlrow = document.createElement('tr');

	    // Only one "control" id at a time
	    controlrow.id = 'control';
	    
	    var td_edit = document.createElement('td');
	    td_edit.setAttribute('colspan','2');
	    td_edit.setAttribute('class','editcontrols');
	    controlrow.appendChild(td_edit);

	    taula.insertBefore(controlrow,node.nextSibling);

	    // Add a copy button
	    var btnCopia = document.createElement('input');
	    btnCopia.type = 'button';
	    btnCopia.value = 'Copia';
	    btnCopia.onclick = function(e) { that.quadreCopiaAnotacio(node,td_edit); };
	    td_edit.appendChild(btnCopia);
	    
	    // Add a delete button
	    var btnDelete = document.createElement('input');
	    btnDelete.type = 'button';
	    btnDelete.value = 'Elimina';
	    btnDelete.onclick = function(e) { that.borraAnotacio(instantPrevi,node,controlrow); };
	    td_edit.appendChild(btnDelete);

	    // Add a cancel button
	    var btnCancel = document.createElement('input');
	    btnCancel.type = 'button';
	    btnCancel.value = 'Tanca';
	    btnCancel.onclick = function(e) { closeControl('control'); };
	    td_edit.appendChild(btnCancel);

	}

	this.borraAnotacio = function(instantPrevi,nodeInfo,nodeEdit) {
		// Delete an annotation based on 'instantPrevi'
	    if (confirm("S'eliminarà l'anotació de la base de dades. N'estàs segur?")) {
	        deleteAnotacio(instantPrevi);
	        nodeInfo.parentNode.removeChild(nodeInfo);
	        nodeEdit.parentNode.removeChild(nodeEdit);
//	        alert('Anotació esborrada.');
	    }
	}

	this.quadreCopiaAnotacio = function (nodeInfo,nodeEdit) {
		// A dialog to copy the contents of an annotation into another one

	    nodeEdit.innerHTML = '';
	    
	    var instantPrevi = nodeInfo.id;
	    
	    var h = document.createElement('h2')
	    h.appendChild( document.createTextNode('Afegeix anotació') );
	    nodeEdit.appendChild(h);
	    
	    nodeEdit.appendChild( document.createTextNode('Títol') );
	    var input = document.createElement('input');
	    input.setAttribute('id','titol');

	    nodeEdit.appendChild(input);
	    var textarea = document.createElement('textarea');
	    textarea.setAttribute('id','anotacio');

	    nodeEdit.appendChild(textarea);
	    var btn = document.createElement('input');
	    btn.setAttribute('type','button');
	    btn.setAttribute('value','Enregistra');
	    btn.setAttribute('onclick','enregistraAnotacio()');
	    nodeEdit.appendChild(btn);

	    var btnCancel = document.createElement('input')
	    btnCancel.setAttribute('type','button');
	    btnCancel.setAttribute('value','Cancela');
	    btnCancel.onclick = function(e) { nodeEdit.parentNode.parentNode.removeChild(nodeEdit.parentNode); };
	    nodeEdit.appendChild(btnCancel);

	    if (instantPrevi) {
	        readSingleAnotacions(instantPrevi,transformaDadesAnotacio);
	    }
	}

}



function transformaDadesAnotacio(tx,results) {
    var node1 = document.getElementById('titol');
    var node2 = document.getElementById('anotacio');
    if (results.rows.length==1) {
        node1.setAttribute('value',results.rows.item(0)['titol']);
        node2.appendChild(document.createTextNode(results.rows.item(0)['text']));
    }    
}




function enregistraAnotacio() {
    var text = document.getElementById('anotacio').value;
    var titol = document.getElementById('titol').value;
    recordAnotacions(titol,text,null);
    closeControl('control');
}


function nouGraficAnotacio() {
	
}
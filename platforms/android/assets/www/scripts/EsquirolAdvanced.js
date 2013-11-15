var codi;

function EsquirolAdvanced(lloc) {
//    var taula = '';
    var that = this;
    var nodedades = document.getElementById(lloc);
    
    this.mostraTaules = function(e) {
        if (typeof(e) != 'undefined') {
            taula = e.currentTarget.getAttribute('title');
            alert(taula);
        }
//        var taula = this.taula;
        nodedades.innerHTML = '';
    
        listTables(function (tx,res) { that.imprimeixllistaTaules(tx, res); });
    }

    this.mostraUnaTaula = function (e) {
        var taula = e.currentTarget.querySelector('[name="taula"]').value;

        nodedades.innerHTML = '';
        queryTable(taula, function (tx, res) { that.imprimeixTaulaBaseDades(taula, tx, res); });
    }
    
    this.eliminaUnaFila = function (e, taula, camp) {
        var codi = recoverHiddenInfo(e.currentTarget,'codi');
        eliminaRecordDatabase(taula, camp, codi);
    }

    
    this.imprimeixllistaTaules = function(tx,results) {
        var ul = document.createElement('ul');
        nodedades.appendChild(ul);
        for (var i=0; i<results.rows.length; i++) {
            var fila = document.createElement('li');
            ul.appendChild(fila);
            anchor = document.createElement('a');
    //        anchor.setAttribute('href','#');
            nomtaula = results.rows.item(i)['tbl_name'];
            that.taula = nomtaula;
            anchor.onclick = that.mostraUnaTaula;
            text = document.createTextNode(nomtaula);
            anchor.appendChild(text);
            anchor.appendChild( createHiddenInfo('taula',nomtaula));
            fila.appendChild(anchor);
        }
    }

    this.imprimeixTaulaBaseDades = function(taula,tx,results) {
		var form = document.createElement('form');
		nodedades.appendChild(form);
		var inputExp = document.createElement('input');
		inputExp.type = 'button';
		inputExp.value = 'Exporta';
		form.appendChild(inputExp);
	
		var inputImp = document.createElement('input');
		inputImp.type = 'button';
		inputImp.value = 'Importa';
		form.appendChild(inputImp);
	
		var intercanvi = document.createElement('div');
		intercanvi.id = 'intercanvi';
		form.appendChild(intercanvi);
	
		inputExp.onclick = function(e) { that.exportaTaula(intercanvi,taula); };    	
//    	inputImp.onclick = function(e) {�that.importaTaula(intercanvi,taula); };

    	if (results.rows.length>0) {
            var taulaAnot = document.createElement('table');
            nodedades.appendChild(taulaAnot);

            var fila = document.createElement('tr');
            taulaAnot.appendChild(fila);
            primeraColumna = '';
            for (var property in results.rows.item(0)) {
                if (primeraColumna=='') {
                    primeraColumna = property;
                }
                var th = document.createElement('th');
                fila.appendChild(th);
                th.appendChild( document.createTextNode(property) );
            }
            var th = document.createElement('th');
            fila.appendChild(th);
            th.appendChild( document.createTextNode('[ ' + primeraColumna + ' ]') );
    
            for (var i=0; i<results.rows.length; i++) {
                var fila = document.createElement('tr');
                taulaAnot.appendChild(fila);
                for (var property in results.rows.item(i)) {
                    var td = document.createElement('td');
                    fila.appendChild(td);
                    text = document.createTextNode(results.rows.item(i)[property]);
                    td.appendChild(text);
                }
                
                // Crea una columna per eliminar una certa fila
                // de la base de dades
                
                td = document.createElement('td');
                fila.appendChild(td);
                anchor = document.createElement('a');
                td.appendChild(anchor);
                
                anchor.href='#';
                anchor.onclick=function(e) {
                    that.eliminaUnaFila(e,taula, primeraColumna);
                };
                anchor.appendChild(document.createTextNode('Elimina '));
                anchor.appendChild( createHiddenInfo( 'codi', results.rows.item(i)[primeraColumna] ));
            }
        } else {
            nodedades.appendChild( document.createTextNode('No hi ha dades.') );
        }    
    }

    this.escapeContents = function (text) {
    	// It performs the following substitutions
    	// \ -> \\
    	// " -> \"
    	return text.replace("\\","\\\\").replace('"','\"');
    }
    
    this.exportaTaula = function(zona,taula) {
    	area = document.createElement('textarea');
    	zona.appendChild(area);
    	area.width = "800";
    	text = '';
    	queryTable(taula,function(tx, results) {
    		if (results.rows.length>0) {
    			vector = [];
	    		for (var i=0; i<results.rows.length; i++) {
	                for (var property in results.rows.item(i)) {
	                    vector.push( '"' + that.escapeContents(results.rows.item(i)[property]) + '"' );
	                }
	                text = vector.join(", ");
	                text += '\n';
	    		}
	    		if (window.clipboardData) {
	    			alert('Clipboard');
	    		} else {
		    		window.prompt('Copia al clipboard',text);	    			
	    		}
	    		area.value = text;
    		} else {
    			area.value = '';
    		}
    	} );
    }
    
    this.importaTaula = function(zona,taula) {
    	alert('Importa');
    }
    
    this.carrega2nSE = function(id) {
        node = document.getElementById(id);
        node.innerHTML = '';

        var alumnes = new Array();
    
        alumnes[0] = ['pepe','Barral Domínguez','José Fernando','2nd B',''];
        alumnes[1] = ['dolca','Cebreros Palou','Dolça Maria','2nd B',''];
        alumnes[2] = new Array('margalida','Gelabert Rotger','Margalida','2nd B','');
        alumnes[3] = new Array('diego','González Cuervo','Diego','2nd B','');
        alumnes[4] = new Array('joanamaria','Martínez Sureda','Joana Maria','2nd B','');
        alumnes[5] = new Array('tomeu','Moya Sastre','Bartomeu','2nd B','');
        alumnes[6] = new Array('kika','Picó Paredes','Francisca','2nd B','');
        alumnes[7] = new Array('mariel','Pla Boffi','Mariel Jimena','2nd B','');
        alumnes[8] = new Array('paula','Rosselló Bibiloni','Paula','2nd B','');
        alumnes[9] = new Array('adria','Sánchez Beneyto','Adria','2nd B','');
        alumnes[10] = new Array('angel','Santiago Viveros','Angel','2nd B','');
        alumnes[11] = new Array('tonijose','Serrano Muñoz','Antonio José','2nd B','');
        alumnes[12] = new Array('pau','Villalonga Menorca','Pau','2nd B','');
        alumnes[13] = new Array('agnes','Barceló Company','Agnes','2nd C','');
        alumnes[14] = new Array('espe','Bibiloni Cabot','Esperança','2nd C','');
        alumnes[15] = new Array('llorenc','Bibiloni Villacreces','Llorenç','2nd C','');
        alumnes[16] = new Array('vicenc','Coll Amengual','Vicenç','2nd C','');
        alumnes[17] = new Array('caterina','Comas Ferrer','Caterina','2nd C','');
        alumnes[18] = new Array('joan','Deyá Ordinas','Joan','2nd C','');
        alumnes[19] = new Array('miquel','Isern Pol','Miquel','2nd C','');
        alumnes[20] = new Array('marina','Jimenez Guasp','Marina','2nd C','');
        alumnes[21] = new Array('tomas','Llano Miro','Tomas','2nd C','');
        alumnes[22] = new Array('laura','Mas Rechach','Laura','2nd C','');
        alumnes[23] = new Array('will','Ramis Rashbrooke','William Edward','2nd C','');
        alumnes[24] = new Array('aina','Rosselló van Assche','Aina','2nd C','');

        var grups = new Array();
        grups[0] = ['2n SE','Els grups de seccions europees: 2n B + 2n C'];
        grups[1] = ['2n B-SE','El grup de seccions europees dins 2n B'];
        grups[2] = ['2n C-SE','El grup de seccions europees dins 2n C'];
            
//    recordObjectesValorables(alumnes);
        recordGrupsObjectes(grups);
        alert('Fet!');
    }

    this.entrarValoracions = function () {
/*
        taula = 'assignacionsValoracio';
        nodedades.innerHTML = '';

        // Camp de grup
        // Camp de data
        var input = document.createElement('input');
        input.type='text';
        input.name='data';
        nodedades.appendChild(input);
        
        var select = document.createElement('select');
        select.id='alumne';
        
        listIndividusByGroup();
        queryTable(taula, function (tx, res) { that.imprimeixTaulaBaseDades(taula, tx, res); });
*/
    }
    
    this.afegeixGraficAnotacio = function() {
    	afegeixGraficAnotacio();
    }
}

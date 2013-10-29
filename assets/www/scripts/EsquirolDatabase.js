var coditemporal;

function EsquirolDatabase() {
	var dbShell;
	var that = this;
	
	this.init = function() {
	    dbShell = window.openDatabase("esquirol","1.0","Base de dades Esquirol",1000000);		
	}

	function instantActual() {
	    var now = new Date();
	    var format = now.toISOString();
	    return format;
	}

	function errorCB(err) {
	    esquirol.actualitzaStatus('Error general en la base de dades: ' + err.code);
	}

	function errorUpdateCB(err) {
	    esquirol.actualitzaStatus('Error en canviar la base de dades: ' + err.code);
	}

	function successCB() {
		// Do nothing
	}

	function successUpdateCB() {
	    esquirol.actualitzaStatus('Base de dades actualitzada');
	}

	this.creaLlistaTaulesDimensionals = function() {
		dbShell.transaction(
			function (tx) {
			    tx.executeSql('DROP TABLE IF EXISTS llistaTaulesDimensionals');
			    tx.executeSql('CREATE TABLE llistaTaulesDimensionals (id TEXT PRIMARY KEY,desc TEXT)');
			},errorCB,successCB
		);
		
	}

	this.llistaTaulesDimensionals = function(dataHandler) {
	    dbShell.transaction(
	        function (tx) {
	            tx.executeSql("SELECT * FROM llistaTaulesDimensionals",[],dataHandler,null);
	        },errorCB,successCB
	    );
	}

	this.InitTaulaNomsCamps = function() {
		creaTaulaDimensional('NomsCamps',['taula','camp','desc'],['Taula','Camp','Descripci—']);
	}

	this.creaTaulaDimensional = function (nom,camps,desc) {
		var textcamps = '';
		for (var i=0; i<camps.length; i++) {
			textcamps += ', ' + camps[i];
			textcamps += ' TEXT';
		}
		dbShell.transaction(
			function (tx) {
			    tx.executeSql('DROP TABLE IF EXISTS '+nom);
	    		tx.executeSql('DELETE FROM NomsCamps WHERE taula=?',[nom],successUpdateCB,errorUpdateCB);
			    tx.executeSql('CREATE TABLE ' + nom + ' (creat TEXT PRIMARY KEY, modif TEXT, ref TEXT' + textcamps + ')');
			    if (desc!=null) {
			    	for (var i=0; i<desc.length; i++) {
			    		var modif = instantActual()
			    		var instant = modif + "_" + i.toString();
			    		tx.executeSql('INSERT INTO NomsCamps VALUES(?,?,?,?,?,?)',[instant,instant,'',nom,camps[i],desc[i]]);
			    	}
			    }
			},errorUpdateCB,successUpdateCB
		);
	}

	this.llistaRegistresTaula = function(nom,order,limit,dataHandler) {
		// If order is different from "", then the results will be sorted
		// If the limit is 0, all the results will be selected
		dbShell.transaction(
			function (tx) {
				var qs = "SELECT * FROM " + nom;
				if (order != '') {
					qs += " ORDER BY " + order + " DESC";
				}
				if (limit>0) {
					qs += " LIMIT "+(limit.toString());
				}
				tx.executeSql(qs,[],dataHandler,errorCB);
			},errorCB,successCB
		);
	}

	this.afegeixRegistreTaula = function(taula,camps,ref) {
		dbShell.transaction(
			function (tx) {
				var text = '';
				for (var i=0; i<camps.length; i++) {
					text += '?,';
				}
				text += '?,?,?';
				var instant = instantActual();
				tx.executeSql("INSERT INTO " + taula + " VALUES ("+text+")",[instant,instant,(ref==null)?instant:ref].concat(camps),null,errorCB);
				if (ref!=null) {
					alert('Actualitzat el registre');
				}
			},errorUpdateCB,successUpdateCB
		);		
	}
	
	this.actualitzaRegistreTaula = function(taula,id,camps,valors) {
/*
		dbShell.transaction(
			function (tx) {
				var text = 'UPDATE ' + taula + ' ';
				for (var i=0; i<camps.length; i++) {
					text += camps[i]+'=? ';
				}
				text += 'WHERE creat=?';
				tx.executeSql(text,[i] + valors,null,errorCB);
			},errorUpdateCB,successUpdateCB
		);
*/
	}
	
	this.llistaNomsCamps = function (taula,dataHandler) {
		var camps = [];
		dbShell.transaction(
			function (tx) {
				tx.executeSql("SELECT camp, desc FROM NomsCamps WHERE taula=?",[taula],dataHandler,errorCB);
			},errorCB,successCB
		);
		return camps;
	}

    /**************************************
     * A partir d'aqu’ cal revisar-ho tot *
     **************************************
     ****/


	
	this.reiniciaDB = function() {
	    if (confirm('Reinicia les dades? AixÃ² esborrarÃ  tot el que hi hagi a la base de dades.')==true) {
	//        dbShell.transaction(rebuildTableObjectesValorables,errorCB,successCB);
	//        dbSehll.transaction(rebuildTablesValoracions,errorCB,successCB);
	        dbShell.transaction(rebuildTablesValoracions,errorCB,successCB);
	    }
	}

/******
===================
Objectes valorables
===================
******/

this.rebuildTableObjectesValorables = function(tx) {
    tx.executeSql('DROP TABLE IF EXISTS agrupamentsObjectes');
    tx.executeSql('DROP TABLE IF EXISTS grupsObjectes');
    tx.executeSql('DROP TABLE IF EXISTS objectesValorables');
    tx.executeSql('CREATE TABLE objectesValorables (codi TEXT PRIMARY KEY, nom1 TEXT, nom2 TEXT, nom3 TEXT, text TEXT)');
    tx.executeSql('CREATE TABLE grupsObjectes (codi TEXT PRIMARY KEY, desc TEXT)');
    tx.executeSql('CREATE TABLE agrupamentsObjectes (codi INTEGER PRIMARY KEY, codiGrup TEXT, codiObjecte TEXT)');
}

this.recordObjectesValorables = function(objectes) {
    dbShell.transaction(
        function (tx) {
            for (var i=0; i<objectes.length; i++) {
                tx.executeSql("INSERT INTO objectesValorables (codi, nom1, nom2, nom3, text) VALUES (?,?,?,?,?)", objectes[i]);
            }
        },errorCB,successCB
    );
}

this.listIndividusByGroup = function(group, dataHandler) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql('SELECT o.codi AS codi, o.nom1 AS nom1, o.nom2 AS nom2, o.nom3 AS nom3, o.text AS text, COUNT(assig.criteri) AS valoracions FROM objectesValorables AS o, agrupamentsObjectes AS g, assignacionsValoracio AS assig WHERE g.codiObjecte=o.codi AND assig.individu=o.codi AND g.codiGrup=? GROUP BY o.codi ORDER BY o.codi',[group],dataHandler,null);
        }
    );
}

this.listIndividusValorables = function (dataHandler) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql('SELECT o.codi, o.nom1, o.nom2, o.nom3, o.text FROM objectesValorables AS o ORDER BY o.codi',[],dataHandler,null);
        }
    );
}

this.listGroups = function (dataHandler) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql('SELECT g.codi AS codi, g.desc AS desc, COUNT(o.codiObjecte) AS individus FROM grupsObjectes AS g, agrupamentsObjectes AS o WHERE g.codi=o.codiGrup GROUP BY o.codiGrup',[], dataHandler, null);
        }
    );
}

this.saveGroup = function (codi,desc) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql("INSERT INTO grupsObjectes VALUES(?,?)", [codi,desc]);
        },errorCB,successCB
    );
}



this.recordGrupsObjectes = function (grups) {
    dbShell.transaction(
        function (tx) {
            for (var i in grups) {
                alert(grups[i]);
                tx.executeSql("INSERT INTO grupsObjectes (codi, desc) VALUES (?,?)", grups[i]);
            }
        },errorCB,successCB
    );
}

/******
======================
Criteris i Valoracions
======================
******/

this.rebuildTablesValoracions = function(tx) {
//    tx.executeSql('DROP TABLE IF EXISTS criterisValoracio');
//    tx.executeSql('CREATE TABLE criterisValoracio (id TEXT, desc TEXT)');
//    tx.executeSql('DROP TABLE IF EXISTS rangCriteris');
//    tx.executeSql('CREATE TABLE rangCriteris (id INTEGER, idcriteri TEXT, desc TEXT)');
    tx.executeSql('DROP TABLE IF EXISTS assignacionsValoracio');
    tx.executeSql('CREATE TABLE assignacionsValoracio (instant TEXT PRIMARY KEY, criteri TEXT, individu TEXT, valor TEXT)');
}

this.listCriterisValoracio = function (dataHandler) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql("SELECT id, desc FROM criterisValoracio",[],dataHandler,null);
        }
    );
}

this.saveCriteriValoracio = function(codi,desc) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql("INSERT INTO criterisValoracio VALUES(?,?)", [codi,desc]);
        },errorCB,successCB
    );
}

this.saveAssignacioValoracio = function(instant,criteri,individu,valor) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql("INSERT INTO assignacionsValoracio VALUES(?,?,?,?)", [instant,criteri,individu,valor]);
        },errorCB,successCB
    );    
}

this.deleteAssignacioValoracio = function(instant) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql("DELETE FROM assignacionsValoracio WHERE instant=?",[instant]);
        },errorCB,successCB
    );
}

this.listAssignacionsValoracio = function(limit,dataHandler) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql('SELECT instant AS instant, criteri AS criteri, individu AS individu, valor AS valor FROM assignacionsValoracio ORDER BY instant DESC LIMIT ?',[limit],dataHandler,null);
        }
    );
}

this.listAssignacionsValoracioPerIndividu = function(codi,dataHandler) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql('SELECT instant AS instant, criteri AS criteri, valor AS valor FROM assignacionsValoracio WHERE individu=? ORDER BY instant DESC',[codi],dataHandler,null);
        }
    );
}

this.listAssignacionsValoracioPerIndividuGrup = function(codiInd,codiGr,dataHandler) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql('SELECT instant AS instant, criteri AS criteri, valor AS valor FROM assignacionsValoracio WHERE individu=? AND ORDER BY instant DESC',[codi],dataHandler,null);
        }
    );
}

this.listAssignacionsValoracioPerCriteri = function() {
}


/******
Anotacions
******/


this.recordAnotacions = function (titol,anotacio,grafic) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql("INSERT INTO anotacions (instant, titol, text, grafic) VALUES(?,?,?,?)",[instantActual(),titol,anotacio,grafic]);
        },errorCB,successCB
    );
}


this.deleteAnotacio = function(instant) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql("DELETE FROM anotacions WHERE instant=?",[instant]);
        },errorCB,successCB
    );
}

// Taules

this.listTables = function(dataHandler) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql("SELECT tbl_name FROM sqlite_master WHERE type='table' and name!='__WebKitDatabaseInfoTable__'",[],dataHandler,null);
        }
    );
}

this.queryTable = function(tableName,dataHandler) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql("SELECT * FROM '"+tableName+"'",[],dataHandler,null);
        }
    );
}

this.eliminaRecordDatabase = function(taula,camp,valor) {
    if (confirm("S'esborrarÃ  el camp '" + camp + "' amb valor '" + valor + "' dins la taula '"+taula+"'. Vols continuar?")) {
        dbShell.transaction(
            function (tx) {
                tx.executeSql("DELETE FROM "+taula+" WHERE "+camp+"=?",[valor]);
            },errorCB,successCB
        );
    }
}

}


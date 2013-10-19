var coditemporal;

function connectDatabase() {
    dbShell = window.openDatabase("esquirol","1.0","Base de dades Esquirol",1000000);

}

function instantActual() {
    var now = new Date();
    var format = now.toISOString();
    return format;
}


function reiniciaDB() {
    if (confirm('Reinicia les dades? Això esborrarà tot el que hi hagi a la base de dades.')==true) {
//    dbShell.transaction(rebuildTableAnotacions,errorCB,successCB);
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

function rebuildTableObjectesValorables(tx) {
    tx.executeSql('DROP TABLE IF EXISTS agrupamentsObjectes');
    tx.executeSql('DROP TABLE IF EXISTS grupsObjectes');
    tx.executeSql('DROP TABLE IF EXISTS objectesValorables');
    tx.executeSql('CREATE TABLE objectesValorables (codi TEXT PRIMARY KEY, nom1 TEXT, nom2 TEXT, nom3 TEXT, text TEXT)');
    tx.executeSql('CREATE TABLE grupsObjectes (codi TEXT PRIMARY KEY, desc TEXT)');
    tx.executeSql('CREATE TABLE agrupamentsObjectes (codi INTEGER PRIMARY KEY, codiGrup TEXT, codiObjecte TEXT)');
}

function recordObjectesValorables(objectes) {
    dbShell.transaction(
        function (tx) {
            for (var i=0; i<objectes.length; i++) {
                tx.executeSql("INSERT INTO objectesValorables (codi, nom1, nom2, nom3, text) VALUES (?,?,?,?,?)", objectes[i]);
            }
        },errorCB,successCB
    );
}

function listIndividusByGroup(group, dataHandler) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql('SELECT o.codi AS codi, o.nom1 AS nom1, o.nom2 AS nom2, o.nom3 AS nom3, o.text AS text, COUNT(assig.criteri) AS valoracions FROM objectesValorables AS o, agrupamentsObjectes AS g, assignacionsValoracio AS assig WHERE g.codiObjecte=o.codi AND assig.individu=o.codi AND g.codiGrup=? GROUP BY o.codi ORDER BY o.codi',[group],dataHandler,null);
        }
    );
}

function listIndividusValorables(dataHandler) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql('SELECT o.codi, o.nom1, o.nom2, o.nom3, o.text FROM objectesValorables AS o ORDER BY o.codi',[],dataHandler,null);
        }
    );
}

function listGroups(dataHandler) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql('SELECT g.codi AS codi, g.desc AS desc, COUNT(o.codiObjecte) AS individus FROM grupsObjectes AS g, agrupamentsObjectes AS o WHERE g.codi=o.codiGrup GROUP BY o.codiGrup',[], dataHandler, null);
        }
    );
}

function saveGroup(codi,desc) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql("INSERT INTO grupsObjectes VALUES(?,?)", [codi,desc]);
        },errorCB,successCB
    );
}



function recordGrupsObjectes(grups) {
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

function rebuildTablesValoracions(tx) {
//    tx.executeSql('DROP TABLE IF EXISTS criterisValoracio');
//    tx.executeSql('CREATE TABLE criterisValoracio (id TEXT, desc TEXT)');
//    tx.executeSql('DROP TABLE IF EXISTS rangCriteris');
//    tx.executeSql('CREATE TABLE rangCriteris (id INTEGER, idcriteri TEXT, desc TEXT)');
    tx.executeSql('DROP TABLE IF EXISTS assignacionsValoracio');
    tx.executeSql('CREATE TABLE assignacionsValoracio (instant TEXT PRIMARY KEY, criteri TEXT, individu TEXT, valor TEXT)');
}

function listCriterisValoracio(dataHandler) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql("SELECT id, desc FROM criterisValoracio",[],dataHandler,null);
        }
    );
}

function saveCriteriValoracio(codi,desc) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql("INSERT INTO criterisValoracio VALUES(?,?)", [codi,desc]);
        },errorCB,successCB
    );
}

function saveAssignacioValoracio(instant,criteri,individu,valor) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql("INSERT INTO assignacionsValoracio VALUES(?,?,?,?)", [instant,criteri,individu,valor]);
        },errorCB,successCB
    );    
}

function deleteAssignacioValoracio(instant) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql("DELETE FROM assignacionsValoracio WHERE instant=?",[instant]);
        },errorCB,successCB
    );
}

function listAssignacionsValoracio(limit,dataHandler) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql('SELECT instant AS instant, criteri AS criteri, individu AS individu, valor AS valor FROM assignacionsValoracio ORDER BY instant DESC LIMIT ?',[limit],dataHandler,null);
        }
    );
}

function listAssignacionsValoracioPerIndividu(codi,dataHandler) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql('SELECT instant AS instant, criteri AS criteri, valor AS valor FROM assignacionsValoracio WHERE individu=? ORDER BY instant DESC',[codi],dataHandler,null);
        }
    );
}

function listAssignacionsValoracioPerIndividuGrup(codiInd,codiGr,dataHandler) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql('SELECT instant AS instant, criteri AS criteri, valor AS valor FROM assignacionsValoracio WHERE individu=? AND ORDER BY instant DESC',[codi],dataHandler,null);
        }
    );
}

function listAssignacionsValoracioPerCriteri() {
}


/******
Anotacions
******/


function rebuildTableAnotacions(tx) {
    tx.executeSql('DROP TABLE IF EXISTS anotacions');
    tx.executeSql('CREATE TABLE anotacions (instant TEXT PRIMARY KEY, titol TEXT, text TEXT, grafic BLOB)');
}

function afegeixGraficAnotacio() {
	dbShell.transaction(
		function (tx) {
			tx.executeSql('ALTER TABLE anotacions ADD COLUMN grafic BLOB');			
		},errorCB,successCB
	);
}

function recordAnotacions(titol,anotacio,grafic) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql("INSERT INTO anotacions (instant, titol, text, grafic) VALUES(?,?,?,?)",[instantActual(),titol,anotacio,grafic]);
        },errorCB,successCB
    );
}


function deleteAnotacio(instant) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql("DELETE FROM anotacions WHERE instant=?",[instant]);
        },errorCB,successCB
    );
}

function readAnotacions(dataHandler) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql('SELECT instant AS instant, titol AS titol, text AS text, grafic AS grafic FROM anotacions ORDER BY instant DESC',[],dataHandler,null);
        }
    );
}

function readSingleAnotacions(instant,dataHandler) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql('SELECT titol AS titol, text AS text FROM anotacions WHERE instant=?',[instant],dataHandler,null);
        }
    );
}

function exportAnotacions() {
// Cal acabar d'escriure aquesta funcio
// !!!!!!!!!!!!!!!
	
	dbShell.transaction(
            function (tx) {
                tx.executeSql('SELECT titol AS titol, text AS text FROM anotacions',[],dataHandler,null);
            }
        );
}

function importAnotacions() {
	
}

function errorCB(err) {
    alert('Error base de dades: ' + err.code);
}

function successCB() {
    esquirol.actualitzaStatus('Base de dades actualitzada');
//    alert('Base de dades actualitzada');
}

// Taules

function listTables(dataHandler) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql("SELECT tbl_name FROM sqlite_master WHERE type='table' and name!='__WebKitDatabaseInfoTable__'",[],dataHandler,null);
        }
    );
}

function queryTable(tableName,dataHandler) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql("SELECT * FROM '"+tableName+"'",[],dataHandler,null);
        }
    );
}

function eliminaRecordDatabase(taula,camp,valor) {
    if (confirm("S'esborrarà el camp '" + camp + "' amb valor '" + valor + "' dins la taula '"+taula+"'. Vols continuar?")) {
        dbShell.transaction(
            function (tx) {
                tx.executeSql("DELETE FROM "+taula+" WHERE "+camp+"=?",[valor]);
            },errorCB,successCB
        );
    }
}


// Taula N-dimensional

function creaLlistaTaulesDimensionals() {
	dbShell.transaction(
		function (tx) {
		    tx.executeSql('DROP TABLE IF EXISTS llistaTaulesDimensionals');
		    tx.executeSql('CREATE TABLE llistaTaulesDimensionals (id TEXT PRIMARY KEY,desc TEXT)');
		}
	);
	
}

function llistaTaulesDimensionals(dataHandler) {
    dbShell.transaction(
        function (tx) {
            tx.executeSql("SELECT * FROM llistaTaulesDimensionals",[],dataHandler,null);
        }
    );
}

function creaTaulaDimensional(nom,camps) {
	textcamps = '';
	for (var i=0; i<camps.length; i++) {
		textcamps += ', camp';
		textcamps += i.toString();
		textcamps += ' TEXT'
	}
	dbShell.transaction(
		function (tx) {
		    tx.executeSql('DROP TABLE IF EXISTS '+nom);
		    tx.executeSql('CREATE TABLE ' + nom + ' (id INTEGER PRIMARY KEY' + textcamps + ')');
		    tx.executeSql('INSERT INTO llistaTaulesDimensionals VALUES(?,?)',[nom,nom]);
		}
	);
}

function llistaRegistresTaula(nom,dataHandler) {
	dbShell.transaction(
		function (tx) {
			tx.executeSql('SELECT * FROM '+nom,[],dataHandler,null);
		}
	);
}

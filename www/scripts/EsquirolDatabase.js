function EsquirolDatabase() {
        var dbShell;
        var that = this;
        var slotObject = null;
        var slotAction = null;
        
	// Signals
	this.signalUpdate = function (info) {};


        this.init = function() {
            dbShell = window.openDatabase("esquirol","1.0","Base de dades Esquirol",1000000);                
        }

        this.connectSlot = function(object,func) {
                if (object == null) {
                        slotObject = window;
                }
                slotAction = func;
        }
        
        
        function instantActual() {
            var now = new Date();
            var format = now.toISOString();
            return format;
        }

        function errorCB(err) {
            that.signalUpdate('Error general en la base de dades: ' + err.code);
        }

        function errorUpdateCB(err) {
            that.signalUpdate('Error en canviar la base de dades: ' + err.code);
        }

        function successCB() {
                // Do nothing
        }

        function successUpdateCB() {
            that.signalUpdate('Base de dades actualitzada');
        }

        function addMessageWait (node) {
                var message = document.createElement('div');
                message.textContent = 'Carregant...';
                node.appendChild(message);
                return message;
        }
        
        function destroyMessageWait (message) {
                message.parentNode.removeChild(message);
        }
        

        function slow_transaction(node,handler,error,success) {
                var message = addMessageWait(node);
                dbShell.transaction(
                                function(tx) {
                                        handler(tx);
                                        destroyMessageWait(message);
                                },error,success);
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

        this.creaTaulaDimensional = function (nom,camps,desc) {
                var textcamps = '';
                for (var i=0; i<camps.length; i++) {
                        textcamps += ', ' + camps[i];
                        textcamps += ' TEXT';
                }
                dbShell.transaction(
                                // fields:
                                // * created: the timestamp of the creation of the record
                                // * ref: a reference to a previous row that is being updated
                        function (tx) {
                                // REF: If this row updates another row, then ref is the rowid of the latter
                            tx.executeSql('DROP TABLE IF EXISTS '+nom);
                            tx.executeSql('DELETE FROM NomsCamps WHERE taula=?',[nom],successUpdateCB,errorUpdateCB);
                            alert('CREATE TABLE ' + nom + ' (created TEXT NOT NULL, ref INTEGER' + textcamps + ')');
                            tx.executeSql('CREATE TABLE ' + nom + ' (created TEXT NOT NULL, ref INTEGER' + textcamps + ')');
                            if (desc!=null) {
                                    var instant = instantActual();
                                    for (var i=0; i<camps.length; i++) {
                                            tx.executeSql('INSERT INTO NomsCamps VALUES(?,?,?,?,?)',[instant,'',nom,camps[i],desc[i]]);
                                    }
                            }
                        },errorUpdateCB,successUpdateCB
                );
        }

        this.InitTaulaNomsCamps = function() {
                this.creaTaulaDimensional('NomsCamps',['taula','camp','desc'],['Taula','Camp','Descripcio']);
        }

        this.llistaUnCamp = function(posNode,taula,camp,dataHandler) {
                slow_transaction(
                                posNode,
                                function (tx) {
                                        tx.executeSql("SELECT DISTINCT " + camp + " FROM " + taula + " ORDER BY " + camp + " ASC",[],dataHandler,errorCB);
                                },errorCB,successCB
                        );
        }

        this.llistaRegistresTaula = function(nodePos, nom,limit,sqlFilter,dataHandler) {
                // If order is different from "", then the results will be sorted
                // If the limit is 0, all the results will be selected
                slow_transaction(
                        nodePos,
                        function (tx) {
                                var param = [];
                                var limitStr = [];
                                var qStr = "SELECT ROWID, * FROM " + nom;
                                var filterStr = sqlFilter[0];
                                var param = sqlFilter[1];
                                var orderStr = " ORDER BY ROWID DESC";
                                if (limit>0) {
                                        limitStr += " LIMIT "+(limit.toString());
                                }
                                tx.executeSql(qStr + filterStr + orderStr + limitStr,param,dataHandler,errorCB);
                        },errorCB,successCB
                );
        }
        
        this.llistaRegistresXML = function(nom, limit, sqlFilter, node, finish, omitupdated) {
                // Default parameter: omitupdated is true
                omitupdated = typeof omitupdated !== 'undefined' ? omitupdated : true;
                
                that.llistaRegistresTaula(node, nom,limit,sqlFilter,function(tx,results) {
                        if (results.rows.length>0) {
                                var camps = [];
                                for (var prop in results.rows.item(0)) {
                                        camps.push(prop);
                                }
                                // refsid stores the ids of the rows that have been updated
                                var refsid = [];
                                for (var i=0; i<results.rows.length; i++) {
                                        var newref = results.rows.item(i)[camps[0]];
                                        var refrowid = results.rows.item(i)[camps[2]];
                                        var updated = false;
                                        
                                        if (refsid.indexOf(newref)<0 && refsid.indexOf(refrowid)<0) {
                                                // Neither the id of the row nor the reference belong to the list.
                                                // This means the row is the last possible update
                                                // Should add the reference to previous rows
                                                if (refrowid != undefined && refrowid != '') {
                                                        refsid.push(refrowid);
                                                }
                                        } else {
                                                updated = true;                                                
                                        }
                                        
                                        var tr = document.createElement('tr');
                                        if (omitupdated && updated) {
                                                tr.className = 'updated';
                                        }
                                        node.appendChild(tr);
                                        var rowid = document.createElement('rowid');
                                        tr.appendChild(rowid);
                                        rowid.textContent = results.rows.item(i)[camps[0]];
                                        for (var j=1; j<camps.length; j++) {
                                                var td = document.createElement('td');
                                                tr.appendChild(td);
                                                td.setAttribute('data-field',camps[j]);
                                                td.appendChild(document.createTextNode(results.rows.item(i)[camps[j]]));
                                        }
                                }
                        }
                        finish();
                });
        }

        this.afegeixRegistreTaula = function(taula,camps,refrowid) {
                dbShell.transaction(
                        function (tx) {
                                var text = '';
                                for (var i=0; i<camps.length; i++) {
                                        text += '?,';
                                }
                                text += '?,?';
                                var instant = instantActual();
                                tx.executeSql("INSERT INTO " + taula + " VALUES ("+text+")",[instant,(refrowid==null)?'':refrowid].concat(camps),null,errorCB);
                                if (refrowid!=null) {
                                        alert('Actualitzat el registre');
                                }
                        },errorUpdateCB,successUpdateCB
                );                
        }
        
        this.advancedActualitzaCampTaula = function(taula,rowid,camp,valor) {
                dbShell.transaction(
                        function(tx) {
                                tx.executeSql("UPDATE "+taula+" SET " + camp + "=? WHERE ROWID=?",[valor,rowid]);                                        
                        },errorUpdateCB,successUpdateCB
                );
        }
        
        this.advancedDeleteRecord = function(taula,rowid) {
                dbShell.transaction(
                        function(tx) {
                                tx.executeSql("DELETE FROM " + taula + " WHERE ROWID=?",[rowid]);                                        
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
     * A partir d'aqui cal revisar-ho tot *
     **************************************
     ****/


        
        this.reiniciaDB = function() {
            if (confirm('Reinicia les dades? AixÃ² esborrarÃ  tot el que hi hagi a la base de dades.')==true) {
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



        // Taules

        this.listTables = function(dataHandler) {
            dbShell.transaction(
                function (tx) {
                    tx.executeSql("SELECT tbl_name FROM sqlite_master WHERE type='table' and name!='__WebKitDatabaseInfoTable__'",[],dataHandler,null);
                }
            );
        }

        this.eliminaRecordDatabase = function(taula,rowid) {
            if (confirm("S'esborrara el registre " + rowid + " de la taula '"+taula+"'. Vols continuar?")) {
                dbShell.transaction(
                    function (tx) {
//                        tx.executeSql("UPDATE "+taula+" SET ref=? WHERE ROWID=? OR ref=?",['-1',rowid,rowid]);
                            tx.executeSql("DELETE FROM "+taula+" WHERE ROWID=?",[rowid]);
                    },errorCB,successCB
                );
            }
        }

}



// Sources: http://www.nogginbox.co.uk/blog/canvas-and-multi-touch

function DiagramaValors() {
	var that = this;
	
    this.mostraDetallsValors = function(node,codiGrup,codiIndividu) {
    	// The new info depends on the info of the clicked row

    	// Take codiGrup into account!!!
        listAssignacionsValoracioPerIndividu( codiIndividu, function(tx,results) { printGeneralTableValues(node,tx,results); } );        	
    }

    var printGeneralTableValues = function(node,tx,results) {
        if (results.rows.length==0) {
            var par = document.createElement('p');
            par.appendChild( document.createTextNode('No hi ha valoracions.') );
            node.appendChild(par);
        } else {
            var table = document.createElement('table');
            table.id = 'infovaloracions';
            node.appendChild(table);
            
            for (var i=0; i<results.rows.length; i++) {
                var tr = document.createElement('tr');

                var td = document.createElement('td');
                tr.appendChild(td);
                td.setAttribute('class','codi');
                var instant = results.rows.item(i)['instant'];
                td.appendChild( document.createTextNode(instant));
                td.appendChild( createHiddenInfo('codiValoracio',instant) );
                
                td = document.createElement('td');
                tr.appendChild(td);
                var criteri = results.rows.item(i)['criteri'];
                td.appendChild( document.createTextNode(criteri));

                td = document.createElement('td');
                tr.appendChild(td);
                var valor = results.rows.item(i)['valor'];
                td.appendChild( document.createTextNode(valor));

                tr.onclick = that.canviaValoracio;
                
                table.appendChild(tr);
            }
        }
    	
    }

	this.tancaDetallsValors = function() {
		// This method returns true if the details can be closed. And so they must be closed.
		return true;
	}

}


function CategoryEditor(base) {
	var nodebase = base;

	var init = function() {
        var input = document.createElement('input');
        input.type = 'text';
        input.onblur = editNewCategory;
        nodebase.appendChild(input);
        nodebase.onblur = editNewCategory;
	}
	init();

    var editNewCategory = function(e) {
        div = document.createElement('div');
        div.id = 'dadesnewcriteri';
//        closeMenu(div);
        var text = document.createElement('textarea');

        div.appendChild(text);

        var btn = document.createElement('input');
        btn.type = 'button';
        btn.value = 'Desa';

        btn.onclick = function(e) {
            saveCriteriValoracio(input.value,text.value);
            closeQuadre(node);
        };

        div.appendChild(btn);
    
        var btnCancel = document.createElement('input');
        btnCancel.type = 'button';
        btnCancel.value = 'Tanca';
        btnCancel.onclick = function (e) { closeMenu(node); };
        div.appendChild(btnCancel);

        nodebase.appendChild(div);
    }

}

function CategorySelector(parent) {
	var that = this;
	var nodebase;
	var nodedetails = null;
	var categoryid = '';
	var categorydesc = '';
	var editor = null;

	var obreQuadre = function(e) {
		if (nodedetails == null) {
			// The node with de details does NOT EXIST
        
			nodedetails = document.createElement('form');
			nodebase.appendChild(nodedetails);    

			listCriterisValoracio(function(tx,results) { creaSelectCriteris(tx,results,nodedetails); } );		
		} else {
			// The node with de details EXISTS. It must be closed
			tancaQuadre();
		}
	}
	
	var tancaQuadre = function() {
		nodedetails.parentNode.removeChild(nodedetails);
		nodedetails = null;		
	}
	
	var init = function(parent) {
		// The main function to be executed in the construction of the object
		
        // Square to choose the categories
        nodebase = document.createElement('div');
        nodebase.setAttribute('class','selectcategory');
		parent.appendChild(nodebase);

        // Information
        var par = document.createElement('p');
        par.setAttribute('id','categoria');
        par.setAttribute('class','showncategory');
        par.onclick = obreQuadre;
        par.appendChild( document.createTextNode('Categoria de valoracio') );
        nodebase.appendChild(par);        
	}
	init(parent);

    var changeCategory = function (e) {
        /*
        -- Change the category and its description that are shown to the user
        -- ident: Category name
        -- desc: The description of the category
        -- Four levels of change:
        -- * Display on the screen
        -- * Store in the class
        -- * Save in de database
        -- * Show area to write special values
        */
    	var node = e.currentTarget;
    	
        lloc = e.currentTarget;
        categoryid = recoverHiddenInfo(node,'id');
        categorydesc = recoverHiddenInfo(node,'desc');
        
//        that.showCriteriaForIndividuals(document, id);

        var node = nodebase.querySelector('.showncategory');
        node.innerHTML = '';
        node.appendChild( document.createTextNode(categoryid + ': ' + categorydesc) );
        
        tancaQuadre();
    };

    	
    var creaSelectCriteris = function(tx,results,form) {
        //
        // -- Show a menu with all the cateogories stored in the database. It offers the chance to create a new category as well.
        //
        // emptyQuadre(node);
        // openQuadre(node);
    
        if (results.rows.length==0) {
            var par = document.createElement('p');
            par.appendChild( document.createTextNode('No hi ha criteris') );
            form.appendChild(par);
        } else {
            var ul = document.createElement('ul');
            form.appendChild(ul);
            for (var i=0; i<results.rows.length; i++) {
                var li = document.createElement('li');
                ident = results.rows.item(i)['id'];
                desc = results.rows.item(i)['desc'];
                li.appendChild( document.createTextNode( ident + ': ' + desc) );
                li.appendChild( createHiddenInfo('id',ident) );
                li.appendChild( createHiddenInfo('desc',desc) );
                li.onclick = changeCategory;
                ul.appendChild(li);
            }
        }
        editor = new CategoryEditor(form);
    };

    this.returnCategoryId = function() {
    	return categoryid;
    }

    this.returnState = function() {
    	var text = '';
    	
    	if (categoryid != '') {
    		text += categoryid + '.';
    	}

    	if (nodedetails != null) {
    		text += 'Elegir categoria.';
    	}
    	return text;
    }
}

function DiagramaIndividus() {
	var that = this;
	var codiGrup = '';
	var categories = null;
    var taulavalors = new DiagramaValors();

	this.returnState = function() {
		var text = '';
		var nou = '';
		if (codiGrup != '') {
			text = 'grup ' + codiGrup + '.';
		}
		if (categories != null) {
			text += categories.returnState();
		}
		return text;
	}
	
    this.printGeneralTableIndividualsGroup = function(node,codiGrup,tx,results) {
        if (results.rows.length==0) {
            var par = document.createElement('p');
            par.appendChild( document.createTextNode('No hi ha individus.') );
            node.appendChild(par);
        } else {
            var table = document.createElement('table');
            table.id = 'infoindividus';
            node.appendChild(table);
            
            for (var i=0; i<results.rows.length; i++) {
                var tr = document.createElement('tr');

                var td = document.createElement('td');
                tr.appendChild(td);
                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                
                td.setAttribute('class','codi');
                codiIndividu = results.rows.item(i)['codi'];
                td.appendChild( checkbox );
                td.appendChild( createHiddenInfo('codiIndividu',codiIndividu) );
                td.appendChild( createHiddenInfo('codiGrup',codiGrup) )
                
                td = document.createElement('td');
                tr.appendChild(td);
                nom1 = results.rows.item(i)['nom1'];
                nom2 = results.rows.item(i)['nom2'];
                nom3 = results.rows.item(i)['nom3'];
                td.appendChild( document.createTextNode(nom1 + nom2 + nom3));

                td = document.createElement('td');
                tr.appendChild(td);
                text = results.rows.item(i)['text'];
                td.onclick = that.insereixDetallsValoracions;
                td.appendChild( document.createTextNode(text));

                td = document.createElement('td');
                tr.appendChild(td);
                valoracions = results.rows.item(i)['valoracions'];
                td.onclick = selectIndividu;
                td.appendChild( document.createTextNode('(' + valoracions + ' valoracions)'));

                td = document.createElement('td');
                td.setAttribute('class','criteris');
                tr.appendChild(td);
                
                table.appendChild(tr);
            }
        }
    }

	this.mostraDetallsIndividus = function(nodebase,codiG) {
		codiGrup = codiG;

		categories = new CategorySelector(nodebase);
		
        // Space for the "Save" button
        var input = document.createElement('input');
        input.type = 'button';
        input.value = 'Desa';
        input.onclick = function(e) { that.desaValoracionsMultiples(e); };
        nodebase.appendChild(input);

        // Space for the list of individuals
        listIndividusByGroup( codiGrup, function(tx,results) { that.printGeneralTableIndividualsGroup(nodebase,codiGrup,tx,results); } );
		
	}
	
	this.tancaDetallsIndividus = function() {
		// This method returns true if the details can be closed. And so they must be closed.
		codiGrup = '';
		return true;
	}
	
	var selectIndividu = function(e) {
    	var selectedRow = e.currentTarget.parentNode;
    	var nextRow = selectedRow.nextSibling;
    	var mustOpenInfo = true;
    	
    	var infoRow = selectedRow.parentNode.querySelector(".spanIndividu");
    	if (infoRow != null) {
    		// There is a row with #spanIndividu
    		
    		if (infoRow == nextRow) {
    			// The infoRow refers to the individual in the selected row (it is in the next row)
    			mustOpenInfo = false;
    		}

    		if (taulavalors.tancaDetallsValors()) {
        		infoRow.parentNode.removeChild(infoRow);    			
    		} else {
    			mustOpenInfo = false;
    		}
    	}
    	
    	if (mustOpenInfo) {
    		var tr_info = document.createElement('tr');
        		selectedRow.parentNode.insertBefore(tr_info,nextRow);

            var td = document.createElement('td');
            td.setAttribute('colspan','5');
            tr_info.appendChild(td);
            tr_info.setAttribute('class','spanIndividu');
            var codiInd = recoverHiddenInfo(selectedRow,'codiIndividu');
            var codiGrup = recoverHiddenInfo(selectedRow,'codiGrup')
            
            taulavalors.mostraDetallsValors(td, codiGrup, codiInd);
    	}

	}
}


function DiagramaGrups() {
	// A table of all the groups defined in the database
	// It uses the class 'DiagramaIndividu'
	
	var that = this;
    var taulaindividus = new DiagramaIndividus();

    this.returnState = function() {
    	var grup = taulaindividus.returnState();
    	if (grup=='')
    		return '';
    	else
    		return grup;
    }
    
    this.toggleSpanned = function(base,name) {
    	// Store the 'spanned' node, if any
    	var node = document.getElementById(name);
    	if (node == null) {
    		return true;
    	} else {
        	if ((base != null) && (base.id == name)) {
        		// The clicked row is the one spanned
	    		node.parentNode.removeChild(node);
        		return false;
        	} else {
        		// The clicked row is not spanned, but it needs to be
	    		node.parentNode.removeChild(node);
        		return true;
        	}
    		
    	}    	
    }
        

    this.printGeneralTableGroups = function(tx,results,form) {
        if (results.rows.length==0) {
            var par = document.createElement('p');
            par.appendChild( document.createTextNode('No hi ha grups.') );
            form.appendChild(par);
        } else {
            var table = document.createElement('table');
            table.id = 'infogrups'
            form.appendChild(table);
            
            for (var i=0; i<results.rows.length; i++) {
                var tr = document.createElement('tr');

                var td = document.createElement('td');
                tr.appendChild(td);
                td.setAttribute('class','codi');
                codi = results.rows.item(i)['codi'];
                td.appendChild( document.createTextNode(codi));
                td.appendChild( createHiddenInfo('codiGrup',codi) );
                
                td = document.createElement('td');
                tr.appendChild(td);
                desc = results.rows.item(i)['desc'];
                td.appendChild( document.createTextNode(desc));

                td = document.createElement('td');
                tr.appendChild(td);
                individus = results.rows.item(i)['individus'];
                td.appendChild( document.createTextNode('(' + individus + ' individus)'));

                tr.onclick = that.selectGroup; // insereixDetallsIndividus;
                
                table.appendChild(tr);
            }
        }
    }

    this.selectGroup = function(e) {
    	var selectedRow = e.currentTarget;
    	var nextRow = selectedRow.nextSibling;
    	var mustOpenInfo = true;
    	
    	var infoRow = selectedRow.parentNode.querySelector(".spanGroup");
    	if (infoRow != null) {
    		// There is a row with #spanInfo
    		
    		if (infoRow == nextRow) {
    			// The infoRow refers to the group in the selected row (it is in the next row)
    			mustOpenInfo = false;
    		}

    		if (taulaindividus.tancaDetallsIndividus()) {
        		infoRow.parentNode.removeChild(infoRow);    			
    		} else {
    			mustOpenInfo = false;
    		}
    	}
    	
    	if (mustOpenInfo) {
    		var tr_info = document.createElement('tr');
//            if (nextRow == null) {
//            	selectedRow.parentNode.appendChild(tr_info);
 //           } else {
        		selectedRow.parentNode.insertBefore(tr_info,nextRow);
        	// If nextRow is null, the new tr_info will be inserted at the end of the siblings.
 //           }
            
            var td = document.createElement('td');
            td.setAttribute('colspan','3');
            tr_info.appendChild(td);
            tr_info.setAttribute('class','spanGroup');
            var codiG = recoverHiddenInfo(selectedRow,'codiGrup');
            
            taulaindividus.mostraDetallsIndividus(td, codiG);
    	}
    }
    

	this.mostraTaula = function(form) {
//		db.listGroups(function(tx,results) { that.printGeneralTableGroups(tx, results, form); } );
	}
        

}


function DiagramaValoracions(id,parentNode) {
// Class for everything related to evaluate some individuals with some criteria
// The way it works:
// * It offers a list of groups, with some basic information of each one.
// * You can choose one grup, but just one.
// * Then it shows the individuals belonging to that group.
// * At this point you can choose a set of assessment criteria or see the past evaluations.

	// Initialization
	
    this.posicions = Array();
    var that = this;
    var titol = id;
    var diagramagrups = new DiagramaGrups();
	this.basicwidget = new EsquirolWidget();
	this.basicwidget.createInitWidget(parentNode);


	this.returnText = function() {
		return titol;
	}
	
	this.returnState = function() {
		var text = diagramagrups.returnState();
		return text;
	}

	this.showContents = function() {
		this.mostraQuadreValoracions();
	}
	
   
    this.showCriteriaForIndividuals = function(base,criteri) {
    	var tds = base.querySelectorAll("td[class='criteris']");
    	for (var i=0; i<tds.length; i++) {
    		var bloccriteri = document.createElement('div');
    		bloccriteri.setAttribute('class','criteri');
    		bloccriteri.appendChild( document.createTextNode(criteri) );
    		bloccriteri.appendChild( createHiddenInfo('codicriteri',criteri) );
    		bloccriteri.onclick = that.toggleCriteri;
    		tds[i].appendChild(bloccriteri);
    	}
    }
    
    this.toggleCriteri = function(e) {
    	var node = e.currentTarget;
    	if (node.getAttribute('class')=='criteri') {
    		node.setAttribute('class','criteriselected');
    	} else {
    		node.setAttribute('class','criteri');
    	}
    }
    
    this.canviaValoracio = function(e) {
    	alert('No implementada');
    }
    
    this.mostraQuadreValoracions = function() {
		var node = this.basicwidget.returnBasicNode();
        var form;
        // node.innerHTML = '';

        var table = document.createElement('table');
        
        form = document.createElement('form');
        node.appendChild(form);
        
        diagramagrups.mostraTaula(form);		
    };


    this.mostraLlistaIndividusPerValorar = function() {
	    // Show a list of individuals where you can choose just one and get the values for him/her.

        listIndividusByGroup(grup,that.writeListOfIndividuals);
    }
    
    this.writeListOfIndividuals = function(tx,results) {
    	var item;
    	var node = document.getElementById('alumnes');
    	node.innerHTML = '';
    	
    	var ol = document.createElement('ol');
    	node.appendChild(ol);
 
    	for (var i=0; i<results.rows.length; i++) {
    		var li = document.createElement('li');
    		ol.appendChild(li);
    		item = results.rows.item(i);

    		li.appendChild( document.createTextNode(item['nom2'] + ' ' + item['nom1']) );
    		
    		li.href = item['codi'];
    		li.class = 'notselected';
    		li.onclick=function(e) { li.class='selected'; that.mostraValoracionsIndividu(e.currentTarget['href']); };
    	}

        // Book some space for the evaluation of individuals
        var div = document.createElement('div');
        div.id = 'listValoracions';
        node.appendChild(div);
    }
    
    this.mostraValoracionsIndividu = function (codiindividu) {
    	var llocvalors = document.getElementById('listValoracions');
    	var diag = new DiagramaValoracionsIndividu(llocvalors,codiindividu);
    	diag.mostraLlistaValoracions();
    }
        

    this.escriuTaulaAlumnes = function(tx,results) {
        var that = this;
        var node = document.getElementById('alumnes');
        node.innerHTML = '';

        if (grup=='1r A') {
            coord = coord1rA();
        } else if (grup=='B1B') {
            coord = coordB1B();
        } else if (grup=='TM1') {
            coord = coordTM1();
        } else if (grup=='2n BC-SE') {
            coord = coord2nSE();
        } else {
            coord = [];
        }

        this.posicions = [];
        this.alumnes = [];
        var index;

        // Calcula rows
        var maxcol = 0;
        var maxrow = 0;
        for (var codi in coord) {
            if (coord[codi][0]>maxrow) {
                maxrow = coord[codi][0];
            }
            if (coord[codi][1]>maxcol) {
                maxcol = coord[codi][1];
            }
        }

        var table = document.createElement('table')
        table.setAttribute('id','valoracions');
        table.onclick="alert('holaaaa')";
    
        node.appendChild(table);
	
        for (var i=0;i<maxrow;i++) {
            var tr = document.createElement('tr');
            table.appendChild(tr);
            for (var j=0;j<maxcol;j++) {
                var td = document.createElement('td');
                td.setAttribute('class','noselected');
                tr.appendChild(td);
                this.posicions.push(td);
            }
        }
	
        for (i=0; i<results.rows.length;i++) {
//            alert('No existeix? '+results.rows.item(i)['codi']);
            pos = coord[results.rows.item(i)['codi']];
            var index = (pos[0]-1)*maxcol + pos[1]-1;
            var p = document.createElement('p');
            text = document.createTextNode(results.rows.item(i)['nom1']+' '+results.rows.item(i)['nom2']);
            this.posicions[index].onclick = commutaSeleccio;
            p.appendChild(text);
            this.posicions[index].appendChild(p);

            p = document.createElement('p');
            p.appendChild( document.createTextNode('Valoracions') );
            p.onclick = that.triaIndividu;
            this.posicions[index].appendChild(p);
            
            var assignacions = document.createElement('div');
            assignacions.setAttribute('class', 'assignacions');
            assignacions.id = results.rows.item(i)['codi'];
            this.posicions[index].appendChild(assignacions);
            this.posicions[index].appendChild( createHiddenInfo('alumne', results.rows.item(i)['codi']) );
            this.posicions[index].id = results.rows.item(i)['codi'];
            this.alumnes.push(assignacions);
//            this.alumnes.push(this.posicions[index]);
        }

/*
        for (var i=0; i<this.alumnes.length; i++) {
            this.codi = this.alumnes[i].id;
            listAssignacionsValoracioPerIndividu(this.alumnes[i].id, function (tx,rex) { that.escriuValoracionsPerIndividu(tx,rex); } );
        }
*/

    };

    this.inicialitzaValoracionsIndividus = function() {
    };
    
    this.escriuValoracionsPerIndividu = function(tx, results) {
        var that = this;
        var info;
        node = that.alumnes.shift();

        if (results.rows.length>0) {
            info = document.createElement('dl');
            for (var i=0; i<results.rows.length; i++) {
                record = results.rows.item(i);
                var dt = document.createElement('dt');
                info.appendChild(dt);
                var etiqueta = document.createTextNode(record['criteri']);
                dt.appendChild( etiqueta );
                
                var dl = document.createElement('dl');
                info.appendChild(dl);
                etiqueta = document.createTextNode(record['valor']);
                dl.appendChild(etiqueta);
            }
        } else {
            info = document.createTextNode('Buit');
        }
        node.appendChild(info);
    };

    this.askGroup = function(e) {
    // Ask the user to choose the group
        var that = this;
        var node = document.getElementById('editgrup');
        openMenu(node);
        listGroups(function(tx,results) { that.creaSelectGrups(tx,results); } );
    };

    this.askCategory = function(e) {
        var that = this;
    //    e.currentTarget.innerHTML = '';
        var node = document.getElementById('editcategory');
        openMenu(node);
        listCriterisValoracio(function(tx,results) { that.creaSelectCriteris(tx,results); } );
    };



    this.creaSelectGrups = function(tx,results) {
    /*
    -- Show a menu with all the groups stored in the database. It offers the chance to create a new group as well.
    */
        that = this;
        var node = document.getElementById('editgrup');
        emptyQuadre(node);
        openQuadre(node);
        node.style.height = '20%';
    
        var form = document.createElement('form');
        node.appendChild(form);
    
        if (results.rows.length==0) {
            var par = document.createElement('p');
            par.appendChild( document.createTextNode('No hi ha grups.') );
            form.appendChild(par);
        } else {
            var ul = document.createElement('ul');
            form.appendChild(ul);
            for (var i=0; i<results.rows.length; i++) {
                var li = document.createElement('li');
                codi = results.rows.item(i)['codi'];
                desc = results.rows.item(i)['desc'];
                li.appendChild( document.createTextNode( codi + ': ' + desc) );
                li.appendChild( createHiddenInfo('codi',codi) );
                li.appendChild( createHiddenInfo('desc',desc) );
                li.onclick = function (e) {
                    closeQuadre(node);
                    lloc = e.currentTarget;
                    var codi = lloc.getElementsByTagName('input')[0].value;
                    var desc = lloc.getElementsByTagName('input')[1].value;
                    that.changeGrup(codi,desc);
                };
                ul.appendChild(li);
            }
        }

        var input = document.createElement('input');
        input.type = 'text';
        form.appendChild(input);

        div = document.createElement('div');
        div.id = 'dadesnewgrup';
        closeMenu(div);
        form.appendChild(div);
    
        var text = document.createElement('textarea');
        div.appendChild(text);

        var btn = document.createElement('input');
        btn.type = 'button';
        btn.value = 'Desa';

        btn.onclick = function(e) {
            saveGroup(input.value,text.value);
            closeQuadre(node);
        };

        div.appendChild(btn);
    
        var btnCancel = document.createElement('input');
        btnCancel.type = 'button';
        btnCancel.value = 'Tanca';
        btnCancel.onclick = function (e) { closeMenu(node); };
        form.appendChild(btnCancel);

        input.onfocus = function(e) {
            openMenu(div);
            input.onfocus = null;
        };
    };


    this.changeGrup = function (ident,desc) {
    /*
    -- Change the group and its description that are shown to the user
    -- ident: Category name
    -- desc: The description of the category
    */
        var that = this;
        var node = document.getElementById('showngrup');
        node.innerHTML = '';
        node.appendChild( document.createTextNode(ident + ': ' + desc) );

        grup = ident;
        listIndividusByGroup(ident,function(tx,results) { that.escriuTaulaAlumnes(tx,results); } );
//        this.escriuValoracionsIndividus();
    //    escriuTaulaAlumnes(node,ident);
    };



    this.desaValoracionsMultiples = function(e) {
        llistaind = document.querySelectorAll('td[class="criteris"]');
        var temps = instantActual();
        var comptevalors = 0;
        var compteindividus = 0;
        
        for (var i=0; i<llistaind.length; i++) {
        	codiindividu = recoverHiddenInfo(llistaind[i].parentNode,'codiIndividu');

        	llistacriteri = llistaind[i].querySelectorAll('[class="criteriselected"]');
        	if (llistacriteri != []) {
        		compteindividus += 1;
            	for (var j=0; j<llistacriteri.length; j++) {
                    llistacriteri[j].setAttribute('class','criteridesat');
                    codicriteri = recoverHiddenInfo(llistacriteri[j],'codicriteri');
                    saveAssignacioValoracio(temps+'-'+i+'-'+j,codicriteri,codiindividu,'');
                    comptevalors += 1;
                }        	
        	}
        }
        alert('Desades ' + comptevalors + ' valoracions per a ' + compteindividus + ' individus.' );
    };

    this.desaValoracions = function(e) {
        var temps = document.getElementById('temps').value;
        var text = '<p>' + this.category + '</p><ul>\n';
        llista = document.querySelectorAll('[class="selected"]');
        comentari = document.getElementById('valors').value;
        var continua = true;
        if (comentari=='') {
            if (! confirm('Les dades es guardaran amb un valor buit. Vols continuar?') ) {
                continua = false;
            }
        }
        if (temps == '') {
            temps = instantActual();
        } else {
            if (! confirm('Has especificat una data diferent. Vols continuar?') ) {
                continua = false;
            }
        }
        if (continua) {
            for (var i=0; i<llista.length; i++) {
                llista[i].setAttribute('class','done');
                var nodealumne = llista[i].querySelector('[name="alumne"]');
                text += '<li>' + nodealumne.value + '</li>\n';
                saveAssignacioValoracio(temps+'-'+i,this.category,nodealumne.value,comentari);
            }
            text += '</ul>\n';
            text += '<p>Comentari general: '+comentari+'</p>\n';
//            recordAnotacions("Registre de valoracions",text);
        }
    };

    this.triaIndividu = function (e) {
        var idindividu = e.currentTarget.parentNode.id;
        quadre = document.getElementById('quadre2');
        quadre.innerHTML = '';
        diagindividu = new DiagramaValoracionsIndividu(quadre,idindividu);
        diagindividu.mostraLlistaValoracions();
    };


// Final de la classe

}


function DiagramaValoracionsIndividu(arrel,individu) {
    var that = this;
    var nodeArrel = arrel;
    var codiIndividu = individu;
    var espai_edit;
    nodeArrel.innerHTML = '';

    this.infraestructura = function () {
        var par = document.createElement('p');
        par.class = 'individu';
        par.appendChild( document.createTextNode(codiIndividu) );
        nodeArrel.appendChild(par);
    };
    
    this.generarLlistaValoracions = function (tx,results) {
        var table = document.createElement('table');
        var td;
        nodeArrel.appendChild(table);
        for (var i=0; i<results.rows.length; i++) {
            var tr = document.createElement('tr');
            tr.onclick = that.showControls;
            table.appendChild(tr);
            var item = results.rows.item(i);

            td = document.createElement('td');
            tr.appendChild(td);
            td.appendChild( document.createTextNode(item['instant']));
            td.appendChild( createHiddenInfo('instant',item['instant']) );
            
            td = document.createElement('td');
            tr.appendChild(td);
            td.appendChild( document.createTextNode(item['criteri']));
            td.appendChild( createHiddenInfo('criteri',item['criteri']) );

            td = document.createElement('td');
            tr.appendChild(td);
            td.appendChild( document.createTextNode(item['valor']));
            td.appendChild( createHiddenInfo('valor',item['valor']) );
        }

    };
    
    this.mostraLlistaValoracions = function() {
        this.infraestructura();
        listAssignacionsValoracioPerIndividu(codiIndividu, function(tx, results) { that.generarLlistaValoracions(tx,results); } );
        
    };
    
    this.showControls = function (e) {
        var fila = e.currentTarget;
        var controlrow = document.createElement('tr');
        fila.parentNode.insertBefore(controlrow,fila.nextSibling);

        espai_edit = document.createElement('td');
        espai_edit.setAttribute('colspan','3');
        espai_edit.setAttribute('class','editcontrols');
        controlrow.appendChild(espai_edit);
        
        // Add a copy button
        var btnCopia = document.createElement('input');
        btnCopia.setAttribute('type','button');
        btnCopia.setAttribute('value','Duplica i edita');
        btnCopia.onclick = function(e) { that.showFormEditValoracio(e, fila, controlrow); }
        espai_edit.appendChild(btnCopia);
    
        // Add a delete button
        var btnDelete = document.createElement('input');
        btnDelete.setAttribute('type','button');
        btnDelete.setAttribute('value','Elimina');
        btnDelete.onclick = function() { that.borraAssignacioValoracio( fila, controlrow); };
        espai_edit.appendChild(btnDelete);

        // Add a cancel button
        var btnCancel = document.createElement('input');
        btnCancel.setAttribute('type','button');
        btnCancel.setAttribute('value','Tanca');
        btnCancel.onclick = function(e) { controlrow.parentNode.removeChild(controlrow); };
        espai_edit.appendChild(btnCancel);
    }
    
    this.showFormEditValoracio = function (e, nodeInfo, nodeEdit) {
        espai_edit.innerHTML = '';
        var pare = e.currentTarget;
//        alert(pare);
//        listProperties(pare);
        
        var instant = recoverHiddenInfo(nodeInfo,'instant');
        var criteri = recoverHiddenInfo(nodeInfo,'criteri');
        var valor = recoverHiddenInfo(nodeInfo,'valor');

        var heading = document.createElement('h2');
        heading.appendChild( document.createTextNode('Duplica i edita valoració') );
        espai_edit.appendChild(heading);
        
        // Create the form
        var form = document.createElement('form');
        form.id = 'editvaloracio';
        espai_edit.appendChild(form);
        var input = document.createElement('input');
        input.id = 'instant';
        input.type = text;
        input.defaultValue = instant;
        form.appendChild(input);

        // Space to choose the criteria
        var select = document.createElement('select');
        select.name = 'criteri';
        
        listCriterisValoracio(
            function(tx, results) {
                for (var i=0; i<results.rows.length; i++) {
                    item = results.rows.item(i);
                    var option = document.createElement('option');
                    option.name = item['id'];
                    if (criteri==item['id']) {
                        option.selected = 'selected';
                    }
                    select.appendChild(option);
                    option.appendChild( document.createTextNode(item['id'] +': '+item['desc']) );
                }
            }
        );
        form.appendChild(select);
        
        // Space to change the value
        var textarea = document.createElement('textarea');
        textarea.id = 'valor';
        textarea.defaultValue = valor;
        form.appendChild(textarea);
        
        // Button to save everything
        var btn_save = document.createElement('input');
        btn_save.type = 'button';
        btn_save.onclick = function(e) { that.desaFormEditValoracio(e, nodeInfo, nodeEdit); };
        btn_save.value = 'Desa';
        form.appendChild(btn_save);
        
        // Button to reset
        var btn_reset = document.createElement('input');
        btn_reset.type = 'reset';
        btn_reset.value = 'Restaura';
        form.appendChild(btn_reset);
        
        // Button to cancel
        var btn_cancel = document.createElement('input');
        btn_cancel.type = 'button';
        btn_cancel.value = 'Tanca';
        btn_cancel.onclick = function(e) { nodeEdit.parentNode.removeChild(nodeEdit); };
        form.appendChild(btn_cancel);
    }
    
    this.desaFormEditValoracio = function(e, nodeInfo, nodeEdit) {
        alert('hola');
        var instant = nodeEdit.querySelector('input[name="instant"]').value;
        var criteri = nodeEdit.querySelector('select[name="criteri"]').value;
        var valor = nodeEdit.querySelector('textarea').value;
//        alert(instant+criteri+valor);
        saveAssignacioValoracio(instant, criteri, codiIndividu, valor);
        nodeEdit.parentNode.removeChild(nodeEdit);
    }

    this.borraAssignacioValoracio = function(nodeInfo,nodeEdit) {
        instantPrevi = recoverHiddenInfo(nodeInfo,'instant');
        alert('Borrant...' + nodeInfo);
        alert('Borrar instant '+instant);

        if (confirm("S'eliminarà la valoració de la base de dades. N'estàs segur?")) {
            deleteAssignacioValoracio(instantPrevi);
            nodeInfo.parentNode.removeChild(nodeInfo);
            nodeEdit.parentNode.removeChild(nodeEdit);
        }
    }

}


function DiagramaTaulaN (id,parentNode) {
	var that = this;
    var titol = id;
	this.basicwidget = new EsquirolWidget();
	this.basicwidget.createInitWidget(parentNode);

	this.creaTaulaNdim = function(dim) {
		
	}
	
	this.mostraControls = function() {
		var node = this.basicwidget.returnBasicNode();

		var titol = document.createElement('h2');
		titol.appendChild(document.createTextNode('Taules N-dimensionals'));
		node.appendChild(titol);

//		creaLlistaTaulesDimensionals();		
		this.mostraLlista(node);

	}

	this.mostraLlista = function(node) {
		function converteixLlista(desti,tx,results) {
			if (results.rows.length==0) {
				desti.appendChild(document.createTextNode('No hi ha taules dimensionals'));
			} else {
				var llista = document.createElement('ul');
				desti.appendChild(llista);
				for (var i=0; i<results.rows.length; i++) {
	                var li = document.createElement('li');
	                var nomtaula = results.rows.item(i)['id'];
	                li.appendChild(document.createTextNode(nomtaula ));
	                li.appendChild(createHiddenInfo('taula',nomtaula));
	                li.onclick = that.obreTaula;
	                llista.appendChild(li);
				}
			}
		}
		
		var div = document.createElement('div');
		node.appendChild(div);
		
		llistaTaulesDimensionals( function(tx,results) { converteixLlista(div,tx,results); } );

		var boto = document.createElement('button');
		boto.appendChild(document.createTextNode('Crea taula...'));
		boto.onclick = this.dialegCrearTaula;
		node.appendChild(boto);
	}
	
	this.obreTaula = function(e) {
		var node = that.basicwidget.returnBasicNode();
		alert(e.currentTarget);
		that.mostraTaula(recoverHiddenInfo(e.currentTarget,'taula'), node);
	}
	
	this.dialegCrearTaula = function() {
		var nomtaula = prompt('Nom de la nova taula:');
		if (nomtaula != null && nomtaula !='') {
			if (confirm('Nom de la taula: '+nomtaula)) {
				var mescamps = true;
				camps = [];
				while (mescamps) {
					var noucamp = prompt('Camp '+ (camps.length+1).toString());
					if (noucamp != null && noucamp != '') {
						camps.push(noucamp);
					} else {
						mescamps = false;
					}
				}
			}
		}
		if (confirm('Taula: '+nomtaula + '; camps: ' + camps.toString() + '. Correcte?')) {
			creaTaulaDimensional(nomtaula,camps);
		}
	}
	
	this.mostraTaula = function(nom,node) {
		function converteixLlista(desti,tx,results) {
			if (results.rows.length==0) {
				desti.appendChild(document.createTextNode('No hi ha registres'));
			} else {
				var taula = document.createElement('table');
				desti.appendChild(taula);
				for (var i=0; i<results.rows.length; i++) {
	                var tr = document.createElement('tr');
	                var fila = results.rows.item(i);
	                for (var prop in fila) {
	                	var td = document.createElement('td');
	                	tr.appendChild(td);
		                td.appendChild(document.createTextNode(fila[prop] ));
	                }
	                taula.appendChild(tr);
				}
			}
		}
		
		var div = document.createElement('div');
		node.appendChild(div);
		
		llistaRegistresTaula( function(tx,results) { converteixLlista(div,tx,results); } );

		var boto = document.createElement('button');
		boto.appendChild(document.createTextNode('Insereix registre'));
		boto.onclick = this.dialegInserirRegistre;
		node.appendChild(boto);

	}
	
	this.insereixRegistre = function() {
		
	}
	
	this.delimitaTaula = function (criteris) {
		
	}
}


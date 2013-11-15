function EsquirolMain() {
	var that = this;
    var timeout;
    var docslocalfilesystem;

    var pilatasques;
    var mainmenu; // The main menu (for options, tasks, activity...)
    var database = new EsquirolDatabase();
    var nodedades;
    var nodestatus;

    
    this.AppName = function() { return 'Esquirol 0.5'; };
    
    function PaginaInicial(id,parentNode,db) {
    	var titol = id;
    	this.basicwidget = new EsquirolWidget();
    	this.basicwidget.createInitWidget(parentNode,db);

    	this.returnText = function() {
    		return titol;
    	}
    	
    	this.returnState = function() {
    		return '';
    	}
    	
    	this.showContents = function() {
    		var node = this.basicwidget.returnBasicNode();
    		node.innerHTML = "<p>Benvingut a Esquirol, el programa gestor d'anotacions!</p><p>Tria una de les opcions que hi ha la capçalera d'aquesta p&agrave;gina per comen&ccedil;ar a treballar.</p>";
    	}
    	
    };
    
    // Methods
    
    this.inicia = function(dades,bar,menu,status) {
    	// The tasks pile contains the views of several tasks
    	pilatasques = new EsquirolPilaTasques();
    	
    	// Set up a main bar at the top of the main window
		var mainbar = new EsquirolOptions( document.getElementById(bar) );
		mainbar.createMainBar(this.AppName(),
				that.mostraMenuOpcions,
				that.mostraMenuTasques,
				that.mostraMenuActivitat,
				that.mostraMenuCompartir,
				function() { pilatasques.changeToNextTask(); },
				function() { pilatasques.changeToPreviousTask(); }
		);

		// Init database
        database.init();
	    
        // Init menus
        mainmenu = new EsquirolMenu( document.getElementById(menu) );
		mainmenu.closeMenu();
        
        // Init node for data
        nodedades = document.getElementById(dades);

        // Create a status bar
        nodestatus = document.getElementById(status);
    }

    this.mostraInicial = function() {
    	var inicial = new PaginaInicial('Pàgina inicial',nodedades,database);
    	pilatasques.addTask('inicial',inicial);
    };
    
    
    // Show annotations
    this.mostraAnotacions = function () {
        var gestoranotacions = new GestorAnotacions('Anotacions',nodedades,database,1);
        pilatasques.addTask('anotacions',gestoranotacions);
    };

    this.mostraValoracions = function () {
        gestoranotacions = new GestorAnotacions('Anotacions',nodedades,database,2);
        pilatasques.addTask('anotacions',gestoranotacions);    	
    }
    this.mostraValoracions2 = function () {
        diagvaloracio = new DiagramaValoracions('Valoracions',nodedades);
        pilatasques.addTask('anotacions',diagvaloracio);
    };

    this.mostraRellotge = function () {
    	that.tancaMenu();
    	var rell = new EsquirolClock('Rellotge',nodedades);
    	pilatasques.addTask('rellotge',rell);
    };
    
    this.mostraForms = function () {
    	that.tancaMenu();
    	var forms = new EsquirolForms('Formularis',nodedades);
    	pilatasques.addTask('formularis',forms);
    	forms.mostraForm();
    };
    
	this.mostraDocuments = function () {
		that.tancaMenu();

        // Build a space to read documents from the local file system
        var docslocalfilesystem = new EsquirolSourceFilesystem('Sistema de fitxers',nodedades);
        pilatasques.addTask('sistemafitxers', docslocalfilesystem);        
	};
	
	
    this.tancaMenu = function() {
//        mainmenu.closeMenu(nodemenu);
    }
    
    this.mostraMenuOpcions = function() {
    	mainmenu.creaList('Opcions',[
                     [that.mostraInicial, 'Inicial'],
                     [that.mostraAnotacions, 'Anotacions'],
                     [that.mostraValoracions, 'Valoracions'],
                     [that.mostraValoracions2, 'Valoracions'],
                     [that.mostraRellotge,'Rellotge'],
                     [that.mostraForms,'Formularis'],
                     ['exportaHTML()', 'Exporta'],
                     [function () { document.location='canvas.html'; }, 'Canvas'],
                     [function() { document.location='database.html'; }, 'Base de dades'],
                     [that.mostraDocuments, 'Documents'],
                     [function() { document.location='opendocumentviewer.html'; }, 'Visor ODF']
                    ]);
    }

	this.canviaTasca = function(e) {
//		mainmenu.closeMenu(nodemenu);
		pilatasques.changeTask(e);
	}
	

	this.mostraMenuTasques = function() {
		var pila = pilatasques;
    	mainmenu.creaMenu('Tasques',
    		function () {
    			var r;
    			alert('aqui');
                var quantitat = pila.lengthOfPile();
                if (quantitat>0) {
            		ul = document.createElement('ul');
            		ul.setAttribute('class','menu');

            		for (var i=0; i<quantitat; i++) {
            			var task = pila.returnTask(i);
            			var li = document.createElement('li');
            			li.appendChild(document.createTextNode(task.returnText()));
            			li.appendChild(document.createTextNode(' '));
            			li.appendChild(document.createTextNode(task.returnState()));
//            			li.appendChild(createHiddenInfo('select',i+1));
//            			li.onclick = func;
            			ul.appendChild(li);
            		}        	
        			r = ul;
                } else {
                	var par = document.createElement('p');
                	par.appendChild( document.createTextNode('No hi ha tasques') );
                	r = par;
                }
                return r;
        	}
    	);
    	// mainmenu.creaMenuFromIterator('Tasques',that.canviaTasca,new pilatasques.generateList());
	}

	this.mostraMenuCompartir = function() {
//		mainmenu.closeMenu();
        pilatasques.returnCurrentTask().basicwidget.saveAsHTML();
	}
	
    this.actualitzaStatus = function(nouestat) {
        nodestatus.innerHTML = '';
        var div = document.createElement('div');
        nodestatus.appendChild(div);
        div.appendChild( document.createTextNode(nouestat));
        window.clearTimeout(timeout);
        timeout = window.setTimeout(that.esborraStatus,3000);
    }
    
    this.esborraStatus = function() {

    }
}

function EsquirolMain() {
	var that = this;
	var timeout;
	var docslocalfilesystem;

	var pilatasques;
	var mainmenu; // The main menu (for options, tasks, activity...)
	var database = new EsquirolDatabase();
	Signal.connect(database,'emitSignalUpdate',this,'actualitzaStatus');

    // database.connectSlot(this,actualitzaStatus);

	var nodedades;
	var nodestatus;


    this.AppName = function() { return 'Esquirol 1.0'; };
    
    // Methods
    
	this.inicia = function(dades,bar,menu,status) {
		// The tasks pile contains the views of several tasks
		pilatasques = new EsquirolWidgetStack();
		
		var p = new EsquirolWidget();
		
                // Set up a main bar at the top of the main window
                mainbar = new EsquirolOptions( document.getElementById(bar) );
                Signal.connect(mainbar,'signalOpenMain',that,'mostraMenuOpcions');
		Signal.connect(mainbar,'signalSelectedTask',pilatasques,'changeToIndexedTask');
		Signal.connect(pilatasques,'signalAddedWidget',mainbar,'addTask');
		Signal.connect(pilatasques,'signalShowWidget',mainbar,'changeMainTask');
                Signal.connect(mainbar,'signalSwipeRight',pilatasques,'changeToPreviousTask');
                Signal.connect(mainbar,'signalSwipeLeft',pilatasques,'changeToNextTask');
		Signal.connect(mainbar,'signalCloseTask',pilatasques,'removeTask');
                mainbar.createMainBar(this.AppName());

		// Init database
		database.init();
	    
		// Init menus
//		mainmenu = new EsquirolMenu( document.getElementById(menu) );
		mainmenu = new EsquirolMenu();
		mainmenu.hideContainer();
		mainmenu.creaList('Opcions',[
			[that.mostraInicial, 'Inicial'],
			[that.mostraAnotacions, 'Anotacions'],
			[that.mostraValoracions, 'Valoracions'],
			[that.mostraDocuments, 'Documents'],
			/*  [that.mostraValoracions2, 'Valoracions'], */
			[that.mostraRellotge,'Rellotge'],
			[that.exportaHTML, 'Exporta a HTML']
/*
			[that.mostraForms,'Formularis'],
			[function () { document.location='canvas.html'; }, 'Canvas'],
			[function() { document.location='database.html'; }, 'Base de dades'],
			[function() { document.location='opendocumentviewer.html'; }, 'Visor ODF']
*/		]);
	    
		// Init node for data
		nodedades = document.getElementById(dades);

		// Create a status bar
		nodestatus = document.getElementById(status);
	}

	this.mostraInicial = function() {
	    function PaginaInicial(id,parentNode,db) {
	    	this.createInitWidget(parentNode,db);

	    	this.showContents = function() {
	    		var node = this.returnBasicNode();
	    		node.innerHTML = "<p>Benvingut a Esquirol, el programa gestor d'anotacions!</p><p>Tria una de les opcions que hi ha la capçalera d'aquesta p&agrave;gina per comen&ccedil;ar a treballar.</p>";
	    	}
	    };
	    PaginaInicial.prototype = new EsquirolWidget('Pàgina inicial');

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
    
	this.mostraUnDocument = function (dirEntry,file) {
		var undocument = new VisorDocument('Document',actualitzaStatus,nodedades);
		undocument.connectSignalReadFile(function() {
			var nodetask = document.getElementById('taskname');
			nodetask.innerHTML = '';
			nodetask.appendChild( document.createTextNode(undocument.returnText()));
			});
		pilatasques.addTask('document', undocument);
		undocument.llegeix(dirEntry,file);
	}

	this.mostraDocuments = function () {
		that.tancaMenu();

		// Build a space to read documents from the local file system
		var docslocalfilesystem = new EsquirolSourceFilesystem('Sistema de fitxers',nodedades);
		//docslocalfilesystem.connectOpenFile(mostraUnDocument);
		Signal.connect(docslocalfilesystem,'signalOpenFile',that,'mostraUnDocument');
		Signal.connect(docslocalfilesystem,'signalFail',that,'actualitzaStatus');
		pilatasques.addTask('sistemafitxers', docslocalfilesystem);
	};

    this.tancaMenu = function() {
//        mainmenu.closeMenu(nodemenu);
    }
    
    this.mostraMenuOpcions = function() {
	mainmenu.showContainer();
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

	this.exportaHTML = function() {
		alert(document.documentElement.outerHTML());
	}

	this.mostraMenuCompartir = function() {
//		mainmenu.closeMenu();
        pilatasques.returnCurrentTask().basicwidget.saveAsHTML();
	}

    function esborraStatus() {
		nodestatus.innerHTML = '';
    }

    function actualitzaStatus (nouestat) {
        nodestatus.appendChild( document.createTextNode(nouestat));
        window.clearTimeout(timeout);
        timeout = window.setTimeout(function() { esborraStatus(); },5000);
    }
    
}

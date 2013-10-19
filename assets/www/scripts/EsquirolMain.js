function EsquirolMain(dades,menu) {
	var that = this;
    var nodebar;
    var nodemenu;
    var nodedades;
    var nodestatus;
    var llocdades = dades;
    var llocmenu = menu;
    var that = this;
    var timeout;
    var docslocalfilesystem;
    var pilatasques;
    var mainmenu;
    var tskmenu;
    var actmenu;
    this.swipe;
    
    this.AppName = function() { return 'Esquirol 0.5'; };
    
    // Methods
    
    this.inicia = function() {
    	function createMainBar(name) {
	        var node = document.getElementById('AppBar');
	        node.innerHTML = '';
	        var heading = document.createElement('h1');
	        heading.appendChild( document.createTextNode(name) );
	        node.appendChild( heading );
	        
			var botons = document.createElement('div');
			botons.id = 'buttons';
			node.appendChild(botons);

			creaBotoOpcions(botons, 'button', that.mostraOpcions, 'Menu');
			creaBotoOpcions(botons, 'button', that.mostraTasques, 'Tsk');
			creaBotoOpcions(botons, 'button', that.mostraActivitat, 'Act');
			
			that.swipe = new EsquirolTouch();
			node.addEventListener('touchstart',function() { that.swipe.touchStart(event,"AppBar"); }, false);
			node.addEventListener('touchend', function() { that.swipe.touchEnd(event); }, false);
			node.addEventListener('touchmove', function() { that.swipe.touchMove(event); }, false);
			node.addEventListener('touchcancel', function() { that.swipe.touchCancel(event); }, false);
			
			that.swipe.connect(null, null, function() { pilatasques.changeToNextTask(); }, function() { pilatasques.changeToPreviousTask(); });
	        return node;
    	}
    	
    	function createMenus(node) {
    		mainmenu = new EsquirolMenu(node);
    		taskmenu = new EsquirolMenu(node);
    		actmenu = new EsquirolMenu(node);
    	}
    	
    	// The tasks pile contains the views of several tasks
    	
    	pilatasques = new EsquirolPilaTasques(); // Una pila de tasques
    	
        // Init nodes for the application
        
        // * Application main bar

		nodebar = createMainBar(this.AppName());
        
        // * General data
        
        nodedades = document.getElementById(llocdades);

        connectDatabase();

        // * Application menus

        nodemenu = document.getElementById(llocmenu);
        createMenus(nodemenu);
        
        // Create a status bar
        nodestatus = document.createElement('div');
        nodestatus.id = 'status';
        document.querySelector('body').appendChild(nodestatus);
        
    }
    
    this.mostraAnotacions = function () {
        that.tancaMenu();
        gestoranotacions = new GestorAnotacions('Anotacions',nodedades);
        pilatasques.addTask('anotacions',gestoranotacions);
        gestoranotacions.generaQuadreAnotacions();
    }

    this.mostraValoracions = function () {
        that.tancaMenu();
        diagvaloracio = new DiagramaValoracions('Valoracions',nodedades);
        pilatasques.addTask('anotacions',diagvaloracio);
        diagvaloracio.mostraQuadreValoracions();
    }

    this.mostraRellotge = function () {
    	that.tancaMenu();
    	var rell = new EsquirolClock('Rellotge',nodedades);
    	pilatasques.addTask('rellotge',rell);
    	rell.mostraTauler();
    }
    
    this.mostraForms = function () {
    	that.tancaMenu();
    	var forms = new EsquirolForms('Formularis',nodedades);
    	pilatasques.addTask('formularis',forms);
    	forms.mostraForm();
    }
    
	this.mostraDocuments = function () {
		that.tancaMenu();

        // Build a space to read documents from the local file system
        this.docslocalfilesystem = new EsquirolSourceFilesystem('Sistema de fitxers');
        var div = document.createElement('div');
        pilatasques.addTask('sistemafitxers',this.docslocalfilesystem,div);
        nodedades.appendChild(div);
        
		var nodelist = document.createElement('div');
		div.appendChild(nodelist);
		
		var docarea = document.createElement('div');
		docarea.id = 'documentarea';
		div.appendChild(docarea);

        doc = new VisorDocument('documentarea');
        doc.reinicia();

        this.docslocalfilesystem.start(window,'/storage/emulated/0/documents/Esquirol/',nodelist, doc );
	}
	
	
    this.tancaMenu = function() {
        mainmenu.closeMenu(nodemenu);
    }
    
    this.mostraOpcions = function() {
        if (mainmenu.isMenuOpen()) {
            mainmenu.closeMenu();
        } else {
            mainmenu.creaMenu('Opcions', [
                 ["document.location='index.html'", 'Inicial'],
                 [that.mostraAnotacions, 'Anotacions'],
                 ['mostraQuadreNovaAnotacio(\'quadre\')', 'Nova anotació'],
                 [that.mostraTaulaN, 'Taula N-dim'],
                 [that.mostraValoracions, 'Valoracions'],
                 [that.mostraRellotge,'Rellotge'],
                 [that.mostraForms,'Formularis'],
                 ['exportaHTML()', 'Exporta'],
                 [function () { document.location='canvas.html'; }, 'Canvas'],
                 [function() { document.location='database.html'; }, 'Base de dades'],
                 [that.mostraDocuments, 'Documents'],
                 [function() { document.location='opendocumentviewer.html'; }, 'Visor ODF']] );
        
            // nodemenu.appendChild( creaBotoOpcions(llocmenu, 'opcions', this.tancaMenu, 'X') );
        }
    }

	this.canviaTasca = function(e) {
		mainmenu.closeMenu(nodemenu);
		pilatasques.changeTask(e);
	}
	

	this.mostraTasques = function() {
        if (mainmenu.isMenuOpen()) {
            mainmenu.closeMenu();
        } else {
        	mainmenu.createMenuFromPileOfTasks('Tasques', that.canviaTasca, pilatasques);
        	// mainmenu.creaMenuFromIterator('Tasques',that.canviaTasca,new pilatasques.generateList());
        }

        nodemenu.onblur = function(e) { closeMenu(nodemenu); };
	}

	this.mostraTaulaN = function() {
        that.tancaMenu();
        diagtaulan = new DiagramaTaulaN('TaulaN',nodedades);
        pilatasques.addTask('taulaN',diagtaulan);
        diagtaulan.mostraControls();		
	}
	
    this.actualitzaStatus = function(nouestat) {
        nodestatus.innerHTML = '';
        var div = document.createElement('div');
        nodestatus.appendChild(div);
        div.appendChild( document.createTextNode(nouestat));
        window.clearTimeout(timeout);
        openQuadre(nodestatus);
        timeout = window.setTimeout(that.esborraStatus,3000);
    }
    
    this.esborraStatus = function() {
        closeQuadre(nodestatus);
    }
}

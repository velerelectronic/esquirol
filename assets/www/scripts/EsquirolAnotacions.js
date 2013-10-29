function GestorAnotacions(id,parentNode,database,tipus) {
	var anotador;
	var that = this;
	var taulaAnot;
	var titol = id;
	this.basicwidget = new EsquirolWidget();
	this.basicwidget.createInitWidget(parentNode,database);
	var TABLEANOT = 'anotacions';
	var TABLEVALOR = 'graellaavaluacio';
	var db = database;
	var table_anot = new EsquirolTable(database);
	var table_valor = new EsquirolTable(database);
	var type = tipus;

	table_anot.setTableName(TABLEANOT);
	table_valor.setTableName(TABLEVALOR);

	this.returnText = function() {
		return titol;
	}
	
	this.returnState = function() {
		return '';
	}
	
	this.showContents = function() {
		this.generaQuadreAnotacions();
	}
	
	this.inicialitzaTaula = function() {
		if (confirm('Segur que voleu esborrar la taula i refer-la?')) {
			// InitTaulaNomsCamps();
			// db.creaTaulaDimensional('anotacions',['titol','desc','imatge'],['T’tol','Descripci—','Imatge']);
			db.creaTaulaDimensional(TABLEVALOR,
					['grup','alumne','data','criteri','valor','comentaris'],
					['Grup','Alumne','Data','Criteri de valoraci—','Valor','Comentaris']
			);

		}
	}
	

	this.generaQuadreAnotacions = function() {
		var node = this.basicwidget.returnBasicNode();

		node.innerHTML = '';

		if (type==1) {
			table_anot.fillBasicTable(node,'resumDades');
		} else {
			table_valor.botoInicialitza(node,this.inicialitzaTaula);
			table_valor.fillBasicTable(node,'resumDades');
		}
	}
}


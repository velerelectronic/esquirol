function GestorAnotacions(id,parentNode,database,tipus) {
	EsquirolWidget.call(this,id);
	this.createInitWidget(parentNode,database);

	var anotador;
	var that = this;
	var taulaAnot;
	var TABLEANOT = 'anotacions';
	var TABLEVALOR = 'graellaavaluacio';
	var db = database;
	var node = this.returnBasicNode();
	var table_anot = new EsquirolTable(node, database);
	var table_valor = new EsquirolTable(node, database);
	var type = tipus;

	table_anot.setTableName(TABLEANOT);
	table_valor.setTableName(TABLEVALOR);

	this.showContents = function() {
		this.generaQuadreAnotacions();
	}
	
	this.inicialitzaTaula = function() {
		if (confirm('Segur que voleu esborrar la taula i refer-la?')) {
			// InitTaulaNomsCamps();
			db.InitTaulaNomsCamps();
			db.creaTaulaDimensional(TABLEANOT,
					['titol','desc','imatge'],
					['T�tol','Descripci�','Imatge']
			);
			db.creaTaulaDimensional(TABLEVALOR,
					['grup','alumne','data','criteri','valor','comentaris'],
					['Grup','Alumne','Data','Criteri de valoraci�','Valor','Comentaris']
			);

		}
	}
	

	this.generaQuadreAnotacions = function() {
		var node = this.returnBasicNode();

		node.innerHTML = '';

		if (type==1) {
//			table_valor.botoInicialitza(node,this.inicialitzaTaula);
			table_anot.fillBasicTable(node,'resumDades');
		} else {
//			table_valor.botoInicialitza(node,this.inicialitzaTaula);
			table_valor.fillBasicTable(node,'resumDades');
		}
	}
}

GestorAnotacions.prototype = new EsquirolWidget;


// Funcions per crear una font de sistema de fitxers. Local file system

function EsquirolSourceFilesystem(id, parentNode) {
	var titol = id;
	var that = this;
	this.basicwidget = new EsquirolWidget();
	this.basicwidget.createInitWidget(parentNode);
	
	this.name = '';
	this.doc;
	var node;
	this.directoryEntry;

	this.returnText = function() {
		return titol;
	}

	this.start = function(win, name_) {
		this.name = name_;
		win.requestFileSystem(LocalFileSystem.PERSISTENT, 0, this.gotFS, this.fail);
	}
	
	this.listFiles = function() {
		dirEntry.createReader();
	}
	
	this.gotFS = function(fileSystem) {
		fileSystem.root.getDirectory(that.name, null, that.gotDirectory, that.fail);
		
//		fileSystem.root.getFile(that.name, null, that.gotFileEntry, that.fail);
	}

	this.gotDirectory = function(dirEntry) {
		dirReader = dirEntry.createReader();
		that.directoryEntry = dirEntry;
		dirReader.readEntries(that.gotFileEntries,that.fail);
	}

	this.gotFileEntries = function(fileEntries) {
		var node = that.basicwidget.returnBasicNode();
		node.innerHTML = '';
		var table = document.createElement('table');
		table['id'] = 'filelist';
		node.appendChild(table);
		
		for (var i=0; i<fileEntries.length; i++) {
			item = fileEntries[i];
			if (item['isFile']) {
				var size;
				item.file( function(f) { size = f.size.toString(); });

				var tr = document.createElement('tr');
				table.appendChild(tr);

				var td = document.createElement('td');
				tr.appendChild(td);
				var nomfitxer = document.createTextNode(item['name']);
				td.appendChild(nomfitxer);
				td.href = item['name'];
				td.onclick=function(e) { that.showFile(e.currentTarget['href']); };

				td = document.createElement('td');
				tr.appendChild(td);
				td.appendChild( document.createTextNode(size));

				td = document.createElement('td');
				tr.appendChild(td);
				var modtime = ''; // item.lastModifiedDate.toLocaleDateString();
				td.appendChild( document.createTextNode(modtime));
			}
		}

	}
	
	this.showFile = function(file) {
		this.file = file;
		that.directoryEntry.getFile(file,{create: false, exclusive: false},that.gotFile,that.fail);
	}
	
	this.gotFileEntry = function(fileEntry) {
		fileEntry.file(that.gotFile, that.fail);
	}
	
	this.gotFile = function(f) {
		var node = that.basicwidget.returnBasicNode();
        that.doc = new VisorDocument(node);
        that.doc.reinicia();
		that.doc.llegeix(f);
	}
	
	this.loaded = function(evt) {
		
	}
	
	this.fail = function(evt) {
		alert('Fail reading file system');
		alert(evt.target.error.code);
	}
	
}

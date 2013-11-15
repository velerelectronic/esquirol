
// Funcions per crear una font de sistema de fitxers. Local file system

function EsquirolSourceFilesystem(id, parentNode) {
	var titol = id;
	var that = this;
	this.basicwidget = new EsquirolWidget();
	this.basicwidget.createInitWidget(parentNode);
	
	this.name = '';
	this.doc;
	var node;
	var fileSystem;
	var dirEntry;

	this.setDirectoryName = function (name) {
		this.name = name;
	}

	this.returnText = function() {
		return titol;
	}

	this.getFileSystem = function() {
		window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fs) {
			fileSystem = fs;
			that.getDirectoryEntry();
			}, this.fail);
	}

	this.getDirectoryEntry = function() {
		fileSystem.root.getDirectory(this.name, null, function(de) {
			dirEntry = de;
			that.getFileEntries();
			},this.fail);
	}
	
	this.getFileEntries = function() {
		var dirReader = dirEntry.createReader();
		dirReader.readEntries(gotFileEntries,that.fail);		
	}

	this.showContents = function() {
		this.setDirectoryName('/storage/emulated/legacy/documents/Esquirol');
		this.getFileSystem();
	}	

	function gotFileEntries (fileEntries) {
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
		dirEntry.getFile(
				file,
				{create: false, exclusive: false},
				// Got file
				function (f) {
					var node = that.basicwidget.returnBasicNode();
			        that.doc = new VisorDocument(node);
			        that.doc.reinicia();
					that.doc.llegeix(f);
				},
				that.fail);
	}
	
	this.loaded = function(evt) {
		
	}
	
	this.fail = function(evt) {
		alert('Fail reading file system');
		alert(evt.target.error.code);
	}
	
}

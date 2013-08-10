
// Funcions per crear una font de sistema de fitxers. Local file system

function EsquirolSourceFilesystem(id) {
	this.name = '';
	var that = this;
	var doc;
	var node;
	var directoryEntry;
	var titol = id;

	this.returnText = function() {
		return titol;
	}

	this.start = function(win, name_, node_, doc_) {
		this.name = name_;
		this.doc = doc_;
		this.node = node_;
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
		that.node.innerHTML = '';
		var ul = document.createElement('ul');
		ul['id'] = 'filelist';
		that.node.appendChild(ul);

		for (var i=0; i<fileEntries.length; i++) {
			item = fileEntries[i];
			if (item['isFile']) {
				var li = document.createElement('li');
				ul.appendChild(li);
				var nomfitxer = document.createTextNode(item['name']);
				li.appendChild(nomfitxer);
				li.href = item['name'];
				li.onclick=function(e) { that.showFile(e.currentTarget['href']); };
			}
		}

	}
	
	this.showFile = function(file) {
		that.directoryEntry.getFile(file,null,that.gotFile,that.fail);
	}
	
	this.gotFileEntry = function(fileEntry) {
		fileEntry.file(that.gotFile, that.fail);
	}
	
	this.gotFile = function(file) {
		that.readAsText(file,this.doc);
	}
	
	this.readDataUrl = function(file) {
		var reader = new FileReader();
		alert("Read as data URL");
		reader.onloadend = function(evt) {
			alert(evt.target.result);
		};
		reader.readAsDataURL(file);
	}
	
	this.readAsText = function(file,doc) {
		var reader = new FileReader();
		reader.onloadend = function(evt) {
			doc.carrega(evt.target.result);
		};
		reader.readAsText(file);
	}
	
	this.fail = function(evt) {
		alert('Fail reading file system');
		alert(evt.target.error.code);
	}
	
}

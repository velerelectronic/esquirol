// The basic common class for all the objects with a visual representation

function EsquirolObject() {
        
}

function EsquirolWidget(name) {
	EsquirolWidget.idGen++;
        this.basicnode;
        var that = this;
        var touch;
        var timer = null;
        this.titol = (typeof name === 'undefined') ? this.name : name;
        var actionStatus;
	var identity = EsquirolWidget.idGen;
	//alert(identity);

        // Support functions
        this.addHiddenInfo = function (node,label,value) {
                node.setAttribute('data-'+label,value);
        };
        
        this.getHiddenInfo  = function (node,label) {
                return node.getAttribute('data-'+label);
        };
        
        this.saveAsHTML = function () {
                var file = prompt('Nom de fitxer: ');
                if (file != null && file != '') {
                        alert(file);
                        this.saveFile(file);
                }
        }
        
        // File system tools

        this.saveFile = function(filename) {

            function fail(error) {
                console.log(error.code);
            }

                function gotFS(fileSystem) {
                function gotFileEntry(fileEntry) {
                    function gotFileWriter(writer) {
                        writer.onwriteend = function(evt) {
                        };
                            writer.seek(writer.length);
                                var node = that.returnBasicNode();
                        writer.write(node.innerHTML);
                    }
                    
                    fileEntry.createWriter(gotFileWriter, fail);
                }

                fileSystem.root.getFile(that.fullfilename, {create: true, exclusive: false}, gotFileEntry, fail);
            }

            this.fullfilename = '/storage/emulated/0/documents/Esquirol/' + filename;
        window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    }
        
        this.creaBotoOpcions = function(lloc,text,func) {
                var btn = document.createElement('button');
                btn['class'] = 'botoOpcions';
                btn.onclick = func;
                btn.appendChild( document.createTextNode(text));
                lloc.appendChild(btn);
        }
        
        this.creaInputText = function(lloc,text,func) {
                var input = document.createElement('input');
                input.onsubmit = func;
                input.type = "text";
                input.className = "search";
                lloc.appendChild(input);
        }
        
        this.autodestroy = function() {
                that.basicnode.parentNode.removeChild(that.basicnode);
        }

    function absorbEvent_(event) {
        var e = event || window.event;
        e.preventDefault && e.preventDefault();
        e.stopPropagation && e.stopPropagation();
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
      }

    function preventLongPressMenu(node) {
        node.ontouchstart = absorbEvent_;
        node.ontouchmove = absorbEvent_;
        node.ontouchend = absorbEvent_;
        node.ontouchcancel = absorbEvent_;
      }

        this.addLongPressListener = function(element,action_short_click,action_long_click) {
//                preventLongPressMenu(element);
                element.addEventListener('click',action_short_click);
                element.addEventListener('touchstart',function(e) {
//                                e.preventDefault();
                                timer = window.setTimeout( function() {
                                                action_long_click(element);
                                        },
                                        1000 );
                                
                                e.cancelBubble = true;
                                if (e && e.stopPropagation) {
                                        e.stopPropagation();
                                }
                                return false;
                        },false);
                element.addEventListener('touchend',function(e) {
//                                e.preventDefault();
                                window.clearTimeout( timer );

                                if (e && e.stopPropagation) {
                                        e.stopPropagation();
                                }
                                e.cancelBubble = true;
                                return false;
                        },false);
                element.addEventListener('touchmove',function(e) {
                        window.clearTimeout( timer );

                        if (e && e.stopPropagation) {
                                e.stopPropagation();
                        }
                        e.cancelBubble = true;
                        return false;                        
                },false);
        }

        this.enableSwipeGestures = function(element) {
	}
        
        this.addActionStatus = function(actionStatus) {
                
        }
        
        this.publishStatus = function (status) {
                
        }
}

EsquirolWidget.idGen = 0;

// Signals

EsquirolWidget.prototype.signalSwipeLeft = function() {};
EsquirolWidget.prototype.signalSwipeRight = function() {};
EsquirolWidget.prototype.signalSwipeTop = function() {};
EsquirolWidget.prototype.signalSwipeBottom = function() {};

// Graphical tools

EsquirolWidget.prototype.createInitWidget = function (parentWidget) {
	var that = this;
        this.basicnode = document.createElement('div');
        var parentW;
        if (typeof(parentWidget) === 'undefined') {
		parentW = document.createElement('div');
		parentW.className = 'fullscreen';
                var body = document.getElementsByTagName('body')[0];
		body.appendChild(parentW);
                parentW.onclick = function(e) {
			that.hideContainer();
			e.stopPropagation();
		};
		this.basicnode.className = 'fullwidget';
        } else {
                parentW = parentWidget;
		this.basicnode.className = 'widget';
        }

        parentW.appendChild(this.basicnode);
}

EsquirolWidget.prototype.returnBasicNode = function () {
        return this.basicnode;
}

EsquirolWidget.prototype.returnText = function() {
        return this.titol;
}

EsquirolWidget.prototype.returnState = function() {
        return '';
}

EsquirolWidget.prototype.showContents = function () {
        // Show the basic contents of the widget.
        // This must be implemented
        return null;
}

EsquirolWidget.prototype.hideContainer = function() {
	this.hideElement(this.basicnode.parentNode);
}

EsquirolWidget.prototype.showContainer = function() {
	this.showElement(this.basicnode.parentNode);
}

EsquirolWidget.prototype.isVisible = function() {
	return this.isElementVisible(this.basicnode.parentNode);
}

EsquirolWidget.prototype.hideBasicNode = function () {
	this.hideElement(this.basicnode);
}

EsquirolWidget.prototype.showBasicNode = function (display) {
	this.showElement(this.basicnode);
}

EsquirolWidget.prototype.isBasicNodeVisible = function () {
	return this.isElementVisible(this.basicnode);
}

EsquirolWidget.prototype.hideElement = function (element) {
	element.className += ' hide';
}

EsquirolWidget.prototype.showElement = function (element) {
	element.className = element.className.replace(/(^|\W)hide($|\W)/,' ').trim();
}

EsquirolWidget.prototype.isElementVisible = function (element) {
	if (element.className.search(/(^|\W)hide($|\W)/)==-1) {
		return true;
	} else {
		return false;
	}
}


EsquirolWidget.prototype.hideWithDelay = function (delay) {
/*
	var timeout;
        window.clearTimeout(timeout);
        timeout = window.setTimeout(function() { esborraStatus(); },5000);
*/
}



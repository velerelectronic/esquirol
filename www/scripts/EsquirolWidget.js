// The basic common class for all the objects with a visual representation

function EsquirolWidget(name) {
	this.basicnode;
	var that = this;
	var touch;
	var timer = null;
	this.titol = (typeof name === 'undefined') ? this.name : name;
	var actionStatus;

	// Support functions
	this.addHiddenInfo = function (node,label,value) {
		node.setAttribute('data-'+label,value);
	};
	
	this.getHiddenInfo  = function (node,label) {
		return node.getAttribute('data-'+label);
	};
	

	this.returnBasicNode = function () {
		return this.basicnode;
	}

	this.setFullScreen = function () {
		this.basicnode.className = 'fullscreen';
	}
	
	this.returnTitle = function() {
		return titol;
	}

	this.showContents = function () {
		// Show the basic contents of the widget.
		// This must be implemented
		return null;
	}
	
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
	
	this.hideContainer = function() {
//		this.basicnode.style.visibility = 'hidden';
		this.basicnode.parentNode.style.display = 'none';
	}
	
	this.showContainer = function() {
//		this.basicnode.style.visibility = 'visible';
    	this.basicnode.parentNode.style.display = 'block';		
	}
	
	this.isVisible = function() {
		if (this.basicnode.parentNode.style.display=='block') {
			return true;
		} else {
			return false;
		}
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
//		preventLongPressMenu(element);
		element.addEventListener('click',action_short_click);
		element.addEventListener('touchstart',function(e) {
//				e.preventDefault();
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
//				e.preventDefault();
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
	
	this.addActionSwipe = function(element,actionSwipeLeft,actionSwipeRight,actionSwipeTop,actionSwipeBottom) {
		var pos = null;
		element.addEventListener('touchstart',function(e) {
			var touches = e.changedTouches;
			if (touches.length==1) {
				pos = [];
				var onetouch = touches[0];
				pos[0] = onetouch.pageX;
				pos[1] = onetouch.pageY;
			}
		});
		element.addEventListener('touchmove',function(e) {
			var touches = e.changedTouches;
			if ((pos != null) && (touches.length==1)) {
				var onetouch = touches[0];
				var newpos = [];
				newpos[0] = onetouch.pageX;
				newpos[1] = onetouch.pageY;
				
				// Detect swipe horizontal left
				if (Math.abs(newpos[1]-pos[1])<10) {
					// Detect swipe left
					if (newpos[0]-pos[0]<-50) {
						actionSwipeLeft();
						pos = null;
					} else {
						// Detect swipe right
						if (newpos[0]-pos[0]>50) {
							actionSwipeRight();
							pos = null;
						}
					}
				} else {
					if (Math.abs(newpos[0]-pos[0])<10) {
						// Detect swipe top
						if (newpos[1]-pos[1]<-50) {
							actionSwipeTop();
							pos = null;
						} else {
							// Detect swipe bottom
							if (newpos[1]-pos[1]>50) {
								actionSwipeBottom();
								pos = null;
							}
						}
					}
				}
			}
		});
	}
	
	this.addActionStatus = function(actionStatus) {
		
	}
	
	this.publishStatus = function (status) {
		
	}
}

// Graphical tools

EsquirolWidget.prototype.createInitWidget = function (parentWidget) {
	this.basicnode = document.createElement('div');
	parentWidget.appendChild(this.basicnode);
	this.basicnode.onclick = function(e) { e.stopPropagation(); };
	touch = new EsquirolTouch();
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

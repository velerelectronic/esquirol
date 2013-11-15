// Author: Richard Garside - www.nogginbox.co.uk [2010]
/* Web: http://www.nogginbox.co.uk/blog/canvas-and-multi-touch
*/

function AnotadorManual(node,funcdesar) {
	var cb_canvas = null;
	var cb_ctx = null;
	var cb_lastPoints = null;
	var cb_easing = 0.4;
	var that = this;

	this.initCanvasHistory = function() {
		if (typeof(input)=='object'&&(input instanceof Array)) {
		} else {
			this.canvas_history = new Array();
		}
		this.saveCanvasHistory();
	}

	this.saveCanvasHistory = function() {
		src = this.cb_ctx.getImageData(0,0,this.cb_canvas.width,this.cb_canvas.height);
		this.canvas_history.push(src);
	}

	this.inicialitza = function(node,funcdesar) {
		var input = document.createElement('input');
		input.type = 'text';
		input.id = 'titol';
		node.appendChild(input);

		that.cb_canvas = document.createElement('canvas');
		that.cb_canvas.id = 'cbook';
		that.cb_canvas.width="500"
		that.cb_canvas.height="300"

		that.cb_canvas.appendChild( document.createTextNode('Canvas no disponible') );
		node.appendChild(that.cb_canvas);
		var form = document.createElement('form');
		node.appendChild(form);
		var input = document.createElement('input');
		input.type = 'button';
		input.value = 'Desa';
		input.onclick = function(e) { funcdesar(that.retornaImatge()); };
		form.appendChild(input);
		
		input = document.createElement('input');
		input.type = 'button';
		input.value = 'Undo';
		input.onclick = function(e) { that.undoCanvas(); };
		form.appendChild(input);

		input = document.createElement('input');
		input.type = 'button';
		input.value = 'Redo';
		input.onclick = function(e) { that.redoCanvas(); };
		form.appendChild(input);

		// Setup event handlers
		that.cb_lastPoints = Array();

		if (that.cb_canvas.getContext) {
			that.cb_ctx = that.cb_canvas.getContext('2d');
			that.cb_ctx.lineWidth = 5;
			that.cb_ctx.strokeStyle = "rgb(100, 255, 100)";
			that.cb_ctx.beginPath();

			that.cb_canvas.onmousedown = that.startDraw;
			that.cb_canvas.onmouseup = that.stopDraw;
			that.cb_canvas.ontouchstart = that.startDraw;
			that.cb_canvas.ontouchstop = that.stopDraw;
			that.cb_canvas.ontouchmove = that.drawMouse;
		}
		
		that.initCanvasHistory();
	}


	

	this.startDraw = function(e) {
		that.saveCanvasHistory();

		if (e.touches) {
			// Touch event
			for (var i = 1; i <= e.touches.length; i++) {
				that.cb_lastPoints[i] = getCoords(e.touches[i - 1]); // Get info for finger #1
			}
		}
		else {
			// Mouse event
			that.cb_lastPoints[0] = getCoords(e);
			that.cb_canvas.onmousemove = drawMouse;
		}
		
		return false;
	}

	// Called whenever cursor position changes after drawing has started
	this.stopDraw = function(e) {
		e.preventDefault();
		that.cb_canvas.onmousemove = null;
	}

	this.drawMouse = function(e) {
		if (e.touches) {
			// Touch Enabled
			for (var i = 1; i <= e.touches.length; i++) {
				var p = getCoords(e.touches[i - 1]); // Get info for finger i
				that.cb_lastPoints[i] = that.drawLine(that.cb_lastPoints[i].x, that.cb_lastPoints[i].y, p.x, p.y);
			}
		}
		else {
			// Not touch enabled
			var p = getCoords(e);
			that.cb_lastPoints[0] = that.drawLine(that.cb_lastPoints[0].x, that.cb_lastPoints[0].y, p.x, p.y);
		}
		//cb_ctx.strokeStyle = "Green";
		that.cb_ctx.stroke();
		that.cb_ctx.closePath();
		that.cb_ctx.beginPath();

		return false;
	}

	// Draw a line on the canvas from (s)tart to (e)nd
	this.drawLine = function(sX, sY, eX, eY) {
		this.cb_ctx.moveTo(sX, sY);
		this.cb_ctx.lineTo(eX, eY);
		return { x: eX, y: eY };
	}

	// Get the coordinates for a mouse or touch event
	this.getCoords = function(e) {
		if (e.offsetX) {
			return { x: e.offsetX, y: e.offsetY };
		}
		else if (e.layerX) {
			return { x: e.layerX, y: e.layerY };
		}
		else {
			return { x: e.pageX - this.cb_canvas.offsetLeft, y: e.pageY - this.cb_canvas.offsetTop };
		}
	}

	this.undoCanvas = function() {
		img = new Image();
		src = this.canvas_history.pop();
		if (src) {
			this.cb_ctx.putImageData(src,0,0);
		}
	}

	this.redoCanvas = function() {
		alert('Funcio no implementada encara');
	}

	this.retornaImatge = function() {
		// Trim image and return it
		
		return this.cb_canvas.toDataURL();
	}
	
	// Inicalitzacions
	this.inicialitza(node,funcdesar);
}







function insertImage(codi) {
	saveCanvasHistory();

	cb_canvas = document.getElementById("cbook");
	cb_ctx = cb_canvas.getContext('2d');

	var img=new Image()

	font = '';
	if (codi=='ma1a') {
		font = 'ma1a.png';
	} else if (codi=='ma2se') {
		font = 'ma2se.png';
	} else if (codi=='tmat1') {
		font = 'tmat1.png';
	} else if (codi=='bma1b') {
		font = 'bma1b.png';
	} else if (codi=='bma2b') {
		font = 'bma2b.png';
	}

	img.src = 'Data/Images/' + font;
	
	img.onload = function(){
		cb_ctx.drawImage(img,0,0,cb_canvas.width,cb_canvas.height);
	}
}

function changeColor(color) {
	cb_ctx.strokeStyle = color;
}


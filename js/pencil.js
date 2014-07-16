(function(global) {
  function Pencil(paper) {
    var paperName = paper || 'canvas';

    var el = document.getElementById(paperName);

    var paper = el.getContext('2d');

    this.el = el;

    this.paper = paper;

    this.started = false;

    this.trace = [];

    this.init();

  }

  Pencil.prototype.init = function() {
    var self = this;

    var touchEvt = ['touchstart', 'touchmove', 'touchend'];
    var mouseEvt = ['mousedown', 'mousemove', 'mouseup'];
    var evt;

    if('ontouchstart' in window) {
      evt = touchEvt;
      self.isTouch = true;
    } else {
      evt = mouseEvt;
      self.isTouch = false;
    }

    this.el.addEventListener(evt[0], function(e) {
      self.start(e);
    }, false);

    this.el.addEventListener(evt[1], function(e) {
      e.preventDefault();
      self.draw(e);
    }, false);

    this.el.addEventListener(evt[2], function(e) {
      self.stop(e);
    }, false);
  }

  Pencil.prototype.start = function(target) {
    this.started = true;
    this.paper.beginPath();
    var offsetX = this.isTouch ? target.touches[0].pageX : target.offsetX;
    var offsetY = this.isTouch ? target.touches[0].pageY : target.offsetY;
    this.paper.moveTo(offsetX, offsetY);
  }

  Pencil.prototype.stop = function(target) {
    this.started = false;
    this.trace.push('stop');
    this.paper.closePath();
  }

  Pencil.prototype.draw = function(target) {
    var self = this;
    if(this.started) {
      var offsetX = this.isTouch ? target.touches[0].pageX : target.offsetX;
      var offsetY = this.isTouch ? target.touches[0].pageY : target.offsetY;
      this.trace.push({
        x: offsetX,
        y: offsetY
      });
      this.paper.lineTo(offsetX, offsetY);
      this.paper.stroke();
    }
  }

  Pencil.prototype.clear = function() {
    this.paper.clearRect(0, 0, this.paper.canvas.width, this.paper.canvas.height);
  }

  Pencil.prototype._draw = function() {
    var self = this;
    var traceId = 0;
    var length = self.trace.length;
    this.paper.beginPath();
    var autoDraw = function() {
      var t = self.trace[traceId];
      if(t === 'stop') {
        self.paper.closePath();
        cancelAnimationFrame(autoDraw);
        self.trace = self.trace.splice(traceId + 1);
        self._draw();
        return;
      }
      if(traceId >= length) {
        cancelAnimationFrame(autoDraw);
        return;
      }
      self.paper.lineTo(t.x, t.y);
      self.paper.stroke();
      traceId++;
      requestAnimationFrame(autoDraw);
    }
    requestAnimationFrame(autoDraw);
  }

  Pencil.prototype.play = function() {
    this.clear();
    this._draw();
  }

  Pencil.DEFAULTS = {
    paper: 'canvas'
  }

  global.Pencil = Pencil;
})(window);


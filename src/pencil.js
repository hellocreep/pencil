(function(global) {
  function Pencil(paper, opts) {

    var defaults = Pencil.DEFAULTS;

    for(var o in opts) {
      defaults[o] = opts[o];
    }

    this.opts = defaults;

    var el = document.getElementById(paper);

    this.paper = el.getContext('2d');

    this.el = el;

    this.started = false;

    this.trace = [];

    this.brush = {};

    this.init();

  }

  Pencil.prototype.init = function() {
    var self = this;

    this.set('original');

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
    this.trace.push(this.brush);
    this.trace.push('stop');
    this.paper.closePath();
  }

  Pencil.prototype.draw = function(target) {
    var self = this;

    if(this.started) {
      var offsetX, offsetY;
      if(this.isTouch) {
        offsetX = target.touches[0].pageX - this.el.getBoundingClientRect().left;
        offsetY = target.touches[0].pageY - this.el.getBoundingClientRect().top;
      } else {
        offsetX = target.offsetX;
        offsetY = target.offsetY;
      }
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
    var trace = self.trace
    var length = trace.length;

    var brush = trace[trace.indexOf('stop') - 1];
    for(var b in brush) {
      this.paper[b] = brush[b];
    }

    this.paper.beginPath();
    var autoDraw = function() {
      var t = trace[traceId];
      if(t === 'stop') {
        self.paper.closePath();
        cancelAnimationFrame(autoDraw);
        self.trace = trace.splice(traceId + 1);
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
    this.backUpTrace = this.trace;
    this._draw();
  }

  Pencil.prototype.add = function(pencil) {
    for(var p in pencil) {
      if(this.opts.brush.hasOwnProperty(p)) {
        console.log(p + ' has allready exit, use another name.');
        return;
      }
      this.opts.brush[p] = pencil[p];
    }
  }

  Pencil.prototype.set = function(name) {
    var brush = this.opts.brush[name];
    if(brush) {
      for(var b in brush) {
        this.paper[b] = brush[b];
      }
      this.brush = brush;
    }
  }

  Pencil.DEFAULTS = {
    brush: {
      original: {
        strokeStyle: '#333',
        lineCap: 'round',
        lineWidth: 2
      },
      thin: {
        strokeStyle: '#333',
        lineCap: 'round',
        lineWidth: 1
      },
      fat: {
        strokeStyle: '#333',
        lineCap: 'round',
        lineWidth: 10
      }
    }
  }

  global.Pencil = Pencil;
})(window);


(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["SliderTools"] = factory();
	else
		root["SliderTools"] = factory();
})(self, function() {
return /******/ (function() { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};
function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function EventEmitter() {
  this._events = {};
}

EventEmitter.prototype.on = function (eventName, listener) {
  if (!eventName || !listener) return;

  if (!util.isValidListener(listener)) {
    throw new TypeError('listener must be a function');
  }

  var events = this._events;
  var listeners = events[eventName] = events[eventName] || [];
  var listenerIsWrapped = _typeof(listener) === 'object'; // 不重复添加事件

  if (util.indexOf(listeners, listener) === -1) {
    listeners.push(listenerIsWrapped ? listener : {
      listener: listener,
      once: false
    });
  }

  return this;
};

EventEmitter.prototype.once = function (eventName, listener) {
  return this.on(eventName, {
    listener: listener,
    once: true
  });
};

EventEmitter.prototype.off = function (eventName, listener) {
  var listeners = this._events[eventName];
  if (!listeners) return;
  var index;

  for (var i = 0, len = listeners.length; i < len; i++) {
    if (listeners[i] && listeners[i].listener === listener) {
      index = i;
      break;
    }
  }

  if (typeof index !== 'undefined') {
    listeners.splice(index, 1, null);
  }

  return this;
};

EventEmitter.prototype.emit = function (eventName, args) {
  var listeners = this._events[eventName];
  if (!listeners) return;

  for (var i = 0; i < listeners.length; i++) {
    var listener = listeners[i];

    if (listener) {
      listener.listener.apply(this, args || []);

      if (listener.once) {
        this.off(eventName, listener.listener);
      }
    }
  }

  return this;
};

var util = {
  extend: function extend(target) {
    for (var i = 1, len = arguments.length; i < len; i++) {
      for (var prop in arguments[i]) {
        // eslint-disable-next-line no-prototype-builtins
        if (arguments[i].hasOwnProperty(prop)) {
          target[prop] = arguments[i][prop];
        }
      }
    }

    return target;
  },
  setClassName: function setClassName(selector, className) {
    selector.className = className;
  },
  addClass: function addClass(selector, className) {
    selector.classList.add(className);
  },
  setInlineStyle: function setInlineStyle(selector, attr, content) {
    var length = selector.length;

    for (var i = 0; i < length; i++) {
      selector[i].style[attr] = content;
    }
  },
  isValidListener: function isValidListener(listener) {
    if (typeof listener === 'function') {
      return true;
    } else if (listener && _typeof(listener) === 'object') {
      return util.isValidListener(listener.listener);
    } else {
      return false;
    }
  },
  addCSS: function addCSS(cssText) {
    var style = document.createElement('style'),
        //创建一个style元素
    head = document.head || document.getElementsByTagName('head')[0]; //获取head元素

    style.type = 'text/css'; //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用

    if (style.styleSheet) {
      //IE
      var func = function func() {
        try {
          //防止IE中stylesheet数量超过限制而发生错误
          style.styleSheet.cssText = cssText;
        } catch (e) {//
        }
      }; //如果当前styleSheet还不能用，则放到异步中则行


      if (style.styleSheet.disabled) {
        setTimeout(func, 10);
      } else {
        func();
      }
    } else {
      //w3c浏览器中只要创建文本节点插入到style元素中就行了
      var textNode = document.createTextNode(cssText);
      style.appendChild(textNode);
    }

    head.appendChild(style); //把创建的style元素插入到head中
  },
  indexOf: function indexOf(array, item) {
    if (array.indexOf) {
      return array.indexOf(item);
    } else {
      var result = -1;

      for (var i = 0, len = array.length; i < len; i++) {
        if (array[i] === item) {
          result = i;
          break;
        }
      }

      return result;
    }
  }
};

function SliderTools(options) {
  this.options = util.extend({}, this.constructor.defaultOptions, options);
  this.init();
  this.bindEvents();
  this.diffX = 0;
  this.flag = false;
}

SliderTools.defaultOptions = {
  el: document.body
};
var proto = SliderTools.prototype = new EventEmitter();
proto.constructor = SliderTools;

proto.init = function () {
  this.createSlider();
  this.getElements();
};

proto.createSlider = function () {
  this.options.el.innerHTML = '<div id="slider"><div class="drag_bg"></div><div class="drag_text" onselectstart="return false;" unselectable="on">拖动滑块验证</div><div class="handler handler_bg"></div></div>';
  util.addCSS('ul, li {    list-style: none;    }    a {    text-decoration: none;    }    .wrap {    width: 300px;    height: 350px;    text-align: center;    margin: 150px auto;    }    .inner {    padding: 15px;    }    .clearfix {    overflow: hidden;    _zoom: 1;    }    .none {    display: none;    }    #slider {    position: relative;    background-color: #e8e8e8;    width: 300px;    height: 34px;    line-height: 34px;    text-align: center;    }    #slider .handler {    position: absolute;    top: 0px;    left: 0px;    width: 40px;    height: 32px;    border: 1px solid #ccc;    cursor: move; transition: all .2s ease}    .handler_bg {    background: #fff    url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTEyNTVEMURGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTEyNTVEMUNGMkVFMTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MTc5NzNmZS02OTQxLTQyOTYtYTIwNi02NDI2YTNkOWU5YmUiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+YiRG4AAAALFJREFUeNpi/P//PwMlgImBQkA9A+bOnfsIiBOxKcInh+yCaCDuByoswaIOpxwjciACFegBqZ1AvBSIS5OTk/8TkmNEjwWgQiUgtQuIjwAxUF3yX3xyGIEIFLwHpKyAWB+I1xGSwxULIGf9A7mQkBwTlhBXAFLHgPgqEAcTkmNCU6AL9d8WII4HOvk3ITkWJAXWUMlOoGQHmsE45ViQ2KuBuASoYC4Wf+OUYxz6mQkgwAAN9mIrUReCXgAAAABJRU5ErkJggg==")    no-repeat center;    }    .handler_ok_bg {    background: #fff    url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3hpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo0ZDhlNWY5My05NmI0LTRlNWQtOGFjYi03ZTY4OGYyMTU2ZTYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDlBRDI3NjVGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDlBRDI3NjRGMkQ2MTFFNEI5NDBCMjQ2M0ExMDQ1OUYiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphNWEzMWNhMC1hYmViLTQxNWEtYTEwZS04Y2U5NzRlN2Q4YTEiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NGQ4ZTVmOTMtOTZiNC00ZTVkLThhY2ItN2U2ODhmMjE1NmU2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+k+sHwwAAASZJREFUeNpi/P//PwMyKD8uZw+kUoDYEYgloMIvgHg/EM/ptHx0EFk9I8wAoEZ+IDUPiIMY8IN1QJwENOgj3ACo5gNAbMBAHLgAxA4gQ5igAnNJ0MwAVTsX7IKyY7L2UNuJAf+AmAmJ78AEDTBiwGYg5gbifCSxFCZoaBMCy4A4GOjnH0D6DpK4IxNSVIHAfSDOAeLraJrjgJp/AwPbHMhejiQnwYRmUzNQ4VQgDQqXK0ia/0I17wJiPmQNTNBEAgMlQIWiQA2vgWw7QppBekGxsAjIiEUSBNnsBDWEAY9mEFgMMgBk00E0iZtA7AHEctDQ58MRuA6wlLgGFMoMpIG1QFeGwAIxGZo8GUhIysmwQGSAZgwHaEZhICIzOaBkJkqyM0CAAQDGx279Jf50AAAAAABJRU5ErkJggg==")    no-repeat center;    }    #slider .drag_bg {    background-color: #7ac23c;    height: 34px;    width: 0px;transition:all .2s ease       }    #slider .drag_text {    position: absolute;    top: 0px;    width: 300px;    -moz-user-select: none;    -webkit-user-select: none;    user-select: none;    -o-user-select: none;    -ms-user-select: none;    }    .unselect {    -moz-user-select: none;    -webkit-user-select: none;    -ms-user-select: none;    }    .slide_ok {    color: #fff;    }');
};

proto.getElements = function () {
  this.slider = document.querySelector('#slider');
  this.drag_bg = document.querySelector('.drag_bg');
  this.handler = document.querySelector('.handler');
};

proto.bindEvents = function () {
  var self = this;

  self.handler.onmousedown = function (e) {
    self.diffX = e.clientX - self.handler.offsetLeft;
    util.setClassName(self.slider, 'unselect');
    util.setInlineStyle([self.handler, self.drag_bg], 'transition', 'none');

    document.onmousemove = function (e) {
      var deltaX = e.clientX - self.diffX;

      if (deltaX >= self.slider.offsetWidth - self.handler.offsetWidth) {
        deltaX = self.slider.offsetWidth - self.handler.offsetWidth;
        self.flag = true;
      } else if (deltaX <= 0) {
        deltaX = 0;
        self.flag = false;
      } else {
        self.flag = false;
      }

      util.setInlineStyle([self.handler], 'left', deltaX + 'px');
      util.setInlineStyle([self.drag_bg], 'width', deltaX + 'px');
    };

    document.onmouseup = function () {
      util.setInlineStyle([self.handler, self.drag_bg], 'transition', 'all .2s ease');
      util.setClassName(self.slider, '');

      if (self.flag) {
        util.setClassName(self.slider, 'slide_ok');
        util.addClass(self.handler, 'handler_ok_bg');
        self.handler.onmousedown = null;
        self.emit('complete');
      } else {
        util.setInlineStyle([self.handler], 'left', 0 + 'px');
        util.setInlineStyle([self.drag_bg], 'width', 0 + 'px');
      }

      document.onmousemove = null;
      document.onmouseup = null;
    };
  };
};

/* harmony default export */ __webpack_exports__["default"] = (SliderTools);
__webpack_exports__ = __webpack_exports__.default;
/******/ 	return __webpack_exports__;
/******/ })()
;
});
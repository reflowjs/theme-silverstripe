(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Reflow = (function () {
    function Reflow() {
        var _this = this;

        var options = arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Reflow);

        if (options.adapter) {
            this.adapter = options.adapter;
        }

        if (options.target) {
            this.target = options.target;
        }

        if (options.animations) {
            this.animations = options.animations;

            this.adapter.each(this.animations, function (index, animation) {
                animation.setReflow(_this);
            });
        }

        if (options.behaviors) {
            this.behaviors = new Reflow.Behaviors();
            this.behaviors.setReflow(this);

            this.adapter.each(options.behaviors, function (type, behavior) {
                behavior.setReflow(_this);
                _this.behaviors.add(type, behavior);
            });
        }

        if (options.pages) {
            this.pages = options.pages;

            this.adapter.each(this.pages, function (index, page) {
                page.setReflow(_this);
            });

            this.updatePage();
        }

        this.hash = document.location.hash.replace("#", "");

        setInterval(function () {
            if (_this.hash != document.location.hash.replace("#", "")) {
                _this.hash = document.location.hash.replace("#", "");
                _this.updatePage();
            }
        }, 100);

        Reflow.instances[options.name || "default"] = this;
    }

    _createClass(Reflow, [{
        key: "previous",
        value: function previous() {
            var pages = this.getPages();
            var index = this.getCurrentPage().getIndex();

            if (index > 0 && !this.isLoading) {
                this.showPage(pages[index - 1]);
            }

            return this;
        }
    }, {
        key: "next",
        value: function next() {
            var pages = this.getPages();
            var index = this.getCurrentPage().getIndex();

            if (index + 1 < pages.length && !this.isLoading) {
                this.showPage(pages[index + 1]);
            }

            return this;
        }
    }, {
        key: "updatePage",
        value: function updatePage() {
            var _this2 = this;

            var pages = this.getPages();

            if (!this.adapter) {
                throw new Error("Reflow.adapter is not defined");
            }

            if (document.location.hash.replace("#", "")) {
                this.adapter.each(this.pages, function (index, page) {
                    if (page.getHash() == document.location.hash.replace("#", "")) {
                        _this2.showPage(page);
                    }
                });
            } else {
                this.showPage(pages[0]);
            }

            return this;
        }
    }, {
        key: "updateBehaviors",
        value: function updateBehaviors() {
            this.getBehaviors().update();

            return this;
        }
    }, {
        key: "preloadPage",
        value: function preloadPage(page, success, failure) {
            if (page.isPreloaded) {
                success && success(page);
            } else {
                page.preload(success, failure);
            }

            return this;
        }
    }, {
        key: "showPage",
        value: function showPage(page, success, failure) {
            var _this3 = this;

            this.currentPage = page;
            this.isLoading = true;

            if (!this.adapter) {
                throw new Error("Reflow.adapter is not defined");
            }

            return this.preloadPage(page, function () {
                _this3.adapter.each(_this3.pages, function (index, other) {
                    if (other.isVisible) {
                        _this3.previousPage = other;
                        other.hide();
                    }
                });

                page.show(function () {
                    _this3.isLoading = false;
                    _this3.hash = page.getHash();
                    document.location.href = "#" + _this3.hash;
                    success && success();
                });
            }, function () {
                page.hide(function () {
                    _this3.isLoading = false;
                    failure && failure();
                });
            });
        }
    }, {
        key: "getBehaviors",
        value: function getBehaviors() {
            return this.behaviors;
        }
    }, {
        key: "getAdapter",
        value: function getAdapter() {
            if (this.adapter) {
                return this.adapter;
            }

            throw new Error("Reflow.adapter is not defined");
        }
    }, {
        key: "setAdapter",
        value: function setAdapter(adapter) {
            this.adapter = adapter;

            return this;
        }
    }, {
        key: "setTarget",
        value: function setTarget(target) {
            this.target = target;

            return this;
        }
    }, {
        key: "getTarget",
        value: function getTarget() {
            return this.target;
        }
    }, {
        key: "setAnimations",
        value: function setAnimations(animations) {
            this.animations = animations;

            return this;
        }
    }, {
        key: "getAnimations",
        value: function getAnimations() {
            return this.animations;
        }
    }, {
        key: "getPreviousPage",
        value: function getPreviousPage() {
            return this.previousPage;
        }
    }, {
        key: "getCurrentPage",
        value: function getCurrentPage() {
            return this.currentPage;
        }
    }, {
        key: "getCurrentPageContainer",
        value: function getCurrentPageContainer() {
            return this.getCurrentPage().getContainer();
        }
    }, {
        key: "getPages",
        value: function getPages() {
            return this.pages;
        }
    }, {
        key: "getPage",
        value: function getPage(hash) {
            var found = null;

            if (!this.adapter) {
                throw new Error("Reflow.adapter not defined");
            }

            this.adapter.each(this.pages, function (index, page) {
                if (page.getHash() == hash) {
                    found = page;
                }
            });

            return found;
        }
    }, {
        key: "getHash",
        value: function getHash() {
            return this.hash;
        }
    }, {
        key: "setHash",
        value: function setHash(hash) {
            this.hash = hash;

            return this;
        }
    }], [{
        key: "getInstance",
        value: function getInstance() {
            var name = arguments[0] === undefined ? "default" : arguments[0];

            var found = null;

            if (Reflow.instances[name]) {
                found = Reflow.instances[name];
            }

            return found;
        }
    }]);

    return Reflow;
})();

Reflow.instances = {};

if (typeof window != "undefined") {
    Reflow.Adapter = require("./Reflow/Adapter/Adapter");
    Reflow.Adapter.jQuery = require("./Reflow/Adapter/jQuery");
    Reflow.Animation = require("./Reflow/Animation/Animation");
    Reflow.Animation.Fade = require("./Reflow/Animation/Fade");
    Reflow.Animation.Horizontal = require("./Reflow/Animation/Horizontal");
    Reflow.Animation.None = require("./Reflow/Animation/None");
    Reflow.Animation.Vertical = require("./Reflow/Animation/Vertical");
    Reflow.Behavior = require("./Reflow/Behavior/Behavior");
    Reflow.Behavior.Animation = require("./Reflow/Behavior/Animation/Animation");
    Reflow.Behavior.Animation.FadeIn = require("./Reflow/Behavior/Animation/FadeIn");
    Reflow.Behavior.Animation.FadeOut = require("./Reflow/Behavior/Animation/FadeOut");
    Reflow.Behavior.Animation.SlideIn = require("./Reflow/Behavior/Animation/SlideIn");
    Reflow.Behavior.Animation.SlideOut = require("./Reflow/Behavior/Animation/SlideOut");
    Reflow.Behavior.Background = require("./Reflow/Behavior/Background");
    Reflow.Behavior.Center = require("./Reflow/Behavior/Center");
    Reflow.Behavior.Fit = require("./Reflow/Behavior/Fit");
    Reflow.Behavior.Highlight = require("./Reflow/Behavior/Highlight");
    Reflow.Behavior.Scale = require("./Reflow/Behavior/Scale");
    Reflow.Behavior.Swipe = require("./Reflow/Behavior/Swipe");
    Reflow.Behaviors = require("./Reflow/Behaviors");
    Reflow.Page = require("./Reflow/Page");

    window.Reflow = Reflow;
}

exports["default"] = Reflow;
module.exports = exports["default"];

},{"./Reflow/Adapter/Adapter":2,"./Reflow/Adapter/jQuery":3,"./Reflow/Animation/Animation":4,"./Reflow/Animation/Fade":5,"./Reflow/Animation/Horizontal":6,"./Reflow/Animation/None":7,"./Reflow/Animation/Vertical":8,"./Reflow/Behavior/Animation/Animation":9,"./Reflow/Behavior/Animation/FadeIn":10,"./Reflow/Behavior/Animation/FadeOut":11,"./Reflow/Behavior/Animation/SlideIn":12,"./Reflow/Behavior/Animation/SlideOut":13,"./Reflow/Behavior/Background":14,"./Reflow/Behavior/Behavior":15,"./Reflow/Behavior/Center":16,"./Reflow/Behavior/Fit":17,"./Reflow/Behavior/Highlight":18,"./Reflow/Behavior/Scale":19,"./Reflow/Behavior/Swipe":20,"./Reflow/Behaviors":21,"./Reflow/Page":22}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Adapter = function Adapter() {
    _classCallCheck(this, Adapter);
};

exports["default"] = Adapter;
module.exports = exports["default"];

// This stub allows construct() to be called in subclasses.

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Adapter2 = require("./Adapter");

var _Adapter3 = _interopRequireDefault(_Adapter2);

var jQuery = (function (_Adapter) {
    function jQuery() {
        _classCallCheck(this, jQuery);

        _get(Object.getPrototypeOf(jQuery.prototype), "constructor", this).call(this);

        if (!$.support.transition) {
            $.fn.transition = $.fn.animate;
        }
    }

    _inherits(jQuery, _Adapter);

    _createClass(jQuery, [{
        key: "find",
        value: function find(selector, elements) {
            if (elements) {
                return $(elements).find(selector);
            }

            return $(selector);
        }
    }, {
        key: "getWidth",
        value: function getWidth(elements) {
            return $(elements).width();
        }
    }, {
        key: "getHeight",
        value: function getHeight(elements) {
            return $(elements).height();
        }
    }, {
        key: "getLeft",
        value: function getLeft(elements) {
            return $(elements).left();
        }
    }, {
        key: "getTop",
        value: function getTop(elements) {
            return $(elements).top();
        }
    }, {
        key: "style",
        value: function style(elements, styles) {
            return $(elements).css(styles);
        }
    }, {
        key: "animate",
        value: function animate(elements, styles, duration, easing) {
            return $(elements).transition(styles, duration, easing);
        }
    }, {
        key: "data",
        value: function data(elements, key, value) {
            return $(elements).data(key, value);
        }
    }, {
        key: "bind",
        value: function bind(elements, type, callback) {
            return $(elements).bind(type, callback);
        }
    }, {
        key: "unbind",
        value: function unbind(elements, type) {
            return $(elements).unbind(type);
        }
    }, {
        key: "addClass",
        value: function addClass(elements, cls) {
            return $(elements).addClass(cls);
        }
    }, {
        key: "removeClass",
        value: function removeClass(elements, cls) {
            return $(elements).removeClass(cls);
        }
    }, {
        key: "trigger",
        value: function trigger(elements, type, parameters) {
            return $(elements).trigger(type, parameters);
        }
    }, {
        key: "preventEventDefault",
        value: function preventEventDefault(e) {
            return e.preventDefault();
        }
    }, {
        key: "stopEventPropagation",
        value: function stopEventPropagation(e) {
            return e.stopPropagation();
        }
    }, {
        key: "request",
        value: function request(options) {
            return $.ajax({
                "url": options.url,
                "dataType": "text",
                "cache": false,
                "success": options.success,
                "error": options.error
            });
        }
    }, {
        key: "createElement",
        value: function createElement(html) {
            return $(html);
        }
    }, {
        key: "appendElement",
        value: function appendElement(elements, element) {
            return $(elements).append(element);
        }
    }, {
        key: "attribute",
        value: function attribute(elements, key, value) {
            if (value) {
                return $(elements).attr(key, value);
            }

            return $(elements).attr(key);
        }
    }, {
        key: "unique",
        value: function unique(collection) {
            return $.unique(collection);
        }
    }, {
        key: "each",
        value: function each(collection, callback) {
            return $.each(collection, callback);
        }
    }, {
        key: "toArray",
        value: function toArray(elements) {
            return $(elements).toArray();
        }
    }, {
        key: "extend",
        value: function extend(destination, source) {
            return $.extend(true, destination, source);
        }
    }, {
        key: "getParent",
        value: function getParent(elements) {
            return $(elements).parent();
        }
    }]);

    return jQuery;
})(_Adapter3["default"]);

exports["default"] = jQuery;
module.exports = exports["default"];

},{"./Adapter":2}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Animation = (function () {
    function Animation() {
        var options = arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Animation);

        if (options.reflow) {
            this.reflow = options.reflow;
        }

        if (options.adapter) {
            this.adapter = options.adapter;
        }
    }

    _createClass(Animation, [{
        key: "setReflow",
        value: function setReflow(reflow) {
            this.reflow = reflow;

            return this;
        }
    }, {
        key: "getReflow",
        value: function getReflow() {
            if (this.reflow) {
                return this.reflow;
            }

            return Reflow.getInstance();
        }
    }, {
        key: "setAdapter",
        value: function setAdapter(adapter) {
            this.adapter = adapter;

            return this;
        }
    }, {
        key: "getAdapter",
        value: function getAdapter() {
            if (this.adapter) {
                return this.adapter;
            }

            return this.getReflow().getAdapter();
        }
    }]);

    return Animation;
})();

exports["default"] = Animation;
module.exports = exports["default"];

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Animation2 = require("./Animation");

var _Animation3 = _interopRequireDefault(_Animation2);

var Fade = (function (_Animation) {
    function Fade() {
        _classCallCheck(this, Fade);

        _get(Object.getPrototypeOf(Fade.prototype), "constructor", this).apply(this, arguments);
    }

    _inherits(Fade, _Animation);

    _createClass(Fade, [{
        key: "show",
        value: function show(callback) {
            var options = arguments[1] === undefined ? {} : arguments[1];

            var adapter = this.getAdapter();
            var currentPage = this.getReflow().getCurrentPage();

            adapter.style(currentPage.getContainer(), {
                "opacity": 0
            });

            adapter.animate(currentPage.getContainer(), {
                "opacity": 1,
                "complete": callback
            }, options.duration || 250, options.easing || "easeInOutCubic");

            return this;
        }
    }, {
        key: "hide",
        value: function hide(callback) {
            var options = arguments[1] === undefined ? {} : arguments[1];

            var adapter = this.getAdapter();
            var previousPage = this.getReflow().getPreviousPage();

            adapter.style(previousPage.getContainer(), {
                "opacity": 1
            });

            adapter.animate(previousPage.getContainer(), {
                "opacity": 0,
                "complete": callback
            }, options.duration || 250, options.easing || "easeInOutCubic");

            return this;
        }
    }]);

    return Fade;
})(_Animation3["default"]);

exports["default"] = Fade;
module.exports = exports["default"];

},{"./Animation":4}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Animation2 = require("./Animation");

var _Animation3 = _interopRequireDefault(_Animation2);

var Horizontal = (function (_Animation) {
    function Horizontal() {
        _classCallCheck(this, Horizontal);

        _get(Object.getPrototypeOf(Horizontal.prototype), "constructor", this).apply(this, arguments);
    }

    _inherits(Horizontal, _Animation);

    _createClass(Horizontal, [{
        key: "show",
        value: function show(callback) {
            var options = arguments[1] === undefined ? {} : arguments[1];

            var adapter = this.getAdapter();
            var previousPage = this.getReflow().getPreviousPage();
            var currentPage = this.getReflow().getCurrentPage();

            if (previousPage) {
                if (previousPage.getIndex() < currentPage.getIndex()) {
                    adapter.style(currentPage.getContainer(), {
                        "left": adapter.getWidth(currentPage.getContainer())
                    });

                    adapter.animate(currentPage.getContainer(), {
                        "left": 0,
                        "complete": callback
                    }, options.duration || 250, options.easing || "easeInOutCubic");
                } else {
                    adapter.style(currentPage.getContainer(), {
                        "left": -adapter.getWidth(currentPage.getContainer())
                    });

                    adapter.animate(currentPage.getContainer(), {
                        "left": 0,
                        "complete": callback
                    }, options.duration || 250, options.easing || "easeInOutCubic");
                }
            } else {
                adapter.style(currentPage.getContainer(), {
                    "left": 0,
                    "opacity": 0
                });

                adapter.animate(currentPage.getContainer(), {
                    "opacity": 1,
                    "complete": callback
                }, options.duration || 250, options.easing || "easeInOutCubic");
            }

            return this;
        }
    }, {
        key: "hide",
        value: function hide(callback) {
            var options = arguments[1] === undefined ? {} : arguments[1];

            var adapter = this.getAdapter();
            var previousPage = this.getReflow().getPreviousPage();
            var currentPage = this.getReflow().getCurrentPage();

            if (previousPage) {
                if (previousPage.getIndex() < currentPage.getIndex()) {
                    adapter.style(previousPage.getContainer(), {
                        "left": 0
                    });

                    adapter.animate(previousPage.getContainer(), {
                        "left": -adapter.getWidth(previousPage.getContainer()),
                        "complete": callback
                    }, options.duration || 250, options.easing || "easeInOutCubic");
                } else {
                    adapter.style(previousPage.getContainer(), {
                        "left": 0
                    });

                    adapter.animate(previousPage.getContainer(), {
                        "left": adapter.getWidth(previousPage.getContainer()),
                        "complete": callback
                    }, options.duration || 250, options.easing || "easeInOutCubic");
                }
            } else {
                adapter.style(previousPage.getContainer(), {
                    "left": 0,
                    "opacity": 1
                });

                adapter.animate(previousPage.getContainer(), {
                    "opacity": 0,
                    "complete": callback
                }, options.duration || 250, options.easing || "easeInOutCubic");
            }

            return this;
        }
    }]);

    return Horizontal;
})(_Animation3["default"]);

exports["default"] = Horizontal;
module.exports = exports["default"];

},{"./Animation":4}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Animation2 = require("./Animation");

var _Animation3 = _interopRequireDefault(_Animation2);

var None = (function (_Animation) {
    function None() {
        _classCallCheck(this, None);

        _get(Object.getPrototypeOf(None.prototype), "constructor", this).apply(this, arguments);
    }

    _inherits(None, _Animation);

    _createClass(None, [{
        key: "show",
        value: function show(callback) {
            var options = arguments[1] === undefined ? {} : arguments[1];

            var adapter = this.getAdapter();
            var previousPage = this.getReflow().getPreviousPage();
            var currentPage = this.getReflow().getCurrentPage();

            if (previousPage) {
                adapter.style(previousPage.getContainer(), {
                    "opacity": 0
                });
            }

            adapter.style(currentPage.getContainer(), {
                "opacity": 1
            });

            callback && callback();

            return this;
        }
    }, {
        key: "hide",
        value: function hide(callback) {
            var options = arguments[1] === undefined ? {} : arguments[1];

            var adapter = this.getAdapter();
            var previousPage = this.getReflow().getPreviousPage();

            adapter.style(previousPage.getContainer(), {
                "opacity": 0
            });

            callback && callback();

            return this;
        }
    }]);

    return None;
})(_Animation3["default"]);

exports["default"] = None;
module.exports = exports["default"];

},{"./Animation":4}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Animation2 = require("./Animation");

var _Animation3 = _interopRequireDefault(_Animation2);

var Vertical = (function (_Animation) {
    function Vertical() {
        _classCallCheck(this, Vertical);

        _get(Object.getPrototypeOf(Vertical.prototype), "constructor", this).apply(this, arguments);
    }

    _inherits(Vertical, _Animation);

    _createClass(Vertical, [{
        key: "show",
        value: function show(callback) {
            var options = arguments[1] === undefined ? {} : arguments[1];

            var adapter = this.getAdapter();
            var previousPage = this.getReflow().getPreviousPage();
            var currentPage = this.getReflow().getCurrentPage();

            if (previousPage) {
                if (previousPage.getIndex() < currentPage.getIndex()) {
                    adapter.style(currentPage.getContainer(), {
                        "top": adapter.getHeight(currentPage.getContainer())
                    });

                    adapter.animate(currentPage.getContainer(), {
                        "top": 0,
                        "complete": callback
                    }, options.duration || 250, options.easing || "easeInOutCubic");
                } else {
                    adapter.style(currentPage.getContainer(), {
                        "top": -adapter.getHeight(currentPage.getContainer())
                    });

                    adapter.animate(currentPage.getContainer(), {
                        "top": 0,
                        "complete": callback
                    }, options.duration || 250, options.easing || "easeInOutCubic");
                }
            } else {
                adapter.style(currentPage.getContainer(), {
                    "top": 0,
                    "opacity": 0
                });

                adapter.animate(currentPage.getContainer(), {
                    "opacity": 1,
                    "complete": callback
                }, options.duration || 250, options.easing || "easeInOutCubic");
            }

            return this;
        }
    }, {
        key: "hide",
        value: function hide(callback) {
            var options = arguments[1] === undefined ? {} : arguments[1];

            var adapter = this.getAdapter();
            var previousPage = this.getReflow().getPreviousPage();
            var currentPage = this.getReflow().getCurrentPage();

            if (previousPage) {
                if (previousPage.getIndex() < currentPage.getIndex()) {
                    adapter.style(previousPage.getContainer(), {
                        "top": 0
                    });

                    adapter.animate(previousPage.getContainer(), {
                        "top": -adapter.getHeight(previousPage.getContainer()),
                        "complete": callback
                    }, options.duration || 250, options.easing || "easeInOutCubic");
                } else {
                    adapter.style(previousPage.getContainer(), {
                        "top": 0
                    });

                    adapter.animate(previousPage.getContainer(), {
                        "top": adapter.getHeight(previousPage.getContainer()),
                        "complete": callback
                    }, options.duration || 250, options.easing || "easeInOutCubic");
                }
            } else {
                adapter.style(previousPage.getContainer(), {
                    "top": 0,
                    "opacity": 1
                });

                adapter.animate(previousPage.getContainer(), {
                    "opacity": 0,
                    "complete": callback
                }, options.duration || 250, options.easing || "easeInOutCubic");
            }

            return this;
        }
    }]);

    return Vertical;
})(_Animation3["default"]);

exports["default"] = Vertical;
module.exports = exports["default"];

},{"./Animation":4}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Behavior2 = require("../Behavior");

var _Behavior3 = _interopRequireDefault(_Behavior2);

var Animation = (function (_Behavior) {
  function Animation() {
    _classCallCheck(this, Animation);

    _get(Object.getPrototypeOf(Animation.prototype), "constructor", this).apply(this, arguments);
  }

  _inherits(Animation, _Behavior);

  return Animation;
})(_Behavior3["default"]);

exports["default"] = Animation;
module.exports = exports["default"];

},{"../Behavior":15}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Animation2 = require("./Animation");

var _Animation3 = _interopRequireDefault(_Animation2);

var FadeIn = (function (_Animation) {
    function FadeIn() {
        _classCallCheck(this, FadeIn);

        _get(Object.getPrototypeOf(FadeIn.prototype), "constructor", this).apply(this, arguments);
    }

    _inherits(FadeIn, _Animation);

    _createClass(FadeIn, [{
        key: "add",
        value: function add(element) {
            var parameters = arguments[1] === undefined ? {} : arguments[1];

            var adapter = this.getAdapter();

            adapter.bind(element, "reflow-behavior-animation-fade-in-reset", function () {
                adapter.style(element, {
                    "opacity": 0
                });
            });

            adapter.bind(element, "reflow-behavior-animation-fade-in-start", function () {
                adapter.trigger(element, "reflow-behavior-animation-fade-in-reset");

                adapter.animate(element, {
                    "opacity": 1
                }, options.duration || 250, options.easing || "easeInOutCubic");
            });

            return this;
        }
    }, {
        key: "remove",
        value: function remove(element) {
            var parameters = arguments[1] === undefined ? {} : arguments[1];

            var adapter = this.getAdapter();

            adapter.unbind(element, "reflow-behavior-animation-fade-in-reset");
            adapter.unbind(element, "reflow-behavior-animation-fade-in-start");

            return this;
        }
    }]);

    return FadeIn;
})(_Animation3["default"]);

exports["default"] = FadeIn;
module.exports = exports["default"];

},{"./Animation":9}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Animation2 = require("./Animation");

var _Animation3 = _interopRequireDefault(_Animation2);

var FadeOut = (function (_Animation) {
    function FadeOut() {
        _classCallCheck(this, FadeOut);

        _get(Object.getPrototypeOf(FadeOut.prototype), "constructor", this).apply(this, arguments);
    }

    _inherits(FadeOut, _Animation);

    _createClass(FadeOut, [{
        key: "add",
        value: function add(element) {
            var parameters = arguments[1] === undefined ? {} : arguments[1];

            var adapter = this.getAdapter();

            adapter.bind(element, "reflow-behavior-animation-fade-out-reset", function () {
                adapter.style(element, {
                    "opacity": 1
                });
            });

            adapter.bind(element, "reflow-behavior-animation-fade-out-start", function () {
                adapter.trigger(element, "reflow-behavior-animation-fade-out-reset");

                adapter.animate(element, {
                    "opacity": 0
                }, options.duration || 250, options.easing || "easeInOutCubic");
            });

            return this;
        }
    }, {
        key: "remove",
        value: function remove(element) {
            var parameters = arguments[1] === undefined ? {} : arguments[1];

            var adapter = this.getAdapter();

            adapter.unbind(element, "reflow-behavior-animation-fade-out-reset");
            adapter.unbind(element, "reflow-behavior-animation-fade-out-start");

            return this;
        }
    }]);

    return FadeOut;
})(_Animation3["default"]);

exports["default"] = FadeOut;
module.exports = exports["default"];

},{"./Animation":9}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Animation2 = require("./Animation");

var _Animation3 = _interopRequireDefault(_Animation2);

var SlideIn = (function (_Animation) {
    function SlideIn() {
        _classCallCheck(this, SlideIn);

        _get(Object.getPrototypeOf(SlideIn.prototype), "constructor", this).apply(this, arguments);
    }

    _inherits(SlideIn, _Animation);

    _createClass(SlideIn, [{
        key: "add",
        value: function add(element) {
            var parameters = arguments[1] === undefined ? {} : arguments[1];

            var adapter = this.getAdapter();
            var left = adapter.getLeft(element);
            var top = adapter.getTop(element);

            adapter.bind(element, "reflow-behavior-animation-slide-in-reset", function () {
                if (options.origin === "left") {
                    adapter.style(element, {
                        "left": -adapter.getWidth(element)
                    });
                }

                if (options.origin === "right") {
                    adapter.style(element, {
                        "left": adapter.getWidth(parameters.target)
                    });
                }

                if (options.origin === "top") {
                    adapter.style(element, {
                        "top": -adapter.getWidth(element)
                    });
                }

                if (options.origin === "bottom") {
                    adapter.style(element, {
                        "top": adapter.getWidth(parameters.target)
                    });
                }
            });

            adapter.bind(element, "reflow-behavior-animation-slide-in-start", function () {
                adapter.trigger(element, "reflow-behavior-animation-slide-in-reset");

                if (options.origin === "left" || options.origin === "right") {
                    adapter.animate(element, {
                        "left": left
                    }, options.duration || 250, options.easing || "easeInOutCubic");
                }

                if (options.origin === "top" || options.origin === "bottom") {
                    adapter.animate(element, {
                        "top": top
                    }, options.duration || 250, options.easing || "easeInOutCubic");
                }
            });

            return this;
        }
    }, {
        key: "remove",
        value: function remove(element) {
            var parameters = arguments[1] === undefined ? {} : arguments[1];

            var adapter = this.getAdapter();

            adapter.unbind(element, "reflow-behavior-animation-slide-in-reset");
            adapter.unbind(element, "reflow-behavior-animation-slide-in-start");

            return this;
        }
    }]);

    return SlideIn;
})(_Animation3["default"]);

exports["default"] = SlideIn;
module.exports = exports["default"];

},{"./Animation":9}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Animation2 = require("./Animation");

var _Animation3 = _interopRequireDefault(_Animation2);

var SlideOut = (function (_Animation) {
    function SlideOut() {
        _classCallCheck(this, SlideOut);

        _get(Object.getPrototypeOf(SlideOut.prototype), "constructor", this).apply(this, arguments);
    }

    _inherits(SlideOut, _Animation);

    _createClass(SlideOut, [{
        key: "add",
        value: function add(element) {
            var parameters = arguments[1] === undefined ? {} : arguments[1];

            var adapter = this.getAdapter();
            var left = adapter.getLeft(element);
            var top = adapter.getTop(element);

            adapter.bind(element, "reflow-behavior-animation-slide-out-reset", function () {
                if (options.origin === "left" || options.origin === "right") {
                    adapter.style(element, {
                        "left": left
                    });
                }

                if (options.origin === "top" || options.origin === "bottom") {
                    adapter.style(element, {
                        "top": top
                    });
                }
            });

            adapter.bind(element, "reflow-behavior-animation-slide-out-start", function () {
                adapter.trigger(element, "reflow-behavior-animation-slide-out-reset");

                if (options.origin === "left") {
                    adapter.animate(element, {
                        "left": -adapter.getWidth(element)
                    }, options.duration || 250, options.easing || "easeInOutCubic");
                }

                if (options.origin === "right") {
                    adapter.animate(element, {
                        "left": adapter.getWidth(parameters.target)
                    }, options.duration || 250, options.easing || "easeInOutCubic");
                }

                if (options.origin === "top") {
                    adapter.animate(element, {
                        "top": -adapter.getHeight(element)
                    }, options.duration || 250, options.easing || "easeInOutCubic");
                }

                if (options.origin === "bottom") {
                    adapter.animate(element, {
                        "top": adapter.getHeight(parameters.target)
                    }, options.duration || 250, options.easing || "easeInOutCubic");
                }
            });

            return this;
        }
    }, {
        key: "remove",
        value: function remove(element) {
            var parameters = arguments[1] === undefined ? {} : arguments[1];

            var adapter = this.getAdapter();

            adapter.unbind(element, "reflow-behavior-animation-slide-out-reset");
            adapter.unbind(element, "reflow-behavior-animation-slide-out-start");

            return this;
        }
    }]);

    return SlideOut;
})(_Animation3["default"]);

exports["default"] = SlideOut;
module.exports = exports["default"];

},{"./Animation":9}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Behavior2 = require("./Behavior");

var _Behavior3 = _interopRequireDefault(_Behavior2);

var Background = (function (_Behavior) {
    function Background() {
        _classCallCheck(this, Background);

        _get(Object.getPrototypeOf(Background.prototype), "constructor", this).apply(this, arguments);
    }

    _inherits(Background, _Behavior);

    _createClass(Background, [{
        key: "add",
        value: function add(element) {
            var parameters = arguments[1] === undefined ? {} : arguments[1];

            var adapter = this.getAdapter();
            var page = this.getReflow().getCurrentPage();

            adapter.style(page.getContainer(), {
                "background-image": "url(" + adapter.attribute(element, "src") + ")",
                "background-size": "cover",
                "background-repeat": "no-repeat",
                "background-position": "center center"
            });

            adapter.style(element, {
                "display": "none"
            });
        }
    }]);

    return Background;
})(_Behavior3["default"]);

exports["default"] = Background;
module.exports = exports["default"];

},{"./Behavior":15}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Behavior = (function () {
    function Behavior() {
        var options = arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Behavior);

        if (options.reflow) {
            this.reflow = options.reflow;
        }

        if (options.adapter) {
            this.adapter = options.adapter;
        }

        if (options.element) {
            this.element = options.element;
        }

        if (options.parameters) {
            this.parameters = options.parameters;
        }

        if (options.page) {
            this.page = options.page;
        }
    }

    _createClass(Behavior, [{
        key: "setReflow",
        value: function setReflow(reflow) {
            this.reflow = reflow;

            return this;
        }
    }, {
        key: "getReflow",
        value: function getReflow() {
            if (this.reflow) {
                return this.reflow;
            }

            return Reflow.getInstance();
        }
    }, {
        key: "setAdapter",
        value: function setAdapter(adapter) {
            this.adapter = adapter;

            return this;
        }
    }, {
        key: "getAdapter",
        value: function getAdapter() {
            if (this.adapter) {
                return this.adapter;
            }

            return this.getReflow().getAdapter();
        }
    }, {
        key: "getElement",
        value: function getElement() {
            return this.element;
        }
    }, {
        key: "setElement",
        value: function setElement(element) {
            this.element = element;

            return this;
        }
    }, {
        key: "getParameters",
        value: function getParameters() {
            return this.parameters;
        }
    }, {
        key: "setParameters",
        value: function setParameters(parameters) {
            this.parameters = parameters;

            return this;
        }
    }, {
        key: "getPage",
        value: function getPage() {
            return this.page;
        }
    }, {
        key: "setPage",
        value: function setPage(page) {
            this.page = page;

            return this;
        }
    }, {
        key: "add",
        value: function add() {
            var options = arguments[0] === undefined ? {} : arguments[0];

            throw new Error("Reflow.Behavior.add not defined");
        }
    }, {
        key: "remove",
        value: function remove() {
            var options = arguments[0] === undefined ? {} : arguments[0];

            throw new Error("Reflow.Behavior.remove not defined");
        }
    }]);

    return Behavior;
})();

exports["default"] = Behavior;
module.exports = exports["default"];

},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Behavior2 = require("./Behavior");

var _Behavior3 = _interopRequireDefault(_Behavior2);

var Center = (function (_Behavior) {
    function Center() {
        _classCallCheck(this, Center);

        _get(Object.getPrototypeOf(Center.prototype), "constructor", this).apply(this, arguments);
    }

    _inherits(Center, _Behavior);

    _createClass(Center, [{
        key: "add",
        value: function add(element) {
            var parameters = arguments[1] === undefined ? {} : arguments[1];

            var adapter = this.getAdapter();

            if (parameters.vertical) {
                (function () {
                    var height = adapter.getHeight(element);

                    adapter.style(element, {
                        "position": "absolute",
                        "top": "50%",
                        "margin-top": -(height / 2) + "px"
                    });

                    adapter.bind(element, "reflow-behavior-center", function () {
                        var newHeight = adapter.getHeight(element);

                        if (newHeight !== height) {
                            adapter.style(element, {
                                "margin-top": -(newHeight / 2) + "px"
                            });
                        }
                    });
                })();
            }

            if (parameters.horizontal) {
                (function () {
                    var width = adapter.getWidth(element);

                    adapter.style(element, {
                        "position": "absolute",
                        "left": "50%",
                        "margin-left": -(width / 2) + "px"
                    });

                    adapter.bind(element, "reflow-behavior-center", function () {
                        var newWidth = adapter.getWidth(element);

                        if (newWidth !== width) {
                            adapter.style(element, {
                                "margin-left": -(newWidth / 2) + "px"
                            });
                        }
                    });
                })();
            }
        }
    }]);

    return Center;
})(_Behavior3["default"]);

exports["default"] = Center;
module.exports = exports["default"];

},{"./Behavior":15}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Behavior2 = require("./Behavior");

var _Behavior3 = _interopRequireDefault(_Behavior2);

var Fit = (function (_Behavior) {
    function Fit() {
        _classCallCheck(this, Fit);

        _get(Object.getPrototypeOf(Fit.prototype), "constructor", this).apply(this, arguments);
    }

    _inherits(Fit, _Behavior);

    _createClass(Fit, [{
        key: "add",
        value: function add(element) {
            var parameters = arguments[1] === undefined ? {} : arguments[1];

            var adapter = this.getAdapter();
            var page = this.getReflow().getCurrentPage();
            var width = adapter.getWidth(page.getContainer());

            adapter.style(element, {
                "overflow": "scroll-x",
                "white-space": "nowrap"
            });

            var last;

            for (var i = 1; i < 20; i++) {
                adapter.style(element, {
                    "font-size": i * 10 + "px",
                    "line-height": i * 10 + "px"
                });

                last = i * 10;

                if (element.offsetWidth > width) {
                    break;
                }
            }

            for (var i = 1; i < 50; i++) {
                adapter.style(element, {
                    "font-size": last - i + "px",
                    "line-height": last - i + "px"
                });

                if (element.offsetWidth <= width) {
                    break;
                }
            }

            adapter.trigger(adapter.getParent(element), "reflow-behavior-center");
        }
    }]);

    return Fit;
})(_Behavior3["default"]);

exports["default"] = Fit;
module.exports = exports["default"];

},{"./Behavior":15}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { var object = _x2, property = _x3, receiver = _x4; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Behavior2 = require("./Behavior");

var _Behavior3 = _interopRequireDefault(_Behavior2);

var Highlight = (function (_Behavior) {
    function Highlight() {
        _classCallCheck(this, Highlight);

        _get(Object.getPrototypeOf(Highlight.prototype), "constructor", this).apply(this, arguments);
    }

    _inherits(Highlight, _Behavior);

    _createClass(Highlight, [{
        key: "add",
        value: function add(element) {
            var parameters = arguments[1] === undefined ? {} : arguments[1];

            var adapter = this.getAdapter();

            adapter.attribute(element, "class", parameters.language);

            hljs.highlightBlock(element);
        }
    }]);

    return Highlight;
})(_Behavior3["default"]);

exports["default"] = Highlight;
module.exports = exports["default"];

},{"./Behavior":15}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Behavior2 = require("./Behavior");

var _Behavior3 = _interopRequireDefault(_Behavior2);

var Scale = (function (_Behavior) {
    function Scale() {
        _classCallCheck(this, Scale);

        _get(Object.getPrototypeOf(Scale.prototype), "constructor", this).apply(this, arguments);
    }

    _inherits(Scale, _Behavior);

    _createClass(Scale, [{
        key: "add",
        value: function add(element) {
            var _this = this;

            var parameters = arguments[1] === undefined ? {} : arguments[1];

            var adapter = this.getAdapter();
            var container = adapter.find(window);

            var timeout = null;

            adapter.bind(container, "resize.reflow-behavior-scale", function () {
                clearTimeout(timeout);

                timeout = setTimeout(function () {
                    adapter.animate(parameters.target, {
                        "scale": [_this.scale(), _this.scale()]
                    });
                }, 300);
            });

            adapter.style(parameters.target, {
                "scale": [this.scale(), this.scale()]
            });
        }
    }, {
        key: "scale",
        value: function scale() {
            var adapter = this.getAdapter();
            var element = this.getElement();
            var parameters = this.getParameters();

            return Math.min(adapter.getWidth(element) / adapter.getWidth(parameters.target), adapter.getHeight(element) / adapter.getHeight(parameters.target));
        }
    }, {
        key: "remove",
        value: function remove(element) {
            var parameters = arguments[1] === undefined ? {} : arguments[1];

            var adapter = this.getAdapter();
            var container = adapter.find(window);

            adapter.unbind(container, ".reflow-behavior-scale");
        }
    }]);

    return Scale;
})(_Behavior3["default"]);

exports["default"] = Scale;
module.exports = exports["default"];

},{"./Behavior":15}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { var object = _x3, property = _x4, receiver = _x5; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

var _Behavior2 = require("./Behavior");

var _Behavior3 = _interopRequireDefault(_Behavior2);

var Swipe = (function (_Behavior) {
    function Swipe() {
        _classCallCheck(this, Swipe);

        _get(Object.getPrototypeOf(Swipe.prototype), "constructor", this).apply(this, arguments);
    }

    _inherits(Swipe, _Behavior);

    _createClass(Swipe, [{
        key: "add",
        value: function add(element) {
            var parameters = arguments[1] === undefined ? {} : arguments[1];

            var adapter = this.getAdapter();
            var distance = options.distance || 10;

            var x = 0;
            var y = 0;

            adapter.bind(element, "mousedown.reflow-behavior-swipe", function (e) {
                x = e.pageX;
                y = e.pageY;
                adapter.preventEventDefault(e);
            });

            adapter.bind(element, "mouseup.reflow-behavior-swipe", function (e) {
                if (Math.abs(e.pageX + x) > distance || Math.abs(e.pageY + y) > distance) {
                    adapter.stopEventPropagation(e);
                }
            });

            return this;
        }
    }, {
        key: "remove",
        value: function remove(element) {
            var parameters = arguments[1] === undefined ? {} : arguments[1];

            var adapter = this.getAdapter();

            adapter.unbind(element, ".reflow-behavior-swipe");

            return this;
        }
    }]);

    return Swipe;
})(_Behavior3["default"]);

exports["default"] = Swipe;
module.exports = exports["default"];

},{"./Behavior":15}],21:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Behaviors = (function () {
    function Behaviors() {
        var options = arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Behaviors);

        if (options.adapter) {
            this.adapter = options.adapter;
        }

        if (options.reflow) {
            this.reflow = options.reflow;
        }

        this.behaviors = {};

        if (options.behaviors) {
            this.behaviors = options.behaviors;
        }
    }

    _createClass(Behaviors, [{
        key: "walk",
        value: function walk(parts, value) {
            var stack = {};
            var part = parts.shift();

            if (parts.length) {
                stack[part] = this.walk(parts, value);
            } else {
                stack[part] = value;
            }

            return stack;
        }
    }, {
        key: "namespace",
        value: function namespace(element, type) {
            var _this = this;

            var adapter = this.getAdapter();
            var prefix = "data-" + type + "-";
            var parameters = {};

            adapter.each(element.attributes, function (index, attribute) {
                var name = attribute.name;

                if (name.indexOf(prefix) > -1) {
                    var parts = name.replace(prefix, "").split("-");

                    adapter.extend(parameters, _this.walk(parts, adapter.attribute(element, name)));
                }
            });

            return parameters;
        }
    }, {
        key: "getAdapter",
        value: function getAdapter() {
            if (this.adapter) {
                return this.adapter;
            }

            return this.getReflow().getAdapter();
        }
    }, {
        key: "setAdapter",
        value: function setAdapter(adapter) {
            this.adapter = adapter;

            return this;
        }
    }, {
        key: "getReflow",
        value: function getReflow() {
            if (this.reflow) {
                return this.reflow;
            }

            return Reflow.getInstance();
        }
    }, {
        key: "setReflow",
        value: function setReflow(reflow) {
            this.reflow = reflow;

            return this;
        }
    }, {
        key: "getBehaviors",
        value: function getBehaviors() {
            return this.behaviors;
        }
    }, {
        key: "add",
        value: function add(type, behavior) {
            var _this2 = this;

            var adapter = this.getAdapter();
            var elements = adapter.toArray(adapter.find("[data-behaviors~='" + type + "']"));

            adapter.each(elements, function (index, element) {
                _this2.forward(behavior, "add", element, _this2.namespace(element, type));
                elements.push(element);
            });

            this.behaviors[type] = {
                "instance": behavior,
                "elements": elements
            };

            return this;
        }
    }, {
        key: "forward",
        value: function forward(behavior, method, element, parameters) {
            var reflow = this.getReflow();
            var page = reflow.getCurrentPage();

            behavior.setElement(element);
            behavior.setParameters(parameters);
            behavior.setPage(page);

            behavior[method].apply(behavior, [element, parameters]);
        }
    }, {
        key: "remove",
        value: function remove(type) {
            var _this3 = this;

            var adapter = this.getAdapter();
            var behavior = this.behaviors[type];

            adapter.each(behavior.elements, function (index, element) {
                _this3.forward(behavior, "remove", element, _this3.namespace(element, type));
            });

            delete this.behaviors[type];

            return this;
        }
    }, {
        key: "update",
        value: function update() {
            var _this4 = this;

            var adapter = this.getAdapter();
            var behaviors = this.getBehaviors();

            adapter.each(behaviors, function (type, behavior) {
                var elements = adapter.toArray(adapter.find("[data-behaviors~='" + type + "']"));

                adapter.each(elements, function (index, element) {
                    if (behavior.elements.indexOf(element) === -1) {
                        _this4.forward(behavior.instance, "add", element, _this4.namespace(element, type));
                        behavior.elements.push(element);
                    }
                });

                adapter.each(behavior.elements, function (index, element) {
                    if (elements.indexOf(element) === -1) {
                        _this4.forward(behavior.instance, "remove", element, _this4.namespace(element, type));
                        behavior.elements.splice(behavior.elements.indexOf(element), 1);
                    }
                });
            });

            return this;
        }
    }]);

    return Behaviors;
})();

exports["default"] = Behaviors;
module.exports = exports["default"];

},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Page = (function () {
    function Page() {
        var options = arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Page);

        if (typeof options.index == "number") {
            this.index = options.index;
        }

        if (options.hash) {
            this.hash = options.hash;
        }

        if (options.resources) {
            this.resources = options.resources;
        }

        if (options.animations) {
            this.animations = options.animations;
        }

        if (options.reflow) {
            this.reflow = options.reflow;
        }

        if (options.target) {
            this.target = options.target;
        }

        this.isPreloaded = false;
        this.isVisible = false;
    }

    _createClass(Page, [{
        key: "getAdapter",
        value: function getAdapter() {
            return this.adapter;
        }
    }, {
        key: "setAdapter",
        value: function setAdapter(adapter) {
            this.adapter = adapter;

            return this;
        }
    }, {
        key: "getReflow",
        value: function getReflow() {
            return this.reflow;
        }
    }, {
        key: "setReflow",
        value: function setReflow(reflow) {
            this.reflow = reflow;

            return this;
        }
    }, {
        key: "getTarget",
        value: function getTarget() {
            return this.target;
        }
    }, {
        key: "setTarget",
        value: function setTarget(target) {
            this.target = target;

            return this;
        }
    }, {
        key: "getContainer",
        value: function getContainer() {
            return this.container;
        }
    }, {
        key: "getIndex",
        value: function getIndex() {
            return this.index;
        }
    }, {
        key: "getHash",
        value: function getHash() {
            return this.hash;
        }
    }, {
        key: "getResources",
        value: function getResources() {
            return this.resources;
        }
    }, {
        key: "getAnimations",
        value: function getAnimations() {
            return this.animations;
        }
    }, {
        key: "validate",
        value: function validate() {
            var reflow = null;
            var adapter = null;
            var index = null;
            var hash = null;
            var resources = null;
            var pageAnimations = null;
            var reflowAnimations = null;
            var container = null;
            var target = null;

            if (this.getReflow()) {
                reflow = this.getReflow();
            } else if (Reflow.getInstance()) {
                reflow = Reflow.getInstance();
            }

            if (this.getAdapter()) {
                adapter = this.getAdapter();
            } else if (reflow && reflow.getAdapter()) {
                adapter = reflow.getAdapter();
            }

            if (!adapter) {
                throw new Error("Reflow.Page.adapter not defined");
            }

            if (typeof this.getIndex() == "number") {
                index = this.getIndex();
            }

            if (this.getHash()) {
                hash = this.getHash();
            }

            if (this.getResources()) {
                resources = this.getResources();
            }

            if (this.getAnimations()) {
                pageAnimations = this.getAnimations();
            }

            if (reflow && reflow.getAnimations()) {
                reflowAnimations = reflow.getAnimations();
            }

            if (this.getTarget()) {
                target = this.getTarget();
            } else if (reflow && reflow.getTarget()) {
                target = reflow.getTarget();
            }

            return {
                "reflow": reflow,
                "adapter": adapter,
                "index": index,
                "hash": hash,
                "resources": resources,
                "pageAnimations": pageAnimations,
                "reflowAnimations": reflowAnimations,
                "target": target
            };
        }
    }, {
        key: "invoke",
        value: function invoke(value) {
            if (typeof value == "function") {
                return value();
            }

            return value;
        }
    }, {
        key: "preload",
        value: function preload(success, failure) {
            var _this = this;

            var data = this.validate();
            var head = data.adapter.find("head");
            var failed = false;
            var completed = 0;

            if (!data.target) {
                throw new Error("Reflow.Page.target not defined");
            }

            if (!data.resources) {
                throw new Error("Reflow.Page.resources not defined");
            }

            if (!data.resources.html) {
                throw new Error("Reflow.Page.resources.html not defined");
            }

            if (!data.resources.css) {
                throw new Error("Reflow.Page.resources.css not defined");
            }

            if (!data.resources.js) {
                throw new Error("Reflow.Page.resources.js not defined");
            }

            data.adapter.request({
                "url": data.resources.html,
                "failure": function failure() {
                    failed = true;
                    completed += 1;
                },
                "success": function success(response) {
                    completed += 1;
                    _this.container = data.adapter.createElement("<div class='page " + data.hash + "'>" + response + "</div>");
                    data.adapter.appendElement(data.target, _this.container);
                    data.reflow.updateBehaviors();
                }
            });

            data.adapter.request({
                "url": data.resources.css,
                "failure": function failure() {
                    failed = true;
                    completed += 1;
                },
                "success": function success(response) {
                    completed += 1;

                    var element = data.adapter.createElement("<style>" + response + "</style>");

                    data.adapter.appendElement(head, element);
                }
            });

            data.adapter.request({
                "url": data.resources.js,
                "failure": function failure() {
                    failed = true;
                    completed += 1;
                },
                "success": function success(response) {
                    completed += 1;

                    var element = data.adapter.createElement("<script>" + response + "</script>");

                    data.adapter.appendElement(head, element);
                }
            });

            var check = function check() {
                setTimeout(function () {
                    if (completed === 3) {
                        if (failed) {
                            _this.isPreloaded = false;

                            failure && failure(_this);
                        } else {
                            _this.isPreloaded = true;

                            data.adapter.trigger(_this.container, "reflow-page-load");

                            success && success(_this);
                        }
                    } else {
                        check();
                    }
                }, 10);
            };

            check();

            return this;
        }
    }, {
        key: "show",
        value: function show(callback) {
            var _this2 = this;

            var data = this.validate();

            if (!data.pageAnimations) {
                throw new Error("Reflow.Page.animations not defined");
            }

            if (!data.pageAnimations.show) {
                throw new Error("Reflow.Page.animations.show not defined");
            }

            if (!data.reflowAnimations) {
                throw new Error("Reflow.animations not defined");
            }

            if (!data.reflowAnimations[this.invoke(data.pageAnimations.show)]) {
                throw new Error("Reflow.animations. " + this.invoke(data.pageAnimations.show) + " not defined");
            }

            data.adapter.trigger(this.container, "reflow-page-before-show");

            data.reflowAnimations[data.pageAnimations.show].show(function () {
                _this2.isVisible = true;

                data.adapter.trigger(_this2.container, "reflow-page-after-show");

                callback && callback();
            });

            return this;
        }
    }, {
        key: "hide",
        value: function hide(callback) {
            var _this3 = this;

            var data = this.validate();

            if (!data.pageAnimations) {
                throw new Error("Reflow.Page.animations not defined");
            }

            if (!data.pageAnimations.hide) {
                throw new Error("Reflow.Page.animations.hide not defined");
            }

            if (!data.reflowAnimations) {
                throw new Error("Reflow.animations not defined");
            }

            if (!data.reflowAnimations[this.invoke(data.pageAnimations.hide)]) {
                throw new Error("Reflow.animations. " + this.invoke(data.pageAnimations.hide) + " not defined");
            }

            data.adapter.trigger(this.container, "reflow-page-before-hide");

            data.reflowAnimations[data.pageAnimations.hide].hide(function () {
                _this3.isVisible = false;

                data.adapter.trigger(_this3.container, "reflow-page-after-hide");

                callback && callback();
            });

            return this;
        }
    }]);

    return Page;
})();

exports["default"] = Page;
module.exports = exports["default"];

},{}]},{},[1]);

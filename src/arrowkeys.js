/*
 * arrowkeys.js
 * Copyright (C) 2015 Fechin <lihuoqingfly@163.com>
 *
 * Distributed under terms of the MIT license.
 */
(function (factory) {
    'use strict';

    var AMD = typeof define === 'function' && define.amd,
        CommonJS = typeof module !== 'undefined' && module.exports;

    if (AMD) {
        // Register as an anonymous AMD module
        define(['jquery'], factory);
    } else if (CommonJS) {
        // Register as an Node.js module
        module.exports = factory(require("jquery"));
    } else {
        // Browser globals
        factory(window.jQuery);
    }
}(function ($) {
    var Arrow = function (cards, settings) {
        this.opts = settings;
        this.cards = cards;
        this.cardMap = {};

        // Classification by class name
        for (var i = 0, leni = cards.length; i < leni; i++) {
            var classes = cards.eq(i).attr("class").split(" ");
            for (var j = 0, lenj = classes.length; j < lenj; j++) {
                if (classes[j].indexOf(this.opts.focusableClass) > -1) {
                    if (this.cardMap.hasOwnProperty(classes[j])) {
                        continue;
                    }
                    this.cardMap[classes[j]] = cards.filter("." + classes[j]);
                }
            }
        }
    };

    Arrow.prototype = {
        movement: function (direction) {
            var pos = this.position(),
                actv = this.opts.focusedClass,
                line = [], index = 0;
            // Remove focused class
            $(pos.rows[pos.x]).blur().removeClass(actv);
            if (direction === "LEFT") {
                if (pos.x === 0) {
                    pos.x = pos.rows.length;
                }
                index = --pos.x;
                line = pos.rows;
            } else if (direction === "RIGHT") {
                if (pos.x === pos.rows.length - 1) {
                    pos.x = -1;
                }
                index = ++pos.x;
                line = pos.rows;
            } else if (direction === "UP") {
                if (pos.y === 0) {
                    pos.y = pos.cols.length;
                }
                index = --pos.y;
                line = pos.cols;
            } else if (direction === "DOWN") {
                if (pos.y === pos.cols.length - 1) {
                    pos.y = -1;
                }
                index = ++pos.y;
                line = pos.cols;
            }
            // Add focused class to next card
            $(line[index]).focus().addClass(actv);
            // Storage point
            var point = {x: ++pos.x, y: ++pos.y};
            this.storage(point);
            return point;

        },
        storage: function (point) {
            if (window.sessionStorage) {
                sessionStorage.setItem(this.opts.focusableClass + "-point-x", point.x);
                sessionStorage.setItem(this.opts.focusableClass + "-point-y", point.y);
            } else {
                console.log('Broswer does not support sessionStorage');
            }
        },
        position: function () {
            var rows = [], cols = [],
                x = 0, y = 0,
                actv = this.opts.focusedClass,
                able = this.opts.focusableClass;

            var classes = this.cards.filter("." + actv)
                .attr("class").split(" ");
            // rows and y
            for (var i = 0, len = classes.length; i < len; i++) {
                if (classes[i].indexOf(able) > -1) {
                    rows = this.cards.filter("." + classes[i]);
                    y = parseInt(classes[i].replace(able + "-row", ""), 10);
                    y--;
                    break;
                }
            }
            // x
            for (x = 0, len = rows.length; x < len; x++) {
                if ($(rows[x]).hasClass(actv)) {
                    break;
                }
            }
            // cols
            for (var key in this.cardMap) {
                var temp = this.cardMap[key][x];
                if (typeof temp == "undefined") {
                    temp = this.cardMap[key].last();
                }
                cols.push(temp);
            }
            var result = {rows: rows, cols: cols, x: x, y: y};
            return result;
        }
    };

    var EventManager = function (target, settings) {
        this.opts = $.extend({
            customKeyEvent: {},
            focusedPoint: null,
            focusableClass: "focusable",
            focusedClass: "focused"
        }, settings);

        this.keys = {LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40};
        this.cards = $("[class*=" + this.opts.focusableClass + "-row]");
        this.arrow = new Arrow(this.cards, this.opts);
        this.target = target;
        this.__constructor__();
    };

    EventManager.prototype = {
        __constructor__: function () {
            // destroy arrowkeys
            this.destroy();
            // Activated elements on load 
            var point = this.opts.focusedPoint || {};
            if (window.sessionStorage) {
                if (!point.hasOwnProperty("x")) {
                    point.x = sessionStorage.getItem(this.opts.focusableClass + "-point-x") || 1;
                    point.y = sessionStorage.getItem(this.opts.focusableClass + "-point-y") || 1;
                }
            }
            this.activeElement(point);
            // Assigned to tabindex default is 1
            var tabindex = this.opts.tabindex || 1;
            $(this.target).attr("tabindex", tabindex);
        },
        activeElement: function (point) {
            var actv = this.opts.focusedClass;
            // Remove all selected elements
            $("." + actv).blur().removeClass(actv);
            // selected elements
            var row = this.cards.filter("." + this.opts.focusableClass + "-row" + point.y);
            if (point.x > row.length || point.x < 1) {
                point.x = 1;
            }
            $(row).eq(--point.x).focus().addClass(actv);
        },
        // Handle event maps.
        // Bind all custom events to key
        addCustomKeyEvent: function (evt) {
            evt = evt || window.event;
            var KeyEvent = this.opts.customKeyEvent;
            for (var key in KeyEvent) {
                if (key == (evt.keyCode || evt.which) && $.isFunction(KeyEvent[key])) {
                    // Trigger custom event
                    KeyEvent[key].call(this, evt);
                    evt.preventDefault();
                }
            }
        },
        addCommonKeyEvent: function (evt) {
            var keys = this.keys,
                actv = this.opts.focusedClass,
                focused = $('.' + actv);
            evt = evt || window.event;
            var keyCode = evt.which || evt.keyCode;

            // enter event
            if (keyCode === 13 && $.isFunction(this.opts.enterFunc)) {
                this.opts.enterFunc.call(this, focused, evt);
                evt.preventDefault();
                // backspace event
            } else if (keyCode === 8 && $.isFunction(this.opts.backFunc)) {
                this.opts.backFunc.call(this, focused, evt);
                evt.preventDefault();
                // arrow keys event
            } else {
                for (var key in keys) {
                    if (keyCode === keys[key]) {
                        var point = this.arrow.movement(key);
                        // Trigger callback function.
                        if ($.isFunction(this.opts.callback)) {
                            this.opts.callback.call(this, point, evt);
                        }
                        evt.preventDefault();
                        return;
                    }
                }
            }
        },
        destroy: function () {
            // unbind keydown listener
            $(this.target).unbind("keydown");
            // clear focused class
            $(this.target).find("." + this.opts.focusableClass).blur()
                .removeClass(this.opts.focusedClass);
        }
    };

    jQuery.fn.arrowkeys = function (settings) {
        var target = this || document,
            boss = new EventManager(target, settings);

        // bind event
        $(target).keydown(function (evt) {
            boss.addCommonKeyEvent(evt);
            boss.addCustomKeyEvent(evt);
        });

        return $(target);
    };

}));

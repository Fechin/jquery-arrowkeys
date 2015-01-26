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
    var Arrow = function (settings) {
        this.opts = settings;
    };

    Arrow.prototype = {

        up: function (evt) {
            var focused = $("." + this.opts.focusedClass);
            if ($.isFunction(this.opts.upFunc)) {
                this.opts.upFunc.call(this, focused, evt);
            } else {
                // default up arrow event
                // $(_dot_actv).find("span").text(parseInt($(_dot_actv).text()) + 1);
            }
        },

        down: function (evt) {
            var focused = $("." + this.opts.focusedClass);
            if ($.isFunction(this.opts.downFunc)) {
                this.opts.downFunc.call(this, focused, evt);
            } else {
                // default down arrow event
                // $(_dot_actv).find("span").text(parseInt($(_dot_actv).text()) - 1);
            }
        },

        left: function (evt) {
            var elements = $("." + this.opts.focusableClass);
            actv = this.opts.focusedClass;
            for (var i = 1; i < elements.length; i++) {
                if (elements.eq(i).hasClass(actv)) {
                    elements.eq(i).removeClass(actv);
                    elements.eq(i - 1).focus().addClass(actv);
                    break;
                }
            }
        },

        right: function (evt) {
            var elements = $("." + this.opts.focusableClass);
            actv = this.opts.focusedClass;
            for (var i = 0; i < elements.length - 1; i++) {
                if (elements.eq(i).hasClass(actv)) {
                    elements.eq(i).removeClass(actv);
                    elements.eq(i + 1).focus().addClass(actv);
                    break;
                }
            }
        }
    };

    var EventManager = function (target, settings) {
        this.opts = $.extend({
            activeFirstElement: false,
            customKeyEvent: {},
            focusableClass: "focusable",
            focusedClass: "focused",
            direction: "h"
        }, settings);

        this.keys = {LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, ENTER: 13, BACK: 8};
        if (this.opts.direction.trim() == "v") {
            this.keys = {LEFT: 38, UP: 37, RIGHT: 40, DOWN: 39, ENTER: 13, BACK: 8};
        }
        this.arrow = new Arrow(this.opts);
        this.target = target;
        this.__constructor__();
    };

    EventManager.prototype = {
        __constructor__: function () {
            // destroy arrowkeys
            this.destroy();
            
            if (this.opts.activeFirstElement) {
                this.activeFirstElement();
            }
            var tabindex = this.opts.tabindex || 1;
            $(this.target).attr("tabindex", tabindex);
        },

        // Selected the first element
        activeFirstElement: function () {
            var cards = $("." + this.opts.focusableClass),
                actv = this.opts.focusedClass;
            cards.first().focus().addClass(actv);
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
                }
            }
        },

        addCommonKeyEvent: function (evt) {
            var keys = this.keys,
                actv = this.opts.focusedClass,
                focused = $('.' + actv);

            evt = evt || window.event;
            var keyCode = evt.which || evt.keyCode;

            // Focus the first element if has not actives.
            if (focused.length === 0) {
                for (var key in keys) {
                    if (keyCode === keys[key]) {
                        this.activeFirstElement();
                        return;
                    }
                }
            }

            switch (keyCode) {
                case keys.LEFT:
                    this.arrow.left(evt);
                    evt.preventDefault();
                    break;

                case keys.UP:
                    this.arrow.up(evt);
                    evt.preventDefault();
                    break;

                case keys.RIGHT:
                    this.arrow.right(evt);
                    evt.preventDefault();
                    break;

                case keys.DOWN:
                    this.arrow.down(evt);
                    evt.preventDefault();
                    break;

                case keys.ENTER:
                    if ($.isFunction(this.opts.enterFunc)) {
                        this.opts.enterFunc.call(this, focused, evt);
                    } else {
                        // default enter event
                    }
                    evt.preventDefault();
                    break;

                case keys.BACK:
                    if ($.isFunction(this.opts.backFunc)) {
                        this.opts.backFunc.call(this, focused, evt);
                    } else {
                        // default back event
                    }
                    evt.preventDefault();
                    break;

                default:
                    return;
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

        return jQuery;
    };

}));

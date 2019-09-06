if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

/**
 * jQuery stack plugin, this jQuery plugin provides the base infra-structure for
 * the creation of a special "stackable" panel that may be used as a navigation
 * controller for contained panels. Basic operations include push and pop.
 *
 * @name uxf-stack.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2019 Hive Solutions Lda.
 * @license Apache License, Version 2.0 - http://www.apache.org/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxstack = function(method, options) {
        // the default values for the stack
        var defaults = {};

        // sets the default method value
        method = method || "default";

        // sets the default options value
        options = options || {};

        // constructs the options
        options = jQuery.extend(defaults, options);

        // sets the jquery matched object
        var matchedObject = this;

        /**
         * Initializer of the plugin, runs the necessary functions to initialize
         * the structures.
         */
        var initialize = function() {
            _appendHtml();
            _registerHandlers();
        };

        /**
         * Creates the necessary HTML for the component.
         */
        var _appendHtml = function() {
            // in case the matched object is not defined
            // or in case it's an empty list must return
            // immediatly initialization is not meant to
            // be run (corruption may occur)
            if (!matchedObject || matchedObject.length === 0) {
                return;
            }

            // adds to extra elements to the stack representing the items
            // that are inside the stack and the ones that are outside it
            matchedObject.append('<div class="stack-in"></div>');
            matchedObject.append('<div class="stack-out"></div>');

            // iterates over each of the selected elements to start the
            // stack structure for each of them
            matchedObject.each(function(index, element) {
                var _element = jQuery(this);
                var stackOut = jQuery("> .stack-out", _element);
                var stackItems = jQuery("> .stack-item", _element);
                var stackTop = jQuery("> .stack-item.stack-top", _element);
                stackTop =
                    stackTop.length === 0 ? jQuery("> .stack-item:first", _element) : stackTop;
                stackOut.append(stackItems);
                push(_element, stackTop, false);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // in case the matched object is not defined
            // or in case it's an empty list must return
            // immediatly initialization is not meant to
            // be run (corruption may occur)
            if (!matchedObject || matchedObject.length === 0) {
                return;
            }

            // retrieves the various elements that are going
            // to be used for registration
            var _window = jQuery(window);
            var _body = jQuery("body");

            // checks if the stack click event is already
            // registerd in the body and sets the variable as
            // true to avoid further registrations
            var isRegistered = _body.data("stack_click");
            _body.data("stack_click", true);

            // registers for the push event with the proper target
            // parameter that should push a stack item into the
            // curent included stack
            matchedObject.bind("push", function(event, target) {
                var element = jQuery(this);
                push(element, target);
            });

            // registers for the pop operation in the matched
            // object so that it's possible to remote an item
            // from the current "included" sequence
            matchedObject.bind("pop", function() {
                var element = jQuery(this);
                pop(element);
            });

            matchedObject.bind("pop_all", function() {
                var element = jQuery(this);
                popAll(element);
            });

            !isRegistered &&
                _window.bind("size", function() {
                    var stacks = jQuery(".stack", _body);
                    stacks.each(function(index, value) {
                        var _element = jQuery(this);
                        _reposition(_element);
                    });
                });
        };

        var push = function(element, target, animated) {
            if (!target || target.length === 0) {
                return false;
            }

            var stackIn = jQuery("> .stack-in", element);
            var inStack = jQuery("> .stack-item", stackIn);
            inStack.removeClass("stack-top");
            inStack.addClass("stack-bottom");
            target.addClass("stack-top");
            target.removeClass("stack-bottom");
            stackIn.append(target);
            _reposition(element);
            return true;
        };

        var pop = function(element) {
            var stackIn = jQuery("> .stack-in", element);
            var stackItems = jQuery("> .stack-item", stackIn);
            var stackTop = jQuery("> .stack-item.stack-top", stackIn);
            if (stackItems.length === 1) {
                return false;
            }
            if (stackTop.length === 0) {
                return false;
            }
            var stackNext = stackTop.prev();
            var transition = stackIn.css("transition-duration");
            transition = transition ? parseFloat(transition) : 0;
            stackTop.addClass("stack-gc");
            stackTop.removeClass("stack-top");
            stackNext.addClass("stack-top");
            stackNext.removeClass("stack-bottom");
            _reposition(element);
            var delay = transition * 1000;
            if (delay) {
                setTimeout(function() {
                    _gc(element);
                }, delay);
            } else {
                _gc(element);
            }
            return true;
        };

        var popAll = function(element) {
            var stackIn = jQuery("> .stack-in", element);
            stackIn.css("transition-duration", "0s");
            stackIn.css("-o-transition-duration", "0s");
            stackIn.css("-ms-transition-duration", "0s");
            stackIn.css("-moz-transition-duration", "0s");
            stackIn.css("-khtml-transition-duration", "0s");
            stackIn.css("-webkit-transition-duration", "0s");
            while (true) {
                var result = pop(element);
                if (!result) {
                    break;
                }
            }
            setTimeout(function() {
                stackIn.css("transition-duration", "");
                stackIn.css("-o-transition-duration", "");
                stackIn.css("-ms-transition-duration", "");
                stackIn.css("-moz-transition-duration", "");
                stackIn.css("-khtml-transition-duration", "");
                stackIn.css("-webkit-transition-duration", "");
            });
        };

        var _reposition = function(element) {
            var stackIn = jQuery("> .stack-in", element);
            var stackItems = jQuery("> .stack-item", stackIn);
            var stackTop = jQuery("> .stack-item.stack-top", stackIn);
            var itemsWidth = 0;
            var itemsOffset = 0;
            var stackTopWidth = stackTop.outerWidth(true);
            stackItems.each(function(index, element) {
                var _element = jQuery(this);
                var isGarbage = _element.hasClass("stack-gc");
                var elementWidth = _element.outerWidth(true);
                itemsWidth += elementWidth;
                itemsOffset += isGarbage ? 0 : elementWidth;
            });
            stackIn.width(itemsWidth);
            stackIn.css("left", String(itemsOffset * -1 + stackTopWidth) + "px");
        };

        var _gc = function(element) {
            var stackIn = jQuery("> .stack-in", element);
            var stackOut = jQuery("> .stack-out", element);
            var garbage = jQuery("> .stack-item.stack-gc", stackIn);
            garbage.removeClass("stack-gc");
            stackOut.append(garbage);
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

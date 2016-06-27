/**
 * jQuery carousel plugin, this jQuery plugin provides the base infra-structure
 * for the creation of a carousel component that display various items over a
 * set of time.
 *
 * @name uxf-carousel.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2016 Hive Solutions Lda.
 * @license Apache License, Version 2.0 - http://www.apache.org/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxcarousel = function(method, options) {
        // the default values for the carousel
        var defaults = {};

        // sets the default method value
        var method = method ? method : "default";

        // sets the default options value
        var options = options ? options : {};

        // constructs the options
        var options = jQuery.extend(defaults, options);

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
         * Creates the necessary html for the component.
         */
        var _appendHtml = function() {
            if (!matchedObject || matchedObject.length == 0) {
                return;
            }

            // iterates over the complete set of selected elements
            // to correclty initialize all of them
            matchedObject.each(function(index, element) {
                var _element = jQuery(this);
                setTimeout(function() {
                    _init(_element, options);
                });
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            if (!matchedObject || matchedObject.length == 0) {
                return;
            }

            // retrieves the reference to some of the global
            // elements to be used in the operation
            var _window = jQuery(window);
            var _body = jQuery("body");

            // retrieves the reference to some of the elements
            // that are part of the carousel structure
            var views = jQuery("> .views", matchedObject);
            var viewItems = jQuery("> li", views);

            // verifies if the current carousel global
            // operation is already registers and then marks
            // the element as registered (default behaviour)
            var isRegistered = _body.data("carousel_click");
            _body.data("carousel_click", true);

            // registers for the click event in the view items
            // so that a new index is set on the click event
            viewItems.click(function() {
                var element = jQuery(this);
                var carousel = element.parents(".carousel");
                var index = element.index();
                _set(carousel, options, index);
                _schedule(carousel, options);
            });

            // registers for the next event on the carousel to
            // trigger the execution of the next operation
            matchedObject.bind("next", function() {
                var element = jQuery(this);
                _next(element, options);
            });

            // registers for the previous event on the carousel to
            // trigger the execution of the previous operation
            matchedObject.bind("previous", function() {
                var element = jQuery(this);
                _previous(element, options);
            });

            // registers for the key down operation on the body
            // so that the carousel may move accordingly
            !isRegistered && _body.keydown(function(event) {
                var element = jQuery(this);
                var carousel = jQuery(".carousel", element);

                var keyValue = event.keyCode ? event.keyCode : event.charCode ? event.charCode :
                    event.which;

                switch (keyValue) {
                    case 37:
                        _previous(carousel, options);
                        _schedule(carousel, options);
                        break;

                    case 39:
                        _next(carousel, options);
                        _schedule(carousel, options);
                        break;
                }
            });

            // registers for the resize event on the window
            // so that the current width and position are updated
            !isRegistered && _window.resize(function() {
                var carousel = jQuery(".carousel", _body);
                carousel.each(function(index, element) {
                    var _element = jQuery(this);
                    _update(_element, options);
                });
            });
        };

        var _init = function(matchedObject, options) {
            var items = jQuery("> .items", matchedObject);
            var item = jQuery("> .item", items);
            var count = item.length;
            matchedObject.data("count", count);
            matchedObject.data("index", 0);
            _update(matchedObject, options);
            _schedule(matchedObject, options);
        };

        var _schedule = function(matchedObject, options) {
            var timeout = matchedObject.attr("data-timeout") || "5000";
            timeout = parseInt(timeout);
            if (timeout == -1) {
                return;
            }
            var interval = matchedObject.data("interval");
            interval && clearInterval(interval);
            interval = setInterval(function() {
                var index = matchedObject.data("index");
                if (index === undefined) {
                    clearInterval(interval);
                    return;
                }
                _next(matchedObject, options);
            }, timeout);
            matchedObject.data("interval", interval);
        };

        var _update = function(matchedObject, options) {
            var items = jQuery("> .items", matchedObject);
            var item = jQuery("> .item", items);
            var width = matchedObject.outerWidth();
            var count = matchedObject.data("count");
            item.width(width);
            items.width(width * count);
            _updateSimple(matchedObject, options);
        };

        var _updateSimple = function(matchedObject, options) {
            var items = jQuery("> .items", matchedObject);
            var views = jQuery("> .views", matchedObject);
            var viewItems = jQuery("> li", views);
            var width = matchedObject.outerWidth();
            var index = matchedObject.data("index");
            var activeItem = jQuery(
                "> li:nth-child(" + String(index + 1) + ")", views);
            viewItems.removeClass("active");
            activeItem.addClass("active");
            items.css("margin-left", String(width * index * -1) + "px");
        };

        var _next = function(matchedObject, options) {
            var count = matchedObject.data("count");
            var index = matchedObject.data("index");
            var next = index + 1 == count ? 0 : index + 1;
            _set(matchedObject, options, next);
        };

        var _previous = function(matchedObject, options) {
            var count = matchedObject.data("count");
            var index = matchedObject.data("index");
            var next = index - 1 == -1 ? count - 1 : index - 1;
            _set(matchedObject, options, next);
        };

        var _set = function(matchedObject, options, index) {
            matchedObject.data("index", index);
            _updateSimple(matchedObject, options);
        };

        // switches over the method, to be able to correctly handle
        // the action that was rquested by logic
        switch (method) {
            case "next":
                _next(matchedObject, options);
                return value;

            case "previous":
                _previous(matchedObject, options);
                return true;

            case "default":
                // initializes the plugin
                initialize();
                break;
        }

        // returns the object
        return this;
    };
})(jQuery);

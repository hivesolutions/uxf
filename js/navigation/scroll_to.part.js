/**
 * jQuery scroll to plugin, this jQuery plugin provides the base infra-structure
 * for smooth scrolling in the viewport.
 *
 * @name jquery-scrollto.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2015 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 * @credits Ariel Flesler <aflesler@gmail.com>
 */
(function(jQuery) {
    // sets the scroll to to be the global function
    // scrolling the window
    var uxscrollto = jQuery.uxscrollto = function(target, duration, settings) {
        jQuery(window).uxscrollto(target, duration, settings);
    };

    // creates the map of scroll default values
    uxscrollto.defaults = {
        axis : "xy",
        duration : parseFloat($.fn.jquery) >= 1.3 ? 0 : 1
    };

    /**
     * Returns the element that needs to be animated to scroll the window.
     *
     * @param {Object}
     *            scope The current scope to be used.
     * @return {Element} The input element.
     */
    uxscrollto.window = function(scope) {
        // returns the scrollable element for
        // the window element
        return jQuery(window)._scrollable();
    };

    /**
     * Returns the real elements to scroll (supports window/iframes, documents
     * and regular nodes).
     *
     * @return {Element} The input element.
     */
    jQuery.fn._scrollable = function() {
        return this.map(function() {
            // retrieves the element
            var element = this

            // checks if the current element is in fact
            // a window
            var isWindow = !element.nodeName
                    || jQuery.inArray(element.nodeName.toLowerCase(), [
                                    "iframe", "#document", "html", "body"]) != -1;

            // in case the element is not a window
            // it's scrollable
            if (!isWindow) {
                // returns immediately the element
                return element;
            }

            // retrieves the document from the window
            var _document = (element.contentWindow || element).document
                    || element.ownerDocument || element;

            // returns the scrollable element from the document
            // based on the current browser
            return jQuery.browser.safari
                    || _document.compatMode == "BackCompat"
                    ? _document.body
                    : _document.documentElement;
        });
    };

    jQuery.fn.uxscrollto = function(target, duration, settings) {
        // in case the target is not defined or in case it's
        // an empty array, must return immdiately, nothing to be done
        if (!target || target.length == 0) {
            return;
        }

        // in case the duration is an object
        if (typeof duration == "object") {
            settings = duration;
            duration = 0;
        }

        // in case the setting is a function
        // (on after function)
        if (typeof settings == "function") {
            settings = {
                onAfter : settings
            };
        }

        // incase the target is the maximum
        if (target == "max") {
            // set the target to a really big
            // value
            target = 9e9;
        }

        // exteds the settings with the default setttings
        settings = jQuery.extend({}, uxscrollto.defaults, settings);

        // speed is still recognized for backwards compatibility
        duration = duration || settings.speed || settings.duration;

        // makes sure the settings are given right
        settings.queue = settings.queue && settings.axis.length > 1;

        if (settings.queue) {
            // let's keep the overall duration
            duration /= 2;
        }

        settings.offset = both(settings.offset);
        settings.over = both(settings.over);

        return this._scrollable().each(function() {
            // retrieves the element and then based on
            // it retrieves the jquery element, target
            // target offset, attributes and window
            var element = this;
            var _element = jQuery(element)
            var _target = target;
            var targetOffset;
            var attributes = {}
            var win = _element.is("html, body");

            // switches over the target
            switch (typeof _target) {
                // in case it's a number or string
                // will pass the regex
                case "number" :
                case "string" :
                    if (/^([+-]=)?\d+(\.\d+)?(px|%)?$/.test(_target)) {
                        _target = both(_target);
                        break;
                    }
                    // relative selector, avoids break
                    _target = jQuery(_target, this);
                case "object" :
                    // in case it's a dom element or jquery element
                    if (_target.is || _target.style) {
                        // retrieves the real position of the target
                        targetOffset = (_target = jQuery(_target)).offset();
                    }
            }

            // in case the target is not defined or in case it's
            // an empty array, must return immdiately, nothing to be done
            if (!_target || _target.length == 0) {
                return;
            }

            jQuery.each(settings.axis.split(""), function(index, axis) {
                // retrieves the position and converts it to lower case
                // then retrieves the key to the position, the old
                // element and the maximum between the axis and the element
                var position = axis == "x" ? "Left" : "Top";
                var positionLower = position.toLowerCase();
                var key = "scroll" + position;
                var old = element[key];
                var max = uxscrollto.max(element, axis);

                // in case there is a target offset defined
                if (targetOffset) {
                    attributes[key] = targetOffset[positionLower]
                            + (win ? 0 : old - _element.offset()[positionLower]);

                    // in case it's a dom element, reduces the margin
                    if (settings.margin) {
                        attributes[key] -= parseInt(_target.css("margin"
                                + position))
                                || 0;
                        attributes[key] -= parseInt(_target.css("border"
                                + position + "Width"))
                                || 0;
                    }

                    attributes[key] += settings.offset[positionLower] || 0;

                    if (settings.over[positionLower])
                        // scrolls to a fraction of its width/height
                        attributes[key] += _target[axis == "x"
                                ? "width"
                                : "height"]()
                                * settings.over[positionLower];
                }
                // otherwise no offset should be used
                else {
                    // sets the value as the target position
                    var value = _target[positionLower];

                    // handles the percentage values
                    attributes[key] = value.slice && value.slice(-1) == "%"
                            ? parseFloat(value) / 100 * max
                            : value;
                }

                // in case it's umber or "number"
                if (/^\d+$/.test(attributes[key])) {
                    // checks the limits
                    attributes[key] = attributes[key] <= 0 ? 0 : Math.min(
                            attributes[key], max);
                }

                // in case it's queueing axes
                if (!index && settings.queue) {
                    // avoids wasting time animating, if there's no need
                    if (old != attributes[key]) {
                        // intermediate animation
                        animate(settings.onAfterFirst);
                    }

                    // avoids animating this axis again in the next iteration
                    delete attributes[key];
                }
            });

            /**
             * Animate function that run the animation and calls the given
             * callback at the end of the animation.
             *
             * @param {Function}
             *            callback The callback to be called at the end of the
             *            animation.
             */
            var animate = function(callback) {
                _element.animate(attributes, duration, settings.easing,
                        callback && function() {
                            callback.call(this, target, settings);
                        });
            };

            // runs the animation and calls
            // the on after callback at the end
            animate(settings.onAfter);
        }).end();
    };

    /**
     * Goes to maximum scrolling, works on quirks mode It only fails (not too
     * badly) on IE, quirks mode.
     *
     * @param {Element}
     *            element The element to be used aas reference for the scroll.
     * @param {String}
     *            axis The axis to be used in scroll reference.
     * @return {Element} The input element.
     */
    uxscrollto.max = function(element, axis) {
        // retrieves both the dimension and the scroll
        // references
        var dimensions = axis == "x" ? "Width" : "Height";
        var scroll = "scroll" + dimensions;

        // in case the element represents an html or
        // body element
        if (!jQuery(element).is("html, body")) {
            // returns the element scroll minus the element
            // dimensions
            return element[scroll]
                    - jQuery(element)[dimensions.toLowerCase()]();
        }

        // creates the size key and retrieves
        // the html and body elements from the
        // element's owner document
        var size = "client" + dimensions;
        var html = element.ownerDocument.documentElement;
        var body = element.ownerDocument.body;

        // returns the maximum between the scroll of
        // the html and body minus the minimum between
        // the html and body size
        return Math.max(html[scroll], body[scroll])
                - Math.min(html[size], body[size]);
    };

    /**
     * Sets the value in a map containing the top and left keys. In the map the
     * value is set for both the top and left keys.
     *
     * @param {Map}
     *            value The value to be set in both keys in a map.
     * @return {Map} The map with the top and left key set to the value.
     */
    var both = function(value) {
        return typeof value == "object" ? value : {
            top : value,
            left : value
        };
    };
})(jQuery);

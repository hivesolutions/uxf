(function(jQuery) {
    jQuery.fn.uxsidepanel = function(options) {
        // the default values for the pos customer
        var defaults = {};

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
            // iterates over the complete set of element to update their
            // initial side positions according to their width
            matchedObject.each(function(index, element) {
                var _element = jQuery(this);
                var width = _element.outerWidth(true);
                var side = _element.attr("data-side") || "right";
                _element.css(side, (width * -1) + "px");
                _element.addClass("side-panel-" + side);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the various element that are going to be registerd
            // for events for the current side panel element
            var cancel = jQuery(".button-cancel", matchedObject);

            // registers for the toggle event in the side panel so that
            // its current visibility state is "toggled"
            matchedObject.bind("toggle", function() {
                var element = jQuery(this);
                var isVisible = element.data("visible");
                if (isVisible) {
                    element.triggerHandler("hide");
                } else {
                    element.triggerHandler("show");
                }
            });

            // registers for the show event so that the side panel
            // is properly shown in the current display container
            matchedObject.bind("show", function() {
                var element = jQuery(this);
                _show(element, options);
            });

            // registers for the hide event so that the side panel
            // is properly hidden from the current display container
            matchedObject.bind("hide", function() {
                var element = jQuery(this);
                _hide(element, options);
            });

            // registers for the click event on the cancel buttons so that the
            // associated side panel element is hidden
            cancel.click(function() {
                var element = jQuery(this);
                var panel = element.parents(".side-panel");
                panel.triggerHandler("hide");
            });
        };

        var _ensureOverlay = function() {
            // retrieves the overlay element and in case it's not present
            // creates a default element adding it to the start of the
            // top level body element (default behaviour)
            var overlay = jQuery(".overlay:first");
            if (overlay.length > 0) {
                return overlay;
            }
            var _body = jQuery("body");
            overlay = jQuery("<div id=\"overlay\" class=\"overlay\"></div>");
            overlay.uxoverlay();
            _body.prepend(overlay);
            return overlay;
        };

        var _show = function(matchedObject, options) {
            var isVisible = matchedObject.data("visible");
            if (isVisible) {
                return;
            }
            matchedObject.data("visible", true);
            var overlay = _ensureOverlay();
            var width = matchedObject.outerWidth(true);
            var side = matchedObject.attr("data-side") || "right";
            overlay.triggerHandler("resize");
            overlay.triggerHandler("show", [350]);
            var animation = {};
            animation[side] = 0;
            matchedObject.css(side, (width * -1) + "px");
            matchedObject.show();
            matchedObject.animate(animation, {
                duration: 350,
                easing: "swing",
                complete: function() {
                    __registerClick(matchedObject, options);
                    __registerKey(matchedObject, options);
                }
            });
        };

        var _hide = function(matchedObject, options) {
            var isVisible = matchedObject.data("visible");
            if (!isVisible) {
                return;
            }
            matchedObject.data("visible", false);
            var overlay = _ensureOverlay();
            var width = matchedObject.outerWidth(true);
            var side = matchedObject.attr("data-side") || "right";
            __unregisterClick(matchedObject, options);
            __unregisterKey(matchedObject, options);
            overlay.triggerHandler("hide", [350]);
            var animation = {};
            animation[side] = width * -1;
            matchedObject.css(side, 0 + "px");
            matchedObject.animate(animation, {
                duration: 350,
                easing: "swing",
                complete: function() {
                    matchedObject.hide();
                }
            });
        };

        var __registerClick = function(matchedObject, options) {
            // retrieves the overlay element and registers for
            // the click event on it in order to hide the current
            // window then stores it in the data element
            var overlay = jQuery(".overlay:first");
            var handler = function() {
                matchedObject.triggerHandler("hide");
            };
            overlay.click(handler);
            matchedObject.data("click_handler", handler);
        };

        var __unregisterClick = function(matchedObject, options) {
            // retrieves the global overlay and the handle to the
            // callback function then unbinds it from the click
            // even on the overlay
            var overlay = jQuery(".overlay:first");
            var handler = matchedObject.data("click_handler");
            handler && overlay.unbind("click", handler);
        };

        var __registerKey = function(matchedObject, options) {
            // retrieves the reference to the document element
            // and registers for the key press event on it and
            // sets the key handler in handler key for the
            // current matched object
            var _document = jQuery(document);
            var handler = _document.keydown(function(event) {
                // retrieves the key value
                var keyValue = event.keyCode ? event.keyCode : event.charCode ? event.charCode :
                    event.which;

                // switches over the key value
                switch (keyValue) {
                    case 27:
                        matchedObject.triggerHandler("hide");
                        break;
                }
            });
            matchedObject.data("key_handler", handler);
        };

        var __unregisterKey = function(matchedObject, options) {
            // retrieves the reference to the global document
            // element and then unregisters the key down event
            // handler from it (avoid duplicated events)
            var _document = jQuery(document);
            var handler = matchedObject.data("key_handler");
            handler && _document.unbind("keydown", handler);
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

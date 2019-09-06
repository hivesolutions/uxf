if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxsidepanel = function(options) {
        // the default values for the pos customer
        var defaults = {};

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
            // verifies that at leat one object is selected and if that's
            // not the case returns the control flow immediately
            if (!matchedObject || matchedObject.length === 0) {
                return;
            }

            // iterates over the complete set of element to update their
            // initial side positions according to their width
            matchedObject.each(function(index, element) {
                var _element = jQuery(this);
                var width = _element.outerWidth(true);
                var side = _element.attr("data-side") || "right";
                _element.css(side, width * -1 + "px");
                _element.addClass("side-panel-" + side);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // verifies that at leat one object is selected and if that's
            // not the case returns the control flow immediately
            if (!matchedObject || matchedObject.length === 0) {
                return;
            }

            // retrieves the various element that are going to be registerd
            // for events for the current side panel element
            var _body = jQuery("body");
            var cancel = jQuery(".button-cancel", matchedObject);

            // checks if the side panel value is already
            // registerrd in the body and sets the variable as
            // true to avoid further registrations
            var isRegistered = _body.data("side_panel");
            _body.data("side_panel", true);

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

            // registers for the global hide modal event
            // so that the side panel is properly hidden
            !isRegistered &&
                _body.bind("hide_modal", function() {
                    // retrieves the current element (body) and uses it
                    // to retrieve the complete set of side panels
                    var element = jQuery(this);
                    var sidePanels = jQuery(".side-panel", element);

                    // iterates over the complete set of side panels present
                    // to be able to hide everyone
                    sidePanels.each(function() {
                        // runs the hide operation for the current
                        // element (side panel in iteration)
                        var _element = jQuery(this);
                        _hide(_element, options);
                    });
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
            overlay = jQuery('<div id="overlay" class="overlay"></div>');
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
            var timeout = matchedObject.attr("data-timeout") || "350";
            timeout = parseInt(timeout);
            overlay.triggerHandler("resize");
            overlay.triggerHandler("show", [timeout]);
            var animation = {};
            animation[side] = 0;
            matchedObject.css(side, width * -1 + "px");
            matchedObject.show();
            matchedObject.animate(animation, {
                duration: timeout,
                easing: "swing",
                complete: function() {
                    __registerClick(matchedObject, options);
                    __registerKey(matchedObject, options);
                }
            });
            matchedObject.triggerHandler("post_show");
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
            var timeout = matchedObject.attr("data-timeout") || "350";
            timeout = parseInt(timeout);
            __unregisterClick(matchedObject, options);
            __unregisterKey(matchedObject, options);
            overlay.triggerHandler("hide", [timeout]);
            var animation = {};
            animation[side] = width * -1;
            matchedObject.css(side, 0 + "px");
            matchedObject.animate(animation, {
                duration: timeout,
                easing: "swing",
                complete: function() {
                    matchedObject.hide();
                }
            });
            matchedObject.triggerHandler("post_hide");
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
                var keyValue = event.keyCode
                    ? event.keyCode
                    : event.charCode
                    ? event.charCode
                    : event.which;

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

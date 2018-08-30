if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uximagelazy = function(element, options) {
        // the default values for the image upload
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
         * Creates the necessary html for the component.
         */
        var _appendHtml = function() {
            // in case the matched object is not defined
            // or in case it's an empty list must return
            // immediatly initialization is not meant to
            // be run (corruption may occur)
            if (!matchedObject || matchedObject.length === 0) {
                return;
            }

            // retrieves the reference to the top level body
            // element to be used for global retrieval
            var _body = jQuery("body");

            // adds the initial unloaded class to the complete
            // set of lazy loaded images, as by default each
            // image is unloaded on the initial state
            matchedObject.addClass("unloaded");

            // iterates over each of the selected images
            // to start their (initial) state, note that
            // this operation is delayed by timeout
            matchedObject.each(function(index, element) {
                // retrieves the reference to the current element
                var _element = jQuery(this);

                // tries to determine the density of the screen and uses
                // it to determine the appropriate attribute to be used
                // to retrieve the URL of the image to be loaded
                var isRetina = _body.hasClass("retina-s");
                var attribute = isRetina ? "data-url_retina" : "data-url";
                var src = _element.attr(attribute);
                src = src || _element.attr("data-url");

                // in case no other way of retrieving the target source
                // image success the src attribute is used as the value
                // for the lazy retrieval, note that for this strategy
                // the src attribute is removed (may create size issues)
                if (!src) {
                    src = _element.attr("src");
                    _element.removeAttr("src");
                }

                // sets the target URL of the image in the target attribute
                // taking into account the density of the screen
                _element.attr(attribute, src);

                // schedules the update state operation on the element for
                // the next tick operation (tries to load it, if visible)
                setTimeout(function() {
                    updateState(_element);
                });
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

            // retrieves the reference to some of the global
            // elements to be used in the operation
            var _window = jQuery(window);
            var _body = jQuery("body");

            // verifies if the current image lazy global
            // operation is already registers and then marks
            // the element as registered (default behaviour)
            var isRegistered = _body.data("image_lazy_click");
            _body.data("image_lazy_click", true);

            matchedObject.bind("load", function() {
                var element = jQuery(this);
                if (!isFinal(element)) {
                    return;
                }
                element.removeClass("loading");
                element.removeClass("unloaded");
                element.addClass("loaded");
            });

            matchedObject.bind("error", function() {
                var element = jQuery(this);
                if (!isFinal(element)) {
                    return;
                }
                element.removeClass("loading");
                element.addClass("error");
            });

            !isRegistered &&
                _window.scroll(function() {
                    var imagesLazy = jQuery(".image-lazy", _body);
                    imagesLazy = imagesLazy.not(".loading");
                    imagesLazy = imagesLazy.not(".loaded");
                    imagesLazy = imagesLazy.not(".error");
                    imagesLazy.each(function(index, element) {
                        var _element = jQuery(this);
                        updateState(_element);
                    });
                });

            !isRegistered &&
                _window.resize(function() {
                    var imagesLazy = jQuery(".image-lazy", _body);
                    imagesLazy = imagesLazy.not(".loading");
                    imagesLazy = imagesLazy.not(".loaded");
                    imagesLazy = imagesLazy.not(".error");
                    imagesLazy.each(function(index, element) {
                        var _element = jQuery(this);
                        updateState(_element);
                    });
                });

            !isRegistered &&
                setInterval(function() {
                    var imagesLazy = jQuery(".image-lazy", _body);
                    imagesLazy = imagesLazy.not(".loading");
                    imagesLazy = imagesLazy.not(".loaded");
                    imagesLazy = imagesLazy.not(".error");
                    imagesLazy.each(function(index, element) {
                        var _element = jQuery(this);
                        updateState(_element);
                    });
                }, 250);
        };

        var updateState = function(element) {
            var load = element.hasClass("load");
            var visible = isVisible(element);
            if (!visible && !load) {
                return;
            }

            var _body = jQuery("body");
            var isRetina = _body.hasClass("retina-s");
            var attribute = isRetina ? "data-url_retina" : "data-url";
            var dataUrl = element.attr(attribute);
            var imageSet = isSet(element);

            if (imageSet || !dataUrl) {
                return;
            }

            element.attr("src", dataUrl);
            element.addClass("loading");
        };

        var getHeaderOffset = function(element) {
            return _getOffset(element, "data-header", ".header-container");
        };

        var getFooterOffset = function(element) {
            return _getOffset(element, "data-footer", ".footer-container");
        };

        var isVisible = function(element, relaxed) {
            relaxed = relaxed || element.hasClass("relaxed");

            var _window = jQuery(window);
            var windowTop = _window.scrollTop();
            var windowHeight = _window.height();
            var elementTop = element.offset().top;
            var elementHeight = element.outerHeight(true);
            var headerOffset = getHeaderOffset(element);
            var footerOffset = getFooterOffset(element);
            var displayed = relaxed ? true : element.is(":visible");

            var belowTop = elementTop + elementHeight >= windowTop + headerOffset;
            var aboveBottom = elementTop <= windowTop + windowHeight - footerOffset;
            var visible = belowTop && aboveBottom && displayed;
            return visible;
        };

        var isFinal = function(element) {
            var _body = jQuery("body");
            var isRetina = _body.hasClass("retina-s");
            var attribute = isRetina ? "data-url_retina" : "data-url";
            var dataUrl = element.attr(attribute);
            var url = element.attr("src");
            return dataUrl === url;
        };

        var isSet = function(element) {
            var isLoaded = element.hasClass("loaded");
            if (isLoaded) {
                return true;
            }
            var isLoading = element.hasClass("loading");
            if (isLoading) {
                return true;
            }
            return false;
        };

        var _getOffset = function(element, selectorAttribute, defaultSelector) {
            var _body = jQuery("body");
            var selector = element.attr(selectorAttribute);
            selector = selector || defaultSelector;
            var container = jQuery(selector, _body);
            var height = container.outerHeight(true);

            var position = container.css("position");
            if (position !== "fixed") {
                return 0.0;
            }

            var opacity = container.css("opacity");
            opacity = opacity ? parseFloat(opacity) : 1.0;

            var backgroundColor = container.css("background-color");
            var rgba = _parseRgba(backgroundColor);
            var alpha = rgba ? rgba[3] : null;

            var transparentOpacity = opacity && opacity < 1.0;
            var transparentAlpha = alpha && alpha < 1.0;
            var transparent = transparentOpacity || transparentAlpha;
            var offset = transparent ? 0.0 : height;
            return offset;
        };

        var _parseRgba = function(rgbaS) {
            if (!rgbaS || !rgbaS.startsWith("rgba")) {
                return null;
            }

            var _rgbaS = rgbaS.slice(4, rgbaS.length);
            var componentsS = _rgbaS.split(",");
            var red = parseInt(componentsS[0]);
            var green = parseInt(componentsS[1]);
            var blue = parseInt(componentsS[2]);
            var alpha = parseFloat(componentsS[3]);
            return [red, green, blue, alpha];
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

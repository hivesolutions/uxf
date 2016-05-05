(function(jQuery) {
    jQuery.fn.uximagelazy = function(element, options) {
        // the default values for the image upload
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
            // in case the matched object is not defined
            // or in case it's an empty list must return
            // immediatly initialization is not meant to
            // be run (corruption may occur)
            if (!matchedObject || matchedObject.length == 0) {
                return;
            }

            // retrieves the reference to the top level body
            // element to be used for global retrieval
            var _body = jQuery("body");

            // iterates over each of the selected images
            // to start their (initial) state, note that
            // this operation is delayed by timeout
            matchedObject.each(function(index, element) {
                var _element = jQuery(this);
                var isRetina = _body.hasClass("retina-s");
                var attribute = isRetina ? "data-url_retina" : "data-url";
                var src = _element.attr("src") || _element.attr(attribute);
                _element.attr(attribute, src);
                _element.removeAttr("src");
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
            if (!matchedObject || matchedObject.length == 0) {
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
                element.removeClass("loading");
                element.addClass("loaded");
            });

            matchedObject.bind("error", function() {
                var element = jQuery(this);
                element.removeClass("loading");
                element.addClass("error");
            });

            !isRegistered && _window.scroll(function() {
                var imagesLazy = jQuery(".image-lazy", _body);
                imagesLazy.each(function(index, element) {
                    var _element = jQuery(this);
                    updateState(_element);
                });
            });

            !isRegistered && _window.resize(function() {
                var imagesLazy = jQuery(".image-lazy", _body);
                imagesLazy.each(function(index, element) {
                    var _element = jQuery(this);
                    updateState(_element);
                });
            });
        };

        var updateState = function(element) {
            var visible = isVisible(element);
            if (!visible) {
                return;
            }

            var _body = jQuery("body");
            var isRetina = _body.hasClass("retina-s");
            var attribute = isRetina ? "data-url_retina" : "data-url";
            var src = element.attr("src");
            var dataUrl = element.attr(attribute);
            if (src || !dataUrl) {
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

        var isVisible = function(element) {
            var _window = jQuery(window);
            var windowTop = _window.scrollTop();
            var windowHeight = _window.height();
            var elementTop = element.offset().top;
            var elementHeight = element.outerHeight(true);
            var headerOffset = getHeaderOffset(element);
            var footerOffset = getFooterOffset(element);

            var belowTop = elementTop + elementHeight >= windowTop + headerOffset;
            var aboveBottom = elementTop <= windowTop + windowHeight - footerOffset;
            var visible = belowTop && aboveBottom;
            return visible;
        };

        var _getOffset = function(element, selectorAttribute, defaultSelector) {
            var _body = jQuery("body");
            var selector = element.attr(selectorAttribute);
            selector = selector ? selector : defaultSelector;
            var container = jQuery(selector, _body);
            var height = container.outerHeight(true);

            var position = container.css("position");
            if (position != "fixed") {
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

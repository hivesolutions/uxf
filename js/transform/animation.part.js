if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxanimation = function(method, options) {
        // the default values for the animation
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
            matchedObject.each(function(index, element) {
                var _element = jQuery(this);
                _register(_element, options);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // registers for the change event on the current object
            // so that the animation gets updated/re-registered
            matchedObject.change(function() {
                var element = jQuery(this);
                _register(element, options);
            });

            // registers for the refresh event on the current object
            // so that the animation gets updated/re-registered
            matchedObject.bind("refresh", function() {
                var element = jQuery(this);
                _register(element, options);
            });
        };

        var _duration = function(element, options) {
            // tries to retrieve the duration value for the animation from
            // the css values associated with the element, these values are
            // assumed to be integer defined as seconds of animation
            var cssDuration = element.css("animation-duration");
            cssDuration = cssDuration || element.css("-o-animation-duration");
            cssDuration = cssDuration || element.css("-ms-animation-duration");
            cssDuration = cssDuration || element.css("-moz-animation-duration");
            cssDuration = cssDuration || element.css("-khtml-animation-duration");
            cssDuration = cssDuration || element.css("-webkit-animation-duration");
            if (cssDuration) {
                return parseFloat(cssDuration) * 1000;
            }

            // uses the data duration attribute as the fallback process for
            // the animation and in case it does not exist uses the hardcoded
            // value as the final value to be used
            var duration = element.attr("data-duration") || "1000";
            return parseInt(duration);
        };

        var _register = function(element, options) {
            // retrieves the element values that are going to be used for
            // some of the initial calculus for the animation
            var height = element.height();
            var duration = _duration(element, options);

            // retrieves the background image reference and removes the
            // proper URL prefix from it, so that only the correct url
            // is used for the processing of the image value
            var imageUrl = element.css("background-image");
            imageUrl = imageUrl.match(/^url\("?(.+?)"?\)$/);
            imageUrl = imageUrl ? imageUrl[1] : imageUrl;

            // verifies if the image URL that was retrieved is valid and
            // if that's no the case returns immediately
            if (!imageUrl) {
                return;
            }

            // creates a new image element and creates the structure based
            // reference (element reference) for it
            var image = new Image();
            var imageElement = jQuery(image);

            // registers the element for the load event so that the proper
            // sprite height may be used in the initialization
            imageElement.load(function() {
                var spriteHeight = image.height;
                _init(element, options, height, spriteHeight, duration);
            });

            // updates the image URL for the image element, this operation
            // should trigger the loading of the image
            image.src = imageUrl;
        };

        var _init = function(element, options, height, spriteHeight, duration) {
            // "finalizes" any pending animation so that no two parallel
            // animations will ever occur for the same element
            _finalize(element, options);

            // calculates the various partial values that are going
            // to be used in the processing of the various frames from
            // the "original" gathered values from the element, note that
            // this value is calculated taking into account the pixel
            // ratio currently defined in the window/viewport
            var frameCount = spriteHeight / height / (window.devicePixelRatio || 1);
            var frameTimeout = duration / frameCount;

            // in case the number of frames is one there's no need to continue
            // with the animation process, as this is considered to be a "normal"
            // static image, not requiring any kind of animation process
            if (frameCount === 1) {
                element.css("background-position", "");
                return;
            }

            // sets the initial position of the background positio as the top
            // element of the sprite (default behavior)
            element.css("background-position", "0px 0px");

            // resets the various values of the element so that the
            // animation is set to start from the beginning (orginal values)
            element.data("height", height);
            element.data("frame", 0);
            element.data("count", frameCount);
            element.data("timeout", frameCount);

            // creates th interval that is going to be used for the animation
            // with the frame timeout that has just been defined/calculated
            var interval = window.setInterval(function() {
                _animate(element, options);
            }, frameTimeout);

            // updates the reference to the interval in the element so that
            // it may be refernced latter for cancellation
            element.data("interval", interval);
        };

        var _finalize = function(element, options) {
            // retrieves any registered interval for the element and then
            // cancels/clears it so that no more animation occurs
            var interval = element.data("interval");
            interval && clearInterval(interval);
        };

        var _animate = function(element, options) {
            // retrieves the current state value of the element to be used
            // in the calculus of the current animation iteration
            var height = element.data("height");
            var index = element.data("frame");
            var frameCount = element.data("count");

            // calculates the "new" or next index value taking the previous
            // one as reference and the re-calculates the offset value
            var next = index === frameCount - 1 ? 0 : index + 1;
            var offset = height * next * -1;

            // updates the element's css position and the frame (index) value
            // of the current animation, to be used in next iteration
            element.css("background-position", "0px" + " " + offset + "px");
            element.data("frame", next);
        };

        var _enable = function(element, options) {
            element.css("transition", "");
            element.css("-o-transition", "");
            element.css("-ms-transition", "");
            element.css("-moz-transition", "");
            element.css("-khtml-transition", "");
            element.css("-webkit-transition", "");
        };

        var _disable = function(element, options) {
            element.css("transition", "none");
            element.css("-o-transition", "none");
            element.css("-ms-transition", "none");
            element.css("-moz-transition", "none");
            element.css("-khtml-transition", "none");
            element.css("-webkit-transition", "none");
        };

        // switches over the method so that the proper execution is going
        // to be perfoemed for the selected element
        switch (method) {
            case "init":
                // starts the sprite based animation for the current object
                // creating a proper interval object for it
                _init(matchedObject, options);
                break;

            case "finalize":
                // stops the current sprite base animation from running this
                // should clear the associated interval object
                _finalize(matchedObject, options);
                break;

            case "enable":
                // enables the css animations for the current element (resume)
                // taking into account that proper css is required, then
                // breaks the current switch opertation
                _enable(matchedObject, options);
                break;

            case "disable":
                // enables the css animations for the current element (pause)
                // taking into account that proper css is required, then
                // breaks the current switch opertation
                _disable(matchedObject, options);
                break;

            case "default":
                // initializes the plugin with the normal options
                // and then breaks the current switch
                initialize();
                break;
        }

        // returns the object
        return this;
    };
})(jQuery);

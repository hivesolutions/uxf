(function(jQuery) {
    jQuery.fn.uxfeature = function(options) {
        // the default values for the feature
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
            // be run (performance issues may be created)
            if (!matchedObject || matchedObject.length == 0) {
                return;
            }

            // creates the map that will associate the various
            // features with the proper test function/method
            var features = {
                transition: __transition
            }

            // iterates over the complete set of features to be
            // validated and runs the validation for each of them
            // updating the target object accordingly
            for (var key in features) {
                var method = features[key];
                var result = method();
                if (!result) {
                    continue;
                }
                var featureS = key + "-f";
                matchedObject.addClass(featureS);
                matchedObject.data(featureS, true);
            }
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {};

        var __transition = function() {
            var b = document.body || document.documentElement
            var s = b.style;
            var p = "transition";

            if (typeof s[p] == "string") {
                return true;
            }

            var vendors = ["Moz", "webkit", "Webkit", "Khtml", "O", "ms"];
            p = p.charAt(0).toUpperCase() + p.substr(1);

            for (var index = 0; index < vendors.length; index++) {
                var vendor = vendors[index];
                if (typeof s[vendor + p] === "string") {
                    return true;
                }
            }

            return false;
        }

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

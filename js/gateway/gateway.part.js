if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxgateway = function(options) {
        // the name of the gateway plugin, should not
        // change during the timeline
        var GATEWAY_PLUGIN_NAME = "Colony Gateway Plugin";

        // the default values for the print
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
            // tries to retrieve the gateway from the currently
            // matched object an in case it already exists avoids
            // the inclusion of it
            var gateway = jQuery("#colony-gateway", matchedObject);
            if (gateway.length > 0) {
                return;
            }

            // checks if the current environment contains the
            // gateway plugin (only in case the strict flag is set)
            var hasPlugin = _hasPlugin(GATEWAY_PLUGIN_NAME);

            // adds the colony gateway code to the current matched object
            // only in case the plugin exists in the current environment
            hasPlugin &&
                matchedObject.append(
                    '<object id="colony-gateway" type="application/x-colony-gateway" width="0" height="0"></object>'
                );
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {};

        /**
         * Checks if a plugin with the provided name exists in the current
         * browser environment.
         *
         * @param name
         *            The name of the plugin to be checked for existence.
         * @return If a plugin with the provided name exists in the current
         *         environment.
         */
        var _hasPlugin = function(name) {
            // in case the navigator or the navigator plugins
            // are not defined, impossible to test the presence
            // of the plugin in the environment
            if (!navigator || !navigator.plugins) {
                // returns immediately in error
                return false;
            }

            // retrieves the number of plugins that exist
            // in the current environment
            var pluginsCount = navigator.plugins.length;

            // iterates over all the plugins in the current environment
            // to try to find the one requested
            for (var index = 0; index < pluginsCount; index++) {
                // retrieves the current plugin for the iteration
                var currentPlugin = navigator.plugins[index];

                // in case the name of the current plugin is the
                // one to being searched
                if (currentPlugin.name === name) {
                    // returns valid the plugin was found
                    return true;
                }
            }

            // by default returns false does not exits
            return false;
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

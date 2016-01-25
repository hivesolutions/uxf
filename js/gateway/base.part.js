(function(jQuery) {
    jQuery.fn.uxg = function(strict) {
        // the name of the gateway plugin, should not
        // change during the timeline
        var GATEWAY_PLUGIN_NAME = "Colony Gateway Plugin";

        // retrieves the values for the strict option
        strict = strict ? strict : false;

        // sets the jquery matched object
        var matchedObject = this;

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
                if (currentPlugin.name == name) {
                    // returns valid the plugin was found
                    return true;
                }
            }

            // by default returns false does not exits
            return false;
        };

        // checks if the current environment contains the
        // gateway plugin (only in case the strict flag is set)
        var hasPlugin = strict ? _hasPlugin(GATEWAY_PLUGIN_NAME) : true;

        // in case the plugin does not exists in the current
        // environment no need to find the reference
        if (!hasPlugin) {
            // returns immediately with no reference
            return null;
        }

        // tries to retrieve the (colony) gateway, reference
        // from the matched object
        var gateway = jQuery("#colony-gateway", matchedObject);
        var gatewayElement = gateway.length > 0 ? gateway.get(0) : null;

        // checks if the default status method is available, defaulting
        // to invalid in case it's not
        gatewayElement = gatewayElement && gatewayElement.status ? gatewayElement : null;

        // returns the reference to the gateway element
        return gatewayElement;
    };
})(jQuery);

(function($) {
    jQuery.fn.uxgprint = function(method, options) {
        // the default values for the print
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
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // registers for the click event on the matched
            // object (should trigger the print)
            matchedObject.click(function() {
                        // retrieves the element reference and runs the print
                        // process on it
                        var element = jQuery(this);
                        _print(element, options);
                    });
        };

        var _print = function(matchedObject, options) {
            // retrieves the element reference and then
            // uses it to retrieve the url to the binie
            // resource containing the document description
            var element = matchedObject;
            var binieUrl = element.attr("data-binie") || options["binie"];

            // retrieves the reference to the document element
            var _document = jQuery(document);

            // tries to retrieve the reference to the
            // gateway plugin to be used for plugin calls
            var gateway = _document.uxg();

            // in case the gateway was successfully retrieved
            // time to retrieve the binie data to be printed
            if (gateway) {
                // retrieves the printing format associated
                // with the printing infra-structure of the
                // currently loaded gateway
                var format = gateway.pformat();

                // runs the remote call to retrieve the binie
                // contents
                jQuery.ajax({
                            url : binieUrl,
                            data : {
                                base_64 : 1,
                                format : format
                            },
                            success : function(data, asdasd, aswefwegew) {
                                // prints the "just" received data using the
                                // gateway plugin (direct access to driver)
                                gateway.print(false, data);
                            }
                        });
            }
            // otherwise the normal printing process must be used
            // in case a fallback url exists
            else {
                // tries to retrieve the fallback url and the
                // target for the link
                var fallbackUrl = element.attr("data-fallback")
                        || options["fallback"];
                var target = element.attr("data-target") || options["target"];

                // in case no fallback url is defined, must return
                // immediately (nothing is done)
                if (!fallbackUrl) {
                    // returns immediately, nothing can
                    // be done
                    return;
                }

                // in case the target parameter is set a new window
                // must be created with the defined target
                if (target) {
                    // creates a new window with the defined target
                    window.open(fallbackUrl, target);
                }
                // otherwise the current document is used and the location
                // on it is changed
                else {
                    // sets the new location for the document as the
                    // fallback url
                    document.location = fallbackUrl;
                }
            }
        };

        // switches over the method
        switch (method) {
            case "print" :
                // runs the print process in the matched object
                _print(matchedObject, options);

                // breaks the switch
                break;

            case "default" :
                // initializes the plugin
                initialize();

                // breaks the switch
                break;
        }

        // returns the object
        return this;
    };
})(jQuery);

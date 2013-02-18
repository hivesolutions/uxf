(function(jQuery) {
    jQuery.fn.uxcontentchanger = function(path, callback, options) {
        // the default timeout to be used in the changer
        var DEFAULT_TIMEOUT = 1000;

        // the default values for the alert
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
            // sets the initial index in the matched
            // object (resets the counter)
            matchedObject.data("index", 0);

            // retrieves the first panel for the matched
            // object and shows it
            var firstPanel = jQuery("> .changer-panel:first", matchedObject);
            firstPanel.show();
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            matchedObject.each(function(index, element) {
                        // retrieves the element reference
                        var _element = jQuery(element);

                        // rerieves the trigger (element) attribute, this is
                        // going to be used to retrieve the element to be used
                        // for the binding of the change event in case the trigger
                        // mode is enabled
                        var trigger = _element.attr("data-trigger");

                        // retrieves the timeout of the element, to be
                        // used in case the timeout mode is enabled, defaults
                        // to the default timeout
                        var timeout = _element.attr("data-timeout")
                                ? parseInt(_element.attr("data-timeout"))
                                : DEFAULT_TIMEOUT;

                        // in case the trigger mode is enable must bind the
                        // element to the change event
                        if (trigger) {
                            // retrieves the trigger element and bind to
                            // the change event of it to process the update
                            var triggerElement = jQuery(trigger);
                            triggerElement.bind("change", function() {
                                        // updates the changer value to show the
                                        // "next" section
                                        _update(_element, options);
                                    });
                        }
                        // otherwise the interval mode is enabled, the timeout
                        // must be used to set the interval
                        else {
                            // sets a new inteval with the defined timeout value
                            // (this is considered to be the default behavior)
                            setInterval(function() {
                                        // updates the changer value to show the
                                        //"next" section
                                        _update(_element, options);
                                    }, timeout);
                        }
                    });
        };

        var _update = function(matchedObject, options) {
            // retrieves all the panels (children) from the
            // matched object and then counts them as the
            // section count value
            var panels = matchedObject.children(".changer-panel");
            var sectionCount = panels.length;

            // retrieves the current index from the matched
            // object
            var index = matchedObject.data("index");

            // hides all of the panels (to avoid the visibility of
            // any of the panels)
            panels.hide();

            // increments the index value
            index += 1;

            // in case the current value "overflows" the current
            // section count the index calue is reseted
            index == sectionCount ? index = 0 : index = index;

            // retrieves the current panel to be shown and
            // shows it
            var panel = panels.get(index)
            jQuery(panel).show();

            // updates the index value data in the matched object
            matchedObject.data("index", index);
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

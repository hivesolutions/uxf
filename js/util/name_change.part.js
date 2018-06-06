if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxnamechange = function(options) {
        // the default values for the name change
        var defaults = {};

        // sets the default options value and then
        // runs the proper extension/construction
        options = options || {};
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
        var _appendHtml = function() {};

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // iterates over all the elements in the matched object
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the parent form
                var form = _element.parents("form");

                // registers for the form submit
                form.bind("pre_submit", function() {
                    // retrieves the element value
                    var value = _element.val();

                    // in case the value is not (need
                    // to change the name attribute)
                    if (!value) {
                        // retrieves the "original" name of the element
                        // to create a backup value
                        var name = _element.attr("name");

                        // retrieves the name empty value to change the
                        // attribute name in the element
                        var nameEmpty = _element.attr("data-name_empty");
                        _element.attr("name", nameEmpty);

                        // sets the name in the new name old attribute
                        _element.attr("data-name_old", name);
                    }
                });

                // sets an interval to check for old name
                // values, it's important in some browser to avoid
                // form corruption
                setInterval(function() {
                    // retrieves the name old value
                    var nameOld = _element.attr("data-name_old");

                    // in case no name old value is set
                    if (!nameOld) {
                        // returns immediately
                        return;
                    }

                    // sets the name old value for the name attribute
                    // and removes the name old attribute from the element
                    _element.attr("name", nameOld);
                    _element.removeAttr("data-name_old");
                }, 250);
            });
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

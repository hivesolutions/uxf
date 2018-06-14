if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxdatetime = function(options) {
        // the default values for the name change
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
            // iterates over all the matched objects
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the form associated with the current
                // element so that it can be registered for the submit event
                var form = _element.parents("form");

                // retrieves the value of the utc offset flag
                // (if the utc flag is set the date is set to work
                // in the utc zone)
                var utc = _element.hasClass("utc");

                // registers for the form submit event so that the
                // complete data may be created and set correctly
                form.bind("pre_submit", function() {
                    // retrieves the data and time components of
                    // the date and time component
                    var date = jQuery(".date", _element);
                    var time = jQuery(".time", _element);

                    // creates the complete date string by joining the string
                    // values of both the data and the time
                    var dateString = date.val() + " " + time.val();

                    // retrieves the current value and then uses it to parse
                    // it as current timestamp
                    var currentTimestamp = utc
                        ? Date.parse(dateString + " UTC") / 1000
                        : Date.parseUtc(dateString) / 1000;

                    // retrieves the name attribute from the date element
                    // and then removes it to avoid sending the literal date value
                    var name = date.attr("name");
                    date.removeAttr("name");
                    time.removeAttr("name");

                    // creates the hidden field to submit the timestamp value
                    // described in the text field
                    time.after(
                        '<input type="hidden" name="' +
                            name +
                            '" value="' +
                            String(currentTimestamp) +
                            '" />'
                    );
                });
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {};

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

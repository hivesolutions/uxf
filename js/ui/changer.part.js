if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxchanger = function(path, callback, options) {
        // the default timeout to be used in the changer
        var DEFAULT_TIMEOUT = 1000;

        // the default section count to be used in the changer
        var DEFAULT_SECTION_COUNT = 2;

        // the default values for the alert
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
            // sets the initial index in the matched
            // object (resets the counter)
            matchedObject.data("index", 0);
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the timeout value from the element
                // defaulting to the default timeout (constant) value
                var timeout = _element.attr("data-timeout") ? parseInt(_element.attr("data-timeout")) :
                    DEFAULT_TIMEOUT;

                // sets the interval handler using the "just" retrieved
                // timeout value
                setInterval(function() {
                    // updates the changer value to show the "next" section
                    _update(_element, options);
                }, timeout);
            });
        };

        var _update = function(matchedObject, options) {
            // retrieves the number of sections in the matched object
            // defaulting to the default section count
            var sectionCount = matchedObject.attr("data-section_count") ? parseInt(matchedObject.attr(
                "data-section_count")) : DEFAULT_SECTION_COUNT;

            // retrieves the current index from the matched object
            var index = matchedObject.data("index");

            // hides the matched object (to provide the cross fadding
            // effect in the changing)
            matchedObject.fadeOut(500, function() {
                // removes the current section class value from
                // the matched object (no longer required)
                matchedObject.removeClass("section-" + (index + 1));

                // increments the current index value
                index += 1;

                // in case the current value "overflows" the current
                // section count the index calue is reseted
                index = index === sectionCount ? 0 : index;

                // adds the new section calss and shows the matched object
                // with a fade effect
                matchedObject.addClass("section-" + (index + 1));
                matchedObject.fadeIn(300);

                // updates the index in the mateched object data
                matchedObject.data("index", index);

                // triggers the change event so that external "listeners"
                // may change their behavior in accordance
                matchedObject.triggerHandler("change");
            });
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

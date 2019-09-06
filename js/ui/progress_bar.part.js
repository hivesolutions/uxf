if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxprogressbar = function(method, options) {
        // the default values for the progress bar
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
            // retrieves the state of the right bar flag
            var rightBar = matchedObject.attr("data-right_bar");

            // adds the progress bar contents to the matched object
            matchedObject.append(
                '<span class="progress-bar-bar bar-left">' +
                    '<span class="progress-bar-percentage">0%</span>' +
                    "</span>"
            );

            // in case the right bar flag is set adds the second progress
            // bar to the matched object
            rightBar &&
                matchedObject.append(
                    '<span class="progress-bar-bar bar-right">' +
                        '<span class="progress-bar-percentage">0%</span>' +
                        "</span>"
                );

            // tries to retrieve the percentage and in case it
            // exists changes it
            var percentage = matchedObject.attr("data-percentage");
            percentage &&
                _change(matchedObject, {
                    percentage: percentage
                });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {};

        /**
         * Changes the current (pecentage) value for the progress bar component.
         *
         * @param {Element}
         *            matchedObject The reference to the current matched object.
         * @param {Map}
         *            options The map of options to be used.
         */
        var _change = function(matchedObject, options) {
            // retrieves the percentage value from the options
            var percentage = options.percentage ? options.percentage : 0;

            // calculates the remaining percentage for the right
            // handed bar
            var percentageRemaining = 100.0 - percentage;

            // retrieves the progress bar bars
            var progressBarBarLeft = jQuery(".progress-bar-bar.bar-left", matchedObject);
            var progressBarBarRight = jQuery(".progress-bar-bar.bar-right", matchedObject);

            // retrieves the progress bar percentages
            var progressBarPercentageLeft = jQuery(
                ".progress-bar-bar.bar-left .progress-bar-percentage",
                matchedObject
            );
            var progressBarPercentageRight = jQuery(
                ".progress-bar-bar.bar-right .progress-bar-percentage",
                matchedObject
            );

            // updates both the progress bar bar and percentage
            progressBarBarLeft.css("width", percentage + "%");
            progressBarBarRight.css("width", percentageRemaining + "%");
            progressBarPercentageLeft.html(percentage + "%");
            progressBarPercentageRight.html(percentageRemaining + "%");
        };

        // switches over the method
        switch (method) {
            case "change":
                // initializes the plugin
                _change(matchedObject, options);

                // breaks the switch
                break;

            case "default":
                // initializes the plugin
                initialize();

                // breaks the switch
                break;
        }

        // returns the object
        return this;
    };
})(jQuery);

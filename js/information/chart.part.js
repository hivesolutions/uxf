(function($) {
    jQuery.fn.uxchart = function(query, callback, options) {
        // the default values for the data query json
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
            // retrieves all the bars from the matched
            // object (for width calculation)
            var bars = jQuery(".bar", matchedObject);

            // wraps the bars into the bar container, this
            // should include the proper visuals
            bars.wrap("<div class=\"bar-container\"></div>");

            // iterates over all the bars of the matched object for
            // width calculation
            bars.each(function(index, element) {
                        // retrieves the element reference
                        var _element = jQuery(element);

                        // retrieves the percentage from the elment
                        // and parses it as a float
                        var percentage = _element.attr("data-percentage");
                        percentage = parseFloat(percentage);

                        // checks if the chart is meant to be represented
                        // in a linear manner
                        var linear = _element.attr("data-linear");

                        // in case the linear flag is set the ratio is
                        // meant to be the percentage itself
                        if (linear) {
                            // sets the percentage as the ratio to be used
                            // in the bar
                            var ratio = percentage;
                        }
                        // otherwise the ratio must be controlled using a
                        // logarithmic approach
                        else {
                            // calculates the ratio for the current bar, takes
                            // into account the cases where the value is invalid
                            var ratio = (Math.log(percentage + 1) / Math.log(101.0))
                                    * 100.0;
                            ratio = percentage > 0 ? ratio : 0.0;
                        }

                        // converts the ratio into a fixed sized string
                        var ratio = ratio.toFixed(0);

                        // sets the ratio as the element width
                        _element.width(ratio + "%");
                    });

            // iterates over all the bars of the matched object for
            // content overflow testing
            bars.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the first span element
                // as the contents of the bar
                var contents = jQuery("span", element);

                // retrieves both the width of the bar and
                // the width of the contents for overflow
                // testing
                var barWidth = _element.width();
                var contentsWidth = contents.outerWidth();

                // in case the bar width is enought to hold the
                // contents (no overflow)
                if (contentsWidth <= barWidth) {
                    // retursn immediately (continues the loop)
                    return;
                }

                // creates a new transparent bar to hold the external label and
                // adds it to the dom after the element
                var transparentBar = jQuery("<div class=\"bar bar-transparent\"></div>");
                _element.after(transparentBar);

                // moves the contents to the transparent bar (external label)
                transparentBar.append(contents);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

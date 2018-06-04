(function(jQuery) {
    jQuery.fn.uxmoney = function(options) {
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
            // iterates over all the matched objects to be able
            // to format each of them accordingly as money values
            matchedObject.each(function(index, element) {
                var _element = jQuery(this);
                var value = _element.attr("data-value") || _element.text();
                var currency = _element.attr("data-currency");
                var places = _element.attr("data-places");
                var strategy = _element.attr("data-strategy") || "round";
                places = places === undefined || places === "" ? null : parseInt(places);
                var valueF = parseFloat(value);
                if (isNaN(valueF) || !currency) {
                    return;
                }
                if (places !== null) {
                    var power = Math.pow(10, places);
                    valueF = Math[strategy](valueF * power) / power;
                }
                var valueS = valueF.formatMoney(places, null, null,
                    currency, true);
                _element.text(valueS);
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

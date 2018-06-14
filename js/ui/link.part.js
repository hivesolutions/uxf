if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxlink = function(options) {
        // the default values for the link
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
        var _appendHtml = function() {};

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // iterates over each of the elements in
            // the matched object to register for the click event
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the value for the ajax "flag" attribute
                // to be used to determine if an ajax call should be
                // used instead of the "normal" link behaviour
                var ajax = _element.attr("data-ajax");

                // retrieves the duration and converts it into an integer
                // to be used for the duration of the animation
                var duration = _element.attr("data-duration");
                var durationInteger = parseInt(duration);

                // checks if the duration integer value is valid
                // conversion successful
                var durationValid = !isNaN(durationInteger);

                // in case the ajax flag set a "special" click handler
                // must be registered to intercept the call and use
                // ajax techniques to retrieve it
                ajax &&
                    _element.click(function(event) {
                        // retrieves the element and retrieves the hiperlink
                        // reference value from it to be used as the url
                        var element = jQuery(this);
                        var href = element.attr("href");

                        // prevents the default event (avoids the
                        // effect of the link)
                        event.preventDefault();

                        // runs the remote call to retrieve the resource associated
                        // with the link element, note that cross site reference
                        // rules will applye to this request
                        jQuery.ajax({
                            type: "get",
                            url: href,
                            success: function(data) {
                                element.triggerHandler("success", [data]);
                            },
                            error: function(request, textStatus, errorThrown) {
                                element.triggerHandler("error", [request]);
                            }
                        });
                    });

                // registers for the click event in
                // the element only in case the dureation is valid
                durationValid &&
                    _element.click(function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the href (link) attribute, that
                        // contains the target location of the link,
                        // this should be an internal identifier
                        var href = element.attr("href");
                        var hrefValid = jQuery(href).length > 0;

                        // retrieves the value of the data hash value
                        // that if existent enables hash changing
                        var hash = element.attr("data-hash");

                        // retrieves the offset and converts it
                        // into an integer to be used in the animation
                        // that is going to be performed in the element
                        var offset = element.attr("data-offset");
                        var offsetInteger = parseInt(offset);

                        // verifies if the target element for ther link
                        // value is valid, and in case it's not returns
                        // the control flow immediately (as it's not possible
                        // to perform smooth scrolling)
                        if (!hrefValid) {
                            return;
                        }

                        // creates the settings map based on the offset
                        // value that has just been calculated, this map
                        // is going to be passed to the scroll extension
                        var settings = {
                            offset: isNaN(offsetInteger) ? 0 : offsetInteger
                        };

                        // in case the hash triggering value is defined
                        // updates the current hash with the href value
                        // with the provided value appended to it
                        if (hash) {
                            location.hash = href + "-" + hash;
                        }

                        // starts the scrolling operation using the target
                        // href location using the defined duration
                        jQuery.uxscrollto(href, durationInteger, settings);

                        // prevents the default event (avoids the
                        // effect of the link)
                        event.preventDefault();
                    });
            });
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

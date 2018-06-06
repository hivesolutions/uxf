if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxinfo = function(message, title, type, callback, options) {
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
            // retrieves the window (alert window) elements
            var window = jQuery(".window.window-info", matchedObject);
            if (window.length === 0) {
                window = jQuery("<div class=\"window window-info window-hide\">" + "<h1></h1>" +
                    "<p class=\"single\"></p>" + "</div>");
                window.uxwindow();
                matchedObject.append(window);
            }
            var windowHeader = jQuery("h1", window);
            var windowContents = jQuery("p", window);

            // removes the various classes from the window header and
            // then adds the appropriate class according to the type
            windowHeader.removeClass("information");
            windowHeader.removeClass("warning");
            windowHeader.addClass(type || "information");

            // converts the message into a string in case that's required
            // (diferent data type) and then processes the "wiki" message
            message = typeof message === "string" ? message : String(message);
            message = matchedObject.uxwiki(message);

            // defaults the title value in case none is defined as then runs
            // the localization process for both the title and the message,
            // this is considered the default behaviour for info
            title = title || "Information";
            title = jQuery.uxlocale(title);
            message = jQuery.uxlocale(message);

            // sets the window properties so that it displays the proper values
            // as expected, so that it's ready to be shown
            windowHeader.html(title);
            windowContents.html(message);

            // shows the window
            window.uxwindow("show");
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

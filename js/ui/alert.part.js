if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxalert = function(message, callback, options) {
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
            // localizes the various values that are going to be used in the
            // contruction of the alert window
            var information = jQuery.uxlocale("Information");
            var confirm = jQuery.uxlocale("Confirm");
            var cancel = jQuery.uxlocale("Cancel");

            // retrieves the window (alert window) elements
            var window = jQuery(".window.window-alert", matchedObject);
            if (window.length === 0) {
                window = jQuery("<div class=\"window window-alert window-hide\">" + "<h1></h1>" +
                    "<p class=\"single\"></p>" + "<div class=\"window-buttons\">" +
                    "<span class=\"button button-cancel\">" + cancel + "</span>" +
                    "<span class=\"button button-confirm\">" + confirm + "</span>" + "</div>");
                window.uxwindow();
                matchedObject.append(window);
            }
            var windowHeader = jQuery("h1", window);
            var windowContents = jQuery("p", window);
            var windowButtonConfirm = jQuery(".button-confirm", window);
            var windowButtonCancel = jQuery(".button-cancel", window);

            // converts the message into a string in case that's required
            // (diferent data type) and then processes the "wiki" message
            message = typeof message === "string" ? message : String(message);
            message = matchedObject.uxwiki(message);

            // sets the window properties and hides
            // button cancel
            windowHeader.html(information);
            windowContents.html(message);
            windowButtonCancel.hide();

            // removes all the current event handlers from the confirm
            // button, this avoid possible errors with multiple click handlers
            windowButtonConfirm.unbind("click");

            // shows the window
            window.uxwindow("show");
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the window (alert window) elements
            var window = jQuery(".window.window-alert", matchedObject);
            var windowButtonConfirm = jQuery(".button-confirm", window);

            // registers for the click event on the button confirm
            windowButtonConfirm.click(function() {
                // retrieves the element
                var element = jQuery(this);

                // retrieves the associated window
                var window = element.parents(".window");

                // hides the window and calls the
                // callback if defined
                window.uxwindow("hide");
                callback && callback(true);
            });
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

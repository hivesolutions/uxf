(function(jQuery) {
    jQuery.fn.uxconfirm = function(message, callback, options) {
        // the default values for the confirm
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
            // localizes the various values that are going to be used in the
            // contruction of the alert window
            var confirm = jQuery.uxlocale("Confirm");
            var cancel = jQuery.uxlocale("Cancel");

            // retrieves the window (alert window) elements
            var window = jQuery(".window.window-alert", matchedObject);
            if (window.length == 0) {
                window = jQuery("<div class=\"window window-alert window-hide\">"
                        + "<h1></h1>"
                        + "<p class=\"single\"></p>"
                        + "<div class=\"window-buttons\">"
                        + "<span class=\"button button-cancel\">"
                        + cancel
                        + "</span>"
                        + "<span class=\"button button-confirm\">"
                        + confirm + "</span>" + "</div>");
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

            // sets the window properties and shows
            // button cancel
            windowHeader.html(confirm);
            windowContents.html(message);
            windowButtonCancel.show();

            // removes all the current event handlers from both the
            // confirm and the cancel buttons, this avoid possible errors
            // with multiple click event handlers
            windowButtonConfirm.unbind("click");
            windowButtonCancel.unbind("click");

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
            var windowButtonCancel = jQuery(".button-cancel", window);

            // registers for the click event on the button confirm
            windowButtonConfirm.click(function() {
                        // retrieves the element and uses it to gather
                        // the reference to the associated window
                        var element = jQuery(this);
                        var window = element.parents(".window");

                        // hides the window and calls the callback if
                        // defined, note that the result of the hide
                        // operation is considered to be success
                        window.uxwindow("hide", {
                                    "result" : "success"
                                });
                        callback && callback(true);
                    });

            // registers for the click event on the button cancel
            windowButtonCancel.click(function() {
                        // retrieves the element and uses it to gather
                        // the reference to the associated window
                        var element = jQuery(this);
                        var window = element.parents(".window");

                        // hides the window and calls the callback
                        // if defined, note that the result of the
                        // hide operation is considered to be cancel
                        window.uxwindow("hide", {
                                    "result" : "cancel"
                                });
                        callback && callback(false);
                    });

            // registers for the cancel event in the associated
            // window so that the proper callback is called with
            // the error flag if it's defined
            window.bind("cancel", function() {
                        callback && callback(false);
                    });
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

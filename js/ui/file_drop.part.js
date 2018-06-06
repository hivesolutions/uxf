if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxfiledrop = function(options) {
        // the default values for the plugin
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
            // registers the matched object for the drag enter event
            matchedObject.bind("dragenter", function(event) {
                // stops the event propagation and prevents
                // the default event operation
                event.stopPropagation();
                event.preventDefault();

                // triggers the file enter event
                matchedObject.triggerHandler("file_enter", []);
            });

            // registers the matched object for the drag leave event
            matchedObject.bind("dragleave", function(event) {
                // stops the event propagation and prevents
                // the default event operation
                event.stopPropagation();
                event.preventDefault();

                // triggers the file leave event
                matchedObject.triggerHandler("file_leave", []);
            });

            // registers the matched object for the drag over event
            matchedObject.bind("dragover", function(event) {
                // stops the event propagation and prevents
                // the default event operation
                event.stopPropagation();
                event.preventDefault();
            });

            // registers the matched object for the drop event
            matchedObject.bind("drop", function(event) {
                // stops the event propagation and prevents
                // the default event operation
                event.stopPropagation();
                event.preventDefault();

                // retrieves the data tranfer and the files
                // rom the original event
                var dataTransfer = event.originalEvent.dataTransfer;
                var files = dataTransfer.files;

                // triggers the file drop event
                matchedObject.triggerHandler("file_drop", [files]);
            });
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

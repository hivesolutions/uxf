if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uximageupload = function(element, options) {
        // the default values for the image upload
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
            // sets the matched object as a file drop
            // to get the file drop events
            matchedObject.uxfiledrop();
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // binds the matched object to the file enter
            // event
            matchedObject.bind("file_enter", function() {
                // retrieves the element
                var element = jQuery(this);

                // adds the drag class to the element
                element.addClass("drag");
            });

            // binds the matched object to the file leave
            // event
            matchedObject.bind("file_leave", function() {
                // retrieves the element
                var element = jQuery(this);

                // removes the drag class from the element
                element.removeClass("drag");
            });

            // binds the matched object to the file
            // drop event
            matchedObject.bind("file_drop", function(event, files) {
                // retrieves the element and saves it
                // as iamge upload (box)
                var element = jQuery(this);
                var imageUpload = element;

                // retrieves the files
                var _files = jQuery(files);

                // iterates over the files
                _files.each(function(index, element) {
                    // creates the image element and adds it to the image upload
                    var image = jQuery('<img class="image-upload-image" />');
                    imageUpload.append(image);

                    // creates a new file reader for reading the file
                    var fileReader = new FileReader();

                    // registers the file reader for the on load
                    // event
                    fileReader.onload = function(event) {
                        // sets the new src attribute in the image
                        image.attr("src", event.target.result);
                    };

                    // reads the file as a data url
                    fileReader.readAsDataURL(element);
                });

                // removes the drag class from the element
                element.removeClass("drag");
            });
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

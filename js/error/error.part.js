(function(jQuery) {
    jQuery.fn.uxerror = function(method, options) {
        // the regex for string character regex,
        // for string replacement
        var STRING_CHARACTER_REGEX = new RegExp("'", "g");

        // the default values for the error
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
            // iterates over all the matched objects
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // tries to retrieve the error from the matched object
                var error = _element.attr("data-error");

                // in case the error attribute is not defined
                if (!error) {
                    // returns immediately
                    return;
                }

                // tries to retrieve the no error class (flag)
                // from the matched object
                var noError = _element.hasClass("no-error");

                // in case the no error class is defined
                if (noError) {
                    // returns immediately
                    return;
                }

                // retrieves the parent form to retrieve
                // the error box to be shown
                var form = _element.parents("form");
                var errorBox = jQuery(".error-box");
                errorBox.show();

                // replaces the string character in the error
                // message list
                error = error.replace(STRING_CHARACTER_REGEX, "\"");

                // replaces the list joining character in order
                // to virtually "join" multiple lists
                var listJoinCharacter = new RegExp("\\]\\[", "g");
                error = error.replace(listJoinCharacter, ", ");

                try {
                    // parses the error structure
                    var errorStructure = jQuery.parseJSON(error);
                } catch (exception) {
                    // sets the error structure with no error enabled
                    // from the provided error (must be a simmple
                    // error string element)
                    var errorStructure = [];
                }

                // iterates over all the error messages in the
                // error structure (errors list)
                for (index = 0; index < errorStructure.length; index++) {
                    // retrieves the current error message
                    var errorMessage = errorStructure[index];

                    // creates the error description html
                    var errorDescriptionHtml = "<div class=\"error-description\">" + errorMessage +
                        "</div>";

                    // creates the error description element and adds it
                    // after the element
                    var errorDescription = jQuery(errorDescriptionHtml);
                    jQuery(errorDescriptionHtml).insertAfter(_element);
                }
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

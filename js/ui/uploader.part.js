(function(jQuery) {
    jQuery.fn.uxuploader = function(options) {
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
            // iterates over all the element to insert the
            // input and update it accordingly
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves teh various attributes
                // from the element
                var name = _element.attr("data-name");
                var action = _element.attr("data-action");
                var noText = _element.attr("data-no_text");

                // retrieves the original value of the element
                // and stores it under the original data value
                // so that it may be used latter when no value
                // is selected for the file value
                var original = _element.text();
                _element.data("original", original);

                // incase the action value is set the action form
                // must be create enclosing the element, after
                // the wrapping retrieves it for latter usage
                action
                        && _element.wrap("<form action=\""
                                + action
                                + "\" method=\"post\" enctype=\"multipart/form-data\" class=\"form\"></form>");
                var form = _element.parent(".form");

                // inserts the uploader input afeter the element
                // and then retrieves it from the element
                _element.after("<input name=\"" + name
                        + "\" type=\"file\" class=\"uploader-input\" />");
                var uploaderInput = jQuery("+ .uploader-input", _element);

                // in cas the current browser is of type mozilla
                // hides the uploader input (the click event
                // is going to be used)
                jQuery.browser.mozilla && uploaderInput.hide();

                // sets the initial position of the input
                _updateInputPosition(_element, options);

                // registers for the mouse enter event in the uploader input
                uploaderInput.mouseenter(function() {
                            // adds the selected class from the element
                            // and the reposition the element in the position
                            // where its meant to be set (as defined)
                            _element.addClass("selected");
                            _updateInputPosition(_element, options);
                        });

                // registers for the mouse enter out in the uploader input
                uploaderInput.mouseout(function() {
                            // removes the selected class from the element
                            // and the reposition the element in the position
                            // where its meant to be set (as defined)
                            _element.removeClass("selected");
                            _updateInputPosition(_element, options);
                        });

                // registers for the change event in the uploader
                // event (detects file changes)
                uploaderInput.change(function() {
                            // in case there is an action value set (needs
                            // to submit the upper form)
                            if (action) {
                                // submits the form (auto submit), only submits
                                // it in case it exists
                                form.submit();
                            }
                            // otherwise the input must be correctly updated
                            // (sets position and updates value)
                            else {
                                // retrieves the input value and sets it as the
                                // new "label" in the element
                                var inputValue = uploaderInput.attr("value")
                                        || original;
                                !noText && _element.html(inputValue);

                                // updates the input position for the element, because
                                // the change in the contents size requires so
                                _updateInputPosition(_element, options);

                                // retrieves the reference to the upload object and uses
                                // it to retrieve the files reference and uses it in the
                                // triggering of the file change event on the element
                                var uploader = uploaderInput[0];
                                var files = uploader.files
                                        ? uploader.files
                                        : [];
                                _element.triggerHandler("files_change", [files]);
                            }
                        });

                // registers for the click event in the
                // element (for event propagation)
                _element.click(function() {
                            // verifies if the element is disabled, for such case the
                            // click event should be ignored and so the control flow
                            // returns immediately to avoid any other behavior
                            var isDisabled = _element.hasClass("disabled");
                            if (isDisabled) {
                                return;
                            }

                            // triggers the click event in
                            // the uploader input (propagation)
                            uploaderInput.trigger("click");
                        });

                // registers for the disavled event in the element
                // to hide the uploader input from the layout
                _element.bind("disabled", function() {
                            uploaderInput.hide();
                        });

                // registers for the enabled event in the element
                // to (re)-show the upload input again the layout
                _element.bind("enabled", function() {
                            uploaderInput.show();
                        });

                // registers for the mouse enter event on
                // the element so that the element is repositioned in the
                // position it's expected to be (as specified)
                _element.mouseenter(function() {
                            _updateInputPosition(_element, options);
                        });

                // registers for the mouse oute event (leave element) on
                // the element so that the element is repositioned in the
                // position it's expected to be (as specified)
                _element.mouseout(function() {
                            _updateInputPosition(_element, options);
                        });
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
        };

        var _updateInputPosition = function(marchedObject, options) {
            // retrievves the uploader input
            var uploaderInput = jQuery("+ .uploader-input", marchedObject);

            // retrieves the matched (outer) width, to be used
            // for the positioning of the input element
            var isVisible = marchedObject.is(":visible");
            var width = isVisible ? marchedObject.outerWidth() : 0;

            // sets the uploader input css attributes according
            // to the matched object attributes
            uploaderInput.css("width", width + "px");
            uploaderInput.css("margin-left", (width * -1) + "px");
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

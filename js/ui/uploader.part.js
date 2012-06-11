(function($) {
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
                            _element.addClass("selected");
                        });

                // registers for the mouse enter out in the uploader input
                uploaderInput.mouseout(function() {
                            // removes the selected class from the element
                            _element.removeClass("selected");
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
                                var inputValue = uploaderInput.attr("value");
                                _element.html(inputValue);

                                // updates the input position for the element
                                _updateInputPosition(_element, options);
                            }
                        });

                // registers for the click event in the
                // element (for event propagation)
                _element.click(function() {
                            // triggers the click event in
                            // the uploader input (propagation)
                            uploaderInput.trigger("click");
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
            var width = marchedObject.outerWidth();

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

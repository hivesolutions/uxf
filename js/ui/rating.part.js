(function(jQuery) {
    jQuery.fn.uxrating = function(method, options) {
        // the default values for the text field
        var defaults = {};

        // sets the default method value
        var method = method ? method : "default";

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
            // sets the ux global object representation as rating
            // field, this value may be used latter for fast ux
            // object type access (hash based conditions)
            matchedObject.uxobject("rating");

            // iterates over each of the selected rating element to
            // create the structure for each of them
            matchedObject.each(function(index, element) {
                // retrieves the reference to the current element in
                // iterateion that is going to be constructed
                var _element = jQuery(this);

                // retrieves the value of the count attribute and tries
                // to parse it as an integer value in case it fails defaults
                // the current value to the zero value
                var count = _element.attr("data-count");
                count = count ? parseInt(count) : 0;

                // retrieves the currently set value (default one) and tries
                // to parse it as an integer value defaulting to zero in case
                // parsing was not possible (default behaviour)
                var value = _element.attr("data-value");
                value = value ? parseInt(value) : 0;

                // sets the original count value in the element so that latter
                // it's faster to retrieve it (no parsing required)
                _element.data("count", count);
                _element.data("default", value);

                // iterates over the range of requested rating values to
                // create the various values (as requested)
                for (var index = 0; index < count; index++) {
                    _element.append("<div class=\"rating-item\"></div>");
                }

                // selects the initial value by triggering the value change
                // function with the original (default) value
                _value(_element, value);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the complete set of rating items (elements)
            // from the complete set of matched object
            var items = jQuery(".rating-item", matchedObject);

            // registers for the reset event on the current element so
            // that the default value is set instead of the current one
            matchedObject.bind("_reset", function() {
                var element = jQuery(this);
                _value(element, 0);
            });

            // register for the mouse over event in the rating elements
            // to be able to focus on the various items
            items.mouseover(function() {
                var element = jQuery(this);
                var rating = element.parents(".rating");
                var _index = element.index();
                _focus(rating, _index);
            });

            // registers for the mouse out event in the rating items so
            // that the behaviour is returned to normal (no more hover)
            items.mouseout(function() {
                var element = jQuery(this);
                var rating = element.parents(".rating");
                _blur(rating, options);
            });

            // registers for the click operation in the items
            // so that the value is correctly set on click
            items.click(function() {
                var element = jQuery(this);
                var rating = element.parents(".rating");
                var _index = element.index();
                _value(rating, _index + 1);
            });

            // iterates over the complete set of elements to be able
            // to register for the specific elements of each component
            matchedObject.each(function(index, element) {
                // retrieves the current element in iteration that is
                // goint to be used as the context
                var _element = jQuery(this);

                // retrieves the parent form to the current rating
                // element, this form must be registered so that it's
                // possible to create a hiden value element that represents
                // the rating component in terms of form submission
                var parentForm = _element.parents("form");

                // registers for the pre submit operation of the parent form
                // of the current element so that the "virtual" hidden input
                // field may be created before the form submission
                parentForm.bind("pre_submit", function() {
                    // retrieves both the name and the vale of the current rating
                    // element to be used in the creation of the new virtual element
                    // that is going to represent the rating element
                    var name = _element.attr("data-name");
                    var value = _element.attr("data-value");

                    // in case the name is not defined or the value is unset must
                    // return immediately in order to avoid any more problems
                    if (!name) {
                        return;
                    }

                    // tries to retrieve and remove any previously existing
                    // hidden element representing the current value, this
                    // avoids problems whild using ajax based form submit
                    var previous = _element.next("input[type=hidden][name=\"" + name +
                        "\"]");
                    previous.remove();

                    // creates the hidden input field that is going to represent the
                    // rating element with the proper name and value set
                    _element.after("<input type=\"hidden\" name=\"" + name + "\" value=\"" +
                        value + "\" />");
                });
            });
        };

        var _value = function(matchedObject, value) {
            // sets the passed matched object as the current element
            // to be used and then uses it to retrieve the items
            var element = matchedObject;
            var items = jQuery(".rating-item", element);

            // retrieves the number of raing items for the current
            // rating component (to be used latter)
            var count = element.data("count");

            // removes both te hover and the inactive class from the
            // complete list of rating items no hover or inactive when
            // the value is selected (defined be specification)
            items.removeClass("hover");
            items.removeClass("inactive");

            // iterates over all the items until the provided values so
            // that these items are "marked" as active
            for (var index = 0; index < value; index++) {
                var item = jQuery(items[index]);
                item.addClass("active");
            }

            // iterates over the second part of the range from the target
            // value until the removing the active "mark" from them
            for (var index = value; index < count; index++) {
                var item = jQuery(items[index]);
                item.removeClass("active");
            }

            // updates the value of the element with the new value, this value
            // will latter be used in the form submission
            element.attr("data-value", value);
        };

        var _focus = function(matchedObject, _index) {
            // sets the passed matched object as the current element
            // to be used and then uses it to retrieve the items
            var element = matchedObject;
            var items = jQuery(".rating-item", element);

            // retrieves the number of raing items for the current
            // rating component (to be used latter)
            var count = element.data("count");

            // iterates over the complete set of items until the provided
            // index marking them as "hovered" (as expected)
            for (var index = 0; index < _index + 1; index++) {
                var item = jQuery(items[index]);
                item.addClass("hover");
            }

            // iterates over the "remaning" set of items in order to mark
            // them as inactive because they are not hovered
            for (var index = _index + 1; index < count; index++) {
                var item = jQuery(items[index]);
                item.addClass("inactive");
            }
        }

        var _blur = function(matchedObject, options) {
            // sets the passed matched object as the current element
            // to be used and then uses it to retrieve the items
            var element = matchedObject;
            var items = jQuery(".rating-item", element);

            // removes the hover and the inactive classes from the current
            // set of items as none of them is selected (focused) now
            items.removeClass("hover");
            items.removeClass("inactive");
        }

        // switches over the method
        switch (method) {
            case "default":
                // initializes the plugin
                initialize();

                // breaks the switch
                break;
        }

        // returns the object
        return this;
    };
})(jQuery);

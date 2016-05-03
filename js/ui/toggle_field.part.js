/**
 * jQuery toggle field plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a toggle field component.
 *
 * @name jquery-toggle-field.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2016 Hive Solutions Lda.
 * @license Apache License, Version 2.0 - http://www.apache.org/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxtogglefield = function(method, options) {
        // the default values for the button
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
            // wraps the matched object around the the toggle field
            // element so that the buttons may be added, then retrieves
            // the "just" created toggle field and adds the button
            // to it (to be used for toggling the state)
            matchedObject.wrap("<div class=\"toggle-field\"></div>");
            var toggleField = matchedObject.parents(".toggle-field");
            toggleField.prepend("<div class=\"button\"></div>");

            // sets the ux global object representation as toggle
            // field, this value may be used latter for fast ux
            // object type access (hash based conditions)
            toggleField.uxobject("togglefield");

            // removes the toggle field from the text field base element
            // and then add the text field class and registers it as a text field
            matchedObject.removeClass("toggle-field");
            matchedObject.addClass("text-field");
            matchedObject.uxtextfield();

            // iterates over all the matched objects to be able to start
            // their modes structure  and layout
            matchedObject.each(function(index, element) {
                // retrieves the current element and uses it to retrieve
                // the parent toggle field
                var _element = jQuery(this);
                var toggleField = _element.parents(".toggle-field");

                // verifies if the current element is meant to be
                // positioned to the left and in case it's meant
                // adds the proper class to the toggle field
                var isLeft = _element.hasClass("toggle-left");
                isLeft && toggleField.addClass("toggle-left");

                // verifies if the current element is considered
                // to be small and if that's the case propagates
                // the value to the upper toggle field
                var isSmall = _element.hasClass("small");
                isSmall && toggleField.addClass("small");
                isSmall && _element.removeClass("small");

                // verifies if the current element is considered
                // to be large and if that's the case propagates
                // the value to the upper toggle field
                var isLarge = _element.hasClass("large");
                isLarge && toggleField.addClass("large");
                isLarge && _element.removeClass("large");

                // retrieves the value of the attribute that defines
                // the various modes in case the value is not defined
                // returns immediately otherwise trims the value and
                // splits it arround the separator value
                var modesS = _element.attr("data-modes");
                if (!modesS) {
                    modesS = "percent";
                }
                modesS = modesS.trim();
                var modes = modesS.split(",");
                toggleField.data("modes", modes);

                // sets the initial mode in the toggle field this should
                // be the first index in the modes sequence
                _setMode(toggleField, options, 0);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the toggle field associated with the matched object
            // and then uses it to retrieve the minus and plus buttons
            var toggleField = matchedObject.parents(".toggle-field");
            var button = jQuery(".button", toggleField);

            // registers for the click event on the button
            button.click(function() {
                // retrieves the current element and the associated
                // toggle field for changes
                var element = jQuery(this);
                var toggleField = element.parents(".toggle-field");
                var textField = jQuery(".text-field", toggleField);

                // verifies if the text field element is currently
                // and in case it's ignores the click event, returning
                // immediately the control to the caller method
                var isDisabled = textField.hasClass("disabled");
                isDisabled = isDisabled || element.hasClass("disabled");
                if (isDisabled) {
                    return;
                }

                // retrieves both the modes sequence and the currently
                // set index to be used to calculates the new index
                var modes = toggleField.data("modes");
                var index = toggleField.data("index");

                // calculates the new mode index value and sets it in
                // the (parent) toggle field, note that the text field
                // is focused while the operation is done this ensures
                // total text field "emulation"
                var _index = index == modes.length - 1 ? 0 : index + 1;
                textField.focus();
                _setMode(toggleField, options, _index);
                textField.blur();
            });

            // binds the toggle field do the enabled event
            // so that is possible to propagate the enabling
            toggleField.bind("enable enabled", function() {
                // retrieves the current element and the associated
                // text field and button elements
                var element = jQuery(this);
                var textField = jQuery(".text-field", element);
                var buttons = jQuery(".button", element);

                // enables the text field and the buttons associated
                // with the element (toggle field)
                textField.uxenable();
                buttons.uxenable();
            });

            // binds the toggle field do the disabled event
            // so that is possible to propagate the disabling
            toggleField.bind("disable disabled", function() {
                // retrieves the current element and the associated
                // text field and button elements
                var element = jQuery(this);
                var textField = jQuery(".text-field", element);
                var buttons = jQuery(".button", element);

                // disables the text field and the buttons associated
                // with the element (toggle field)
                textField.uxdisable();
                buttons.uxdisable();
            });
        };

        var _reset = function(matchedObject, options) {
            // sets the mode to the oginal zero based index
            // so that the original mode is set
            _setMode(matchedObject, options, 0);
        };

        var _setMode = function(matchedObject, options, index) {
            // retrieves the complete set of modes for the current
            // matched object and in case none is set returns immediately
            var modes = matchedObject.data("modes", modes);
            if (!modes) {
                return;
            }

            // retrieves the underlying text field for the current object
            // it's going to be used in event triggering
            var textField = jQuery(".text-field", matchedObject);

            // retrieves the button associated with the matched object
            // and then iterates over the complete set of modes to remove
            // them from the button
            var button = jQuery(".button", matchedObject);
            for (var _index = 0; _index < modes.length; _index++) {
                var mode = modes[_index];
                button.removeClass(mode);
            }

            // retrieves the "target" mode based on the defined index and
            // adds it as a class to the button
            var mode = modes[index];
            button.addClass(mode);

            // updates the index and mode values for the current matched
            // object so that any further calls will "remember" it
            matchedObject.data("index", index);
            matchedObject.data("mode", mode);
            textField.data("mode", mode);

            // triggers the mode change event so that any listening event
            // handler will be notified about the change, not that the
            // event is triggered both in the matched object and in its
            // containing text field
            matchedObject.triggerHandler("mode_change", [mode, index]);
            textField.triggerHandler("mode_change", [mode, index]);
        };

        // switches over the method
        switch (method) {
            case "reset":
                // resets the matched object to the value
                // in the current state
                _reset(matchedObject, options);
                return true;

            case "default":
                // initializes the plugin
                initialize();
                break;
        }

        // returns the object
        return this;
    };
})(jQuery);

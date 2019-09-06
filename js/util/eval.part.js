if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxeval = function(element, method, options) {
        // the defaut timeout for eval
        var DEFAULT_TIMEOUT = 1000;

        // the default values for the eval
        var defaults = {
            timeout: DEFAULT_TIMEOUT
        };

        // sets the default method value
        method = method || "default";

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
         * Creates the necessary HTML for the component.
         */
        var _appendHtml = function() {
            // iterates over all the elements in the matched object
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the element eval attribute or HTML
                // as the eval string
                var evalString = _element.attr("data-eval")
                    ? _element.attr("data-eval")
                    : _element.html();

                // in case the eval string is not valid
                if (!evalString) {
                    // returns immediately
                    return;
                }

                // trims the eval string
                evalString = evalString.trim();

                // sets the eval string in the element
                _element.data("eval_string", evalString);

                // evaluates the element components
                _eval(_element, options);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // iterates over all the elements in the matched object
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the timeout for evaluation, first
                // trying to use the timeout attribute and then
                // falling back to the timeout option
                var timeout = _element.attr("data-timeout");
                var timeoutInteger = parseInt(timeout);
                var _timeout = isNaN(timeoutInteger) ? options.timeout : timeoutInteger;

                // retrieves the value of the continuous attribute
                // (flag) of the element
                var continuous = _element.attr("data-continuous");

                // retrieves the value of the selector
                var selector = _element.attr("data-selector");

                // sets the interval for continuous evaluation
                // in case the continuous flag is set and there
                // is no (key) selector defined
                continuous &&
                    !selector &&
                    setInterval(function() {
                        // evaluates the element components
                        _eval(_element, options);
                    }, _timeout);

                // retrieves the selector using a fall back
                // to the body element selector then uses the
                // selector to retrieve the trigger element
                selector = selector || "body";
                var triggerElement = jQuery(selector);

                // retrieves the various event handlers from the element
                // the handlers are set in case the eval has been run already
                var keyUpHandler = _element.data("evalKeyUpHandler");
                var changeHandler = _element.data("evalChangeHandler");
                var valueChangedHandler = _element.data("evalValueChangedHandler");

                // unbinds the various event handlers from the selected element
                // for the handlers that are already bound (defined in the element)
                keyUpHandler && triggerElement.unbind("keyup", keyUpHandler);
                changeHandler && triggerElement.unbind("change", changeHandler);
                valueChangedHandler && triggerElement.unbind("value_change", valueChangedHandler);

                // sets the key up event handler in the selector in
                // case the continuous flag is set
                continuous &&
                    triggerElement.keyup(
                        (keyUpHandler = function() {
                            // evaluates the element components
                            _eval(_element, options);
                        })
                    );

                // sets the change event handler in the selector in
                // case the continuous flag is set
                continuous &&
                    triggerElement.change(
                        (changeHandler = function() {
                            // evaluates the element components
                            _eval(_element, options);
                        })
                    );

                // sets the vlaue change event handler in the selector in
                // case the continuous flag is set
                continuous &&
                    triggerElement.bind((valueChangedHandler = "value_change"), function() {
                        // evaluates the element components
                        _eval(_element, options);
                    });

                // saves the various handlers in the element
                // so that any further eveal request will unbind
                // these event handlers
                _element.data("evalKeyUpHandler", keyUpHandler);
                _element.data("evalChangeHandler", changeHandler);
                _element.data("evalValueChangedHandler", valueChangedHandler);
            });
        };

        /**
         * Evaluates the eval string in the matched object emmiting the
         * resulting value to the HTML contents of it. The evaluation of the
         * matched object is considered dangerous and must be used carefully.
         *
         * @param {Element}
         *            matchedObject The reference to the current matched object.
         * @param {Map}
         *            options The map of options to be used.
         */
        var _eval = function(matchedObject, options) {
            // retrieves the eval string from the
            // matched object
            var evalString = matchedObject.data("eval_string");

            // "evals" the eval string retrieving the (eval) result
            // eslint-disable-next-line no-eval
            var evalResult = eval(evalString);

            // checks if the matched object is of type input
            // (attribute value oriented) and if it's a text
            // field component
            var isInput = matchedObject.is("input");
            var isTextField = matchedObject.hasClass("text-field");

            // retrieves the current matched object
            // value or HTML value and compares it to the eval
            // result to check for differences and then checks
            // if the current element has focus
            var current = isInput ? matchedObject.val() : matchedObject.html();
            var different = evalResult !== current;
            var hasFocus = matchedObject.hasClass("focus");

            // in case the value is not different or in case there's
            // currently focus on it no need to change it (no propagation)
            if (!different || hasFocus) {
                // returns immediately so that no setting
                // is done in the component
                return;
            }

            // in case the target component is a text field
            // the proper access method must be used
            if (isTextField) {
                // changes the value of the target component
                // according to the result of the eval
                matchedObject.uxtextfield("value", {
                    value: evalResult
                });
            }
            // in case the target component is an input field
            // the value attribute must be changed
            else if (isInput) {
                // changes the value attribute of the target component
                // according to the result of the eval
                matchedObject.val(evalResult);
            }
            // otherwise it's a general component and the HTML
            // code must be changed
            else {
                // changes the HTML code of the target component
                // according to the result of the eval
                matchedObject.html(evalResult);
            }
        };

        // switches over the method
        switch (method) {
            case "eval":
                // evaluates the matched object
                _eval(matchedObject, options);

                // breaks the switch
                break;

            case "default":
                // initializes the plugin
                initialize();

                // breaks the switch
                break;
        }

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

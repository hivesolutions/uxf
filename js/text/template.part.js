(function($) {
    jQuery.fn.uxtemplate = function(attributes, options) {
        // the default values for the template
        var defaults = {};

        // sets the default attributes value
        var attributes = attributes ? attributes : {};

        // sets the default options value
        var options = options ? options : {
            apply : true,
            nullify : true,
            defaultValue : ""
        };

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
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
        };

        var _applyTemplate = function(element) {
            // retrieves the ux apply option
            var apply = options["apply"];

            // clones the element creating the template
            // element value
            var templateElement = element.clone();

            // applies the template to the template element, retrieving
            // the template contents
            var templateContents = __applyTemplate(templateElement, attributes);

            // set the template contents in the template element
            // and then removes the template class from it
            templateElement.html(templateContents);
            templateElement.removeClass("template");

            // applies the ux in the element, in case the
            // apply flag is set
            apply && templateElement.uxapply();

            // re-sets the the "obfuscated" name and src
            // attributes to the original form
            templateElement.uxattr("data-name", "name");
            templateElement.uxattr("data-src", "src");

            // returns the template element (cloned element)
            return templateElement;
        }

        /**
         * Applies the given attributes to the given template contents string.
         * The attributes map should contain a list of attribute to be applied
         * to the template. The nullify string may control what value should be
         * used to describe a null value (empty string or null string).
         *
         * @param {String}
         *            templateContents The string containing the template
         *            contents.
         * @param {Map}
         *            attributes The map of attributes to be used.
         * @param {Boolean}
         *            nullify If the attribute should be nullified in case it's
         *            null.
         * @param {String}
         *            defaultValue The default value to be used in case a null
         *            or undefined value is resolved from the current map of
         *            values in template rendering.
         * @param {String}
         *            baseKey The base key value to be used in all of the keys.
         * @return {String} The resulting template contents (after apply).
         */
        var _applyAttributes = function(templateContents, attributes, nullify, defaultValue, baseKey) {
            // retrieves the various default value to be used
            // in the template rendering
            var defaultValue = defaultValue ? defaultValue : "";
            var baseKey = baseKey ? baseKey : "";

            // converts the attribute to (jquery) element
            var attributesElement = jQuery(attributes);

            // iterates over all the attributes
            for (var key in attributes) {
                // retrieves the value of the attribute to be set
                var attributeValue = attributes[key];

                // creates the "final" key value from the
                // base key value
                key = baseKey + key;

                // in case the attribute value is null
                // (special case)
                if (attributeValue == null) {
                    // sets the appropriate attribute value according
                    // to the nullify value
                    attributeValue = nullify ? defaultValue : "null";
                }

                // retrieves the type of the attribute value
                // for later checking
                var attributeValueType = typeof(attributeValue);

                // in case the attribute value is
                // an object
                if (attributeValueType == "object") {
                    // re-calculates the (new) base key to be
                    // sued in next iteration
                    var newBaseKey = key + ".";

                    // applies the attributes to the template contens
                    // based in the current attribute value and with
                    // the new base key value
                    templateContents = _applyAttributes(templateContents,
                            attributeValue, nullify, defaultValue, newBaseKey);
                }
                // otherwise the attribute value must be
                // a simple basic type
                else {
                    // creates the regular expression for globar search on the key
                    var keyRegex = new RegExp("%\\[" + key + "\\]", "g");

                    // replaces the template strings in the html
                    templateContents = templateContents.replace(keyRegex,
                            attributeValue);
                }
            }

            // returns the templte contents
            return templateContents;
        };

        var __applyTemplate = function(templateElement, attributes) {
            // retrieves the nullify option
            var nullify = options["nullify"];
            var defaultValue = options["defaultValue"];

            // retrirves the for each elments for the current template element
            var foreachElements = jQuery(".template-foreach", templateElement).not(".template-foreach .template-foreach");

            // iterates over all the for each elements
            foreachElements.each(function(index, element) {
                        // retrieves the element reference
                        var _element = jQuery(element);

                        // retrieves the variable for the element
                        var variableName = _element.attr("data-variable");
                        var variable = attributes[variableName];

                        // retrieves the target element (type) for the for
                        // each substituin
                        var target = _element.attr("data-target");

                        // start the for each buffer
                        var forEachBuffer = "";

                        // iterates over all the items in the variable
                        for (var variableIndex in variable) {
                            // retrieves the (current) variable item
                            var variableItem = variable[variableIndex];

                            // creates the template element
                            var _templateElement = _element.clone();

                            // applies the template to the current element
                            var forEachTemplateElement = __applyTemplate(
                                    _templateElement, variableItem);

                            // adds the new element to the for each
                            // buffer string value
                            forEachBuffer += "<" + target + ">"
                                    + forEachTemplateElement + "</" + target
                                    + ">";
                        }

                        // replaces the element value with the value
                        // in the for each buffer
                        _element.replaceWith(forEachBuffer);
                    });

            // retrieves the template contents
            var templateContents = templateElement.html();

            // applies the attributes to the template contents
            // in case the template contents is correctly set
            templateContents = templateContents
                    ? _applyAttributes(templateContents, attributes, nullify,
                            defaultValue)
                    : templateContents;

            // returns the template contents
            return templateContents;
        };

        // initializes the plugin
        initialize();

        // applies the template to the matched object
        // and retrieves the resulting template item
        var templateItem = _applyTemplate(matchedObject, attributes);

        // returns the template item
        return templateItem;
    };
})(jQuery);

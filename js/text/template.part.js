if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxtemplate = function(attributes, options) {
        // the default values for the template
        var defaults = {};

        // sets the default attributes value
        attributes = attributes || {};

        // sets the default options value
        options = options || {
            apply: true,
            nullify: true,
            defaultValue: ""
        };

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
        var _registerHandlers = function() {};

        var _applyTemplate = function(element) {
            // retrieves the ux apply option, taking into account
            // if the element contains any reference to the no apply
            // attribute that would disable the apply operation
            var apply = options["apply"];
            apply = element.attr("data-no_apply") ? false : apply;

            // clones the element creating the template element value
            var templateElement = element.clone();

            // applies the template to the template element, retrieving
            // the template contents, this operation should replace all
            // the variable references in the template
            var templateContents = __applyTemplate(templateElement, attributes);

            // set the template contents in the template element and
            // then removes the template class and the no apply attribute
            templateElement.html(templateContents);
            templateElement.removeClass("template");
            templateElement.removeAttr("data-no_apply");

            // re-sets the the "obfuscated" name and src aattributes to
            // the original form, to be properly used
            templateElement.uxattr("data-name", "name");
            templateElement.uxattr("data-class", "class");
            templateElement.uxattr("data-src", "src");

            // applies the ux in the element, in case the/ apply flag is set,
            // note that it might be/ disabled using either the options of the
            // special attribute in template
            apply && templateElement.uxapply();

            // returns the template element (cloned element)
            return templateElement;
        };

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
         * @param {Boolean}
         *            localize If the localization infra-structure should be
         *            applied to the attribute value before it's rendered.
         * @param {String}
         *            defaultValue The default value to be used in case a null
         *            or undefined value is resolved from the current map of
         *            values in template rendering.
         * @param {String}
         *            baseKey The base key value to be used in all of the keys.
         * @return {String} The resulting template contents (after apply).
         */
        var _applyAttributes = function(templateContents, attributes, nullify, localize, defaultValue, baseKey) {
            // retrieves the various default value to be used
            // in the template rendering
            defaultValue = defaultValue || "";
            baseKey = baseKey || "";

            // iterates over all the attributes
            for (var key in attributes) {
                // retrieves the value of the attribute to be set
                // and that it's going to be processed in this
                // iterateion, required by value
                var attributeValue = attributes[key];

                // creates the "final" key value from the
                // base key value
                key = baseKey + key;

                // in case the attribute value is null
                // (special case)
                if (attributeValue === null) {
                    // sets the appropriate attribute value according
                    // to the nullify value
                    attributeValue = nullify ? defaultValue : "null";
                }

                // retrieves the type of the attribute value
                // for later checking
                var attributeValueType = typeof attributeValue;

                // in case the attribute value is
                // an object
                if (attributeValueType === "object") {
                    // re-calculates the (new) base key to be
                    // sued in next iteration
                    var newBaseKey = key + ".";

                    // applies the attributes to the template contens
                    // based in the current attribute value and with
                    // the new base key value
                    templateContents = _applyAttributes(templateContents,
                        attributeValue, nullify, localize, defaultValue,
                        newBaseKey);
                }
                // otherwise the attribute value must be a simple basic type
                // and the normal replace strategy is applied
                else {
                    // creates the regular expression for global search on the key
                    // note that this regex should match any possible
                    var keyRegex = new RegExp("%\\[(" + key + ")(:[a-z]+)?\\]", "g");

                    // in case the localize flag is set, tries to localize the
                    // current attribute value into the current locale, the return
                    // value should default to the proper value in case of failure
                    var attributeLocale = localize ? jQuery.uxlocale(attributeValue) : attributeValue;

                    // creates the replacer function that is going to be used by
                    // the replace operation to determine if the raw string should
                    // be used or if instead the localized should be used
                    var replacer = function(match) {
                        var matchSplit = match.split(":");
                        var flags = matchSplit.length > 1 ? matchSplit[1] : null;
                        if (flags === null) {
                            return attributeLocale;
                        }
                        var isRaw = flags.indexOf("r") !== -1;
                        return isRaw ? attributeValue : attributeLocale;
                    };

                    // replaces the template strings in the html with the proper attribute
                    // values this may be an expesive operation in case it's repeated
                    // frequently for a lot of times (modify with care)
                    templateContents = templateContents.replace(keyRegex,
                        replacer);
                }
            }

            // returns the templte contents
            return templateContents;
        };

        var __applyTemplate = function(templateElement, attributes) {
            // retrieves the various options for the template
            // rendering operation that will condition the
            // execution of the rendering
            var nullify = options["nullify"];
            var localize = options["localize"];
            var defaultValue = options["defaultValue"];

            // retrirves the for each elments for the current template element
            var foreachElements = jQuery(".template-foreach", templateElement).not(
                ".template-foreach .template-foreach");

            // iterates over all the for each elements
            foreachElements.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the variable for the element
                var variableName = _element.attr("data-variable");
                var variable = attributes[variableName];

                // retrieves the target element (type) for the for
                // each substitution
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
                    forEachBuffer += "<" + target + ">" + forEachTemplateElement + "</" + target +
                        ">";
                }

                // replaces the element value with the value
                // in the for each buffer
                _element.replaceWith(forEachBuffer);
            });

            // retrieves the template contents
            var templateContents = templateElement.html();

            // applies the attributes to the template contents
            // in case the template contents is correctly set
            templateContents = templateContents ? _applyAttributes(
                templateContents, attributes, nullify, localize,
                defaultValue) : templateContents;

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

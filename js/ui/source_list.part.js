/**
 * jQuery source list plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a source list component.
 *
 * @name jquery-source-list.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010-2012 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function($) {
    jQuery.fn.uxsourcelist = function(method, options) {
        // the default values for the panel
        var defaults = {};

        // sets the default method value
        var method = method ? method : "default";

        // sets the default options value
        var options = options ? options : {
            numberOptions : null,
            filterOptions : true
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
            // retrieves the options values
            var numberOptions = options["numberOptions"];
            var filterOptions = options["filterOptions"];

            // creates the text field element and the select list
            var textField = jQuery("<input type=\"text\" class=\"text-field\" />");
            var selectList = jQuery("<ul class=\"select-list\"></ul>");

            // starts both the text field and the select list and then
            // adds them to the source list (matched object)
            textField.uxtextfield();
            textField.uxselectlist();
            matchedObject.append(textField);
            matchedObject.append(selectList);

            // iterates over each of the matched objects to start
            // its internal structures and element data
            matchedObject.each(function(index, element) {
                        // retrieves the current element for iteration
                        var _element = jQuery(element);

                        // updates the element data with parameters to
                        // be used in the component actions
                        _element.data("number_options", numberOptions);
                        _element.data("filter_options", filterOptions);

                        // runs the update operation using the current
                        // source list with the set of options
                        _update(_element, options);
                    });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the source list elements
            var sourceList = matchedObject;
            var textField = jQuery(".text-field", sourceList);

            // registers for the key down even on the text field
            textField.keyup(function(event) {
                        // retrieves th current element
                        var element = jQuery(this);
                        var sourceList = element.parents(".source-list");

                        // runs the update operation using the current
                        // source list with the set of options
                        _update(sourceList, options);
                    });
        };

        var _update = function(matchedObject, options) {
            // retrieves the source list elements
            var sourceList = matchedObject;
            var dataSource = jQuery(".data-source", sourceList);
            var textField = jQuery(".text-field", sourceList);
            var selectList = jQuery(".select-list", sourceList);

            // retrieves the current source list value
            var value = sourceList.data("value");

            // retrieves both the display, value and link attributes
            var displayAttribute = matchedObject.attr("data-display_attribute");
            var valueAttribute = matchedObject.attr("data-value_attribute");
            var linkAttribute = matchedObject.attr("data-link_attribute");

            // retrieves the filter attributes
            var filterAttributes = matchedObject.data("filter_attributes");

            // retrieves the number of options values (it's a string value)
            var _numberOptions = matchedObject.attr("data-number_options");

            // retrieves the number of options to display
            // and if they should be filtered
            var numberOptions = matchedObject.data("number_options");
            var filterOptions = matchedObject.data("filter_options");

            // retrieves the text field value
            var textFieldValue = textField.attr("value");

            // in case the value did not change (no need to
            // show the contents)
            if (textFieldValue == value) {
                // returns immediately
                return;
            }

            // nullifies the number of options in case it's necessary
            numberOptions = filterOptions ? numberOptions : null;
            numberOptions = _numberOptions
                    ? parseInt(_numberOptions)
                    : numberOptions;

            // runs the query in the data source
            dataSource.uxdataquery({
                        filterString : textFieldValue,
                        filterAttributes : filterAttributes,
                        startRecord : 0,
                        numberRecords : numberOptions
                    }, function(validItems, moreItems) {
                        // in case the valid items value
                        // is not valid (error occurred)
                        if (!validItems) {
                            // returns immediately
                            return;
                        }

                        // empties (clears) the select list
                        selectList.empty()

                        // iterates over all the valid and filtered items
                        // to adds them to the select list
                        for (var index = 0; index < validItems.length; index++) {
                            // retrieves the current item (from the valid items)
                            var currentItem = validItems[index];

                            // retrieves both the display and the value
                            // attributes for the current item
                            var currentDisplayAttribute = displayAttribute
                                    ? currentItem[displayAttribute]
                                    : currentItem;
                            var currentValueAttribute = valueAttribute
                                    ? currentItem[valueAttribute]
                                    : currentItem;
                            var currentLinkAttribute = valueAttribute
                                    ? currentItem[linkAttribute]
                                    : null;

                            // creates the base template item from
                            // the current item
                            var templateItem = jQuery("<li data-display=\""
                                    + currentDisplayAttribute
                                    + "\" data-value=\""
                                    + currentValueAttribute + "\">"
                                    + currentDisplayAttribute + "</li>");

                            // sets the current item in the template item data
                            // so that it can be used for latter template rendering
                            templateItem.data("item", currentItem);

                            // sets the data link attribute in the
                            // template item in case it's valid
                            currentLinkAttribute
                                    && templateItem.attr("data-link",
                                            currentLinkAttribute);

                            // adds the template item item to the
                            // select list
                            selectList.append(templateItem);
                        }

                        // runs the select list initializer again
                        // to update the event handlers in the items
                        selectList.uxselectlist();

                        // updates the source list value with the current
                        // text field value
                        sourceList.data("value", textFieldValue);
                    });
        };

        // switches over the method
        switch (method) {
            case "default" :
                // initializes the plugin
                initialize();

                // breaks the switch
                break;
        }

        // returns the object
        return this;
    };
})(jQuery);

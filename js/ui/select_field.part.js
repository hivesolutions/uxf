/**
 * jQuery select field plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a select field component.
 *
 * @name jquery-select-field.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2014 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxselectfield = function(method, options) {
        // the default values for the select field
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
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the text field and the data source
            var textField = jQuery(".text-field", matchedObject);
            var dataSource = jQuery("> .data-source", matchedObject);

            // registers for the change in the text field
            // (select) this occurs when a new option is selected
            textField.change(function() {
                        // retrieves the current element and updates
                        // the current values
                        var element = jQuery(this);
                        _update(element);
                    });

            // iterates over all the matched objects
            matchedObject.each(function(index, element) {
                // retrieves the element reference and the
                // associated data source
                var _element = jQuery(element);
                var textField = jQuery(".text-field", element);
                var dataSource = jQuery("> .data-source", element);

                // retrieves the name of the value to be used for
                // the comparision and then retrieves the name of
                // the attribute to be used in the display
                var value = _element.attr("data-value");
                var display = _element.attr("data-display") || value;

                // binds the data source to the data ready event
                // in order to perform the initial query
                dataSource.bind("data_ready", function() {
                    // runs the initial data query in the data source to
                    // set the options in the select field
                    dataSource.uxdataquery({
                                filterString : "",
                                filterAttributes : [value]
                            }, function(validItems, moreItems) {
                                // in case there are no valid items
                                // returns immediately nothing to be done
                                if (validItems.length == 0) {
                                    // returns immediately
                                    return;
                                }

                                // iterates over all the valid items to create the
                                // proper options and set them in the text field
                                for (var index = 0; index < validItems.length; index++) {
                                    // retrieves the current valid item and then creates
                                    // the option and set the proper data item
                                    var validItem = validItems[index];
                                    var option = jQuery("<option>"
                                            + validItem[display] + "</option>");
                                    option.data("item", validItem);

                                    // adds the option to the text field (select)
                                    textField.append(option);
                                }

                                // updates the current text field setting the proper
                                // value in the template item (render value)
                                _update(textField, options);
                            });
                });
            });
        };

        var _update = function(element, options) {
            // retrieves the select field associated with the
            // current element and then retrieves the template
            // element to be able to render a new element
            var selectField = element.parents(".select-field");
            var template = jQuery(".template", selectField);

            // retrieves the currently selected option element
            // then retrieves its item logical value
            var option = jQuery(":selected", element);
            var item = option.data("item");

            // applies the template to the template (item)
            // retrieving the resulting template item then
            // adds the element class to it in order to be
            // able to identify it
            var templateItem = template.uxtemplate(item);
            templateItem.addClass("element");

            // retrieves the current set of elements present
            // in the select field and removes them, then adds
            // the new item (template item) to the select field
            var element = jQuery(".element", selectField);
            element.remove();
            selectField.append(templateItem);
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

/**
 * jQuery source list plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a source list component.
 *
 * @name jquery-source-list.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2015 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxsourcelist = function(method, options) {
        // the default values for the plugin
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
            selectList.uxselectlist();
            matchedObject.append(textField);
            matchedObject.append(selectList);

            // iterates over each of the matched objects to start
            // its internal structures and element data
            matchedObject.each(function(index, element) {
                        // retrieves the current element for iteration
                        var _element = jQuery(element);

                        // retrieves the select list element associated
                        // with the current element in iteration
                        var selectList = jQuery(".select-list", _element);

                        // retrieves the name of the current element and
                        // in case it's valid set it in the select list
                        var elementName = _element.attr("name");
                        elementName && selectList.attr("name", elementName);

                        // retrieves the order of the current element and
                        // in case it's valid set it in the select list
                        var elementOrder = _element.attr("data-order");
                        elementOrder
                                && selectList.attr("data-order", elementOrder);

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

            // registers the source list to the items changed event
            // to propagate it down to the assicated select list
            sourceList.bind("items_changed", function(event) {
                        // retrieves the current element (source list) and uses
                        // it to retrieve the select list to propagate down the
                        // event (lower propagation)
                        var element = jQuery(this);
                        var selectList = jQuery(".select-list", element);

                        // runs the update operation on the current element so
                        // that the new items are rendered for the data source
                        // and then triggers the items changed event in the lower
                        // select list to have them properly handled
                        _update(element, options, true);
                        selectList.triggerHandler("items_changed");

                        // stops the event propagation to avoid
                        // possible loops in the handling
                        event.stopPropagation();
                    });

            // registers for the key down event on the text field
            textField.keydown(function(event) {
                        // retrieves th current element
                        var element = jQuery(this);
                        var sourceList = element.parent(".source-list");
                        var selectList = jQuery(".select-list", sourceList);

                        // retrieves the event key code
                        var eventKeyCode = event.keyCode
                                ? event.keyCode
                                : event.which;

                        // retrieves the event key code
                        var eventKeyCode = event.keyCode
                                ? event.keyCode
                                : event.which;

                        // switches over the event key code
                        switch (eventKeyCode) {
                            // in case it's the enter key
                            case 13 :
                                // stops the event propagation
                                // (avoids extra problems in form)
                                event.stopPropagation();
                                event.preventDefault();

                                // breaks the switch
                                break;

                            // in case it's the page up key
                            case 33 :
                                // runs the all up action in the source list
                                _allUp(sourceList, options);

                                // stops the event propagation
                                // (avoids extra problems in form)
                                event.stopPropagation();
                                event.preventDefault();

                                // breaks the switch
                                break;

                            // in case it's the page down key
                            case 34 :
                                // runs the all down action in the source list
                                _allDown(sourceList, options);

                                // stops the event propagation
                                // (avoids extra problems in form)
                                event.stopPropagation();
                                event.preventDefault();

                                // breaks the switch
                                break;

                            // in case it's the up key
                            case 38 :
                                // runs the up action in the source list
                                _up(sourceList, options);

                                // stops the event propagation
                                // (avoids extra problems in form)
                                event.stopPropagation();
                                event.preventDefault();

                                // breaks the switch
                                break;

                            // in case it's the down key
                            case 40 :
                                // runs teh down action in the source list
                                _down(sourceList, options);

                                // stops the event propagation
                                // (avoids extra problems in form)
                                event.stopPropagation();
                                event.preventDefault();

                                // breaks the switch
                                break;
                        }
                    });

            // registers for the key up even on the text field
            textField.keyup(function(event) {
                        // retrieves th current element
                        var element = jQuery(this);
                        var sourceList = element.parent(".source-list");
                        var selectList = jQuery(".select-list", sourceList);

                        // retrieves the event key code
                        var eventKeyCode = event.keyCode
                                ? event.keyCode
                                : event.which;

                        // switches over the event key code
                        switch (eventKeyCode) {
                            // in case it's the enter key
                            case 13 :
                                // retrieves the set of selected element
                                var selectedItems = jQuery("li.selected",
                                        sourceList);

                                // triggers the select event in the select list
                                // only in case there are items selected
                                selectedItems.length
                                        && selectList.trigger("selected",
                                                [selectedItems]);

                                // stops the event propagation
                                // (avoids extra problems in form)
                                event.stopPropagation();
                                event.preventDefault();

                                // breaks the switch
                                break;

                            default :
                                // runs the update operation using the current
                                // source list with the set of options
                                _update(sourceList, options);

                                // breaks the switch
                                break;
                        }
                    });
        };

        var _update = function(matchedObject, options, force) {
            // retrieves the source list elements
            var sourceList = matchedObject;
            var dataSource = jQuery("> .data-source", sourceList);
            var textField = jQuery(".text-field", sourceList);
            var selectList = jQuery(".select-list", sourceList);

            // retrieves the current source list value
            var value = sourceList.data("value");

            // retrieves both the display, value and link attributes
            var displayAttribute = matchedObject.attr("data-display_attribute")
                    || "name";
            var valueAttribute = matchedObject.attr("data-value_attribute")
                    || "value";
            var linkAttribute = matchedObject.attr("data-link_attribute")
                    || "link";

            // retrieves the filter attributes
            var filterAttributes = matchedObject.data("filter_attributes");

            // retrieves the number of options values (it's a string value)
            var _numberOptions = matchedObject.attr("data-number_options");

            // retrieves the number of options to display
            // and if they should be filtered
            var numberOptions = matchedObject.data("number_options");
            var filterOptions = matchedObject.data("filter_options");

            // retrieves the text field value
            var textFieldValue = textField.val();

            // in case the value did not change (no need to
            // show the contents)
            if (textFieldValue == value && !force) {
                // returns immediately
                return;
            }

            // nullifies the number of options in case it's necessary
            numberOptions = filterOptions ? numberOptions : null;
            numberOptions = _numberOptions
                    ? parseInt(_numberOptions)
                    : numberOptions;

            // runs the query in the data source to retrieve the new
            // items and then contruct the list item from the
            // result provided by the data source
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
                                    && ["object", "string", "number", "boolean"].isIn(typeof currentItem[displayAttribute])
                                    ? currentItem[displayAttribute]
                                    : currentItem;
                            var currentValueAttribute = valueAttribute
                                    && ["object", "string", "number", "boolean"].isIn(typeof currentItem[valueAttribute])
                                    ? currentItem[valueAttribute]
                                    : currentItem;
                            var currentLinkAttribute = linkAttribute
                                    && ["object", "string", "number", "boolean"].isIn(typeof currentItem[linkAttribute])
                                    ? currentItem[linkAttribute]
                                    : null;

                            // triggers the event that will handle the validation of
                            // the item creation and in case the return value of it
                            // is invalid the current item is not created
                            var result = sourceList.triggerHandler(
                                    "validate_item", [currentItem,
                                            currentValueAttribute]);
                            if (result == false) {
                                continue;
                            }

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

                        // triggers the items changed event on the select list
                        // to be used for the update of the layour
                        selectList.triggerHandler("items_changed");
                    });
        };

        var _up = function(matchedObject, options) {
            // sets the source list as the currently
            // matched object
            var sourceList = matchedObject;

            // retrieves the set of selected elements
            // and removes the selected class from them
            var selectedItems = jQuery("li.selected", sourceList);
            selectedItems.removeClass("selected");

            // retrieves the current index value defaulting to zero
            // in case no item is currently selected
            var index = selectedItems.length ? selectedItems.index() : 0;
            var _index = index <= 0 ? 0 : index - 1;

            // updates the index reference in the source list
            // and runs the update list process
            sourceList.data("index", _index);
            _updateList(sourceList, options);
        };

        var _down = function(matchedObject, options) {
            // sets the source list as the currently
            // matched object
            var sourceList = matchedObject;

            // retrieves the set of selected elements
            // and removes the selected class from them
            var selectedItems = jQuery("li.selected", sourceList);
            selectedItems.removeClass("selected");

            // retrieves the complete set of items in the source list
            var items = jQuery("li", sourceList);

            // retrieves the current index value defaulting to minus one
            // in case no item is currently selected
            var index = selectedItems.length ? selectedItems.index() : -1;
            var _index = index >= items.length - 1 ? items.length - 1 : index
                    + 1;

            // updates the index reference in the source list
            // and runs the update list process
            sourceList.data("index", _index);
            _updateList(sourceList, options);
        };

        var _allUp = function(matchedObject, options) {
            // sets the source list as the currently
            // matched object
            var sourceList = matchedObject;

            // retrieves the set of selected elements
            // and removes the selected class from them
            var selectedItems = jQuery("li.selected", sourceList);
            selectedItems.removeClass("selected");

            // sets the current index as zero (top element)
            var index = 0;

            // updates the index reference in the source list
            // and runs the update list process
            sourceList.data("index", index);
            _updateList(sourceList, options);
        };

        var _allDown = function(matchedObject, options) {
            // sets the source list as the currently
            // matched object
            var sourceList = matchedObject;

            // retrieves the set of selected elements
            // and removes the selected class from them
            var selectedItems = jQuery("li.selected", sourceList);
            selectedItems.removeClass("selected");

            // retrieves the complete set of items in the source list
            var items = jQuery("li", sourceList);

            // sets the current index as the last of the items (last
            // item selected)
            var index = items.length - 1;

            // updates the index reference in the source list
            // and runs the update list process
            sourceList.data("index", index);
            _updateList(sourceList, options);
        };

        var _updateList = function(matchedObject, options) {
            // sets the source list as the currently
            // matched object, then uses it to retrieve the
            // associate select list element
            var sourceList = matchedObject;
            var selectList = jQuery(".select-list", sourceList);

            // retrieves the current selected index value
            // in the source list to select and focus it
            var index = sourceList.data("index");

            // retrieves the target item using the "just"
            // provided index value
            var targetItem = jQuery("li:nth-child(" + (index + 1) + ")",
                    sourceList);
            targetItem.addClass("selected");

            // checks if the element is visible, this should be the
            // main reason for the scrolling of the select list
            var isVisible = targetItem && targetItem.length ? jQuery.uxvisible(
                    targetItem, 0, 0, selectList) : true;

            // scrolls to the select list in case the
            // target item is not visible
            !isVisible && targetItem.uxscroll({
                        parent : selectList
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

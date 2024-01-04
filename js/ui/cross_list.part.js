if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

/**
 * jQuery cross list plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a cross list component.
 *
 * @name uxf-cross-list.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2024 Hive Solutions Lda.
 * @license Apache License, Version 2.0 - http://www.apache.org/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxcrosslist = function(method, options) {
        // the default values for the plugin
        var defaults = {};

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
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the data source associated with the
                // element, to "propagate" it to the source list
                var dataSource = jQuery("> .data-source", _element);

                // retrieves both the list that contains the various items
                // to populate the target list and the items themselves
                var items = jQuery(".items", _element);
                var itemsList = jQuery("li", items) || jQuery();

                // retrieves the various attributes from the element to
                // be used in propagation and as options
                var elementOrder = _element.attr("data-order");
                var sourceName = _element.attr("data-source");
                var targetName = _element.attr("data-target");
                var numberOptions = _element.attr("data-number_options");
                var displayAttribute = matchedObject.attr("data-display_attribute") || "name";
                var valueAttribute = matchedObject.attr("data-value_attribute") || "value";
                var linkAttribute = matchedObject.attr("data-link_attribute") || "link";

                // creates the various section elements
                var sourceSection = jQuery('<div class="section source-section"></div>');
                var crossSection = jQuery('<div class="section cross-section"></div>');
                var targetSection = jQuery('<div class="section target-section"></div>');

                // creates the various title elements
                var sourceTitle = jQuery("<h2>" + sourceName + "</h2>");
                var targetTitle = jQuery("<h2>" + targetName + "</h2>");

                // creates the various source elements
                var sourceList = jQuery('<div class="source-list"></div>');
                var targetList = jQuery('<div class="source-list"></div>');

                // creates the (local) data source to be used in the target
                // section, this data source is going to be constantly manpulated
                // throught the internal items list
                var targetSource = jQuery('<ul class="data-source" data-type="local"></ul>');

                // creates the various arrow elements to be used to "cross" the
                // elements from one side to the other
                var arrowRight = jQuery('<div class="arrow arrow-right"></div>');
                var arrowLeft = jQuery('<div class="arrow arrow-left"></div>');

                // creates the clear element to be used to clear the ui after the
                // creation of the various "floating" sections
                var clear = jQuery('<div class="clear"></div>');

                // iterates over each of the items in the list of predefined items
                // to add them to the local (and target) data souce, initial setting
                // then removes the items section to avoid extra elements in dom
                itemsList.each(function(index, element) {
                    var _element = jQuery(this);
                    targetSource.append(_element);
                });
                items.remove();

                // in case the (source) data source is defined adds it to the source
                // list then in case the element name is defined sets it in the target
                // list to provide correct form submission
                dataSource.length && sourceList.append(dataSource);
                displayAttribute && sourceList.attr("data-display_attribute", displayAttribute);
                valueAttribute && sourceList.attr("data-value_attribute", valueAttribute);
                linkAttribute && sourceList.attr("data-link_attribute", linkAttribute);
                elementOrder && targetList.attr("data-order", elementOrder);

                // in case the number of options is set propagates the setting to the
                // source list so that the number of options is limited
                numberOptions && sourceList.attr("data-number_options", numberOptions);

                // starts the target data source and then adds it to the target list
                // this data source is going to be manipulated through the items
                targetSource.uxdatasource();
                targetList.append(targetSource);

                // starts the various source list elements
                sourceList.uxsourcelist();
                targetList.uxsourcelist();

                // in case the source and the target names are defined adds
                // the titles to the corresponding sections
                sourceName && sourceSection.append(sourceTitle);
                targetName && targetSection.append(targetTitle);

                // adds the source and target list to the corresponding
                // sections (floating panels)
                sourceSection.append(sourceList);
                targetSection.append(targetList);

                // adds both arrows to the cross section
                crossSection.append(arrowRight);
                crossSection.append(arrowLeft);

                // adds the top level elements to the element, this should
                // trigger the display of the element
                _element.append(sourceSection);
                _element.append(crossSection);
                _element.append(targetSection);
                _element.append(clear);

                // triggers the items changed event both in the source list
                // and in the target list, this is set as a delayed operation
                // so that the proper handlers are triggered
                setTimeout(function() {
                    sourceList.triggerHandler("items_changed");
                    targetList.triggerHandler("items_changed");
                });
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves both the target and the source list
            // for the currently selected object
            var sourceList = jQuery(".source-section .select-list", matchedObject);
            var targetList = jQuery(".target-section .select-list", matchedObject);

            // retrieves the source list value as the source
            // element to be able to register it for the valide
            // item event (and filter the ones in the target)
            var sourceElement = jQuery(".source-section .source-list", matchedObject);

            // retrieves the arrows for the currently matched object
            // these "buttons" control the flow between sections
            var arrowLeft = jQuery(".arrow-left", matchedObject);
            var arrowRight = jQuery(".arrow-right", matchedObject);

            // registers for the item validation event so that the items
            // that are already included in the target list do not appear
            // in the source list (in no duplicate situations only)
            sourceElement.bind("validate_item", function(event, item, value) {
                // retrieves the current element (source list) and then uses
                // it to retrieve the parent cross list
                var _element = jQuery(this);
                var crossList = _element.parents(".cross-list");

                // verifies if the current cross list is registered
                // for duplicates if that's the case returns immediately
                // with a valid value (no filtering required)
                var duplicates = crossList.attr("data-duplicates");
                if (duplicates) {
                    return true;
                }

                // retrieves the target data source and uses it to
                // retrieve the associated items for filtering
                var targetSource = jQuery(".target-section .data-source", crossList);
                var targetItems = targetSource.data("items");

                // verifies if the current item in validation exists in
                // the target data source and in case it does returns
                // false so that it gets invalidated
                var exists = targetItems.indexOfObject(item) !== -1;
                return !exists;
            });

            // registers for the order changed event in the target
            // list so that the local data source associated is changed
            // to reflect the new order in the elements, this operation
            // is only possible assuming that the target data source is
            // local (store in javascript memory)
            targetList.bind("order_changed", function(event, element) {
                // retrieves the current element and uses it to retrieve
                // the associate top cross list element
                var _element = jQuery(this);
                var selectList = _element;
                var crossList = _element.parents(".cross-list");

                // retrieves the text field associated with the target
                // section and in case it contains a value the ordering
                // of the elements is ignored
                var textField = jQuery(".target-section .text-field", crossList);
                var textFieldValue = textField.val();
                if (textFieldValue) {
                    return;
                }

                // retrieves the target data source and then
                // uses it to retrieve the items from its data
                var targetSource = jQuery(".target-section .data-source", crossList);
                var targetItems = targetSource.data("items");

                // retrieves the complete set of items in the select
                // list (ignoring the clone element)
                var items = jQuery("li:not(.clone)", selectList);

                // clears the target element list from all the element
                // inserted (going to reconstruct it)
                targetItems.splice(0, targetItems.length);

                // iterates over all the items currently in the target
                // list to insert their value in the target items list
                for (var index = 0; index < items.length; index++) {
                    // retrieves the reference to the current item
                    // to be added to the target items list
                    var item = jQuery(items[index]);

                    // retrieves the data value from the selected item defaulting
                    // to the text represention in case none is provided
                    var dataValue = item.attr("data-value");
                    var htmlValue = item.text();
                    dataValue = dataValue || htmlValue;

                    // adds the data value to the target items list
                    targetItems.push(dataValue);
                }
            });

            // registers for the selected event on the source list to
            // transfer the selected elements to the target list
            sourceList.bind("selected", function(event, element) {
                // retrieves the current element and uses it to retrieve
                // the associate top cross list element
                var _element = jQuery(this);
                var crossList = _element.parents(".cross-list");

                // retrieves the flag that controls if duplicates
                // should be avoided (default to false)
                var duplicates = crossList.attr("data-duplicates") || false;

                // retrieves the source and target lists associated with the
                // current cross list (current context) for usage
                var sourceList = jQuery(".source-section .source-list", crossList);
                var targetList = jQuery(".target-section .source-list", crossList);

                // retrieves the target data source and then
                // uses it to retrieve the items from its data
                var targetSource = jQuery(".target-section .data-source", crossList);
                var targetItems = targetSource.data("items");

                // removes the selected class from the element, it's
                // no longer meant to be selected
                element.removeClass("selected");

                // retrieves the item that is currently associated with
                // selected element (it contains the data of it)
                var item = element.data("item");

                // in case the item value exists in the target items
                // must return immediately cannot add duplicates to
                // the target list
                var exists = targetItems.indexOfObject(item) !== -1;
                if (!duplicates && exists) {
                    return;
                }

                // adds the item value to the target items and then
                // triggers the items changed event so that the target
                // list is correctly updated in visual terms
                targetItems.push(item);
                sourceList.triggerHandler("items_changed");
                targetList.triggerHandler("items_changed");
            });

            // registers for the selected event on the source list to
            // transfer the selected elements to the target list
            targetList.bind("selected", function(event, element) {
                // retrieves the current element and uses it to retrieve
                // the associate top cross list element
                var _element = jQuery(this);
                var crossList = _element.parents(".cross-list");

                // retrieves the source and target lists associated with the
                // current cross list (current context) for usage
                var sourceList = jQuery(".source-section .source-list", crossList);
                var targetList = jQuery(".target-section .source-list", crossList);

                // retrieves the target data source and then
                // uses it to retrieve the items from its data
                var targetSource = jQuery(".target-section .data-source", crossList);
                var targetItems = targetSource.data("items");

                // removes the selected class from the element, it's
                // no longer meant to be selected
                element.removeClass("selected");

                // retrieves the item that is currently associated with
                // selected element (it contains the data of it)
                var item = element.data("item");

                // retrieves the index of the item value in the
                // target items and then uses it to remove the item
                // from the list of target items
                var index = targetItems.indexOfObject(item);
                targetItems.splice(index, 1);

                // triggers the items changed event so that the target
                // list is correctly updated with the new items
                sourceList.triggerHandler("items_changed");
                targetList.triggerHandler("items_changed");
            });

            // registers for the click event on the left arrow to be
            // able to tranfers the selected target elements back to
            // the source list
            arrowLeft.click(function() {
                // retrieves the current element and then uses it to
                // retrieve the parent cross list element
                var element = jQuery(this);
                var crossList = element.parents(".cross-list");

                // retrieves the source and target lists associated with the
                // current cross list (current context) for usage
                var sourceList = jQuery(".source-section .source-list", crossList);
                var targetList = jQuery(".target-section .source-list", crossList);

                // retrieves the target data source and then
                // uses it to retrieve the items from its data
                var targetSource = jQuery(".target-section .data-source", crossList);
                var targetItems = targetSource.data("items");

                // retrieves the list of selected items in the target list
                var selectedItems = jQuery("li.selected", targetList);

                // iterates over all the selected items to remove them from
                // the target items (data source)
                for (var index = 0; index < selectedItems.length; index++) {
                    // retrieves the current selected item in iteration
                    var selectedItem = selectedItems[index];
                    var _selectedItem = jQuery(selectedItem);

                    // retrieves the associated item value from the selected
                    // item as this is going to be the item to be added to
                    // the list representing the target items in the data source
                    var item = _selectedItem.data("item");

                    // retrieves the index of the item (valye) in the target
                    // items list and then uses it to remove the item from
                    // the list of target items
                    var _index = targetItems.indexOfObject(item);
                    targetItems.splice(_index, 1);
                }

                // triggers the items changed event so that the target
                // list is correctly updated with the removed items
                sourceList.triggerHandler("items_changed");
                targetList.triggerHandler("items_changed");
            });

            // registers for the click event on the right arrow to be
            // able to tranfers the selected source elements into
            // the target list
            arrowRight.click(function() {
                // retrieves the current element and then uses it to
                // retrieve the parent cross list element
                var element = jQuery(this);
                var crossList = element.parents(".cross-list");

                // retrieves the flag that controls if duplicates
                // should be avoided (default to false)
                var duplicates = crossList.attr("data-duplicates") || false;

                // retrieves the source and target lists associated with the
                // current cross list (current context) for usage
                var sourceList = jQuery(".source-section .source-list", crossList);
                var targetList = jQuery(".target-section .source-list", crossList);

                // retrieves the target data source and then
                // uses it to retrieve the items from its data
                var targetSource = jQuery(".target-section .data-source", crossList);
                var targetItems = targetSource.data("items");

                // retrieves the list of selected items in the source list
                // and then removes the selected class from them
                var selectedItems = jQuery("li.selected", sourceList);
                selectedItems.removeClass("selected");

                // iterates over the list of selected items to filter the ones
                // that are duplicated values and add the others to the target
                // items list so that they get update in the next ui update
                for (var index = 0; index < selectedItems.length; index++) {
                    // retrieves the current selected item in iteration
                    var selectedItem = selectedItems[index];
                    var _selectedItem = jQuery(selectedItem);

                    // retrieves the item that is currently associated with
                    // selected element (it contains the data of it)
                    var item = _selectedItem.data("item");

                    // checks if the data value already exists in the list of target
                    // items in case it does continues the loop (duplicated value)
                    var exists = targetItems.indexOfObject(item) !== -1;
                    if (!duplicates && exists) {
                        continue;
                    }

                    // adds the data value of the item to the list of target items
                    // so that it's going to be used when adding the values
                    targetItems.push(item);
                }

                // triggers the items changed event so that the target
                // list is correctly updated with the new items
                sourceList.triggerHandler("items_changed");
                targetList.triggerHandler("items_changed");
            });

            // iterates over all the selected values to register for the
            // specifics of each element (required for clojure)
            matchedObject.each(function(index, element) {
                // retrieves the current element in iteration and then uses it
                // to retrieve the parent form for pre submit event interception
                var _element = jQuery(this);
                var parentForm = _element.parents("form");

                // registers for the submit event in the parent form so that it's
                // possible to create the hidden input values for the form
                parentForm.bind("pre_submit", function() {
                    // retrieves the name of the element, this value is
                    // going to be used in the input element to be create
                    // in case the name does not exists no submission of
                    // values is created (returns immediately)
                    var elementName = _element.attr("name");
                    if (!elementName) {
                        return;
                    }

                    // retrieves the reference to the target select list that
                    // is going to be used in the retrieval of the list item
                    var targetList = jQuery(".target-section .select-list", _element);

                    // removes all the input elements contained inside the
                    // current select list (avoid duplicated submission)
                    var inputs = jQuery("input", targetList);
                    inputs.remove("input");

                    // retrieves the complete set of elements in the current
                    // target list, this values are going to be used to create
                    // the series of form input elements
                    var listItems = jQuery("li", targetList);

                    // in case the're no valid list items to be sent an empty
                    // value with the same name is posted (so that an empty value
                    // is submitted), required for compliance
                    if (listItems.length === 0) {
                        targetList.append('<input type="hidden" name="' + elementName + '" />');
                    }

                    // iterates over all the elements in the list items to
                    // creates the associated input values
                    for (var index = 0; index < listItems.length; index++) {
                        // retrieves the current list items in iteration
                        // and retrieves the value to be used as data value
                        // defaulting to the HTML value in case none is provided
                        var listItem = jQuery(listItems[index]);
                        var dataValue = listItem.attr("data-value");
                        var htmlValue = listItem.html();
                        dataValue = dataValue || htmlValue;

                        // adds the input element representing the list item
                        // to the target list itself
                        targetList.append(
                            '<input type="hidden" name="' +
                                elementName +
                                '" value="' +
                                dataValue +
                                '" />'
                        );
                    }
                });
            });
        };

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

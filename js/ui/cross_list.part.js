/**
 * jQuery cross list plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a cross list component.
 *
 * @name jquery-cross-list.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010-2012 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxcrosslist = function(method, options) {
        // the default values for the panel
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
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the data source associated with the
                // element, to "propagate" it to the source list
                var dataSource = jQuery("> .data-source", _element);

                // retrieves both the list that contains the various items
                // to populate the target list and the items themselves
                var items = jQuery(".items", _element)
                var itemsList = jQuery("li", items) || jQuery();

                // retrieves the various attributes from the element to
                // be used in propagation and as options
                var elementName = _element.attr("name");
                var elementOrder = _element.attr("data-order");
                var sourceName = _element.attr("data-source");
                var sourceName = _element.attr("data-source");
                var targetName = _element.attr("data-target");
                var numberOptions = _element.attr("data-number_options");
                var duplicates = _element.attr("data-duplicates") || false;
                var displayAttribute = matchedObject.attr("data-display_attribute")
                        || "name";
                var valueAttribute = matchedObject.attr("data-value_attribute")
                        || "value";
                var linkAttribute = matchedObject.attr("data-link_attribute")
                        || "link";

                // creates the various section elements
                var sourceSection = jQuery("<div class=\"section source-section\"></div>");
                var crossSection = jQuery("<div class=\"section cross-section\"></div>");
                var targetSection = jQuery("<div class=\"section target-section\"></div>");

                // creates the various title elements
                var sourceTitle = jQuery("<h2>" + sourceName + "</h2>");
                var targetTitle = jQuery("<h2>" + targetName + "</h2>");

                // creates the various source elements
                var sourceList = jQuery("<div class=\"source-list\"></div>");
                var targetList = jQuery("<div class=\"source-list\"></div>");

                // creates the (local) data source to be used in the target
                // section, this data source is going to be constantly manpulated
                // throught the internal items list
                var targetSource = jQuery("<ul class=\"data-source\" data-type=\"local\"></ul>");

                // creates the various arrow elements to be used to "cross" the
                // elements from one side to the other
                var arrowRight = jQuery("<div class=\"arrow arrow-right\"></div>");
                var arrowLeft = jQuery("<div class=\"arrow arrow-left\"></div>");

                // creates the clear element to be used to clear the ui after the
                // creation of the various "floating" sections
                var clear = jQuery("<div class=\"clear\"></div>");

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
                displayAttribute
                        && sourceList.attr("data-display_attribute",
                                displayAttribute);
                valueAttribute
                        && sourceList.attr("data-value_attribute",
                                valueAttribute);
                linkAttribute
                        && sourceList.attr("data-link_attribute",
                                link_attribute);
                elementName && targetList.attr("name", elementName);
                elementOrder && targetList.attr("data-order", elementOrder);

                // in case the number of options is set propagates the setting to the
                // source list so that the number of options is limited
                numberOptions
                        && sourceList.attr("data-number_options", numberOptions);

                // starts the target data source and then adds it to the target list
                // this data source is going to be manipulated through the items
                targetSource.uxdatasource();
                targetList.append(targetSource);

                // retrieves the target set of items in the data
                // source (local) and sets them as the exclusion
                // list of items in the source list (avoids duplicated)
                // exposure of items
                var targetItems = targetSource.data("items");
                !duplicates && sourceList.data("exclusion", targetItems);

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
                // and in the target list
                sourceList.trigger("items_changed");
                targetList.trigger("items_changed");
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves both the target and the source list
            // for the currently selected object
            var sourceList = jQuery(".source-section .select-list",
                    matchedObject);
            var targetList = jQuery(".target-section .select-list",
                    matchedObject);

            // retrieves the arrows for the currently matched object
            // these "buttons" control the flow between sections
            var arrowLeft = jQuery(".arrow-left", matchedObject);
            var arrowRight = jQuery(".arrow-right", matchedObject);

            // registers for the order changed event in the target
            // list so that the local data source associated is changed
            // to reflect the new order in the elements
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
                var textFieldValue = textField.attr("value");
                if (textFieldValue) {
                    return;
                }

                // retrieves the target data source and then
                // uses it to retrieve the items from its data
                var targetSource = jQuery(".target-section .data-source",
                        crossList);
                var targetItems = targetSource.data("items");

                // retrieves the complete set of items in the select
                // list (ignoring the clone element)
                var items = jQuery("li:not(.clone)", selectList);

                // clears the target element list from all the element
                // inserted (going to reconstruct it)
                targetItems.splice(0, targetItems.length)

                // iterates over all the items currently in the target
                // list to insert their value in the target items list
                for (var index = 0; index < items.length; index++) {
                    // retrieves the reference to the current item
                    // to be added to the target items list
                    var item = jQuery(items[index]);

                    // retrieves the data value from the selected item defaulting
                    // to the html represention in case none is provided
                    var dataValue = item.attr("data-value");
                    var htmlValue = item.html();
                    dataValue = dataValue ? dataValue : htmlValue;

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

                        // retrieves the target list associated with the
                        // cross list (current context)
                        var targetList = jQuery(".target-section .select-list",
                                crossList);

                        // retrieves the target data source and then
                        // uses it to retrieve the items from its data
                        var targetSource = jQuery(
                                ".target-section .data-source", crossList);
                        var targetItems = targetSource.data("items");

                        // removes the selected class from the element
                        element.removeClass("selected");

                        // retrieves the data value from the element defaulting
                        // to the html represention in case none is provided
                        var dataValue = element.attr("data-value");
                        var htmlValue = element.html();
                        dataValue = dataValue ? dataValue : htmlValue;

                        // in case the data value exists in the target items
                        // must return immediately cannot add duplicates to
                        // the target list
                        var exists = targetItems.indexOf(dataValue) != -1;
                        if (!duplicates && exists) {
                            return;
                        }

                        // clones the element in case duplicated elements are
                        // allowed in the current source list
                        element = duplicates ? element.clone(true) : element;

                        // adds the data value to the target items and then
                        // apends the element to the target list
                        targetItems.push(dataValue);
                        targetList.append(element);
                        targetList.trigger("items_changed");
                    });

            // registers for the selected event on the source list to
            // transfer the selected elements to the target list
            targetList.bind("selected", function(event, element) {
                        // retrieves the current element and uses it to retrieve
                        // the associate top cross list element
                        var _element = jQuery(this);
                        var crossList = _element.parents(".cross-list");

                        // retrieves the flag that controls if duplicates
                        // should be avoided (default to false)
                        var duplicates = crossList.attr("data-duplicates") || false;

                        // retrieves the source list associated with the
                        // cross list (current context)
                        var sourceList = jQuery(".source-section .select-list",
                                crossList);

                        // retrieves the target data source and then
                        // uses it to retrieve the items from its data
                        var targetSource = jQuery(
                                ".target-section .data-source", crossList);
                        var targetItems = targetSource.data("items");

                        // retrieves the data value from the element defaulting
                        // to the html represention in case none is provided
                        var dataValue = element.attr("data-value");
                        var htmlValue = element.html();
                        dataValue = dataValue ? dataValue : htmlValue;

                        // retrieves the index of the data value in the
                        // target items and then uses it to remove the item
                        // from the list of target items
                        var index = targetItems.indexOf(dataValue);
                        targetItems.splice(index, 1);

                        // removes the selected class from the element and
                        // adds it to the source list
                        element.removeClass("selected");
                        duplicates
                                ? element.remove()
                                : sourceList.append(element)
                                        && sourceList.trigger("items_changed");
                    });

            // registers for the click event on the left arrow to be
            // able to tranfers the selected target elements back to
            // the source list
            arrowLeft.click(function() {
                        // retrieves the current element and then uses it to
                        // retrieve the parent cross list element
                        var element = jQuery(this);
                        var crossList = element.parents(".cross-list");

                        // retrieves the flag that controls if duplicates
                        // should be avoided (default to false)
                        var duplicates = crossList.attr("data-duplicates") || false;

                        // retrieves both the source list and the target list
                        // to be able to "transfer" the selected items
                        var sourceList = jQuery(".source-section .select-list",
                                crossList);
                        var targetList = jQuery(".target-section .select-list",
                                crossList);

                        // retrieves the target data source and then
                        // uses it to retrieve the items from its data
                        var targetSource = jQuery(
                                ".target-section .data-source", crossList);
                        var targetItems = targetSource.data("items");

                        // retrieves the list of selected items in the target list
                        var selectedItems = jQuery("li.selected", targetList);

                        // iterates over all the selected items to remove them from
                        // the target items (data source)
                        for (var index = 0; index < selectedItems.length; index++) {
                            // retrieves the current selected item in iteration
                            var selectedItem = selectedItems[index];
                            var _selectedItem = jQuery(selectedItem);

                            // retrieves the data value from the selected item defaulting
                            // to the html represention in case none is provided
                            var dataValue = _selectedItem.attr("data-value");
                            var htmlValue = _selectedItem.html();
                            dataValue = dataValue ? dataValue : htmlValue;

                            // retrieves the index of the data value in the target
                            // items list and then uses it to remove the item from
                            // the list of target items
                            var _index = targetItems.indexOf(dataValue);
                            targetItems.splice(_index, 1);
                        }

                        // removes the selected class from the selected items and then
                        // appends the various selected items to the source list
                        selectedItems.removeClass("selected");
                        duplicates
                                ? selectedItems.remove()
                                : sourceList.append(selectedItems)
                                        && sourceList.trigger("items_changed");
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

                        // retrieves both the source list and the target list
                        // to be able to "transfer" the selected items
                        var sourceList = jQuery(".source-section .select-list",
                                crossList);
                        var targetList = jQuery(".target-section .select-list",
                                crossList);

                        // retrieves the target data source and then
                        // uses it to retrieve the items from its data
                        var targetSource = jQuery(
                                ".target-section .data-source", crossList);
                        var targetItems = targetSource.data("items");

                        // retrieves the list of selected items in the source list
                        // and then removes the selected class from them
                        var selectedItems = jQuery("li.selected", sourceList);
                        selectedItems.removeClass("selected");

                        // creates the list that will hold the various items
                        // considered to be valid (no duplicates)
                        var validItems = [];

                        // iterates over the list of selected items to filter the ones
                        // that are duplicated values
                        for (var index = 0; index < selectedItems.length; index++) {
                            // retrieves the current selected item in iteration
                            var selectedItem = selectedItems[index];
                            var _selectedItem = jQuery(selectedItem);

                            // retrieves the data value from the selected item defaulting
                            // to the html represention in case none is provided
                            var dataValue = _selectedItem.attr("data-value");
                            var htmlValue = _selectedItem.html();
                            dataValue = dataValue ? dataValue : htmlValue;

                            // checks if the data value already exists in the list of target
                            // items in case it does continues the loop (duplicated value)
                            var exists = targetItems.indexOf(dataValue) != -1;
                            if (!duplicates && exists) {
                                continue;
                            }

                            // clones the selected item in case duplicated elements are
                            // allowed in the current source list
                            selectedItem = duplicates
                                    ? _selectedItem.clone(true)[0]
                                    : selectedItem;

                            // adds the selected items to the valid items and adds the data
                            // value to the list of target items (data source)
                            validItems.push(selectedItem);
                            targetItems.push(dataValue);
                        }

                        // convers the list of valid items into an element and adds
                        // it to the target list (should display the items visually)
                        var _validItems = jQuery(validItems);
                        targetList.append(_validItems);
                        targetList.trigger("items_changed");
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
                            var targetList = jQuery(
                                    ".target-section .select-list", _element);

                            // removes all the input elements contained inside the
                            // current select list (avoid duplicated submission)
                            targetList.remove("input");

                            // retrieves the complete set of elements in the current
                            // target list, this values are going to be used to create
                            // the series of form input elements
                            var listItems = jQuery("li", targetList);

                            // iterates over all the elements in the list items to
                            // creates the associated input values
                            for (var index = 0; index < listItems.length; index++) {
                                // retrieves the current list items in iteration
                                // and retrieves the value to be used as data value
                                // defaulting to the html value in case none is provided
                                var listItem = jQuery(listItems[index]);
                                var dataValue = listItem.attr("data-value");
                                var htmlValue = listItem.html();
                                dataValue = dataValue ? dataValue : htmlValue;

                                // adds the input element representing the list item
                                // to the target list itself
                                targetList.append("<input type=\"hidden\" name=\""
                                        + elementName
                                        + "\" value=\""
                                        + dataValue + "\" />");
                            }
                        });
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

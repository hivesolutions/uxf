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
(function($) {
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
                var dataSource = jQuery(".data-source", _element);

                // retrieves both the list that contains the various items
                // to populate the target list and the items themselves
                var items = jQuery(".items", _element)
                var itemsList = jQuery("li", items) || jQuery();

                // retrieves the various attributes from the element to
                // be used in propagation and as options
                var elementName = _element.attr("name");
                var sourceName = _element.attr("data-source");
                var targetName = _element.attr("data-target");

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
                elementName && targetList.attr("name", elementName);

                // starts the target data source and then adds it to the target list
                // this data source is going to be manipulated through the items
                targetSource.uxdatasource();
                targetList.append(targetSource);

                // retrieves the target set of items in the data
                // source (local) and sets them as the exclusion
                // list of items in the source list (avoids duplicated)
                // exposure of items
                var targetItems = targetSource.data("items");
                sourceList.data("exclusion", targetItems);

                // starts the various source list elements
                sourceList.uxsourcelist();
                targetList.uxsourcelist();

                sourceName && sourceSection.append(sourceTitle);
                targetName && targetSection.append(targetTitle);

                sourceSection.append(sourceList);
                targetSection.append(targetList);

                crossSection.append(arrowRight);
                crossSection.append(arrowLeft);

                _element.append(sourceSection);
                _element.append(crossSection);
                _element.append(targetSection);
                _element.append(clear);
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

            // registers for the selected event on the source list to
            // transfer the selected elements to the target list
            sourceList.bind("selected", function(event, element) {
                        // retrieves the current element and uses it to retrieve
                        // the associate top cross list element
                        var _element = jQuery(this);
                        var crossList = _element.parents(".cross-list");

                        // retrieves the target list associated with the
                        // cross list (current context)
                        var targetList = jQuery(".target-section .select-list",
                                crossList);

                        var targetSource = jQuery(
                                ".target-section .data-source", crossList);
                        var targetItems = targetSource.data("items");

                        // removes the selected class from the element
                        element.removeClass("selected");

                        var dataValue = element.html();

                        var exists = targetItems.indexOf(dataValue) != -1;
                        if (exists) {
                            return
                        }

                        targetItems.push(dataValue);
                        targetList.append(element);
                    });

            // registers for the selected event on the source list to
            // transfer the selected elements to the target list
            targetList.bind("selected", function(event, element) {
                        // retrieves the current element and uses it to retrieve
                        // the associate top cross list element
                        var _element = jQuery(this);
                        var crossList = _element.parents(".cross-list");

                        // retrieves the source list associated with the
                        // cross list (current context)
                        var sourceList = jQuery(".source-section .select-list",
                                crossList);

                        var targetSource = jQuery(
                                ".target-section .data-source", crossList);
                        var targetItems = targetSource.data("items");

                        var dataValue = element.html();

                        var index = targetItems.indexOf(dataValue);
                        targetItems.splice(index, 1);

                        // removes the selected class from the element and
                        // adds it to the source list
                        element.removeClass("selected");
                        sourceList.append(element);
                    });

            // registers for the click event on the left arrow to be
            // able to tranfers the selected target elements back to
            // the source list
            arrowLeft.click(function() {
                        var element = jQuery(this);
                        var crossList = element.parents(".cross-list");

                        var sourceList = jQuery(".source-section .select-list",
                                crossList);
                        var targetList = jQuery(".target-section .select-list",
                                crossList);

                        var targetSource = jQuery(
                                ".target-section .data-source", crossList);
                        var targetItems = targetSource.data("items");

                        var selectedItems = jQuery("li.selected", targetList);

                        for (var index = 0; index < selectedItems.length; index++) {
                            var selectedItem = selectedItems[index];
                            var _selectedItem = jQuery(selectedItem);

                            var dataValue = _selectedItem.html();

                            var _index = targetItems.indexOf(dataValue);
                            targetItems.splice(_index, 1);
                        }

                        selectedItems.removeClass("selected");
                        sourceList.append(selectedItems);
                    });

            // registers for the click event on the right arrow to be
            // able to tranfers the selected source elements into
            // the target list
            arrowRight.click(function() {
                        var element = jQuery(this);
                        var crossList = element.parents(".cross-list");

                        var sourceList = jQuery(".source-section .select-list",
                                crossList);
                        var targetList = jQuery(".target-section .select-list",
                                crossList);

                        var targetSource = jQuery(
                                ".target-section .data-source", crossList);
                        var targetItems = targetSource.data("items");

                        var selectedItems = jQuery("li.selected", sourceList);
                        selectedItems.removeClass("selected");

                        var validItems = [];

                        for (var index = 0; index < selectedItems.length; index++) {
                            var selectedItem = selectedItems[index];
                            var _selectedItem = jQuery(selectedItem);

                            var dataValue = _selectedItem.html();

                            var exists = targetItems.indexOf(dataValue) != -1;
                            if (exists) {
                                continue;
                            }

                            validItems.push(selectedItem);
                            targetItems.push(dataValue);
                        }

                        var _validItems = jQuery(validItems);
                        targetList.append(_validItems);
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

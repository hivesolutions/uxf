/**
 * jQuery select list plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a select list component.
 *
 * @name jquery-select-list.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010-2012 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function($) {
    jQuery.fn.uxselectlist = function(method, options) {
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
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the various items that exist
            // in the select list
            var listItems = jQuery("li", matchedObject);

            // registers for the click event on the list items
            // to change their selection states
            listItems.click(function(event) {
                // retrieves the current element reference and uses
                // it to retrive the current select list
                var element = jQuery(this);
                var selectList = element.parent();

                if (event.ctrlKey) {
                    var action = "change";
                } else if (event.shiftKey) {
                    var action = "contiguous";
                } else {
                    var action = "normal";
                }

                // switches over the action to be performed
                // on the current item selection state
                switch (action) {
                    case "change" :
                        // checks if the element is currently selected and
                        // adds or removes the selected class from it for
                        // each case (complementary)
                        var isSelected = element.hasClass("selected");
                        isSelected
                                ? element.removeClass("selected")
                                : element.addClass("selected");

                        // sets the previous element in the select list
                        // useful for later referral
                        selectList.data("previous", element);

                        // breaks the switch
                        break;

                    case "contiguous" :
                        // retrieves the previous selected element and checks
                        // if it contains the selected, defaulting to null
                        // in case it does not contains such class
                        var previous = selectList.data("previous");
                        previous = previous.hasClass("selected")
                                ? previous
                                : null;

                        // retrieves the base index from the previous element
                        // (in case it's set) and retrieves the target index
                        var baseIndex = previous ? previous.index() : 0;
                        var targetIndex = element.index();

                        // in case the target index is greater than the base index the
                        // index values must be exchanged between
                        if (targetIndex < baseIndex) {
                            var temporary = targetIndex;
                            targetIndex = baseIndex;
                            baseIndex = temporary;
                        }

                        // retrieves the currently selected list items
                        var listItems = jQuery("li.selected", selectList);
                        listItems.removeClass("selected");

                        // iterates over the range of index values (base and target)
                        // to be able to select all the elements
                        for (index = baseIndex; index < targetIndex + 1; index++) {
                            // retrieves the current element in the select list and
                            // adds the selected class to it
                            var _element = jQuery(":nth-child(" + (index + 1)
                                            + ")", selectList);
                            _element.addClass("selected");
                        }

                        // breaks the switch
                        break;

                    case "normal" :
                        // retrieves the currently selected list items
                        var listItems = jQuery("li.selected", selectList);

                        // removes the selected class from all the list items
                        // and then adds then selects the current element
                        listItems.removeClass("selected");
                        element.addClass("selected");

                        // sets the previous element in the select list
                        // useful for later referral
                        selectList.data("previous", element);

                        // breaks the switch
                        break;
                }
            });

            // registers for the double click event on the list itesm
            // to trigger the select action
            listItems.dblclick(function(event) {
                        // retrieves the current element and then uses
                        // it to retrieve the select list
                        var element = jQuery(this);
                        var selectList = element.parent();

                        // triggers the select event in the element
                        element.trigger("selected", [element]);
                    });

            // iterates over each of the matched objects
            // to register them agains the submission of the form
            matchedObject.each(function(index, element) {
                // retrieves the current element for iteration
                var _element = jQuery(element);

                // retrieves the containing form
                var parentForm = _element.parents("form");

                // registers for the submit event
                parentForm.submit(function() {
                            // retrieves the name of the element, this value is
                            // going to be used in the input element to be create
                            // in case the name does not exists no submission of
                            // values is created (returns immediately)
                            var elementName = _element.attr("name");
                            if (!elementName) {
                                return;
                            }

                            // removes all the input elements contained inside the
                            // current select list (avoid duplicated submission)
                            _element.remove("input");

                            // retrieves the complete set of elements in the current
                            // select list, this values are going to be used to create
                            // the series of form input elements
                            var listItems = jQuery("li", _element);

                            // iterates over all the element in the list items to
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
                                // to the list item itself
                                _element.append("<input type=\"hidden\" name=\""
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

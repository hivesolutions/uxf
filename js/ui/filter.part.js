/**
 * jQuery filter plugin, this jQuery plugin provides the base infra-structure
 * for the creation of a filter component.
 *
 * @name jquery-filter.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010-2012 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function($) {
    jQuery.fn.uxfilter = function(options) {
        // the default values for the filter
        var defaults = {
            numberRecords : 8
        };

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
            // retrieves the base options
            var numberRecords = options["numberRecords"];

            // retrieves the filter input
            var filterInput = jQuery(".filter-input", matchedObject);

            // disables the auto complete in the filter input element
            filterInput.attr("autocomplete", "off");

            // sets the matched object base data
            matchedObject.data("filter_string", "");
            matchedObject.data("start_record", 0);
            matchedObject.data("selection", [0]);
            matchedObject.data("pivot", 0);
            matchedObject.data("number_records", numberRecords);
            matchedObject.data("complete", false);
            matchedObject.data("pending", false);

            // iterates over all the matched objects
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the filter contents and
                // the filter more (if present)
                var filterContents = jQuery(".filter-contents", _element);
                var filterMore = jQuery(".filter-more", _element);

                // retrieves the text value from the filter more
                // and then encapsulates it arround the text divisor
                // then adds it in conjuction to the spinner to the
                // filter more component, as the new filter more contents
                var filterMoreText = filterMore.html();
                filterMore.html("<div class=\"text\">" + filterMoreText
                        + "</div>" + "<div class=\"spinner\"></div>");

                // retrieves the filter more length
                var filterMoreLength = filterMore.length;

                // adds the "extra" html to the matched object,
                // in case no filter contents is found
                if (filterContents.length == 0) {
                    // creates the filter contents element and adds it to the
                    // filter according to the filter more status
                    var filterContents = jQuery("<div class=\"filter-contents\"></div>");
                    filterMoreLength > 0
                            ? filterContents.insertBefore(filterMore)
                            : _element.append(filterContents);
                }

                // updates the element (matched object) state
                // for the initial contents
                _update(_element, options);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the window element reference
            var _window = jQuery(window);

            // retrieves the document element reference
            var _document = jQuery(document);

            // retrieves the body element reference
            var _body = jQuery("body");

            // retrieves the filter input
            var filterInput = jQuery(".filter-input", matchedObject);

            // retrieves the filter more
            var filterMore = jQuery(".filter-more", matchedObject);

            // retrieves the text field
            var textField = jQuery(".text-field", matchedObject);

            // checks if the filter click event is already
            // registerd in the body and set the variable as
            // true to avoid further registrations
            var isRegistered = _body.data("filter_click");
            matchedObject.length > 0 && _body.data("filter_click", true);

            // tries to retrieve the value for the infinite loading
            // support in the matched object (by default it's disabled)
            var infinite = matchedObject.attr("data-infinite") || false;

            // registers for the key up in the filter input
            filterInput.keyup(function() {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the (parent) filter
                        var filter = element.parents(".filter");

                        // retrieves the filter string and the filter
                        // input value (to check for string value changes)
                        var filterString = filter.data("filter_string");
                        var filterInputValue = filterInput.attr("data-value");

                        // in case no string value changes occured
                        if (filterString == filterInputValue) {
                            // returns immediately
                            return;
                        }

                        // updates the filter state
                        _update(filter, options);
                    });

            // registers for the click in the filter input
            filterMore.click(function() {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the (parent) filter
                        var filter = element.parents(".filter");

                        // updates the filter state
                        _update(filter, options);
                    });

            // registers for the key down event in the text field
            textField.keydown(function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the event key code
                        var eventKeyCode = event.keyCode
                                ? event.keyCode
                                : event.which;

                        // switches over the event key code
                        switch (eventKeyCode) {
                            // in case it's the page up, the
                            // page down, the up or the
                            // down keys
                            case 33 :
                            case 34 :
                            case 38 :
                            case 40 :
                                // stops the event propagation
                                // (avoids extra problems in form)
                                event.stopPropagation();
                                event.preventDefault();

                                // breaks the switch
                                break;
                        }
                    });

            // registers for the key up event in the text field
            textField.keyup(function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the filter
                        var filter = element.parents(".filter");

                        // retrieves the event key code
                        var eventKeyCode = event.keyCode
                                ? event.keyCode
                                : event.which;

                        // switches over the event key code
                        switch (eventKeyCode) {
                            // in case it's the enter key
                            case 13 :
                                // retrieves the selected list item
                                var listItemSelected = jQuery(
                                        ".filter-contents > .selected", filter);

                                // updates the current selection, runs the
                                // appropriate (default) actions
                                _select(listItemSelected, filter, options);

                                // breaks the switch
                                break;

                            // in case it's the page up key
                            case 33 :
                                // in case the shift key is pressed range mode
                                // must be "activated"
                                if (event.shiftKey) {
                                    // "ups" the "current" range (selection)
                                    _upRange(filter, options);
                                }
                                // otherwise the "normal" up operation
                                // must be used
                                else {
                                    // sets the "current" selection to the up
                                    _upSelection(filter, options);
                                }

                                break;

                            // in case it's the page down key
                            case 34 :
                                // in case the shift key is pressed range mode
                                // must be "activated"
                                if (event.shiftKey) {
                                    // "downs" the "current" range (selection)
                                    _downRange(filter, options);
                                }
                                // otherwise the "normal" up operation
                                // must be used
                                else {
                                    // sets the "current" selection to the bottom
                                    _downSelection(filter, options);
                                }

                                break;

                            // in case it's the up key
                            case 38 :
                                // in case the shift key is pressed range mode
                                // must be "activated"
                                if (event.shiftKey) {
                                    // increments the "current" range (selection)
                                    _incrementRange(filter, options);
                                }
                                // otherwise the "normal" incrementing operation
                                // must be used
                                else {
                                    // increments the "current" selection
                                    _incrementSelection(filter, options);
                                }

                                // stops event propagation (avoids cursor
                                // movement in the text field)
                                event.stopPropagation();

                                // breaks the switch
                                break;

                            // in case it's the down key
                            case 40 :
                                // in case the shift key is pressed range mode
                                // must be "activated"
                                if (event.shiftKey) {
                                    // decrements the "current" range (selection)
                                    _decrementRange(filter, options);
                                }
                                // otherwise the "normal" decrementing operation
                                // must be used
                                else {
                                    // decrements the "current" selection
                                    _decrementSelection(filter, options);
                                }

                                // stops event propagation (avoids cursor
                                // movement in the text field)
                                event.stopPropagation();

                                // breaks the switch
                                break;
                        }
                    });

            // registers for the key down in the document
            // element in case the matched object is valid
            matchedObject.length > 0 && _document.keydown(function(event) {
                        // sets the filter as the matched object
                        var filter = matchedObject;

                        // retrieves the key value
                        var keyValue = event.keyCode
                                ? event.keyCode
                                : event.charCode ? event.charCode : event.which;

                        // switches over the key value
                        switch (keyValue) {
                            // in case it's the enter key
                            case 13 :
                                // retrieves the selected list item
                                var listItemSelected = jQuery(
                                        ".filter-contents > .selected", filter);

                                // updates the current selection, runs the
                                // appropriate (default) actions
                                _select(listItemSelected, filter, options);

                                // breaks the switch
                                break;

                            // in case it's the j key
                            case 74 :
                                // in case the shift key is pressed range mode
                                // must be "activated"
                                if (event.shiftKey) {
                                    // decrements the "current" range (selection)
                                    _decrementRange(filter, options);
                                }
                                // otherwise the "normal" decrementing operation
                                // must be used
                                else {
                                    // decrements the "current" selection
                                    _decrementSelection(filter, options);
                                }

                                // breaks the switch
                                break;

                            // in case it's the k key
                            case 75 :
                                // in case the shift key is pressed range mode
                                // must be "activated"
                                if (event.shiftKey) {
                                    // increments the "current" range (selection)
                                    _incrementRange(filter, options);
                                }
                                // otherwise the "normal" incrementing operation
                                // must be used
                                else {
                                    // increments the "current" selection
                                    _incrementSelection(filter, options);
                                }

                                // breaks the switch
                                break;

                            // in case it's default
                            default :
                                // breaks the switch
                                break;
                        }
                    });

            // registers for the click event in order
            // to avoid problems with deselection
            matchedObject.length > 0 && matchedObject.click(function(event) {
                        // sets the avoid next flag to avoid deselection
                        matchedObject.data("avoid_next", true);
                    });

            // registers for the click event in the body element
            // to deselect the element only in case no previous
            // registration was made (avoids duplicates)
            matchedObject.length > 0 && !isRegistered
                    && _body.click(function(event) {
                                // retrieves the value of the avoid next flag and
                                // then unsets the avoid next flag
                                var avoidNext = matchedObject.data("avoid_next");
                                matchedObject.data("avoid_next", false);

                                // in case the avoid next flag is set
                                if (avoidNext) {
                                    // returns immediately
                                    return;
                                }

                                // resets both the selection and the pivot values
                                matchedObject.data("selection", [0]);
                                matchedObject.data("pivot", 0);

                                // updates the current selection
                                _updateSelection(matchedObject, options);
                            });

            // registers for the scroll event in the window in case
            // the infinite scroll support is enabled
            matchedObject.length > 0 && infinite && _window.scroll(function() {
                        // sets the filter as the matched object, this
                        // considered to be a global singleton handler
                        var filter = matchedObject;

                        // retrieves the top offset of the page, using
                        // the margin element (from the margin top)
                        var margin = jQuery(".margin");
                        var marginOffset = margin.offset();
                        var pageOffset = marginOffset ? marginOffset.top : 0;

                        // retrieves the filter more element height as the
                        // delta value for the visibility testing this way
                        // the visibility test is done agains the top
                        var delta = filterMore.outerHeight() * -1;

                        // checks if the element is visible
                        var isVisible = filterMore.length ? jQuery.uxvisible(
                                filterMore, pageOffset, delta) : false;

                        // updates the filter state
                        isVisible && _update(filter, options);
                    });
        };

        var _update = function(matchedObject, options) {
            // retrieves the (parent) filter and the
            // associated template
            var filter = matchedObject;
            var filterInput = jQuery(".filter-input", filter);
            var filterContents = jQuery(".filter-contents", filter);
            var filterNoResults = jQuery(".filter-no-results", filter);
            var filterMore = jQuery(".filter-more", filter);
            var dataSource = jQuery(".data-source", filter);
            var template = jQuery(".template", filter);

            // retrieves the filter options
            var filterString = filter.data("filter_string");
            var startRecord = filter.data("start_record");
            var numberRecords = filter.data("number_records");
            var complete = filter.data("complete");
            var pending = filter.data("pending");

            // "forces" the number of records to the table list
            numberRecords = filter.hasClass("table-list") ? 14 : numberRecords;

            // retrieves the filter input value
            var filterInputValue = filterInput.attr("data-value");

            // sets the initial vaalue for the reset flag
            var reset = false;

            // in case the value in the filter input
            // has changed (reset required)
            if (filterString != filterInputValue) {
                // resets the (current) selection value
                filter.data("selection", [0]);
                filter.data("pivot", 0);

                // resets the start record, including
                // the current "local" value
                filter.data("start_record", 0);
                startRecord = 0;

                // sets the reset flag
                reset = true;
            }
            // in case other reason triggers the update (additional
            // care must be taken)
            else {
                // in case the filter is already complete or
                // it has data pending to be retrieved
                if (complete || pending) {
                    // returns immeidately (can not retrieve
                    // any more data for now)
                    return;
                }
            }

            // sets the (query) pending flag in the filter
            filter.data("pending", true);

            // adds the loading class so thath the loading information
            // is presented to the user
            filterMore.addClass("loading");

            // runs the query in the data source
            dataSource.uxdataquery({
                        filterString : filterInputValue,
                        filterAttributes : ["name", "customer_code"],
                        startRecord : startRecord,
                        numberRecords : numberRecords
                    }, function(validItems, moreItems) {
                        // removes the loading class from the filter more
                        // button so that the loading information is hidden
                        filterMore.removeClass("loading");

                        // in case the valid items value
                        // is not valid (error occurred)
                        if (!validItems) {
                            // unsets the (query) pending flag in the filter
                            filter.data("pending", false);

                            // returns immediately
                            return;
                        }

                        // in case the reset flag is set
                        if (reset) {
                            // retrieves the current filter elements to remove
                            // them (refresh of the list)
                            var filterElements = jQuery(".filter-element",
                                    filter);
                            filterElements.remove();
                        }

                        // retrieves the valid items reference
                        var _validItems = jQuery(validItems);

                        // retrieves the valid items length
                        var validItemsLength = validItems.length;

                        // iterates over all the valid items to create
                        // proper elements
                        _validItems.each(function(index, element) {
                            // applies the template to the template (item)
                            // retrieving the resulting template item
                            var templateItem = template.uxtemplate(element);

                            // removes the filter element class from the template item,
                            // then adds it to the filter contents
                            templateItem.addClass("filter-element");
                            filterContents.append(templateItem);

                            // registers the template item for the click event
                            // to select the template item in case a click happens
                            templateItem.click(function(event) {
                                // retrieves the template item index
                                var templateItemIndex = templateItem.index();

                                // in case the control key is set must add new
                                // selection to the selection set
                                if (event.ctrlKey) {
                                    // retrieves the current selection for reference
                                    var selection = filter.data("selection");

                                    // checks if the current selection is the initial
                                    // empty selection, in case it's "pops" it from the
                                    // current selection set (avoids problems in selection)
                                    var isInitial = selection.length == 1
                                            && selection[0] == 0;
                                    isInitial && selection.pop();

                                    // in case the current selection is empty it's time to update
                                    // the pivot value (it's the first element of the selection)
                                    selection.length == 0
                                            && filter.data("pivot",
                                                    templateItemIndex + 1);

                                    // retrieves the index of the element in the selection
                                    // index, this is going to be used to check if the element
                                    // is present in the selection set
                                    var elementIndex = selection.indexOf(templateItemIndex
                                            + 1);

                                    // in case the element index is invalid (it's not present
                                    // in the selection set) must be added to set (selection)
                                    if (elementIndex == -1) {
                                        // adds the index to the selection set (selection)
                                        selection.push(templateItemIndex + 1);
                                    }
                                    // otherwise the element is already present in the set
                                    // and must be removed from it (de-selection)
                                    else {
                                        // removes the index from the selection set (selection)
                                        selection.splice(elementIndex, 1);
                                    }
                                }
                                // otherwise in case the shift key is pressed a range selection
                                // must be processed
                                else if (event.shiftKey) {
                                    // retrieves the current index for the selection to check
                                    // it agains the pivot index value
                                    var index = templateItemIndex + 1;

                                    // actions a range selection over the current pivot
                                    // value and the currently defined index
                                    _rangeSelection(index, filter, options);
                                } else {
                                    // sets the current selection to the current
                                    // template item index and updates the pivot
                                    // value accordingly
                                    filter.data("selection", [templateItemIndex
                                                    + 1]);
                                    filter.data("pivot", templateItemIndex + 1);
                                }

                                // updates the current selection
                                _updateSelection(filter, options);
                            });

                            // binds the template item to the selected event
                            templateItem.bind("selected", function() {
                                // retrieves the template item index
                                var templateItemIndex = templateItem.index();

                                // retrieves the current selection and the index of
                                // the selected template index from the filter
                                // to be able check if the element is currently selected
                                var selection = filter.data("selection");
                                var elementIndex = selection.indexOf(templateItemIndex
                                        + 1);

                                // in case the element is currently selected
                                // nothing is to be done
                                if (elementIndex != -1) {
                                    // returns immediately, avoids selection
                                    return;
                                }

                                // resets the current selection to be the
                                // currently selected element
                                filter.data("selection",
                                        [templateItemIndex + 1]);
                                filter.data("pivot", templateItemIndex + 1);

                                // updates the current selection
                                _updateSelection(filter, options);
                            });

                            // binds the template item to the double click event
                            templateItem.dblclick(function() {
                                        // updates the current selection, runs the
                                        // appropriate (default) actions
                                        _select(templateItem, filter, options);
                                    });
                        });

                        // in case there are no items to be shown
                        if (validItemsLength > 0) {
                            // hides the filter no results panel
                            filterNoResults.hide();
                        }
                        // otherwise there are no item to be shown
                        else {
                            // shows the filter no results panel
                            filterNoResults.show();
                        }

                        // in case there are more items available
                        // to be retrieved
                        if (moreItems) {
                            // shows the filter more item
                            filterMore.show();
                        }
                        // otherwise the are no more items to be shown
                        else {
                            // hides the filter more item
                            filterMore.hide();
                        }

                        // retrieves the current list items
                        var listItems = jQuery(".filter-contents > *",
                                matchedObject);

                        // unregisters from the right click in the list
                        // items (avoids duplicates) and then registers
                        // the handler for the context menu
                        listItems.unbind("contextmenu rightclick",
                                _handleContext);
                        listItems.bind("contextmenu rightclick", _handleContext);

                        // triggers the update complete event
                        filter.triggerHandler("update_complete");

                        // updates the filter data
                        filter.data("filter_string", filterInputValue);
                        filter.data("start_record", startRecord + numberRecords);
                        filter.data("complete", !moreItems);
                        filter.data("pending", false);
                    });
        };

        var _handleContext = function(event) {
            // retrieves the current element
            var element = jQuery(this);

            // retrieves the reference to the window, document,
            // body and the reference to the current context menu
            var _window = jQuery(window);
            var _document = jQuery(document);
            var _body = jQuery("body")
            var menu = jQuery(".context-menu", element);
            var menuContents = jQuery(".context-menu .menu-contents", element);

            // in case there's no context menu for the
            // current element no need to continue
            if (menu.length == 0) {
                // returns immediately no context menu
                // for the current element
                return;
            }

            // retrieves the current set of visible menus and menu
            // contents to be able to control them
            var _menu = jQuery(".menu.active");
            var _menuContents = jQuery(".menu-contents:visible");

            // removes the active class from the visible menus
            // and hides the menu contents
            _menu.removeClass("active");
            _menuContents.hide();

            // clones the menu so that a new instance
            // is used for the context
            menu = menu.clone();
            menu.uxapply();

            // adds the drop menu class to indicate that this is
            // a menu of type drop (provisory)
            menu.addClass("drop-menu");

            // retrieves the menu contents reference for the menu
            var menuContents = jQuery(".menu-contents:not(.sub-menu)", menu);

            // removes the currently create context menus
            // to avoid duplicates (garbage collection) then
            // appends the new context menu to the bodu
            jQuery("body > .context-menu").remove();
            jQuery("body").append(menu);

            // triggers the selected event on the current element
            // so that it changes the selected value
            element.trigger("selected");

            // retrieves the correct scroll position coordinates
            // according to the current browser implementation
            var scrollY = window.scrollY
                    ? window.scrollY
                    : document.body.scrollTop;
            var scrollX = window.scrollX
                    ? window.scrollX
                    : document.body.scrollLeft;

            // updates the menu contents attributes to reflect
            // the proper attributes (position)
            menuContents.css("position", "fixed")
            menuContents.css("margin-left", 0 + "px");
            menuContents.css("margin-top", 0 + "px");
            menuContents.css("top", event.pageY - scrollY + "px");
            menuContents.css("left", event.pageX - scrollX + "px");

            // adds the active class to the menu
            menu.addClass("active");

            // shows the menu contents by fading in
            menuContents.fadeIn(150);

            // prevents the default behavior (avoids
            // possible problems)
            event.preventDefault();

            // retrieves the filter associated with the currently
            // selected element
            var filter = element.parents(".filter");

            // retrieves the complete set of selected list items
            // to apply the global characteristics to them
            var selectedListItem = jQuery(".filter-contents > .selected",
                    matchedObject);

            // retrieves ther complete set of buttons currently present
            // in the menu to register for their appropriate events and
            // remove the default buton behavior
            var buttons = jQuery(".button", menu);

            // retrieves the target buttons and then retrieves also the non
            // target buttons (these button need to be registered for the
            // varios mouse event to control the sub menu behavior)
            var targetButtons = jQuery(".button[data-target]", menu);
            var nonTargetButtons = jQuery(
                    ":not(.sub-menu) .button:not([data-target])", menu);

            // registers for the mouse enter event so that the
            // menu may be shown
            targetButtons.mouseenter(function() {
                        // retrieves the current element and add the hover
                        // class to it
                        var element = jQuery(this);
                        element.addClass("hover");

                        // creates the timeout to handle the proper show of
                        // the sub menu (but only in case the element is still
                        // correctly slected)
                        setTimeout(function() {
                                    // in case the element is not selected anymore
                                    // need to avoid showing the sub menu
                                    if (!element.hasClass("hover")) {
                                        // returns immediately, avoiding
                                        // the show of the sub menu
                                        return;
                                    }

                                    // show the sub menu for the currently selected
                                    // button element and menu
                                    _showSubMenu(element, menu);
                                }, 500);
                    });

            // registers for the mouse leave event in the target buttons
            // to be able to remove the hover class reference
            targetButtons.mouseleave(function() {
                        // retrieves the current element and removes the
                        // hover class reference
                        var element = jQuery(this);
                        element.removeClass("hover");
                    });

            // registers for the mouse enter event in the
            // non target button to be able to hide the sub menus
            nonTargetButtons.mouseenter(function() {
                        // removes the selected class from the target buttons
                        // so that no target button remains selected
                        targetButtons.removeClass("selected");

                        // creates a timeout to handle the proper hide of the
                        // visible sub menus (selected non target elements)
                        setTimeout(function() {
                                    // retrieves the complete set of visible sub menus
                                    // and then hides them
                                    var subMenu = jQuery(".sub-menu:visible",
                                            menu);
                                    subMenu.hide();
                                }, 300);
                    });

            // iterates over all the buttons to update their actions
            // and remove the current default button behavior
            buttons.each(function(index, element) {
                // retrieves the current element
                var _element = jQuery(element);

                // removes the link attribute from the element
                // to avoid the button default behavior
                _element.data("link", null);

                // retrieves the index of the element so that is
                // possible to retrieve the equivalent button in
                // the other selected elements
                var elementIndex = _element.index();

                // registers for the click event on the element so
                // that it's possible to "raise" the actions
                _element.click(function(event) {
                            // retrieves the current element
                            var element = jQuery(this);

                            // checks if the currently clicked element is
                            // of type sub element (must open sub menu)
                            var isSubElement = element.hasClass("sub-element");

                            // in case the current element is of type sub element
                            // (special case) must open the submenu
                            if (isSubElement) {
                                // shows the sub menu associated with the element
                                // for the current menu and then returns immediately
                                _showSubMenu(element, menu);
                                return;
                            }

                            // hides the menu and removes it from the current
                            // context (it's not going to be used anymore)
                            menu.hide();
                            menu.remove();

                            // retrieves the menu contents associated with the
                            // current element and then retrieves the identifier
                            // of that menu contents
                            var menuContents = element.parents(".menu-contents");
                            var menuId = menuContents.attr("data-menu_id");

                            // iterates over each of the selected list items
                            // to execute the proper "sequential" action
                            selectedListItem.each(function(index, element) {
                                        // retrieves the current element
                                        var __element = jQuery(element);

                                        // retrieves the buttons associated with the equivalent
                                        // button in its context menu
                                        var button = jQuery(
                                                ".context-menu > .menu-contents[data-menu_id="
                                                        + menuId
                                                        + "] > :nth-child("
                                                        + String(elementIndex
                                                                + 1) + ")",
                                                __element);

                                        // checks if the button is of type document
                                        // (open in same window) and then retrieves the
                                        // value of the link attribute
                                        var isDocument = button.attr("data-document");
                                        var link = button.attr("data-link");

                                        // in cas no link is defined, not possible
                                        // to open the link (must return)
                                        if (!link) {
                                            // returns immediately no need to open
                                            // the link
                                            return;
                                        }

                                        // in case the current button refers a link that
                                        // must be opened as a document and this is the first
                                        // element to be parsed opens the link in the current
                                        // document otherwise creates a new window and opend
                                        // the link in it (external opening)
                                        isDocument && index == 0
                                                ? document.location = link
                                                : window.open(link);
                                    });

                            // tries to retrieve the bulk (to many link)
                            // from the element
                            var linkBulk = _element.attr("data-link_bulk");

                            // in case the bulk link exists a recursive operation
                            // call must be made
                            if (linkBulk) {
                                // initializes the string that will hold the various
                                // string identifier values to be sent for the bulk operation
                                var identifiersList = "";

                                // iterates over each of the selected items to update the
                                // list of items accordingly
                                selectedListItem.each(function(index, element) {
                                            // retrieves the current element reference
                                            var __element = jQuery(element);

                                            // retrieves the object id from the current
                                            // element (this is the element identifier)
                                            // then retrieves it's text value
                                            var objectId = jQuery(".object_id",
                                                    __element);
                                            var id = objectId.text();

                                            // in case the index is greater than zero a comma
                                            // must be appended to the identifiers list
                                            if (index > 0) {
                                                // adds the comma to the identifiers list
                                                identifiersList += ",";
                                            }

                                            // adds the identifier to the identifiers list
                                            identifiersList += id
                                        });

                                // updates the current documents location to the bulk
                                // link, so that the bulk operation takes place
                                document.location = linkBulk + "?object_id="
                                        + identifiersList;
                            }

                            // stops the event propagation and prevents
                            // the default bahavior (avoids propagation problems)
                            event.stopPropagation();
                            event.preventDefault();
                        });
            });
        };

        var _incrementSelection = function(matchedObject, options) {
            // retrieves the current selection value and
            // obtains the first value as the reference value
            var selection = matchedObject.data("selection");
            var _selection = selection[0];

            // in case the selection row not "overlfows"
            if (_selection > 0) {
                // decrements the current selection
                matchedObject.data("selection", [_selection - 1]);
                matchedObject.data("pivot", _selection - 1);
            }

            // updates the current selection
            _updateSelection(matchedObject, options);
        };

        var _decrementSelection = function(matchedObject, options) {
            // retrieves the current selection value and
            // obtains the last value as the reference value
            var selection = matchedObject.data("selection");
            var _selection = selection[selection.length - 1];

            // retrieves the "current" list items
            var listItems = jQuery(".filter-contents > *", matchedObject);

            // in case the selection row not "overlfows"
            if (_selection < listItems.length) {
                // increments the current selection
                matchedObject.data("selection", [_selection + 1]);
                matchedObject.data("pivot", _selection + 1);
            } else {
                // updates the matched object (runs the loading
                // of additional values)
                _update(matchedObject, options);
            }

            // updates the current selection
            _updateSelection(matchedObject, options);
        };

        var _upSelection = function(matchedObject, options) {
            // retrieves the current selection value and
            // obtains the first value as the reference value
            var selection = matchedObject.data("selection");
            var _selection = selection[0];

            // in case the selection row is not the first
            // one (goes to the top)
            if (_selection > 1) {
                // resets the current selection to be top
                // selection value
                matchedObject.data("selection", [1]);
                matchedObject.data("pivot", 1);
            }
            // otherwise goes to the "invisible" value
            else {
                // resets the current selection to be base
                // selection value
                matchedObject.data("selection", [0]);
                matchedObject.data("pivot", 0);
            }

            // updates the current selection
            _updateSelection(matchedObject, options);
        };

        var _downSelection = function(matchedObject, options) {
            // retrieves the current selection value and
            // obtains the last value as the reference value
            var selection = matchedObject.data("selection");
            var _selection = selection[selection.length - 1];

            // retrieves the "current" list items
            var listItems = jQuery(".filter-contents > *", matchedObject);

            // in case the selection row is the last
            // need to load more elements
            if (_selection == listItems.length) {
                // updates the matched object (runs the loading
                // of additional values)
                _update(matchedObject, options);
            }
            // in case the selection row is not the base
            // one (goes to the bottom)
            else if (_selection > 0) {
                // resets the current selection to be bottom
                // selection value
                matchedObject.data("selection", [listItems.length]);
                matchedObject.data("pivot", listItems.length);
            }
            // otherwise it's the base selection and the filter
            // must be scrolled to the top
            else {
                // resets the current selection to be top
                // selection value
                matchedObject.data("selection", [1]);
                matchedObject.data("pivot", 1);
            }

            // updates the current selection
            _updateSelection(matchedObject, options);
        };

        var _updateSelection = function(matchedObject, options) {
            // retrieves the current selection value
            var selection = matchedObject.data("selection");

            // retrieves the current list items
            var listItems = jQuery(".filter-contents > *", matchedObject);

            // removes the selected class from the current list
            // items (unselection) also removes the first and
            // last "control" classes
            listItems.removeClass("selected");
            listItems.removeClass("first");
            listItems.removeClass("last");

            // orders the selection according
            // to the typical arithmetic function
            selection.sort(function(first, second) {
                        // returns the diference between the first
                        // adn the second elements
                        return first - second;
                    });

            // iterates over all the items in the selection
            // to correclty update their control classes
            for (var index = 0; index < selection.length; index++) {
                // retrieves the current the previous and the next
                // selections (for processing)
                var _selection = selection[index];
                var _previous_selection = selection[index - 1];
                var _next_selection = selection[index + 1];

                // retrieves the list item to be selected
                var _selectedListItem = jQuery(".filter-contents > :nth-child("
                                + _selection + ")", matchedObject);

                // adds the selected class to the selected list item
                _selectedListItem.addClass("selected");

                // in case the current index is the first or in case the
                // current selection is not preceded by a contiguous value
                if (index == 0 || _previous_selection != _selection - 1) {
                    // adds the first class to the current selected
                    // list item (indicates that it is the first of
                    // a contiguous selection)
                    _selectedListItem.addClass("first");
                }

                // in case the current index if the last or in case the
                // the current selection is not succeeded by a contiguous value
                if (index == selection.length - 1
                        || _next_selection != _selection + 1) {
                    // adds the last class to the current selected
                    // list item (indicates that it is the last of
                    // a contiguous selection)
                    _selectedListItem.addClass("last");
                }
            }

            // retrieves the complete set of selected list items
            // to apply the global characteristics to them
            var selectedListItem = jQuery(".filter-contents > .selected",
                    matchedObject);

            // retrieves the top offset of the page, using
            // the margin element (from the margin top)
            var margin = jQuery(".margin");
            var marginOffset = margin.offset();
            var pageOffset = marginOffset ? marginOffset.top : 0;

            // tries to retrieve the dom element
            var _element = selectedListItem.get(0)

            // cheks if the element is visible
            var isVisible = _element ? jQuery.uxvisible(selectedListItem,
                    pageOffset) : true;

            // scrolls to the reference in case the
            // element is not visible
            !isVisible && selectedListItem.length == 1
                    && selectedListItem.uxscroll({
                                offset : pageOffset,
                                padding : 10
                            });
        };

        var _incrementRange = function(matchedObject, options) {
            // sets the matched object as the filter reference
            // for further usage
            var filter = matchedObject;

            // retrieves the pivot value and the current selection
            // for the filter reference
            var pivot = filter.data("pivot");
            var selection = filter.data("selection");

            // checks if the pivot is zero and in case it is consider
            // it to be one (first element)
            pivot = pivot == 0 ? 1 : pivot;

            // retrieves the first and last element from the current
            // selection for reference
            var first = selection[0];
            var last = selection[selection.length - 1];

            // in case the current first element is the pivot
            // need to use the last value as reference
            if (first == pivot) {
                // increments the last value and sets it as
                // the proper value
                var value = last - 1;
            }
            // otherwise uses the first value as reference
            else {
                // decrement the first value and sets it as
                // the proper value
                var value = first - 1;
            }

            // in case the current index value is zero
            // it's considered to be invalid, returns immediately
            if (value == 0) {
                // returns immediately, invalid index
                return;
            }

            // runs the range selection process for the currently
            // selected value and then updates the selection
            _rangeSelection(value, filter, options);
            _updateSelection(filter, options);

            // retrieves the complete set of selected list items
            // to apply the global characteristics to them
            var selectedListItem = jQuery(".filter-contents > .selected",
                    matchedObject);

            // retrieves the top offset of the page, using
            // the margin element (from the margin top)
            var margin = jQuery(".margin");
            var marginOffset = margin.offset();
            var pageOffset = marginOffset ? marginOffset.top : 0;

            // in case the current first element is the pivot
            // need to use the last value as reference
            if (first == pivot) {
                // retrieves the last item as the reference one
                var item = jQuery(selectedListItem[selectedListItem.length - 1]);
            }
            // otherwise must use the first one
            else {
                // retrieves the first item as the reference one
                var item = jQuery(selectedListItem[0]);
            }

            // checks if the item is visible and in case it's
            // not scroll the current viewport into the item
            var isVisible = item ? jQuery.uxvisible(item, pageOffset) : true;
            !isVisible && item.uxscroll({
                        offset : pageOffset,
                        padding : 10
                    });
        };

        var _decrementRange = function(matchedObject, options) {
            // sets the matched object as the filter reference
            // for further usage
            var filter = matchedObject;

            // retrieves the pivot value and the current selection
            // for the filter reference
            var pivot = filter.data("pivot");
            var selection = filter.data("selection");

            // checks if the pivot is zero and in case it is consider
            // it to be one (first element)
            pivot = pivot == 0 ? 1 : pivot;

            // retrieves the first and last element from the current
            // selection for reference
            var first = selection[0];
            var last = selection[selection.length - 1];

            // in case the current last element is the pivot
            // need to use the first value as reference
            if (last == pivot) {
                // increments the first value and sets it as
                // the proper value
                var value = first + 1;
            }
            // otherwise uses the last value as reference
            else {
                // increments the last value and sets it as
                // the proper value
                var value = last + 1;
            }

            // retrieves the "current" list items
            var listItems = jQuery(".filter-contents > *", matchedObject);

            // in case the selection row not "overlfows"
            if (value > listItems.length) {
                // updates the matched object (runs the loading
                // of additional values) and returns immediately
                // to avoid further updates
                _update(matchedObject, options);
                return;
            }

            // runs the range selection process for the currently
            // selected value and then updates the selection
            _rangeSelection(value, filter, options);
            _updateSelection(filter, options);

            // retrieves the complete set of selected list items
            // to apply the global characteristics to them
            var selectedListItem = jQuery(".filter-contents > .selected",
                    matchedObject);

            // retrieves the top offset of the page, using
            // the margin element (from the margin top)
            var margin = jQuery(".margin");
            var marginOffset = margin.offset();
            var pageOffset = marginOffset ? marginOffset.top : 0;

            // in case the current last element is the pivot
            // need to use the first value as reference
            if (last == pivot) {
                // retrieves the first item as the reference one
                var item = jQuery(selectedListItem[0]);
            }
            // otherwise must use the last one
            else {
                // retrieves the last item as the reference one
                var item = jQuery(selectedListItem[selectedListItem.length - 1]);
            }

            // checks if the item is visible and in case it's
            // not scroll the current viewport into the item
            var isVisible = item ? jQuery.uxvisible(item, pageOffset) : true;
            !isVisible && item.uxscroll({
                        offset : pageOffset,
                        padding : 10
                    });
        };

        var _upRange = function(matchedObject, options) {
            // sets the matched object as the filter reference
            // for further usage
            var filter = matchedObject;

            // retrieves the pivot value and the current selection
            // for the filter reference
            var pivot = filter.data("pivot");
            var selection = filter.data("selection");

            // runs the range selection process for the currently
            // selected value and then updates the selection
            _rangeSelection(1, filter, options);
            _updateSelection(filter, options);

            // retrieves the complete set of selected list items
            // to apply the global characteristics to them
            var selectedListItem = jQuery(".filter-contents > .selected",
                    matchedObject);

            // retrieves the top offset of the page, using
            // the margin element (from the margin top)
            var margin = jQuery(".margin");
            var marginOffset = margin.offset();
            var pageOffset = marginOffset ? marginOffset.top : 0;

            // retrieves the first item as the reference one
            var item = jQuery(selectedListItem[0]);

            // checks if the item is visible and in case it's
            // not scroll the current viewport into the item
            var isVisible = item ? jQuery.uxvisible(item, pageOffset) : true;
            !isVisible && item.uxscroll({
                        offset : pageOffset,
                        padding : 10
                    });
        };

        var _downRange = function(matchedObject, options) {
            // sets the matched object as the filter reference
            // for further usage
            var filter = matchedObject;

            // retrieves the pivot value and the current selection
            // for the filter reference, then retrieves the current
            // selection reference element
            var pivot = filter.data("pivot");
            var selection = filter.data("selection");
            var _selection = selection[selection.length - 1];

            // retrieves the "current" list items
            var listItems = jQuery(".filter-contents > *", matchedObject);

            // in case the selection row is the last
            // need to load more elements
            if (_selection == listItems.length) {
                // updates the matched object (runs the loading
                // of additional values) and returns immediately
                // to avoid further updates
                _update(matchedObject, options);
                return;
            }

            // runs the range selection process for the currently
            // selected value and then updates the selection
            _rangeSelection(listItems.length, filter, options);
            _updateSelection(filter, options);

            // retrieves the complete set of selected list items
            // to apply the global characteristics to them
            var selectedListItem = jQuery(".filter-contents > .selected",
                    matchedObject);

            // retrieves the top offset of the page, using
            // the margin element (from the margin top)
            var margin = jQuery(".margin");
            var marginOffset = margin.offset();
            var pageOffset = marginOffset ? marginOffset.top : 0;

            // retrieves the last item as the reference one
            var item = jQuery(selectedListItem[selectedListItem.length - 1]);

            // checks if the item is visible and in case it's
            // not scroll the current viewport into the item
            var isVisible = item ? jQuery.uxvisible(item, pageOffset) : true;
            !isVisible && item.uxscroll({
                        offset : pageOffset,
                        padding : 10
                    });
        };

        var _rangeSelection = function(index, matchedObject, options) {
            // sets the matched object as the filter reference
            // for further usage
            var filter = matchedObject;

            // retrieves the current selection and the current
            // pivot item index
            var selection = filter.data("selection");
            var pivot = filter.data("pivot");

            // checks if the pivot is zero and in case it is consider
            // it to be one (first element)
            pivot = pivot == 0 ? 1 : pivot;

            // checks if the current selection is the initial
            // empty selection, in case it's "pops" it from the
            // current selection set (avoids problems in selection)
            var isInitial = selection.length == 1 && selection[0] == 0;
            isInitial && selection.pop();

            // in case the index value is greater than the pivot index
            // it's a range for the down
            if (index >= pivot) {
                // sets the proper initial and final values
                // for the "down" range
                var _initial = pivot;
                var _final = index + 1;
            }
            // otherwise in case the index value is lesser than the pivot
            // index it's a range for the up
            else if (index <= pivot) {
                // sets the proper initial and final values
                // for the "upper" range
                var _initial = index;
                var _final = pivot + 1;
            }

            // creates a new list to hold the new selection values resulting
            // from the range selection
            var _selection = []

            // iterates over the range values to add the selected indexes to
            // the selection list
            for (var index = _initial; index < _final; index++) {
                // adds the index to the list of the selections
                _selection.push(index);
            }

            // updates the selection list in the filter
            filter.data("selection", _selection);
        };

        var _select = function(listItem, matchedObject, options) {
            // sets the filter as the current matched
            // object (back reference)
            var filter = matchedObject;

            // iterates over each of the selected list items
            // to execute their default selection action
            listItem.each(function(index, element) {
                // retrieves the element reference and
                // sets it as the current list item
                var _element = jQuery(element);
                var _listItem = _element;

                // tries to retrieve the value link from the
                // data link attribute in the selected list item
                var valueLink = _listItem.attr("data-link");

                // retrieves the first link element available in the
                // selected list item, then uses it to retrieve
                // its hyperlink reference (in case it's necessary)
                var linkElement = jQuery("a", _listItem);
                var valueLink = valueLink
                        ? valueLink
                        : linkElement.attr("href");

                // in case the value link is set
                if (valueLink) {
                    // retrieves the offset and converts it
                    // into an integer
                    var duration = filter.attr("data-duration");
                    var durationInteger = parseInt(duration);

                    // checks if the duration integer value is valid
                    // conversion successful
                    var durationValid = !isNaN(durationInteger);

                    // in case the duration is valid (the link is
                    // internal and a scroll to shall be used)
                    if (durationValid) {
                        // retrieves the offset and converts it
                        // into an integer
                        var offset = filter.attr("data-offset");
                        var offsetInteger = parseInt(offset);

                        // creates the settings map based on the offset
                        var settings = {
                            offset : isNaN(offsetInteger) ? 0 : offsetInteger
                        }

                        // scrolls to the reference
                        jQuery.uxscrollto(valueLink, durationInteger, settings);
                    }
                    // otherwise the link is external and
                    // no scroll to shall be used
                    else {
                        // in case the current list of item is single
                        // (only one element present) changes the current
                        // document location, otherwise opens a new window
                        // with the value link location (popup)
                        listItem.length <= 1
                                ? document.location = valueLink
                                : window.open(valueLink, "_blank");
                    }
                }
            });
        };

        var _showSubMenu = function(element, menu) {
            // retrieves the target value for the element
            // and then uses it as the selector for the sub menu
            var target = element.attr("data-target");
            var subMenu = jQuery(target, menu);

            // retrieves the top and left offset positions
            // for the current element (these are the offset
            // position of it)
            var offset = element.offset();
            var top = offset["top"];
            var left = offset["left"];

            // retrieves the element with and then uses
            // it to calculate the margin left for the
            // sub menu element
            var elementWidth = element.outerWidth();
            var marginLeft = elementWidth - 3;

            // retrieves the correct scroll position coordinates
            // according to the current browser implementation
            var scrollY = window.scrollY
                    ? window.scrollY
                    : document.body.scrollTop;
            var scrollX = window.scrollX
                    ? window.scrollX
                    : document.body.scrollLeft;

            // sets the proper postion attributes for the
            // submenu so that it's positioned to the right
            // of the action element
            subMenu.css("position", "fixed")
            subMenu.css("margin-left", marginLeft + "px");
            subMenu.css("margin-top", 0 + "px");
            subMenu.css("top", (top - scrollY) + "px");
            subMenu.css("left", (left - scrollX) + "px");

            // adds the selected class to the element (button)
            // so that it's highlighted
            element.addClass("selected");

            // shows the sub menu with a fade effect
            subMenu.fadeIn(150);
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

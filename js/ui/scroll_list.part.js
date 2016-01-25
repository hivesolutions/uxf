/**
 * jQuery scroll list plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a scroll list component.
 *
 * @name jquery-scroll-list.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2015 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxscrolllist = function(options) {
        // the default values for the data query json
        var defaults = {};

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
            // wraps the matched object arround a scroll list container and then
            // retrieves it and adds the previous and next scroll buttons
            matchedObject.wrap("<div class=\"scroll-list-container\"></div>");
            var scrollListContainer = matchedObject.parents(".scroll-list-container");
            scrollListContainer.prepend("<div class=\"scroll-previous\"></div>" +
                "<div class=\"scroll-next\"></div>");

            matchedObject.each(function(index, element) {
                // retrieves the current element and uses it to retrieve the
                // parent scroll list container, to be used in operations
                var _element = jQuery(this);
                var scrollListContainer = _element.parents(".scroll-list-container");

                // retrieves the various margin value from the element
                // to update the scoll list container with these elements
                var marginLeft = _element.css("margin-left");
                var marginRight = _element.css("margin-right");
                var marginTop = _element.css("margin-top");
                var marginBottom = _element.css("margin-bottom");

                // updates the scroll list container with the margin values
                // extracted from the element and then resets the element's
                // margin value to the zero value
                scrollListContainer.css("margin-left", marginLeft);
                scrollListContainer.css("margin-right", marginRight);
                scrollListContainer.css("margin-top", marginTop);
                scrollListContainer.css("margin-bottom", marginBottom);
                _element.css("margin", "0px 0px 0px 0px");

                // runs the "initial" refresh width operation that is going
                // to "populate" the width of the container, note that this
                // may not be final and further refresh width operations may
                // be required in order to obtain proper width on container
                _refreshWidth(_element, options);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrievs the parent scroll list container and uses
            // it to retrieve the scroll previius and next buttons
            var scrollListContainer = matchedObject.parents(".scroll-list-container");
            var scrollPrevious = jQuery(".scroll-previous", scrollListContainer);
            var scrollNext = jQuery(".scroll-next", scrollListContainer);

            scrollPrevious.click(function() {
                // retrieves the current element and the parent scroll list
                // container to be used in the scroll to the right operation
                var element = jQuery(this);
                var scrollListContainer = element.parents(".scroll-list-container");
                var scrollList = jQuery(".scroll-list", scrollListContainer);

                // runs the refresh scroll list width operation so that the
                // width of the scroll list is properly represented/updated
                _refreshWidth(scrollList, options);

                // retrieves the with of the scroll list container to
                // be used in the scroll operation
                var scrollWidth = scrollListContainer.width();

                // animates the scroll right operation using the
                // default animation mechanisms
                scrollListContainer.animate({
                    scrollLeft: "-=" + scrollWidth
                }, 400);
            });

            scrollNext.click(function() {
                // retrieves the current element and the parent scroll list
                // container to be used in the scroll to the left operation
                var element = jQuery(this);
                var scrollListContainer = element.parents(".scroll-list-container");
                var scrollList = jQuery(".scroll-list", scrollListContainer);

                // runs the refresh scroll list width operation so that the
                // width of the scroll list is properly represented/updated
                _refreshWidth(scrollList, options);

                // retrieves the with of the scroll list container to
                // be used in the scroll operation
                var scrollWidth = scrollListContainer.width();

                // animates the scroll left operation using the
                // default animation mechanisms
                scrollListContainer.animate({
                    scrollLeft: "+=" + scrollWidth
                }, 400);
            });
        };

        var _refreshWidth = function(matchedObject, options) {
            // retrieves the reference to the various elements that are required
            // for the complete width refresh operation
            var scrollListContainer = matchedObject.parents(".scroll-list-container");
            var scrollPrevious = jQuery(".scroll-previous", scrollListContainer);
            var scrollNext = jQuery(".scroll-next", scrollListContainer);

            // retrieves the complete set of children of the
            // element that are not clear elements, then counts them
            var children = jQuery("> *:not(.clear)", matchedObject);
            var count = children.length;

            // retrieves the first child and uses it to calculate
            // the complete width for the children, note that the
            // width is retrieved taking into accoun that a proper
            // outer width retrieval may fail under certain conditions
            var first = jQuery(children[0]);
            var firstWidth = first.outerWidth(true) > first.outerWidth(false) ? first.outerWidth(true) :
                first.outerWidth(false);
            var width = firstWidth * count;

            // calculates the complete scroll width to check if the
            // scroll is required in case it's not hides the previous
            // and next operator buttons otherwise shows them
            var scrollWidth = scrollListContainer.width();
            var isScrolled = scrollWidth < width;
            if (isScrolled) {
                scrollPrevious.show();
                scrollNext.show();
            } else {
                scrollPrevious.hide();
                scrollNext.hide();
            }

            // updates the element width with the complete width for its
            // elements (required width)
            matchedObject.width(width);

            // verifiers if the first element is visible and if that's not
            // the case schedules one more width refresh operation in order
            // to ensure the proper and correct values are displayed
            var isVisible = first.is(":visible");
            !isVisible && setTimeout(function() {
                _refreshWidth(matchedObject, options)
            });
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

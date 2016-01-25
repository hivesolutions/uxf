/**
 * jQuery panel more plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a panel more component.
 *
 * @name jquery-select-list.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2015 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxpanelmore = function(options) {
        // the default values for the plugin
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
            // iterates over each of the panel more elements
            // to construct their internal structures
            matchedObject.each(function(index, element) {
                // retrieves the current element (panel more)
                // and the associated more string
                var element = jQuery(this);
                var moreString = element.attr("data-more");

                // wrapps the current element inside the panel more
                // contents to be able to change the visibility
                element.wrapInner("<div class=\"panel-more-contents\"></div>");

                // adds the panel more action container with the
                // button and the divider
                element.append("<div class=\"panel-more-action\">" + "<li class=\"list-more\">" +
                    "<span class=\"button\">" + moreString + "</span>" + "</li>" +
                    "<li class=\"list-divider\"></li>" + "</div>");
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the more button element reference
            // from the matched object
            var moreButton = jQuery("li.list-more .button", matchedObject);

            // registers for the click event on the more
            // button to toggle the contents state
            moreButton.click(function() {
                // retrieves the current element and uses it to retrieve the
                // associated panel more element to be changed
                var element = jQuery(this);
                var panelMore = element.parents(".panel-more");

                // triggers the toggle visibility operation that will
                // start the process of "toggling"
                _toggle(panelMore, options);
            });

            // registers the various elements to the show operation
            // so that it's possible to force the show of the panel
            matchedObject.bind("show", function() {
                var element = jQuery(this);
                _show(element, options);
            });

            // registers the various elements to the hide operation
            // so that it's possible to force the hide of the panel
            matchedObject.bind("hide", function() {
                var element = jQuery(this);
                _hide(element, options);
            });

            // registers the various elements to the toggle operation
            // so that it's possible to force the toggle of the panel
            matchedObject.bind("toggle", function() {
                var element = jQuery(this);
                _toggle(element, options);
            });
        };

        var _show = function(matchedObject, options) {
            // retrieves the various (sub)-element that are going
            // to be used for the processing of the show operation
            var panelMoreContents = jQuery(".panel-more-contents",
                matchedObject);
            var moreButton = jQuery("li.list-more .button", matchedObject);

            // retrieves the string that is going to be used to
            // display the less operation
            var lessString = matchedObject.attr("data-less");

            // shows the panel more contents and updates
            // the text value of the more button
            panelMoreContents.show();
            moreButton.html(lessString);
        };

        var _hide = function(matchedObject, options) {
            // retrieves the various (sub)-element that are going
            // to be used for the processing of the hide operation
            var panelMoreContents = jQuery(".panel-more-contents",
                matchedObject);
            var moreButton = jQuery("li.list-more .button", matchedObject);

            // retrieves the string that is going to be used to
            // display the more operation
            var moreString = matchedObject.attr("data-more");

            // hides the panel more contents and updates
            // the text value of the more button
            panelMoreContents.hide();
            moreButton.html(moreString);
        };

        var _toggle = function(matchedObject, options) {
            // retrieves the various (sub)-element that are going
            // to be used for the processing of the toggle operation
            var panelMoreContents = jQuery(".panel-more-contents",
                matchedObject);

            // checks if the the panel more contents is currently
            // visible, to toggle the visibility
            var isVisible = panelMoreContents.is(":visible");

            // checks if the panel more contents is currently visible
            // in such case must hide it, otherwise must show it
            if (isVisible) {
                _hide(matchedObject, options);
            } else {
                _show(matchedObject, options);
            }
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

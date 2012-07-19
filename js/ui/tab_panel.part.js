/**
 * jQuery tab panel plugin, this jQuery plugin provides the base infra-structure
 * for the creation of a tab panel component.
 *
 * @name jquery-tab-panel.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010-2012 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxtabpanel = function(options) {
        // the default values for the text field
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
            // retrieves the tab selectors
            var tabSelectors = jQuery(".tab-selector", matchedObject);

            // registers for the click event
            // in the tab selectors
            tabSelectors.click(function(event) {
                        // retrieves the element
                        var element = jQuery(this);

                        // retrieves the tab panel and the child
                        // tab selectors
                        var tabPanel = element.parents(".tab-panel");
                        var tabs = jQuery(".tab", tabPanel);
                        var tabSelectors = jQuery(".tab-selector", tabPanel);

                        // removes the active class from (all) the tabs
                        // and from (all) the tab selectors
                        tabs.removeClass("active");
                        tabSelectors.removeClass("active");

                        // retrieves the link reference and
                        // then uses it to retrieve the target element
                        var href = element.attr("href");
                        var targetElement = jQuery(href);

                        // adds the active class to both the
                        // element and the target element
                        element.addClass("active");
                        targetElement.addClass("active");

                        // stops the event propagation
                        // (avoids the normal link behaviour)
                        event.stopPropagation();
                        event.preventDefault();
                    })
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

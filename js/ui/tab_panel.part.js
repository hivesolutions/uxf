/**
 * jQuery tab panel plugin, this jQuery plugin provides the base infra-structure
 * for the creation of a tab panel component.
 *
 * @name uxf-tab-panel.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2017 Hive Solutions Lda.
 * @license Apache License, Version 2.0 - http://www.apache.org/licenses/
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
            // in case the matched object is not defined
            // or in case it's an empty list must return
            // immediatly initialization is not meant to
            // be run (corruption may occur)
            if (!matchedObject || matchedObject.length == 0) {
                return;
            }

            // registers an update hash operation for the next
            // tick operation so that the initial hash is updated
            setTimeout(function() {
                _updateHashChange(matchedObject, options);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the various elements that are going to
            // be used for the registration of handlers
            var _window = jQuery(window);
            var _body = jQuery("body");
            var tabSelectors = jQuery(".tab-selector", matchedObject);

            // registers for the click event in the tab selectors
            // so that the selected may change on click
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
                var targetElement = jQuery(href, tabPanel);

                // verifies if the target element is already active and if
                // that's the case returns immediately (avoids loop in selection)
                var isActive = targetElement.hasClass("active");
                if (isActive) {
                    return true;
                }

                // adds the active class to both the
                // element and the target element
                element.addClass("active");
                targetElement.addClass("active");

                // triggers the tab slected event on the tab panel
                // indicating that a new tab has been selected
                tabPanel.triggerHandler("tab_selected", [targetElement]);

                // tries to retrieve the current uuid from the state
                // if there's non generates a new one, note that this
                // is required so that the new state to be pushed properly
                // represents the visual state of the solution
                var uuid = _body.attr("uuid") || jQuery.uxguid();

                // creates the new state object taking into account both
                // the "target" href value and the current state uuid
                var state = {
                    uuid: uuid,
                    href: href
                };

                // in case the push state function is available for
                // the window element it is used for href change
                window.history.pushState && href && window.history.pushState(state, null, href);

                // stops the event propagation
                // (avoids the normal link behaviour)
                event.stopPropagation();
                event.preventDefault();
            });

            // registers for the hash change event on the window so
            // that it's possible to change the tab accordingly
            _window.bind("hashchange", function() {
                _updateHashChange(matchedObject, options);
            });
        };

        var _updateHashChange = function(matchedObject, options) {
            // retrieves the current hash value from the window and
            // verifies its current value (for validation)
            var hash = window.location.hash;
            if (hash.length == 0 || matchedObject.length == 0) {
                return;
            }

            // tries to retrieve the target element from the matched
            // object using the selected hash and if there's none
            // selected returns the control flow immediately
            var targetElement = jQuery(hash, matchedObject);
            if (targetElement.length == 0) {
                return;
            }

            // verifies if the target element is already active and if
            // that's the case returns immediately (avoids loop in selection)
            var isActive = targetElement.hasClass("active");
            if (isActive) {
                return;
            }

            // retrieves the complete set of elements from the provided
            // matched object that are going to be used in the operation
            var tabs = jQuery(".tab", matchedObject);
            var tabSelectors = jQuery(".tab-selector", matchedObject);
            var tabSelector = jQuery(".tab-selector[href=\"" + hash + "\"]",
                matchedObject);

            // removes the active class from (all) the tabs
            // and from (all) the tab selectors
            tabs.removeClass("active");
            tabSelectors.removeClass("active");

            // adds the active class to both the tab selector
            // and the target element (newly active elements)
            tabSelector.addClass("active");
            targetElement.addClass("active");

            // triggers the tab selected event meaning that a new
            // element has been touched/selected for the tab panel
            matchedObject.triggerHandler("tab_selected", [targetElement]);
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

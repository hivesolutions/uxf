/**
 * jQuery breadcrumbs plugin, this jQuery plugin provides the base
 * infra-structure for the creation of a breadcrumbs component.
 *
 * @name jquery-breadcrumbs.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2010-2012 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function($) {
    jQuery.fn.uxbreadcrumbs = function(method, options) {
        // the default values for the window
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
            // retrieves the index to be set on the initialized
            // object, in case one already exists uses it
            var index = matchedObject.data("index") || 0;

            // sets the initial index information in the breadcrumbs
            // so that the first page is displayed and then runs the
            // breadcrumbs update operation
            matchedObject.data("index", index);
            _update(matchedObject, options);
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
        };

        var _next = function(matchedObject, options) {
            // retrieves the breadcrumbs associated with the
            // current breadcrumbs and then counts them obtain
            // the length of the breadcrumbs
            var breadcrumbs = jQuery("> li", matchedObject);
            var breadcrumbsLength = breadcrumbs.length;

            // retrieves the current index from the matched
            // object to update the current breadcrumb index
            var index = matchedObject.data("index");

            // checks if the current index overflows the
            // current count of breadcrumbs
            if (index == breadcrumbsLength - 1) {
                // returns immediately
                return;
            }

            // updates the index value in the matched object
            // and runs the update function on top of the matched
            // object to update the visuals of the breadcrumbs
            matchedObject.data("index", index + 1);
            _update(matchedObject, options);
        };

        var _previous = function(matchedObject, options) {
            // retrieves the current index from the matched
            // object to update the current breadcrumbs index
            var index = matchedObject.data("index");

            // checks if the current index is zero, in case
            // it's, not possible to go to a previous position
            if (index == 0) {
                // returns immediately
                return;
            }

            // updates the index value in the matched object
            // and runs the update function on top of the matched
            // object to update the visuals of the breadcrumbs
            matchedObject.data("index", index - 1);
            _update(matchedObject, options);
        };

        var _set = function(matchedObject, options) {
            // retrieves the index value to be used to update
            // the stack panel index (argument)
            var index = options["index"] ? options["index"] : 0;

            // updates the index value in the matched object
            // and runs the update function on top of the matched
            // object to update the visuals of the stack panel
            matchedObject.data("index", index);
            _update(matchedObject, options);
        };

        var _update = function(matchedObject, options) {
            // retrieves the current index information, to know
            // which breadcrumb should be displayed
            var index = matchedObject.data("index");

            // retrieves the breadcrumbs associated with the
            // current breadcrumbs list
            var breadcrumbs = jQuery("> li", matchedObject);

            // hides all the breadcrumbs to allow the first one
            // to be displayed on top of all (selected)
            breadcrumbs.removeClass("selected");

            // retrieves the current breadcrumb in the breadcrumbs
            // and selects it in the current context
            var currebtBreadcrumb = jQuery("> li:nth(" + index + ")",
                    matchedObject);
            currebtBreadcrumb.addClass("selected");
        };

        // switches over the method
        switch (method) {
            case "next" :
                // increments the breadcrum to the matched object
                _next(matchedObject, options);

                // breaks the switch
                break;

            case "previous" :
                // decrements the breadcrum from the matched object
                _previous(matchedObject, options);

                // breaks the switch
                break;

            case "set" :
                // sets the breadcrum from the matched object
                _set(matchedObject, options);

                // breaks the switch
                break;

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

/**
 * jQuery drop down plugin, this jQuery plugin provides the base infra-structure
 * for the creation of a drop down component. Should be used for situations
 * where a menu should be displayed uppon a button based action.
 *
 * @name jquery-drop-down.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2015 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxdropdown = function(method, options) {
        // the default values for the drop down
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
            // creates the upper structure for the drop down, this should
            // include the button part so that it's possible to active the
            // drop down contents using the "usual" manner
            matchedObject.wrap("<div class=\"drop-down-container\"></div>");
            var container = matchedObject.parents(".drop-down-container");
            container.prepend("<div class=\"button button-drop-down\"></div>");

            // iterates over the complete set of drop down elements so that
            // it's possible to properly set each button's name
            matchedObject.each(function(index, element) {
                        var _element = jQuery(this);
                        var container = _element.parents(".drop-down-container");
                        var button = jQuery(".button-drop-down", container);
                        var name = _element.attr("data-name");
                        button.text(name);
                    });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the parent drop down container and the button that
            // is going to be used to active the drop down list
            var container = matchedObject.parents(".drop-down-container");
            var button = jQuery(".button-drop-down", container);

            // registers for the click operation in the drop down button
            // that is going to toggle the current drop down list visibility
            button.click(function() {
                        var element = jQuery(this);
                        var container = element.parents(".drop-down-container");
                        var dropDown = jQuery(".drop-down", container);
                        _toggle(dropDown, options);
                    });
        };

        var _toggle = function(matchedObject, options) {
            // verifies the current visibility of the object and then uses
            // the value to decide the operation to be performed
            var isVisible = matchedObject.is(":visible");
            if (isVisible) {
                _hide(matchedObject, options);
            } else {
                _show(matchedObject, options);
            }
        };

        var _show = function(matchedObject, options) {
            var container = matchedObject.parents(".drop-down-container");
            container.addClass("visible");
        };

        var _hide = function(matchedObject, options) {
            var container = matchedObject.parents(".drop-down-container");
            container.removeClass("visible");
        };

        // switches over the method that is going to be performed
        // for the current operation (as requested)
        switch (method) {
            case "show" :
                // runs the show operation on the currently matched
                // object so that the proper contents are displayed
                _show(matchedObject, options);
                break;

            case "default" :
                // initializes the plugin and then breaks the current
                // switch (no more operations)
                initialize();
                break;
        }

        // returns the object
        return this;
    };
})(jQuery);

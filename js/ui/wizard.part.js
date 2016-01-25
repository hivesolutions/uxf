/**
 * jQuery wizard plugin, this jQuery plugin provides the base infra-structure
 * for the creation of a wizard component.
 *
 * @name jquery-wizard.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2016 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxwizard = function(method, options) {
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
            // retrieves the currently selected panel (if any) and then
            // calculates the initial panel index based on it
            var selectedPanel = jQuery(".panel-stack > .panel.selected",
                matchedObject);
            var index = selectedPanel.length > 0 ? selectedPanel.index() : 0;

            // tries to update the initial index value based on the index
            // attribute value (declarative setting)
            index = parseInt(matchedObject.attr("data-index")) || index;

            // sets the initial index information in the wizard
            // so that the first page is displayed and then
            // runs the wizard update operation
            matchedObject.data("index", index);
            _update(matchedObject, options);
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the next and previous button for the
            // wizard control
            var buttonNext = jQuery(".button-next", matchedObject);
            var buttonPrevious = jQuery(".button-previous", matchedObject);

            // registers for the click event on the wizard next button
            // (must push the wizard to the next panel)
            buttonNext.click(function() {
                // rettrieves the element and then uses it to retrieve
                // the parent wizard
                var element = jQuery(this);
                var wizard = element.parents(".wizard");

                // "runs" to the next element in the wizard
                _next(wizard, options);
            });

            // registers for the click event on the wizard previous button
            // (must push the wizard to the previous panel)
            buttonPrevious.click(function() {
                // rettrieves the element and then uses it to retrieve
                // the parent wizard
                var element = jQuery(this);
                var wizard = element.parents(".wizard");

                // "runs" to the previous element in the wizard
                _previous(wizard, options);
            });
        };

        var _next = function(matchedObject, options) {
            // retrieves the panels associated with the
            // current wizard and then counts them obtain
            // the length of the panels
            var panels = jQuery(".panel-stack > .panel", matchedObject);
            var panelsLength = panels.length;

            // retrieves the last index of the panel either from
            // the attribute in the object or from the default value
            var lastIndex = parseInt(matchedObject.attr("data-last_index")) || panels.length - 1;

            // retrieves the current index from the matched
            // object to update the current wizard index
            var index = matchedObject.data("index");

            // checks if the current index overflows the
            // current count of panels (greater than last index)
            if (index == lastIndex) {
                // returns immediately
                return;
            }

            // updates the index value in the matched object
            // and runs the update function on top of the matched
            // object to update the visuals of the wizard
            matchedObject.data("index", index + 1);
            _update(matchedObject, options);
        };

        var _previous = function(matchedObject, options) {
            // retrieves the current index from the matched
            // object to update the current wizard index
            var index = matchedObject.data("index");

            // retrieves the first index of the panel either from
            // the attribute in the object or from the default value
            var firstIndex = parseInt(matchedObject.attr("data-first_index")) || 0;

            // checks if the current index is the first, in such case
            // it's not possible to go to a previous position
            if (index == firstIndex) {
                // returns immediately
                return;
            }

            // updates the index value in the matched object
            // and runs the update function on top of the matched
            // object to update the visuals of the wizard
            matchedObject.data("index", index - 1);
            _update(matchedObject, options);
        };

        var _set = function(matchedObject, options) {
            // retrieves the target index from the options
            // to update the current wizard index
            var index = options["index"];

            // retrieves the panels associated with the
            // current wizard and then uses then to calculate
            // the first and last indexes
            var panels = jQuery(".panel-stack > .panel", matchedObject);
            var firstIndex = parseInt(matchedObject.attr("data-first_index")) || 0;
            var lastIndex = parseInt(matchedObject.attr("data-last_index")) || panels.length - 1;

            // checks if the current index greater thant the
            // first or the last positions, in such case
            // it's not possible to set the position
            if (index < firstIndex || index > lastIndex) {
                // returns immediately
                return;
            }

            // updates the index value in the matched object
            // and runs the update function on top of the matched
            // object to update the visuals of the wizard
            matchedObject.data("index", index);
            _update(matchedObject, options);
        };

        var _update = function(matchedObject, options) {
            // retrieves the current index information, to know
            // which panel should be displayed
            var index = matchedObject.data("index");

            // retrieves the panels associated with the
            // current wizard and then uses then to calculate
            // the first and last indexes
            var panels = jQuery(".panel-stack > .panel", matchedObject);
            var firstIndex = parseInt(matchedObject.attr("data-first_index")) || 0;
            var lastIndex = parseInt(matchedObject.attr("data-last_index")) || panels.length - 1;

            // retrieves the references to the various buttons
            // associated with the current wizard to update their
            // display "settings"
            var buttonFinish = jQuery(".button-finish", matchedObject);
            var buttonNext = jQuery(".button-next", matchedObject);
            var buttonPrevious = jQuery(".button-previous", matchedObject);

            // in case this is the last index in the wizard
            // the finish button must be displayed
            if (index == lastIndex) {
                // in case the button finish is present and
                // defined (must be shown)
                if (buttonFinish.length > 0) {
                    // shows the finish button and hides the next
                    // buttons (final step situation)
                    buttonFinish.show();
                    buttonNext.hide();
                }
                // otherwise there is no finish button present
                // and so the next button must be disabled
                else {
                    // disables the previous button, removing
                    // the action from it
                    buttonNext.uxdisable();
                }
            }
            // otherwise it's a normal situation and the
            // the next button should be displayed
            else {
                // in case the button finish is present and
                // defined (must be hidden)
                if (buttonFinish.length > 0) {
                    // hides the finish button and shows the next
                    // buttons (normal situation)
                    buttonFinish.hide();
                    buttonNext.show();
                }
                // otherwise there is no finish button present
                // and so the next button must be enabled
                else {
                    // disables the previous button, removing
                    // the action from it
                    buttonNext.uxenable();
                }
            }

            // in case this is the first index in the wizard
            // the previous button must be shown as disabled
            // no more steps back
            if (index == firstIndex) {
                // disables the previous button, removing
                // the action from it
                buttonPrevious.uxdisable();
            }
            // otherwise it's a normal situation and the previous
            // button must be displayed normaly
            else {
                // enables the previous button, adding
                // the action to it
                buttonPrevious.uxenable();
            }

            // retrieves the references to the wizard breadcrumbs and
            // for the panel stack (contains the various wizard panels)
            var breadcrumbs = jQuery(".breadcrumbs", matchedObject);
            var panelStack = jQuery(".panel-stack", matchedObject);

            // updates the breadcrumbs and the panel stack indexes to
            // to reflect the new wizard index (graphical change)
            breadcrumbs.uxbreadcrumbs("set", {
                index: index
            });
            panelStack.uxpanelstack("set", {
                index: index
            });

            // triggers the index changed in the matched obect
            // so that listeners can change their behaviour accordingly
            matchedObject.triggerHandler("index_changed", [index]);
        };

        // switches over the method
        switch (method) {
            case "next":
                // increments the wizard index to the next
                // element in the sequence
                _next(matchedObject, options);

                // breaks the switch
                break;

            case "previous":
                // decrements the wizard index to the previous
                // element in the sequence
                _previous(matchedObject, options);

                // breaks the switch
                break;

            case "set":
                // sets the wizard index to the selected
                // element in the sequence
                _set(matchedObject, options);

                // breaks the switch
                break;

            case "default":
                // initializes the plugin
                initialize();

                // breaks the switch
                break;
        }

        // returns the object
        return this;
    };
})(jQuery);

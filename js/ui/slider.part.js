if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

/**
 * jQuery slider plugin, this jQuery plugin provides the base infra-structure
 * for the creation of a slider component. A slider component should be
 * considered to be a top level modal "window like" components that "moves"
 * through panels using either a manual (arrow based) or automated approach.
 *
 * @name uxf-slider.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2019 Hive Solutions Lda.
 * @license Apache License, Version 2.0 - http://www.apache.org/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxslider = function(method, options) {
        // the default values for the text field
        var defaults = {};

        // sets the default method value
        method = method || "default";

        // sets the default options value
        options = options || {};

        // constructs the options
        options = jQuery.extend(defaults, options);

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
         * Creates the necessary HTML for the component.
         */
        var _appendHtml = function() {
            // wraps the slider contents structure
            matchedObject.wrapInner('<div class="slider-contents"></div>');

            // retrieves the first slider panel
            var firstSliderPanel = jQuery(".slider-panel:first-child", matchedObject);

            // adds the active class to the first slider panel
            firstSliderPanel.addClass("active");

            // sets the initial data attributes
            matchedObject.data("offset_left", 0);

            // resizes the slider (matched object) dimensions
            _resize(matchedObject, options);

            // updates the slider (matched object) position
            _update(matchedObject, options);
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the reference to some of the top level
            // elements that are going to be used in registration
            var _window = jQuery(window);
            var _body = jQuery("body");

            // tries to retrieve the global overlay element in case it
            // does not exists creates a new element and then appends it
            // to the current body element (default action)
            var overlay = jQuery(".overlay:first");
            if (overlay.length === 0) {
                _body = jQuery("body");
                overlay = jQuery('<div id="overlay" class="overlay"></div>');
                overlay.uxoverlay();
                _body.prepend(overlay);
            }

            // retrieves the slider panel arows
            // from the matched object
            var sliderPanelArrowNext = jQuery(".slider-panel-arrow-next", matchedObject);
            var sliderPanelArrowPrevious = jQuery(".slider-panel-arrow-previous", matchedObject);

            // registers for the click event in the slide panel
            // arrow next so that the next element is displayed
            sliderPanelArrowNext.click(function() {
                // retrieves the element
                var element = jQuery(this);

                // retrieves the current associated slider panel
                // and checks if it's currently active
                var sliderPanel = element.parents(".slider-panel");
                var isSliderPanelActive = sliderPanel.hasClass("active");

                // in case the current slider panel
                // is not active, returns immediately
                if (!isSliderPanelActive) {
                    return;
                }

                // retrieves the slider and the slider contents
                var slider = element.parents(".slider");

                // moves to the next element
                _moveNext(slider, options);
            });

            // registers for the click event in the slider panel
            // arrow previous so that the previous element is displayed
            sliderPanelArrowPrevious.click(function() {
                // retrieves the element
                var element = jQuery(this);

                // retrieves the current associated slider panel
                // and checks if it's currently active
                var sliderPanel = element.parents(".slider-panel");
                var isSliderPanelActive = sliderPanel.hasClass("active");

                // in case the current slider panel
                // is not active
                if (!isSliderPanelActive) {
                    // returns immediately
                    return;
                }

                // retrieves the slider and the slider contents
                var slider = element.parents(".slider");

                // moves to the previous element
                _movePrevious(slider, options);
            });

            // registers for the click event on the overlay panel
            // to hide the current overlay panel
            overlay.click(function() {
                // hides the element, using the proper strategy
                // to perform such operation
                _hide(matchedObject, options);
            });

            // registers for the key down in the body element
            // so that it may change the current selection based
            // on the arrow key pressing
            _body.keydown(function(event) {
                // retrieves the key value
                var keyValue = event.keyCode
                    ? event.keyCode
                    : event.charCode
                    ? event.charCode
                    : event.which;

                // switches over the key value
                switch (keyValue) {
                    case 37:
                        // moves to the previous element
                        _movePrevious(matchedObject, options);

                        // breaks the switch
                        break;

                    case 39:
                        // moves to the next element
                        _moveNext(matchedObject, options);

                        // breaks the switch
                        break;

                    case 27:
                        _hide(matchedObject, options);
                        break;
                }
            });

            // registers the resize in the window
            _window.resize(function(event) {
                // updates the slider
                _update(matchedObject, options);
            });
        };

        var _show = function(matchedObject, options) {
            // verifies if the current slider object is already
            // visible and if that's the case ignores action
            var isVisible = matchedObject.is(":visible");
            if (isVisible) {
                return;
            }

            // retrieves the overlay element
            var overlay = jQuery(".overlay:first");

            // shows the global overlay and the matched
            // object, this should provide a modal view
            overlay.triggerHandler("show", [250]);
            matchedObject.fadeIn(250);

            // runs the update operation on the slider
            // to be able to display it correctlty
            _resize(matchedObject, options);
            _update(matchedObject, options);
        };

        var _hide = function(matchedObject, options) {
            // verifies if the current slider object is already
            // invisible and if that's the case ignores action
            var isVisible = matchedObject.is(":visible");
            if (!isVisible) {
                return;
            }

            // retrieves the overlay element
            var overlay = jQuery(".overlay:first");

            // hides the both the overlay and the matched
            // object (moving out from modal)
            overlay.triggerHandler("hide", [250]);
            matchedObject.fadeOut(250);
        };

        var _moveNext = function(matchedObject, options) {
            // retrieves the slider and the slider contents
            var slider = matchedObject;
            var sliderContents = jQuery(".slider-contents", matchedObject);

            // checks if the slider is visible and in case it's
            // not returns immediately as there's nothing to be done
            var sliderVisible = slider.is(":visible");
            if (!sliderVisible) {
                return;
            }

            // retrieves the slider attributes, that are going to be
            // used through this function
            var offsetLeft = slider.data("offset_left");

            // retrieves the currently active slider panel
            // and then retrieves its width
            var sliderPanel = jQuery(".slider-panel.active", matchedObject);
            var sliderPanelWidth = sliderPanel.outerWidth(true);

            // retrieves the next slider panel
            var nextSliderPanel = sliderPanel.next();

            // in case there are no more items to the
            // "right" index is maximum
            if (nextSliderPanel.length === 0) {
                // returns immediately
                return;
            }

            // retrieves the current margin left and then
            // calculates the target margin left base on it (using the slider panel width)
            var currentMarginLeft = parseInt(sliderContents.css("margin-left"));
            var targetMarginLeft = currentMarginLeft - sliderPanelWidth;

            // updates the offset left value
            offsetLeft += sliderPanelWidth;

            // changes the margin left of the slider contents to the
            // new value (new panel to be shown)
            sliderContents.css("margin-left", targetMarginLeft);

            // updates the active classes in the slider panel
            sliderPanel.removeClass("active");
            nextSliderPanel.addClass("active");

            // updates the offset left in the slider data
            slider.data("offset_left", offsetLeft);
        };

        var _movePrevious = function(matchedObject, options) {
            // retrieves the slider and the slider contents
            var slider = matchedObject;
            var sliderContents = jQuery(".slider-contents", matchedObject);

            // checks if the slider is visible and in case it's
            // not returns immediately as there's nothing to be done
            var sliderVisible = slider.is(":visible");
            if (!sliderVisible) {
                return;
            }

            // retrieves the slider attributes, that are going to be
            // used through this function
            var offsetLeft = slider.data("offset_left");

            // retrieves the currently active slider panel
            // and then retrieves its width
            var sliderPanel = jQuery(".slider-panel.active", matchedObject);
            var sliderPanelWidth = sliderPanel.outerWidth(true);

            // retrieves the previous slider panel
            var previousSliderPanel = sliderPanel.prev();

            // in case there are no more items to the
            // "right" index is zero
            if (previousSliderPanel.length === 0) {
                // returns immediately
                return;
            }

            // retrieves the current margin left and then
            // calculates the target margin left base on it (using the slider panel width)
            var currentMarginLeft = parseInt(sliderContents.css("margin-left"));
            var targetMarginLeft = currentMarginLeft + sliderPanelWidth;

            // updates the offset left value
            offsetLeft -= sliderPanelWidth;

            // changes the margin left of the slider contents to the
            // new value (new panel to be shown)
            sliderContents.css("margin-left", targetMarginLeft + "px");

            // updates the active classes in the slider panel
            sliderPanel.removeClass("active");
            previousSliderPanel.addClass("active");

            // updates the offset left in the slider data
            slider.data("offset_left", offsetLeft);
        };

        var _update = function(matchedObject, options) {
            // retrieves the slider and the slider contents
            var slider = matchedObject;
            var sliderContents = jQuery(".slider-contents", matchedObject);

            // checks if the slider is visible
            var sliderVisible = slider.is(":visible");

            // in case the slider is not visible shows it
            // in order to retrieve the correct dimensions
            !sliderVisible && slider.show();

            // retrieves the offsert left of the slider
            var offsetLeft = slider.data("offset_left");

            // retrieves the window
            var _window = jQuery(window);

            // retrieves the window dimensions
            var windowWidth = _window.width();

            // retrieves the windows scroll left
            var windowSrollLeft = _window.scrollLeft();

            // retrieves the first slider panel
            var firstSliderPanel = jQuery(".slider-panel:first-child", matchedObject);
            var firstSliderPanelWidth = firstSliderPanel.outerWidth();

            // calculates the left position for the slider contents
            var leftPosition =
                (windowWidth - firstSliderPanelWidth) / 2 + windowSrollLeft - offsetLeft;

            // changes the margin left of the slider contents to the
            // new value (new panel to be shown)
            sliderContents.css("margin-left", leftPosition + "px");

            // in case the slider is not visible hides
            // it again to avoid erroneous measurements
            !sliderVisible && slider.hide();
        };

        var _resize = function(matchedObject, options) {
            // retrieves the slider and the slider contents
            // and the slider panels
            var slider = matchedObject;
            var sliderContents = jQuery(".slider-contents", matchedObject);
            var sliderPanels = jQuery(".slider-panel", matchedObject);

            // checks if the slider is visible
            var sliderVisible = slider.is(":visible");

            // in case the slider is not visible shows it
            // in order to retrieve the correct dimensions
            !sliderVisible && slider.show();

            // starts the slider panels width
            var sliderPanelsWidth = 0;

            // iterates over all the slider panels to calculate
            // the total slider panels width
            sliderPanels.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the element width
                var elementWidth = _element.outerWidth(true);

                // increments the slider panels with with
                // the element width
                sliderPanelsWidth += elementWidth;
            });

            // sets the slider panels width as the slider
            // contents width
            sliderContents.width(sliderPanelsWidth);

            // in case the slider is not visible hides
            // it again to avoid erroneous measurements
            !sliderVisible && slider.hide();
        };

        // switches over the method
        switch (method) {
            case "show":
                // shows the matched object
                _show(matchedObject, options);

                // breaks the switch
                break;

            case "hide":
                // hides the matched object
                _hide(matchedObject, options);

                // breaks the switch
                break;

            case "next":
                // moves to the next element
                _moveNext(matchedObject);

                // breaks the switch
                break;

            case "previous":
                // moves to the previous element
                _movePrevious(matchedObject);

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

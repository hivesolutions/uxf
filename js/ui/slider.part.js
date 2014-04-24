/**
 * jQuery slider plugin, this jQuery plugin provides the base infra-structure
 * for the creation of a slider component.
 *
 * @name jquery-slider.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @date March 10, 2010
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2014 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxslider = function(method, options) {
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
            // wraps the slider contents structure
            matchedObject.wrapInner("<div class=\"slider-contents\"></div>");

            // retrieves the first slider panel
            var firstSliderPanel = jQuery(".slider-panel:first-child",
                    matchedObject);

            // adds the active class to the first slider panel
            firstSliderPanel.addClass("active");

            // sets the initial data attributes
            matchedObject.data("lock", false);
            matchedObject.data("offsetLeft", 0);

            // resizes the slider (matched object) dimensions
            _resize(matchedObject, options);

            // updates the slider (matched object) position
            _update(matchedObject, options);
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the document (element)
            var _document = jQuery(document);

            // retrieves the window
            var _window = jQuery(window);

            // retrieves the slider panel arows
            // from the matched object
            var sliderPanelArrowNext = jQuery(".slider-panel-arrow-next",
                    matchedObject);
            var sliderPanelArrowPrevious = jQuery(
                    ".slider-panel-arrow-previous", matchedObject);

            // registers for the click event in the slide panel
            // arrow next
            sliderPanelArrowNext.click(function() {
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

                        // moves to the next element
                        _moveNext(slider, options);
                    });

            // registers for the click event in the slider panel
            // arrow previous
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

            // registers for the key press in the document
            _document.keypress(function(event) {
                        // retrieves the key value
                        var keyValue = event.keyCode
                                ? event.keyCode
                                : event.charCode ? event.charCode : event.which;

                        // switches over the key value
                        switch (keyValue) {
                            case 37 :
                                // moves to the previous element
                                _movePrevious(matchedObject, options);

                                // breaks the switch
                                break;

                            case 39 :
                                // moves to the next element
                                _moveNext(matchedObject, options);

                                // breaks the switch
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
            // retrieves the overlay element
            var overlay = jQuery(".overlay");

            // shows the overlay
            overlay.fadeIn(250);

            // shows the matched object
            matchedObject.fadeIn(250);
        };

        var _hide = function(matchedObject, options) {
            // retrieves the overlay element
            var overlay = jQuery(".overlay");

            // hides the overlay
            overlay.fadeOut(250);

            // hides the matched object
            matchedObject.fadeOut(250);
        };

        var _moveNext = function(matchedObject, options) {
            // retrieves the slider and the slider contents
            var slider = matchedObject;
            var sliderContents = jQuery(".slider-contents", matchedObject);

            // checks if the slider is visible
            var sliderVisible = slider.is(":visible");

            // in case the slider is not visible
            if (!sliderVisible) {
                // returns immediately
                return;
            }

            // retrieves the slider attributes
            var lock = slider.data("lock");
            var offsetLeft = slider.data("offsetLeft");

            // in case the lock attribute is set
            // (animation still pending)
            if (lock) {
                // returns immediately
                return;
            }

            // retrieves the currently active slider panel
            // and then retrieves its width
            var sliderPanel = jQuery(".slider-panel.active", matchedObject);
            var sliderPanelWidth = sliderPanel.outerWidth(true);

            // retrieves the next slider panel
            var nextSliderPanel = sliderPanel.next();

            // in case there are no more items to the
            // "right" index is maximum
            if (nextSliderPanel.length == 0) {
                // returns immediately
                return;
            }

            // retrieves the current margin left and then
            // calculates the target margin left base on it (using the slider panel width)
            var currentMarginLeft = parseInt(sliderContents.css("margin-left"));
            var targetMarginLeft = currentMarginLeft - sliderPanelWidth;

            // updates the offset left value
            offsetLeft += sliderPanelWidth;

            // animates the slider contents to the new margin left
            sliderContents.animate({
                        marginLeft : targetMarginLeft
                    }, 500, "linear", function() {
                        slider.data("lock", false);
                    });

            // updates the active classes in the slider panel
            sliderPanel.removeClass("active");
            nextSliderPanel.addClass("active");

            // sets the lock attribute in the slider
            slider.data("lock", true);

            // updates the offset left in the slider data
            slider.data("offsetLeft", offsetLeft);
        };

        var _movePrevious = function(matchedObject, options) {
            // retrieves the slider and the slider contents
            var slider = matchedObject;
            var sliderContents = jQuery(".slider-contents", matchedObject);

            // checks if the slider is visible
            var sliderVisible = slider.is(":visible");

            // in case the slider is not visible
            if (!sliderVisible) {
                // returns immediately
                return;
            }

            // retrieves the slider attributes
            var lock = slider.data("lock");
            var offsetLeft = slider.data("offsetLeft");

            // in case the lock attribute is set
            // (animation still pending)
            if (lock) {
                // returns immediately
                return;
            }

            // retrieves the currently active slider panel
            // and then retrieves its width
            var sliderPanel = jQuery(".slider-panel.active", matchedObject);
            var sliderPanelWidth = sliderPanel.outerWidth(true);

            // retrieves the previous slider panel
            var previousSliderPanel = sliderPanel.prev();

            // in case there are no more items to the
            // "right" index is zero
            if (previousSliderPanel.length == 0) {
                // returns immediately
                return;
            }

            // retrieves the current margin left and then
            // calculates the target margin left base on it (using the slider panel width)
            var currentMarginLeft = parseInt(sliderContents.css("margin-left"));
            var targetMarginLeft = currentMarginLeft + sliderPanelWidth;

            // updates the offset left value
            offsetLeft -= sliderPanelWidth;

            // animates the slider contents to the new margin left
            sliderContents.animate({
                        marginLeft : targetMarginLeft
                    }, 500, "linear", function() {
                        slider.data("lock", false);
                    });

            // updates the active classes in the slider panel
            sliderPanel.removeClass("active");
            previousSliderPanel.addClass("active");

            // sets the lock attribute in the slider
            slider.data("lock", true);

            // updates the offset left in the slider data
            slider.data("offsetLeft", offsetLeft);
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
            var offsetLeft = slider.data("offsetLeft");

            // retrieves the window
            var _window = jQuery(window);

            // retrieves the window dimensions
            var windowHeight = _window.height();
            var windowWidth = _window.width();

            // retrieves the windows scroll left
            var windowSrollLeft = _window.scrollLeft();

            // retrieves the first slider panel
            var firstSliderPanel = jQuery(".slider-panel:first-child",
                    matchedObject);
            var firstSliderPanelWidth = firstSliderPanel.outerWidth();

            // calculates the left position for the slider contents
            var leftPosition = ((windowWidth - firstSliderPanelWidth) / 2)
                    + windowSrollLeft - offsetLeft;

            // sets the (margin) left position in the slider contents
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
            case "show" :
                // shows the matched object
                _show(matchedObject, options);

                // breaks the switch
                break;

            case "hide" :
                // hides the matched object
                _hide(matchedObject, options);

                // breaks the switch
                break;

            case "next" :
                // moves to the next element
                _moveNext(matchedObject);

                // breaks the switch
                break;

            case "previous" :
                // moves to the previous element
                _movePrevious(matchedObject);

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

/**
 * jQuery slideshow plugin, this jQuery plugin provides the base infra-structure
 * for the creation of a slideshow component. The slideshow component provides a
 * structure for the display of multiple items (may include images) as a
 * sequence that is changed using a set of animations. Total control of the
 * component is provided through event triggering.
 *
 * @name jquery-slideshow.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2015 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxslideshow = function(options) {
        // the base64 code of an image that may be used to
        // clear an image based element, this is used to provide
        // a way to clear the element between image transitions
        var IMAGE_CLEAR = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

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
            // iterates over all the slideshow elements to create their
            // internal structure and to populate the initial values
            matchedObject.each(function(index, element) {
                // retrieves the current element
                var _element = jQuery(this);

                // retrieves the various attributes that control the way the
                // slideshow is going to be initialized
                var paused = _element.attr("data-paused");

                // adds the image and the controls section to the current element
                // so that the normal placeholders are available
                _element.prepend("<div class=\"slideshow-image\">" + "<img />"
                        + "</div>" + "<div class=\"slideshow-controls\">"
                        + "<ul class=\"slideshow-alternates\"></ul>" + "</div>");

                // retrieves both the alternates and the items section
                // of the current element to be used for the construction
                // of the correct set of alternates
                var alternates = jQuery(".slideshow-alternates", _element);
                var items = jQuery("> .items li", _element);

                // initializes the list that will hold the various structures
                // representing the various items
                var _items = [];

                // iterates over each of the (element) items to construct the
                // logical structure representation for them
                items.each(function(index, element) {
                            // retrieves the current item (element) and uses it to
                            // retrieve the underlying elements
                            var item = jQuery(this);
                            var elements = jQuery("> *", item);

                            // creates the item structure and insets it to the
                            // list of item structures
                            var _item = {};
                            _items.push(_item);

                            // iterates over each of the components (elements)
                            // to populate the item structure
                            elements.each(function(index, element) {
                                        // retrieves the current element and the name (key)
                                        // attribute and the contents as the value
                                        var element = jQuery(this);
                                        var name = element.attr("data-name");
                                        var value = element.html();

                                        // update the item with the key associated
                                        // with the value
                                        _item[name] = value;
                                    });
                        });

                // iteates over the range of the item to inset the
                // list item representing the alternative for the item
                for (var index = 0; index < _items.length; index++) {
                    alternates.append("<li></li>");
                }

                // sets the list of structural items in the element
                // and then selects the first element (initial position)
                _element.data("items", _items);
                __select(_element, options, 0);

                // creates the interval to update the slideshow position
                // to the next one and then sets it in the current element
                // data (for possible future cancelation)
                var interval = setInterval(function() {
                            __select(_element, options, null);
                        }, 5000);
                _element.data("interval", interval);

                // in case the paused flag is set the currently created
                // interval is immediately cleared so that no image changing
                // is triggered from time to time (slideshow paused)
                paused && clearInterval(interval);
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the references to the image, details and the
            // alternates to be used for event registration
            var image = jQuery(".slideshow-image", matchedObject);
            var details = jQuery(".slideshow-details", matchedObject);
            var alternates = jQuery(".slideshow-alternates > li", matchedObject);

            // registers for the click event on the image to trigger
            // the url resolution and document change
            image.click(function(event) {
                // retrieves the current element and the parent
                // slideshow
                var element = jQuery(this);
                var slideshow = element.parents(".slideshow");

                // retrieves the url information from the slideshow
                // data and opens the respective url, note that if
                // the window flag is set a new window is always open
                var url = slideshow.data("url");
                var open = slideshow.attr("data-window");
                if (url) {
                    var _window = event.which == 2
                    _window || open ? window.open(url) : jQuery.uxlocation(url);
                }
            });

            // registers for the click event on the details to trigger
            // the url resolution and document change
            details.click(function() {
                // retrieves the current element and the parent
                // slideshow
                var element = jQuery(this);
                var slideshow = element.parents(".slideshow");

                // retrieves the url information from the slideshow
                // data and opens the respective url, note that if
                // the window flag is set a new window is always open
                var url = slideshow.data("url");
                var open = slideshow.attr("data-window");
                if (url) {
                    var _window = event.which == 2
                    _window || open ? window.open(url) : jQuery.uxlocation(url);
                }
            });

            // registers for the click event on the alternates list
            // items to change the current element
            alternates.click(function() {
                        // retrieves the current element and the parent
                        // slideshow
                        var element = jQuery(this);
                        var slideshow = element.parents(".slideshow");

                        // retrieves the current interval and clears it (cancelation)
                        // so that no more automated changing takes place
                        var interval = slideshow.data("interval");
                        clearInterval(interval);

                        // retrieves the index of the curret element index
                        // and selects the equivalent item in the slideshow
                        var index = element.index();
                        __select(slideshow, options, index);
                    });

            // registers for the pause event on the matched object, that
            // should pause the current seqeunce of images
            matchedObject.bind("pause", function() {
                        // retrives the current element (slideshow) and uses it to
                        // gather the registered interval to cancel it (no more iterations)
                        var element = jQuery(this);
                        var interval = slideshow.data("interval");
                        clearInterval(interval);
                    });

            // registers for the next (item) event that changes the currently
            // displayed item to the next one (using the animation)
            matchedObject.bind("next", function() {
                        // retrieves the reference to the current element an then
                        // triggers the operations for the next item to be displayed
                        var element = jQuery(this);
                        __next(element, options);
                    });

            // registers for the event that takes the one item back
            // so that the slideshow is changed to the previous element
            matchedObject.bind("previous", function() {
                        // gathers the reference to the top level element (slideshow)
                        // and then runs the previous operation in it to go back one item
                        var element = jQuery(this);
                        __previous(element, options);
                    });

            // registers for the event that selects the target of
            // the slideshow "directly" from the index value of it
            matchedObject.bind("select", function(event, index) {
                        // retrieves the reference to the (slideshow) element and then runs
                        // the select operation on top of for proper index based selection
                        var element = jQuery(this);
                        __select(element, options, index);
                    });
        };

        var __next = function(matchedObject, options) {
            // retrieves the currently set items from the matched
            // object and then the currently selected index
            var items = matchedObject.data("items");
            var current = matchedObject.data("index");

            // sets the default value for the items value, so that
            // a valid sequence allways exists
            var items = items || []

            // calculates the proper next index value, taking into account
            // the current state and then runs the selection on the
            // current matched object
            var index = current + 1 < items.length ? current + 1 : 0;
            __select(matchedObject, options, index);
        };

        var __previous = function(matchedObject, options) {
            // retrieves the currently set items from the matched
            // object and then the currently selected index
            var items = matchedObject.data("items");
            var current = matchedObject.data("index");

            // sets the default value for the items value, so that
            // a valid sequence allways exists
            var items = items || []

            // calculates the proper previous index value, taking into account
            // the current state and then runs the selection on the
            // current matched object
            var index = current - 1 > -1 ? current - 1 : items.length - 1;
            __select(matchedObject, options, index);
        };

        var __select = function(matchedObject, options, index) {
            // retrieves the currently set items from the matched
            // object and then the currently selected index
            var items = matchedObject.data("items");
            var current = matchedObject.data("index");

            // in case there are no valid items for the current
            // element returns immediately (nothing to be done)
            if (!items) {
                return;
            }

            // in case the index value is not set selects the next
            // value (takes care of overflow) otherwise defaults to
            // the request index (from parameter)
            index = index == null ? current + 1 < items.length
                    ? current + 1
                    : 0 : index;

            // in case the current index is the same as the (target)
            // index, no need to select it (returns immediately)
            if (current === index) {
                return;
            }

            // retrieves the name of the animation that is going to be used
            // to animation the transition between both elements, this is
            // latter going to be used in the alternationn between panels
            var animation = matchedObject.attr("data-animation") || "fade";

            // retrieves the list of (selected) alternates and disables
            // the value (going to change the item)
            var alternates = jQuery(".slideshow-alternates > li.active",
                    matchedObject);
            alternates.removeClass("active");

            // retrieves the target index alternate and selects it by adding
            // the active class to it
            var alternate = jQuery(".slideshow-alternates > li:nth-child("
                            + (index + 1) + ")", matchedObject);
            alternate.addClass("active");

            // retrieves the image element for the slideshow and then retrieves
            // the source attribute from it
            var image = jQuery(".slideshow-image > img", matchedObject);
            var source = image.attr("src");

            // retrieves the target item structure to be used to populate
            // the various components for the target state in case the
            // value is not valid return immediately (nothing to be done)
            var item = items[index];
            if (!item) {
                return;
            }

            // in case the source value is set, there is a previous image
            // must fade it out and only then show the new one
            if (source) {
                // runs the proper animation to change the current image
                // element into the target item image value
                __animate(animation, image, item);
            } else {
                // changes the source field of the image directly to
                // take effect immediately
                image.attr("src", item["image"]);
            }

            // retrieves the detail section of the slideshow to update
            // their set of values
            var details = jQuery(".slideshow-details > *", matchedObject);

            // iterates over each of the details to update the elements
            // with the value from the item structure
            details.each(function(index, element) {
                        // retrieves the current element and the name of it and
                        // updates the contents of it with the correspondent item
                        // structure value
                        var _element = jQuery(this);
                        var name = _element.attr("data-name");
                        _element.html(item[name]);
                    });

            // updates the url with the (current) item url and the
            // index value with the target index
            matchedObject.data("url", item.url);
            matchedObject.data("index", index);
        };

        var __animate = function(animation, image, item) {
            // switched between the proper animation to perform
            // the transition of the provided image according to
            // the data defined in the item
            switch (animation) {
                case "static" :
                    __static(image, item);
                    break;
                case "fade" :
                    __fade(image, item);
                    break
            }
        };

        var __static = function(image, item) {
            // changes the source of the image directly to the target image
            // value withou any kind of animation taking part
            image.attr("src", IMAGE_CLEAR);
            image.attr("src", item.image);
        };

        var __fade = function(image, item) {
            // runs the fading of the image element and then changed the
            // source of the image and fades the image back in
            image.fadeOut(300, function() {
                        image.attr("src", item.image);
                        image.fadeIn(750);
                    });
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

(function(jQuery) {
    jQuery.fn.uxresize = function() {
        // retrieves the references to the current matched object
        // and the window object, to be used in the resize event
        var matchedObject = this;
        var _window = jQuery(window);

        // verifies if there's at leat one valid object matched and
        // if that's not the case returns the current context immediately
        if (!matchedObject || matchedObject.length === 0) {
            return this;
        }

        // tries to retrieve the defined generate timeout value
        // from the matched object and in case it's not defined
        // fallback to a defualt value, then uses this value to
        // define a timeout for the resize operation
        var timeout = matchedObject.attr("data-timeout") || 1000;
        setTimeout(function() {
            _window.trigger("resize");
        }, timeout);

        // returns the reference to the current context to
        // the caller object so that it may be "re-used"
        return this;
    };
})(jQuery);

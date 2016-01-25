(function(jQuery) {
    jQuery.fn.uxreset = function() {
        // sets the jquery matched object
        var matchedObject = this;

        // iterates over all the elements that were selected
        // in order to perform the reset operation in each of them
        matchedObject.each(function(index, element) {
            // retrieves the reference to the current
            // element for which the reset operation will
            // be perfomed and the value set to the original
            var _element = jQuery(this);

            // retrieves the object (type) for the currently
            // matched object then uses it to construct the method
            // name to be used and uses it to retrieve the the
            // value for the component
            var object = _element.attr("data-object");
            var method = _element["ux" + object];
            method && method.call(_element, "reset");

            // triggers the reset event on the current element indicating
            // that a reset operation has been performed in it
            _element.triggerHandler("_reset");
        });

        // returns the reference to the current context to
        // the caller object so that it may be "re-used"
        return this;
    };
})(jQuery);

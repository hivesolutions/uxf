(function(jQuery) {
    jQuery.fn.uxwidth = function() {
        // sets the jquery matched object
        var matchedObject = this;

        // starts the value for the total width
        // to be computed for the elements
        var width = 0;

        // iterates over all the matched objects
        // to calculate the total width for them
        matchedObject.each(function(index, element) {
                    // retrieves the current element
                    var _element = jQuery(this);

                    // increments the current width counter
                    // with the total width of the element
                    width += _element.outerWidth(true);
                });

        // returns the calculated width
        return width;
    }
})(jQuery);

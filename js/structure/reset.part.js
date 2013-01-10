(function($) {
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
                    var method = _element["ux" + object]
                    method && method.call(_element, "reset");
                });
    }
})(jQuery);

(function(jQuery) {
    jQuery.fn.uxobject = function(type) {
        // retrieves the reference to the object in context
        // the one that is going to be set with the proper
        // object type for future reference
        var matchedObject = this;

        // iterates over the complete set of selected elements
        // in order to change their internal structure
        matchedObject.each(function(index, element) {
                    // retrieves the reference to the current element
                    // in iteration that is going to be marked as object
                    var _element = jQuery(this);

                    // verifies if a previous type has already been set
                    // in the object, for such cases the function must
                    // return immediately to avoid duplicated type
                    var _type = _element.attr("data-object");
                    if (_type) {
                        return;
                    }

                    // sets the object type in the data object attribute
                    // for the currently matched object
                    _element.attr("data-object", type);
                });

        // returns the current context so that it may be used in
        // a chain based processing operation (as expected)
        return this;
    };
})(jQuery);

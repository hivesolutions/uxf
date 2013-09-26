(function(jQuery) {
    jQuery.fn.uxobject = function(type) {
        // retrieves the reference to the object in context
        // the one that is going to be set with the proper
        // object type for future reference
        var matchedObject = this;

        // verifies if a previous type has already been set
        // in the object, for such cases the function must
        // return immediately to avoid duplicated type
        var _type = matchedObject.attr("data-object");
        if (_type) {
            return;
        }

        // sets the object type in the data object attribute
        // for the currently matched object
        matchedObject.uxobject(type);
    };
})(jQuery);

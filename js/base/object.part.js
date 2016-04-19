(function(jQuery) {
    jQuery.fn.uxobject = function(type, transparent, force) {
        // retrieves the reference to the object in context
        // the one that is going to be set with the proper
        // object type for future reference
        var matchedObject = this;

        // determines the positive version of the element
        // verification, this is going to be used to mark
        // the top level element entrypoints, relevant to
        // determined the correct entry hierarchy levels
        // for each of the graphical components/elements
        var isElement = transparent ? false : true;

        // iterates over the complete set of selected elements
        // in order to change their internal structure
        matchedObject.each(function(index, element) {
            // retrieves the reference to the current element
            // in iteration that is going to be marked as object
            var _element = jQuery(this);

            // verifies if a previous type has already been set
            // in the object, for such cases the function must
            // return immediately to avoid duplicated type, note
            // that if used the force flag avoids such behaviour
            var _type = _element.attr("data-object");
            if (_type && !force) {
                return;
            }

            // tries to find any top element in the parent hierarchy
            // in case none is found the element is considered to
            // be a top one and the proper attribute is added
            var parents = isElement ? _element.parents("[data-top]") : [];
            var isTop = parents.length == 0 && isElement;
            isTop && _element.attr("data-top", "1")

            // retrieves the complete set of children elements
            // marked as top and removes such association, as
            // they are no longer considered to be top objects
            var childrenTop = isTop ? jQuery("[data-top]", _element) : [];
            isTop && childrenTop.removeAttr("data-top");

            // sets the object type in the data object attribute
            // for the currently matched object
            _element.attr("data-object", type);
        });

        // returns the current context so that it may be used in
        // a chain based processing operation (as expected)
        return this;
    };
})(jQuery);

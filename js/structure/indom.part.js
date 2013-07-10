(function(jQuery) {
    jQuery.fn.uxindom = function() {
        // retrieves the current matched object and in case the
        // length of it is zero returns immediately in error
        var matchedObject = this;
        if (matchedObject.length == 0) {
            return false;
        }

        // retrieves the first element from the matched object and
        // then verifies if the element is contained in the current
        // document element (dom verification)
        var element = matchedObject[0];
        var inDom = jQuery.contains(document, element);
        return inDom;
    };
})(jQuery);

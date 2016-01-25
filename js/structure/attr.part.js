(function(jQuery) {
    /**
     * The regular expression that is going to be used to match possible illegal
     * attribute values (template ones).
     */
    var ATTR_REGEX = new RegExp("%\\[.*\\]");

    jQuery.fn.uxattr = function(attrName, attrNameTarget) {
        // sets the jquery matched object
        var matchedObject = this;

        // creates the attribute selector and uses it to retrieve
        // only the elements that have the requested attribute set
        var attributeSelector = "[" + attrName + "]";
        var attributeElements = jQuery(attributeSelector, matchedObject);

        // iterates over all the attribute elements, that were
        // "selected" for the target attribute name
        attributeElements.each(function(index, element) {
            // retrieves the current attribute element
            var _element = jQuery(element);

            // retrieves the attribute and re-sets it under the
            // "new" attribute name, then removes the old attribute
            // name from the element, should avoid possible collisions
            // note that the attribute value is first verified for
            // possible illegal values and skipped if it's illegal
            var attribute = _element.attr(attrName);
            var isIlegal = attribute.match(ATTR_REGEX) != null;
            if (isIlegal) {
                return;
            }
            _element.attr(attrNameTarget, attribute);
            _element.removeAttr(attrName);
        });

        // returns the reference to the current context to
        // the caller object so that it may be "re-used"
        return this;
    };
})(jQuery);

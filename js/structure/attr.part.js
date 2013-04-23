(function(jQuery) {
    jQuery.fn.uxattr = function(attrName, attrNameTarget) {
        // sets the jquery matched object
        var matchedObject = this;

        // creates the attribute selector and uses it to retrieve
        // only the elements that have the requested attribute set
        var attributeSelector = "[" + attrName + "]";
        var attributeElements = jQuery(attributeSelector, matchedObject);

        // iterates over all the attribute elements
        attributeElements.each(function(index, element) {
                    // retrieves the current attribute element
                    var _element = jQuery(element);

                    // retrieves the attribute and re-sets it
                    // under the "new" attribute name, then remove
                    // the old attribute name from the element, should
                    // avoid possible collisions
                    var attribute = _element.attr(attrName);
                    _element.attr(attrNameTarget, attribute);
                    _element.removeAttr(attrName);
                });
    };
})(jQuery);

(function(jQuery) {
    jQuery.fn.uxattr = function(attrName, attrNameTarget) {
        // sets the jquery matched object
        var matchedObject = this;

        // creates the attribute selector
        var attributeSelector = "[" + attrName + "]";

        // retrieves the elements that contain the attribute
        var attributeElements = jQuery(attributeSelector, matchedObject);

        // iterates over all the attribute elements
        attributeElements.each(function(index, element) {
                    // retrieves the current attribute element
                    var attributeElement = jQuery(element);

                    // retrieves the attribute and re-sets it
                    // under the "new" attribute name
                    var attribute = attributeElement.attr(attrName);
                    attributeElement.attr(attrNameTarget, attribute);
                });
    }
})(jQuery);

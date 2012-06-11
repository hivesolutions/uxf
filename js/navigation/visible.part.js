jQuery.uxvisible = function isScrolledIntoView(element, offset) {
    // retreives the offset value, talking into
    // acccount the default value
    offset = offset ? offset : 0;

    // retrieves the window and the "proper"
    // element reference
    var _window = jQuery(window);
    var element = jQuery(element);

    // retrieves the element height (for overflow calculation)
    var elementHeight = element.outerHeight();

    // retrieves the top and bottom positions of the
    // view(port) element
    var viewTop = _window.scrollTop() + offset;
    var viewBottom = _window.scrollTop() + _window.height();

    // retrieves the element top and bottom positions
    var elementTop = element.offset().top;
    var elementBottom = elementTop + element.outerHeight();

    // runs the intersection test on the element against
    // the view(port) values
    return ((elementBottom >= viewTop) && (elementTop <= viewBottom)
            && (elementBottom <= viewBottom) && (elementTop >= viewTop));
};

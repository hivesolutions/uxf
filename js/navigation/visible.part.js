(function(jQuery) {
    jQuery.uxvisible = function(element, offset, delta, parent) {
        // retreives the offset value, talking into
        // acccount the default value
        offset = offset ? offset : 0;

        // retrieves the delta value that can be used to
        // control the poistion of the element to be teste
        // for visibility (margin delta)
        delta = delta ? delta : 0;

        // retrieves the parent element for which the check
        // for visibility will be made, in case none is provided
        // the check is considered global (window)
        parent = parent ? parent : window;

        // retrieves the window and the "proper"
        // element reference
        var _parent = jQuery(parent);
        var element = jQuery(element);

        // retrieves the element height (for overflow calculation)
        var elementHeight = element.outerHeight();

        // retrieves the offset values for the parent element (view)
        // and calculates the height of that view taking into account
        // if the current parent is the window (avoids problems)
        var viewOffset = _parent.offset();
        var viewOffsetTop = viewOffset ? viewOffset.top : 0;
        var viewHeight = _parent[0] == window ? _parent.height() : _parent.outerHeight();
        var viewScrollTop = _parent.scrollTop();

        // retrieves the offset top the top of the element taking into
        // account if the current parent in use is the window element
        var elementOffsetTop = _parent[0] == window ? element.offset().top : element.offset().top +
            viewScrollTop;

        // retrieves the top and bottom positions of the
        // view(port) element
        var viewTop = viewOffsetTop + viewScrollTop + offset;
        var viewBottom = viewOffsetTop + viewScrollTop + viewHeight;

        // retrieves the element top and bottom positions
        var elementTop = elementOffsetTop + delta;
        var elementBottom = elementTop + element.outerHeight();

        // runs the intersection test on the element against
        // the view(port) values
        return ((elementBottom >= viewTop) && (elementTop <= viewBottom) && (elementBottom <= viewBottom) && (
            elementTop >= viewTop));
    };
})(jQuery);

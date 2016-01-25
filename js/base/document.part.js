(function(jQuery) {
    jQuery.fn.uxdocument = function() {
        // retrieves the global elements, both the body and
        // the window to be used for attribute retrieval
        var _body = jQuery("body");
        var _window = jQuery(window);

        // verifies if the current plugin has already been
        // registered and in such case returns immediately
        // otherwise sets the flag indicating so
        var isRegistered = _body.data("uxdocument");
        if (isRegistered) {
            return;
        }
        _body.data("uxdocument", true);

        // registers for the resize operation in the window
        // so that the event is propagated for the resizable
        // elements in the proper way
        _window.resize(function() {
            var element = jQuery(this);
            var resizables = jQuery(".resizable:visible");
            resizables.hide();
            element.triggerHandler("size");
            resizables.show();
        });

        // returns the current context so that it may be used in
        // a chain based processing operation (as expected)
        return this;
    };
})(jQuery);

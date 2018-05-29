(function(jQuery) {
    jQuery.uxctrl = function(keycode, callback, parameters) {
        // retrieves the document element
        var _document = jQuery(document);

        // registers for the key down press in the document
        _document.keydown(function(event) {
            // retrieves the key value
            var keyValue = event.keyCode ? event.keyCode : event.charCode ? event.charCode : event.which;

            // sets the default parameters
            parameters = parameters || [];

            // in case the control key is set and the currently
            // pressed key is the one defined for registration
            // the event callback is called and the event prevented
            if ((event.ctrlKey || event.metaKey) && keyValue === keycode) {
                // calls the callback with the current context
                // and the arguments
                callback.apply(this, arguments);

                // prevents the current default event and the
                // returns immediately, no more logic executed
                event.preventDefault();
                event.stopPropagation();
                return;
            }
        });
    };
})(jQuery);

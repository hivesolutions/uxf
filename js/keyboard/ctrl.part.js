(function(jQuery) {
    jQuery.uxctrl = function(keycode, callback, arguments) {
        // retrieves the document element
        var _document = jQuery(document);

        // registers for the key down press in the document
        _document.keydown(function(event) {
                    // retrieves the key value
                    var keyValue = event.keyCode
                            ? event.keyCode
                            : event.charCode ? event.charCode : event.which;

                    // sets the default arguments
                    var arguments = arguments ? arguments : [];

                    // in case the control key is set an
                    if (event.ctrlKey && keyValue == keycode) {
                        // calls the callback with the current context
                        // and the arguments
                        callback.apply(this, arguments);

                        // returns false (avoids event propagation)
                        return false;
                    }
                });
    };
})(jQuery);

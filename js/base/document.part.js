(function(jQuery) {
    jQuery.fn.uxdocument = function() {
        var matchedObject = this;
        var _body = jQuery("body");
        matchedObject.resize(function() {
                    var resizables = jQuery(".resizable:visible");
                    resizables.hide();
                    matchedObject.triggerHandler("size");
                    resizables.show();
                });
    };
})(jQuery);

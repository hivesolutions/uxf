(function($) {
    jQuery.fn.uxvalue = function() {
        // sets the jquery matched object
        var matchedObject = this;

        var object = matchedObject.attr("data-object");

        switch (object) {
            case "textfield" :
                return matchedObject.uxtextfield("value");
                break;

            case "tagfield" :
                return matchedObject.uxtagfield("value");
                break;
        }
    }
})(jQuery);

// registers for the ready event in
// the body element
jQuery(document).ready(function() {
    // retrieves the base element to run the apply
    // operation (contains ux class)
    var elements = jQuery(".ux");

    // creates a function that is capable of delaying
    // the apply operation on a certain element, note
    // the proper ready validation (height exists) is
    // going to be applied to the target elements
    var delay = function(element, timeout) {
        timeout = timeout || 0;
        setTimeout(function() {
            var isReady = element.height() > 0;
            if (!isReady) {
                delay(element, 25);
                return;
            }
            element.uxapply();
        }, timeout);
    };

    // applies the ux to the elements delaying it's
    // execution until the next tick, offering
    // a way of handling body registration before
    elements.each(function(index, element) {
        var _element = jQuery(this);
        delay(_element)
    });
});

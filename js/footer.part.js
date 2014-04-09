// registers for the ready event in
// the body element
jQuery(document).ready(function() {
            // retrieves the base element to run
            // the apply (contain ux class)
            var elements = jQuery(".ux");

            // applies the ux to the elements delaying it's
            // execution until the next tick, offering
            // a way of handling body registration before
            setTimeout(function() {
                        elements.uxapply();
                    });
        });

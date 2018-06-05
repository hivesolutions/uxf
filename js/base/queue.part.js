if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxqueue = function(callable, qname) {
        // retrieves the reference to the current object for
        // context and tries to extract the queue from it using
        // the provided queue name (qname) or the global one
        var matchedObject = this;
        qname = qname || "global";
        var queue = matchedObject.data("queue-" + qname) || [];
        matchedObject.data("queue-" + qname, queue);

        var callback = function() {
            // removes the first item from the queue, as it
            // has been processed and then verifies if the
            // queue is now empty, if that the case the control
            // flow is returned immediately to the caller
            queue.shift();
            if (queue.length === 0) {
                return;
            }

            // retrieves the next element (callable) to be called
            // and calls it providing the reference to the callback
            var next = queue[0];
            next(callback);
        };

        // adds the callable to the queue of functions pending
        // to be processed and then in case the queue is now empy
        // runs the callable providing it with the callbacl
        queue.push(callable);
        if (queue.length === 1) {
            callable(callback);
        }

        // returns the current context so that it may be used in
        // a chain based processing operation (as expected)
        return this;
    };
})(jQuery);

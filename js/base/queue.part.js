(function(jQuery) {
    jQuery.fn.uxqueue = function(callable) {
        // retrieves the reference to the current object for
        // context and tries to extract the queue from it
        var matchedObject = this;
        var queue = matchedObject.data("queue") || [];
        matchedObject.data("queue", queue);

        var callback = function() {
            // removes the last item from the queue, as it
            // has been processes and then verifies if the
            // queue is now empty, if that the case the control
            // flow is returned immediately to the caller
            queue.pop(queue.length - 1);
            if (queue.length == 0) {
                return;
            }

            // retrieves the next element (callable) to be called
            // and calls it providing the reference to the callback
            var next = queue[queue.length - 1];
            next(callback);
        };

        // adds the callable to the queue of functions pending
        // to be processed and then in case the queue is now empy
        // runs the callable providing it with the callbacl
        queue.push(callable);
        if (queue.length == 1) {
            callable(callback);
        }
    };
})(jQuery);

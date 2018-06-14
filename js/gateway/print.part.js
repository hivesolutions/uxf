if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxgprint = function(method, options) {
        // the default values for the print
        var defaults = {};

        // sets the default method value
        method = method || "default";

        // sets the default options value
        options = options || {};

        // constructs the options
        options = jQuery.extend(defaults, options);

        // sets the jquery matched object
        var matchedObject = this;

        /**
         * Initializer of the plugin, runs the necessary functions to initialize
         * the structures.
         */
        var initialize = function() {
            _appendHtml();
            _registerHandlers();
        };

        /**
         * Creates the necessary html for the component.
         */
        var _appendHtml = function() {};

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // registers for the click event on the matched
            // object (should trigger the print)
            matchedObject.click(function() {
                // retrieves the element reference and runs the print
                // process on it (note that this is a delayed process)
                var element = jQuery(this);
                _queue(element, options);
            });
        };

        var _queue = function(matchedObject, options) {
            // creates the callable clojure for the printing operation
            // and then queues the callable for latter execution
            var callable = function(callback) {
                _print(matchedObject, options, callback);
            };
            matchedObject.uxqueue(callable, "print");
        };

        var _print = function(matchedObject, options, callback) {
            // retrieves the element reference and then
            // uses it to retrieve the URL to the binie
            // resource containing the document description
            var element = matchedObject;
            var binieUrl = element.attr("data-binie") || options["binie"];

            // splits the retrieved binie attribute as it may contain
            // multiple (valid) attributes (to be used)
            var binieUrls = binieUrl.split(";");

            // retrieves the reference to the document element
            var _document = jQuery(document);

            // tries to retrieve the reference to the
            // gateway plugin to be used for plugin calls
            var gateway = _document.uxg();

            // tries to retrieve the complete set of element for the
            // colony cloud print action, in case they are defined
            // they will take priority for usage of print infra-structure
            var printUrl =
                (window.localStorage && localStorage.getItem("uxf:gateway:base_url")) || "";
            var printKey =
                (window.localStorage && window.localStorage.getItem("uxf:gateway:key")) || "";
            var printNode =
                (window.localStorage && window.localStorage.getItem("uxf:gateway:node:id")) || "";
            var printPrinter =
                (window.localStorage && window.localStorage.getItem("uxf:gateway:printer:id")) ||
                "";

            // in case the complete set of required colony print field
            // are defined the gateway object is overriden with a new
            // map that emulates the same interface but using the colony
            // cloud infra-structure for proper printing
            if (printUrl && printKey && printNode) {
                gateway = {
                    pformat: function() {
                        return "binie";
                    },
                    print: function(showDialog, dataBase64) {
                        var jobUrl = printUrl + "nodes/" + printNode + "/";
                        jobUrl += printPrinter ? "printers/print" : "print";
                        jQuery.ajax({
                            type: "post",
                            url: jobUrl,
                            data: {
                                printer: printPrinter,
                                data_b64: dataBase64,
                                skey: printKey
                            },
                            beforeSend: function(xhr) {
                                xhr.setRequestHeader("X-Secret-Key", printKey);
                            }
                        });
                    }
                };
            }

            // in case the gateway was successfully retrieved
            // time to retrieve the binie data to be printed
            if (gateway) {
                // retrieves the printing format associated
                // with the printing infra-structure of the
                // currently loaded gateway
                var format = gateway.pformat();

                // creates the initial data structure to be uses
                // to instruct the data source on how to print
                // the document and how the provided data is structured
                var data = {
                    base_64: 1,
                    format: format
                };

                // tries to retrive the data processing method for
                // the currently defined format in case it exists
                // calls it with the data structure so that it
                // "completes" it with the "extra" data
                var method = matchedObject["uxgprint" + format];
                method && method(gateway, data);

                // reverses the binie urls list and then uses this
                // list as the queue for the printin operation, note
                // that the callback should be called only after the
                // complete set of queue elements have been processed
                binieUrls = binieUrls.reverse();
                _printQueue(binieUrls, data, gateway, callback);
            }
            // otherwise the normal printing process must be used
            // in case a fallback URL exists
            else {
                // calls the callback function, marking the end of
                // the printing execution (maintains order)
                callback();

                // tries to retrieve the fallback URL and the
                // target for the link
                var fallbackUrl = element.attr("data-fallback") || options["fallback"];
                var target = element.attr("data-target") || options["target"];

                // in case no fallback URL is defined, must return
                // immediately (nothing is done)
                if (!fallbackUrl) {
                    // returns immediately, nothing can
                    // be done
                    return;
                }

                // in case the target parameter is set a new window
                // must be created with the defined target
                if (target) {
                    // creates a new window with the defined target
                    window.open(fallbackUrl, target);
                }
                // otherwise the current document is used and the location
                // on it is changed
                else {
                    // sets the new location for the document as the
                    // fallback url
                    jQuery.uxlocation(fallbackUrl);
                }
            }
        };

        var _printQueue = function(queue, data, gateway, callback) {
            // tries to determine if the queue is empty and if
            // that's the case calls the callback as all the
            // elements in the queue have been processed
            if (queue.length === 0) {
                callback();
                return;
            }

            // removes one element from the queue and considers
            // it to be the binie URL of the printing document
            var binieUrl = queue.pop();

            // verifies if the current binie URL is valid and
            // not empty and if that's not the case skips the
            // current loop iteration (nothing to be done)
            if (!binieUrl) {
                // calls the print queue method, meaning that
                // this iteration is skipped, then returns immediately
                _printQueue(queue, data, gateway, callback);
                return;
            }

            // runs the remote call to retrieve the binie
            // contents, once they are retrieve they are going
            // to be sent to the plugin for printing
            jQuery.ajax({
                url: binieUrl,
                data: data,
                complete: function() {
                    // calls the print queue function, meaning that
                    // the next element is ready to be processed
                    _printQueue(queue, data, gateway, callback);
                },
                success: function(data) {
                    // prints the "just" received data using the
                    // gateway plugin (direct access to driver)
                    gateway.print(false, data);
                },
                error: function() {
                    // retrieves the body and uses it to raise an info message
                    // about the error in the retrieval of the data
                    var _body = jQuery("body");
                    _body.uxinfo(
                        "There was an error retrieving remote print data.<br />" +
                            "Please try again latter or contact the support team.",
                        "Error",
                        "warning"
                    );
                }
            });
        };

        // switches over the method
        switch (method) {
            case "print":
                // runs the print process in the matched object, this is
                // a delayed process as the execution is queued
                _queue(matchedObject, options);

                // breaks the switch
                break;

            case "default":
                // initializes the plugin
                initialize();

                // breaks the switch
                break;
        }

        // returns the object
        return this;
    };
})(jQuery);

(function(jQuery) {
    jQuery.fn.uxgprintpdf = function(gateway, data) {
        // retrieves the complete set of device specifications
        // for the current system and sets the intial value of
        // the default device variable as unset
        var devices = gateway.pdevices();
        var defaultDevice = null;

        // iterates over all the (printing) devices in the system
        // to try to "find" the one that's the default
        for (var index = 0; index < devices.length; index++) {
            var device = devices[index];
            if (!device.isDefault) {
                continue;
            }
            defaultDevice = device;
            break;
        }

        // in case no default device is found must return immediately
        // nothing to be set for the current situation
        if (!defaultDevice) {
            return;
        }

        // updates the data structure with the device with and length
        // for the defined paper size
        data["width"] = defaultDevice["width"];
        data["height"] = defaultDevice["length"];
    };
})(jQuery);

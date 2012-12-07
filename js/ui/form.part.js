(function($) {
    jQuery.fn.uxform = function(options) {
        // the default values for the form
        var defaults = {};

        // sets the default options value
        var options = options ? options : {};

        // constructs the options
        var options = jQuery.extend(defaults, options);

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
        var _appendHtml = function() {
            // iterates over all the matched objects
            // to add the submit input button to it
            matchedObject.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // adds the submit button to the matched
                // object (form), only in case the no keyboard
                // flag is not set
                var noKeyboard = _element.hasClass("no-keyboard");
                !noKeyboard
                        && _element.append("<input type=\"submit\" class=\"submit-button\" />");
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // registers for the submit event so that
            // duplicate submits may be avoided
            matchedObject.submit(function(event) {
                        // retrieves the current element
                        var element = jQuery(this);

                        // retrieves the state of the submited flag
                        // and then updates it to the valid value
                        var submited = element.data("submited");
                        element.data("submited", true);

                        // in case the form was not already submited
                        // need to prevent the event
                        if (submited) {
                            // stops the event propagation and
                            // prevents the default behavior (avoids
                            // duplicate submits)
                            event.stopPropagation();
                            event.preventDefault();
                        }

                        // checks if the current element has the ajax form
                        // class, in such cases must avoid normal submission
                        // and instead should submit the form in ajax
                        var isAjax = element.hasClass("form-ajax");
                        if (isAjax) {
                            // schedules the execution of the ajax submit fo
                            // the next tick so that the submit event handlers
                            // may be executed before the submission
                            setTimeout(function() {
                                        submitAjax(element, options);
                                    }, 0);

                            // prevents the default behavior (avoids
                            // the normal submit)
                            event.preventDefault();
                        }
                    });

            // registers for the reset event on the matched object
            // so that the form may perform the reset form operation
            // under such conditions
            matchedObject.bind("reset", function(event) {
                        // retrieves the current element and runs
                        // the reset for operation for it
                        var element = jQuery(this);
                        resetForm(element, options);
                    });
        };

        var submitAjax = function(matchedObject, options) {
            var method = matchedObject.attr("method");
            var action = matchedObject.attr("action");
            var data = matchedObject.serialize();

            jQuery.ajax({
                type : method,
                url : action,
                data : data,
                complete : function(request, textStatus) {
                    matchedObject.triggerHandler("unlock");
                },
                success : function(data) {
                    resetForm(matchedObject, options);

                    var formSuccess = jQuery(".form-success", matchedObject);
                    var hasFormSuccess = formSuccess.length;

                    if (hasFormSuccess) {
                        var otherItems = jQuery("> :not(.form-success)",
                                matchedObject);
                        otherItems.hide();
                        formSuccess.show();
                        matchedObject.trigger("layout");
                    }

                    matchedObject.triggerHandler("success");
                },
                error : function(request, textStatus, errorThrown) {
                    var jsonData = jQuery.parseJSON(request.response);
                    var exception = jsonData["exception"] || {};
                    var errors = exception["errors"] || {};

                    resetForm(matchedObject, options);

                    for (var name in errors) {
                        var _errors = errors[name];
                        var _errorsString = JSON.stringify(_errors);
                        var field = jQuery("[name=" + name + "]", matchedObject);
                        field.attr("data-error", _errorsString);
                        field.uxerror();
                        field.addClass("invalid");
                    }

                    matchedObject.triggerHandler("error", [exception]);
                }
            });
        };

        var resetForm = function(matchedObject, options) {
            var errorFields = jQuery("[data-error]", matchedObject);
            errorFields.removeAttr("data-error");
            errorFields.uxerror();
            errorFields.removeClass("invalid");

            var errorDescription = jQuery(".error-description", matchedObject);
            errorDescription.remove();

            var formSuccess = jQuery(".form-success", matchedObject);
            var otherItems = jQuery("> :not(.form-success)", matchedObject);
            formSuccess.hide();
            otherItems.show();
            matchedObject.trigger("layout");
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

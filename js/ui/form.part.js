(function(jQuery) {
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
            // retrieves the various attributes from the matched
            // object that are going to be used to creates the
            // "simulated" ajax request
            var method = matchedObject.attr("method") || "get";
            var action = matchedObject.attr("action");
            var data = matchedObject.serialize();

            // triggers the submit data handler so that any listening
            // handler may be able to handle the data
            matchedObject.triggerHandler("submit_data");

            // creates the ajax request that is going to simulate
            // a complete form request in the background
            jQuery.ajax({
                type : method,
                url : action,
                data : data,
                complete : function(request, textStatus) {
                    // triggers the unlock event so that the various
                    // items in the form may be re-used again
                    matchedObject.triggerHandler("unlock");
                },
                success : function(data) {
                    // resets the form contents to the original values
                    // this should remove all the values in it
                    resetForm(matchedObject, options);

                    // in case no data was received the connection is
                    // assumed to be down (no data receved) an error
                    // is triggered and the control returned immediately
                    if (!data) {
                        matchedObject.triggerHandler("error");
                        return;
                    }

                    // checks if the success for panel exists in the form
                    // in case it exist it must be shown and the other contents
                    // fo the form hidden
                    var formSuccess = jQuery(".form-success", matchedObject);
                    var hasFormSuccess = formSuccess.length;
                    if (hasFormSuccess) {
                        // retrieves the complate set of items in the form
                        // that are not part of the form success panel
                        var otherItems = jQuery("> :not(.form-success)",
                                matchedObject);

                        // uses the form success panel to render it as a template
                        // using as base the form success template provided then
                        // adds the result to the matched object
                        var formSuccessItem = formSuccess.uxtemplate(data);
                        formSuccessItem.addClass("item")
                        matchedObject.append(formSuccessItem);

                        // hides the other items in the form as shows the just
                        // rendered form success item, then triggers a layout event
                        // to render any changes in the "upper" levels
                        otherItems.hide();
                        formSuccessItem.show();
                        matchedObject.trigger("layout");
                    }

                    // triggerrs the success event on the matched object, this
                    // should indicate that the form was correctly submited
                    matchedObject.triggerHandler("success");
                },
                error : function(request, textStatus, errorThrown) {
                    // resets the form contents to the original values
                    // this should remove all the values in it
                    resetForm(matchedObject, options);

                    // parses the request response data as json (default layout for
                    // the response value) and then uses the result to retrieve the
                    // exception and then the errors list
                    var jsonData = jQuery.parseJSON(request.response);
                    var exception = jsonData["exception"] || {};
                    var errors = exception["errors"] || {};

                    // iterates over all the name in the errors map to sets the
                    // errors value in the various items of the form (error indication)
                    for (var name in errors) {
                        // retrieves the errors list for the current name in
                        // iteration and then converts the list into an
                        // equivalent json string
                        var _errors = errors[name];
                        var _errorsString = JSON.stringify(_errors);

                        // retrieves the field from the form associated with the
                        // provided value and updates it's error state adding the
                        // invalid class to it also
                        var field = jQuery("[name=" + name + "]", matchedObject);
                        field.attr("data-error", _errorsString);
                        field.uxerror();
                        field.addClass("invalid");
                    }

                    // triggers the layout event in order to be able to update any
                    // "upper" components associated with the form
                    matchedObject.trigger("layout");

                    // triggerrs the error event on the matched object, this
                    // should indicate that there was a problem in the form submission
                    matchedObject.triggerHandler("error", [exception]);
                }
            });
        };

        var resetForm = function(matchedObject, options) {
            // retrieves the various fields of the form that contain errors and
            // removes the error state from it (error clear)
            var errorFields = jQuery("[data-error]", matchedObject);
            errorFields.removeAttr("data-error");
            errorFields.uxerror();
            errorFields.removeClass("invalid");

            // retrieves the various error description elements and removes them
            // from the form (error indication removal)
            var errorDescription = jQuery(".error-description", matchedObject);
            errorDescription.remove();

            // retrieves both the form success panel and the other items and then
            // removes the form success (item) panel and shows the "original" items
            // then triggers the layout event to update any "upper" elements
            var formSuccessItem = jQuery(".form-success.item", matchedObject);
            var otherItems = jQuery("> :not(.form-success)", matchedObject);
            formSuccessItem.remove();
            otherItems.show();
            matchedObject.trigger("layout");

            // retrieves the complete set of elements from the matched object
            // and runs the reset operation on all of them, this should be able
            // to restore them to their original values
            var elements = matchedObject.uxfields();
            elements.uxreset();
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

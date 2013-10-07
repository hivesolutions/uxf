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

                        // retrieves the currently set attribute value
                        // for the trim operation on the form
                        var noTrim = element.attr("data-no_trim") || false;

                        // retrieves the state of the submited flag
                        // and then updates it to the valid value
                        var submited = element.data("submited");
                        element.data("submited", true);

                        // in case the form was not already submited
                        // need to prevent the event from bubling and
                        // then the function must return immediately
                        if (submited) {
                            // stops the event propagation and prevents
                            // the default behavior (avoids duplicate
                            // submission) then returns the function
                            event.stopPropagation();
                            event.stopImmediatePropagation();
                            event.preventDefault();
                            return;
                        }

                        // triggers the pre submit event so that the typical pre
                        // validation process is set and raised, this is required
                        // otherwise invalid data can be set
                        element.triggerHandler("pre_submit");

                        // retrieves the complete set of (input) fields
                        // contained in the form  an itreates over them
                        // so that trailing spaces are removed
                        var fields = jQuery(".text-field[data-object]", element);
                        !noTrim && fields.each(function(index, element) {
                                    // retrieves the current element in iteration
                                    // and the value associated, then verifies if
                                    // the data type from it is string an in case it's not
                                    // ignores the current value
                                    var _element = jQuery(this)
                                    var value = _element.uxvalue();
                                    if (typeof value !== "string") {
                                        return;
                                    }

                                    // trims the value removing any trailing
                                    // and leading spaces and then re-sets the
                                    // value in the element
                                    value = value.trim();
                                    _element.uxvalue(value);
                                });

                        // retrieves the current body element and uses it to retrieve
                        // the async flag state, that indicates if the interactions with
                        // the server side should be performed using an async strategy then
                        // runs an extra validation to check if the current layout
                        // is ready to be changed using an async approach
                        var _body = jQuery("body");
                        var async = _body.data("async");
                        async &= _body.triggerHandler("async") != false;

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
                        } else if (async && window.FormData) {
                            submit(element, options);
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

        var submit = function(matchedObject, options) {
            // retrieves the reference to the body element that is
            // going to be used in the trigger of events
            var _body = jQuery("body");

            // adds an extra hidden input value to the form indicating that the
            // submission is meant to be handled as async, this should provide
            // additional processing for redirection
            matchedObject.append("<input type=\"hidden\" name=\"async\" value=\"1\" />")

            // retrieves the proper values from the matched object (form)
            // so that the correct strategy is going to be used while submiting
            // the data to the server side
            var method = matchedObject.attr("method") || "get";
            var action = matchedObject.attr("action");
            var data = matchedObject.serialize();

            // resolves the provided link so that were able to find out the
            // absolute url out of it and set it as the location to be retrieved
            // using an asynchronous approach (ajax)
            var href = jQuery.uxresolve(action);

            // trigers the async operation start handler indicating that an
            // asyncronous request is going to start, this trigger should
            // enable all the visuals so that the user is notified about the
            // remote communication that is going to occur
            _body.triggerHandler("async_start");

            // retrieves the encoding type that is going to be used to encode
            // the current form to be submited, this will change the way the
            // submission will be done
            var enctype = matchedObject.attr("enctype")
                    || "application/x-www-form-urlencoded";

            // creates the form data object from the form element, this is the
            // object that is going to be used for the asyncronous request in
            // the form is not of type multipart the default serialization
            // process is used instead to create a "query string"
            var form = matchedObject[0];
            var data = enctype == "multipart/form-data"
                    ? new FormData(form)
                    : matchedObject.serialize();

            // creates the asyncronous object rerence and opens it to the link
            // reference defined in the form than triggers its load and then
            // forces the content type header for the requested encoding
            // type in case the form is not of type multipart
            var request = new XMLHttpRequest();
            request.open(method, href);
            enctype != "multipart/form-data"
                    && request.setRequestHeader("Content-Type", enctype);
            request.onload = function() {
                // in case the current state of the request is not final ignores
                // the update status change (not relevant)
                if (request.readyState != 4) {
                    return;
                }

                // triggers the post submit event in the current matched object
                // (form) indicating that the form has been submitted
                matchedObject.triggerHandler("post_submit");

                // verifies if the current result if of type (async) redirect, this
                // is a special case and the redirection must be performed using a
                // special strateg by retrieving the new location and setting it as
                // new async contents to be loaded
                var isRedirect = request.status == 280;
                if (isRedirect) {
                    var hrefR = request.getResponseHeader("Location");
                    hrefR = jQuery.uxresolve(hrefR, href);
                    jQuery.uxlocation(hrefR);
                    return;
                }

                // retrieves the reference to the body element to be used in the
                // current reponse handler for a series of operations
                var _body = jQuery("body");

                // trigger the async end(ed) event that notifies the current
                // structures that no more remote communication is taking place
                _body.triggerHandler("async_end");

                // sets the current data as the response text value retrieved
                // from the currently set request object
                var data = request.responseText;

                // retrieves the body element and uses it to trigger the data
                // event indicating that new panel data is available and that
                // the current layout must be updated (async fashion) note
                // that the target link is set as the current document's url
                // so that it does not change, this allows correct reload
                // handling of the page (improved user experience)
                var _body = jQuery("body");
                _body.triggerHandler("data", [data, document.URL, null, true,
                                href]);
            };
            request.send(data);
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
                    matchedObject.triggerHandler("success", [data]);
                },
                error : function(request, textStatus, errorThrown) {
                    // resets the form error contents to the original values
                    // this should remove all the values in it
                    resetErrors(matchedObject, options);

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

        var resetErrors = function(matchedObject, options) {
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
        };

        var resetForm = function(matchedObject, options) {
            // restores the error part of the form to the original values so that
            // they don't appear in the form (original state)
            resetErrors(matchedObject, options);

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

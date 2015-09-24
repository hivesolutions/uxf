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

                // adds the submit button to the matched object (form),
                // only in case the no keyboard flag is not set and the
                // current form contains no associated submit button
                var noKeyboard = _element.hasClass("no-keyboard");
                var submitButton = jQuery("input[type=submit]", _element);
                var hasSubmit = submitButton.length > 0;
                var requiresSubmit = !noKeyboard && !hasSubmit;
                requiresSubmit
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
                        // retrieves the current element, so that access to
                        // the current form is possible, and then retrieves
                        // the reference to the body element that may be used
                        // for some of the possible global operations
                        var element = jQuery(this);
                        var _body = jQuery("body");

                        // gathers the reference to the complete set of input
                        // like elements contained in the current form element
                        var inputs = jQuery("input", element);

                        // verifies if the current form is of type (message) confirm
                        // and if that's the case retrieves the associated message
                        var isConfirm = matchedObject.hasClass("form-confirm");
                        var message = matchedObject.attr("data-message");
                        isConfirm = isConfirm && message;

                        // retrieves the currently set attribute value
                        // for the trim operation on the form
                        var noTrim = element.attr("data-no_trim") || false;

                        // tries to detect if the current form is already confirmed
                        // if it's confirmed this is a second (special) submission,
                        // round-trip that should be handled carefully
                        var confirmed = element.data("confirmed");

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
                        // otherwise invalid data can be set, the returned value
                        // is used to determine if the submission of the form should
                        // continue or if the form submission should be canceled, note
                        // that if the form is already confirmed there's no need to
                        // run the pre-validation process one more time
                        var result = confirmed
                                || element.triggerHandler("pre_submit");
                        if (result == false) {
                            // triggers the unlock (elements) events to emulate the
                            // end of the submission of the form (compatability)
                            // this should release the elements state to the normal
                            // state so that they may be re-used again
                            element.triggerHandler("unlock");
                            element.triggerHandler("post_submit");

                            // updates the submited flag to the original invalid value
                            // so that the form may be re-submited latter on
                            element.data("submited", false)

                            // stops the event propagation and prevents
                            // the default behavior (avoids duplicate
                            // submission) then returns the function
                            event.stopPropagation();
                            event.stopImmediatePropagation();
                            event.preventDefault();
                            return;
                        }

                        // verifies if the current form should be confirmed and if that's
                        // the case and the form is not yet confirmed the proper confirmation
                        // (modal) window should be presented to confirm/cancel the submission
                        if (isConfirm && !confirmed) {
                            // presents the confirm window to the end user so that it's
                            // possible to cancel/confirm the current form submission
                            _body.uxconfirm(message, function(result) {
                                        // in case the result is cancel, must revert the current
                                        // partial state and then return the control flow
                                        if (result == false) {
                                            // triggers the unlock (elements) events to emulate the
                                            // end of the submission of the form (compatability)
                                            // this should release the elements state to the normal
                                            // state so that they may be re-used again
                                            element.triggerHandler("unlock");
                                            element.triggerHandler("post_submit");

                                            // returns the control from to the caller method, there's
                                            // nothing remaining to be done (submission interception)
                                            return;
                                        }

                                        // sets the current form element as confirmed and
                                        // the re-submits the form (should proceed now)
                                        element.data("confirmed", true);
                                        element.submit();
                                    });

                            // removes the focus from any input "like" element that
                            // are contained in the current form (avoids glitches)
                            inputs.blur();

                            // unsets the submited flag for the current form, so
                            // that the form may be submited on confirm (latter)
                            element.data("submited", false);

                            // stops the event propagation so that the current submit
                            // operation is delayed by one tick (until confirmation)
                            event.stopPropagation();
                            event.stopImmediatePropagation();
                            event.preventDefault();
                            return;
                        }

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

                                    // verifies if the current element is "lowered" and if
                                    // that's the case skips the trim operation as it's
                                    // considered to be and invalid element to be operated
                                    var isLower = _element.hasClass("lower");
                                    if (isLower) {
                                        return;
                                    }

                                    // "gathers" the original value so that it's able
                                    // to detect if there was a change in the value
                                    // (resulting from the trim operation) that should
                                    // trigger the changing of the element's value
                                    var _value = value;

                                    // trims the value removing any trailing and leading
                                    // spaces and then verifies if the value is different
                                    // from the original value if that's not the case skips
                                    // the current iteration as there's nothing to be done
                                    value = value.trim();
                                    if (_value == value) {
                                        return;
                                    }

                                    // updates both the "physical" and the logical value
                                    // representation of the value in the element, so that
                                    // its value becomes trimmed as expected
                                    _element.val(value);
                                    _element.attr("data-value", value);
                                });

                        // retrieves the current body element and uses it to retrieve
                        // the async flag state, that indicates if the interactions with
                        // the server side should be performed using an async strategy then
                        // runs an extra validation to check if the current layout
                        // is ready to be changed using an async approach
                        var _body = jQuery("body");
                        var async = _body.data("async");
                        async &= element.hasClass("no-async") == false;
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

            // registers for the pre submit event that is going
            // to be triggered whenever the form is going to start
            // submitting new data to the server side, so that the
            // proper pre commit operations are performed
            matchedObject.bind("pre_submit", function(event) {
                        var element = jQuery(this);
                        element.addClass("submitting")
                    });

            // registers for the post submit operations in the form
            // so that the form is restores to the original state
            // (before the start of the form submission)
            matchedObject.bind("post_submit", function(event) {
                        var element = jQuery(this);
                        element.removeClass("submitting")
                    });
        };

        var submit = function(matchedObject, options) {
            // verifies that the currently matched object is of form type as these
            // are the only type of object allowed for verified submission of data
            // in case the object is not of type form returns immediately (no submit
            var isForm = matchedObject.is("form");
            if (!isForm) {
                return;
            }

            // retrieves the reference to the body element that is
            // going to be used in the trigger of events
            var _body = jQuery("body");

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

            // verifies if the current form processing is a get based one and in
            // case it's encapsulates the parameters in the current request
            // url and removes the data payload from the request
            var isGet = method.toLowerCase() == "get";
            href = isGet ? href + "?" + data : href;
            data = isGet ? "" : data;

            // defines the url of the operation (final redirection) as the current
            // href value, resolved from the process action and get parameters
            var url = href;

            // creates the asyncronous object rerence and opens it to the link
            // reference defined in the form than triggers its load and then
            // forces the content type header for the requested encoding
            // type in case the form is not of type multipart
            var request = new XMLHttpRequest();
            request.open(method, href);
            enctype != "multipart/form-data"
                    && request.setRequestHeader("Content-Type", enctype);
            request.setRequestHeader("X-Async", "all");
            request.onload = function() {
                // in case the current state of the request is not final ignores
                // the update status change (not relevant)
                if (request.readyState != 4) {
                    return;
                }

                // verifies if the current request represents and async request
                // and if that's not the case runs the fallback process (typical
                // synchronous form submission) and aborts the current request
                var requestAsync = isAsync(request);
                if (requestAsync == false) {
                    fallback(matchedObject, options);
                    request.abort();
                    return;
                }

                // triggers the post submit event in the current matched object
                // (form) indicating that the form has been submitted
                matchedObject.triggerHandler("post_submit");

                // verifies if the current result if of type (async) redirect, this
                // is a special case and the redirection must be performed using a
                // special strategy by retrieving the new location and setting it as
                // new async contents to be loaded, note that only requests that
                // contain a valid location header will be used for redirection
                var isRedirect = request.status == 280;
                var hrefR = request.getResponseHeader("Location");
                if (isRedirect && hrefR) {
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
                _body.triggerHandler("data", [data, url || document.URL, null,
                                isGet, href]);
            };
            request.readystatechange = function() {
                // in case the current request state is not headers ready there's
                // no need to continue as we're going to verify the content type
                if (request.readyState != 2) {
                    return;
                }

                // verifies if the current request represents and async request
                // and if that's not the case runs the fallback process (typical
                // synchronous form submission) and aborts the current request
                var requestAsync = isAsync(request);
                if (requestAsync == true) {
                    return;
                }
                fallback(matchedObject, options);
                request.abort();
            };
            request.send(data);
        };

        var submitAjax = function(matchedObject, options) {
            // verifies that the currently matched object is of form type as these
            // are the only type of object allowed for verified submission of data
            // in case the object is not of type form returns immediately (no submit
            var isForm = matchedObject.is("form");
            if (!isForm) {
                return;
            }

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
                    // removes the submited and confirmed flags from the
                    // form so that it's possible to re-submit it
                    matchedObject.data("submited", false);
                    matchedObject.data("confirmed", false);

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
                        // rendered form success item, tries to refresh contents
                        // of the upper levels by raisinn and event indicating
                        // the intent to refresh contents, and then triggers a
                        // layout event to render any changes in the "upper" levels
                        otherItems.hide();
                        formSuccessItem.show();
                        matchedObject.trigger("refresh");
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
                    // exception and then the errors list, note that in case there's
                    // no exception key value the proper json structure is going to
                    // be used as the root of the exception object
                    var jsonData = jQuery.parseJSON(request.response);
                    var exception = jsonData["exception"] || jsonData;
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

        var fallback = function(matchedObject, options) {
            // retrieves the reference to the top level body element reference
            // that is going to be used to trigger high level events
            var _body = jQuery("body");

            // triggers the post submit and async end events in the currently
            // matched object (and body) indicating that the current operation
            // has been aborted and that reversing operations should take place
            matchedObject.triggerHandler("post_submit");
            matchedObject.triggerHandler("unlock");
            _body.triggerHandler("async_end");

            // removes the submited flag from the form (allows re-submit)
            // then set the form as non asyncronous and submits it, removing
            // the same flag after the submit operation is completed, so that's
            // possible to re-use the form after the initial submission
            matchedObject.data("submited", false);
            matchedObject.addClass("no-async");
            matchedObject.submit();
            matchedObject.triggerHandler("post_submit");
            matchedObject.triggerHandler("unlock");
            matchedObject.data("submited", false);
            matchedObject.removeClass("no-async");
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

        var isAsync = function(request) {
            // gathers the target location (redirection) in case it exists, then
            // retrieves the content type for the current request and processes
            // the value retrieving only the basic value for it, then verifies
            // that the mime type of it is html and in case it's returns valid as
            // the provided request is considered to be an async request
            var location = request.getResponseHeader("Location");
            var contentType = request.getResponseHeader("Content-Type") || "";
            contentType = contentType.split(";")[0];
            contentType = contentType.strip();
            return location || contentType == "text/html";
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

(function(jQuery) {
    jQuery.fn.uxhightlightbox = function(options) {
        // the default values for the data source
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
            // wraps the matched object in an highlight box container
            matchedObject.wrap("<div class=\"highlight-box-container\"></div>");
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

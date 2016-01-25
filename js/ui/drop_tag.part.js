/**
 * jQuery drop tag plugin, this jQuery plugin provides the base infra-structure
 * for the creation of a drop tag component. This component should be used for
 * situations where a drop list is selected from a list of tag values and then
 * it may be disabled using the removal icon.
 *
 * @name jquery-drop-tag.js
 * @author João Magalhães <joamag@hive.pt>
 * @version 1.0
 * @category jQuery plugin
 * @copyright Copyright (c) 2008-2015 Hive Solutions Lda.
 * @license Hive Solutions Confidential Usage License (HSCUL) -
 *          http://www.hive.pt/licenses/
 */
(function(jQuery) {
    jQuery.fn.uxdroptag = function(method, options) {
        // the default values for the drop tag
        var defaults = {};

        // sets the default method value
        var method = method ? method : "default";

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
            // iterates over all the matched object in order
            // to create their internal structure
            matchedObject.each(function(index, element) {
                // retrieves the current drop tag element and uses
                // its title attribute to create the strcture
                var _element = jQuery(this);
                var title = _element.attr("data-title");

                // retrieves the items section from the current element
                // and in case it does not exists creates an empty version
                // of it (default behaviour)
                var items = jQuery("> .items", _element);
                if (items.length == 0) {
                    _element.append("<ul class=\"items\"></ul>");
                }

                // adds the drop tag header and tag element to the
                // drop tag taking into account the title
                _element.prepend("<div class=\"drop-tag-header\">" + title + "</div>" +
                    "<div class=\"drop-tag-tag\">" + "<span class=\"drop-tag-text\"></span>" +
                    "<span class=\"drop-tag-close\"></span>" + "</div>");
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // retrieves the reference to the top level
            // body element
            var _body = jQuery("body");

            // retrieves the various dro tag components to be able to
            // register for actions on them
            var dropTagHeader = jQuery(".drop-tag-header", matchedObject);
            var dropTagClose = jQuery(".drop-tag-close", matchedObject);
            var items = jQuery(".items", matchedObject);
            var listItems = jQuery(".items > li", matchedObject);

            // registers for the click event on the drop tag header
            // to be able to toggle the state of the imtes
            dropTagHeader.click(function(event) {
                // retrieves the current element and uses it to
                // gather the associated drop tag
                var element = jQuery(this);
                var dropTag = element.parents(".drop-tag");

                // retrieves the parent tags (container) element
                // and the drop tags (and items) under it
                var tags = dropTag.parent(".tags");
                var dropTags = jQuery(".drop-tag", tags);
                var dropTagsItems = jQuery("> .items", dropTags);

                // retrieves the various item associated with the
                // current drop tag
                var items = jQuery("> .items", dropTag);

                // checks if the drop tag is curently in the disable
                // state in such case returns immediately nothing to
                // be done on a disabled drop tag
                var isDisabled = dropTag.hasClass("disabled");
                if (isDisabled) {
                    return;
                }

                // checks if the drop tag is curently in the open
                // state in order to change it
                var isOpen = dropTag.hasClass("open");

                // hides the complete set of drop tag items under
                // the tags container and removes the open class
                // from them (click on one hides the others)
                dropTagsItems.hide();
                dropTags.removeClass("open");

                // in case the current drop tag is open must hide
                // it and remove the open class
                if (isOpen) {
                    items.hide();
                    dropTag.removeClass("open");
                }
                // otherwise must do exactly the opposite
                else {
                    items.show();
                    dropTag.addClass("open");
                }

                // stops the event propagation and prevents
                // the default operations
                event.stopPropagation();
                event.stopImmediatePropagation();
                event.preventDefault();
            });

            // registers for the click event on the drop tag
            // close element to revert the drop tag mode to
            // the normal drop mode
            dropTagClose.click(function() {
                // retrieves the current element, the associated
                // parent drop tag and the list items
                var element = jQuery(this);
                var dropTag = element.parents(".drop-tag");
                var listItems = jQuery(".items > li.selected", dropTag);

                // removes the selected class from the "selected" list
                // item elements (unselects them)
                listItems.removeClass("selected");

                // removes the tag mode class from the drop tag
                // (reverts the state to drop mode)
                dropTag.removeClass("tag-mode");

                // triggers the item unselected event the event is
                // triggered without any arguments
                dropTag.triggerHandler("item_unselected", [])
            });

            // registers for the click event on the various list items
            // to select them (go into tag mode)
            listItems.click(function() {
                // retieves the current element, the drop tag associated with
                // it and the drop tag text
                var element = jQuery(this);
                var dropTag = element.parents(".drop-tag");
                var dropTagText = jQuery(".drop-tag-text", dropTag);

                // retrieves the element value as the name and update
                // the drop tag text with that name
                var name = element.html();
                dropTagText.html(name);

                // adds the selected class to the element, to mark
                // it as the selected element (selects them)
                element.addClass("selected");

                // changes the current drop tag mode to tag mode
                dropTag.addClass("tag-mode");

                // triggers the item selected event using the element
                // as the argument for the event handler
                dropTag.triggerHandler("item_selected", [element])
            });

            // registers for the click event on the body element
            // to be able to revert the drop mode to closed
            _body.click(function() {
                // removes the open class from the matched object and
                // hides the various items
                matchedObject.removeClass("open");
                items.hide();
            });
        };

        var update = function() {
            // retrieves the various list items for the currently
            // selected object (matched object)
            var listItems = jQuery(".items > li", matchedObject);

            // registers for the click event on the various list items
            // to select them (go into tag mode)
            listItems.click(function() {
                // retieves the current element, the drop tag associated with
                // it and the drop tag text
                var element = jQuery(this);
                var dropTag = element.parents(".drop-tag");
                var dropTagText = jQuery(".drop-tag-text", dropTag);

                // retrieves the element value as the name and update
                // the drop tag text with that name
                var name = element.html();
                dropTagText.html(name);

                // adds the selected class to the element, to mark
                // it as the selected element (selects them)
                element.addClass("selected");

                // changes the current drop tag mode to tag mode
                dropTag.addClass("tag-mode");

                // triggers the item selected event using the element
                // as the argument for the event handler
                dropTag.triggerHandler("item_selected", [element])
            });
        };

        var release = function() {
            // retrieves the currently matched object as the drop
            // tag element to be used in the tag mode removal
            var dropTag = matchedObject;

            // verifies if the current drop tag is "under" the tag
            // mode and if that's not the case returns immediately as
            // there's nothing pending to be done in the release operation
            var isSelected = dropTag.hasClass("tag-mode");
            if (!isSelected) {
                return;
            }

            // retrieves the complete set  of selected list items from the
            // drop tag so that they are properly "released"
            var listItems = jQuery(".items > li.selected", dropTag);

            // removes the selected class from the "selected" list
            // item elements (unselects them)
            listItems.removeClass("selected");

            // removes the tag mode class from the drop tag
            // (reverts the state to drop mode)
            dropTag.removeClass("tag-mode");

            // triggers the item unselected event the event is
            // triggered without any arguments
            dropTag.triggerHandler("item_unselected", [])
        };

        // switches over the method
        switch (method) {
            case "update":
                // updates the component internal structures
                // to reflect the layout changes
                update();

                // breaks the switch
                break;

            case "release":
                // updates the component internal structures
                // to reflect the layout changes
                release();

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

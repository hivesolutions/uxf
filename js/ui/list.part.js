if (typeof require !== "undefined") {
    var jQuery = require("../_compat").jQuery;
}

(function(jQuery) {
    jQuery.fn.uxlist = function(options) {
        // the default values for the link confirm
        var defaults = {};

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
         * Creates the necessary HTML for the component.
         */
        var _appendHtml = function() {
            // in case the matched object is not defined
            // or in case it's an empty list must return
            // immediatly initialization is not meant to
            // be run (corruption may occur)
            if (!matchedObject || matchedObject.length === 0) {
                return;
            }

            // retrieves the selected links from the matched object
            var selectedLinks = jQuery("> li > a.selected", matchedObject);

            // retrieves the links that represent expanded sub lists
            // for empty sub list verification
            var epandedLinks = jQuery("> li > a > .link-expand:contains(+)", matchedObject);

            // opens the menus for all the selected links
            // of the list, changes also the expand icon
            selectedLinks.each(function() {
                // retrieves the element
                var element = jQuery(this);

                // retrieves the list that contiains the current
                // element (first list parent) and then uses it
                // to retrieve the associated list item parent
                var list = jQuery(element.parents(".list")[0]);
                var listItem = list.parents("li");

                // retrieves the list item link and the list item
                // link expand
                var listItemLink = jQuery("> a", listItem);
                var listItemLinkExpand = jQuery(".link-expand", listItem);

                // shows the the list (sub list)
                list.show();

                // changes the list item link expand
                // to the minus value and adds the open
                // class to the list item link
                listItemLinkExpand.html("-");
                listItemLink.addClass("open");
            });

            // iterates over each of the expanded links for
            // empty sublist verification
            epandedLinks.each(function(index, element) {
                // retrieves the element reference
                var _element = jQuery(element);

                // retrieves the imediate parent list item and the
                // associated sub list (for empty verification)
                var listItem = jQuery(_element.parents("li")[0]);
                var subList = jQuery("> .list", listItem);
                var subListChildren = subList.children();

                // in case the sub list contains children
                // (it's not empty)
                if (subListChildren.length > 0) {
                    // returns immediately (no need to remove the
                    // list item associated with the element)
                    return;
                }

                //  remove the list item associated with
                // the element
                listItem.remove();
            });
        };

        /**
         * Registers the event handlers for the created objects.
         */
        var _registerHandlers = function() {
            // in case the matched object is not defined
            // or in case it's an empty list must return
            // immediatly initialization is not meant to
            // be run (corruption may occur)
            if (!matchedObject || matchedObject.length === 0) {
                return;
            }

            // retrieves the links from the matched object
            var links = jQuery("> li > a", matchedObject);

            // registers for the click event on the links
            // from the list
            links.click(function() {
                // retrieves the element
                var element = jQuery(this);

                // retrieves the list item that contiains the current
                // element (first list parent) and then uses it
                // to retrieve the (child) list
                var listItem = element.parent("li");
                var list = jQuery("> .list", listItem);

                // retrieves the parent (upper) list from the
                // current list item
                var parentList = listItem.parent(".list");

                // in case there's no (child) list in the list
                // element (no child elements present)
                if (list.length === 0) {
                    return;
                }

                // retrieves the list item link and the list item
                // link expand
                var listItemLink = jQuery("> a", listItem);
                var listItemLinkExpand = jQuery(".link-expand", listItem);

                // in case the element is open (has class
                // open) need to close the list
                if (element.hasClass("open")) {
                    // hides the the list (sub list)
                    list.slideUp(350);

                    // changes the list item link expand
                    // to the minus value and adds the open
                    // class to the list item link
                    listItemLinkExpand.html("+");
                    element.removeClass("open");
                }
                // otherwise the element is closed
                // need to open the list
                else {
                    // retrieves all the sub lists from the parents list
                    var subLists = jQuery("> li > .list", parentList);

                    // retrieves the sub lists item, links and
                    // links expands
                    var subListsItems = subLists.parent("li");
                    var subListsLinks = jQuery("a", subListsItems);
                    var subListsLinkExpands = jQuery(".link-expand", subListsLinks);

                    // hides the the lists (sub list)
                    subLists.slideUp(350);

                    // changes the sub lists links expand
                    // to the plus value and adds the open
                    // class to the sub lists expands link
                    subListsLinks.removeClass("open");
                    subListsLinkExpands.html("+");

                    // shows the the list (sub list)
                    list.slideDown(350);

                    // changes the list item link expand
                    // to the minus value and adds the open
                    // class to the list item link
                    listItemLinkExpand.html("-");
                    listItemLink.addClass("open");
                }
            });
        };

        // initializes the plugin
        initialize();

        // returns the object
        return this;
    };
})(jQuery);

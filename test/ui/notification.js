const assert = require("assert");
require("../../js");

global.document = global.document || global.dom.window.document;
global.window = global.window || global.dom.window;

describe("UxNotification", function() {
    describe("#basic", function() {
        it("should be defined", () => {
            const jQuery = global.jQuery;
            assert.notStrictEqual(jQuery.fn.uxnotification, undefined);
        });
        it("should show the title and the message in the stack of the bottom left", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").uxnotification({ title: "Restock", message: "Product not found" });

            const notification = jQuery("body > .notifications-stack > .notification");
            assert.strictEqual(notification.length, 1);
            assert.strictEqual(notification.find(".notification-title").text(), "Restock");
            assert.strictEqual(notification.find(".notification-text").text(), "Product not found");
            assert.strictEqual(notification.parent().hasClass("bottom-left"), true);
        });
    });

    describe("#type", function() {
        it("should add the type as a class of the notification", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").uxnotification({
                title: "Restock",
                message: "Product not found",
                type: "error"
            });

            const notification = jQuery(".notification");
            assert.strictEqual(notification.attr("class"), "notification error");
        });
        it("should add no class without a type", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").uxnotification({
                title: "Alice Johnson",
                message: "edited RSTWNR000001"
            });

            const notification = jQuery(".notification");
            assert.strictEqual(notification.attr("class"), "notification");
        });
    });

    describe("#small", function() {
        it("should add the small class to a small notification", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").uxnotification({
                title: "Restock",
                message: "Scan a product before the store",
                type: "warning",
                small: true
            });

            const notification = jQuery(".notification");
            assert.strictEqual(notification.attr("class"), "notification warning small");
        });
        it("should not add the small class by default", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").uxnotification({
                title: "Restock",
                message: "Product not found",
                type: "error"
            });

            const notification = jQuery(".notification");
            assert.strictEqual(notification.hasClass("small"), false);
        });
    });

    describe("#position", function() {
        it("should stack the notifications of a position in one stack, in their order", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").uxnotification({ title: "First", message: "First message" });
            jQuery("body").uxnotification({ title: "Second", message: "Second message" });

            const stacks = jQuery("body > .notifications-stack");
            assert.strictEqual(stacks.length, 1);
            const titles = stacks
                .find(".notification-title")
                .map((index, element) => jQuery(element).text());
            assert.deepStrictEqual(titles.get(), ["First", "Second"]);
        });
        it("should keep the notifications of each position in their own stack", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").uxnotification({ title: "Corner", message: "Corner message" });
            jQuery("body").uxnotification({
                title: "Top",
                message: "Top message",
                position: "top-center"
            });
            jQuery("body").uxnotification({ title: "Again", message: "Again message" });

            const stacks = jQuery("body > .notifications-stack");
            assert.strictEqual(stacks.length, 2);
            const corner = jQuery("body > .notifications-stack.bottom-left .notification-title");
            const top = jQuery("body > .notifications-stack.top-center .notification-title");
            assert.deepStrictEqual(corner.map((index, element) => jQuery(element).text()).get(), [
                "Corner",
                "Again"
            ]);
            assert.deepStrictEqual(top.map((index, element) => jQuery(element).text()).get(), [
                "Top"
            ]);
        });
        it("should not use a stack that is not a child of the matched object", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                '<div class="panel"><div class="notifications-stack bottom-left"></div></div>'
            );
            jQuery("body").uxnotification({ title: "Restock", message: "Product not found" });

            const nested = jQuery(".panel > .notifications-stack");
            assert.strictEqual(nested.children().length, 0);
            const stack = jQuery("body > .notifications-stack.bottom-left");
            assert.strictEqual(stack.children(".notification").length, 1);
        });
    });

    describe("#link", function() {
        it("should make the notification of a link a button of the link", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").uxnotification({
                title: "Alice Johnson",
                message: "edited RSTWNR000001",
                link: "http://hive.pt"
            });

            const notification = jQuery(".notification");
            assert.strictEqual(notification.hasClass("button"), true);
            assert.strictEqual(notification.attr("data-link"), "http://hive.pt");
        });
    });

    describe("#dismiss", function() {
        beforeEach(() => {
            const jQuery = global.jQuery;
            jQuery.fx.off = true;
        });

        afterEach(() => {
            const jQuery = global.jQuery;
            jQuery.fx.off = false;
        });

        it("should remove the notification once its timeout is reached", async () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").uxnotification({
                title: "Restock",
                message: "Product not found",
                timeout: 10
            });
            assert.strictEqual(jQuery(".notification").length, 1);
            await tick(50);

            assert.strictEqual(jQuery(".notification").length, 0);
        });
        it("should remove the notification clicked, without a link", async () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").uxnotification({
                title: "Restock",
                message: "Product not found",
                type: "error"
            });
            jQuery("body").uxnotification({
                title: "Restock",
                message: "Product lookup failed",
                type: "error"
            });
            jQuery(".notification").first().click();
            await tick(50);

            const texts = jQuery(".notification-text").map((index, element) =>
                jQuery(element).text()
            );
            assert.deepStrictEqual(texts.get(), ["Product lookup failed"]);
        });
    });
});

const tick = (timeout = 10) => new Promise(resolve => setTimeout(resolve, timeout));

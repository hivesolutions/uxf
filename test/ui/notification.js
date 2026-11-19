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
        it("should use the stack of the bottom left without a position", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").uxnotification({
                title: "Null",
                message: "Null message",
                position: null
            });
            jQuery("body").uxnotification({
                title: "Undefined",
                message: "Undefined message",
                position: undefined
            });

            const stacks = jQuery("body > .notifications-stack");
            assert.strictEqual(stacks.length, 1);
            assert.strictEqual(stacks.attr("class"), "notifications-stack bottom-left");
            assert.strictEqual(stacks.children(".notification").length, 2);
        });
    });

    describe("#sound", function() {
        let play = null;
        let played = null;

        beforeEach(() => {
            const prototype = global.window.HTMLMediaElement.prototype;
            play = prototype.play;
            played = [];
            prototype.play = function() {
                played.push(this);
                return Promise.resolve();
            };
        });

        afterEach(() => {
            const jQuery = global.jQuery;
            global.window.HTMLMediaElement.prototype.play = play;
            jQuery("body").removeData("notification_sounds");
        });

        it("should play the sound of the type of the notification", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").data("notification_sounds", SOUNDS);
            jQuery("body").uxnotification({
                title: "Restock",
                message: "Product not found",
                type: "error"
            });

            const sources = played.map(audio => audio.getAttribute("src"));
            assert.deepStrictEqual(sources, ["/sounds/error.mp3"]);
        });
        it("should play the sound of the information without a type", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").data("notification_sounds", SOUNDS);
            jQuery("body").uxnotification({
                title: "Alice Johnson",
                message: "edited RSTWNR000001"
            });

            const sources = played.map(audio => audio.getAttribute("src"));
            assert.deepStrictEqual(sources, ["/sounds/information.mp3"]);
        });
        it("should play no sound for a silent notification", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").data("notification_sounds", SOUNDS);
            jQuery("body").uxnotification({
                title: "Restock",
                message: "Product not found",
                type: "error",
                silent: true
            });

            assert.strictEqual(played.length, 0);
            assert.strictEqual(jQuery(".notification").length, 1);
        });
        it("should play no sound without a sound for the type", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").uxnotification({
                title: "Restock",
                message: "Product not found",
                type: "error"
            });
            jQuery("body").data("notification_sounds", { error: SOUNDS.error });
            jQuery("body").uxnotification({
                title: "Restock",
                message: "Scan a product before the store",
                type: "warning"
            });

            assert.strictEqual(played.length, 0);
            assert.strictEqual(jQuery(".notification").length, 2);
        });
        it("should play the sound of each notification on its own audio element", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").data("notification_sounds", SOUNDS);
            jQuery("body").uxnotification({
                title: "Restock",
                message: "Scan a product before the store",
                type: "warning"
            });
            jQuery("body").uxnotification({
                title: "Restock",
                message: "Store not available for the restock",
                type: "warning"
            });

            assert.strictEqual(played.length, 2);
            assert.notStrictEqual(played[0], played[1]);
            assert.strictEqual(played[1].getAttribute("src"), "/sounds/warning.mp3");
        });
        it("should ignore a play refused by the browser", async () => {
            const jQuery = global.jQuery;
            const rejections = [];
            const listener = reason => rejections.push(reason);

            global.window.HTMLMediaElement.prototype.play = function() {
                played.push(this);
                return Promise.reject(new Error("NotAllowedError"));
            };
            process.on("unhandledRejection", listener);
            try {
                jQuery("body").empty();
                jQuery("body").data("notification_sounds", SOUNDS);
                jQuery("body").uxnotification({
                    title: "Stock Adjustment",
                    message: "The stock adjustment request was submitted for approval.",
                    type: "success"
                });
                await tick(50);
            } finally {
                process.removeListener("unhandledRejection", listener);
            }

            assert.strictEqual(played.length, 1);
            assert.strictEqual(rejections.length, 0);
            assert.strictEqual(jQuery(".notification").length, 1);
        });
        it("should play a sound on a browser with no promise of the play", () => {
            const jQuery = global.jQuery;

            global.window.HTMLMediaElement.prototype.play = function() {
                played.push(this);
            };
            jQuery("body").empty();
            jQuery("body").data("notification_sounds", SOUNDS);
            jQuery("body").uxnotification({
                title: "Stock Adjustment",
                message: "The stock adjustment request was submitted for approval.",
                type: "success"
            });

            assert.strictEqual(played.length, 1);
            assert.strictEqual(played[0].getAttribute("src"), "/sounds/success.mp3");
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
        it("should keep the notification clicked removed once its timeout is reached", async () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").uxnotification({
                title: "Restock",
                message: "Product not found",
                timeout: 30
            });
            jQuery(".notification").click();
            await tick(80);

            assert.strictEqual(jQuery(".notification").length, 0);
            assert.strictEqual(jQuery("body > .notifications-stack").length, 1);
        });
        it("should reuse the stack of the notifications removed", async () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").uxnotification({ title: "First", message: "First message" });
            jQuery(".notification").click();
            await tick(50);
            jQuery("body").uxnotification({ title: "Second", message: "Second message" });

            const stacks = jQuery("body > .notifications-stack");
            assert.strictEqual(stacks.length, 1);
            const texts = stacks
                .find(".notification-text")
                .map((index, element) => jQuery(element).text());
            assert.deepStrictEqual(texts.get(), ["Second message"]);
        });
        it("should keep the notification leaving until its animations end and its room closes", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(ANIMATED);
            jQuery("body").uxnotification({ title: "Restock", message: "Product not found" });

            // clicks the notification and verifies that it's leaving, with its
            // height set so that its room closes from it
            const notification = jQuery(".notification");
            notification.click();
            assert.strictEqual(notification.hasClass("invisible"), true);
            assert.strictEqual(notification.hasClass("collapsed"), false);
            assert.notStrictEqual(notification[0].style.height, "");

            // ends the first of its two animations and verifies that it keeps
            // leaving, then ends the second one and verifies that its room is
            // closing, the notification being kept until the room is closed
            notification.trigger("animationend");
            assert.strictEqual(notification.hasClass("collapsed"), false);
            notification.trigger("animationend");
            assert.strictEqual(notification.hasClass("collapsed"), true);
            assert.strictEqual(jQuery(".notification").length, 1);
            notification.trigger("transitionend");
            assert.strictEqual(jQuery(".notification").length, 0);
        });
        it("should ignore the click and the timeout of a notification already leaving", async () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(ANIMATED);
            jQuery("body").uxnotification({
                title: "Restock",
                message: "Product not found",
                timeout: 20
            });

            // clicks the notification twice and waits for its timeout, then
            // verifies that it's still leaving (as its animations haven't ended)
            // and that it's removed once its two animations end and its room
            // closes, as a single leaving
            const notification = jQuery(".notification");
            notification.click();
            notification.click();
            await tick(50);
            assert.strictEqual(jQuery(".notification").length, 1);
            notification.trigger("animationend");
            notification.trigger("animationend");
            assert.strictEqual(notification.hasClass("collapsed"), true);
            notification.trigger("transitionend");
            assert.strictEqual(jQuery(".notification").length, 0);
        });
        it("should remove the notification once it has left when its room has no transition", () => {
            const jQuery = global.jQuery;

            jQuery("body").empty();
            jQuery("body").append(
                "<style>.notification.invisible { animation-name: slide; animation-duration: 0.2s; }</style>"
            );
            jQuery("body").uxnotification({ title: "Restock", message: "Product not found" });

            const notification = jQuery(".notification");
            notification.click();
            assert.strictEqual(jQuery(".notification").length, 1);
            notification.trigger("animationend");
            assert.strictEqual(jQuery(".notification").length, 0);
        });
    });
});

const ANIMATED =
    "<style>" +
    ".notification.invisible { animation-name: slide, fade; animation-duration: 0.2s, 0.2s; }" +
    ".notification.collapsed { transition-duration: 0.2s; }" +
    "</style>";

const SOUNDS = {
    error: "/sounds/error.mp3",
    warning: "/sounds/warning.mp3",
    success: "/sounds/success.mp3",
    information: "/sounds/information.mp3"
};

const tick = (timeout = 10) => new Promise(resolve => setTimeout(resolve, timeout));

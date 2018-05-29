import Vue from "vue";

import {
    UxButton
} from "./ui";

export const examples = function() {
    const app = new Vue({
        el: "#app",
        components: {
            UxButton
        }
    });
    return app;
};

export default examples;

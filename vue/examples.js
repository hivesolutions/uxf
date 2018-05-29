import Vue from "vue";

import {
    UxButton,
    UxDropDown
} from "./ui";

export const examples = function() {
    const app = new Vue({
        el: "#app",
        components: {
            UxButton,
            UxDropDown
        }
    });
    return app;
};

export default examples;

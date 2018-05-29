import Vue from "vue";
import jQuery from "jquery";
import "../bin/js/ux";

import {
    UxButton,
    UxDropDown
} from "./ui";

window.$ = window.jQuery = jQuery;

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

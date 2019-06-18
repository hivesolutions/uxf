<template>
    <div class="button button-color" v-bind:class="buttonColor">
        <slot />
    </div>
</template>

<style scoped></style>

<script>
import Vue from "vue";
import jQuery from "jquery";
import "base";

import { state } from "../../mixins";

export const UxButton = Vue.component("ux-button", {
    mixins: [state],
    props: {
        color: {
            type: String,
            default: function() {
                return "";
            }
        }
    },
    computed: {
        buttonColor() {
            return this.color ? `button-${this.color}` : null;
        }
    },
    mounted: function() {
        var vm = this;
        var element = jQuery(this.$el);
        element.uxbutton();
        element.bind("click", function() {
            vm.$emit("click");
        });
    }
});

export default UxButton;
</script>

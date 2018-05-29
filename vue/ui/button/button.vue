<template>
<div class="button button-color">
    <slot></slot>
</div>
</template>

<style scoped>
</style>

<script>
import Vue from "vue";
import jQuery from "jquery";

export const UxButton = Vue.component("ux-button", {
    data: function() {
        return {
            isEnabled: true
        };
    },
    mounted: function() {
        var vm = this;
        var element = jQuery(this.$el);
        element.uxbutton();
        element.bind("click", function() {
            vm.$emit("click");
        });
    },
    methods: {
        enable: function() {
            this.isEnabled = true;
        },
        disable: function() {
            this.isEnabled = false;
        }
    },
    watch: {
        isEnabled: function(val) {
            if (val) {
                jQuery(this.$el).uxenable();
            } else {
                jQuery(this.$el).uxdisable();
            }
        }
    }
});

export default UxButton;
</script>

<template>
<ul class="drop-down" data-name="Drop Down">
    <li v-for="item in items" v-bind:key="item.name">
        <span>{{ item.text }}</span>
    </li>
</ul>
</template>

<style scoped>
</style>

<script>
import Vue from "vue";
import jQuery from "jquery";

export const UxDropDown = Vue.component("ux-drop-down", {
    data: function() {
        return {
            isEnabled: true
        };
    },
    props: {
        items: []
    },
    mounted: function() {
        var vm = this;
        var element = jQuery(this.$el);
        element.uxdropdown();
        element.bind("value_change", function(event, value, text, same) {
            vm.$emit("click", value, text, same);
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
        items: function(val) {
            var vm = this;
            setTimeout(function() {
                jQuery(vm.$el).triggerHandler("update");
            });
        },
        isEnabled: function(val) {
            if (val) {
                jQuery(this.$el).uxenable();
            } else {
                jQuery(this.$el).uxdisable();
            }
        }
    }
});

export default UxDropDown;
</script>

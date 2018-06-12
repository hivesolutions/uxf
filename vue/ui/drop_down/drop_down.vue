<template>
<ul class="drop-down" data-name="Drop Down">
    <input type="hidden" v-if="persist" />
    <li v-for="item in items" v-bind:key="item.name"
        v-bind:data-value="item.value">
        <span>{{ item.text }}</span>
    </li>
</ul>
</template>

<style scoped>
</style>

<script>
import Vue from "vue";
import jQuery from "jquery";
import "base";

import state from "../../mixins";

export const UxDropDown = Vue.component("ux-drop-down", {
    mixins: [state],
    data: function() {
        return {
            items: []
        };
    },
    props: {
        values: {
            type: Array,
            default: function() {
                return [];
            }
        },
        persist: {
            type: Boolean,
            default: function() {
                return false;
            }
        }
    },
    mounted: function() {
        var vm = this;
        var element = jQuery(this.$el);
        element.uxdropdown();
        element.bind("value_change", function(event, value, text, same) {
            vm.$emit("value_change", value, text, same);
        });
        this.items = this.$props.values;
    },
    watch: {
        values: function(val) {
            this.items = val;
        },
        items: function(val) {
            var vm = this;
            setTimeout(function() {
                jQuery(vm.$el).triggerHandler("update");
            });
        }
    }
});

export default UxDropDown;
</script>

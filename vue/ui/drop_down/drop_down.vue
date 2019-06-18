<template>
    <ul class="drop-down" data-name="Drop Down">
        <input type="hidden" v-if="persist" />
        <li v-bind:data-value="item.value" v-for="item in items" v-bind:key="item.name">
            <span>{{ item.text }}</span>
        </li>
    </ul>
</template>

<style scoped></style>

<script>
import Vue from "vue";
import jQuery from "jquery";
import "base";

import { state } from "../../mixins";

export const UxDropDown = Vue.component("ux-drop-down", {
    mixins: [state],
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
    data: function() {
        return {
            items: []
        };
    },
    watch: {
        values(val) {
            this.items = val;
        },
        items(val) {
            var vm = this;
            setTimeout(function() {
                jQuery(vm.$el).triggerHandler("update");
            });
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
    }
});

export default UxDropDown;
</script>

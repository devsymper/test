<template>
    <draggable
        class="list-group"
        tag="div"
        v-model="value"
        v-bind="dragOptions"
        @start="dragging = true"
        @end="handleStopDragItem"
    >
        <transition-group type="transition" :name="!dragging ? 'flip-list' : null">
            <div class="fs-13 p-2" v-for="(item,idx) in value" :key="idx">
                <v-icon size="18" class="mr-2" v-if="item.preIcon">{{item.preIcon}}</v-icon>
                <span class="fs-13" X>{{item.text}}</span>
                <v-icon size="18" class="mr-2 float-right" v-if="item.subIcon">{{item.subIcon}}</v-icon>
            </div>
        </transition-group>
    </draggable>
</template>

<script>
export default {
    props: {
        /**
         * mảng cần sắp xếp, có dạng
         * [
         *      {
         *          text: '',
         *          preIcon: '',
         *          subIcon: ''
         *      }
         * ]
         */
        value: {
            type: Array,
            default() {
                return [];
            }
        }
    },
    computed: {
        valueClone: {
            get() {
                return this.value;
            },
            set(vl) {
                this.$emit("input", vl);
            }
        }
    },
    data() {
        return {
            dragging: false,
            dragOptions: {
                animation: 200,
                group: "list-item-orderring",
                disabled: false,
                ghostClass: "ghost-item"
            }
        };
    },
    methods: {
        handleStopDragItem() {
            this.dragging = false;
        }
    }
};
</script>

<style>
.column-drag-pos[draggable="true"] {
    background-color: #ffe6d2;
}
</style>
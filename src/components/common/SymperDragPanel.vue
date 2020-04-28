<template>
    <div
        ref="symperDragPanel"
        v-show="showPanel"
        class="symper-drag-panel elevation-12"
        :style="{
            width:dragPanelWidth+'px',
            'max-width':dragPanelWidth+'px',
            height: dragPanelHeight+'px'
        }">
        <div class="pa-2 symper-drag-panel-header" style="height:30px">
            <span class="float-left title pl-2 pt-2">
                {{actionTitle}}
            </span>
            <v-icon
                @click="handleClosePanel"
                class="close-btn float-right"
                style="font-size:16px;position: relative;top: -3px;"
            >mdi-close</v-icon>
        </div>
        <div class="symper-drag-panel-body px-2 pb-2">
            <slot name="drag-panel-content" :panelData="panelData"></slot>
        </div>
    </div>
</template>

<script>
window.dragElement = function(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(
            elmnt.id + "header"
        ).onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        if (
            $(e.target).hasClass("symper-drag-panel-header") ||
            $(e.target).parents(".symper-drag-panel-header").length > 0
        ) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
};
export default {
    props: {
        showPanel: {
            type: Boolean,
            default: false
        },
        dragPanelWidth: {
            type: Number,
            default: 500
        },
        dragPanelHeight: {
            type: Number,
            default: 400
        },
        actionTitle: {
            type: String,
            default: ''
        },
        panelData: {
            type: Object,
            default: {}
        }
    },
    watch: {
        showPanel() {
            if (this.showPanel) {
                setTimeout(
                    self => {
                        dragElement(self.$refs.symperDragPanel);
                    },
                    200,
                    this
                );
            }
        }
    },
    data(){
        return {
            selfShowPanel: false
        }
    },
    methods: {
        handleClosePanel() {
            this.$emit('before-close',{});
            this.selfShowPanel = false;
        }
    }
};
</script>

<style>

.symper-drag-panel {
    position: fixed;
    top: 100px;
    left: 300px;
    z-index: 500;
    background-color: white;
    border-radius: 3px;
}

.symper-drag-panel .symper-drag-panel-header {
    cursor: move;
    background-color: #efefef;
}
</style>
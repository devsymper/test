<template>
    <div
        ref="symperDragPanel"
        v-show="selfShowPanel"
        class="symper-drag-panel elevation-12"
        :style="{
            width:dragPanelWidth+'px',
            height: dragPanelHeight+'px',
            top: topPosition+'px',
            left: leftPosition+'px'
        }">
        <div class="position-relative w-100 h-100">
            <div class="pa-2 symper-drag-panel-header" style="height:30px">
                <span class="float-left pl-2 drag-panel-title">
                    <i :class="'mr-2 mdi '+titleIcon" v-if="titleIcon != ''"></i>{{actionTitle}}
                </span>
                <v-icon
                    @click="hide"
                    class="close-btn float-right"
                    style="font-size:16px;position: relative;top: -3px;"
                >mdi-close</v-icon>
            </div>
            <div class="symper-drag-panel-body px-2 pb-2" :style="styleBody">
                <slot name="drag-panel-content" :panelData="panelData"></slot>
            </div>
            <div ref="resizer" class="symper-drag-panel-resizer">
                <i class="mdi mdi-resize-bottom-right"></i>
            </div>
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
            default(){
                return {}
            }
        },
        topPosition: {
            type: Number,
            default: 100
        },
        leftPosition: {
            type: Number,
            default: 300
        },
        titleIcon: {
            type: String,
            default: ''
        },
        styleBody:{
            type:Object,
            default(){
                return {}
            }
        }
    },
    
    data(){
        return {
            selfShowPanel: null
        }
    },
    beforeMount(){
        this.selfShowPanel = false;
    },
    mounted(){
        setTimeout((self) => {
            dragElement(self.$refs.symperDragPanel);
        }, 200, this);
        this.$refs.resizer.addEventListener('mousedown', this.initResize, false);

    },
    methods: {
        show(){
            this.selfShowPanel = true;
            $('.v-application:first-child').append(this.$el.detach());
        },
        hide() {
            this.$emit('before-close',{});
            this.selfShowPanel = false;
        },
        initResize(e) {
            window.addEventListener('mousemove', this.resize, false);
            window.addEventListener('mouseup', this.stopResize, false);
        },
        resize(e) {
            let element = this.$refs.symperDragPanel;
            element.style.width = (e.clientX - element.offsetLeft) + 'px';
            element.style.height = (e.clientY - element.offsetTop) + 'px';
        },
        stopResize(e) {
            window.removeEventListener('mousemove', this.resize, false);
            window.removeEventListener('mouseup', this.stopResize, false);
        }
    },
};
</script>

<style>

.symper-drag-panel {
    position: fixed;
    overflow: hidden;
    z-index: 500;
    background-color: white;
    border-radius: 3px;
}

.symper-drag-panel .symper-drag-panel-header {
    cursor: move;
    border-bottom: 1px solid #ededed;
}

.symper-drag-panel .symper-drag-panel-body {
    height: calc(100% - 30px);
}

.drag-panel-title {
    font-size: 15px;
    font-weight: 500;
    position: relative;
    top: -5px;

}

.symper-drag-panel-resizer {
    position: absolute;
    right: 0px;
    bottom: 0px;
    display: inline-block;
    height: 20px;
    width: 20px;
    z-index: 9999999;
    cursor: se-resize;
}

.symper-drag-panel-resizer i{
    font-size: 18px;
    line-height: 18px;
    position: absolute;
}
</style>
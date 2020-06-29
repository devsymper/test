<template>
    <div class="d-flex w-100 h-100">
        <NodeSelector class="border-right-1"></NodeSelector>

        <div class="h-100 flex-grow-1">
            <div class="border-bottom-1 pt-1">
                <v-tooltip bottom v-for="(item, key) in headerActions" :key="key">
                    <template v-slot:activator="{ on }">
                        <v-btn
                            @click="handleHeaderAction(key)"
                            icon
                            class="mr-2"
                            style="position:relative; top: -3px"
                        > 
                            <v-icon size="21" v-on="on">{{item.icon}}</v-icon>
                        </v-btn>
                    </template>
                    <span>{{$t(item.text) }}</span>
                </v-tooltip>
            </div>
            <EditorWorkspace class="w-100" style="height: calc(100% - 41px)"></EditorWorkspace>
        </div>

        <div :style="{
            width:'250px'
        }" class="h-100 border-left-1">
            <ConfigPanel 
            :instanceKey="instanceKey"></ConfigPanel>
        </div>
    </div>
</template>

<script>
import ConfigPanel from './ConfigPanel.vue';
import EditorWorkspace from './EditorWorkspace.vue';
import NodeSelector from './NodeSelector.vue';
import VueResizable from 'vue-resizable';
import { getOrgchartEditorData, getDefaultConfigNodeData } from './nodeAttrFactory';


export default {
    components: {
        ConfigPanel,
        EditorWorkspace,
        NodeSelector,
        VueResizable,
    },
    props: {
        action: {
            type: String,
            default: 'create' // clone, edit
        }
    },
    data(){
        return {
            headerActions: {
                undo: {
                    icon: "mdi-undo",
                    text: "process.header_bar.undo"
                },
                redo: {
                    icon: "mdi-redo",
                    text: "process.header_bar.redo"
                },
                zoomIn: {
                    icon: "mdi-minus-circle-outline",
                    text: "process.header_bar.zoom_in"
                },
                zoomOut: {
                    icon: "mdi-plus-circle-outline",
                    text: "process.header_bar.zoom_out"
                },
                focus: {
                    icon: "mdi-image-filter-center-focus",
                    text: "process.header_bar.focus"
                },
                saveSVG: {
                    icon: "mdi-image-outline",
                    text: "process.header_bar.save_svg"
                },
                validate: {
                    icon: "mdi-check-bold",
                    text: "process.header_bar.validate"
                }
            },
            instanceKey:null
        }
    },
    created(){
        this.instanceKey = Date.now();
        if(this.action == 'create'){
            this.initOrgchartData();
        }
    },
    methods: {
        handleHeaderAction(action){

        },
        initOrgchartData(){
            let initData = getOrgchartEditorData();
            this.$store.commit('orgchart/setOrgchartData', {
                instanceKey: this.instanceKey,
                data: initData
            });
        },
        /**
         * Tạo node data để cấu hình
         * @param type nhận một trong các giá trị: department hoặc position
         */
        createNodeConfigData(type = 'department', nodeId){
            let defaultConfig = getDefaultConfigNodeData();
            this.$store.commit('orgchart/setNodeConfig', {
                instanceKey: this.instanceKey,
                nodeId: nodeId,
                data: defaultConfig
            });
        },

        /**
         * Chọn một node và hiển thị lên cấu hình ở bên tay phải
         */
        selectNode(nodeId){
            this.$store.commit('orgchart/changeSelectingNode', {
                instanceKey: this.instanceKey,
                nodeId: nodeId,
            });
        }
    }
}
</script>

<style>
</style>
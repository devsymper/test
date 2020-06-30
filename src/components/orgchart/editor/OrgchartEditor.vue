<template>
    <div class="d-flex w-100 h-100">
        <!-- <NodeSelector class="border-right-1"></NodeSelector> -->

        <div class="h-100 flex-grow-1">
            <div class="border-bottom-1 pt-1 pl-2">
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

                <v-btn
                    v-if="$route.name != 'viewOrgchart'"
                    class="float-right mr-1"
                    @click="saveOrgchart"
                    small
                    depressed
                    color="primary"
                >
                    <v-icon class="mr-2" primary>mdi-content-save</v-icon>
                    {{$t('common.save')}}
                </v-btn>
            </div>
            <EditorWorkspace 
                class="w-100" 
                style="height: calc(100% - 41px)"
                @new-viz-cell-added="handleNewNodeAdded"
                @blank-paper-clicked="handleBlankPaperClicked"
                @cell-contextmenu="showPositionEditor"
                @cell-clicked="selectNode"
                :instanceKey="instanceKey"
                :context="context"
                ref="editorWorkspace"></EditorWorkspace>
        </div>

        <div :style="{
            width:'250px'
        }" class="h-100 border-left-1">
            <ConfigPanel 
            @config-value-change="handleConfigValueChange"
            :instanceKey="instanceKey">
            </ConfigPanel>
        </div>

        <v-navigation-drawer
            v-if="context == 'department'"
            v-model="positionEditor"
            right
            absolute
            temporary
            :style="{
                width: '1000px'
            }">

            <OrgchartEditor
                ref="positionDiagram"
                :instanceKey="selectingNode.positionDiagramCells.instanceKey"
                context="position">
            </OrgchartEditor>

        </v-navigation-drawer>
    </div>
</template>

<script>
import ConfigPanel from './ConfigPanel.vue';
import EditorWorkspace from './EditorWorkspace.vue';
import NodeSelector from './NodeSelector.vue';
import VueResizable from 'vue-resizable';
import { getOrgchartEditorData, getDefaultConfigNodeData, SYMPER_HOME_ORGCHART } from './nodeAttrFactory';
import jointjs from "jointjs";

console.log(jointjs, 'jointjsjointjs');


export default {
    name: 'OrgchartEditor',
    computed: {
        selectingNode(){
            return this.$store.state.orgchart.editor[this.instanceKey].selectingNode;
        }
    },
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
        },
        context: {
            type: String,
            default: 'department' // department hoặc position
        },
        instanceKey: {
            default: Date.now()
        }
    },
    data(){
        return {
            positionEditor: false,
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
                },
                home: {
                    icon: "mdi-home-outline",
                    text: ""
                },
            },
        }
    },
    created(){
        if(this.action == 'create'){
            this.initOrgchartData();
        }
    },
    watch: {
        positionEditor(after){
            if(after === false){
                this.storeDepartmentPositionCells();
            }
        }
    },
    methods: {
        showPositionEditor(nodeId){
            if(this.context == 'department'){
                this.positionEditor = true;
                this.selectNode(nodeId);
                this.checkAndCreateOrgchartData();
                if(this.selectingNode.positionDiagramCells.cells){
                    this.$refs.positionDiagram.loadDiagramFromJson(this.selectingNode.positionDiagramCells.cells);
                }else{
                    this.$refs.positionDiagram.createFirstVizNode();
                }
            }
        },
        createFirstVizNode(){
            this.$refs.editorWorkspace.createFirstVizNode();
        },
        loadDiagramFromJson(cells){
            this.$refs.editorWorkspace.loadDiagramFromJson(cells);
        },
        checkAndCreateOrgchartData(){
            let subInstanceKey = this.selectingNode.positionDiagramCells.instanceKey;
            if(!this.$store.state.orgchart.editor[subInstanceKey]){
                this.$refs.positionDiagram.initOrgchartData();
            }
        },
        storeDepartmentPositionCells(){
            let cells = this.$refs.positionDiagram.$refs.editorWorkspace.getAllDiagramCells();
            this.selectingNode.positionDiagramCells.cells = cells;
        },
        saveOrgchart(){

        },
        handleBlankPaperClicked(){
            this.showOrgchartConfig();
        },
        handleConfigValueChange(data){
            let cellId = this.selectingNode.id;
            if(data.name == 'name' && cellId != SYMPER_HOME_ORGCHART){
                this.$refs.editorWorkspace.updateCellAttrs(cellId, 'name', data.data);
            }
        },
        handleNewNodeAdded(nodeData){
            this.createNodeConfigData(this.context, nodeData);
            this.selectNode(nodeData.id);
        },
        handleHeaderAction(action){
            if(action == 'home'){
                this.showOrgchartConfig()
            }
        },
        showOrgchartConfig(){
            this.$store.commit('orgchart/changeSelectingNode', {
                instanceKey: this.instanceKey,
                nodeId: SYMPER_HOME_ORGCHART,
            });
        },
        initOrgchartData(instanceKey = false){
            instanceKey = instanceKey ? instanceKey : this.instanceKey;
            let initData = getOrgchartEditorData();
            this.$store.commit('orgchart/setOrgchartData', {
                instanceKey: instanceKey,
                data: initData
            });
        },
        /**
         * Tạo node data để cấu hình
         * @param type nhận một trong các giá trị: department hoặc position
         */
        createNodeConfigData(type = 'department', nodeData){
            let defaultConfig = getDefaultConfigNodeData(nodeData.id, type == 'department');
            for(let key in nodeData){
                if(defaultConfig.commonAttrs[key]){
                    defaultConfig.commonAttrs[key].value = nodeData[key];
                }
            }
            
            this.$store.commit('orgchart/setNodeConfig', {
                instanceKey: this.instanceKey,
                nodeId: nodeData.id,
                data: defaultConfig
            });

            
            if(type == 'department'){
                this.initOrgchartData(defaultConfig.positionDiagramCells.instanceKey);
            }
        },

        /**
         * Chọn một node và hiển thị lên cấu hình ở bên tay phải
         */
        selectNode(nodeId){
            this.$refs.editorWorkspace.unHighlightCurrentNode();
            this.$store.commit('orgchart/changeSelectingNode', {
                instanceKey: this.instanceKey,
                nodeId: nodeId,
            });
            this.$refs.editorWorkspace.highlightNode();            
        }
    }
}
</script>

<style>
</style>
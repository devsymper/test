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
                    v-if="action != 'view' && context == 'department'"
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
            :instanceKey="instanceKey"
            :context="context">
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
import { orgchartApi } from "@/api/orgchart.js";
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
            default: 'create' // clone, edit, view
        },
        context: {
            type: String,
            default: 'department' // department hoặc position
        },
        instanceKey: {
            default: Date.now()
        },
        id: {
            default: ''
        }
    },
    data(){
        return {
            positionEditor: false,
            headerActions: {
                // undo: {
                //     icon: "mdi-undo",
                //     text: "process.header_bar.undo",
                //     action: "undo"
                // },
                // redo: {
                //     icon: "mdi-redo",
                //     text: "process.header_bar.redo",
                //     action: "redo"

                // },
                zoomIn: {
                    icon: "mdi-plus-circle-outline",
                    text: "process.header_bar.zoom_in",

                },
                zoomOut: {
                    icon: "mdi-minus-circle-outline",
                    text: "process.header_bar.zoom_out",

                },
                zoomToFit: {
                    icon: "mdi-image-filter-center-focus",
                    text: "process.header_bar.focus",
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
        this.initOrgchartData();
        if(this.action != 'create'){
            this.restoreOrgchartView(this.id)
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
        restoreMainOrgchartConfig(config){
            let homeConfig = this.$store.state.orgchart.editor[this.instanceKey].homeConfig;
            homeConfig.commonAttrs.name.value = config.name;
            homeConfig.commonAttrs.description.value = config.description;
        },
        async restoreOrgchartView(id){
            try {
                let res = await orgchartApi.getOrgchartDetail(id);
                if(res.status == 200){
                    let savedData = res.data;
                    let departments = JSON.parse(savedData.orgchart.content);
                    this.$refs.editorWorkspace.loadDiagramFromJson(departments);
                    this.restoreMainOrgchartConfig(savedData.orgchart);
                    let mapIdToDpm = {};

                    for(let node of savedData.departments){
                        let nodeData = {
                            id: node.vizId,
                            name: node.name,
                            description: node.description,
                            code: node.code,        
                        };

                        if(node.content && node.content !== 'false'){
                            nodeData.positionDiagram = {
                                cells: JSON.parse(node.content)
                            }         
                        }
                        let newDepartment = this.createNodeConfigData('department', nodeData);
                        mapIdToDpm[node.vizId] = newDepartment;
                    }

                    this.addUsersToPosition(savedData.positions, savedData.userInPostion);

                    let allPositionInADpm = this.getAllPositionInADpm(savedData.positions);
                    for(let dpmId in allPositionInADpm){
                        let dpmInstanceKey = this.$store.state.orgchart.editor[this.instanceKey].allNode[dpmId].positionDiagramCells.instanceKey;
                        for(let idPosition in allPositionInADpm[dpmId]){
                            let position = allPositionInADpm[dpmId][idPosition];

                            let nodeData = {
                                id: position.vizId,
                                name: position.name,
                                description: position.description,
                                code: position.code,
                                users: position.users ? position.users : []
                            };
                            this.createNodeConfigData('position', nodeData, dpmInstanceKey);
                        }
                    }
                }else{
                    this.$snotifyError(error, "Can not get orgchart data",res.message);
                }
            } catch (error) {
                this.$snotifyError(error, "Can not get orgchart data");
            }
        },

        addUsersToPosition(postions, users){
            let mapPostitions = postions.reduce((map, el)=> {
                map[el.id] = el;
                return map;
            } , {});
            for(let u of users){
                let pos = mapPostitions[u.jobNodeId];
                if(!pos.users){
                    pos.users = [];
                }
                pos.users.push(u.userId);
            }
        },

        getAllPositionInADpm(allPosition){
            let mapIdToPos = allPosition.reduce((obj, el) => {
                obj[el.vizId] = el;
                return obj;
            }, {});

            let posInDpm = {};

            for(let id in mapIdToPos){
                let pos = mapIdToPos[id];
                let parentPos = mapIdToPos[pos.vizParentId];
                if(parentPos){
                    if(!parentPos.children){
                        parentPos.children = [];
                    }
                    parentPos.children.push(id);
                }else{
                    // khi position này là root
                    posInDpm[id] = {};
                }
            }

            for(let id in posInDpm){
                this.addPosToDpm(posInDpm, mapIdToPos,id, id);
            }
            let mapDpmToPos = {};
            
            for(let id in posInDpm){
                let dpmId = mapIdToPos[id].vizParentId;
                mapDpmToPos[dpmId] = posInDpm[id];
            }
            return mapDpmToPos;
        },
        addPosToDpm(rsl, map, currentId, rootId){
            rsl[rootId][currentId] = map[currentId];
            if(map[currentId].children){
                for(let childId of map[currentId].children){
                    this.addPosToDpm(rsl, map, childId, rootId);
                }
            }
        },
        showPositionEditor(nodeId){
            if(this.context == 'department'){
                this.positionEditor = true;
                this.selectNode(nodeId);

                setTimeout((self) => {
                    self.checkAndCreateOrgchartData();
                    if(self.selectingNode.positionDiagramCells.cells){
                        self.$refs.positionDiagram.loadDiagramFromJson(self.selectingNode.positionDiagramCells.cells);
                    }else{
                        self.$refs.positionDiagram.createFirstVizNode();
                    }
                }, 200, this);
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
        validateDataBeforeSave(){
            let orgchartAttr = this.$store.state.orgchart.editor[this.instanceKey].homeConfig;
            if(orgchartAttr.commonAttrs.name.value){
                return {
                    passed: true
                }
            }else{
                return {
                    passed: false,
                    message: "Orgchart name can not empty!"
                }
            }
        },
        async saveOrgchart(){
            let validate = this.validateDataBeforeSave();
            if(!validate.passed){
                this.$snotifyError({}, validate.message);
                return;
            }
            let orgchartData = this.getDataToSave();
            this.$emit('save-orgchart-data', orgchartData);          
        },
        getDataToSave(){
            let orgchartAttr = this.$store.state.orgchart.editor[this.instanceKey].homeConfig;
            let allVizCell = this.$refs.editorWorkspace.getAllDiagramCells();
            let data = {
                content: JSON.stringify(allVizCell),
                departments: JSON.stringify(this.getAllNodesToSave(allVizCell.cells, this.instanceKey)),
                description: orgchartAttr.commonAttrs.description.value,
                dynamicAttrs: JSON.stringify(orgchartAttr.customAttributes),
                name: orgchartAttr.commonAttrs.name.value
            };
            return data;
        },
        getAllNodesToSave(allVizCell, instanceKey, type = 'department'){
            let links = [];
            let nodeMap = {};
            console.log(allVizCell);

            for(let cell of allVizCell){
                if(cell.type == "org.Arrow"){
                    links.push(cell);
                }else{
                    nodeMap[cell.id] = this.getNodeDataToSave(cell.id, instanceKey, type);
                }
            }

            for(let link of links){
                nodeMap[link.target.id].vizParentId = link.source.id;
            }
            return Object.values(nodeMap);
        },
        getNodeDataToSave(nodeId, instanceKey, nodeType){
            let node = this.$store.state.orgchart.editor[instanceKey].allNode[nodeId];
            let attrs = node.commonAttrs;
            let data = {
                name: attrs.name.value,
                code: attrs.code.value,
                vizId: nodeId,
                description: attrs.description.value,
                vizParentId: '',
                dynamicAttrs: node.customAttributes,
            };
            
            if(nodeType == 'department'){
                data.content = node.positionDiagramCells.cells ? JSON.stringify(node.positionDiagramCells.cells) : 'false';
                if(node.positionDiagramCells.cells){
                    let jobs = this.getAllNodesToSave(node.positionDiagramCells.cells.cells, node.positionDiagramCells.instanceKey,  'position');
                    for(let j of jobs){
                        if(!j.vizParentId){
                            j.vizParentId = nodeId;
                        }
                    }
                    data.jobs = jobs;
                }else{
                    data.jobs = [];
                }
            }else{
                data.users = node.users;
            }
            return data;
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
            }else if(action == 'saveSVG'){
                this.$refs.editorWorkspace.saveSVG();
            }else if(action == 'validate'){
                let rsl = this.validateDataBeforeSave();
                if(rsl.passed){
                    this.$snotifySuccess("Validate passed!");
                }else{
                    this.$snotifyError(rsl,"Validate failed!", rsl.message);
                }
            }else{
                this.$refs.editorWorkspace.handleHeaderAction(action);
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
        createNodeConfigData(type = 'department', nodeData, instanceKey = false){
            if(!instanceKey){
                instanceKey = this.instanceKey;
            }
            let defaultConfig = getDefaultConfigNodeData(nodeData.id, type == 'department');
            for(let key in nodeData){
                if(defaultConfig.commonAttrs[key]){
                    defaultConfig.commonAttrs[key].value = nodeData[key];
                }
            }

            if(nodeData.positionDiagram){
                defaultConfig.positionDiagramCells.cells = nodeData.positionDiagram.cells;
            }

            if(type == 'position' && nodeData.users){
                defaultConfig.users = nodeData.users;
            }
            
            this.$store.commit('orgchart/setNodeConfig', {
                instanceKey: instanceKey,
                nodeId: nodeData.id,
                data: defaultConfig
            });
            
            if(type == 'department'){
                this.initOrgchartData(defaultConfig.positionDiagramCells.instanceKey);
            }

            return defaultConfig;
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
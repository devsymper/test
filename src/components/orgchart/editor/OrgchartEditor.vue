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
            <div v-if="loadingDiagramView" style="
                position: absolute;
                width: calc(100% - 267px);
                height: 100%;
                background-color: white;
                z-index: 99;">
                <v-progress-circular
                    :size="50"
                    color="orange"
                    indeterminate
                    style="
                        position: absolute;
                        top: 45%;
                        left: 50%;
                        margin-right: -50%;
                        transform: translate(-50%, -50%) "      
                ></v-progress-circular>
            </div>
            
            <EditorWorkspace 
                :class="{
                    'w-100': true,
                    'symper-orgchart-view': action == 'view',
                    'symper-orgchart-active-editor': action != 'view'
                }" 
                style="height: calc(100% - 41px)"
                @new-viz-cell-added="handleNewNodeAdded"
                @blank-paper-clicked="handleBlankPaperClicked"
                @cell-contextmenu="showPositionEditor"
                @cell-clicked="selectNode"
                :instanceKey="instanceKey"
                :context="context"
                ref="editorWorkspace"/>

        </div>

        <div :style="{
            width:'250px'
        }" class="h-100 border-left-1">
            <ConfigPanel 
                @update-dynamic-attr-display="updateDynamicAttrNodeDisplay"
                @config-value-input="handleConfigValueChange"
                @change-user-select="handleConfigUserSelectChange"
                @apply-style-for-node="handleStyleChange"
                :instanceKey="instanceKey"
                :action="action"
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
                @update-department-name="changeDepartmentName"
                ref="positionDiagram"
                :action="action"
                :id="id"
                :instanceKey="selectingNode.positionDiagramCells ? selectingNode.positionDiagramCells.instanceKey : ''"
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
import { getOrgchartEditorData, getDefaultConfigNodeData, SYMPER_HOME_ORGCHART, getNodeStyleConfig, getMapDpmIdToPosition } from './nodeAttrFactory';
import jointjs from "jointjs";
import { orgchartApi } from "@/api/orgchart.js";
import { FOUCUS_DEPARTMENT_DISPLAY, DEFAULT_DEPARTMENT_DISPLAY, departmentMarkup } from '../nodeDefinition/departmentDefinition';
import { permissionApi } from '../../../api/permissionPack';

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
            loadingDiagramView: true,
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
                    text: "process.header_bar.zoom_out",

                },
                zoomOut: {
                    icon: "mdi-minus-circle-outline",
                    text: "process.header_bar.zoom_in",

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
        }else{
            setTimeout((self) => {
                self.loadingDiagramView = false;
            }, 1500, this);
        }
        this.$store.dispatch('orgchart/getAllStyleNode');

    },
    activated(){
        this.centerDiagram();
    },
    watch: {
        positionEditor(after){
            if(after === false){
                this.storeDepartmentPositionCells();
            }
        }
    },
    methods: {
        handleStyleChange(info){
            this.changeNodeBottomColor(info.data.highlight.value, info.type == 'child');
        },
        changeNodeBottomColor(color, applyForChild = false){
            let affectedNodeIds = [];
            let workspace = this.$refs.editorWorkspace;
            let currentNodeId = this.selectingNode.id;

            if(!applyForChild){
                affectedNodeIds = [currentNodeId];
            }else{
                if(currentNodeId == SYMPER_HOME_ORGCHART){
                    affectedNodeIds = workspace.getAllNode().reduce((arr, el) => {
                        arr.push(el.id);
                        return arr;
                    }, []);
                }else{
                    affectedNodeIds = workspace.getAllChildIdOfNode(currentNodeId);
                }
            }

            for(let id of affectedNodeIds){
                workspace.updateCellAttrs(id, 'highlight', color);
                this.$store.state.orgchart.editor[this.instanceKey].allNode[id].style.highlight.value = color;
            }
        },
        updateDynamicAttrNodeDisplay(){
            let atts = this.selectingNode.customAttributes;
            if(this.context == 'position'){
                let lastAttr = atts[atts.length - 1];
                let content = lastAttr.name + ' : ' + lastAttr.value
                this.$refs.editorWorkspace.updateCellAttrs(this.selectingNode.id, 'lastDynamicAttr', content);
            }
        },
        handleConfigUserSelectChange(listUserIds){
            this.$refs.editorWorkspace.changeUserDisplayInNode(listUserIds);

            if(this.context == 'department'){
                this.changeManagerForDepartment(this.selectingNode.id, listUserIds);
            }
        },
        // Kiểm tra xem department hiện tại đã có node Manager hay chưa
        changeManagerForDepartment(departmentVizId, userIds){
            this.checkAndCreateOrgchartData();
            if(!this.selectingNode.positionDiagramCells.cells){
                this.$refs.positionDiagram.createFirstVizNode();
                this.storeDepartmentPositionCells(); 
            }
        },
        restoreMainOrgchartConfig(config){
            let homeConfig = this.$store.state.orgchart.editor[this.instanceKey].homeConfig;
            homeConfig.commonAttrs.name.value = config.name;
            homeConfig.commonAttrs.description.value = config.description;
            homeConfig.commonAttrs.code.value = config.code;
            homeConfig.customAttributes = config.dynamicAttributes;
        },
        correctDiagramDisplay(content){
            if(typeof content != 'object'){
                content = JSON.parse(content);
            }
            for(let node of content.cells){
                if(node.type == 'Symper.Department'){
                    node.markup = departmentMarkup;
                }
            }
            return content;
        },
        async restoreOrgchartView(id){
            if(!id){
                return
            }
            try {
                let res = await orgchartApi.getOrgchartDetail(id);
                if(res.status == 200){
                    let savedData = res.data;
                    let departments = this.correctDiagramDisplay(savedData.orgchart.content);
                    this.$refs.editorWorkspace.loadDiagramFromJson(departments);
                    this.centerDiagram();
                    this.restoreMainOrgchartConfig(savedData.orgchart);
                    let mapIdToDpm = {};

                    for(let node of savedData.departments){
                        let nodeData = {
                            id: node.vizId,
                            name: node.name,
                            description: node.description,
                            code: node.code,
                            users: this.getListUserAsArr(node.users)
                        };

                        if(node.content && node.content !== 'false'){
                            nodeData.positionDiagram = {
                                cells: JSON.parse(node.content)
                            }         
                        }
                        let newDepartment = this.createNodeConfigData('department', nodeData);
                        if(node.dynamicAttributes){
                            newDepartment.customAttributes = node.dynamicAttributes;
                        }
                        newDepartment.style = this.restoreNodeStyle(node.style);
                        mapIdToDpm[node.vizId] = newDepartment;
                    }

                    this.addUsersToPosition(savedData.positions, savedData.userInPostion);

                    let allPositionInADpm = getMapDpmIdToPosition(savedData.positions);
                    for(let dpmId in allPositionInADpm){
                        let dpmInstanceKey = this.$store.state.orgchart.editor[this.instanceKey].allNode[dpmId].positionDiagramCells.instanceKey;
                        for(let idPosition in allPositionInADpm[dpmId]){
                            let position = allPositionInADpm[dpmId][idPosition];
                            let userSelected = this.getListUserAsArr(position.users);
                            let nodeData = {
                                id: position.vizId,
                                name: position.name,
                                description: position.description,
                                code: position.code,
                                users: userSelected
                            };
                            let newPosition = this.createNodeConfigData('position', nodeData, dpmInstanceKey);
                            newPosition.style = this.restoreNodeStyle(position.style);

                            if(position.dynamicAttributes){
                                newPosition.customAttributes = position.dynamicAttributes;
                            }
                        }
                    }
                    this.showOrgchartConfig();
                    setTimeout((self) => {
                        self.loadingDiagramView = false;
                    }, 1500, this);
                }else{
                    this.$snotifyError(res, "Can not get orgchart data",res.message);
                }
            } catch (error) {
                this.$snotifyError(error, "Can not get orgchart data");
            }
        },
        getListUserAsArr(users){
            if(!users){
                users = [];
            }else{
                if(typeof users == 'string'){
                    try {
                        users = JSON.parse(users);
                    } catch (error) {
                        users = [];
                    }
                }
            }
            return users;
        },
        restoreNodeStyle(savedStyle){
            if(typeof savedStyle != 'object'){
                savedStyle = JSON.parse(savedStyle);
            }
            let styleConfig = getNodeStyleConfig();
            for(let key in savedStyle){
                if(styleConfig[key]){
                    styleConfig[key].value = savedStyle[key];
                }
            }
            return styleConfig;
        },

        addUsersToPosition(postions, users){
            let mapPostitions = postions.reduce((map, el)=> {
                map[el.id] = el;
                return map;
            } , {});
            for(let u of users){
                let pos = mapPostitions[u.positionNodeId];
                if(!pos.users){
                    pos.users = [];
                }else if(typeof pos.users == 'string'){
                    pos.users = JSON.parse(pos.users);
                }
                pos.users.push(u.userId);
            }
        },
        centerDiagram(){
            setTimeout((self) => {
                self.$refs.editorWorkspace.handleHeaderAction('zoomToFit');
            }, 200, this);
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
                    self.$refs.positionDiagram.centerDiagram();
                    self.$refs.positionDiagram.$refs.editorWorkspace.scrollPaperToTop(200);
                    self.$refs.positionDiagram.showOrgchartConfig();
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
            this.$store.state.orgchart.editor[subInstanceKey].homeConfig = this.selectingNode;
        },
        storeDepartmentPositionCells(){
            let cells = this.$refs.positionDiagram.$refs.editorWorkspace.getAllDiagramCells();
            this.selectingNode.positionDiagramCells.cells = cells;
        },
        validateOrgchartNameAndCode(){
            let self = this;
            return new Promise((resolve, reject) => {
                let attr = self.$store.state.orgchart.editor[this.instanceKey].homeConfig.commonAttrs;
                let passed = true;
                if(!attr.name.value || !attr.code.value){
                    passed = false;
                    self.showWarning("Orgchart name and code can not empty!", function(){
                        self.selectNode(SYMPER_HOME_ORGCHART);
                    });
                    reject(false);
                }else{
                    resolve(true);
                }
            });
        },
        showWarning(title, resolveAction){
            this.$snotify({
                type: 'warn',
                tex: '',
                duration: 100000,
                position: 'top left',
                title: title,
                actionBtns: [
                    {
                        text: "Resolve",
                        icon: "mdi-send-check",
                        action: (close) => {
                            resolveAction();
                            close();
                        }
                    }
                ]
            });
        },
        validateEmptyNameAndCodeDepartment(){
            let self = this;
            let mapVizNode = this.$refs.editorWorkspace.getAllDiagramCells().cells.reduce((map, el) => {
                map[el.id] = el;
                return map;
            }, {});
            return new Promise((resolve, reject) => {
                let allNode = self.$store.state.orgchart.editor[this.instanceKey].allNode;
                let passed = true;
                for(let nodeId in allNode){
                    if(!mapVizNode[nodeId]){
                        continue;
                    }
                    let attr = allNode[nodeId].commonAttrs;
                    if(!attr.name.value || !attr.code.value){
                        passed = false;
                        self.showWarning("Name and code of department can not empty", function(){
                            self.selectNode(nodeId);
                        });
                    }
                }

                if(passed){
                    resolve();
                }else{
                    reject();
                }
            });
        },
        validateDuplicateCodeDepartment(){
            let self = this;
            let mapVizNode = this.$refs.editorWorkspace.getAllDiagramCells().cells.reduce((map, el) => {
                map[el.id] = el;
                return map;
            }, {});
            return new Promise((resolve, reject) => {
                let allNode = self.$store.state.orgchart.editor[this.instanceKey].allNode;
                let invalidIds = [];
                let mapCodeDpms = {};
                for(let nodeId in allNode){
                    if(!mapVizNode[nodeId]){
                        continue;
                    }
                    let attr = allNode[nodeId].commonAttrs;
                    let code = attr.code.value;
                    if(!code){
                        continue
                    }
                    if(!mapCodeDpms[code]){
                        mapCodeDpms[code] = allNode[nodeId];
                    }else{
                        invalidIds.push(nodeId);
                        self.showWarning("Code of department can not be duplicated", function(){
                            self.selectNode(nodeId);
                        });
                    }
                }

                if(invalidIds.length == 0){
                    resolve();
                }else{
                    reject();
                }
            });
        },
        validateEmptyNameAndCodePosition(){
            let self = this;
            return new Promise((resolve, reject) => {
                let allDpmns = self.$store.state.orgchart.editor[this.instanceKey].allNode;
                let invalidIds = [];
                let mapCodeDpms = {};
                let passed = true;

                let mapVizNode = this.$refs.editorWorkspace.getAllDiagramCells().cells.reduce((map, el) => {
                    map[el.id] = el;
                    return map;
                }, {});

                for(let dpmId in allDpmns){
                    if(!mapVizNode[dpmId]){
                        continue;
                    }

                    let dpm = allDpmns[dpmId];
                    let allPos = self.$store.state.orgchart.editor[dpm.positionDiagramCells.instanceKey].allNode;
                    for(let posId in allPos){
                        let attr = allPos[posId].commonAttrs;
                        if(!attr.name.value || !attr.code.value){
                            passed = false;
                            self.showWarning("Name and code of position can not empty", function(){
                                if(!self.positionEditor){
                                    self.showPositionEditor(dpmId);
                                }else{
                                    if(dpmId != self.selectingNode.id){
                                        self.positionEditor = false;
                                    }
                                }

                                setTimeout(() => {
                                    self.$refs.positionDiagram.selectNode(posId);
                                }, 500);
                                
                            });
                        }
                    }
                }

                if(passed){
                    resolve();
                }else{
                    reject();
                }
            });
        },
        validateDataBeforeSave(){
            let self = this;
            return new Promise((resolve, reject) => {
                let validateMethods = [
                    self.validateOrgchartNameAndCode(),
                    self.validateEmptyNameAndCodeDepartment(),
                    self.validateDuplicateCodeDepartment(),
                    self.validateEmptyNameAndCodePosition(),
                ];

                Promise.all(validateMethods).then(() => {
                    resolve(true);
                }).catch((err) => {
                    reject(err);
                }); 

            });
        },
        async saveOrgchart(){
            let passed = true;
            try {    
                let validate = await this.validateDataBeforeSave();
            } catch (error) {
                console.warn( 'error when validate orgchart before save', error);
                passed = false;
            }      

            if(passed){
                let orgchartData = this.getDataToSave();
                this.$emit('save-orgchart-data', orgchartData);    
            }
        },
        getDataToSave(){
            let orgchartAttr = this.$store.state.orgchart.editor[this.instanceKey].homeConfig;
            let allVizCell = this.$refs.editorWorkspace.getAllDiagramCells();
            allVizCell = this.normalizeDiagramNodeDisplay(allVizCell);
            let data = {
                content: JSON.stringify(allVizCell),
                departments: JSON.stringify(this.getAllNodesToSave(allVizCell.cells, this.instanceKey)),
                description: orgchartAttr.commonAttrs.description.value,
                dynamicAttrs: JSON.stringify(orgchartAttr.customAttributes),
                name: orgchartAttr.commonAttrs.name.value,
                code: orgchartAttr.commonAttrs.code.value
            };
            return data;
        },
        normalizeDiagramNodeDisplay(allVizCell){
            for(let node of allVizCell.cells){
                if(node.type != 'org.Arrow'){
                    if(node.attrs['.card']){
                        node.attrs['.card'].stroke = DEFAULT_DEPARTMENT_DISPLAY.stroke;
                    }
                }
            }
            return allVizCell;
        },
        getAllNodesToSave(allVizCell, instanceKey, type = 'department'){
            let links = [];
            let nodeMap = {};
            console.log(allVizCell);

            for(let cell of allVizCell){
                if(cell.type == "org.Arrow"){
                    links.push(cell);
                }else{
                    let node = this.$store.state.orgchart.editor[instanceKey].allNode[cell.id];
                    if(node){
                        nodeMap[cell.id] = this.getNodeDataToSave(cell.id, instanceKey, type);
                    }
                }
            }

            for(let link of links){
                if(nodeMap[link.target.id]){
                    nodeMap[link.target.id].vizParentId = link.source.id;
                }
            }
            return Object.values(nodeMap);
        },
        getNodeStyleDataToSave(node){
            let nodeStyle ={};
            for(let key in node.style){
                nodeStyle[key] = node.style[key].value;
            }
            return nodeStyle;
        },
        getNodeDataToSave(nodeId, instanceKey, nodeType){
            let node = this.$store.state.orgchart.editor[instanceKey].allNode[nodeId];
            let attrs = node.commonAttrs;
            let nodeStyle = this.getNodeStyleDataToSave(node);

            let data = {
                name: attrs.name.value,
                code: attrs.code.value,
                vizId: nodeId,
                description: attrs.description.value,
                vizParentId: '',
                dynamicAttrs: node.customAttributes,
                style: JSON.stringify(nodeStyle),
                users: JSON.stringify(node.users)
            };
            
            if(nodeType == 'department'){
                data.content = '';
                if(node.positionDiagramCells.cells){
                    data.content = JSON.stringify(this.normalizeDiagramNodeDisplay(node.positionDiagramCells.cells));
                }
                if(node.positionDiagramCells.cells){
                    let positions = this.getAllNodesToSave(node.positionDiagramCells.cells.cells, node.positionDiagramCells.instanceKey,  'position');
                    for(let j of positions){
                        if(!j.vizParentId){
                            j.vizParentId = nodeId;
                        }
                    }
                    data.positions = positions;
                }else{
                    data.positions = [];
                }
            }else{
                data.users = typeof node.users == 'string' ? JSON.parse(node.users) : node.users;
                data.permissions = node.permissions.reduce((arr, el) => {
                    arr.push(el.id);
                    return arr;
                }, []);
            }
            return data;
        },
        handleBlankPaperClicked(){
            this.showOrgchartConfig();
            this.checkAndCreateFirstNode();
        },
        checkAndCreateFirstNode(){
            let allVizCell = this.$refs.editorWorkspace.getAllDiagramCells();
            if(allVizCell.cells.length == 0){
                this.createFirstVizNode();
                this.loadingDiagramView = true;
                setTimeout((self) => {
                    self.loadingDiagramView = false;
                }, 1500, this);
            }
        },
        handleConfigValueChange(data){
            let cellId = this.selectingNode.id;

            if(data.name == 'name' && cellId != SYMPER_HOME_ORGCHART){
                this.$refs.editorWorkspace.updateCellAttrs(cellId, 'name', data.data);
            }else if(cellId == SYMPER_HOME_ORGCHART && this.context == 'position'){
                this.$emit('update-department-name', data.data);
            }else if(this.context == 'position' && data.name == 'code'){
                let content = data.data ? (this.$t('common.code') + ' : '+ data.data) : '';
                this.$refs.editorWorkspace.updateCellAttrs(cellId, 'positionCode', content);
            }
        },
        changeDepartmentName(newName, idDepartment = false){
            if(!idDepartment){
                idDepartment = this.selectingNode.id;
            }
            this.$refs.editorWorkspace.updateCellAttrs(idDepartment, 'name',newName);
        },
        handleNewNodeAdded(nodeData){
            this.createNodeConfigData(this.context, nodeData);
            if(!nodeData.autoCreateFirstNode){
                this.selectNode(nodeData.id);
            }
        },
        async handleHeaderAction(action){
            if(action == 'home'){
                this.showOrgchartConfig()
            }else if(action == 'saveSVG'){
                this.$refs.editorWorkspace.saveSVG();
            }else if(action == 'validate'){
                let passed = true;
                try {    
                    let validate = await this.validateDataBeforeSave();
                } catch (error) {
                    console.warn( 'error when validate orgchart before save', error);
                    passed = false;
                    this.$snotifyError(rsl,"Validate failed!", rsl.message);
                }      

                if(passed){
                    this.$snotifySuccess("Validate passed!");  
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

            if(nodeData.users){
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
            if(this.context == 'position'){
                this.showPermissionsOfNode();
            }       
        },

        async showPermissionsOfNode(){
            if(this.selectingNode.permissions.length > 0 || this.action == 'create'){
                return;
            }
            let res = await permissionApi.getPermissionOfRole('orgchart:'+this.id+':'+this.selectingNode.id);
            if(res.status == 200){
                let mapIdToPermission = this.$store.state.permission.allPermissionPack;
                let permissions = res.data.reduce((arr, el) => {
                    if(mapIdToPermission[el.permissionPackId]){
                        arr.push(mapIdToPermission[el.permissionPackId]);
                    }
                    return arr;
                }, []);
                this.$set(this.selectingNode, 'permissions', permissions);
            }else{
                this.$snotifyError(res, "Can not get permission of role");
            }
        }
    }
}
</script>

<style>
.symper-orgchart-paper .marker-arrowheads, 
.symper-orgchart-paper .link-tools,
.symper-orgchart-paper .marker-vertex-group,
.symper-orgchart-view .symper-orgchart-paper .orgchart-action {
    display: none!important;
}

.symper-orgchart-active-editor .symper-orgchart-paper .orgchart-action {
    display: none;
}

.symper-orgchart-active-editor .symper-orgchart-paper .symper-orgchart-node:hover .orgchart-action {
    display: block!important;
}
</style>
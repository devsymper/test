<template>
    <div class="w-100 h-100">
        <div class="h-100 float-left" style="width:calc(100% - 250px)">
            <div class="process-header-bar py-1" style="height: 40px">
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
                    v-if="$route.name != 'viewProcess'"
                    class="float-right mr-1"
                    @click="saveProcess"
                    small
                    depressed
                    color="primary"
                >
                    <v-icon class="mr-2" primary>mdi-content-save</v-icon>
                    {{$t('process.header_bar.save')}}
                </v-btn>
            </div>
            <symper-bpmn
                @node-clicked="handleNodeSelected"
                @node-changed="handleNodeChangeProps"
                ref="symperBpmn"
                :diagramXML="diagramXML"
                :customExtension="customExtension"
            ></symper-bpmn>
        </div>
        <div class="sym-bpm-attributes h-100" style="width:250px">
            <div class="pb-2 px-2 pt-1">
                <v-text-field
                    v-model="searchAttrKey"
                    class="w-100 sym-small-size"
                    single-line
                    append-icon="mdi-magnify"
                    outlined
                    dense
                    label="Search"
                    :placeholder="$t('common.search')"
                ></v-text-field>
            </div>
            <!-- <div class="list-node-attrs" :style="{height: 'calc(100% - 40px)', overflow: 'auto'}"> -->
            <VuePerfectScrollbar :style="{height: attrPannelHeight}">
                <template>
                    <v-expansion-panels
                        :multiple="true"
                        :hover="true"
                        :accordion="true"
                        :focusable="true"
                        :flat="true"
                        class="sym-small-size"
                    >
                        <v-expansion-panel
                            v-for="(groupData, groupName) in attrGroupView"
                            :key="groupName"
                        >
                            <v-expansion-panel-header>{{groupData.title}}</v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <form-tpl
                                    @input-value-changed="handleAttrValueChanged"
                                    :allInputs="groupData.items"
                                ></form-tpl>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                    </v-expansion-panels>
                </template>
            </VuePerfectScrollbar>
            <!-- </div> -->
        </div>
    </div>
</template>

<script>
import SymperBpmn from "./../../components/common/SymperBpmn.vue";
import { getNodeAttrs, nodeAttrsDefinition } from "./nodeAttrsFactory";
import { allAttrDisplayGroup } from "./allAttrDisplayGroup";
import FormTpl from "./../common/FormTpl.vue";
import { util } from "../../plugins/util";
import bpmnApi from "./../../api/BPMNEngine.js";
import { defaultXML, reformatValueToStr } from "./../../components/process/reformatGetListData";
import { allNodesAttrs } from "./../process/allAttrsOfNodes";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { documentApi } from '../../api/Document';
import customExtension from "./elementDefinitions/customExtension";
import { pushCustomElementsToModel, collectInfoForTaskDescription } from "./elementDefinitions/customExtToModel";
import Api from "./../../api/api.js";
import { appConfigs } from '../../configs';

const apiCaller = new Api('');

// Khung data của từng node cần lưu vào db
console.log(bpmnApi, 'bpmnApibpmnApibpmnApi');

const nodeDataTpl = {
    bounds: {
        lowerRight: {
            x: 1200,
            y: 1050
        },
        upperLeft: {
            x: 0,
            y: 0
        }
    },
    properties: {},
    childShapes: [],
    stencil: {
        id: ""
    }
};

//Do có một số khác biệt giữa tên gọi các node giữa thư viện đang dùng và  Map giữa tên các node của thư viện sang tên các node của flowable
const mapLibNameToFlowableName = {
    EventBasedGateway: "EventGateway",
    StartEvent: "StartNoneEvent",
    ThrowEvent: "ThrowNoneEvent",
    EndEvent: "EndNoneEvent",
    AdHocSubProcess: "AdhocSubProcess",
    Process: "BPMNDiagram",
    Collaboration: "BPMNDiagram",
    Task: "UserTask",
    Participant: "Pool"
};

export default {
    methods: {
        resetAttrPanelHeight(){
            this.attrPannelHeight = (util.getComponentSize(this).h - 50)+'px';
        },
        /**
         * Validate 
         */
        async validateDeployData(){
            let self = this;
            return new Promise((resolve, reject) => {
                // resolve();
                // return;
                let validateData = self.getAllElementData();
                // validateData = JSON.parse();
                bpmnApi.validateModel(JSON.stringify(validateData)).then((validateResult) => {
                    if(validateResult.length == 0){
                        resolve();
                    }else{
                        for(let err of validateResult){
                            self.$snotify({
                                title: "Validate failed",
                                type: 'warn',
                                duration: 120000,
                                text: err.defaultDescription,
                                actionBtns: [
                                    {
                                        text: "Go to element",
                                        icon: "mdi-send-check",
                                        action: (close) => {
                                            let symperBpmn = self.$refs.symperBpmn;
                                            let errEl = symperBpmn.getElData(err.activityId)
                                            symperBpmn.bpmnModeler.get('selection').select(errEl);
                                            self.handleNodeSelected(errEl.businessObject);
                                            close();
                                        }
                                    }
                                ]
                            });
                        }
                        reject({
                            title: "Validate failed wwhen checking for deployment"
                        });
                    }
                }).catch((err) => {
                    self.$snotifyError(err, "Error on validate deploy data!" );
                });
            });
        },
        /**
         * Validate toàn bộ data của model
         * @param {Function} success hành động khi validate và ko phát hiện ra lỗi
         * @param {Function} fail hành động khi có lỗi xảy ra
         */
        validateModel(success, fail) {
            let self = this;
            let checkArr = [
                this.checkModelName(),
                this.validateDeployData()
            ];
            Promise.all(checkArr)
                .then(rsl => {
                    if (typeof success == "function") {
                        success();
                    }
                })
                .catch(err => {
                    console.warn(err, "err on validating model!!");
                    self.$snotify({
                        type: "error",
                        title: err.title,
                        message: err.message ? err.message : ""
                    });

                    if (typeof fail == "function") {
                        fail();
                    }
                });
        },
        /**
         * Kiểm tra định danh của model: đã có hay chưa? có bị trùng định danh ko
         */
        checkModelName() {
            let self = this;
            return new Promise((resolve, reject) => {
                let modelAttr = self.getModelData();
                if (!modelAttr.key) {
                    reject({
                        type: "emptyModelKey",
                        title: "Process identifier shoud not empty!"
                    });
                } else {
                    resolve();
                }
            });
        },
        // Lấy thông tin cấu hình của model
        getModelData() {
            let modelAttr;
            let allNodes = this.stateAllElements;
            for (let id in allNodes) {
                if (allNodes[id].type == "BPMNDiagram") {
                    modelAttr = allNodes[id];
                    break;
                }
            }

            // update thuộc tính của panel setting cho phần hiển thị
            let vizBizEl = this.$refs.symperBpmn.updateElementProperties(modelAttr.id, {
                isExecutable: modelAttr.attrs.isexecutable.value
            });
            modelAttr = modelAttr.attrs;
            if (!modelAttr.name.value) {
                modelAttr.name.value = modelAttr.process_id.value;
            }
            return {
                name: modelAttr.name.value,
                key: modelAttr.process_id.value,
                description: modelAttr.documentation.value,
                modelType: 0
            };
        },
        /**
         * Thêm data trong state cho các node chưa có state
         * do không bắt được sự kiện khi tạo mới một element của thư viện nên khi click vào một node thì mới tạo data cho node đó trong state
         *
         */
        fillNodeData() {
            let allBNodes = this.$refs.symperBpmn.getAllNodes();
            let nodeType = "";
            let allBNodesMap = {};
            let allNodes = this.stateAllElements;
            // Dựng thuộc tính cho từng node
            for (let bnode of allBNodes) {
                // bnode là viết tắt của businessObject node data
                allBNodesMap[bnode.id] = bnode;
                nodeType = this.getNodeType(bnode);
                if (!allNodes[bnode.id]) {
                    this.createNodeData(bnode.id, nodeType);
                }
                let nodeData = allNodes[bnode.id];
                if (!nodeData.attrs.name.value && nodeType == "UserTask") {
                    // Nếu user task chưa có name thì tự động thêm name vào cho node đó
                    if (nodeData.attrs.overrideid) {
                        nodeData.attrs.name.value =
                            nodeData.attrs.overrideid.value;
                    } else if (nodeData.attrs.process_id) {
                        nodeData.attrs.name.value =
                            nodeData.attrs.process_id.value;
                    }
                }
            }

            // Loại bỏ data của các node mà ko có trong diagram
            for(let id in allNodes){
                if(!allBNodesMap[id]){
                    this.$delete(allNodes, id);
                }
            }
        },
        getModelDataForSymperService(){
            let allVizEls = this.$refs.symperBpmn.getAllNodes(false);
            let allSymEls = this.stateAllElements;
            let bpmnModeler = this.$refs.symperBpmn.bpmnModeler;
            collectInfoForTaskDescription(allVizEls, allSymEls,  bpmnModeler);
            pushCustomElementsToModel(allVizEls, allSymEls,  bpmnModeler);
            for(let el of allVizEls){
                if(el.businessObject.$type == 'bpmn:Task'){
                    this.$refs.symperBpmn.changeTaskNodeToUserTaskNode(el.id);
                }
            }
            let xml = this.$refs.symperBpmn.getXML();
            console.log(xml,'xmlxmlxmlxmlxmlxmlxml');
            let jsonConfig = {};
            for(let elName in allSymEls){
                jsonConfig[elName] = {};
                for(let attrName in allSymEls[elName].attrs){
                    let attr = allSymEls[elName].attrs[attrName];
                    jsonConfig[elName][attrName] = attr.getValue(attr.value);
                }
            }
            let modelDataAsFlowable = this.getModelData();
            return {
                name: modelDataAsFlowable.name,
                content: xml,
                description: modelDataAsFlowable.description,
                version: 1,
                configValue: JSON.stringify(jsonConfig)
            };
        },
        /**
         * Lưu lại các thuộc tính được set qua việc tương tác trực tiếp với các thành phần trong diagram vào trong store
         * Do khi tương tác qua diagram thì có một số thuộc tính chạy theo không được update lại nên cần bước này để khớp được data hiển thị và data bên dưới
         */
        updateViewDataToState(){
            for(let elName in this.stateAllElements){
                let el = this.stateAllElements[elName];
                if(el.type.includes('Gateway')){
                    this.setFlowsOrderForGateway(el);
                }
            }
        },
        // Lưu lại data của process model hiện tại
        saveProcess() {
            if(this.$route.name == 'viewProcess'){
                return;
            }
            let self = this;
            this.fillNodeData();
            this.updateViewDataToState();
            this.validateModel(() => {
                let action = self.modelAction;
                let idModel = self.modelId;
                if (action == "create" || action == "clone") {
                    // let modelData = this.getModelData(); // data này giành cho backend của flowable
                    let modelData = this.getModelDataForSymperService();
                    bpmnApi
                        .createModel(modelData)
                        .then(res => {
                            if(res.status == 200){
                                self.modelAction = 'edit';
                                self.modelId = res.data.id;
                                self.$snotifySuccess('Create process successfully');
                            }else {
                                self.$snotifyError(res, res.message);
                            }
                        })
                        .catch(err => {
                            self.$snotifyError(
                                err,
                                "Can not create new process model"
                            );
                        });
                } else {
                    self.updateModelToSymperService(idModel);
                }
            });
        },
        async updateModelToSymperService(){
            let modelData = this.getModelDataForSymperService();
            try {
                let res = await bpmnApi.updateModel(modelData, this.modelId);
                if(res.status == 200){
                    this.$snotifySuccess("Update model sucessfully");
                }else{
                    this.$snotifyError(res, "Can not update process model!");            
                }
            } catch (error) {
                this.$snotifyError(error, "Can not update process model!");            
            }
        },
        // update data của model và data của tất cả các element trong model lên server (backend flowable)
        updateModel(idModel) {
            let allEleData = this.getAllElementData();
            console.log(
                allEleData,
                "allEleData",
                this.stateAllElements
            );
            let self = this;
            allEleData.modelId = idModel;
            let diData = {
                modeltype: "model",
                json_xml: JSON.stringify(allEleData),
                name: allEleData.properties.name,
                key: allEleData.properties.process_id,
                description: allEleData.properties.documentation,
                newversion: false,
                comment: "",
                // lastUpdated: new Date().toISOString().replace("Z", "+0000")
                lastUpdated: self.lastUpdated
                    ? self.lastUpdated
                    : new Date().toISOString().replace("Z", "+0000") // chỗ này đang lách qua việc validate của backend. cần xem lại
            };
            bpmnApi
                .updateModel(diData, idModel)
                .then(res => {
                    self.$snotifySuccess("Process model saved");
                    self.lastUpdated = res.lastUpdated;
                })
                .catch(err => {
                    self.$snotifyError(err, "Can not save process model");
                });
        },
        /**
         * Lấy dữ liệu của tất cả các node dưới dạng json để gửi về server lưu
         * @returns {Object} chứa data của process và thông tin của tất cả các node trong nó
         */
        getAllElementData() {
            /**
             * Một số quy tắc lưu của flowable:
             * 1. Tất cả các mũi tên (sequence flow) đều thuộc childShapes của BPMNDiagram chứ ko thuộc về thằng cha của mũi tên đó
             */
            let allBNodes = this.$refs.symperBpmn.getAllNodes();

            let di; // object chứa thông tin của diagram
            let nodeType = "";
            let mapSaveNodes = {};

            // Dựng thuộc tính cho từng node
            for (let bnode of allBNodes) {
                // bnode là viết tắt của businessObject node data
                nodeType = this.getNodeType(bnode);
                let nodeData;
                if (nodeType == "BPMNDiagram") {
                    nodeData = util.cloneDeep(nodeDataTpl);
                    di = nodeData;
                    di.stencilset = {
                        namespace: "https://symper.org/stencilset/bpmn2.0#",
                        url: "../editor/stencilsets/bpmn2.0/bpmn2.0.json"
                    };
                } else {
                    if (nodeType == "SequenceFlow") {
                        nodeData = this.getSaveDataForSequenceFlow(bnode);
                    } else {
                        nodeData = util.cloneDeep(nodeDataTpl);
                        nodeData.bounds = this.getNodeBounds(bnode);
                        nodeData.dockers = [];
                        nodeData.outgoing = [];
                    }
                    nodeData.resourceId = bnode.id;
                }
                nodeData.properties = this.getNodeProperties(bnode.id, false);
                nodeData.stencil.id = nodeType; // flowable quy định loại node nằm trong nodeData.stencil.id
                mapSaveNodes[bnode.id] = nodeData;
            }

            // tạo outgoing cho các node là  gốc của mũi tên
            for (let bnode of allBNodes) {
                if (bnode.sourceRef) {
                    let nodeData = mapSaveNodes[bnode.sourceRef.id];
                    if (!nodeData.outgoing) {
                        nodeData.outgoing = [];
                    }
                    nodeData.outgoing.push({ resourceId: bnode.id });
                }
            }
            this.translateToTreeData(di, allBNodes, mapSaveNodes);
            return di;
        },
        translateToTreeData(di, allBNodes, mapSaveNodes){
            let bnodeRoot = {};
            for(let bnode of allBNodes){
                let nodeType = this.getNodeType(bnode);
                if (nodeType == "BPMNDiagram") {
                    bnodeRoot = bnode;
                }else if(nodeType == "SequenceFlow"){
                    if(!mapSaveNodes[bnode.id]){
                        // debugger;
                    }
                    di.childShapes.push(mapSaveNodes[bnode.id]); // theo quy tắc 1 của flowable về lưu SequenceFlow
                }
            }

            if(bnodeRoot.$type == 'bpmn:Collaboration'){
                for(let pool of bnodeRoot.participants){
                    let poolToSave = mapSaveNodes[pool.id];
                    if(!poolToSave){
                        // debugger;
                    }
                    di.childShapes.push(poolToSave);
                    poolToSave.properties.process_id = poolToSave.properties.process_id ? poolToSave.properties.process_id : poolToSave.properties.overrideid;
                    if(pool.processRef.laneSets){
                        // thêm các con cho các lane
                        for(let lane of pool.processRef.laneSets[0].lanes){
                            if(!mapSaveNodes[lane.id]){
                                // debugger;
                            }
                            poolToSave.childShapes.push(mapSaveNodes[lane.id]);
                            this.addChildrenForProcess(mapSaveNodes[lane.id], lane.flowNodeRef, mapSaveNodes);
                        }
                    }else{
                        //tự Tạo một đối tượng lane mới do thư viện ko tạo trước
                        let newId = "symper_auto_lane_"+Date.now();
                        let laneState = this.createNodeData(newId, 'Lane');
                        let laneToSave = util.cloneDeep(nodeDataTpl);
                        laneToSave.stencil.id = "Lane";
                        laneToSave.resourceId = newId;
                        laneToSave.dockers = [];
                        laneToSave.outgoing = [];
                        laneToSave.properties = this.getNodeProperties(laneState);
                        laneToSave.bounds = this.getNodeBounds(pool);
                        laneToSave.bounds.upperLeft.x += 30;
                        mapSaveNodes[pool.id].childShapes.push(laneToSave);
                        this.addChildrenForProcess(laneToSave, pool.processRef.flowElements, mapSaveNodes);
                    }
                }
            }else if(bnodeRoot.$type == 'bpmn:Process'){
                this.addChildrenForProcess(di, bnodeRoot.flowElements, mapSaveNodes);
            }
        },
        addChildrenForProcess(di, bEls, mapSaveNodes){
            for(let bel of bEls){
                if(bel.$type != 'bpmn:SequenceFlow' && mapSaveNodes[bel.id]){
                    di.childShapes.push(mapSaveNodes[bel.id]);
                    if(bel.$type == 'bpmn:SubProcess'){
                        this.addChildrenForProcess(mapSaveNodes[bel.id], bel.flowElements, mapSaveNodes);
                    }
                }
            }
        },
        getDefaultDocker(bnode) {
            let allNodes = this.stateAllElements;
            let startNode = allNodes[bnode.sourceRef.id];
            let endNode = allNodes[bnode.targetRef.id];

            return [
                nodeAttrsDefinition[startNode.type].docker,
                nodeAttrsDefinition[endNode.type].docker
            ];
        },
        // Lấy các dữ liệu của sequence flow
        getSaveDataForSequenceFlow(bnode) {
            let nodeData = util.cloneDeep(nodeDataTpl);
            let defaultDockers = this.getDefaultDocker(bnode);
            nodeData.stencil.id = "SequenceFlow";
            nodeData.resourceId = bnode.id;

            nodeData.outgoing = [
                {
                    resourceId: bnode.targetRef.id
                }
            ];
            nodeData.target = {
                resourceId: bnode.targetRef.id
            };
            nodeData.properties = this.getNodeProperties(bnode.id);
            nodeData.bounds = this.getNodeBounds(bnode);

            nodeData.dockers = defaultDockers;
            if (bnode.di.waypoint.length > 2) {
                let dockers = bnode.di.waypoint.filter((ele, idx, arr) => {
                    return idx > 0 && idx < arr.length - 1;
                });
                dockers.unshift(defaultDockers[0]);
                dockers.push(defaultDockers[1]);
                nodeData.dockers = dockers;
            }
            return nodeData;
        },
        getNodeBounds(bnode) {
            let wp = bnode.di.waypoint;

            if (!wp) {
                let bounds = bnode.di.bounds;
                wp = [
                    {
                        x: bounds.x + bounds.width,
                        y: bounds.y + bounds.height
                    },
                    {
                        x: bounds.x,
                        y: bounds.y
                    }
                ];
            }

            return {
                lowerRight: {
                    x: wp[0].x,
                    y: wp[0].y
                },
                upperLeft: {
                    x: wp[1].x,
                    y: wp[1].y
                }
            };
        },
        getNodeProperties(nodeInfo, includeSymperAttr = false) {
            let props = {};
            let sNodeAttrs = {};
            if(typeof nodeInfo == 'string'){
                sNodeAttrs = this.stateAllElements[nodeInfo];
            }else if(typeof nodeInfo == 'object' && nodeInfo.attrs){
                sNodeAttrs = nodeInfo
            }else {
                console.error("node info not match type Object or String", nodeInfo)
            }

            for (let key in sNodeAttrs.attrs) {
                if(!includeSymperAttr){
                    if(allNodesAttrs[key].isSymperProp){
                        continue;
                    }
                }
                let attr = sNodeAttrs.attrs[key];
                if (attr) {
                    if (allNodesAttrs[key]) {
                        if (allNodesAttrs[key].hasOwnProperty("getValue")) {
                            props[key] = allNodesAttrs[key].getValue(
                                attr.value
                            );
                            if(allNodesAttrs[key].needReformatValue){
                               props[key] = reformatValueToStr(attr.value);
                            }
                        } else {
                            props[key] = attr.value ? attr.value : '';
                        }
                    } else {
                        console.warn(
                            key + " not found in allNodesAttrs",
                            key,
                            allNodesAttrs
                        );
                    }
                } else {
                    console.warn(
                        key + " not found in attrs",
                        key,
                        sNodeAttrs.attrs
                    );
                }
            }
            return props;
        },
        /**
         * Khôi phục lại dữ liệu được lưu ở server thành dữ liệu có thể sử dụng trong state để thao tác
         * @param {Object} processData data của process và thông tin của tất cả các node trong nó mà đã được lưu ở server
         */
        restoreSavedData(processData) {},
        /**
         *  Lấy ra tên của node dựa vào dữ liệu của node đó trong  bpmn modeller
         * @param {Object} nodeData data của node trong thư viện bpmn-js
         * @returns {String} tên của node sau khi đã tính toán
         */
        getNodeType(nodeData) {
            let nodeType = nodeData.$type
                .replace("bpmn:", "")
                .replace("Intermediate", "");
            if (nodeType.includes("Event") && nodeData.eventDefinitions) {
                let evtType = nodeData.eventDefinitions[0].$type.replace(
                    "bpmn:",
                    ""
                );
                evtType = evtType.replace("Definition", "");
                nodeType = nodeType.replace("Event", "");
                nodeType = nodeType + evtType;
            } else if (
                nodeType == "bpmn:SubProcess" &&
                nodeData.triggeredByEvent
            ) {
                nodeType = "EventSubProcess";
            }

            nodeType = mapLibNameToFlowableName[nodeType]
                ? mapLibNameToFlowableName[nodeType]
                : nodeType;
            return nodeType;
        },
        handleNodeChangeProps(nodeData) {
            let nodeId = nodeData.id;
            let nodeState = this.stateAllElements[nodeId];
            let newType = this.getNodeType(nodeData);
            console.log(newType, nodeData);

            if (nodeState) {
                if (newType != nodeState.type) {
                    this.changeNodeType(nodeState, newType);
                }
                nodeState.name = nodeData.name;
                nodeState.attrs.name.value = nodeData.name;

                if (nodeId == this.selectingNode.id) {
                    this.$store.commit(
                        "process/changeSelectingNode",
                        {
                            instanceKey: this.instanceKey,
                            data: nodeState
                        }
                    );
                }
            }
        },

        /**
         * Thay đổi loại node
         * @param {Object} nodeState Object chứa state của node cần thay đổi (data của node cũ)
         * @param {String} newType Loại node mới cần đổi
         */
        changeNodeType(nodeState, newType) {
            let newNodeData = this.createNodeData(nodeState.id, newType);
            for (let attrName in newNodeData.attrs) {
                if (nodeState.attrs[attrName]) {
                    newNodeData.attrs[attrName].value =
                        nodeState.attrs[attrName].value;
                }
            }
            this.$store.commit("process/addNewNode",{
                            instanceKey: this.instanceKey,
                            data: newNodeData
                        } );
        },
        /** Xử lý các sự kiện khi có sự thay đổi giá trị của các input trong panel cấu hình bên phải
         * data là giá trị sau thay đổi của một input trong formtpl
         *  **/
        handleAttrValueChanged(name, inputInfo, data) {
            let type = this.selectingNode.type;
            let typeData = nodeAttrsDefinition[type];
            let attrs = this.selectingNode.attrs;
            let reApplyToView = {
                name: "name",
                process_id: "id",
                overrideid: "id"
            };

            if (name == "overrideid" || name == "process_id") {
                attrs[name].value = util.str.nonAccentVietnamese(
                    attrs[name].value
                );
            }

            if (typeData.checkShowOrHideInput) {
                typeData.checkShowOrHideInput(attrs);
            }

            if (typeData.validate) {
                typeData.validate(attrs);
            }

            if (typeData.specificHandler) {
                typeData.specificHandler(attrs, data, name);
            }

            if (reApplyToView[name]) {
                let applyValue = {};
                applyValue[reApplyToView[name]] = inputInfo.value;
                this.$refs.symperBpmn.updateElementProperties(
                    this.selectingNode.id,
                    applyValue
                );
            }

            
            if (name == "overrideid" || name == "process_id") {
                let oldId = this.selectingNode.id;
                let newId = attrs[name].value;
                this.selectingNode.id = newId; // đặt lại id cho thông tin của node
                // Thay key của node cũ trong state bằng id của node mới
                this.$delete(this.stateAllElements, oldId);
                this.$set(this.stateAllElements, newId, this.selectingNode);
            }

            // Nếu set formreference cho StartNoneEvent thì đặt các lựa chọn control để làm business key
            if(this.selectingNode.type == 'StartNoneEvent' && name == 'formreference'){
                this.setControlsForBizKey(inputInfo.value);
            }
        },
        async setControlsForBizKey(docId){
            try {
                if(!docId){
                    return
                }
                let docDetail = await documentApi.detailDocument(docId);
                let controls = Object.values(docDetail.data.fields).reduce((arr, el, idx)=>{
                    arr.push({
                        id: el.properties.name,
                        title: el.properties.title
                    });
                    return arr;
                }, []);
                this.controlsForBizKey = controls;
            } catch (error) {
                this.$snotifyError(error, "Cannot get detail data of document id "+ docId);
            } 
        },
        /**
         * Lấy dữ liệu của một node dựa theo nodeId.
         * Nếu không tìm thấy nodeId này trong state thì tạo các thuộc tính dựa theo loại node (nodeType)
         */
        getNodeData(nodeId, nodeType) {
            let nodeData = this.stateAllElements[nodeId];
            if (!nodeData) {
                nodeData = this.createNodeData(nodeId, nodeType);
            }
            return nodeData;
        },

        /**
         * Tạo data cho một node và lưu vào state
         * @param {String} nodeId id của node cần lưu
         * @param {String} nodeType Loại node: user task, ...
         * @param {String} marker marker cho node
         */
        createNodeData(nodeId, nodeType, marker = "") {
            let nodeData = {
                id: nodeId,
                marker: marker,
                type: nodeType,
                attrs: getNodeAttrs(nodeType)
            };

            if (nodeData.attrs.overrideid) {
                nodeData.attrs.overrideid.value = nodeId;
            }

            this.$store.commit("process/addNewNode", {
                instanceKey: this.instanceKey,
                data: nodeData
            });
            return nodeData;
        },
        /**
         * Xử lý sự kiện khi người dùng click vào một node
         */
        handleNodeSelected(node) {
            let type = this.getNodeType(node);
            let wp = node.di.waypoint;
            console.log(type, node);

            let nodeData = this.getNodeData(node.id, type);
            nodeData.name = node.name;
            nodeData.attrs.name.value = node.name; // gán lại name từ di node
            if (nodeData.attrs.process_id) { // gán lại id từ di node
                nodeData.attrs.process_id.value = node.id;
            }

            if (nodeData.attrs.overrideid) { // gán lại id từ di node
                nodeData.attrs.overrideid.value = node.id;
            }
            this.$store.commit("process/changeSelectingNode", {
                instanceKey: this.instanceKey,
                data: nodeData
            });

            if(nodeData.type == 'UserTask'){
                this.setTaskActionableNodes(nodeData, 'approvalForElement');
                this.setTaskActionableNodes(nodeData, 'updateForElement');
            }else if(nodeData.type == 'BPMNDiagram'){
                nodeData.attrs.controlsForBizKey.options = this.controlsForBizKey;
            }else if(nodeData.type.includes('Gateway')){
                this.setFlowsOrderForGateway(nodeData);
            }
        },
        setFlowsOrderForGateway(nodeData){
            let outFlows = [];
            let bizNodeData = this.$refs.symperBpmn.getElData(nodeData.id).businessObject;
            let diOutFlowsMap = {};
            let needUpdate = false;
            let dataFlows = nodeData.attrs.sequencefloworder.value;
            for(let flow of bizNodeData.outgoing){
                let newItem = {
                    text: flow.name ? flow.name : flow.id,
                    idFlow: flow.id
                };
                outFlows.push(newItem);
                diOutFlowsMap[flow.id] = newItem;
            }

            // Nếu độ dài trước và sau khác nhau thì chắc chắn cần update
            if(dataFlows.length != outFlows.length){
                needUpdate = true;
            }else{
                // Nếu độ dài khác nhau, xét xem các id có trùng hết ko, nếu ko trùng hết thì cần update lại
                for(let flow of dataFlows){
                    if(!diOutFlowsMap[flow.idFlow]){
                        needUpdate = true;
                        break;
                    }
                }
            }

            // Nếu ko cần update thì sửa lại text hiển thị của các flow
            if(!needUpdate){
                 for(let flow of dataFlows){
                    flow.text = diOutFlowsMap[flow.idFlow].text;
                }
            }

            if(needUpdate){
                nodeData.attrs.sequencefloworder.value = outFlows;
            }
        },
        /**
         * Tìm các node ở trước node hiện tại để có thể duyệt, phục vụ cho việc select node cần duyệt: approvalForElement
         */
        setTaskActionableNodes(nodeData, attrName = 'approvalForElement'){
            let allEls = this.$refs.symperBpmn.getAllNodes();
            let currBizNode = {};
            let submitTasks = [];

            allEls.filter((el, idx) => {
                if(el.$type == 'bpmn:SequenceFlow'){
                    return true;
                }else{
                    el.symper_link_next = {}; // danh sách các id các node tiếp theo mà node này được linh tới
                    el.symper_link_prev = {}; // danh sách các id các node link tới node này
                    if(el.id == nodeData.id){
                        currBizNode = el;
                    }
                    return false;
                }
            }).forEach(el => {
                el.sourceRef.symper_link_next[el.targetRef.id] = true;
                el.targetRef.symper_link_prev[el.sourceRef.id] = true;
            });
            let searchedNodeMap = {};
            let nodeToFind = 
            this.findSubmitTasksFromNode(submitTasks, currBizNode, searchedNodeMap);
            nodeData.attrs[attrName].options = submitTasks;
            if(submitTasks.length == 0){ // nếu ko có node nào là ứng cử viên thì đặt giá trị về rỗng
                nodeData.attrs[attrName].value = '';
            }else if(!nodeData.attrs[attrName].value ){ // Tự động chọn phần tử đầu tiên làm giá trị
                nodeData.attrs[attrName].value = submitTasks[0].id;
            }
        },
        // Tìm từ node hiện tại về node đầu để ra các node là submit task 
        findSubmitTasksFromNode(result, currBizNode, searchedNodeMap){
            let nodeData = this.stateAllElements[currBizNode.id];
            console.log(currBizNode.id, result, searchedNodeMap);
            
            if(searchedNodeMap[currBizNode.id] || !nodeData){
                return;
            }
            // Nếu là UserTask và là submit hoặc là node bắt đầu quy trình và có form submit
            if(nodeData && (nodeData.type == 'UserTask' && nodeData.attrs.taskAction.value == 'submit') ||
                (nodeData.type == 'StartNoneEvent' && nodeData.attrs.formreference.value)){
                    result.push({
                        id: nodeData.id,
                        title: currBizNode.name
                    });
                    searchedNodeMap[nodeData.id] = true;
            }else{
                searchedNodeMap[nodeData.id] = true;
            }
            for(let id in currBizNode.symper_link_prev){
                let prevNode = this.$refs.symperBpmn.getElData(id);
                this.findSubmitTasksFromNode(result, prevNode.businessObject, searchedNodeMap);                
                searchedNodeMap[id] = true;
            }
        },
        /**
         * Xử lý các hành động khi người dùng click vào các nút ở header của editor (zoom, focus, validate ... )
         *
         */
        handleHeaderAction(ac) {
            if (ac == "validate") {
                let self = this;
                this.fillNodeData();
                this.validateModel(() => {
                    self.$snotifySuccess("Validation passed");
                });
            } else {
                this.$refs.symperBpmn[ac]();
            }
        },
        cleanXMLBeforeRender(xml){
            xml = xml.replace(/<symper:(.*?)<\/symper:(.*?)>/g,''); // Loại bỏ toàn bộ các thẻ của symper
            return xml;
        },
        /**
         * Lấy data từ server và áp dụng data này để hiển thị lên process
         */
        async applySavedData(idProcess) {
            try {
                let modelData = await bpmnApi.getModelData(idProcess);
                modelData = modelData.data;
                let xml = this.cleanXMLBeforeRender(modelData.content);
                console.log(xml);
                let afterRender = await this.$refs.symperBpmn.renderFromXML(xml);
                if(modelData.configValue){
                    this.restoreAttrValueFromJsonConfig(modelData.configValue);
                }
            } catch (error) {
                this.$snotifyError(
                    error,
                    this.$t("process.editror.err.get_xml")
                );
            }
        },
        restoreAttrValueFromJsonConfig(jsonStr){
            let configValue = JSON.parse(jsonStr);
            this.fillNodeData();
            let gatewayEls = [];
            let formKeyToNodeIdMap = {};
            for(let elName in this.stateAllElements){
                let el = this.stateAllElements[elName];
                if(configValue[elName]){
                    for(let attrName in el.attrs){
                        if(configValue[elName].hasOwnProperty(attrName)){
                            if (allNodesAttrs[attrName].hasOwnProperty("restoreData")) {
                                el.attrs[attrName].value = allNodesAttrs[attrName].restoreData(configValue[elName][attrName]);
                            } else {
                                el.attrs[attrName].value = configValue[elName][attrName];
                            }
                        }else{
                        }
                    }
                }else{
                }

                if(el.type.includes('Gateway')){
                    this.setFlowsOrderForGateway(el);
                }

                if (nodeAttrsDefinition[el.type].checkShowOrHideInput) {
                    nodeAttrsDefinition[el.type].checkShowOrHideInput(el.attrs);
                }


                if(el.attrs.formreference && el.attrs.formreference.value){
                    let formKey = el.attrs.formreference.value;
                    if(!formKeyToNodeIdMap[formKey]){
                        formKeyToNodeIdMap[formKey] = [];
                    }
                    formKeyToNodeIdMap[formKey].push(elName);
                }
            }
            this.setInitItemsForFormReferences(formKeyToNodeIdMap);
        },
        async setInitItemsForFormReferences(map){
            let self = this;
            try {
                for(let docId in map){
                    let res = await apiCaller.get(appConfigs.apiDomain.documents + '?search=' + docId);  
                    for(let nodeId of map[docId]){
                        this.stateAllElements[nodeId].attrs.formreference.options = res.data.listObject;
                    }              
                }
            } catch (err) {
                self.$snotifyError(err, "Can not set initial items for form references");
            }
        },
        /**
         * Khôi phục lại data của model từ server vào trong state
         * @param {Object} ele data của phần tử được lưu ở server
         */
        restoreSavedEle(ele, rsl) {
            let idEle = ele.resourceId;
            if (ele.modelId) {
                // Nếu đây là phần tử root của cây
                idEle = ele.properties.process_id;
            }
            let eleType = ele.stencil ? ele.stencil.id : "BPMNDiagram";
            let nodeData = this.createNodeData(idEle, eleType);

            // Khôi phục giá trị cho các thuộc tính của ele này
            if (ele.properties) {
                for (let key in nodeData.attrs) {
                    if (ele.properties.hasOwnProperty(key)) {
                        if (allNodesAttrs[key].hasOwnProperty("restoreData")) {
                            nodeData.attrs[key].value = allNodesAttrs[
                                key
                            ].restoreData(ele.properties[key]);
                        } else {
                            nodeData.attrs[key].value = ele.properties[key];
                        }
                    } else {
                        console.warn(
                            "Not found " +
                                key +
                                " in attrs of saved data ele.properties",
                            ele,
                            key
                        );
                    }
                }
                nodeAttrsDefinition[eleType].checkShowOrHideInput(
                    nodeData.attrs
                );
            }

            rsl[idEle] = nodeData;
            // Khôi phục các thuộc tính cho các ele con của ele này
            if (ele.hasOwnProperty("childShapes")) {
                for (let childEle of ele.childShapes) {
                    this.restoreSavedEle(childEle, rsl);
                }
            }
        }
    },

    created() {
        this.instanceKey = Date.now();
        this.$store.commit(
            "process/initInstance",
            this.instanceKey
        );
        this.$store.dispatch("app/getAllOrgChartData");
        this.$store.dispatch("app/getAllUsers");
        
        if (this.$route.name == "editProcess") {
            this.modelAction = "edit";
            this.modelId = this.$route.params.id;
        } else if (this.$route.name == "cloneProcess") {
            this.modelAction = "clone";
        }

        if (
            this.$route.name == "editProcess" ||
            this.$route.name == "cloneProcess" ||
            this.$route.name == "viewProcess"
        ) {
            this.applySavedData(this.$route.params.id);
        }


    },
    mounted(){
        this.resetAttrPanelHeight();
    },
    data() {
        return {
            instanceKey: null, // key của instance hiện tại
            attrPannelHeight: "300px", // chiều cao của panel cấu hình các element
            modelAction: "create", // hành động đối với model này là gì: create | clone | edit
            modelId: "", // Id của model này trong DB
            searchAttrKey: "",
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
                saveXML: {
                    icon: "mdi-xml",
                    text: "process.header_bar.save_bpmn"
                },
                validate: {
                    icon: "mdi-check-bold",
                    text: "process.header_bar.validate"
                }
            },
            diagramXML: defaultXML.replace(/\n/g, ""),
            customExtension: [
                {
                    name: 'symper',
                    data: customExtension
                }
            ]
        };
    },
    components: {
        "symper-bpmn": SymperBpmn,
        "form-tpl": FormTpl,
        VuePerfectScrollbar
    },
    props: {
        // Hành động cho editor này, nhận một trong các giá trị: create, edit, view, clone
        action: {
            type: String,
            default: "create"
        }
    },
    computed: {
        selectingNode() {
            return this.$store.state.process.editor[this.instanceKey].selectingNode;
        },
        stateAllElements() {
            return this.$store.state.process.editor[this.instanceKey].allNodes;
        },
        /** Chuyển dạng danh sách attr từ dạng phẳng sang dạng nhóm thành các group để hiển thị **/
        attrGroupView() {
            let currentAtts = this.selectingNode.attrs;
            let groups = {};

            for (let attrName in currentAtts) {
                
                let attr = currentAtts[attrName];
                if(attr.hidden){
                    continue;
                }
                if (!attr) {
                    console.warn(
                        `can not get attr of "${attrName}" in currentAtts`,
                        { currentAtts, attrName }
                    );
                    continue;
                }

                let groupName = attr.dg;
                if (!groups[groupName]) {
                    if (allAttrDisplayGroup[groupName]) {
                        groups[groupName] = {
                            title: allAttrDisplayGroup[groupName].title,
                            items: {}
                        };
                    } else {
                        console.warn(
                            'không tìm thấy định nghĩa của group "' +
                                groupName +
                                '" trong allAttrDisplayGroup',
                            currentAtts,
                            attrName
                        );
                    }
                }
                groups[groupName].items[attrName] = currentAtts[attrName];
            }
            return groups;
        },

    }
};
</script>

<style>
.process-header-bar {
    border-bottom: 1px solid #e6e5e5;
    padding-left: 10px;
}

.sym-bpm-attributes {
    border-left: 1px solid #e6e5e5;
    display: inline-block;
}
</style>
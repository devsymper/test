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

                <v-btn class="float-right mr-1" @click="saveProcess" small depressed color="primary">
                    <v-icon class="mr-2" primary>mdi-content-save</v-icon>
                    {{$t('process.header_bar.save')}}
                </v-btn>
            </div>
            <symper-bpmn
                @node-clicked="handleNodeSelected"
                @node-changed="handleNodeChangeProps"
                ref="symperBpmn"
                :diagramXML="diagramXML"
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
            <div class="list-node-attrs">
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
            </div>
        </div>
    </div>
</template>

<script>
import SymperBpmn from "./../../components/common/SymperBpmn.vue";
import { getNodeAttrs, nodeAttrsDefinition } from "./nodeAttrsFactory";
import { allAttrDisplayGroup } from "./allAttrDisplayGroup";
import FormTpl from "./../common/FormTpl.vue";
import { util } from '../../plugins/util';
import bpmnApi from "./../../api/BPMNEngine.js";
import { defaultXML } from "./../../components/process/reformatGetListData";
import { allNodesAttrs } from "./../process/allAttrsOfNodes";

// Khung data của từng node cần lưu vào db
const nodeDataTpl = {
    resourceId:"",
    bounds:{
        lowerRight:{
            x:1200,
            y:1050
        },
        upperLeft:{
            x:0,
            y:0
        }
    },
    properties:{},
    childShapes:[],
    stencil:{
        id:""
    },
    dockers:[]
};

//Do có một số khác biệt giữa tên gọi các node giữa thư viện đang dùng và  Map giữa tên các node của thư viện sang tên các node của flowable
const mapLibNameToFlowableName = {
    EventBasedGateway: 'EventGateway',
    StartEvent: 'StartNoneEvent',
    ThrowEvent: 'ThrowNoneEvent',
    EndEvent: 'EndNoneEvent',
    AdHocSubProcess: 'AdhocSubProcess',
    Process: 'BPMNDiagram',
    Collaboration: 'BPMNDiagram'
};

export default {
    methods: {
        /**
         * Validate toàn bộ data của model
         * @param {Function} success hành động khi validate và ko phát hiện ra lỗi
         * @param {Function} fail hành động khi có lỗi xảy ra
         */
        validateModel(success, fail){
            let self = this;
            let checkArr = [
                this.checkModelName(),
            ];
            Promise.all(checkArr).then(rsl => {
                if(typeof success == 'function'){
                    success();
                }
            }).catch(err => {
                console.warn(err, 'err on validating model!!');
                self.$snotify({
                    type: "error",
                    title: err.title,
                    message: err.message ? err.message : '',
                });

                if(typeof fail == 'function'){
                    fail();
                }
            });
        },
        /**
         * Kiểm tra định danh của model: đã có hay chưa? có bị trùng định danh ko
         */
        checkModelName(){
            let self = this;
            return new Promise((resolve, reject) => {
                let modelAttr = self.getModelData();
                if(!modelAttr.key){
                    reject({
                        type: 'emptyModelKey',
                        title: 'Process identifier shoud not empty!'
                    });
                }else{
                    resolve();
                }
            });
        },
        // Lấy thông tin cấu hình của model
        getModelData(){
            let modelAttr;
            let allNodes = this.$store.state.process.allNodes;
            for(let id in allNodes){
                if(allNodes[id].type == 'BPMNDiagram'){
                    modelAttr = allNodes[id]; 
                    break;
                }
            }
            modelAttr = modelAttr.attrs;
            if(!modelAttr.name.value){
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
        fillNodeData(){
            let allBNodes = this.$refs.symperBpmn.getAllNodes();
            let nodeType = '';
            // Dựng thuộc tính cho từng node
            for(let bnode of allBNodes){ // bnode là viết tắt của businessObject node data
                nodeType = this.getNodeType(bnode);
                if(!this.$store.state.process.allNodes[bnode.id]){
                    this.createNodeData(bnode.id, nodeType);
                }
            }
        },
        // Lưu lại data của process model hiện tại
        saveProcess(){
            let self = this;
            this.fillNodeData();
            this.validateModel(()=>{
                let action = self.modelAction;
                let idModel = self.modelId;
                if(action == 'create' || action == 'clone'){
                    let modelData = this.getModelData();
                    bpmnApi.createModel(modelData)
                    .then((res)=> {
                        if(res.messageKey && res.messageKey.includes( 'GENERAL.ERROR')){
                            self.$snotify({
                                type: "error",
                                title: res.message
                            });
                        }else {
                            self.modelAction = 'edit',
                            self.modelId = res.id,
                            self.updateModel(res.id);
                        }
                    })
                    .catch((err) => {
                        self.$snotify({
                            type: "error",
                            title: 'Can not create new process model'
                        });
                    });
                }else{
                    self.updateModel(idModel);
                }
            });
        },

        // update data của model và data của tất cả các element trong model lên server
        updateModel(idModel){
            let allEleData = this.getAllElementData();
            console.log(allEleData,'allEleData', this.$store.state.process.allNodes);
            
            allEleData.modelId = idModel;
            let diData = {
                modeltype: 'model',
                json_xml: JSON.stringify(allEleData),
                name: allEleData.properties.name,
                key: allEleData.properties.process_id,
                description: allEleData.properties.documentation,
                newversion: true,
                comment: '',
                lastUpdated:  (new Date()).toISOString().replace('Z','+0000')
            };
            bpmnApi.updateModel(diData, idModel);
        },
        /**
         * Lấy dữ liệu của tất cả các node dưới dạng json để gửi về server lưu
         * @returns {Object} chứa data của process và thông tin của tất cả các node trong nó
         */
        getAllElementData(){
            /**
             * Một số quy tắc lưu của flowable:
             * 1. Tất cả các mũi tên (sequence flow) đều thuộc childShapes của BPMNDiagram chứ ko thuộc về thằng cha của mũi tên đó
             */
            let allBNodes = this.$refs.symperBpmn.getAllNodes();
            
            let di ; // object chứa thông tin của diagram
            let nodeType = '';
            let mapSaveNodes = {};

            // Dựng thuộc tính cho từng node
            for(let bnode of allBNodes){ // bnode là viết tắt của businessObject node data
                nodeType = this.getNodeType(bnode);
                let nodeData;
                if(nodeType == 'BPMNDiagram'){
                    nodeData = util.cloneDeep(nodeDataTpl);
                    di = nodeData;
                    di.stencilset = {
                        namespace:"https://symper.org/stencilset/bpmn2.0#",
                        url:"../editor/stencilsets/bpmn2.0/bpmn2.0.json"
                    };
                }else{
                    if(nodeType == 'SequenceFlow'){ 
                        nodeData = this.getSaveDataForSequenceFlow(bnode);
                    }else{
                        nodeData = util.cloneDeep(nodeDataTpl);

                        if(bnode.id == 'Collaboration'){
                            debugger
                        }
                        nodeData.bounds = this.getNodeBounds(bnode);

                        if(bnode.sourceRef){
                            mapSaveNodes[bnode.sourceRef.id].outgoing = [];

                            if(bnode.outgoing){
                                mapSaveNodes[bnode.sourceRef.id].outgoing = [{ "resourceId": bnode.outgoing}];
                            }
                        }
                    }
                    nodeData.resourceId = bnode.id;
                }
                nodeData.properties = this.getNodeProperties(bnode.id);
                nodeData.stencil.id = nodeType; // flowable quy định loại node nằm trong nodeData.stencil.id
                nodeData.lastUpdated = (new Date()).toISOString().replace('Z','+0000');
                mapSaveNodes[bnode.id] = nodeData;
            }

            // đẩy các node vào dạng cây:
            for(let bnode of allBNodes){
                let saveNode = mapSaveNodes[bnode.id];
                if(saveNode.stencil.id == 'SequenceFlow'){
                    di.childShapes.push(saveNode); // theo quy tắc 1 của flowable về lưu SequenceFlow
                }else if(bnode.$parent.id) {
                    let pId = bnode.$parent.id;

                    if(mapSaveNodes[pId]){
                        mapSaveNodes[pId].childShapes.push(saveNode);
                    }
                }
            }

            return di;
        },
        // Lấy các dữ liệu của sequence flow
        getSaveDataForSequenceFlow(bnode){
            let nodeData = util.cloneDeep(nodeDataTpl);
            nodeData.stencil.id = 'SequenceFlow';
            nodeData.resourceId = bnode.id;
            
            nodeData.outgoing = [
                {
                    resourceId: bnode.sourceRef.id
                }
            ];
            nodeData.target = [
                {
                    resourceId: bnode.targetRef.id
                }
            ];
            nodeData.properties = this.getNodeProperties(bnode.id);
            nodeData.bounds = this.getNodeBounds(bnode);
            nodeData.dockers = [
                {
                    "x":0,
                    "y":0
                },
                {
                    "x":0,
                    "y":0
                }
            ];
            return nodeData;
        },
        getNodeBounds(bnode){
            let wp = bnode.di.waypoint;

            if(!wp){
                wp = [
                    {
                        x: bnode.di.x + bnode.di.width,
                        y: bnode.di.y + bnode.di.height
                    },
                    {
                        x: bnode.di.x,
                        y: bnode.di.y
                    }
                ]
            }

            return {
                lowerRight:{
                    x:wp[0].x,
                    y:wp[0].y
                },
                upperLeft:{
                    x:wp[1].x,
                    y:wp[1].y
                }
            }
        },
        getNodeProperties(idNode){
            let props = {};
            let sNodeAttrs = this.$store.state.process.allNodes[idNode];
            for(let key in sNodeAttrs.attrs){
                let attr = sNodeAttrs.attrs[key];
                if(attr){
                    if(allNodesAttrs[key].hasOwnProperty('getValue')){
                        props[key] = allNodesAttrs[key].getValue(attr.value);
                    }else{
                        props[key] = attr.value;
                    }
                }else{
                    console.warn(key + ' not found in attrs', key, sNodeAttrs.attrs);
                }
            }
            return props;
        },
        /**
         * Khôi phục lại dữ liệu được lưu ở server thành dữ liệu có thể sử dụng trong state để thao tác
         * @param {Object} processData data của process và thông tin của tất cả các node trong nó mà đã được lưu ở server
         */
        restoreSavedData(processData){

        },
        /**
         *  Lấy ra tên của node dựa vào dữ liệu của node đó trong  bpmn modeller
         * @param {Object} nodeData data của node trong thư viện bpmn-js
         * @returns {String} tên của node sau khi đã tính toán
         */
        getNodeType(nodeData) {
            let nodeType = nodeData.$type.replace("bpmn:", "").replace("Intermediate", "");
            if (nodeType.includes("Event") && nodeData.eventDefinitions) {
                let evtType = nodeData.eventDefinitions[0].$type.replace(
                    "bpmn:",
                    ""
                );
                evtType = evtType.replace("Definition", "");
                nodeType = nodeType.replace('Event', '');
                nodeType = nodeType+evtType;
            } else if (
                nodeType == "bpmn:SubProcess" &&
                nodeData.triggeredByEvent
            ) {
                nodeType = "EventSubProcess";
            }

            nodeType = mapLibNameToFlowableName[nodeType] ? mapLibNameToFlowableName[nodeType] : nodeType;
            return nodeType;
        },
        handleNodeChangeProps(nodeData) {
            let nodeId = nodeData.id;
            let nodeState = this.$store.state.process.allNodes[nodeId];
            let newType = this.getNodeType(nodeData);
            console.log(newType, nodeData);

            if (nodeState) {
                if (newType != nodeState.type) {
                    this.changeNodeType(nodeState, newType);
                }

                if (nodeId == this.selectingNode.id) {
                    this.$store.commit(
                        "process/changeSelectingNode",
                        this.$store.state.process.allNodes[nodeId]
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
            this.$store.commit("process/addNewNode", newNodeData);
        },
        /** Xử lý các sự kiện khi có sự thay đổi giá trị của các input trong panel cấu hình bên phải **/
        handleAttrValueChanged(name, inputInfo) {
            let type = this.selectingNode.type;
            let typeData = nodeAttrsDefinition[type];

            if (typeData.checkShowOrHideInput) {
                typeData.checkShowOrHideInput(this.selectingNode.attrs);
            }

            if (typeData.validate) {
                typeData.validate(this.selectingNode.attrs);
            }
            if (name == "name") {
                this.$refs.symperBpmn.updateElementProperties(
                    this.$store.state.process.selectingNode.id,
                    { name: inputInfo.value }
                );
            }
        },
        /**
         * Lấy dữ liệu của một node dựa theo nodeId.
         * Nếu không tìm thấy nodeId này trong state thì tạo các thuộc tính dựa theo loại node (nodeType)
         */
        getNodeData(nodeId, nodeType) {
            let nodeData = this.$store.state.process.allNodes[nodeId];
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

            if(nodeData.attrs.overrideid){
                nodeData.attrs.overrideid.value = nodeId;
            }
            this.$store.commit("process/addNewNode", nodeData);
            return nodeData;
        },
        /**
         * Xử lý sự kiện khi người dùng click vào một node
         */
        handleNodeSelected(node) {
            let type = this.getNodeType(node);
            console.log(type, node);

            let nodeData = this.getNodeData(node.id, type);
            nodeData.name = node.name;
            nodeData.attrs.name.value = node.name;
            this.$store.commit("process/changeSelectingNode", nodeData);
        },
        /**
         * Xử lý các hành động khi người dùng click vào các nút ở header của editor (zoom, focus, validate ... )
         *
         */
        handleHeaderAction(ac) {
            if (ac == "validate") {
                let self = this;
                this.fillNodeData();
                this.validateModel(()=>{
                    self.$snotify({
                        type: 'success',
                        title: 'Validation passed'
                    });
                });
            } else {
                this.$refs.symperBpmn[ac]();
            }
        },
        /**
         * Lấy data từ server và áp dụng data này để hiển thị lên process
         */
        applySavedData(idProcess){
            let self = this;
            bpmnApi.getModelData(idProcess)
            .then((res)=> { 
                let allElements = {}; // khôi phục lại state của tất cả các phần tử trong diagram
                self.restoreSavedEle(res.model, allElements);
            }).catch((err)=> {
                console.warn(err);
                self.$snotify({
                    type: "error",
                    title: self.$t('process.editror.err.get_data'),
                });
            });

            bpmnApi.getModelXML(idProcess)
            .then((res)=> {
                self.diagramXML = res;
            }).catch((err)=> {
                console.warn(err);
                self.$snotify({
                    type: "error",
                    title: self.$t('process.editror.err.get_xml'),
                });
            });
        },
        /**
         * Khôi phục lại data của model từ server vào trong state
         * @param {Object} ele data của phần tử được lưu ở server
         */
        restoreSavedEle(ele, rsl){
            let idEle = ele.resourceId;
            if(ele.modelId){ // Nếu đây là phần tử root của cây
                idEle = 'Collaboration';
            }
            let nodeData =  this.createNodeData(idEle, ele.stencil.id);

            // Khôi phục giá trị cho các thuộc tính của ele này
            for(let key in nodeData.attrs){
                if(ele.properties.hasOwnProperty(key)){
                    if(allNodesAttrs[key].hasOwnProperty('restoreData')){
                        nodeData.attrs.value = allNodesAttrs[key].restoreData(ele.properties[key]);
                    }else{
                        nodeData.attrs.value = ele.properties[key];
                    }
                }else{
                    console.warn('Not found '+ key + ' in attrs of saved data ele.properties',ele, key);
                }
            }
            
            rsl[idEle] = nodeData;
            // Khôi phục các thuộc tính cho các ele con của ele này
            if(ele.hasOwnProperty('childShapes')){
                for(let childEle of ele.childShapes){
                    this.restoreSavedEle(childEle, rsl);
                }
            }
        }
    },
    
    created() {
        this.$store.dispatch("app/getAllOrgChartData");
        if(this.$route.name == 'editProcess'){
            this.modelAction = 'edit';
            this.modelId = this.$route.params.id;
        }else if(this.$route.name == 'cloneProcess'){
            this.modelAction = 'clone';
        }

        if(this.$route.name == 'editProcess' || this.$route.name == 'cloneProcess'){
            this.applySavedData(this.$route.params.id);
        }

    },
    data() {
        return {
            modelAction: 'create', // hành động đối với model này là gì: create | clone | edit
            modelId: '', // Id của model này trong DB
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
            diagramXML: defaultXML
        };
    },
    components: {
        "symper-bpmn": SymperBpmn,
        "form-tpl": FormTpl
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
            return this.$store.state.process.selectingNode;
        },
        /** Chuyển dạng danh sách attr từ dạng phẳng sang dạng nhóm thành các group để hiển thị **/
        attrGroupView() {
            let currentAtts = this.$store.state.process.selectingNode.attrs;
            let groups = {};

            for (let attrName in currentAtts) {
                let attr = currentAtts[attrName];

                if(!attr){
                    console.warn(`can not get attr of "${attrName}" in currentAtts`, {currentAtts,attrName});
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
                            allAttrDisplayGroup
                        );
                    }
                }
                groups[groupName].items[attrName] = currentAtts[attrName];
            }
            return groups;
        }
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
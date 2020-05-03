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

                <v-btn class="float-right mr-1" small depressed color="primary">
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

export default {
    data() {
        return {
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
            diagramXML:
                '<?xml version="1.0" encoding="UTF-8"?> <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:flowable="http://flowable.org/bpmn" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:omgdc="http://www.omg.org/spec/DD/20100524/DC" xmlns:omgdi="http://www.omg.org/spec/DD/20100524/DI" typeLanguage="http://www.w3.org/2001/XMLSchema" expressionLanguage="http://www.w3.org/1999/XPath" targetNamespace="http://www.flowable.org/processdef"> <process id="kha_test" name="khá test" isExecutable="true"> <userTask id="u1" name="user task 1" flowable:async="true" isForCompensation="true" flowable:assignee="cc" flowable:candidateUsers="ss" flowable:candidateGroups="sss" flowable:dueDate="scc" flowable:category="cssscsc" flowable:formKey="cc" flowable:formFieldValidation="false" flowable:priority="cccssc" flowable:skipExpression="cccc"> <documentation>xxxc cc c c c</documentation> <extensionElements> <flowable:executionListener event="start" class="cc"> <flowable:field name="fieldName ccs"> <flowable:string><![CDATA[ssc]]></flowable:string> </flowable:field> </flowable:executionListener> <flowable:taskListener event="create" class="cc"> <flowable:field name="fieldName"> <flowable:string><![CDATA[âcc]]></flowable:string> </flowable:field> </flowable:taskListener> <modeler:initiator-can-complete xmlns:modeler="http://flowable.org/modeler"><![CDATA[true]]></modeler:initiator-can-complete> </extensionElements> <multiInstanceLoopCharacteristics isSequential="false" flowable:collection="sc" flowable:elementVariable="ss"> <loopCardinality>ccc</loopCardinality> <completionCondition>ccc</completionCondition> </multiInstanceLoopCharacteristics> </userTask> </process> <bpmndi:BPMNDiagram id="BPMNDiagram_kha_test"> <bpmndi:BPMNPlane bpmnElement="kha_test" id="BPMNPlane_kha_test"> <bpmndi:BPMNShape bpmnElement="u1" id="BPMNShape_u1"> <omgdc:Bounds height="80.0" width="100.0" x="48.87500585801894" y="2.000001490116105"></omgdc:Bounds> </bpmndi:BPMNShape> </bpmndi:BPMNPlane> </bpmndi:BPMNDiagram> </definitions>'
        };
    },
    components: {
        "symper-bpmn": SymperBpmn,
        "form-tpl": FormTpl
    },
    methods: {
        handleNodeChangeProps(nodeData){
            let nodeId = nodeData.id;
            let nodeState = this.$store.state.process.allNodes[nodeId];
            let newType = nodeData.$type.replace('bpmn:','');
            if(nodeState){
                if(newType != nodeState.type){
                    this.changeNodeType(nodeState, newType);
                }

                if(nodeId == this.selectingNode.id){
                    this.$store.commit("process/changeSelectingNode", this.$store.state.process.allNodes[nodeId]);
                }
                console.log(this.$store.state.process,this, 'this.$store.state.processthis.$store.state.process');
                
            }
        },

        /**
         * Thay đổi loại node
         * @param {Object} nodeState Object chứa state của node cần thay đổi (data của node cũ)
         * @param {String} newType Loại node mới cần đổi
         */
        changeNodeType(nodeState, newType){
            let newNodeData = this.createNodeData(nodeState.id, newType);
            for(let attrName in newNodeData.attrs){
                if(nodeState.attrs[attrName]){
                    newNodeData.attrs[attrName].value = nodeState.attrs[attrName].value;
                }
            }
            this.$store.commit("process/addNewNode", newNodeData);
        },
        /** Xử lý các sự kiện khi có sự thay đổi giá trị của các input trong panel cấu hình bên phải **/
        handleAttrValueChanged(name, inputInfo) {
            let type = this.selectingNode.type;
            let typeData = nodeAttrsDefinition[type];


            if(typeData.checkShowOrHideInput){
                typeData.checkShowOrHideInput(this.selectingNode.attrs);
            }

            if(typeData.validate){
                typeData.validate(this.selectingNode.attrs);
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
        createNodeData(nodeId, nodeType, marker = "") {
            let nodeData = {
                id: nodeId,
                marker: marker,
                type: nodeType,
                attrs: getNodeAttrs(nodeType)
            };
            this.$store.commit("process/addNewNode", nodeData);
            return nodeData;
        },
        /**
         * Xử lý sự kiện khi người dùng click vào một node
         */
        handleNodeSelected(node) {
            console.log(node);
            let type = node.$type.replace('bpmn:','');
            let nodeData = this.getNodeData(node.id, type);
            this.$store.commit("process/changeSelectingNode", nodeData);
        },
        /**
         * Xử lý các hành động khi người dùng click vào các nút ở header của editor (zoom, focus, validate ... )
         *
         */
        handleHeaderAction(ac) {
            if (ac == "validate") {
            } else {
                this.$refs.symperBpmn[ac]();
            }
        }
    },
    props: {
        // Hành động cho editor này, nhận một trong các giá trị: create, edit, view, clone
        action: {
            type: String,
            default: "create"
        }
    },
    created(){
        this.$store.dispatch('app/getAllOrgchartNodes');
    },
    computed: {
        selectingNode(){
            return this.$store.state.process.selectingNode;
        },
        /** Chuyển dạng danh sách attr từ dạng phẳng sang dạng nhóm thành các group để hiển thị **/
        attrGroupView() {
            let currentAtts = this.$store.state.process.selectingNode.attrs;
            let groups = {};

            for (let attrName in currentAtts) {
                let attr = currentAtts[attrName];
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
<template>
    <div class="h-100 w-100">
        <div class="action-diagram-bpmn" style="text-align:right;margin-top:3px">
            <span class="fs-13" style="float:left">{{definitionName}}</span>
            <v-icon class="action-btn"  @click="handleZoomOut">mdi-plus-circle-outline</v-icon>
            <v-icon class="action-btn"  @click="handleZoomIn">mdi-minus-circle-outline</v-icon>
            <v-icon class="action-btn"  @click="handleFocus">mdi-image-filter-center-focus</v-icon>
            <v-icon v-if="stask.statusPopupTracking==false" class="action-btn"  @click="handleShowPopup">mdi-fullscreen</v-icon>
            <v-icon v-else class="action-btn"  @click="handleClosePopup">mdi-close</v-icon>
        </div>
        <symper-bpmn
            class="symper-bpmn"
            style="height:95%!important"
            @node-clicked="handleNodeSelected"
            ref="symperBpmn"
            :readOnly="true"
            :diagramXML="diagramXML"
            :customModules="customRender"
            @after-render-diagram-from-xml="eventAfterRender"
        ></symper-bpmn>
        <symper-drag-panel 
            @before-close="closeDetailPanel()"
            :showPanel="nodeDetailPanel.show"
            :actionTitle="nodeDetailPanel.title"
            :panelData="nodeDetailPanel.data"
            :titleIcon="nodeDetailPanel.titleIcon"
            :topPosition="nodeDetailPanel.position.top"
            :leftPosition="nodeDetailPanel.position.left"
            :dragPanelWidth="300"
            :dragPanelHeight="400">
        </symper-drag-panel>
    </div>
</template>

<script>
import SymperBpmn from "./../../components/common/SymperBpmn.vue";
import { defaultXML } from "./../../components/process/reformatGetListData";
import bpmneApi from "./../../api/BPMNEngine";
import CustomRenderInstance from "./../../components/process/CustomRenderInstance";
import SymperDragPanel from '../../components/common/SymperDragPanel.vue';
import { appConfigs } from '../../configs';
import {orgchartApi} from "@/api/orgchart";
const nodeStatusColors = {
    failed: {
        fill: "#e24747",
        stroke: "#fff7f7"
    },
    todo: {
        fill: "#ffffff",
        stroke: "#0760D9"
    },
    done: {
        fill: "#edffee",
        stroke: "#4CAF50"
    },
    notStart: {
        fill: "#f3f3f3",
        stroke: "#797979"
    },
    
  
};

export default {
    props: {
        instanceId: {
            type: String,
            default: ''
        },
        elementId: {
            type: String,
            default: ''
        },
        definitionName:{
            type:String,
            default:'',
        },
        needFocus: {
            type: Boolean,
            default: true
        }
    },
    watch:{
        instanceId(){
            this.setInstanceXML();
           // this.getInstanceRuntimeData();
        },
        elementId(){
            this.setInstanceXML();
            this.eventAfterRender();
        }
    },
    created() {
        this.setInstanceXML();
        //this.getInstanceRuntimeData();
 
    },
    data() {
        return {
            diagramXML: defaultXML,
            runtimeNodeMap: null, // Thông tin chạy của các node trong process instance. có dạng: {idNode : {thông tin}}
            customRender: [
                {
                    __init__: ["customRenderer"],
                    customRenderer: ["type", CustomRenderInstance]
                }
            ],
            nodeDetailPanel: {
                title: '',
                show: false,
                position: {
                    left: 0,
                    top: 0
                },
                data: {}
            },
            processDefinitionId:'',
            flowElementMap:[],//thông tin model của process instance có dạng: {idNode : {thông tin}}
        };
    },
    components: {
        "symper-bpmn": SymperBpmn,
        "symper-drag-panel": SymperDragPanel
    },
    computed:{
        stask() {
			return this.$store.state.task;
		},
    },
    methods: {
        eventAfterRender(){
            if(this.needFocus){
                setTimeout((self) => {
                    self.$refs.symperBpmn.focus();
                }, 200,this);
            }
        },
        handleClosePopup(){
            this.$store.commit("task/setStatusPopupTracking",false);
        },
        handleShowPopup(){
            this.$emit("showPopupDiagram");
        },
        handleFocus(){
            this.$refs.symperBpmn.focus();
        },
        handleZoomIn(){
            this.$refs.symperBpmn.zoomIn();
        },
        handleZoomOut(){
            this.$refs.symperBpmn.zoomOut();
        },
        closeDetailPanel(){
            this.nodeDetailPanel.show = false;
        },
        //lấy model của processDefinition
        async getDefinitionModel(){
            let self=this;
            if (this.processDefinitionId) {
                bpmneApi
                .getDefinitionModel(this.processDefinitionId)
                .then(res => {

                    let data=res.mainProcess.flowElementMap;
                    for (const key in data) {
                        if (data[key].assignee && !self.runtimeNodeMap[key]) {
                            self.flowElementMap.push(data[key]);
                        }
                    }
                    self.getVariableProcessInstance(self.instanceId);
                    console.log("aaaax",res);
                })
                .catch(err => {
                    self.$snotifyError(
                        err,
                        "Can not get model process definition"
                    );
                });
            }
        },
        async getVariableProcessInstance(instanceId){
            let self=this;
            let filter={};
            filter.includeProcessVariables=true;
            filter.processInstanceId=instanceId;
            await bpmneApi
                .getProcessInstanceHistory(filter)
                .then(res => {
                    self.updateDrawDataInDiagram(res.data[0].variables);
                })
                .catch(err => {
                    self.$snotifyError(
                        err,
                        "Can not get variable process!"
                    );
                });
        },
        async updateDrawDataInDiagram(variables){
            let symBpmn = this.$refs.symperBpmn;
            let mapUser = this.$store.getters['app/mapIdToUser'];
            for (let index = 0; index < this.flowElementMap.length; index++) {
                if (!isFinite(this.flowElementMap[index].assignee)) { // kiểm tra assginee có phải dạng number
                    let dataInput={};
                    for (let i = 0; i < variables.length; i++) {
                        dataInput[variables[i].name]=variables[i].value;
                    }
                    let data={};
                    data.dataInput=JSON.stringify(dataInput);
                    data.data=this.flowElementMap[index].assignee;
                    data.type="multiple";
                    let res=await orgchartApi.getUserIdentifiFromProcessModeler(data);
                    this.flowElementMap[index].assignee=res;
                }

                let infoAssignee={};
                let roleInfo={};
                infoAssignee.assignee={};
                infoAssignee.role={};
                let task=this.flowElementMap[index];
                let assigneeId=task.assignee;
                if (task.assignee.indexOf(":")>0) {  //check assinee là userId hay userId:role
                    let arrDataAssignee=task.assignee.split(":");
                    assigneeId=arrDataAssignee[0];
                    if (arrDataAssignee.length>3) { // loại trừ trường hợp role=0
                        let roleIdentify=task.assignee.slice(assigneeId.length+1);
                        roleInfo=this.getRoleUser(roleIdentify);
                    }
                }
                if (mapUser[assigneeId]) {
                    infoAssignee.assignee = mapUser[assigneeId];
                    infoAssignee.role = roleInfo;
                }
                if (this.flowElementMap[index].id) {
                    console.log("elll",this.flowElementMap[index].id);
                    symBpmn.updateElementProperties(this.flowElementMap[index].id, {
                        infoAssignee: infoAssignee,
                        setColor:nodeStatusColors.notStart
                    });
                }

            }
        },
        // Lấy ra thông tin chạy của các node của instance
        getInstanceRuntimeData() {
            let self = this;
            let idInstance = this.$route.params.idInstance ? this.$route.params.idInstance :this.instanceId;
            bpmneApi
                .getProcessInstanceRuntimeHistory(idInstance)
                .then(res => {
                    console.log("elementMap",res.data);
                    self.setElementMap(res.data)
                    self.setColorForNodes().then(() => {
                        self.setTasksStatus();
                    });
                    self.$emit("dataInstanceRuntime",res.data);
                })
                .catch(err => {
                    self.$snotifyError(
                        err,
                        "Can not get nodes runtime data of instance"
                    );
                });
        },
        setElementMap(els){
            let map = {};
            let nodeStatus = '';
            for (let item of els) {
                if (item.endTime) {
                    nodeStatus = "done";
                } else {
                    nodeStatus = "todo";
                } // chưa có overdue, server cần trả về thêm thông tin của deadline
                if(!map[item.activityId]){
                    map[item.activityId] = {
                        activityId: item.activityId,
                        activityName: item.activityName,
                        activityType: item.activityType,
                        nodeStatus: nodeStatus,
                        isMultiInstance: false,
                        instancesMap: {}, // map các id instance của task với thông tin của task đó
                        instancesStatusCount: {
                            done: 0,
                            todo: 0,
                            overdue: 0
                        },
                    };
                }
                map[item.activityId].instancesStatusCount[nodeStatus] += 1;
                map[item.activityId].instancesMap[item.id] = item;
                
            }
            this.runtimeNodeMap = map;
        },
        getRoleUser(roleIdentify){
            let arrDataRole=roleIdentify.split(":");
            let allSymperRole=this.$store.state.app.allSymperRoles;
            if (Object.keys(allSymperRole).length>0) {
                if (allSymperRole[arrDataRole[0]]) {
                    let role=(allSymperRole[arrDataRole[0]]).find(element => element.roleIdentify===roleIdentify);
                    return role;
                }
            }
            return {}
        },
        // set các ô màu cho task
        setTasksStatus(){
            console.log("dattaaa",this.runtimeNodeMap);
            for(let eleId in this.runtimeNodeMap){
                let nodeInfo = this.runtimeNodeMap[eleId];
                if (nodeInfo.activityType) {
                    if(nodeInfo.activityType.includes('Task')){
                        let symBpmn = this.$refs.symperBpmn;
                        let currentNode=false;
                        if (nodeInfo.currentNode) {
                            currentNode=true;
                        }
                        let mapUser = this.$store.getters['app/mapIdToUser'];
                        let infoAssignee={};
                        let roleInfo={};
                        infoAssignee.assignee={};
                        infoAssignee.role={};
                        let taskInfo=nodeInfo.instancesMap;
                        Object.keys(taskInfo).forEach(item => {
                            let task=taskInfo[item];
                            let assigneeId=task.assignee;
                            if (task.assignee) {
                                if (task.assignee.indexOf(":")>0) {  //check assinee là userId hay userId:role
                                    let arrDataAssignee=task.assignee.split(":");
                                    assigneeId=arrDataAssignee[0];
                                    if (arrDataAssignee.length>3) { // loại trừ trường hợp role=0
                                        let roleIdentify=task.assignee.slice(assigneeId.length+1);
                                        roleInfo=this.getRoleUser(roleIdentify);
                                    }
                                }
                                if (mapUser[assigneeId]) {
                                    infoAssignee.assignee = mapUser[assigneeId];
                                    infoAssignee.role = roleInfo;
                                }
                            }
                        });
                        symBpmn.updateElementProperties(eleId, {
                            statusCount: nodeInfo.instancesStatusCount,
                            currentNode: currentNode,
                            infoAssignee: infoAssignee
                        });
                    }
                }


            }
        },
        // Đặt màu cho các node trong diagram
        setColorForNodes() {
            let self = this;
            return new Promise((resolve, reject) => {
                if (
                    self.diagramXML !== defaultXML &&
                    self.runtimeNodeMap !== null
                ) {
                    setTimeout(() => {
                        let symBpmn = self.$refs.symperBpmn;
                        let allNode = symBpmn.getAllNodes();
                        let nodeStatus = "";
                        if(self.elementId){
                            if (self.runtimeNodeMap[self.elementId]) {
                                self.runtimeNodeMap[self.elementId].currentNode = true;
                            }
                        }
                        for (let node of allNode) {
                            if (node.$type != "bpmn:Process") {
                                if (self.runtimeNodeMap[node.id]) {
                                    nodeStatus = self.runtimeNodeMap[node.id].nodeStatus;
                                } else {
                                    nodeStatus = "notStart";
                                }
                                symBpmn.changeElementColor(
                                    node.id,
                                    nodeStatusColors[nodeStatus],
                                );
                            }
                        }
                        resolve();
                    }, 500);
                }
            });
        },
        // Lấy xml của process instance này
        setInstanceXML() {
            let self = this;
            this.getInstanceData()
                .then(res => {
                    self.processDefinitionId=res.data[0].processDefinitionId;
                    return self.getDefinitionData(res.data[0].processDefinitionId);
                })
                .then(res => {
                    let resourceDataUrl = appConfigs.apiDomain.bpmne.general + 'symper-rest/service/repository/deployments/'+res.deploymentId+'/resourcedata/process_draft.bpmn';
                    return self.getDefinitionXML(resourceDataUrl);
                })
                .then(res => {
                    self.diagramXML = res;
                    self.getInstanceRuntimeData();
                    self.setColorForNodes().then(() => {
                        self.setTasksStatus();
                    });
                    self.getDefinitionModel();

                })
                .catch(errInfo => {
                    let err = errInfo.err;
                    if (!err) {
                        err = errInfo;
                    }
                    self.$snotifyError(err, errInfo.msg);
                });
        },

        // Lấy data của instance
        getInstanceData() {
            let instanceId = this.instanceId ? this.instanceId : this.$route.params.idInstance;
            let self = this;
            return new Promise((resolve, reject) => {
                bpmneApi
                    .getProcessInstanceData(instanceId)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject({
                            err,
                            msg: "Can not get process instance data"
                        });
                    });
            });
        },
        // Lấy data của process definition
        getDefinitionData(idDifinition) {
            let self = this;
            return new Promise((resolve, reject) => {
                bpmneApi
                    .getDefinitionData(idDifinition)
                    .then(res => {
                        resolve(res);
                    })
                    .catch(err => {
                        reject({
                            err,
                            msg: "Can not get process definition data"
                        });
                    });
            });
        },
        // Lấy xml của process definition
        getDefinitionXML(url) {
            let self = this;
            return new Promise((resolve, reject) => {
                bpmneApi
                    .getDefinitionXML(url)
                    .then(xml => {
                        resolve(xml);
                    })
                    .catch(err => {
                        reject({
                            err,
                            msg: "Can not get process definition XML"
                        });
                    });
            });
        },
        handleNodeSelected(bizNode, evt) {
            console.log(bizNode, evt);
            this.nodeDetailPanel.position.left = evt.originalEvent.clientX + 10;
            this.nodeDetailPanel.position.top = evt.originalEvent.clientY + 10;
            this.nodeDetailPanel.title = bizNode.name;
            this.nodeDetailPanel.titleIcon = 'mdi-account';
            this.nodeDetailPanel.show = true;
        },
    },
   

};
</script>

<style scoped>
.action-diagram-bpmn{
    width:100%;
    margin-right: 10px;
}
.action-btn{
    cursor: pointer;
    font-size: 20px;
    margin-right:5px ;
}
</style>
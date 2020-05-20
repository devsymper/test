<template>
    <div class="h-100 w-100">
        <symper-bpmn
            @node-clicked="handleNodeSelected"
            ref="symperBpmn"
            :readOnly="true"
            :diagramXML="diagramXML"
            :customModules="customRender"
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

const nodeStatusColors = {
    failed: {
        fill: "#e24747",
        stroke: "#fff7f7"
    },
    todo: {
        fill: "#ffffff",
        stroke: "#f5bb00"
    },
    done: {
        fill: "#edffee",
        stroke: "#4CAF50"
    },
    notStart: {
        fill: "#f3f3f3",
        stroke: "#797979"
    }
};

export default {
    props: {
        instanceId: {
            type: String,
            default: ''
        }
    },
    watch:{
        instanceId(){
            this.setInstanceXML();
            this.getInstanceRuntimeData();
        }
    },
    created() {
        this.setInstanceXML();
        this.getInstanceRuntimeData();
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
            }
        };
    },
    components: {
        "symper-bpmn": SymperBpmn,
        "symper-drag-panel": SymperDragPanel
    },
    methods: {
        closeDetailPanel(){
            this.nodeDetailPanel.show = false;
        },
        // Lấy ra thông tin chạy của các node của instance
        getInstanceRuntimeData() {
            let self = this;
            let idInstance = this.$route.params.idInstance;
            bpmneApi
                .getProcessInstanceRuntimeHistory(idInstance)
                .then(res => {
                    self.setElementMap(res.data)
                    self.setColorForNodes().then(() => {
                        self.setTasksStatus();
                    });
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
            let nodeStatus = ''
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
                        }
                    };
                }
                map[item.activityId].instancesStatusCount[nodeStatus] += 1;
                map[item.activityId].instancesMap[item.id] = item;
                
            }
            this.runtimeNodeMap = map;
        },
        // set các ô màu cho task
        setTasksStatus(){
            for(let eleId in this.runtimeNodeMap){
                let nodeInfo = this.runtimeNodeMap[eleId];
                if(nodeInfo.activityType.includes('Task')){
                    let symBpmn = this.$refs.symperBpmn;
                    symBpmn.updateElementProperties(eleId, {
                        statusCount: nodeInfo.instancesStatusCount
                    });
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
                        for (let node of allNode) {
                            if (node.$type != "bpmn:Process") {
                                if (self.runtimeNodeMap[node.id]) {
                                    nodeStatus = self.runtimeNodeMap[node.id].nodeStatus;
                                } else {
                                    nodeStatus = "notStart";
                                }
                                symBpmn.changeElementColor(
                                    node.id,
                                    nodeStatusColors[nodeStatus]
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
                    return self.getDefinitionData(res.processDefinitionId);
                })
                .then(res => {
                    let resourceDataUrl = res.resource.replace(
                        "/resources/",
                        "/resourcedata/"
                    );
                    return self.getDefinitionXML(resourceDataUrl);
                })
                .then(res => {
                    self.diagramXML = res;
                    self.setColorForNodes().then(() => {
                        self.setTasksStatus();
                    });
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
    }

};
</script>

<style>
</style>
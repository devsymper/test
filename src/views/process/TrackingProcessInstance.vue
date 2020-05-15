<template>
    <symper-bpmn
    @node-clicked="handleNodeSelected"
    ref="symperBpmn"
    :diagramXML="diagramXML">
    
    </symper-bpmn>
</template>

<script>
import SymperBpmn from "./../../components/common/SymperBpmn.vue";
import { defaultXML } from "./../../components/process/reformatGetListData";
import bpmneApi from "./../../api/BPMNEngine";

const nodeStatusColors = {
    failed: {
        fill: '#e24747',
        stroke: '#fff7f7'
    },
    doing: {
        fill: '#ffffff',
        stroke: '#f5bb00'
    },
    done: {
        fill: '#edffee',
        stroke: '#4CAF50'
    },
    notStart: {
        fill: '#f3f3f3',
        stroke: '#797979'
    },
}

export default {
    created(){
        this.setInstanceXML();
        this.getInstanceRuntimeData();
    },
    data(){
        return {
            diagramXML: defaultXML,
            runtimeNodeMap: null // Thông tin chạy của các node trong process instance. có dạng: {idNode : {thông tin}}
        }
    },
    components: {
        'symper-bpmn':SymperBpmn
    },
    methods: {
        // Lấy ra thông tin chạy của các node của instance
        getInstanceRuntimeData(){
            let self = this;
            let idInstance = this.$route.params.idInstance;
            bpmneApi.getProcessInstanceRuntimeHistory(idInstance).then((res) => {
                let map = {};
                for(let item of res.data){
                    map[item.activityId] = item;
                }
                self.runtimeNodeMap = map;
                self.setColorForNodes();
            }).catch((err) => {

            });
        },
        // Đặt màu cho các node trong diagram
        setColorForNodes(){
            if(this.diagramXML !== defaultXML && this.runtimeNodeMap !== null){
                let self = this;
                setTimeout(() => {
                    let symBpmn = self.$refs.symperBpmn;
                    let allNode = symBpmn.getAllNodes();
                    let nodeType = '';
                    for(let node of allNode){
                        if(node.$type != 'bpmn:Process'){
                            if(self.runtimeNodeMap[node.id]){
                                if(self.runtimeNodeMap[node.id].endTime){
                                    nodeType = 'done';
                                }else{
                                    nodeType = 'doing';
                                }
                            }else{
                                nodeType = 'notStart';
                            }
                            symBpmn.changeElementColor(node.id ,nodeStatusColors[nodeType]);
                        }
                    }
                }, 500);
            }
        },
        // Lấy xml của process instance này
        setInstanceXML(){
            let self = this;
            this.getInstanceData()
                .then((res)=>{
                    return self.getDefinitionData(res.processDefinitionId);
                })
                .then((res)=>{
                    let resourceDataUrl = res.resource.replace('/resources/','/resourcedata/');
                    return self.getDefinitionXML(resourceDataUrl)
                })
                .then((res) => {
                    self.diagramXML = res;
                    self.setColorForNodes();
                }).catch((errInfo) => {
                    let err = errInfo.err;
                    if(!err){
                        err = errInfo;
                    }
                    self.$snotifyError(err, errInfo.msg);
                });
        },
        // Lấy data của instance
        getInstanceData(){
            let self = this;
            return new Promise((resolve, reject) => {
                bpmneApi.getProcessInstanceData(self.$route.params.idInstance)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                     reject({
                        err,
                        msg: 'Can not get process instance data'
                    });
                });
            });
        },
        // Lấy data của process definition
        getDefinitionData(idDifinition){
            let self = this;
            return new Promise((resolve, reject) => {
                bpmneApi.getDefinitionData(idDifinition)
                .then((res) => {
                    resolve(res);
                }).catch((err) => {
                    reject({
                        err,
                        msg: 'Can not get process definition data'
                    });
                });
            });  
        },
        // Lấy xml của process definition
        getDefinitionXML(url){
            let self = this;
            return new Promise((resolve, reject) => {
                bpmneApi.getDefinitionXML(url)
                .then((xml) => {
                    resolve(xml);
                }).catch((err) => {
                    reject({
                        err,
                        msg: 'Can not get process definition XML'
                    });
                });
            });  
        },
        handleNodeSelected(){
            
        }
    }
}
</script>

<style>

</style>
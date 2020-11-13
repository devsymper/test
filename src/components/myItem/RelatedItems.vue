<template>
    <div class="pt-2">
        <div class="subtask-container">
            <div v-for="(item, idex) in listTaskRelated"
                :key="idex"
            >
                <v-row  :class="{
                    'mr-0 ml-0 single-row': true ,
                    }"
                    :style="{
                        minHeight: '25px'
                    }"
                    v-if="checkShowTotalTask(idex)"
                >
                    <v-col cols="8" class="pa-1">
                        <div style="white-space: nowrap;
                            overflow: hidden;
                            text-overflow: ellipsis;"  @dblclick="goDoTask(item.id)">
                            <v-icon style="font-size:16px">{{displayIcon(item.description)}}</v-icon>
                            <span style=" font-size:13px">{{displayContent(item.description)}}</span>
                        </div>
                        <div  @dblclick="goDoTask(item.id)">
                            <v-icon v-if="item.createTime && checkTimeDueDate(item)" style="font-size:11px; color:#EE6B60;margin-left: 3px;">mdi-circle</v-icon>
                            <v-icon v-else-if="item.createTime && !checkTimeDueDate(item)" style="font-size:11px; color:#0760D9;margin-left: 3px;">mdi-circle</v-icon>
                            <v-icon v-else style="font-size:11px ; color:#408137;margin-left: 3px;">mdi-circle</v-icon>
                            {{displayDescription(item.description)}}
                        </div>
                    </v-col>
                    <v-col class="pa-1" cols="4">
                        <v-icon x-small >mdi-clock-time-nine-outline</v-icon>
                        {{item.createTime ? $moment(item.createTime).format('DD/MM/YY HH:mm'):$moment(item.endTime).format('DD/MM/YY HH:mm')}}
                        <div style="padding-top: 2px;">
                            <span class="quickView" @click="showInfoTask($event,item)">{{$t("myItem.sidebar.quickView")}}</span>
                        </div>
                    </v-col>
            
                </v-row>
            </div>
        </div>
        <infoTaskRelated
            v-show="statusQuickView && taskSelected"
            :taskSelected="taskSelected"
            :appId="appId"
            @closeInfoTaskRelated="closeInfoTaskRelated"
            ref="infoTaskRelated"
         />
    </div>
</template>

<script>
import BPMNEngine from "@/api/BPMNEngine.js";
import infoTaskRelated from "./InfoTaskRelated";

export default {
    name: "relatedItems",
    components: {
        infoTaskRelated
    },
    data(){
        return{
            x:-1,
            y:-1,
            processParent:{},
            listSubProcessInstance:[],
            listProcessSibling:[],
            processInstanceCurrent:{},
            statusQuickView:false,
            taskSelected:{},
            
        }
    },
    props: {
        taskInfo: {
            type: Object,
            default(){
                return {
                action: {
                    parameter: {
                        taskId
                    }
                }
                }
            }
        },
        tabsData: {
            type: Object,
            default: () => {}
        },
        showMoreTask:{
            type:Boolean,
            default:false
        },
        appId:{
            type:Number,
            default:0,
        }
    },
    watch:{
		taskInfo:function(newVl){
			this.getData();
		}
	},
    computed: {
        taskFilter(){
            return {
                processInstanceId: this.taskInfo.action.parameter.processInstanceId,
                assigneeLike:  String(this.$store.state.app.endUserInfo.id)
            }
        },
        stask() {
			return this.$store.state.task;
        },
        listTaskRelated(){
            let tasks=this.stask.listTaskInProcessInstance;
            tasks=tasks.concat(this.stask.listTaskDoneInProcessInstance);
            tasks=tasks.concat(this.stask.listTaskInProcessParent);
            tasks=tasks.concat(this.stask.listTaskDoneInProcessParent);
            tasks=tasks.concat(this.stask.listTaskInProcessSub);
            tasks=tasks.concat(this.stask.listTaskInProcessSibling);
            let set = new Set();
            let uniqueTask = tasks.filter(item => {
                if (!set.has(item.id)) {
                    set.add(item.id);
                    return true;
                }
                return false;
            }, set);
            return uniqueTask;
        }
    },
    methods:{
        checkTimeDueDate(item){
            if (item.dueDate) {
                let dueDate=new Date(item.dueDate).getTime();
                if (dueDate<Date.now()) {
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        },
        closeInfoTaskRelated(){
            this.statusQuickView=false;
        },
        showInfoTask(e,item){
            e.preventDefault(); 
            e.stopPropagation(); 
            this.taskSelected={};
            this.taskSelected=item;
            this.statusQuickView=true;
            this.$refs.infoTaskRelated.setPosittion({bottom:$(document).height() - e.clientY + 30 + 'px'})

        },
        checkShowTotalTask(idex){
            if (this.showMoreTask==false) {
                if (idex<=2) {
                    return true
                }else{
                    return false
                }
            }else{
                return true;
            }
        },
        goDoTask(id){
            this.$router.push("/myitem/tasks/"+id);
          
        },
        displayIcon(description){
            let data=JSON.parse(description);
            if (data.action.action=="approval") {
                return 'mdi-seal-variant'
            }else{
                return 'mdi-file-document-edit-outline';
            }
        },
        displayDescription(description){
            let data = JSON.parse(description);
            let des = '',value = '';
            if (data.extraLabel == "" ||data.extraLabel == null) {
                des ='Mô tả';
            }else{
                des = data.extraLabel;
            }

            if (data.extraValue == "" && data.extraLabel == "") {
                value = 'Không có mô tả';
            }else{
                value = data.extraValue;
            }    
            
            return des +' '+ value;

        },
        displayContent(description){
            let data=JSON.parse(description);
            return data.content;
        },
        async getData(){
            let self=this;
            console.log("taskI",self.taskInfo);
            let processInstanceId='';
            if (self.taskInfo.action.parameter.processInstanceId && self.taskInfo.action.parameter.processInstanceId!="") {
                processInstanceId=self.taskInfo.action.parameter.processInstanceId;
            }
            if (processInstanceId != "") {
                await self.getListTaskInProcessCurrent(processInstanceId);
                await self.getProcessInstanceCurrent(processInstanceId)
                await self.getProcessInstanceCurrent('','parentProcess');// get process parent
                await self.getProcessSub(processInstanceId);
                await self.getProcessSibling();
            }else{
                //xóa data trong store
                self.$store.commit('task/setListTaskInProcessInstance',[]);
                self.$store.commit('task/setListTaskInProcessParent',[]);
                self.$store.commit('task/setListTaskInProcessSub',[]);
            }
        },
        async getListTaskInProcessCurrent(processInstanceId,isCheckProcess='',listProcessInstance=[]){
            let self=this;
            try {
                let filter={};
                if (isCheckProcess=='') {
                    filter.processInstanceId=processInstanceId;
                    filter.size=100;
                    filter.sort= 'createTime';
                    filter.order= 'desc';
                    filter.page=1;
                    //get task notDone
                    let res = await BPMNEngine.getTask(filter);
                    self.$store.commit('task/setListTaskInProcessInstance',res.data);
                    //get task done
                    filter.status='done';
                    let res2= await BPMNEngine.getTask(filter);
                    self.$store.commit('task/setListTaskDoneInProcessInstance',res2.data);
                    console.log("taskDoneInProcess",res);
                }else if(isCheckProcess=='parentProcess'){
                    filter.processInstanceId=processInstanceId;
                    filter.size=100;
                    filter.sort= 'createTime';
                    filter.order= 'desc';
                    filter.page=1;
                    //get task notDone
                    let res = await BPMNEngine.getTask(filter);
                    self.$store.commit('task/setListTaskInProcessParent',res.data);
                    //get task done
                    filter.status='done';
                    let res2= await BPMNEngine.getTask(filter);
                    self.$store.commit('task/setListTaskDoneInProcessParent',res2.data);
                    console.log("taskDoneInProcess",res2);
                }else if (isCheckProcess=='subProcess') {
                    let listTask=[];
                    for (let i = 0; i < listProcessInstance.length; i++) {
                        let subFilter={};
                        subFilter.processInstanceId=listProcessInstance[i].id;
                        subFilter.size=100;
                        subFilter.sort= 'createTime';
                        subFilter.order= 'desc';
                        subFilter.page=1;
                         //get task notDone
                        let res = await BPMNEngine.getTask(subFilter);
                        listTask= listTask.concat(res.data);
                        //get task done
                        subFilter.status='done';
                        let res2 = await BPMNEngine.getTask(subFilter);
                        listTask= listTask.concat(res2.data);
                    }
                    console.log("taskInSubProcess",listTask);
                    self.$store.commit('task/setListTaskInProcessSub',listTask);
                }else if (isCheckProcess=='siblingProcess') {
                    let listTask=[];
                    for (let i = 0; i < listProcessInstance.length; i++) {
                        let subFilter={};
                        subFilter.processInstanceId=listProcessInstance[i].id;
                        subFilter.size=100;
                        subFilter.sort= 'createTime';
                        subFilter.order= 'desc';
                        subFilter.page=1;
                         //get task notDone
                        let res = await BPMNEngine.getTask(subFilter);
                        listTask= listTask.concat(res.data);
                        //get task done
                        subFilter.status='done';
                        let res2 = await BPMNEngine.getTask(subFilter);
                        listTask= listTask.concat(res2.data);
                    }
                    console.log("taskInSubProcess",listTask);
                    self.$store.commit('task/setListTaskInProcessSibling',listTask);
                }
               
            } catch (error) {
                self.$snotifyError(error, "Get list task failed");
            }
        },
        async getProcessInstanceCurrent(processInstanceId,isCheckProcess=''){
            let self=this;
            try {
                let filter={};
                if (isCheckProcess=='') { // get process current
                    filter.processInstanceId=processInstanceId;
                    let res = await BPMNEngine.getProcessInstanceHistory(filter);
                    self.processInstanceCurrent=res.data[0];
                    console.log("ProcessCurrent", self.processInstanceCurrent);
                }else if(isCheckProcess=='parentProcess'){ 
                    if (self.processInstanceCurrent.superProcessInstanceId && self.processInstanceCurrent.superProcessInstanceId!=null) {
                        filter.processInstanceId=self.processInstanceCurrent.superProcessInstanceId;
                        let res = await BPMNEngine.getProcessInstanceHistory(filter);
                        self.processParent=res.data[0];
                        await self.getListTaskInProcessCurrent(res.data[0].id,'parentProcess');
                        console.log("ProcessParent", res.data[0]);
                    }else{
                         self.processParent={};
                    }
                }
            } catch (error) {
                self.processInstanceCurrent={};
                self.$snotifyError(error, "Get Process failed");
            }
        },
        async getProcessSub(processInstanceId){
            let self=this;
            try {
                let filter={};
                filter.superProcessInstanceId=processInstanceId;
                let res = await BPMNEngine.getProcessInstanceHistory(filter);
                if (res.total>0) {
                    self.listSubProcessInstance=res.data;
                    await self.getListTaskInProcessCurrent('','subProcess',res.data);
                }else{
                    self.listSubProcessInstance=[];
                }
                console.log("ProcessSub", self.listSubProcessInstance);
            } catch (error) {
                self.listSubProcessInstance=[];
                self.$snotifyError(error, "Get SubProcess failed");
            }
        },
        async getProcessSibling(){
            let self=this;
            try {
                let filter={};
                if (self.processParent.id) {
                    filter.superProcessInstanceId=self.processParent.id;
                    let res = await BPMNEngine.getProcessInstanceHistory(filter);
                    if (res.total>0) {
                        self.listProcessSibling=res.data;
                        await self.getListTaskInProcessCurrent('','siblingProcess',res.data);
                    }else{
                        self.listProcessSibling=[];
                    }
                    console.log("ProcessSibling", self.listSubProcessInstance);
                }else{
                    self.listProcessSibling=[];
                }
            } catch (error) {
                self.listProcessSibling=[];
                self.$snotifyError(error, "Get siblingProcess failed");
            }
           
        }
    },
    created(){
        this.$evtBus.$on("symper-app-wrapper-clicked", evt => {
            if(evt == undefined){
                return;
            }
            if(this._inactive == true) return;
            if (this.statusQuickView) {
                this.statusQuickView=false;
            }
        });
      
        this.getData();

    }
}
</script>

<style scoped>
.single-row:hover{
    background: #e5e5e5;
    cursor: pointer;
}
.quickView:hover{
    text-decoration-line:underline
}

</style>
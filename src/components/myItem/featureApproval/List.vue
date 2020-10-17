<template>
    <div class="list-objects w-100" style="height: calc(100vh - 90px);">
        <v-row style="border-bottom: 1px solid #dedede;margin:0px; height:30px">
            <v-col
                v-if="!sideBySideMode"
                cols="3"
                class="fs-13 pt-1 pl-3 font-weight-medium"
                style="padding:0px; height:30px"
            >{{$t("tasks.header.groupApproval")}}</v-col>
            <v-col 
                :cols="!sideBySideMode ? 9 : 12"
                style="padding:0px; height:30px">
                <v-row style="margin:0px;position: relative; height:30px" >
                    <v-col
                        :cols="!sideBySideMode ? 1 : 1"
                        class="fs-13 pl-1 pt-1 pt-0 pb-0 pr-0 font-weight-medium"
                        style="flex:0!important"
                    >
                        <v-checkbox
                            @click="handleCheckAll"
                            ref="checkBoxAll"
                            :input-value="countRecordSelected == nodeSelected.number_of_task"
                            :indeterminate="countRecordSelected > 0 && countRecordSelected < nodeSelected.number_of_task"
                            class="pa-0 ma-0 checkBox"
                        ></v-checkbox>
                    </v-col>
                    <v-col
                        :cols="!sideBySideMode ? 2 : 2"
                        class="fs-13  pt-1 pb-0 pl-0 font-weight-medium"
                        style="flex: 0 0 25.6667%;max-width: 25.6667%;"
                    >{{$t("tasks.header.name")}}</v-col>
                    <v-col
                        cols="2"
                        v-if="!sideBySideMode"
                        class="fs-13  pt-1 pb-0 font-weight-medium"
                    >{{$t("tasks.header.assignee")}}</v-col>
                    <v-col
                        v-if="!sideBySideMode"
                        cols="2"
                        class="fs-13  pt-1 pb-0 font-weight-medium"
                    >{{$t("tasks.header.owner")}}</v-col>
                    <v-col
                        v-if="!sideBySideMode"
                        cols="2"
                        class="fs-13  pt-1 pb-0 font-weight-medium"
                        style="flex: 0 0 10.666667%;"
                    >{{$t("tasks.header.dueDate")}}</v-col>
                    <v-col
                        v-if="!sideBySideMode"
                        cols="2"
                        class="fs-13 pt-1 pb-0 font-weight-medium"
                    >{{$t("tasks.header.app")}}</v-col>
                    <v-col
                        v-if="!sideBySideMode"
                        cols="1"
                        class="fs-13 pt-1 pb-0 font-weight-medium"
                    >{{$t("common.add")}}</v-col>
                    
                    <!-- <v-btn style="position: absolute;right: 20px;top: 1px;" 
                        v-if="sideBySideMode" small tile icon text  @click="closeDetail">
                        <v-icon small>mdi-close</v-icon>
                    </v-btn> -->
                </v-row>
            </v-col>
        </v-row>
        <v-row class="listDetail" style="margin:0px;height:100%;" >
            <v-col
                v-if="!sideBySideMode"
                cols="3"
                class="pa-0"
                style="height: 100%;"
            >
                <VuePerfectScrollbar
                @ps-y-reach-end="handleReachEndList"
                style="height: calc(100% - 50px);"
                >
                    <div>
                        <v-row
                        v-for="(obj, idx) in listNode"
                        :key="idx"
                        :class="{
                            'mr-0 ml-0 py-2 single-row': true ,
                            'd-active':index==idx || selectObj==idx
                        }"

                        @mouseover="index=idx"
                        @mouseout="index = null"
                        @click="selectObject(obj, idx)"
                    >
                        <div class="pl-2 w-100">
                            <div class="d-flex">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                        <div v-on="on" class="text-left fs-13 pr-6 text-ellipsis w-100">
                                        {{obj.activity_name}}
                                        </div>
                                    </template>
                                <span>{{ obj.activity_name }}</span>
                                </v-tooltip>
                                <span style="margin-right:15px; padding-top:3px">{{obj.number_of_task}}</span>
                            </div>
                       
                            <div class="pa-0 grey--text  lighten-2 d-flex justify-space-between">
                                <div class="fs-11 pr-6 text-ellipsis">
                                    {{obj.process_definition_name}}
                                </div>
                            </div>
                        </div>
                    </v-row>
                    </div>
                </VuePerfectScrollbar>
                <!-- <v-skeleton-loader
                v-if="loadingTaskList"
                ref="skeleton"
                :type="'table-tbody'"
                class="mx-auto"
                ></v-skeleton-loader> -->
            </v-col>
            <v-col
                :cols="!sideBySideMode ? 9 : 12"
                class="pa-0 ma-0"
                height="30"
                style="border-left: 1px solid #e0e0e0;"
            >
                <detailNode 
                    :selectedNode="selectedNode"
                    :nodeInfo="listNode[selectedNode]"
                    :countRecordSelected="Number(countRecordSelected)"
                    :sideBySideMode="sideBySideMode"
                    @changeValueCheckBox="changeValueCheckBox"
                    @changeSideBySide="changeSideBySide"
                    @closeDetail="closeDetail"
                />
            </v-col>
        </v-row>
        
        <v-dialog class="dialog-approval" v-model="dialogApproval" max-width="350">
            <v-card>
            <v-card-title class="headline">{{$t("myItem.alert.title_aproval")}}</v-card-title>
            <v-card-text>Bạn có muốn {{action}} cho {{countRecordSelected}}/{{totalRecord}} bản ghi đã chọn </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="dialogApproval=false">Hủy</v-btn>
                <v-btn color="green darken-1" text @click="approvalMoreTask">Thực thi</v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>

        <BottomSheet :persistent="true" :isShadow="false" ref="bottomSheetView" class="h-100">
            <div slot="content" class="sheet-content d-flex">
                <div class="count-selection" style="padding-top: 15px;">
                    <span style="margin-left: 50px;">{{$t('document.instance.showlist.select')}} {{countRecordSelected}}/{{nodeSelected.number_of_task}} {{$t('document.instance.showlist.record')}}</span>
                </div>
                <div class="sheet-action">
                    <v-btn small depressed v-for="(action, idx) in taskActionBtns" dark :key="idx" :color="action.color" @click="saveTaskOutcome(action.value)" class="mr-2">
                        {{action.text}}
                    </v-btn>
                    <v-btn @click="hideBottomSheet" tile small> {{$t('common.close')}}
                    </v-btn>
                </div>
            </div>
        </BottomSheet>

        </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import detailNode from "./DetailNode";
import { util } from "@/plugins/util";
import BottomSheet from '@/components/common/BottomSheet';
import BPMNEngine from '@/api/BPMNEngine';
import { documentApi } from '@/api/Document';
export default {
    name:"listNodeInProcess",
    components: {
        VuePerfectScrollbar: VuePerfectScrollbar,
        detailNode,
        BottomSheet
       
    },
    props: {
        changeStatusMoreApproval: {
            type: Boolean,
            default: true
        },
    },
    watch:{
        changeStatusMoreApproval(newVl) {
            if (newVl==true) {
                this.getData();
            }
        },
        listNode: {
            immediate: true,
            deep: true,
            handler(){
                if(this.listNode[0]){
                    this.selectObject(this.listNode[0],0);
                }
            }
        },
        countRecordSelected(vl){
            if (vl==0) {
                this.$refs.bottomSheetView.hide(); 
            }else{
                this.$refs.bottomSheetView.show(); 
            }
        }


    },
    computed:{
        stask() {
            return this.$store.state.task;
        },
        listNode(){
            return this.stask.listNodeInProcess;
        }
    },
    data(){
        return{
            isRole:false, //value =falses khi assignee = userId, =true khi assignee = userId:role
            dialogApproval:false,
            sideBySideMode:false,
            index:0,
            selectObj:-1,
            selectedNode:0,
            selectAll:false,
            listTaskHeight: 500,
            countRecordSelected:0,
            totalRecord:0,
            recordSelected:{},
            listTaskInNode:[],
            taskActionBtns: [
            ],
            taskAction: undefined,
            listTaskChecked:[],
            action:"",
            isShowBottom:true,
            nodeSelected:{},
        }
    },
    methods:{
        handleCheckAll(){
            if (this.countRecordSelected==this.nodeSelected.number_of_task) {
                this.countRecordSelected=0;
            }else{
                this.countRecordSelected=this.nodeSelected.number_of_task;

            }

        },
        closeDetail(){
            this.sideBySideMode=false;
        },
        changeSideBySide(value){
            this.sideBySideMode=value;
        },
        getData(){
            this.$store.dispatch("task/getListNodeInProcess");
        },
        selectObject(obj, idx){
            this.countRecordSelected=0;
            this.isShowBottom=true;
            this.selectAll=false;
            this.selectedNode=idx;
            this.selectObj=idx;
            this.totalRecord=obj.number_of_task;
            this.nodeSelected=null;
            this.nodeSelected=obj;
            //this.nodeSelected=obj;
            this.taskActionBtns=[];
        },
        handleReachEndList(){},
        reCalcListTaskHeight() {
            this.listTaskHeight =util.getComponentSize(this.$el.parentElement).h - 125;
        },
        hideBottomSheet(){
            this.$refs.bottomSheetView.toggle();
        },
        changeValueCheckBox(data){
            if (this.isShowBottom) {
                this.$refs.bottomSheetView.show();
                this.listTaskInNode=data;
                let listTaskChecked=[];
                for (var key in data) {
                    if (data[key].checked==true) {
                        listTaskChecked.push(data[key]);
                    }
                }
                this.listTaskChecked=listTaskChecked;
                this.countRecordSelected=listTaskChecked.length;
                this.getActionNode(data[0]);
            }
          
        },
        getActionNode(task){
            let self=this;
            let taskInfo=JSON.parse(task.description);
         
            let varsMap = {};
            self.taskAction = taskInfo.action.action;
            if(self.taskAction == 'approval'){
                self.showApprovalOutcomes(JSON.parse(taskInfo.approvalActions));
            }
        },
        showApprovalOutcomes(approvalActions){
            if(typeof approvalActions == 'string'){
                approvalActions = JSON.parse(approvalActions);
            }
            approvalActions = approvalActions.filter(el => {
                return Boolean(el.value)
            });
           
            this.taskActionBtns = approvalActions;
        },
        saveTaskOutcome(value){
            this.action=value;
            this.dialogApproval=true;
        },
        async approvalMoreTask(){
            this.dialogApproval=false;
            let self=this;
            let value=self.action;
            if (self.listTaskChecked.length>0) {
                for (var key in self.listTaskChecked) {
                    let originData=self.listTaskChecked[key];
                    let taskInfo=JSON.parse(originData.description)
                    let elId = originData.taskDefinitionKey;
                    let taskData = {

                        // action nhận 1 trong 4 giá trị: complete, claim, resolve, delegate
                        "action": "complete",
                        "assignee": "1",
                        // "formDefinitionId": "12345",
                        "outcome": value,
                        "variables": [
                            {
                                name: elId+'_outcome',
                                type: 'string',
                                value: value
                            },
                            {
                                name: elId+'_executor_fullname',
                                type: 'string',
                                value: self.$store.state.app.endUserInfo.displayName
                            },
                            {
                                name: elId+'_executor_id',
                                type: 'string',
                                value: self.$store.state.app.endUserInfo.id
                            },
                        ],
                        // "transientVariables": []
                    }
                    
                    if(this.checkRoleUser(originData)){
                        let res = await self.submitTask(taskData,taskInfo,originData);
                        self.saveApprovalHistory(value,taskInfo);
                        self.$emit('task-submited', res);
                    }else{
                        self.$snotifyError("", "Permission denied!");
                    }
                   
                }
                self.$store.commit("task/setListNodeInProcess",[]);
                self.getData();
                self.selectedNode=0;
                self.sideBySideMode=false;
            }
        },

        async submitTask(taskData,taskInfo,originData){
            let self = this;
            if (this.isRole==false) { // isRole == false thi update task cập nhật role hiện tại
                await this.updateTask(originData);
            }
            return new Promise(async (resolve, reject) => {
                try {
                    let taskId = taskInfo.action.parameter.taskId;
                    let result = await BPMNEngine.actionOnTask(taskId, taskData);   
                    self.$snotifySuccess("Task completed!");
                    resolve(result);
                } catch (error) {
                    let detail = '';
                    if(error.responseText){
                        detail = JSON.parse(error.responseText);
                        detail = detail.exception;
                    }
                    self.$snotifyError(error, "Can not submit task!", detail);
                    reject(error);
                }
            });
            
        },
        checkRoleUser(originData){
            let self=this;
            if (originData.assignee.indexOf(":")>0) {
                let arrDataAssignee=originData.assignee.split(":");
                let assigneeId=arrDataAssignee[0];
                let roleIdentify=originData.assignee.slice(assigneeId.length);
                // ktra enduser có tồn tại role trong assignee không
                let rolesUser=self.$store.state.app.endUserInfo.roles;
                let role=rolesUser[arrDataAssignee[1]].find(element => element.id==originData.assignee);
                if (role) {
                    self.isRole=true;
                    return true;
                }else{
                    return false;
                }
            }else{
                self.isRole=false;
                return true;
            }
        },
        async updateTask(originData) {
            let data = {};
            data.assignee=this.$store.state.app.endUserInfo.id+":"+this.$store.state.app.endUserInfo.currentRole.id;
            let taskId=originData.id;
            await BPMNEngine.updateTask(taskId,data);
        },
        saveApprovalHistory(value,taskInfo){
            let title = this.taskActionBtns.reduce((tt, el) => {
                if(el.value == value){
                    tt = el.text;
                }
                return tt;
            }, '');

            let dataToSave = {
                objectId: taskInfo.action.parameter.documentObjectId,
                userId: this.$store.state.app.endUserInfo.id,
                actionTitle: title,
                actionName: value,
                note: ''
            };
            documentApi.saveApprovalHistory(dataToSave);
        },
    },
    created(){
        this.getData();
    },
    mounted() {
        let self = this;
        this.$store
        .dispatch("process/getAllDefinitions")
        .then(res => {
            self.getTasks();
        })
        .catch(err => {});
        self.reCalcListTaskHeight();
       // self.$refs.bottomSheetView.toggle();
    },
    activated(){
        this.selectAll=false;
        this.isShowBottom=false;
    }
}
</script>

<style scoped>

.d-active {
  background: #f5f5f5;
}
.checkBox{
    height: 22px;
}

.sheet-action{
    margin-left: auto;
}

.sheet-action >>> button{
    margin: 6px 8px !important;
    border-radius: 4px;
    box-shadow: none;
}
.sheet-action >>> button:last-child{
    color: red;
}

</style>
<template>
    <div class="w-100" style="height: 100%">
        <v-skeleton-loader
            v-if="loadingActionTask"
            :type="'table-tbody'"
            class="mx-auto"
            width="100%" height="100%" 
        ></v-skeleton-loader>
        <v-row class="ml-0 mr-0 justify-space-between task-header" id="taskHeader" style="line-height: 36px;height:44px">
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <div v-on="on" class="fs-13 pl-2 pt-1 float-left text-ellipsis" :style="{'width':widthInfoTask+'px'}"> 
                        {{taskBreadcrumb}}
                    </div>
                </template>
                <span>{{taskBreadcrumb}}</span>
            </v-tooltip>
            <div id="action-task" class="text-right pt-1 pb-1 pr-0 float-right">
                <span v-if="!originData.endTime && !hideActionTask ">
                    <span v-if="checkRole(originData.assigneeInfo.id)==true">
                        <v-btn small depressed  v-for="(action, idx) in taskActionBtns" dark :key="idx" :color="action.color" @click="saveTaskOutcome(action.value)" class="mr-2">
                            {{action.text}}
                        </v-btn>
                    </span>
                    <span v-else>
                        <v-btn small depressed disabled v-for="(action, idx) in taskActionBtns"  :key="idx" :color="action.color"  class="mr-2">
                            {{action.text}}
                        </v-btn>

                    </span>
                  
                </span>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn  
                            style="color:green"
                            v-on="on" text small
                            @click="toggleSidebar"
                            >
                                Xem chi tiết
                        </v-btn>
                    </template>
                    <span>Xem chi tiết</span>
                </v-tooltip>
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-btn  
                            icon
                            tile
                            v-clipboard:copy="linkTask"  
                            v-clipboard:success="onCopySuccess" 
                            v-on="on" text small>
                                <v-icon  small>mdi-page-next-outline</v-icon>
                        </v-btn>
                    </template>
                    <span>Sao chép đường dẫn</span>
                </v-tooltip>
                <v-tooltip bottom v-if="checkShowEditRecord()">
                    <template v-slot:activator="{ on }">
                        <v-btn  
                            @click="showUpdateSubmitedDocument()"
                            icon
                            tile
                            v-on="on" text small>
                                <v-icon  small>mdi-pencil-circle-outline</v-icon>
                        </v-btn>
                    </template>
                    <span>Sửa nội dung văn bản</span>
                </v-tooltip>
                <!-- <button @click="getTaskTest">Click</button> -->
                <v-btn small tile icon text  @click="closeDetail">
                    <v-icon small>mdi-close</v-icon>
                </v-btn>
            </div>
        </v-row>
        <v-divider style="border-color: #dedede;"></v-divider>
        <v-row class="ma-0 detail-task" style="height: calc(100% - 44px);">
            <!-- <VuePerfectScrollbar :style="{height: parentHeight +'px'}" > -->
                <task 
                    @task-submited="handleTaskSubmited" 
                    :is="`task`"
                    :taskInfo="taskInfo"
                    :appId="appId"
                    :isShowSidebar="isShowSidebar"
                    :originData="originData"
                    :tabsData="tabsData['people']"
                    @changeUpdateAsignee="changeUpdateAsignee"
                    :definitionName="breadcrumb.definitionName"
                    :ref="`task`"
                  >
                </task>
            <!-- </VuePerfectScrollbar> -->
        </v-row>
        <v-dialog v-model="showDialogAlert" max-width="350">
            <v-card>
            <v-card-title class="headline">{{$t("myItem.alert.title_aproval")}}</v-card-title>
            <v-card-text>{{$t("myItem.alert.contentPermissionDenied")}}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="showDialogAlert=false">Ok</v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import icon from "../../components/common/SymperIcon";
import attachment from "./Attachment";
import comment from "./Comment";
import flow from "./Flow";
import info from "./Info";
import people from "./People";
import relatedItems from "./RelatedItems";
import subtask from "./Subtask";
import task from "./Task";
import BPMNEngine from '../../api/BPMNEngine';
import { getVarsFromSubmitedDoc, getProcessInstanceVarsMap } from '../../components/process/processAction';
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { documentApi } from '../../api/Document';
import { appManagementApi } from '@/api/AppManagement';

import VueClipboard from 'vue-clipboard2';


Vue.use(VueClipboard)
export default {
    name: "taskDetail",
    props: {
        // Thông tin của một task, cấu trúc giống như một item khi lấy danh sách task
        taskInfo: {
            type: Object,
            default: () => {
                return {}
            }
        },
        originData: {
            type: Object,
            default: () => {
                let self = this;
                return {
                    assigneeInfo: {
                        id: 0
                    }
                }
            }
        },
        isInitInstance: {
            type: Boolean,
            default: false
        },
        parentHeight: {
            type: Number,
            default: 300
        },
        hideActionTask:{
            type: Boolean,
            default: false
        },
        allVariableProcess:{
            type:Array,
            default: () => {
                return []
            }
        },
        appId:{
            type:String,
            default:''
        }
    },
    watch: {
        taskInfo: {
            deep: true,
            immediate:true,
            handler(valueAfter){
                this.changeTaskDetail();
                this.setCustomDocControls();
            }
        },
        taskBreadcrumb:function(){
            this.getWidthHeaderTask();
        },
        "sapp.collapseSideBar": function(newVl) {
            this.getWidthHeaderTask();
        }
    },
    components: {
        icon: icon,
        attachment, comment, flow, info, people, relatedItems, subtask, task,
        VuePerfectScrollbar
    },
    data: function() {
        return {
            showDialogAlert:false,
            isRole:false, //value =falses khi assignee = userId, =true khi assignee = userId:role
            widthInfoTask:330,
            isShowSidebar:false,
            loadingActionTask:false,
            breadcrumb: {
                appName:'',
                definitionName: '',
                instanceName: '',
                taskName: ''
            },
            descriptionTask:'',
            tabsData: {
                people: {
                    assignee: [],
                    owner: [],
                    participant: [],
                    watcher: []
                },
                task: {},
                'sub-task': {},
                attachment: {},
                comment: {},
                info: {},
                'related-items': {}
            },
            linkTask:'',
            taskActionBtns: [
                {
                    text:"Submit",
                    value:"submit",
                    color:"blue"
                },
            ],
            taskAction: undefined,
            tab: null,
            
        }
    },
    computed: {
        stask() {
            return this.$store.state.task;
        },
        sapp() {
            return this.$store.state.app;
        },
        usersMap(){
            return this.$store.state.app.allUsers.reduce((map, el) => {
                map[el.id] = el;
                return map;
            }, {});
        },
        taskBreadcrumb(){
            let bsr = this.breadcrumb.taskName;
            let allDef = this.$store.state.process.allDefinitions;
            if(this.breadcrumb.definitionName){
                if (this.breadcrumb.appName && this.breadcrumb.appName!= '') {
                    bsr = `${this.breadcrumb.appName} / ${this.breadcrumb.definitionName} / ${bsr}`;
                }else{
                    bsr = `${this.breadcrumb.definitionName} / ${bsr}`;
                }
            }else if(this.isInitInstance && !$.isEmptyObject(allDef)){
                if(allDef[this.$route.params.id]){
                    bsr = `${allDef[this.$route.params.id].name} / Start workflow`;
                }else{
                    bsr = `... / Start workflow`;
                }
            }
            return bsr;
        },
    },
    created(){
        this.checkAndSwitchToTab();
    },
    methods: {
        getWidthHeaderTask(){
            setTimeout((self) => {
                let width=$("#taskHeader").width()-$("#action-task").width()-40;
                self.widthInfoTask=width;
            }, 210,this);
        },
        checkShowEditRecord(){
            let taskInfo = this.taskInfo;
            if(this.originData){
                let isPendding = !this.originData.endTime;
                let isApprovalTask = taskInfo.action.action == 'approval';
                let hasEditableControls = !taskInfo.approvalEditableControls || (taskInfo.approvalEditableControls && taskInfo.approvalEditableControls.length);
                return isPendding && isApprovalTask && hasEditableControls;
            }
        },
        checkRole(assigneeId){
            
            if (assigneeId==this.$store.state.app.endUserInfo.id) {
                return true;
            }else{
                return false;
            }
        },
        setCustomDocControls(){
            let editableControls = this.taskInfo.approvalEditableControls;
            if(editableControls && $.isArray(editableControls)){
                for(let ctrl of editableControls){
                    if(ctrl == 'SYMPER_NONE_CONTROLS'){
                        editableControls = [];
                        break;
                    }else if(ctrl == 'SYMPER_ALL_CONTROLS'){
                        editableControls = null;
                        break;
                    }
                }
            }
            this.taskInfo.approvalEditableControls = editableControls;
        },
        showUpdateSubmitedDocument(){
            this.$refs.task.showUpdateSubmitedDocument = true;
        },
        changeUpdateAsignee(){
            this.$emit('changeUpdateAsignee');
        },
        toggleSidebar(){
            this.isShowSidebar = !this.isShowSidebar;
        },
        checkAndSwitchToTab(){
            if(this.$route.params.extraData && this.$route.params.extraData.subAction){
                let tabAction = {
                    'view_comment': 'comment'
                };
                let tab = tabAction[this.$route.params.extraData.subAction];
                for(let i = 0; i < this.items.length; i++){
                    if(this.items[i].tab == tab){
                        this.tab = i;
                        break;
                    }
                }
            }
        },
        onCopySuccess(){
           this.$snotify({
                type: 'success',
                title: "Copy to clipboard",
                text: "Copy success"
                });
        },
        changeTaskDetailInfo(taskId){
            let hostname=window.location.hostname;
            let copyText = this.taskInfo.action.parameter.taskId;
            copyText='https://'+hostname+'/#/myitem/tasks/'+copyText;
            this.linkTask=copyText;

            if(!taskId){
                return;
            }
            let self = this;
            let filter = this.stask.filter;
            BPMNEngine.getATaskInfo(taskId,filter).then((res) => {
                console.log(res,"task");
                for(let role in self.tabsData.people){
                    self.tabsData.people[role]=[];
                    if(res[role]){
                        let userIdentifier=res[role];
                        if (userIdentifier.indexOf(":")>0){
                            userIdentifier=(userIdentifier.split(":"))[0];
                        }
                        self.tabsData.people[role] =userIdentifier.split(',').reduce((arr, el) => {
                            if(self.usersMap[el]){
                                arr.push(self.usersMap[el]);
                            }else{
                                console.warn('user id not found : ', el);
                            }
                            return arr;
                        }, []);
                    }
                }
                self.setTaskBreadcrumb(res);
            });
        },
        setTaskBreadcrumb(task){
            if(!task.name){
                try {
                    task.description = JSON.parse(task.description);
                  
                } catch (error) {
                    task.description = {};
                }
                task.name = task.description.content;
            }

            this.descriptionTask=task.description;
            this.breadcrumb.taskName = task.name;
            if(task.processDefinitionId){
                let processDefinitionId=task.processDefinitionId;
		        var arrProcessDefinitionId = processDefinitionId.split(":"); //tách chuỗi để lấy DefinitionKey
                this.breadcrumb.definitionName = this.$store.state.process.allDefinitions[arrProcessDefinitionId[0]].name;
                this.breadcrumb.instanceName = this.taskInfo.extraLabel+' '+this.taskInfo.extraValue;
            }else{
                this.breadcrumb.definitionName = '';
                this.breadcrumb.instanceName = '';
            }
            if (task.processInstanceId && task.processInstanceId!=null) {
                this.getAppName(task.processInstanceId);
            }
        },
        async getAppName(processInstanceId){
            let self=this;
            if (this.appId) {
                if (this.$store.state.task.allAppActive.length==0) {
                    await self.$store.dispatch("task/getAllAppActive");
                }
                let allApp = this.$store.state.task.allAppActive;
                let app=allApp.find(element => element.id== self.appId);
                if (app) {
                    self.breadcrumb.appName=app.name;
                }else{
                    self.breadcrumb.appName= "";
                }
            }else{
                const dataVariable = this.allVariableProcess.find(element => element.processInstanceId===processInstanceId);
                if (dataVariable) {
                    self.appId=dataVariable.value;
                    if (this.$store.state.task.allAppActive.length==0) {
                        await self.$store.dispatch("task/getAllAppActive");
                    }
                    let allApp = this.$store.state.task.allAppActive;
                    let app=allApp.find(element => element.id== self.appId);
                    if (app) {
                        self.breadcrumb.appName=app.name;
                    }else{
                        self.breadcrumb.appName= "";
                    }
                }else{
                    self.breadcrumb.appName="";
                }
            }
           
        },
        closeDetail() {
            this.$emit("close-detail", {});
        },
        async saveTaskOutcome(value){ // hành động khi người dùng submit task của họ
            //check xem user có phải assignee
            // kiểm tra xem user hiện tại có role được phân quyền trong task không? 
            if (this.$store.state.app.endUserInfo.id != this.originData.assigneeInfo.id) {
                this.showDialogAlert=true;
            }else if(this.checkRoleUser(this.originData)){
                this.loadingActionTask=true;
                    if(this.taskAction == 'submit' || this.taskAction == 'update' ){
                        this.$refs.task.submitForm(value);
                    }else if(this.taskAction == 'approval'){
                        let elId = this.originData.taskDefinitionKey;
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
                                    value: this.$store.state.app.endUserInfo.displayName
                                },
                                {
                                    name: elId+'_executor_id',
                                    type: 'string',
                                    value: this.$store.state.app.endUserInfo.id
                                },
                            ],
                            // "transientVariables": []
                        }
                        let res = await this.submitTask(taskData);
                        this.saveApprovalHistory(value);
                        this.$emit('task-submited', res);
                    }else if(this.taskAction == '' ||this.taskAction==undefined ||this.taskAction == 'submitAdhocTask'){
                        let taskData = {
                            "action": "complete",
                            "outcome": value,
                        }
                        let res = await this.submitTask(taskData);
                        this.$emit('task-submited', res);
                    }
            }else{
                this.showDialogAlert=true;
            }
            this.loadingActionTask=false;
        },
        saveApprovalHistory(value){
            let title = this.taskActionBtns.reduce((tt, el) => {
                if(el.value == value){
                    tt = el.text;
                }
                return tt;
            }, '');

            let dataToSave = {
                objectId: this.taskInfo.action.parameter.documentObjectId,
                userId: this.$store.state.app.endUserInfo.id,
                actionTitle: title,
                actionName: value,
                note: ''
            };
            documentApi.saveApprovalHistory(dataToSave);
        },
        async submitTask(taskData){
            let self = this;
            if (this.taskAction=='submit' || this.isRole==false) { // isRole == false thi update task cập nhật role hiện tại
                await this.updateTask(taskData);
            }
            return new Promise(async (resolve, reject) => {
                try {
                    let taskId = self.taskInfo.action.parameter.taskId;
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
        async checkRoleUser(originData){
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
                    self.isRole=false;
                    return false;
                }
            }else{
                self.isRole=false;
                return true;
            }
        },
        async updateTask(taskData) {
            let data = {};
            if (this.isRole==false) {
                data.assignee=this.$store.state.app.endUserInfo.id+":"+this.$store.state.app.endUserInfo.currentRole.id;
            }
            if (this.taskAction=='submit') { // khi submit task
                let description;
                if ((typeof this.descriptionTask)=="string" ) {
                    description=JSON.parse(this.descriptionTask) ;
                }else{
                    description=this.descriptionTask;
                }
                description.action.parameter.documentObjectId=taskData.variables[0].value;
                data.description= JSON.stringify(description);
            }
          
            let taskId=this.originData.id;
            return BPMNEngine.updateTask(taskId,data);
        },
        async handleTaskSubmited(data){
            if(this.isInitInstance){
                this.$emit('task-submited', data);            
            }else{
                let elId = this.taskInfo.action.parameter.activityId;
                let docId = data.document_id;
                if(!docId){
                    docId = this.taskInfo.action.parameter.documentId;
                }
                let varsForBackend = await getVarsFromSubmitedDoc(data, elId, docId);
                let taskData = { 
                    // action nhận 1 trong 4 giá trị: complete, claim, resolve, delegate
                    "action": "complete", 
                    "assignee": "1",
                    "outcome": 'submit',
                    "variables": varsForBackend.vars,
                }
                let res =  await this.submitTask(taskData);
                this.$emit('task-submited', res);
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

        // lấy data mới dựa theo data của task
        async changeTaskDetail(){
            let self=this;
            if(!self.taskInfo.action){
                return
            }
            let varsMap = {};
            self.taskAction = self.taskInfo.action.action;
            if(self.taskAction == 'approval'){
                self.showApprovalOutcomes(JSON.parse(self.taskInfo.approvalActions));
            }else if(self.taskAction == 'submit' || self.taskAction == 'submitAdhocTask'){
                self.taskActionBtns = [
                    {
                    text:"Submit",
                    value:"submit",
                    color:"blue"
                    }
                ]
            }else if(self.taskAction == 'undefined' ){
                self.taskActionBtns = [
                    {
                        text:"Complete",
                        value:"complete",
                        color:"green"
                    }
                ]
            }
            self.changeTaskDetailInfo(self.taskInfo.action.parameter.taskId);
        }
    }
}
</script>

<style scoped>
.v-tab{
    padding: 0px!important;
    border-width: 20px!important;
    text-transform: none !important;

}
.task-header{
    position: relative;
}
.task-header #action-task{
    position: absolute;
    right: 10px;
}

</style>
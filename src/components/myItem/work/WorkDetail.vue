<template>
    <div class="h-100 w-100">
        <v-skeleton-loader
            v-if="loadingAction"
            :type="'table-tbody'"
            class="mx-auto"
            width="100%" height="100%" 
        ></v-skeleton-loader>
        <v-row class="ml-0 mr-0 justify-space-between" style="line-height: 36px;">
            <div class="fs-13 pl-2 pt-1 float-left">
                <v-icon v-if="statusDetailWork" @click="backToListWork">mdi-chevron-left</v-icon> 
                {{taskBreadcrumb}}
            </div>
            <div class="text-right pt-1 pb-1 pr-0 float-right">
                <v-menu
                    :close-on-content-click="false"
                    :close-on-click="closeOnClick"
                    offset-y
                    class="mr-2"
                    style="z-index:1000!important"
                >
                    <template v-slot:activator="{ on }">
                        <v-btn v-on="on"  depressed class="mr-2" small>
                            <v-icon size="18">mdi-filter-menu-outline</v-icon>
                            <span class="ml-2">{{$t('myItem.filterObj')}}</span>
                        </v-btn>
                    </template>
                    <v-list>
                    <v-list-item v-for="(item, index) in objectType" :key="index" @click="changeObjectType(index)">
                        <v-list-item-title> {{ item.title }}</v-list-item-title>
                    </v-list-item>
                    </v-list>
                </v-menu>
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
                <v-btn small text  @click="closeDetail">
                    <v-icon small>mdi-close</v-icon>
                </v-btn>

            </div>
        </v-row>
        <v-divider style="border-color: #bebebe;"></v-divider>
        <div class="detail-work" style="height:100%" v-if="filterObject==0 && statusDetailWork==false">
            <v-row class="ma-0">
                <v-col cols="12" class="list-tasks pt-0 pb-0">
                    <v-row>
                        <v-col
                            cols=4
                            class="pl-3 fs-13 font-weight-medium"
                        >{{$t("tasks.header.name")}}</v-col>
                        <v-col
                            cols="2"
                            class="fs-13 font-weight-medium"
                        >{{$t("tasks.header.userCreate")}}</v-col>
                        <v-col
                            cols="2"
                            class="fs-13 font-weight-medium"
                        >{{$t("tasks.header.createDate")}}</v-col>

                        <v-col
                            cols="4"
                            class="fs-13 font-weight-medium"
                        >{{$t("tasks.header.app")}}</v-col>
                    </v-row>
                </v-col>
                <v-divider></v-divider>
            </v-row>
            <VuePerfectScrollbar
            @ps-y-reach-end="handleReachEndList"
            style="height:calc(100% - 160px);"
            >
                <v-expansion-panels
                    v-model="panel"
                    multiple
                    class="listWork"
                    style="overflow: hidden;"
                >
                    <v-expansion-panel>
                        <v-expansion-panel-header class="v-expand-header">{{$t('myItem.work.parentWork')}}</v-expansion-panel-header>
                        <v-expansion-panel-content class="sym-v-expand-content">
                            <v-row 
                                class="item-work" 
                                v-if="processParent.id"
                                :class="{
                                    'd-active':indexObj==-69
                                }"
                                @mouseover="indexObj=-69"
                                @mouseout="indexObj = null"
                                @dblclick="selectedWork(processParent)"
                            >
                                <v-col
                                    cols="4"
                                    class="pl-3 fs-13 "
                                >
                                    <div class="pa-0 lighten-2 d-flex justify-space-between">
                                        <div
                                            class="fs-13 text-ellipsis w-100"
                                        >
                                            <v-icon v-if="processParent.endTime && processParent.endTime!=null" style="font-size:11px; color:green;margin-left: 3px;padding-bottom: 3px;">mdi-circle</v-icon>
                                            <v-icon v-else style="font-size:11px ; color:blue;margin-left: 3px;padding-bottom: 3px;">mdi-circle</v-icon>
                                        {{ processParent.name}}
                                        </div>
                                        <div class="fs-11 py-0 " style="width:200px;margin-top: 4px;">
                                            <v-icon class="grey--text lighten-2 ml-1" x-small>mdi-clock-time-nine-outline</v-icon>
                                            {{processParent.startTime ? $moment(processParent.startTime).format('DD/MM/YY HH:mm:ss'):$moment(processParent.endTime).format('DD/MM/YY HH:mm:ss')}}
                                        </div>
                                    </div>
                                </v-col>
                                <v-col
                                    cols="2"
                                    class="fs-13 "
                                >  
                                    <symperAvatar :size="20"  />
                                    {{processParent.startUserId}}
                                </v-col>
                                <v-col
                                    cols="2"
                                    class="fs-13 "
                                >
                                    <span class="mt-1">{{processParent.startTime ==null? '':$moment(processParent.startTime).fromNow()}}</span>
                                </v-col>

                                <v-col
                                    cols="4"
                                    class="fs-13 "
                                >
                                    <span class="mt-1 title-quytrinh">{{processParent.processDefinitionName}}</span>
                                </v-col>
                            </v-row>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    
                    <v-expansion-panel>
                        <v-expansion-panel-header class="v-expand-header">{{$t('myItem.work.siblingWork')}}</v-expansion-panel-header>
                        <v-expansion-panel-content class="sym-v-expand-content">
                            <div v-if="processSibling.length>0">
                                <v-row    
                                    class="item-work" 
                                    v-for="(obj, idx) in processSibling"
                                    :key="idx" 
                                    @mouseover="indexObj=idx"
                                    @mouseout="indexObj = null"
                                    @dblclick="selectedWork(obj)"
                                    :class="{
                                        'd-active':indexObj==idx
                                    }"
                                    >
                                    <v-col
                                        cols="4"
                                        class="pl-3 fs-13 "
                                    >
                                        <div class="pa-0 lighten-2 d-flex justify-space-between">
                                            <div
                                                class="fs-13 text-ellipsis w-100"
                                            >
                                                <v-icon v-if="obj.endTime && obj.endTime!=null" style="font-size:11px; color:green;margin-left: 3px;padding-bottom: 3px;">mdi-circle</v-icon>
                                                <v-icon v-else style="font-size:11px ; color:blue;margin-left: 3px;padding-bottom: 3px;">mdi-circle</v-icon>
                                            {{ obj.name}}
                                            </div>

                                            <div class="fs-11 py-0 " style="width:200px;margin-top: 4px;">
                                                <v-icon class="grey--text lighten-2 ml-1" x-small>mdi-clock-time-nine-outline</v-icon>
                                                {{obj.startTime ? $moment(obj.startTime).format('DD/MM/YY HH:mm:ss'):$moment(obj.endTime).format('DD/MM/YY HH:mm:ss')}}
                                            </div>
                                        </div>
                                    </v-col>
                                    <v-col
                                        cols="2"
                                        class="fs-13 "
                                    >  
                                        <symperAvatar :size="20"  />
                                        {{obj.startUserId}}
                                    </v-col>
                                    <v-col
                                        cols="2"
                                        class="fs-13 "
                                    >
                                        <span class="mt-1">{{processParent.startTime ==null? '':$moment(processParent.startTime).fromNow()}}</span>
                                    </v-col>

                                    <v-col
                                        cols="4"
                                        class="fs-13 "
                                    >
                                        <span class="mt-1 title-quytrinh">{{processParent.processDefinitionName}}</span>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>

                    <v-expansion-panel>
                        <v-expansion-panel-header class="v-expand-header">{{$t('myItem.work.subWork')}}</v-expansion-panel-header>
                        <v-expansion-panel-content class="sym-v-expand-content">
                            <div v-if="processSub.length>0">
                                <v-row    
                                    class="item-work" 
                                    v-for="(obj, idx) in processSub"
                                    :key="idx" 
                                    @mouseover="indexSub=idx"
                                    @mouseout="indexSub = null"
                                    @dblclick="selectedWork(obj)"
                                    :class="{
                                        'd-active':indexSub==idx
                                    }"
                                >
                                    <v-col
                                        cols="4"
                                        class="pl-3 fs-13 "
                                    >
                                        <div class="pa-0 lighten-2 d-flex justify-space-between">
                                            <div
                                                class="fs-13 text-ellipsis w-100"
                                            >
                                                <v-icon v-if="obj.endTime && obj.endTime!=null" style="font-size:11px; color:green;margin-left: 3px;padding-bottom: 3px;">mdi-circle</v-icon>
                                                <v-icon v-else style="font-size:11px ; color:blue;margin-left: 3px;padding-bottom: 3px;">mdi-circle</v-icon>
                                            {{ obj.name}}
                                            </div>

                                            <div class="fs-11 py-0 " style="width:200px;margin-top: 4px;">
                                                <v-icon class="grey--text lighten-2 ml-1" x-small>mdi-clock-time-nine-outline</v-icon>
                                                {{obj.startTime ? $moment(obj.startTime).format('DD/MM/YY HH:mm:ss'):$moment(obj.endTime).format('DD/MM/YY HH:mm:ss')}}
                                            </div>
                                        </div>
                                    </v-col>
                                    <v-col
                                        cols="2"
                                        class="fs-13 "
                                    >  
                                        <symperAvatar :size="20"  />
                                        {{obj.startUserId}}
                                    </v-col>
                                    <v-col
                                        cols="2"
                                        class="fs-13 "
                                    >
                                        <span class="mt-1">{{processParent.startTime ==null? '':$moment(processParent.startTime).fromNow()}}</span>
                                    </v-col>
                                    <v-col
                                        cols="4"
                                        class="fs-13 "
                                    >
                                        <span class="mt-1 title-quytrinh">{{processParent.processDefinitionName}}</span>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </VuePerfectScrollbar>
        </div>
        <div v-else-if="filterObject==1 && statusDetailWork==false">
            <listTask 
                :listTask="listTaskCurrent"
            />
        </div>
        <div v-if="statusDetailWork">
            <workDetailSub 
                :workId="idWorkSelected"
            />
        </div>
        <SideBarDetail
            :sidebarWidth="sidebarWidth"  
            :isShowSidebar="isShowSidebar"
            :objSideBar="`work`"
            :workInfo="workInfo"
            @showContentFile="showContentFile"
            @showPopupTracking="showPopupTracking"
        />
        <KHShowFile
            @downloadOrBackupFile="downloadOrBackupFile"
            v-bind:fileId="fileId"
            v-bind:name="name"
            v-bind:serverPath="serverPath"
            v-bind:type="type"
        />
        <PopupProcessTracking 
            :workInfo="workInfo"
            :definitionName="breadcrumb.definitionName"
            :showType="`work`"
        />
       
    </div>
</template>

<script>
import icon from "@/components/common/SymperIcon";
import BPMNEngine from "@/api/BPMNEngine.js";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { appManagementApi } from '@/api/AppManagement';
import symperAvatar from "@/components/common/SymperAvatar.vue";
import listTask from "./ListTask";
import workDetailSub from "./WorkDetailSub";
import SideBarDetail from "./SideBarDetail";
import KHShowFile from "@/components/kh/KHShowImage";
import { taskApi } from "@/api/task.js";
import PopupProcessTracking from '../PopupProcessTracking'

import {
  extractTaskInfoFromObject,
  addMoreInfoToTask
} from "@/components/process/processAction";

export default {
    name: "WorkDetail",
    props: {
        workInfo: {
            type: Object,
            default: () => {
                return {}
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
    },
    watch: {
        workInfo: {
            deep: true,
            immediate:true,
            handler(valueAfter){
                this.changeWorkDetail();
            }
        },

    },
    components: {
        icon: icon,
        listTask,
        VuePerfectScrollbar,
        symperAvatar,
        workDetailSub,
        SideBarDetail,
        KHShowFile,
        PopupProcessTracking
    },
    data: function() {
        return {
            fileId: "",
			serverPath: "",
			name: "",
			type: "",
            sidebarWidth:400,
            filterObject:0,
            indexObj:null,
            indexSub:null,
            panel: [0, 1, 2, 3, 4],
            closeOnClick: true,
            appId:'',
            isShowSidebar:false,
            loadingAction:false,
            breadcrumb: {
                appName:'',
                definitionName: '',
                instanceName: '',
                name: ''
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
            objectType:[
                {
                    title: "Work",
                    icon: "mdi-briefcase-check-outline"
                },
                {
                    title: "Task",
                    icon: "mdi-check-all"
                }
               
            ],
            processParent:{},
            listTaskCurrent:[],
            processSibling:[],
            processSub:[],
            statusDetailWork:false,
            idWorkSelected:null
        }
    },
    computed: {
        stask() {
            return this.$store.state.task;
        },
        usersMap(){
            return this.$store.state.app.allUsers.reduce((map, el) => {
                map[el.id] = el;
                return map;
            }, {});
        },
        taskBreadcrumb(){
            let bsr = this.breadcrumb.name;
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
        listTaskComputed(){
            let self=this;
            let arrListTask=this.listTaskCurrent;
            arrListTask.forEach(task => {
                task.taskData = self.getTaskData(task);
                task = addMoreInfoToTask(task);
            });
            return arrListTask;
        }

    },
    created(){
    },
    methods: {
        showContentFile(data){
            this.serverPath = data.serverPath;
			this.name = data.name;
			this.type = data.type;
			this.fileId = data.id;
            this.$store.commit("kh/changeStatusShowImage", true);
        },
        downloadOrBackupFile(data) {
			this.downLoadFile(data.fileId);
        },
        downLoadFile(id) {
			taskApi
			.downloadFile(id)
			.then(res => {})
			.catch(err => {
			console.log("error download file!!!", err);
			})
			.always(() => {});
		},
        showPopupTracking(){
            this.$store.commit("task/setStatusPopupTracking",true)
        },
        toggleSidebar(){
            this.isShowSidebar = !this.isShowSidebar;
        },
        backToListWork(){
            this.statusDetailWork=false;
            this.setTaskBreadcrumb({},'');
        },
        handleReachEndList(){},
        changeObjectType(index){
            this.filterObject=index;
            this.statusDetailWork=false;
        },
        toggleSidebar(){
            this.isShowSidebar = !this.isShowSidebar;
        },
        onCopySuccess(){
           this.$snotify({
                type: 'success',
                title: "Copy to clipboard",
                text: "Copy success"
                });
        },
        getTaskData(task) {
            let rsl = {
                content: "",
                extraLabel: "",
                extraValue: ""
            };
            try {
                let taskData = JSON.parse(task.description);
                if (taskData) {
                rsl = taskData;
                }
            } catch (error) {
                rsl.content = task.description;
            }
            return rsl;
        },
        selectedWork(obj){
            this.statusDetailWork=true;
            this.idWorkSelected=obj.id;
            this.setTaskBreadcrumb(obj,"workDetail");
        },
        async setTaskBreadcrumb(processInstance={},isCheck=""){
            if (isCheck=="") { // set for work
                this.breadcrumb.name = this.workInfo.name;
                this.breadcrumb.definitionName=this.workInfo.processDefinitionName;
                await this.getProcessInstanceVars(this.workInfo.id);
            }else{
                this.breadcrumb.name = processInstance.name;
                this.breadcrumb.definitionName=processInstance.processDefinitionName;
                await this.getProcessInstanceVars(processInstance.id);
            }
        },
        async getProcessInstanceVars(processInstanceId){
            let self=this;
            await BPMNEngine.getProcessInstanceVars(processInstanceId).then((res) => {
                const symperAppId = res.find(element => element.name=='symper_application_id');
                    if (symperAppId) {
                        self.appId=symperAppId.value;
                        console.log(res,"symperApp");
                    }else{
                        self.appId='';
                    }
            }).catch(()=>{
                self.appId='';
            });

            if (this.appId!=-1 && this.appId!="") {
                await appManagementApi.getAppDetails(Number(this.appId)).then((res) => {
                    console.log(res,"Appdetail");
                    self.breadcrumb.appName=res.data.listObject.name;
                }).catch(()=>{
                    self.breadcrumb.appName=null;
                });
            }else{
                self.breadcrumb.appName=null;
            }
        },
        closeDetail() {
            this.$emit("close-detail", {});
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
        async changeWorkDetail(){
            let self=this;
            if(!this.workInfo){
                return
            }
            let processInstanceCurrent=self.workInfo.id;
            await self.getTaskCurrent(processInstanceCurrent);// get process parent
            if (self.workInfo.superProcessInstanceId && self.workInfo.superProcessInstanceId !=null) {
                await self.getParentWork(self.workInfo.superProcessInstanceId)
                await self.getSiblingOrSubWork(self.workInfo.superProcessInstanceId,'siblingWork');
            }else{
                self.processParent=[];
                self.processSibling=[];
            }
            await self.getSiblingOrSubWork(processInstanceCurrent,"subWork");
          
            this.setTaskBreadcrumb();
        },
        async getParentWork(superProcessInstanceId){
            let self=this;
            try {
                let filter={};
                filter.processInstanceId=superProcessInstanceId;
                let res = await BPMNEngine.getProcessInstanceHistory(filter);
                self.processParent=res.data[0];
                console.log("ProcessParent", res.data[0]);
            } catch (error) {
                self.processParent=[];
                self.$snotifyError(error, "Get Process Parent failed");
            }
        },
        async getTaskCurrent(processInstanceId){
            let self=this;
            try {
                let filter={};
                filter.processInstanceId=processInstanceId;
                let res = await BPMNEngine.postTaskHistory(filter);
                if (res.total>0) {
                    self.listTaskCurrent=res.data;
                }else{
                    self.listTaskCurrent=[];
                }
                console.log("listTaskCurrent", res.data);
            } catch (error) {
                self.listTaskCurrent=[];
                self.$snotifyError(error, "Get task process current failed");
            }
        },
        async getSiblingOrSubWork(superProcessInstanceId,isCheck=''){
            let self=this;
            if (isCheck!='') {
                try {
                    let filter={};
                    filter.superProcessInstanceId=superProcessInstanceId;
                    let res = await BPMNEngine.getProcessInstanceHistory(filter);
                    if (isCheck=='siblingWork') {
                        if (res.total>0) {
                            self.processSibling=res.data;
                        }else{
                            self.processSibling=[];
                        }
                        console.log("ProcessSibling", res.data);
                    }else if(isCheck=='subWork'){
                        if (res.total>0) {
                            self.processSub=res.data;
                        }else{
                            self.processSub=[];
                        }
                        console.log("ProcessSub", res.data);
                    }
                } catch (error) {
                    if (isCheck=='siblingWork') {
                        self.processSibling=[];
                    }else{
                         self.processSub=[];
                    }
                    self.$snotifyError(error, "Get process Sibling failed");
                }
            }else{
                self.processSibling=[];
                self.processSub=[];
            }
        },
    }
}
</script>

<style scoped>
.v-tab{
    padding: 0px!important;
    border-width: 20px!important;
    text-transform: none !important;

}
.listWork >>>.v-expansion-panel-content__wrap{
    padding:0px;
    padding-left: 15px;
}
.listWork >>>.v-expansion-panel::before{
    box-shadow: none!important;
}
.listWork >>>.v-expand-header{
    color: #FF8003;
    font-size: 13px;
    padding:0px;
    padding-left: 15px;
    min-height: 30px;
}
.item-work{
    cursor: pointer;
}
.d-active {
  background: #f5f5f5;
}
.title-quytrinh {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box !important;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

</style>
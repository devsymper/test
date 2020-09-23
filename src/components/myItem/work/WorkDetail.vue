<template>
    <div class="h-100 w-100">
        <v-skeleton-loader
            v-if="loadingAction"
            :type="'table-tbody'"
            class="mx-auto"
            width="100%" height="100%" 
        ></v-skeleton-loader>
        <v-row class="ml-0 mr-0 justify-space-between" style="    line-height: 36px;">
            <div class="fs-13 pl-2 pt-1 float-left">
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
                            <span class="ml-2">{{$t('myItem.objType')}}</span>
                        </v-btn>
                    </template>
                    <v-list>
                    <v-list-item v-for="(item, index) in objectType" :key="index" @click="changeObjectType(index)">
                        <v-list-item-title> {{ item.title }}</v-list-item-title>
                    </v-list-item>
                    </v-list>
                </v-menu>
                <v-btn small text  @click="closeDetail">
                    <v-icon small>mdi-close</v-icon>
                </v-btn>

            </div>
        </v-row>
        <v-divider style="border-color: #bebebe;"></v-divider>
        <div v-if="filterObject==0">
            <v-row class="ma-0">
                <v-col cols="12" class="list-tasks pt-0 pb-0">
                    <v-row>
                        <v-col
                            cols="5"
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
                            cols="3"
                            class="fs-13 font-weight-medium"
                        >{{$t("tasks.header.app")}}</v-col>
                    </v-row>
                </v-col>
                <v-divider></v-divider>
            </v-row>
            <VuePerfectScrollbar
            @ps-y-reach-end="handleReachEndList"
            >
                <v-expansion-panels
                    v-model="panel"
                    multiple
                    class="listWork"
                    style="margin-bottom:30px"
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
                            >
                                <v-col
                                    cols="5"
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
                                    cols="3"
                                    class="fs-13 "
                                >
                                    <span class="mt-1">{{processParent.processDefinitionName}}</span>
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
                                    :class="{
                                        'd-active':indexObj==idx
                                    }"
                                    >
                                    <v-col
                                        cols="5"
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
                                        cols="3"
                                        class="fs-13 "
                                    >
                                        <span class="mt-1">{{processParent.processDefinitionName}}</span>
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
                                    :class="{
                                        'd-active':indexSub==idx
                                    }"
                                >
                                    <v-col
                                        cols="5"
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
                                        cols="3"
                                        class="fs-13 "
                                    >
                                        <span class="mt-1">{{processParent.processDefinitionName}}</span>
                                    </v-col>
                                </v-row>
                            </div>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </VuePerfectScrollbar>
        </div>
        <div v-else>
            <v-row class="ml-0 mr-0" >
                <v-col cols="12" class="list-tasks pt-0 pb-0">
                    <v-row>
                    <v-col
                        cols="1"
                        class="pl-3 fs-13 font-weight-medium"
                        style="flex:0!important"
                    >{{$t("tasks.header.type")}}</v-col>
                    <v-col
                        cols="3"
                        class="pl-3 fs-13 font-weight-medium"
                    >{{$t("tasks.header.name")}}</v-col>
                    <v-col
                        cols="2"
                        class=" fs-13 font-weight-medium"
                    >{{$t("tasks.header.assignee")}}</v-col>
                    <v-col
                        cols="2"
                        class=" fs-13 font-weight-medium"
                    >{{$t("tasks.header.owner")}}</v-col>
                    <v-col
                        cols="1"
                        
                        class="fs-13 font-weight-medium"
                    >{{$t("tasks.header.dueDate")}}</v-col>

                    <v-col
                        cols="2"
                        class="fs-13 font-weight-medium"
                    >{{$t("tasks.header.app")}}</v-col>
                    <v-col
                        cols="1"
                        class="fs-13 font-weight-medium"
                    >{{$t("common.add")}}</v-col>
                    </v-row>
                </v-col>
            </v-row>
            <v-divider></v-divider>
            <VuePerfectScrollbar
                @ps-y-reach-end="handleReachEndList"
                >
                    <v-row
                        v-for="(obj, idx) in listTaskComputed"
                        :key="idx"
                        :index="obj.id"
                    
                        :style="{
                            minHeight: '30px'
                        }"
                        @click="selectObject(obj, idx,idex)"
                        style="border-bottom: 1px solid #eeeeee!important;margin-left:0px!important"
                    >
                        <v-col
                            style="line-height: 24px; flex:0 1 3%!important"
                            cols="1"
                            class="pl-5 fs-12 px-1 py-0"
                        >
                            <div class="pl-1">
                                <div>
                                    <v-icon class="fs-14"
                                        style="margin-top:10px"
                                        v-if="obj.taskData.action"
                                    >{{(obj.taskData.action.action=='submit' || obj.taskData.action.action=='') ? 'mdi-file-document-edit-outline': 'mdi-seal-variant'}}</v-icon>
                                    <v-icon 
                                        style="margin-top:10px"
                                        class="fs-14" v-else>
                                        mdi-checkbox-marked-circle-outline
                                    </v-icon>
                                </div>
                                <div >
                                    <v-icon v-if="obj.endTime !=null" style="font-size:10px; color:green;">mdi-circle</v-icon>
                                    <v-icon v-else style="font-size:10px ; color:blue;">mdi-circle</v-icon>
                                </div>
                            </div>
                        </v-col>
                        <v-col   cols="3" class="pl-3 pr-1 pb-1 pt-2">
                            <div class="pl-3">
                                <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <div v-on="on" class="text-left fs-13  text-ellipsis w-100">
                          
                                        {{obj.taskData.content}}
                                    </div>
                                </template>
                                <span>{{ obj.taskData.content }}</span>
                                </v-tooltip>
                                <div class="pa-0 grey--text mt-1 lighten-2 d-flex justify-space-between">
                                <div
                                    class="fs-11  text-ellipsis"
                                >{{obj.taskData.extraLabel}} {{obj.taskData.extraValue}}</div>

                                <div class="fs-11 py-0  text-ellipsis">
                                    {{obj.endTime==null ? $moment(obj.startTime).format('DD/MM/YY HH:mm:ss'):$moment(obj.endTime).format('DD/MM/YY HH:mm:ss')}}
                                    <v-icon class="grey--text lighten-2 ml-1" x-small>mdi-clock-time-nine-outline</v-icon>
                                </div>
                                </div>
                            </div>
                        </v-col>
                        <v-col
                            style="line-height: 42px"
                            cols="2"
                            class="pl-3 fs-12 px-1 py-0"
                        >
                            <symperAvatar :size="20" :userId="obj.assigneeInfo.id" />
                            {{obj.assigneeInfo.displayName}}
                        </v-col>
                        <v-col
                            style="line-height: 42px"
                            cols="2"
                            class="pl-3 fs-12 px-1 py-0"
                        >
                            <symperAvatar v-if="obj.ownerInfo.id" :size="20" :userId="obj.ownerInfo.id" />
                            <symperAvatar v-else :size="20" :userId="obj.assigneeInfo.id" />
                            {{obj.ownerInfo.id ? obj.ownerInfo.displayName: obj.assigneeInfo.displayName }}
                        </v-col>
                        <v-col
                            style="line-height: 42px"
                            cols="1"
                            class="pl-3 fs-13 px-1 py-0"
                        >
                            <span class="mt-1">{{obj.dueDate ==null? '':$moment(obj.dueDate).fromNow()}}</span>
                        </v-col>
                        <v-col
                            class="pl-3 py-0"
                            cols="2"
                        >
                            <div class="pl-1">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                    <span
                                        v-on="on"
                                        v-if="obj.processDefinitionName"
                                        class=" text-left fs-13 text-ellipsis w-80 title-quytrinh"
                                    >{{obj.processDefinitionName}}</span>
                                    <span v-on="on" v-else class="text-left fs-13text-ellipsis w-80 title-quytrinh">ad hoc</span>
                                    </template>
                                    <span>{{ obj.processDefinitionName?  obj.processDefinitionName : `ad hoc` }}</span>
                                </v-tooltip>
                                <div class="pa-0 grey--text mt-1 lighten-2 d-flex justify-space-between">
                                <!-- <div
                                    class="fs-11  text-ellipsis"
                                >App</div> -->
                                </div>
                            </div>
                            
                        </v-col>
                        <v-col
                            cols="1"
                            class="pl-3 fs-13 px-1 py-0"
                        >
                            <div class="pl-1">
                                <div style="width:55px">10 <v-icon class="fs-14" style="float:right;margin-top:4px;margin-right:12px">mdi-comment-processing-outline</v-icon> </div>
                                <div style="width:55px"> 2 <v-icon class="fs-14" style="float:right;margin-top:4px;margin-right:12px">mdi-attachment</v-icon></div>
                            </div>
                        </v-col>
                    </v-row>
                </VuePerfectScrollbar>
        </div>
       
    </div>
</template>

<script>
import icon from "@/components/common/SymperIcon";
//import attachment from "./Attachment";
//import comment from "./Comment";
//import flow from "./Flow";
//import relatedItems from "./RelatedItems";
//import task from "./Task";
import BPMNEngine from "@/api/BPMNEngine.js";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { appManagementApi } from '@/api/AppManagement';
import symperAvatar from "@/components/common/SymperAvatar.vue";
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
        // attachment, 
        // comment, 
        // flow, 
        // relatedItems, 
        // task,
        VuePerfectScrollbar,
        symperAvatar
    },
    data: function() {
        return {
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
        handleReachEndList(){},
        changeObjectType(index){
            this.filterObject=index;
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
                this.getProcessInstance(task.processInstanceId);
            }
        },
        async getProcessInstance(processInstanceId){
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
          
          //  this.setTaskBreadcrumb();
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

</style>
<template>
  <div class="list-objects">
    <v-row class="mr-0 ml-0">
        <v-col
            :cols="!sideBySideMode ? 12 : 4"
            :md="!sideBySideMode ? 12 : 3"
            class="pt-0 pl-0 pr-0 pb-0"
        >
            <listHeader
            :isSmallRow="isSmallRow"
            :headerTitle="headerTitle"
            :sideBySideMode="sideBySideMode"
            :compackMode="compackMode"
            :parentTaskId="filterFromParent.parentTaskId"
            @change-density="isSmallRow = !isSmallRow"
            @changeObjectType="changeObjectType"
            @filter-change-value="handleChangeFilterValue"
            @create-task="getWorks({})"
            @refresh-task-list="getWorks()"
            ></listHeader>
            <v-divider v-if="!sideBySideMode"></v-divider>
            <v-row class="ml-0 mr-0" v-if="!sideBySideMode">
            <v-col cols="12" class="list-tasks pt-0 pb-0">
                <v-row>
                <v-col
                    :cols="sideBySideMode ? 12 : compackMode ? 6 : 4"
                    class="pl-3 fs-13 font-weight-medium"
                >{{$t("tasks.header.name")}}</v-col>
                <v-col
                    cols="2"
                    v-if="!sideBySideMode"
                    class="fs-13 font-weight-medium"
                >{{$t("tasks.header.userCreate")}}</v-col>
                <v-col
                    cols="2"
                    v-if="!sideBySideMode"
                    class="fs-13 font-weight-medium"
                >{{$t("tasks.header.createDate")}}</v-col>
                <v-col
                    cols="2"
                    v-if="!sideBySideMode && !compackMode && !smallComponentMode"
                    class="fs-13 font-weight-medium"
                >{{$t("tasks.header.app")}}</v-col>
                <v-col
                    cols="2"
                    v-if="!sideBySideMode && !compackMode && !smallComponentMode"
                    class="fs-13 font-weight-medium"
                >{{$t("common.add")}}</v-col>
                </v-row>
            </v-col>
            </v-row>
            <v-divider></v-divider>

            <VuePerfectScrollbar
            v-if="!loadingTaskList"
            @ps-y-reach-end="handleReachEndList"
            :style="{height: listTaskHeight+'px'}"
            >
                <div
                    v-for="(workGroup, idex) in groupAllProcessInstance"
                    :key="idex"
                >
                    <v-row
                    :class="{
                            'mr-0 ml-0 single-row': true ,
                            'py-0': isSmallRow,
                        }"
                        :style="{
                            minHeight: '30px'
                        }"
                        style="border-bottom: 1px solid #eeeeee!important;"
                    >
                    <span style="color:#FF8003; font-size:13px;margin-left:16px;margin-top:6px">{{ showTime(workGroup.date)}}</span>
                    </v-row>
                    <v-row
                        v-for="(obj, idx) in workGroup.works"
                        :key="idx"
                        :index="obj.id"
                        :class="{
                            'mr-0 ml-0 single-row': true ,
                            'py-0': isSmallRow,
                            'd-active':index==idx && dataIndex==idex
                        }"
                        :style="{
                            minHeight: '50px'
                        }"
                        @click="selectObject(obj, idx,idex)"
                        style="border-bottom: 1px solid #eeeeee!important;"
                            
                    >
                        <v-col :cols="sideBySideMode ? 10 : compackMode ? 6: 4" class="pl-3 pr-1 py1">
                            <div class="pl-1">
                                <div class="pa-0 d-flex justify-space-between">
                                <v-tooltip bottom>
                                        <template v-slot:activator="{ on }">
                                            <div
                                                class="fs-13 text-ellipsis w-100"
                                                v-on="on"
                                            >
                                                <v-icon v-if="obj.endTime && obj.endTime!=null" style="font-size:11px; color:green;margin-left: 3px;">mdi-circle</v-icon>
                                                <v-icon v-else style="font-size:11px ; color:blue;margin-left: 3px;">mdi-circle</v-icon>
                                            {{ obj.name}}
                                            </div>
                                        </template>
                                        <span>{{ obj.name }}</span>
                                    </v-tooltip>
                                    <div class="fs-11 py-0 " style="width:200px;margin-top:3px">
                                        {{obj.startTime ? $moment(obj.startTime).format('DD/MM/YY HH:mm:ss'):$moment(obj.endTime).format('DD/MM/YY HH:mm:ss')}}
                                        <v-icon class="grey--text " x-small>mdi-clock-time-nine-outline</v-icon>
                                    
                                    </div>
                                </div>
                            </div>
                        </v-col>
                    
                        <v-col
                            v-if="!sideBySideMode"
                            cols="2"
                            class="fs-12 px-1 py-0 mt-2"
                        >
                            <symperAvatar :size="20"  :userId="obj.startUserId" />
                            <span class="ml-1">{{obj.startUserName}}</span>
                            <div class="fs-11 ml-5 grey--text" v-if="obj.roleInfo">{{obj.roleInfo.name}}</div>
                        </v-col> 
                        <v-col
                            v-if="!sideBySideMode"
                            style="line-height: 42px"
                            cols="2"
                            class="fs-13 px-1 py-0"
                        >
                            <span class="mt-1">{{obj.startTime ==null? '':$moment(obj.startTime).fromNow()}}</span>
                        </v-col>
                        <v-col
                            class="py-0"
                            cols="2"
                            v-if="!sideBySideMode && !smallComponentMode"
                        >
                        <div class="mt-1">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                    <div
                                        v-on="on"
                                        v-if="obj.processDefinitionName"
                                        class=" text-left fs-13 pr-6 text-ellipsis w-80 title-quytrinh"
                                    >{{obj.processDefinitionName}}</div>
                                    <span v-on="on" v-else class="text-left fs-13 pr-6 text-ellipsis w-80 title-quytrinh">ad hoc</span>
                                    </template>
                                    <span>{{ obj.processDefinitionName?  obj.processDefinitionName : `ad hoc` }}</span>
                                </v-tooltip>
                                <div class="pa-0 grey--text mt-1 lighten-2 d-flex justify-space-between">
                                {{selectValueInVariables(obj.id)}}
                                </div>
                            </div>
                            
                        </v-col>
                        <v-col
                            v-if="!sideBySideMode"
                            cols="2"
                            class="fs-13 px-1 py-0"
                        >
                            <div class="pl-1 pt-1">
                                <div style="width:55px">
                                    {{commentCountPerTask['work:' + obj.id]}}
                                    <v-icon class="fs-14" style="float:right;margin-top:4px;margin-right:12px">mdi-comment-processing-outline</v-icon> </div>
                                <div style="width:55px">
                                    {{fileCountPerTask['work:' + obj.id]}}
                                    <v-icon class="fs-14" style="float:right;margin-top:4px;margin-right:12px">mdi-attachment</v-icon></div>
                            </div>
                        </v-col>
                    </v-row>
                </div>
            </VuePerfectScrollbar>
            <v-skeleton-loader v-else ref="skeleton" :type="'table-tbody'" class="mx-auto"></v-skeleton-loader>
            <v-skeleton-loader
            v-if="loadingMoreTask"
            ref="skeleton"
            :type="'table-tbody'"
            class="mx-auto"
            ></v-skeleton-loader>
        </v-col>
        <v-col
            :cols="!sideBySideMode ? 0 : 8"
            :md="!sideBySideMode ? 0 : 9"
            v-if="sideBySideMode"
            class="pa-0 ma-0"
            height="30"
            style="border-left: 1px solid #e0e0e0;"
        >
        <workDetail
          :parentHeight="listTaskHeight"
          :workInfo="selectedWork.workInfo"
          @close-detail="closeDetail"
        ></workDetail>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import BPMNEngine from "@/api/BPMNEngine";
import icon from "@/components/common/SymperIcon";
import workDetail from "./WorkDetail";
import listHeader from "./ListHeader";
import userSelector from "./UserSelector";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { util } from "../../../plugins/util";
import { appConfigs } from "../../../configs";
import { taskApi } from "@/api/task.js";

import {
  extractTaskInfoFromObject,
  addMoreInfoToTask
} from "@/components/process/processAction";
import symperAvatar from "@/components/common/SymperAvatar.vue";

export default {
  computed: {
    fileCountPerTask(){
        return this.$store.state.file.fileCountPerObj.list;
    },
    commentCountPerTask(){
        return this.$store.state.comment.commentCountPerObj.list;
    },
    groupAllProcessInstance() {
        let allUserById = this.$store.getters['app/mapIdToUser'];
        let allPrcess = this.allFlatWorks;

        // allPrcess.sort(function(a, b) {
        //         if (a.endTime) {
        //             var keyA = new Date(a.endTime);
        //         }else{
        //             var keyA = new Date(a.startTime);
        //         }
        //         if (b.endTime) {
        //             var keyB = new Date(b.endTime);
        //         }else{
        //             var keyB = new Date(b.startTime);
        //         }
        //         if (keyA > keyB) return -1;
        //         if (keyA < keyB) return 1;
        //         return 0;
        // });

        const groups = allPrcess.reduce((groups, work) => {
            let date;
            work.startUserId = 0;
            work.startUserName = '';
            let roleInfo={};

            const dataVariable = this.allVariableProcess.find(element => element.processInstanceId===work.id && element.name==="symper_user_id_start_workflow" );
            if (dataVariable) {
                let userIdStart=dataVariable.value;
                if (dataVariable.value.indexOf(":")>0) {  //check là userId hay userId:role
                    let arrDataUserIden=dataVariable.value.split(":");
                    userIdStart=arrDataUserIden[0];
                    if (arrDataUserIden.length>3) { // loại trừ trường hợp role=0
                        let roleIdentify=dataVariable.value.slice(userIdStart.length+1);
                        roleInfo=this.getRoleUser(roleIdentify);
                    }
                }
                work.startUserId = userIdStart;
                work.startUserName = allUserById[work.startUserId] ? allUserById[work.startUserId].displayName : '';
                work.roleInfo = roleInfo;
            }

            if ( work.startTime) {
                date = work.startTime.split("T")[0];
            }else{
                date = work.endTime.split("T")[0];
            }
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(work);
            return groups;
        }, {});
        // Edit: to add it in the array format instead
        const groupArrayWork = Object.keys(groups).map(date => {
            return {
            date,
            works: groups[date]
            };
        });
        return groupArrayWork;
    },
    stask() {
      return this.$store.state.task;
    },
    sapp() {
      return this.$store.state.app;
    }
  },
    name: "listWork",
    components: {
        icon: icon,
        listHeader: listHeader,
        userSelector: userSelector,
        VuePerfectScrollbar: VuePerfectScrollbar,
        symperAvatar: symperAvatar,
        workDetail
    },
    watch:{
        sideBySideMode(vl){
            if(!vl){
                this.$store.dispatch('file/getWaitingFileCountPerObj');
                this.$store.dispatch('comment/getWaitingCommentCountPerObj');
            }
        }
    },
  props: {
    compackMode: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: "calc(100vh - 120px)"
    },
    // component này có ở chế độ là component con của một component khác hay ko, false nếu component này là view
    smallComponentMode: {
      type: Boolean,
      default: false
    },
    filterFromParent: {
      type: Object,
      default() {
        return {};
      }
    },
    headerTitle: {
      type: String,
      default() {
        return this.$t("myItem.header");
      }
    },
    filterTaskAction: {
      type: String,
      default: "getList"
    }
  },
  data: function() {
    return {
        index: -1,
        dataIndex:-1,
        loadingTaskList: false,
        loadingMoreTask: false,
        listTaskHeight: 300,
        totalWork: 0,
        selectedTask: {
            taskInfo: {},
            idx: -1,
            originData: null
        },
        selectedWork:{
            workInfo: {},
            idx: -1,
        },
        isSmallRow: false,
        sideBySideMode: false,
        allFlatWorks: [],
        allWorkIdUserStart:[],
        allVariableProcess:[],
        myOwnFilter: {
            size: 50,
            sort: "startTime",
            order: "desc",
            page: 1,
            involvedUser: this.$store.state.app.endUserInfo.id
        },
        filterVariables:{
            names:"symper_application_id,symper_user_id_start_workflow",
            page:1,
            processInstanceIds:[]
        },
        filterListProcessUserStartWork:{
            names:"symper_user_id_start_workflow",
            page:1,
            valueLike:this.$store.state.app.endUserInfo.id+"%"
        },
        defaultAvatar: appConfigs.defaultAvatar,
        listIdProcessInstance:[],
    };
  },
  created() {
  },
  mounted() {
    let self = this;
    this.$store
      .dispatch("process/getAllDefinitions")
      .then(res => {
        self.getWorks();
      })
      .catch(err => {});
    self.reCalcListTaskHeight();
  },
  methods: {
    getRoleUser(roleIdentify){
        let arrDataRole=roleIdentify.split(":");
        let allSymperRole=this.$store.state.app.allSymperRoles;
        let role=(allSymperRole[arrDataRole[0]]).find(element => element.roleIdentify===roleIdentify);
        return role;
    },  
    changeUpdateAsignee(){
      this.handleTaskSubmited();
    },
    showTime(time){
        var today = this.$moment().format('YYYY-MM-DD');
        if (time===today) {
            return this.$t('myItem.today');
        }
        else{
            return this.$moment(time).fromNow();
        }
    },
    changeObjectType(index) {
      this.$emit("changeObjectType", index);
    },
    selectValueInVariables(processInstanceId){
        if (processInstanceId!=null) {
            const dataVariable = this.allVariableProcess.find(element => element.processInstanceId===processInstanceId && element.name=="symper_application_id");
            if (dataVariable) {
                let appId=dataVariable.value;
                let allApp = this.$store.state.task.allAppActive;
                let app=allApp.find(element => element.id==appId);
                if (app) {
                    return app.name;
                }else{
                    return "";
                }
            }else{
                return "";
            }
        }else{
            return "";
        }
    },
    handleReachEndList() {
        if (
            this.allFlatWorks.length < this.totalWork &&
            this.allFlatWorks.length > 0  && !this.loadingTaskList && !this.loadingMoreTask
        ) {
            this.myOwnFilter.page += 1;
            this.filterListProcessUserStartWork.page +=1;

            if ((this.myOwnFilter.page-1)*this.myOwnFilter.size <this.totalWork) {
                this.getWorks();
            }
        }
    },
    handleTaskSubmited() {
        this.sideBySideMode = false;
        this.getWorks();
    },
    handleChangeFilterValue(data) {
        for (let key in data) {
            this.$set(this.myOwnFilter, key, data[key]);
        }
        this.getWorks();
    },
    reCalcListTaskHeight() {
        this.listTaskHeight =util.getComponentSize(this.$el.parentElement).h - 125;
    },
    getUser(id) {
        this.$refs.user.getUser(id);
    },
    selectObject(obj, idx,idex) {
        this.index = idx;
        this.dataIndex = idex;
        this.$set(this.selectedWork, "workInfo", obj);
        this.selectedWork.workInfo.appName=this.selectValueInVariables(obj.id);
        this.selectedWork.idx = idx;
        if (!this.compackMode) {
            this.sideBySideMode = true;
            this.$emit("change-height", "calc(100vh - 88px)");
        }
    },
    closeDetail() {
      this.sideBySideMode = false;
      this.$emit("change-height", "calc(100vh - 120px)");
    },

    async getWorks(filter = {}) { // đây là get processInstance chứ k phải get Task
        if (this.loadingTaskList || this.loadingMoreTask) {
            return;
        }
        let self = this;
        if (this.myOwnFilter.page == 1) {
            this.allFlatWorks = [];
            this.loadingTaskList = true;
        } else {
            this.loadingMoreTask = true;
        }
        filter = Object.assign(filter, this.filterFromParent);
        filter = Object.assign(filter, this.myOwnFilter);
        let processIden = [],processId=[];
        // get variable process mà user start
        let res2 = {};
        res2 = await taskApi.getVariableWorkflow(self.filterListProcessUserStartWork);
        let processIdUserStart=[];
        for (let item of res2.data) {
            if (self.listIdProcessInstance.indexOf(item.processInstanceId) === -1) {
                processIdUserStart.push(item.processInstanceId);
                processId.push(item.processInstanceId);
                processIden.push('work:'+item.processInstanceId);
            }
        }
        await this.getProcessInstanceUserStart(processIdUserStart);
        // get processInstance theo involvedUser
        let res = {};
        let listWork = [];
        res = await BPMNEngine.getProcessInstanceHistory(filter);
        listWork = res.data;
        this.totalWork = Number(res.total);
       
        for (let work of listWork) {
            if (self.listIdProcessInstance.indexOf(work.processInstanceId) === -1) {
                self.allFlatWorks.push(work);
                processIden.push('work:'+work.id);
                processId.push(work.id);
                self.listIdProcessInstance.push(work.id);
            }
        }
       
        
        self.filterVariables.pageSize=(processId.length)*2;
        self.filterVariables.processInstanceIds=JSON.stringify(processId);
        
        let resVariable = {};
        resVariable = await taskApi.getVariableWorkflow(self.filterVariables);
        for (let item of resVariable.data) {
            if (self.allVariableProcess.indexOf(item.id) === -1) {
                self.allVariableProcess.push(item);
            }
        }

        this.$store.commit('file/setWaitingFileCountPerObj', processIden);
        this.$store.commit('comment/setWaitingCommentCountPerObj', processIden);
        this.$store.dispatch('file/getWaitingFileCountPerObj');
        this.$store.dispatch('comment/getWaitingCommentCountPerObj');
        self.loadingTaskList = false;
        self.loadingMoreTask = false;
    },
    async getProcessInstanceUserStart(processIdUserStart){
        if (processIdUserStart.length>0) {
            let self=this;
            let filter={};
            filter.size= processIdUserStart.length+1;
            filter.sort= "startTime";
            filter.order= "desc";
            filter.processInstanceIds=processIdUserStart;
            let res={};
            res = await BPMNEngine.getProcessInstanceHistory(filter);
            for (let work of res.data) {
                if (!self.allFlatWorks[work.id]) {
                    self.allFlatWorks.push(work);
                }
            }
        }
    }
  }
};
</script>

<style scoped>
.list-tasks .fs-13 {
  padding-left: 5px;
  padding-right: 5px;
  padding-top: 5px;
  padding-bottom: 5px;
}
.v-expansion-panels .v-expansion-panel-content {
  padding: 0;
}
.v-expansion-panels
  .v-expansion-panel-content
  >>> .v-expansion-panel-content__wrap {
  padding: 0 0 0px;
}
.single-row:hover {
  background: #f5f5f5;
  cursor: pointer;
}
.theme--light.v-list-item--active:hover::before,
.theme--light.v-list-item--active::before {
  opacity: 0;
}
.v-list--nav.v-list--dense .v-list-item:not(:last-child):not(:only-child),
.v-list--nav .v-list-item--dense:not(:last-child):not(:only-child) {
  margin-bottom: 0;
}
.scrollable {
  overflow: auto;
  overflow-x: hidden;
}
.v-text-field >>> .v-input__control >>> .v-input__slot,
.theme--light.v-text-field--solo >>> .v-input__control >>> .v-input__slot,
.list-objects .v-application >>> .v-input__control >>> .v-input__slot {
  padding-left: 5px !important;
  padding-right: 5px !important;
}
.v-application
  >>> .v-input__control
  >>> .v-input__slot
  >>> .v-input__append-inner
  >>> .v-input__icon {
  min-width: 10px;
  width: 5px;
}
.list-objects
  >>> .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded)
  >>> .v-input__control
  >>> .v-input__slot,
.list-objects >>> .v-text-field.v-text-field--enclosed .v-text-field__details {
  padding-left: 5px !important;
  padding-right: 5px !important;
}
.v-list-item >>> .v-list-item__icon,
.v-list-group
  >>> .v-list-item__icon:first-child
  .v-list-group
  >>> .v-list-item--dense
  >>> .v-list-item__icon,
.v-list-group >>> .v-list--dense >>> .v-list-item >>> .v-list-item__icon {
  margin-top: 3px;
  margin-bottom: 3px;
}
.title-quytrinh {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box !important;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}
.d-active {
  background: #f5f5f5;
}
.col-10 {
    flex: 0 0 97%;
    max-width: 97%;
}
</style>
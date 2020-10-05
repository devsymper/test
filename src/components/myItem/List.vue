<template>
  <div class="list-objects" style="overflow: hidden;">
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
            :changeStatusMoreApproval="changeStatusMoreApproval"
            @change-density="isSmallRow = !isSmallRow"
            @changeObjectType="changeObjectType"
            @filter-change-value="handleChangeFilterValue"
            @create-task="getTasks({})"
            @refresh-task-list="getTasks()"
            @goToPageApproval="goToPageApproval"
            ></listHeader>
            <v-divider v-if="!sideBySideMode"></v-divider>
            <div v-if="!changeStatusMoreApproval">
                <v-row class="ml-0 mr-0" v-if="!sideBySideMode">
                        <v-col cols="12" class="list-tasks pt-0 pb-0">
                            <v-row>
                            <v-col
                                cols="1"
                                class="pl-3 fs-13 font-weight-medium"
                                style="flex:0!important"
                            >{{$t("tasks.header.type")}}</v-col>
                            <v-col
                                :cols="sideBySideMode ? 12 : compackMode ? 5 : 3"
                                class="pl-3 fs-13 font-weight-medium"
                            >{{$t("tasks.header.name")}}</v-col>
                            <v-col
                                cols="2"
                                v-if="!sideBySideMode"
                                class="fs-13 font-weight-medium"
                            >{{$t("tasks.header.assignee")}}</v-col>
                            <v-col
                                cols="2"
                                v-if="!sideBySideMode"
                                class="fs-13 font-weight-medium"
                            >{{$t("tasks.header.owner")}}</v-col>
                            <v-col
                                cols="1"
                                v-if="!sideBySideMode"
                                class="fs-13 font-weight-medium dateTime"
                            >{{$t("tasks.header.dueDate")}}</v-col>

                            <v-col
                                cols="2"
                                v-if="!sideBySideMode && !compackMode && !smallComponentMode"
                                class="fs-13 font-weight-medium"
                            >{{$t("tasks.header.app")}}</v-col>
                            <v-col
                                cols="1"
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
                                v-for="(obj, idex) in groupFlatTasks"
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
                                <span style="color:#FF8003; font-size:13px;margin-left:16px;margin-top:6px">{{ obj.fromNow}}</span>
                                </v-row>
                                <v-row
                                    v-for="(obj, idx) in obj.tasks"
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
                                    <v-col
                                    style="line-height: 42px; flex:0!important"
                                    cols="1"
                                    class="fs-12 px-1 py-0 pl-3"
                                    >
                                    <v-icon class="fs-14"
                                        v-if="obj.taskData.action"
                                    >{{obj.taskData.action.action=='approval' ? 'mdi-seal-variant ': 'mdi-file-document-edit-outline'}}</v-icon>
                                    <v-icon class="fs-14" v-else>mdi-checkbox-marked-circle-outline</v-icon>
                                    </v-col>
                                    <v-col :cols="sideBySideMode ? 10 : compackMode ? 5: 3" :class="{'colName':sideBySideMode==true}" class="pa-1">
                                        <div class="pl-1">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                    <div v-on="on" class="text-left fs-13 text-ellipsis w-100">
                                                    {{obj.taskData.content}}
                                                    </div>
                                                </template>
                                                <span>{{ obj.taskData.content }}</span>
                                            </v-tooltip>
                                            <div class="pa-0 grey--text mt-1 lighten-2 d-flex justify-space-between">
                                                <div
                                                    class="fs-11 pr-6 text-ellipsis"
                                                >{{obj.taskData.extraLabel}} {{obj.taskData.extraValue}}</div>

                                                <div class="fs-11 py-0 pr-2 text-ellipsis">
                                                    {{obj.createTime ? $moment(obj.createTime).format('DD/MM/YY HH:mm:ss'):$moment(obj.endTime).format('DD/MM/YY HH:mm:ss')}}
                                                    <v-icon class="grey--text lighten-2 ml-1" x-small>mdi-clock-time-nine-outline</v-icon>
                                                </div>
                                            </div>
                                        </div>
                                    </v-col>
                                    <v-col
                                    v-if="!sideBySideMode"
                                    style="line-height: 42px"
                                    cols="2"
                                    class="fs-12 px-1 py-0"
                                    >
                                    <symperAvatar :size="20" :userId="obj.assigneeInfo.id" />
                                    {{obj.assigneeInfo.displayName}}
                                    </v-col>
                                    <v-col
                                    v-if="!sideBySideMode"
                                    style="line-height: 42px"
                                    cols="2"
                                    class="fs-12 px-1 py-0"
                                    >
                                    <symperAvatar v-if="obj.ownerInfo.id" :size="20" :userId="obj.ownerInfo.id" />
                                    <symperAvatar v-else :size="20" :userId="obj.assigneeInfo.id" />
                                        {{obj.ownerInfo.id ? obj.ownerInfo.displayName: obj.assigneeInfo.displayName }}
                                    </v-col>
                                    <v-col
                                        v-if="!sideBySideMode"
                                        style="line-height: 42px"
                                        cols="1"
                                        class="fs-13 pl-3 py-0 dateTime"
                                    >
                                    <span class="mt-1">{{obj.dueDate ==null? '':$moment(obj.dueDate).fromNow()}}</span>
                                    </v-col>
                                    <v-col
                                        class="py-0"
                                        cols="2"
                                        v-if="!sideBySideMode && !smallComponentMode"
                                    >
                                    <div class="pl-1 mt-1">
                                            <v-tooltip bottom>
                                                <template v-slot:activator="{ on }">
                                                <span
                                                    v-on="on"
                                                    v-if="obj.processInstanceId"
                                                    class=" text-left fs-13 pr-6 text-ellipsis w-80 title-quytrinh"
                                                >{{obj.processDefinitionName}}</span>
                                                <span v-on="on" v-else class="text-left fs-13 pr-6 text-ellipsis w-80 title-quytrinh">ad hoc</span>
                                                </template>
                                                <span>{{ obj.processDefinitionName?  obj.processDefinitionName : `ad hoc` }}</span>
                                            </v-tooltip>
                                            <div class="pa-0 grey--text mt-1 lighten-2 d-flex justify-space-between">
                                                <div
                                                    class="fs-11 pr-6 text-ellipsis"
                                                >{{selectNameApp(obj.processInstanceId)}}</div>
                                            </div>
                                        </div>
                                        
                                    </v-col>
                                    <v-col
                                        v-if="!sideBySideMode"
                                        cols="1"
                                        class="fs-13 px-1 py-0"
                                    >
                                        <div class="pl-1 pt-1">
                                            <div style="width:55px">
                                                {{commentCountPerTask['task:' + obj.id]}}
                                                <v-icon class="fs-14" style="float:right;margin-top:4px;margin-right:12px">mdi-comment-processing-outline</v-icon> 
                                            </div>
                                            <div style="width:55px"> 
                                                {{fileCountPerTask['task:' + obj.id]}}
                                                <v-icon class="fs-14" style="float:right;margin-top:4px;margin-right:12px">mdi-attachment</v-icon>
                                            </div>
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
            </div>
            <div v-else>
                <listTaskApproval
                    :changeStatusMoreApproval="changeStatusMoreApproval"
                 />
            </div>
      </v-col>
      <v-col
        :cols="!sideBySideMode ? 0 : 8"
        :md="!sideBySideMode ? 0 : 9"
        v-if="sideBySideMode"
        class="pa-0 ma-0"
        height="30"
        style="border-left: 1px solid #e0e0e0;"
      >
        <taskDetail
        :parentHeight="listTaskHeight"
        :taskInfo="selectedTask.taskInfo"
        :originData="selectedTask.originData"
        :allVariableProcess="allVariableProcess"
        @close-detail="closeDetail"
        @task-submited="handleTaskSubmited"
        @changeUpdateAsignee="changeUpdateAsignee"
        ></taskDetail>
      </v-col>
      <userSelector ref="user" class="d-none"></userSelector>
    </v-row>
  </div>
</template>

<script>
import BPMNEngine from "@/api/BPMNEngine";
import icon from "@/components/common/SymperIcon";
import taskDetail from "./TaskDetail";
import listHeader from "./ListHeader";
import userSelector from "./UserSelector";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { util } from "../../plugins/util";
import { appConfigs } from "../../configs";
import listTaskApproval from "./featureApproval/List";
import { taskApi } from "./../../api/task.js";

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
       
        // Liệt kê danh sách các task dưới dạng phẳng - ko phân cấp
        flatTasks() {
            let tasks = [];
            for (let def of this.listProrcessInstances) {
                for (let instances of def.objects) {
                for (let task of instances.tasks) {
                    task.bizKey = ""; // Business key của process instance
                    tasks.push(task);
                }
                }
            }
            return tasks;
        },
        groupFlatTasks() {
            let allTask = this.allFlatTasks;
            const groups = allTask.reduce((groups, task) => {
                let date;
                if ( task.createTime) {
                    date = task.createTime.split("T")[0];
                }else{
                    date = task.endTime.split("T")[0];
                }
                let fromNow = this.getDateFormNow(date);
                if (!groups[fromNow]) {
                  groups[fromNow] = [];
                }
                groups[fromNow].push(task);
                return groups;
            }, {});
            // Edit: to add it in the array format instead
            const groupArraysTask = Object.keys(groups).map(fromNow => {
                return {
                  fromNow,
                  tasks: groups[fromNow]
                };
            });
            return groupArraysTask;
        },
        stask() {
        return this.$store.state.task;
        },
        sapp() {
        return this.$store.state.app;
        }
    },
    watch:{
        "stask.isStatusSubmit": function(newVl) {
            if (newVl==true) {
                this.getTasks();
                this.$store.commit("task/setIsStatusSubmit",false);
            }
        },
        sideBySideMode(vl){
            if(!vl){
                this.$store.dispatch('file/getWaitingFileCountPerObj');
                this.$store.dispatch('comment/getWaitingCommentCountPerObj');
            }
        }
    },
    name: "listTask",
    components: {
        icon: icon,
        taskDetail: taskDetail,
        listHeader: listHeader,
        userSelector: userSelector,
        VuePerfectScrollbar: VuePerfectScrollbar,
        symperAvatar: symperAvatar,
        listTaskApproval
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
                return this.$t("process.taskList");
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
            changeStatusMoreApproval:false,
            loadingTaskList: false,
            loadingMoreTask: false,
            listTaskHeight: 300,
            totalTask: 0,
            selectedTask: {
                taskInfo: {},
                idx: -1,
                originData: null
            },
            listProrcessInstances: [],
            isSmallRow: false,
            sideBySideMode: false,
            openPanel: [0, 1, 2, 3, 4],
            allFlatTasks: [],
            allVariableProcess: [],
            myOwnFilter: {
                size: 50,
                sort: "createTime",
                order: "desc",
                page: 1,
                involvedUser: this.$store.state.app.endUserInfo.id
            },
            filterVariables:{
                names:"symper_application_id",
                page:1,
                pageSize:50,
                processInstanceIds:[]
            },
            defaultAvatar: appConfigs.defaultAvatar,
            arrdocObjId: []
        };
    },
    created() {
        let self = this;
        this.$evtBus.$on("symper-update-task-assignment", updatedTask => {
            updatedTask.taskData = self.getTaskData(updatedTask);
            self.selectObject(updatedTask, self.selectedTask.idx);
            self.$set(self.allFlatTasks, self.selectedTask.idx, updatedTask);
        });
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
    },
    methods: {
    goToPageApproval(){
        this.changeStatusMoreApproval=!this.changeStatusMoreApproval;
    },
    changeUpdateAsignee(){
      this.handleTaskSubmited();
    },
    getDateFormNow(time){
        var today = this.$moment().format('YYYY-MM-DD');
        if (time===today) {
            return this.$t('myItem.today');
        }
        else{
            return this.$moment(time).fromNow();
        }
    },
    selectNameApp(processInstanceId){
        if (processInstanceId!=null) {
            const dataVariable = this.allVariableProcess.find(element => element.processInstanceId===processInstanceId);
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
    changeObjectType(index) {
      this.$emit("changeObjectType", index);
    },
    handleReachEndList() {
      if (
        this.allFlatTasks.length < this.totalTask &&
        this.allFlatTasks.length > 0 && !this.loadingTaskList && !this.loadingMoreTask
      ) {
        this.myOwnFilter.page += 1;
        if ((this.myOwnFilter.page-1)*this.myOwnFilter.size <this.totalTask) {
            this.getTasks();
        }
      }
    },
    handleTaskSubmited() {
      this.sideBySideMode = false;
      this.getTasks();
    },
    handleChangeFilterValue(data) {
      for (let key in data) {
        this.$set(this.myOwnFilter, key, data[key]);
      }
      this.getTasks();
    },
    reCalcListTaskHeight() {
      this.listTaskHeight =
        util.getComponentSize(this.$el.parentElement).h - 125;
    },
    getUser(id) {
      this.$refs.user.getUser(id);
    },
    selectObject(obj, idx,idex) {
      this.index = idx;
      this.dataIndex = idex;
      this.$set(this.selectedTask, "originData", obj);
      if (this.smallComponentMode) {
        this.$goToPage("/tasks/" + obj.id, "Do task");
      } else {
        this.selectedTask.idx = idx;
        if (!this.compackMode) {
          this.sideBySideMode = true;
          let taskInfo = extractTaskInfoFromObject(obj);
          this.$set(this.selectedTask, "taskInfo", taskInfo);
          this.$emit("change-height", "calc(100vh - 88px)");
        }
      }
    },
    closeDetail() {
      this.sideBySideMode = false;
      this.$emit("change-height", "calc(100vh - 120px)");
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
    async getTasks(filter = {}) {
        if (this.loadingTaskList || this.loadingMoreTask) {
            return;
        }
        let self = this;
        if (this.myOwnFilter.page == 1) {
            this.allFlatTasks = [];
            this.loadingTaskList = true;
        } else {
            this.loadingMoreTask = true;
        }
        filter = Object.assign(filter, this.filterFromParent);
        filter = Object.assign(filter, this.myOwnFilter);
        let res = {};
        let listTasks = [];
        if (filter.status) {
            this.$store.commit("task/setFilter", filter.status);
        }
        if (this.filterTaskAction == "subtasks") {
            res = await BPMNEngine.getSubtasks(
                this.filterFromParent.parentTaskId,
                filter
            );
            if (filter.status == "done") {
                listTasks = res.data;
            } else {
                listTasks = res;
            }
        } else {
            res = await BPMNEngine.getTask(filter);
            listTasks = res.data;
        }
        this.totalTask = Number(res.total);
        this.$store.dispatch('task/getAllAppActive');
        //Khadm: danh sách các task cần lấy tổng số comment và file đính kèm
        let taskIden = [];
        let allProcessId=[];
        for (let task of listTasks) {
            task.taskData = self.getTaskData(task);
            task = addMoreInfoToTask(task);
            self.allFlatTasks.push(task);
            taskIden.push('task:'+task.id);
            if (task.processInstanceId && task.processInstanceId!=null) {
                if(allProcessId.indexOf(task.processInstanceId) === -1) {
                    allProcessId.push(task.processInstanceId);
                }
            }
        }
        self.filterVariables.pageSize=self.myOwnFilter.size;
        self.filterVariables.page=self.myOwnFilter.page;
        self.filterVariables.processInstanceIds=JSON.stringify(allProcessId);
        let resVariable = {};
        resVariable = await taskApi.getVariableWorkflow(self.filterVariables);
        for (let item of resVariable.data) {
            if (self.allVariableProcess.indexOf(item.id) === -1) {
                self.allVariableProcess.push(item);
            }
        }
        this.$store.commit('file/setWaitingFileCountPerObj', taskIden);
        this.$store.commit('comment/setWaitingCommentCountPerObj', taskIden);
        this.$store.dispatch('file/getWaitingFileCountPerObj');
        this.$store.dispatch('comment/getWaitingCommentCountPerObj');
     
        console.log(listTasks, "listTassk");
        this.addOtherProcess(listTasks);
        this.loadingTaskList = false;
        this.loadingMoreTask = false;
    },
    addOtherProcess(listTasks) {
      for (let index in listTasks) {
        listTasks[index].assignee = this.getUser(
          parseInt(listTasks[index].assignee)
        );
        listTasks[index].owner = this.getUser(parseInt(listTasks[index].owner));
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
.colName{
    flex: 0 0 90%;
    max-width: 90%;
}
.dateTime{
    flex: 0 0 11.333333%;
    max-width: 11.333333%;
}
</style>
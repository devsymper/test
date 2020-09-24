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
          @create-task="getTasks({})"
          @refresh-task-list="getTasks()"
          @get-list-process-instance="listProrcessInstances = $event"
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
            <v-row
                class="item-task"
                v-for="(obj, idx) in listAllDocumentObjectId"
                :key="idx"
                :style="{
                    minHeight: '30px'
                }"
                :class="{
                        'd-active':indexObj==idx
                }"
              
                style="border-bottom: 1px solid #eeeeee!important;margin-left:0px!important"
            >
            
            </v-row>
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
        <!-- <workDetail
          :parentHeight="listTaskHeight"
          :workInfo="selectedWork.workInfo"
          @close-detail="closeDetail"
        ></workDetail> -->
      </v-col>
    </v-row>
  </div>
</template>

<script>
import BPMNEngine from "@/api/BPMNEngine";
import icon from "@/components/common/SymperIcon";
import listHeader from "./ListHeader";
import userSelector from "./UserSelector";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { util } from "../../../plugins/util";
import { appConfigs } from "../../../configs";
import {
  extractTaskInfoFromObject,
  addMoreInfoToTask
} from "@/components/process/processAction";
import symperAvatar from "@/components/common/SymperAvatar.vue";

export default {
  computed: {
    listAllDocumentObjectId() {
        let listObjRelated=this.stask.listDocumentObjId;
        let listObjUserSubmit=this.stask.listDocumentObjIdWithUserSubmit;

        return listObjUserSubmit;
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
                return this.$t("myItem.headerDoc");
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
            totalTask: 0,
            selectedTask: {
                taskInfo: {},
                idx: -1,
                originData: null
            },
            listProrcessInstances: [],
            isSmallRow: false,
            sideBySideMode: false,
            allFlatTasks: [],
            myOwnFilter: {
                size: 100,
                sort: "startTime",
                order: "desc",
                page: 1,
                assignee: this.$store.state.app.endUserInfo.id
            },
            defaultAvatar: appConfigs.defaultAvatar,
            listIdProcessInstance:[],
            listTaskDone:[],
            listDocumentObjectId:[]
        };
    },
    created() {
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
   
        handleReachEndList() {
        if (
            this.allFlatTasks.length < this.totalTask &&
            this.allFlatTasks.length > 0
        ) {
            this.myOwnFilter.page += 1;
            this.myOwnFilter.size = 50;

            this.getTasks();
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
            this.$set(this.selectedWork, "workInfo", obj);
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
                res = await BPMNEngine.getSubtasks(this.filterFromParent.parentTaskId,filter);
                if (filter.status == "done") {
                    listTasks = res.data;
                } else {
                    listTasks = res;
                }
            } else {
                if (!filter.assignee) {
                    filter.assignee = this.$store.state.app.endUserInfo.id;
                }
                res = await BPMNEngine.postTaskHistory(filter);// get danh sách task done and notDone
                listTasks = res.data;
            }
            this.totalTask = Number(res.total);
            let allProcess=[];
            for (let task of listTasks) {
                if (task.processInstanceId && task.processInstanceId!=null) {
                    if(allProcess.indexOf(task.processInstanceId) === -1) {
                        allProcess.push(task.processInstanceId);
                    }
                }
            }
            self.listIdProrcessInstances=allProcess;
            await self.getListTaskDoneInArrProcess(self.listIdProrcessInstances);
            await self.getListDocumentObjectId(this.$store.state.app.endUserInfo.id);
            self.loadingTaskList = false;
            self.loadingMoreTask = false;
        },
        async getListTaskDoneInArrProcess(listIdProrcessInstances){
            let self=this;
            try {
                for (let index = 0; index < listIdProrcessInstances.length; index++) {
                    let filter={};
                    filter.processInstanceId=listIdProrcessInstances[index];
                    filter.finished=true;
                    let res = await BPMNEngine.postTaskHistory(filter);
                    if (res.total>0) {
                        res.data.forEach(element => {
                            let description=JSON.parse(element.description);
                            if (description.action.parameter.documentObjectId &&description.action.parameter.documentObjectId!=null ) {
                                self.listDocumentObjectId.push(description.action.parameter.documentObjectId);
                            }
                        });
                    }
                }
                this.$store.dispatch("task/getListDocumentObjId", self.listDocumentObjectId);
                console.log("listObjId",self.listDocumentObjectId);
            } catch (error) {
               // self.listTaskDone=[];
                self.$snotifyError(error, "Get Process failed");
            }
        },
        async getListDocumentObjectId(userId){
            let self =this;
            self.$store.dispatch("task/getListDocumentObjIdWithUserSubmit",userId);
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
</style>
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
         <div
                v-for="(obj, idex) in groupAllProcessInstance"
                :key="idex"
            >
                <v-row
                   :class="{
                        'mr-0 ml-0 single-row': true ,
                        'py-1': !isSmallRow,
                        'py-0': isSmallRow,
                    }"
                    :style="{
                        minHeight: '30px'
                    }"
                    style="border-bottom: 1px solid #eeeeee!important;"
                >
                   <span style="color:#FF8003; font-size:13px;margin-left:16px;margin-top:6px">{{ showTime(obj.date)}}</span>
                </v-row>
                <v-row
                    v-for="(obj, idx) in obj.works"
                    :key="idx"
                    :index="obj.id"
                    :class="{
                                    'mr-0 ml-0 single-row': true ,
                                    'py-1': !isSmallRow,
                                    'py-0': isSmallRow,
                                    'd-active':index==idx && dataIndex==idex
                                }"
                    :style="{
                        minHeight: '50px'
                    }"
                    @click="selectObject(obj, idx,idex)"
                    style="border-bottom: 1px solid #eeeeee!important;"
                          
                >
                    <v-col :cols="sideBySideMode ? 10 : compackMode ? 6: 4" class="pl-3 pr-1 pb-1 pt-2">
                    <div class="pl-1">
                        <div class="pa-0 mt-1 lighten-2 d-flex justify-space-between">
                            <div
                                class="fs-13 text-ellipsis w-100"
                            >
                                <v-icon v-if="obj.endTime && obj.endTime!=null" style="font-size:11px; color:green;margin-left: 3px;">mdi-circle</v-icon>
                                <v-icon v-else style="font-size:11px ; color:blue;margin-left: 3px;">mdi-circle</v-icon>
                            {{ obj.name}}
                            </div>

                            <div class="fs-11 py-0 " style="width:200px">
                                <v-icon class="grey--text lighten-2 ml-1" x-small>mdi-clock-time-nine-outline</v-icon>
                                {{obj.startTime ? $moment(obj.startTime).format('DD/MM/YY HH:mm:ss'):$moment(obj.endTime).format('DD/MM/YY HH:mm:ss')}}
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
                        <symperAvatar :size="20"  />
                        {{obj.startUserId}}
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
                       <div class="">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                <span
                                    v-on="on"
                                    v-if="obj.processDefinitionName"
                                    class=" text-left fs-13 pr-6 text-ellipsis w-80 title-quytrinh"
                                >{{obj.processDefinitionName}}</span>
                                <span v-on="on" v-else class="text-left fs-13 pr-6 text-ellipsis w-80 title-quytrinh">ad hoc</span>
                                </template>
                                <span>{{ obj.processDefinitionName?  obj.processDefinitionName : `ad hoc` }}</span>
                            </v-tooltip>
                            <div class="pa-0 grey--text mt-1 lighten-2 d-flex justify-space-between">
                      
                            </div>
                        </div>
                        
                    </v-col>
                     <v-col
                        v-if="!sideBySideMode"
                        cols="2"
                        class="fs-13 px-1 py-0"
                    >
                        <div class="pl-1">
                            <div style="width:55px">10 <v-icon class="fs-14" style="float:right;margin-top:4px;margin-right:12px">mdi-comment-processing-outline</v-icon> </div>
                            <div style="width:55px"> 2 <v-icon class="fs-14" style="float:right;margin-top:4px;margin-right:12px">mdi-attachment</v-icon></div>
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
      <!-- <userSelector ref="user" class="d-none"></userSelector> -->
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
import {
  extractTaskInfoFromObject,
  addMoreInfoToTask
} from "@/components/process/processAction";
import symperAvatar from "@/components/common/SymperAvatar.vue";

export default {
  computed: {
    groupAllProcessInstance() {
        let allPrcess = this.listProrcessInstances;
        const groups = allPrcess.reduce((groups, work) => {
            let date;
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
        console.log("addd",groupArrayWork);
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
      totalTask: 0,
      selectedTask: {
        taskInfo: {},
        idx: -1,
        originData: null
      },
      selectedWork:{
        workInfo: {},
        idx: -1,
      },
      listProrcessInstances: [],
      isSmallRow: false,
      sideBySideMode: false,
      allFlatTasks: [],
      myOwnFilter: {
        size: 100,
        sort: "createTime",
        order: "desc",
        page: 1,
        assignee: this.$store.state.app.endUserInfo.id
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
            if (!filter.assignee) {
            filter.assignee = this.$store.state.app.endUserInfo.id;
            }
            res = await BPMNEngine.getTask(filter);
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
        await this.getListProcessInstance(self.listIdProrcessInstances);
        self.loadingTaskList = false;
        self.loadingMoreTask = false;
    },
    async getListProcessInstance(listIdProrcessInstances,status=""){
        let self=this;
        try {
            let filter={};
            if (status=='') { // get process 
                filter.processInstanceIds=listIdProrcessInstances;
                filter.size=100;
                filter.sort='startTime';
                filter.order='desc';
                let res = await BPMNEngine.getProcessInstanceHistory(filter);
                self.listProrcessInstances=res.data;
            }else if(status=='done'){ 
               
            }
        } catch (error) {
            self.$snotifyError(error, "Get Process failed");
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
</style>
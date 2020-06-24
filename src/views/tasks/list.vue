<template>
    <div class="list-objects">
        <v-row class="mr-0 ml-0">
            <v-col
                :cols="!sideBySideMode ? 12 : 4"
                :md="!sideBySideMode ? 12 : 3"
                class="pt-0 pl-0 pr-0 pb-0">
                <listHeader
                    :isSmallRow="isSmallRow"
                    :headerTitle="headerTitle"
                    :sideBySideMode="sideBySideMode"
                    :compackMode="compackMode"
                    :parentTaskId="filterFromParent.parentTaskId"
                    @change-density="isSmallRow = !isSmallRow"
                    @filter-change-value="handleChangeFilterValue"
                    @create-task="getTasks({})"
                    @get-list-process-instance="listProrcessInstances = $event"
                ></listHeader>
                <v-divider v-if="!sideBySideMode"></v-divider>
                <v-row class="ml-0 mr-0" v-if="!sideBySideMode">
                    <v-col cols="12" class="list-tasks pt-0 pb-0">
                        <v-row>
                            <v-col
                                :cols="sideBySideMode ? 12 : compackMode ? 6 : 4"
                                class="pl-3 fs-13 font-weight-medium "
                            >{{$t("tasks.header.name")}}</v-col>
                            <v-col
                                cols="2"
                                v-if="!sideBySideMode"
                                class="fs-13 font-weight-medium "
                            >{{$t("tasks.header.assignee")}}</v-col>
                            <v-col
                                cols="2"
                                v-if="!sideBySideMode"
                                class="fs-13 font-weight-medium "
                            >{{$t("tasks.header.dueDate")}}</v-col>
                            <v-col
                                cols="2"
                                v-if="!sideBySideMode"
                                class="fs-13 font-weight-medium "
                            >{{$t("tasks.header.owner")}}</v-col>
                            <v-col
                                cols="2"
                                v-if="!sideBySideMode && !compackMode && !smallComponentMode"
                                class="fs-13 font-weight-medium ">
                                {{$t("common.workflows")}}
                            </v-col>
                        </v-row>
                    </v-col>
                </v-row>
                <v-divider></v-divider>

                <VuePerfectScrollbar :style="{height: listTaskHeight+'px'}">
                    <v-row
                        v-for="(obj, idx) in allFlatTasks"
                        :key="idx"
                        :index="obj.id"
                        class="mr-0 ml-0 single-row"
                        @click="selectObject(obj, idx)">
                        <v-col
                            :cols="sideBySideMode ? 12 : compackMode ? 6: 4"
                            class="pl-3 pr-1"
                            :class="{
                                        'pt-0': isSmallRow,
                                        'pb-0': isSmallRow,
                                        'pb-1': !isSmallRow,
                                        'pt-1': !isSmallRow,
                                    }"
                        >
                            <div class="pl-1">
                                <div class="fz-13 text-truncate d-inline-block float-left text-ellipsis w-100">{{obj.name}}</div>
                                <div class="text-left fs-12 pr-6 text-ellipsis w-100">
                                    {{obj.taskData.content}}
                                </div>
                                <div
                                    class="pa-0 grey--text lighten-2 d-flex justify-space-between">
                                    <div class="fs-12 pr-6 text-ellipsis">
                                        {{obj.taskData.extraLabel}}   {{obj.taskData.extraValue}}
                                    </div>

                                    <div class="fs-12 py-0 pr-2 text-ellipsis" >
                                        {{$moment(obj.createTime).fromNow()}}
                                        <v-icon class="grey--text lighten-2 ml-1" x-small>mdi-clock-time-nine-outline</v-icon>
                                    </div>
                                </div>
                            </div>
                        </v-col>
                        <v-col
                            v-if="!sideBySideMode"
                            cols="2"
                            class="fs-13 pl-1 pr-1"
                            :class="{'pt-0': isSmallRow, 'pb-0': isSmallRow}">
                            
                                <v-avatar size="25" class="mr-2">
                                    <img :src="obj.assigneeInfo.avatar ? obj.assigneeInfo.avatar : require('@/assets/image/avatar_default.jpg')" />
                                </v-avatar>
                                {{obj.assigneeInfo.displayName}}
                        </v-col>
                        <v-col
                            v-if="!sideBySideMode"
                            cols="2"
                            class="fs-13 pl-1 pr-1"
                            :class="{'pt-0': isSmallRow, 'pb-0': isSmallRow}"
                        >
                            <span class="mt-1 ">{{$moment(obj.dueDate).fromNow()}}</span>
                        </v-col>
                        <v-col
                            v-if="!sideBySideMode"
                            cols="2"
                            class="fs-13 pl-1 pr-1"
                            :class="{'pt-0': isSmallRow, 'pb-0': isSmallRow}">
                            <v-chip
                                color="transparent"
                                class="mt-0 pl-1 pr-0 d-inline-block text-truncate"
                                small
                                label
                                v-if="obj.owner != null">
                                <v-avatar size="25" class="mr-2">
                                    <img :src="obj.ownerInfo.avatar" alt v-if="!!obj.ownerInfo.avatar" />
                                    <v-icon v-else v-text="obj.ownerInfo.avatar"></v-icon>
                                </v-avatar>
                                {{obj.ownerInfo.displayName}}
                            </v-chip>
                        </v-col>
                        <v-col cols="2" v-if="!sideBySideMode && !smallComponentMode">
                            <span class="mt-1 d-inline-block fs-13">{{obj.processDefinitionName}}</span>
                        </v-col>
                    </v-row>
                </VuePerfectScrollbar>
            </v-col>
            <v-col
                :cols="!sideBySideMode ? 0 : 8"
                :md="!sideBySideMode ? 0 : 9"
                v-if="sideBySideMode"
                class="pa-0 ma-0"
                height="30"
                style="border-left: 1px solid #e0e0e0;">
                <taskDetail
                    :parentHeight="listTaskHeight" 
                    :taskInfo="selectedTask.taskInfo" 
                    @close-detail="closeDetail"
                    @task-submited="handleTaskSubmited"></taskDetail>
            </v-col> 
            <userSelector ref="user" class="d-none"></userSelector>
        </v-row>
    </div>
</template>

<script>
import BPMNEngine from "./../../api/BPMNEngine";
import icon from "../../components/common/SymperIcon";
import taskDetail from "./taskDetail";
import listHeader from "./listHeader";
import userSelector from "./userSelector";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { util } from '../../plugins/util';
import { appConfigs } from '../../configs';
 
function getUndefinedActionTask(task){
    return {
        "action": {
            "module": "document",
            "resource": "document_object",
            "scope": "workflow",
            "action": "undefined",
            "parameter": {
                "processDefinitionId": task.processDefinitionId,
                "processInstanceId": task.processInstanceId,
                "taskId": task.id,
                "title": task.name,
                "description": task.description,
            }
        },
        "content": "",
        "extraLable": "",
        "extraValue": "",
        "approvalActions": "",
        "targetElement": ""
    }
}


export default {
    computed: {
        // Liệt kê danh sách các task dưới dạng phẳng - ko phân cấp
        flatTasks(){
            let tasks = [];
            for(let def of this.listProrcessInstances){
                for(let instances of def.objects){
                    for(let task of instances.tasks){
                        task.bizKey = ''; // Business key của process instance
                        tasks.push(task);
                    }
                }
            }
            return tasks;
        }
    },
    name: "listTask",
    components: {
        icon: icon,
        taskDetail: taskDetail,
        listHeader: listHeader,
        userSelector: userSelector,
        VuePerfectScrollbar: VuePerfectScrollbar
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
            default(){
                return {}
            }
        },
        headerTitle: {
            type: String,
            default: 'List tasks'
        },
        filterTaskAction: {
            type: String,
            default: 'getList'
        }
    },
    data: function() {
        return {
            listTaskHeight: 300,
            selectedTask: {
                taskInfo: {},
                idx: -1
            },
            listProrcessInstances: [],
            isSmallRow: false,
            sideBySideMode: false,
            openPanel: [0, 1, 2, 3, 4],
            allFlatTasks: [],
            myOwnFilter: {
                size: 100,
                sort: 'createTime',
                order: 'desc',
                assignee: this.$store.state.app.endUserInfo.id
            },
            defaultAvatar: appConfigs.defaultAvatar
        };
    },
    created(){
        let self = this;
        this.$evtBus.$on('symper-update-task-assignment', (updatedTask) => {
            updatedTask.taskData = self.getTaskData(updatedTask);
            self.selectObject(updatedTask, self.selectedTask.idx);
            self.$set(self.allFlatTasks, self.selectedTask.idx, updatedTask);
        });
    },
    mounted() {
        let self = this;
        this.$store.dispatch('process/getAllDefinitions').then((res) => {
            self.getTasks();
        }).catch((err) => {

        });
        self.reCalcListTaskHeight();
    },
    methods: {
        handleTaskSubmited(){
            this.sideBySideMode = false;
            this.getTasks();
        },
        handleChangeFilterValue(data){
            for(let key in data){
                this.$set(this.myOwnFilter, key, data[key]);
            }
            this.getTasks();
        },
        reCalcListTaskHeight(){
            this.listTaskHeight = util.getComponentSize(this.$el.parentElement).h - 75;            
        },
        getUser(id) {
            this.$refs.user.getUser(id);
        },
        selectObject(obj, idx) {
            if(this.smallComponentMode){
                this.$goToPage('/tasks/' + obj.id, 'Do task');
            }else{
                this.selectedTask.idx = idx;
                if (!this.compackMode) {
                    this.sideBySideMode = true;
                    let taskInfo = {};
                    try {
                        taskInfo = JSON.parse(obj.description);
                        if(!taskInfo){
                            this.$snotifyWarning(error, "Can not parse task info");   
                            taskInfo = getUndefinedActionTask(obj);
                        }
                    } catch (error) {
                        taskInfo = getUndefinedActionTask(obj);
                        this.$snotifyWarning(error, "Can not parse task info");   
                    }

                    this.$set(this.selectedTask, 'taskInfo', taskInfo);
                    this.$emit("change-height", "calc(100vh - 88px)");
                }
            }
        },
        closeDetail() {
            this.sideBySideMode = false;
            this.$emit("change-height", "calc(100vh - 120px)");
        },
        getTaskData(task){
            let rsl = {
                content: '',
                extraLabel: '',
                extraValue: ''
            };
            try {
                let taskData = JSON.parse(task.description);
                if(taskData){
                     rsl = taskData;
                }
            } catch (error) {
                rsl.content = task.description;
            }
            return rsl;
        },
        async getTasks(filter = {}) {
            let self = this;
            this.listProrcessInstances = [];
            filter = Object.assign(filter, this.filterFromParent);
            filter = Object.assign(filter, this.myOwnFilter);
            let res = {};
            let listTasks = [];

            if(this.filterTaskAction == 'subtasks'){
                res = await BPMNEngine.getSubtasks(this.filterFromParent.parentTaskId, filter);
                listTasks = res;
            }else {
                res = await BPMNEngine.getTask(filter);
                listTasks = res.data;
            }
                        
            self.allFlatTasks = [];
            let mapUser = this.$store.getters['app/mapIdToUser'];
            for(let task of listTasks){
                task.taskData = self.getTaskData(task);
                task.assigneeInfo = {};
                if(mapUser[task.assignee]){
                    task.assigneeInfo = mapUser[task.assignee];
                }

                task.ownerInfo = {};
                if(mapUser[task.owner]){
                    task.ownerInfo = mapUser[task.owner];                
                }

                let allDefinitions = this.$store.state.process.allDefinitions;
                if(allDefinitions[task.processDefinitionId]){
                    task.processDefinitionName = allDefinitions[task.processDefinitionId].name;
                }
                self.allFlatTasks.push(task);
            }
            this.listProrcessInstances.forEach(
                (process, processIndex) => {
                    process.objects.forEach(
                        (instance, instanceIndex) => {
                            this.listProrcessInstances[
                                processIndex
                            ].objects[instanceIndex].tasks = [];
                            // let index = 0;
                            for (let index in listTasks) {
                                listTasks[
                                    index
                                ].assignee = this.getUser(
                                    parseInt(listTasks[index].assignee)
                                );
                                listTasks[index].owner = this.getUser(
                                    parseInt(listTasks[index].owner)
                                );
                                if (
                                    listTasks[index]
                                        .processInstanceId ==
                                    instance.id
                                ) {
                                    this.listProrcessInstances[
                                        processIndex
                                    ].objects[instanceIndex].tasks.push(
                                        listTasks[index]
                                    );
                                    listTasks.splice(index, 1);
                                }
                            }
                        }
                    );
                }
            );
            this.addOtherProcess(listTasks);
        },
        addOtherProcess(listTasks) {
            for (let index in listTasks) {
                listTasks[index].assignee = this.getUser(
                    parseInt(listTasks[index].assignee)
                );
                listTasks[index].owner = this.getUser(
                    parseInt(listTasks[index].owner)
                );
            }
            this.listProrcessInstances.push({
                processDefinitionId: null,
                processDefinitionName: this.$t("common.other"),
                objects: [
                    {
                        id: null,
                        name: null,
                        tasks: listTasks
                    }
                ]
            });
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
</style>
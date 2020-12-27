<template>
    <div class="list-objects h-100" style="overflow: hidden;">
        <v-row class="mx-0 h-100">
            <v-col
                :cols="!sideBySideMode ? 12 : 4"
                :md="!sideBySideMode ? 12 : 3"
                class="pa-0"
            >
                <listHeader
                    :isSmallRow="isSmallRow"
                    :headerTitle="headerTitle"
                    :sideBySideMode="sideBySideMode"
                    :compackMode="compackMode"
                    :parentTaskId="filterFromParent.parentTaskId"
                    :changeStatusMoreApproval="changeStatusMoreApproval"
                    :totalObject="totalObject"
                    @change-density="isSmallRow = !isSmallRow"
                    @changeObjectType="changeObjectType"
                    @filter-change-value="handleChangeFilterValue"
                    @create-task="getData({})"
                    @refresh-task-list="getData({})"
                    @goToPageApproval="goToPageApproval"
                ></listHeader>
                <hr v-if="!sideBySideMode" role="separator" class="v-divider theme--light">

                <div class="h-100" v-if="!changeStatusMoreApproval">
                    <v-row class="ml-0 mr-0" v-if="!sideBySideMode">
                        <v-col cols="12" class="list-tasks py-0">
                            <v-row>
                                <v-col
                                    cols="1"
                                    class="pl-3 fs-13 font-weight-medium"
                                    style="flex:0!important"
                                >{{$t("tasks.header.type")}}</v-col>

                                <v-col
                                    :cols="sideBySideMode ? 12 : compackMode ? 5 : 3"
                                    class="pl-3 fs-13 font-weight-medium"
                                >
                                    {{$t("tasks.header.name")}}
                                    <v-icon 
                                        @click="showFilterColumn($event,'name')" 
                                        class="fs-15 float-right" 
                                        style="padding-top:3px"
                                        :class="{
                                            'd-active-color': filteredColumns['name'] && filteredColumns['name']==true ,
                                        }"
                                    >mdi-filter-variant</v-icon>
                                </v-col>

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
                                    class="fs-13 font-weight-medium date-time"
                                >{{$t("tasks.header.dueDate")}}
                                    <v-icon 
                                        @click="showFilterColumn($event,'dueDate')" 
                                        class="fs-15 float-right" 
                                        style="padding-top:3px"
                                        :class="{
                                            'd-active-color': filteredColumns['dueDate'] && filteredColumns['dueDate']==true ,
                                        }"
                                    >mdi-filter-variant</v-icon>
                                </v-col>

                                <v-col
                                    cols="1 col-app"
                                    v-if="!sideBySideMode && !compackMode && !smallComponentMode"
                                    class="fs-13 font-weight-medium"
                                >{{$t("tasks.header.app")}}
                                    <v-icon 
                                        @click="showFilterColumn($event,'processDefinitionName')" 
                                        class="fs-15 float-right" 
                                        style="padding-top:3px"
                                        :class="{
                                            'd-active-color': filteredColumns['processDefinitionName'] && filteredColumns['processDefinitionName']==true ,
                                        }"
                                    >mdi-filter-variant</v-icon>
                                </v-col>

                                <v-col
                                    cols="1"
                                    v-if="!sideBySideMode && !compackMode && !smallComponentMode"
                                    class="fs-13 font-weight-medium"
                                >{{$t("tasks.header.status")}}
                                        <v-icon 
                                        @click="showFilterColumn($event,'isDone')" 
                                        class="fs-15 float-right" 
                                        style="padding-top:3px"
                                        :class="{
                                            'd-active-color': filteredColumns['isDone'] && filteredColumns['isDone']==true ,
                                        }"
                                    >mdi-filter-variant</v-icon>
                                </v-col>
                                
                                <v-col
                                    cols="1"
                                    v-if="!sideBySideMode && !compackMode && !smallComponentMode"
                                    class="fs-13 font-weight-medium"
                                ></v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                    <hr role="separator" class="v-divider theme--light">

                    <VuePerfectScrollbar
                        v-if="!loadingTaskList"
                        @ps-y-reach-end="handleReachEndList"
                        :style="{height: (sideBySideMode ? (listTaskHeight + 40) : listTaskHeight ) + 'px'}"
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
                                    style="flex:0!important"
                                    cols="1"
                                    class="fs-12 px-1 py-0 pl-3"
                                >
                                    <div class="pt-1">
                                        <v-icon 
                                            class="fs-14"
                                            v-if="obj.taskData.action"
                                        >{{obj.taskData.action.action=='approval' ? 'mdi-seal-variant ': 'mdi-file-document-edit-outline'}}</v-icon>
                                        <i v-else class="fs-14 mdi mdi-checkbox-marked-circle-outline"></i>
                                    </div>

                                    <div 
                                        v-if="sideBySideMode" 
                                        :class="obj.dueDateClass" 
                                        style="height: 8px;width: 8px; display: inline-block; border-radius: 50%; margin-top: 8px; margin-left: 3px">
                                    </div>
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
                                                class="fs-11 pr-6 text-ellipsis" style="width:60%"
                                            >{{obj.taskData.extraLabel}} {{obj.taskData.extraValue}}</div>

                                            <div class="fs-11 py-0 pr-2 text-ellipsis">
                                                {{obj.createTimeDisplay}}
                                                <v-icon class="grey--text lighten-2 ml-1" x-small>mdi-clock-time-nine-outline</v-icon>
                                            </div>
                                        </div>
                                    </div>
                                </v-col>
                                <v-col
                                    v-show="!sideBySideMode"
                                    cols="2"
                                    class="fs-12 px-1 py-0 pt-2"
                                >
                                    <infoUser v-if="obj.assigneeInfo.id" class="userInfo" :userId="obj.assigneeInfo.id" :roleInfo="obj.assigneeRole?obj.assigneeRole:{}" />
                                </v-col>
                                <v-col
                                    v-show="!sideBySideMode"
                                    cols="2"
                                    class="fs-12 px-1 py-0 pt-2"
                                >
                                    <infoUser v-if="obj.ownerInfo.id" class="userInfo" :userId="obj.ownerInfo.id" :roleInfo="obj.ownerRole ? obj.ownerRole:{}" />
                                    <infoUser v-else-if="obj.assigneeInfo.id" class="userInfo" :userId="obj.assigneeInfo.id" :roleInfo="obj.assigneeRole" />
                                </v-col>
                                <v-col
                                    v-show="!sideBySideMode"
                                    cols="1"
                                    class="fs-13 px-1 py-0 date-time"
                                >
                                    <div class="pt-3">{{obj.dueDateFromNow}}</div>
                                </v-col>
                                <v-col
                                    class="py-0 px-1"
                                    cols="1 col-app"
                                    v-if="!sideBySideMode && !smallComponentMode"
                                >
                                <div 
                                    class="pl-1 pt-1"
                                    :class="{ 'pt-3': !obj.symperApplicationName}"    
                                >
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
                                            >{{obj.symperApplicationName}}</div>
                                        </div>
                                    </div>
                                </v-col>

                                <v-col
                                    v-show="!sideBySideMode"
                                    cols="1"
                                    class="fs-13 px-1 py-0"
                                >
                                    <div class="pt-3">
                                        <v-chip
                                            :class="obj.dueDateClass"
                                            text-color="white"
                                            style="border-radius:4px"
                                            x-small
                                        >{{obj.dueDateText}}</v-chip>
                                    </div>
                                </v-col>

                                <v-col
                                    v-show="!sideBySideMode"
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
                    <preloader 
                        v-else
                        :style="{height: (listTaskHeight - 30)+'px!important'}"
                        class="mx-auto" />
                    <hr role="separator" class="v-divider theme--light">
                    <Pagination
                        @on-change-page="getListByPage"
                        @on-change-page-size="getListByPage"
                        :totalVisible="sideBySideMode ? 3 : 7"
                        :showRange="!sideBySideMode"
                        class="mt-2 px-2" :total="totalObject"/>
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
                v-show="sideBySideMode"
                class="pa-0 ma-0 h-100"
                height="30"
                style="border-left: 1px solid #e0e0e0;"
            >
                <taskDetail
                    :parentHeight="listTaskHeight"
                    :taskInfo="selectedTask.taskInfo"
                    :originData="selectedTask.originData"
                    :appId="String(selectedTask.originData.symperApplicationId)"
                    :reload="false"
                    @change-info-task="changeInfoTask"
                    @close-detail="closeDetail"
                    @task-submited="handleTaskSubmited"
                    @changeUpdateAsignee="changeUpdateAsignee"
                ></taskDetail>
            </v-col>
        </v-row>
        <table-filter
            ref="tableFilter"
            :columnFilter="columnFilter()"
            @apply-filter-value="applyFilter"
            @search-autocomplete-items="searchAutocompleteItems"
        ></table-filter>
    </div>
</template>

<script>
import BPMNEngine from "@/api/BPMNEngine";
import icon from "@/components/common/SymperIcon";
import taskDetail from "./TaskDetail";
import listHeader from "./ListHeader";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { util } from "../../plugins/util";
import { appConfigs } from "../../configs";
import listTaskApproval from "./featureApproval/List";
import { taskApi } from "./../../api/task.js";
import infoUser from "./InfoUser";
import { getDataFromConfig, getDefaultFilterConfig } from "@/components/common/customTable/defaultFilterConfig.js";
import TableFilter from "@/components/common/customTable/TableFilter.vue";
import Pagination from "@/components/common/Pagination.vue";

import {
  extractTaskInfoFromObject,
  addMoreInfoToTask
} from "@/components/process/processAction";

export default {
    computed: {
        fileCountPerTask(){
            return this.$store.state.file.fileCountPerObj.list;
        },
        commentCountPerTask(){
            return this.$store.state.comment.commentCountPerObj.list;
        },
        groupFlatTasks() {
            let allTask = this.data;
            const groups = allTask.reduce((groups, task) => {
                let appName = "";
                if (task.symperApplicationId) {
                    let allApp = this.$store.state.task.allAppActive;
                    let app=allApp.find(element => element.id == task.symperApplicationId);
                    if (app) {
                        appName= app.name;
                    }
                }
                task.symperApplicationName = appName;
                let date;
                if ( task.createTime) {
                    date = task.createTime.split(" ")[0];
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
            console.log("taskkkk",groupArraysTask);
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
                this.getData();
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
        VuePerfectScrollbar: VuePerfectScrollbar,
        listTaskApproval,
        infoUser,
        TableFilter,
        Pagination
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
        },
        /**
         * Dữ liệu mặc định cho table
         */
        defaultData:{
            type: Object,
            default(){
                return {
                    listObject:{},
                    columns:{},
                    total:0
                }
            }
        },
        /**
         * Dùng Trong trường hợp mà gọi đến một API mà không thể thay đổi định dạng trả về của API đó  theo đúng với định dạng chung của ListItem 
         * định dạng: 
         * {
         *     reformatData(res){} // Lấy ra các cột cần hiển thị
         * }
         **/
        customAPIResult: {
            type: Object,
            default(){
                return {}
            }
        },
    },
    data: function() {
        return {
            debounceGetData:null,
            data:[],
            page: 1, // trang hiện tại
            pageSize: 50,
            searchKey: "", //Từ khóa cần tìm kiếm trên tất cả các cột,
            totalObject:0,// Tổng số trang của danh sách này
            tableFilter: {
                // cấu hình filter của danh sách này
                allColumn: {
                    // cấu hình filter của tất cả các cột trong bảng này dạng {tên cột : cấu hình filter}
                    
                },
                currentColumn: {
                    colFilter: getDefaultFilterConfig(),
                    name: ""
                }
            },
            filteredColumns: {}, // tên các cột đã có filter, dạng {tên cột : true},
            getDataUrl: appConfigs.apiDomain.workflowExtend+"tasks",
             /**
             * Thêm điều kiện để quy vấn qua api
             */
            conditionByFormula:{
                type:String
            },
            tableColumns: [],
            index: -1,
            dataIndex:-1,
            changeStatusMoreApproval:false,
            loadingTaskList: false,
            listTaskHeight: 300,
            selectedTask: {
                taskInfo: {},
                idx: -1,
                originData: {}
            },
            isSmallRow: false,
            sideBySideMode: false,
            myOwnFilter: {
                size: 50,
                sort: "createTime",
                order: "desc",
                page: 1,
                involvedUser: this.$store.state.app.endUserInfo.id+"%"
            },
          
        };
    },
    created() {
        let self = this;
        this.$store
            .dispatch("process/getAllDefinitions")
            .then(res => {
                self.getData();
            })
            .catch(err => {});
        this.$evtBus.$on("symper-update-task-assignment", updatedTask => {
            updatedTask.taskData = self.getTaskData(updatedTask);
            self.selectObject(updatedTask, self.selectedTask.idx);
            self.$set(self.data, self.selectedTask.idx, updatedTask);
        });
        //this.getData();
    },
    mounted() {
        let self = this;
        self.reCalcListTaskHeight();
        this.$evtBus.$on('app-receive-remote-msg', (payload) => {
            if(!self._inactive){
                self.getData(false, false,true,true,false);
            }
        });
    },
    activated(){
        this.getData(false, false,true,true,false);
    },
    methods: {
        getListByPage(data){
            this.page = data.page;
            this.pageSize = data.pageSize;
            this.getData();
        },
        columnFilter(){
            if (this.tableFilter.currentColumn.name=="isDone") {
                if(this.tableFilter.currentColumn.colFilter.selectItems.length>0){
                    let items=this.tableFilter.currentColumn.colFilter.selectItems;
                    for (let i = 0; i < items.length; i++) {
                        if (items[i].value==1) {
                            this.tableFilter.currentColumn.colFilter.selectItems[i].label=this.$t('common.done');
                        }else if(items[i].value==0){
                            this.tableFilter.currentColumn.colFilter.selectItems[i].label=this.$t('myItem.unfinished');
                        }
                    }
                }
            }
            return this.tableFilter.currentColumn.colFilter;
        },
        /**
         * Kiểm tra xem một cột trong table có đang áp dụng filter hay ko
         */
        checkColumnHasFilter(colName, filter = false) {
            if (!filter) {
                filter = this.tableFilter.allColumn[colName];
            }
            if (!filter) {
                return false;
            } else {
                if (
                    filter.sort == "" &&
                    $.isEmptyObject(filter.valuesIn) &&
                    $.isEmptyObject(filter.valuesNotIn) &&
                    filter.conditionFilter.items[0].type == "none" &&
                    filter.searchKey == ''
                ) {
                    return false;
                } else {
                    return true;
                }
            }
        },
        /**
         * Thực hiện filter khi người dùng click vào nút apply của filter
         */
        applyFilter(filter, source = "filter") {
            this.page=1;// gán lại page=1 để reset data
            let colName = this.tableFilter.currentColumn.name;
            this.$set(this.tableFilter.allColumn, colName, filter);
            let hasFilter = this.checkColumnHasFilter(colName, filter);
            this.filteredColumns[colName] = hasFilter;
            let icon = $(this.$el).find(
                ".symper-table-dropdown-button[col-name=" + colName + "]"
            );
            this.getData(false,false,true);
            if(hasFilter && source != "clear-filter"){
                icon.addClass("applied-filter");
            }else{
                this.$delete(this.tableFilter.allColumn, colName);
                icon.removeClass("applied-filter");
            }
        },
        showFilterColumn(event,colName){
            let x=event.clientX;
            let y=event.clientY;
            var windowWidth = $(window).width()/1.1;
            if( event.clientX > windowWidth){
                x-= 190;
            }
            event.preventDefault();
            event.stopPropagation();
            let filterDom = $(this.$refs.tableFilter.$el);
            filterDom.css("left", x + "px").css("top", y + 20 + "px");
            this.$refs.tableFilter.show();
            let colFilter = this.tableFilter.allColumn[colName];
            if (!colFilter) {
                colFilter = getDefaultFilterConfig();
                this.$set(this.tableFilter.allColumn, colName, colFilter);
            }
         
            this.$set(this.tableFilter, "currentColumn", {
                name: colName,
                colFilter: colFilter
            });
            this.getItemForValueFilter();

        },
        /**
         * Lấy các item phục vụ cho việc lựa chọn trong autocomplete cuar filter
         */
        getItemForValueFilter(){
            let columns = [this.tableFilter.currentColumn.name];
            let self = this;
            let options = {
                pageSize: 300,
                getDataMode: 'autocomplete',
                distinct: true,
                page: 1
            };
            let success = (data) => {
                if(data.status == 200){
                    self.tableFilter.currentColumn.colFilter.selectItems = null;
                    let items = data.data.listObject.reduce((arr, el) => {
                        arr.push(el[columns[0]]);
                        return arr;
                    }, []);
                    self.tableFilter.currentColumn.colFilter.selectItems = self.createSelectableItems(items);
                }
                console.log(self.tableFilter.currentColumn.selectItems, 'datadatadatadatadata');
            }
            this.prepareFilterAndCallApi(columns , false, true, success, options);
        },
        /* Lấy ra cấu hình cho việc sort
         */
        prepareFilterAndCallApi(columns = false, cache = false, applyFilter = false, success, configs = {}){
            if(Object.keys(this.defaultData.listObject).length > 0){
                success({data:this.defaultData});
                return;
            }
            let url = this.getDataUrl;
            let method = 'GET';
            if (url != "") {
                let thisCpn = this;
                // thisCpn.loadingData = true;
                // let options = this.getOptionForGetList(configs, columns);
                let emptyOption = false;
                let header = {};
                let routeName = this.$getRouteName();
                if(routeName == "deployHistory" || routeName == "listProcessInstances"){
                    header = {
                        Authorization: 'Basic cmVzdC1hZG1pbjp0ZXN0'
                    };
                    // options = {};
                    emptyOption = true;
                }

                configs.searchKey = this.searchKey;
                configs.page = configs.page ? configs.page : this.page;
                configs.pageSize = this.pageSize;
                configs.formulaCondition = this.conditionByFormula;
                let tableFilter = this.tableFilter;
                tableFilter.allColumnInTable = [];
                configs.emptyOption = emptyOption;
                configs.moreApiParam = {
                    variables : 'symper_last_executor_id,symper_user_id_start_workflow,symper_last_executor_name',
                }
                
                getDataFromConfig(url, configs, columns, tableFilter, success, 'GET', header);
            }
        },
      
        searchAutocompleteItems(vl){
            this.tableFilter.currentColumn.colFilter.searchKey = vl;
            this.getItemForValueFilter();
        },
            /**
         * Tạo ra các item có check box với trạng thái đã check hay chưa 
         * @param items danh sách các value dạng ['ccc','xxc', ....]
         */
        createSelectableItems(items){
            let colFilter = this.tableFilter.currentColumn.colFilter;
            let selectableItems = [];
            if(colFilter.clickedSelectAll){ // chọn tất cả
                selectableItems = items.reduce((arr, el) => {
                    arr.push({
                        value: el,
                        checked: true
                    });
                    return arr;
                }, []);
            }else if(colFilter.selectAll){ // not in
                selectableItems = items.reduce((arr, el) => {
                    arr.push({
                        value: el,
                        checked: colFilter.valuesNotIn[el] ? false : true
                    });
                    return arr;
                }, []);
            }else{ // in
                selectableItems = items.reduce((arr, el) => {
                    arr.push({
                        value: el,
                        checked: colFilter.valuesIn[el] ? true : false
                    });
                    return arr;
                }, []);
            }  
            return selectableItems;
        },

        /**~~~~~~~~~~~~~~~~~~~~ */
        checkTimeDueDate(item){
            if (item.dueDate) {
                let dueDate=new Date(item.dueDate).getTime();
                if (dueDate < Date.now()) {
                    return true;
                }else{
                    return false;
                }
            }else{
                return false;
            }
        },
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
        changeObjectType(index) {
            this.$emit("changeObjectType", index);
        },
        handleReachEndList() {
            // if (
            //     this.data.length < this.totalObject &&
            //     this.data.length > 0  && !this.loadingTaskList
            // ) {
            //     this.page +=1;
            //     this.getData();
            // }
        },
        handleTaskSubmited() {
            this.sideBySideMode = false;
            this.getData();
        },
        handleChangeFilterValue(data) {
            // for (let key in data) {
            //     this.$set(this.myOwnFilter, key, data[key]);
            // }
            // this.getData();

            this.searchKey = data.nameLike;
            if(this.debounceGetData){
                clearTimeout(this.debounceGetData);
            }
            this.debounceGetData = setTimeout((self) => {
				self.page = 1
                self.getData();
            }, 300, this);
        },
        reCalcListTaskHeight() {
            this.listTaskHeight =
                util.getComponentSize(this.$el.parentElement).h - 130;
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
        /**
         * Lấy data từ server
         * @param {Array} columns chứa thông tin của các cột cần trả về.
         * @param {Boolean} cache có ưu tiên dữ liệu từ cache hay ko
         *
         */
        getData(columns = false, cache = false, applyFilter = true, lazyLoad = true, showLoading = true ) {
            if (this.loadingTaskList) {
                return;
            }

            if(showLoading){
                this.loadingTaskList = true;
            }
            let self = this;

            if (Object.keys(this.tableFilter.allColumn).length==0 ) {
                this.tableFilter.allColumn["createTime"] = getDefaultFilterConfig();
                this.tableFilter.allColumn.createTime.sort="desc";
            }
            this.$store.dispatch('task/getAllAppActive');
            let thisCpn = this;
            let handler = (data) => {
                if(thisCpn.customAPIResult.reformatData){
                    data = thisCpn.customAPIResult.reformatData(data);
                }else{
                    data = data.data;
                }
                this.totalObject = data.total ? parseInt(data.total) : 0;
                let resData = data.listObject ? data.listObject : []

                let  taskIden = []; 
                let newListTask = [];
                if(lazyLoad){
                    resData.forEach(function(e){
                        taskIden.push('task:'+e.id);
                        e.taskData = thisCpn.getTaskData(e);
                        addMoreInfoToTask(e);
                        thisCpn.setDueDateInfoDisplay(e);
                        newListTask.push(e);
                    })
                    this.data = newListTask;
                }

                this.$store.commit('file/setWaitingFileCountPerObj', taskIden);
                this.$store.commit('comment/setWaitingCommentCountPerObj', taskIden);
                this.$store.dispatch('file/getWaitingFileCountPerObj');
                this.$store.dispatch('comment/getWaitingCommentCountPerObj');

        
                console.log("lisssssst",this.data);
                thisCpn.$emit('data-get', data.listObject);
                thisCpn.loadingTaskList = false;
            }
            this.prepareFilterAndCallApi(columns , cache , applyFilter, handler);
        },
        setDueDateInfoDisplay(e){
            let dueDateInfo = this.getDueDateInfo(e);
            e.dueDateClass = dueDateInfo.class;
            e.dueDateText = dueDateInfo.text;
            e.createTimeDisplay = e.createTime ? this.$moment(e.createTime).format('DD/MM/YY HH:mm') : this.$moment(e.endTime).format('DD/MM/YY HH:mm');
            e.dueDateFromNow = e.dueDate ? this.$moment(e.dueDate).fromNow() : '';
        },
        getDueDateInfo(obj){
            let overDue = this.checkTimeDueDate(obj);
            if(obj.endTime){
                return {
                    class: 'task-done' ,
                    text: this.$t('common.done'),
                }
            }else if(obj.createTime && !overDue){
                return {
                    class: 'task-to-do' ,
                    text: this.$t('myItem.unfinished'),
                }
            }else{
                return {
                    class: 'task-over-due' ,
                    text: this.$t('myItem.unfinished'),
                }
            }
        },

        changeInfoTask(selectedTask){
            selectedTask.originData.createTime=selectedTask.originData.startTime;
            this.$set(this.selectedTask, "originData", selectedTask.originData);  
            this.$set(this.selectedTask, "taskInfo", selectedTask.taskInfo);  

            for (let i = 0; i < this.groupFlatTasks.length; i++) {
                for (let j = 0; j < this.groupFlatTasks[i].tasks.length; j++) {
                    let task=this.groupFlatTasks[i].tasks[j];
                    if (task.id == selectedTask.originData.id) {
                        this.groupFlatTasks[i].tasks[j].endTime = this.$moment(selectedTask.originData.endTime).format('DD/MM/YY HH:mm:ss') ;
                        this.groupFlatTasks[i].tasks[j].description = selectedTask.originData.description;
                        this.setDueDateInfoDisplay(this.groupFlatTasks[i].tasks[j]);
                        return;
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
.colName{
    flex: 0 0 90%;
    max-width: 90%;
}
.date-time{
    flex: 0 0 10.333333%;
    max-width: 10.333333%;
}
.d-active-color{
    color: #f58634;
}
.col-app{
    flex: 0 0 11.333333%;
    max-width: 11.333333%;
}

.task-done {
    background-color: #408137!important;
}


.task-over-due {
    background-color: #EE6B60!important;
}


.task-to-do {
    background-color: #0760D9!important;
}
</style>
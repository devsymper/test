<template>
<div class=' h-100' >
    <div class="d-flex justify-space-between">
        <period-selector style="width:60%" />
        <div style="width:40%" class="d-flex justify-end">
            <ActionButtons ref="action" />
            <CalendarViewMode
                ref="viewmode"
                @change-cate-color="changeCateColor"
                @change-color="changeColor"
                @time_view="time_view = true"
                @list_view="time_view = false" />
        </div>
    </div>
    <v-dialog v-model="logtimeDialog" width="357" @click:outside="deleteLog()">
        <LogTimeForm v-show="!showTask"
            ref="logtime"
            @showTaskForm="showTaskForm"
            @loadMonthView="loadMonthView"
            @create-log="createLog"
            @create-list-log="creatListLog"
            @showCategoryForm="showCategoryForm"
            :eventLog="eventLog"
            @update-log="updateLog"
            :updateAPICategory ="updateAPICate"
            @cancel="cancelSave()"
            :dateMonth ="dateMonth"
            :formType="formType"
            :cancelTask="cancelTask"
            :cancelCate="cancelCate"
            @doneCate="updateAPICate=false"
            :update ="update"
            :onSave="onSaveLogTimeEvent"
            :deleteLastEvent="deleteLastEvent">
        </LogTimeForm>
         <TaskForm
            :category="cate"
            @loadTask="loadTask()"
            @docId="getDocId"
            v-show="showTask&&!showCategory" 
            @cancel="cancelTaskForm()"/>
         <CategoryForm
            ref="cate"
            :isAddView="true"
            @updateList="updateAPICategory()"
            v-show="showCategory" 
            @cancel="cancelCateForm()"/>
    </v-dialog>
     <!-- test -->
      <v-dialog
        v-model="remindDialog"
        width="500"
      >
        <v-card>
        <v-card-text style="padding-top:20px">
            Đã đến giờ lưu lại công việc!
        </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              text
              @click="remindDialog = false">
              OK
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <!-- submit task -->
      <v-dialog
        class="showTask"
        style="width:850px;height:1000px"
        v-model="showSubmitTask"
      >
       <div class="bg-white" >
            <TaskDetail
                @close-detail="closeTaskSubmit"
               :taskInfo="data.taskInfo"
                :originData="data.originData"
                :parentHeight="800" 
                :allVariableProcess="variableProcess"
                @task-submited="handleTaskSubmited"
            />
       </div>
      </v-dialog> 
      <v-dialog
        v-model="showListProcess"
        width="500"
      >
       <div class="bg-white">
          <SelectListProcess @select-process-key="selectProcess" :listProcess="listProcess"/>
       </div>
      </v-dialog> 
    <!-- submit task -->
    <!-- test -->
    <v-dialog v-model="deleteDialog" width="357">
        <DeleteLogView
            @cancel="cancelDelete()"
            :deleteEvent="deleteEvent"
            :onDelete="onDeleteLogTimeEvent">
        </DeleteLogView>
    </v-dialog>
    <LogCalendar
        @showLog="showLog" 
         @quick-cancel="quickCancel"
        :monEvents="monthEvents"
        ref="logCalendar" 
        :time-view="time_view" 
        @create-time="onCreateTime" 
        @delete-logtime="deleteLogTime" />
</div>
</template>

<script>
import { runProcessDefinition,extractTaskInfoFromObject,addMoreInfoToTask,test} from '../../components/process/processAction';
import LogCalendar from "../../components/timesheet/LogCalendar";
import PeriodSelector from "../../components/timesheet/PeriodSelector";
import ActionButtons from "../../components/timesheet/ActionButtons";
import TaskForm from "./../../components/timesheet/TaskForm";
import CalendarViewMode from "../../components/timesheet/CalendarViewMode";
import LogTimeForm from "../../components/timesheet/LogTimeForm";
import SelectListProcess from "../../components/timesheet/form/SelectListProcess";
import DeleteLogView from "../../components/timesheet/DeleteLogView";
import CategoryForm from "../../components/timesheet/CategoryForm";
import timesheetApi from '../../api/timesheet';
import TaskDetail from "./../../components/myItem/TaskDetail";
import BPMNEApi from "../../api/BPMNEngine";
import { getLastestDefinition } from "../../components/process/processAction.js";
import {getFirstNodeData as handleStartProcess} from '../../components/process/StartProcess';

export default {
  watch: {
    showListProcess(){
        if(this.showListProcess){
            this.logtimeDialog = false;
            let docId = [this.docId];
            this.getAllProcess(docId);
        }
    },
    taskInfo(){
        this.data = this.taskInfo.data;
        this.variableProcess = this.taskInfo.variableProcess;
        this.$store.commit('timesheet/showListProcess', false);
        this.cancelSave();
        this.$store.commit('timesheet/showSubmitTask', true);
    }
  },
    name: "showLogTime",
    components: {
        SelectListProcess,
        TaskDetail,
        "period-selector": PeriodSelector,
        ActionButtons,
        CalendarViewMode,
        LogCalendar,
        LogTimeForm,
        DeleteLogView,
        TaskForm,CategoryForm
    },
    data() {
        return {
            docId:-1,
            listProcess:[],
            data: {
                taskInfo: {},
                originData: {}
            },
            cate:{},// lưu thông tin category ở log cho task form
            definitionModel: {}, // các cấu hình của process definition
            showTaskDetail:false,
            //task submit
            variableProcess:[],
            //task submit
            monthEvents:{},
            showTask:false,
            showCategory:false,
            time_view: true,
            eventLog:{},
            updateAPICate:false,
            // log form
            dateMonth:'',
            cancelTask:false,
            cancelCate:false,
            logtimeDialog: false,
            logtimeEvent: null,
            formType: 'log',
            update: false,
            onSaveLogTimeEvent: () => null,
            deleteLastEvent: () => null,
            // delete form
            deleteDialog: false,
            check_daily:false,
            deleteEvent: null,
            time_remind_daily_log: '20:43',
            onDeleteLogTimeEvent: () => null,
            remindDialog: false
        }
    },
    created() {
        setInterval(this.getNow, 1000 * 60);
        const self = this;
        timesheetApi.getConfigInfo()
        .then(res => {
            if (res.status === 200) {
                self.submit_timesheet_selected = res.data.listConfig[0].submitTimesheet;
                self.check_daily = res.data.listConfig[0].isDailyLog=="1"?true:false;
                self.time_remind_daily_log = res.data.listConfig[0].timeDailyLog;
                self.date_submited = res.data.listConfig[0].dateSubmit;
                self.time_submit_timesheet = res.data.listConfig[0].timeSubmit;
                self.week_remind = res.data.listConfig[0].weekRemind;
            }
        })
        .catch(err => {
            console.log(err)
        })
    },
    computed:{
        type(){
            return this.$store.state.timesheet.calendarType;
        },
        showSubmitTask(){
            return this.$store.state.timesheet.showSubmitTask
        },
        showListProcess(){
            return this.$store.state.timesheet.showListProcess
        },
        taskInfo(){
            return this.$store.state.process.allTaskInfo
        }

    },
    methods: {
        getDocId(docId){
            this.docId = docId
        },
         handleTaskSubmited(){
            this.$store.commit("task/setIsStatusSubmit",true);
        },
        closeTaskSubmit(){
            this.$store.commit('timesheet/showSubmitTask', false);
            this.logtimeDialog = true;
            this.$refs.logtime.getListTaskDoc(this.docId,this.$refs.logtime.categoryTask.id);

        },
         getAllProcess(data){
            this.listProcess = [];
            let listId = data.join(",");
            const self = this;
            BPMNEApi.getProcessByDocId(listId).then(res=>{
                if(res.status==200){
                    let id = Object.keys(res.data)[0]; // chỉ có 1 id
                    res.data[id].map(process=>{
                        self.listProcess.push(process)
                    })
                }
            })
        },
        async selectProcess(process){
            let defData = await getLastestDefinition(process, true);
            if(defData.data[0]){
                 handleStartProcess(defData.data[0].id);
            }
        },
        quickCancel(isCreate){
            isCreate && this.deleteLog();
            this.cancelSave();
        },
       changeCateColor(listCateColor, logColor){
           this.$refs.logCalendar.listCategoryColor = listCateColor;
            this.$refs.logCalendar.events.map(e=>{
                listCateColor.map(cate=>{
                    if(cate.key == e.category_key){
                        if(cate.isShow){
                            e.color = cate.color
                        }else{
                            e.color = logColor
                        }
                    }
                   
                })
            })
        },
        changeColor(data,listCate){
            let listCateColor = [...listCate];
            if(data.isRandom){
                this.$refs.logCalendar.isRandom = true;
                this.$refs.logCalendar.events.map(e=>{
                    e.color = this.$refs.logCalendar.randomColor();
                    e.color = this.$refs.logCalendar.setCateAndLogColor(e,e.color,listCate)
                })
            }else{
                this.$refs.logCalendar.colorLog = data.colorLog;
                 this.$refs.logCalendar.isRandom = false;
                this.$refs.logCalendar.events.map(e=>{
                    e.color = this.$refs.logCalendar.setCateAndLogColor(e,data.color,listCate)
                })
            }
        },
        // khi click ra ngoài log form
        deleteLog(){
            if(!this.update&&this.type!="month"&&!this.$refs.logtime.keepLog){
              this.$refs.logCalendar.events.pop()
            }
        },
        //update lại log được update
        updateLog(data){
            let events = [...this.$refs.logCalendar.events];
            let oldLog = events.filter(e=>e.id==data.id)[0];
            let name = this.$refs.logCalendar.listTask.filter(task=>task.id==data.task)[0].name;
            for(let i = 0; i<events.length;i++){
                if(events[i].id==oldLog.id){
                    events[i]=data,
                    events[i].name = name;
                    // event[i].action = "update";// 
                    this.$store.commit("timesheet/getLogForm",  events[i])
                }
            }
           this.$refs.logCalendar.events=events;
        },
        creatListLog(data){
            let listLog = [...data];
            listLog.map(d=>{
                this.createLog(d)
            })

        },
        createLog(data){
            let taskName = this.$refs.logCalendar.listTask.filter(task=>task.id==data.task);
            data.start = Date.parse(data.start);
            data.date = this.$moment(data.end).format('YYYY-MM-DD');
            data.end = Date.parse(data.end);
            data.name = taskName.length>0? taskName[0].name:'';
            data.category = data.cateId;
            // data.category_key = data.categoryTask.key;
            data.color= this.$refs.logCalendar.getColorWhenCreate(data);
            data.timed= true;
            data.action = 'create';
            this.$store.commit("timesheet/getLogForm", data)
            this.$refs.logCalendar.events.push(data);
            if(!this.$refs.logCalendar.timeView){
                this.$refs.logCalendar.resizeLogtime()
            }
        },
        loadMonthView(data){
            this.monthEvents = data;
            this.$refs.logCalendar.load()
        },
        hideTaskForm(){
            this.cancelTaskForm()
            // this.showTask = false;
            // this.showCategory=false;
            //  this.cancelTask != this.cancelTask;
        },
        updateAPICategory(){
            this.updateAPICate =true;

        },
        loadTask(){
            if(this.$refs.logtime){
                this.$refs.logtime.getAllTask()
            }
        },
        cancelTaskForm(){
            this.showTask=false;
            this.showCategory=false;
            this.cancelTask != this.cancelTask;
        },
        
        cancelCateForm(){
            this.showTask=false;
            this.showCategory=false;
            this.cancelCate != this.cancelCate;
            this.$refs.logtime.getCategory()
        },
        showTaskForm(value){
            this.eventLog = value;
            this.showTask=true; 
            this.cate = value.categoryTask;
        },
         showCategoryForm(value){
            this.eventLog = value;
            // this.$refs.cate.forBa = false;
            this.$refs.cate.typeCate = 'normal';
            this.showCategory=true;
            this.showTask =true;
        },
        getNow: function() {
            let current = this.$moment().format('HH:mm');
            if (this.check_daily === true && current === this.time_remind_daily_log) {
                this.remindDialog = true;
            }
         },
         showLog(date){
            this.dateMonth = date;
            this.logtimeDialog = true;
              //this.update=true;
         },
        cancelSave() {
            this.logtimeDialog = false;
        },
        cancelDelete() {
            this.deleteDialog = false;
        },
        onCreateTime({logtimeEvent, onSave, deleteLastEvent, update}) {
            this.logtimeDialog = true;
             this.$store.commit("timesheet/getLogForm", logtimeEvent)
            this.$nextTick(() => {
                this.update = update;
                this.logtimeEvent = logtimeEvent;
                this.onSaveLogTimeEvent = onSave;
                this.deleteLastEvent = deleteLastEvent;
            });
            
            if(this.$refs.logtime){
                this.$refs.logtime.setValueLog(logtimeEvent);
            }
        },
        deleteLogTime({deleteEvent, onDelete}) {
            this.deleteDialog = true;
            this.$nextTick(() => {
                this.deleteEvent = deleteEvent;
                this.onDeleteLogTimeEvent = onDelete;
            });
        }
    },
};
</script>
<style>
.h-28px{
    height: 28px!important;
}
</style>
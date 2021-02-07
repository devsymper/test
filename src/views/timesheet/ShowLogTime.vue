<template>
<div class='log-time h-100 pl-4' >
    <v-row style="padding-bottom: 10px; margin-left:2px; margin-bottom:-22px">
        <period-selector  @load-logtime="reloadLog" />
        <div style="width:38%;float:right" 
             class="">
            <CalendarViewMode
                @time_view="time_view = true"
                @list_view="time_view = false" />
            <ActionButtons refs="action" />
        </div>
    </v-row>
    <v-dialog v-model="logtimeDialog" width="357" @click:outside="deleteLog()">
        <LogTimeForm v-show="showTask==false"
            ref="logtime"
            @showTaskForm="showTaskForm"
            @loadMonthView="loadMonthView"
            @showCategoryForm="showCategoryForm"
            :eventLog="eventLog"
            :updateAPICategory ="updateAPICate"
            @cancel="cancelSave()"
            :dateMonth ="dateMonth"
            :formType="formType"
            :cancelTask="cancelTask"
            :cancelCate="cancelCate"
            :load ="load"
            @doneCate="doneCate()"
            :update ="update"
            :newEvent="logtimeEvent" 
            :onSave="onSaveLogTimeEvent"
            :onCancel="onCancelSave">
        </LogTimeForm>
         <TaskForm @loadTask="loadTask()" v-show="showTask&&showCategory==false" @cancel="cancelTaskForm()"/>
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
    <!-- test -->
    <v-dialog v-model="deleteDialog" width="357">
        <DeleteLogView
            @cancel="cancelDelete()"
            :deleteEvent="deleteEvent"
            :onDelete="onDeleteLogTimeEvent">
        </DeleteLogView>
    </v-dialog>
    <LogCalendar 
        :userId="userId"
        @showLog="showLog" 
        :monEvents="monthEvents"
        ref="logCalendar" 
        :time-view="time_view" 
        @create-time="onCreateTime" 
        @delete-event="onDeleteEvent" />
</div>
</template>

<script>
import LogCalendar from "../../components/timesheet/LogCalendar";
import PeriodSelector from "../../components/timesheet/PeriodSelector";
import ActionButtons from "../../components/timesheet/ActionButtons";
import TaskForm from "./../../components/timesheet/TaskForm";
import CalendarViewMode from "../../components/timesheet/CalendarViewMode";
import LogTimeForm from "../../components/timesheet/LogTimeForm";
import DeleteLogView from "../../components/timesheet/DeleteLogView";
import CategoryForm from "../../components/timesheet/CategoryForm";
import timesheetApi from '../../api/timesheet';

export default {
    name: "showLogTime",
    components: {
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
            userId:'',
            monthEvents:{},
            showTask:false,
            showCategory:false,
            time_view: true,
            eventLog:{},
            updateAPICate:false,
            load:false,
            // log form
            dateMonth:'',
            cancelTask:false,
            cancelCate:false,
            logtimeDialog: false,
            logtimeEvent: null,
            formType: 'log',
            update: false,
            onSaveLogTimeEvent: () => null,
            onCancelSave: () => null,
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
    methods: {
        // khi click ra ngoài log form
        deleteLog(){
            if(!this.update){
              this.$refs.logCalendar.events.pop()
            }
        },
        loadMonthView(data){
            debugger
            // this.$refs.logCalendar.monthEvents[data.date]=[];
            // this.$refs.logCalendar.monthEvents[data.date].push(data);
            this.monthEvents =data;


        },
        doneCate(){
            this.updateAPICate = false
        },
        reloadLog(userId){
            this.userId = userId;
        },
        updateAPICategory(){
            this.updateAPICate =true;

        },
        loadTask(){
            this.load = true;
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
          
        },
         showCategoryForm(value){
            this.eventLog = value;
            this.$refs.cate.forBa = false;
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
        onCreateTime({logtimeEvent, onSave, onCancel, update}) {
            this.logtimeDialog = true;
            this.$nextTick(() => {
                console.log(this.onSave);
                this.update = update;
                this.logtimeEvent = logtimeEvent;
                this.onSaveLogTimeEvent = onSave;
                this.onCancelSave = onCancel;
            });
        },
        onDeleteEvent({deleteEvent, onDelete}) {
            this.deleteDialog = true;
            this.$nextTick(() => {
                this.deleteEvent = deleteEvent;
                this.onDeleteLogTimeEvent = onDelete;
            });
        }
    },
};
</script>

<style lang="scss" scoped>
.log-time {
    flex: 1;
    margin: 0.5rem;
}
</style>
<style>
/* kích thước */
.h-100{
    height: 100%!important;
}
.w-100{
    width: 100%!important;
}
/* font chữ */
.font-normal{
    font-family:Roboto; 
    font-weight:nomarl
}
.fm{
    font-family:Roboto
}
</style>
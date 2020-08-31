<template>
<div class='log-time' style="padding-left: 10px; height: 100%">
    <v-row style="padding-bottom: 10px; margin-left:2px; margin-bottom:-22px;margin-top:-10px">
        <period-selector />
        <div style="width:38%;float:right" 
             class=".d-lg-flex .d-lg-none d-none d-lg-block">
            <CalendarViewMode
                @time_view="time_view = true"
                @list_view="time_view = false" />
            <ActionButtons refs="action" />
        </div>
    </v-row>
    <v-dialog v-model="logtimeDialog" width="357">
        <LogTimeForm v-show="showTask==false"
            @showTaskForm="showTaskForm"
            :eventLog="eventLog"
            @cancel="cancelSave()"
            :dateMonth ="dateMonth"
            :formType="formType"
            :load ="load"
            :update ="update"
            :newEvent="logtimeEvent" 
            :onSave="onSaveLogTimeEvent"
            :onCancel="onCancelSave">
        </LogTimeForm>
         <TaskForm @loadTask="loadTask()" v-show="showTask" @cancel="cancel()"/>      
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
              @click="remindDialog = false"
            >
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
    <LogCalendar @showLog="showLog" ref="logCalendar" :time-view="time_view" @create-time="onCreateTime" 
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
import timesheetApi from '../../api/timesheet';
import dayjs from 'dayjs';

export default {
    name: "showLogTime",
    components: {
        "period-selector": PeriodSelector,
        ActionButtons,
        CalendarViewMode,
        LogCalendar,
        LogTimeForm,
        DeleteLogView,
        TaskForm
    },
    data() {
        return {
            showTask:false,
            time_view: true,
            eventLog:{},
            load:false,
            // log form
            dateMonth:dayjs(),
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
        loadTask(){
            debugger
            this.load = true;
        },
        cancel(){
            debugger
             this.showTask=false;
        },
        showTaskForm(value){
            debugger
            this.eventLog = value;
            this.showTask=true; 
          
        },
        getNow: function() {
            let current = dayjs().format('HH:mm');
            if (this.check_daily === true && current === this.time_remind_daily_log) {
                this.remindDialog = true;
            }
         },
         showLog(date){
             debugger
             this.dateMonth= date;
              this.logtimeDialog = true;
               this.$nextTick(() => {
                this.update = false;
            });
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
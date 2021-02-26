<template>
<div class='log-time h-100 pl-4' >
    <v-row style="padding-bottom: 10px; margin-left:2px; margin-bottom:-22px">
        <period-selector  @load-logtime="reloadLog" />
        <div style="width:38%;float:right" 
             class="">
            <CalendarViewMode
                ref="viewmode"
                @change-cate-color="changeCateColor"
                @change-color="changeColor"
                @time_view="time_view = true"
                @list_view="time_view = false" />
            <ActionButtons refs="action" />
        </div>
    </v-row>
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
        @delete-logtime="deleteLogTime" />
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
            if(!this.update){
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
            data.start = Date.parse(data.start);
            data.date = this.$moment(data.end).format('YYYY-MM-DD');
            data.end = Date.parse(data.end);
            data.name=this.$refs.logCalendar.listTask.filter(task=>task.id==data.task).length>0? this.$refs.logCalendar.listTask.filter(task=>task.id==data.task)[0].name:'';
            data.category=data.categoryTask;
            data.category_key=data.categoryTask.split('-')[0];
            data.color= this.$refs.logCalendar.getColorWhenCreate(data);
            data.type=data.type;
            data.timed= true;
            this.$refs.logCalendar.events.push(data);
            if(!this.$refs.logCalendar.timeView){
                this.$refs.logCalendar.resizeLogtime()
            }
        },
        loadMonthView(data){
            this.monthEvents = data;
            this.$refs.logCalendar.load()
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
        onCreateTime({logtimeEvent, onSave, onCancel, update}) {
            this.logtimeDialog = true;
            this.$nextTick(() => {
                this.update = update;
                this.logtimeEvent = logtimeEvent;
                this.onSaveLogTimeEvent = onSave;
                this.onCancelSave = onCancel;
            });
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
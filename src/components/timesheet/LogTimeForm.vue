<template>
<v-card class="w-100 log-form" >
    <v-card-title class="pb-1 pt-2 headline lighten-2" primary-title>
        <div class="pb-1 w-100" style="border-bottom: 1px solid lightgrey">
            <span style="font-size:18px">{{$t('timesheet.log_time')}}</span> 
        </div>
    </v-card-title>
    <v-card-text class="mt-1 h-65" >
        <span class="label ">{{$t('timesheet.category_task')}}</span>
        <v-row>
            <div style="width: 275px!important" 
                class="ml-3 mr-1">
                <v-autocomplete 
                    style="margin-top:-10px!important; " 
                    :menu-props="{'nudge-top':-10}" 
                    v-model="categoryTask"
                    class="category-task" 
                    :search-input.sync="searchCategory" 
                    :items="category.category_name" 
                    placeholder="Tìm việc ..." 
                    item-color="white" 
                    background-color="#F7F7F7">
                    <template v-slot:item="data" class="category-task">
                        <span style='color:black'>
                            {{ data.item }}
                            <v-icon v-if="data.item === categoryTask " color="success">
                            mdi-check
                            </v-icon>
                        </span>
                    </template>
                </v-autocomplete>
            </div>
            <div style="width:10%">
                <button 
                    style="border-radius:2px;font-weight: normal; float:right;margin-left:2px"
                    @click="showCategoryForm()" 
                    depressed small class="mr-2 ml-1 fs-13">
                        <v-icon>mdi-plus</v-icon>
                </button>
            </div>
        </v-row>
    </v-card-text>
     <v-card-text>
         <span class="red--text" v-show="cateError">{{cateError}}</span>
    </v-card-text>
    <!-- lọc user -->
        <!-- <v-card-text  v-if="showSearchForm" class=" h-65 mb-2" >
        <span class="label ">Lọc theo nhân viên<span style="color:red"></span></span>
        <v-row class="mt-2">
            <div style="width: 275px!important" class="ml-3 mr-1">
                <v-autocomplete 
                    style="margin-top:-10px!important; " 
                    :menu-props="{'nudge-top':-10, maxHeight:300}" 
                    :items="listUser"
                    v-model="userSelected"
                    item-text="displayName"
                    item-value="id"
                     class="category-task" 
                    clearable
                    placeholder="Tìm nhân viên ..." 
                    item-color="white"
                      background-color="#F7F7F7"
                 >
                        <template v-slot:item="data">
                            <SymperAvatar class="mr-2" style ="height: 30px!important; width: 30px!important;min-width: 30px!important" :userId="data.item.id"/>
                                <v-list-item-content>
                                <v-list-item-title >{{data.item.displayName}}</v-list-item-title>
                                <v-list-item-subtitle class="fs-11 color-grey" >{{data.item.email}}</v-list-item-subtitle>
                                </v-list-item-content>
                        </template>
                </v-autocomplete>
            </div>
               <div>
                   <!-- <v-checkbox v-model="checkbox" style="margin-top:2px"></v-checkbox> -->
      <!-- </v-card-text> -->
            <!-- </div>
        </v-row>
    </v-card-text> --> 
     <!-- <v-card-text v-if="showSearchForm" style="margin-top:-15px; margin-bottom:-15px"> -->
       <!-- <v-checkbox v-model="checkbox" :label="'Chưa log'"></v-checkbox> -->
      <!-- </v-card-text> -->
    <!-- lọc user -->
    <v-card-text  class='task-form h-65' style="margin-top:-4px">
        <span class="label">{{$t('timesheet.task_logform')}}
            <span style="color:red"> *</span>
        </span>
        <v-row style="margin-top:-10px">
            <div style="width: 275px!important" class="ml-3 mr-1">
                <v-autocomplete 
                    class="task w-100 mt-2 fs-13" 
                    v-model="task"
                    :items="items" 
                    :loading="isLoading" 
                    :search-input.sync="search" 
                    item-text="name"    
                    item-value="id"
                    :menu-props="{'nudge-top':-10, 'max-width': 300}" 
                    label="Tìm loại công việc ...">
                        <template v-slot:item="data">
                            <v-list-item-content>
                               <v-list-item-title class="st-icon-pandora">
                                   {{data.item.name?data.item.name:'Không có tên'}}
                                </v-list-item-title>
                            <v-list-item-subtitle class="fs-11 color-grey" >
                                <span v-if="data.item.categoryId" style="color:black" class="color-grey">
                                     {{getNameCategory(data.item.categoryId)}}-{{data.item.description?data.item.description:'Chưa có mô tả'}} </span>
                                <span v-else style="color:black" class="color-grey">
                                    </span>
                                    </v-list-item-subtitle>
                            </v-list-item-content>
                        </template>
                </v-autocomplete>
           </div>
            <div>
                <button style="border-radius:2px;font-weight: normal; float:right" @click="showTaskForm()" 
                depressed small class="mr-2  mt-3 fs-13">
                <v-icon>mdi-plus</v-icon>
                </button>
            </div>
        </v-row>
    </v-card-text>
    <v-card-text>
         <span class="red--text" v-show="taskError">{{taskError}}</span>
    </v-card-text>
    <v-card-text class="div-calender-picker">
        <div style="height: 32px; margin-top:-3px">
            <div class="date ">
                <span class="label">{{$t('timesheet.date')}} <span style="color:red"> </span></span>
                <v-menu offset-y nudge-top="-10">
                    <template v-slot:activator="{ on }">
                        <input 
                        v-on="on" 
                        :value="displayDate"
                        class="input-logtime" 
                        placeholder="16/Jun/2020" 
                        style="width:95px" 
                        type="text">
                    </template>
                 <!-- date -->
                 <v-date-picker 
                        class="date-picker" 
                        no-title scrollable
                        color='orange' 
                        v-model="datePicker" 
                        nudge-top="-10" 
                        :close-on-content-click="false" 
                        transition="scale-transition" 
                        offset-y width="290px" 
                       />
                 <!-- date -->
                </v-menu>
            </div>
            <div class="duration"> 
                <span class="label">
                    {{$t('timesheet.duration')}}
                </span>
                <input type="text" 
                    :value="displayDuration" 
                    @input="caculateDuration" 
                   
                    class="input-logtime"></div>
            <div class='start-time'>
                <span class="label">{{$t('timesheet.start_time')}}
                    <span style="color:red"> *</span> 
                </span>
                <v-combobox
                    :menu-props="{'maxHeight':204,'minWidth':70}" 
                    style="margin-top:-12px"
                    background-color="#F7F7F7"
                    no-filter
                    v-model="inputs.startTime"
                    class="category-task" 
                    :items="listHour"
                ></v-combobox>
            </div>
            <div style="width: 63px; float: left"> <span class="label">
                {{$t('timesheet.end_time')}}<span style="color:red">*</span></span>
                <v-combobox
                        :menu-props="{'maxHeight':204, 'minWidth':70}" 
                        style="margin-top:-12px"
                        background-color="#F7F7F7"
                        no-filter
                        v-model="inputs.endTime"
                        class="category-task" 
                        :items="listHour"
                ></v-combobox>
            </div>
        </div>
    </v-card-text>
       <v-card-text v-if="timeError" class="mb-3">
         <span class="red--text" v-show="timeError">{{timeError}}</span>
    </v-card-text>
    <v-card-text class="div-description">
        <span class="label">Mô tả</span>
        <textarea v-model="inputs.description" class='description'></textarea>
    </v-card-text>
    <v-card-actions class="pb-5">
        <div class="w-100" style="float:right">
            <input class="ml-4 mr-1 mt-1" type="checkbox" id="checkbox" v-model="keepLog">
            <span class="fs-13" >
                Thêm liên tục
            </span>
            <v-btn text class='cancel' @click="cancel()">
               {{$t('timesheet.cancel')}}
            </v-btn>
            <v-btn v-if= "update==false&&showLog" text  
            class="button-logtime"
            style="color:blue"
             @click="log(1)">
             <span >{{$t('timesheet.log')}}</span> 
             </v-btn>
              <v-btn v-if= "update==false&&showPlan" text 
            style="color:green"
            class="button-logtime"
             @click="log(0)">
             <span >{{$t('timesheet.plan')}}</span> 
             </v-btn>
               <v-btn v-if= "update&&newEvent.type==1" text 
            class="button-logtime"
             @click="updatelog(1)">
             <span >{{$t('timesheet.update')}}</span> 
             </v-btn>
               <v-btn v-if= "update&&newEvent.type==0&&showPlan" text 
            class="button-logtime"
             @click="updatelog(0)">
             <span >{{$t('timesheet.update')}}</span> 
             </v-btn>
               <v-btn v-if= "update&&newEvent.type==0&&showLog" text 
            class="button-logtime mr-2" style="float:right!important; width: 60px"
             @click="updatelog(1)">
             <span >{{$t('timesheet.log')}}</span> 
             </v-btn>
        </div>
    </v-card-actions>
</v-card>
</template>

<script>
import timesheetApi from '../../api/timesheet';
import TaskForm from '../timesheet/TaskForm';

export default {
    name: 'LogTimeForm',
    props: ['formType', 'newEvent', 'onSave', 'onCancel', 'update','dateMonth','eventLog','load','updateAPICategory','cancelTask','cancelCate'],
    data: () => ({
        logTimeList:[],
        keepLog:false,
        isCaculate:false,
        datePicker:'',
        date: new Date().toISOString().substr(0, 10),
        isLoading: false,
        listHour:[],
        dialog: false,
        items: [],
        displayDate: '',
        showLog:false,
        showPlan:false,
        nameTask:'',
        search: null,
        searchCategory:null,
        tab: null,
        checkDateUpdate:false,
        task: '',
        desc: '',
        durationTime:'',
        dateLogMonthView:'',
        listCategory:[],
        type: 'week',
        checkNullCate:false,
        checkNullTask:false,
        taskError: '',
        timeError: '',
        time: null,
        cateError: '',
        categoryTask: '',
        category: {
            category_name: [
            ],
            task: [],
        },
        inputs: {
            date: '',
            duration: '30m',
            startTime: '08:00',
            endTime: '08:30',
            description: ''
        },
    }),
    components:{
        TaskForm
    },
    computed: {
         typeCalendar() {
            return this.$store.state.timesheet.calendarType;
        },
        duration(value) {
            if(!this.isCaculate){
                  let startTime = this.inputs.startTime.split(":");
                    let endTime = this.inputs.endTime.split(":");
                    let hourStart = Number(startTime[0]);
                    let minutesStart = Number(startTime[1]);
                    let hourEnd = Number(endTime[0]);
                    let minutesEnd = Number(endTime[1]);
                    return ((hourEnd * 60 + minutesEnd) - (hourStart * 60 + minutesStart));      
            }else{
                return this.durationTime
            }
        },
        displayDuration() {
            if(!this.isCaculate){
            if (this.duration >= 0) {
                if (this.duration > 60) {
                    if (this.duration / 60 == 0) {
                        return this.duration / 60 + 'h';
                    } else {
                        let hour = Math.floor(this.duration / 60);
                        let minutes = this.duration % 60;
                        if (minutes == 0) {
                            return hour + 'h';
                        } else {
                            return hour + 'h' + minutes + 'm';
                        }
                    }
                } else {
                    return this.duration + "m";
                }
                return this.$moment(this.event.start).format('HH:mm');
            } else {
                return '';
            }
            }
            else{
                return this.durationTime
            }
            // }
        },
        // displayDate() {
        //     if(this.eventLog.startTime!=undefined){this.getEventLog();};
           
        // }
    },
    watch: {
        datePicker(){
            let year = this.datePicker.slice(0,4);
            let month = Number(this.datePicker.slice(5,7))-1;
            let date = this.datePicker.slice(8,10);
            this.newEvent.start = this.$moment(this.newEvent.start).date(date).month(month).year(year).valueOf();
            this.newEvent.end = this.$moment(this.newEvent.end).date(date).month(month).year(year).valueOf();

            this.inputs.date = this.datePicker;
            this.displayDate= this.datePicker
        },
        durationTime(){
            this.changeDuration(this.durationTime);
            //  this.isCaculate = false;
        },
        updateAPICategory(){
             this.getCategory();
             this.$emit("doneCate")

        },
        cancelTask(){
            if(this.cancelTask){
           
                this.getAllTask();
            }
        },
        eventLog(){
            this.getEventLog();
            
        },
        dateMonth(){
            this.getDateMonth()
        },
       
        duration(){
            if(this.duration<=0||Number.isNaN(this.duration)){
                this.timeError = this.$t('timesheet.time_invalid');}
            else{
                this.timeError = ''
            }
        },
        search(){
            if(!this.categoryTask){
                this.getAllTask(this.search);
            }else{
                this.filterTaskByCategory();
            }
        },
       
        task(){
           // this.categoryTask = 'BD-Business Development'
             if(this.checkNullTask){
                if(this.task==undefined){
                    this.taskError = this.$t('timesheet.required_value');
                }else{
                    this.taskError=""
                    this.checkNullTask =false
                }
             }
             else{
                
                    let taskId = this.task;
                 
                this.findNameTask(this.task);
                this.getCategoryId(taskId);
             }
        },
        categoryTask(){
            if(!this.categoryTask){
                this.getAllTask();
                this.filterTaskByCategory();

            }else{
                this.filterTaskByCategory();
            }
            if(this.checkNullCate){
                if(!this.categoryTask){
                    this.cateError = this.$t('timesheet.required_value');
                }else{
                    this.cateError="";
                    this.checkNullCate =false
                }
             }
             else{};
             // this.loadTaskList();
        },
        newEvent(val) {
            this.getAllTask(val.task);
            this.inputs.startTime = val ? this.$moment(val.start).format('HH:mm') : "08:00";
            this.inputs.endTime = val ? this.$moment(val.end).format('HH:mm') : "08:40";
            this.inputs.date = val ? this.$moment(val.date).format('YYYY-MM-DD') : this.$moment().format('YYYY-MM-DD');
            this.displayDate = this.inputs.date;
            this.inputs.description = val.desc;
            this.categoryTask = val.category;
            this.task = val.task?val.task:getIdTask(val.task);
            this.items.push({name:val.task});
            // hiển thị nút plan và log theo từng giờ
            let now = this.$moment();
            let dateLog = this.$moment(this.newEvent.start).format('DD/MMM/YYYY h:mm A');
            this.showLog =  this.$moment(dateLog).isAfter(now)==true?false:true;
            this.showPlan = this.$moment(dateLog).isAfter(now);
            this.filterTaskByCategory();
        },
    },
    created(){
        // load lại trang ở màn month
        this.generateListHour();
        this.getDateMonth(this.dateMonth);
        this.getAllTask();
        this.getCategory();
    },
    methods: {
        // getIdTask(nameTask){
        //     let id = 0;
        //    this.logTimeList.map(task=>{
        //        if(task.task_id==nameTask){
        //            id = 
        //        }

        //     })
        // },
        formatTime(time){
            let minutes = 0;
            let hour = 0;
            hour = time.includes('h')?time.split('h')[0]:0;
            minutes = time.includes('h')?time.split('m')[0].split('h')[1]:time.split('m')[0];
            return hour*60+minutes;
        },
        changeDuration(duration){
            let minutes = 0;
            let hour = 0;
            hour = duration.indexOf('h')>-1?duration.split('h')[0]:0;
            minutes = duration.indexOf('h')>-1?duration.split('m')[0].split('h')[1]:duration.split('m')[0];
            if(this.inputs.startTime){
                this.inputs.endTime = this.$moment(this.newEvent.start).hour(+this.inputs.startTime.split(":")[0]).minute(+this.inputs.startTime.split(":")[1]).add(hour,'h').add(minutes,'m').format("HH:mm")
            }else{
                this.input.startTime = this.$moment(this.newEvent.end).hour(+this.inputs.startTime.split(":")[0]).minute(+this.inputs.startTime.split(":")[1]).subtract(hour,'h').subtract(minutes,'m').format("HH:mm")
            }
        },
        caculateDuration(event){
            this.isCaculate = true;
            this.durationTime =  event.currentTarget.value;
            this.changeDuration(this.durationTime);
            // this.isCaculate = false;
        },
        generateListHour(){
            for(let i=0; i<24; i++) {
                for(let j=0; j<2; j++) {
                    this.listHour.push(i + ":" + (j===0 ? "00" : 30*j) );
                }
            }
        },
         findNameTask(id){
             this.nameTask=this.items.filter(x=>x.id==id)[0].name;
             return this.nameTask
        },
        getCategoryId(taskId){
           let cateId = this.items.filter(x=>x.id==taskId)[0].categoryId;
           if(cateId){
                this.categoryTask = this.getFullNameCategory(cateId)
           }
        },
        filterTaskByCategory(){
            if(this.categoryTask){
                let categoryId = this.getIdCategory(this.categoryTask);
                this.items = this.items.filter(x=>x.categoryId==categoryId||x.categoryId==null);
            }
        },
         async getAllTask(nameTask){
            let self = this;
            this.items = [];
           await timesheetApi.getTaskDB()
            .then(res => {
             self.items.push(...res.data.task);
                })
                .catch(console.log);
            await timesheetApi.getTask(nameTask)
            .then(res => {
                let name = res.data.listObject;
                name.map(x=>{
                    x.name = JSON.parse(x.description).content
                })
                self.items.push(...res.data.listObject);
                })
                .catch(console.log);

        },
        // lấy giờ
         getDateMonth(){
            let date = this.dateMonth;
            this.dateLogMonthView = date;
            this.displayDate = date;
            this.inputs.startTime='08:00';
            this.inputs.endTime='08:30';
            this.inputs.description = '';
            this.categoryTask = '';
            this.task ='';
            let now = this.$moment();
            let dateLog = this.$moment(date).format('DD/MMM/YYYY');
            this.showLog =  this.$moment(dateLog).isAfter(now)==true?false:true;
            this.showPlan = this.$moment(dateLog).isAfter(now);
            this.inputs.date = this.$moment(date).format('YYYY-MM-DD')
           
        },
        // đổi giờ thành ngày giờ trong màn hình month
         changeTimeToDate(time){
            let hour = Number(time.split(":")[0]);
            let minutes = Number(time.split(":")[1]);
            let dateTime = this.$moment(this.dateLogMonthView).hour(hour).minute(minutes).format("YYYY-MM-DD HH:mm");
            return dateTime;
        },
        //lấy danh sách category
        getNameCategory(cateId){
            for(let i=0; i<this.listCategory.length; i++){
                if(this.listCategory[i].id==cateId){
                    return this.listCategory[i].key;
                }
            }
        },
        getFullNameCategory(cateId){
            for(let i=0; i<this.listCategory.length; i++){
                if(this.listCategory[i].id==cateId){
                    return this.listCategory[i].key+"-"+this.listCategory[i].name;
                }
            }
        },
        getIdCategory(value) {
            for(let i=0; i<this.listCategory.length; i++){
                if(this.listCategory[i].name === value.split('-')[1].trim()){
                    return this.listCategory[i].id;
                }
            }
        },
        getEventLog(){
            this.inputs.startTime = this.eventLog.startTime;
            this.inputs.endTime = this.eventLog.endTime;
            this.task  = this.eventLog.task;
            this.inputs.date  = this.eventLog.date;
            this.categoryTask = this.eventLog.categoryTask;
            this.inputs.description = this.eventLog.desc;
         },
         showCategoryForm(){
             this.$emit("showCategoryForm",{
                startTime:this.inputs.startTime,
                endTime:this.inputs.endTime,
                task: this.findNameTask(this.task),
                date: this.inputs.date,
                categoryTask: this.categoryTask,
                desc: this.inputs.description || ""
            })
            this.getEventLog();
         },
        showTaskForm(){
            this.$emit("showTaskForm",{
                startTime:this.inputs.startTime,
                endTime:this.inputs.endTime,
                task: this.findNameTask(this.task),
                date: this.inputs.date,
                categoryTask: this.categoryTask,
                desc: this.inputs.description || ""
            })
            this.getEventLog();
        },
        getCategory(){
            let self= this;
             timesheetApi.getAllCategory({}).then(res => {
                if (res.status === 200) {
                    self.listCategory = res.data.category;
                    self.category.category_name=[];
                    let category = res.data.category;
                    for(let i=0; i<category.length; i++){
                        self.category.category_name.push(
                            category[i].key+"-"+category[i].name
                        )
                    }
                }
                }).catch(console.log);
        },
        refreshAll(){
            this.taskError="";
            this.cateError = '';
            this.timeError = "";
            this.task="";
            this.nameTask="";
            this.task="";
            this.categoryTask="";
            this.inputs.description="";
        },
        cancel() {
            this.onCancel();
            this.$emit('cancel');
            this.refreshAll()
        },
        // type= 0 là plan, 1 là log
        log(type) {
            this.checkNullTask = true;
            let start = null;
            let end = null;
            this.checkNullCate = true;
            let check = this.checkValidateLogForm();
            if(this.typeCalendar=="month"){
                start = this.changeTimeToDate(this.inputs.startTime);
                end = this.changeTimeToDate(this.inputs.endTime);
            }else{
                start = this.$moment(this.newEvent.start).hour(+this.inputs.startTime.split(":")[0]).minute(+this.inputs.startTime.split(":")[1]).format("YYYY-MM-DD HH:mm");
                end  = this.$moment(this.newEvent.start).hour(+this.inputs.endTime.split(":")[0]).minute(+this.inputs.endTime.split(":")[1]).format("YYYY-MM-DD HH:mm");
            }
            if (!check){}
            else{
                timesheetApi.createLogTime({
                    start: start,
                    end: end,
                    duration: !this.isCaculate?this.duration:this.formatTime(this.duration),
                    task: this.findNameTask(this.task),
                    type: type,
                    date: this.inputs.date,
                    categoryTask: this.categoryTask,
                    desc: this.inputs.description || ""
                })
                .then(res => {
                    if (res.status === 200) {
                        this.onSave();
                        this.refreshAll();
                        this.$emit('loadMonthView')
                    }
                })
                .catch();
                if(!this.keepLog){
                    this.cancel();
                }
            }       
        },
        showError() {
            if (this.duration < 0) {
                this.timeError = this.$t('timesheet.time_invalid'); 
            }
        },
        checkValidateLogForm()
        {
            let check = true;
            if(this.categoryTask==undefined&&this.task==undefined){
                this.taskError = this.$t('timesheet.required_value'); 
                this.cateError = this.$t('timesheet.required_value');
                check = false;
            }
            else if(this.timeError!=''){
                check = false;
             }
            else if (this.categoryTask==undefined) {
                this.cateError = this.$t('timesheet.required_value'); 
                check = false;
            }  
            else if (this.task==undefined) {
                this.taskError = this.$t('timesheet.required_value');      
                check = false;
            }
            else{
                check = true
            }
            return check;
        },
        updatelog(type) {
            this.checkNullTask = true;
            this.checkNullCate = true;
            let check = this.checkValidateLogForm();
            if (!check){
            } else {
                //  let taskId = this.task;
                let taskId = Number(this.task)?this.task:this.items.filter(x=>x.name==this.task)[1].id;
               // let test = this.items.filter(x=>x.name==this.task)[0].id;
                timesheetApi.updateLogTime({
                        start: this.$moment(this.newEvent.start).hour(+this.inputs.startTime.split(":")[0]).minute(+this.inputs.startTime.split(":")[1]).format("YYYY-MM-DD HH:mm"),
                        end: this.$moment(this.newEvent.start).hour(+this.inputs.endTime.split(":")[0]).minute(+this.inputs.endTime.split(":")[1]).format("YYYY-MM-DD HH:mm"),
                        duration: !this.isCaculate?this.duration:this.formatTime(this.duration),
                        task: this.findNameTask(taskId),
                        type: type,
                        id: this.newEvent.id,
                        date: this.inputs.date,
                        categoryTask: this.categoryTask,
                        desc: this.inputs.description || ""
                    })
                    .then(res => {
                        if (res.status === 200) {
                            this.onSave()
                        }
                    })
                    .catch(console.log);
               this.cancel();
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.div-description {
    clear: left;
    clear: right;
    margin-top:-10px;
}
.description {
    padding-left: 10px;
    width: 100%;
    height: 80px;
    background-color: #F7F7F7;
}

.v-btn:not(.v-btn--round).v-size--small {
    padding: 0 4px !important;
}

button {
    font-weight: 390;
    font-size: 13px !important;
    font-family: Roboto !important;
    color: black;
    height:32px!important;
}
.button-logtime{
    font-weight:400;
   width: 70px!important; 
   float:right;
   margin-right:7px;
}
.cancel {
    float: right;
      font-weight:400;
    margin-right: 15px;
    height:32px!important;
    width: 35px !important;
}

.category-task ::v-deep .v-label--active {
    display: none;
    height: 37px !important;
    font-size: 13px !important;
    border-radius: 4px;
    padding-left: 10px;
}

.category-task {
    padding-top: 0px !important;
    height: 37px !important;
    font-size: 13px !important;
    border-radius: 4px;
}

.category-task ::v-deep .v-input__slot:before {
    border-color: transparent !important;
    padding-left: 10px;
}

.category-task ::v-deep .v-input__slot:after {
    border-color: transparent !important;

}
.category-task ::v-deep .v-select__slot{
    padding-left: 10px;
}

.task {
    font-size: 13px;
    margin-top: 10px !important;
}

.task ::v-deep .v-input__slot {
    background-color: #F7F7F7;
    margin-top: -19px;
    padding-left: 10px;
}
.h-65{
    height:65px
}

.task ::v-deep .v-label {
    font-size: 13px;
}

.task ::v-deep .v-input__slot:after {
    border-color: transparent !important;
      padding-left: 10px;
}

.task ::v-deep .v-input__slot:before {
    border-color: transparent !important;
      padding-left: 10px;
}

.task ::v-deep .v-label--active {
    display: none;
}

.task ::v-deep .v-list {
    width: 385px !important;
}

.v-card ::v-deep .v-card__text {
    padding-bottom: 0px;
    padding-top: 0px;
    margin-bottom: 0px;
    font-size: 13px;
    font-family: Roboto;
    color: black
}

.v-input__control {
    font-size: 13px;
    font-family: Roboto;
    color: grey;
}

.input-logtime {
    float: flex;
    background-color: #F7F7F7;
    width: 60px;
    height: 32px !important;
    border-radius: 2px;
    padding-left: 10px;
}

.v-menu__content .v-list {
    padding-top: 10px;
    top: 120px !important;
}

.dropdown ::v-deep .dropdown-input {
    font-size: 13px;
    font-family: Roboto
}

.v-dialog {
    width: 450px;
}

.date {
    width: 105px;
    float: left;
    margin-right: 12px;
}

.date-picker ::v-deep .v-picker__body {
    width: 230px;
    height: 260px;
}

.div-calender-picker {
    height: 65px;
    top: 380px !important;
    clear: left;
    padding-top: 5px;
}

.date-picker ::v-deep .v-date-picker-header {
    padding: 0px
}

.v-picker__title__btn {
    font-size: 13px;

}

.duration {
    width: 52px;
    float: left;
    margin-left: -12px;
    margin-right: 12px;
}
.v-autocomplete ::v-deep .v-input__control{
    margin-top:12px;
}
.start-time {
    width: 67px;
    margin-right: 5px;
    margin-left: 5px;

    float: left;
}

.log-form ::v-deep .v-input__append-inner{
    display:none!important
}
</style>
<style>
.v-calendar-daily__intervals-body{
    width:50px;

}
.v-time-picker-title .v-picker__title__btn,
.v-time-picker-title span {
    font-size: 24px !important;
    height: 35px;
    margin-top: 5px;
    align-items: center !important;
    display: inline-flex;
}

.v-picker--time>.v-picker__title {
    padding: 0;
    padding-right: 16px;
}

.v-list-item__title {
    font-size: 13px !important;
    color: black;
}

.v-list-item {
    font-size: 13px !important;
    color: black;
}

.v-select__selections {
    padding-left: 10px;
}
.w-100{
    width: 100%;
}
.viewmode .v-select__selections {
    padding-left: 0px !important;
}.v-list-item__title {
    font-size: 13px !important;
    color: black;
}
.v-list-item {
    font-size: 13px !important;
    color: black;
    min-height: 30px!important;
}

</style>

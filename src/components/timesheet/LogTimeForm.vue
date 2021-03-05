<template>
    <div>
    <ConfigRepeat 
        class="bg-white"
        :type="typeRepeat" 
        @repeat="handleRepeat" 
        @cancel="showConfigRepeat=false" 
        v-if="showConfigRepeat" />
    <v-card v-else class="w-100" >
        <v-card-title primary-title class="pb-1 w-100 mt-s10" > 
            <span class="fs-18">{{$t('timesheet.log_time')}}</span> 
        </v-card-title>
        <v-divider class="mx-3"></v-divider>
        <v-card-text class="mt-2" >
            <span class="label ">{{$t('timesheet.category_task')}}</span>
              <span style="color:red"> *</span>
            <v-btn text @click="showCategoryForm()" depressed x-small class="add-btn mr-2 ml-1 fs-13">
                <v-icon style="font-size:15px!important; margin-top:-3px">mdi-plus</v-icon>
            </v-btn>
            <v-autocomplete
                :menu-props="{'nudge-top':-5}" 
                v-model="categoryTask"
                return-object
                item-text="fullName"
                item-value="id"
                class="category-task mt-s10" 
                :search-input.sync="searchCategory" 
                :items="listCategory" 
                placeholder="Tìm loại việc ..." 
                item-color="white" 
                background-color="#F7F7F7">
                <template v-slot:item="data">
                    <div class="mt-s10 w-100 d-flex justify-space-between" >
                        <div class="color-black"> {{ data.item.fullName}}</div>
                        <div v-if="categoryTask">
                            <v-icon class="fs-16" v-if="data.item.id == categoryTask.id " color="success"> mdi-check
                            </v-icon>
                        </div>
                    </div>    
                </template>
            </v-autocomplete>
        </v-card-text>
        <v-card-text class="mt-3" v-if="cateError" style="margin-bottom:-10px">
            <span class="color-red" >{{cateError}}</span>
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
        <v-card-text class="mt-3 h-65">
            <div style="margin-bottom:-10px">
                <span class="label">{{$t('timesheet.task_logform')}}
                <span style="color:red"> *</span>
            </span  >
            <v-btn  text @click="showTaskForm()" depressed x-small class="add-btn mr-2 ml-1 fs-13">
                <v-icon style="font-size:15px!important; margin-top:-3px">mdi-plus</v-icon>
            </v-btn>
            </div>
            <v-autocomplete
                class="task w-100"
                v-model="task"
                :items="listTask" 
                :loading="isLoading" 
                :search-input.sync="search" 
                item-text="name"    
                item-value="id"
                :menu-props="{'nudge-top':-10, 'width': 300}" 
                label="Tìm công việc ...">
                <template v-slot:item="data">
                    <v-list-item-content class="mt-s10" style="margin-bottom:-5px">
                        <v-list-item-title>
                            {{data.item.name?data.item.name:'Không có tên'}}
                        </v-list-item-title>
                        <v-list-item-subtitle class="fs-11" >
                            <span v-if="data.item.categoryId" class="color-grey">
                                {{getNameCategory(data.item.categoryId)}}-{{data.item.description!=''?data.item.description:"Chưa có mô tả"}} 
                            </span>
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </template>
        </v-autocomplete>
        </v-card-text>
        <v-card-text v-if="taskError" style="margin-top:-5px" class="mb-1">
            <span class="red--text" >{{taskError}}</span>
        </v-card-text>
        <v-card-text class="d-flex justify-space-between" style="margin-top:-5px">
            <div class="date">
                <span class="label">{{$t('timesheet.date')}}</span>
                <span style="color:red">* </span>
                <v-menu offset-y nudge-top="-10">
                    <template v-slot:activator="{ on }">
                        <input 
                            v-on="on"
                            placeholder="YYYY-MM-DD"
                            :value="displayDate"
                            class="input-logtime" 
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
                    @input="handleDuration" 
                    class="input-logtime">
            </div>
            <div class='input-time' style="margin-left:-3px">
                <span class="label">{{$t('timesheet.start_time')}}
                    <span style="color:red"> *</span> 
                </span>
                <v-combobox
                    :menu-props="{'maxHeight':204,'minWidth':76,'nudgeLeft':5}" 
                    style="margin-top:-12px"
                    background-color="#F7F7F7"
                    no-filter
                    v-model="inputs.startTime"
                    class="category-task" 
                    :items="listHour"
                ></v-combobox>
            </div>
            <div class='input-time'> 
                <span class="label">{{$t('timesheet.end_time')}}</span>
                <span style="color:red">*</span>
                <v-combobox
                    :menu-props="{'maxHeight':204, 'minWidth':76,'nudgeLeft':5}" 
                    style="margin-top:-12px"
                    background-color="#F7F7F7"
                    no-filter
                    @click="reGenerateHour"
                    v-model="inputs.endTime"
                    class="category-task" 
                    :items="listHour"
                ></v-combobox>
            </div>
        </v-card-text>
        <v-card-text v-if="timeError">
            <span class="color-red" v-show="timeError">{{timeError}}</span>
        </v-card-text>
        <v-card-text class="mt-2">
            <span class="label">Mô tả</span>
            <textarea v-model="inputs.description" class='description'></textarea>
        </v-card-text>
        <v-row class="w-100" style="margin-top:-10px">
            <v-col class="col-md-4" @click="repeatConfig()">
                <i class="ri-vip-crown-2-fill"></i>
                <input class="ml-6 mr-1 mt-1" type="checkbox" v-model="repeat">
                <span class="fs-13">Lặp lại</span>
            </v-col>
            <v-col class="col-md-7" v-if="repeat" style="height:10px">
                <v-select 
                    class="select-repeat"
                    style="width:180px; margin-top:-15px"
                    v-model="selectedRepeat"
                    :items="selectRepeat">
                </v-select>
            </v-col>
        </v-row>
        <!-- <div class="w-100 pb-5" style="margin-top: -15px!important;background:white"> -->
        <div class="w-100 " style="margin-top:-12px">
            <input class="ml-6 mr-1" type="checkbox" id="checkbox" v-model="keepLog">
            <span class="fs-13" >
                Thêm liên tục
            </span>
        </div>
        <div class="ml-5">
            <div class="fs-12 color-grey ml-1">*Tip: Alt+Q tạo nhanh log,  Ctrl+Z hoàn tác</div>
        </div>
        <div class="d-flex justify-end pb-3 mr-2">
            <v-btn text class='cancel' @click="cancel()">
                {{$t('timesheet.cancel')}}
            </v-btn>
            <v-btn v-if="update==false&&showLog" text class="button-logtime color-blue" @click="log(1)"><span >{{$t('timesheet.log')}}</span> </v-btn>
            <v-btn v-if="update==false&&showPlan" text class="button-logtime color-green" @click="log(0)"> <span >{{$t('timesheet.plan')}}</span> </v-btn>
            <v-btn v-if="update&&newEvent.type==1" text class="button-logtime color-blue" @click="updatelog(1)"><span >{{$t('common.update')}}</span> </v-btn>
            <v-btn v-if="update&&newEvent.type==0&&showPlan" text class="button-logtime color-green" @click="updatelog(0)"><span >{{$t('common.update')}}</span> </v-btn>
            <v-btn v-if="update&&newEvent.type==0&&showLog" text  class="button-logtime mr-2 color-blue" style="float:right!important; width: 60px" @click="updatelog(1)"> <span >{{$t('timesheet.log')}}</span> </v-btn>
        </div>

    </v-card>
    </div>
</template>

<script>
import { util } from '@/plugins/util';
import timesheetApi from '../../api/timesheet';
import TaskForm from '../timesheet/TaskForm';
import ConfigRepeat  from '../timesheet/form/ConfigRepeat';
import { documentApi } from '../../api/Document';
import CategoryWorker from 'worker-loader!@/worker/timesheet/Category.Worker.js';

export default {
    name: 'LogTimeForm',
    props: ['formType', 'onSave', 'onCancel', 'update','dateMonth','eventLog','load','updateAPICategory','cancelTask','cancelCate'],
    data: () => ({
        typeRepeat:'general',//kiểu lặp lại 
        selectRepeat:['Hằng ngày',"Hằng tuần vào thứ 2","Từ thứ 2 đến thứ 7","Tùy chỉnh..."],
        selectedRepeat:'Hằng ngày',
        repeat:false,
        repeatData:{
            isNeverEnd:true,// không lặp lại
            toDate: '',// ngày kết thúc
            type:'general',
            repeatAfter:{
                number:0,
                type:"Ngày"
            },
            applyDay:[]
        },//lưu repeat Data
        logTimeList:[],
        showConfigRepeat:false,
        keepLog:false,
        isCaculate:false,
        datePicker:'',
        date: new Date().toISOString().substr(0, 10),
        isLoading: false,
        listHour:[],
        dialog: false,
        items: [],
        displayDate:'',
        showLog:false,
        showPlan:false,
        nameTask:'',
        search: null,
        searchCategory:null,
        tab: null,
        checkDateUpdate:false,
        task: '',
        listTask:[],
        desc: '',
        durationTime:'',
        dateLogMonthView:'',
        listCategory:[],
        checkNullCate:false,
        checkNullTask:false,
        taskError: '',
        timeError: '',
        cateError: '',
        time: null,
        categoryTask: '',
        inputs: {
            date: '',
            duration: '30m',
            startTime: '08:00',
            endTime: '08:30',
            description: ''
        },
    }),
    components:{
        TaskForm,
        ConfigRepeat 
    },
    mounted(){
        const self = this;
    },
    computed: {
        startDate() {
            return this.$store.state.timesheet.calendarStartDate;
        },
        newEvent(){
            return this.$store.state.timesheet.log
        },
        endDate() {
            return this.$store.state.timesheet.calendarEndDate;
        },
        typeCalendar() {
            return this.$store.state.timesheet.calendarType;
        },
        duration() {
            let start = this.inputs.startTime;
            let end = this.inputs.endTime;
           return this.canculateDurationByStartEnd(start,end)
        },
        displayDuration() {
            return this.changeMinutesToHourAndMinutes(this.duration)
        },
    },
    watch: {
        newEvent(){
            this.setValueLog(this.newEvent)
        },
        selectedRepeat(){
            if(this.selectedRepeat=='Tùy chỉnh...'){
                this.showConfigRepeat = true;
                this.typeRepeat='detail';
            }else{
                 this.typeRepeat='general';
            }
        },
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
            this.changeStartEndFromDuration(this.durationTime);
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
            let hasSpecialCharacters = (/[^a-zA-Z0-9]/).test(this.duration);// kí tự đặc biệt trả về true
            if(!this.duration||this.duration<=0||Number.isNaN(this.duration)||hasSpecialCharacters || this.duration=='0h'||this.duration=='0m'){
                // if(this.duration.match(/[^a-zA-Z0-9]/)){
                     this.timeError = this.$t('timesheet.time_invalid');
                //  }
               }
            else{
                this.timeError = ''
            }
        },
        search(){
            if(!this.categoryTask){// create log
                this.getAllTask(this.search);
            }else{
                this.filterTaskByCategory();
            }
        },
        task(){
           // this.categoryTask = 'BD-Business Development'
             if(this.checkNullTask){
                if(!this.task){
                    this.taskError = this.$t('timesheet.required_value');
                }else{
                    this.taskError=""
                    this.checkNullTask =false
                }
             }
             else{
                let taskId = this.task;
                this.getCategoryByTaskId(taskId);
             }
        },
   
        categoryTask(){
            if(this.categoryTask){
                let docId = this.listCategory.filter(cate=>cate.id==this.categoryTask.id);
                if(docId&&docId.length>0){
                    docId = docId[0].docId;
                }else{
                    docId = -1;
                }
                (Number(docId)>0) && this.getListTaskDoc(docId);
                this.filterTaskByCategory();
            }
            if(this.checkNullCate){
                if(!this.categoryTask){
                    this.cateError = this.$t('timesheet.required_value');
                }else{
                    this.cateError="";
                    this.checkNullCate = false
                }
             }
        },
        // gán lại log time khi update/ create
      
    },
    created(){
        // load lại trang ở màn month
        this.refreshAll();
        this.generateListHour();
        this.getAllTask();
        this.getDateMonth(this.dateMonth);
        this.getCategory();
        this.setValueLog(this.newEvent)
    },
    methods: {
        //
        changeMinutesToHourAndMinutes(duration){
             if(!this.isCaculate){
                if (duration >= 0) {
                    if (duration > 60) {
                        if (duration / 60 == 0) {
                            return duration / 60 + 'h';
                        } else {
                            let hour = Math.floor(duration / 60);
                            let minutes = duration % 60;
                            if (minutes == 0) {
                                return hour + 'h';
                            } else {
                                return hour + 'h' + minutes + 'm';
                            }
                        }
                    } else {
                        return duration + "m";
                    }
                    return this.$moment(this.event.start).format('HH:mm');
                }else {
                    return '';
                }
            }else{
                return this.durationTime
            }
        },
            // tính duration dựa theo start và end
        canculateDurationByStartEnd(start,end){
             if(!this.isCaculate){
                let startTime = start.split(":");
                let endTime = end.split(":");
                let hourStart = Number(startTime[0]);
                let minutesStart = Number(startTime[1]);
                let hourEnd = Number(endTime[0]);
                let minutesEnd = Number(endTime[1]);
                 return ((hourEnd * 60 + minutesEnd) - (hourStart * 60 + minutesStart));      
            }else{
                return this.durationTime
            }
        },
        setValueLog(val) {
            this.clearError();
            if(val){
                this.task = val?val.task:'';
            }
            this.isCaculate = false;
            this.inputs.startTime = val ? this.$moment(val.start).format('HH:mm') : "08:00";
            this.inputs.endTime = val ? this.$moment(val.end).format('HH:mm') : "08:40";
            this.duration = this.canculateDurationByStartEnd(this.inputs.startTime,this.inputs.endTime);
            this.inputs.date = val ? this.$moment(val.date).format('YYYY-MM-DD') : this.$moment().format('YYYY-MM-DD');
            this.displayDate = this.inputs.date;
            this.inputs.description = val.desc;
            if(val.category){
                let cateId = val.category;
                this.categoryTask = this.listCategory.filter(c=>c.id==cateId)[0];
            }
            // hiển thị nút plan và log theo từng giờ
            let now = this.$moment();
            let dateLog = this.$moment(this.newEvent.start).format('DD/MMM/YYYY h:mm A');
            this.showLog =  this.$moment(dateLog).isAfter(now)==true?false:true;
            this.showPlan = this.$moment(dateLog).isAfter(now);
            // this.filterTaskByCategory();
            this.getAllTask(val.task);
        },
        clearError(){
            this.taskError = '';
            this.timeError = '';
            this.cateError = '';
        },
        //Lấy danh sách task từ doc
         getListTaskDoc(docId){
            const self = this;
            documentApi.getListDocumentObject(docId).then(res=>{
                if(res.status==200){
                    self.listTask=[];
                    res.data.listObject.map(task=>{
                        self.listTask.push({
                            ...task, 
                            name:task.tmg_name,
                            description:task.tmg_description?task.tmg_description:"Chưa có mô tả"
                        });
                    })
                }
            })

        },
        create_UUID() {
            var dt = new Date().getTime();
            var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function(c) {
            var r = (dt + Math.random() * 16) % 16 | 0;
            dt = Math.floor(dt / 16);
            return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
            });
            return uuid;
        },
        repeatConfig(){
            this.repeat = !this.repeat;
        },
        handleRepeat(repeatData){
            this.repeatData = repeatData
        },
        formatTime(time){
            let minutes = 0;
            let hour = 0;
            hour = time.includes('h')?time.split('h')[0]:0;
            minutes = time.includes('h')?time.split('m')[0].split('h')[1]:time.split('m')[0];
            return hour*60+minutes;
        },
        // từ duration tính lại start end
        changeStartEndFromDuration(duration){
            let minutes = 0;
            let hour = 0;
            hour = duration.indexOf('h')>-1?duration.split('h')[0]:0;
            minutes = duration.indexOf('h')>-1?duration.split('m')[0].split('h')[1]:duration.split('m')[0];
            if(this.inputs.startTime){
                this.inputs.endTime = this.$moment(this.newEvent.start).add(hour,'h').add(minutes,'m').format("HH:mm")
            }else{
                this.input.startTime = this.$moment(this.newEvent.end).subtract(hour,'h').subtract(minutes,'m').format("HH:mm")
            }
        },
        handleDuration(duration){
            this.isCaculate = true;
            this.durationTime =  duration.currentTarget.value;
            this.changeStartEndFromDuration(this.durationTime);
            // this.isCaculate = false;
        },
        reGenerateHour(){
            this.listHour = [];
            let start = this.$moment(this.inputs.startTime,"HH:mm").format("HH");
            for(let i=start; i<24; i++) {
                for(let j=0; j<2; j++) {
                    this.listHour.push(i + ":" + (j===0 ? "00" : 30*j) );
                }
            }
        },
        generateListHour(){
            for(let i=0; i<24; i++) {
                for(let j=0; j<2; j++) {
                    this.listHour.push(i + ":" + (j===0 ? "00" : 30*j) );
                }
            }
        },
        // lấy ra tên của task từ id task
        findNameTask(id){
            if(this.listTask.length>0){
                 this.nameTask = this.listTask.filter(x=>x.id==id)[0].name;
                return this.nameTask
            }
        },
        // Lấy tên của category theo id task
        getCategoryByTaskId(taskId){
            let cateId = '';
            if(this.listTask.length>0){
                this.listTask.map(task=>{
                    if(task.id==taskId) cateId = task.categoryId
                })
             this.categoryTask = this.listCategory.filter(cate=>cate.id==cateId)[0]
            }
           
        },
        // lọc danh sách task theo id category
        filterTaskByCategory(){
            if(this.categoryTask){
                let categoryId = this.categoryTask.id;
                this.listTask = [...this.items.filter(x=>x.categoryId==categoryId)];
            }
        },
         async getAllTask(nameTask){
            if(nameTask==undefined){
                nameTask=' '
            }
            let self = this;
            this.items = [];
            await timesheetApi.getTaskDB().then(res => {
                self.items.push(...res.data.task);
                self.listTask.push(...res.data.task);
            }).catch(console.log);
            await timesheetApi.getTask('')
            .then(res => {
                let name = res.data.listObject;
                name.map(x=>{
                    x.categoryId = "602e321e-0689-b438-887b-7dce711740c4";
                    x.name = JSON.parse(x.description).content;
                    let extraLabel = JSON.parse(x.description).extraLabel;
                    x.description = 'Mô tả: '+ extraLabel?extraLabel:"Chưa có mô tả";
                })
                self.items.push(...res.data.listObject);
                self.listTask.push(...res.data.listObject);
            }).catch(console.log);
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
            return this.listCategory.filter(cate=>cate.id==cateId)[0].key
        },
        getFullNameCategory(cateId){
            this.listCategory.map(cate=>{
                if(cate.id==cateId) return cate.key+"-"+cate.name
            })
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
                task:"",
                // task: this.findNameTask(this.task),
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
                task:"",
                // task: this.findNameTask(this.task),
                date: this.inputs.date,
                categoryTask: this.categoryTask,
                desc: this.inputs.description || ""
            })
            this.getEventLog();
        },
        getCategory(){
            this.listCategory = this.$store.state.timesheet.listCate;
        },
        refreshAll(){
            this.checkNullCate = false;
            this.checkNullTask = false;
            this.taskError="";
            this.cateError = '';
            this.timeError = "";
            this.task="";
            this.nameTask="";
            this.task="";
            this.categoryTask="";
            this.inputs.description="";
            this.repeat = false;
            this.keepLog = false;
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
                this.saveLog(start,end,type)
            }       
        },
        saveLog(start,end,type){
            let data={
                start: start,
                end: end,
                id: this.create_UUID(),
                duration: !this.isCaculate?this.duration:this.formatTime(this.duration),
                task:this.task,
                cateId:this.categoryTask.id,
                type: type,
                date: this.inputs.date,
                desc: this.inputs.description || "",
                taskName: this.findNameTask(this.task)
            }
            if(!this.repeat){
                //this.onSave(data);
                this.$emit('create-log',{...data});
                this.sendApiCreateLog(data);
                if(!this.keepLog){
                    this.cancel();
                }
            }else{
                this.createRepeatLog(data);
                if(!this.keepLog){
                    this.cancel();
                }
            }
        },
        notify(type,name){
            if(type=='success'){
                this.$snotify({
                    type: type,
                    title:`${name} thành công`,
                });
            }
            else if(type=='error'){
                 this.$snotify({
                    type: type,
                    title:`${name} thất bại`,
                });
            }else{
                this.$snotify({
                    type: type,
                    title:name,
                });
            }
        },
        sendApiCreateLog(data){
            timesheetApi.createLogTime(data).then(res => {
                if (res.status === 200) {
                    this.onSave();
                    this.$store.commit("timesheet/updateObjId", res.data.docObjId)
                    this.notify('success',"Thêm");
                    this.refreshAll();
                    if(this.typeCalendar=='month'){  
                        this.$emit('loadMonthView',data)
                    }
                }else{
                    // xử lý
                    this.onSave();
                    this.notify("error","Thêm");
                 
                }
            }).catch();
        },
        // xử lý trường hợp repeat
        createRepeatLog(data){
            if(this.typeRepeat=='general'){
                switch(this.selectedRepeat){
                    case "Hằng ngày":
                        let conditionDaily = true;
                        this.repeatData.applyDay = [1,2,3,4,5,6,0]
                        this.repreatConditional(data,conditionDaily);
                        break;
                    case "Hằng tuần vào thứ 2":
                        let conditionMon = 'this.$moment(logtime.date,"YYYY-MM-DD").isoWeekday()==1'
                         this.repeatData.applyDay = [1];
                        //  this.repeatData
                        this.repreatConditional(data,conditionMon)
                        break;
                    case "Từ thứ 2 đến thứ 7":
                        let cons = [];
                        for(let i = 1; i<7;i++){
                            let con = 'this.$moment(logtime.date,"YYYY-MM-DD").isoWeekday()=='+i;
                            cons.push(con);
                        }
                        let conditionMonToSat = cons.join('||');
                        this.repreatConditional(data,conditionMonToSat)
                        break;
                    }  
            }else{

            }
            
        },
        repreatConditional(data,condition){
            const self = this;
            let listLog = [];
            let startCalendar = this.startDate;
            startCalendar = this.$moment(startCalendar,'DD-MM-YYYY');
            let endCalendar = this.endDate;
            endCalendar = this.$moment(endCalendar,'DD-MM-YYYY');
            let startHour = this.$moment(data.start).format('HH');
            let startMinutes = this.$moment(data.start).format('mm');
            let endHour = this.$moment(data.end).format('HH');
            let endMinutes = this.$moment(data.end).format('mm');
            let totalDay = this.$moment.duration(endCalendar.diff(startCalendar)).asDays();
            let logtime = data;
            for(let i=0;i<=totalDay*4+3;i++){
                logtime.date = this.$moment(startCalendar).add(i, 'days').format('YYYY-MM-DD');//date.logtime=2 = >date.date=2; date = 3
                if(eval(condition)){
                    logtime.type=this.checkPlanOrLog(logtime.start);
                    logtime.start = this.$moment(logtime.date,"YYYY-MM-DD").add(startHour,'hours').add(startMinutes,'minutes').format('YYYY-MM-DD HH:mm');
                    logtime.end = this.$moment(logtime.date,"YYYY-MM-DD").add(endHour,'hours').add(endMinutes,'minutes').format('YYYY-MM-DD HH:mm');
                    logtime.configRepeat = JSON.stringify(this.repeatData);
                    listLog.push({...logtime});
                }
            }
            const listLogCopy = util.cloneDeep(listLog);
            this.$emit('create-list-log',listLogCopy);
            this.notify('info','Vui lòng chờ...')
            timesheetApi.createListLog(JSON.stringify(listLog)).then(res => {
                    if (res.status === 200) {
                        self.notify('success','Thêm')
                        self.onSave();
                        // self.$emit('loadMonthView')
                    }else{
                         self.notify('error','Thêm')
                    }
            }).catch();
        },
        showError() {
            if (this.duration < 0) {
                this.timeError = this.$t('timesheet.time_invalid'); 
            }
        },
        checkValidateLogForm(){
            let check = true;
            if(!this.categoryTask&&!this.task){
                this.taskError = this.$t('timesheet.required_value'); 
                this.cateError = this.$t('timesheet.required_value');
                check = false;
            }
            else if(this.timeError!=''){
                check = false;
             }
            else if (!this.categoryTask) {
                this.cateError = this.$t('timesheet.required_value'); 
                check = false;
            }  
            else if (!this.task) {
                this.taskError = this.$t('timesheet.required_value');      
                check = false;
            }
            else{
                check = true
            }
            return check;
        },
        checkPlanOrLog(startTime){
            let now = this.$moment();
            let time = this.$moment(startTime).format('DD/MMM/YYYY h:mm A');
            let check = this.$moment(time).isAfter(now)==true?0:1;
            return check
        },
        setOriginLog(data){
            let updateLog = {
                ...data,
                start:Number(this.$moment(data.start).format('x')),
                end:Number(this.$moment(data.end).format('x')),
                name:data.task,
                timed:true,
                category_key:this.newEvent.category_key
            };
            return updateLog

        },
        updatelog(type) {
            this.checkNullTask = true;
            this.checkNullCate = true;
            let check = this.checkValidateLogForm();
            if (!check){
            } else {
                let data = {
                    start: this.$moment(this.newEvent.start).hour(+this.inputs.startTime.split(":")[0]).minute(+this.inputs.startTime.split(":")[1]).format("YYYY-MM-DD HH:mm"),
                    end: this.$moment(this.newEvent.start).hour(+this.inputs.endTime.split(":")[0]).minute(+this.inputs.endTime.split(":")[1]).format("YYYY-MM-DD HH:mm"),
                    duration: !this.isCaculate?this.duration:this.formatTime(this.duration),
                    task: this.task,
                    type: this.checkPlanOrLog(this.newEvent.start),
                    id: this.newEvent.id,
                    date: this.inputs.date,
                    color:this.newEvent.color,
                    categoryTask: this.categoryTask.id,
                    taskName: this.findNameTask(this.task),
                    desc: this.inputs.description || "",
                    docObjId: this.newEvent.docObjId,
                    cateId: this.categoryTask.id
                }
                let originLog=this.setOriginLog(data);
                this.$emit('update-log',originLog);
                timesheetApi.updateLogTime(data,data.id).then(res => {
                        if (res.status === 200) {
                        }
                }).catch(console.log);
               this.cancel();
            }
        },
    },
}
</script>

<style lang="scss" scoped>
.s-select-page-size ::v-deep .v-input__slot:before {
    border-color: transparent !important;
    padding-left: 10px;
    font-size:13px!important
}
.select-repeat ::v-deep .v-select__selections{
    font-size:13px!important;
    margin-top: 0px;
    padding-top:0px
}
.add-btn{
    height:20px!important;
    min-width:26px!important;
    padding:0!important
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
.category-task ::v-deep .v-input__slot:before,
.category-task ::v-deep .v-input__slot:after,
.task ::v-deep .v-input__slot:after,
.task ::v-deep .v-input__slot:before{
    border-color: transparent !important;
    padding-left: 10px;
}
.category-task ::v-deep .v-select__slot{
    padding-left: 10px;
}
.task ::v-deep .v-select__slot,
.task ::v-deep .v-label{
    font-size: 13px!important;
}
.task ::v-deep .v-input__slot {
    background-color: #F7F7F7;
    margin-top: -19px;
    padding-left: 10px;
}
.h-65{
    height:65px
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
.input-logtime {
    float: flex;
    background-color: #F7F7F7;
    width: 60px;
    height: 32px !important;
    border-radius: 2px;
    padding-left: 5px;
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
}
.category-task ::v-deep .v-input__append-inner{
    display:none

}
.date-picker ::v-deep .v-picker__body {
    width: 230px;
    height: 260px;
}
.date-picker ::v-deep .v-date-picker-header {
    padding: 0px
}
.v-picker__title__btn {
    font-size: 13px;
}
.duration {
    width: 60px;
    margin-left: -14px;
}
.v-autocomplete ::v-deep .v-input__control{
    margin-top:12px;
}
.input-time {
    width: 70px;
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
.v-select__selections {
    padding-left: 10px;
}
.w-100{
    width: 100%;
}
.viewmode .v-select__selections {
    padding-left: 0px !important;
}
.v-list-item {
    font-size: 13px !important;
    color: black;
    min-height: 30px!important;
}
</style>

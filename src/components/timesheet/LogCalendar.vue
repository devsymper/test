<template>
    <div class="w-100 pr-5 mt-2 mr-3" style="height: calc(100vh - 120px)">
        <v-sheet :class="[calendarType=='month'? 'h-50' :'h-580']" 
        class="h-100 calendar">
            <v-calendar ref="calendar"  
                :weekdays="weekday" 
                :type="internalCalendarType" 
                v-model="calendar"
                :events="events" 
                :color="color" 
                @mousedown:event="startDrag" 
                @mousemove:time="mouseMove" 
                @mouseup:time="handleLogTimeAction" 
                @mousedown:time="startTime" 
                @mouseleave.native="cancelDrag" 
                :start="calendarShowDate">
                <template v-slot:day-body="{ date, week }">
                <div
                    v-if="timeView"
                    class="v-current-time"
                    :class="{ first: date === week[0].date }"
                    :style="{ top: nowY }"
                ></div>
                </template>
                <template v-slot:day-label="{day,present,past̥, month, date}">
                    <MonthViewHeader 
                        class="pl-3 pt-1"
                        :monthEvents="monthEvents"
                        :month="month"
                        :present="present"
                        :day="day"
                        :date="date"
                        :hoursRequired="hoursRequired"
                    />
                </template>
                <!-- màn hình month - task -->
                <template v-slot:day="{date}">
                    <MonthViewEvent 
                        :monthEvents="monthEvents"
                        :date="date"
                        @showLog="start"
                        :hoursRequired="hoursRequired"
                    />
                
                </template>
                <!-- màn hình week/day/weekday - event log -->
                <template v-slot:event="{ event, eventSummary,timed, eventParsed  }">
                    <v-menu offset-x :nudge-right="10">
                        <template v-slot:activator="{on: detailEvents}">
                            <div
                                @dblclick="actionLogEvent(event, 0)"
                                v-on="detailEvents"
                                style="border:1px solid lightgrey"
                                class="d-flex flex-column h-100">
                                <div v-if="event.type==null" class="v-event-draggable" v-html="eventSummary()">Task</div>
                                    <div class="d-flex flex-row justify-space-between align-center pl-2">
                                        <div class="fm text-ellipsis" style="width:calc(100% - 55px)" >
                                            <span v-if="findDuration(event.start, event.end)<62">
                                                <i :class="[event.type==0?'mdi mdi-calendar color-blue fs-13':'mdi mdi-check-all color-green']" class="mr-1"></i>
                                            </span>
                                            <b style="color:#303030" class="fs-12 fw-430">{{event.name}}</b>
                                        </div>
                                        <div >
                                            <v-menu 
                                                bottom left
                                                nudge-left='5' 
                                                nudge-top='-10'>
                                                <template v-slot:activator="{on:actionEvents }" >
                                                    <span class="fs-12 fw-400 color-black"
                                                        v-if="findDuration(event.start, event.end)<62" >
                                                        {{getDuration(eventParsed.input.start,eventParsed.input.end)}}
                                                    </span>
                                                    <!-- <v-btn class="ml-1" dense dark icon> -->
                                                        <v-icon v-if="event.type"
                                                            v-on="actionEvents"
                                                            small class="color-black"> mdi-dots-vertical</v-icon>
                                                    <!-- </v-btn> -->
                                                </template>
                                                <div class="d-flex flex-column" style="background:white">
                                                    <v-btn v-for="action in actionLog" text small :key='action.id' @click="actionLogEvent(event,action.id)">{{$t(action.name)}}</v-btn>
                                                </div>
                                            </v-menu>
                                        </div>
                                    </div>
                                    <div v-if="findDuration(event.start, event.end)>105" style="height:30px" class="text-ellipsis fs-12 pl-2 color-grey" >
                                        {{event.desc ? event.desc: "" }}
                                    </div>
                                    <v-spacer />
                                    <div class="pa-2 w-100 d-flex flex-row justify-space-between align-center" v-if="findDuration(event.start, event.end)>61">
                                        <div style="margin-top:17px">
                                            <span >
                                                <i :class="[event.type==0?'mdi mdi-calendar color-blue fs-13':'mdi mdi-check-all color-green fs-15']" class=" mr-12"></i>
                                            </span>
                                            <span class= "fs-11 text-ellipsis color-grey" style="margin-left:-50px" v-if="findDuration(event.start, event.end)>70"> 
                                                {{event.category_key}}
                                            </span>
                                        </div>
                                        <div v-if="timeView">
                                            <span class="fs-11 color-black" style="margin-right:-5px">
                                            {{getDuration(eventParsed.input.start,eventParsed.input.end )}}
                                            </span>
                                        </div>
                                         <div v-else>
                                            <span class="fs-11 color-black" style="margin-right:-5px">
                                           {{changeDuration(event.duration)}}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div v-show="timed&&timeView" class="v-event-drag-bottom" @mousedown.stop="extendBottom(event)">
                                </div>
                            </template>
                            <div>
                                <LogTimeView :event="event" />
                            </div>
                    </v-menu>
                </template>
                <!-- màn hình week/day/weekday - header -->
                <template v-slot:day-header="{day, present, month, weekday, date}">
                    <WeekdayHeader  
                        class="pl-3 pt-1"
                        :monthEvents="monthEvents"
                        :month="month"
                        :present="present"
                        :weekday="weekday"
                        :date="date"
                        :day="day"
                        :hoursRequired="hoursRequired"
                    />
                </template>
            </v-calendar>
            <!-- </div> -->
        </v-sheet>
    </div>
</template>

<script>
import LogTimeView from "./../../components/timesheet/LogTimeView";
import ViewDetailMonth from "./../../components/timesheet/ViewDetailMonth";
import DeleteLogView from "./../../components/timesheet/DeleteLogView";
import timesheetApi from '../../api/timesheet';
import MonthViewHeader from "./../../components/timesheet/calendar/MonthViewHeader";
import WeekdayHeader from "./../../components/timesheet/calendar/WeekdayHeader";
import MonthViewEvent from "./../../components/timesheet/calendar/MonthViewEvent";
import LogFormWorker from 'worker-loader!@/worker/timesheet/LogForm.Worker.js';
import { mapState} from 'vuex';
import _groupBy from 'lodash/groupBy';

export default {
    name: "LogCalendar",
    components: {
        LogTimeView,
        DeleteLogView,
        MonthViewHeader,
        WeekdayHeader,
        MonthViewEvent,
        ViewDetailMonth
    },
    props: ['timeView','userId','monEvents'],
    data() {
        return {
            listLogInTime:[],
            menu:false,
            calendar: '',// value calendar
            ready: false,
            color:'orange',
            dragEvent: null,
            actionLog:[
                {id:0, name:'common.update'},
                {id:1, name:'common.delete'},
                {id:2, name:'common.copy'}
            ],
            createEvent: null,
            createStart: null,
            extendOriginal: null,
            focus: '',
            internalCalendarType: 'week',
            extend : false,
            sum: [],
            events: [],// chứa event của calendar
            hoursRequired: '',
            logFormWorker:null
        };
    },

    created() {
        this.logFormWorker = new LogFormWorker();
        this.load();
    },
    methods: { 
        setResizeLogtime(event){
            this.events = event
        },
        setLogTimeList(data){
            this.events =  data.events;
            this.sum = data.sumLogTime;
            this.hoursRequired = data.hoursRequired;
            if(!this.timeView){
                this.resizeLogtime()
            }
        },
        // lấy log time đầu tiên của mảng
        resizeLogtime(){
             this.logFormWorker.postMessage({
                action:'resizeLogtime',
                data:this.events
            })
        },
        getCurrentTime () {
            return this.cal ? this.cal.times.now.hour * 60 + this.cal.times.now.minute : 0
        },
        scrollToTime () {
            const time = this.getCurrentTime()
            const first = Math.max(0, time - (time % 30) - 30)
            this.cal.scrollToTime(first)
        },
        updateTime () {
            setInterval(() => this.cal.updateTimes(), 60 * 1000)},
        start(date){
            this.$emit('showLog',date);   
        },
        getLogByUserId(id){
            const self = this;
            timesheetApi.getLogByUserId({userId:id})
                .then(res => {
                    if (res.status === 200) {
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        },
        copyLogTime(event){
            let data = {...event};
            data.start = this.$moment(event.start).add(1, 'h').format("YYYY-MM-DD HH:mm");
            data.end = this.$moment(event.end).add(1, 'h').format("YYYY-MM-DD HH:mm");
            data.categoryTask = event.category;
            data.desc = event.desc || "";
            this.events.push(data);
            this.logFormWorker.postMessage({
                action:'copyLogTime',
                data:event
            })
        },
        setEventCopy(data){
            if(data){
                this.load()
            }else{
                this.$snotify({
                    type: "error",
                    title: "Lỗi"
                })
            }
        },
        // tính tổng thời gian của cả tháng
        sumMonthDuration(event, start, end) {
            let duration = this.findDuration(start, end);
            for (let i = 0; i < event.length; i++) {
                duration += duration;
            }
            return this.changeDuration(duration);
        },
        // hiển thị nội dung giới hạn kí tự
        sumDurationPerDay(calendarDate) {
            let newDuration = this.sum.map(function (item) {
                return item.sum
            });
            let newDate = this.sum.map(function (item) {
                return item.date
            });
            let result = '';
            for (let i = 0; i < newDuration.length; i++) {
                if (calendarDate == newDate[i]) {
                    result = this.changeDuration(Number(newDuration[i]));
                    break;
                } else {
                    result = 0;
                }
            }
            return result;
        },
        changeDuration(duration) {
            let hour = duration / 60;
            let minutes = duration % 60;
            if (Math.floor(hour) > 0) {
                hour = Math.floor(hour) + 'h';
            } else {
                hour = ''
            }
            if (minutes > 0) {
                minutes = minutes + 'm';
            } else {
                minutes = '';
            }
            return hour + minutes
        },
        findDuration(startTime, endTime) {
            let startFormatted = this.$moment(startTime);
            let endFormatted = this.$moment(endTime);
            let start = startFormatted.get('hour') * 60 + startFormatted.get('minute');
            let end = endFormatted.get('hour') * 60 + endFormatted.get('minute');
            let duration = end - start;
            return duration;
        },
        getDuration(startTime, endTime) {
            let duration = this.findDuration(startTime, endTime);
            return this.changeDuration(duration);
        },
        actionLogEvent(event,index){
            switch(index){
                case 0:
                    this.openLogTimeDialog(event, true);
                break;
                 case 1:
                    this.openDeleteLogtime(event);
                break;
                 case 2:
                    this.copyLogTime(event);
                break;
            }
        },
        openLogTimeDialog(event, update = false) {
            this.$emit('create-time', {
                update: update,
                logtimeEvent: event,
                onSave: () => this.load(),
                onCancel: update ? () => null : () => this.events.splice(this.events.indexOf(event), 1)
            });
        },
        openDeleteLogtime(event) {
            event.durationFormatted = this.getDuration(event.start,event.end);
            this.$emit('delete-logtime', {
                deleteEvent: event,
                onDelete: () => this.events.splice(this.events.indexOf(event), 1)
            });
        },
        // lấy ra danh sách Log time
        load() {
            let defaultStart = this.$moment().subtract(7,'days').format('YYYY-MM-DD');
            let defaultEnd = this.$moment().add(7,'days').format('YYYY-MM-DD')
            let data = {
                start:this.$refs.calendar?this.$refs.calendar.lastStart.date:defaultStart,
                end:this.$refs.calendar?this.$refs.calendar.lastEnd.date:defaultEnd
            }
             this.logFormWorker.postMessage({
                action:'getLogTimeList',
                data:data
            })
        },
        // hàm có sẵn trong thư viện Calendar của Vue
        startDrag({event, timed}) {
            if (event && timed) {
                this.dragEvent = event
                this.dragTime = null
            }
        },
        startTime(tms) {
            const mouse = this.toTime(tms);
            if (this.dragEvent && this.dragTime === null) {
                const start = this.dragEvent.start
                this.dragTime = mouse - start
            } else {
                this.createStart = this.roundTime(mouse)
                this.createEvent = {
                    name: ``,
                    timed: true,
                    date: this.createStart,
                    start: this.createStart,
                    end: this.createStart,
                }
                this.events.push(this.createEvent);
            }
        },
        mouseMove(tms) {
            const mouse = this.toTime(tms);
            if (this.dragEvent && this.dragTime !== null) {
                const start = this.dragEvent.start
                const end = this.dragEvent.end
                const duration = end - start
                const newStartTime = mouse - this.dragTime
                const newStart = this.roundTime(newStartTime)
                const newEnd = newStart + duration
                this.dragEvent.start = newStart
                this.dragEvent.end = newEnd

            } else if (this.createEvent && this.createStart !== null) {
                const mouseRounded = this.roundTime(mouse, false)
                const min = Math.min(mouseRounded, this.createStart)
                const max = Math.max(mouseRounded, this.createStart)
                this.createEvent.start = min
                this.createEvent.end = max
            }
        },
        checkPlanOrLog(startTime){
            let now = this.$moment();
            let time = this.$moment(startTime).format('DD/MMM/YYYY h:mm A');
            let check = this.$moment(time).isAfter(now)==true?0:1;
            return check
        },
        async updateEvent(event,duration){
            let start = this.$moment(event.start);
            let end = this.$moment(event.end);
            const self = this;
            let res = await timesheetApi.updateLogTime({
                start: start.format("YYYY-MM-DD HH:mm"),
                end: end.format("YYYY-MM-DD HH:mm"),
                duration: duration,
                task: event.task,
                type: self.checkPlanOrLog(event.start),
                id: event.id,
                date: start.format('YYYY-MM-DD'),
                categoryTask: event.category,
                desc: event.desc || "",
                docObjId:event.docObjId
            })
            if (res.status === 200) {
   // alert ('Hello')
               
                    // this.load();;
            } else {
                self.$snotify({
                    type: "error",
                    title: "Lỗi"
                })
                self.load();;
            }
        },
        // xử lý các sự kiện create, extend, drag log time
        handleLogTimeAction() {
            debugger // để nguyên duration và thời gian bắt đầu kết thúc
            if (this.createEvent) {// 1. createEvent khac null, kéo xuống/di chuyển
                if (this.extend) {//1.1: kéo xuống
                    try {
                        debugger
                        let duration = this.findDuration(this.createEvent.start, this.createEvent.end);
                        this.createEvent.duration = duration; 
                        this.updateEvent(this.createEvent, duration);
                     
                    } catch(e) {console.log(e); }
                } else {//1.2: tao moi event
                    this.openLogTimeDialog(this.createEvent,false);
                }
            } else if(this.dragEvent) {//2.sự kiện di chuyển logtime
                try {
                    let duration = this.findDuration(this.dragEvent.start, this.dragEvent.end);
                    this.dragEvent.date =  this.$moment(this.dragEvent.start).format('YYYY-MM-DD');
                    if(this.timeView){
                        this.updateEvent(this.dragEvent, duration);
                    }else{
                        let id = this.dragEvent.id;
                        let oldLog = [...this.listLogInTime];
                        oldLog = oldLog.filter(log=>log.id==id)[0]
                        // lấy ngày giờ => chuyển sang dạng 
                        let hour = this.$moment(oldLog.start).get('hour');
                        let minutes = this.$moment(oldLog.start).get('minutes');
                        let newStart = Number(this.$moment(this.dragEvent.start).hour(hour).minute(minutes).format('x'));
                        let newEnd = Number(newStart)+Number(oldLog.duration*60*1000);
                        // oldLog.date = this.dragEvent.date;
                        oldLog.start = newStart;
                        oldLog.date= this.$moment(newStart).format('YYYY-MM-DD');
                        oldLog.end = newEnd;
                        this.resizeLogtime();
                         this.updateEvent(oldLog, oldLog.duration);

                        
                    }
                } catch(e) { console.log(e);}
            }
            this.freshDrag();
            this.extend = false
            this.extendOriginal = null
        },
        extendBottom(event) {
            this.createEvent = event;
            this.extendOriginal = event.end;
            this.createStart = event.start;
            this.extend = true;
        },
        freshDrag(){
            this.dragEvent = null;
            this.createEvent = null;
            this.createStart = null
        },
        cancelDrag() {
            if (this.createEvent) {
                if (this.extendOriginal) {
                    this.createEvent.end = this.extendOriginal
                } else {
                    const i = this.events.indexOf(this.createEvent)
                    if (i !== -1) {
                        this.events.splice(i, 1)
                    }
                }
            }
            this.freshDrag();
        },
        roundTime(time, down = true) {
            const roundTo = 5 // minutes
            const roundDownTime = roundTo * 60 * 1000
            return down ?
                time - time % roundDownTime :
                time + (roundDownTime - (time % roundDownTime))
        },
        toTime(tms) {
            if (this.createStart) {
                const currentDate = new Date(this.createStart);
                return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), tms.hour, tms.minute).getTime()
            } else {
                return new Date(tms.year, tms.month - 1, tms.day, tms.hour, tms.minute).getTime()
            }
        },
        // hàm sự kiên chuyển kiểu list view lịch
        createCalendarHoverEvent() {
            const self = this;
            this.$refs.calendar.$el.querySelectorAll('.v-calendar-daily__day-interval').forEach(div => {
                if (self.timeView) {
                    div.setAttribute('style', div.getAttribute('style').replace('border-top: none; border-bottom: none', ''));
                     this.$refs.calendar.$el.querySelector('.v-calendar-daily__intervals-body').setAttribute('style', 'display: block');
                    this.$refs.calendar.$el.querySelector('.v-calendar-daily__intervals-head').setAttribute('style', 'display: block');
                } else {
                    this.$refs.calendar.$el.querySelector('.v-calendar-daily__intervals-head').setAttribute('style', 'display: none');
                    this.$refs.calendar.$el.querySelector('.v-calendar-daily__intervals-body').setAttribute('style', 'display: none');
                    div.setAttribute('style', div.getAttribute('style') + '; border-top: none; border-bottom: none');
                }
                if (!div.hasAttribute('data-init')) {
                    div.addEventListener("mouseleave", () => {
                        div.setAttribute('class', div.getAttribute('class').replace('create-timesheet-container', ''));
                        div.innerHTML = '';
                    });
                    div.setAttribute('data-init', 'true');
                }
            })
            if(!self.timeView){
                this.listLogInTime = [...this.events];
                this.resizeLogtime();
            }else{
                this.events = this.listLogInTime;
                this.getLogByUserId(this.userId);
                //  this.load()
            }
            
        },
        // sự kiện khi thay đổi lịch
        onChangeCalendar() {
            this.$store.commit('timesheet/updateCalendarStartEnd', {
                start: this.$moment(this.$refs.calendar.lastStart.date).format('DD/MM/YY'),
                end: this.$moment(this.$refs.calendar.lastEnd.date).format('DD/MM/YY'),
            });
            this.createCalendarHoverEvent();
        },
        updateTotalHours() {
            let start = this.$moment(this.$refs['calendar'].lastStart.date);
            const end = this.$moment(this.$refs['calendar'].lastEnd.date);
            let totalInMinutes = 0;
            while (start.isSameOrBefore(end)) {
                const date = start.format('YYYY-MM-DD');
                if (this.monthEvents[date]) {
                    totalInMinutes += this.monthEvents[date].reduce((acc,d) => +d.duration + acc, 0);
                }
                start = start.add(1, 'day');
            }
            const totalInHours = totalInMinutes / 60;
            this.$store.commit('timesheet/updateTotalHours', totalInHours % 10 === 0 ? totalInHours : totalInHours.toFixed(1));
        }
    },
    computed: {
        cal(){
                return this.ready ? this.$refs.calendar : null
        },
        nowY(){
                return this.cal ? this.cal.timeToY(this.cal.times.now) + 'px' : '-10px'
        },
        ...mapState('timesheet', {
            calendarShowDate: 'calendarShowDate',
            calendarType: 'calendarType',
            period: 'period'
        }),
        weekday() {
            const dayOfWeekMap = {
                'Sunday': 0,
                'Monday': 1,
                'Tuesday': 2,
                'Wednesday': 3,
                'Thursday': 4,
                'Friday': 5,
                'Saturday': 6,
                '0': 'Sun',
                '1': 'Mon',
                '2': 'Tue',
                '3': 'Wed',
                '4': 'Thu',
                '5': 'Fri',
                '6': 'Sat'
            };
            let weekDayOrder = [0, 1, 2, 3, 4, 5, 6];
            const startOfWeekIdx = dayOfWeekMap[this.period.firstDoW];
            weekDayOrder = weekDayOrder.splice(startOfWeekIdx, 7 - startOfWeekIdx).concat(weekDayOrder);
            if (this.calendarType === 'weekday') {
                return weekDayOrder.filter(idx => this.period.workingDays[dayOfWeekMap[idx]]);
            } else {
                return weekDayOrder;
            }
        },
        monthEvents() {
            if (this.events) {
                return _groupBy(this.events, 'date');
            } else {
                return [];
            }
        },
    },
    watch: {
         userId(){
            this.getLogByUserId(this.userId);
        },
        calendarType(newType) {
            this.getLogByUserId(this.userId);
            if (newType === 'weekday') {
                this.internalCalendarType = 'week';
            } else {
                this.internalCalendarType = newType;
            }
             this.$nextTick(() => {
                this.$nextTick(this.onChangeCalendar);
                this.updateTotalHours();
                this.getLogByUserId(this.userId);
            });   
        },
        calendarShowDate() {
            this.$nextTick(() => {
                this.onChangeCalendar();
                this.updateTotalHours();
            });
        },
        timeView() {
            this.$nextTick(this.createCalendarHoverEvent);
        },
        monthEvents() {
            this.updateTotalHours();
        }
    },
    mounted() {
        // this.$refs.calendar.scrollToTime('07:40');
        this.onChangeCalendar();
        this.ready = true;
        if(this.timeView){
            this.scrollToTime()
        }else{
            this.$refs.calendar.scrollToTime('07:40');
        }
        this.updateTime()
        const self = this
        this.logFormWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'copyLogTime':
                    self.setEventCopy(data.dataAfter)
                    break;
                 case 'resizeLogtime':
                    self.setResizeLogtime(data.dataAfter)
                    break;
                case "getLogTimeList":
                    self.setLogTimeList(data.dataAfter)
                default:
                    break;
            }
        });
    },

};
</script>
<style lang="scss" scoped>
.calendar ::v-deep .v-btn {
    background-color: transparent !important;
}
.calendar ::v-deep .v-calendar-weekly__head {
    border-bottom: 1px solid #EBE8E8;
}
.calendar ::v-deep .v-sheet {
    background-color: transparent !important;
}
.calendar ::v-deep .v-present {
    color: '#f00' !important;
}
.calendar ::v-deep .v-calendar-daily_head-weekday {
    padding: 6px 0px 0px 12px !important;
    font-size: 13px;
    display: none;
}
.calendar ::v-deep .v-btn--fab.v-size--default {
    height: unset !important;
}
.calendar ::v-deep .v-event-start {
    display: none
}
.calendar ::v-deep .v-calendar-daily__intervals-head,
.calendar ::v-deep .v-calendar-daily__intervals-body{
    width:50px!important
}
.calendar ::v-deep .v-calendar-daily__head {
    height: 44px;
}
.calendar ::v-deep .v-calendar-daily_head-day-label {
    display: none;
    height: 0px;
}
.calendar ::v-deep .v-event-timed {
    left: 3% !important;
    white-space:pre-wrap!important;
    width: 97% !important;
    user-select: none;
    -webkit-user-select: none;
    background-color:white !important;
}
.month-status{
    background-color:#90EE90; 
    width: 90%; 
    height: 3px; 
    border:1px;
    margin-top: 1px;
    margin-left: 9px
}
.v-event-draggable {
    padding-left: 6px;
    color:black
}
.v-event-drag-bottom {
    height:10px;
    position: absolute;
    left: 0;
    right: 0;
    margin-top:-5px;
    cursor: ns-resize;
    &::after {
        display: block;
        position: absolute;
        left: 50%;
        border-radius: 25px;
        height: 4px;
        border-top: 1px solid white;
        border-bottom: 1px solid white;
        width: 1px;
        margin-left: -8px;
        opacity: 0.8;
    }
    &:hover::after {
        display: block;
    }
}
.v-current-time {
    height: 2px;
    background-color:lightcoral;
    position: absolute;
    left: -1px;
    right: 0;
    pointer-events: none;
}
.create-timesheet-container {
    display: flex;
    align-items: stretch;
    justify-content: center;
}
.create-timesheet {
    line-height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
    height: 30px;
    color: black !important;
    background-color: lightgrey !important;
}
.create-timesheet:hover {
    background-color: #003961 !important;
    cursor: pointer;
    color: white !important;
}
.v-calendar-weekly__day {
    overflow: hidden !important
}
.green {
    background-color: green;
}
.head-purple {
    background-color: #D8BFD8
}
/* month */
.h-50{
    height: 600px;
}
.h-580{
    height: 600px;
    border-bottom: 1px solid rgb(0,0,0,0.05)
}
.mdi-calendar{
    margin-top:5px;
    color:#000080!important
}
</style>

<template>
<div class="w-100 pr-5 mt-2 mr-3" style="height: calc(100vh - 120px)">
    <v-sheet style = "border-bottom:1px solid lightgrey" v-bind:class="[calendarType=='month'? 'h-50' :'h-580']" 
     class="h-100 calendar">
        <v-toolbar-title v-if="$refs.calendar">
        </v-toolbar-title>
    <!-- <div style="height:100%;width:97%; background-color:lightgrey;opacity:0.8;position: relative;"> -->
        <v-calendar ref="calendar"  
            :weekdays="weekday" 
            :event-color="getEventColor"
            :type="internalCalendarType" 
            v-model="value" 
            :events="events" 
            :color="color" 
            @mousedown:event="startDrag" 
            @mousemove:time="mouseMove" 
            @mouseup:time="endDrag" 
            @mousedown:time="startTime" 
            @mouseleave.native="cancelDrag" 
            :start="calendarShowDate">
            <template v-slot:day-body="{ date, week }">
              <div
                class="v-current-time"
                :class="{ first: date === week[0].date }"
                :style="{ top: nowY }"
              ></div>
            </template>
            <template v-slot:day-label="{day,present,past, month, date}">
                <div v-bind:class="[monthEvents[date]? 'dark-sea-green' :'grey-color']" 
                 style="height: 25px; margin-left:3px;">
                    <v-tooltip top>
                        <!-- màn hình month - header ngày, giờ -->
                        <template v-slot:activator="{ on }">
                            <div v-on="on" class="pl-3 pt-1">
                                <div style="margin-left:-13px;" class="fs-12 w-100">
                                    <span v-bind:class="[present ? 'present-month' :'']">
                                        <span v-if="day==1"> {{day+'/'}} {{month}}</span>
                                        <span v-else> {{day}} </span>
                                    </span>
                                    <div style="float: right; margin-right:-55px;" class="fs-12 w-100">
                                        <span v-if="monthEvents[date]">
                                            {{ changeDuration(monthEvents[date].reduce((acc,d) => +d.duration + acc, 0))}}/{{hoursRequired.trim()+'h'}}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <span v-if="monthEvents[date]">
                            New
                        </span>
                        <span v-else>
                            Nothing
                        </span>
                    </v-tooltip>
                      <!-- màn hình month - thanh trạng thái -->
                    <div v-if="monthEvents[date]" class="month-status">
                        <div :style="{'width': monthEvents[date]
                        ? (((monthEvents[date].reduce((acc, d) => +d.duration + acc, 0) / 60) / hoursRequired) * 100) + '%'
                        : '0%'}" class="green-color" style="height: 3px; border:1px; margin-left: 0px">
                        </div>
                    </div>
                </div>
            </template>
              <!-- màn hình month - task -->
            <template v-slot:day="{past, present, date}">
                <div class= "fs-12 pl-1 pr-1 mt-1">
                    <v-menu v-if="monthEvents[date]" offset-y>
                        <template v-slot:activator="{on}">
                            <template v-if="monthEvents[date]">
                                <div v-for="event in monthEvents[date]" 
                                :key="event.start" 
                                v-on="on" 
                                class="honey-drew mb-1" 
                                style='height: 10%; 
                                overflow: hidden!important'>
                                   <span><i class="mdi mdi-check" color="green"></i></span>
                                    {{event.category_key}} -
                                    {{validateContent(event.name,23)}}
                                </div>
                            </template>
                        </template>
                        <ViewDetailMonth :detail="monthEvents[date].sort((a,b) => a.start - b.start)" :hour="hoursRequired" />
                    </v-menu>
                </div>
                <div class="ml-3 fs-13 new-log" @click="start(date)">[<v-icon style="font-size:11px"> mdi-plus</v-icon> New log]</div>
            </template>
              <!-- màn hình week/day/weekday - event log -->
            <template v-slot:event="{ event, eventSummary,timed, eventParsed  }">
                <v-menu offset-x :nudge-right="10">
                    <template v-slot:activator="{on: detailEvents}">
                        <div
                            @dblclick="openLogTimeDialog(event, true)"
                            v-on="detailEvents"
                            class="d-flex flex-column"
                            style="height: 100%">
                            <div v-if="event.type==null" class="v-event-draggable" v-html="eventSummary()">Task</div>
                            <div class="d-flex flex-row fs-14" style="padding-left: 10px; padding-top:2px">
                                <div class="fs-13 fm" :style="{'width':(findDuration(event.start, event.end)>62)?'70%':'75%'}">
                                    <span v-if="findDuration(event.start, event.end)<62">
                                        <v-icon v-if="event.type==0" class="fs-15" color='primary'>
                                            mdi-calendar</v-icon>
                                        <v-icon v-if="event.type==1" class="fs-15" color='success'>mdi-check-all</v-icon>
                                    </span>
                                    <b style="font-weight:430; color:#303030" class="fs-12">
                                        <span v-if="findDuration(event.start, event.end)<62">
                                        {{validateContent(event.name,12)}}
                                        </span>
                                        <span v-if="findDuration(event.start, event.end)>61">
                                        {{validateContent(event.name,18)}}
                                        </span>
                                    </b>
                                </div>
                                <div style="margin-top: -8px">
                                    <v-menu open-on-focus transition="scale-transition" 
                                        open-on-hover bottom left nudge-left='5' 
                                        nudge-top='-10'>
                                        <template v-slot:activator="{ on: actionEvents, attrs: actionAttrs }">
                                            <span class="fs-12" v-if="findDuration(event.start, event.end)<62"
                                                v-on="actionEvents" style="margin-right:-20px;margin-left:5px;font-weight:430">
                                                {{getDuration(eventParsed.input.start,eventParsed.input.end )}}
                                            </span>
                                            <v-btn style = "margin-left:5px" dense dark icon v-bind="actionAttrs" v-on="actionEvents">
                                                <v-icon v-if="event.type"
                                                small class=" fs-13 ml-4" 
                                                :style="{'margin-right':(findDuration(event.start, event.end)>62)?'':':25px'}" 
                                                style="color:black" >
                                                    mdi-dots-vertical</v-icon>
                                            </v-btn>
                                        </template>
                                        <div class="d-flex flex-column">
                                            <v-btn class="font-normal fs-13"
                                            depressed @click="openLogTimeDialog(event, true)">{{$t('timesheet.update')}}</v-btn>
                                            <v-btn class="font-normal fs-13"
                                            depressed @click="openDeleteDialog(event)">{{$t('timesheet.delete')}}</v-btn>
                                            <v-btn class="font-normal fs-13"
                                            depressed @click="copyLogTime(event)">Sao chép</v-btn>
                                        </div>
                                    </v-menu>
                                </div>
                            </div>
                            <div v-if="findDuration(event.start, event.end)>105" style="color:grey; 
                                height: 30px; padding-left: 10px;" class="fs-12">
                                {{event.desc ? validateContent(event.desc,18) : "" }}
                            </div>
                            <v-spacer />
                            <div class="pa-2 w-100 d-flex flex-row justify-space-between align-center">
                                <div>
                                    <span v-if="findDuration(event.start, event.end)>70">
                                        <v-icon v-if="event.type==0" class="fs-15" color='primary'>
                                            mdi-calendar</v-icon>
                                        <v-icon v-if="event.type==1" class="fs-15" color='success'>mdi-check-all</v-icon>
                                    </span>
                                    <span style="color:grey" class= "fs-12" v-if="findDuration(event.start, event.end)>70"> 
                                        {{event.category_key}}
                                    </span>
                                </div>
                                <div>
                                    <div  v-if="findDuration(event.start, event.end)>61" class="fs-11 font-normal" style="float: right;font-weight:410;margin-top: -5px">
                                        {{getDuration(eventParsed.input.start,eventParsed.input.end )}}
                                    </div>
                                    <!-- <div v-else  class="pr-5"  v-on="on">ádạdk</div> -->
                                </div>
                            </div>
                        </div>
                        <div v-if="timed" class="v-event-drag-bottom" style="height: 10px" @mousedown.stop="extendBottom(event)">
                        </div>
                    </template>
                    <div>
                        <LogTimeView v-bind:event="event" />
                    </div>
                </v-menu>
            </template>
             <!-- màn hình week/day/weekday - header -->
            <template v-slot:day-header="{day, present, month, weekday, date}">
                <div :class="[monthEvents[date]? 'light-green-color' :'grey-color']">
                    <div class="px-3 pt-2">
                        <div class="d-flex justify-space-between">
                            <span v-if=" weekday==1" v-bind:class="[present ? 'color-orange' :'color-grey']"><span class="fs-14">{{$t('timesheet.mon')}}</span><span v-bind:class="[present ? 'color-orange' :'color-darkgrey fs-12 ']" class="fs-14"> {{day}}/{{month}}</span></span>
                            <span v-if=" weekday==2" v-bind:class="[present ? 'color-orange' :'color-grey']"><span class="fs-14">{{$t('timesheet.tue')}}</span><span v-bind:class="[present ? 'color-orange' :'color-darkgrey fs-12']" class="fs-14"> {{day}}/{{month}}</span></span>
                            <span v-if=" weekday==3" v-bind:class="[present ? 'color-orange' :'color-grey']"><span class="fs-14">{{$t('timesheet.wed')}}</span><span v-bind:class="[present ? 'color-orange' :'color-darkgrey fs-12']" class="fs-14"> {{day}}/{{month}}</span></span>
                            <span v-if=" weekday==4" v-bind:class="[present ? 'color-orange' :'color-grey']"><span class="fs-14">{{$t('timesheet.thu')}}</span><span v-bind:class="[present ? 'color-orange' :'color-darkgrey fs-12']" class="fs-14"> {{day}}/{{month}}</span></span>
                            <span v-if=" weekday==5" v-bind:class="[present ? 'color-orange' :'color-grey']"><span class="fs-14">{{$t('timesheet.fri')}}</span><span v-bind:class="[present ? 'color-orange' :'color-darkgrey fs-12']" class="fs-14"> {{day}}/{{month}}</span></span>
                            <span v-if=" weekday==6" v-bind:class="[present ? 'color-orange' :'color-grey']"><span class="fs-14">{{$t('timesheet.sat')}}</span><span v-bind:class="[present ? 'color-orange' :'color-darkgrey fs-12']" class="fs-14"> {{day}}/{{month}}</span></span>
                            <span v-if=" weekday==0" v-bind:class="[present ? 'color-orange' :'color-grey']"><span class="fs-14">{{$t('timesheet.sun')}}</span><span v-bind:class="[present ? 'color-orange' :'color-darkgrey fs-12']" class="fs-14"> {{day}}/{{month}}</span></span>
                            <span v-if="monthEvents[date]">
                               <span class="fs-12" style="color:#484848">
                                   {{ changeDuration(monthEvents[date].reduce((acc, d) => +d.duration + acc, 0))}}/{{hoursRequired.substr(0,1)+'h'}}</span> 
                            </span>
                        </div>
                    </div>
                    <div style="background-color:#CCCCCC; width: 90%; height: 5px; border:1px; margin-top: 9px; margin: 0 auto">
                        <div v-bind:class="[monthEvents[date]?'green' :'grey-color']" style="overflow:hidden; height: 5px; border:1px; margin-top: 9px;" 
                        :style="{'width': monthEvents[date]
                        ? ((((monthEvents[date].reduce((acc, d) => +d.duration + acc, 0) / 60) / hoursRequired) * 100))>100?100+ '%':(((monthEvents[date].reduce((acc, d) => +d.duration + acc, 0) / 60) / hoursRequired) * 100) + '%'
                        : '0%'}">
                        </div>
                    </div>
                </div>
            </template>
        </v-calendar>
        <!-- </div> -->
    </v-sheet>
</div>
</template>

<script>
import ViewDetailMonth from "./../../components/timesheet/ViewDetailMonth";
import LogTimeView from "./../../components/timesheet/LogTimeView";
import DeleteLogView from "./../../components/timesheet/DeleteLogView";
import timesheetApi from '../../api/timesheet';
import { mapState} from 'vuex';

import _ from 'lodash';

export default {
    name: "LogCalendar",
    components: {
        ViewDetailMonth,
        LogTimeView,
        DeleteLogView,
    },
    props: ['timeView','userId'],
    data() {
        return {
            value: '',
            ready: false,
            detail: false,
            color: 'orange',
            dragEvent: null,
            createEvent: null,
            createStart: null,
            extendOriginal: null,
            startDate: '1',
            focus: '',
            internalCalendarType: 'week',
            value: '',
            extend : false,
            sum: [],
            events: [],
            dialog: false,
            hoursRequired: '',
        };
    },

    created() {
        this.load();
    },
    methods: {
        // lấy log time đầu tiên của mảng
        resizeLogtime(){
            let taskLength = 60*60*1000;
            let padding = 60*60*300;
            let lastDate, lastEnd;
            let newTasks = this.events.map(task=>{
                if(task.date!== lastDate){
                    lastDate = task.date;
                    task.start = this.$moment(task.start).startOf('day').hour(1).toDate().getTime()
                    task.end = task.start + taskLength;
                    lastEnd = task.end
                }else{
                    task.start = lastEnd+padding;
                    task.end = task.start + taskLength;
                    lastEnd = task.end
                }
                return task;
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
            setInterval(() => this.cal.updateTimes(), 60 * 1000)
            },
        start(date){
            this.$emit('showLog',date);   
        },
         getLogByUserId(id){
             const self = this;
            timesheetApi.getLogByUserId({userId:id})
                .then(res => {
                    if (res.status === 200) {
                        const logTimeList = res.data.listLogTime;
                        self.sum = res.data.sumLogTime;
                        self.hoursRequired = res.data.hourRequired[0].hoursRequired;
                        self.events = [...logTimeList.map((logTime, idx) => ({
                            name: `${logTime.task_id}`,
                            timed: true,
                            // log form data
                            date: logTime.date,
                            start: Date.parse(logTime.start_time_at),
                            end: Date.parse(logTime.end_time_at),
                            duration: logTime.duration,
                            category: logTime.category_task,
                            category_key: logTime.key,
                            task: logTime.task_id,
                            desc: logTime.description,
                            type: logTime.type,
                            id: logTime.id
                        }))];
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.$store.commit("timesheet/setShowErrorDialog", { msg: '', show: true });
                })
        },
        copyLogTime(event){
            
              timesheetApi.createLogTime({
                start:this.$moment(event.start).add(1, 'h').format("YYYY-MM-DD HH:mm"),
                end: this.$moment(event.end).add(1, 'h').format("YYYY-MM-DD HH:mm"),
                duration:event.duration,
                task: event.task,
                type: event.type,
                id: event.id,
                date: event.date,
                categoryTask: event.category,
                desc: event.desc || ""
            })
            .then(res => {
                if (res.status === 200) {
                    //console.log(res);
                    this.load()
                }
            })
            .catch(console.log);
                 
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
        validateContent(content, number) {
            if (content.length > number) {
                return content.slice(0, number) + '...';
            } else {
                return content;
            }
        },
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
        openLogTimeDialog(event, update = false) {
            this.$emit('create-time', {
                update: update,
                logtimeEvent: event,
                onSave: () => this.load(),
                onCancel: update ? () => null : () => this.events.splice(this.events.indexOf(event), 1)
            });
        },
        openDeleteDialog(event) {
            this.$emit('delete-event', {
                deleteEvent: event,
                onDelete: () => this.events.splice(this.events.indexOf(event), 1)
            });
        },
        // lấy ra danh sách Log time
        load() {
            const self = this;
            timesheetApi.getLogTimeList()
                .then(res => {
                    if (res.status === 200) {
                        const logTimeList = res.data.listLogTime;
                        self.sum = res.data.sumLogTime;
                        self.hoursRequired = res.data.hourRequired[0].hoursRequired;
                        self.events = [...logTimeList.map((logTime, idx) => ({
                            name: `${logTime.task_id}`,
                            timed: true,
                            // log form data
                            date: logTime.date,
                            start: Date.parse(logTime.start_time_at),
                            end: Date.parse(logTime.end_time_at),
                            duration: logTime.duration,
                            category: logTime.category_task,
                            category_key: logTime.key,
                            task: logTime.task_id,
                            desc: logTime.description,
                            type: logTime.type,
                            id: logTime.id
                        }))];
                    }
                })
                .catch(err => {
                    console.log(err);
                    this.$store.commit("timesheet/setShowErrorDialog", { msg: '', show: true });
                })
        },
        // hàm có sẵn trong thư viện Calendar của Vue
        pre() {
            return this.$refs.calendar.prev();
        },
        getEventColor(event) {
            return event.color
        },
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
        async endDrag() {
            let self = this;
            async function updateEvent(event, duration) {
                let start = self.$moment(event.start);
                let end = self.$moment(event.end);
                let res = await timesheetApi.updateLogTime({
                    start: start.format("YYYY-MM-DD HH:mm"),
                    end: end.format("YYYY-MM-DD HH:mm"),
                    duration: duration,
                    task: event.task,
                    type: event.type,
                    id: event.id,
                    date: start.format('YYYY-MM-DD'),
                    categoryTask: event.category,
                    desc: event.desc || ""
                });
                if (res.status === 200) {
                    return true;
                } else {
                    return false;
                }
            }
            // 3 loai su kien: create, extend, drag
            // 1. neu createEvent khac null, co 2 truong hop nho
            if (this.createEvent) {
                if (this.extend) {
                    // truong hop 1.1: neu extend => update event
                    try {
                         let duration = this.findDuration(this.createEvent.start, this.createEvent.end);
                        let result = await updateEvent(this.createEvent, duration);
                        if (result) this.load();
                    } catch(e) {
                        console.log(e);
                    }
                } else {
                    // truong hop 1.2: tao moi event
                    this.openLogTimeDialog(this.createEvent);
                }
            } else if(this.dragEvent) {
                // 2. drag event => update event
                try {
                    let duration = this.findDuration(this.dragEvent.start, this.dragEvent.end);
                    let result = await updateEvent(this.dragEvent, duration);
                    if (result) this.load();
                } catch(e) {
                    console.log(e);
                }
            }
            this.dragEvent = null
            this.createEvent = null
            this.createStart = null
            this.extend = false
            this.extendOriginal = null
        },
        extendBottom(event) {
            this.createEvent = event;
            this.extendOriginal = event.end;
            this.createStart = event.start;
            this.extend = true;
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
            this.createEvent = null
            this.createStart = null
            this.dragTime = null
            this.dragEvent = null
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
        rnd(a, b) {
            return Math.floor((b - a + 1) * Math.random()) + a
        },
        rndElement(arr) {
            return arr[this.rnd(0, arr.length - 1)]
        },
        // hàm sự kiên chuyển kiểu list view lịch
        createCalendarHoverEvent() {
            const self = this;
            this.$refs.calendar.$el.querySelectorAll('.v-calendar-daily__day-interval').forEach(div => {
                if (self.timeView) {
                    div.setAttribute('style', div.getAttribute('style').replace('; border-top: none; border-bottom: none', ''));
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
                this.resizeLogtime();
            }else{
                 this.getLogByUserId(this.userId);
            }
            
        },
        onChangeCalendar() {
            this.$store.commit('timesheet/updateCalendarStartEnd', {
                start: this.$moment(this.$refs.calendar.lastStart.date).format('DD/MM'),
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
            cal () {
                return this.ready ? this.$refs.calendar : null
            },
            nowY () {
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
                return _.groupBy(this.events, 'date');
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
         this.ready = true
        this.scrollToTime()
        this.updateTime()
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
.calendar ::v-deep .v-calendar-weekly__head-weekday {
    font-size: 13px !important;
}
.calendar ::v-deep .v-sheet {
    background-color: transparent !important;
}
.calendar ::v-deep .v-btn:before {
    background-color: transparent !important;
    font-size: 13px;
    color: black;
    font-weight: normal;
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
    font-size: 13px;
    font-family: Roboto;
    height: 44px;
}
.calendar ::v-deep .v-calendar-daily_head-day-label {
    display: none;
    height: 0px;
}
.calendar ::v-deep button {
    font-size: 13px;
    font-family: Roboto;
    font-weight: normal;
}
.calendar ::v-deep .v-event-timed {
    left: 3% !important;
    width: 97% !important;
    user-select: none;
    -webkit-user-select: none;
    background-color: rgb(254, 253, 253) !important;
    border: 1px solid lightgrey !important;
    border-radius:1px!important;
    color: black !important;
    font-size: 13px;
}
.month-status{
    background-color:#90EE90; 
    width: 90%; 
    height: 3px; 
    border:1px;
    margin-top: 1px;
    margin-left: 9px
}
.logtime-select:hover {
    background-color: #062879 !important;
    display: block;
}
.present-month {
    color: orange;
    font-weight: bold;
    font-size: 13px;
}
.v-event-draggable {
    padding-left: 6px;
}
.v-event-drag-bottom {
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
.month-tooltip {
    opacity: 1 !important;
}
.v-current-time {
height: 2px;
background-color: #ea4335;
position: absolute;
left: -1px;
right: 0;
pointer-events: none;

&.first::before {
  content: '';
  position: absolute;
  background-color: #ea4335;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-top: -5px;
  margin-left: -6.5px;
}
}
</style><style>

.create-timesheet-container {
    display: flex;
    align-items: stretch;
    justify-content: center;
}
.create-timesheet {
    line-height: 20px;
    color: #fff !important;
    font-size: 13px;
    display: flex;
    font-family: Roboto;
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
.green-color{
    background-color:green;
}
.color-darkgrey{
    color:#484848;
   /* // font-size:12px!important */
}
.honey-drew{
    background-color:#F0FFF0
}

.grey-color {
    background-color: #DCDCDC
}

.green {
    background-color: green;
}
.color-orange{
    color:orange
}
.light-green-color{
    background-color: #e2f9e4
}
.head-purple {
    background-color: #D8BFD8
}
.dark-sea-green {
    background-color: #8FBC8F
}
/* month */
.h-50{
    height: 600px;
}

.h-580{
height: 600px;
border-bottom: 1px solid rgb(0,0,0,0.05)

}

.new-log{
   opacity: 0;
}

.new-log:hover{
    opacity: 1;
    color:grey
}

</style>

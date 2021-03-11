<template>
<div class="period-selector d-flex justify-space-between">
    <div class="select-time d-flex justify-start " style="width:50%">
        <v-btn small depressed class="border-all mr-1 bg-white" @click="today()">Hôm nay</v-btn>
        <v-btn small style="margin-top:-1px" icon @click="pre()">
            <v-icon small>mdi-chevron-left</v-icon>
        </v-btn>
        <!-- <span style="color:#008080; font-weight:430!important">{{totalHours*10/10}}/{{hoursRequired}}</span> -->
        <span class="ml-1 mt-1">{{month}}</span>
        <v-btn small  style="margin-top:-1px" icon @click="next()">
            <v-icon small>mdi-chevron-right </v-icon>
        </v-btn>
        <!-- <v-menu offset-y>
            <v-list>
                <v-list-item v-for="(item, index) in items" :key="index">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu> -->
        <!-- <v-autocomplete
            style="width:30%"
            v-model="user"
            :items="listUser"
            return-object
            placeholder="Chọn user"
            item-text="displayName"
            item-value="id"              
            class="auto-complete mr-1 "
            dense>
        </v-autocomplete> -->
        <!-- <v-btn v-for="action in actions" 
            :key="action.label"  
            :style="{background:action.hover?'#E8E8E8':'#F7F7F7'}" 
            depressed small class="mr-1" color="#F7F7F7" 
            @click="action.action(action.idx)">
            {{format(action.label)}}
        </v-btn> -->
    </div>
    <div class="d-flex justify-end mt-2">
        
    </div>
</div>
</template>

<script>
import { mapState } from 'vuex';
import { orgchartApi } from '../../api/orgchart.js';
import timesheet from '../../api/timesheet.js';

const dayjsTypeMapper = {
    'day': 'day',
    'weekday': 'week',
    'week': 'week',
    'month': 'month'
}

export default {
    methods: {
        today(){
            this.$store.commit('timesheet/updateCalendarShowDate', this.$moment().format('YYYY-MM-DD'));
        },
        findRepeatLog(){
            let start = this.$moment(this.startDate,'DD-MM-YY');
            let end = this.$moment(this.endDate,'DD-MM-YY');
            let duration = this.$moment.duration(end.diff(start)).asDays();
            duration = Number(duration)*4+3;
            let nextDate= this.$moment(start).add(duration, 'days').format('YYYY-MM-DD')// ngày bắt đầu sau 4 lần thời gian ở màn bắt đầu
            let dateYearAgo = this.$moment(start).subtract(1,'years').format('YYYY-MM-DD');
            let data = {
                end: this.$moment(start).format('YYYY-MM-DD'),//mốc bắt đầu từ start Calendar
                nextDate : nextDate,//đoạn thời gian gấp 4 lần tính từ mốc
                start: dateYearAgo// 1 năm trước từ mốc
            }
            const self = this;
            timesheet.checkHasRepeatLog(data).then(res=>{
                if(res.status==200){
                    self.logRepeat = [...res.data];
                    self.handleRepeatedLog()

                }
            })

        },
        handleRepeatedLog(){

        },
        getSubDepartmentUser(){
            const self = this;
            orgchartApi.getSubDepartMent().then(res=>{
                if(res.status=200){
                    self.listUser = [...res.data];
                }
            })
        },
        showCurrentUser(){
            let id = this.$store.state.app.endUserInfo.id;
            this.listUser = [];
            let listUser = [...this.$store.state.app.allUsers];
            listUser.map(u=>{
                if(u.id==id){
                    this.listUser.push({
                        id:id,
                        displayName:u.displayName
                    });
                    this.user = u;
                }
            })
            

        },
        format(date){
            switch(date){
                case'Next week':
                    return this.$t('timesheet.next_week');
                case'Last week':
                    return this.$t('timesheet.last_week');
                case'Current week':
                    return this.$t('timesheet.cur_week');
                case'Next day':
                    return this.$t('timesheet.next_day');
                case'Last day':
                    return this.$t('timesheet.last_day');
                case'Current day':
                    return this.$t('timesheet.cur_day');
                case'Jan':
                    return this.$t('timesheet.jan');
                case'Feb':
                    return this.$t('timesheet.feb');
                case'Mar':
                    return this.$t('timesheet.mar');
                case'Apr':
                    return this.$t('timesheet.apr');
                case'May':
                    return this.$t('timesheet.may');
                case'Jun':
                    return this.$t('timesheet.jun');
                case'Jul':
                    return this.$t('timesheet.jul');
                case'Aug':
                    return this.$t('timesheet.aug');
                case'Sep':
                    return this.$t('timesheet.sep');
                case'Oct':
                    return this.$t('timesheet.oct');
                case'Nov':
                    return this.$t('timesheet.nov');
                case'Dec':
                    return this.$t('timesheet.dec');
            }

        },
        pre() {
            this.$store.commit('timesheet/updateCalendarShowDate', this.$moment(this.showDate).subtract(1, dayjsTypeMapper[this.type]).format('YYYY-MM-DD'));
            if (this.type === 'month') {
                this.$store.commit('timesheet/adjustCalendar', this.$store.state.timesheet.calendarAdjustment - 1);
            }
        },
        next() {
            // this.getPrelog();
            this.findRepeatLog();
            this.$store.commit('timesheet/updateCalendarShowDate', this.$moment(this.showDate).add(1, dayjsTypeMapper[this.type]).format('YYYY-MM-DD'));
            if (this.type === 'month') {
                this.$store.commit('timesheet/adjustCalendar', this.$store.state.timesheet.calendarAdjustment + 1);
            }

        },
        changeActions(newType) {
             const self = this;
            this.$store.commit('timesheet/updateCalendarShowDate', this.$moment().format('YYYY-MM-DD'));
            newType = newType.replace('weekday', 'week');
            switch (newType) {
                case 'month':
                   
                    const monthAction = (month,idx) => ({
                        label: this.$moment().subtract(month, 'M').format('MMM'),
                        hover:false,
                        idx,
                        action: (idx) => {
                            this.$store.commit('timesheet/updateCalendarShowDate', this.$moment().subtract(month, 'month').format('YYYY-MM-DD'));
                            this.$store.commit('timesheet/adjustCalendar', month);
                            self.actions = self.actions.map(act=>{
                                    act.hover=false
                                    return act;
                            })
                            self.actions[idx].hover=!self.actions[idx].hover;
                        }
                    });
                    this.actions = [3,2,1,0].map((m,i) => monthAction(m,i));
                    break;
                default: 
                   
                    this.actions = [
                            {label: 'Last ' + newType, adjust: -1, hover:false},
                            {label: 'Current ' + newType, adjust: 0, hover:true},
                            {label: 'Next ' + newType, adjust: 1,hover: false}
                        ].map(({label, adjust,hover}, idx) => ({
                            hover,
                            label,
                            idx,
                            action: (idx) => {
                                this.$store.commit('timesheet/updateCalendarShowDate', this.$moment().add(adjust, newType).format('YYYY-MM-DD'))
                                this.$store.commit('timesheet/adjustCalendar', 0);
                                self.actions = self.actions.map(act=>{
                                    act.hover=false
                                    return act;
                                })
                                self.actions[idx].hover=!self.actions[idx].hover;

                            }
                        }));
                     
            }
        }
    },
    computed: {
        ...mapState('timesheet', {
            startDate: 'calendarStartDate',
            endDate: 'calendarEndDate',
            showDate: 'calendarShowDate',
            type: 'calendarType',
            totalHours: 'totalHours'
        }),
        hoursRequired() {
            return this.$store.getters['timesheet/getTotalHoursBy']('timesheet');
        },
        month(){
            let startDate = this.$moment(this.startDate,'DD/MM/YY');
            return startDate.format('MMMM')+', '+startDate.format("YYYY");
        }
    },
    data: () => ({
       listUser:[],
       logRepeat:[],
        actions: [],
        user:'',
    }),
    created() {
        this.showCurrentUser();
        this.getSubDepartmentUser();
        this.changeActions(this.type);
    },
    watch: {
        type(newType) {
            this.changeActions(newType);
        },
        user(){
            this.$store.commit("timesheet/updateUserId", this.user.id)
        },
    }
}
</script>

<style lang="scss" scoped>
.auto-complete ::v-deep .v-list {
    width: 385px !important;
}

.auto-complete ::v-deep .v-input__slot {
    background-color: #F7F7F7;
    margin-top: -19px;
}

.auto-complete ::v-deep .v-label {
    font-size: 13px;
    padding-left: 10px;
}

.auto-complete ::v-deep .v-input__slot:after,
.auto-complete ::v-deep .v-input__slot:before  {
    border-color: transparent !important
}

.auto-complete ::v-deep .v-label--active {
    display: none;
}

.auto-complete ::v-deep .v-list {
    width: 385px !important;
}

.auto-complete ::v-deep .v-select__slot {
    height: 25px
}

.auto-complete ::v-deep .v-input__icon {
    padding-bottom: 6px !important
}

.auto-complete ::v-deep .v-select__slot>input {
    padding-top: 15px;
}

.auto-complete ::v-deep .v-input__icon>button {
    font-size: 14px !important
}

.period-selector ::v-deep .v-input__slot{
   margin-top:-3px;
   padding-left: 10px;
   padding-bottom: 2px
}

span {
    font-size: 13px !important;
    font-family: Roboto !important;
    font-weight: normal !important;
}

button {
    font-weight: normal;
    font-size: 13px !important;
    font-family: Roboto !important;
    color: black;
}

.v-input {
    font-size: 13px
}

.v-select__selections {
    font-size: 13px !important
}

.select-time ::v-deep.v-btn__content{
    letter-spacing: 1px;

}

.width-58{
    width: 58%; 
    padding-top:14px
}

.width-55{
    width: 54%;
    padding-top:14px
}
</style>

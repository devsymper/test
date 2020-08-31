<template>
<div style="width:62%;float:left">
    <div class="float-lg-left float-md-left .d-lg-flex .d-lg-none d-none d-lg-block select-time" 
        v-bind:class = "[type=='month' ? 'width-55' :'width-58']">
        <v-menu offset-y>
            <!-- <template v-slot:activator="{on}">
                <v-btn class="mr-1" 
                color="#F7F7F7" 
                v-on="on" 
                depressed small>
                    Quynh
                    <v-btn icon>
                        <v-icon>mdi-chevron-down</v-icon>
                    </v-btn>    
                </v-btn>
            </template> -->
            <v-list>
                <v-list-item v-for="(item, index) in items" :key="index">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
        <v-btn v-for="action in actions" :key="action.label" depressed small class="mr-1" color="#F7F7F7" 
            @click="action.action">
            {{format(action.label)}}
        </v-btn>
    </div>
    <v-col style="padding-left:0px" class=".d-lg-flex .d-lg-none d-none d-lg-block">
        <v-btn icon @click="pre()">
            <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <span>{{totalHours*10/10}}/{{hoursRequired}} {{$t('common.of')}} {{startDate}} - {{endDate}}</span>
       
        <v-btn icon @click="next()">
            <v-icon>mdi-chevron-right </v-icon>
        </v-btn>
    </v-col>
</div>
</template>

<script>
import dayjs from 'dayjs';
import { mapState } from 'vuex';

const dayjsTypeMapper = {
    'day': 'day',
    'weekday': 'week',
    'week': 'week',
    'month': 'month'
}

export default {
    methods: {
        format(date){
            switch(date){
                case'Next week':
                    return this.$t('common.next_week');
                case'Last week':
                    return this.$t('common.last_week');
                case'Current week':
                    return this.$t('common.cur_week');
                case'Next day':
                    return this.$t('common.next_day');
                case'Last day':
                    return this.$t('common.last_day');
                case'Current day':
                    return this.$t('common.cur_day');
                case'Jan':
                    return this.$t('common.jan');
                case'Feb':
                    return this.$t('common.feb');
                case'Mar':
                    return this.$t('common.mar');
                case'Apr':
                    return this.$t('common.apr');
                case'May':
                    return this.$t('common.may');
                case'Jun':
                    return this.$t('common.jun');
                case'Jul':
                    return this.$t('common.jul');
                case'Aug':
                    return this.$t('common.aug');
                case'Sep':
                    return this.$t('common.sep');
                case'Oct':
                    return this.$t('common.oct');
                case'Nov':
                    return this.$t('common.nov');
                case'Dec':
                    return this.$t('commom.dec');
            }

        },
        pre() {
            this.$store.commit('timesheet/updateCalendarShowDate', dayjs(this.showDate).subtract(1, dayjsTypeMapper[this.type]).format('YYYY-MM-DD'));
            if (this.type === 'month') {
                this.$store.commit('timesheet/adjustCalendar', this.$store.state.timesheet.calendarAdjustment - 1);
            }
        },
        next() {
            this.$store.commit('timesheet/updateCalendarShowDate', dayjs(this.showDate).add(1, dayjsTypeMapper[this.type]).format('YYYY-MM-DD'));
            if (this.type === 'month') {
                this.$store.commit('timesheet/adjustCalendar', this.$store.state.timesheet.calendarAdjustment + 1);
            }
        },
        changeActions(newType) {
            this.$store.commit('timesheet/updateCalendarShowDate', dayjs().format('YYYY-MM-DD'));
            newType = newType.replace('weekday', 'week');
            switch (newType) {
                case 'month':
                    const monthAction = (month) => ({
                        label: dayjs().subtract(month, 'M').format('MMM'),
                        action: () => {
                            this.$store.commit('timesheet/updateCalendarShowDate', dayjs().subtract(month, 'month').format('YYYY-MM-DD'));
                            this.$store.commit('timesheet/adjustCalendar', -month);
                        }
                    });
                    this.actions = [3,2,1,0].map(m => monthAction(m));
                    break;
                default: 
                    this.actions = [
                            {label: 'Last ' + newType, adjust: -1},
                            {label: 'Current ' + newType, adjust: 0},
                            {label: 'Next ' + newType, adjust: 1}
                        ].map(({label, adjust}, idx) => ({
                            label,
                            action: () => {
                                this.$store.commit('timesheet/updateCalendarShowDate', dayjs().add(adjust, newType).format('YYYY-MM-DD'))
                                this.$store.commit('timesheet/adjustCalendar', 0);
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
        }
    },
    data: () => ({
        today: '2019-01-08',
        items: [{
                title: 'Dương'
            },
            {
                title: 'Trung'
            },
        ],
        actions: []
    }),
    created() {
        this.changeActions(this.type);
    },
    watch: {
        type(newType) {
            this.changeActions(newType);
        }
    }
}
</script>

<style lang="scss" scoped>
.v-btn:not(.v-btn--round).v-size--small {
    padding: 0 4px !important;
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

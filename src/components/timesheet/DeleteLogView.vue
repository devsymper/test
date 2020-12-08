<template>
<v-card>
    <v-card-title style=" padding-bottom: 15px; padding-top: 10px" class="headline lighten-2" primary-title>
        <div style="border-bottom: 1px solid lightgrey; width: 100%; padding-bottom: 10px">
            <span style="font-size:16px; font-weight:bold">{{$t('timesheet.delete')}} {{formattedDeleteEvent.name}}</span> 
            <!-- <span style="font-size:16px; font-weight:bold" v-else>View plan time</span> -->
            </div>
    </v-card-title>
    <v-card-text style="height: 55px!important ">
        <span class="label pt-2 ">{{$t('timesheet.category_task')}}</span>
       <br/> {{formattedDeleteEvent.category}}
    </v-card-text>
    <v-card-text style="height: 55px" class='cate-task'>
        <span class="label pt-2">{{$t('timesheet.task_form')}}</span>
        <br/> {{formattedDeleteEvent.name}}
    </v-card-text>
    <v-card-text class="div-calender-picker .d-lg-flex .d-lg-none d-none d-lg-block">
        <div style="height: 32px; margin-top:3px">
            <div class="date ">
                <span class="label pt-2">{{$t('timesheet.date')}}</span>
                {{formattedDeleteEvent.date}}
            </div>
            <div class="duration">
                <span class="label pt-2">{{$t('timesheet.duration')}}</span>
                {{formattedDeleteEvent.duration}}
            </div>
            <div class='start-time'>
                <span class="label pt-2">{{$t('timesheet.start_time')}}</span>
                {{formattedDeleteEvent.start}}
            </div>
            <div style="width: 60px; float: left">
                <span class="label pt-2">{{$t('timesheet.end_time')}}</span>
                {{formattedDeleteEvent.end}}
            </div>
        </div>
    </v-card-text>
    <v-card-text v-if="formattedDeleteEvent.desc" class="div-description">
        <span class="label pt-2">{{$t('timesheet.description')}}</span>
        <br/> {{formattedDeleteEvent.desc}}
    </v-card-text>
    <v-card-actions style="padding-bottom:20px">
        <div class="col-5"></div>
        <div class="col-3">
          <v-btn small color="error" style="margin-left:15px" @click="doDelete">Delete</v-btn>
        </div>
        <div class="col-3">
          <v-btn small style="margin-left:15px" @click="$emit('cancel')">Cancel</v-btn>
        </div>
    </v-card-actions>
</v-card>
</template>

<script>
import timesheetApi from '../../api/timesheet';

export default {
    props: ['deleteEvent', 'onDelete', 'onCancel'],
    data() {
        return {
            formattedDeleteEvent: {},
        }
    },
    methods: {
        getDuration(startTime, endTime) {
            let startFormatted = this.$moment(startTime);
            let endFormatted = this.$moment(endTime);
            let start = startFormatted.get('hour') * 60 + startFormatted.get('minute');
            let end = endFormatted.get('hour') * 60 + endFormatted.get('minute');
            let duration = end - start;
            // console.log(duration);
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
        doDelete() {
            timesheetApi.deleteLogTime({
                    ...this.deleteEvent, 
                    id: this.deleteEvent.id,     
            })
                .then(res => {
                    console.log(res);
                    if (res.status === 200) {
                          this.onDelete();
                    }
                })
                .catch(console.log)
            this.$emit('cancel');
        }
    },
    watch: {
        deleteEvent() {
            this.formattedDeleteEvent = {
                ...this.deleteEvent,
                date: this.$moment(this.deleteEvent.start).format('DD/MM/YYYY'),
                duration: this.getDuration(this.deleteEvent.start, this.deleteEvent.end),
                start: this.$moment(this.deleteEvent.start).format('HH:mm'),
                end: this.$moment(this.deleteEvent.end).format('HH:mm'),
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.div-description {
    clear: left;
    clear: right;
}


.description {
    padding-left: 10px;
    width: 100%;
    height: 80px;
    background-color: #F7F7F7;
}


.category-task {
    padding-top: 0px !important;
    height: 37px !important;
    font-size: 13px !important;
    border-radius: 4px;

}

.category-task ::v-deep .v-input__slot:before {
    border-color: transparent !important;
}

.category-task ::v-deep .v-input__slot:after {
    border-color: transparent !important;
}

.task {
    margin-top: 10px !important;
}

.task ::v-deep .v-input__slot {
    background-color: #F7F7F7;
    margin-top: -19px;
}

.task ::v-deep .v-label {
    font-size: 13px;
    padding-left: 10px;
}

.task ::v-deep .v-input__slot:after {
    border-color: transparent !important
}

.task ::v-deep .v-input__slot:before {
    border-color: transparent !important
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
    padding-left: 12px;
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
    width: 100px;
    float: left;
    margin-right: 17px;
}

.date-picker ::v-deep .v-picker__body {
    width: 230px;
    height: 260px;
}

.div-calender-picker {
    height: 55px;
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
    width: 60px;
    float: left;
    margin-left: -10px;
    margin-right: 10px;
}

.start-time {
    width: 60px;
    margin-right: 10px;
    float: left;
}
</style>

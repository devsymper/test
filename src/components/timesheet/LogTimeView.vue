<template>
<v-card>
    <v-card-title class=" pt-1 pb-2 headline lighten-2" primary-title>
        <div class="w-100 pb-1" style="border-bottom: 1px solid lightgrey">
             <SymperAvatar :userId="sapp.endUserInfo.id" :size="25" class="mr-1" style="margin-bottom:-5px"/>
            <span v-if="event.type==1" class="fs-16 fw-430 ">{{$t('timesheet.view_log_time')}} {{event.name}}</span>
             <span v-if="event.type==0" class="fs-16 fw-430 ">{{$t('timesheet.view_plan_time')}} {{event.name}}</span> 
            <!-- <span style="font-size:16px; font-weight:bold" v-else>View plan time</span> -->
            </div>
    </v-card-title>
     <v-card-text style="height: 55px!important ">
        <span class="label pt-2 ">{{$t('timesheet.category_task')}}</span>
       <br/> {{event.category}}
    </v-card-text>
    <v-card-text style="height: 55px!important ">
        <span class="label pt-2 ">{{$t('timesheet.task')}}</span>
       <br/> {{event.name}}
    </v-card-text>
    <v-card-text class="div-calender-picker .d-lg-flex .d-lg-none d-none d-lg-block">
        <div style="height: 32px; margin-top:3px">
            <div class="date ">
                <span class="label pt-2">{{$t('timesheet.date')}}</span>
                {{changeDate(event.start)}}
            </div>
            <div class="duration"> <span class="label pt-2">{{$t('timesheet.duration')}}</span>
                 {{getDuration(event.start,event.end)}}</div>
            <div class='start-time'>
                <span class="label pt-2">{{$t('timesheet.start_time')}}</span>
                {{changeTime(event.start)}}
            </div>
            <div style="width: 60px; float: left"> 
                <span class="label pt-2">{{$t('timesheet.end_time')}}</span>
              {{changeTime(event.end)}}
            </div>
        </div>
    </v-card-text>
    <v-card-text v-if="event.desc" class="div-description" style="max-width:340px">
        <span class="label pt-2">{{$t('timesheet.description')}}</span>
        <br/>  {{event.desc}}
    </v-card-text>
    <v-card-actions class="pb-5">
    </v-card-actions>
</v-card>
</template>
<script>
import SymperAvatar from "./../../components/common/SymperAvatar";
export default {
  created () {
    this.$store.dispatch("app/getAllUsers");
  },
    data: () => ({
    }),
    props: ['event'],
    components:{
        SymperAvatar
    },
    computed:{
        sapp() {
            return this.$store.state.app;
        },
    },
      methods: {
          changeTime(time){
              return this.$moment(time).format('HH:mm')
          },
          changeDate(date){
              return this.$moment(date).format('DD/MM/YYYY')
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
            //co//nsole.log(hour + minutes);
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
            let duration = this.findDuration(startTime,endTime);
            // console.log(duration);
            return this.changeDuration(duration);
        },
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
.v-card ::v-deep .v-card__text {
    padding-bottom: 0px;
    padding-top: 0px;
    margin-bottom: 0px;
    font-size: 13px;
    font-family: Roboto;
    color: black
}
.v-menu__content .v-list {
    padding-top: 10px;
    top: 120px !important;
}
.v-dialog {
    width: 450px;
}
.date {
    width: 100px;
    float: left;
    margin-right: 17px;
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
</style><style>


</style>

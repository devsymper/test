<template>
<v-list style="background-color: #fff; 
width: 360px; color: black; max-height: 580px;" class='fs-13 view_detail_month view-detail'>
    <v-list-item style='margin-top:-20px; margin-bottom:-15px'>
        <v-row>
            <v-col></v-col>
            <v-col>{{detail[0].date}}</v-col>
            <v-col style="margin-right:-75px; width: 42px;color:orange">
                <!-- test -->
                <v-dialog v-model="dialog" width="357" class="log-time-form">
                    <template v-slot:activator="{on}">
                       <button v-on="on" style="color: orange">Submit </button>
                    </template>
                    <SubmitTimesheetForm @cancel="cancel()"></SubmitTimesheetForm>
                </v-dialog>
                <!-- test -->
            </v-col>
        </v-row>
    </v-list-item>
    <v-divider style='width: 340px;margin-left: 10px'></v-divider>
    <div v-for="(event,i) in detail" :key="event.start">
    <v-list-item>
        <v-list-item-content class='pl-8'>
            <v-list-item-title style="margin-top:-10px">
                <span style="font-size: 13px!important">{{formatTime(event.start)}}-{{formatTime(event.end)}}: </span>
              {{event.category_key}}-{{event.name}}
            </v-list-item-title>
        </v-list-item-content>
    </v-list-item>
    <v-list-item class="pb-11" style="height:20px;">
        <v-list-item-content class='pl-8'>
            <v-list-item-title class="description_task">
                <span class="fs-12 pl-7" style="color:grey">
                    {{changeDuration(event.duration)}}: </span>
                <span style="color:grey">{{event.desc?event.desc:$t('timesheet.view_des')}} </span>
            </v-list-item-title>
        </v-list-item-content>
    </v-list-item>
       <v-divider class= "ml-2" style='width: 340px'></v-divider>
    </div>
</v-list>
</template>
<script>

import SubmitTimesheetForm from "./../../components/timesheet/SubmitTimesheetForm";
import dayjs from 'dayjs';

 export default {
//   name: 'ViewDetailMonth',
    props:['detail','date'],
    components  :{
        SubmitTimesheetForm,
    },
  data(){
       return{
           dialog: false,
           event:{},
           detailTest:[],
        };
    },
    created(){
      //  debugger
        // this.detailTest = this.detail.sort((a,b) => a.start - b.start).slice(0, 3);
        // this.detailTest.sort((a,b) => a.start - b.start)
    },
    methods:{
         changeDuration(duration) {
            let hour = duration / 60;
            let minutes = duration % 60;
            if (hour > 0) {
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
        cancel(){
            this.dialog=false;
        },
        formatTime(time){
            return dayjs(time).format('HH:mm');
        },
    }

 }
</script>

<style lang="scss" scoped>
.view_detail_month ::v-deep .v-list-item {
    margin-top: -10px;
    margin-bottom: -10px;
    height: 60px;
}

.view_detail_month ::v-deep .v-list-item__content {
    margin-left: -33px !important;
    width: 100%;
    height: 40px;
    padding-top: 20px;
    font-size: 13px
}

.view_detail_month ::v-deep .v-list-item__title {
    padding-top: 0px;
    margin-top: 0px
}

.description_task ::v-deep .v-list-item__content {
    height: 40px !important;
    padding-bottom: -35px !important;
    color: grey;
}

.view-detail{ overflow: auto;
  overflow: hidden;
    overflow: -moz-scrollbars-none;
    -ms-overflow-style: none;
}
.view-detail ::-webkit-scrollbar { 
  overflow-y: scroll; box-sizing: content-box;
}
</style>

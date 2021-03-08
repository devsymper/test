<template>
 <v-tooltip top>
      <template v-slot:activator="{ on }">
            <div v-on="on" :class="[coloringHeader(monthEvents[date],hoursRequired,'header')]" class="px-2 mx-1" >
                <div class="d-flex justify-space-between ">
                    <div class="fs-12 ">
                        <span :class="[present ? 'present-month' :'']">
                            <span v-if="day==1"> {{day+'/'}} {{month}}</span>
                            <span v-else> {{day}} </span>
                        </span>
                    </div>
                    <div v-on="on" class="fs-12 ">
                        <span v-if="monthEvents[date]">
                            {{getSumDuration(monthEvents[date])}}/{{hoursRequired.substr(0,1)+'h'}}
                        </span>
                    </div>
            <!-- màn hình month - thanh trạng thái -->
                </div>
                <div v-if="monthEvents[date]" class="month-status">
                    <div :style="{'width': getWidthMonth(monthEvents[date])+'%'}" 
                        :class="coloringHeader(monthEvents[date],hoursRequired,'status')" style="height:3px">
                    </div>
                </div>
            </div>
            </template>
            <span>{{getStatusHeader(coloringHeader(monthEvents[date],hoursRequired,'status'))}}</span>
        </v-tooltip>
</template>
<script>
import {sumDuration} from './../canculation/Time';
import {getWidthMonth,getPercentage,getStatusHeader,coloringHeader} from './../canculation/ColorAndWidth';
export default {
  props: {
    monthEvents:{
          type: Object,
          default(){
              return {}
          }
      },
       present:{
          type: Boolean,
          default:false
      },
      day:{
          type: Number,
          default:0
      },
      date:{
          type: String,
          default:''
      },
       month:{
          type: Number,
          default:0
      },
      hoursRequired:{
          type: String,
          default:''
      },
  },
  methods: {
    getSumDuration(event){
    return sumDuration(event)
    },
    getStatusHeader(color){
        return getStatusHeader(color)
    },
    getWidthMonth(event){
        return getWidthMonth(event, this.hoursRequired)
    },
    coloringHeader(date,hoursRequired,type){
        return coloringHeader(date,hoursRequired,type)
    },
  },
    
}
</script>
<style scoped>
.present-month {
    color: orange;
    font-weight: bold;
    font-size: 13px;
}
.dark-sea-green {
    background-color: #8FBC8F
}
.month-status{
    /* background-color:#90EE90;  */
    background-color:lightgrey; 
    width: 100%; 
    height: 3px; 
    margin-top: 1px;
}
.grey-color {
    background-color: #DCDCDC
}
.green-color{
    background-color:green;
}
</style>
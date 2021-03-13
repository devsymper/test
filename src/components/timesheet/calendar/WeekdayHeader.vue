<template>
     <div :class="[coloringHeader(monthEvents[date],hoursRequired,'header')]" class="px-2">
        <v-tooltip top>
            <template v-slot:activator="{on}">
                <div v-on="on" class="pt-2">
                    <div class="d-flex justify-space-between">
                        <!-- Xử lý header -->
                        <span  
                            v-for="(d,i) in dayOfWeek.filter((d,i)=>weekday==i)" 
                            :key="i" 
                            :class="[present ? 'color-orange' :'color-grey']" 
                            class="fs-14">
                            {{$t('timesheet.'+d)}}
                            <span class="ml-1">{{day}}/{{month}}</span>
                        </span>
                        <!--  Xử lý header -->
                        <span class="fs-12" style="color:#484848" v-if="monthEvents[date]">
                            {{getSumDuration(monthEvents[date])}}/{{hoursRequired.substr(0,1)+'h'}}
                        </span> 
                    </div>
                </div>
            </template>
            <span>{{getStatusHeader(coloringHeader(monthEvents[date],hoursRequired,'status'))}}</span>
        </v-tooltip>
        <v-tooltip bottom>
             <template v-slot:activator="{on}">
                <div v-on="on" style="background-color:#CCCCCC; height: 5px" class="w-100">
                    <div :class="coloringHeader(monthEvents[date],hoursRequired,'status')"
                        style=" height:5px"
                        :style="{'width': getWidthMonthStatus(monthEvents[date])+'%'}">
                    </div>
                </div>
            </template>
             <span>{{getPercentage(monthEvents[date])}}</span>
         </v-tooltip> 
    </div>
</template>
<script>
import {sumDuration} from './../canculation/Time';
import {getWidthMonth,getPercentage,getStatusHeader,coloringHeader} from './../canculation/ColorAndWidth';

export default {
  data () {
    return {
        dayOfWeek:['sun','mon','tue','wed','thu','fri','sat']
    }
  },
  methods: {
    getSumDuration(event){
        return sumDuration(event)
    },
    getPercentage(event){
        return getPercentage(event, this.hoursRequired)
    },
    getWidthMonthStatus(event){
        return getWidthMonth(event, this.hoursRequired)
    },
    getStatusHeader(color){
        return getStatusHeader(color)
    },
    coloringHeader(date,hoursRequired,type){
        return coloringHeader(date,hoursRequired,type)
    },
  },
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
          default:0
      },
       month:{
          type: Number,
          default:0
      },
      hoursRequired:{
          type: String,
          default:''
      },
      weekday:{
          type: Number,
          default:0
      },
    
    
    }
}
</script>
<style>
.color-orange{
    color:orange
}
.light-green-color{
    background-color: #e2f9e4
}
.light-red-color{
    background-color:#FFC0CB
}
.light-yellow-color{
    background-color: #FAFAD2
}
.dark-green-color{
    background-color: #e2f9e4
}
.dark-red-color{
    background-color:#DC143C
}
.dark-yellow-color{
    background-color: #F0E68C
}
.grey-color {
    background-color: #DCDCDC
}
</style>
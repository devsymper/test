<template>
   <div :class="[getColorHeader(monthEvents[date],hoursRequired)]" 
        style="height: 25px; margin-left:3px;">
        <v-tooltip top>
            <template v-slot:activator="{ on }">
                
                <div v-on="on" style="margin-left:-13px;" class="fs-12 w-100">
                    <span :class="[present ? 'present-month' :'']">
                        <span v-if="day==1"> {{day+'/'}} {{month}}</span>
                        <span v-else> {{day}} </span>
                    </span>
                    <div style="float:right; margin-right:-55px;" class="fs-12 w-100">
                        <span v-if="monthEvents[date]">
                            {{ changeDuration(monthEvents[date].reduce((acc,d) => +d.duration + acc, 0))}}/{{hoursRequired.trim()+'h'}}
                        </span>
                    </div>
                </div>
            </template>
            <span v-if="getColorHeader(monthEvents[date],hoursRequired)=='grey-color'">New</span>
            <span v-if="getColorHeader(monthEvents[date],hoursRequired)=='light-red-color'">Overload</span>
            <span v-if="getColorHeader(monthEvents[date],hoursRequired)=='light-green-color'">Fullload</span>
            <span v-if="getColorHeader(monthEvents[date],hoursRequired)=='light-yellow-color'">Underload</span>
        </v-tooltip>
            <!-- màn hình month - thanh trạng thái -->
        <div v-if="monthEvents[date]" class="month-status">
            <div :style="{'width': getWidthMonth(monthEvents[date])}" 
                :class="getColorStatus(monthEvents[date],hoursRequired)" style="height: 3px; border:1px">
            </div>
        </div>
    </div>
</template>
<script>
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
      getWidthMonth(event){
          let width = '0%';
          if(event){
              width =((event.reduce((acc, d) => +d.duration + acc, 0) / 60) / this.hoursRequired)* 100
          }
          return width;
      },
      getColorStatus(date,hoursRequired){
            let color = 'grey-color';
            let hour = hoursRequired.trim()
            if(date){
                let totalHour =  date.reduce((acc, d) => +d.duration + acc, 0);
                if(totalHour>hour*60){
                    color = "dark-red-color"
                }else if(totalHour==hour*60){
                    color = "green"
                }
                else{
                    color = "dark-yellow-color"
                }
            }
            return color
        },
      getColorHeader(date,hoursRequired){
            let color = 'grey-color';
            let hour = hoursRequired.trim()
            if(date){
                let totalHour =  date.reduce((acc, d) => +d.duration + acc, 0);
                if(totalHour>hour*60){
                    color = "light-red-color"
                }else if(totalHour==hour*60){
                    color = "light-green-color"
                }
                else{
                    color = "light-yellow-color"
                }
            }
            return color
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
    background-color:#DCDCDC; 
    width: 90%; 
    height: 3px; 
    border:1px;
    margin-top: 1px;
    margin-left: 9px
}
.grey-color {
    background-color: #DCDCDC
}
.green-color{
    background-color:green;
}
</style>
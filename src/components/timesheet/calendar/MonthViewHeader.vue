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
                            {{ changeDuration(monthEvents[date].reduce((acc,d) => +d.duration + acc, 0))}}/{{hoursRequired.trim()+'h'}}
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
      getStatusHeader(color){
          debugger
          let result = 'New';
          switch(color){
            case 'grey-color':
                result = 'New'
                break
            case 'dark-red-color':
                result = 'Overload'
                break
            case 'green':
                result = 'Fullload'
                break
            case 'dark-yellow-color':
                result = 'Underload'
                break
          }
          return this.$t('timesheet.status.'+result)
      },
      getWidthMonth(event){
          let width = '0';
          if(event){
              width =((event.reduce((acc, d) => +d.duration + acc, 0) / 60) / this.hoursRequired)* 100
          }
          if(width>100) width = 100;
          return width;
      },
      coloringHeader(date,hoursRequired,type){
            let color = 'grey-color';
            let hour = hoursRequired.trim()
            if(date){
                let totalHour =  date.reduce((acc, d) => +d.duration + acc, 0);
                if(totalHour>hour*60){
                    color = type=='status'?"dark-red-color":"light-red-color"
                }else if(totalHour==hour*60){
                    color =  type=="status"?"green":"dark-sea-green"
                }
                else{
                    color = type=="status"?"dark-yellow-color":"light-yellow-color"
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
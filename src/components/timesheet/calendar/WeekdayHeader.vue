<template>
     <div :class="[getColorHeader(monthEvents[date],hoursRequired)]">
        <div class="px-3 pt-2">
            <div class="d-flex justify-space-between">
                <!-- Xử lý header -->
                <span  
                    v-for="(d,i) in dayOfWeek.filter((d,i)=>weekday==i)" 
                    :key="i" 
                    :class="[present ? 'color-orange' :'color-grey']" 
                    class="fs-14">
                    <span >{{$t('timesheet.'+d)}}</span>
                    <span class="ml-2">{{day}}/{{month}}</span>
                </span>
                <!--  Xử lý header -->
                <span v-if="monthEvents[date]">
                    <span class="fs-12" style="color:#484848">
                        {{changeDuration(monthEvents[date].reduce((acc, d) => +d.duration + acc, 0))}}/{{hoursRequired.substr(0,1)+'h'}}</span> 
                </span>
            </div>
        </div>
        <div style="background-color:#CCCCCC; width: 90%; height: 5px; border:1px; margin-top: 9px; margin: 0 auto">
            <div :class="[monthEvents[date]?'green' :'grey-color']" style="overflow:hidden; height: 5px; border:1px; margin-top: 9px;" 
            :style="{'width': monthEvents[date]
            ? ((((monthEvents[date].reduce((acc, d) => +d.duration + acc, 0) / 60) / hoursRequired) * 100))>100?100+ '%':(((monthEvents[date].reduce((acc, d) => +d.duration + acc, 0) / 60) / hoursRequired) * 100) + '%'
            : '0%'}">
            </div>
        </div>
    </div>
</template>
<script>
export default {
  data () {
    return {
        dayOfWeek:['sun','mon','tue','wed','thu','fri','sat']
    }
  },
  methods: {
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
<style scoped>
.light-green-color{
    background-color: #e2f9e4
}
.light-red-color{
    background-color:#FFC0CB
}
.light-yellow-color{
background-color: #FAFAD2
}
.grey-color {
    background-color: #DCDCDC
}
</style>
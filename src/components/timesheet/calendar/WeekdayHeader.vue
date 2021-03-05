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
                            {{changeDuration(monthEvents[date].reduce((acc, d) => +d.duration + acc, 0))}}/{{hoursRequired.substr(0,1)+'h'}}
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
                        :style="{'width': getWidthMonth(monthEvents[date])+'%'}">
                    </div>
                </div>
            </template>
             <span>{{getPercentage(monthEvents[date])}}</span>
         </v-tooltip> 
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
      getPercentage(event){
            let width = '0';
          if(event){
              width =((event.reduce((acc, d) => +d.duration + acc, 0) / 60) / this.hoursRequired)* 100
          }
          let percent = (Math.round(width * 100)/100).toFixed(1);
          if(percent == '0.0') percent = 0
          return percent+'%'
      },
      getWidthMonth(event){
            let width = '0';
          if(event){
              width =((event.reduce((acc, d) => +d.duration + acc, 0) / 60) / this.hoursRequired)* 100
          }
          if(width>100) width = 100;
          return width;
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
     getStatusHeader(color){
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
    coloringHeader(date,hoursRequired,type){
            let color = 'grey-color';
            let hour = hoursRequired.trim()
            if(date){
                let totalHour =  date.reduce((acc, d) => +d.duration + acc, 0);
                if(totalHour>hour*60){
                    color = type=='status'?"dark-red-color":"light-red-color"
                }else if(totalHour==hour*60){
                    color =  type=="status"?"green":"light-green-color"
                }
                else{
                    color = type=="status"?"dark-yellow-color":"light-yellow-color"
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
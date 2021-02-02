<template>
    <div style="margin-left:-13px;" class="fs-12 w-100">
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
</style>
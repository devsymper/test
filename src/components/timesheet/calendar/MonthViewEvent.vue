<template>
<div>
     <div v-if="monthEvents[date]" class= "fs-12 px-1 mt-1"  >
        <!-- <v-menu   :close-on-content-click="false" v-model="menu">
            <template v-slot:activator="{on}"> -->
                <div v-for="event in monthEvents[date].filter((e,i)=>i<countLog)" 
                    :key="event.id" 
                    :style="{background:event.color}"
                    class=" mb-1 text-ellipsis" 
                    style='height: 10%; overflow: hidden!important'>
                    <i  v-if="event.type==1" class="mdi mdi-check color-green"></i>
                    <i  v-else class="mdi mdi-calendar color-blue"></i>
                    {{event.category_key}} -{{countLog}}
                    {{event.name}}
                </div>
        <!-- </template>
            <ViewDetailMonth @close="menu=false" :detail="monthEvents[date].sort((a,b) => a.start - b.start)" :hour="hoursRequired" />
        </v-menu> -->
    </div>
    <div class="ml-3 fs-13 new-log" @click="start(date)">[<v-icon style="font-size:11px"> mdi-plus</v-icon> New log]</div>
    </div>
</template>
<script>
import ViewDetailMonth from "./../ViewDetailMonth";

export default {
  created () {
    //   this.countLogMonthView()
  },
  data () {
    return {
        menu:false,
        countLog: 3
    }
  },
    name: "MonthViewEvent",
    components: {
        ViewDetailMonth
    },
    props: {
        hoursRequired:{
          type: String,
          default:''
        },
        monthEvents:{
            type: Object,
            default(){
                return {}
            }
        },
        date:{
            type: String,
            default:''
        },
    },
    mounted(){
        this.countLogMonthView()
    },
    methods: {
        start(date){
            this.$emit('showLog',date);   
        },
        countLogMonthView(){
            if($(".v-calendar-weekly__day").length>0){
                 let dayH = $(".v-calendar-weekly__day")[0].clientHeight;
                 console.log(dayH);
                // let dayHeaderH =  $(".v-calendar-weekly__day-label")[0].clientHeight;
                let marginYpHeaderH = 8;//
                let log =  20;
                let countLog = parseInt((dayH-20)/log);
                countLog = countLog-1;
                this.countLog = countLog;
                console.log(countLog);
            }
        }
    },
        
}
</script>
<style>
.new-log{
   opacity: 0;
}
.new-log:hover{
    opacity: 1;
    color:grey
}
/* #F0FFF0 */
.honey-drew{
    background-color: pink
}
</style>
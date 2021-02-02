<template>
<div>
     <div class= "fs-12 px-1 mt-1">
        <v-menu v-if="monthEvents[date]" offset-y>
            <template v-slot:activator="{on}">
                <template v-if="monthEvents[date]">
                    <div v-for="event in monthEvents[date]" 
                        :key="event.start" 
                        v-on="on" 
                        class="honey-drew mb-1 text-ellipsis" 
                        style='height: 10%; overflow: hidden!important'>
                        <i class="mdi mdi-check color-green"></i>
                        {{event.category_key}} -
                        {{event.name}}
                    </div>
                </template>
            </template>
            <ViewDetailMonth :detail="monthEvents[date].sort((a,b) => a.start - b.start)" :hour="hoursRequired" />
        </v-menu>
    </div>
    <div class="ml-3 fs-13 new-log" @click="start(date)">[<v-icon style="font-size:11px"> mdi-plus</v-icon> New log]</div>
    </div>
</template>
<script>
import ViewDetailMonth from "./../ViewDetailMonth";

export default {
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
    methods: {
        start(date){
            this.$emit('showLog',date);   
        },
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
.honey-drew{
    background-color:#F0FFF0
}
</style>
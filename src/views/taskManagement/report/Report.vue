<template>
    <Gantt />
</template>
<script>
import Gantt from '@/components/taskManagement/chart/Gantt.vue'

export default {
    name: "Report",
    components:{
        Gantt
    },
    methods:{
        
    },
    activated(){
        //this.toggleMainContentLoader(false);
    }
    
};
</script>

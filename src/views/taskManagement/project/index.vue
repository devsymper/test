<template>
    <div class="w-100 h-100">
        <list-project />
    </div>
</template>

<script>
import ListProject from "@/components/taskManagement/project/List";
export default {
    components:{
        'list-project':ListProject
    },
    name:"project",
    computed:{
        sTaskManagement() {
            return this.$store.state.taskManagement;
        }
    },
    created(){
        
        this.$store.dispatch("taskManagement/getAllCategory");
        this.$store.dispatch("taskManagement/getAllProject");
    }
}
</script>

<style>

</style>
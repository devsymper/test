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
        if (!this.$store.state.taskManagement.allCategory || this.$store.state.taskManagement.allCategory.length == 0) {
            this.$store.dispatch("taskManagement/getAllCategory");
        }
        if (!this.$store.state.taskManagement.allProject || this.$store.state.taskManagement.allProject.length == 0) {
            this.$store.dispatch("taskManagement/getAllProject");
        }

    }
}
</script>

<style>

</style>
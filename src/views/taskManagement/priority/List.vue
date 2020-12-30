<template>
    <listPriority
    />
    
</template>

<script>

import listPriority from "../../../components/taskManagement/priority/List";
export default {
    components:{
        listPriority
    },
    created(){
        if (!this.$store.state.taskManagement.allPriority || this.$store.state.taskManagement.allPriority == 0) {
            this.$store.dispatch("taskManagement/getAllPriority");
        }
    }
}
</script>

<style>

</style>
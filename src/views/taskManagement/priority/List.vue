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
        this.$store.dispatch("taskManagement/getAllPriority");
    }
}
</script>

<style>

</style>
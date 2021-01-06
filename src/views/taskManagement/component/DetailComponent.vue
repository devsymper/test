<template>
    <detail-component
        :infoComponent="infoComponent"
    />

</template>

<script>
import detailComponent from '@/components/taskManagement/component/DetailComponent.vue';
export default {
    components: { detailComponent },
    computed:{
        infoComponent(){
            return this.$store.state.taskManagement.infoComponentCurrent;
        }
    },
    created(){
        if (!this.$store.state.taskManagement.allStatus || this.$store.state.taskManagement.allStatus.length == 0) {
            this.$store.dispatch("taskManagement/getAllStatus");
        }
    }
   
}
</script>

<style>

</style>
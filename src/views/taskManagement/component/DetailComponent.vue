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
   
}
</script>

<style>

</style>
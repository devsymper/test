<template>
    <detail-version
        :infoVersion="infoVersion"
    />
</template>

<script>
import detailVersion from '../../../components/taskManagement/version/DetailVersion.vue';
export default {
    components: { detailVersion },
    computed:{
        infoVersion(){
            return this.$store.state.taskManagement.infoVersionCurrent;
        }
    },
   

}
</script>

<style>

</style>
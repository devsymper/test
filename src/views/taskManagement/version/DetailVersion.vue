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
    activated(){
        let projectId=this.$route.params.id;
        let breadcrumbs = [
                {
                    text: 'Versions',
                    disabled: false,
                    to: "/task-management/projects/"+projectId+"/versions",
                },
                {
                    text: 'Chi tết version',
                    disabled: true,
                    to: '',
                }
               
            ];
        this.$store.commit("taskManagement/addToTaskManagementStore",{key:"headerBreadcrumbs",value:breadcrumbs})
    }

   

}
</script>

<style>

</style>
<template>
    <show-log-time 
    
    />
</template>

<script>
import ShowLogTime from '../../timesheet/ShowLogTime.vue'
export default {
    components: { ShowLogTime },
    activated(){
        let projectId=this.$route.params.id;
        let breadcrumbs = [
                {
                    text: 'TimeSheet',
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
<template>
    <detailProject 
        v-if="Object.keys(sCurrentProject).length>0"
        :infoProject="sCurrentProject"
    />

</template>

<script>
import detailProject from "@/components/taskManagement/project/Detail";

export default {
    components:{
        detailProject
    },
    data(){
        return{
            infoProject:{}
        }
    },
    computed:{
         sCurrentProject(){
            return this.$store.state.taskManagement.currentProject
        },
    },
    created(){
        this.$store.commit("taskManagement/addToTaskManagementStore",{key:'currentPage',value:'projectSetting'});
    },
    activated(){
        let breadcrumbs = [
                {
                    text: 'Project Setting',
                    disabled: true,
                    to: '',
                },
                {
                    text: 'Detail',
                    disabled: true,
                    to: '',
                },
            ];
        this.$store.commit("taskManagement/addToTaskManagementStore",{key:"headerBreadcrumbs",value:breadcrumbs})
    }

}
</script>

<style>

</style>
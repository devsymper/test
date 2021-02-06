<template>
<div class="symper-edit-dashboard w-100">
    <DashboardEditor
        action="view"
        :idObject="idObject"
    />
</div>
</template>

<script>
import DashboardEditor from "@/components/dashboard/DashboardEditor.vue";
export default {
    components: {
        DashboardEditor
    },
    computed: {
        idObject(){
            if(!this.idDashboard){
                return this.$route.params.id;
            }else{
                return this.idDashboard
            }
        }
    },
    props: {
        idDashboard: {
            default: 0
        }
    }
}
</script>

<style>

</style>
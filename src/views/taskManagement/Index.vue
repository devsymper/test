<template>
    <div class="w-100 h-100">
        HEllo
    </div>
</template>

<script>
export default {
    name:"TaskManagement",
    // computed:{
    //     sTaskManagement() {
    //         return this.$store.state.taskManagement;
    //     }
    // }, 
    created(){
        this.$store.dispatch("taskManagement/getAllCategory");
        this.$store.dispatch("taskManagement/getAllProject");
    },
    activated(){
        let breadcrumbs = [
                {
                text: 'Dashboard',
                disabled: false,
                href: 'breadcrumbs_dashboard',
                }
            ]
        this.$store.commit("app/addToAppStore",{key:"headerBreadcrumbs",value:breadcrumbs})
    },
}
</script>

<style>

</style>
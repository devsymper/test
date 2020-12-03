<template>
    <div id="task-management-wrapper" class="w-100 h-100">
        <Sidebar  @after-toggle-sidebar="afterToggleSideBar"/>
         <div :style="{'width':(isExpand) ? 'calc(100% - 210px)' : 'calc(100%)'}" class="h-100">
            <Header />
            <router-view name="TaskManagement" style="padding:0 8px"/>
        </div>
    </div>
   
</template>

<script>
import Sidebar from './layout/Sidebar'
import Header from './layout/Header'
export default {
  components: { Sidebar,Header },
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
        this.$store.commit("taskManagement/addToTaskManagementStore",{key:"headerBreadcrumbs",value:breadcrumbs})
    },
    methods:{
        afterToggleSideBar(vl){
            this.isExpand = !vl
        }
    },
    data(){
        return {
            isExpand:false,

        }
    }
}
</script>

<style scoped>
    #task-management-wrapper{
        display: flex;
        position: relative;
    }
</style>

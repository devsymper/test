<template>
    <div id="task-management-wrapper" class="w-100 h-100">
        <Sidebar  @after-toggle-sidebar="afterToggleSideBar"/>
         <div :style="{'width':(isExpand) ? 'calc(100% - 210px)' : 'calc(100%)'}" class="h-100">
            <Header />
            <div style="padding:0 8px;height:calc(100% - 45px)">
                <router-view :key="routerKey" name="TaskManagement" />
            </div>
        </div>
    </div>
   
</template>

<script>
import Sidebar from './layout/Sidebar'
import Header from './layout/Header'
export default {
  components: { Sidebar,Header },
    name:"TaskManagement",
    activated(){
        // let breadcrumbs = [
        //         {
        //         text: 'Dashboard',
        //         disabled: false,
        //         href: 'breadcrumbs_dashboard',
        //         }
        //     ]
        // this.$store.commit("taskManagement/addToTaskManagementStore",{key:"headerBreadcrumbs",value:breadcrumbs})
    },
    methods:{
        afterToggleSideBar(vl){
            this.isExpand = !vl;
            this.$store.commit("taskManagement/addToTaskManagementStore",{key:"hideSidebar",value:vl})
        }
    },
    watch:{
        '$route' (to, from){
            this.routerKey = Date.now();
            // this.routerKey = to.fullPath;
        }
    },
    data(){
        return {
            isExpand:false,
            routerKey:Date.now()

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

<template>
    <list-component
        :listComponent="listComponent"
        @add-component="addComponent"
    />
  
</template>

<script>
import ListComponent from '../../../components/taskManagement/component/ListComponent.vue';
import { taskManagementApi } from "@/api/taskManagement.js";

export default {
    components: { 
        ListComponent,
    },
    name:"components",
    data(){
        return{
            listComponent:[],
        }
    },
    methods:{
        addComponent(){
            this.getListComponent();
        },
        async getListComponent(){
            let self=this;
            let id=this.$route.params.id;
            if (id) {
                let listComponent =await taskManagementApi.getListComponent(id);
                if (listComponent.status==200 && listComponent.data) {
                    self.listComponent=listComponent.data.listObject;
                    self.$store.commit("taskManagement/setListComponent", listComponent.data.listObject);
                }
              
            }
        },
    },
    async created(){
        await this.getListComponent();
    },
    activated(){
        let projectId=this.$route.params.id;
        let breadcrumbs = [
                
                {
                    text: 'Components',
                    disabled: true,
                }
               
            ];
        this.$store.commit("taskManagement/addToTaskManagementStore",{key:"headerBreadcrumbs",value:breadcrumbs})
    }

}
</script>

<style>

</style>
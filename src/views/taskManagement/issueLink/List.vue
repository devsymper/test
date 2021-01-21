<template>
    <ListLink
        :listLink="listLink"
        @add-link="addLink"
    />
  
</template>

<script>
import ListLink from '@/components/taskManagement/issueLink/ListLink.vue';
import { taskManagementApi } from "@/api/taskManagement.js";

export default {
    components: { 
        ListLink,
    },
    name:"components",
    data(){
        return{
            listLink:[],
        }
    },
    methods:{
        addLink(){
            this.getListLink();
        },
        async getListLink(){
            let self=this;
            let id=this.$route.params.id;
            if (id) {
                let listLink =await taskManagementApi.getListComponent(id);
                if (listLink.status==200 && listLink.data) {
                    self.listLink=listLink.data.listObject;
                    self.$store.commit("taskManagement/setListComponent", listLink.data.listObject);
                }
              
            }
        },
    },
    async created(){
        await this.getListLink();
    }

}
</script>

<style>

</style>
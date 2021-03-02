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
            let listLink = await taskManagementApi.getListIssueLink();
            if (listLink.status==200 && listLink.data) {
                self.listLink = listLink.data;
                self.$store.commit("taskManagement/setListIssueLink", listLink.data);
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
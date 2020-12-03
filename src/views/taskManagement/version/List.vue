<template>
    <list-version
        :listVersion="listVersion"
        @add-version="addVersion"
    />
</template>

<script>
import listVersion from '../../../components/taskManagement/version/ListVersion.vue';
import { taskManagementApi } from "@/api/taskManagement.js";
export default {
    name:"versions",
    components: { 
        listVersion,
    },
     data(){
        return{
            listVersion:[],
        }
    },
    methods:{
        addVersion(){
            this.getListVersion();
        },
        async getListVersion(){
            let self=this;
            let id=this.$route.params.id;
            if (id) {
                let listVersion =await taskManagementApi.getListVersion(id);
                if (listVersion.status==200 && listVersion.data) {
                    self.listVersion=listVersion.data.listObject;
                    self.$store.commit("taskManagement/setListVersion", listVersion.data.listObject);
                }
              
            }
        },
    },
    async created(){
        await this.getListVersion();
    }

}
</script>

<style>

</style>
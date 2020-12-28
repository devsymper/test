<template>
    <index 
    :recentPojects="recentPojects"
    :recentIssue="recentIssue"
    />
</template>

<script>
import index from '@/components/taskManagement/home/Index.vue';
export default {
    components: { index },
    computed:{
        recentPojects(){
            return this.$store.state.taskManagement.listProjectRecentAccess;
        },
        recentIssue(){
            return this.$store.state.taskManagement.listIssueRecentAccess;
        },
    },
    data(){
        return{
            
        }
    },
    methods:{
        async getData(){
            await this.$store.dispatch("taskManagement/getAllCategory");
            await this.$store.dispatch("taskManagement/getLogProjectAccess",this.$store.state.app.endUserInfo.id);
            await this.$store.dispatch("taskManagement/getLogIssueRecentAccess",this.$store.state.app.endUserInfo.id);
            this.$store.dispatch("taskManagement/getAllDocumentIdsInIssueType");

        }
    },  
    created(){
        this.getData();
    }

}
</script>

<style>

</style>
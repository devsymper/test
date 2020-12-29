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
            if (!this.$store.state.taskManagement.allIssueType || this.$store.state.taskManagement.allIssueType == 0) {
                await this.$store.dispatch("taskManagement/getAllIssueType");
            }
            if (!this.$store.state.taskManagement.allPriority || this.$store.state.taskManagement.allPriority == 0) {
                await this.$store.dispatch("taskManagement/getAllPriority");
            }
            this.$store.dispatch("taskManagement/getAllDocumentIdsInIssueType");
            this.$store.dispatch("taskManagement/getAllStatus");

        }
    },  
    created(){
        this.getData();
    }

}
</script>

<style>

</style>
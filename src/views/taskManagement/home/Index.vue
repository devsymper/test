<template>
    <div class="wraper-loader">
        <preloader ref="preLoaderView"/>
        <Index 
        :recentPojects="recentPojects"
        :recentIssue="recentIssue"
        />
    </div>
</template>

<script>
import Index from '@/components/taskManagement/home/Index.vue';
import Preloader from '../../../components/common/Preloader.vue';
export default {
    components: { Index,Preloader },
    computed:{
        recentPojects(){
            return this.$store.state.taskManagement.listProjectRecentAccess;
        },
        recentIssue(){
            return this.$store.state.taskManagement.listIssueRecentAccess;
        },
        staskManagement(){
            return this.$store.state.taskManagement
        },
        endUserInfo(){
            return this.$store.state.app.endUserInfo
        }
    },
    data(){
        return{
            
        }
    },
    methods:{
        async getData(){
            await this.$store.dispatch("taskManagement/getLogProjectAccess",this.endUserInfo.id);
            await this.$store.dispatch("taskManagement/getLogIssueRecentAccess",this.endUserInfo.id);
            if (!this.staskManagement.allPriority || this.staskManagement.allPriority == 0) {
                await this.$store.dispatch("taskManagement/getAllPriority");
            }
            await this.$store.dispatch("taskManagement/getAllStatus");
            this.$refs.preLoaderView.hide();

        }
    },  
    created(){
        this.getData();
    }

}
</script>

<style scoped>
    .wraper-loader{
        position: relative;
        width: inherit;
        height: inherit;
    }
</style>
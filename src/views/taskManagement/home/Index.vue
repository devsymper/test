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
import HomeWorker from 'worker-loader!@/worker/taskManagement/home/Index.Worker.js';

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
            homeWorker: null,
        }
    },
    methods:{
        getData(){
            this.homeWorker.postMessage({
                action:'getLogProjectAccess',
                data:this.$store.state.app.endUserInfo.id
            });

            this.homeWorker.postMessage({
                action:'getLogIssueRecentAccess',
                data:this.$store.state.app.endUserInfo.id
            });

        },
        getAllPriority(){
            if (!this.staskManagement.allPriority || this.staskManagement.allPriority == 0) {
                this.homeWorker.postMessage({
                    action:'getAllPriority',
                    data:null
                });
            }
        },
        getAllProject(){
            if (!this.$store.state.taskManagement.allProject || this.$store.state.taskManagement.allProject.length == 0) {
                this.homeWorker.postMessage({
                    action:'getAllProject',
                    data:null
                });
            }
        },
        getAllIssueType(){
            if (!this.$store.state.taskManagement.allIssueType || this.$store.state.taskManagement.allIssueType.length == 0) {
                this.homeWorker.postMessage({
                    action:'getAllIssueType',
                    data:null
                });
            }
        },
        getAllStatus(){
            if (!this.$store.state.taskManagement.allStatus || this.$store.state.taskManagement.allStatus.length == 0) {
                this.homeWorker.postMessage({
                    action:'getAllStatus',
                    data:null
                });
            }
        },

    },  
    created(){
      	this.homeWorker = new HomeWorker();
        this.getAllProject();
        let self = this;
        this.homeWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'getLogProjectAccess':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit('taskManagement/setListProjectRecentAccess', res.data);
                        self.$refs.preLoaderView.hide();
                    }
                    break;
                case 'getLogIssueRecentAccess':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit('taskManagement/setLogIssueRecentAccess', res.data);
                        self.$refs.preLoaderView.hide();
                    }
                    break;
                case 'getAllPriority':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit('taskManagement/setAllPriority', res.data.listObject);
                    }
                    self.getData();
                    break;
                case 'getAllProject':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit('taskManagement/setAllProject', res.data.listObject);
                    }
                    self.getAllIssueType();
                    break;
                case 'getAllIssueType':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit('taskManagement/setAllIssueType', res.data.listObject);
                    }
                    self.getAllStatus();
                    break;
                case 'getAllStatus':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit('taskManagement/setAllStatus', res.data.listObject);
                    }
                    self.getAllPriority();
                    break
                default:
                    break;
            }
        });
    },


}
</script>

<style scoped>
    .wraper-loader{
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>
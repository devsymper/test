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
           // debugger
            // await this.$store.dispatch("taskManagement/getLogIssueRecentAccess",this.endUserInfo.id);
            // if (!this.staskManagement.allPriority || this.staskManagement.allPriority == 0) {
            //     await this.$store.dispatch("taskManagement/getAllPriority");
            // }
            // if (!this.$store.state.taskManagement.allProject || this.$store.state.taskManagement.allProject.length == 0) {
            //     await this.$store.dispatch("taskManagement/getAllProject");
            // }
            // //get all issue type để show icon trong list task in home
            // if (!this.$store.state.taskManagement.allIssueType || this.$store.state.taskManagement.allIssueType == 0) {
            //     this.$store.dispatch("taskManagement/getAllIssueType");
            // }
            // if (!this.$store.state.taskManagement.allStatus || this.$store.state.taskManagement.allStatus == 0) {
            //     await this.$store.dispatch("taskManagement/getAllStatus");
            // }
            //this.$refs.preLoaderView.hide();
        },
        getLogProjectAccess(){
            this.homeWorker.postMessage({
                action:'getLogProjectAccess',
                data:this.$store.state.app.endUserInfo.id
            });
        },
        getLogIssueRecentAccess(){
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
        //this.getData();
        // this.getLogProjectAccess();
        // this.getLogIssueRecentAccess();
        this.getAllPriority();
        // this.getAllProject();
        setTimeout(() => {
            this.$refs.preLoaderView.hide();
        }, 200);
        // this.getAllIssueType();
        // this.getAllStatus();
        let self = this;
        this.homeWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'getLogProjectAccess':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit('taskManagement/setListProjectRecentAccess', res.data);
                    }
                    break;
                case 'getLogIssueRecentAccess':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit('taskManagement/setLogIssueRecentAccess', res.data);
                    }
                    break;
                case 'getAllPriority':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit('taskManagement/setAllPriority', res.data.listObject);
                    }
                    break;
                case 'getAllProject':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit('taskManagement/setAllProject', res.data.listObject);
                    }
                    break;
                case 'getAllIssueType':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit('taskManagement/setAllIssueType', res.data.listObject);
                    }
                    break;
                case 'getAllStatus':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit('taskManagement/setAllStatus', res.data.listObject);
                    }
                    break
                default:
                    break;
            }
        });
    },
    mounted(){
      
    }

}
</script>

<style scoped>
    .wraper-loader{
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>
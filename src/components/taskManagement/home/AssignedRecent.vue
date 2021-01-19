<template>
    <div class="w-100 h-100">
        <common-list-issue
            :listItem="listItem"
        />
    </div>
</template>

<script>
import CommonListIssue from './commonListIssue.vue';
import HomeWorker from 'worker-loader!@/worker/taskManagement/home/Index.Worker.js';

export default {
    components: {
        CommonListIssue
    },
    props:{
        documentIds:{
            type: Array,
            default(){
                return []
            }
        },
    },
    computed:{   
        sTaskManagement() {
            return this.$store.state.taskManagement;
        },
    },
    watch:{
    },
    methods:{
        getListAssigneeIssueGroupDateTime(){
            let data = {};
            data.listIssue = this.$store.state.taskManagement.listIssueAssignRecent;
            data.allPriority = this.$store.state.taskManagement.allPriority;
            data.listIssueType = this.$store.state.taskManagement.allIssueType;
            data.allStatus = this.$store.state.taskManagement.allStatus;
            if (this.homeWorker) {
                this.homeWorker.postMessage({
                    action:'getListAssigneeIssueGroupDateTime',
                    data:data
                });    
            }
            
        },
        getData(){
            let data = {};
            data.documentIds=this.documentIds;
            data.userId=this.$store.state.app.endUserInfo.id;
            if (this.homeWorker) {
                this.homeWorker.postMessage({
                    action:'getDataAssigneeIssue',
                    data:data
                });
            }

        },
    },
    data(){
        return{
            listItem:[],
            homeWorker:null
        }
    },
    created(){
        let self = this;
        this.homeWorker = new HomeWorker();
        this.getData();

        this.homeWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'getDataAssigneeIssue':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit('taskManagement/setIssueAssignRecent', res.data.listObject);
                        self.getListAssigneeIssueGroupDateTime();
                    }
                    break;
                case 'getListAssigneeIssueGroupDateTime':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.listItem = res;
                    }
                    break;
                    
                default:
                    break;
            }
        });
    }
}
</script>

<style>

</style>
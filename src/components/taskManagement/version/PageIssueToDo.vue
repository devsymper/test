<template>
    <common-table-list-issue
        :listIssueProps="listIssueToDoInVersion"

    />
</template>

<script>
import CommonTableListIssue from './CommonTableListIssue.vue';
import { taskManagementApi } from "@/api/taskManagement.js";
import VersionWorker from 'worker-loader!@/worker/taskManagement/version/Version.Worker.js';

export default {
    components: { 
        CommonTableListIssue, 
    },
    computed:{
        listDocumentIdsInProject(){
            return this.$store.state.taskManagement.listDocumentIdsInProject[this.projectId];
        }
    },
    watch:{
        listDocumentIdsInProject:{
            deep:true,
            immediate:true,
            handler(newVl){
                if (newVl){
                    this.getData();
                }
            }
        },
        listIssue:{
            deep:true,
            immediate:true,
            handler(newVl){
                if (newVl.length > 0){
                    this.getMoreInfoListIssue();
                }
            }
        },
    },
    data(){
        let self = this;
        return{
            listIssueToDoInVersion:[],
            versionWorker:null,
            listIssue:[],
            filter:{
                ids: null,
                filter:[
                    {
                        column : "tmg_version_id",
                        operation : "and",
                        conditions : [
                            {
                                name : "in",
                                value : [self.$route.params.idVersion],
                            }
                        ],
                    },
                    {
                        column : "tmg_status_category_id",
                        operation : "and",
                        conditions : [
                            {
                                name : "in",
                                value : ["5fe314fb-47f0-99a5-d682-7ae20ea2ab8b"],
                            }
                        ],
                    },
                ],
                page : 1,
                pageSize: 50,
                distinct: true
            }
        }
    },
    methods:{
        getMoreInfoListIssue(){
            let data = {};
            data.issues = this.listIssue;
            data.allPriority = this.$store.state.taskManagement.allPriority;
            data.listIssueType = this.$store.state.taskManagement.listIssueTypeInProjects[this.projectId];
            data.allStatus = this.$store.state.taskManagement.allStatus;

            this.versionWorker.postMessage({
                action:'getMoreInfoListIssue',
                data:data
            });
        },
        getData(){
            let documentIds = this.$store.state.taskManagement.listDocumentIdsInProject[this.projectId];
            if (documentIds && documentIds.length > 0) {
                this.filter.ids =JSON.stringify(documentIds);
                this.versionWorker.postMessage({
                    action:'getIssueVersion',
                    data:this.filter
                });
            }
        },
        getListDocumentIdsInProject(){
            this.versionWorker.postMessage({
                action:'getListDocumentIdsInProject',
                data:this.projectId
            });
        },
        getListIssueTypeInProject(){
            this.versionWorker.postMessage({
                action:'getListIssueTypeInProject',
                data:this.projectId
            });
        },
        getAllStatus(){
            this.versionWorker.postMessage({
                action:'getAllStatus',
                data: null
            });
        }
    },
    created(){
        let self = this;
        this.projectId=this.$route.params.id;
        this.versionWorker = new VersionWorker();
        this.versionWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'getListDocumentIdsInProject':
                    self.$store.commit('taskManagement/setListDocumentIdsInProject',data.dataAfter);
                    self.getData();
                    break;
                case 'getListIssueTypeInProject':
                    self.$store.commit('taskManagement/setListIssueTypeInProjects',data.dataAfter);
                    self.getData();
                    break;
                case 'getAllStatus':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.$store.commit('taskManagement/setAllStatus',res.data.listObject);
                        self.getData();
                    } 
                    break;
                case 'getIssueVersion':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.listIssue = res.data.listObject;
                    } 
                    break;
                case 'getMoreInfoListIssue':
                    if (data.dataAfter) {
                        let res = data.dataAfter;
                        self.listIssueToDoInVersion = res;
                    } 
                    break;
                default:
                    break;
            }
        });
      
        if (!this.$store.state.taskManagement.listDocumentIdsInProject[this.projectId] || this.$store.state.taskManagement.listDocumentIdsInProject[this.projectId].length == 0) {
            self.getListDocumentIdsInProject();
        }
        if (!this.$store.state.taskManagement.listIssueTypeInProjects[this.projectId] || this.$store.state.taskManagement.listIssueTypeInProjects[this.projectId].length == 0) {
            self.getListIssueTypeInProject();
        }
        if (!this.$store.state.taskManagement.allStatus || this.$store.state.taskManagement.allStatus.length == 0) {
            self.getAllStatus();
        }
        self.getData();
    }
}
</script>

<style>

</style>
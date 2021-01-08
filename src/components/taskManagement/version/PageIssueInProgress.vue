<template>
    <common-table-list-issue
        :listIssueProps="listIssueInProgressInVersion"

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
        listIssueInProgressInVersion(){
            let issues = this.listIssue;
            let allPriority = this.$store.state.taskManagement.allPriority;
            let listIssueType = this.$store.state.taskManagement.listIssueTypeInProjects[this.projectId];
            let allStatus = this.$store.state.taskManagement.allStatus;
            for (let i = 0; i < issues.length; i++) {
                    // get info priority
                if (issues[i].tmg_priority_id) { 
                    let priority = allPriority.find(ele => ele.id == issues[i].tmg_priority_id);
                    if (priority) {
                        let infoPriority = {};
                        infoPriority.id = priority.id;
                        infoPriority.name = priority.name;
                        infoPriority.color = priority.color;
                        infoPriority.icon = priority.icon;

                        issues[i]["infoPriority"] = infoPriority;
                    }
                }    
                // get info issue type
                if (issues[i].tmg_issue_type) { 
                    let issueType = listIssueType.find(ele => ele.id == issues[i].tmg_issue_type);
                    if (issueType) {
                        let infoIssueType = {};
                        infoIssueType.id = issueType.id;
                        infoIssueType.name = issueType.name;
                        infoIssueType.icon = issueType.icon;

                        issues[i]["infoIssueType"] = infoIssueType;
                    }
                }    
                // get staus issue
                if (issues[i].tmg_status_id) { 
                    let status = allStatus.find(ele => ele.id == issues[i].tmg_status_id);
                    if (status) {
                        let infoStatus = {};
                        infoStatus.id = status.id;
                        infoStatus.name = status.name;
                        infoStatus.color = status.color;
                        issues[i]["infoStatus"] = infoStatus;
                    }
                } 
            }

            return issues
        },
    },
    data(){
        let self = this;
        return{
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
                                value : ["5fe31524-23fb-9f0f-b005-36450ea2ab8b"],
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
        getData(){
            let documentIds = this.$store.state.taskManagement.listDocumentIdsInProject[this.projectId];
            if (documentIds && documentIds.length > 0) {
                this.filter.ids =JSON.stringify(documentIds);
                taskManagementApi.getIssueFilter(this.filter)
                .then(res => {
                    if (res.status == 200) {
                        this.listIssue = res.data.listObject;
                    }else{
                        this.$snotifyError("", "Can not get list issue inprogress in version!");
                    }
                });
            }
        
        },
    },
    async created(){
        this.projectId=this.$route.params.id;
        if (!this.$store.state.taskManagement.listDocumentIdsInProject[this.projectId] || this.$store.state.taskManagement.listDocumentIdsInProject[this.projectId].length == 0) {
            await this.$store.dispatch("taskManagement/getListDocumentIdsInProject",this.projectId);
        }
        if (!this.$store.state.taskManagement.listIssueTypeInProjects[this.projectId] || this.$store.state.taskManagement.listIssueTypeInProjects[this.projectId].length == 0) {
            await this.$store.dispatch("taskManagement/getListIssueTypeInProjects",this.projectId);
        }
        if (!this.$store.state.taskManagement.allStatus || this.$store.state.taskManagement.allStatus.length == 0) {
            await this.$store.dispatch("taskManagement/getAllStatus");
        }
        this.getData();
        this.versionWorker = new VersionWorker();
        // this.versionWorker.addEventListener("message", function (event) {
		// 	let data = event.data;
        //     switch (data.action) {
        //         case 'getListVersion':
        //             if (data.dataAfter) {
        //                 let res = data.dataAfter;
        //                 self.$store.commit("taskManagement/setListVersion", res.data.listObject);
        //                 self.listVersion = res.data.listObject;
        //             }
        //             break;
        //         default:
        //             break;
        //     }
        // });
    }
}
</script>

<style>

</style>
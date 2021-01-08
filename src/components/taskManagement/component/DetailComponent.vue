<template>
    <div class="w-100 h-100" v-if="Object.keys(infoComponent).length >0 " >
        <div class="d-flex" style="height:40px">
            <h2 class="ml-4">Component: {{infoComponent.name}}</h2>
        </div>
        <div class="fs-13 ml-4" style="height:70px">
            <div class="grey--text">
                <v-icon class="fs-13">mdi-calendar</v-icon>
                <span class="mx-2">{{$t("taskManagement.table.createAt")}}:</span>
                <span>{{infoComponent.createAt}}</span>
            </div>
            <p>{{infoComponent.description}}</p>
        </div>
        <div style="height:calc(100% - 110px)">
            <common-table-list-issue
                :listIssueProps="listIssueInComponent"
            />
        </div>
    
    </div>
</template>

<script>
import { util } from "@/plugins/util";
import { taskManagementApi } from "@/api/taskManagement.js";
import CommonTableListIssue from '../version/CommonTableListIssue.vue';

export default {
    name:"detailcomponent",
    components:{
        CommonTableListIssue,
    },
    props:{
        infoComponent: {
            type: Object,
            default() {
                return {}
            }
        },
    },
    computed:{
        listIssueInComponent(){
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
        sTaskManagement() {
            return this.$store.state.taskManagement;
        },
    },
    data(){
        let self = this;
        return{
            projectId: null,
            search:"",
            listIssue:[],
            filter:{
                ids: null,
                filter:[
                    {
                        column : "tmg_component_id",
                        operation : "and",
                        conditions : [
                            {
                                name : "in",
                                value : [self.$route.params.idComponent],
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
                        this.$snotifyError("", "Can not get list issue in component!");
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
      
    }

}
</script>

<style scoped>

</style>
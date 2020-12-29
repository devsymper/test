<template>
    <div class="w-100 h-100" v-if="Object.keys(infoVersion).length >0 " >
        <div class="d-flex" style="height:40px">
            <h2 class="ml-4">Version {{infoVersion.name}}</h2>
            <span class="ml-2 pt-1">
                <v-chip class="px-2" style="border-radius:4px" v-if="infoVersion.status == 0" color="#0760D9" text-color="white" x-small>{{$t('taskManagement.table.unreleased')}}</v-chip>
                <v-chip class="px-2" style="border-radius:4px" v-else-if="infoVersion.status == 1" color="#408137" text-color="white" x-small>{{$t('taskManagement.table.released')}}</v-chip>
            </span>
        </div>
        <div class="fs-13 ml-4" style="height:70px">
            <div class="grey--text">
                <v-icon class="fs-13 mr-2">mdi-calendar</v-icon>
                <span>{{$t("taskManagement.table.startDate")}}:</span>
                <span class="mx-1">{{infoVersion.startTime}}</span>
                <span class="mr-1 ml-2">{{$t("taskManagement.table.releaseDate")}}:</span>
                <span>{{infoVersion.endTime}}</span>
                <span class="mr-1 ml-2">{{$t("taskManagement.table.createAt")}}:</span>
                <span>{{infoVersion.createAt}}</span>
            </div>
            <p>{{infoVersion.description}}</p>
        </div>
        <div class="mx-4 d-flex progress" >
            <div class="progress-item" v-for="(item, key) in dataProgess.item " :key="key" 
                :style="{
                    width: (item.value/dataProgess.total)*100 +'%',
                    background:item.color
                }"
            >
            </div>
        </div>
        <div class="w-100" style="height:calc(100% - 125px)">
            <v-tabs class="pl-4 mt-2 fs-13">
                <v-tab>
                    <span class="mr-1" style="font-size:40px">{{dataProgess.total}}</span>
                    <span>Issue in <br> version</span>
                </v-tab>
                <v-tab  :style="{
                            color:dataProgess.item.done.color
                        }">
                    <span class="mr-1" style="font-size:40px">{{dataProgess.item.done.value}}</span>
                    <span>Issue <br> done</span>
                </v-tab>
                <v-tab  :style="{
                            color:dataProgess.item.inprogress.color
                        }">
                    <span class="mr-1" style="font-size:40px">{{dataProgess.item.inprogress.value}}</span>
                    <span>Issue in <br> progress</span>
                </v-tab>
                <v-tab  :style="{
                            color:dataProgess.item.todo.color
                        }">
                    <span class="mr-1" style="font-size:40px">{{dataProgess.item.todo.value}}</span>
                    <span>Issue<br> to do</span>
                </v-tab>
                <!-- content -->
                <v-tab-item>
                    <common-table-list-issue 
                        :listIssueProps="allIssueInVersion"
                    />
                </v-tab-item>
                <v-tab-item>
                   <page-issue-done 
                   />
                </v-tab-item>
                <v-tab-item>
                    <page-issue-in-progress />
                </v-tab-item>
                <v-tab-item>
                    <page-issue-to-do />
                </v-tab-item>
            </v-tabs>
        </div>
    </div>
</template>

<script>
import { taskManagementApi } from "@/api/taskManagement.js";
import CommonTableListIssue from './CommonTableListIssue.vue';
import PageIssueDone from './PageIssueDone.vue';
import PageIssueInProgress from './PageIssueInProgress';
import PageIssueToDo from './PageIssueToDo.vue';

export default {
  components: { CommonTableListIssue, PageIssueDone, PageIssueInProgress, PageIssueToDo },
    name:"detailversion",
    props:{
        infoVersion: {
            type: Object,
            default() {
                return {}
            }
        },
    },
    computed:{
        allIssueInVersion(){
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
            projectId: null,
            listIssue:[],
            dataProgess:{
                total:10,
                item:{
                    todo:{
                        value:2,
                        color:'grey'
                    },
                    inprogress:{
                        value:3,
                        color:'blue'
                    },
                    done:{
                        value:5,
                        color:'green'
                    }
                }
            },
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
                        this.$snotifyError("", "Can not get list issue in version!");
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
.progress{
    height: 12px;
}

.progress-item:first-child {
    border-top-left-radius:10px ;
    border-bottom-left-radius:10px ;
}

.progress-item:last-child {
    border-top-right-radius:10px ;
    border-bottom-right-radius:10px ;
}
.progress-item{
    margin: 0 1px;
}
</style>
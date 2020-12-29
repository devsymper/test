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
            <v-card style="box-shadow:none">
                <v-card-title>
                    {{$t("taskManagement.listIssueComponent")}}
                    <v-spacer></v-spacer>
                    <v-text-field
                        v-model="search"
                        append-icon="mdi-magnify"
                        label="Tìm kiếm"
                        dense
                        solo
                        style="max-width:255px;"
                        single-line
                        hide-details
                        class="sym-small-size sym-style-input"
                    ></v-text-field>
                </v-card-title>
                <v-data-table
                    v-if="listIssueInComponent.length>0"
                    :headers="headers"
                    :items="listIssueInComponent"
                    :search="search"
                    hide-default-footer
                    class="table-list-font-size"
                >
                    <template v-slot:[`item.tmg_name`]="{ item }">
                        <div class="d-flex">
                            <div class="item-icon" v-if="item.infoIssueType">
                                <v-icon v-if="!!item.infoIssueType.icon && item.infoIssueType.icon.indexOf('mdi-') > -1" class="pt-0" style="font-size:20px">{{item.infoIssueType.icon}}</v-icon>
                                <img class="img-fluid" style="object-fit: fill;border-radius:3px" v-else-if="!!item.infoIssueType.icon && item.infoIssueType.icon.indexOf('mdi-') < 0" :src="item.infoIssueType.icon" width="20" height="20">
                            </div>
                            <div class="item-icon" v-else>
                                <v-icon class="pt-0" style="font-size:20px">mdi-progress-question</v-icon>
                            </div>
                            <div>
                                <span class="task-hover-poiter">{{item.tmg_name}}</span>
                                <div class="grey--text">
                                        {{item.tmg_project_key}}-{{item.document_object_id}}
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-slot:[`item.status`]="{ item }">
                        <span style="padding: 2px 4px; border-radius:3px" :style="{'background':item.infoStatus.color,'color':invertColor(item.infoStatus.color)}">{{item.infoStatus.name}}</span>
                    </template>
                    <template v-slot:[`item.user`]="{ item }">
                        <infoUser class="userInfo fs-13" :userId="item.document_object_user_created_id" :roleInfo="{}" />
                    </template>
                    <template v-slot:[`item.priority`]="{ item }">
                        <div v-if="item.infoPriority">
                            <v-icon :style="{'color':item.infoPriority.color, 'font-size':'18px'}">{{item.infoPriority.icon}}</v-icon>
                            <span class="pl-1">{{item.infoPriority.name}}</span>
                        </div>
                    </template>
                    <template v-slot:[`item.assignee`]="{ item }">
                        <infoUser v-if="item.tmg_assignee" class="userInfo fs-13" :userId="item.tmg_assignee" :roleInfo="{}" />
                    </template>
                
                </v-data-table>
            </v-card>            

        </div>
    
    </div>
</template>

<script>
import { util } from "@/plugins/util";
import infoUser from "@/components/common/user/InfoUser";
import { taskManagementApi } from "@/api/taskManagement.js";

export default {
    name:"detailcomponent",
    components:{
        infoUser
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
            headers: [
                {
                text: this.$t("taskManagement.table.name"),
                align: "start",
                value: "tmg_name"
                },
                { text: this.$t("taskManagement.table.description"), value: "tmg_description" },
                { text: this.$t("common.status"), value: "status" },
                { text: "Priority", value: "priority" },
                { text: this.$t("tasks.header.assignee"), value: "assignee" },
                { text: this.$t("common.created_by"), value: "user" },
                { text: this.$t("tasks.header.dueDate"), value: "tmg_due_date" },
                { text: this.$t("taskManagement.table.createAt"), value: "document_object_create_time" },
            ],
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
        /**
         * function đảo ngược color đầu vào
         */
        invertColor(hex) {
            if (hex.indexOf('#') === 0) {
                hex = hex.slice(1);
            }
            if (hex.length > 6) {
                hex = hex.substr(0,6);
            }
            // convert 3-digit hex to 6-digits.
            if (hex.length === 3) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            if (hex.length !== 6) {
                throw new Error('Invalid HEX color.');
            }
            // invert color components
            var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
                g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
                b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
            // pad each with zeros and return
            return '#' + this.padZero(r) + this.padZero(g) + this.padZero(b);
        },

        padZero(str, len) {
            len = len || 2;
            var zeros = new Array(len).join('0');
            return (zeros + str).slice(-len);
        }
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
.table-list-font-size >>> td{
    font-size: 13px!important;
}
.item-icon {
    margin-top: 9px;
    padding-right: 12px;
}
.grey--text{
    font-size: 11px;
}
.task-hover-poiter:hover{
    cursor: pointer;
    text-decoration: underline;
    color: blue;
}
</style>
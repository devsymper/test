<template>
    <div class="h-100">
        <v-card class="h-100" style="box-shadow:none">
            <v-card-title>
                {{listType}}
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
            <VuePerfectScrollbar style="height:calc(100% - 64px)">
                <v-data-table
                    v-if="listIssueProps.length>0"
                    :headers="headers"
                    :items="listIssueProps"
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
                                <span @click.prevent.stop="handleShowDetailIssue(item)" class="task-hover-poiter">{{item.tmg_name}}</span>
                                <div class="grey--text">
                                        {{item.tmg_project_key}}-{{item.document_object_id}}
                                </div>
                            </div>
                        </div>
                    </template>
                    <template v-slot:[`item.status`]="{ item }">
                        <span style="padding: 2px 4px; border-radius:3px;font-weight:500;" :style="{'background':'#f2f2f2','color':item.infoStatus.color}">{{item.infoStatus.name}}</span>
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
            </VuePerfectScrollbar>
        </v-card> 
        <detail-issue
            :documentObjectId="documentObjectId"
            :issue="issue"
            ref="issue"
        />
    </div>
</template>

<script>
import infoUser from "@/components/common/user/InfoUser";
import DetailIssue from '@/components/taskManagement/issue/DetailIssue.vue';
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
    components:{
        infoUser,
        DetailIssue,
        VuePerfectScrollbar
    },
    props:{
        listIssueProps: {
            type: Array,
            default() {
                return []
            }
        },
        listType:{
            type: String,
            default(){
                return this.$t("taskManagement.listIssueComponent");
            }
        }
    },
    data(){
        return{
            issue:null,
            search:"",
            documentObjectId:null,
            headers: [
                {
                text: this.$t("taskManagement.table.name"),
                align: "start",
                value: "tmg_name"
                },
                { text: this.$t("taskManagement.table.description"), value: "tmg_description" },
                { text: this.$t("common.status"), value: "status" ,width:'120'},
                { text: "Priority", value: "priority" ,width:'120'},
                { text: this.$t("tasks.header.assignee"), value: "assignee" ,width:'120'},
                { text: this.$t("common.created_by"), value: "user" ,width:'150'},
                { text: this.$t("tasks.header.dueDate"), value: "tmg_due_date" ,width:'100'},
                { text: this.$t("taskManagement.table.createAt"), value: "document_object_create_time" ,width:'150'},
            ],
        }
    },
    methods:{
        handleShowDetailIssue(issue){
            this.documentObjectId = issue.document_object_id;
            this.issue = this.task;
            this.$refs.issue.show();
        },
    }


}
</script>

<style scoped>
.table-list-font-size >>> td{
    font-size: 13px!important;
}
.item-icon {
    margin-top: 5px;
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
.sym-style-input >>> .v-input__slot{
    box-shadow: none !important;
}
</style>
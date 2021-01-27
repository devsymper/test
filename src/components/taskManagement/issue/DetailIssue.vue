<template>
     <v-dialog
        v-model="isShow"
        max-width="21cm"
        :content-class="'detail-issue h-100'"
    >
        <div class="d-flex justify-space-between py-1"  style="border-bottom:1px solid #eee">
            <span class="fs-16 font-weight-medium ml-4">Info Issues</span>
            <div class="d-flex">
                <div style="border:1px solid #eee;" class="d-flex px-2 mx-2" v-if="infoProject">
                    <v-icon v-if="!!infoProject.icon && infoProject.icon.indexOf('mdi-') > -1" class="mr-1 mt-1" style="font-size:18px">{{infoProject.icon}}</v-icon>
                    <img  v-else-if="!!infoProject.icon && infoProject.icon.indexOf('mdi-') < 0" :src="infoProject.icon" height="15" width="15" alt="" class="mr-2 mt-1">
                    <div class="mt-1">{{infoProject.name}}</div>
                </div>
                <div style="border:1px solid #eee;" class="d-flex px-2 mr-4" v-if="infoIssueType">
                    <v-icon v-if="!!infoIssueType.icon && infoIssueType.icon.indexOf('mdi-') > -1" class="mr-1 mt-1" style="font-size:18px">{{infoIssueType.icon}}</v-icon>
                    <img  v-else-if="!!infoIssueType.icon && infoIssueType.icon.indexOf('mdi-') < 0" :src="infoIssueType.icon" height="15" width="15" alt="" class="mr-2 mt-1">
                    <div class="mt-1">{{infoIssueType.name}}</div>
                </div>
                <v-icon style="font-size:16px; float:right;margin-right:10px" @click="showDetail">mdi-page-next-outline</v-icon>
            </div>
        </div>
        <div style="height:  calc(100% - 70px)">
            <detail
                v-if="!statusEdit"
                :docObjInfo="docObjInfo"
                :quickView="true"
                class="issue"
                ref="detailIssue"
            />
            <submit
                v-else
                ref="updateDocument"
                class="doc_issue"
                :action="'update'"
                :showSnackbarSuccess="false"
                :documentObjectId="Number(docObjInfo.docObjId)"
                :showSubmitButton="false"
                @submit-document-success="onDocumentUpdateSuccess"
                @submit-document-error="onSubmitError"
            />

        </div>
        <div style="direction: rtl;">
            <v-btn
                color="red darken-1"
                text
                @click="isShow = false"
            >
                {{$t("common.close")}}
            </v-btn>
            <v-btn
                color="blue darken-1"
                text
                @click="statusEdit = true"
                v-if="!statusEdit"

            >
                {{$t("common.edit")}}
            </v-btn>
            <v-btn
                color="green darken-1"
                text
                :loading="loadding"
                v-else
                @click="updateSubmitedDocument"

            >
                {{$t("common.save")}}
            </v-btn>
           
        </div>
    </v-dialog>
</template>

<script>
import Detail from '@/views/document/detail/Detail.vue';
import Submit from '@/views/document/submit/Submit.vue';
import { taskManagementApi } from "@/api/taskManagement.js";
export default {
  components: { Detail, Submit },
    props:{
        documentObjectId:{
            type: String,
            default: ""
        },
        issue:{
            type: Object,
            default(){
                return {}
            }
        }
    },
    watch:{
        documentObjectId:{
            deep:true,
            immediate:true,
            handler:function(newVl){
                this.statusEdit = false;
                if (newVl) {
                    this.getInfoProject();
                }
            }
        }
    },
    computed:{
        docObjInfo(){
            return {docObjId:this.documentObjectId};
        },
        allProject(){
            return this.$store.state.taskManagement.allProject;
        },
        allIssueType(){
            return this.$store.state.taskManagement.allIssueType;
        },
        allIssueTypeInProject(){
            return this.$store.state.taskManagement.listIssueTypeInProjects[this.infoProject.id];
        },
    },
    data(){
        return{
            loadding:false,
            isShow:false,
            statusEdit:false,
            infoProject:null,
            infoIssueType:null,
        }
    },
    methods:{
        getInfoProject(){
            let self = this;
            if (this.issue) {
                if(this.allProject.length > 0){
                    let project = this.allProject.find(ele => ele.id == this.issue.tmg_project_id);
                    if (project) {
                        this.infoProject = project;
                        this.getInfoIssueType(this.infoProject.id);          
                    }
                }
                else{
                    taskManagementApi
                        .getDetailProject(this.issue.tmg_project_id)
                        .then(res => {
                            if (res.status == 200) {
                                self.infoProject = res.data;
                                self.getInfoIssueType(self.infoProject.id);
                            }
                        })
                        .catch(err => {
                        })
                        .finally(() => {});
                }
            }
        },
        async getInfoIssueType(projectId){
            if(!this.allIssueTypeInProject){
                await this.$store.dispatch("taskManagement/getListIssueTypeInProjects", projectId);
            }
            let issueType = this.allIssueTypeInProject.find(ele => ele.id == this.issue.tmg_issue_type);
            if (issueType) {
                this.infoIssueType = issueType;
            }
        },
        showDetail(){
            this.$refs.detailIssue.showSideBar()
        },
        show(){
            this.isShow=true;
        },
        onSubmitError(){
            this.$snotifyError("", "Update error!");
            this.statusEdit = false;
            this.loadding = false;
        },
        onDocumentUpdateSuccess(){
            this.$snotifySuccess("Update success!");
            this.statusEdit = false;
            this.loadding = false;
        },
        updateSubmitedDocument(){
            this.loadding = true;
            this.$refs.updateDocument.handlerSubmitDocumentClick();
        },
    },
}
</script>

<style scoped>
::v-deep .detail-issue{
    background: white!important;
    overflow: hidden!important;
}
.issue {
    height: calc(100vh - 130px)!important;
}
</style>
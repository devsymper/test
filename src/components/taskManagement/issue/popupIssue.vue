<template>
    <v-dialog
        v-model="isShow"
        max-width="21cm"
        scrollable
    >
        <v-card>
        <v-card-title class="px-4">
            <div class="w-100 d-flex justify-space-between">
                <span class="fs-16">{{$t("taskManagement.createIssue")}}</span>
                <div class="d-flex">
                    <v-autocomplete 
                        v-model="currentProject"
                        return-object
                        item-text="name"
                        item-value="id"
                        :items="allProject"
                        @change="onChangeProject"
                        solo
                        class="project-select sym-small-size sym-style-input">

                        <template v-slot:selection="{item}">
                            <v-icon v-if="!!item.icon && item.icon.indexOf('mdi-') > -1" class="mr-1" style="font-size:18px">{{item.icon}}</v-icon>
                            <img  v-else-if="!!item.icon && item.icon.indexOf('mdi-') < 0" :src="item.icon" height="15" width="15" alt="" class="mr-2">
                            <div class="project-name">{{item.name}}</div>
                        </template>
                        <template v-slot:item="{item}">
                            <template>
                                <v-icon v-if="!!item.icon && item.icon.indexOf('mdi-') > -1" class="mr-1" style="font-size:18px">{{item.icon}}</v-icon>
                                <img  v-else-if="!!item.icon && item.icon.indexOf('mdi-') < 0" :src="item.icon" height="15" width="15" alt="" class="mr-2">
                                <div class="project-name">{{item.name}}</div>
                            </template>
                        </template>
                    </v-autocomplete>
                    <v-autocomplete 
                        v-model="currentIssueType"
                        return-object
                        item-text="name"
                        item-value="id"
                        :items="allIssueTypeInProject"
                        solo
                        @change="onChangeIssueType"
                        class="project-select sym-small-size sym-style-input">

                        <template v-slot:selection="{item}">
                            <v-icon v-if="!!item.icon && item.icon.indexOf('mdi-') > -1" class="mr-1" style="font-size:18px">{{item.icon}}</v-icon>
                            <img  v-else-if="!!item.icon && item.icon.indexOf('mdi-') < 0" :src="item.icon" height="15" width="15" alt="" class="mr-2">
                            <div class="project-name">{{item.name}}</div>
                        </template>
                        <template v-slot:item="{item}">
                            <template>
                                <v-icon v-if="!!item.icon && item.icon.indexOf('mdi-') > -1" class="mr-1" style="font-size:18px">{{item.icon}}</v-icon>
                                <img  v-else-if="!!item.icon && item.icon.indexOf('mdi-') < 0" :src="item.icon" height="15" width="15" alt="" class="mr-2">
                                <div class="project-name">{{item.name}}</div>
                            </template>
                        </template>
                    </v-autocomplete>
                </div>
            </div>

        </v-card-title >
        <v-card-text class="p-2">
            <submit
                v-if="currentIssueType && currentIssueType.id && documentId"
                :key="currentIssueType.id"
                ref="submitComponent"
                class="doc_issue"
                :action="'submit'"
                :showSnackbarSuccess="false"
                :docId="documentId"
                :projectId="currentProject.id"
                :workflowVariable="workflowVariable"
                :showSubmitButton="false"
                @after-loaded="afterLoadedContent"
                @submit-document-success="onSubmitDone"
                />
                <div v-else class="no-document-message">
                    <v-icon size="50">mdi-database-remove</v-icon>
                    <div>
                        Bạn chưa cấu hình Document cho loại tác vụ này
                    </div>
                </div>
        </v-card-text>
        <v-card-actions class="px-4">
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                :loading="isLoading"
                class="btn-add"
                @click="submitForm"
            >
                {{$t("common.add")}}
            </v-btn>
            <v-btn
            color="red darken-1"
            text
            @click="isShow = false"
            >
                {{$t("common.close")}}
            </v-btn>
        </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import FormTpl from "@/components/common/FormTpl.vue";
import { util } from '../../../plugins/util';
import Submit from '../../../views/document/submit/Submit.vue';

export default {
    name: "issue",
    components:{
        FormTpl,
        Submit,
    },
    data(){
        return{
            isLoading:false,
            isShow:false,
            currentProject: {},
            currentIssueType: null,
            documentId:null,
            currentStatus:null,
            workflowVariable:{
            }
        
        }
    },
   
    computed:{
        allProject(){
            if (!this.$store.state.taskManagement.allProject || this.$store.state.taskManagement.allProject.length == 0) {
                this.$store.dispatch("taskManagement/getAllProject");
            }
            let projects = util.cloneDeep(this.$store.state.taskManagement.allProject);
            projects = projects.reduce((arr,obj)=>{
                arr.push({id:obj.id, name: obj.name, icon:obj.icon, key:obj.key});
                return arr;
            },[])
            return projects;
        },
        allIssueTypeInProject(){
            return this.$store.state.taskManagement.listIssueTypeInProjects[this.currentProject.id];
        },
        listIssueTypeInProjects(){
            return this.$store.state.taskManagement.listIssueTypeInProjects;
        },
        sTaskManagement() {
            return this.$store.state.taskManagement;
        },
    },
    methods:{
        // thay đổi document id ở đây
        onChangeIssueType(){
            this.documentId = Number(this.currentIssueType.documentId);
            this.setParamsForField();
        },
        onChangeProject(){
            this.getListIssueType();
        },
        show(){
            this.isShow=true;
            let projectId = this.$route.params.id;
            if(projectId){
                this.currentProject = this.allProject.find(el => el.id == projectId);
            }
            else{
                this.currentProject = this.allProject[0];
            }
            this.getListIssueType();
        },
        setStatusTask(status){
            this.currentStatus = status
            
        },
        afterLoadedContent(listInput){
            if(this.currentStatus){
                listInput['tmg_status'].setValue({inputDislay:this.currentStatus.name,inputValue: this.currentStatus.id});
                listInput['tmg_status_id'].setValue(this.currentStatus.id);
            }
        },
        async getListIssueType(){
            if(!this.allIssueTypeInProject){
                await this.$store.dispatch("taskManagement/getListIssueTypeInProjects", this.currentProject.id);
            }
            this.currentIssueType = this.allIssueTypeInProject.find(ele => ele.projectId == this.currentProject.id);
            this.documentId = Number(this.currentIssueType.documentId);
            console.log(this.documentId,'this.documentId');
            this.setParamsForField()
        },
        setParamsForField(){
            this.$set(this.workflowVariable,'project_id',this.currentProject.id);
            this.$set(this.workflowVariable,'project_key',this.currentProject.key);
            this.$set(this.workflowVariable,'issue_type_id',this.currentIssueType.id);  
            this.$set(this.workflowVariable,'task_life_circle_id',this.currentIssueType.taskLifeCircleId);
        },
        submitForm(){
            this.isLoading = true;
            this.$refs.submitComponent.handlerSubmitDocumentClick(true);
        },
        onSubmitDone(data){
            this.isLoading = false;
            this.isShow = false;
            this.$snotifySuccess("Add issue success!");
            this.$evtBus.$emit("task-manager-submit-issue-success",data);

        },
    },

}
</script>

<style scoped>
   
    .project-select{
        width: 160px;
        margin-right: 8px;
    }
    .task-type-select{
        width: 140px;
    }
    .project-name{
        font-size: 13px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }
    .project-select >>> .v-select__selections input{
        min-width: 1px;
    }
    ::v-deep .v-input__slot{
        box-shadow: none !important;
    }
    .doc_issue >>> .sym-form-submit{
        padding: 4px;
        padding-right: 10px;
    }
    .doc_issue{
        height: 600px!important;
    }

    .no-document-message{
        text-align: center;
        height: 150px;
        padding: 48px;
    }
    ::v-deep .v-card__subtitle, ::v-deep .v-card__text{
        line-height: unset !important;
    }
</style>
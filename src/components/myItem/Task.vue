<template>
    <div class="h-100 w-100 d-flex justify-center task-style"> 
        <DocumentSubmit 
            v-if="showDoTaskComponent && ((action == 'submit'  && statusTask == 'notSubmit' ) || action=='update')"
            ref="submitComponent"
			:showSnackbarSuccess="false"
            :docId="Number(docId)"
            :workflowVariable="workflowVariable"
            :showSubmitButton="false"
            :appId="Number(appId)"
            :documentObjectTaskId="workflowInfo.documentObjectTaskId"
            :documentObjectWorkflowId="workflowInfo.documentObjectWorkflowId"
            :documentObjectWorkflowObjectId="workflowInfo.documentObjectWorkflowObjectId"
            :action="action"
            :documentObjectId="converstNumber(documentObjectId)"
            :overrideControls="overrideControls"
            @submit-document-error="onSubmitError"
            @submit-document-success="onSubmitDone">
        </DocumentSubmit>
        <Detail 
            class="doc-detail"
            :showCommentInDoc="false"
            v-else-if="(showDetailDocument && showDoTaskComponent && (action == 'approval')) || statusTask=='done' || statusTask=='submited' "
            :docObjInfo="docObjInfo">
        </Detail>
        <div style="width:100%" v-else-if="statusTask=='done-noneObj' || action=='submitAdhocTask'">
            <h3 class="pl-2" style="text-align:left; margin-top:20px; color:#4e4e4e">Mô tả: {{taskInfo.extraLabel}} </h3>
        </div>
        <div v-else-if="action == 'undefined'">
            <div class="text-md-center mt-6">
                <span class="fs-16 font-weight-bold">
                    {{taskInfo.content}}
                </span>
            </div>
            <div class="text-md-center ">
                <span class="text--grey fs-14 mt-6">
                    {{taskInfo.extraLabel}}
                </span>
            </div>
        </div>
        <SideBarDetail
            :sidebarWidth="sidebarWidth"  
            :isShowSidebar="isShowSidebar"
            :taskInfo="taskInfo"
            :originData="originData"
            :tabsData="tabsData"
            :appId="Number(appId)"
            @changeUpdateAsignee="changeUpdateAsignee"
            @showContentFile="showContentFile"
            @showPopupTracking="showPopupTracking"
        />
        <KHShowFile
        @downloadOrBackupFile="downloadOrBackupFile"
        v-bind:fileId="fileId"
        v-bind:name="name"
        v-bind:serverPath="serverPath"
        v-bind:type="type"
        />
        <PopupProcessTracking 
            :taskInfo="taskInfo"
            :definitionName="definitionName"
        />

        <!-- Phần này cần tách thành component riêng -->
        
        <v-dialog
            :content-class="'dialog-edit-doc h-100'"
            v-model="showUpdateSubmitedDocument"
            width="80%">
            <div class="w-100 py-2 px-4 bg-white justify-space-between d-flex border-bottom-1">
                <span class="float-left title">
                    {{$t('common.update')}} {{$t('common.documents')}}
                </span>
                <div class="float-right">
                     <v-btn
                        depressed
                        color="primary" 
                        small
                        @click="updateSubmitedDocument"
                        class="mr-2">
                        {{$t('tasks.header.submit')}}
                    </v-btn>
                    
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn  
                                @click="closeUpdatePanel()"
                                icon
                                tile
                                v-on="on" text small>
                                    <v-icon  small>mdi-close</v-icon>
                            </v-btn>
                        </template>
                        <span>{{$t('common.close')}}</span>
                    </v-tooltip>
                </div>
            </div>
            <div style="height:  calc(100% - 50px)">
                <DocumentSubmit 
                    v-if="showUpdateSubmitedDocument"
                    class="bg-white"
					:showSnackbarSuccess="false"
                    ref="panelUpdateSubmitedDocument"
                    :docId="Number(docId)"
                    :appId="Number(appId)"
                    :workflowVariable="workflowVariable"
                    :showSubmitButton="false"
                    :documentObjectTaskId="workflowInfo.documentObjectTaskId"
                    :documentObjectWorkflowId="workflowInfo.documentObjectWorkflowId"
                    :documentObjectWorkflowObjectId="workflowInfo.documentObjectWorkflowObjectId"
                    :action="'update'"
                    :editableControls="taskInfo.approvalEditableControls"
                    :documentObjectId="converstNumber(documentObjectId)"
                    @submit-document-error="onSubmitError"
                    @submit-document-success="onDocumentUpdateSuccess"/>
            </div>
        </v-dialog>
    </div>
</template> 
<script>
import DocumentSubmit from "@/views/document/submit/Submit.vue";
import BPMNEngine from '@/api/BPMNEngine';
import Detail from "@/views/document/detail/Detail";
import SideBarDetail from "./SideBarDetail";
import { getProcessInstanceVarsMap } from '@/components/process/processAction';
import KHShowFile from "@/components/kh/KHShowImage";
import { taskApi } from "@/api/task.js";
import PopupProcessTracking from './PopupProcessTracking'

export default {
    components: {
        DocumentSubmit: DocumentSubmit,
        Detail,
        SideBarDetail,
        KHShowFile,
        PopupProcessTracking
    },
    created(){
    },
    data(){
        return {
            statusTask:"notSubmit", // statusTask có 3 trạng thái chính.. notSubmit, submited,done
            fileId: "",
			serverPath: "",
			name: "",
			type: "",
            sidebarWidth:400,
            docId: 0,
            docObjInfo: {
                docObjId: 0,
            },
            action: 'submit',
            workflowVariable: {},
            workflowInfo: {
                documentObjectWorkflowObjectId: '',
                documentObjectWorkflowId: '',
                documentObjectTaskId: ''
            },
            showDoTaskComponent: false,
            documentObjectId: 0,
            showUpdateSubmitedDocument: false,
            showDetailDocument: true,
        }
    },
    props: {
        taskInfo: {
            type: Object,
            default(){
                return {
                    docId: 0
                }
            }
        },
        definitionName:{
            type:String,
            default:'',
        },
        originData:  {
            type: Object,
            default: () => {}
        },
        isShowSidebar:{
            type:Boolean,
          	default:false
        },
        tabsData: {
            type: Object,
            default: () => {}
        },
        appId:{
            type:String,
            default:'',
        }
    },
    computed:{
        stask() {
            return this.$store.state.task;
        },
        overrideControls(){
            let overrideValueControls={};
            if (this.taskInfo.selectDefaultControlDocument) {
                if (this.taskInfo.selectDefaultControlDocument.length>0) {
                    let selectDefaultControlDocument=this.taskInfo.selectDefaultControlDocument;
                    for (let index = 0; index < selectDefaultControlDocument.length; index++) {
                        if (selectDefaultControlDocument[index].name && selectDefaultControlDocument[index].value) {
                            overrideValueControls[selectDefaultControlDocument[index].name]={formulas:"SELECT '"+selectDefaultControlDocument[index].value+"'"};
                        }
                    }
                }
                return overrideValueControls;
            }
          
        }
    },
    watch: {
        taskInfo: {
            deep: true,
            immediate: true,
            handler: async function (after, before) {
                console.log(after, before, "after taskInfo change");
                this.showDoTaskComponent = false;
                if (this.originData.endTime) {
                    this.statusTask = 'done'
                }else{
                    if (this.taskInfo.action && this.taskInfo.action.parameter.documentObjectId) {
                        this.statusTask = 'submited'
                    }else{
                        this.statusTask = 'notSubmit'
                    }
                }

                if (this.statusTask!='done') {
                    if(this.taskInfo.action){
                        if(!this.taskInfo.action.parameter.documentObjectId && this.taskInfo.action.parameter.documentObjectId==0 ){
                            this.statusTask='done-noneObj';
                        }else{
                            let action = this.taskInfo.action.action;
                            this.action = action;
                            let varsMap = await getProcessInstanceVarsMap(this.taskInfo.action.parameter.processInstanceId);
                            this.workflowInfo.documentObjectWorkflowId = this.taskInfo.action.parameter.processDefinitionId;
                            this.workflowInfo.documentObjectWorkflowObjectId = this.taskInfo.action.parameter.processInstanceId;
                            this.workflowInfo.documentObjectTaskId = this.taskInfo.action.parameter.taskId;
                            // cần activityId  của task truyền vào nữa 
                            let workflowVariable = {};
                            this.taskVarsMap = {};
                            for(let key in varsMap){
                                workflowVariable['workflow_'+key] = varsMap[key].value;
                                this.taskVarsMap[key] = varsMap[key].value;
                            }
                            this.workflowVariable = null;
                            this.workflowVariable = workflowVariable;
                            if(action == 'submit'){
                                this.docId = Number(this.taskInfo.action.parameter.documentId);
                                if (this.statusTask == 'submited') {
                                    this.docObjInfo.docObjId = this.taskInfo.action.parameter.documentObjectId;
                                }else{
                                    this.documentObjectId = 0;
                                }
                            }else if(action == 'approval' || action == 'update' ||  this.statusTask ==' done'){
                                if(!this.taskInfo.action.parameter.documentObjectId){
                                    
                                    let approvaledElId = this.taskInfo.targetElement;
                                    let docObjId = 0;
                                    if(approvaledElId == 'DOC_INSTANCE_FROM_STARTING_WORKFLOW'){
                                        // docObjId = varsMap['doc_INSTANCE_FROM_STARTING_WORKFLOW'];
                                        docObjId = varsMap['docInstanceFromStartingWorkflow'];
                                        docObjId = docObjId ? docObjId : 0;
                                    }else{
                                        docObjId = varsMap[approvaledElId+'_document_object_id'];
                                    }
                                    this.docObjInfo.docObjId = docObjId.value;
                                }else{
                                    this.docObjInfo.docObjId = this.taskInfo.action.parameter.documentObjectId;
                                }
                                this.documentObjectId = Number(this.docObjInfo.docObjId);
                            }
                            this.showDoTaskComponent = true;    
                        }
                                      
                    }else if((this.docId && Number(this.docId > 0)) || this.documentObjectId){
                        this.showDoTaskComponent = true;
                    }
                }else{
                    if(this.taskInfo.action.parameter.documentObjectId){
                        this.docObjInfo.docObjId = this.taskInfo.action.parameter.documentObjectId;
                    }else{
                        this.statusTask='done-noneObj';
                    }
                }
            }
        }
    },
    methods: {
        changeStatusTask(data){
            this.statusTask = data.status;
            this.docObjInfo.docObjId = data.documentObjectId;
        },
        getVarsMap(){
            return this.taskVarsMap;
        },
        onDocumentUpdateSuccess(){
            this.showDetailDocument = false;
            setTimeout((self) => {
                self.showDetailDocument = true;            
            }, 50, this);
            this.closeUpdatePanel();
        },
        updateSubmitedDocument(){
            this.$refs.panelUpdateSubmitedDocument.handlerSubmitDocumentClick();
        },
        closeUpdatePanel(){
            this.showUpdateSubmitedDocument = false;
        },
        showPopupTracking(){
            this.$store.commit("task/setStatusPopupTracking",true)
        },
        showContentFile(data){
            this.serverPath = data.serverPath;
			this.name = data.name;
			this.type = data.type;
			this.fileId = data.id;
            this.$store.commit("kh/changeStatusShowImage", true);
            
        },
        downloadOrBackupFile(data) {
			this.downLoadFile(data.fileId);
        },
        downLoadFile(id) {
			taskApi
			.downloadFile(id)
			.then(res => {})
			.catch(err => {
			console.log("error download file!!!", err);
			})
			.finally(() => {});
		},
        changeUpdateAsignee(){
            this.$emit('changeUpdateAsignee');
        },
        async handleTaskDetailChange(defId, nodeId){
            if(!defId || !nodeId){
                return;
            }
            this.docId = 0;
            let defModel = await BPMNEnginfe.getDefinitionModel(defId);
            
            let nodeData = defModel.processes[0].flowElementMap[nodeId];
            let symperActionMap = {};
            for(let item of nodeData.formProperties){
                let name = item.id.replace(nodeData.id+'___','').replace(/([0-9]+)/g,'');
                symperActionMap[name] = item;
            }

            let action = symperActionMap.taskAction.defaultExpression.replace(/([0-9]+)/g,'');
            if(action == 'submit'){
                this.docId = nodeData.formKey;
            }
        },
        onSubmitError(){
            this.$emit('task-submit-error');
        },
        onSubmitDone(data){
            this.$emit('task-submited', data);
        },
        submitForm(){
            this.$refs.submitComponent.handlerSubmitDocumentClick();
        },
        converstNumber(documentObjectId){
            return Number(documentObjectId);
        }
    },
    name: "task"
}
</script>

<style scoped>
.task-style{
    overflow: hidden!important;
    position: relative;
}
.task-style >>> .wrap-content-submit{
    width:96%!important;
}
::v-deep .dialog-edit-doc{
    overflow: hidden;
}
.doc-detail {
    height:100%!important;
}



</style>
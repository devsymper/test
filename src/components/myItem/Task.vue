<template>
    <div class="h-100 w-100 d-flex justify-center task-style"> 
        <DocumentSubmit 
            v-if="showDoTaskComponent && (action == 'submit' || action=='update')"
            ref="submitComponent"
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
            @submit-document-success="onSubmitDone">
        </DocumentSubmit>
        <Detail 
            :showCommentInDoc="false"
            v-else-if="(showDetailDocument && showDoTaskComponent && (action == 'approval')) || filter=='done'"
            :docObjInfo="docObjInfo">
        </Detail>
        <div style="width:100%" v-else-if="filter=='done-noneObj'">
            <h3 style="text-align:left; margin-top:20px; color:#4e4e4e">Mô tả: {{taskInfo.extraLabel}} </h3>
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
            :content-class="'dialog-edit-doc'"
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
            <DocumentSubmit 
                v-if="showUpdateSubmitedDocument"
                class="bg-white"
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
                @submit-document-success="onDocumentUpdateSuccess"/>
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
        console.log(this,'thissthissthissthissthissthissthissthiss');
        
    },
    data(){
        return {
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
            filter:'notDone',
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
    },
    watch: {
        taskInfo: {
            deep: true,
            immediate: true,
            handler: async function (after, before) {
                console.log(after, before, "after taskInfo change");
                this.showDoTaskComponent = false;
                let filter = this.stask.filter;
                this.filter=filter;
                if (filter!='done') {
                    if(this.taskInfo.action){
                        if(!this.taskInfo.action.parameter.documentObjectId && this.taskInfo.action.parameter.documentObjectId==0 ){
                            this.filter='done-noneObj';
                        }else{
                            let action = this.taskInfo.action.action;
                            this.action = action;
                            let varsMap = await getProcessInstanceVarsMap(this.taskInfo.action.parameter.processInstanceId);
                            this.workflowInfo.documentObjectWorkflowId = this.taskInfo.action.parameter.processDefinitionId;
                            this.workflowInfo.documentObjectWorkflowObjectId = this.taskInfo.action.parameter.processInstanceId;
                            this.workflowInfo.documentObjectTaskId = this.taskInfo.action.parameter.taskId;
                            // cần activityId  của task truyền vào nữa 
                            let workflowVariable = {};
                            for(let key in varsMap){
                                workflowVariable['workflow_'+key] = varsMap[key].value;
                            }
                            this.workflowVariable = null;
                            this.workflowVariable = workflowVariable;
                            if(action == 'submit'){
                                this.docId = Number(this.taskInfo.action.parameter.documentId);
                                this.documentObjectId = 0;
                            }else if(action == 'approval' || action == 'update' || filter =='done'){
                                if(!this.taskInfo.action.parameter.documentObjectId){
                                    
                                    let approvaledElId = this.taskInfo.targetElement;
                                    let docObjId = varsMap[approvaledElId+'_document_object_id'];
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
                        this.filter='done-noneObj';
                    }
                }
            }
        }
    },
    methods: {
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
			.always(() => {});
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
}
.task-style >>> .wrap-content-submit{
    width:96%!important;
}
::v-deep .dialog-edit-doc{
    overflow: hidden;
}



</style>
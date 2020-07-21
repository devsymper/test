<template>
    <div class="h-100 w-100 d-flex justify-center ml-6"> 
        <DocumentSubmit 
            v-if="action == 'submit' || action=='update'"
            ref="submitComponent"
            :docId="Number(docId)"
            :workflowVariable="workflowVariable"
            :showSubmitButton="false"
            :documentObjectTaskId="workflowInfo.documentObjectTaskId"
            :documentObjectWorkflowId="workflowInfo.documentObjectWorkflowId"
            :documentObjectWorkflowObjectId="workflowInfo.documentObjectWorkflowObjectId"
            :action="action"
            :documentObjectId="documentObjectId"
            @submit-document-success="onSubmitDone">
        </DocumentSubmit>
        <Detail 
            v-else-if="action == 'approval'"
            :docObjInfo="docObjInfo">
        </Detail>

        <div v-else-if="action == 'undefined'">
            <div class="text-md-center mt-6">
                <span class="fs-16 font-weight-bold">
                    {{taskInfo.action.parameter.title}}
                </span>
            </div>
            <div class="text-md-center ">
                <span class="text--grey fs-14 mt-6">
                    {{taskInfo.action.parameter.description}}
                </span>
            </div>
        </div>
    </div>
</template> 
<script>
import DocumentSubmit from "./../document/submit/Submit.vue";
import BPMNEngine from '../../api/BPMNEngine';
import Detail from "./../document/detail/Detail";
import { getProcessInstanceVarsMap } from '../../components/process/processAction';
export default {
    components: {
        DocumentSubmit: DocumentSubmit,
        Detail
    },
    created(){
        console.log(this,'thissthissthissthissthissthissthissthiss');
        
    },
    data(){
        return {
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
            documentObjectId: 0
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
        }
    },
    watch: {
        taskInfo: {
            deep: true,
            immediate: true,
            handler: async function (after, before) {
                console.log(after, before, "after taskInfo change");
                if(this.taskInfo.action){
                    let action = this.taskInfo.action.action;
                    this.action = action;
                    let varsMap = await getProcessInstanceVarsMap(this.taskInfo.action.parameter.processInstanceId);
                    
                    this.workflowInfo.documentObjectWorkflowId = this.taskInfo.action.parameter.processDefinitionId;
                    this.workflowInfo.documentObjectWorkflowObjectId = this.taskInfo.action.parameter.processInstanceId;
                    this.workflowInfo.documentObjectTaskId = this.taskInfo.action.parameter.taskId;
                    // cần activityId  của task truyền vào nữa 
                    for(let key in varsMap){
                        this.$set(this.workflowVariable , 'workflow_'+key, varsMap[key].value);
                    }

                    if(action == 'submit'){
                        this.docId = Number(this.taskInfo.action.parameter.documentId);
                    }else if(action == 'approval' || action == 'update'){
                        if(!this.taskInfo.action.parameter.documentObjectId){
                            
                            let approvaledElId = this.taskInfo.targetElement;
                            let docObjId = varsMap[approvaledElId+'_document_object_id'];
                            this.docObjInfo.docObjId = docObjId.value;
                        }else{
                            this.docObjInfo.docObjId = this.taskInfo.action.parameter.documentObjectId;
                        }
                        this.documentObjectId = this.docObjInfo.docObjId;
                    }
                }
            }
        }
    },
    methods: {
        async handleTaskDetailChange(defId, nodeId){
            if(!defId || !nodeId){
                return;
            }
            this.docId = 0;
            let defModel = await BPMNEngine.getDefinitionModel(defId);
            
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
            this.$refs.submitComponent.submitDocument();
        }
    },
    name: "task"
}
</script>

<style>

</style>
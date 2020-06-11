<template>
    <div class="h-100 w-100 d-flex justify-center"> 
        <DocumentSubmit 
            ref="submitComponent"
            :docId="docId"
            :showSubmitButton="false"
            @submit-document-success="onSubmitDone"
        >

        </DocumentSubmit>
    </div>
</template>

<script>
import DocumentSubmit from "./../document/submit/Submit.vue";
import BPMNEngine from '../../api/BPMNEngine';
export default {
    components: {
        DocumentSubmit: DocumentSubmit
    },
    data(){
        return {
            docId: 0
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
            handler: function (after, before) {
                console.log(after, before, "after taskInfo change");
                this.handleTaskDetailChange(after.processDefinitionId, after.taskDefinitionKey);
                if(after.docId){
                    this.docId = after.docId;
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
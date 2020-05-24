<template>
    <div class="h-100 w-100">
        
    </div>
</template>

<script>
import BPMNEApi from "./../../api/BPMNEngine";
export default {
    data(){
        return {
            startType: 'submit', // các loại bắt đầu quy trình khác nhau: hiện tại chỉ có 1 loại là submit
            documentId: 0, // Nếu là submit cần biết document id là gì để load form
        }
    },
    created(){
        this.getFirstNodeData();
    },
    methods: {
        async getFirstNodeData(){
            let idDefinition = this.$route.params.id;
            let definitionModel = await BPMNEApi.getDefinitionModel(idDefinition);
            this.documentId = definitionModel.mainProcess.initialFlowElement.formKey;
        }
    }
}
</script>

<style>

</style>
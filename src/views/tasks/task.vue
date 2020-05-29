<template>
    <div class="h-100 w-100 d-flex justify-center"> 
        <DocumentSubmit 
            ref="submitComponent"
            :docId="taskInfo.docId"
            :showSubmitButton="false"
            @submit-document-success="onSubmitDone"
        >

        </DocumentSubmit>
    </div>
</template>

<script>
import DocumentSubmit from "./../document/submit/Submit.vue";
export default {
    components: {
        DocumentSubmit: DocumentSubmit
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
    methods: {
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
<template>
    <div class="h-100 w-100"> 
        <DocumentSubmit :docId="taskInfo.docId">

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
    name: "task"
}
</script>

<style>

</style>
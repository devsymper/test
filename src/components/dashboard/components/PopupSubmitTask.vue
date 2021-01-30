<template>
    <v-dialog
        v-model="isShow"
        max-width="21cm"
        scrollable
    >
        <v-card>
        <v-card-title class="px-4">
            <div class="w-100 d-flex justify-space-between">
                <span class="fs-16">Create task</span>
            </div>

        </v-card-title >
        <v-card-text class="p-2">
            <submit
                ref="submitComponent"
                class="doc_issue"
                :action="'submit'"
                :showSnackbarSuccess="false"
                :docId="Number(documentId)"
                :workflowVariable="workflowVariable"
                :showSubmitButton="false"
                @submit-document-success="onSubmitDone"
                />
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
import Submit from '@/views/document/submit/Submit.vue';

export default {
    name: "issue",
    components:{
        Submit,
    },
    data(){
        return{
            isLoading:false,
            isShow:false,
            documentId:null,
            workflowVariable:{
            }
        
        }
    },
   
    computed:{
    },
    methods:{
        show(docId = null){
            if (docId) {
                this.documentId = docId;
            }
            this.isShow=true;
        },
        submitForm(){
            this.isLoading = true;
            this.$refs.submitComponent.handlerSubmitDocumentClick(true);
        },
        onSubmitDone(data){
            this.isLoading = false;
            this.isShow = false;
            this.$emit('gantt-submit-task-done',data);
            this.$snotifySuccess("Create task success!");

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
    .doc_issue >>> table td span{
        width: 100%;
    }
    .doc_issue ::v-deep .s-control{
        font-size: 13px!important;
        margin-top: 0px;
        border-top: 1px solid #efefef!important;
        border: 1px solid #efefef!important;
    }
    .doc_issue >>> .sym-form-submit{
        padding: 4px;
        padding-right: 10px;
    }
    .doc_issue{
        height: 550px!important;
    }

</style>
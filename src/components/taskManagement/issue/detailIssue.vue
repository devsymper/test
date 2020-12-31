<template>
     <v-dialog
        v-model="isShow"
        max-width="21cm"
        :content-class="'detail-issue h-100'"
    >
        <div class="pt-2"  style="border-bottom:1px solid #eee">
            <span class="fs-16 font-weight-medium ml-4">Info Issues</span>
        </div>
        <div style="height:  calc(100% - 70px)">
            <detail
                v-if="!statusEdit"
                :docObjInfo="docObjInfo"
                class="issue"
            />
            <submit
                v-else
                ref="submitComponent"
                class="doc_issue"
                :action="'update'"
                :showSnackbarSuccess="false"
                :docId="Number(documentId)"
                :documentObjectId="Number(docObjInfo.docObjId)"
                :showSubmitButton="false"
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
                v-else
            >
                Submit
            </v-btn>
           
        </div>
    </v-dialog>
</template>

<script>
import Detail from '../../../views/document/detail/Detail.vue';
import Submit from '../../../views/document/submit/Submit.vue';
export default {
  components: { Detail, Submit },
    props:{
        documentObjectId:{
            type: String,
            default: ""
        },
        documentId:{
            type: Number,
            default: 0
        },
    },
    watch:{
        documentObjectId(newVl){
            this.statusEdit = false;
        }
    },
    computed:{
        docObjInfo(){
            return {docObjId:this.documentObjectId};
        }
    },
    data(){
        return{
            isShow:false,
            statusEdit:false,
        }
    },
    methods:{
        show(){
            this.isShow=true;
        },
    }
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
<template>
    
    <v-dialog
        v-model="isShowModelSaveDoc"
        width="800"
        >
        <v-card
        height="550"
        >
            <v-card-title class="headline">Lưu Document</v-card-title>
            <v-divider></v-divider>
            <v-card-text style="height: calc(100% - 112px);    overflow: auto;">
            
                <div id="setting-control-table" class="setting-control-table">
                    <div class="content-setting-control-table">
                        <form-save-doc :allInputs="documentProps"/>
                        
                    </div>
                </div>
            </v-card-text>
                <v-divider></v-divider>

            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="green darken-1"
                text
                right
                @click="saveDocument"
            >
                Lưu
            </v-btn>

            <v-btn
                color="green darken-1"
                text
                right
                @click="hideDialog"
            >
                Đóng
            </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
   
    
</template>
<script>
import TableSettingRow  from "./TableSettingRow.vue";
import FormTpl from "./../../../components/common/FormTpl.vue"
import Sortable from 'sortablejs';
let sortable = null;
export default {
    props:{
        documentProps:{
            type:Object,
            default(){
                return {
                    name: {
                        title: "Tên document",
                        type: "text",
                        value: "",
                    },
                    title: {
                        title: "Tiêu đề document",
                        type: "text",
                        value: "",
                    },
                    recentName: {
                        title: "Tên trường hiển thị thông tin trong mục gần đây",
                        type: "text",
                        value: "",
                    },
                    editObjectValidate: {
                        title: "Điều kiện Edit Object",
                        type: "textarea",
                        value: "",
                    },
                    public: {
                        title: "Public",
                        type: "checkbox",
                        value: "",
                    },
                    mobile: {
                        title: "Mobile",
                        type: "checkbox",
                        value: "",
                    },
                    editAfterSubmit: {
                        title: "Sửa dữ liệu sau submit",
                        type: "checkbox",
                        value: "",
                    },
                    submitOutsideWorkflow: {
                        title: "Submit ngoài workflow",
                        type: "checkbox",
                        value: "",
                    },
                    note: {
                        title: "Ghi chú",
                        type: "textarea",
                        value: "",
                    },
                }
            }
        }
    },
    components:{
        's-row-table-setting' : TableSettingRow,
        'form-save-doc' : FormTpl
    },
    computed: {
        editorStore(){ 
            return this.$store.state.document.editor;
        },
        
        
        
    },
  
    
    data(){
        return {
            listRows:[],
            isShowModelSaveDoc:false,
           
        }
    },
   
    methods:{
        setListRow(listRows){
            this.listRows = listRows;
        },
        showDialog(){
            this.isShowModelSaveDoc = true
        },
        hideDialog(){
            this.isShowModelSaveDoc = false
        },
        
        saveDocument(){
            let documentProperties = JSON.stringify(this.listInput);
            this.$emit("save-doc-action",documentProperties);
            this.hideDialog();
        }
        
    },
    mounted(){
        
    }
}
</script>
<style scoped>
    
</style>
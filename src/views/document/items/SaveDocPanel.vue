<template>
    
    <v-dialog
        v-model="isShowModelSaveDoc"
        width="800"
        >
        <v-card
        height="575"
        >
            <h4 class="headline">Lưu Document</h4>
            <v-divider></v-divider>
            <v-card-text style="height: calc(100% - 84px);    overflow: auto;">
                <div id="setting-control-table" class="setting-control-table">
                    <div class="content-setting-control-table">
                        <form-save-doc 
                        @input-value-keyup="checkValidateNameDocument"
                        @input-value-changed="handleChangeInput" 
                         :allInputs="documentProps"/>
                    </div>
                </div>
            </v-card-text>
                <v-divider></v-divider>

            <v-card-actions class="action">
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
import FormTpl from "./../../../components/common/FormTpl.vue"
import { util } from "./../../../plugins/util.js";
import { documentApi } from "./../../../api/Document.js";

export default {
    
    components:{
        'form-save-doc' : FormTpl
    },
    computed: {
        editorStore(){ 
            return this.$store.state.document.editor;
        },
        documentProps(){
            return this.$store.state.document.documentProps
        }
    },
    data(){
        return {
            listRows:[],
            isShowModelSaveDoc:false,
            isValid :false
        }
    },
    created(){
        this.setPropsOfDoc({});
    },
    methods:{
        //Hàm kiểm tra tên document đã tồn tai hay chưa
        handleChangeInput(name, input, data){
            let thisCpn = this;
            if(this.isValid)
            documentApi
                    .checkExistDocument(input.value)
                    .then(res => {
                        if (res.status == 200) {
                            let message = ""
                            if(res.data === true){
                                message = "Tên document đã tồn tại"
                                thisCpn.isValid = false;
                            }
                            else{
                                thisCpn.isValid = true;
                            }
                            let docProps = util.cloneDeep(thisCpn.documentProps);
                                docProps.name.errorMessage = message;
                                thisCpn.$store.commit('document/addToDocumentStore',{key: 'documentProps',value :docProps})
                        }
                       
                    })
                    .catch(err => {
                        thisCpn.$snotify({
                            type: "error",
                            title: "error from check exist document api!!!"
                        }); 
                    })
                    .always(() => {});
        },
        showDialog(){
            this.isShowModelSaveDoc = true
        },
        hideDialog(){
            this.isShowModelSaveDoc = false
        },
        // Hàm kiểm tra tên document
        checkValidateNameDocument(name, input, data){
            console.log(input);
            
            if(name == 'name'){
                let docProps = util.cloneDeep(this.documentProps);
                let message = "";
                if(input.value.length == 0){
                    message = "Không được bỏ trống";
                    this.isValid = false;
                }
                else{
                    if(/^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(input.value) == false){
                        message = "Tên không hợp lệ";
                        this.isValid = false;
                    }
                    else{
                        this.isValid = true
                    }
                }
                docProps.name.errorMessage = message;
                this.$store.commit('document/addToDocumentStore',{key: 'documentProps',value :docProps})
            }
            
        },
        saveDocument(){
            if(this.isValid){
                this.$emit("save-doc-action");
                this.hideDialog();
            }
            else{
                this.$snotify({
                                type: "error",
                                title: "Vui lòng nhập lại tên document"
                            });  
            }
        },
        setPropsOfDoc(props){
            let docProps = {
                name : { 
                    title: "Tên document",
                    type: "text",
                    value: (props.name != undefined) ? props.name : '',
                },
                title : {
                    title: "Tiêu đề document",
                    type: "text",
                    value: (props.title != undefined) ? props.title : '',
                },
                recentName : {
                    title: "Tên trường hiển thị thông tin trong mục gần đây",
                    type: "text",
                    value: (props.title_for_rencent != undefined) ? props.title_for_rencent : '',
                },
                editObjectValidate : {
                    title: "Điều kiện Edit Object",
                    type: "script",
                    value: (props.edit_condition != undefined) ? props.edit_condition : '',
                },
                public : {
                    title: "Public",
                    type: "checkbox",
                    value: (props.allow_public == '0') ? false : true,
                },
                mobile : {
                    title: "Mobile",
                    type: "checkbox",
                    value: (props.mobile == '0') ? false : true,
                },
                editAfterSubmit : {
                    title: "Sửa dữ liệu sau submit",
                    type: "checkbox",
                    value: (props.edit_able == '0') ? false : true,
                },
                submitOutsideWorkflow : {
                    title: "Submit ngoài workflow",
                    type: "checkbox",
                    value: (props.add_outside_wf == '0') ? false : true,
                },
                note : {
                    title: "Ghi chú",
                    type: "textarea",
                    value: (props.note != undefined) ? props.note : '',
                }
            }
            this.$store.commit('document/addToDocumentStore',{key: 'documentProps',value :docProps})
        }
        
    },
}
</script>
<style scoped>
    .headline{
        font-size: 16px !important;
        font-weight: 500;
        padding: 4px 24px;
    }
    .action{
        height: 41px;
    }
</style>
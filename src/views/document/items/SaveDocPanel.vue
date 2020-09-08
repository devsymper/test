<template>
    
    <div>
        <v-dialog
        scrollable
        v-model="isShowModelSaveDoc"
        width="800"
        content-class="s-dialog"
        >
        <v-card>
            <div class="note-name-change" v-show="showNoteChangeName">
                <span>{{$t('document.editor.dialog.saveDoc.checkNameRelated')}}</span>
                <div class="buble-direction">
                    <span>▼</span>
                </div>
            </div>
            <h4 class="headline">{{$t('document.editor.dialog.saveDoc.heading')}}</h4>
            <v-divider></v-divider>
            <v-card-text style="height: calc(100% - 84px);    overflow: auto;">
                <div id="setting-control-table" class="setting-control-table">
                    <div class="content-setting-control-table">
                        <form-save-doc 
                        @append-icon-click="checkNameDocument"
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
                {{$t('common.save')}}
            </v-btn>

            <v-btn
                color="green darken-1"
                text
                right
                @click="hideDialog"
            >
                {{$t('common.close')}}
            </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
    <validate 
    @after-click-confirm="checkNameDocument" 
    @after-click-ignore="showNoteChangeName = false" 
    :title="'Chú ý'" 
    :message="messageValidate" 
    :isShowAction="true"
     ref="validate" />
    
    </div>
   
    
</template>
<script>
import FormTpl from "./../../../components/common/FormTpl.vue"
import { util } from "./../../../plugins/util.js";
import { documentApi } from "./../../../api/Document.js";
import Validate from "./../common/Validate";

export default {
    
    components:{
        'form-save-doc' : FormTpl,
        "validate": Validate,
    },
    props:{
        instance:{
            type:Number,
            default:Date.now()
        }
    },
    computed: {
        editorStore(){ 
            return this.$store.state.document.editor[this.instance];
        },
        documentProps(){
            return this.$store.state.document.documentProps[this.instance];
        }
    },
    data(){
        return {
            listRows:[],
            isShowModelSaveDoc:false,
            isValid :false,
            messageValidate:"",
            showNoteChangeName:false,
            showValidate:true,
        }
    },
    created(){
        this.setPropsOfDoc({});
    },
    methods:{
        checkNameDocument(){
            this.$emit('check-name-document');
        },
        //Hàm kiểm tra tên document đã tồn tai hay chưa
        handleChangeInput(name, input, data){
            
            this.showNoteChangeName = true;
            
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
                                thisCpn.$store.commit('document/addToDocumentPropsEditor',{key: thisCpn.instance,value :docProps})
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
                this.$store.commit('document/addToDocumentPropsEditor',{key: this.instance,value :docProps})
            }
            
        },
        saveDocument(){
            if(this.showValidate && this.showNoteChangeName && this.$route.name == 'editDocument'){
                this.showValidate = false;
                this.messageValidate = "Tên của văn bản này có thể được sử dụng trong công thức ở các đối tượng trong hệ thống. Chọn kiểm tra để kiểm tra lại các đối tượng";
                this.$refs.validate.show(false)
            }
            else{
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
            }
            
        },
        setPropsOfDoc(props){
            if(props.name != undefined){
                this.isValid = true
            }
            let docProps = {
                name : { 
                    title: "Tên document",
                    type: "text",
                    value: (props.name != undefined) ? props.name : '',
                    appendIcon:"mdi-checkbox-multiple-marked-circle-outline",
                    oldName:(props.name != undefined) ? props.name : ''
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
                fullSize : {
                    title: "Toàn màn hình",
                    type: "checkbox",
                    value: (parseInt(props.isFullSize) === 0) ? false : true,
                },
                // editObjectValidate : {
                //     title: "Điều kiện Edit Object",
                //     type: "script",
                //     value: (props.edit_condition != undefined) ? props.edit_condition : '',
                // },
                // public : {
                //     title: "Public",
                //     type: "checkbox",
                //     value: (props.allow_public == '0') ? false : true,
                // },
                // mobile : {
                //     title: "Mobile",
                //     type: "checkbox",
                //     value: (props.mobile == '0') ? false : true,
                // },
                // editAfterSubmit : {
                //     title: "Sửa dữ liệu sau submit",
                //     type: "checkbox",
                //     value: (props.edit_able == '0') ? false : true,
                // },
                // submitOutsideWorkflow : {
                //     title: "Submit ngoài workflow",
                //     type: "checkbox",
                //     value: (props.add_outside_wf == '0') ? false : true,
                // },
                note : {
                    title: "Ghi chú",
                    type: "textarea",
                    value: (props.note != undefined) ? props.note : '',
                }
            }
            this.$store.commit('document/addToDocumentPropsEditor',{key: this.instance,value :docProps})
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
    .note-name-change{
        position: absolute;
        right: 40px;
        top: 38px;
        border-top-left-radius: inherit;
        border-top-right-radius: inherit;
        background: #707070;
        z-index: 999;
        padding: 2px 8px;
        border-radius: 4px;
        transition: all ease-in-out 250ms;
    }
    .note-name-change > span{
        color: white;
        font-size: 12px;
    }
    .buble-direction{
        position: relative;
    }
    .buble-direction span{
        position: absolute;
        color: #707070;
        top: -8px;
        right: 10px;
    }
</style>
<style>
    .s-dialog{
        overflow: hidden;
    }
</style>
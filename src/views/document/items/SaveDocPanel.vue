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
import { formulasApi } from "./../../../api/Formulas.js";
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
        },
        isConfigPrint:{
            type:Boolean,
            default:false
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
    watch:{
        "documentProps.titleObjectFormulas.formulasId":function(data){
            let self = this;
            if(data != 0){
                formulasApi.detailFormulas(data).then(res=>{
                    self.documentProps.titleObjectFormulas.value = res.data.lastContent;
                })
            }
            
        }
    },
    data(){
        return {
            listRows:[],
            isShowModelSaveDoc:false,
            isValidName :true,
            isValidTitle :true,
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
            if(name == 'name'){
                this.showNoteChangeName = true;
                let thisCpn = this;
                documentApi.checkExistDocument(input.value)
                .then(res => {
                    if (res.status == 200) {
                        let message = ""
                        if(res.data === true){
                            message = "Tên document đã tồn tại"
                            thisCpn.isValidName = false;
                        }
                        else{
                            thisCpn.isValidName = true;
                        }
                        this.documentProps.name.validateStatus.isValid = thisCpn.isValidName;
                        this.documentProps.name.validateStatus.message = message;
                    }
                
                })
                .catch(err => {
                    
                })
                .always(() => {});
            }
            
        },
        showDialog(){
            this.isShowModelSaveDoc = true
        },
        hideDialog(){
            this.isShowModelSaveDoc = false
        },
        // Hàm kiểm tra tên document
        checkValidateNameDocument(value){
            let message = "";
            if(value.length == 0){
                message = "Không được bỏ trống";
                this.isValidName = false;
            }
            else{
                if(/^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(value) == false){
                    message = "Tên không hợp lệ";
                    this.isValidName = false;
                }
                else{
                    this.isValidName = true
                }
            }
            this.documentProps.name.validateStatus.isValid = this.isValidName;
            this.documentProps.name.validateStatus.message = message;
        },
        saveDocument(){
            if(this.isConfigPrint){
                this.$emit("save-form-print-action",this.documentProps);
            }
            else{
                if(this.showValidate && this.showNoteChangeName && this.$route.name == 'editDocument'){
                    this.showValidate = false;
                    this.messageValidate = "Tên của văn bản này có thể được sử dụng trong công thức ở các đối tượng trong hệ thống. Chọn kiểm tra để kiểm tra lại các đối tượng";
                    this.$refs.validate.show(false)
                }
                else{
                    if(this.isValidName && this.isValidTitle){
                        this.saveFormulasForRecord();
                    }
                    else{
                        this.checkValidateNameDocument(this.documentProps.name.value);
                        this.checkTitleDocument();
                    }
                }
            }
        },

        async saveFormulasForRecord(){
            if(this.documentProps.titleObjectFormulas.formulasId != 0){
                let formulas = {};
                formulas['syql'] = this.documentProps.titleObjectFormulas.value;
                let formulaId = this.documentProps.titleObjectFormulas.formulasId;
                await formulasApi.updateFormulas(formulaId,formulas);
            }
            else{
                if(this.documentProps.titleObjectFormulas.value){
                    let formulas = {};
                    formulas['syql'] = this.documentProps.titleObjectFormulas.value;
                    formulas['objectType'] = "document";
                    formulas['objectIdentifier'] = this.documentProps.name.value;
                    formulas['context'] = "";
                    let res = await formulasApi.saveFormulas(formulas);
                    if(res.status == 200){
                        let formulaId = res.data['formulaId'];
                        this.documentProps.titleObjectFormulas.formulasId = formulaId;
                    }
                }
                
            }
            this.$emit("save-doc-action");
            this.hideDialog();
        },
        /**
         * Hàm kiểm tra tiêu đề của doc đã điền hay chưa, nếu chưa thì báo lỗi
         */
        checkTitleDocument(){
            let message = ""
            if(!this.documentProps.title.value){
                this.isValidTitle = false;
                message = "Vui lòng nhập tiêu đề document"
            }
            else{
                this.isValidTitle = true;
                message = ""
            }

            this.documentProps.title.validateStatus.isValid = this.isValidTitle;
            this.documentProps.title.validateStatus.message = message;
        },
        setPropsOfDoc(props){
            if(!props.name){
                this.isValidName = false
            }
            else{
                this.isValidName = true
            }
            if(!props.title){
                this.isValidTitle = false
            }
            else{
                this.isValidTitle = true
            }
            let self = this;
            let docProps = {
                name : { 
                    title: this.$t('document.editor.dialog.saveDoc.name'),
                    type: "text",
                    value: (props.name != undefined) ? props.name : '',
                    appendIcon:"mdi-checkbox-multiple-marked-circle-outline",
                    oldName:(props.name != undefined) ? props.name : '',
                    validateStatus:{
                        isValid:true,
                        message:""
                    },
                    validate(){
                        self.checkValidateNameDocument(this.value)
                    }
                },
                title : {
                    title: this.$t('document.editor.dialog.saveDoc.title'),
                    type: "text",
                    value: (props.title != undefined) ? props.title : '',
                    validateStatus:{
                        isValid:true,
                        message:""
                    },
                    validate(){
                        self.checkTitleDocument(this.value)
                    }
                },
                fullSize : {
                    title: this.$t('document.editor.dialog.saveDoc.fullSize'),
                    type: "checkbox",
                    value: (parseInt(props.isFullSize) === 0) ? false : true,
                },
                type : {
                    title: this.$t('document.editor.dialog.saveDoc.type'),
                    type: "select",
                    value: 1,
                    options: [{
                            text: this.$t('document.editor.dialog.saveDoc.selectType.list'),
                            value: 2
                        },
                        {
                            text: this.$t('document.editor.dialog.saveDoc.selectType.system'),
                            value: 3
                        },
                        {
                            text: this.$t('document.editor.dialog.saveDoc.selectType.business'),
                            value: 1
                        },
                    ],
                },
            
                note : {
                    title: this.$t('document.editor.dialog.saveDoc.note'),
                    type: "textarea",
                    value: (props.note != undefined) ? props.note : '',
                },
                titleObjectFormulas: {
                    title: this.$t('document.editor.dialog.saveDoc.titleObject'),
                    value: "",
                    formulasId: (props.titleObjectFormulasId != undefined) ? props.titleObjectFormulasId : 0,
                    type: "script",
                    groupType: "formulas"
                }
            }
            if(this.isConfigPrint){
                docProps = {
                    title : {
                        title: this.$t('document.editor.dialog.saveDoc.titlePrint'),
                        type: "text",
                        value: (props.title != undefined) ? props.title : '',
                    },
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
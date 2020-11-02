<template>
    <div :class="{
    'wrap-content-submit':true,
    'sym-sub-form-submit':(parrentInstance == 0) ? false : true

    }">
    <VuePerfectScrollbar class="scroll-content h-100">
         <date-picker
            :keyInstance="keyInstance"
            @clickDateCell="selectedDate"
            :title="'Chọn ngày'"
            :isTime="false"
            ref="datePicker"
        />
        <Preloader ref="preLoaderView"/>
        <div
            :key="keyInstance"
            class="sym-form-submit"
            :id="'sym-submit-'+keyInstance"
            :style="{'width':docSize, 'height':'100%','opacity':0}"
        >
            <div v-html="contentDocument"></div>
            <!-- <button v-on:click="togglePageSize" v-show="!isQickSubmit" id="toggle-doc-size">
                <span class="mdi mdi-arrow-horizontal-lock"></span>
            </button> -->
            <autocomplete-input
                ref="autocompleteInput"
                @after-select-row="afterSelectRowAutoComplete"
                @open-sub-form="openSubFormSubmit"
                @before-close="isShowSubFormSubmit = false"
            />
            <sym-drag-panel
                ref="symDragPanel"
                :dragPanelWidth="600"
                :topPosition='topPositionDragPanel'
                :leftPosition="leftPositionDragPanel"
                :actionTitle="titleDragPanel"
                :titleIcon="titleDragPanelIcon"
                :styleBody="{overflow:'hidden',width:'100%'}"
            >
                <template slot="drag-panel-content">
                    <!-- <submitDocument :isQickSubmit="true" :docId="340" v-if="!isQickSubmit"/> -->
                    <filter-input @save-input-filter="saveInputFilter" @search-data="searchDataFilter" :tableMaxHeight="500" ref="inputFilter"></filter-input>
                </template>
            </sym-drag-panel>
            <input type="file" :id="'file-upload-alter-'+keyInstance" class="hidden d-none" />
            <user-select :keyInstance="keyInstance" @after-select-user="afterSelectUser" ref="userInput" />
            <validate :keyInstance="keyInstance" :message="messageValidate" ref="validate" />
           
            <time-input 
            :keyInstance="keyInstance"  
            @apply-time-selected="applyTimePicker" 
            @after-check-input-time-valid="afterCheckTimeNotValid" 
            ref="timeInput" />
            <v-speed-dial
                v-if="parrentInstance == 0"
                v-show="showSubmitButton"
                v-model="fab"
                :top="top"
                :bottom="bottom"
                :right="right"
                :left="left"
                :direction="direction"
                :open-on-hover="hover"
                :transition="transition"
                style="z-index:9999;"
            >
                <template v-slot:activator>
                    <v-btn v-model="fab" color="blue darken-2" dark fab>
                        <v-icon v-if="fab">mdi-close</v-icon>
                        <v-icon v-if="!fab && !isSubmitting">mdi-menu</v-icon>
                        <v-progress-circular indeterminate v-show="isSubmitting" color="red"></v-progress-circular>
                    </v-btn>
                </template>
                
                <v-tooltip left>
                    <template v-slot:activator="{ on }">
                        <div v-on="on">
                            <v-btn fab dark small :disabled="isSubmitting" color="green" @click="handlerSubmitDocumentClick">
                                <v-icon>mdi-content-save</v-icon>
                            </v-btn>
                        </div>
                    </template>
                    <span>{{$t('document.submit.fab.submit')}}</span>
                </v-tooltip>
                
                <v-tooltip left>
                    <template v-slot:activator="{ on }">
                        <div v-on="on">
                            <v-btn
                                v-if="isDraft != 1"
                                fab
                                dark
                                small
                                color="indigo"
                                @click="handlerDraftClick"
                            >
                                <v-icon>mdi-trash-can-outline</v-icon>
                            </v-btn>
                        </div>
                    </template>
                    <span>{{$t('document.submit.fab.draft')}}</span>
                </v-tooltip>
                <v-tooltip left>
                    <template v-slot:activator="{ on }">
                        <div v-on="on">
                            <v-btn
                                fab
                                dark
                                small
                                color="secondary"
                                @click="togglePageSize"
                            >
                                <v-icon>mdi-resize</v-icon>
                                
                            </v-btn>
                        </div>
                    </template>
                    <span>{{$t('document.submit.fab.toggleSize')}}</span>
                </v-tooltip>
            </v-speed-dial>
            <err-message :listErr="listMessageErr" ref="errMessage"/>
        </div>
        <EmbedDataflow 
        @after-mounted="afterDataFlowMounted" 
        @dataflow-finished-running="afterRunDataflow"
        v-for="dataFlow in listDataFlow" 
        :key="dataFlow.id"  
        :dataflowId="dataFlow.id" 
        :width="'100%'"
        :ref="'dataFlow'+dataFlow.id"/>
        <UploadFile 
        :objectType="'document'"
        :iconName="`mdi-upload-outline`"
        ref="fileUploadView"
        class="d-none"
        @uploaded-file="afterFileUpload"
        :objectIdentifier="docId+''" />
        <FloattingPopup 
                ref="floattingPopup" 
                :focusingControlName="focusingControlName"
                :instance="keyInstance"/>
         
        <div class="sub-form-action" v-if="parrentInstance != 0">
            <button @click="goToListDocument()" class=subfom-action__item>{{$t('document.submit.goToList')}}</button>
            <button @click="handlerSubmitDocumentClick(true);" class=subfom-action__item><span class="mdi mdi-content-save-move-outline"></span>{{$t('document.submit.continueSubmit')}}</button>
            <button @click="handlerSubmitDocumentClick" class=subfom-action__item><span class="mdi mdi-content-save-settings-outline"></span>{{$t('document.submit.fab.submit')}}</button>
        </div>
        </VuePerfectScrollbar>
        <v-navigation-drawer
            v-if="parrentInstance == 0 && drawer" 
            :width="(isShowTraceControlSidebar) ? 300 : 830"
            v-model="drawer"
            class="pa-3"
            absolute
            right
            temporary
            :hide-overlay="isShowTraceControlSidebar"
            style="z-index:9999"
        >
            <submitDocument v-if="parrentInstance == 0 && docSubFormId != 0" 
            :showSubmitButton="false"
            :parrentInstance="keyInstance" 
            @submit-document-success="submitSubFormSuccess"
            ref="subSubmitView" :isQickSubmit="true" :action="'submit'" :docId="docSubFormId"/>
            <SidebarTraceFormulas 
            :documentInfo="documentInfo"
            :controlTrace="controlTrace"
            :keyInstance="keyInstance"
            :listFormulasTrace="listFormulasTrace"
            ref="traceControlView" 
            v-show="isShowTraceControlSidebar" />
        </v-navigation-drawer>

    </div>
     
</template>
<script>
import { documentApi } from "./../../../api/Document.js";
import { formulasApi } from "./../../../api/Formulas.js";
import { userApi } from "./../../../api/user.js";
import "./../../../components/document/documentContent.css";
import { setDataForPropsControl,allControlNotSetData } from "./../../../components/document/dataControl";
import BasicControl from "./basicControl";
import TableControl from "./tableControl";
import ActionControl from "./actionControl";
import LayoutControl from "./layoutControl";
import PageControl from "./pageControl";
import TabControl from "./tabControl";
import DatePicker from "./../../../components/common/DateTimePicker";
import TimeInput from "./../../../components/common/TimeInput";
import UploadFile from "@/components/common/UploadFile.vue";
import Table from "./table.js";
import SymperDragPanel from "./../../../components/common/SymperDragPanel.vue";
import { util } from "./../../../plugins/util.js";
import AutocompleteInput from "./items/AutocompleteInput.vue";
import User from "./items/User.vue";
import Filter from "./items/Filter.vue";
import Validate from "./../common/Validate";
import ClientSQLManager from "./clientSQLManager.js";
import Util from './util';
import SidebarTraceFormulas from './SidebarTraceFormulas.vue';
import './customControl.css';
import ErrMessagePanel from "./../../../views/document/items/ErrMessagePanel.vue";
import moment from "moment-timezone";
import EmbedDataflow from "@/components/dataflow/EmbedDataflow";
// import Loader from './../../../components/common/Loader';
import Preloader from './../../../components/common/Preloader';
import {listControlNotNameProp} from "./../../../components/document/controlPropsFactory.js"
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import FloattingPopup from './../common/FloattingPopup'



import { checkCanBeBind, resetImpactedFieldsList, markBinedField } from './handlerCheckRunFormulas';
import {checkDbOnly,getControlInstanceFromStore,getControlTitleFromName, getListInputInDocument,mapTypeToEffectedControl} from './../common/common'
import Formulas from './formulas.js';
let impactedFieldsList = {};
let impactedFieldsArr = {};

export default {
    inject: ['theme'],
    props: {
        isQickSubmit: {
            type: Boolean,
            default: false
        },
        docId: {
            type: Number,
            default: 0
        },
        showSubmitButton: {
            default: true
        },
        documentObjectId:{
            type:Number,
            default:0
        },
        action:{ // submit hoặc update
            type:String,
            default:''
        },
        documentObjectWorkflowObjectId: {
            type: String,
            default: ''
        },
        documentObjectWorkflowId: {
            type: String,
            default: ''
        },
        documentObjectTaskId: {
            type: String,
            default: ''
        },
        /**
         * Biến chỉ ra bản ghi nằm trong app nào
         */
        appId:{
            type:Number,
            default:0
        },
        
        workflowVariable:{
            type:Object,
            default(){
                return {}
            }
        },
        /**
         * Tham số truyền các formulas thay thế cho các control
         * vd: {ma_pl:{formulas:'SELECT "nnn"'},tb1_ma_hang:{formulas:'SELECT "aaaaa"'}}
         */
        overrideControls:{
            type:Object,
            default(){
                return {}
            }
        },
        /**
         * Tham số truyên vào chỉ ra control nào được nhập liệu
         * vd:['mct','tb1_ma_hang']
         */
        editableControls:{
            type:Array,
            default(){
                return null
            }
        },
        parrentInstance:{
            type:Number,
            default:0
        },
        dataPreview:{
            type:Object,
            default(){
                return {}
            }
        }
    },
    name: "submitDocument",

    components: {
        "validate": Validate,
        "user-select": User,
        "date-picker": DatePicker,
        "time-input": TimeInput,
        "filter-input": Filter,
        "autocomplete-input": AutocompleteInput,
        "sym-drag-panel": SymperDragPanel,
        "err-message": ErrMessagePanel,
        EmbedDataflow,
        Preloader,
        UploadFile,
        SidebarTraceFormulas,
        VuePerfectScrollbar,
        FloattingPopup
    },
    computed: {
        sDocumentEditor() {
            return this.$store.state.document.editor[this.keyInstance];
        },
        sDocumentSubmit() {
            return this.$store.state.document.submit[this.keyInstance];
        },
        endUserInfo(){
            return this.$store.state.app.endUserInfo;
        },
        viewType(){
            return this.$store.state.document.viewType[this.keyInstance]
        },
        linkControl(){
            return this.$store.state.document.linkControl[this.keyInstance]
        }
    },
    data() {
        return {
            focusingControlName: '',
            contentDocument: null,
            documentInfo:null,
            documentId: null,
            documentName: null,
            docSize: null,
            editorDoc: null,
            isShowSubFormSubmit: false,
            keyInstance: Date.now(),
            titleDragPanel: null,
            titleDragPanelIcon: null,
            direction: "top",
            fab: false,
            fling: false,
            hover: false,
            tabs: null,
            top: false,
            right: true,
            bottom: true,
            left: false,
            transition: "slide-y-reverse-transition",
            isSubmitting: false,
            columnsSQLLiteDocument:null,
            docObjId:null,
            topPositionDragPanel:100,
            leftPositionDragPanel:300,
            listMessageErr:[],
            titleValidate:"",
            messageValidate:"",
            cacheDataRunFormulas:{},
			isDraft:0,
            preDataSubmit:{},
            objectIdentifier:{},
            otherInfo:{},
            listDataFlow:[],
            docSubFormId:0,
            drawer: false,
            isContinueSubmit:false,
            titleObjectFormulas:null,
            isShowTraceControlSidebar:false,
            listFormulasTrace:{},
            controlTrace:null,
            listFileControl:[],
            currentImageControl:null,
            currentControlDataflow:null
        };

    },
    beforeMount() {
        this.columnsSQLLiteDocument = {};
    },
    mounted() {
        this.editorDoc = $(".sym-form-submit");
        let thisCpn = this;
        $("#file-upload-alter-" + this.keyInstance).on("change", function(e) {
            let name = $(this).attr("data-control-name");
            let rowId = $(this).attr("data-rowid");
            thisCpn.sDocumentSubmit.listInputInDocument[name].addFile(
                $(this).prop("files")[0],
                rowId
            );
            $(this).val('')
        });
        $('.sym-form-submit').on('click','.validate-icon',function(e){
            let msg = $(this).attr('title');
            thisCpn.messageValidate = msg;
            thisCpn.$refs.validate.show(e);

        });
        $(document).find('#sym-submit-'+this.keyInstance).off('click','.run-dataflow')
        $(document).find('#sym-submit-'+this.keyInstance).on('click','.run-dataflow',function(e){
            let idControl = $(this).closest('.s-control-data-flow').attr('id');
            let control = thisCpn.sDocumentEditor.allControl[idControl];
            thisCpn.currentControlDataflow = control;
            let dataParams = thisCpn.getParamsForRunDataFlow(control.properties);
            let element = thisCpn.$refs['dataFlow'+control.properties.dataFlowId.value][0].runDataflow(dataParams);
        });
        $(document).find('#sym-submit-'+this.keyInstance).off('click','.info-control-btn')
        $(document).find('#sym-submit-'+this.keyInstance).on('click','.info-control-btn',function(e){
            thisCpn.focusingControlName = $(e.target).attr('data-control');
            thisCpn.$refs.floattingPopup.show(e, $('#sym-submit-'+thisCpn.keyInstance));
        });
    },

    async created() {
        await ClientSQLManager.createDB(this.keyInstance);
        this.$store.commit("document/setDefaultSubmitStore",{instance:this.keyInstance});
        this.$store.commit("document/setDefaultDetailStore",{instance:this.keyInstance});
        this.$store.commit("document/setDefaultEditorStore",{instance:this.keyInstance});
        this.setWorkflowVariableToStore(this.workflowVariable)
        // đặt trang thái của view là submit => isDetailView = false
        this.$store.commit("document/changeViewType", {
                key: this.keyInstance,
                value: this.action,
            });
        let thisCpn = this;
        if (this.docId != 0) {
            this.documentId = this.docId;
        } else if (this.$getRouteName() == "submitDocument") {
            this.$store.commit("document/changeViewType", {
                key: this.keyInstance,
                value: 'submit',
            });
            this.documentId = this.$route.params.id;
        } else if (this.$getRouteName() == "updateDocumentObject") {
            this.$store.commit("document/changeViewType", {
                key: this.keyInstance,
                value: 'update',
            });
            this.docObjId = this.$route.params.id;
        }

        // Nếu truyền vào documentObjectId
        if(this.documentObjectId){
            this.docObjId = this.documentObjectId;
        }
        

        if(this.documentId != null && this.documentId != 0){
            this.loadDocumentData();
        }
        if(this.docObjId != null){
            this.loadDocumentObject();
        }

        this.$evtBus.$on("on-info-btn-in-table-click", locate => {
            if(thisCpn._inactive == true) return;
            let e = locate.e;
            let row = locate.row;
            let controlName = locate.controlName;
            this.focusingControlName = controlName;
            this.$refs.floattingPopup.show(e, $('#sym-submit-'+this.keyInstance), row);
        });

        this.$evtBus.$on("run-formulas-control-outside-table", e => {
            if(thisCpn._inactive == true) return;
            try {
                let formulasInstance = e.formulasInstance;
                let controlName = e.controlName;
                let controlInstance = thisCpn.sDocumentSubmit.listInputInDocument[controlName];
                let controlId = controlInstance.id
                let dataInput = this.getDataInputFormulas(formulasInstance);

                this.handlerBeforeRunFormulasValue(formulasInstance, controlId, controlName, 'formulas');
            } catch (error) {
                
            }
            
        });
        /**
         * Hàm gọi mở sub form submit
         */
        this.$evtBus.$on("document-submit-open-subform", data => {
            if(thisCpn._inactive == true) return;
            try {
                if(thisCpn.drawer == false && thisCpn.docSubFormId == 0){
                    
                    thisCpn.docSubFormId = parseInt(data.docId);
                }   
                thisCpn.drawer = true;
                
            } catch (error) {
                
            }
            
        });
        /**
         * Hàm gọi mở upload file
         */
        this.$evtBus.$on("document-submit-image-click", data => {
            if(thisCpn._inactive == true) return;
            this.currentImageControl = {el:$(data.e.target).closest('.s-control-image'),controlName:data.e.controlName, controlIns:data.controlIns};
            this.$refs.fileUploadView.onButtonClick();
        });

        // hàm nhận sự kiện thay đổi của input
        this.$evtBus.$on("document-submit-input-change", locale => {
            try {
                if(thisCpn._inactive == true) return;
                let valueControl = locale.val;
                let controlInstance = getControlInstanceFromStore(thisCpn.keyInstance,locale.controlName);
                if(controlInstance.type == 'number' && !/^[-0-9,.]+$/.test(valueControl)){
                    return;
                }
                if($('#'+controlInstance.id).attr('data-autocomplete') != "" && $('#'+controlInstance.id).attr('data-autocomplete') != undefined){
                    $('#'+controlInstance.id).attr('data-autocomplete',"");
                    return;
                }
                if(controlInstance.type == 'user'){
                    valueControl = $('#'+controlInstance.id).attr('user-id');
                    if(valueControl == undefined) valueControl = 0;
                }
                if(controlInstance.type == 'date'){
                    valueControl = moment(valueControl,'DD-MM-YYYY').format('YYYY-MM-DD');
                }
                thisCpn.updateListInputInDocument(
                    locale.controlName,
                    "value",
                    valueControl
                );
                
                // sau khi thay đổi giá trị input thì kiểm tra require control nếu có
                if(controlInstance.isRequiredControl()){
                    if(controlInstance.isEmpty()){
                        controlInstance.renderValidateIcon('Không được bỏ trống trường thông tin '+locale.controlName)
                    }
                    else{
                        controlInstance.removeValidateIcon();
                    }
                }
                resetImpactedFieldsList(thisCpn.keyInstance);
                thisCpn.handleControlInputChange(locale.controlName);
            } catch (error) {
                
            }
            
            
        });
        this.$evtBus.$on("run-effected-control-when-table-change", control => {
            if(thisCpn._inactive == true) return;
            thisCpn.handlerBeforeRunFormulasValue(control.controlFormulas.formulas.instance,control.id,control.name,'formulas');
        });
        this.$evtBus.$on("document-submit-open-validate-message", e => {
            if(thisCpn._inactive == true) return;
            thisCpn.messageValidate = e.msg;
            thisCpn.$refs.validate.show(e);
        });
       
        this.$evtBus.$on("document-submit-show-time-picker", e => {
            if(thisCpn._inactive == true) return;
            thisCpn.$refs.timeInput.show(e);
        });
        this.$evtBus.$on("document-submit-date-input-click", e => {
            if(thisCpn._inactive == true) return;
            thisCpn.$refs.datePicker.openPicker(e);
            thisCpn.$store.commit("document/updateCurrentControlEditByUser", {
                currentControl: e.controlName,
                instance: thisCpn.keyInstance
            });
        });
        /**
         * Sự kiện bắn ra từ click vào input filter để mở popup
         */
        this.$evtBus.$on("document-submit-filter-input-click", e => {
            if(this._inactive == true) return;
            if($(document).height() - $(e.target).offset().top > 420){
                this.topPositionDragPanel = $(e.target).offset().top + 2 + $(e.target).height();
            }
            else{
                this.topPositionDragPanel = $(e.target).offset().top  - 400 
            }
            if(e.screenX - e.offsetX > 600){
                this.leftPositionDragPanel = e.screenX - e.offsetX ;
            }
            else{
                this.leftPositionDragPanel = e.screenX - e.offsetX - 300;
            }
            this.titleDragPanel = "Tìm kiếm thông tin";
            this.titleDragPanelIcon = "mdi-file-search";
            this.$refs.inputFilter.setControlName(e.controlName);
            this.runInputFilterFormulas(e.controlName);
            this.$refs.symDragPanel.show();
            this.$refs.inputFilter.setFormulas(e.formulas,e.controlName);
            
        }); 
        // hàm nhận sự thay đổi của input autocomplete gọi api để chạy công thức lấy dữ liệu
        this.$evtBus.$on("document-submit-autocomplete-key-event", e => {
            if(thisCpn._inactive == true) return;
            try {
                if((e.e.keyCode >= 97 && e.e.keyCode <= 105) ||
                    (e.e.keyCode >= 48 && e.e.keyCode <= 57) ||
                    (e.e.keyCode >= 65 && e.e.keyCode <= 90) || [189,16,8,32,231].includes(e.e.keyCode)) { // nếu key code là các kí tự chữ và số hợp lệ
                    if(!thisCpn.$refs.autocompleteInput.isShow()){
                        thisCpn.$refs.autocompleteInput.show(e.e);
                        let currentTableInteractive = this.sDocumentSubmit.currentTableInteractive;
                        if(currentTableInteractive != null && currentTableInteractive != undefined)
                        currentTableInteractive.isAutoCompleting = true;
                        thisCpn.$store.commit("document/addToDocumentSubmitStore", {
                            key: 'currentControlAutoComplete',
                            value: e.controlName,
                            instance: thisCpn.keyInstance
                        });
                    }
                    if(e.isSelect == false){
                        thisCpn.getDataForAutocomplete(e,'autocomplete');
                    }
                }
                else if((e.e.keyCode < 37 || e.e.keyCode > 40)){
                    thisCpn.$refs.autocompleteInput.hide();
                }
                
                
            } catch (error) {
                
            }
            
        });
        // sự kiện ném ra khi gõ vào control department
        // một số key code gõ vào thì ko mở hoặc phải đóng đi
        this.$evtBus.$on("document-submit-department-key-event", e => {
            if(thisCpn._inactive == true) return;
            try {
                if((e.e.keyCode >= 97 && e.e.keyCode <= 105) ||
                    (e.e.keyCode >= 48 && e.e.keyCode <= 57) ||
                    (e.e.keyCode >= 65 && e.e.keyCode <= 90) || [189,16,8,32,231].includes(e.e.keyCode)) { // nếu key code là các kí tự chữ và số hợp lệ
                    if(!thisCpn.$refs.autocompleteInput.isShow()){
                        thisCpn.$refs.autocompleteInput.show(e.e);
                        let currentTableInteractive = this.sDocumentSubmit.currentTableInteractive;
                        if(currentTableInteractive != null && currentTableInteractive != undefined)
                        currentTableInteractive.isAutoCompleting = true;
                        thisCpn.$store.commit("document/addToDocumentSubmitStore", {
                            key: 'currentControlAutoComplete',
                            value: e.controlName,
                            instance: thisCpn.keyInstance
                        });
                    }
                    thisCpn.getDataOrgchart(e);
                }
                else if((e.e.keyCode < 37 || e.e.keyCode > 40)){
                    thisCpn.$refs.autocompleteInput.hide();
                }
                
            } catch (error) { 
                
            }
            
        });
        // hàm nhận sự thay đổi của input select gọi api để chạy công thức lấy dữ liệu
        this.$evtBus.$on("document-submit-select-input", e => {
            if(thisCpn._inactive == true) return;
            try {
                thisCpn.$refs.autocompleteInput.show(e.e);
                thisCpn.$store.commit("document/addToDocumentSubmitStore", {
                            key: 'currentControlAutoComplete',
                            value: e.alias,
                            instance: thisCpn.keyInstance
                        });
                thisCpn.$refs.autocompleteInput.setTypeInput(e.type);
                if(e.type == 'combobox'){
                    thisCpn.$refs.autocompleteInput.setSingleSelectCombobox(e.isSingleSelect);
                }
                thisCpn.getDataForAutocomplete(e,e.type,e.alias);
            } catch (error) {
                
            }
           
        });
        // click outside
        this.$evtBus.$on("symper-app-wrapper-clicked", evt => {
            if(evt == undefined){
                return;
            }
            if(thisCpn._inactive == true) return;
            try {
                if (
                    !$(evt.target).hasClass("s-control-combobox") &&
                    !$(evt.target).hasClass("s-control-select") &&
                    $(evt.target).closest(".card-autocomplete").length == 0
                ) {
                    thisCpn.$refs.autocompleteInput.hide();
                    let currentTableInteractive = thisCpn.sDocumentSubmit.currentTableInteractive
                    if(currentTableInteractive != null)
                        currentTableInteractive.isAutoCompleting = false;
                }
                if (
                    !$(evt.target).hasClass("s-control-user") &&
                    !$(evt.target).hasClass("card-list-user") &&
                    $(evt.target).closest(".card-list-user").length == 0
                ) {
                    thisCpn.$refs.userInput.hide();
                }
                if( !$(evt.target).hasClass("info-control-btn") &&
                    !$(evt.target).hasClass("s-floatting-popup") &&
                    $(evt.target).closest(".s-floatting-popup").length == 0){
                    this.$refs.floattingPopup.hide();
                }
                if (
                    !$(evt.target).hasClass("s-control-date") &&
                    !$(evt.target).hasClass("card-datetime-picker") &&
                    $(evt.target).closest(".card-datetime-picker").length == 0
                ) {
                    thisCpn.$refs.datePicker.closePicker();
                }
                if (
                    !$(evt.target).hasClass("s-control-time") &&
                    !$(evt.target).hasClass("card-time-picker") &&
                    $(evt.target).closest(".card-time-picker").length == 0
                ) { 
                    setTimeout(() => {
                        thisCpn.$refs.timeInput.hide();
                    }, 20);
                }
                if (
                    !$(evt.target).hasClass("validate-icon") &&
                    !$(evt.target).hasClass("card-validate") &&
                    $(evt.target).closest(".card-validate").length == 0
                ) {
                    thisCpn.$refs.validate.hide();
                }
               
                
            } catch (error) {
                
            }
        });
        /**
         * Sự kiện bắn ra khi ấn f2 vào 1 control để trace formulas
         */
        this.$evtBus.$on('document-submit-show-trace-control',data=>{
            data.control.renderCurrentTraceControlColor();
            thisCpn.controlTrace = data.control.name;
            let controlFormulas = data.control.controlFormulas;
            thisCpn.listFormulasTrace = controlFormulas;
            thisCpn.isShowTraceControlSidebar = true;
            thisCpn.drawer = true;
        })
    },
    watch: {
        docId(after) {
            this.documentId = after;
            this.loadDocumentData();
        },
        workflowVariable:{
            deep: true,
            immediate:true,
            handler: function (after, before) {
                // alert('watch')
                this.setWorkflowVariableToStore(after)
            }
        },
        documentObjectId(after){
            this.docObjId = after;
            this.loadDocumentObject();
        },
        '$route' (to) {
            this.$refs.symDragPanel.hide();         
        },
        "sDocumentSubmit.readySubmit":function(data){
            if(data == true){
                this.submitDocument();
            }
        },
        /**
         * watch từ store xem các control root  đã chạy xong chưa -> set defaul row cho table lúc shift+enter
         * trường hợp submit doc
         */
        "sDocumentSubmit.readyLoaded":function(data){
            if(data == true){
                this.hidePreloader();
                setTimeout((self) => {
                        if(self.viewType === 'submit'){
                            let listControlRootInTable = self.sDocumentSubmit.listTableRootControl;
                            for(let tableName in listControlRootInTable){
                                let tableControl = getControlInstanceFromStore(self.keyInstance,tableName);
                                let listDataControlRoot = listControlRootInTable[tableName];
                                let rowData = [];
                                for(let controlName in listDataControlRoot){
                                    let cellValue = tableControl.tableInstance.tableInstance.getDataAtRowProp(0,controlName);
                                    rowData.push([0,controlName,cellValue]);
                                }
                                self.$store.commit("document/updateDataToTableControlRoot",
                                {instance:self.keyInstance,value:rowData,controlName:'defaultRow',tableName:tableName});
                            }
                        }
                }, 1000,this);
            }
        },
        /**
         * watch từ store xem các control root trong table đã chạy xong chưa -> set defaul row cho table lúc shift+enter
         * trường hợp update doc
         */
        "sDocumentSubmit.listTableRootControl":function(data){
            if(this.viewType === 'submit'){
                return;
            }
            setTimeout((self) => {
                for(let tableName in data){
                    let listDataControlRoot = data[tableName];
                    let s = Object.values(listDataControlRoot);
                    if( Object.values(listDataControlRoot).includes(false) == false){
                        let rowData = [];
                        for(let controlInTb in listDataControlRoot){
                            rowData.push([0,controlInTb,listDataControlRoot[controlInTb]])
                        }
                        self.$store.commit("document/updateDataToTableControlRoot",
                        {instance:self.keyInstance,value:rowData,controlName:'defaultRow',tableName:tableName});
                    }
                }
            }, 500,this);
            
        },

        drawer(after){
            if(this.isShowTraceControlSidebar && after == false){
                this.$refs.traceControlView.removeTrace();
                this.$refs.traceControlView.removeCurrentControlTrace();
            }
        },
        dataPreview:{
            immediate:true,
            deep:true,
            handler:function(vl){
                if(Object.keys(vl) == 0){
                    return
                }
                this.contentDocument = vl.content;
                setTimeout((self) => {
                    setDataForPropsControl(vl.fields,self.keyInstance,'submit');
                }, 500,this);
                setTimeout(() => {
                    this.processHtml(vl.content);
                }, 700);
            }
        }
    },
    
    methods: {
        
        /**
         * Hàm ẩn loader
         */
        hidePreloader(){
            
            this.$refs.preLoaderView.hide();
            $("#sym-submit-" + this.keyInstance).find('.page-content').removeClass('d-block');
            $("#sym-submit-" + this.keyInstance).find('.list-page-content').removeClass('d-flex');
            $("#sym-submit-" + this.keyInstance).css({opacity:'1'});
        },
        // hàm lây các tham số trong workflow phục vụ cho submit
        getParamsForRunDataFlow(properties){
            let mapControlToParams = properties.mapParamsDataflow.value;
            let dataParams = {}
            if(mapControlToParams){
                for (let index = 0; index < mapControlToParams.length; index++) {
                    let item = mapControlToParams[index];
                    let param = item.name
                    let controlName = item.controlName;
                    let listInputInDocument = getListInputInDocument(this.keyInstance);
                    if(param != null && param != "" && controlName != null && controlName !="")
                    dataParams[param] = listInputInDocument[controlName].value;
                } 
            }
            return dataParams
        },
        setWorkflowVariableToStore(after){
            this.$store.commit("document/addToDocumentSubmitStore", {
                    key: 'workflowVariable',
                    value: util.cloneDeep(after),
                    instance: this.keyInstance
                }); 
        },
        saveInputFilter(data){
            this.handleInputChangeBySystem(data.controlName,data.value);
            this.$refs.symDragPanel.hide();
        },
        searchDataFilter(data){
            if(this._inactive == false) return;
            this.runInputFilterFormulas(data.controlName,data.search);
        },
        /**
         * Sau khi compon dataflow load xong thì cần gán lại html vào control tương ứng
         */
        afterDataFlowMounted(id){
            for (let index = 0; index < this.listDataFlow.length; index++) {
                const controlDataFlow = this.listDataFlow[index];
                let dataFlowActionEl = controlDataFlow.el.find('.run-dataflow').detach();
                controlDataFlow.el.find('div').first().addClass('d-none')
                let element = $(this.$refs['dataFlow'+controlDataFlow.id][0].$el);
                
                controlDataFlow.el.append(dataFlowActionEl);
                controlDataFlow.el.append(element.detach());
                controlDataFlow.el.find('.run-dataflow').css({display:'block'})
                
            }
        },
        /**
         * Hàm callback sau khi chạy xong dataflow
         */
        afterRunDataflow(){
            let controlName = this.currentControlDataflow.properties.name.value;
            let controlIns = getControlInstanceFromStore(this.keyInstance,controlName);
            let controlEffected = controlIns.getEffectedControl();
            this.runFormulasControlEffected(controlIns.name,controlEffected);
        },
        getDataOrgchart(e){
            let thisCpn = this;
            let aliasControl = e.formulasInstance.autocompleteDetectAliasControl();
            let dataFromCache = this.getDataAutocompleteFromCache(e.e.target.value, aliasControl);
            if(dataFromCache == false){
                let dataInput = this.getDataInputFormulas(e.formulasInstance,e);
                e.formulasInstance.handleBeforeRunFormulas(dataInput).then(res=>{
                    res.status = 200
                    thisCpn.setDataForControlAutocomplete(res,aliasControl,e.controlTitle,true)
                });
            }
            else{
                this.$refs.autocompleteInput.setAliasControl(aliasControl);
                this.$refs.autocompleteInput.setData(dataFromCache);
            }
        },
        /**
         * Hàm chạy công thức autocomplete để đổ dữ liệu vào box autucomplete, control select cũng dùng trường hợp này
         */
        getDataForAutocomplete(e,type,aliasControl=""){ 
            let thisCpn = this
            if(['select','combobox'].includes(type)){
                let dataInput = this.getDataInputFormulas(e.selectFormulasInstance);  
                e.selectFormulasInstance.handleRunAutoCompleteFormulas(dataInput).then(res=>{
                    thisCpn.setDataForControlAutocomplete(res,aliasControl,e.controlTitle,false)
                });
            }
            else{
                let aliasControl = e.autocompleteFormulasInstance.autocompleteDetectAliasControl();
                let dataFromCache = this.getDataAutocompleteFromCache(e.e.target.value, aliasControl);
                if(dataFromCache == false){
                    let dataInput = this.getDataInputFormulas(e.autocompleteFormulasInstance,e);
                    let currentTableInteractive = this.sDocumentSubmit.currentTableInteractive;
                    if(currentTableInteractive != null){
                        let cellMeta = currentTableInteractive.tableInstance.getSelected();
                        for(let controlName in dataInput){
                            if(Array.isArray(dataInput[controlName])){
                                dataInput[controlName] = dataInput[controlName][cellMeta[0][0]]
                            }
                        }
                    }
                    e.autocompleteFormulasInstance.handleRunAutoCompleteFormulas(dataInput).then(res=>{
                        thisCpn.setDataForControlAutocomplete(res,aliasControl,e.controlTitle,false)
                    });
                }
                else{
                    this.$refs.autocompleteInput.setAliasControl(aliasControl);
                    this.$refs.autocompleteInput.setData(dataFromCache);
                }
            }
        },

        // hàm lấy data từ cache của control autocomplete
        getDataAutocompleteFromCache(curTyping,controlName){
            if(this.sDocumentSubmit.autocompleteData.hasOwnProperty(controlName) &&
                this.sDocumentSubmit.autocompleteData[controlName].header.length > 0 &&
                this.sDocumentSubmit.autocompleteData[controlName].cacheData.hasOwnProperty(curTyping)
            ){
                return {
                    headers:this.sDocumentSubmit.autocompleteData[controlName].header,
                    dataBody:this.sDocumentSubmit.autocompleteData[controlName].cacheData[curTyping]
                }
            }
            else{
                return false
            }
        },
        /**
         * Hàm bind dữ liệu cho box autocomplete, cho component autocompleteInput
         * và đưa dữ liệu vào cache
         */
        setDataForControlAutocomplete(res,aliasControl,controlTitle, fromSqlite=false){
            let controlAs = {};
            controlAs[aliasControl] = controlTitle;
            if(res.data != undefined){
                if(res.status == 200 && res.data != false){
                    let dataTable = {}
                    if(!fromSqlite && res.data.data !== ""){
                        dataTable = this.handleDataAutoComplete(res.data.data,fromSqlite,controlAs);
                    }
                    else{
                        dataTable = this.handleDataAutoComplete(res.data,fromSqlite,controlAs);
                    }
                    this.$refs.autocompleteInput.setAliasControl(aliasControl);
                    this.$refs.autocompleteInput.setData(dataTable);
                    if(dataTable.hasOwnProperty('headers')){
                        let item = {}
                        let textTyping = this.getTextTypingInSqlQuery(res.data.sql);
                        item[textTyping] = dataTable.dataBody
                        console.log("sadsadsadsa",item);
                        this.$store.commit("document/cacheDataAutocomplete",{
                            instance: this.keyInstance,
                            controlName:aliasControl,
                            header:dataTable.headers,
                            cacheData:item
                        })
                    }
                }
                else{
                    this.$refs.autocompleteInput.setData([]);
                }
            }
            else{
                let dataTable = this.handleDataAutoComplete(res,true,controlAs);
                this.$refs.autocompleteInput.setAliasControl(aliasControl);
                this.$refs.autocompleteInput.setData(dataTable);
                this.$refs.autocompleteInput.hideHeader();
            }
        },

        /**
         * Hàm tìm ra đoạn text đã typing để query autocomplete
         */
        getTextTypingInSqlQuery(sql){
            let textQuery = sql.match(/%.*?%/g);
            if(textQuery){
                textQuery = textQuery[0];
                textQuery = textQuery.replace(/%*/g,"");
            }
            else{
                textQuery = ""
            }
            return textQuery;
        },
        /**
         * Hàm bind dữ liệu cho control, và control trong bảng khi chọn apply trên timepicker
         */
        applyTimePicker(data){
            let time = data.value;
            let input = data.input;
            if(this.sDocumentSubmit.currentTableInteractive == null){
                input.val(time);
                input.trigger('change');
            }
            else{
                let currentTableInteractive = this.sDocumentSubmit.currentTableInteractive
                let cellActive = currentTableInteractive.tableInstance.getActiveEditor();
                currentTableInteractive.tableInstance.setDataAtCell(cellActive.row,cellActive.col,time,'edit')
            }
        },
        afterCheckTimeNotValid(data){
            let isValid = data.isValid;
            let controlInstance = getControlInstanceFromStore(this.keyInstance,data.controlName);
            if(isValid){
                controlInstance.removeValidateIcon();
            }
            else{
                controlInstance.renderValidateIcon('Định dạng thời gian không đúng!');
            }
            this.checkEscKey(data.event);
        },

        checkEscKey(event){
            if(event != undefined && event.key === "Escape"){
                this.$refs.timeInput.hide();
            }
        },
        afterSelectUser(data){
            let user = data.value;
            let input = data.input;
            if(this.sDocumentSubmit.currentTableInteractive == null){
                input.val(user.displayName);
                input.attr('user-id',user.id);
                input.trigger('change');
            }
            else{
                let currentTableInteractive = this.sDocumentSubmit.currentTableInteractive
                let cellActive = currentTableInteractive.tableInstance.getActiveEditor();
                currentTableInteractive.tableInstance.setDataAtCell(cellActive.row,cellActive.col,user.id,'edit')
            }
        },
        /**
         * Hàm xử lí nhận dữ liệu component autocomplete khi chọn 1 dòng
         */
        afterSelectRowAutoComplete(data){
            // th này không phải trong table      
            if(this.sDocumentSubmit.currentTableInteractive == null){
                let fromAutoComplete = true;
                if(!data.fromEnterKey){
                    fromAutoComplete = false;
                }
                this.handleInputChangeBySystem(this.sDocumentSubmit.currentControlAutoComplete,data.value,fromAutoComplete);
            }
            else{
                let currentTableInteractive = this.sDocumentSubmit.currentTableInteractive
                let cellActive = currentTableInteractive.tableInstance.getActiveEditor();
                currentTableInteractive.isAutoCompleting = false;
                currentTableInteractive.tableInstance.setDataAtCell(cellActive.row,cellActive.col,data.value,'edit')
            }
        },



        /**
         * Hàm xử lí sau khi chạy công thức được điền dữ liệu vào input bởi hệ thống
         */
        handleInputChangeBySystem(controlName,valueControl, fromAutocomplete = false){
            let controlInstance = getControlInstanceFromStore(this.keyInstance,controlName);
            if(controlInstance.getValue() == valueControl && this.sDocumentSubmit.docStatus != 'beforeSubmit'){ // kiểm tra ko có sự thay đổi giá trị của control thì return
                return;
            }
            controlInstance.setValue(valueControl)
            if(fromAutocomplete){
                $('#'+controlInstance.id).attr('data-autocomplete',valueControl);
            }
            markBinedField(this.keyInstance,controlName);
            if(controlInstance.type == 'user'){
                valueControl = $('#'+controlInstance.id).attr('user-id');
                if(valueControl == undefined) valueControl = 0;
            }
            // cần format lại giá trị date về năm tháng ngày để lưu vào store, tránh lỗi khi submit
            if(controlInstance.type == 'date'){
                valueControl = moment(valueControl).format('YYYY-MM-DD');
            }
          
            this.updateListInputInDocument(
                controlName,
                "value",
                valueControl
            );
            
            // sau khi thay đổi giá trị input thì kiểm tra require control nếu có
            if(controlInstance.isRequiredControl()){
                if(controlInstance.isEmpty()){
                    controlInstance.renderValidateIcon('Không được bỏ trống trường thông tin '+controlName)
                }
                else{
                    controlInstance.removeValidateIcon()
                }
            }
            // resetImpactedFieldsList(this.keyInstance);
            this.handleControlInputChange(controlName);
        },
        /**
         * Hàm  xử lí data sau khi query công thức autocomplete,
         * xử lí data về dạng object cho DataTable của vuetify
         */
        handleDataAutoComplete(data, isFromSQLLite,controlAs){
            let headers = [];
            let bodyTable = [];
            if(isFromSQLLite){
                for(let i = 0; i < data[0].columns.length; i++){
                    let item = {value:data[0].columns[i], text:data[0].columns[i]};
                    if(controlAs.hasOwnProperty(data[0].columns[i])){
                        item.text = controlAs[data[0].columns[i]]
                    }
                    if(data[0].columns[i] == 'column1'){
                        item.text = controlAs[Object.keys(controlAs)[0]]
                    }
                    headers.push(item);
                }
                let values = data[0].values;
                for(let i = 0; i < values.length; i++){
                    let item = {};
                    for(let j = 0; j < data[0].columns.length; j++){
                        item[data[0].columns[j]] = values[i][j];
                    }
                    bodyTable.push(item);
                }
            }
            else{
                if(data.length > 0){
                    for(let controlName in data[0]){
                        let item = {value:controlName,text:controlName};
                        if(controlAs.hasOwnProperty(controlName)){
                            item.text = controlAs[controlName]
                        }
                        headers.push(item);
                    }
                    data[0]['active'] = true;
                    bodyTable = data;
                }
                
            }
            return {headers:headers,dataBody:bodyTable}
        },
        // Khadm: load data của document lên để hiển thị và xử lý
        async loadDocumentData() {
            if (this.documentId) {
                let thisCpn = this;
                documentApi
                    .detailDocument(this.documentId)
                    .then(res => {
                        if (res.status == 200) {
                            let content = res.data.document.content;
                            thisCpn.documentName = res.data.document.name;
                            thisCpn.documentInfo = res.data.document;
                            thisCpn.getTitleObjectFormulas(res.data.document.titleObjectFormulasId)
                            thisCpn.docSize = (parseInt(res.data.document.isFullSize) == 1) ? "100%":"21cm";
                            thisCpn.contentDocument = content;
							if(res.data.document.dataPrepareSubmit != null && res.data.document.dataPrepareSubmit != "")
                            thisCpn.preDataSubmit = JSON.parse(res.data.document.dataPrepareSubmit);
                            if(res.data.document.otherInfo != null && res.data.document.otherInfo != "")
							thisCpn.otherInfo = JSON.parse(res.data.document.otherInfo);
							thisCpn.objectIdentifier = thisCpn.otherInfo.objectIdentifier;
                            setDataForPropsControl(res.data.fields,thisCpn.keyInstance,'submit'); // ddang chay bat dong bo
                            setTimeout(() => {
                                thisCpn.processHtml(content);
                            }, 100);
                        }
                        else{
                            thisCpn.$snotify({
                                type: "error",
                                title: res.message
                            });  
                        }
                    })
                    .catch(err => {
                        // thisCpn.$snotify({
                        //     type: "error",
                        //     title: "error from detail document api123!!!"
                        // }); 
                    })
                    .always(() => {});
            }
        },

        /**
         * hàm lấy thông tin của formulas cho title bản ghi
         */
        getTitleObjectFormulas(formulasId){
            if(formulasId && formulasId != 0){
                let self = this;
                formulasApi.detailFormulas(formulasId).then(res=>{
                    self.titleObjectFormulas = new Formulas(self.keyInstance,res.data.lastContent,'titleObject');
                })
            }
            
        },

        /**
         * Hàm lấy thông tin của bản ghi trường hợp update 
         */
        loadDocumentObject() {
            let thisCpn = this;
            documentApi
                .detailDocumentObject(this.docObjId)
                .then(res => {
                    if (res.status == 200) {
                        thisCpn.$store.commit('document/addToDocumentDetailStore',{
                            key: 'allData',
                            value: res.data,
                            instance: this.keyInstance
                        })
                        thisCpn.$store.commit('document/updateListLinkControl',{
                            key: thisCpn.keyInstance,
                            value: res.data.otherInfo,
                        }); 
                        thisCpn.documentId = res.data.documentId;
                        thisCpn.isDraft = res.data.isDraft;
                        thisCpn.loadDocumentData();
                    }
                    else{
                        thisCpn.$snotify({
                            type: "error",
                            title: res.message
                        });  
                    }
                })
                .catch(err => {
                    thisCpn.$snotify({
                        type: "error",
                        title: "error from detail document object api!!!"
                    });  
                })
                .always(() => {});
        },
        togglePageSize() {
            this.docSize = this.docSize == "21cm" ? "100%" : "21cm";
            let listInputInDocument = this.sDocumentSubmit.listInputInDocument;
            let allControlInstance = Object.values(listInputInDocument);
            let listTableControlInstance = allControlInstance.filter(control =>{
                return control.type == 'table'
            })
            for (let index = 0; index < listTableControlInstance.length; index++) {
                let table = listTableControlInstance[index];
                setTimeout(() => {
                    table.tableInstance.tableInstance.render();
                }, 50);
                
            }
        },
        processHtml(content) {
            $("#sym-submit-" + this.keyInstance).find('.page-content').addClass('d-block');
            $("#sym-submit-" + this.keyInstance).find('.list-page-content').addClass('d-flex');
            
            var allInputControl = $("#sym-submit-" + this.keyInstance).find(
                ".s-control:not(.bkerp-input-table .s-control)"
            );
            let thisCpn = this;
            let isSetEffectedControl = false;
            let listDataFlow = [];
            for (let index = 0; index < allInputControl.length; index++) {
                let id = $(allInputControl[index]).attr('id');
                let controlType = $(allInputControl[index]).attr('s-control-type');
                if(this.sDocumentEditor.allControl[id] != undefined){   // ton tai id trong store
                    let field = this.sDocumentEditor.allControl[id];
                    let controlName = (allControlNotSetData.includes(controlType) || controlType == 'tabPage') ? field.type : field.properties.name.value;
                    this.checkEditableControl(controlName,field);
                    this.checkOverrideFormulas(controlName,field);
                    let idField = field.id;
                    let valueInput = field.value;
                    let prepareData = field.prepareData;
                    if(prepareData != null && prepareData != ""){
                        isSetEffectedControl = true;
                    }
                    if(valueInput != undefined && valueInput != null && Object.keys(valueInput).length == 0){
                        valueInput = ""
                    }
                    if(allControlNotSetData.includes(controlType)){
                        let control = new ActionControl(idField, $(allInputControl[index]),field,thisCpn.keyInstance);
                        control.init();
                        control.render();
                        control.setEffectedData(prepareData);
                        this.addToListInputInDocument(allControlNotSetData[controlType],control)
                    } 
                    else if(controlType == 'tabPage'){
                        let control = new LayoutControl(idField, $(allInputControl[index]),field,thisCpn.keyInstance);
                        control.init();
                        control.render();
                        this.addToListInputInDocument('tabPage',control)
                    }
                    else if(controlType == 'tab'){
                        let control = new TabControl(idField, $(allInputControl[index]),field,thisCpn.keyInstance);
                        control.init();
                        control.render();
                        this.addToListInputInDocument(controlName,control)
                    }
                    else if(controlType == 'page'){
                        let control = new PageControl(idField, $(allInputControl[index]),field,thisCpn.keyInstance);
                        control.init();
                        control.render();
                        this.addToListInputInDocument(controlName,control)
                    }
                   
                    else {
                        let mapColumnType = Util.mapTypeControlToTypeSQLLite(controlType); 
                        if(mapColumnType != false){
                            this.columnsSQLLiteDocument[controlName] = mapColumnType;
                        }
                        field.properties.docName = this.documentName
                        if (controlType != "table") {
                            if(controlType == 'dataFlow'){
                                let id = field.properties.dataFlowId.value;
                                let mapParamsDataflow = field.properties.mapParamsDataflow.value;
                                $(allInputControl[index]).find('.run-dataflow').removeClass('d-none')
                                listDataFlow.push({id:id,controlName:controlName,el:$(allInputControl[index]),mapParamsDataflow:mapParamsDataflow});
                                let control = new LayoutControl(
                                    idField,
                                    $(allInputControl[index]),
                                    field,
                                    thisCpn.keyInstance
                                );
                                control.init();
                                control.setEffectedData(prepareData);
                                this.addToListInputInDocument(controlName,control);
                            }
                            else{
                                let control = new BasicControl(
                                    idField,
                                    $(allInputControl[index]),
                                    field,
                                    thisCpn.keyInstance,
                                    valueInput
                                );
                                control.init();
                                control.setEffectedData(prepareData);
                                this.addToListInputInDocument(controlName,control);
                                control.render();
                                control.checkHasInfoControl(this.linkControl);
                            }
                            
                        }
                        //truong hop la control table
                        else {
                            let listInsideControls = {};
                            let controlInTable = {};
                            let tableControl = new TableControl(
                                idField,
                                $(allInputControl[index]),
                                field,
                                thisCpn.keyInstance
                            );
                            tableControl.initTableControl();
                            tableControl.setEffectedData(prepareData);
                            tableControl.tableInstance = new Table(
                                tableControl,
                                controlName,
                                id,
                                thisCpn.keyInstance
                            );
                            let tableEle = $(allInputControl[index]);
                            tableEle.find(".s-control").each(function() {
                                let childControlId = $(this).attr("id");
                                let childControlProp = thisCpn.sDocumentEditor.allControl[id].listFields[childControlId];
                                let childControlName = childControlProp.properties.name.value;
                                childControlProp.properties.inTable = controlName;
                                childControlProp.properties.docName = thisCpn.documentName;
                                thisCpn.checkEditableControl(childControlName,childControlProp);
                                thisCpn.checkOverrideFormulas(childControlName,childControlProp);
                                let childValue = childControlProp.value;
                                let childPrepareData = childControlProp.prepareData
                                if(childPrepareData != null && childPrepareData != ""){
                                    isSetEffectedControl = true;
                                }
                                let idFieldChild = childControlProp.id;
                                let childControl = new BasicControl(
                                    idFieldChild,
                                    $(this),
                                    childControlProp,
                                    thisCpn.keyInstance,
                                    childValue
                                );
                                childControl.init();
                                childControl.setEffectedData(childPrepareData);
                                thisCpn.addToListInputInDocument(childControlName,childControl)
                                listInsideControls[childControlName] = true;
                                 controlInTable[childControlName] = childControl;
                            });
                            tableControl.listInsideControls = listInsideControls;
                            tableControl.controlInTable = controlInTable;
                            tableControl.renderTable();
                            if(this.viewType !== 'submit'){
                                tableControl.setData(valueInput);
                            }
                            this.addToListInputInDocument(controlName,tableControl);
                            tableControl.renderInfoButtonInRow(this.linkControl);
                        }
                    }
                }
            }
            this.listDataFlow = listDataFlow;
            if(!isSetEffectedControl);
            this.getEffectedControl();
            if(this.docObjId == null){
                thisCpn.findRootControl();
            }
            else{   // trường hơp đã lưu cấu trúc root trên server
                if(this.preDataSubmit != null && Object.keys(this.preDataSubmit).length > 0){
                    impactedFieldsList = this.preDataSubmit.impactedFieldsList;
                    let impactedFieldsListWhenStart = this.preDataSubmit.impactedFieldsListWhenStart;
                    let listTableRootControl = this.preDataSubmit.tableRootControl;
                    this.pushDataRootToStore(impactedFieldsList,impactedFieldsListWhenStart,listTableRootControl);
                    for(let tableName in listTableRootControl){
                        let tableRootControl = listTableRootControl[tableName];
                        for(let controlInTable in tableRootControl){
                            let controlInstance = getControlInstanceFromStore(this.keyInstance,controlInTable);
                            let controlFormulas = controlInstance.controlFormulas;
                            if(controlFormulas.hasOwnProperty('formulas')){
                                let formulasInstance = controlFormulas['formulas'].instance;
                                // chạy công thức để lấy giá trị dòng mặc định trong table(phục vụ cho việc shift enter xuống dòng phải có dữ liệu mặc định)
                                if(formulasInstance){
                                    this.handlerBeforeRunFormulasValue(formulasInstance,controlInstance.id,controlInTable,'formulasDefaulRow','root');
                                }
                            }
                            
                        }
                    }
                   
                    
                }
            }
                this.hidePreloader();


        },

        pushDataRootToStore(impactedFieldsList,impactedFieldsListWhenStart,listTableRootControl){
            this.$store.commit("document/addToDocumentSubmitStore", {
                        key: 'impactedFieldsList',
                        value: impactedFieldsList,
                        instance: this.keyInstance
                    });
            this.$store.commit("document/addToDocumentSubmitStore", {
                                                key: 'impactedFieldsListWhenStart',
                                                value: impactedFieldsListWhenStart,
                                                instance: this.keyInstance
                                            });
            this.$store.commit("document/addToDocumentSubmitStore", {
                                                key: 'listTableRootControl',
                                                value: listTableRootControl,
                                                instance: this.keyInstance
                                            });
        },


        /**
         * Sự kiện phát ra khi click vào date của date picker
         */
        selectedDate(data){
            this.$refs.datePicker.closePicker();
            let currentControl = this.sDocumentSubmit.currentControlEditByUser;
            this.handleInputChangeBySystem(currentControl,data)
        },

        /**
         * Hàm mở sub-form submit
         */
        openSubFormSubmit() {
            this.$refs.symDragPanel.$children[1].$refs.autocompleteInput.hide();
            this.$refs.symDragPanel.show();
        },
        

        
        /**
         * Hàm lấy ra các control bị ảnh hưởng từ 1 control và set vao store
         */
        getEffectedControl() {
            let mapControlEffected = {};
            let allControl = this.sDocumentSubmit.listInputInDocument;
            for (let name in allControl) {
                let type = allControl[name].type;
                if (type != "submit" && type != "reset" && type != "draft") {
                    let formulas = allControl[name].controlFormulas;
                    for (let formulasType in formulas) {
                        if(!mapControlEffected.hasOwnProperty(formulasType)){
                            mapControlEffected[formulasType] = {}
                        }
                        if(formulasType == 'linkConfig'){
                            let allConfig = formulas[formulasType].configData;
                            for (let index = 0; index < allConfig.length; index++) {
                                let config = allConfig[index];
                                if(config.instance){
                                    let inputControl = config.instance.inputControl;
                                    for (let controlEffect in inputControl) {
                                        if (!mapControlEffected[formulasType].hasOwnProperty(controlEffect)) {
                                            mapControlEffected[formulasType][controlEffect] = {};
                                        }
                                        mapControlEffected[formulasType][controlEffect][name] = true;
                                    }
                                }
                                
                            }
                        }
                        else{
                            if(formulas[formulasType].hasOwnProperty('instance')){
                                let inputControl = formulas[formulasType].instance.inputControl;
                                let inputLocalFormulas = formulas[formulasType].instance.inputForLocalFormulas;
                                let inputFromDatasets = formulas[formulasType].instance.inputFromDatasets;
                                for (let controlEffect in inputControl) {
                                    if (!mapControlEffected[formulasType].hasOwnProperty(controlEffect)) {
                                        mapControlEffected[formulasType][controlEffect] = {};
                                    }
                                    mapControlEffected[formulasType][controlEffect][name] = true;
                                }
                                for (let controlEffect in inputFromDatasets) {
                                    if (!mapControlEffected[formulasType].hasOwnProperty(controlEffect)) {
                                        mapControlEffected[formulasType][controlEffect] = {};
                                    }
                                    mapControlEffected[formulasType][controlEffect][name] = true;
                                }
                                for (let controlEffect in inputLocalFormulas) {
                                    if (!mapControlEffected[formulasType].hasOwnProperty(controlEffect)) {
                                        mapControlEffected[formulasType][controlEffect] = {};
                                    }
                                    mapControlEffected[formulasType][controlEffect][name] = true;
                                }
                                
                                this.detectControlEffectedInTableInDoc(mapControlEffected[formulasType], name, formulas[formulasType].instance);
                            }
                        }
                        
                    }
                }
            }
            console.log('mapControlEffected',mapControlEffected);
            this.updateEffectedControlToStore(mapControlEffected);
        },
       
        detectControlEffectedInTableInDoc(mapControlEffected,name,formulasInstance){
            formulasInstance.detectControlInTable(mapControlEffected,name,formulasInstance.formulas,this.sDocumentSubmit.listInputInDocument)  
        },


        handlerDraftClick(){
            this.isSubmitting = true;
            let thisCpn = this;
            let dataPost = this.getDataPostSubmit();
            dataPost['documentId'] = this.documentId;
            documentApi.submitDraftDocument(dataPost).then(res => {
                thisCpn.isSubmitting = false;
                if (res.status == 200) {
                    thisCpn.$snotify({
                        type: "success",
                        title: "Submit draft success!"
                    });        
                    thisCpn.$router.push('/documents/'+thisCpn.documentId+"/draft-objects");
                }
                else{
                    thisCpn.$snotify({
                        type: "error",
                        title: res.message
                    });
                }
            })
            .catch(err => {
                console.warn(err);
                thisCpn.$snotify({
                        type: "error",
                        title: "error from submit document api!!!"
                    });
            })
            .always(() => {
            });
        },
        handlerSubmitDocumentClick(isContinueSubmit = false){
            this.isContinueSubmit = isContinueSubmit;
            if($('#sym-submit-'+this.keyInstance+' .validate-icon').length == 0 && $('#sym-submit-'+this.keyInstance+' .error').length == 0){
                if(this.viewType == 'submit'){
                    this.handleRefreshDataBeforeSubmit();
                }
                else{
                    this.updateDocumentObject();
                }
            }
            else{
                let controlNotValid = $('#sym-submit-'+this.keyInstance+' .validate-icon');
                let controlError = $('#sym-submit-'+this.keyInstance+' .error');
                let listErr = []
                $.each(controlNotValid,function(k,v){
                    let message = $(v).attr('title');
                    listErr.push(message);
                })
                $.each(controlError,function(k,v){
                    let message = $(v).attr('valid');
                    listErr.push(message);
                })
                this.listMessageErr = listErr;
                this.$refs.errMessage.showDialog();
            }
            
        },


        // Hàm chỉ ra control được đánh định danh trong document (sct...)
        getDataRefreshControl(){
            if(this.objectIdentifier == undefined){
                return {}
            }
            let controlIdentifier = {}
            let controlNameIdentifier = this.objectIdentifier['name'];
            let controlInstance = getControlInstanceFromStore(this.keyInstance,controlNameIdentifier);
            if(controlInstance != false && controlInstance.controlFormulas.hasOwnProperty('formulas')){
                let dataInput = this.getDataInputFormulas(controlInstance.controlFormulas['formulas']['instance'])
                controlIdentifier['dataInputIdentifier'] = dataInput;
            }
            return controlIdentifier;
            
        },
        handleRefreshDataBeforeSubmit(){
            this.$store.commit("document/addToDocumentSubmitStore", {
                            key: 'docStatus',
                            value: 'beforeSubmit',
                            instance: this.keyInstance
                        });
            if(this.otherInfo.hasOwnProperty('refreshControl') && this.otherInfo.refreshControl.length > 0){
                let refreshControl = this.otherInfo.refreshControl;
                let dataImpactedControlRefresh = {};
                for (let index = 0; index < refreshControl.length; index++) {
                    let controlName = refreshControl[index];
                    let dataImpactedControl = util.cloneDeep(this.sDocumentSubmit.impactedFieldsList[controlName]);
                    for(let control in dataImpactedControl){
                        dataImpactedControl[control] = false;
                    }
                    dataImpactedControlRefresh[controlName] = dataImpactedControl;
                }
                
                this.$store.commit("document/addToDocumentSubmitStore", {
                    key: 'dataImpactedControlRefresh',
                    value: dataImpactedControlRefresh,
                    instance: this.keyInstance
                });
                let checkRun = false;
                for (let index = 0; index < refreshControl.length; index++) {
                    let controlName = refreshControl[index];
                    let controlInstance = getControlInstanceFromStore(this.keyInstance,controlName);
                    if(!controlInstance.controlFormulas.hasOwnProperty('formulas')){
                        continue;
                    }
                    checkRun = true;
                    let formulas = controlInstance.controlFormulas.formulas.instance;
                    this.handlerBeforeRunFormulasValue(formulas,controlInstance.id,controlName,'formulas');
                }
                if(checkRun == false){
                    this.submitDocument();
                }
            }
            else{
                this.submitDocument();
            }
            
        },
        /**
         * Hàm gọi api submit document
         */
        async submitDocument(){
            this.isSubmitting = true;
            let thisCpn = this;
            let dataPost = this.getDataPostSubmit();
            dataPost['documentId'] = this.documentId;
            let dataInputFormulas = this.getDataRefreshControl();
            
            if(Object.keys(dataInputFormulas).length>0){
                dataPost['dataInputFormulas'] = dataInputFormulas;
            }
            this.callApiSubmit(dataPost);
            
        },
        resetCheckRefreshData(){
            this.$store.commit("document/addToDocumentSubmitStore", {
                key: 'readySubmit',
                value: false,
                instance: this.keyInstance
            });
        },
        async callApiSubmit(dataPost){
            let thisCpn = this;
            if(this.titleObjectFormulas != null){
                let dataInputTitle = thisCpn.getDataInputFormulas(this.titleObjectFormulas);
                if(!dataPost['dataInputFormulas']){
                    dataPost['dataInputFormulas'] = {}
                }
                dataPost['dataInputFormulas']['dataInputTitle'] = dataInputTitle;
            }
            if(this.appId){
                dataPost['appId'] = this.appId;
            }
            else{
                if(this.$route.params.extraData && this.$route.params.extraData.appId){
                    dataPost['appId'] = this.$route.params.extraData.appId
                }
            }
            dataPost['dataInputFormulas'] = JSON.stringify(dataPost['dataInputFormulas']);
            // nếu có giá trị công thức link trong doc thì lưu lại để dùng trong form detail
            if(this.linkControl && Object.keys(this.linkControl).length > 0){
                dataPost['linkData'] = JSON.stringify(this.linkControl);
            }
            documentApi.submitDocument(dataPost).then(res => {
                let dataResponSubmit = res.data;
                dataResponSubmit['document_object_user_created_fullname'] = thisCpn.endUserInfo.id;
                dataResponSubmit['isContinueSubmit'] = thisCpn.isContinueSubmit;
                thisCpn.$emit('submit-document-success',dataResponSubmit);
                thisCpn.isSubmitting = false;
                if (res.status == 200) {
                    thisCpn.$snotify({
                        type: "success",
                        title: "Submit document success!"
                    });        
                    // nếu submit từ form sub submit thì ko rediect trang
                    // mà tìm giá trị của control cần được bind lại giá trị từ emit dataResponSubmit
                    
                    if(this.$getRouteName() == 'submitDocument' && this.$route.params.id == this.documentId){
                        thisCpn.$router.push('/documents/'+thisCpn.documentId+"/objects");
                    }
                    else{
                        thisCpn.resetDataSubmit();
                    }
                    // nếu có công thức nút submit
                    if(thisCpn.sDocumentSubmit.submitFormulas != undefined){
                        let dataInput = thisCpn.getDataInputFormulas(thisCpn.sDocumentSubmit.submitFormulas);
                        thisCpn.sDocumentSubmit.submitFormulas.handleBeforeRunFormulas(dataInput).then(rs=>{});
                    }
                }
                else{
                    thisCpn.$snotify({
                        type: "error",
                        title: res.message
                    });
                    thisCpn.resetCheckRefreshData();
                }
            })
            .catch(err => {
                thisCpn.$snotify({
                        type: "error",
                        title: "error from submit document api!!!"
                    });
                thisCpn.resetCheckRefreshData();
                thisCpn.isSubmitting = false;
            })
            .always(() => {
            });
        },
        updateDocumentObject(){
            this.isSubmitting = true;
            let thisCpn = this;
            let dataPost = this.getDataPostSubmit();
            console.log(dataPost,'dataPostdataPost');
            dataPost['documentId'] = this.documentId;
            if(this.isDraft == 1){
                dataPost['isDraft'] = true;
            }
            // nếu có giá trị công thức link trong doc thì lưu lại để dùng trong form detail
            if(this.linkControl && Object.keys(this.linkControl).length > 0){
                dataPost['linkData'] = JSON.stringify(this.linkControl);
            }
            documentApi.updateDocument(this.docObjId,dataPost).then(res => {
                thisCpn.$emit('submit-document-success',res.data);
                thisCpn.isSubmitting = false;
                if (res.status == 200) {
                    thisCpn.$snotify({
                        type: "success",
                        title: "update document success!"
                    });        
                    if(thisCpn.$getRouteName() == 'updateDocumentObject')
                     thisCpn.$router.push('/documents/'+thisCpn.documentId+"/objects");
                }
                else{
                    thisCpn.$snotify({
                        type: "error",
                        title: res.message
                    });
                }
            })
            .catch(err => {
                thisCpn.$snotify({
                        type: "error",
                        title: "error from update document api!!!"
                    });
            })
            .always(() => {
            });
        },

        /**
         * Hàm lấy tất cả giá trị của doc cho submit dạng {field_${id}:value}
         */
        getDataPostSubmit() {
            let listInput = this.sDocumentSubmit.listInputInDocument;
            let newDataPost = {};
            let dataControl = {};
            for (let controlName in listInput) {
                if(listInput[controlName].inTable != false){
                    continue;
                }
                if(!listInput[controlName].checkProps('isSaveToDB')){
                    continue;
                }
                if (listInput[controlName].type == "table") {
                    let value = this.getDataTableInput(listInput[controlName]);
                    Object.assign(dataControl, value);
                } else {
            
                    if (!listControlNotNameProp.includes(listInput[controlName].type)) {
                        let value = (listInput[controlName].type == 'number' && listInput[controlName].value == "" ) ? 0 : listInput[controlName].value;
                        if(listInput[controlName].type == 'percent'){
                            value = (listInput[controlName].value === "" ) ? 0 : listInput[controlName].value/100;
                        }
                        dataControl[controlName] = value;
                        if(listInput[controlName].type == 'checkbox'){
                            dataControl[controlName] = (value) ? 1 : 0;
                        } 
                       
                    }
                    
                }
            }
            newDataPost['documentObjectWorkflowObjectId'] = this.documentObjectWorkflowObjectId;
            newDataPost['documentObjectWorkflowId'] = this.documentObjectWorkflowId;
            newDataPost['documentObjectTaskId'] = this.documentObjectTaskId;
            newDataPost['dataControl'] = JSON.stringify(dataControl);
            return newDataPost;
        },
        /**
         * Hàm lấy dữ liệu của table dạng colName : ['a',"b","c"]
         */
        getDataTableInput(tableControl) {
            let listInput = this.sDocumentSubmit.listInputInDocument;
            let indexCol = tableControl.tableInstance.colName2Idx;
            let dataTable = {};
            let dataControlInTable = {};
            let columnObjectIdIndex = tableControl.tableInstance.getColumnIndexFromControlName('childObjectId');
            let dataColObjectId = tableControl.tableInstance.tableInstance.getDataAtCol(
                    columnObjectIdIndex
                );
            if(tableControl.tableInstance.tableHasRowSum == true)
                dataColObjectId.pop();
            dataControlInTable['child_object_id'] = dataColObjectId;
            for (let i in indexCol) {
                if(!listInput[i].checkProps('isSaveToDB')){
                    continue;
                }
                let dataCol = tableControl.tableInstance.tableInstance.getDataAtCol(
                    indexCol[i]
                );
                // cần xóa phần tử dòng cuối dùng là row enter mặc định ko có dữ liệu
                if(tableControl.tableInstance.tableHasRowSum == true)
                dataCol.pop();
                if(listInput[i].type == 'fileUpload'){
                    dataCol = listInput[i].value;
                }
                if(listInput[i].type == 'number'){
                    for (let index = 0; index < dataCol.length; index++) {
                        const element = dataCol[index];
                        if(isNaN(Number(element))){
                            dataCol[index] = 0;
                        }
                        else{
                            dataCol[index] = Number(element);
                        }
                    }
                }
                if (listInput[i].type == 'date') {
                    for (let index = 0; index < dataCol.length; index++) {
                        let rowValue = dataCol[index];
                        if(rowValue != "" && rowValue != null){
                            let newValue = moment(rowValue, listInput[i].controlProperties.formatDate.value).format('YYYY-MM-DD');
                            dataCol[index] = newValue;
                        }
                    }
                }
                if (listInput[i].type == 'user') {
                    for (let index = 0; index < dataCol.length; index++) {
                        const element = dataCol[index];
                        if(!/[0-9]/.test(element)){
                            dataCol[index] = 0;
                        }
                    }
                }
                dataControlInTable[i] = dataCol;
            }
            dataTable[tableControl.name] = dataControlInTable;
            return dataTable;
        },

        updateEffectedControlToStore(mapControlEffected) {
            let dataToPreProcessControl = {};
            for(let type in mapControlEffected){
                if(mapTypeToEffectedControl.hasOwnProperty(type)){
                    for (let controlName in mapControlEffected[type]) {
                        this.updateListInputInDocument(
                            controlName,
                            mapTypeToEffectedControl[type],
                            mapControlEffected[type][controlName]
                        );
                        let controlInstance = getControlInstanceFromStore(this.keyInstance,controlName)
                        if(!dataToPreProcessControl.hasOwnProperty(controlInstance.idField)){
                            dataToPreProcessControl[controlInstance.idField] = {};
                        }
                        dataToPreProcessControl[controlInstance.idField][mapTypeToEffectedControl[type]] = mapControlEffected[type][controlName];
                    }
                }
                
            }
            documentApi.updatePreDataForField({prepareData:JSON.stringify(dataToPreProcessControl)}) 
        },
        updateListInputInDocument(controlName, key, value) {
            this.$store.commit("document/updateListInputInDocument", {
                controlName: controlName,
                key: key,
                value: value,
                instance: this.keyInstance
            });
        },
        addSQLInstanceDBToStore(SQLDBInstance) {
            this.$store.commit("document/addInstanceSubmitDB", {
                instance: this.keyInstance,
                sqlLite: SQLDBInstance
            });
        },
        addToListInputInDocument(name,control){
             this.$store.commit(
                            "document/addToListInputInDocument",
                            { name: name, control: control ,instance: this.keyInstance}
                        );
        },



        runInputFilterFormulas(controlName,search=""){
            let controlInstance = this.sDocumentSubmit.listInputInDocument[controlName];
            let controlId = controlInstance.id
            let allFormulas = controlInstance.controlFormulas;
            if(allFormulas.hasOwnProperty('list')){
                if(allFormulas['list'].hasOwnProperty('instance')){
                    let formulasInstance = allFormulas['list'].instance;
                    if(formulasInstance.getFormulas() != ""){
                        if( !formulasInstance.hasOwnProperty('oldFormulas')){
                            formulasInstance.oldFormulas = formulasInstance.getFormulas();
                        }
                        // trường hợp có search trong filter thì wrap lại công thức với biến search
                        let newFormulas = formulasInstance.wrapSyqlForSearchInputFilter(search);
                        formulasInstance.setFormulas(newFormulas);
                        this.handlerBeforeRunFormulasValue(formulasInstance,controlId,controlName,'list')
                    }
                }
            }
        },

        /**
         * hàm được gọi khi input change, lấy ra các instance của control bị ảnh hưởng và chạy công thức cho các control đó
         * nếu có insideTableInDoc thì công thức từ nội bộ của bảng
         */
        handleControlInputChange(controlName){
            let controlInstance = this.sDocumentSubmit.listInputInDocument[controlName];
            if(controlInstance.checkValidValueLength()){
                let controlUnique = checkDbOnly(this.keyInstance,controlName);
                if(controlUnique != false){
                    this.handlerBeforeRunFormulasValue(controlUnique.controlFormulas.uniqueDB.instance,controlUnique.id,controlUnique.name,'uniqueDB');
                }
                let controlEffected = controlInstance.getEffectedControl();
                let controlHiddenEffected = controlInstance.getEffectedHiddenControl();
                let controlReadonlyEffected = controlInstance.getEffectedReadonlyControl();
                let controlRequireEffected = controlInstance.getEffectedRequireControl();
                let controlLinkEffected = controlInstance.getEffectedLinkControl();
                let controlValidateEffected = controlInstance.getEffectedValidateControl();
                this.runFormulasControlEffected(controlName,controlEffected);
                this.runOtherFormulasEffected(controlName,controlHiddenEffected,'hidden');
                this.runOtherFormulasEffected(controlName,controlReadonlyEffected,'readonly');
                this.runOtherFormulasEffected(controlName,controlRequireEffected,'require');
                this.runOtherFormulasEffected(controlName,controlLinkEffected,'linkConfig');
                this.runOtherFormulasEffected(controlName,controlValidateEffected,'validate');
            }
        },
        /**
         * Hàm xử lí duyêt các control bị ảnh hưởng trong 1 công thức bởi 1 control nào đó và thực hiện chạy các công thức của control đó
         */
        runFormulasControlEffected(controlName, controlEffected){
            if(Object.keys(controlEffected).length > 0){
                for(let i in controlEffected){
                    if (checkCanBeBind(this.keyInstance,i)){
                        let controlEffectedInstance = getControlInstanceFromStore(this.keyInstance,i);
                        let controlId = controlEffectedInstance.id
                        let allFormulas = controlEffectedInstance.controlFormulas;
                        if(allFormulas.hasOwnProperty('formulas')){
                            if(allFormulas['formulas'].hasOwnProperty('instance')){
                                let formulasInstance = allFormulas['formulas'].instance;
                                if(formulasInstance.getFormulas() != ""){
                                    this.handlerBeforeRunFormulasValue(formulasInstance,controlId,i,'formulas')
                                }
                            }
                        }
                    }
                }
            }
        },
        /**
         * Hàm xử lí duyêt các control bị ảnh hưởng trong 1 công thức bởi 1 control nào đó và thực hiện chạy các công thức của control đó
         */
        runOtherFormulasEffected(controlName, controlEffected,formulasType){
            if(Object.keys(controlEffected).length > 0){
                for(let i in controlEffected){
                    let controlEffectedInstance = this.sDocumentSubmit.listInputInDocument[i];
                    let controlId = controlEffectedInstance.id
                    let allFormulas = controlEffectedInstance.controlFormulas;
                    if(allFormulas.hasOwnProperty(formulasType)){
                        if(formulasType == 'linkConfig'){ // nếu có cấu hình công thức link thì cũng chạy các công thức của nó
                            let configData = allFormulas[formulasType].configData;
                            for (let ind = 0; ind < configData.length; ind++) {
                                let config = configData[ind];
                                let formulasInstance = config.instance;
                                let fType = formulasType+"_"+config.formula.instance;
                                this.handlerBeforeRunFormulasValue(formulasInstance,controlId,i,fType)
                            }
                        }
                        else{
                            if(allFormulas[formulasType].hasOwnProperty('instance')){
                                let formulasInstance = allFormulas[formulasType].instance;
                                if(formulasInstance.getFormulas() != ""){
                                    this.handlerBeforeRunFormulasValue(formulasInstance,controlId,i,formulasType)
                                }
                            }
                        }
                    }
                }
            }
        },
        
        handlerBeforeRunFormulasValue(formulasInstance,controlId,controlName,formulasType,from=false){
            let dataInput = this.getDataInputFormulas(formulasInstance);
            let control = getControlInstanceFromStore(this.keyInstance,controlName);
            if(control.inTable != false){
                let tableInstance = getControlInstanceFromStore(this.keyInstance,control.inTable);
                let dataIn = tableInstance.tableInstance.getDataInputForFormulas(formulasInstance,tableInstance.name)
                tableInstance.tableInstance.handlerRunFormulasForControlInTable(formulasType,control,dataIn,formulasInstance);
            }
            formulasInstance.handleBeforeRunFormulas(dataInput).then(rs=>{
                this.handlerAfterRunFormulas(rs,controlId,controlName,formulasType,from)
            });
        },
        /**
         * Hàm lấy dữ liệu của các control trong store để chuân bị cho việc run formulas
         * dataInput : {controlName : value}
         * rowIndex là lấy cell ở row hiện tại nếu là trong table
         */
        getDataInputFormulas(formulasInstance, e = false){
            let inputControl = formulasInstance.getInputControl();
            let dataInput = {};
            for(let inputControlName in inputControl){
                if(inputControlName == e.controlName){
                    dataInput[inputControlName] = $(e.e.target).val();
                }
                else{
                    if(this.sDocumentSubmit.listInputInDocument.hasOwnProperty(inputControlName)){
                        let controlIns = getControlInstanceFromStore(this.keyInstance,inputControlName)
                        let valueInputControl = controlIns.value;
                        if(controlIns.type == 'inputFilter'){
                            valueInputControl = valueInputControl.split(',')
                        }
                        dataInput[inputControlName] = valueInputControl;
                    }
                }
            }
            return dataInput;
        },


        getValueFromDataResponse(rs){
            let value = "";
            if(!rs.server){
                let data = rs.data; 
                if(data.length > 0){
                    value=data[0].values[0][0];
                }
            }
            else{
                let data = rs.data.data;
                if(data.length > 0){
                    value=data[0][Object.keys(data[0])[0]];
                }
            }
            return value;
        },
        
        handlerAfterRunFormulas(rs,controlId,controlName,formulasType,from){
            let controlInstance = getControlInstanceFromStore(this.keyInstance,controlName);
            if(formulasType === 'formulasDefaulRow'){
                let value = this.getValueFromDataResponse(rs);
                this.$store.commit("document/updateDataToTableControlRoot",{instance:this.keyInstance,value:value,controlName:controlName,tableName:controlInstance.inTable});
                return;
            }
            if($('#'+controlId).length > 0){
                if($('#'+controlId).attr('s-control-type') == 'inputFilter'){
                    this.$refs.inputFilter.setData(controlId,controlName,rs.data.data);
                    
                }
                else if($('#'+controlId).attr('s-control-type') == 'table'){
                    if(formulasType=='formulas'){
                        this.setDataToTable(controlId,rs.data)
                    }
                }
                else{
                    let value = this.getValueFromDataResponse(rs);
                    if(formulasType.includes('linkConfig')){
                        this.handlerDataAfterRunFormulasLink(rs,controlName,formulasType);
                    }
                    else{
                        switch (formulasType) {
                            case "formulas":
                                this.handleInputChangeBySystem(controlName,value);
                                break;
                            
                            case "validate":
                                this.handlerDataAfterRunFormulasValidate(value,controlName);
                                break;
                            case "require":
                                this.handlerDataAfterRunFormulasRequire(value,controlName);
                                break;
                            case "hidden":
                                this.handlerDataAfterRunFormulasHidden(controlInstance,value,controlId);
                                break;
                            case "readOnly":
                                this.handlerDataAfterRunFormulasReadonly(value,controlId);
                                break;
                            case "uniqueDB":
                                controlInstance.handlerDataAfterRunFormulasUniqueDB(value);
                                break;
                            case "uniqueTable":
                                break;
                            default:
                                break;
                        }
                    }
                    
                    
                }

            }
        },
     

        /**
         * Hàm set data cho bảng trong doc sau khi chạy công thức có dữ liệu
         */
        setDataToTable(tableControlId,data){
            let tableName = this.sDocumentEditor.allControl[tableControlId].properties.name.value;
            data = data.data
            let tableControl = getControlInstanceFromStore(this.keyInstance,tableName);
            if(data.length == 0){
                tableControl.tableInstance.setData(false);
                return;
            }
            tableControl.tableInstance.setData(data);
            
        },

        /**
         * Hàm bind link vào control sau khi chạy công thức link
         */
        handlerDataAfterRunFormulasLink(rs, controlName, formulasType){
            let configInstance = formulasType.split('_')[1]
            let controlInstance = getControlInstanceFromStore(this.keyInstance,controlName);
            let linkFormulas = controlInstance.controlFormulas.linkConfig.configData;
            let title = "";
            let source = "";
            for (let index = 0; index < linkFormulas.length; index++) {
                let config = linkFormulas[index];
                let formulaIns = config.formula.instance;
                if(Number(formulaIns) == Number(configInstance)){
                    title = config.title;
                    source = config.objectType.type;
                }
            }
            let value = "";
            if(!rs.server){
                let data = rs.data; 
                let values = data[0].values;
                if(values.length > 0){
                    for (let index = 0; index < values.length; index++) {
                        let dataItem = values[index][0];
                        let fType = formulasType+"_"+dataItem;
                        this.setDataForLinkControl(fType, dataItem, title, source, controlName);
                    }
                }
            }
            else{
                let data = rs.data.data;
                if(data.length > 0){
                    for (let index = 0; index < data.length; index++) {
                        let dataItem = data[index][Object.keys(data[index])[0]];
                        let fType = formulasType+"_"+row;
                        this.setDataForLinkControl(fType, dataItem, title, source, controlName);
                    }
                }
            }
            controlInstance.renderInfoIconToControl(controlName);
        },
        setDataForLinkControl(formulasType, link, title, source, controlName){
            this.$store.commit(
                "document/updateDataForLinkControl",
                {formulasType:formulasType,link:link, title:title, source:source,instance: this.keyInstance, controlName: controlName}
            );
        },

        /**
         * Xử lí hiển thị sau khi chạy công thức require
         */
        handlerDataAfterRunFormulasRequire(isRequire,controlName){
            if(Array.isArray(isRequire)){
                isRequire=isRequire[0]
            }
            let controlInstance = getControlInstanceFromStore(this.keyInstance,controlName);
            if(controlInstance.isEmpty()&&(isRequire==1||isRequire==true)){
                controlInstance.renderValidateIcon('Không được bỏ trống trường này!')
            }
            else{
                controlInstance.removeValidateIcon();
            }
        },
        handlerDataAfterRunFormulasValidate(message,controlName){
            if(Array.isArray(message)){
                message=message[0]
            }
            let controlInstance = getControlInstanceFromStore(this.keyInstance,controlName);
            if(message != "" && message != null){
                controlInstance.renderValidateIcon(message);
            }
            else{
                controlInstance.removeValidateIcon();
            }
        },
        handlerDataAfterRunFormulasHidden(controlInstance,isHidden,controlId){
            if(Array.isArray(isHidden)){
                isHidden=isHidden[0];
            }
            let display = (isHidden == 1 || isHidden==true ) ? 'none' : 'inline-block'
            if(controlInstance.type == 'page'){
                controlInstance.setHiddenPage()
            }
            else if(controlInstance.type == 'tab'){
                controlInstance.setHiddenTab()
            }
            else{
                $('#'+controlId).parent().css({'display':display})
            }
        },
        handlerDataAfterRunFormulasReadonly(isReadonly,controlId){
            if(Array.isArray(isReadonly)){
                isReadonly=isReadonly[0]
            }
            if(isReadonly == 1 || isReadonly==true ){
                $('#'+controlId).attr('disabled','disabled');
            }else{
                $('#'+controlId).removeAttr('disabled');
            }
        },
        /**
         * Hàm xử lí việc tìm kiếm các root control và chạy công thức cho control đó (lúc khởi tạo doc)
         */
        findRootControl(){ 
            let impactedFieldsListWhenStart = {}
            let listTableRootControl = {};
            let listRootControl = [];
			if(this.preDataSubmit != null && Object.keys(this.preDataSubmit).length > 0){
				impactedFieldsList = this.preDataSubmit.impactedFieldsList;
				impactedFieldsListWhenStart = this.preDataSubmit.impactedFieldsListWhenStart;
				listRootControl = this.preDataSubmit.rootControl;
				listTableRootControl = this.preDataSubmit.tableRootControl;
				for (let index = 0; index < listRootControl.length; index++) {
					const controlName = listRootControl[index];
					let controlInstance = getControlInstanceFromStore(this.keyInstance,controlName);
                    let controlFormulas = controlInstance.controlFormulas;
					for(let formulasType in controlFormulas){
                        if(formulasType == 'linkConfig'){ // nếu có cấu hình công thức link thì cũng chạy các công thức của nó
                            let configData = controlFormulas[formulasType].configData;
                            for (let i = 0; i < configData.length; i++) {
                                let config = configData[i];
                                let formulasInstance = config.instance;
                                let fType = formulasType+"_"+config.formula.instance;
                                if(formulasInstance){
                                    this.handlerBeforeRunFormulasValue(formulasInstance,controlInstance.id,controlName,fType,'root')
                                }
                            }
                        }
						else if(!['autocomplete','list','autocompleteAuto'].includes(formulasType)){
                            let formulasInstance = controlFormulas[formulasType].instance;
                            if(formulasInstance){
                                this.handlerBeforeRunFormulasValue(formulasInstance,controlInstance.id,controlName,formulasType,'root')
                            }
						}
					}
				}
			}
			else{
                let listInput = getListInputInDocument(this.keyInstance);
				for(let controlName in listInput){
					this.setAllImpactedFieldsList(controlName);
                    let controlInstance = listInput[controlName];
					if(controlInstance.type != "inputFilter"){
						if(Object.keys(controlInstance.controlFormulas).length > 0){
							let controlFormulas = controlInstance.controlFormulas;
							for(let formulasType in controlFormulas){
								if(!['autocomplete','list','autocompleteAuto'].includes(formulasType)){
                                    if(formulasType == 'linkConfig'){ // nếu có cấu hình công thức link thì cũng chạy các công thức của nó
                                        let configData = controlFormulas[formulasType].configData;
                                        for (let i = 0; i < configData.length; i++) {
                                            let config = configData[i];
                                            if(config.formula.value){
                                                let formulasInstance = config.instance;
                                                let fType = formulasType+"_"+config.formula.instance;
                                                this.getRootControlData(controlInstance, formulasInstance, listTableRootControl, listRootControl, impactedFieldsListWhenStart, fType);
                                            }
                                        }
                                    }
                                    else{
                                        if(controlFormulas[formulasType].hasOwnProperty('instance')){
                                            let formulasInstance = controlFormulas[formulasType].instance;
                                            this.getRootControlData(controlInstance, formulasInstance, listTableRootControl, listRootControl, impactedFieldsListWhenStart, formulasType);
                                        }
                                    }
									
								}
							}
						}
                    }
                }
                // lưu lại các mối quan hệ cho lần submit sau ko phải thực hiện các bước tìm quan hê này (các root control , các luồng chạy công thức)
                let dataPost = {impactedFieldsList:impactedFieldsList,impactedFieldsListWhenStart:impactedFieldsListWhenStart,rootControl:listRootControl,tableRootControl:listTableRootControl};
                documentApi.updatePreDataForDoc({documentId:this.documentId,prepareData:JSON.stringify(dataPost)})
            }
            if(listRootControl.length == 0){
                this.hidePreloader();
            }
            this.pushDataRootToStore(impactedFieldsList,impactedFieldsListWhenStart,listTableRootControl)
        },


        /**
         * Hàm kiểm tra xem control có phải là root hay ko(cả trong table), nếu có đưa vào biến và lưu lại trên db
         */
        getRootControlData(controlInstance, formulasInstance, listTableRootControl, listRootControl, impactedFieldsListWhenStart, formulasType){
            let controlName = controlInstance.name;
            let controlRootInTable = this.checkControlOutSideTable(controlInstance,formulasInstance.getInputControl());
            if(controlRootInTable != false){
                if(listTableRootControl.hasOwnProperty(controlInstance.inTable) == false){
                    listTableRootControl[controlInstance.inTable] = {};
                }
                listTableRootControl[controlInstance.inTable][controlRootInTable] = false;
            }
            if(formulasInstance.getFormulas() !== "" && Object.keys(formulasInstance.getInputControl()).length == 0){
                impactedFieldsListWhenStart[controlName] = false;
                if(!listRootControl.includes(controlName)){
                    listRootControl.push(controlName);
                }
                this.handlerBeforeRunFormulasValue(formulasInstance,controlInstance.id,controlName,formulasType,'root')
            }
        },
        /**
         * Hàm kiểm tra các input của 1 control có nằm trong cùng table đó hay không
         */
        checkControlOutSideTable(controlInstance,InputControl){
            if(controlInstance.inTable != false ){
                for(let controlName in InputControl){
                    let controlInputIns = getControlInstanceFromStore(this.keyInstance,controlName);
                    if(controlInputIns.inTable == controlInstance.inTable){
                        return false;
                    }
                }
                return controlInstance.name;
            }
            return false
        },
        /**
         * Lấy tất cả các control bị ảnh hưởng khi mà một control thay đổi giá trị
         */
        setAllImpactedFieldsList(fieldName) {
            impactedFieldsList[fieldName] = {};
            impactedFieldsArr = this.getAllImpactedInput(fieldName);
            for (var i = 0; i < impactedFieldsArr.length; i++) {
                impactedFieldsList[fieldName][impactedFieldsArr[i]] = false;
            }
        },
        
        getAllImpactedInput(sourceName) {
            let sourceControlInstance = getControlInstanceFromStore(this.keyInstance,sourceName);
            var arr = [];
            if (sourceControlInstance != false) {
                for (var i in sourceControlInstance['effectedControl']) {
                    arr.push(i);
                    arr = arr.concat(this.getAllImpactedInput(i)); 
                }
            }
            return arr;
        },
        /**
         * 
         */
        goToListDocument(){
            this.drawer = false;
            this.$goToPage('/documents/'+this.documentId+'/objects',"Danh sách bản ghi");
        },
        /**
         * Ham call back từ sub form ra compon submit chính và bind giá trị cho control 
         */
        submitSubFormSuccess(data){
            if(!data.isContinueSubmit){
                this.drawer = false; 
            }
            let controlOpenSubform = this.sDocumentSubmit.controlOpenSubform;
            let columnBindingSubForm = controlOpenSubform.columnBindingSubForm;
            let dataBinding = data[columnBindingSubForm];
            controlOpenSubform.setValue(dataBinding);
        },
        resetDataSubmit(){
            let listInputInDocument = getListInputInDocument(this.keyInstance);
            for(let controlName in listInputInDocument){
                if(listInputInDocument[controlName].type=='table'){
                    listInputInDocument[controlName].setData(listInputInDocument[controlName].defaultValue);
                    this.updateListInputInDocument(
                        controlName,
                        "value",
                        listInputInDocument[controlName].defaultValue
                    );
                }
                else if(!listControlNotNameProp.includes(listInputInDocument[controlName].type)){
                    listInputInDocument[controlName].setValue(listInputInDocument[controlName].defaultValue);
                    this.updateListInputInDocument(
                        controlName,
                        "value",
                        listInputInDocument[controlName].defaultValue
                    );
                }
            }
            
        },
        /**
         * Hàm kiểm tra xem có tham sô editableControls được truyền vào hay ko
         * nếu có truyền vào thì chỉ được phép nhập liệu trên cac control đó, các control còn lại đánh dấu readonly
         */
        checkEditableControl(controlName, field){
            if(this.editableControls && !this.editableControls.includes(controlName) && field.properties.hasOwnProperty('isReadOnly')){
                field.properties.isReadOnly.value = true;
            }
        },
        /**
         * Hàm kiểm tra có các công thức giá trị được truyền vào để ghi đè hay ko
         * nếu có thì thay thế formulas hiện tại
         */
        checkOverrideFormulas(controlName, field){
            if(Object.keys(this.overrideControls).length > 0 && Object.keys(this.overrideControls).includes(controlName)){
                this.preDataSubmit.rootControl.push(controlName)

                if(!field.formulas.formulas){
                    field.formulas['formulas'] = {
                        value:{}
                    }
                    field.formulas['formulas']['value'][Date.now()] = this.overrideControls[controlName]['formulas'];
                }
                else{
                    field.formulas.formulas.value[Object.keys(field.formulas.formulas.value)[0]] = this.overrideControls[controlName]['formulas'];
                }
            }
        },
        afterFileUpload(data){
            let url = data.serverPath;
            this.currentImageControl.controlIns.setValueControl(url);
            this.updateListInputInDocument(
                this.currentImageControl.controlName,
                "value",
                url
            );
        }
    }
    
    
};
</script>
<style  scoped>
.sym-form-submit {
    position: unset;
    width: 21cm;
    padding: 16px;
    margin: auto;
}
.sym-form-submit >>> .on-selected {
    border: none !important;
}
.sym-form-submit >>> table:not(.htCore) td,
.sym-form-submit >>> table:not(.htCore),
.sym-form-submit >>> table:not(.htCore) th {
    border: none !important;
}
/* .sym-form-submit >>> .htCore td:nth-last-child(3) {
    border-right: 1px solid #ccc !important;
}
.sym-form-submit >>> .htCore thead tr th:nth-last-child(3) {
    border-right: 1px solid #ccc !important;
} */

.sym-form-submit >>> .handsontable[s-control-type="table"]{
    border-right: 1px solid #ccc;
}
.sym-form-submit >>> .ht_clone_left.handsontable table.htCore {
    border-right: none;
}

#toggle-doc-size {
    position: absolute;
    right: 30px;
    top: 50px;
    padding: 4px 12px;
    font-size: 20px;
    border-radius: 4px;
    background: #fafafa;
    opacity: 1;
    color: #757575;
    transition: ease-in-out 300ms;
}
#toggle-doc-size:hover {
    background: #dddddd;
}
#toggle-doc-size:focus {
    outline: none;
}
/* This is for documentation purposes and will not be needed in your application */
.sym-form-submit >>> .v-speed-dial {
    position: absolute;
}

.sym-form-submit >>> .v-btn--floating {
    position: relative;
}
.wrap-content-submit{
    width: 100%;
    height: calc(100vh - 100px);
    overflow: hidden;
    background: white;
}
.wrap-content-submit .scroll-content{
    position: relative;
    overflow-x: hidden;
}
.wrap-content-submit .icon{
    font-size: 20px !important;
}
.v-navigation-drawer >>> .wrap-content-submit{
    height: calc(100%);
}
.sub-form-action{
    float: right;
    font-size: 13px;
}
.subfom-action__item{
    margin: 0 8px 0 0;
    padding: 4px 12px;
    border-radius: 4px;
    transition: all ease-in-out 250ms;
    background: var(--symper-background-default);

}
.subfom-action__item:focus{
    outline: none;
}
.subfom-action__item:hover{
    background: var(--symper-background-hover);
}
.subfom-action__item .mdi{
    margin-right: 4px;
}
.v-navigation-drawer >>> .sym-sub-form-submit  .sym-form-submit{
    height: calc(100% - 30px) !important;
}
</style>



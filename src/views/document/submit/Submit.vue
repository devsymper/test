<template>
    <div :class="globalClass">
    <VuePerfectScrollbar class="scroll-content h-100">
         
        <Preloader ref="preLoaderView"/>
        <div
            :key="keyInstance"
            class="sym-form-submit"
            :id="'sym-submit-'+keyInstance"
            :style="{'width':docSize, 'height':'100%','opacity':0}"
        >
            <date-picker
                :keyInstance="keyInstance"
                @clickDateCell="selectedDate"
                :title="'Chọn ngày'"
                :isTime="false"
                ref="datePicker"
            />
            <FloattingPopup 
                ref="floattingPopup" 
                :focusingControlName="focusingControlName"
                :instance="keyInstance"/>
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
            ref="timeInput" />
            
            <err-message :listErr="listMessageErr" ref="errMessage" @after-close-dialog="afterCloseDialogValidate"/>
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
                style="z-index:199; position: fixed;"
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
    <PopupPivotTable ref="popupPivotTableView" :instance="keyInstance" :dataColPivot="dataColPivot" :data="dataPivotMode" @before-add-pivot-data="beforeAddPivotData"/>
    <input type="text" class="input-pivot" @keyup="afterKeyupInputPivot" @blur="afterBlurInputPivot" v-if="dataPivotTable">
    
    </div>
     
</template>
<script>
import { documentApi } from "./../../../api/Document.js";
import { formulasApi } from "./../../../api/Formulas.js";
import { userApi } from "./../../../api/user.js";
import "./../../../components/document/documentContent.css";
import {allControlNotSetData,getMapControlEffected,checkInfinityControl, getDataInputFormula } from "./../../../components/document/dataControl";
import BasicControl from "./basicControl";
import TableControl1 from "./tableControl1";
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
import EmbedDataflow from "@/components/dataflow/EmbedDataflow";
// import Loader from './../../../components/common/Loader';
import Preloader from './../../../components/common/Preloader';
import {listControlNotNameProp} from "./../../../components/document/controlPropsFactory.js"
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import FloattingPopup from './../common/FloattingPopup'
import PopupPivotTable from './items/PopupPivotTable'

import tinymce from 'tinymce/tinymce';


import { checkCanBeBind, resetImpactedFieldsList, markBinedField, checkDataInputChange, setDataInputBeforeChange } from './handlerCheckRunFormulas';
import {checkControlPropertyProp,getControlInstanceFromStore, 
        getControlTitleFromName, getListInputInDocument, 
        mapTypeToEffectedControl, minimizeDataAfterRunFormula,SQLITE_COLUMN_IDENTIFIER} from './../common/common'
import Formulas from './formulas.js';
import { startWorkflowBySubmitedDoc } from '../../../components/process/processAction.js';


import ControlRelationWorker from 'worker-loader!@/worker/document/submit/ControlRelation.Worker.js';
import FormulasWorker from 'worker-loader!@/worker/document/submit/Formulas.Worker.js';

let impactedFieldsList = {};
let impactedFieldsArr = {};

export default {
    inject: ['theme'],
    props: {
        showSnackbarSuccess: {
            type: Boolean,
            default: true
        },
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
            default:'submit'
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
        },
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
        FloattingPopup,
        PopupPivotTable
    },
    computed: {
        sDocumentEditor() {
            return this.$store.state.document.editor[this.keyInstance];
        },
        sDocumentSubmit() {
            return this.$store.state.document.submit[this.keyInstance];
        },
        sDocumentDetail(){
            return this.$store.state.document.detail[this.keyInstance]
        },
        endUserInfo(){
            return this.$store.state.app.endUserInfo;
        },
        viewType(){
            return this.$store.state.document.viewType[this.keyInstance]
        },
        
        linkControl(){
            return this.$store.state.document.linkControl[this.keyInstance]
        },
        baInfo(){
            return this.$store.state.app.baInfo
        },
        isBa(){
            return this.$store.state.app.baInfo.id
        },
        currentRowChangePivotMode(){
            return this.$store.state.document.submit[this.keyInstance].currentRowChangePivotMode
        },
        validateControl(){
            return this.$store.state.document.submit[this.keyInstance].validateMessage   
        }
    },
    
    destroyed(){
        this.closeFormulasWorker();
    },
    data() {
        return {
            controlInfinity:[],
            focusingControlName: '',
            contentDocument: null,
            documentInfo:null,
            documentId: null,
            documentName: null,
            docSize: null,
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
			isDraft:0,
            preDataSubmit:{},
            objectIdentifier:{},
            otherInfo:{},
            listDataFlow:[],
            docSubFormId:0,
            drawer: false,
            isContinueSubmit:false,
            titleObjectFormula:null,
            isShowTraceControlSidebar:false,
            listFormulasTrace:{},
            controlTrace:null,
            listFileControl:[],
            currentFileControl:null,
            currentControlDataflow:null,
            dataGroupTable:{},
            dataPivotTable:{},
            dataColPivot:[],
            dataPivotMode:[],
            globalClass:null,
            controlRelationWorker:null,
            formulasWorker:null,
            optionalDataBinding:null
        };

    },
    beforeMount() {
        this.columnsSQLLiteDocument = {};
        this.globalClass = {
            'wrap-content-submit':true,
            'sym-sub-form-submit':(this.parrentInstance == 0) ? false : true,
        }
    },
    mounted() {
        this.optionalDataBinding = {},
        this.optionalDataBinding['context'] = this.docObjId
        this.optionalDataBinding['document_object_id'] = ""
        this.optionalDataBinding['action'] = ""
        let thisCpn = this;
        this.controlRelationWorker = new ControlRelationWorker();
        this.controlRelationWorker.addEventListener("message", function (event) {
            let data = event.data;
            switch (data.action) {
                case 'setDataForPropsControl':
                    let listControlToStore = data.dataAfter.listControlToStore;
                    let controlMapDatasetDataflow = data.dataAfter.controlMapDatasetDataflow;
                    for(let controlId in listControlToStore){
                        thisCpn.$store.commit(
                            "document/addControl", { id: controlId, props: listControlToStore[controlId], instance: thisCpn.keyInstance }
                        );
                    }
                    thisCpn.$store.commit(
                        "document/addToDocumentSubmitStore", { key: 'listControlMappingDatasets', value: controlMapDatasetDataflow, instance: thisCpn.keyInstance }
                    );
                    thisCpn.formulasWorker.postMessage({action:'updateDocumentObjectId',data:{keyInstance:thisCpn.keyInstance,updateDocumentObjectId:thisCpn.docObjId}})
                    thisCpn.processHtml(thisCpn.contentDocument);
                    thisCpn.controlRelationWorker.terminate();
                    break;
                default:
                    break;
            }
        });
        /**
         * Lắng nghe sự kiện từ luồng xử lí formulas
         */
        this.formulasWorker.addEventListener("message", function (event) {
            let data = event.data;
            switch (data.action) {
                case 'afterRunFormulasSuccess':
                    let controlName = data.dataAfter.controlName;
                    let res = data.dataAfter.res;
                    let formulaType = data.dataAfter.formulaType;
                    let from = data.dataAfter.from;
                    let dataRowId = data.dataAfter.dataRowId;
                    let controlIns = getControlInstanceFromStore(thisCpn.keyInstance, controlName)
                    if(['rowTable','columnTable'].includes(from)){
                        let tableControl = getControlInstanceFromStore(thisCpn.keyInstance, controlIns.inTable);
                        tableControl.tableInstance.afterRunFormula(res, formulaType , controlIns, dataRowId, from);
                    }
                    else{
                        thisCpn.handleAfterRunFormulas(res,controlName,formulaType,from);
                    }
                    break;
                case 'afterCreateSQLiteDB':
                    thisCpn.handleLoadContentDocument();
                    break;
                case 'getDataInputFormula':
                    let dataInputObjectIdentifier = data.dataAfter.dataInputObjectIdentifier
                    let dataInputTitleObjectFormulas = data.dataAfter.dataInputTitleObjectFormulas
                    let dataInputFormula = {}
                    if(dataInputObjectIdentifier){
                        dataInputFormula['dataInput'] = dataInputObjectIdentifier
                    }
                    if(dataInputTitleObjectFormulas){
                        dataInputFormula['dataInputTitle'] = dataInputTitleObjectFormulas
                    }
                    thisCpn.startSubmitDocument(dataInputFormula);
                    break;
                default:
                break;
            }
        });
        $('#sym-submit-'+this.keyInstance).on('click','.validate-icon',function(e){
            let controlName = $(this).attr('control-name');
            let validate = thisCpn.validateControl[controlName];
            let msg = "";
            for(let vldType in validate){
                msg += vldType +" : "+validate[vldType];
            }
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
        tinymce.remove()
        this.formulasWorker = new FormulasWorker();
        this.formulasWorker.postMessage({action:'createSQLiteDB',data:{keyInstance:this.keyInstance}})
        this.formulasWorker.postMessage({action:'addWorkflowVariable',data:{keyInstance:this.keyInstance, workflowVariable:this.workflowVariable}})
        this.$store.commit("document/setDefaultSubmitStore",{instance:this.keyInstance});
        this.$store.commit("document/setDefaultDetailStore",{instance:this.keyInstance});
        this.$store.commit("document/setDefaultEditorStore",{instance:this.keyInstance});
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

        // đặt trang thái của view là submit => isDetailView = false
        this.$store.commit("document/changeViewType", {
            key: this.keyInstance,
            value: this.action,
        });
        
        /**
         * Nhận xử lí sự kiện click chuyển đổi dạng table <=> pivot mode
         */
        this.$evtBus.$on("on-switch-pivot-table-mode", locate =>{
            if(thisCpn._inactive == true) return;
            let tableName = locate.tableName;
            let tableInstance = getControlInstanceFromStore(this.keyInstance,tableName);
            tableInstance.tableMode = (tableInstance.tableMode == 'Flat') ? 'Pivot' : 'Flat';
            tableInstance.switchTable();
        })
        /**
         * Nhận xử lí sự kiện thêm dữ liệu cho bảng pivot
         */
        this.$evtBus.$on("on-add-data-to-pivot-table", locate => {
            if(thisCpn._inactive == true) return;
            let type = locate.type;
            let tableName = locate.tableName;
            let tableInstance = getControlInstanceFromStore(this.keyInstance,tableName);
            let pivotData = tableInstance.pivotTable.getDataGroup();
            let rowsConfig = pivotData['rows'];
            this.dataColPivot = [];
            this.dataPivotMode = [];
            for (let index = 0; index < rowsConfig.length; index++) {
                let controlName = rowsConfig[index];
                let controlBindData = getControlInstanceFromStore(this.keyInstance,controlName);
                let value = controlBindData.value;
                let uniqueData = value.filter(function(value, index, self){
                    return self.indexOf(value) === index;
                })
                let inputData = {controlName:controlName, controlTitle:controlBindData.title,value:uniqueData, type:'rows'};
                if(tableInstance.pivotTable.pivotConfig.rows.length >1){
                    inputData.detailTitle = "Bỏ trống nếu muốn thêm dữ liệu cho toàn bộ dòng";
                    this.dataPivotMode.push(inputData);
                }
                else{
                    inputData.isDisable = true;
                    this.dataPivotMode.push(inputData);
                }
            }
            let colsConfig = pivotData['cols'];
            for (let index = 0; index < colsConfig.length; index++) {
                let controlName = colsConfig[index];
                let controlBindData = getControlInstanceFromStore(this.keyInstance,controlName);
                let value = controlBindData.value;
                let uniqueData = value.filter(function(value, index, self){
                    return self.indexOf(value) === index;
                })
                if(type == 'cols'){
                    this.dataColPivot.push({controlName:controlName, controlTitle:controlBindData.title});
                }
                else{
                    this.dataPivotMode.push(
                        {
                            controlName:controlName, 
                            controlTitle:controlBindData.title,
                            value:uniqueData,
                            type:'cols' ,
                            detailTitle:"Bỏ trống nếu muốn thêm dữ liệu cho toàn bộ cột"
                        }
                    );
                }
            }
            
            this.$refs.popupPivotTableView.show(type, tableName);
        });

        this.$evtBus.$on("on-info-btn-in-table-click", locate => {
            if(thisCpn._inactive == true) return;
            let e = locate.e;
            let row = locate.row;
            let controlName = locate.controlName;
            this.focusingControlName = controlName;
            this.$refs.floattingPopup.show(e, $('#sym-submit-'+this.keyInstance), row);
        });
        /**
         * Su kiện phát ra khi có sự thay đổi trong table, để convert sang pivot table
         */
        this.$evtBus.$on("document-on-table-change", locate => {
            if(thisCpn._inactive == true) return;
            let tableName = locate.tableName;
            if(this.dataPivotTable && this.dataPivotTable[tableName]){
                let data = locate.data;
                let tableIns = getControlInstanceFromStore(this.keyInstance, tableName);
                this.setDataToPivotTable(tableIns,data);
            }
        });

        this.$evtBus.$on("run-formulas-control-outside-table", e => {
            if(thisCpn._inactive == true) return;
            try {
                let formulaInstance = e.formulaInstance;
                let controlName = e.controlName;
                let controlInstance = thisCpn.sDocumentSubmit.listInputInDocument[controlName];
                this.handlerBeforeRunFormulasValue(formulaInstance, controlName, 'formulas');
            } catch (error) {
                console.warn(error);
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
            this.currentFileControl = {controlIns:data.control};
            this.$refs.fileUploadView.onButtonClick();
        });
        this.$evtBus.$on("document-submit-add-file-click", data => {
            if(thisCpn._inactive == true) return;
            this.currentFileControl = {controlIns:data.control};
            this.$refs.fileUploadView.onButtonClick();
        });
        var delayTimer;
        // hàm nhận sự kiện thay đổi của input
        this.$evtBus.$on("document-submit-input-change", controlInstance => {
           if(this._inactive == true) return;
                let valueControl = controlInstance.value;
                if(controlInstance.checkAutoCompleteControl()){
                    clearTimeout(delayTimer);
                    // delay trong trường hợp chọn dòng trong box autocomplete thì đã kích hoạt sự kiện onchange
                    // lúc này input chưa có dữ liệu đên phải delay
                    delayTimer = setTimeout(function() {
                        thisCpn.handleInputChangeByUser( controlInstance, valueControl);
                    }, 300);
                }
                else{
                    this.handleInputChangeByUser( controlInstance, valueControl);
                }
        });
        this.$evtBus.$on("run-effected-control-when-table-change", control => {
            if(this._inactive == true) return;
            this.handlerBeforeRunFormulasValue(control.controlFormulas.formulas.instance,control.name,'formulas');
        });
        this.$evtBus.$on("document-submit-open-validate-message", e => {
            if(this._inactive == true) return;
            this.messageValidate = e.msg;
            this.$refs.validate.show(e);
        });
       
        this.$evtBus.$on("document-submit-show-time-picker", e => {
            if(this._inactive == true) return;
            this.$refs.timeInput.show(e);
        });
        this.$evtBus.$on("document-submit-date-input-click", e => {
            if(this._inactive == true) return;
            let controlIns = getControlInstanceFromStore(this.keyInstance,e.controlName);
            this.$refs.datePicker.setRange(controlIns.minDate,controlIns.maxDate);
            this.$refs.datePicker.openPicker(e);
            this.$store.commit("document/updateCurrentControlEditByUser", {
                currentControl: e.controlName,
                instance: this.keyInstance
            });
        });
        /**
         * Sự kiện bắn ra từ click vào input filter để mở popup
         */
        this.$evtBus.$on("document-submit-filter-input-click", e => {
            if(this._inactive == true) return;
            let inputOffset = $(e.target).offset();
            let submitFormOffset = $('#sym-submit-'+this.keyInstance).offset();
            let submitFormWidth = $('#sym-submit-'+this.keyInstance).width();
            let leftDiff   = inputOffset.left - submitFormOffset.left;
            let cardWidth  = 600;
            let cardHeight = 400;
            let inputWidth = $(e.target).width();
            if(cardWidth + leftDiff > submitFormWidth){
                this.leftPositionDragPanel = Math.abs(inputOffset.left + inputWidth - cardWidth);
                this.topPositionDragPanel = inputOffset.top + 26 ;
            }
            else{
                this.leftPositionDragPanel = Math.abs(inputOffset.left);
                this.topPositionDragPanel = inputOffset.top + 26 ;
            }
            if(window.innerHeight < inputOffset.top + 400){
                this.topPositionDragPanel = Math.abs(inputOffset.top - cardHeight);
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
                if((e.e.keyCode >= 96 && e.e.keyCode <= 105) ||
                    (e.e.keyCode >= 48 && e.e.keyCode <= 57) ||
                    (e.e.keyCode >= 65 && e.e.keyCode <= 90) || [189,16,8,32,231].includes(e.e.keyCode)) { // nếu key code là các kí tự chữ và số hợp lệ
                    let controlIns = getControlInstanceFromStore(thisCpn.keyInstance, e.controlName);
                    if(!thisCpn.$refs.autocompleteInput.isShow()){
                        thisCpn.$refs.autocompleteInput.setTypeInput('autocomplete');
                        thisCpn.$refs.autocompleteInput.setControlValueKey(controlIns.getAutocompleteKeyValue());
                        thisCpn.$refs.autocompleteInput.show(e.e, e.controlName);
                    }
                    if(!e.isSelect){
                        thisCpn.getDataForAutocomplete(e,'autocomplete',"",controlIns);
                    }
                }
                else if((e.e.keyCode < 37 || e.e.keyCode > 40)){
                    thisCpn.$refs.autocompleteInput.hide();
                }
                
                
            } catch (error) {
                console.warn(error);
            }
            
        });
        // sự kiện ném ra khi gõ vào control department
        // một số key code gõ vào thì ko mở hoặc phải đóng đi
        this.$evtBus.$on("document-submit-department-key-event", e => {
            if(this._inactive == true) return;
            try {
                if((e.e.keyCode >= 97 && e.e.keyCode <= 105) ||
                    (e.e.keyCode >= 48 && e.e.keyCode <= 57) ||
                    (e.e.keyCode >= 65 && e.e.keyCode <= 90) || [189,16,8,32,231].includes(e.e.keyCode)) { // nếu key code là các kí tự chữ và số hợp lệ
                    if(!this.$refs.autocompleteInput.isShow()){
                        let controlIns = getControlInstanceFromStore(thisCpn.keyInstance, e.controlName);
                        thisCpn.$refs.autocompleteInput.setControlValueKey(controlIns.getAutocompleteKeyValue());
                        this.$refs.autocompleteInput.show(e.e, e.controlName);
                    }
                    this.getDataOrgchart(e);
                }
                else if((e.e.keyCode < 37 || e.e.keyCode > 40)){
                    this.$refs.autocompleteInput.hide();
                }
                
            } catch (error) { 
                
            }
            
        });
        // hàm nhận sự thay đổi của input select gọi api để chạy công thức lấy dữ liệu
        this.$evtBus.$on("document-submit-select-input", e => {
            if(this._inactive == true) return;
            try { 
                let controlName = (e.cellActive) ? e.alias + ":"+e.cellActive[0][0]+":"+e.cellActive[0][1] : e.alias;
                this.$refs.autocompleteInput.show(e.e, controlName);
                let controlIns = getControlInstanceFromStore(this.keyInstance, controlName);
                this.$refs.autocompleteInput.setControlValueKey(controlIns.getAutocompleteKeyValue());
                this.$refs.autocompleteInput.setTypeInput(e.type);
                if(e.type == 'combobox'){
                    this.$refs.autocompleteInput.setSingleSelectCombobox(e.isSingleSelect);
                }
                this.getDataForAutocomplete(e,e.type,e.alias);
            } catch (error) {
                console.log('errorerrorerror',error);
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
                    thisCpn.$refs.timeInput &&
                    !$(evt.target).hasClass("s-control-time") &&
                    !$(evt.target).hasClass("card-time-picker") &&
                    $(evt.target).closest(".card-time-picker").length == 0
                ) { 
                        thisCpn.$refs.timeInput.hide();
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
            if(!data.isTable){
                 data.control.renderCurrentTraceControlColor();
            }
            else{
                data.control = getControlInstanceFromStore(this.keyInstance, data.tableName)
            }
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
                                    let cellValue = tableControl.tableInstance.getCellData(controlName, 0);
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
                this.controlRelationWorker.postMessage({action:'setDataForPropsControl',data:
                    { fields: vl.fields, viewType: this.viewType, allDataDetail: this.sDocumentDetail.allData}
                });
            }
        }
    },
    
    methods: {
        closeFormulasWorker(){
            this.formulasWorker.postMessage({action:'closeDB',data:{keyInstance:this.keyInstance}});
            this.formulasWorker.terminate();
        },
        handleLoadContentDocument(){
            if(this.documentId != null && this.documentId != 0){
                this.loadDocumentData();
            }
            if(this.docObjId != null){
                this.loadDocumentObject();
            }
        },
        checkUpdateByWorkflow(){
            let updateByWorkflowId = this.documentInfo.updateByWorkflowId;
            if(updateByWorkflowId && this.$getRouteName() == 'updateDocumentObject'){
                startWorkflowBySubmitedDoc(updateByWorkflowId, {document_id:this.docId})
            }
        },
        afterBlurInputPivot(event){
            $(event.target).css({display:'none'});
            this.updateDataAfterChangePivot($(event.target));

        },
        afterKeyupInputPivot(event){
            if(event.which == 13){
                $(event.target).css({display:'none'});
            }
        },
        /**
         * Hàm nhận biết sự thay đổi của cell đang nhập ở bảng pivot từ đó update lại data
         */
        updateDataAfterChangePivot(input){
            let currentRowChangePivotMode = this.currentRowChangePivotMode;
            let keyChange = currentRowChangePivotMode.key;
            let value = currentRowChangePivotMode.value;
            let tableName = currentRowChangePivotMode.tableName;
            let type = currentRowChangePivotMode.type;
            if(type && type == 'group' && value.length > 0){
                for (let index = 0; index < value.length; index++) {
                    value[index][keyChange] = input.val();
                }
                if(value[0][SQLITE_COLUMN_IDENTIFIER]){  // edit dòng đã có
                    this.updateToTableNomalData(tableName, value, []);
                }
                else{   // thêm dòng mới cho table thường
                    this.updateToTableNomalData(tableName, [], value);
                }
                
            }
            else{
                value[keyChange] = input.val();
                if(value[SQLITE_COLUMN_IDENTIFIER]){  // edit dòng đã có
                    this.updateToTableNomalData(tableName, [value], []);
                }
                else{   // thêm dòng mới cho table thường
                    this.updateToTableNomalData(tableName, [], [value]);
                }    
            }
        },
        /**
         * Xử lí update data ngược lại từ bảng pivot -> table nomal
         */
        beforeAddPivotData(data){
            let tableName = data.tableName;
            let type = data.type;
            let dataRowGroup = data.dataRowGroup;
            let dataColPivot = data.dataColPivot;
            let rowData = [];
            let rowSelected = dataRowGroup.filter(r=>{
                return r.selected != undefined;
            })
            for (let index = 0; index < dataRowGroup.length; index++) {
                let cell = dataRowGroup[index];
                if(cell.type != type){
                    if(!cell.selected){
                        for (let i = 0; i < cell.value.length; i++) {
                            let dataItem = {};
                            if(rowSelected.length > 0){
                                dataItem[rowSelected[0]['controlName']] = rowSelected[0]['selected']
                            }
                            dataItem[cell.controlName] = cell.value[i];
                            rowData.push(dataItem);
                        }
                    }
                    else{
                        let dataItem = {};
                        if(rowSelected.length > 0){
                            dataItem[rowSelected[0]['controlName']] = rowSelected[0]['selected']
                        }
                        dataItem[cell.controlName] = cell.selected;
                        rowData.push(dataItem);
                    }
                }
            }
            for (let index = 0; index < dataColPivot.length; index++) {
                let cell = dataColPivot[index];
                if(rowData.length > 0){
                    for (let i = 0; i < rowData.length; i++) {
                        rowData[i][cell.controlName] = cell.selected;
                    }
                }else{
                    let tableControl = getControlInstanceFromStore(this.keyInstance,tableName);
                    let hotTb = tableControl.tableInstance.tableInstance;
                    let allData = hotTb.getSourceData();
                    for (let index = 0; index < allData.length; index++) {
                        let dataItem = {};
                        dataItem[cell.controlName] = cell.selected;
                        rowData.push(dataItem);
                    }
                }
                
            }
            
            this.updateToTableNomalData(tableName,[],rowData)
            this.$refs.popupPivotTableView.hide();
        },
        /**
         * Hàm call lại chuẩn bị data để thêm vào bảng nomal sau khi có sự thay đổi ở bảng pivot
         */
        updateToTableNomalData(tableName, oldData = [], newData = []){
            let tableControl = getControlInstanceFromStore(this.keyInstance,tableName);
            let hotTb = tableControl.tableInstance.tableInstance;
            let allData = hotTb.getSourceData();
            let allColumn = hotTb.getColHeader();
            let allColumnTable = tableControl.controlInTable;
            if(oldData.length > 0){
                for (let index = 0; index < allData.length; index++) {
                    for (let i = 0; i < oldData.length; i++) {
                        let rowChange = oldData[i];
                        if(allData[index][SQLITE_COLUMN_IDENTIFIER] == rowChange[SQLITE_COLUMN_IDENTIFIER]){
                            allData[index] = rowChange;
                        }
                    }
                    delete allData[index][SQLITE_COLUMN_IDENTIFIER];
                    for(let control in allColumnTable){
                        if(!allData[index][control]){
                            allData[index][control] = null;
                        }
                    }
                }
            }
            else{
                if(newData.length > 0){
                    for (let i = 0; i < newData.length; i++) {
                        let rowData = newData[i];
                        for (let index = 0; index < allData.length; index++) {
                            for(let control in allColumnTable){
                                if(!allData[index][control]){
                                    allData[index][control] = null;
                                }
                            }
                            delete allData[index][SQLITE_COLUMN_IDENTIFIER];
                        }
                        for (let control in allData[0]) {
                            if(!rowData[control]){
                                rowData[control] = null;
                            }
                        }
                        allData.push(rowData);
                    }
                }
            }
            tableControl.tableInstance.setData(allData, false);
        },
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
                    let controlName = item.name;
                    let listInputInDocument = getListInputInDocument(this.keyInstance);
                    if(param)
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
            if(this._inactive == true) return;
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
            let aliasControl = e.formulaInstance.autocompleteDetectAliasControl();
            let listInput = getListInputInDocument(this.keyInstance);
            let dataInput = e.formulaInstance.getDataInputFormula(listInput,e);
            for(let controlName in dataInput){
                if(Array.isArray(dataInput[controlName])){
                    dataInput[controlName] = dataInput[controlName][e.e.rowIndex];
                }
            }
            let dataFromCache = this.getDataAutocompleteFromCache(aliasControl, dataInput);
            if(dataFromCache == false){
                e.formulaInstance.handleBeforeRunFormulas(dataInput).then(res=>{
                    thisCpn.setDataForControlAutocomplete(res,aliasControl,e.controlTitle)
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
        getDataForAutocomplete(e,type,aliasControl="", controlIns){ 
            let thisCpn = this
            let listInput = getListInputInDocument(this.keyInstance);
            if(['select','combobox'].includes(type)){
                let formulaIns = controlIns.getFormulaInstance('list');
                let dataInput = getDataInputFormula(formulaIns,listInput,this.optionalDataBinding, e.rowIndex);
                this.formulasWorker.postMessage({action:'runFormula',data:{
                    formulaInstance:formulaIns, 
                    dataInput:dataInput,
                    controlName:aliasControl,
                    keyInstance:this.keyInstance}})
            }
            else{
                let formulaIns = controlIns.getFormulaInstance('autocomplete');
                let dataControlAutocompleting = {};
                dataControlAutocompleting[controlIns.name] = e.e.target.value;
                let dataInput = getDataInputFormula(formulaIns,listInput,this.optionalDataBinding, e.rowIndex, dataControlAutocompleting);
                let aliasControl = formulaIns.autocompleteDetectAliasControl();
                let dataFromCache = this.getDataAutocompleteFromCache(aliasControl, dataInput);
                if(dataFromCache == false){
                    this.formulasWorker.postMessage({action:'runFormula',data:
                        {
                            formulaInstance:formulaIns,
                            dataInput:dataInput, 
                            controlName:aliasControl, 
                            rowIndex:e.e.rowIndex,
                            keyInstance:this.keyInstance
                        }
                    })
                }
                else{
                    this.$refs.autocompleteInput.setAliasControl(aliasControl);
                    this.$refs.autocompleteInput.setData(dataFromCache);
                }
            }
        },

        // hàm lấy data từ cache của control autocomplete
        getDataAutocompleteFromCache(controlName, dataInput){
            let groupKey = [];
            for(let ctlName in dataInput){
                groupKey.push(dataInput[ctlName]);
            }
            groupKey = groupKey.join("-");
            if(this.sDocumentSubmit.autocompleteData.hasOwnProperty(controlName) &&
                this.sDocumentSubmit.autocompleteData[controlName].header.hasOwnProperty(groupKey) &&
                this.sDocumentSubmit.autocompleteData[controlName].cacheData.hasOwnProperty(groupKey)
            ){
                return {
                    headers:this.sDocumentSubmit.autocompleteData[controlName].header[groupKey],
                    dataBody:this.sDocumentSubmit.autocompleteData[controlName].cacheData[groupKey]
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
        setDataForControlAutocomplete(res,aliasControl,controlTitle = ''){
            let fromSqlite = !res.server
            let controlAs = {};
            controlAs[aliasControl] = controlTitle;
            if(res.data){
                let dataTable = {};
                if(fromSqlite){
                    dataTable = this.handleDataAutoComplete(res.data,fromSqlite,controlAs);
                }
                else{
                    dataTable = this.handleDataAutoComplete(res.data.data,fromSqlite,controlAs);
                }
                
                this.$refs.autocompleteInput.setAliasControl(aliasControl);
                this.$refs.autocompleteInput.setData(dataTable);
                if(!controlTitle){
                    this.$refs.autocompleteInput.hideHeader();
                }
                if(dataTable.hasOwnProperty('headers')){
                    try {
                        let dataInput = res.data.dataInput;
                        let groupKey = [];
                        for(let controlName in dataInput){
                            groupKey.push(dataInput[controlName]);      
                        }
                        groupKey = groupKey.join("-");
                        let itemData = {};
                        let itemHeader = {};
                        itemData[groupKey] = dataTable.dataBody;
                        itemHeader[groupKey] = dataTable.headers;
                        this.$store.commit("document/cacheDataAutocomplete",{
                            instance: this.keyInstance,
                            controlName:aliasControl,
                            header:itemHeader,
                            cacheData:itemData,
                        })    
                    } catch (error) {
                        console.log(error,'errorerror');
                    }
                    
                }
            }
            else{
                this.$refs.autocompleteInput.setData([]);
            }
          
            
        },
        /**
         * Hàm bind dữ liệu cho control, và control trong bảng khi chọn apply trên timepicker
         */
        applyTimePicker(data){
            let time = data.value;
            let controlName = data.controlName;
            let controlInstance = getControlInstanceFromStore(this.keyInstance, controlName);
            if(controlInstance.inTable == false){
                controlInstance.setValue(time);
                controlInstance.triggerOnChange();
            }
            else{
                
            }
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
                
            }
        },
        /**
         * Hàm xử lí nhận dữ liệu component autocomplete khi chọn 1 dòng
         */
        afterSelectRowAutoComplete(data){
            // th này không phải trong table      
            let controlIns = getControlInstanceFromStore(this.keyInstance, data.controlName);
            if(controlIns.inTable == false){
                if(data.fromEnterKey){
                    this.handleInputChangeBySystem(data.controlName,data.value,true, false);
                    controlIns.unFocusInput();
                }
                else{
                    this.handleInputChangeBySystem(data.controlName,data.value,false,false);
                }
            }
        },



        /**
         * Hàm xử lí sau khi chạy công thức được điền dữ liệu vào input bởi hệ thống
         */
        handleInputChangeBySystem(controlName,valueControl, fromPopupAutocomplete = false, isRunChange = true){
            let controlInstance = getControlInstanceFromStore(this.keyInstance,controlName);
            markBinedField(this.keyInstance,controlName);
            controlInstance.setValue(valueControl);
            this.updateListInputInDocument(controlName, 'value',controlInstance.value);
            
            if(fromPopupAutocomplete){
                $('#'+controlInstance.id).attr('data-autocomplete',valueControl);
            }
            // sau khi thay đổi giá trị input thì kiểm tra require control nếu có
            controlInstance.checkRequire();
            if(isRunChange){
                this.handleControlInputChange(controlInstance);
            }
        },
        /**
         * Hàm  xử lí data sau khi query công thức autocomplete,
         * xử lí data về dạng object cho DataTable của vuetify
         */
        handleDataAutoComplete(data, isFromSQLLite,controlAs){
            let headers = [];
            let bodyTable = [];
            if(isFromSQLLite){
                if(data[0]){
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
                            thisCpn.checkUpdateByWorkflow();
                            thisCpn.getTitleObjectFormulas(res.data.document.titleObjectFormulasId)
                            thisCpn.docSize = (parseInt(res.data.document.isFullSize) == 1) ? "100%":"21cm";
                            thisCpn.contentDocument = content;
							if(res.data.document.dataPrepareSubmit != null && res.data.document.dataPrepareSubmit != "")
                            thisCpn.preDataSubmit = JSON.parse(res.data.document.dataPrepareSubmit);
                            if(res.data.document.otherInfo != null && res.data.document.otherInfo != "")
                            thisCpn.otherInfo = JSON.parse(res.data.document.otherInfo);
                            if(res.data.document.formStyle){
                                let style = JSON.parse(res.data.document.formStyle);
                                if(!style['globalClass']){
                                    style['globalClass'] = 'document-form-style-default'
                                }
                                this.globalClass[style['globalClass']] = true;
                            }
                            else{
                                this.globalClass['document-form-style-default'] = true;
                                
                            }
                            thisCpn.objectIdentifier = thisCpn.otherInfo.objectIdentifier;
                            thisCpn.dataPivotTable = res.data.pivotConfig;
                            thisCpn.dataGroupTable = res.data.groupConfig;
                            // đẩy phần xử lí data control xuống worker
                            thisCpn.controlRelationWorker.postMessage({action:'setDataForPropsControl',data:
                                { fields: res.data.fields, viewType: thisCpn.viewType, allDataDetail: thisCpn.sDocumentDetail.allData}
                            });
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
                    .finally(() => {});
            }
        },

        /**
         * hàm lấy thông tin của formulas cho title bản ghi
         */
        getTitleObjectFormulas(formulasId){
            if(formulasId && formulasId != 0){
                let self = this;
                formulasApi.detailFormulas(formulasId).then(res=>{
                    self.titleObjectFormula = new Formulas(self.keyInstance,res.data.lastContent,'titleObject');
                })
            }
            
        },

        /**
         * Hàm lấy thông tin của bản ghi trường hợp update 
         */
        loadDocumentObject() {
            let thisCpn = this;
            thisCpn.$store.commit("document/addToDocumentSubmitStore", {
                            key: 'documentObjectId',
                            value: this.docObjId,
                            instance: this.keyInstance
                        })
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
                .finally(() => {});
        },
        /**
         * Hàm chuyển kích thước view sang full size và ngược lại
         */
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
        /**
         * Khởi tạo các đối tượng control từ html
         * các control được đánh dâu bởi id có frefix: s-contorl-timestamp
         */
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
                    if(prepareData){
                        isSetEffectedControl = true;
                    }
                    if(valueInput == undefined || valueInput == null){
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
                            // trường hợp những control ở ngoài table dạng input
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
                            let controlInTable = {};
                            let tableControl = new TableControl1(
                                idField,
                                $(allInputControl[index]),
                                field,
                                thisCpn.keyInstance,
                                (this.dataPivotTable) ? this.dataPivotTable[controlName] : {},
                                (this.dataGroupTable) ? this.dataGroupTable[controlName] : {},
                            );
                            tableControl.setFormulasWorker(thisCpn.formulasWorker);

                            tableControl.setEffectedData(prepareData);
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
                                if(childPrepareData){
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
                                controlInTable[childControlName] = childControl;
                            });
                            tableControl.controlInTable = controlInTable;
                            tableControl.renderTable();
                            if(this.viewType !== 'submit'){
                                tableControl.setData(valueInput);
                            }
                            this.addToListInputInDocument(controlName,tableControl);
                            // tableControl.renderInfoButtonInRow(this.linkControl);
                        }
                    }
                }
            }
            this.listDataFlow = listDataFlow;
            if(!isSetEffectedControl){
                let listInput = getListInputInDocument(this.keyInstance);
                let mapControlEffected = getMapControlEffected(listInput);
                this.controlInfinity = checkInfinityControl(mapControlEffected)
                this.updateEffectedControlToStore(mapControlEffected)
                this.handleAfterGetMapControlEffected()
            }
            else{
                this.handleBeforeLoadedDocument()
            }
        },
        handleAfterGetMapControlEffected(){
            if(this.controlInfinity.length > 0 && this.isBa){
                this.listMessageErr = [];
                this.listMessageErr.push("Mối quan hệ giữa các control sau dẫn đến vòng lặp vô hạn");
                for (let index = 0; index < this.controlInfinity.length; index++) {
                    let controlName = this.controlInfinity[index];
                    let controlIns = getControlInstanceFromStore(this.keyInstance, controlName);
                    if(controlIns != false){
                        this.listMessageErr.push(controlName + " - " + controlIns.title);
                    }
                }
                this.$refs.errMessage.showDialog('checkInfinityControl');   
            }
            else{
                this.handleBeforeLoadedDocument()
            }
            this.hidePreloader();   
        },
        /**
         * Hàm xử lí tìm các control được coi là root (các control không có đầu vào)
         */
        handleBeforeLoadedDocument(){
            if(this.docObjId == null){
                this.findRootControl();
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
                                let formulaInstance = controlFormulas['formulas'].instance;
                                // chạy công thức để lấy giá trị dòng mặc định trong table(phục vụ cho việc shift enter xuống dòng phải có dữ liệu mặc định)
                                if(formulaInstance){
                                    this.handlerBeforeRunFormulasValue(formulaInstance,controlInTable,'formulasDefaulRow','root');
                                }
                            }
                            
                        }
                    }
                }
            }
        },

        /**
         * Lưu thông tin liên quan đến luồng chạy công thức và các thông tin về các control root(ko bị ảnh hưởng bởi control nào)
         */

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
         * Hàm lấy ra các control bị ảnh hưởng từ 1 control
         * từ đó tạo dựng mối quan hệ cho các control
         * lưu vào db cho lần submit sau không phải tìm lại
         */
        getEffectedControl() {
            let mapControlEffected = {};
            let allControlObj = this.sDocumentSubmit.listInputInDocument;
            for (let name in allControlObj) {
                let type = allControlObj[name].type;
                if (type != "submit" && type != "reset" && type != "draft") {
                    let formulas = allControlObj[name].controlFormulas;
                    for (let formulaType in formulas) {
                        if(formulaType == 'autocomplete'){
                            continue
                        }
                        if(!mapControlEffected.hasOwnProperty(formulaType)){
                            mapControlEffected[formulaType] = {}
                        }
                        if(formulaType == 'linkConfig'){
                            let allConfig = formulas[formulaType].configData;
                            for (let index = 0; index < allConfig.length; index++) {
                                let config = allConfig[index];
                                if(config.instance){
                                  let inputControl = config.instance.inputControl;
                                    for (let controlEffect in inputControl) {
                                        if (!mapControlEffected[formulaType].hasOwnProperty(controlEffect)) {
                                            mapControlEffected[formulaType][controlEffect] = {};
                                        }
                                        mapControlEffected[formulaType][controlEffect][name] = true;
                                    }
                                }
                            }
                        }
                        else{
                            if(formulas[formulaType].hasOwnProperty('instance')){
                                let inputControl = formulas[formulaType].instance.inputControl;
                                let inputLocalFormulas = formulas[formulaType].instance.inputForLocalFormulas;
                                let inputFromDatasets = formulas[formulaType].instance.inputFromDatasets;
                                for (let controlEffect in inputControl) {
                                    if (!mapControlEffected[formulaType].hasOwnProperty(controlEffect)) {
                                        mapControlEffected[formulaType][controlEffect] = {};
                                    }
                                    mapControlEffected[formulaType][controlEffect][name] = true;
                                }
                                for (let controlEffect in inputFromDatasets) {
                                    if (!mapControlEffected[formulaType].hasOwnProperty(controlEffect)) {
                                        mapControlEffected[formulaType][controlEffect] = {};
                                    }
                                    mapControlEffected[formulaType][controlEffect][name] = true;
                                }
                                for (let controlEffect in inputLocalFormulas) {
                                    if (!mapControlEffected[formulaType].hasOwnProperty(controlEffect)) {
                                        mapControlEffected[formulaType][controlEffect] = {};
                                    }
                                    mapControlEffected[formulaType][controlEffect][name] = true;
                                }
                                this.detectControlEffectedInTableInDoc(mapControlEffected[formulaType], name, formulas[formulaType].instance);
                            }
                        }
                    }
                }
            }
            if(this.baInfo && this.baInfo.id){
                this.checkInfinityControl(mapControlEffected);
            }
            if(this.controlInfinity.length == 0){
                this.updateEffectedControlToStore(mapControlEffected);
            }
        },
        /**
         * hoangnd: kiểm tra công thức chạy infinity hay ko 
         *  
        */       
        checkInfinityControl(mapControlEffected){
            this.controlInfinity = [];
            for(let formulaType in mapControlEffected){
                if(['list','formulas'].includes(formulaType)){
                    for(let controlName in mapControlEffected[formulaType]){
                        this.search(controlName, mapControlEffected[formulaType][controlName], mapControlEffected[formulaType]);
                    }
                }
                
            }
        },
      
        /**
         * DFS trong cây mối quan hệ để tìm control trùng lặp
         */
        search (controlCheck, effectedControl, mapControlEffected) {
            var i, children = Object.keys(effectedControl), found;
            for (i = 0; i < children.length; i += 1) {
                if(mapControlEffected[children[i]]){
                    if(children[i] == controlCheck){
                        this.controlInfinity.push(children[i]);
                        break;
                    }
                    else{
                        if(!Object.keys(mapControlEffected[children[i]]).includes(children[i]) && children[i] != controlCheck){
                            this.search(controlCheck, mapControlEffected[children[i]], mapControlEffected);
                        }
                    }
                }
            }
        },
      
        /**
         * Hàm lấy các control đầu vào là các cột của table sqllite
         */
        detectControlEffectedInTableInDoc(mapControlEffected,name,formulaInstance){
            formulaInstance.detectControlInTable(mapControlEffected,name,formulaInstance.formulas,this.sDocumentSubmit.listInputInDocument)  
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
            .finally(() => {
            });
        },
        /**
         * CLick submit doc thì kiểm tra validate 
         */
        handlerSubmitDocumentClick(isContinueSubmit = false){
            this.isContinueSubmit = isContinueSubmit;
            if(Object.keys(this.validateControl).length == 0){
                if(this.viewType == 'submit'){
                    this.handleRefreshDataBeforeSubmit();
                }
                else{
                    this.updateDocumentObject();
                }
            }
            else{
                let controlError = $('#sym-submit-'+this.keyInstance+' .error');
                let listErr = []
               
                $.each(controlError,function(k,v){
                    let message = $(v).attr('valid');
                    listErr.push(message);
                })
                for(let key in this.validateControl){
                    for(let type in this.validateControl[key]){
                        listErr.push(key+" : "+type + " - "+ this.validateControl[key][type])
                    }
                }
                this.$emit('submit-document-error');
                this.listMessageErr = listErr;
                this.$refs.errMessage.showDialog();
            }
        },


        // Hàm chỉ ra control được đánh định danh trong document (sct...)
        getDataRefreshControl(){
            let objectIdentiferFormula = null;
            let titleObjectFormula = null;
            if(this.objectIdentifier && Object.keys(this.objectIdentifier) > 0){
                let controlIdentifier = {}
                let controlNameIdentifier = this.objectIdentifier['name'];
                let controlInstance = getControlInstanceFromStore(this.keyInstance,controlNameIdentifier);
                if(controlInstance != false && controlInstance.controlFormulas.hasOwnProperty('formulas')){
                    let formulaInstance = controlInstance.controlFormulas['formulas']['instance'];
                    if(formulaInstance){
                        objectIdentiferFormula = formulaInstance;
                    }
                }
            }
            
            if(this.titleObjectFormula != null){
                titleObjectFormula = this.titleObjectFormula
            }
            this.formulasWorker.postMessage({action:'getDataInputFormula',data:{titleObjectFormula:titleObjectFormula,objectIdentiferFormula:objectIdentiferFormula,keyInstance:this.keyInstance}})
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
                    this.handlerBeforeRunFormulasValue(formulas,controlName,'formulas');
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
            this.getDataRefreshControl();
        },
        resetCheckRefreshData(){
            this.$store.commit("document/addToDocumentSubmitStore", {
                key: 'readySubmit',
                value: false,
                instance: this.keyInstance
            });
        },
        startSubmitDocument(dataInputFormulas = {}){
            let dataPost = this.getDataPostSubmit();
            dataPost['documentId'] = this.documentId;
            if(Object.keys(dataInputFormulas).length>0){
                dataPost['dataInputFormulas'] = dataInputFormulas;
            }
            this.callApiSubmit(dataPost);
        },
        async callApiSubmit(dataPost){
            let thisCpn = this;
            
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
                if (res.status == 200) {
                    let dataResponSubmit = res.data;
                    dataResponSubmit['document_object_user_created_fullname'] = thisCpn.endUserInfo.id;
                    dataResponSubmit['isContinueSubmit'] = thisCpn.isContinueSubmit;
                    thisCpn.$emit('submit-document-success',dataResponSubmit);
                    thisCpn.isSubmitting = false;
					if(this.showSnackbarSuccess){
						thisCpn.$snotify({
							type: "success",
							title: "Submit document success!"
						});      
					}
                    // nếu có công thức nút submit
                    if(thisCpn.sDocumentSubmit.submitFormulas != undefined){
                        let dataInput = getDataInputFormula(thisCpn.sDocumentSubmit.submitFormulas,thisCpn.sDocumentSubmit.listInputInDocument,thisCpn.optionalDataBinding);
                        thisCpn.formulasWorker.postMessage({action:'runFormula',data:{
                            formulaInstance:thisCpn.sDocumentSubmit.submitFormulas,
                            dataInput:dataInput,
                            keyInstance:thisCpn.keyInstance}})
                    }
                    thisCpn.closeFormulasWorker();
                    // nếu submit từ form sub submit thì ko rediect trang
                    // mà tìm giá trị của control cần được bind lại giá trị từ emit dataResponSubmit
                    if(thisCpn.$getRouteName() == 'submitDocument' && thisCpn.$route.params.id == thisCpn.documentId){
                        thisCpn.$router.push('/documents/'+thisCpn.documentId+"/objects");
                    }
                }
                else{
                    thisCpn.$emit('submit-document-error');
                    thisCpn.$snotify({
                        type: "error",
                        title: res.message
                    });
                    thisCpn.resetCheckRefreshData();
                }
            })
            .catch(err => {
                thisCpn.$emit('submit-document-error');
                thisCpn.$snotify({
                        type: "error",
                        title: "error from submit document api!!!"
                    });
                thisCpn.resetCheckRefreshData();
                thisCpn.isSubmitting = false;
            })
            .finally(() => {
            });
        },
        updateDocumentObject(){
            this.isSubmitting = true;
            let thisCpn = this;
            let dataPost = this.getDataPostSubmit();
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
					if(this.showSnackbarSuccess){
						 thisCpn.$snotify({
							type: "success",
							title: "update document success!"
						});    
					}
                    if(thisCpn.sDocumentSubmit.updateFormulas != undefined){
                        // let dataInput = thisCpn.getDataInputFormula(thisCpn.sDocumentSubmit.updateFormulas);
                        let dataInput = getDataInputFormula(thisCpn.sDocumentSubmit.updateFormulas,thisCpn.sDocumentSubmit.listInputInDocument,thisCpn.optionalDataBinding);
                        thisCpn.formulasWorker.postMessage({action:'runFormula',data:{
                            formulaInstance:thisCpn.sDocumentSubmit.updateFormulas,
                            dataInput:dataInput,
                            keyInstance:thisCpn.keyInstance}})

                        // thisCpn.sDocumentSubmit.updateFormulas.handleBeforeRunFormulas(dataInput).then(rs=>{});
                    }
                    thisCpn.closeFormulasWorker();
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
            .finally(() => {
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
                let controlIns = listInput[controlName];
                if(controlIns.inTable != false){
                    continue;
                }
                if(!controlIns.checkProps('isSaveToDB')){
                    continue;
                }
                if (controlIns.type == "table") {
                    let value = null
                    if(controlIns.tableMode == 'Group'){
                        value = {};
                        value[controlIns.name] = controlIns.agDataTable.getGroupData();
                    }
                    else{
                        value = this.getDataTableInput(controlIns);
                    }
                    if(value){
                        Object.assign(dataControl, value);
                    }
                } else {
            
                    if (!listControlNotNameProp.includes(controlIns.type)) {
                        let value = (controlIns.type == 'number' && controlIns.value == "" ) ? 0 : controlIns.value;
                        if(controlIns.type == 'percent'){
                            value = (controlIns.value === "" ) ? 0 : controlIns.value/100;
                        }
                        dataControl[controlName] = value;
                        if(controlIns.type == 'checkbox'){
                            dataControl[controlName] = (value) ? 1 : 0;
                        } 
                        if(controlIns.type == 'fileUpload'){
                            dataControl[controlName] = JSON.stringify(value)
                        }
                        if(controlIns.type == 'richText' && controlIns.editor){
                            dataControl[controlName] = controlIns.editor.getContent();
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
                            let newValue = this.$moment(rowValue, listInput[i].controlProperties.formatDate.value).format('YYYY-MM-DD');
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
                        let controlInstance = getControlInstanceFromStore(this.keyInstance,controlName);
                        if(controlInstance != false){
                            if(!dataToPreProcessControl.hasOwnProperty(controlInstance.idField)){
                                dataToPreProcessControl[controlInstance.idField] = {};
                            }
                            dataToPreProcessControl[controlInstance.idField][mapTypeToEffectedControl[type]] = mapControlEffected[type][controlName];
                        }
                        
                    }
                }
                
            }
            documentApi.updatePreDataForField({prepareData:JSON.stringify(dataToPreProcessControl)}) 
        },
        updateListInputInDocument(controlName, key, value) {
            let controlIns = getControlInstanceFromStore(this.keyInstance,controlName);
            let controlToWorker = {name:controlName,type:controlIns.type,value:controlIns.value}
            this.formulasWorker.postMessage({action:'updateWorkerStore',data:{controlIns: controlToWorker, keyInstance:this.keyInstance, type:'submit'}})
            this.$store.commit("document/updateListInputInDocument", {
                controlName: controlName,
                key: key,
                value: value,
                instance: this.keyInstance
            });
        },
        
        addToListInputInDocument(name,control){
            let controlToWorker = {name:control.name,type:control.type,value:control.value}
            this.formulasWorker.postMessage({action:'updateWorkerStore',data:{controlIns: controlToWorker, keyInstance:this.keyInstance, type:'submit'}})
             this.$store.commit(
                            "document/addToListInputInDocument",
                            { name: name, control: control ,instance: this.keyInstance}
                        );
        },
        /**
         * chạy công thức input filter
         */
        runInputFilterFormulas(controlName,search=""){
            let controlInstance = this.sDocumentSubmit.listInputInDocument[controlName];
            let controlId = controlInstance.id
            let allFormulas = controlInstance.controlFormulas;
            if(allFormulas.hasOwnProperty('list')){
                if(allFormulas['list'].hasOwnProperty('instance')){
                    let formulaInstance = allFormulas['list'].instance;
                    if(formulaInstance.getFormulas() != ""){
                        if( !formulaInstance.hasOwnProperty('oldFormulas')){
                            formulaInstance.oldFormulas = formulaInstance.getFormulas();
                        }
                        // trường hợp có search trong filter thì wrap lại công thức với biến search
                        let newFormulas = formulaInstance.wrapSyqlForSearchInputFilter(search);
                        formulaInstance.setFormulas(newFormulas);
                        this.handlerBeforeRunFormulasValue(formulaInstance,controlName,'list')
                    }
                }
            }
        },

        /**
         * hàm được gọi khi input change, lấy ra các instance của control bị ảnh hưởng và chạy công thức cho các control đó
         * nếu có insideTableInDoc thì công thức từ nội bộ của bảng
         */
        handleControlInputChange(controlInstance){
            let controlName = controlInstance.name;
            if(controlInstance.checkValidValueLength()){
                let controlUnique = checkControlPropertyProp(this.keyInstance,controlName,'isDBOnly');
                if(controlUnique != false){
                    this.handlerBeforeRunFormulasValue(controlUnique.controlFormulas.uniqueDB.instance,controlUnique.name,'uniqueDB');
                }
                let controlEffected = controlInstance.getEffectedControl();
                let controlHiddenEffected = controlInstance.getEffectedHiddenControl();
                let controlReadonlyEffected = controlInstance.getEffectedReadonlyControl();
                let controlRequireEffected = controlInstance.getEffectedRequireControl();
                let controlLinkEffected = controlInstance.getEffectedLinkControl();
                let controlValidateEffected = controlInstance.getEffectedValidateControl();
                let controlMinDateEffected = controlInstance.getEffectedMinDateControl();
                let controlMaxDateEffected = controlInstance.getEffectedMaxDateControl();
                controlRequireEffected[controlName] = true;
                controlHiddenEffected[controlName] = true;
                controlReadonlyEffected[controlName] = true;
                controlValidateEffected[controlName] = true;
                this.runFormulasControlEffected(controlEffected);
                this.runOtherFormulasEffected(controlHiddenEffected,'hidden');
                this.runOtherFormulasEffected(controlReadonlyEffected,'readOnly');
                this.runOtherFormulasEffected(controlRequireEffected,'require');
                this.runOtherFormulasEffected(controlLinkEffected,'linkConfig');
                this.runOtherFormulasEffected(controlValidateEffected,'validate');
                this.runOtherFormulasEffected(controlMinDateEffected,'minDate');
                this.runOtherFormulasEffected(controlMaxDateEffected,'maxDate');
            }
        },
        /**
         * Hàm xử lí duyêt các control bị ảnh hưởng trong 1 công thức bởi 1 control nào đó và thực hiện chạy các công thức của control đó
         */
        runFormulasControlEffected(controlEffected){
            if(Object.keys(controlEffected).length > 0){
                for(let i in controlEffected){
                    if (checkCanBeBind(this.keyInstance,i)){
                        let controlEffectedInstance = getControlInstanceFromStore(this.keyInstance,i);
                        let controlId = controlEffectedInstance.id
                        let allFormulas = controlEffectedInstance.controlFormulas;
                        if(allFormulas.hasOwnProperty('formulas')){
                            if(allFormulas['formulas'].hasOwnProperty('instance')){
                                let formulaInstance = allFormulas['formulas'].instance;
                                if(formulaInstance.getFormulas() != ""){
                                    this.handlerBeforeRunFormulasValue(formulaInstance,i,'formulas')
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
        runOtherFormulasEffected(controlEffected,formulaType){
            if(Object.keys(controlEffected).length > 0){
                for(let i in controlEffected){
                    let controlEffectedInstance = this.sDocumentSubmit.listInputInDocument[i];
                    let controlId = controlEffectedInstance.id
                    let allFormulas = controlEffectedInstance.controlFormulas;
                    if(allFormulas.hasOwnProperty(formulaType)){
                        if(formulaType == 'linkConfig'){ // nếu có cấu hình công thức link thì cũng chạy các công thức của nó
                            let configData = allFormulas[formulaType].configData;
                            for (let ind = 0; ind < configData.length; ind++) {
                                let config = configData[ind];
                                let formulaInstance = config.instance;
                                let fType = formulaType+"_"+config.formula.instance;
                                this.handlerBeforeRunFormulasValue(formulaInstance,i,fType)
                            }
                        }
                        else{
                            if(allFormulas[formulaType].hasOwnProperty('instance')){
                                let formulaInstance = allFormulas[formulaType].instance;
                                if(formulaInstance.getFormulas() != ""){
                                    this.handlerBeforeRunFormulasValue(formulaInstance,i,formulaType)
                                }
                            }
                        }
                    }
                }
            }
        },
        /**
         * Xử lí call qua formulas object để chạy công thức
         */
        handlerBeforeRunFormulasValue(formulaInstance,controlName,formulaType,from=false){
            let dataInput = getDataInputFormula(formulaInstance,this.sDocumentSubmit.listInputInDocument,this.optionalDataBinding,'all');
            if(checkDataInputChange(this.sDocumentSubmit.rootChangeFieldName, this.sDocumentSubmit.dataInputBeforeChange, dataInput)){
                let control = getControlInstanceFromStore(this.keyInstance,controlName);
                if(control.inTable != false){
                    let tableControl = getControlInstanceFromStore(this.keyInstance,control.inTable);
                    tableControl.tableInstance.handleRunFormulaForControlInTable(control,formulaInstance, 'all');
                }
                else{
                    this.formulasWorker.postMessage({action:'runFormula',data:{
                        formulaInstance:formulaInstance, 
                        dataInput:dataInput,
                        controlName:controlName, 
                        from:from, 
                        keyInstance:this.keyInstance}})
                }
            } else {
                markBinedField(this.keyInstance,controlName);
                this.handleControlInputChange(getControlInstanceFromStore(controlName));
            }
        },
       
      
        /**
         *  Hàm xử lí dứ liệu sau khi chạy công thức
         */
        handleAfterRunFormulas(res,controlName,formulaType,from){
            let controlInstance = getControlInstanceFromStore(this.keyInstance,controlName);
            if(formulaType == 'autocomplete' || formulaType == 'list'){
                let titleControl = (controlInstance) ? controlInstance.title : "";
                this.setDataForControlAutocomplete(res,controlName,titleControl);
                return;
            }
            let controlId = controlInstance.id;
            let value = minimizeDataAfterRunFormula(res)
            if(formulaType === 'formulasDefaulRow'){
                this.$store.commit("document/updateDataToTableControlRoot",{instance:this.keyInstance,value:value,controlName:controlName,tableName:controlInstance.inTable});
                return;
            }
            if(controlInstance.type == 'inputFilter'){
                this.$refs.inputFilter.setData(controlId,controlName,res.data.data);
                
            }
            else if(controlInstance.type == 'table'){
                if(formulaType=='formulas'){
                    this.setDataToTable(controlId,res.data)
                }
            }
            else{
                if(formulaType.includes('linkConfig')){
                    // this.handlerDataAfterRunFormulasLink(res,controlName,formulaType);
                }
                else{
                    switch (formulaType) {
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
                            controlInstance.handlerDataAfterRunFormulasReadonly(value);
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
            
        },
        /**
         * Hàm cập nhật dữ liệu cho bảng pivot
         */
        setDataToPivotTable(tableControl, data){
            if(tableControl.agDataTable){
                tableControl.agDataTable.setData(data);
            }
        },

        /**
         * Hàm set data cho bảng trong doc sau khi chạy công thức có dữ liệu
         */
        setDataToTable(tableControlId,data){
            let tableName = this.sDocumentEditor.allControl[tableControlId].properties.name.value;
            markBinedField(this.keyInstance,tableName);
            data = data.data;
            let tableControl = getControlInstanceFromStore(this.keyInstance,tableName);
            if(data.length == 0){
                tableControl.tableInstance.setData(false);
                return;
            }
            else{
                tableControl.tableInstance.setData(data);
            }
            
        },

        /**
         * Hàm bind link vào control sau khi chạy công thức link
         */
        handlerDataAfterRunFormulasLink(rs, controlName, formulaType){
            let configInstance = formulaType.split('_')[1]
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
                        let fType = formulaType+"_"+dataItem;
                        this.setDataForLinkControl(fType, dataItem, title, source, controlName);
                    }
                }
            }
            else{
                if(rs.data.length > 0){
                    let data = rs.data.data;
                    for (let index = 0; index < data.length; index++) {
                        let dataItem = data[index][Object.keys(data[index])[0]];
                        let fType = formulaType+"_"+dataItem;
                        this.setDataForLinkControl(fType, dataItem, title, source, controlName);
                    }
                }
            }
            controlInstance.renderInfoIconToControl(controlName);
        },
        setDataForLinkControl(formulaType, link, title, source, controlName){
            this.$store.commit(
                "document/updateDataForLinkControl",
                {formulaType:formulaType,link:link, title:title, source:source,instance: this.keyInstance, controlName: controlName}
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
                controlInstance.renderValidateIcon('Không được bỏ trống trường thông tin '+controlInstance.title,'Require')
            }
            else{
                controlInstance.removeValidateIcon('Require');
            }
        },
        handlerDataAfterRunFormulasValidate(message,controlName){
            if(Array.isArray(message)){
                message=message[0]
            }
            let controlInstance = getControlInstanceFromStore(this.keyInstance,controlName);
            if(message != "" && message != null){
                controlInstance.renderValidateIcon(message, 'Validate');
            }
            else{
                controlInstance.removeValidateIcon('Validate');
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
					for(let formulaType in controlFormulas){
                        if(formulaType == 'linkConfig'){ // nếu có cấu hình công thức link thì cũng chạy các công thức của nó
                            let configData = controlFormulas[formulaType].configData;
                            for (let i = 0; i < configData.length; i++) {
                                let config = configData[i];
                                let formulaInstance = config.instance;
                                let fType = formulaType+"_"+config.formula.instance;
                                if(formulaInstance){
                                    this.handlerBeforeRunFormulasValue(formulaInstance,controlName,fType,'root')
                                }
                            }
                        }
						else if(!['autocomplete','list','autocompleteAuto'].includes(formulaType)){
                            let formulaInstance = controlFormulas[formulaType].instance;
                            if(formulaInstance){
                                this.handlerBeforeRunFormulasValue(formulaInstance,controlName,formulaType,'root')
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
					if(!['inputFilter','submit','reset'].includes(controlInstance.type)){
						if(Object.keys(controlInstance.controlFormulas).length > 0){
							let controlFormulas = controlInstance.controlFormulas;
							for(let formulaType in controlFormulas){
								if(!['autocomplete','list','autocompleteAuto'].includes(formulaType)){
                                    if(formulaType == 'linkConfig'){ // nếu có cấu hình công thức link thì cũng chạy các công thức của nó
                                        let configData = controlFormulas[formulaType].configData;
                                        for (let i = 0; i < configData.length; i++) {
                                            let config = configData[i];
                                            if(config.formula.value){
                                                let formulaInstance = config.instance;
                                                let fType = formulaType+"_"+config.formula.instance;
                                                this.getRootControlData(controlInstance, formulaInstance, listTableRootControl, listRootControl, impactedFieldsListWhenStart, fType);
                                            }
                                        }
                                    }
                                    else{
                                        if(controlFormulas[formulaType].hasOwnProperty('instance')){
                                            let formulaInstance = controlFormulas[formulaType].instance;
                                            this.getRootControlData(controlInstance, formulaInstance, listTableRootControl, listRootControl, impactedFieldsListWhenStart, formulaType);
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
            this.hidePreloader();
            this.pushDataRootToStore(impactedFieldsList,impactedFieldsListWhenStart,listTableRootControl)
        },


        getRootFromVariable(formulaInstance){
            let dataInputFormula = formulaInstance.getInputControl();
            for(let control in dataInputFormula){
                if(!Object.keys(this.workflowVariable).includes(control)){
                    return false;
                }
            }
            return true;
        },
        /**
         * Hàm kiểm tra xem control có phải là root hay ko(cả trong table), nếu có đưa vào biến và lưu lại trên db
         */
        getRootControlData(controlInstance, formulaInstance, listTableRootControl, listRootControl, impactedFieldsListWhenStart, formulaType){
            let controlName = controlInstance.name;
            let controlRootInTable = this.checkControlOutSideTable(controlInstance,formulaInstance.getInputControl());
            if(controlRootInTable != false){
                if(listTableRootControl.hasOwnProperty(controlInstance.inTable) == false){
                    listTableRootControl[controlInstance.inTable] = {};
                }
                listTableRootControl[controlInstance.inTable][controlRootInTable] = false;
            }
            if(formulaInstance.getFormulas() !== "" && Object.keys(formulaInstance.getInputControl()).length == 0){
                impactedFieldsListWhenStart[controlName] = false;
                if(!listRootControl.includes(controlName)){
                    listRootControl.push(controlName);
                }
                this.handlerBeforeRunFormulasValue(formulaInstance,controlName,formulaType,'root')
            }
            else if(this.getRootFromVariable(formulaInstance)){
                if(!listRootControl.includes(controlName)){
                    listRootControl.push(controlName);
                }       
                this.handlerBeforeRunFormulasValue(formulaInstance,controlName,formulaType,'root')
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
                    if(i != sourceName){
                        arr.push(i);
                        arr = arr.concat(this.getAllImpactedInput(i)); 
                    }
                    
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
            this.currentFileControl.controlIns.setValue(url);
            let value = this.currentFileControl.controlIns.value;
            this.updateListInputInDocument(
                this.currentFileControl.controlIns.name,
                "value",
                value
            );
        },
        handleInputChangeByUser( controlInstance, valueControl){
            setDataInputBeforeChange(this.keyInstance, controlInstance);
            if($('#'+controlInstance.id).attr('data-autocomplete') != "" && $('#'+controlInstance.id).attr('data-autocomplete') != undefined){
                $('#'+controlInstance.id).attr('data-autocomplete',"");
                return;
            }
            let controlToWorker = {name:controlInstance.name,type:controlInstance.type,value:controlInstance.value}
            this.formulasWorker.postMessage({action:'updateWorkerStore',data:{controlIns: controlToWorker, keyInstance:this.keyInstance, type:'submit'}})
            resetImpactedFieldsList(this.keyInstance);
            this.handleControlInputChange(controlInstance);
        },
       
        /**
         * Hàm nhận sự kiên sau khi đóng pop up validate
         */
        afterCloseDialogValidate(type){
            if(type == "checkInfinityControl"){
                this.$emit('before-close-submit');
            }
        }
    }
    
    
};
</script>
<style  scoped>
.sym-form-submit {
    position: relative;
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
    height: calc(100%);
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



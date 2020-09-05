<template>
    <div class="wrap-content-submit">
        <div
            :key="keyInstance"
            class="sym-form-submit"
            :id="'sym-submit-'+keyInstance"
            :style="{'width':docSize, 'height':'100%'}"
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
            <date-picker
                :keyInstance="keyInstance"
                @clickDateCell="selectedDate"
                :title="'Chọn ngày'"
                :isTime="false"
                ref="datePicker"
            />
            <time-input 
            :keyInstance="keyInstance"  
            @apply-time-selected="applyTimePicker" 
            @after-check-input-time-valid="afterCheckTimeNotValid" 
            ref="timeInput" />
            <v-speed-dial
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
                            <v-btn fab dark small color="green" @click="handlerSubmitDocumentClick">
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
        v-for="dataFlow in listDataFlow" 
        :key="dataFlow.id"  
        :dataflowId="dataFlow.id" 
        :width="'100%'"
        :ref="'dataFlow'+dataFlow.id"/>
        <!-- v-for="dataFlow in listDataFlow" :key="dataFlow.id"  -->
    </div>
</template>
<script>
import { documentApi } from "./../../../api/Document.js";
import { userApi } from "./../../../api/user.js";
import "./../../../components/document/documentContent.css";
import { setDataForPropsControl,allControlNotSetData } from "./../../../components/document/dataControl";
import BasicControl from "./basicControl";
import TableControl from "./tableControl";
import ActionControl from "./actionControl";
import DatePicker from "./../../../components/common/DateTimePicker";
import TimeInput from "./../../../components/common/TimeInput";
import Table from "./table.js";
import SymperDragPanel from "./../../../components/common/SymperDragPanel.vue";
import { util } from "./../../../plugins/util.js";
import AutocompleteInput from "./items/AutocompleteInput.vue";
import User from "./items/User.vue";
import Filter from "./items/Filter.vue";
import Validate from "./../common/Validate";
import ClientSQLManager from "./clientSQLManager.js";
import Util from './util';
import './customControl.css';
import ErrMessagePanel from "./../../../views/document/items/ErrMessagePanel.vue";
import moment from "moment-timezone";
import EmbedDataflow from "@/components/dataflow/EmbedDataflow"
import {listControlNotNameProp} from "./../../../components/document/controlPropsFactory.js"



import { checkCanBeBind, resetImpactedFieldsList, markBinedField } from './handlerCheckRunFormulas';
import {checkDbOnly,getControlInstanceFromStore,getControlTitleFromName, getListInputInDocument} from './../common/common'
let impactedFieldsList = {};
let impactedFieldsArr = {};

export default {
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
        
        workflowVariable:{
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
        EmbedDataflow
    },
    computed: {
        sDocumentEditor() {
            return this.$store.state.document.editor[this.keyInstance];
        },
        sDocumentSubmit() {
            return this.$store.state.document.submit[this.keyInstance];
        },
        viewType(){
            return this.$store.state.document.viewType[this.keyInstance]
        }
    },
    activated() {
        this.isComponentActive = true;
    },
    deactivated() {
        this.isComponentActive = false;
    },
    data() {
        return {
            contentDocument: null,
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
            isComponentActive:false,
            cacheDataRunFormulas:{},
			isDraft:0,
            preDataSubmit:{},
            objectIdentifier:{},
            otherInfo:{},
            listDataFlow:[]
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
        this.isComponentActive = true;
        $(document).on('click','.run-dataflow',function(e){
            let idControl = $(this).closest('.s-control-data-flow').attr('id');
            let control = thisCpn.sDocumentEditor.allControl[idControl];
            let dataParams = thisCpn.getParamsForRunDataFlow(control.properties);
            let element = thisCpn.$refs['dataFlow'+control.properties.dataFlowId.value][0].runDataflow(dataParams);
        })
    },

    created() {
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
        } else if (this.$route.name == "submitDocument") {
            this.$store.commit("document/changeViewType", {
                key: this.keyInstance,
                value: 'submit',
            });
            this.documentId = this.$route.params.id;
        } else if (this.$route.name == "updateDocumentObject") {
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

        this.$evtBus.$on("run-formulas-control-outside-table", e => {
            if(thisCpn.isComponentActive == false) return;
            try {
                let formulasInstance = e.formulasInstance;
                let controlName = e.controlName;
                let controlInstance = thisCpn.sDocumentSubmit.listInputInDocument[controlName];
                let controlId = controlInstance.id
                let dataInput = this.getDataInputFormulas(formulasInstance);
                formulasInstance.handleBeforeRunFormulas(dataInput).then(rs=>{
                    thisCpn.handlerAfterRunFormulas(rs,controlId,controlName,'formulas',false)
                });
            } catch (error) {
                
            }
            
        });

        // hàm nhận sự kiện thay đổi của input
        this.$evtBus.$on("document-submit-input-change", locale => {
            try {
                if(thisCpn.isComponentActive == false) return;
                
                this.$store.commit("document/addToDocumentSubmitStore", {
                            key: 'docStatus',
                            value: 'input',
                            instance: this.keyInstance
                        });
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
                thisCpn.$store.commit("document/addToDocumentSubmitStore", {
                    key: 'rootChangeFieldName',
                    value: locale.controlName,
                    instance: thisCpn.keyInstance
                });
                // sau khi thay đổi giá trị input thì kiểm tra require control nếu có
                if(controlInstance.isRequiredControl()){
                    if(controlInstance.isEmpty()){
                        controlInstance.renderValidateIcon('Không được bỏ trống trường thông tin '+locale.controlName)
                    }
                    else{
                        controlInstance.removeValidateIcon()
                    }
                }
                resetImpactedFieldsList(thisCpn.keyInstance);
                thisCpn.handleControlInputChange(locale.controlName);
            } catch (error) {
                
            }
            
            
        });
        this.$evtBus.$on("run-effected-control-when-table-change", control => {
            if(thisCpn.isComponentActive == false) return;
            thisCpn.handlerBeforeRunFormulasValue(control.controlFormulas.formulas.instance,control.id,control.name,'formulas');
        });
        this.$evtBus.$on("document-submit-open-validate-message", e => {
            if(thisCpn.isComponentActive == false) return;
            thisCpn.messageValidate = e.msg;
            thisCpn.$refs.validate.show(e);
        });
       
        this.$evtBus.$on("document-submit-show-time-picker", e => {
            if(thisCpn.isComponentActive == false) return;
            thisCpn.$refs.timeInput.show(e);
        });
        this.$evtBus.$on("document-submit-date-input-click", e => {
            if(thisCpn.isComponentActive == false) return;
            thisCpn.$refs.datePicker.openPicker(e);
            thisCpn.$store.commit("document/updateCurrentControlEditByUser", {
                currentControl: e.controlName,
                instance: thisCpn.keyInstance
            });
        });
      
        // this.$evtBus.$on("document-submit-search-in-filter-input", e => {
        //     if(thisCpn.isComponentActive == false) return;
        //     thisCpn.runInputFilterFormulas(e.controlName,e.search);
        // }); 
        this.$evtBus.$on("document-submit-filter-input-click", e => {
            if(thisCpn.isComponentActive == false) return;
            thisCpn.topPositionDragPanel = $(e.target).offset().top + 2 + $(e.target).height();
            thisCpn.leftPositionDragPanel = e.screenX - e.offsetX;
            thisCpn.runInputFilterFormulas(e.controlName);
            thisCpn.$refs.symDragPanel.show();
            thisCpn.$refs.inputFilter.setFormulas(e.formulas,e.controlName);
            thisCpn.titleDragPanel = "Tìm kiếm thông tin";
            thisCpn.titleDragPanelIcon = "mdi-file-search";
        }); 
        // hàm nhận sự thay đổi của input autocomplete gọi api để chạy công thức lấy dữ liệu
        this.$evtBus.$on("document-submit-autocomplete-key-event", e => {
            if(thisCpn.isComponentActive == false) return;
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
            if(thisCpn.isComponentActive == false) return;
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
            if(thisCpn.isComponentActive == false) return;
            try {
                thisCpn.$refs.autocompleteInput.show(e.e);
                thisCpn.$store.commit("document/addToDocumentSubmitStore", {
                            key: 'currentControlAutoComplete',
                            value: e.alias,
                            instance: thisCpn.keyInstance
                        });
                thisCpn.getDataForAutocomplete(e,'select',e.alias);
            } catch (error) {
                
            }
           
        });
        // click outside
        this.$evtBus.$on("symper-app-wrapper-clicked", evt => {
            if(evt == undefined){
                return;
            }
            if(thisCpn.isComponentActive == false) return;
            try {
                if (
                    !$(evt.target).hasClass("s-control-select") &&
                    !$(evt.target).hasClass("v-data-table") &&
                    $(evt.target).closest(".v-data-table").length == 0
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
                this.submitDocument()
            }
        }
    },
    
    methods: {
        // hàm
        getParamsForRunDataFlow(properties){
            let mapControlToParams = properties.mapParamsDataflow.value;
            let dataParams = {}
            for (let index = 0; index < mapControlToParams.length; index++) {
                let item = mapControlToParams[index];
                let param = item.name
                let controlName = item.controlName;
                let listInputInDocument = getListInputInDocument(this.keyInstance);
                if(param != null && param != "" && controlName != null && controlName !="")
                dataParams[param] = listInputInDocument[controlName].value;
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
            let controlId = data.controlId
            let value = data.value
            $('#'+controlId).val(value);
            this.$refs.symDragPanel.hide()
        },
        searchDataFilter(data){
            if(this.isComponentActive == false) return;
            this.runInputFilterFormulas(data.controlName,data.search);
        },
        afterDataFlowMounted(id){
            for (let index = 0; index < this.listDataFlow.length; index++) {
                const controlDataFlow = this.listDataFlow[index];
                let dataFlowActionEl = controlDataFlow.el.find('.run-dataflow').detach();
                controlDataFlow.el.empty();
                let element = $(this.$refs['dataFlow'+controlDataFlow.id][0].$el);
                
                controlDataFlow.el.append(dataFlowActionEl);
                controlDataFlow.el.append(element.detach());
                controlDataFlow.el.find('.run-dataflow').css({display:'block'})
                // var iframe = controlDataFlow.el.find('iframe') // or some other selector to get the iframe
                // $('.joint-paper-scroller', iframe.contents()).css({overflow:'hidden'});
                // $(this.$refs['dataFlow'+controlDataFlow.id].$el).append(controlDataFlow.el);
                
            }
        },
        getDataOrgchart(e){
            let thisCpn = this
            let aliasControl = e.formulasInstance.autocompleteDetectAliasControl();
            let dataFromCache = this.getDataAutocompleteFromCache(e.e.target.value, aliasControl);
            if(dataFromCache == false){
                let dataInput = this.getDataInputFormulas(e.formulasInstance,e);
                e.formulasInstance.handleBeforeRunFormulas(dataInput).then(res=>{
                    res.status = 200
                    thisCpn.setDataForControlAutocomplete(res,aliasControl,e.controlTitle, $(e.e.target).val(),true)
                });
            }
            else{
                this.$refs.autocompleteInput.setAliasControl(aliasControl);
                this.$refs.autocompleteInput.setData(dataFromCache);
            }
            // e.formulasInstance.handleBeforeRunFormulas(dataInput).then(res=>{
            //     thisCpn.setDataForControlAutocomplete(res,aliasControl,e.controlTitle, $(e.e.target).val())
            // });
        },
        /**
         * Hàm chạy công thức autocomplete để đổ dữ liệu vào box autucomplete, control select cũng dùng trường hợp này
         */
        getDataForAutocomplete(e,type,aliasControl=""){ 
            let thisCpn = this
            if(type == 'select'){
                let dataInput = this.getDataInputFormulas(e.selectFormulasInstance);  
                e.selectFormulasInstance.handleRunAutoCompleteFormulas(dataInput).then(res=>{
                    thisCpn.setDataForControlAutocomplete(res,aliasControl,e.controlTitle,"",false)
                });
            }
            else{
                let aliasControl = e.autocompleteFormulasInstance.autocompleteDetectAliasControl();
                let dataFromCache = this.getDataAutocompleteFromCache(e.e.target.value, aliasControl);
                if(dataFromCache == false){
                    let dataInput = this.getDataInputFormulas(e.autocompleteFormulasInstance,e);
                    e.autocompleteFormulasInstance.handleRunAutoCompleteFormulas(dataInput).then(res=>{
                        thisCpn.setDataForControlAutocomplete(res,aliasControl,e.controlTitle, $(e.e.target).val(),"")
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
         */
        setDataForControlAutocomplete(res,aliasControl,controlTitle, textTyping="",fromSqlite=false){
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
                        item[textTyping] = dataTable.dataBody
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
                    fromAutoComplete = false
                }
                this.handleInputChangeBySystem(this.sDocumentSubmit.currentControlAutoComplete,data.value,fromAutoComplete);
            }
            else{
                let currentTableInteractive = this.sDocumentSubmit.currentTableInteractive
                let cellActive = currentTableInteractive.tableInstance.getActiveEditor();
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
            await ClientSQLManager.createDB(this.keyInstance);
            if (this.documentId) {
                let thisCpn = this;
                documentApi
                    .detailDocument(this.documentId)
                    .then(res => {
                        if (res.status == 200) {
                            let content = res.data.document.content;
                            thisCpn.documentName = res.data.document.name;
                            thisCpn.docSize = (parseInt(res.data.document.isFullSize) == 1) ? "100%":"21cm";
							thisCpn.contentDocument = content;
							if(res.data.document.dataPrepareSubmit != "" && res.data.document.dataPrepareSubmit != null)
                            thisCpn.preDataSubmit = JSON.parse(res.data.document.dataPrepareSubmit);
                            if(res.data.document.otherInfo != "" && res.data.document.otherInfo != null)
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
                        thisCpn.$snotify({
                            type: "error",
                            title: "error from detail document api!!!"
                        }); 
                    })
                    .always(() => {});
            }
        },
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
            var allInputControl = $("#sym-submit-" + this.keyInstance).find(
                ".s-control:not(.bkerp-input-table .s-control)"
            );
            let thisCpn = this;
            let isSetEffectedControl = false;
            let listDataFlow = []
            for (let index = 0; index < allInputControl.length; index++) {
                let id = $(allInputControl[index]).attr('id');
                let controlType = $(allInputControl[index]).attr('s-control-type');
                if(this.sDocumentEditor.allControl[id] != undefined){   // ton tai id trong store
                    let field = this.sDocumentEditor.allControl[id];
                    let idField = field.id;
                    let valueInput = field.value
                    let prepareData = field.prepareData
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
                        this.addToListInputInDocument('submit',control)
                    } else {
                        let controlName = field.properties.name.value;
                        let mapColumnType = Util.mapTypeControlToTypeSQLLite(controlType); 
                        if(mapColumnType != false){
                            this.columnsSQLLiteDocument[controlName] = mapColumnType;
                        }
                        field.properties.docName = this.documentName
                        if (controlType != "table") {
                            if(controlType == 'dataFlow'){
                                let id = field.properties.dataFlowId.value;
                                let mapParamsDataflow = field.properties.mapParamsDataflow.value;
                                listDataFlow.push({id:id,controlName:controlName,el:$(allInputControl[index]),mapParamsDataflow:mapParamsDataflow});
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
                                this.addToListInputInDocument(controlName,control)
                                control.render();
                            }
                            
                        }
                        //truong hop la control table
                        else {
                            let listInsideControls = {};
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
                                thisCpn.keyInstance
                            );
                            let tableEle = $(allInputControl[index]);
                            tableEle.find(".s-control").each(function() {
                                let childControlId = $(this).attr("id");
                                let childControlProp = thisCpn.sDocumentEditor.allControl[id].listFields[childControlId];
                                childControlProp.properties.inTable = controlName;
                                childControlProp.properties.docName = thisCpn.documentName;
                                let childValue = childControlProp.value;
                                console.log('childControlProp',childControlProp);
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
                                let childControlName = childControlProp.properties.name.value;
                                thisCpn.addToListInputInDocument(childControlName,childControl)
                                listInsideControls[childControlName] = true;
                            });
                            tableControl.listInsideControls = listInsideControls;
                            tableControl.renderTable();
                            tableControl.tableInstance.updateTable(valueInput);
                            this.addToListInputInDocument(controlName,tableControl)
                        }
                    }
                }

            }
            this.listDataFlow = listDataFlow;
            if(!isSetEffectedControl)
            this.getEffectedControl();
            if(this.docObjId == null)
            thisCpn.findRootControl();

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
                        if(formulas[formulasType].hasOwnProperty('instance')){
							let inputControl = formulas[formulasType].instance.inputControl;
							let inputLocalFormulas = formulas[formulasType].instance.inputForLocalFormulas;
                            for (let controlEffect in inputControl) {
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
        handlerSubmitDocumentClick(){
            if($('.validate-icon').length == 0 && $('.error').length == 0){
                if(this.viewType == 'submit'){
                    this.handleRefreshDataBeforeSubmit();
                }
                else{
                    this.updateDocumentObject();
                }
            }
            else{
                let controlNotValid = $('.validate-icon');
                let controlError = $('.error');
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
        getColumnIdentifier(){
            if(this.objectIdentifier == undefined){
                return {}
            }
            let controlIdentifier = {}
            let controlNameIdentifier = this.objectIdentifier['name'];
            let controlInstance = getControlInstanceFromStore(this.keyInstance,controlNameIdentifier);
            if(controlInstance != false && controlInstance.controlFormulas.hasOwnProperty('formulas')){
                let dataInput = this.getDataInputFormulas(controlInstance.controlFormulas['formulas']['instance'])
                controlIdentifier['dataInput'] = dataInput;
                // controlIdentifier['dataInput'] = 
                // return controlIdentifier;
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
                let refreshControl = this.otherInfo.refreshControl
                let dataImpactedControlRefresh = {}
                for (let index = 0; index < refreshControl.length; index++) {
                    let controlName = refreshControl[index];
                    let dataImpactedControl = util.cloneDeep(this.sDocumentSubmit.impactedFieldsList[controlName]);
                    for(let control in dataImpactedControl){
                        dataImpactedControl[control] = false
                    }
                    dataImpactedControlRefresh[controlName] = dataImpactedControl;
                }
                
                this.$store.commit("document/addToDocumentSubmitStore", {
                    key: 'dataImpactedControlRefresh',
                    value: dataImpactedControlRefresh,
                    instance: this.keyInstance
                });
                for (let index = 0; index < refreshControl.length; index++) {
                    let controlName = refreshControl[index];
                    let controlInstance = getControlInstanceFromStore(this.keyInstance,controlName);
                    if(!controlInstance.controlFormulas.hasOwnProperty('formulas')){
                        continue;
                    }
                    let formulas = controlInstance.controlFormulas.formulas.instance
                    this.handlerBeforeRunFormulasValue(formulas,controlInstance.id,controlName,'formulas')
                }
            }
            else{
                this.submitDocument()
            }
            
        },
        /**
         * Hàm gọi api submit document
         */
        submitDocument(){
            this.isSubmitting = true;
            let thisCpn = this;
            let dataPost = this.getDataPostSubmit();
            dataPost['documentId'] = this.documentId;
            let controlIdentifier = this.getColumnIdentifier();
            if(Object.keys(controlIdentifier).length>0){
                dataPost['dataRefreshControl'] = JSON.stringify(controlIdentifier);
            }
            if(thisCpn.sDocumentSubmit.submitFormulas != undefined){
                let dataInput = thisCpn.getDataInputFormulas(thisCpn.sDocumentSubmit.submitFormulas);
                thisCpn.sDocumentSubmit.submitFormulas.handleBeforeRunFormulas(dataInput).then(rs=>{
                    this.callApiSubmit(dataPost);
                });
            }
            else{
                 this.callApiSubmit(dataPost);
            }
            
        },
        callApiSubmit(dataPost){
            let thisCpn = this;
            documentApi.submitDocument(dataPost).then(res => {
                let dataResponSubmit = res.data;
                userApi.getDetailUser(res.data.document_object_user_created_id).then(res=>{
                    dataResponSubmit['document_object_user_created_fullname'] = res.data.user.displayName;
                    thisCpn.$emit('submit-document-success',dataResponSubmit);
                }).always({}).catch({})
                thisCpn.isSubmitting = false;
                if (res.status == 200) {
                    
                    thisCpn.$snotify({
                        type: "success",
                        title: "Submit document success!"
                    });        
                    if(this.$route.name == 'submitDocument')
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
                console.warn(err);
                thisCpn.$snotify({
                        type: "error",
                        title: "error from submit document api!!!"
                    });
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
            documentApi.updateDocument(this.docObjId,dataPost).then(res => {
                thisCpn.$emit('submit-document-success',res.data);
                thisCpn.isSubmitting = false;
                if (res.status == 200) {
                    thisCpn.$snotify({
                        type: "success",
                        title: "update document success!"
                    });        
                    if(thisCpn.$route.name == 'updateDocumentObject')
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
            dataControlInTable['child_object_id'] = dataColObjectId;
            for (let i in indexCol) {
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
            let mapTypeToEffectedControl = {
                                            link     :"effectedLinkControl",
                                            formulas :"effectedControl",
                                            readOnly :"effectedReadonlyControl",
                                            hidden   :"effectedHiddenControl",
                                            require  :"effectedRequireControl",
                                            validate :"effectedValidateControl",
                                            }
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
                    this.handlerBeforeRunFormulasValue(controlUnique.controlFormulas.uniqueDB,controlUnique.id,controlUnique.name,'uniqueDB');
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
                this.runOtherFormulasEffected(controlName,controlLinkEffected,'link');
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
                        if(allFormulas[formulasType].hasOwnProperty('instance')){
                            let formulasInstance = allFormulas[formulasType].instance;
                            if(formulasInstance.getFormulas() != ""){
                                this.handlerBeforeRunFormulasValue(formulasInstance,controlId,i,formulasType)
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
                        let valueInputControlItem = this.sDocumentSubmit.listInputInDocument[inputControlName].value;
                        dataInput[inputControlName] = valueInputControlItem;
                    }
                }
            }
            return dataInput;
        },
        
        handlerAfterRunFormulas(rs,controlId,controlName,formulasType,from){
            let controlInstance = getControlInstanceFromStore(this.keyInstance,controlName);
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
                    let value = ""
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
                    switch (formulasType) {
                        case "formulas":
                            this.handleInputChangeBySystem(controlName,value);
                            break;
                        case "link":
                            this.handlerDataAfterRunFormulasLink(value,controlName);
                            break;
                        case "validate":
                            this.handlerDataAfterRunFormulasValidate(value,controlName);
                            break;
                        case "require":
                            this.handlerDataAfterRunFormulasRequire(value,controlName);
                            break;
                        case "hidden":
                            this.handlerDataAfterRunFormulasHidden(value,controlId);
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
        handlerDataAfterRunFormulasLink(link,controlName){
            let controlInstance = getControlInstanceFromStore(this.keyInstance,controlName);
            controlInstance.renderLinkToControl(link);
        },
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
        handlerDataAfterRunFormulasHidden(isHidden,controlId){
            if(Array.isArray(isHidden)){
                isHidden=isHidden[0];
            }
            let display = (isHidden == 1 || isHidden==true ) ? 'none' : 'inline-block'
            $('#'+controlId).parent().css({'display':display})
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
			if(this.preDataSubmit != null && Object.keys(this.preDataSubmit).length > 0 && false){
				impactedFieldsList = this.preDataSubmit.impactedFieldsList;
				impactedFieldsListWhenStart = this.preDataSubmit.impactedFieldsListWhenStart;
				this.$store.commit("document/addToDocumentSubmitStore", {
												key: 'impactedFieldsListWhenStart',
												value: impactedFieldsListWhenStart,
												instance: this.keyInstance
											});
				let rootControl = this.preDataSubmit.rootControl;
				for (let index = 0; index < rootControl.length; index++) {
					const controlName = rootControl[index];
					let controlInstance = getControlInstanceFromStore(this.keyInstance,controlName);
					let controlFormulas = controlInstance.controlFormulas;
					for(let formulasType in controlFormulas){
						if(formulasType != 'autocomplete' && formulasType != 'list'){
                            let formulasInstance = controlFormulas[formulasType].instance;
							this.handlerBeforeRunFormulasValue(formulasInstance,controlInstance.id,controlName,formulasType,'root')
						}
					}
				}
			}
			else{
				let listInput = getListInputInDocument(this.keyInstance);
				let listRootControl = [];
				for(let controlName in listInput){
					this.setAllImpactedFieldsList(controlName);
					let controlInstance = listInput[controlName];
					if(controlInstance.type != "inputFilter"){
						if(Object.keys(controlInstance.controlFormulas).length > 0){
							let controlFormulas = controlInstance.controlFormulas;
							for(let formulasType in controlFormulas){
								if(formulasType != 'autocomplete' && formulasType != 'list'){
									if(controlFormulas[formulasType].hasOwnProperty('instance')){
										let formulasInstance = controlFormulas[formulasType].instance;
										if(formulasInstance.getFormulas() !== "" && Object.keys(formulasInstance.getInputControl()).length == 0){
											impactedFieldsListWhenStart[controlName] = false;
											this.$store.commit("document/addToDocumentSubmitStore", {
												key: 'impactedFieldsListWhenStart',
												value: impactedFieldsListWhenStart,
												instance: this.keyInstance
											});
											listRootControl.push(controlName);
											this.handlerBeforeRunFormulasValue(formulasInstance,controlInstance.id,controlName,formulasType,'root')
										}
									}
								}
								
							}
						}
					}
                }
			// lưu lại các mối quan hệ cho lần submit sau ko phải thực hiện các bước tìm quan hê này (các root control , các luồng chạy công thức)
				let dataPost = {impactedFieldsList:impactedFieldsList,impactedFieldsListWhenStart:impactedFieldsListWhenStart,rootControl:listRootControl};
				documentApi.updatePreDataForDoc({documentId:this.documentId,prepareData:JSON.stringify(dataPost)})
			}
			
            this.$store.commit("document/addToDocumentSubmitStore", {
                key: 'impactedFieldsList',
                value: impactedFieldsList,
                instance: this.keyInstance
			});
			
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
            let sourceControlInstance = getControlInstanceFromStore(this.keyInstance,sourceName)
            var arr = [];
            if (sourceControlInstance != false) {
                for (var i in sourceControlInstance['effectedControl']) {
                    arr.push(i);
                    arr = arr.concat(this.getAllImpactedInput(i)); 
                }
            }
            return arr;
        },
    }
};
</script>
<style  scoped>
.sym-form-submit {
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
.sym-form-submit >>> .htCore td:last-child {
    border-right: 1px solid #ccc !important;
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
    overflow-y: auto;
    overflow-x: hidden;
}
.wrap-content-submit .icon{
    font-size: 20px !important;
}
</style>



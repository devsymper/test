<template>
    <div
        :key="keyInstance"
        class="sym-form-submit"
        :id="'sym-submit-'+keyInstance"
        :style="{'width':docSize, 'height':'100%'}"
    >
        <div v-html="contentDocument"></div>
        <button v-on:click="togglePageSize" v-show="!isQickSubmit" id="toggle-doc-size">
            <span class="mdi mdi-arrow-horizontal-lock"></span>
        </button>
        <autocomplete-input
            ref="autocompleteInput"
            @after-select-row="afterSelectRowAutoComplete"
            @open-sub-form="openSubFormSubmit"
            @before-close="isShowSubFormSubmit = false"
        />
        <sym-drag-panel
            ref="symDragPanel"
            :dragPanelWidth="600"
            :dragPanelHeight="'auto'"
            :topPosition='topPositionDragPanel'
            :leftPosition="leftPositionDragPanel"
            :actionTitle="titleDragPanel"
            :titleIcon="titleDragPanelIcon"
        >
            <template slot="drag-panel-content">
                <!-- <submitDocument :isQickSubmit="true" :docId="340" v-if="!isQickSubmit"/> -->
                <filter-input @save-input-filter="saveInputFilter" :tableMaxHeight="500" ref="inputFilter"></filter-input>
            </template>
        </sym-drag-panel>
        <input type="file" :id="'file-upload-alter-'+keyInstance" class="hidden d-none" />
        <user-select :keyInstance="keyInstance" ref="userInput" />
        <validate :keyInstance="keyInstance" :message="messageValidate" ref="validate" />
        <date-picker
            :keyInstance="keyInstance"
            @clickDateCell="selectedDate"
            :title="'Chọn ngày'"
            :isTime="false"
            ref="datePicker"
        />
        <time-input :keyInstance="keyInstance"  @apply-time-selected="applyTimePicker" @after-check-input-time-valid="afterCheckTimeNotValid" ref="timeInput" />
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
        >
            <template v-slot:activator>
                <v-btn v-model="fab" color="blue darken-2" dark fab>
                    <v-icon v-if="fab">mdi-close</v-icon>
                    <v-icon v-if="!fab && !isSubmitting">mdi-menu</v-icon>
                    <v-progress-circular indeterminate v-show="isSubmitting" color="red"></v-progress-circular>
                </v-btn>
            </template>
            <v-btn fab dark small color="green" @click="handlerSubmitDocumentClick">
                <v-icon>mdi-content-save</v-icon>
            </v-btn>
            <!-- <v-btn
                    fab
                    dark
                    small
                    color="indigo"
                >
                    <v-icon>mdi-plus</v-icon>
                </v-btn>
                <v-btn
                    fab
                    dark
                    small
                    color="red"
                >
                    <v-icon>mdi-delete</v-icon>
            </v-btn>-->
        </v-speed-dial>
        <err-message :listErr="listMessageErr" ref="errMessage"/>
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
import Validate from "./items/Validate.vue";
import ClientSQLManager from "./clientSQLManager.js";
import Util from './util';
import './customControl.css';
import ErrMessagePanel from "./../../../views/document/items/ErrMessagePanel.vue";
import moment from "moment-timezone";


import { checkCanBeBind, resetImpactedFieldsList, markBinedField } from './handlerCheckRunFormulas';
import {checkDbOnly,getControlInstanceFromStore,getControlTitleFromName} from './../common/common'
let impactedFieldsList = {};
let impactedFieldsArr = {};
var impactedFieldsListWhenStart = {};

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
        validate: Validate,
        "user-select": User,
        "date-picker": DatePicker,
        "time-input": TimeInput,
        "filter-input": Filter,
        "autocomplete-input": AutocompleteInput,
        "sym-drag-panel": SymperDragPanel,
        "err-message": ErrMessagePanel,
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
        };
    },
    beforeMount() {
        this.docSize = "21cm";
        this.columnsSQLLiteDocument = {};
        this.$store.commit("document/setDefaultSubmitStore",{instance:this.keyInstance});
        this.$store.commit("document/setDefaultDetailStore",{instance:this.keyInstance});
        this.$store.commit("document/setDefaultEditorStore",{instance:this.keyInstance});
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

        })
    },

    created() {
        console.log(JSON.stringify(this.workflowVariable), 'workflowVariableworkflowVariableworkflowVariableworkflowVariableworkflowVariable');
        this.$store.commit("document/setDefaultSubmitStore",{instance:this.keyInstance});
        this.$store.commit("document/setDefaultDetailStore",{instance:this.keyInstance});
        this.$store.commit("document/setDefaultEditorStore",{instance:this.keyInstance});
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

        this.$evtBus.$on("document-submit-autocomplete-input", e => {
            thisCpn.$refs.autocompleteInput.show(e);
            thisCpn.$store.commit("document/addToDocumentSubmitStore", {
                key: 'currentControlAutoComplete',
                value: e.controlName,
                instance: this.keyInstance
            });
        });
        this.$evtBus.$on("run-formulas-control-outside-table", e => {
            let formulasInstance = e.formulasInstance;
            let controlName = e.controlName;
            let controlInstance = thisCpn.sDocumentSubmit.listInputInDocument[controlName];
            let controlId = controlInstance.id
            let dataInput = this.getDataInputFormulas(formulasInstance);
            formulasInstance.handleBeforeRunFormulas(dataInput).then(rs=>{
                thisCpn.handlerAfterRunFormulas(rs,controlId,controlName,'formulas',false)
            });
        });

        // hàm nhận sự kiện thay đổi của input
        this.$evtBus.$on("document-submit-input-change", locale => {
            this.$store.commit("document/addToDocumentSubmitStore", {
                        key: 'docStatus',
                        value: 'input',
                        instance: this.keyInstance
                    });
            let valueControl = locale.val;
            console.log('hdfsas',thisCpn.keyInstance);
            console.log('hdfsas1',this.keyInstance);
            let controlInstance = getControlInstanceFromStore(thisCpn.keyInstance,locale.controlName);
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
            
        });
        this.$evtBus.$on("run-effected-control-when-table-change", control => {
            thisCpn.handlerBeforeRunFormulasValue(control.controlFormulas.formulas.instance,control.id,control.name,'formulas');
        });
        this.$evtBus.$on("document-submit-open-validate-message", e => {
            thisCpn.$refs.validate.show(e);
        });
       
        this.$evtBus.$on("document-submit-show-time-picker", e => {
            thisCpn.$refs.timeInput.show(e.event);
        });
        this.$evtBus.$on("document-submit-date-input-click", e => {
            thisCpn.$refs.datePicker.openPicker(e);
        });
        this.$evtBus.$on("document-submit-time-input-click", e => {
            thisCpn.$refs.timeInput.show(e);
        });
        this.$evtBus.$on("document-submit-search-in-filter-input", e => {
            thisCpn.runInputFilterFormulas(e.controlName,e.search);
        }); 
        this.$evtBus.$on("document-submit-filter-input-click", e => {
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
            if(e.e.keyCode != 38 && e.e.keyCode != 40 && e.e.keyCode != 13){
                if(e.isSelect == false){
                    thisCpn.updateListInputInDocument(
                        e.controlName,
                        "value",
                        e.val
                    );
                    thisCpn.getDataForAutocomplete(e,'autocomplete');
                }
            }
        });
        // hàm nhận sự thay đổi của input select gọi api để chạy công thức lấy dữ liệu
          this.$evtBus.$on("document-submit-select-input", e => {
            thisCpn.$refs.autocompleteInput.show(e.e);
            thisCpn.getDataForAutocomplete(e,'select',e.alias);
        });
        // click outside
        this.$evtBus.$on("symper-app-wrapper-clicked", evt => {
            if (
                !$(evt.target).hasClass("autocompleting") &&
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
                thisCpn.$refs.timeInput.hide();
            }
            if (
                !$(evt.target).hasClass("validate-icon") &&
                !$(evt.target).hasClass("card-validate") &&
                $(evt.target).closest(".card-validate").length == 0
            ) {
                thisCpn.$refs.validate.hide();
            }
        });
    },
    watch: {
        docId(after) {
            this.documentId = after;
            this.loadDocumentData();
        },
        workflowVariable(after){
            this.$store.commit("document/addToDocumentSubmitStore", {
                    key: 'workflowVariable',
                    value: after,
                    instance: this.keyInstance
                });
        },
        documentObjectId(after){
            this.docObjId = after;
            this.loadDocumentObject();
        },
    },
    
    methods: {
        saveInputFilter(data){
            let controlId = data.controlId
            let value = data.value
            $('#'+controlId).val(value);
            this.$refs.symDragPanel.hide()
        },
        /**
         * Hàm chạy công thức autocomplete để đổ dữ liệu vào box autucomplete, control select cũng dùng trường hợp này
         */
        getDataForAutocomplete(e,type,aliasControl=""){ 
            let thisCpn = this
            if(type == 'select'){
                let dataInput = this.getDataInputFormulas(e.selectFormulasInstance);  
                e.selectFormulasInstance.handleRunAutoCompleteFormulas(dataInput).then(res=>{
                    thisCpn.setDataForControlAutocomplete(res,aliasControl,e.controlTitle)
                });
            }
            else{
                let aliasControl = e.autocompleteFormulasInstance.autocompleteDetectAliasControl();
                let dataInput = this.getDataInputFormulas(e.autocompleteFormulasInstance);
                e.autocompleteFormulasInstance.handleRunAutoCompleteFormulas(dataInput).then(res=>{
                    thisCpn.setDataForControlAutocomplete(res,aliasControl,e.controlTitle)
                });
            }
            
        },
        /**
         * Hàm bind dữ liệu cho box autocomplete, cho component autocompleteInput
         */
        setDataForControlAutocomplete(res,aliasControl,controlTitle){
            let controlAs = {};
            controlAs[aliasControl] = controlTitle;
            if(res.data != undefined){
                if(res.status == 200 && res.data != false){
                     let dataTable = []
                    if(res.data.data !== ""){
                    dataTable = this.handleDataAutoComplete(res.data.data,false,controlAs);
                    }
                    this.$refs.autocompleteInput.setAliasControl(aliasControl);
                    this.$refs.autocompleteInput.setData(dataTable);
                }
                else{
                    this.$refs.autocompleteInput.setData([]);
                }
            }
            else{
                let data =  res[0];
                let dataTable = this.handleDataAutoComplete(data,true,controlAs);
                this.$refs.autocompleteInput.setAliasControl(aliasControl);
                this.$refs.autocompleteInput.setData(dataTable);
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
                currentTableInteractive.tableInstance.setDataAtCell(this.sDocumentSubmit.currentCellSelected.row,this.sDocumentSubmit.currentCellSelected.column,time)
                
            }
            this.$refs.timeInput.hide();
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
        },
        /**
         * Hàm xử lí nhận dữ liệu component autocomplete khi chọn 1 dòng
         */
        afterSelectRowAutoComplete(data){

            // th này không phải trong table       
            if(this.sDocumentSubmit.currentCellSelected == null){
                let input = data.input;
                input.val(data.value);
                markBinedField(this.keyInstance,this.sDocumentSubmit.currentControlAutoComplete);
                input.trigger('change');
                // input.blur()
            }
            else{
                let currentTableInteractive = this.sDocumentSubmit.currentTableInteractive
                currentTableInteractive.tableInstance.setDataAtCell(this.sDocumentSubmit.currentCellSelected.row,this.sDocumentSubmit.currentCellSelected.column,data.value)
                setTimeout(() => {
                    currentTableInteractive.isAutoCompleting = false;
                }, 100);
                
            }
            // thisCpn.updateListInputInDocument(
            //     locale.controlName,
            //     "value",
            //     data.value
            // );
        },
        /**
         * Hàm  xử lí data sau khi query công thức autocomplete,
         * xử lí data về dạng object cho DataTable của vuetify
         */
        handleDataAutoComplete(data, isFromSQLLite,controlAs){
            let headers = [];
            let bodyTable = [];
            if(isFromSQLLite){
                for(let i = 0; i < data.columns.length; i++){
                    let item = {value:data.columns[i], text:data.columns[i]};
                    if(controlAs.hasOwnProperty(data.columns[i])){
                        item.text = controlAs[data.columns[i]]
                    }
                    if(data.columns[i] == 'column1'){
                        item.text = controlAs[Object.keys(controlAs)[0]]
                    }
                    headers.push(item);
                }
                let values = data.values;
                for(let i = 0; i < values.length; i++){
                    let item = {};
                    for(let j = 0; j < data.columns.length; j++){
                        item[data.columns[j]] = values[i][j];
                        bodyTable.push(item);
                    }
                }
            }
            else{
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
                            thisCpn.contentDocument = content;
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
        },
        processHtml(content) {
            var allInputControl = $("#sym-submit-" + this.keyInstance).find(
                ".s-control:not(.bkerp-input-table .s-control)"
            );
            let thisCpn = this;
            console.log(this.sDocumentEditor,'jkgds');
            for (let index = 0; index < allInputControl.length; index++) {
                let id = $(allInputControl[index]).attr('id');
                let controlType = $(allInputControl[index]).attr('s-control-type');
                
                if(this.sDocumentEditor.allControl[id] != undefined){   // ton tai id trong store
                    let field = this.sDocumentEditor.allControl[id];
                    let idField = field.id;
                    let valueInput = field.value
                    if(valueInput != undefined && valueInput != null && Object.keys(valueInput).length == 0){
                        valueInput = ""
                    }
                    if(allControlNotSetData.includes(controlType)){
                        let control = new ActionControl(idField, $(allInputControl[index]),field,thisCpn.keyInstance);
                        control.init();
                        control.render();
                        this.addToListInputInDocument('submit',control)
                    } else {
                        let controlName = field.properties.name.value;
                        let mapColumnType = Util.mapTypeControlToTypeSQLLite(controlType); 
                        if(mapColumnType != false){
                            this.columnsSQLLiteDocument[controlName] = mapColumnType;
                        }
                        field.properties.docName = this.documentName
                        if (controlType != "table") {
                            let control = new BasicControl(
                                idField,
                                $(allInputControl[index]),
                                field,
                                thisCpn.keyInstance,
                                valueInput
                            );
                            control.init();
                            this.addToListInputInDocument(controlName,control)
                            control.render();
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
                            tableControl.tableInstance = new Table(
                                tableControl,
                                controlName,
                                thisCpn.keyInstance
                            );
                            let columnsTableSqlLite = {};
                            let tableEle = $(allInputControl[index]);
                            tableEle.find(".s-control").each(function() {
                                let childControlId = $(this).attr("id");
                                let childControlProp = thisCpn.sDocumentEditor.allControl[id].listFields[childControlId];
                                childControlProp.properties.inTable = controlName;
                                childControlProp.properties.docName = thisCpn.documentName;
                                let idFieldChild = childControlProp.id;
                                let childControl = new BasicControl(
                                    idFieldChild,
                                    $(this),
                                    childControlProp,
                                    thisCpn.keyInstance
                                );
                                childControl.init();
                                let childControlName = childControlProp.properties.name.value;
                                columnsTableSqlLite[childControlName] = Util.mapTypeControlToTypeSQLLite(childControlProp.type);
                                thisCpn.addToListInputInDocument(childControlName,childControl)
                                listInsideControls[childControlName] = true;
                            });
                            tableControl.listInsideControls = listInsideControls;
                            tableControl.renderTable();
                            tableControl.setData(valueInput);
                            columnsTableSqlLite['s_table_id_sql_lite'] = 'INTEGER'
                            columnsTableSqlLite['childObjectId'] = 'INTEGER'
                            ClientSQLManager.createTable(this.keyInstance,controlName,columnsTableSqlLite);
                            this.addToListInputInDocument(controlName,tableControl)
                        }
                    }
                }

            }
            console.log(this.sDocumentSubmit);
            console.log(this.sDocumentEditor);
            this.getEffectedControl();
            // thisCpn.createDocumentSQLLiteTable(); 
            if(this.docObjId == null)
            thisCpn.findRootControl();
        },
        /**
         * Sự kiện phát ra khi click vào date của date picker
         */
        selectedDate(e){
            this.$refs.datePicker.closePicker();
            $('.date-picker-access').val(e);
            $('.date-picker-access').trigger('change');
            $('.date-picker-access').removeClass('date-picker-access');
        },

        /**
         * Hàm mở sub-form submit
         */
        openSubFormSubmit() {
            this.$refs.symDragPanel.$children[1].$refs.autocompleteInput.hide();
            this.$refs.symDragPanel.show();
        },

        /**
         * Hàm tạo csql
         */
        // async createSQLLiteDB() {
            
        //     this.loadDocumentData();
        // },
        createDocumentSQLLiteTable(){
            ClientSQLManager.createTable(this.keyInstance, 'this_document', this.columnsSQLLiteDocument);
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
                            for (let controlEffect in inputControl) {
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
            if(mapControlEffected.hasOwnProperty('formulas')){
                this.updateEffectedControlToStore(mapControlEffected['formulas'],'effectedControl')
            }
            if(mapControlEffected.hasOwnProperty('readOnly')){
                this.updateEffectedControlToStore(mapControlEffected['readOnly'],'effectedReadonlyControl')
            }
            if(mapControlEffected.hasOwnProperty('hidden')){
                this.updateEffectedControlToStore(mapControlEffected['hidden'],'effectedHiddenControl')
            }
            if(mapControlEffected.hasOwnProperty('link')){
                this.updateEffectedControlToStore(mapControlEffected['link'],'effectedLinkControl')
            }
            if(mapControlEffected.hasOwnProperty('require')){
                this.updateEffectedControlToStore(mapControlEffected['require'],'effectedRequireControl')
            }
            if(mapControlEffected.hasOwnProperty('validate')){
                this.updateEffectedControlToStore(mapControlEffected['validate'],'effectedValidateControl')
            }
        },
       
        detectControlEffectedInTableInDoc(mapControlEffected,name,formulasInstance){
            formulasInstance.detectControlInTable(mapControlEffected,name,formulasInstance.formulas,this.sDocumentSubmit.listInputInDocument)  
        },


        handlerSubmitDocumentClick(){
            if($('.validate-icon').length == 0){
                console.log(this.viewType);
                if(this.viewType == 'submit'){
                    this.submitDocument();
                }
                else{
                    this.updateDocumentObject();
                }
            }
            else{
                let controlNotValid = $('.validate-icon');
                let listErr = []
                $.each(controlNotValid,function(k,v){
                    let message = $(v).attr('title');
                    listErr.push(message);
                })
                console.log(listErr);
                
                this.listMessageErr = listErr;
                this.$refs.errMessage.showDialog();
            }
            
        },

        /**
         * Hàm gọi api submit document
         */
        submitDocument(){
            
            this.isSubmitting = true;
            let thisCpn = this;
            let dataPost = this.getDataPostSubmit();
            dataPost['id'] = this.documentId;
            documentApi.submitDocument(dataPost).then(res => {
                let dataResponSubmit = res.data;
                userApi.getDetailUser(res.data.document_object_user_created_id).then(res=>{
                    dataResponSubmit['document_object_user_created_fullname'] = res.data.user.displayName;
                    thisCpn.$emit('submit-document-success',dataResponSubmit);
                }).always({}).catch({})
                thisCpn.isSubmitting = false;
                if (res.status == 200) {
                    if(thisCpn.sDocumentSubmit.submitFormulas != undefined){
                        let dataInput = thisCpn.getDataInputFormulas(thisCpn.sDocumentSubmit.submitFormulas);
                        thisCpn.sDocumentSubmit.submitFormulas.handleBeforeRunFormulas(dataInput).then(rs=>{
                            
                        });
                    }
                    thisCpn.$snotify({
                        type: "success",
                        title: "Submit document success!"
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
            dataPost['id'] = this.documentId;
            documentApi.updateDocument(this.docObjId,dataPost).then(res => {
                thisCpn.$emit('submit-document-success',res.data);
                thisCpn.isSubmitting = false;
                if (res.status == 200) {
                    thisCpn.$snotify({
                        type: "success",
                        title: "update document success!"
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
            let dataPost = {};
            for (let controlName in listInput) {
                let id = "field_" + listInput[controlName].idField;
                if (listInput[controlName].type == "table") {
                    let value = this.getDataTableInput(listInput[controlName]);
                    Object.assign(dataPost, value);
                } else {
                    if (listInput[controlName].type != "submit" && 
                    listInput[controlName].type != "reset" && 
                    listInput[controlName].type != "draft" &&
                    listInput[controlName].type != "approvalHistory") {
                        let value = (listInput[controlName].type == 'number' && listInput[controlName].value == "" ) ? 0 : listInput[controlName].value;
                        if(listInput[controlName].type == 'percent'){
                            value = (listInput[controlName].value === "" ) ? 0 : listInput[controlName].value/100;
                        }
                        dataPost[id] = [value];
                        if(listInput[controlName].type == 'checkbox'){
                            dataPost[id] = (value) ? [1] : [0];
                        }
                        if(listInput[controlName].type == 'user'){
                            dataPost[id] =  [0];
                        }
                        
                    }
                    
                }
            }
            dataPost['documentObjectWorkflowObjectId'] = this.documentObjectWorkflowObjectId;
            dataPost['documentObjectWorkflowId'] = this.documentObjectWorkflowId;
            dataPost['documentObjectTaskId'] = this.documentObjectTaskId;
            return dataPost;
        },
        /**
         * Hàm lấy dữ liệu của table dạng colName : ['a',"b","c"]
         */
        getDataTableInput(tableControl) {
            let listInput = this.sDocumentSubmit.listInputInDocument;
            let indexCol = tableControl.tableInstance.colName2Idx;
            let dataTable = {};
            let columnObjectIdIndex = tableControl.tableInstance.getColumnIndexFromControlName('childObjectId');
            let dataColObjectId = tableControl.tableInstance.tableInstance.getDataAtCol(
                    columnObjectIdIndex
                );
            dataTable[tableControl.name] = dataColObjectId;
            for (let i in indexCol) {
                let id = "field_" + listInput[i].idField;
                let dataCol = tableControl.tableInstance.tableInstance.getDataAtCol(
                    indexCol[i]
                );
                
                // cần xóa phần tử dòng cuối dùng là row enter mặc định ko có dữ liệu
                if(tableControl.tableInstance.tableHasRowSum == true)
                dataCol.pop();
                if(listInput[i].type == 'fileUpload'){
                    dataCol = listInput[i].value;
                }
                dataCol = (listInput[i].type == 'number' && dataCol == "" ) ? [0] : dataCol;
                dataCol = (listInput[i].type != 'number' && dataCol == "" ) ? [""] : dataCol;
                dataTable[id] = dataCol;
            }
            
            return dataTable;
        },
        updateEffectedControlToStore(mapControlEffected,key) {
            for (let controlName in mapControlEffected) {
                this.updateListInputInDocument(
                    controlName,
                    key,
                    mapControlEffected[controlName]
                );
            }
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



        runInputFilterFormulas(controlName,search=false){
            let controlInstance = this.sDocumentSubmit.listInputInDocument[controlName];
            let controlId = controlInstance.id
            let allFormulas = controlInstance.controlFormulas;
            if(allFormulas.hasOwnProperty('formulas')){
                if(allFormulas['formulas'].hasOwnProperty('instance')){
                    let formulasInstance = allFormulas['formulas'].instance;
                    if(formulasInstance.getFormulas() != ""){
                        if(search !== false){
                            if( !formulasInstance.hasOwnProperty('oldFormulas')){
                                formulasInstance.oldFormulas = formulasInstance.getFormulas();
                            }
                            // trường hợp có search trong filter thì wrap lại công thức với biến search
                            let newFormulas = formulasInstance.wrapSyqlForSearchInputFilter(search);
                            formulasInstance.setFormulas(newFormulas);
                        }
                        this.handlerBeforeRunFormulasValue(formulasInstance,controlId,controlName,'formulas')
                    }
                }
            }
        },
        /**
         * hàm được gọi khi input change, lấy ra các instance của control bị ảnh hưởng và chạy công thức cho các control đó
         * nếu có insideTableInDoc thì công thức từ nội bộ của bảng
         */
        handleControlInputChange(controlName){
            let controlUnique = checkDbOnly(this.keyInstance,controlName);
            if(controlUnique != false){
                this.handlerBeforeRunFormulasValue(controlUnique.controlFormulas.uniqueDB,controlUnique.id,controlUnique.name,'uniqueDB');
            }
            let controlInstance = this.sDocumentSubmit.listInputInDocument[controlName];
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
        },
        /**
         * Hàm xử lí duyêt các control bị ảnh hưởng trong 1 công thức bởi 1 control nào đó và thực hiện chạy các công thức của control đó
         */
        runFormulasControlEffected(controlName, controlEffected){
            if(Object.keys(controlEffected).length > 0){
            console.log('vaosa---',controlName,"==",controlEffected,"------");

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
            console.log('vaosa11--',controlName,"==",controlEffected,"------",formulasType);

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
         */
        getDataInputFormulas(formulasInstance){
           
            let inputControl = formulasInstance.getInputControl();
            let dataInput = {};
            for(let inputControlName in inputControl){
                if(this.sDocumentSubmit.listInputInDocument.hasOwnProperty(inputControlName)){
                    let valueInputControlItem = this.sDocumentSubmit.listInputInDocument[inputControlName].value;
                    dataInput[inputControlName] = valueInputControlItem;
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
                            this.handlerDataAfterRunFormulasValue(value,controlId,controlName,from);
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
        handlerDataAfterRunFormulasValue(value,controlId,controlName,from){
            let controlInstance = getControlInstanceFromStore(this.keyInstance,controlName);
           
            if($('#'+controlId).length > 0){
                if(from != false && from == 'root'){
                    this.updateListInputInDocument(
                        controlName,
                        "value",
                        value
                    );
                    controlInstance.setValue(value)
                    markBinedField(this.keyInstance,controlName);
                    this.handleControlInputChange(controlName)
                }else{
                    if($('#'+controlId).attr('s-control-type') == 'label'){
                        $('#'+controlId).text(value);
                    }
                    else{
                        $('#'+controlId).val(value);
                    }
                    $('#'+controlId).trigger('change')
                    markBinedField(this.keyInstance,controlName);
                }
            }
        },

        /**
         * Hàm set data cho bảng trong doc sau khi chạy công thức có dữ liệu
         */
        setDataToTable(tableControlId,data){
            let tableName = this.sDocumentEditor.allControl[tableControlId].properties.name.value;
            let dataTable = []
            data = data.data
            let tableControl = getControlInstanceFromStore(this.keyInstance,tableName);
            if(data.length == 0){
                tableControl.tableInstance.setData(false);
                return;
            }
            let allColumnBindData = Object.keys(data[0]);
            if(allColumnBindData.length > 0){
                for (let index = 0; index < allColumnBindData.length; index++) {
                    const controlName = allColumnBindData[index];
                    let colData = data.reduce((arr,obj)=>{
                        arr.push(obj[controlName])
                        return arr
                    },[]);
                    let vls = [];
                    for (let i = 0; i < colData.length; i++) {
                        vls.push([i, controlName, colData[i]]);
                    }
                    tableControl.tableInstance.setData(vls);
                }
            }
            else{
                 tableControl.tableInstance.setData(false);
            }
            
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
            let listInput = this.sDocumentSubmit.listInputInDocument;
            for(let controlName in listInput){
                // console.log('sad',controlName);
                this.setAllImpactedFieldsList(controlName);
                let controlInstance = listInput[controlName];
                if(controlInstance.type != "inputFilter"){
                    if(Object.keys(controlInstance.controlFormulas).length > 0){
                        let controlFormulas = controlInstance.controlFormulas;
                        
                        for(let formulasType in controlFormulas){
                            if(formulasType != 'autocomplete'){
                                if(controlFormulas[formulasType].hasOwnProperty('instance')){
                                    let formulasInstance = controlFormulas[formulasType].instance;
                                    if(formulasInstance.getFormulas() !== "" && Object.keys(formulasInstance.getInputControl()).length == 0){
                                        impactedFieldsListWhenStart[controlName] = false;
                                        this.$store.commit("document/addToDocumentSubmitStore", {
                                            key: 'impactedFieldsListWhenStart',
                                            value: impactedFieldsListWhenStart,
                                            instance: this.keyInstance
                                        });
                                        this.handlerBeforeRunFormulasValue(formulasInstance,controlInstance.id,controlName,formulasType,'root')
                                    }
                                }
                            }
                            
                        }
                    }
                }
                
                
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
    right: 10px;
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
</style>



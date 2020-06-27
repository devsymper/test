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
            :actionTitle="titleDragPanel"
            :titleIcon="titleDragPanelIcon"
        >
            <template slot="drag-panel-content">
                <!-- <submitDocument :isQickSubmit="true" :docId="340" v-if="!isQickSubmit"/> -->
                <filter-input @save-input-filter="saveInputFilter" ref="inputFilter"></filter-input>
            </template>
        </sym-drag-panel>
        <input type="file" :id="'file-upload-alter-'+keyInstance" class="hidden d-none" />
        <user-select :keyInstance="keyInstance" ref="userInput" />
        <validate :keyInstance="keyInstance" ref="validate" />
        <date-picker
            :keyInstance="keyInstance"
            @clickDateCell="selectedDate"
            :title="'Chọn ngày'"
            :isTime="false"
            ref="datePicker"
        />
        <time-picker :keyInstance="keyInstance" :title="'Chọn giờ'" @apply-time-picker="applyTimePicker" ref="timePicker" />
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
    </div>
</template>
<script>
import { documentApi } from "./../../../api/Document.js";
import "./../../../components/document/documentContent.css";
import { setDataForPropsControl } from "./../../../components/document/dataControl";
import BasicControl from "./basicControl";
import TableControl from "./tableControl";
import ActionControl from "./actionControl";
import DatePicker from "./../../../components/common/DateTimePicker";
import TimeBoxPicker from "./../../../components/common/TimeBoxPicker";
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

import { checkCanBeBind, resetImpactedFieldsList, markBinedField } from './handlerCheckRunFormulas';
import {checkDbOnly,getControlInstanceFromStore} from './../common/common'
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
        }
    },
    name: "submitDocument",

    components: {
        validate: Validate,
        "user-select": User,
        "date-picker": DatePicker,
        "time-picker": TimeBoxPicker,
        "filter-input": Filter,
        "autocomplete-input": AutocompleteInput,
        "sym-drag-panel": SymperDragPanel
    },
    computed: {
        sDocumentEditor() {
            return this.$store.state.document.editor;
        },
        sDocumentSubmit() {
            return this.$store.state.document.submit;
        },
        viewType(){
            return this.$store.state.document.viewType
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

            //
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
            docObjId:null
        };
    },
    beforeMount() {

        this.docSize = "21cm";
        this.columnsSQLLiteDocument = {};
    },
    mounted() {
        this.editorDoc = $(".sym-form-submit");
        let thisCpn = this;
        $("#file-upload-alter-" + this.keyInstance).on("change", function(e) {
            let name = $(this).attr("data-control-name");
            thisCpn.sDocumentSubmit.listInputInDocument[name].addFile(
                $(this).prop("files")[0]
            );
        });
        $('.sym-form-submit').on('click','.validate-icon',function(e){
            let msg = $(this).attr('title');
            e.msg = msg;
            thisCpn.$refs.validate.show(e);

        })
    },

    created() {
        // đặt trang thái của view là submit => isDetailView = false
        
        let thisCpn = this;
        if (this.docId != 0) {
            this.documentId = this.docId;
        } else if (this.$route.name == "submitDocument") {
            this.$store.commit("document/addToDocumentStore", {
                key: 'viewType',
                value: 'submit'
            });
            this.documentId = this.$route.params.id;
        } else if (this.$route.name == "updateDocumentObject") {
            this.$store.commit("document/addToDocumentStore", {
                key: 'viewType',
                value: 'update'
            });
            this.docObjId = this.$route.params.id;
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
                value: e.controlName
            });
        });

        // hàm nhận sự kiện thay đổi của input
        this.$evtBus.$on("document-submit-input-change", locale => {
            thisCpn.$store.commit("document/addToDocumentSubmitStore", {
                key: 'docStatus',
                value: 'input'
            });
            thisCpn.updateListInputInDocument(
                locale.controlName,
                "value",
                locale.val
            );
            thisCpn.$store.commit("document/addToDocumentSubmitStore", {
                key: 'rootChangeFieldName',
                value: locale.controlName
            });
            // sau khi thay đổi giá trị input thì kiểm tra require control nếu có
            let controlInstance = getControlInstanceFromStore(locale.controlName);
            if(controlInstance.isRequiredControl()){
                if(controlInstance.isEmpty()){
                    controlInstance.renderValidateIcon('Không được bỏ trống trường này!')
                }
                else{
                    controlInstance.removeRequire()
                }
            }
            
            resetImpactedFieldsList();
            thisCpn.handleControlInputChange(locale.controlName);
            
        });
        this.$evtBus.$on("run-effected-control-when-table-change", control => {
            thisCpn.handlerBeforeRunFormulasValue(control.controlFormulas.formulas.instance,control.id,control.name,'formulas');
        });
        this.$evtBus.$on("document-submit-open-validate-message", e => {
            thisCpn.$refs.validate.show(e);
        });
       
        this.$evtBus.$on("document-submit-show-time-picker", e => {
            thisCpn.$refs.timePicker.show(e.event);
        });
        this.$evtBus.$on("document-submit-date-input-click", e => {
            thisCpn.$refs.datePicker.openPicker(e);
        });
        this.$evtBus.$on("document-submit-time-input-click", e => {
            thisCpn.$refs.timePicker.show(e);
        });
        this.$evtBus.$on("document-submit-filter-input-click", e => {
            // thisCpn.$refs.symDragPanel.show();
            thisCpn.runInputFilterFormulas(e.controlName);
            thisCpn.titleDragPanel = "Tìm kiếm thông tin";
            thisCpn.titleDragPanelIcon = "mdi-file-search";
        }); 
        // hàm nhận sự thay đổi của input autocomplete gọi api để chạy công thức lấy dữ liệu
        this.$evtBus.$on("document-submit-autocomplete-key-event", e => {
            if(e.e.keyCode != 38 && e.e.keyCode != 40 && e.e.keyCode != 13){
                if(e.isSelect == false){
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
                thisCpn.$refs.timePicker.hide();
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
        }
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
                let dataAutocomplete = e.selectFormulasInstance.handleRunAutoCompleteFormulas('',dataInput).then(res=>{
                    thisCpn.setDataForControlAutocomplete(res,aliasControl)
                });
            }
            else{
                let aliasControl = e.autocompleteFormulasInstance.autocompleteDetectAliasControl();
                let dataInput = this.getDataInputFormulas(e.autocompleteFormulasInstance);  
                let dataAutocomplete = e.autocompleteFormulasInstance.handleRunAutoCompleteFormulas($(e.e.target).val(),dataInput).then(res=>{
                    thisCpn.setDataForControlAutocomplete(res,aliasControl)
                });
            }
            
        },
        /**
         * Hàm bind dữ liệu cho box autocomplete, cho component autocompleteInput
         */
        setDataForControlAutocomplete(res,aliasControl){
            if(res.data != undefined){
                    if(res.status == 200 && res.data != false){
                        let dataTable = this.handleDataAutoComplete(res.data.data,false);
                        this.$refs.autocompleteInput.setAliasControl(aliasControl);
                        this.$refs.autocompleteInput.setData(dataTable);
                    }
                    else{
                        this.$refs.autocompleteInput.setData([]);
                    }
                }
                else{
                    let data =  res[0];
                    let dataTable = this.handleDataAutoComplete(data,true);
                    this.$refs.autocompleteInput.setAliasControl(aliasControl);
                    this.$refs.autocompleteInput.setData(dataTable);
                }
        },
        /**
         * Hàm bind dữ liệu cho control, và control trong bảng khi chọn apply trên timepicker
         */
        applyTimePicker(time){
            if(this.sDocumentSubmit.currentTableInteractive == null){
                $('.time-picker').val(time);
                $('.time-picker').trigger('change');
                $('.time-picker').removeClass('time-picker');
            }
            else{
                let currentTableInteractive = this.sDocumentSubmit.currentTableInteractive
                currentTableInteractive.tableInstance.setDataAtCell(this.sDocumentSubmit.currentCellSelected.row,this.sDocumentSubmit.currentCellSelected.column,time)
                
            }
            /**
             * TH control select ở ngoài table
             * reset biến chỉ ra là đang tương tác với table và cell nào
             */
            this.$store.commit("document/addToDocumentSubmitStore", {
                key: 'currentCellSelected',
                value: null
            });
            this.$store.commit("document/addToDocumentSubmitStore", {
                key: 'currentTableInteractive',
                value: null
            });
            this.$refs.timePicker.hide();
        },
        /**
         * Hàm xử lí nhận dữ liệu component autocomplete khi chọn 1 dòng
         */
        afterSelectRowAutoComplete(data){
            // th này không phải trong table       
            if(this.sDocumentSubmit.currentCellSelected == null){
                $('.autocompleting').val(data.value);
                markBinedField(this.sDocumentSubmit.currentControlAutoComplete);
                $('.autocompleting').trigger('change');
                $('.autocompleting').removeClass('autocompleting');
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
        handleDataAutoComplete(data, isFromSQLLite){
            let headers = [];
            let bodyTable = [];
            if(isFromSQLLite){
                for(let i = 0; i < data.columns.length; i++){
                    headers.push({value:data.columns[i], text:data.columns[i]});
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
                    headers.push({value:controlName,text : controlName});
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
                            setDataForPropsControl(res.data.fields); // ddang chay bat dong bo
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
                            value: res.data
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
                    if(controlType == "submit" || controlType == "reset"){
                        
                        let control = new ActionControl(idField, $(allInputControl[index]),field,thisCpn.keyInstance);
                        control.init();
                        control.render();
                        this.$store.commit(
                            "document/addToListInputInDocument",
                            { name: "submit", control: control }
                        );
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
                            this.$store.commit(
                                "document/addToListInputInDocument",
                                { name: controlName, control: control }
                            );
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
                                thisCpn.$store.commit(
                                    "document/addToListInputInDocument",
                                    {
                                        name: childControlName,
                                        control: childControl
                                    }
                                );
                                listInsideControls[childControlName] = true;
                            });
                            tableControl.listInsideControls = listInsideControls;
                            tableControl.renderTable();
                            tableControl.setData(valueInput);
                            columnsTableSqlLite['s_table_id_sql_lite'] = 'INTEGER'
                            ClientSQLManager.createTable(this.keyInstance,controlName,columnsTableSqlLite);
                            this.$store.commit(
                                "document/addToListInputInDocument",
                                { name: controlName, control: tableControl }
                            );
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
            $('.date-picker-access').trigger('change')
            $('.date-picker-access').removeClass('date-picker-access')
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
                                if (mapControlEffected[formulasType][controlEffect] == undefined) {
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
            
        },
        /**
         * Hàm detect công thức của 1 control có liên quan đến table hay ko, nếu có thì đưa vào mối quan hệ mapControlEffected
         * 
         */
        detectControlEffectedFromTableInDoc(mapControlEffected, controlName, formulasInstance){
            let listTableName = ClientSQLManager.getAllTableName(this.keyInstance);
            let listTableSource = formulasInstance.detectTableSQLLite(formulasInstance.formulas,listTableName[0]['values'][0]);
            if(listTableSource != false){
                for(let i = 0; i< listTableSource.length; i++){
                    if (
                        mapControlEffected[listTableSource[i]] == undefined
                    ) {
                        mapControlEffected[listTableSource[i]] = {};
                    }
                    mapControlEffected[listTableSource[i]][controlName] = true 
                }
            }
        },
        detectControlEffectedInTableInDoc(mapControlEffected,name,formulasInstance){
            formulasInstance.detectControlInTable(mapControlEffected,name,formulasInstance.formulas,this.sDocumentSubmit.listInputInDocument)  
        },


        handlerSubmitDocumentClick(){
            if(this.viewType == 'submit'){
                this.submitDocument();
            }
            else{
                this.updateDocumentObject();
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
                thisCpn.$emit('submit-document-success',res.data);
                thisCpn.isSubmitting = false;
                if (res.status == 200) {
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
                        title: "error from submit document api!!!"
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
                    if (listInput[controlName].type != "submit") {
                        let value = (listInput[controlName].type == 'number' && listInput[controlName].value == "" ) ? 0 : listInput[controlName].value;
                        dataPost[id] = [value];
                        if(listInput[controlName].type == 'checkbox'){
                            dataPost[id] = (value) ? [1] : [0];
                        }
                    }
                }
            }
            return dataPost;
        },
        /**
         * Hàm lấy dữ liệu của table dạng colName : ['a',"b","c"]
         */
        getDataTableInput(table) {
            let listInput = this.sDocumentSubmit.listInputInDocument;
            let indexCol = table.tableInstance.colName2Idx;
            let dataTable = {};
            for (let i in indexCol) {
                let id = "field_" + listInput[i].idField;
                let dataCol = table.tableInstance.tableInstance.getDataAtCol(
                    indexCol[i]
                );

                // cần xóa phần tử dòng cuối dùng là row enter mặc định ko có dữ liệu
                dataCol.pop();
                dataCol = (listInput[i].type == 'number' && dataCol == "" ) ? [0] : dataCol;
                dataTable[id] = dataCol;
            }
            console.log(dataTable);
            
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
                value: value
            });
        },
        addSQLInstanceDBToStore(SQLDBInstance) {
            this.$store.commit("document/addInstanceSubmitDB", {
                instance: this.keyInstance,
                sqlLite: SQLDBInstance
            });
        },




        runInputFilterFormulas(controlName){
            let controlInstance = this.sDocumentSubmit.listInputInDocument[controlName];
            let controlId = controlInstance.id
            let allFormulas = controlInstance.controlFormulas;
            if(allFormulas.hasOwnProperty('formulas')){
                if(allFormulas['formulas'].hasOwnProperty('instance')){
                    let formulasInstance = allFormulas['formulas'].instance;
                    if(formulasInstance.getFormulas() != ""){
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
            let controlUnique = checkDbOnly(controlName);
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
                for(let i in controlEffected){
                    if (checkCanBeBind(i)){
                        let controlEffectedInstance = this.sDocumentSubmit.listInputInDocument[i];
                        let controlId = controlEffectedInstance.id
                        let allFormulas = controlEffectedInstance.controlFormulas;
                        
                        if(allFormulas.hasOwnProperty('formulas')){
                            if(allFormulas['formulas'].hasOwnProperty('instance')){
                                let formulasInstance = allFormulas['formulas'].instance;
                                if(formulasInstance.getFormulas() != ""){
                                    this.handlerBeforeRunFormulasValue(formulasInstance,controlId,controlName,'formulas')
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
                                this.handlerBeforeRunFormulasValue(formulasInstance,controlId,controlName,formulasType)
                            }
                        }
                    }
                }
            }
        },
        
        handlerBeforeRunFormulasValue(formulasInstance,controlId,controlName,formulasType){
            
            let dataInput = this.getDataInputFormulas(formulasInstance);    
            let control = getControlInstanceFromStore(controlName);
            if(control.inTable != false){
                let tableName = getControlInstanceFromStore(control.inTable);
                tableName.tableInstance.handlerRunFormulasForControlInTable(formulasType,control,dataInput,formulasInstance);
            }
            formulasInstance.handleBeforeRunFormulas(dataInput).then(rs=>{
                this.handlerAfterRunFormulas(rs,controlId,controlName,formulasType)
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
        
        handlerAfterRunFormulas(rs,controlId,controlName,formulasType){
            let controlInstance = getControlInstanceFromStore(controlName);
            if($('#'+controlId).length > 0){
                if($('#'+controlId).attr('s-control-type') == 'inputFilter'){
                    this.$refs.symDragPanel.show();
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
                            value=data[0].values[0];
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
                            this.handlerDataAfterRunFormulasValue(value,controlId,controlName);
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
        handlerDataAfterRunFormulasValue(value,controlId,controlName){
            let controlInstance = getControlInstanceFromStore(controlName);
            if($('#'+controlId).length > 0){
                $('#'+controlId).val(value);
                $('#'+controlId).trigger('change')
                markBinedField(controlName);
            }
        },

        /**
         * Hàm set data cho bảng trong doc sau khi chạy công thức có dữ liệu
         */
        setDataToTable(tableControlId,data){
            let tableName = this.sDocumentEditor.allControl[tableControlId].properties.name.value;
            let dataTable = []
            for(let i = 0; i < data.length; i++){
                let row = {};
                for(let controlName in data[i]){
                    row[controlName] == data[i][controlName];
                }
                dataTable.push(row);
            }
            this.sDocumentSubmit.listInputInDocument[tableName].tableInstance.tableInstance.loadData(dataTable)
            
        },

        /**
         * Hàm bind link vào control sau khi chạy công thức link
         */
        handlerDataAfterRunFormulasLink(link,controlName){
            let controlInstance = getControlInstanceFromStore(controlName);
            controlInstance.renderLinkToControl(link);
        },
        handlerDataAfterRunFormulasRequire(isRequire,controlName){
            if(Array.isArray(isRequire)){
                isRequire=isRequire[0]
            }
            let controlInstance = getControlInstanceFromStore(controlName);
            if(controlInstance.isEmpty()&&(isRequire==1||isRequire==true)){
                controlInstance.renderValidateIcon('Không được bỏ trống trường này!')
            }
            else{
                controlInstance.removeRequire();
            }
        },
        handlerDataAfterRunFormulasValidate(message,controlName){
            if(Array.isArray(message)){
                message=message[0]
            }
            let controlInstance = getControlInstanceFromStore(controlName);
            if(controlInstance.isEmpty()){
                controlInstance.renderValidateIcon(message);
            }
            else{
                controlInstance.removeRequire();
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
                this.setAllImpactedFieldsList(controlName);
                let controlInstance = listInput[controlName];
                if(controlInstance.type != "inputFilter"){
                    if(Object.keys(controlInstance.controlFormulas).length > 0){
                        let controlFormulas = controlInstance.controlFormulas;
                        
                        for(let formulasType in controlFormulas){
                            if(formulasType != 'autocomplete'){
                                if(controlFormulas[formulasType].hasOwnProperty('instance')){
                                    let formulasInstance = controlFormulas[formulasType].instance;
                                    if(formulasInstance.getFormulas() != "" && Object.keys(formulasInstance.getInputControl()).length == 0){
                                        this.handlerBeforeRunFormulasValue(formulasInstance,controlInstance.id,controlName,formulasType)
                                    }
                                }
                            }
                            
                        }
                    }
                }
                
                
            }
            this.$store.commit("document/addToDocumentSubmitStore", {
                key: 'impactedFieldsList',
                value: impactedFieldsList
            });
            
        },
        /**
         * Lấy tất cả các control bị ảnh hưởng khi mà một control thay đổi giá trị
         */
        setAllImpactedFieldsList(fieldName) {
            console.log(fieldName);
            
            impactedFieldsList[fieldName] = {};
            impactedFieldsArr = this.getAllImpactedInput(fieldName);
            for (var i = 0; i < impactedFieldsArr.length; i++) {
                impactedFieldsList[fieldName][impactedFieldsArr[i]] = false;
            }
            impactedFieldsListWhenStart[fieldName] = false;
        },
        getAllImpactedInput(sourceName) {
            let sourceControlInstance = getControlInstanceFromStore(sourceName)
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



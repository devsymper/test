import Formulas from "./formulas";
import sDocument from './../../../store/document';
import {
    markBinedField
} from './handlerCheckRunFormulas';
import {
    SYMPER_APP
} from './../../../main.js'
import store from './../../../store'
import {
    getControlInstanceFromStore,
    getListInputInDocument
} from './../common/common'

const AUTO_SET = 'auto_set';

export default class Control {
    constructor(idField, ele, controlProps, keyInstance, value = "") {
        /**
         * object các thuộc tính về hiển thị của control
         */
        this.controlProperties = controlProps.properties
            /**
             * Object các thuộc tính về công thức của control
             */
        this.controlFormulas = controlProps.formulas
            /**
             * jQueryObject tham chiếu tới DOM của control
             */
        this.ele = ele;
        /**
         * instance của submit hiện tại
         */
        this.keyInstance = keyInstance;
        /**
         * id của dòng dữ liệu trong bảng field, phục vụ cho việc lấy datapost submit
         */
        this.idField = idField;
        this.value = value;
        this.defaultValue = "";
        this.lastUserUpdate = controlProps.userUpdate;
        this.optionValues = {}
        this.validateMessageType = ['Require','RequireChange','Validate','UniqueDB','MaxLength','MinLength'];

    }
    init() {
        /**
         * mảng luu giá trị các control bị ảnh hưởng, chỉ ra control này thay đổi giá trị thì sẽ thay đổi theo các control nào
         */
        this.effectedControl = {};
        this.effectedHiddenControl = {};
        this.effectedRequireControl = {};
        this.effectedReadonlyControl = {};
        this.effectedLinkControl = {};
        this.effectedValidateControl = {};
        this.effectedMinDateControl = {};
        this.effectedMaxDateControl = {};
        this.inTable = (this.controlProperties.inTable != undefined) ? this.controlProperties.inTable : false;
        this.docName = this.controlProperties.docName;
        /**
         * Tên của control
         */
        this.name = (this.controlProperties.hasOwnProperty('name')) ? this.controlProperties.name.value : "";
        this.title = (this.controlProperties.hasOwnProperty('title')) ? this.controlProperties.title.value : "";
        /**
         * id của control
         */
        this.id = this.ele.attr('id');

        /**
         * Loại control
         */
        this.type = this.ele.attr('s-control-type');
        /**
         * Danh sách các control bị thay đổi giá trị, hoặc hiển thị... khi control này thay đổi giá trị
         */
        this.sourceControlNames = {
            validate: {},
            readonly: {},
            visibility: {},
            require: {},
            data: {}
        };
        this.currentDataStore = this.getDataStoreSubmit();
        this.initFormulas();


    }
    isKeyCacheInTable(){
        if(!this.controlProperties.isKeyCacheInTable){
            return false;
        }
        let isKeyCacheInTable = this.controlProperties.isKeyCacheInTable.value;
        if(typeof isKeyCacheInTable == 'object'){
            return false;
        }
        return this.controlProperties.isKeyCacheInTable.value
    }
    /**
     * Hàm trả về giá trị của 1 prop
     * @param {*} prop 
     */
    getValueProp(prop){
        if (this.controlProperties[prop] != undefined) {
            if (typeof this.controlProperties[prop].value == 'object') {
                return "";
            }
            return this.controlProperties[prop].value;
        }
        return false
    }
    getDataStoreSubmit() {
        return sDocument.state.submit[this.keyInstance];
    }

    /**
     * Hàm check có tồn tại và có giá trị thuộc tính của control
     * @param {*} props 
     */
    checkProps(props) {
        if (this.controlProperties[props] && this.controlProperties[props].value == true) {
            return true;
        }
        return false;
    }
    checkEmptyFormulas(type) {
        if (this.controlFormulas.hasOwnProperty(type)) {
            return true;
        }
        return false;
    }
    getFormulaInstance(type){
        if (this.controlFormulas.hasOwnProperty(type) && this.controlFormulas[type].instance) {
            return this.controlFormulas[type].instance;
        }
        return false;
    }

    checkEmptyProps(props) {
        if (this.controlProperties[props] !== undefined &&
            (this.controlProperties[props].value !== "" &&
                this.controlProperties[props].value !== null &&
                this.controlProperties[props].value !== undefined)) {
            return this.controlProperties[props].value;
        }
        return false;
    }

    // set các mối quan hệ của các control trường hợp đã được lưu trên server
    setEffectedData(effected) {
        if (effected == "" || effected == null) {
            return;
        }
        try {
            effected = JSON.parse(effected);
            for (let type in effected) {
                if (type == "effectedControl") {
                    this.effectedControl = effected[type];
                } else if (type == "effectedHiddenControl") {
                    this.effectedHiddenControl = effected[type]
                } else if (type == "effectedRequireControl") {
                    this.effectedRequireControl = effected[type]
                } else if (type == "effectedReadonlyControl") {
                    this.effectedReadonlyControl = effected[type]
                } else if (type == "effectedLinkControl") {
                    this.effectedLinkControl = effected[type]
                } else if (type == "effectedValidateControl") {
                    this.effectedValidateControl = effected[type]
                } else if (type == "effectedMinDateControl") {
                    this.effectedMinDateControl = effected[type]
                } else if (type == "effectedMaxDateControl") {
                    this.effectedMaxDateControl = effected[type]
                }
            }
        } catch (error) {

        }
    }

    /**
     * Khởi tạo các formulas của từng control
     */
    initFormulas() {
        if (this.checkDetailView()) {
            return;
        }
        if (Object.keys(this.controlFormulas).length > 0) {
            for (let key in this.controlFormulas) {
                if (key == 'linkConfig') {
                    let configs = this.controlFormulas[key].configData;
                    for (let index = 0; index < configs.length; index++) {
                        let config = configs[index];
                        let formulas = config.formula.value;
                        if (formulas) {
                            formulas = formulas.trim();
                            formulas = formulas.replace(/\r?\n|\r/g, ' ');
                            this.controlFormulas[key].configData[index]['instance'] = new Formulas(this.keyInstance, formulas, key);
                        }

                    }
                }
                if (this.controlFormulas[key].value && Object.values(this.controlFormulas[key].value).length > 0) {
                    let formulas = Object.values(this.controlFormulas[key].value)[0];
                    formulas = formulas.replace(/\r?\n|\r/g, ' ');
                    formulas = formulas.trim();
                    if (formulas) {
                        this.controlFormulas[key]['instance'] = new Formulas(this.keyInstance, formulas, key);
                        let table = this.controlFormulas[key]['instance'].detectTableRelateLocalFormulas();
                        if (table.length > 0) {
                            store.commit("document/addToRelatedLocalFormulas", {
                                key: this.name,
                                value: table,
                                instance: this.keyInstance
                            });
                        }
                    }

                }
            }
        }
        this.checkDBOnly();

    }
    checkDBOnly() {
        if (!this.checkDetailView() && this.checkProps('isDBOnly')) {
            let fromTable = (this.inTable == false) ? "document_" + this.docName : "document_child_" + this.docName + "_" + this.inTable;
            let formulas = "ref(SELECT count(" + this.name + ") > 0 AS " + this.name + " from " + fromTable + " where " + this.name + " = '{" + this.name + "}')"
                // this.controlFormulas.uniqueDB = new Formulas(this.keyInstance, formulas, 'uniqueDB');
            this.controlFormulas.uniqueDB = {
                title: "Duy nhất trong DataBase",
                value: formulas,
                instance: new Formulas(this.keyInstance, formulas, 'uniqueDB'),
                formulasId: 0,
                type: "script",
                groupType: "formulas"
            }

        }
    }
    getEffectedControl() {
        return this.effectedControl;
    }
    getEffectedHiddenControl() {
        return this.effectedHiddenControl;
    }
    getEffectedReadonlyControl() {
        return this.effectedReadonlyControl;
    }
    getEffectedRequireControl() {
        return this.effectedRequireControl;
    }
    getEffectedLinkControl() {
        return this.effectedLinkControl;
    }
    getEffectedValidateControl() {
        return this.effectedValidateControl;
    }
    getEffectedMinDateControl() {
        return this.effectedMinDateControl;
    }
    getEffectedMaxDateControl() {
        return this.effectedMaxDateControl;
    }

    handlerDataAfterRunFormulasLink(values, formulasType) {
        if (this.inTable != false) {
            let configInstance = formulasType.split('_')[1]
            let tableControlInstance = getListInputInDocument(this.keyInstance)[this.inTable];
            let dataTable = tableControlInstance.tableInstance.tableInstance.getData();
            let colIndex = tableControlInstance.tableInstance.getColumnIndexFromControlName(this.name);
            let linkFormulas = this.controlFormulas.linkConfig.configData;
            let title = "";
            let source = "";
            for (let index = 0; index < linkFormulas.length; index++) {
                let config = linkFormulas[index];
                let formulaIns = config.formula.instance;
                if (Number(formulaIns) == Number(configInstance)) {
                    title = config.title;
                    source = config.objectType.type;
                }
            }
            for (let rowId in values) {
                let value = values[rowId];
                if (value == 0) {
                    continue;
                }
                let rowIndex = this.findIndexByRowId(dataTable, rowId);
                let cellPos = rowIndex + "_" + colIndex;
                tableControlInstance.tableInstance.addToValueMap(cellPos, {
                    type: 'linkControl',
                    key: formulasType,
                    value: value,
                    title: title,
                    source: source,
                });
                store.commit(
                    "document/updateDataForLinkControl", { formulasType: formulasType + "_" + rowIndex, link: value, title: title, source: source, instance: this.keyInstance, controlName: this.name }
                );
            }
            tableControlInstance.tableInstance.tableInstance.render()
        }
    }
    /**
     * Xử lý sau khi chạy xong công thức validate
     * trường hợp trong table group thì có columnName
     */
    handlerDataAfterRunFormulasValidate(values, rowNodeId = null, columnName = null) {
        if (this.inTable != false) {
            let tableIns = getControlInstanceFromStore(this.keyInstance, this.inTable);
            if(!this.optionValues['Validate']){
                this.optionValues['Validate'] = {}
            }
            if(rowNodeId && Object.keys(rowNodeId).length == 1){
                values = (values) ? values : '';
                values = (typeof values == 'object') ? Object.values(values)[0] : values;
                this.optionValues['Validate'][rowNodeId[0]] = {
                    msg: values,
                    isValid:(values != '' && values != null && values != undefined && values != 'f'),
                }

            }
            else{ // trường hợp giá trị cho cả cột
                // for(let rowId in rowIndexs){
                //     let cellValue = values[rowId];
                //     let rowIndex = rowIndexs[rowId];
                //     this.optionValues['Validate'][rowIndex] = {
                //         msg: values,
                //         isValid:(cellValue != '' && cellValue != null && cellValue != undefined && cellValue != 'f'),
                //     }
                // }
            }
            tableIns.tableInstance.refreshCells(columnName,rowNodeId)
        }
        else{
            if(Array.isArray(values)){
                values=values[0]
            }
            if(values){
                this.renderValidateIcon(values, 'Validate');
            }
            else{
                this.removeValidateIcon('Validate');
            }
        }
    }
    findIndexByRowId(dataTable, rowId) {
        for (let index = 0; index < dataTable.length; index++) {
            const row = dataTable[index];
            if (row[row.length - 1] == rowId) {
                return index;
            }
        }
        return 0
    }
    handlerDataAfterRunFormulasRequire(values) {
        if (this.inTable != false) {
            let tableControlInstance = getListInputInDocument(this.keyInstance)[this.inTable];
            let colIndex = tableControlInstance.tableInstance.getColumnIndexFromControlName(this.name);
            for (let index = 0; index < values.length; index++) {
                let row = values[index];
                let v = row == 1
                let cellPos = index + "_" + colIndex;
                tableControlInstance.tableInstance.addToValueMap(cellPos, {
                    type: "require",
                    value: v,
                    msg: 'Không được bỏ trống'
                });
            }
        }
        else{
            if(Array.isArray(values)){
                values=values[0]
            }
            if(this.isEmpty()&&(values==1||values==true)){
                this.renderValidateIcon('Không được bỏ trống trường thông tin '+this.title,'Require')
            }
            else{
                this.removeValidateIcon('Require');
            }
        }
    }
    handlerDataAfterRunFormulasHidden(values) {
        if (this.inTable != false) {
            if(values && Object.values(values).length > 0 && Object.values(values)[0] == 1){
                let tableControl = getListInputInDocument(this.keyInstance)[this.inTable];
                let colIndex = tableControl.tableInstance.getColumnIndexFromControlName(this.name);
                var plugin = tableControl.tableInstance.tableInstance.getPlugin('hiddenColumns');
                plugin.hideColumn(colIndex);
            }
        }
        else{
            if(Array.isArray(values)){
                values=values[0];
            }
            let display = (values == 1 || values==true ) ? 'none' : 'inline-block'
            if(this.type == 'page'){
                this.setHiddenPage()
            }
            else if(this.type == 'tab'){
                this.setHiddenTab()
            }
            else{
                this.ele.parent().css({'display':display})
            }
        }
    }
    handlerDataAfterRunFormulasReadonly(values) {
        if (this.inTable != false) {
            // let tableControlInstance = getListInputInDocument(this.keyInstance)[this.inTable];
            // let colIndex = tableControlInstance.tableInstance.getColumnIndexFromControlName(this.name);
            // let tableData = tableControlInstance.tableInstance.getSourceData();
            // for (let index = 0; index < tableData.length; index++) {
            //     const rowData = tableData[index];
            //     let status = false;
            //     if (rowData['s_table_id_sql_lite'] && values[rowData['s_table_id_sql_lite']]) {
            //         if (values[rowData['s_table_id_sql_lite']] == 1 || values == true || values == 't') {
            //             status = true;
            //         }
            //     }
            //     let cellPos = index + "_" + colIndex;
            //     tableControlInstance.tableInstance.addToValueMap(cellPos, {
            //         type: 'readOnly',
            //         value: status
            //     });

            // }
        } else {
            if (Array.isArray(values)) {
                values = values[0]
            }
            if (values == 1 || values == true || values == 't') {
                $('#' + this.id).attr('disabled', 'disabled');
            } else {
                $('#' + this.id).removeAttr('disabled');
            }
        }
    }

    handlerDataAfterRunFormulasValue(values,rowNodeId = {}) {
        if (this.inTable != false) {
            let tableIns = getControlInstanceFromStore(this.keyInstance, this.inTable);
            if(Object.keys(rowNodeId).length == 1){
                values = (values) ? values : '';
                values = (typeof values == 'object') ? Object.values(values)[0] : values;
                tableIns.tableInstance.setDataAtCell(this.name, values,rowNodeId[0]);
            }
            else{ // trường hợp giá trị cho cả cột
                tableIns.tableInstance.updateColumnData(values, this.name);
            }
            /**
             * Sau khi chạy xong công thức thì đánh dấu là control đã bind giá trị
             */
            store.commit("document/updateListInputInDocument", {
                controlName: this.name,
                key: 'value',
                value: tableIns.tableInstance.getColData(this.name),
                instance: this.keyInstance
            });
            /**
             * Sau khi chạy xong công thức thì đánh dấu là control đã bind giá trị
             */
            markBinedField(this.keyInstance, this.name);
            setTimeout((self) => {
                let controlEffected = this.getEffectedControl();
                for (let control in controlEffected) {
                    let controlIns = getControlInstanceFromStore(self.keyInstance, control)
                    if (controlIns.inTable == false){
                        SYMPER_APP.$evtBus.$emit('run-effected-control-when-table-change', controlIns)
                    }
                }
            }, 200,this);
        } 
    }
    setDataTable(data) {
        if (data.length > 0 && data[0].length > 0) {
            let allColumnBindData = Object.keys(data[0][0]);
            if (allColumnBindData.length > 0) {
                for (let index = 0; index < allColumnBindData.length; index++) {
                    const controlName = allColumnBindData[index];
                    let colData = data[0].reduce((arr, obj) => {
                        arr.push(obj[controlName])
                        return arr
                    }, []);
                    let vls = [];
                    for (let i = 0; i < colData.length; i++) {
                        vls.push([i, controlName, colData[i]]);
                    }
                    this.tableInstance.setData(vls);
                }
            } else {
                this.tableInstance.setData(false);
            }
        }

    }
    handlerDataAfterRunFormulasUniqueDB(data, rowIndex) {
        if (this.inTable == false) {
            if (data == 't' || data === true) {
                this.renderValidateIcon('Dữ liệu trường thông tin ' + this.title + ' đã tồn tại', 'UniqueDB');
            } else {
                this.removeValidateIcon('UniqueDB');
            }
        } else {
            let tableControl = getListInputInDocument(this.keyInstance)[this.inTable];
            let colIndex = tableControl.tableInstance.getColumnIndexFromControlName(this.name);
            let dataAtCol = tableControl.tableInstance.tableInstance.getDataAtCol(colIndex);
            let mess = {
                msg: "",
                type: "uniqueDB",
                value: v
            }
            if (data == 't' || data === true) {
                mess = {
                    type: "uniqueDB",
                    uniqueDB: true,
                    msg: "Dữ liệu đã tồn tại"
                }
            }
            let cellPos = rowIndex + "_" + colIndex;
            tableControlInstance.tableInstance.addToValueMap(cellPos, mess);
            tableControl.tableInstance.tableInstance.render();
        }
    }

    makeErrNoti(rowNodeId = null) {
        return '<span class="mdi mdi-checkbox-blank-circle validate-icon" control-name="'+this.name+'" row-node-id="'+rowNodeId+'"></span>'
    }
    renderValidateIcon(message, type) {
        let iconEl = this.makeErrNoti();
        this.ele.parent().append(iconEl);
        this.optionValues[type] = {};
        this.optionValues[type][0] = {};
        this.optionValues[type][0] = {
            isValid: true,
            msg:message
        }
    }
    removeValidateIcon(type) {
        delete this.optionValues[type]
        this.ele.parent().find('.validate-icon').remove();
    }
    isEmpty() {
            return this.ele.val() == ""
        }
        // hàm kiểm tra là view detail hay submit
    checkDetailView() {
        if (sDocument.state.viewType[this.keyInstance] == 'detail') {
            return true;
        } else {
            return false;
        }
    }
    checkViewType(type) {
        if (sDocument.state.viewType[this.keyInstance] == type) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Hàm kiểm tra độ dài giá tri nhập vào với control TextInput
     */

    checkValidValueLength(rowIndex) {
            if (this.type != "textInput") {
                return true;
            }
            let rs = true;
            if (this.inTable != false) {
                // let table = getListInputInDocument(this.keyInstance)[this.inTable];
                // let colIndex = table.tableInstance.getColumnIndexFromControlName(this.name);
                // let dataAtCol = table.tableInstance.tableInstance.getDataAtCol(colIndex);
                // if (rowIndex == "all") {
                //     for (let index = 0; index < dataAtCol.length; index++) {
                //         let cellPos = index + "_" + colIndex;
                //         let messValidate = {
                //             type: "valueLength",
                //             value: false
                //         }
                //         let row = dataAtCol[index];
                //         if (row == null) {
                //             row = "";
                //         }
                //         if (this.controlProperties.maxValue.value != "") {
                //             if (row.length > this.controlProperties.maxValue.value) {
                //                 messValidate.value = true;
                //                 messValidate.msg = 'Độ dài kí tự không được vượt quá ' + this.controlProperties.maxValue.value + " kí tự";
                //                 rs = false;
                //             }
                //         }
                //         if (this.controlProperties.minValue.value != "") {
                //             if (row.length < this.controlProperties.minValue.value) {
                //                 messValidate.value = true;
                //                 messValidate.msg = 'Độ dài kí tự không được ít hơn ' + this.controlProperties.minValue.value + " kí tự"
                //                 rs = false;
                //             }
                //         }
                //         table.tableInstance.addToValueMap(cellPos, messValidate);
                //     }
                // } else {
                //     let value = dataAtCol[rowIndex];
                //     if (value == null) {
                //         value = "";
                //     }
                //     let cellPos = rowIndex + "_" + colIndex;
                //     let messValidate = {
                //         type: "valueLength",
                //         value: false
                //     }
                //     if (this.controlProperties.maxValue.value != "") {
                //         if (value.length > this.controlProperties.maxValue.value) {
                //             messValidate.value = true;
                //             messValidate.msg = 'Độ dài kí tự không được vượt quá ' + this.controlProperties.maxValue.value + " kí tự";
                //             rs = false;
                //         }
                //     }
                //     if (this.controlProperties.minValue.value != "") {
                //         if (value.length < this.controlProperties.minValue.value) {
                //             messValidate.value = true;
                //             messValidate.msg = 'Độ dài kí tự không được ít hơn ' + this.controlProperties.minValue.value + " kí tự";
                //             rs = false;
                //         }
                //     }
                //     table.tableInstance.addToValueMap(cellPos, messValidate);
                // }
                // table.tableInstance.tableInstance.render()
            } else {
                let checkMax = false;
                if (this.controlProperties.maxValue.value != "") {
                    this.removeValidateIcon('MaxLength');
                    if (this.value.length > this.controlProperties.maxValue.value) {
                        checkMax = true;
                        this.renderValidateIcon('Độ dài kí tự không được vượt quá ' + this.controlProperties.maxValue.value + " kí tự", 'MaxLength');
                        rs = false;
                    }
                }
                if (this.controlProperties.minValue.value != "" && !checkMax) {
                    this.removeValidateIcon('MinLength');
                    if (this.value.length < this.controlProperties.minValue.value) {
                        this.renderValidateIcon('Độ dài kí tự không được ít hơn ' + this.controlProperties.minValue.value + " kí tự", 'MinLength');
                        rs = false;
                    }
                }
            }

            return rs
        }
        /**
         * thêm màu đánh dấu control là đầu vào của control đang được kiểm tra với F2
         */
    renderInputTraceControlColor() {
            if (this.inTable) {
                this.traceInputTable();
            } else {
                this.ele.addClass('trace-input-control');
            }
        }
        /**
         * thêm màu đánh dấu control là đầu ra của control đang được kiểm tra với F2
         */
    renderOutputTraceControlColor() {
            if (this.inTable) {
                this.traceInputTable('trace-output-control');
            } else {
                this.ele.addClass('trace-output-control');
            }
        }
        /**
         * thêm màu đánh dấu control đang được kiểm tra với F2
         */
    renderCurrentTraceControlColor() {
        if (this.inTable) {
            this.traceInputTable('trace-current-control');
        } else {
            this.ele.addClass('trace-current-control');
        }
    }
    removeTraceControlColor() {
        if (this.type == 'number' && this.formulaValue && this.ele.hasClass('trace-current-control')) {
            this.ele.focus();
        }
        if (this.inTable) {
            this.traceInputTable('', true);
        } else {
            this.ele.attr('class', function(i, c) {
                return c.replace(/trace-.*-control/g, '');
            });
        }

    }
    traceInputTable(className, isRemove = false) {
        let tableControl = getListInputInDocument(this.keyInstance)[this.inTable];
        tableControl.tableInstance.traceInputTable(this.name, className, isRemove)
    }
    handlerDataAfterRunFormulasMinDate(value) {
        this.minDate = value;
    }
    handlerDataAfterRunFormulasMaxDate(value) {
        this.maxDate = value;
    }

}
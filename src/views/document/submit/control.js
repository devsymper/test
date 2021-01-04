import Formulas from "./formulas";
import sDocument from './../../../store/document';
import Util from './util';
import {
    markBinedField
} from './handlerCheckRunFormulas';
import {
    SYMPER_APP
} from './../../../main.js'
import store from './../../../store'
import {
    getListInputInDocument
} from './../common/common'

const AUTO_SET = 'auto_set';

export default class Control {
    constructor(idField, ele, controlProps, curParentInstance, value = "") {
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
        this.curParentInstance = curParentInstance;
        /**
         * id của dòng dữ liệu trong bảng field, phục vụ cho việc lấy datapost submit
         */
        this.idField = idField;
        this.value = value;
        this.defaultValue = "";
        this.lastUserUpdate = controlProps.userUpdate

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
    getDataStoreSubmit() {
        return sDocument.state.submit[this.curParentInstance];
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
        console.log(this.name, effected, 'effectedeffectedeffectedeffected');
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
                            this.controlFormulas[key].configData[index]['instance'] = new Formulas(this.curParentInstance, formulas, key);
                        }

                    }
                }
                if (this.controlFormulas[key].value && Object.values(this.controlFormulas[key].value).length > 0) {
                    let formulas = Object.values(this.controlFormulas[key].value)[0];
                    formulas = formulas.replace(/\r?\n|\r/g, ' ');
                    if (formulas) {
                        formulas = formulas.trim();
                        this.controlFormulas[key]['instance'] = new Formulas(this.curParentInstance, formulas, key);
                        let table = this.controlFormulas[key]['instance'].detectTableRelateLocalFormulas();
                        if (table.length > 0) {
                            store.commit("document/addToRelatedLocalFormulas", {
                                key: this.name,
                                value: table,
                                instance: this.curParentInstance
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
                // this.controlFormulas.uniqueDB = new Formulas(this.curParentInstance, formulas, 'uniqueDB');
            this.controlFormulas.uniqueDB = {
                title: "Duy nhất trong DataBase",
                value: formulas,
                instance: new Formulas(this.curParentInstance, formulas, 'uniqueDB'),
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
            let tableControlInstance = getListInputInDocument(this.curParentInstance)[this.inTable];
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
                    "document/updateDataForLinkControl", { formulasType: formulasType + "_" + rowIndex, link: value, title: title, source: source, instance: this.curParentInstance, controlName: this.name }
                );
            }
            tableControlInstance.tableInstance.tableInstance.render()
        }
    }
    handlerDataAfterRunFormulasValidate(values) {
        if (this.inTable != false) {
            let tableControlInstance = getListInputInDocument(this.curParentInstance)[this.inTable];
            let dataTable = tableControlInstance.tableInstance.tableInstance.getData();
            let colIndex = tableControlInstance.tableInstance.getColumnIndexFromControlName(this.name);
            for (let rowId in values) {
                let msg = values[rowId];
                let rowIndex = this.findIndexByRowId(dataTable, rowId);
                let cellPos = rowIndex + "_" + colIndex;
                // if(msg != '' && msg != null && msg != undefined && msg != 'f'){
                //     this.addToValidateTable(rowIndex,'Validate',msg)
                // }
                // else{
                //     this.removeValidateOnCellTable(rowIndex,'Validate')
                // }
                tableControlInstance.tableInstance.addToValueMap(cellPos, {
                    msg: msg,
                    type: "validate",
                    value: (msg != '' && msg != null && msg != undefined && msg != 'f'),
                });

            }
            tableControlInstance.tableInstance.tableInstance.render()
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
            let tableControlInstance = getListInputInDocument(this.curParentInstance)[this.inTable];
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
    }
    handlerDataAfterRunFormulasHidden(values) {
        if (this.inTable != false) {
            if(values && Object.values(values).length > 0 && Object.values(values)[0] == 1){
                let tableControl = getListInputInDocument(this.curParentInstance)[this.inTable];
                let colIndex = tableControl.tableInstance.getColumnIndexFromControlName(this.name);
                var plugin = tableControl.tableInstance.tableInstance.getPlugin('hiddenColumns');
                plugin.hideColumn(colIndex);
            }
           

        }
    }
    handlerDataAfterRunFormulasReadonly(values) {
        if (this.inTable != false) {
            let tableControlInstance = getListInputInDocument(this.curParentInstance)[this.inTable];
            let colIndex = tableControlInstance.tableInstance.getColumnIndexFromControlName(this.name);
            let tableData = tableControlInstance.tableInstance.getSourceData();
            for (let index = 0; index < tableData.length; index++) {
                const rowData = tableData[index];
                let status = false;
                if (rowData['s_table_id_sql_lite'] && values[rowData['s_table_id_sql_lite']]) {
                    if (values[rowData['s_table_id_sql_lite']] == 1 || values == true || values == 't') {
                        status = true;
                    }
                }
                let cellPos = index + "_" + colIndex;
                tableControlInstance.tableInstance.addToValueMap(cellPos, {
                    type: 'readOnly',
                    value: status
                });

            }
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

    /**
     * Hàm thêm giá trị validate từng cell trong table vào store
     * @param {*} row 
     * @param {*} type 
     * @param {*} message 
     */

    addToValidateTable(row, type, message){
        let currentValidate = this.getCurrentValidate();
        if(!currentValidate){
            currentValidate = {};
        }
        if(!currentValidate[row]){
            currentValidate[row] = {};

        }
        currentValidate[row][type] = message;
        console.log(currentValidate,'currentValidatecurrentValidate');
        store.commit("document/updateValidateControlSubmit", {
            controlName: this.name,
            value: currentValidate,
            instance: this.curParentInstance
        });
    }
    removeValidateOnCellTable(row, type){
        store.commit("document/removeValidateControlSubmit", {
            controlName: this.name,
            type: type,
            rowIndex: row,
            instance: this.curParentInstance
        });
    }

    handlerDataAfterRunFormulasValue(values) {
        if (this.inTable != false) {
            let vls = [];
            for (let index = 0; index < values.length; index++) {
                let row = values[index];
                if (row == null || row == 'null')
                    row = '';
                vls.push([index, this.name, row]);
            }
            let tableControl = getListInputInDocument(this.curParentInstance)[this.inTable];

            tableControl.tableInstance.tableInstance.setDataAtRowProp(vls, null, null, AUTO_SET);
            markBinedField(this.curParentInstance, this.name);
            setTimeout(() => {
                let controlEffected = this.getEffectedControl();
                for (let control in controlEffected) {
                    if (getListInputInDocument(this.curParentInstance)[control].inTable == false)
                        SYMPER_APP.$evtBus.$emit('run-effected-control-when-table-change', getListInputInDocument(this.curParentInstance)[control])
                }
            }, 100);
        } else {
            if (this.type == 'table') {
                let vls = [];
                if (values.columns == undefined) {
                    // for (let index = 0; index < values.length; index++) {
                    //     let row = values[index];
                    //     if (row == null || row == 'null')
                    //         row = '';
                    //     vls.push([index, this.name, row]);
                    // }

                    this.setDataTable(values)
                } else {
                    //sqlite
                }
                // let tableControl = getListInputInDocument(this.curParentInstance)[this.name];
                // tableControl.tableInstance.tableInstance.setDataAtRowProp(vls, null, null, AUTO_SET);

                // markBinedField(this.name);
                // setTimeout(() => {
                //     let controlEffected = this.getEffectedControl();
                //     for (let control in controlEffected) {
                //         if (getListInputInDocument(this.curParentInstance)[control].inTable == false)
                //             SYMPER_APP.$evtBus.$emit('run-effected-control-when-table-change', getListInputInDocument(this.curParentInstance)[control])
                //     }
                // }, 100);
            } else {
                if ($('#' + this.id).length > 0) {
                    $('#' + this.id).val(values);
                    $('#' + this.id).trigger('change')
                    markBinedField(this.curParentInstance, this.name);
                }
            }

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
    handlerDataAfterRunFormulasUniqueDB(data, dataInput) {
        if (this.inTable == false) {
            if (data == 't' || data === true) {
                this.renderValidateIcon('Dữ liệu trường thông tin ' + this.title + ' đã tồn tại', 'UniqueDB');
            } else {
                this.removeValidateIcon('UniqueDB');
            }
        } else {
            let tableControl = getListInputInDocument(this.curParentInstance)[this.inTable];
            let colIndex = tableControl.tableInstance.getColumnIndexFromControlName(this.name);
            let dataAtCol = tableControl.tableInstance.tableInstance.getDataAtCol(colIndex);
            let rowIndex = dataAtCol.indexOf(dataInput[Object.keys(dataInput)[0]][0]);
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
    getCurrentValidate(){
        return this.getDataStoreSubmit()['validateMessage'][this.name]
    }
    renderValidateIcon(message, type) {
        let iconEl = Util.makeErrNoti(this.name);
        this.ele.parent().append(iconEl);
        let currentValidate = this.getCurrentValidate();
        if (!currentValidate) {
            currentValidate = {};
        }
        currentValidate[type] = message;
        store.commit("document/updateValidateControlSubmit", {
            controlName: this.name,
            value: currentValidate,
            instance: this.curParentInstance
        });
    }
    removeValidateIcon(type) {
        let currentValidate = this.getCurrentValidate();
        if(currentValidate && currentValidate[type]){
            store.commit("document/removeValidateControlSubmit", {
                controlName: this.name,
                type: type,
                instance: this.curParentInstance
            });
        }
        this.ele.parent().find('.validate-icon').remove();
        
    }
    isEmpty() {
            return this.ele.val() == ""
        }
        // hàm kiểm tra là view detail hay submit
    checkDetailView() {
        if (sDocument.state.viewType[this.curParentInstance] == 'detail') {
            return true;
        } else {
            return false;
        }
    }
    checkViewType(type) {
        if (sDocument.state.viewType[this.curParentInstance] == type) {
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
                let table = getListInputInDocument(this.curParentInstance)[this.inTable];
                let colIndex = table.tableInstance.getColumnIndexFromControlName(this.name);
                let dataAtCol = table.tableInstance.tableInstance.getDataAtCol(colIndex);
                if (rowIndex == "all") {
                    for (let index = 0; index < dataAtCol.length; index++) {
                        let cellPos = index + "_" + colIndex;
                        let messValidate = {
                            type: "valueLength",
                            value: false
                        }
                        let row = dataAtCol[index];
                        if (row == null) {
                            row = "";
                        }
                        if (this.controlProperties.maxValue.value != "") {
                            if (row.length > this.controlProperties.maxValue.value) {
                                messValidate.value = true;
                                messValidate.msg = 'Độ dài kí tự không được vượt quá ' + this.controlProperties.maxValue.value + " kí tự";
                                rs = false;
                            }
                        }
                        if (this.controlProperties.minValue.value != "") {
                            if (row.length < this.controlProperties.minValue.value) {
                                messValidate.value = true;
                                messValidate.msg = 'Độ dài kí tự không được ít hơn ' + this.controlProperties.minValue.value + " kí tự"
                                rs = false;
                            }
                        }
                        table.tableInstance.addToValueMap(cellPos, messValidate);
                    }
                } else {
                    let value = dataAtCol[rowIndex];
                    if (value == null) {
                        value = "";
                    }
                    let cellPos = rowIndex + "_" + colIndex;
                    let messValidate = {
                        type: "valueLength",
                        value: false
                    }
                    if (this.controlProperties.maxValue.value != "") {
                        if (value.length > this.controlProperties.maxValue.value) {
                            messValidate.value = true;
                            messValidate.msg = 'Độ dài kí tự không được vượt quá ' + this.controlProperties.maxValue.value + " kí tự";
                            rs = false;
                        }
                    }
                    if (this.controlProperties.minValue.value != "") {
                        if (value.length < this.controlProperties.minValue.value) {
                            messValidate.value = true;
                            messValidate.msg = 'Độ dài kí tự không được ít hơn ' + this.controlProperties.minValue.value + " kí tự";
                            rs = false;
                        }
                    }
                    table.tableInstance.addToValueMap(cellPos, messValidate);
                }
                table.tableInstance.tableInstance.render()
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
        let tableControl = getListInputInDocument(this.curParentInstance)[this.inTable];
        tableControl.tableInstance.traceInputTable(this.name, className, isRemove)
    }
    handlerDataAfterRunFormulasMinDate(value) {
        this.minDate = value;
    }
    handlerDataAfterRunFormulasMaxDate(value) {
        this.maxDate = value;
    }

}
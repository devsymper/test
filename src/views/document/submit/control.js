import Formulas from "./formulas";
import sDocument from './../../../store/document'
import { markBinedField } from './handlerCheckRunFormulas';
import { SYMPER_APP } from './../../../main.js'
import store from './../../../store'
import { getListInputInDocument } from './../common/common'

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
            this.initFormulas();


        }
        // set các mối quan hệ của các control trường hợp đã được lưu trên server
    setEffectedData(effected) {
        if (effected == "" || effected == null) {
            return;
        }
        try {
            effected = JSON.parse(effected)
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
                }
            }
        } catch (error) {

        }
    }

    /**
     * Khởi tạo các formulas của từng control
     */
    initFormulas() {
        if (Object.keys(this.controlFormulas).length > 0) {
            for (let key in this.controlFormulas) {
                if (this.controlFormulas[key].value != "" && this.controlFormulas[key].value != undefined && Object.values(this.controlFormulas[key].value).length > 0) {
                    let formulas = Object.values(this.controlFormulas[key].value)[0];
                    this.controlFormulas[key]['instance'] = new Formulas(this.curParentInstance, formulas, key);
                    let table = this.controlFormulas[key]['instance'].detectTableRelateLocalFormulas();
                    if (table.length > 0) {
                        console.log('gadkjda', this.name);
                        console.log('gadkjda', table);
                        store.commit("document/addToRelatedLocalFormulas", {
                            key: this.name,
                            value: table,
                            instance: this.curParentInstance
                        });
                    }

                }
            }
        }
        this.checkDBOnly();

    }
    checkDBOnly() {
        if (!this.checkDetailView() &&
            this.controlProperties['isDBOnly'] != undefined &&
            (this.controlProperties['isDBOnly'].value == "1" ||
                this.controlProperties['isDBOnly'].value == true ||
                this.controlProperties['isDBOnly'].value == 1)) {
            let fromTable = (this.inTable == false) ? "document_" + this.docName : "document_child_" + this.docName + "_" + this.inTable;
            let formulas = "ref(SELECT count(" + this.name + ") > 0 AS " + this.name + " from " + fromTable + " where " + this.name + " = '{" + this.name + "}')"
            this.controlFormulas.uniqueDB = new Formulas(this.curParentInstance, formulas, 'uniqueDB');
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

    handlerDataAfterRunFormulasLink(values) {
        if (Array.isArray(values)) {
            values = values[0]
        }
        if (this.inTable != false) {

        }
    }
    handlerDataAfterRunFormulasValidate(values) {
        if (this.inTable != false) {
            let tableControlInstance = getListInputInDocument(this.curParentInstance)[this.inTable];
            let colIndex = tableControlInstance.tableInstance.getColumnIndexFromControlName(this.name);
            for (let index = 0; index < values.length; index++) {
                let row = values[index];
                let v = row == 1
                tableControlInstance.tableInstance.validateValueMap[index + "_" + colIndex] = { vld: v, msg: "" };

            }
            // tableControlInstance.tableInstance.tableInstance.render()

        }
    }
    handlerDataAfterRunFormulasRequire(values) {
        if (this.inTable != false) {
            let tableControlInstance = getListInputInDocument(this.curParentInstance)[this.inTable];
            let colIndex = tableControlInstance.tableInstance.getColumnIndexFromControlName(this.name);
            for (let index = 0; index < values.length; index++) {
                let row = values[index];
                let v = row == 1
                tableControlInstance.tableInstance.validateValueMap[index + "_" + colIndex] = { require: v };
            }
            // tableControlInstance.tableInstance.render()
        }
    }
    handlerDataAfterRunFormulasHidden(values) {
        if (this.inTable != false) {
            let tableControlInstance = getListInputInDocument(this.curParentInstance)[this.inTable];
            let colIndex = tableControlInstance.tableInstance.getColumnIndexFromControlName(this.name);
            for (let index = 0; index < values.length; index++) {
                let row = values[index];
                let v = row == 1
                    // tableControlInstance.tableInstance.validateValueMap[index + "_" + colIndex] = v
            }

        }
    }
    handlerDataAfterRunFormulasReadonly(values) {

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
                this.renderValidateIcon('Dữ liệu đã tồn tại');
            } else {
                this.removeValidateIcon();
            }
        } else {
            let tableControl = getListInputInDocument(this.curParentInstance)[this.inTable];
            let colIndex = tableControl.tableInstance.getColumnIndexFromControlName(this.name);
            let dataAtCol = tableControl.tableInstance.tableInstance.getDataAtCol(colIndex);
            let rowIndex = dataAtCol.indexOf(dataInput[Object.keys(dataInput)[0]][0])
            if (data == 't' || data === true) {
                tableControl.tableInstance.validateValueMap[rowIndex + "_" + colIndex] = { uniqueDB: true, msg: "Dữ liệu đã tồn tại" };

            } else {
                tableControl.tableInstance.validateValueMap[rowIndex + "_" + colIndex] = { uniqueDB: false, msg: "" };
            }
            tableControl.tableInstance.tableInstance.render();

        }


    }
    renderValidateIcon(message) {
        let controlTitle = (this.title == "") ? this.name : this.title;
        let icon = `<span class="mdi mdi-checkbox-blank-circle validate-icon" controlTitle="` + controlTitle + `" title="` + message + `"></span>`
        this.ele.parent().append(icon);
    }
    removeValidateIcon() {
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
                    table.tableInstance.validateValueMap[rowIndex + "_" + colIndex] = { validate: false }
                    let row = dataAtCol[index];
                    if (row == null) {
                        row = "";
                    }
                    if (this.controlProperties.maxValue.value != "") {
                        if (row.length > this.controlProperties.maxValue.value) {
                            table.tableInstance.validateValueMap[index + "_" + colIndex] = { validate: true, msg: 'Độ dài kí tự không được vượt quá ' + this.controlProperties.maxValue.value + " kí tự" };
                            rs = false;
                        }
                    }
                    if (this.controlProperties.minValue.value != "") {
                        if (row.length < this.controlProperties.minValue.value) {
                            table.tableInstance.validateValueMap[index + "_" + colIndex] = { validate: true, msg: 'Độ dài kí tự không được ít hơn ' + this.controlProperties.minValue.value + " kí tự" };
                            rs = false;
                        }
                    }
                }
            } else {
                let value = dataAtCol[rowIndex];
                if (value == null) {
                    value = "";
                }
                table.tableInstance.validateValueMap[rowIndex + "_" + colIndex] = { validate: false }
                if (this.controlProperties.maxValue.value != "") {
                    if (value.length > this.controlProperties.maxValue.value) {
                        table.tableInstance.validateValueMap[rowIndex + "_" + colIndex] = { validate: true, msg: 'Độ dài kí tự không được vượt quá ' + this.controlProperties.maxValue.value + " kí tự" };
                        rs = false;
                    }
                }
                if (this.controlProperties.minValue.value != "") {
                    if (value.length < this.controlProperties.minValue.value) {
                        table.tableInstance.validateValueMap[rowIndex + "_" + colIndex] = { validate: true, msg: 'Độ dài kí tự không được ít hơn ' + this.controlProperties.minValue.value + " kí tự" };
                        rs = false;
                    }
                }
            }
            table.tableInstance.tableInstance.render()
        } else {
            if (this.controlProperties.maxValue.value != "") {
                this.removeValidateIcon()
                if (this.value.length > this.controlProperties.maxValue.value) {
                    this.renderValidateIcon('Độ dài kí tự không được vượt quá ' + this.controlProperties.maxValue.value + " kí tự");
                    rs = false;

                }
            }
            if (this.controlProperties.minValue.value != "") {
                this.removeValidateIcon()
                if (this.value.length < this.controlProperties.minValue.value) {
                    this.renderValidateIcon('Độ dài kí tự không được ít hơn ' + this.controlProperties.minValue.value + " kí tự");
                    rs = false;
                }
            }
        }

        return rs
    }
}
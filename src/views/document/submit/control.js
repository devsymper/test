import Formulas from "./formulas";
import sDocument from './../../../store/document'
import { checkCanBeBind, resetImpactedFieldsList, markBinedField } from './handlerCheckRunFormulas';
import { SYMPER_APP } from './../../../main.js'

let listInputInDocument = sDocument.state.submit.listInputInDocument;

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
        this.effectedControl = [];
        this.effectedHiddenControl = [];
        this.effectedRequireControl = [];
        this.effectedReadonlyControl = [];
        this.effectedLinkControl = [];
        this.effectedValidateControl = [];
        this.inTable = (this.controlProperties.inTable != undefined) ? this.controlProperties.inTable : false;
        this.docName = this.controlProperties.docName;

        /**
         * Tên của control
         */
        this.name = (this.controlProperties.hasOwnProperty('name')) ? this.controlProperties.name.value : "";

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

    /**
     * Khởi tạo các formulas của từng control
     */
    initFormulas() {
        if (Object.keys(this.controlFormulas).length > 0) {
            for (let key in this.controlFormulas) {
                if (this.controlFormulas[key].value != "" && this.controlFormulas[key].value != undefined) {
                    this.controlFormulas[key]['instance'] = new Formulas(this.curParentInstance, this.controlFormulas[key].value, key);
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
            let tableControlInstance = listInputInDocument[this.inTable];
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
            let tableControlInstance = listInputInDocument[this.inTable];
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
            let tableControlInstance = listInputInDocument[this.inTable];
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
            let tableControl = listInputInDocument[this.inTable];

            tableControl.tableInstance.tableInstance.setDataAtRowProp(vls, null, null, AUTO_SET);
            markBinedField(this.name);
            setTimeout(() => {
                let controlEffected = this.getEffectedControl();
                for (let control in controlEffected) {
                    if (listInputInDocument[control].inTable == false)
                        SYMPER_APP.$evtBus.$emit('run-effected-control-when-table-change', listInputInDocument[control])
                }
            }, 100);
        } else {
            if ($('#' + this.id).length > 0) {
                $('#' + this.id).val(values);
                $('#' + this.id).trigger('change')
                markBinedField(this.name);
            }
        }
    }
    handlerDataAfterRunFormulasUniqueDB(data, dataInput) {
        if (this.inTable == false) {
            if (data == 't' || data === true) {
                this.renderValidateIcon('Dữ liệu đã tồn tại');
            } else {
                this.removeRequire();
            }
        } else {
            let tableControl = listInputInDocument[this.inTable];
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
        let icon = `<span class="mdi mdi-checkbox-blank-circle validate-icon" title="` + message + `"></span>`
        this.ele.parent().append(icon);
        this.ele.parent().find('.mdi-checkbox-blank-circle').on('click', function(e) {
            e.msg = message;
            SYMPER_APP.$evtBus.$emit('document-submit-open-validate', e)
        })
    }
    removeRequire() {
        this.ele.parent().find('.validate-icon').remove();
    }
    isEmpty() {
            return this.ele.val() == ""
        }
        // hàm kiểm tra là view detail hay submit
    checkDetailView() {
        if (sDocument.state.viewType == 'detail') {
            return true;
        } else {
            return false;
        }
    }
}
import store from './../../../store/document'
import { SYMPER_APP } from './../../../main.js'
let isDetailView = store.state.submit.isDetailView;
let dataInputCache = store.state.submit.dataInputCache;
const fileTypes = {
    'xlsx': 'file-excel-o',
    'txt': 'file-text-o',
    'csv': 'file-text-o',
    'pdf': 'file-pdf-o',
    'mp3': 'file-audio-o',
    'rar': 'file-archive-o',
    'zip': 'file-archive-o',
    'docx': 'file-word-o',
    'doc': 'file-word-o',
    'pptx': 'file-powerpoint-o',

    'mp4': 'file-video-o',
    'webm': 'file-video-o',
    'flv': 'file-video-o',
    'mov': 'file-video-o',
    'mpg': 'file-video-o',
    'm4v': 'file-video-o',
    '3gv': 'file-video-o',

    'jpg': 'file-image-o',
    'png': 'file-image-o',
    'gif': 'file-image-o',
    'svg': 'file-image-o',

    'js': 'file-code-o',
    'php': 'file-code-o',
    'html': 'file-code-o',
    'py': 'file-code-o',
    'java': 'file-code-o',
    'sql': 'file-code-o',
};
export default class Control {
    constructor(ele, controlProps) {
        /**
         * Gía trị gốc của control, được set bởi BA
         */
        this.controlProperties = controlProps.properties
        this.controlFormulas = controlProps.formulas
            /**
             * jQueryObject tham chiếu tới DOM của control
             */
        this.ele = ele;

    }
    init() {

        /**
         * Tên của control
         */
        this.name = this.controlProperties.name.value;

        /**
         * id của control
         */
        this.id = this.ele.attr('id');

        /**
         * Tên của table chứa control
         */
        this.inTable = '';

        /**
         * Loại control
         */
        this.type = this.ele.attr('s-control-type');

        /**
         * Chứa instance của table, mặc địn là null, control có type là table mới khác null
         */
        this.tableInstance = null;

        /**
         * Danh sách các hàm sẽ thực thi khi kết thúc chuỗi chạy công thức mà bắt đầu từ control này
         */
        this.afterChainFormulaEnd = [];

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

        if (this.type == 'select' && this.fmlData.exeType == 'math') {
            this.fmlData.formula = "'" + this.fmlData.formula + "'";
        }

        /**
         * tên các control nằm trong control này, mặc định là null, nếu control là table thì mới có giá trị là {'tên control':true}
         */
        this.listInsideControls = null;

    }

    getFileExtension(filename) {
        var ext = /^.+\.([^.]+)$/.exec(filename);
        return ext == null ? "" : ext[1];

    }
    render() {
        this.ele.wrap('<span>');
        this.ele.attr('autocomplete', "off");


        if (this.ele.hasClass('s-control-number')) {
            this.ele.css('text-align', 'right');

        } else if (this.ele.hasClass('s-control-table')) {
            this.renderTable();

        } else if (this.ele.hasClass('s-control-hidden') || this.ele.hasClass('s-control-tracking-value')) {
            this.ele.css('display', 'none');

        } else if (this.ele.hasClass('s-control-filter')) {
            this.ele.parent().append('<span class="s-control-filter-button" style="cursor: pointer;"> <img src="/view/themes/icon/filter.png" width="10px;"> </span>')

        } else if (this.ele.hasClass('s-control-panel')) {
            // presetPanel(this.ele);

        } else if (this.ele.hasClass('s-control-report')) {
            this.ele.removeClass('on-property');
            // getReportTemplate(this.ele, {}, thisObj.name);

        } else if (this.ele.hasClass('s-control-time')) {
            this.ele.attr('type', 'text');

        } else if (this.ele.hasClass('s-control-persent')) {
            this.ele.css('min-width', 'unset');

        } else if (this.ele.hasClass('s-control-date')) {
            this.renderDateControl();

        } else if (this.ele.hasClass('s-control-datetime')) {
            this.renderDateTimeControl();
        } else if (this.ele.hasClass('s-control-file-upload')) {
            // thisObj.renderFileControl();
        }
    }
    renderDateTimeControl() {
        if (isDetailView) return;
        this.ele.attr('autocomplete', "off");
        this.ele.attr('type', 'text');
        this.ele.on('focus', function() {

        })
    }
    renderDateControl() {
        if (isDetailView) return;
        this.ele.attr('autocomplete', "off");
        this.ele.attr('type', 'text');
        this.ele.addClass('mdi mdi-car-arrow-left')
        this.ele.on('click', function(e) {
            SYMPER_APP.$evtBus.$emit('document-submit-autocomplete-input', e)
            $(this).addClass('autocompleting')
        })
        let thisCpn = this.ele
        this.ele.on('keyup', function(e) {
            SYMPER_APP.$evtBus.$emit('document-submit-autocomplete-input-change', e)
        })
    }
    renderTable() {
        this.tableInstance.render();
    }
    getDefaultValue() {
        if (this.isCheckbox) {
            return false;
        } else if (this.isNumber || this.isPersent) {
            return 0;
        } else {
            return '';
        }
    }
    inputCacheSet(value, rowId = null, rawUserFormula = '') {
        let fieldName = this.name;
        value = this.standardlizeValue(value);

        if (!this.inTable) {
            dataInputCache[fieldName] = value;
            rawFormulaUserInput[fieldName] = rawUserFormula;
        } else {
            if (!(dataInputCache.hasOwnProperty(fieldName))) {
                dataInputCache[fieldName] = [];
            }
            dataInputCache[fieldName][rowId] = value;
            if (!rawFormulaUserInput.hasOwnProperty(fieldName)) {
                rawFormulaUserInput[fieldName] = [];
            }
            rawFormulaUserInput[fieldName][rowId] = rawUserFormula;
        }
    }
    standardlizeValue(value, rowId = null) {
        if ((!value || value === NaN) && (this.type == 'number' || this.type == 'persent')) {
            value = 0;
        } else if (this.type == 'date' && /((0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/[12]\d{3})/.test(value)) {
            value = value.split('/');
            value = value[2] + '-' + value[1] + '-' + value[0];
        } else if (this.type == 'checkbox' && typeof value != 'boolean') {
            value = false;
        } else if (this.type == 'select') {
            if (typeof value == 'object' || ((value == this.fmlData.formula || "'" + value + "'" == this.fmlData.formula) && value.includes('|'))) {
                value = this.inputCacheGet(rowId);
            }
        }
        return value;
    }

    /**
     * Lấy giá trị cho control này từ cache
     *  @param {string|null} rowId  rowId là null trong 2 tường hợp: ngoài bảng hoặc bindData cho toàn bộ các dòng trong một cột của table
     *  @param {Boolean} rawFormula  true|false để lấy ra công thức tính toán mà user điền
     *  @return {*} giá trị của control này tương ứng với rowId
     */
    inputCacheGet(rowId, rawFormula = false) {
        fieldName = thisObj.name;
        let vl = '';
        if (dataInputCache.hasOwnProperty(fieldName)) {
            if (thisObj.inTable != '') {
                if (rawFormula && rawFormulaUserInput.hasOwnProperty(fieldName)) {
                    vl = rawFormulaUserInput[fieldName][rowId];
                }
                if (!rawFormula || vl === '' || vl === undefined) {
                    vl = dataInputCache[fieldName][rowId];
                }
            } else {
                if (rawFormula) {
                    // Biến rawFormulaUserInput lấy từ bên file new_submit.js
                    vl = rawFormulaUserInput[fieldName];
                }
                if (!rawFormula || vl === '' || vl === undefined) {
                    vl = dataInputCache[fieldName];
                }
            }
        }

        if (!vl) {
            if (thisObj.type == 'number' || thisObj.type == 'persent') {
                return 0;
            } else {
                return '';
            }
        }
        if (typeof vl != 'boolean' && thisObj.type == 'checkbox') {
            vl = false;
        }
        return vl;
    }

}
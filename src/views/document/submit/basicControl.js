import Control from "./control";
import store from './../../../store/document'
import { SYMPER_APP } from './../../../main.js'

import Util from './util'
let isDetailView = store.state.submit.isDetailView;
let dataInputCache = store.state.submit.dataInputCache;
const fileTypes = {
    'xlsx': 'mdi-microsoft-excel',
    'txt': 'file-text-o',
    'csv': 'file-text-o',
    'pdf': 'file-pdf-o',
    'mp3': 'file-audio-o',
    'rar': 'file-archive-o',
    'zip': 'file-archive-o',
    'docx': 'mdi-file-word-outline',
    'doc': 'mdi-file-word-outline',
    'pptx': 'mdi-microsoft-powerpoint',

    'mp4': 'file-video-o',
    'webm': 'file-video-o',
    'flv': 'file-video-o',
    'mov': 'file-video-o',
    'mpg': 'file-video-o',
    'm4v': 'file-video-o',
    '3gv': 'file-video-o',

    'jpg': 'mdi-file-image',
    'png': 'mdi-file-image',
    'gif': 'mdi-file-image',
    'svg': 'mdi-file-image',

    'js': 'file-code-o',
    'php': 'file-code-o',
    'html': 'file-code-o',
    'py': 'file-code-o',
    'java': 'file-code-o',
    'sql': 'file-code-o',
};

export default class BasicControl extends Control {
    constructor(idField, ele, controlProps, curParentInstance) {
        super(idField, ele, controlProps, curParentInstance);
    }

    render() {
        if (this.controlFormulas['require'] != undefined && this.controlFormulas.require.formulasId != 0) {
            this.renderValidateIcon();
        }

        if (this.controlFormulas.hasOwnProperty('autocomplete') && this.controlFormulas.autocomplete.instance != undefined) {
            this.addAutoCompleteEvent();
        }
        let thisCpn = this;
        this.ele.wrap('<span style="position:relative;">');
        this.ele.attr('key-instance', this.curParentInstance);
        this.ele.on('change', function(e) {
            SYMPER_APP.$evtBus.$emit('document-submit-input-change', { controlName: thisCpn.controlProperties.name.value, val: $(e.target).val() })
        })
        if (this.ele.hasClass('s-control-number')) {
            this.ele.css('text-align', 'right');

        } else if (this.ele.hasClass('s-control-table')) {

        } else if (this.ele.hasClass('s-control-hidden') || this.ele.hasClass('s-control-tracking-value')) {
            this.ele.css('display', 'none');

        } else if (this.ele.hasClass('s-control-filter')) {
            this.renderFilterControl();

        } else if (this.ele.hasClass('s-control-panel')) {
            // presetPanel(this.ele);

        } else if (this.ele.hasClass('s-control-report')) {
            this.ele.removeClass('on-property');
            // getReportTemplate(this.ele, {}, thisObj.name);

        } else if (this.ele.hasClass('s-control-time')) {
            this.ele.attr('type', 'text');
            this.renderTimeControl();

        } else if (this.ele.hasClass('s-control-percent')) {
            this.ele.css('min-width', 'unset');

        } else if (this.ele.hasClass('s-control-date')) {
            this.renderDateControl();

        } else if (this.ele.hasClass('s-control-datetime')) {
            this.renderDateTimeControl();
        } else if (this.ele.hasClass('s-control-file-upload')) {
            this.renderFileControl();

        } else if (this.ele.hasClass('s-control-user')) {
            this.renderUserControl();

        } else if (this.ele.hasClass('s-control-select')) {
            this.renderSelectControl();
        }
    }
    renderFileControl = function(rowId) {
        let fileHtml = this.genFileView(rowId);
        this.ele.css('width', 'unset').css('cursor', 'pointer').css('height', '25px').html(fileHtml);
        let thisCpn = this;
        $('.file-add').click(function(e) {
            let el = $(e);
            $("#file-upload-alter").attr('data-rowid', el.attr('data-rowid')).attr('data-ctrlname', el.attr('data-ctrlname'));
            $("#file-upload-alter-" + thisCpn.curParentInstance).click();
            $("#file-upload-alter-" + thisCpn.curParentInstance).attr('data-control-name', $(this).attr('data-control-name'))
        })
    }

    genFileView = function(rowId = null) {
        let ctrlName = this.name;
        let addTpl = '';
        if (!isDetailView) {
            addTpl = `
                <div data-control-name="${ctrlName}" class="file-add" title="Thêm file" data-rowid="${rowId}" data-ctrlname="${ctrlName}">
                    <span class="text-show"><span class="mdi mdi-plus"></span></span>
                </div>
            `;
        }

        if (!this.inTable) {
            return `<div class="upload-file-wrapper-outtb">${addTpl}</div>`;
        }
        if (this.value != '' && this.value.length > 0) {
            for (let index = 0; index < this.value.length; index++) {
                const element = this.value[index];
                let type = Util.getFileExtension(element);
                let icon = this.fileTypes[type];
                let file = `<div onclick="window.open('/file-download');" class="file-item">
                                <span onclick="parent.deleteValueInFileCtrl(event)"  title="xóa" class="remove-file"><span class="mdi mdi-close"></span></span>
                                <i class="mdi ` + icon + ` file-view" ></i>
                            </div>`
                addTpl += file;
            }
        }
        return addTpl.replace(/\n/g, '');
    }

    addFile(item) {
        let type = Util.getFileExtension(item);

        let icon = fileTypes[type];
        let file = `<div title="${item}" class="file-item">
                        <span onclick="this.parentNode.remove()"  title="xóa" class="remove-file"><span class="mdi mdi-close"></span></span>
                        <i class="mdi ` + icon + ` file-view" ></i>
                    </div>`
        this.ele.find('.upload-file-wrapper-outtb').append(file)
    }


    renderFilterControl() {
        if (isDetailView) return;
        this.ele.attr('type', 'text');
        this.ele.on('click', function(e) {
            SYMPER_APP.$evtBus.$emit('document-submit-filter-input-click', e)
        })

    }
    renderUserControl() {
        if (isDetailView) return;
        this.ele.attr('type', 'text');
        this.ele.on('click', function(e) {
            SYMPER_APP.$evtBus.$emit('document-submit-user-select-input', e)
        })
        this.ele.on('keyup', function(e) {
            SYMPER_APP.$evtBus.$emit('document-submit-user-input-change', e)
        })

    }
    renderSelectControl() {
        let id = this.ele.attr('id');
        let keyinstance = this.ele.attr('key-instance');
        this.ele.replaceWith('<input class="s-control s-control-select" s-control-type="select" type="text" title="Select" id="' + id + '" key-instance="' + keyinstance + '">');
        this.ele = $('#' + id);

        this.addAutoCompleteEvent(true);
    }


    renderDateTimeControl() {
        if (isDetailView) return;
        this.ele.attr('type', 'text');

    }
    renderDateControl() {
        if (isDetailView) return;
        this.ele.attr('type', 'text');
        this.ele.on('click', function(e) {
            $(e.target).addClass('date-picker-access');
            SYMPER_APP.$evtBus.$emit('document-submit-date-input-click', e)
        })
    }
    renderTimeControl() {
        if (isDetailView) return;
        this.ele.attr('type', 'text');
        this.ele.on('click', function(e) {
            SYMPER_APP.$evtBus.$emit('document-submit-time-input-click', e)
        })
    }
    getDefaultValue() {
        if (this.isCheckbox) {
            return false;
        } else if (this.isNumber || this.isPercent) {
            return 0;
        } else {
            return '';
        }
    }
    addAutoCompleteEvent(fromSelect = false) {
        let thisCpn = this;
        this.ele.on('input', function(e) {
            $(this).addClass('autocompleting');
            SYMPER_APP.$evtBus.$emit('document-submit-autocomplete-input', e)
        })
        this.ele.on('keyup', function(e) {
            console.log(e);

            let formulasInstance = (fromSelect) ? thisCpn.controlFormulas.formulas.instance : thisCpn.controlFormulas.autocomplete.instance;
            SYMPER_APP.$evtBus.$emit('document-submit-autocomplete-input-change', { e: e, autocompleteFormulasInstance: formulasInstance })
        })
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
        if ((!value || value === NaN) && (this.type == 'number' || this.type == 'percent')) {
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
            if (thisObj.type == 'number' || thisObj.type == 'percent') {
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
    renderValidateIcon() {
        let icon = `<span class="mdi mdi-checkbox-blank-circle validate-icon"></span>`
        this.ele.parent().append(icon);
        $('.mdi-checkbox-blank-circle').on('click', function(e) {
            SYMPER_APP.$evtBus.$emit('document-submit-open-validate', e)
        })
    }

}
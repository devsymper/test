import Control from "./control";
import store from './../../../store'
import sDocument from './../../../store/document'
import { SYMPER_APP } from './../../../main.js'
import Formulas from './formulas'
import Util from './util'
import { documentApi } from "./../../../api/Document.js";
let listInputInDocument = sDocument.state.submit.listInputInDocument;

let dataInputCache = sDocument.state.submit.dataInputCache;
const fileTypes = {
    'xlsx': 'mdi-microsoft-excel',
    'txt': 'mdi-file-document-outline',
    'csv': 'mdi-file-document-outline',
    'pdf': 'mdi-file-pdf-outline',
    'mp3': 'mdi-radio',
    'rar': 'mdi-folder-zip-outline',
    'zip': 'mdi-folder-zip-outline',
    'docx': 'mdi-file-word-outline',
    'doc': 'mdi-file-word-outline',
    'pptx': 'mdi-microsoft-powerpoint',

    'mp4': 'mdi-file-video-outline',
    'webm': 'mdi-file-video-outline',
    'flv': 'mdi-file-video-outline',
    'mov': 'mdi-file-video-outline',
    'mpg': 'mdi-file-video-outline',
    'm4v': 'mdi-file-video-outline',
    '3gv': 'mdi-file-video-outline',

    'jpg': 'mdi-file-image',
    png: 'mdi-file-image',
    'gif': 'mdi-file-image',
    'svg': 'mdi-file-image',

    'js': 'mdi-file-code-outline',
    'php': 'mdi-file-code-outline',
    'html': 'mdi-file-code-outline',
    'py': 'mdi-file-code-outline',
    'java': 'mdi-file-code-outline',
    'sql': 'mdi-file-code-outline',
};

export default class BasicControl extends Control {
    constructor(idField, ele, controlProps, curParentInstance, value) {
        super(idField, ele, controlProps, curParentInstance, value);
    }


    render() {
        let thisCpn = this;
        this.ele.wrap('<span style="position:relative;display:inline-block;">');
        this.ele.attr('key-instance', this.curParentInstance);

        if (this.checkDetailView() &&
            this.controlProperties['isSaveToDB'] != undefined &&
            (this.controlProperties['isSaveToDB'].value != "1" ||
                this.controlProperties['isSaveToDB'].value != 1)) {
            this.ele.css({ display: 'none' })
        }
        if (!this.checkDetailView() && this.value == "" &&
            this.controlProperties['isRequired'] != undefined &&
            (this.controlProperties['isRequired'].value == "1" ||
                this.controlProperties['isRequired'].value == 1)) {
            this.renderValidateIcon();
        }
        if (!this.checkDetailView() &&
            this.controlProperties['isReadOnly'] != undefined &&
            (this.controlProperties['isReadOnly'].value == "1" ||
                this.controlProperties['isReadOnly'].value == 1)) {
            this.ele.attr('disabled', 'disabled')
        }

        if (this.controlProperties['isHidden'] != undefined &&
            (this.controlProperties['isHidden'].value == "1" ||
                this.controlProperties['isHidden'].value == 1)) {
            this.ele.css({ 'display': 'none' })
        }

        if (this.controlFormulas.hasOwnProperty('autocomplete') && this.controlFormulas.autocomplete.instance != undefined) {
            this.addAutoCompleteEvent();
        }
        this.ele.on('change', function(e) {
            SYMPER_APP.$evtBus.$emit('document-submit-input-change', { controlName: thisCpn.controlProperties.name.value, val: $(e.target).val() })
        })
        if (this.ele.hasClass('s-control-number')) {
            this.ele.css('text-align', 'right');
            this.ele.attr('type', 'text');

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
            this.ele.attr('type', 'text');
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
        } else if (this.ele.hasClass('s-control-label')) {
            this.renderLabelControl();
        }
        this.ele.val(this.value)
        if (this.checkDetailView()) {
            this.ele.addClass('detail-view')
            this.ele.attr('disabled', 'disabled')
        }
    }
    renderFileControl = function() {
        let fileHtml = this.genFileView();
        this.ele.css('width', 'unset').css('cursor', 'pointer').css('height', '25px').css('vertical-align', 'middle').html(fileHtml);
        console.log('ssafas', fileHtml);

        let thisCpn = this;
        $('.file-add').click(function(e) {
            $("#file-upload-alter-" + thisCpn.curParentInstance).click();
            $("#file-upload-alter-" + thisCpn.curParentInstance).attr('data-control-name', $(this).attr('data-control-name'))
        })
    }

    genFileView = function(rowId = null) {
        let ctrlName = this.name;
        let addTpl = '';

        if (!this.checkDetailView()) {
            addTpl = `
                    <div data-control-name="${ctrlName}" class="file-add" title="Thêm file" data-rowid="${rowId}" data-ctrlname="${ctrlName}">
                        <span class="text-show"><span class="mdi mdi-plus"></span></span>
                    </div>
                `;
        }

        if (!this.inTable) {
            if (this.value != '' && this.value.length > 0) {
                let valueArr = this.value.replace(/^,/gi, "");
                valueArr = valueArr.split(',');
                console.log('sads', valueArr);

                for (let index = 0; index < valueArr.length; index++) {

                    let element = valueArr[index];
                    let fileExt = Util.getFileExtension(element);
                    let icon = fileTypes[fileExt];
                    let file = `<div title="${element}" class="file-item">
                            <i  onclick="window.open('https://sdocument-management.symper.vn/file/public/` + element + `');" class="mdi ` + icon + ` file-view" ></i>
                        </div>`
                    addTpl += file;
                }
            }
            return `<div class="upload-file-wrapper-outtb">${addTpl}</div>`;
        }
        let deleteFileIcon = '';
        if (this.checkDetailView()) {
            this.value = sDocument.state.editor.allControl[listInputInDocument[this.inTable].id].value[this.name];
        } else {
            deleteFileIcon = '<span  data-file-name="` + fileName + `" title="xóa" class="remove-file"><span class="mdi mdi-close"></span></span>';
        }
        if (this.value != '' && this.value.hasOwnProperty(rowId)) {
            let fileName = this.value[rowId];
            let fileExt = Util.getFileExtension(fileName);
            let icon = fileTypes[fileExt];
            let file = `<div  class="file-item">
                            ` + deleteFileIcon + `
                            <i onclick="window.open('https://sdocument-management.symper.vn/file/public` + fileName + `');" class="mdi ` + icon + ` file-view" ></i>
                        </div>`
            addTpl += file;

        }
        return addTpl.replace(/\n/g, '');
    }

    addFile(item, rowId = "") {
        let type = Util.getFileExtension(item.name);
        let form = new FormData();
        form.append('file', item);
        let icon = fileTypes[type];
        let thisObj = this;
        $.ajax({
            url: 'https://sdocument-management.symper.vn/uploadFile',
            dataType: 'json',
            processData: false,
            contentType: false,
            data: form,
            type: 'post',
            success: function(response) {
                if (response.status == 200) {
                    let file = `<div title="${response.data.name}" class="file-item">
                            <span data-file-name="` + response.data.name + `" title="xóa" class="remove-file"><span class="mdi mdi-close"></span></span>
                            <i  onclick="window.open('https://sdocument-management.symper.vn/file/` + response.data.path + `');" class="mdi ` + icon + ` file-view" ></i>
                        </div>`
                    thisObj.setDeleteFileEvent(thisObj.ele, thisObj.name)
                    thisObj.ele.find('.upload-file-wrapper-outtb').append(file);
                    let curValue = listInputInDocument[thisObj.name].value;
                    let tableName = thisObj.inTable;
                    if (tableName != false) {
                        if (!Array.isArray(curValue)) {
                            curValue = [];
                        }
                        curValue[rowId] = response.data.name
                    } else {
                        curValue += "," + response.data.name;
                        this.value = curValue;
                    }
                    store.commit("document/updateListInputInDocument", {
                        controlName: thisObj.name,
                        key: 'value',
                        value: curValue
                    });
                    if (tableName != false) {
                        listInputInDocument[tableName].tableInstance.tableInstance.render();
                    }

                }
            }
        });
    }
    setDeleteFileEvent(ele, controlName) {
        let value = listInputInDocument[controlName].value;
        ele.off('click', '.remove-file')
        ele.on('click', '.remove-file', function(e) {
            e.preventDefault();
            e.stopPropagation();
            let fileName = $(this).attr('data-file-name');
            let newValue = value.replace(/^,/gi, "");
            newValue = newValue.replace(fileName, "");
            $(this).closest('.file-item').remove();
            store.commit("document/updateListInputInDocument", {
                controlName: controlName,
                key: 'value',
                value: newValue
            });
        })
    }

    renderFilterControl() {
        if (this.checkDetailView()) return;
        let thisCpn = this;
        this.ele.attr('type', 'text');
        this.ele.on('click', function(e) {
            e.controlName = thisCpn.name;
            SYMPER_APP.$evtBus.$emit('document-submit-filter-input-click', e)
        })

    }
    renderUserControl() {
        if (this.checkDetailView()) return;
        this.ele.attr('type', 'text');
        this.ele.parent().css({ display: 'block' })
        this.ele.on('keyup', function(e) {
            SYMPER_APP.$evtBus.$emit('document-submit-user-input-change', e)
        })

    }
    renderLabelControl() {
        let id = this.ele.attr('id');
        let thisCpn = this;
        let keyinstance = this.ele.attr('key-instance');
        this.ele.replaceWith('<input class="s-control s-control-label" s-control-type="label" type="text" disabled title="Label" id="' + id + '" placeholder="Aa" key-instance="' + keyinstance + '">');
        this.ele = $('#' + id);
        this.ele.on('change', function(e) {
            SYMPER_APP.$evtBus.$emit('document-submit-input-change', { controlName: thisCpn.controlProperties.name.value, val: $(e.target).val() })
        })
    }
    renderSelectControl() {
        let id = this.ele.attr('id');
        let keyinstance = this.ele.attr('key-instance');
        this.ele.replaceWith('<input class="s-control s-control-select" s-control-type="select" type="text" title="Select" readonly="readonly" id="' + id + '" key-instance="' + keyinstance + '">');
        this.ele = $('#' + id);
        let thisCpn = this;
        this.ele.on('click', function(e) {
            /**
             * TH control select ở ngoài table
             * reset biến chỉ ra là đang tương tác với table và cell nào
             */
            store.commit("document/addToDocumentSubmitStore", {
                key: 'currentCellSelected',
                value: null
            });
            store.commit("document/addToDocumentSubmitStore", {
                key: 'currentTableInteractive',
                value: null
            });
            $(this).addClass('autocompleting');
            let formulasInstance = thisCpn.controlFormulas.formulas.instance;
            SYMPER_APP.$evtBus.$emit('document-submit-select-input', { e: e, selectFormulasInstance: formulasInstance, alias: thisCpn.name, controlTitle: thisCpn.title })
        })
        this.ele.on('change', function(e) {
            SYMPER_APP.$evtBus.$emit('document-submit-input-change', { controlName: thisCpn.controlProperties.name.value, val: $(e.target).val() })
        })

    }


    renderDateTimeControl() {
        if (this.checkDetailView()) return;
        this.ele.attr('type', 'text');

    }
    renderDateControl() {
        this.ele.attr('type', 'text');
        if (this.checkDetailView()) return;
        this.ele.on('click', function(e) {
            $(e.target).addClass('date-picker-access');
            SYMPER_APP.$evtBus.$emit('document-submit-date-input-click', e)
        })
    }
    renderTimeControl() {
        let thisCpn = this;
        if (this.checkDetailView()) return;
        this.ele.attr('type', 'text');
        this.ele.on('click', function(e) {
            e.controlName = thisCpn.name;
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

            store.commit("document/addToDocumentSubmitStore", {
                key: 'currentCellSelected',
                value: null
            });
            store.commit("document/addToDocumentSubmitStore", {
                key: 'currentTableInteractive',
                value: null
            });
            let event = e;
            event['controlName'] = thisCpn.name;
            SYMPER_APP.$evtBus.$emit('document-submit-autocomplete-input', event)
        })
        this.ele.on('keyup', function(e) {
            let formulasInstance = (fromSelect) ? thisCpn.controlFormulas.formulas.instance : thisCpn.controlFormulas.autocomplete.instance;
            SYMPER_APP.$evtBus.$emit('document-submit-autocomplete-key-event', { e: e, autocompleteFormulasInstance: formulasInstance, isSelect: false, controlTitle: thisCpn.title })
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


    // hàm kiểm tra control này có thuộc tính require hay không
    isRequiredControl() {
        if (this.controlProperties['isRequired'] != undefined &&
            (this.controlProperties['isRequired'].value == "1" ||
                this.controlProperties['isRequired'].value == 1)) {
            return true;
        }
        return false;
    }
    renderLinkToControl(link) {
        let icon = `<span class="mdi mdi-information link-icon" title="` + link + `"></span>`
        this.ele.parent().append(icon);
        this.ele.parent().find('.link-icon').on('click', function(e) {
            window.open(link);
        })
    }
}
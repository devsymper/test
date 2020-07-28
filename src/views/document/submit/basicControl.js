import Control from "./control";
import store from './../../../store'
import sDocument from './../../../store/document'
import { SYMPER_APP } from './../../../main.js'
import Util from './util'
var numbro = require("numbro");
import moment from "moment-timezone";

import { userApi } from "./../../../api/user.js";
let listInputInDocument = sDocument.state.submit.listInputInDocument;
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
        let thisObj = this;
        this.ele.wrap('<span style="position:relative;display:inline-block;">');
        this.ele.attr('key-instance', this.curParentInstance);
        if (!this.checkDetailView()) {
            this.ele.css({ color: 'blue' })
        }
        // if (this.checkDetailView() &&
        //     this.controlProperties['isSaveToDB'] !== undefined &&
        //     (this.controlProperties['isSaveToDB'].value !== "1" ||
        //         this.controlProperties['isSaveToDB'].value !== 1)) {
        //     this.ele.css({ display: 'none' })
        // }
        if (!this.checkDetailView() && this.value === "" &&
            this.controlProperties['isRequired'] !== undefined &&
            (this.controlProperties['isRequired'].value === "1" ||
                this.controlProperties['isRequired'].value === 1)) {
            this.renderValidateIcon("Không được bỏ trống trường thông tin " + this.title);
        }
        if (!this.checkDetailView() &&
            this.controlProperties['isReadOnly'] != undefined &&
            (this.controlProperties['isReadOnly'].value === "1" ||
                this.controlProperties['isReadOnly'].value === 1)) {
            this.ele.attr('disabled', 'disabled')
        }

        if (this.controlProperties['isHidden'] != undefined &&
            (this.controlProperties['isHidden'].value === "1" ||
                this.controlProperties['isHidden'].value === 1)) {
            this.ele.css({ 'display': 'none' })
        }

        if (this.ele.hasClass('s-control-number')) {

            this.renderNumberControl();

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
            this.renderPercentControl()

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

        if (this.checkDetailView()) {
            this.ele.addClass('detail-view');
            this.ele.attr('disabled', 'disabled');
        }
        if (sDocument.state.viewType[this.curParentInstance] != 'submit') {
            this.setValueControl();
        }
        this.setEvent();

    }
    checkAutoCompleteControl() {
        if (this.controlFormulas.hasOwnProperty('autocomplete') && this.controlFormulas.autocomplete.instance != undefined) {
            return true;
        }
        return false;
    }
    setEvent() {

        let thisObj = this;
        this.ele.on('change', function(e) {
            let valueChange = $(e.target).val();
            if (thisObj.type == 'label') {
                valueChange = $(e.target).text()
            }
            SYMPER_APP.$evtBus.$emit('document-submit-input-change', { controlName: thisObj.controlProperties.name.value, val: valueChange })
            if (thisObj.type == 'date') {
                if (this.formatDate != "" && typeof this.formatDate === 'string') {
                    thisObj.value = $(this).val();
                    $(this).val(moment($(this).val()).format(thisObj.formatDate))
                }
            }
        })
        this.ele.on('keyup', function(e) {
            if (thisObj.type == 'user') {
                SYMPER_APP.$evtBus.$emit('document-submit-user-input-change', e)
            }
            if (thisObj.checkAutoCompleteControl()) {
                let fromSelect = false;
                let formulasInstance = (fromSelect) ? thisObj.controlFormulas.formulas.instance : thisObj.controlFormulas.autocomplete.instance;
                $(this).addClass('autocompleting')
                e['controlName'] = thisObj.controlProperties.name.value;
                SYMPER_APP.$evtBus.$emit('document-submit-autocomplete-key-event', {
                    e: e,
                    autocompleteFormulasInstance: formulasInstance,
                    isSelect: false,
                    controlTitle: thisObj.title,
                    controlName: thisObj.controlProperties.name.value,
                    val: $(e.target).val()
                })
            }

        })
        this.ele.on('click', function(e) {
            store.commit("document/addToDocumentSubmitStore", {
                key: 'currentCellSelected',
                value: null,
                instance: thisObj.curParentInstance
            });
            store.commit("document/addToDocumentSubmitStore", {
                key: 'currentTableInteractive',
                value: null,
                instance: thisObj.curParentInstance
            });
            e.controlName = thisObj.name;
            if (thisObj.type == 'date') {
                SYMPER_APP.$evtBus.$emit('document-submit-date-input-click', e)
            } else if (thisObj.type == 'inputFilter') {
                e.formulas = thisObj.controlFormulas.formulas;
                SYMPER_APP.$evtBus.$emit('document-submit-filter-input-click', e)
            }
        })


    }

    setValue(value) {
        this.value = value;
        if (this.inTable === false) {
            if (this.type == 'label') {
                $('#' + this.id).text(value);
            } else if (this.type == 'date') {
                $('#' + this.id).val(moment(value).format(this.formatDate));
            } else if (this.type == 'number') {
                if (typeof value == 'number')
                    $('#' + this.id).val(numbro(value).format(this.numberFormat))
            } else {
                $('#' + this.id).val(value);
            }

        }

    }

    setValueControl() {
        let value = this.value
        if (this.type == 'percent') {
            value *= 100
        } else if (this.type == 'number') {
            if (typeof value == 'number')
                value = numbro(value).format(this.numberFormat)

        } else if (this.type == 'date') {
            value = moment(value).format(this.formatDate);
        }
        if (this.type == 'label') {
            this.ele.text(value)
        } else {
            this.ele.val(value)
        }
    }
    renderFileControl = function() {
        let fileHtml = this.genFileView();
        this.ele.css('width', 'unset').css('cursor', 'pointer').css('height', '25px').css('vertical-align', 'middle').html(fileHtml);

        let thisObj = this;
        $('.file-add').click(function(e) {
            $("#file-upload-alter-" + thisObj.curParentInstance).click();
            $("#file-upload-alter-" + thisObj.curParentInstance).attr('data-control-name', $(this).attr('data-control-name'))
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
        }
        if (this.value != '' && this.value.hasOwnProperty(rowId)) {
            for (let index = 0; index < this.value[rowId].length; index++) {
                let fileName = this.value[rowId][index];
                let fileExt = Util.getFileExtension(fileName);
                let icon = fileTypes[fileExt];
                if (!this.checkDetailView()) {
                    deleteFileIcon = `<span data-rowid="` + rowId + `" data-file-name="` + fileName + `" title="xóa" class="remove-file"><span class="mdi mdi-close"></span></span>`;

                }
                let file = `<div  class="file-item">
                                ` + deleteFileIcon + `
                                <i onclick="window.open('https://sdocument-management.symper.vn/file/public` + fileName + `');" class="mdi ` + icon + ` file-view" ></i>
                            </div>`
                addTpl += file;
            }


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
                    let file = `<div title="${response.data.path}" class="file-item">
                                <span data-file-name="${response.data.path}" title="xóa" class="remove-file"><span class="mdi mdi-close"></span></span>
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
                        if (!curValue.hasOwnProperty(rowId)) {
                            curValue[rowId] = []
                        }
                        curValue[rowId].push(response.data.name);
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
            let rowId = $(this).attr('data-rowid');
            e.preventDefault();
            e.stopPropagation();
            let fileName = $(this).attr('data-file-name');
            let newValue = "";
            // nếu trong table
            if (rowId != "" && rowId != undefined) {
                listInputInDocument[controlName].value.splice(value.indexOf(fileName), 1);
                newValue = listInputInDocument[controlName].value;
                $(this).closest('.file-item').remove();
            } else {
                newValue = value.replace(/^,/gi, "");
                newValue = newValue.replace(fileName, "");
                $(this).closest('.file-item').remove();
            }
            store.commit("document/updateListInputInDocument", {
                controlName: controlName,
                key: 'value',
                value: newValue
            });
        })
    }
    renderNumberControl() {
        let thisObj = this;
        this.ele.css('text-align', 'right');
        this.ele.attr('type', 'text');
        this.numberFormat = (this.controlProperties.hasOwnProperty('formatNumber')) ? this.controlProperties.formatNumber.value : "";
        this.ele.on('blur', function(e) {
            $(this).val(numbro($(this).val()).format(thisObj.numberFormat))
        })
        this.ele.on('focus', function(e) {
            $(this).val(numbro($(this).val()).format('0'))
        })
    }

    renderFilterControl() {
        if (this.checkDetailView()) return;
        let thisObj = this;
        this.ele.attr('type', 'text');
        this.ele.on('click', function(e) {

        })

    }
    renderUserControl() {
        if (this.checkDetailView()) {
            let thisObj = this;
            userApi.getDetailUser(this.value).then(res => {
                thisObj.value = res.data.user.displayName;
                thisObj.ele.val(thisObj.value)
            }).always({}).catch({})

        } else {
            this.ele.attr('type', 'text');
            this.ele.parent().css({ display: 'block' })

        }
    }
    renderLabelControl() {
        let id = this.ele.attr('id');
        let thisObj = this;
        let keyinstance = this.ele.attr('key-instance');
        // this.ele.parent().css({ 'width': '60%' });
        // this.ele.replaceWith('<input class="s-control s-control-label" s-control-type="label" type="text" disabled title="Label" id="' + id + '" style="width:100%;border:none;" key-instance="' + keyinstance + '">');
        this.ele = $('#' + id);
        this.ele.text('').css({ border: 'none' })
    }
    renderSelectControl() {
        let id = this.ele.attr('id');
        let keyinstance = this.ele.attr('key-instance');
        this.ele.replaceWith('<input class="s-control s-control-select" s-control-type="select" type="text" title="Select" readonly="readonly" id="' + id + '" key-instance="' + keyinstance + '">');
        this.ele = $('#' + id);
        let thisObj = this;
        this.ele.on('click', function(e) {
            /**
             * TH control select ở ngoài table
             * reset biến chỉ ra là đang tương tác với table và cell nào
             */
            store.commit("document/addToDocumentSubmitStore", {
                key: 'currentCellSelected',
                value: null,
                instance: thisObj.curParentInstance
            });
            store.commit("document/addToDocumentSubmitStore", {
                key: 'currentTableInteractive',
                value: null,
                instance: thisObj.curParentInstance
            });
            $(this).addClass('autocompleting');
            let formulasInstance = thisObj.controlFormulas.formulas.instance;
            SYMPER_APP.$evtBus.$emit('document-submit-select-input', { e: e, selectFormulasInstance: formulasInstance, alias: thisObj.name, controlTitle: thisObj.title })
        })
        this.ele.on('change', function(e) {
            SYMPER_APP.$evtBus.$emit('document-submit-input-change', { controlName: thisObj.controlProperties.name.value, val: $(e.target).val() })
        })

    }

    renderPercentControl() {
        this.ele.attr('type', 'number');
        this.ele.css({ 'text-align': 'right' });
        let icon = `<span class="percent-icon">%</span>`
        this.ele.parent().append(icon);
    }
    renderDateTimeControl() {
        if (this.checkDetailView()) return;
        this.ele.attr('type', 'text');

    }
    renderDateControl() {
        this.ele.attr('type', 'text');
        this.formatDate = (this.controlProperties.hasOwnProperty('formatDate')) ? this.controlProperties.formatDate.value : "";
        if (this.checkDetailView()) return;
    }
    renderTimeControl() {
        let thisObj = this;
        if (this.checkDetailView()) return;
        this.ele.attr('type', 'text');
        this.ele.on('click', function(e) {
            e.controlName = thisObj.name;
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
        let thisObj = this;
        this.ele.on('input', function(e) {

        })
        this.ele.on('keyup', function(e) {

        })

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
import Control from "./control";
import store from './../../../store'
import sDocument from './../../../store/document'
import { SYMPER_APP } from './../../../main.js'
import Util from './util'
var numbro = require("numbro");
import { appConfigs } from "@/configs.js";
import tinymce from 'tinymce/tinymce';
import { documentApi } from "../../../api/Document";
import { str } from "../../../plugins/utilModules/str";
import PerfectScrollbar from "perfect-scrollbar";
import { fileManagementApi } from "@/api/FileManagement";

import 'tinymce/plugins/media';
import 'tinymce/plugins/quickbars';
let fileTypes = {
    'xlsx': 'mdi-microsoft-excel',
    'txt': 'mdi-file-document-outline',
    'xd': 'mdi-monitor-dashboard',
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
    'png': 'mdi-file-image',
    'gif': 'mdi-file-image',
    'svg': 'mdi-file-image',
    'jfif': 'mdi-file-image',

    'js': 'mdi-file-code-outline',
    'php': 'mdi-file-code-outline',
    'html': 'mdi-file-code-outline',
    'py': 'mdi-file-code-outline',
    'java': 'mdi-file-code-outline',
    'sql': 'mdi-file-code-outline',
};

export default class BasicControl extends Control {
    constructor(idField, ele, controlProps, keyInstance, value) {
        super(idField, ele, controlProps, keyInstance, value);
        this.minValue = (this.controlProperties.hasOwnProperty('minValue')) ? this.controlProperties.minValue.value : false;
        this.maxValue = (this.controlProperties.hasOwnProperty('maxValue')) ? this.controlProperties.maxValue.value : false;
        this.colIndex = -1;
    }


    render() {
            this.ele.wrap('<span style="position:relative;display:inline-block">');
            this.ele.attr('key-instance', this.keyInstance);
            if (!this.checkDetailView() && this.value === "" && this.checkProps('isRequired')) {
                this.renderValidateIcon("Không được bỏ trống trường thông tin " + this.title, 'Require');
            }
            if (!this.checkDetailView() && this.checkProps('isReadOnly')) {
                this.ele.attr('disabled', 'disabled');
                this.ele.css({ background: 'rgba(0,0,0,0.05)' })
            }
            if (this.controlProperties['isHidden'] != undefined && this.checkProps('isHidden')) {
                this.ele.css({ 'display': 'none' })
            }

            if (this.ele.hasClass('s-control-number')) {
                this.formulaValue = "";
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
            } else if (this.ele.hasClass('s-control-checkbox')) {
                this.renderCheckboxControl();

            } else if (this.ele.hasClass('s-control-select')) {
                this.renderSelectControl();
            } else if (this.ele.hasClass('s-control-combobox')) {
                this.renderSelectControl(false);
            } else if (this.ele.hasClass('s-control-label')) {
                this.renderLabelControl();
            } else if (this.ele.hasClass('s-control-rich-text')) {
                this.renderRichTextControl();
            }


            if(this.checkEmptyFormulas('autocomplete')){
                this.inputValue = null;
            }
            if (this.checkDetailView()) {
                // this.ele.addClass('detail-view');
                this.ele.attr('disabled', 'disabled');
            }
            if (this.checkViewType('submit')) {
                this.setDefaultValue()
            }
            else if(this.checkViewType('print')){
                this.setPrintValueControl();
            }
            else{
                this.setValueControl();
            }
            this.setEvent();
            if (this.checkProps('isQuickSubmit') && this.checkEmptyFormulas('autocomplete') && this.controlFormulas.autocomplete.instance) {
                let allTable = this.controlFormulas.autocomplete.instance.detectTableQuery();
                let columnBinding = this.controlFormulas.autocomplete.instance.autocompleteDetectAliasControl(false);
                this.columnBindingSubForm = columnBinding;
                if (allTable !== false) {
                    let table = allTable[0];
                    documentApi.getDetailDocumentByName({ name: table }).then(res => {
                            if (res.status == 200) {
                                let documentId = res.data.id;
                                this.renderSubformButton(documentId);
                            }

                        }).catch(err => {

                        })
                        .finally(() => {});
                }
            }

        }
        /**
         * Ham kiểm tra có các thông tin khác của control như  (comment, history, link) trên control hay không
         * nếu có thì thêm icon info
         */
    checkHasInfoControl(dataLink) {
            if (dataLink && Object.keys(dataLink).includes(this.name)) {
                this.renderInfoIconToControl(this.name);
            }
        }
        /**
         * Trường hợp có điền vào giá trị defaul trong editor thì gọi hàm này để set giá trị
         */
    setDefaultValue() {
        if (this.controlProperties['defaultValue'] != undefined) {
            if (typeof this.controlProperties['defaultValue'].value == 'object') {
                return;
            }
            this.value = this.controlProperties['defaultValue'].value;
            this.setValueControl();
        }
    }

    getWidth(){
        if(this.controlProperties['width'] && this.controlProperties['width'].value){
            return this.controlProperties['width'].value;
        }
        else{
            return 100;
        }
    }


    /**
     * sử dụng cho trường hợp control nằm trong bảng
     * Hàm chỉ ra control nằm ở vị trí cột nào trong bảng
     * @param {*} index 
     */
    setColIndexInTable(index) {
        this.colIndex = index
    }

    /**
     * Hàm kiểm tra control có công thức autocomplete hay không
     */
    checkAutoCompleteControl() {
        if (this.controlFormulas.hasOwnProperty('autocomplete') && this.controlFormulas.autocomplete.instance != undefined) {
            return true;
        }
        return false;
    }
    triggerOnChange() {
        this.ele.trigger('change');
    }
    unFocusInput(){
        this.ele.blur();
    }
    setEvent() {
            let thisObj = this;
            this.ele.on('change', function(e) {
                let valueChange = $(e.target).val();
                if(thisObj.checkAutoCompleteControl()){
                    return false;
                }
                if (thisObj.type == 'label') {
                    valueChange = $(e.target).text();
                } else if (thisObj.type == 'checkbox') {
                    valueChange = $(e.target).prop("checked");
                } else if(thisObj.type == 'user'){
                    return false;
                }else if(thisObj.type == 'number'){
                    valueChange = valueChange.replace(/=/g,"");
                    valueChange = eval(valueChange);
                    if(!/^[-0-9,.]+$/.test(valueChange)){
                        return false;
                    }
                }else if(thisObj.type == 'date'){
                    valueChange = this.$moment(valueChange,'DD-MM-YYYY').format('YYYY-MM-DD');
                }else if(thisObj.type == 'time'){
                    if(!Util.checkTimeValid(valueChange)){
                        thisObj.renderValidateIcon("Không đúng định dạng thời gian", 'TimeValid')
                        return false
                    }
                    else{
                        thisObj.removeValidateIcon('TimeValid')
                    }
                }
                // sau khi thay đổi giá trị input thì kiểm tra require control nếu có
                thisObj.checkRequire();
                thisObj.value = valueChange;
                SYMPER_APP.$evtBus.$emit('document-submit-input-change', thisObj);
            })
            this.ele.on('focus', function(e) {
                store.commit("document/addToDocumentSubmitStore", {
                    key: 'rootChangeFieldName',
                    value: thisObj.name,
                    instance: thisObj.keyInstance
                });
            })
            if(thisObj.checkAutoCompleteControl()){
                this.isRunChange = true ;
                this.ele.on('blur', function(e) {
                    setTimeout(() => {
                        console.log(thisObj.isRunChange,'isRunChange');
                        if(!thisObj.isRunChange){
                            let valueChange = $(e.target).val();
                            thisObj.valueChange = valueChange;
                            SYMPER_APP.$evtBus.$emit('document-submit-input-change', thisObj);
                            thisObj.isRunChange = true;
                        }
                    }, 300);
                });
            }
            this.ele.on('keyup', function(e) {
                if (e.key == 'F2' && store.state.app.baInfo && store.state.app.baInfo.id) {
                    if (thisObj.type == 'number' && thisObj.formulaValue) {
                        thisObj.ele.val(thisObj.formulaValue);
                    }
                    thisObj.traceControl();
                }
                if (thisObj.checkAutoCompleteControl()) {
                    thisObj.isRunChange = false;
                    if(e.keyCode == 13){
                        thisObj.isRunChange = true;
                    }
                    let fromSelect = false;
                    let formulasInstance = (fromSelect) ? thisObj.controlFormulas.formulas.instance : thisObj.controlFormulas.autocomplete.instance;
                    e['controlName'] = thisObj.controlProperties.name.value;
                    SYMPER_APP.$evtBus.$emit('document-submit-autocomplete-key-event', {
                        e: e,
                        autocompleteFormulasInstance: formulasInstance,
                        isSelect: false,
                        controlTitle: thisObj.title,
                        controlName: thisObj.name,
                        val: $(e.target).val()
                    })
                }

            })
            this.ele.on('click', function(e) {
                store.commit("document/addToDocumentSubmitStore", {
                    key: 'docStatus',
                    value: 'input',
                    instance: thisObj.keyInstance
                });
                e.controlName = thisObj.name;
                e.control = thisObj;
                if (['date','dateTime'].includes(thisObj.type)) {
                    SYMPER_APP.$evtBus.$emit('document-submit-date-input-click', e)
                } else if (thisObj.type == 'inputFilter') {
                    e.formulas = thisObj.controlFormulas.list;
                    SYMPER_APP.$evtBus.$emit('document-submit-filter-input-click', e)
                } else if (thisObj.type == 'time') {
                    e.curTarget = e.target
                    SYMPER_APP.$evtBus.$emit('document-submit-show-time-picker', e)
                } else if (thisObj.type == 'image') {
                    SYMPER_APP.$evtBus.$emit('document-submit-image-click', { e: e, controlIns: thisObj })
                }

            });


        }
        /**
         * Hàm tracking xem control lấy dữ liệu từ đâu và ảnh hướng đến control nào
         * nguồn: control màu xanh lá  cây
         * đich: control màu xanh nước biển
         */
    traceControl() {
        SYMPER_APP.$evtBus.$emit('document-submit-show-trace-control', { control: this })
    }

    checkRequire(){
        if(this.isRequiredControl()){
            if(this.isEmpty()){
                this.renderValidateIcon('Không được bỏ trống trường thông tin '+this.name, 'Require')
            }
            else{
                this.removeValidateIcon('Require')
            }
        }
    }
    setValue(value) {
        if (this.type == 'fileUpload') {
            if(!this.value){
                this.value = [];
            }
            this.value.push(value);
            this.setFileControlValue(value);
        }
        else{
            if(value && value.inputDislay && value.inputValue){
                this.value = value.inputValue;
                this.inputValue = value.inputValue;
            }
            else{
                this.value = value;
                this.inputValue = value;
            }
            if (this.inTable === false) {
                if (this.type == 'label') {
                    this.ele.text(value);
                } else if (this.type == 'richText') {
                    this.ele.val(value);
                }
                else if (this.type == 'dateTime') {
                    this.ele.val(value);
                } else if (this.type == 'date') {
                    this.ele.val(SYMPER_APP.$moment(value).format(this.formatDate));
                    this.value = SYMPER_APP.$moment(value).format('YYYY-MM-DD');
                } else if (this.type == 'checkbox') {
                    if (value)
                        this.ele.attr('checked', 'checked');
                    else {
                        this.ele.removeAttr('checked');
                    }
                } else if (this.type == 'number') {
                    let v = parseInt(value);
                    if (!isNaN(v))
                        this.ele.val(numbro(value).format(this.numberFormat));
                    else {
                        this.ele.val("");
                    }
                }
                else if (this.type == 'image') {
                    this.setImageControlValue(value)
                }        
                else {
                    if(value && value.inputValue){
                        this.ele.val(value.inputDislay);
                    }
                    else{
                        this.ele.val(value);
                    }
                }
            }
            if (sDocument.state.submit[this.keyInstance].docStatus == 'init') {
                this.defaultValue = value;
            }
            console.log(this.value,'this.value');
        }
    }
    getValue() {
        return this.value;
    }

    setValueControl() {
        let value = this.value;
        if (!value) {
            value = "";
        } else if (this.type == 'number') {
            if (!isNaN(Number(value)))
                value = numbro(Number(value)).format(this.numberFormat)

        } else if (this.type == 'date') {
            value = SYMPER_APP.$moment(value).format(this.formatDate);
        }
        if (this.type == 'label') {
            this.ele.text(value)
        } else if (this.type == 'richText') {
            this.ele.val(value);
        }
        else if (this.type == 'dateTime') {
            this.ele.val(value);
        } else if (this.type == 'image') {
            this.setImageControlValue(value)
        }
        else if (this.type == 'fileUpload') {
           
            this.setFileControlValue(value, true)
        }
        else if(this.type == 'user'){
            let listUser = store.state.app.allUsers;
            if (this.value != null && this.value != "" && !isNaN(this.value)) {
                let user = listUser.filter(u => {
                    return u.id == this.value
                });
                if (user[0]) {
                    this.ele.val(user[0].displayName)
                }
            }
        }
        else {
            this.ele.val(value)
        }
        this.ele.attr('value', value);
        if (sDocument.state.submit[this.keyInstance].docStatus == 'init') {
            this.defaultValue = value;
        }
    }
    getAutocompleteKeyValue(){
        return this.controlProperties.itemValue.value
    }
    setImageControlValue(value){
        this.ele.empty();
        let w = this.controlProperties.width.value;
        let h = this.controlProperties.height.value;
        if (!w) {
            w = 'auto';
        }
        if (!h) {
            h = '70';
        }
        let image = '<img height="' + h + '" width="' + w + '" src="' + value + '">';
        this.ele.append(image);
    }
    setFileControlValue(fileData, isMultiple = false){
        let thisObj = this;
        let fileEl = ""
        if(isMultiple){
            try {
                fileData = JSON.parse(fileData);
                this.value = fileData
                store.commit("document/updateListInputInDocument", {
                    controlName: this.name,
                    key: 'value',
                    value: this.value,
                    instance: this.keyInstance
                });
                for (let index = 0; index < fileData.length; index++) {
                    let fileItem = fileData[index];
                    fileEl += this.genFileElItem(fileItem);
                }
            } catch (error) {
                console.warn(error,'loi control file');
            }
        }
        else{
            fileEl = this.genFileElItem(fileData);
        }
        if(!fileEl && this.checkDetailView()){
            this.ele.css({border:'none'})
        }
        this.ele.find('.upload-file-wrapper-outtb .list-file').append(fileEl);
        if(!this.checkDetailView()) {
            this.ele.off('click', '.remove-file')
            this.ele.on('click', '.remove-file', function(e) {
                let item = $(this).attr('data-item');
                let index = thisObj.value.indexOf(item);
                thisObj.value.splice(index,1);
                e.preventDefault();
                e.stopPropagation();
                $(this).closest('.file-item').remove()
                store.commit("document/updateListInputInDocument", {
                    controlName: thisObj.name,
                    key: 'value',
                    value: thisObj.value,
                    instance: thisObj.keyInstance
                });
            })
        }
        
    }
    setPrintValueControl(vl = undefined) {
        let value = vl;
        if (vl == undefined) {
            value = this.value;
        }
        if (!value) {
            value = "";
        } else if (this.type == 'number') {
            if (!isNaN(Number(value)))
                value = numbro(Number(value)).format(this.numberFormat)

        } else if (this.type == 'date') {
            value = SYMPER_APP.$moment(value).format(this.formatDate);
        }
        else if (this.type == 'dateTime') {
            this.ele.val(value);
        }
       
        if (this.type == 'image') {
            this.ele.empty();
            let w = this.controlProperties.width.value;
            let h = this.controlProperties.height.value;
            if (!w) {
                w = 'auto';
            }
            if (!h) {
                h = '70';
            }
            let image = '<img height="' + h + '" width="' + w + '" src="' + value + '">';
            this.ele.append(image);
        }
        else{
            let currentStyle = this.ele.attr('style');
            this.ele.replaceWith('<div  class="s-control s-control-text" contenteditable="false" style="'+currentStyle+';background:none;padding: 5px 5px !important;">'+value+'</div>');
        }
        
        
    }
    formatNumberValue(data) {
        let value = data;
        let formatPt = this.getNumberFormat();
        if (!isNaN(Number(value)) && formatPt)
            value = numbro(Number(value)).format(formatPt);
        return value;
    }

    /**
     * Hàm append thêm button + vào sau input trường hợp control có đánh dấu là có sub form submit
     */
    renderSubformButton(subFormId) {
        if (this.inTable == false) {
            let thisObj = this;
            this.ele.parent().append('<span class="mdi mdi-plus add-subform-btn"></span>');
            this.ele.parent().off('click', '.add-subform-btn')
            this.ele.parent().on('click', '.add-subform-btn', function(e) {
                store.commit("document/addToDocumentSubmitStore", {
                    key: 'controlOpenSubform',
                    value: thisObj,
                    instance: thisObj.keyInstance
                });
                SYMPER_APP.$evtBus.$emit('document-submit-open-subform', { docId: subFormId, instance: thisObj.keyInstance })
            })
        } else {

        }
    }

    renderFileControl = function() {
        let fileHtml = this.genFileView();
        this.ele.html(fileHtml);
        let thisObj = this;
        const agBodyHorizontalViewport = $(this.ele).find('.upload-file-wrapper-outtb .list-file')[0];
        if (agBodyHorizontalViewport) {
            const ps = new PerfectScrollbar(agBodyHorizontalViewport);
            ps.update();
        }
        this.ele.find('.file-add').click(function(e) {
            SYMPER_APP.$evtBus.$emit('document-submit-add-file-click', { control: thisObj });
        })
        this.ele.on('click','.list-file',function(e){
            if($(e.target).is('.file-item') || ($(e.target).is('.file-item__name') && !$(e.target).attr('contenteditable'))){
                let link = $(e.target).attr('path');
                window.open(link)
            }
            else if($(e.target).is('.file-item__edit')){
                e.preventDefault();
                e.stopPropagation();
                $(e.target).closest('.file-item').find('.file-item__name').attr('contenteditable',true);
                $(e.target).closest('.file-item').find('.file-item__name').focus();
            }
            else if($(e.target).is('.file-item__remove')){
                e.preventDefault();
                e.stopPropagation();
                let fileId = $(e.target).closest('.file-item').attr('file-id');
                let fileItem = thisObj.value.find(el => el.id == fileId);
                thisObj.value.splice(thisObj.value.indexOf(fileItem),1);
                $(e.target).closest('.file-item').remove();
            }
        });
        this.ele.on('keydown','.list-file',function(e){
            if($(e.target).is('.file-item__name') && e.keyCode == 13){
                $(e.target).attr('contenteditable',false);
                let fileId = $(e.target).closest('.file-item').attr('file-id');
                fileManagementApi.renameFile(fileId,$(e.target).text());
                return false
            }
        })

    }
    genFileElItem(fileData){
        let icon = (fileTypes[fileData.type]) ? fileTypes[fileData.type] : fileTypes['txt'];
        let elAction = 
        `
            <div class="file-item__action">
                <span class="file-item__edit mdi mdi-lead-pencil"></span>
                <span class="file-item__remove mdi mdi-trash-can-outline"></span>
            </div>
        `;
        if(this.checkDetailView()){
            elAction = ""
        }
        let file = `
                <div class="file-item" file-id="`+fileData.id+`" path="`+fileData.serverPath+`">
                    <span class="mdi ` + icon + ` " style="font-size: 14px;"></span>
                    <div class="file-item__name">`+fileData.name+`</div>
                    `+elAction+`
                    <span class="file-item__size">`+str.getFileSize(fileData.size)+`</span>
                    
                </div>
            `
        return file;
    }

    genBtnAddFile(rowId = null){
        return `
            <div class="file-add" title="Thêm file" data-rowid="${rowId}">
                <div class="wrap-button-upload">
                    <span class="mdi mdi-cloud-upload" style="color:blue;font-size: 30px;"></span>
                </div>
                <div style="margin-bottom: 4px;">
                    <span>Choose File</span>
                </div>
            </div>
        `;
    }
    genFileView = function(rowId = null) {
        let addTpl = '';
        if (!this.checkDetailView()) {
            addTpl = this.genBtnAddFile();
        }
        let templateListFile = `<div class="list-file"></div>`
        if (!this.inTable) {
            return `<div class="upload-file-wrapper-outtb">${addTpl + templateListFile}</div>`;
        }
        return addTpl.replace(/\n/g, '');
    }

    getNumberFormat() {
        return (this.controlProperties.hasOwnProperty('formatNumber')) ? this.controlProperties.formatNumber.value : "";
    }
    renderNumberControl() {
        let thisObj = this;
        this.ele.css('text-align', 'right');
        this.ele.attr('type', 'text');
        this.numberFormat = this.getNumberFormat();
        this.ele.on('blur', function(e) {
            if ($(this).hasClass('trace-current-control')) {
                return;
            }
            let currentInputValue = $(this).val();
            if (currentInputValue == "") {
                thisObj.ele.removeClass('error');
                thisObj.ele.removeAttr('valid');
            } else {
                if (/^=/.test(currentInputValue)) {
                    thisObj.formulaValue = currentInputValue;
                    currentInputValue = currentInputValue.replace(/=/g, "");
                    thisObj.ele.removeClass('error')
                    thisObj.ele.removeAttr('valid');
                    if (thisObj.numberFormat) {
                        $(this).val(numbro(eval(currentInputValue)).format(thisObj.numberFormat));
                    } else {
                        $(this).val(eval(currentInputValue));
                    }
                } else if (/[-0-9,.]*[0-9]$/.test(currentInputValue)) {
                    thisObj.ele.removeClass('error')
                    thisObj.ele.removeAttr('valid');
                    if (thisObj.numberFormat) {
                        $(this).val(numbro(currentInputValue).format(thisObj.numberFormat))
                    } else {
                        if (/,|\.$/.test(currentInputValue)) {
                            thisObj.ele.addClass('error');
                            let controlTitle = (thisObj.title == "") ? thisObj.name : thisObj.title;
                            let valid = "Giá trị trường " + controlTitle + " không đúng định dạng số"
                            thisObj.ele.attr('valid', valid);
                        }
                    }
                } else {
                    thisObj.ele.addClass('error');
                    let controlTitle = (thisObj.title == "") ? thisObj.name : thisObj.title;
                    let valid = "Giá trị trường " + controlTitle + " phải là số"
                    thisObj.ele.attr('valid', valid);
                }

            }
        })
        this.ele.on('focus', function(e) {
            if (/^[-0-9,.]+$/.test($(this).val())) {
                $(this).val(numbro($(this).val()).format())
            }
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
        this.ele.attr('type', 'text');
        this.ele.parent().css({ display: 'block' })
    }
    renderLabelControl() {
        this.ele.text('').css({ border: 'none' })
    }
    renderCheckboxControl() {
        this.ele.parent().css({ 'vertical-align': 'middle' })
    }
    renderSelectControl(isReadOnly = true) {
        let thisObj = this;
        this.ele.attr('readonly', isReadOnly)
        this.ele.on('click', function(e) {
            if (!thisObj.controlFormulas.list) {
                return;
            }
            let formulasInstance = thisObj.controlFormulas.list.instance;
            let isSingleSelect = false;
            if (thisObj.type == 'combobox') {
                isSingleSelect = thisObj.checkProps('isSingleSelect');
            }
            SYMPER_APP.$evtBus.$emit('document-submit-select-input', { 
                e: e, 
                selectFormulasInstance: formulasInstance, 
                alias: thisObj.name, 
                controlTitle: thisObj.title, 
                controlName:thisObj.name,
                type: thisObj.type, 
                isSingleSelect: isSingleSelect })
        });
    }

    renderPercentControl() {
        this.ele.attr('type', 'number');
        this.ele.css({ 'text-align': 'right' });
        let icon = `<span class="percent-icon">%</span>`
        this.ele.parent().append(icon);
    }
    renderDateTimeControl() {
        this.ele.attr('type', 'text');
        if (this.checkDetailView()) return;

    }
    renderDateControl() {
        this.ele.attr('type', 'text');
        this.formatDate = (this.controlProperties.hasOwnProperty('formatDate')) ? this.controlProperties.formatDate.value : "";
        this.minDate = "";
        this.maxDate = "";
        if (this.checkDetailView()) return;
    }
    renderTimeControl() {
        if (this.checkDetailView()) return;
        this.ele.attr('type', 'text');

    }
    renderRichTextControl() {
        debugger
        let isReadOnly = 1;
        this.editor = '';
        let selector = '';
        let self = this;
        let toolbar = 'undo redo | styleselect | lineheightselect | quickimage | lineheight | fontselect | fontsizeselect | bold italic | alignleft aligncenter alignright alignjustify | emoticons |outdent indent | link image | code';
        if(this.checkViewType('submit') || this.checkViewType('update')){ 
            this.ele = $('#sym-submit-'+this.keyInstance).find("#"+this.id);
            isReadOnly = 0;
            selector = '#sym-submit-'+this.keyInstance+" #"+this.id;
        }
        else{
            this.ele = $('#sym-Detail-'+this.keyInstance).find("#"+this.id);
            selector = '#sym-Detail-'+this.keyInstance+" #"+this.id;
            toolbar = false;
        }
        tinymce.remove();
        if(this.controlProperties.isShowHeaderTinyMce.value){
            tinymce.init({
                toolbar: toolbar,
                menubar: false,
                branding: false,
                readonly: isReadOnly,
                content_style: "p{ font-family: Roboto; font-size: 13px,color:black; line-height:0;}",
                quickbars_selection_toolbar: 'quickimage media| emoticons | table',
                quickbars_insert_toolbar: 'quicktable image media codesample',
                plugins: ['quickbars','lineheight','media','image'],
                lineheight_formats: "0pt 1pt 2pt 3pt 4pt 5pt 6pt 7pt 8pt 9pt 10pt 11pt 12pt 14pt 16pt 18pt 20pt 22pt 24pt 26pt 36pt",
                selector:  selector,
                statusbar: false,
                init_instance_callback : function(editor) {
                    self.editor = editor;
                    self.initEditor();
                },
                onchange_callback :function(data) {
                    self.changeData(data);
                },
            });    
         }
    }
    initEditor(){
        return this.editor.setContent(this.value);
    }
    changeData(content){
        this.value =content;
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

    // hàm kiểm tra control này có thuộc tính require hay không
    isRequiredControl() {
        if (this.controlProperties['isRequired'] != undefined &&
            (this.controlProperties['isRequired'].value == "1" ||
                this.controlProperties['isRequired'].value == 1)) {
            return true;
        }
        return false;
    }
    renderInfoIconToControl(controlName) {
            if (this.ele.parent().find('.info-control-btn').length == 0) {

                // let icon = `<span class="mdi mdi-information info-control-btn" data-control="` + controlName + `"></span>`
                this.ele.addClass("info-control-btn");
                this.ele.attr('data-control', controlName)
                    //  this.ele.parent().append(icon);
            }
        }
        /**
         * Hàm chuyển định dạng date sang dạng sql hiểu được
         */
    convertDateToStandard(data) {
        let dateFormat = this.controlProperties.formatDate.value;
        if (!dateFormat) {
            return data;
        }
        if (!data) {
            return "";
        }
        if (typeof data == 'object') {
            let newData = [];
            for (let index = 0; index < data.length; index++) {
                let value = data[index];
                if(value){
                    if(SYMPER_APP.$moment(data, 'YYYY-MM-DD', true).isValid()){
                        newData.push(data);
                    }
                    else{
                        newData.push(SYMPER_APP.$moment(value,dateFormat).format('YYYY-MM-DD'))
                    }
                }
                else{
                    newData.push("");
                }

            }
            return newData;
        }
        else{
            if(SYMPER_APP.$moment(data, 'YYYY-MM-DD', true).isValid()){
                return data;
            }
            return SYMPER_APP.$moment(data,dateFormat).format('YYYY-MM-DD')
        }
    }
     /**
     * Hàm chuyển định dạng time sang dạng sql hiểu được HH:mm:ss
     */
    convertTimeToStandard(data){
        if(!data){
            return "";
        }
        if(typeof data == 'object'){
            let newData = [];
            for (let index = 0; index < data.length; index++) {
                let value = data[index];
                if(value){
                    newData.push(SYMPER_APP.$moment(value,'hh:mm A').format('HH:mm:ss'))
                }
                else{
                    newData.push("");
                }
                
            }
            return newData;
        }
        else{
            return SYMPER_APP.$moment(data,'hh:mm A').format('HH:mm:ss')
        }
    }
}
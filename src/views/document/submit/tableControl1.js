import Control from "./control";
import sDocument from './../../../store/document'
import {
    SYMPER_APP
} from './../../../main.js'
import SymperTable from "./table1";
import { getControlInstanceFromStore } from "../common/common";
window.switchTableMode = function(el) {
    // let tableName = $(el).attr('table-name');
    // let viewType = $(el).attr('view-type');
    // let thisListItem = null;
    // if (viewType == 'detail') {
    //     thisListItem = util.getClosestVueInstanceFromDom(el, 'detailDocument');
    // } else if (viewType == 'submit') {
    //     thisListItem = util.getClosestVueInstanceFromDom(el, 'submitDocument');
    // }
    // if (thisListItem) {
    //     thisListItem.$evtBus.$emit('on-switch-pivot-table-mode', { tableName: tableName })
    // }
}
window.traceTable = function(el) {
    SYMPER_APP.$evtBus.$emit('document-submit-show-trace-control', { isTable: true, tableName: $(el).attr('table-name') })
}
window.wrapTable = function(el) {
    let tableName = $(el).attr('table-name');
    let keyInstance = $(el).attr('instance');
    let tableControl = getControlInstanceFromStore(keyInstance,tableName);
    // tableControl.tableInstance.refreshTable(true)
}
export default class TableControl1 extends Control {
    constructor(idField, ele, controlProps, keyInstance,pivotConfig= {},groupConfig = {}, isPrintView = false) {
        super(idField, ele, controlProps, keyInstance);
         /**
         * Chứa instance của table, mặc địn là null, control có type là table mới khác null
         */
        this.pivotConfig = pivotConfig;
        this.groupConfig = groupConfig;
        this.tableInstance = null;
        this.tablePrint = null;
        this.isPrintView = isPrintView;
        /**
         * tên các control nằm trong control này, mặc định là null, nếu control là table thì mới có giá trị là {'tên control':true}
         */
        this.controlInTable = {};
        this.tableMode = this.controlProperties.tableView.value;
        this.formulasWorker = null
        this.init();
        this.ele.wrap('<span style="position:relative;display: block;" class="wrap-table">');
    }
    renderTable() {
        this.tableInstance = new SymperTable(this, this.keyInstance, this.groupConfig, this.pivotConfig, this.formulasWorker);
        let viewType = sDocument.state.viewType[this.keyInstance];
        // this.ele.parent().append('<span onclick="wrapTable(this)" table-name="' + this.name + '" instance="' + this.keyInstance + '" class="mdi mdi-format-text-wrapping-wrap  icon-options icon-wrap-table"></span>');
        if ((viewType == 'submit' || viewType == "update")) {
            this.ele.parent().append('<span onclick="traceTable(this)" table-name="' + this.name + '" instance="' + this.keyInstance + '" class="mdi mdi-information-outline icon-options icon-trace-table"></span>');
        }
        if (this.isPrintView) {
            this.ele.attr('table-id', this.ele.attr('id'));
            this.ele.removeAttr('id');
            this.ele.find('table').addClass('table-print');
            this.ele.find('table tbody').empty();
        } else {
            this.tableInstance.render();
            if (this.controlProperties['isHidden'] != undefined && this.checkProps('isHidden')) {
                this.ele.closest('.wrap-table').css({ 'display': 'none' })
            }
            this.ele.detach().hide();
        }
    }
    setFormulasWorker(worker){
        this.formulasWorker = worker;
    }
    /**
     * Hàm set data cho handson table, cho trường hợp viewdetail đã có data
     * @param {*} data 
     */
    setData(data) {
        if (Object.keys(data).length == 0) {
            return;
        }
        if (data.hasOwnProperty('childObjectId') && Object.keys(data).length == 1) {
            if (this.tableInstance.tableInstance) {
                this.tableInstance.tableInstance.updateSettings({
                    data: [
                        []
                    ]
                })
                this.tableInstance.tableInstance.render();
            }
        }
        if (this.isPrintView) {
            let dataTablePrint = [];
            for (let controlName in this.controlInTable) {
                let dataControl = data[controlName];
                let controlIns = this.controlInTable[controlName];
                for (let index = 0; index < dataControl.length; index++) {
                    if (dataTablePrint.length <= index) {
                        dataTablePrint.push([])
                    }
                    let row = dataControl[index];
                    if (controlIns.type == 'number') {
                        row = controlIns.formatNumberValue(row);
                    }
                    dataTablePrint[index].push(row);
                }
            }

            let bodyHtml = ''
            for (let index = 0; index < dataTablePrint.length; index++) {
                const rowData = dataTablePrint[index];
                let tr = '<tr>'
                for (let j = 0; j < rowData.length; j++) {
                    let cellData = rowData[j];
                    if (cellData == null || cellData == undefined) {
                        cellData = ""
                    }
                    tr += '<td>' + cellData + '</td>';
                }
                tr += '</tr>';
                bodyHtml += tr;
            }
            this.ele.find('table tbody').append(bodyHtml);
            this.ele.find('table').attr('contenteditable', 'false');
        } else {
            let dataTable = [];
            let rowLength = data[Object.keys(data)[0]].length;
            for (let index = 0; index < rowLength; index++) {
                let rowData = {};
                for (let i = 0; i < Object.keys(data).length; i++) {
                    let key = Object.keys(data)[i];
                    rowData[key] = data[key][index];
                }
                dataTable.push(rowData)

            }
            this.tableInstance.setData(dataTable);
            if (this.currentDataStore.docStatus == 'init') {
                this.defaultValue = data;
            }
        }
    }
    isInsertRow(){
        return this.controlProperties.isInsertRow.value
    }
    isWrapText(){
        return this.controlProperties.tableWrapText.value
    }
    getPrimaryKey(){
        let primaryKey = this.controlProperties.tablePrimaryKey.value;
        if(typeof primaryKey == 'object'){
            return false;
        }
        return this.controlProperties.tablePrimaryKey.value
    }
    getAllControlKeyCache(){
        let listControlKeyCache = [];
        for (let controlName in this.controlInTable) {
            let controlIns = this.controlInTable[controlName];
            if(controlIns.isKeyCacheInTable()){
                listControlKeyCache.push(controlIns.name);
            }
        }
        return listControlKeyCache;
    }
}
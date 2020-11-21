import Control from "./control";
import { util } from "@/plugins/util.js";
import moment from "moment-timezone";
import sDocument from './../../../store/document'
import {
    SYMPER_APP
} from './../../../main.js'
window.switchTableMode = function(el){
    let tableName = $(el).attr('table-name');
    let viewType = $(el).attr('view-type');
    let thisListItem = null;
    if(viewType == 'detail'){
        thisListItem = util.getClosestVueInstanceFromDom(el,'detailDocument');
    }
    else if(viewType == 'submit'){
        thisListItem = util.getClosestVueInstanceFromDom(el,'submitDocument');
    }
    if(thisListItem){
        thisListItem.$evtBus.$emit('on-switch-pivot-table-mode',{tableName:tableName})
    }
}
export default class TableControl extends Control {
    constructor(idField, ele, controlProps, curParentInstance) {
        super(idField, ele, controlProps, curParentInstance);
    }
    initTableControl(isPrintView = false) {

        this.init();
        /**
         * Chứa instance của table, mặc địn là null, control có type là table mới khác null
         */
        this.tableInstance = null;
        this.tablePrint = null;
        this.pivotTable = null;
        this.isPrintView = isPrintView;
        /**
         * tên các control nằm trong control này, mặc định là null, nếu control là table thì mới có giá trị là {'tên control':true}
         */
        this.listInsideControls = null;
        this.controlInTable = {};
        this.mapControlToIndex = {};
        this.tableMode = 'nomal';
        this.ele.wrap('<span style="position:relative;display: block;" class="wrap-table">');
       

    }
    renderInfoButtonInRow(linkControl) {
        if (linkControl) {
            let allControlHasLink = Object.keys(linkControl);
            for (let index = 0; index < allControlHasLink.length; index++) {
                let controlLink = allControlHasLink[index];
                if (Object.keys(this.listInsideControls).includes(controlLink)) {
                    let listLinkInCol = linkControl[controlLink];
                    let curColIndex = this.tableInstance.colName2Idx[controlLink];
                    for (let key in listLinkInCol) {
                        let rowIdx = key.replace(/linkConfig_(.+)_/g, "");
                        rowIdx = Number(rowIdx)
                        this.tableInstance.validateValueMap[rowIdx + "_" + curColIndex] = {
                            type: 'linkControl',
                        };
                    }
                }
            }
        }
    }
    renderTable() {
        let viewType = sDocument.state.viewType[this.curParentInstance];
        if (this.isPrintView) {
            // this.ele.attr('table-id', this.ele.attr('id'));
            // this.ele.removeAttr('id');
            // this.ele.find('table').addClass('table-print');
            // this.ele.find('table tbody').empty();
            // this.tablePrint.render();
            this.pivotTable.render();
        } else {
            this.tableInstance.render();
            if(this.pivotTable){
                this.pivotTable.render();
                let switchTableButton = $(`<button onclick="switchTableMode(this)" view-type="`+viewType+`" table-name="`+this.name+`" class="swap-table-btn"><span class="mdi mdi-swap-horizontal"></button>`)[0];
                this.ele.before(switchTableButton);
            }
            this.ele.detach().hide();
            this.switchTable();

        }
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
            for (let controlName in this.mapControlToIndex) {
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
            // this.ele.find('table tbody').append(bodyHtml);
            // this.ele.find('table').attr('contenteditable', 'false')
            let dataTable = [];
            let rowLength = data[Object.keys(data)[0]].length;
            for (let index = 0; index < rowLength; index++) {
                let rowData = {};
                for (let i = 0; i < Object.keys(data).length; i++) {
                    let key = Object.keys(data)[i];
                    let control = this.controlInTable[key];
                    if (control && control.type == 'date') {
                        data[key][index] = moment(data[key][index], 'YYYY-MM-DD').format(control.controlProperties.formatDate.value);
                    }
                    rowData[key] = data[key][index];
                }
                dataTable.push(rowData)

            }
            this.pivotTable.setData(dataTable)
        } else {
            if (data.hasOwnProperty('childObjectId') && Object.keys(data).length == 1){
                return;
            }
            let dataTable = [];
            let rowLength = data[Object.keys(data)[0]].length;
            for (let index = 0; index < rowLength; index++) {
                let rowData = {};
                for (let i = 0; i < Object.keys(data).length; i++) {
                    let key = Object.keys(data)[i];
                    let control = this.controlInTable[key];
                    if (control && control.type == 'date') {
                        data[key][index] = moment(data[key][index], 'YYYY-MM-DD').format(control.controlProperties.formatDate.value);
                    }
                    rowData[key] = data[key][index];
                }
                dataTable.push(rowData)

            }

            if (this.tableInstance.tableHasRowSum) { // trường hợp có dòng tính tổng thì thêm dòng ở cuối hiển thị tổng cột
                dataTable.push({})
            }
            this.tableInstance.tableInstance.loadData(dataTable);
            setTimeout((self) => {
                self.tableInstance.tableInstance.render();
                SYMPER_APP.$evtBus.$emit('document-on-table-change', {
                    data: self.tableInstance.tableInstance.getSourceData(),
                    tableName:self.name
                });
            }, 100, this);
            if (this.currentDataStore.docStatus == 'init') {
                this.defaultValue = data;
            }

        }
    }
    switchTable(){
        if(this.tableMode == 'nomal'){
            this.tableInstance.show();
            this.tableInstance.tableInstance.render();
            if(this.pivotTable){
                this.pivotTable.hide();
            }
        }
        else{
            this.tableInstance.hide();
            if(this.pivotTable){
                this.pivotTable.show();
            }
            
        }
    }

}
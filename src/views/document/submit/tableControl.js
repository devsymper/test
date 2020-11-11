import Control from "./control";
import moment from "moment-timezone";

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
            if (this.isPrintView) {
                this.ele.attr('table-id', this.ele.attr('id'));
                this.ele.removeAttr('id');
                this.ele.find('table').addClass('table-print');
                this.ele.find('table tbody').empty();
                this.tablePrint.render();
            } else {
                this.tableInstance.render();
                // this.pivotTable.render();
                this.ele.detach().hide();

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
            this.ele.find('table tbody').append(bodyHtml);
            this.ele.find('table').attr('contenteditable', 'false')
        } else {
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
            }, 100, this);
            if (this.currentDataStore.docStatus == 'init') {
                this.defaultValue = data;
            }

        }
    }

}
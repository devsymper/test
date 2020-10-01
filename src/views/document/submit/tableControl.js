import Control from "./control";

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
        this.isPrintView = isPrintView;
        /**
         * tên các control nằm trong control này, mặc định là null, nếu control là table thì mới có giá trị là {'tên control':true}
         */
        this.listInsideControls = null;
        this.controlInTable = {};
        this.mapControlToIndex = {};
        this.ele.wrap('<span style="position:relative;display: block;" class="wrap-table">');

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
                this.ele.detach().hide();

            }

        }
        /**
         * Hàm set data cho handson table, cho trường hợp viewdetail đã có data
         * @param {*} data 
         */
    setData(data) {
        if (data.hasOwnProperty('childObjectId') && Object.keys(data).length == 1) {
            if (this.tableInstance.tableInstance) {
                this.tableInstance.tableInstance.updateSettings({
                    data: [
                        []
                    ]
                })
                this.tableInstance.tableInstance.render();
            }

            return;
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
            for (let controlName in data) {
                let dataControl = data[controlName];

                let vls = [];
                for (let index = 0; index < dataControl.length; index++) {
                    let row = dataControl[index];
                    if (row == null || row == 'null')
                        row = '';
                    if (!isNaN(row)) {
                        row = Number(row);
                    }
                    vls.push([index, controlName, row]);
                }
                this.tableInstance.tableInstance.setDataAtRowProp(vls, null, null, 'auto_set');
            }
            if (this.checkDetailView() && this.tableInstance.tableHasRowSum) { // trường hợp có dòng tính tổng thì thêm dòng ở cuối hiển thị tổng cột
                this.tableInstance.tableInstance.alter('insert_row', Object.keys(data).length, 1);
            }
            if (this.currentDataStore.docStatus == 'init') {
                this.defaultValue = data;
                this.getDefaultRowInTable();
            }

        }
    }

    // hàm chạy lại các công thức root trong table để lấy ra được dòng giá trị defaul phục vụ cho việc shift+enter thêm dòng thì 
    // điền giá trị default này vào
    getDefaultRowInTable() {
        console.log(this.currentDataStore, 'this.currentDataStore');

    }

}
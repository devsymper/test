import Control from "./control";
import sDocument from './../../../store/document'

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
        this.mapControlToIndex = {}
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
        if (this.isPrintView) {
            let dataTablePrint = [];
            for (let controlName in this.mapControlToIndex) {
                let dataControl = data[controlName];
                for (let index = 0; index < dataControl.length; index++) {
                    if (dataTablePrint.length <= index) {
                        dataTablePrint.push([])
                    }
                    let row = dataControl[index];
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
                    vls.push([index, controlName, row]);
                }
                this.tableInstance.tableInstance.setDataAtRowProp(vls, null, null, 'auto_set');
            }
            if (sDocument.state.submit[this.curParentInstance].docStatus == 'init') {
                this.defaultValue = data;
            }

        }
    }

}
import Util from './util'
import Handsontable from 'handsontable';
import store from './../../../store/document'

let listInputInDocument = store.state.submit.listInputInDocument;

const MAX_TABLE_HEIGHT = 300;
/**
 * Các loại cell mà handsontable hỗ trợ hiển thị
 */
const supportCellsType = {
    textInput: 'TextRenderer',
    currency: 'NumericRenderer',
    number: 'NumericRenderer',
    date: 'DateRenderer',
    datetime: 'DatetimeRenderer',
    time: 'TimeRenderer',
    image: 'ImageRenderer',
    'file-upload': 'FileRenderer',
    label: 'TextRenderer',
    persent: 'PercentRenderer',
    user: 'TextRenderer',
    select: 'DropdownRenderer',
    checkbox: 'CheckboxRenderer'
};

/** Đánh dấu set cell value là tự động điền chứ ko phải do user thay đổi  */
const AUTO_SET = 'auto_set';
const INIT_NEW_LINE = 'init_new_line';
let docStatus = 'init';
export default class Table {
    constructor(control, tableName) {
        /**
         * Chứa object của Control tương ứng
         */
        this.controlObj = control;
        /**
         * Tên table tương ứng
         */
        this.tableName = tableName;


        /**
         * Lưu tên cột tương ứng với số thứ tự của cột trong bảng
         */
        this.colName2Idx = {};

        /**Mẫu giá trị cho các dòng của bảng khi được thêm mới */
        this.sampleRowValues = {};

        /**
         * object chứa tọa độ của cell và giá trị validate của cell đó, phải có cái này do handsontable chỉ có render toàn bộ bảng, chứ không render cho từng cell
         * cấu trúc {
         *      "row_column":{vld:true|false,msg:' thông báo lỗi'} //Chỉ cần quan tâm tới false, các trường hợp còn lại hiển thị bình thường
         * }
         */
        this.validateValueMap = {};

        /**Tổng số dòng trong table */
        this.rowCount = 0;

        /**Danh sách các celltpye trong table */
        this.listCellType = {};
    }
    render() {
        let thisObj = this;
        let tableContainer = $('<div id="' + thisObj.controlObj.id + '"></div>')[0];
        thisObj.controlObj.ele.before(tableContainer);
        thisObj.tableContainer = $(tableContainer);
        let columnsInfo = this.getColumnsInfo();
        console.log(columnsInfo);

        thisObj.controlObj.ele.detach().hide();
        let colHeaders = columnsInfo.headerNames;
        thisObj.colHeaders = colHeaders;

        let tableInstance = new Handsontable(tableContainer, {
            rowHeaders: true,
            dataSchema: Object.assign({}, thisObj.sampleRowValues),
            filters: true,
            dropdownMenu: true,
            licenseKey: 'non-commercial-and-evaluation',
            manualColumnResize: true,
            manualRowResize: true,
            hiddenColumns: {
                columns: columnsInfo.hiddenColumns,
                indicators: false
            },
            // rowHeights:30,   
            // minSpareRows: 1,
            data: [
                []
            ],
            manualColumnMove: true,
            // manualRowMove: true,
            contextMenu: true,
            colHeaders: colHeaders,
            readOnly: false,
            viewportColumnRenderingOffset: 50,
            // manualColumnFreeze: true,
            columns: columnsInfo.columns,
            allowInsertColumn: false,
            allowRemoveColumn: false,
            columnHeaderHeight: 30,
            viewportRowRenderingOffset: 20,
            viewportColRenderingOffset: 20,
            contextMenu: ['row_above', 'row_below', 'remove_row', 'freeze_column', 'unfreeze_column'],
            dragToScroll: false,
            stretchH: 'all',
            formulas: true,
            autoRowSize: false,
            autoColSize: false,
            width: '100%',
            minSpareRows: 1,
            height: MAX_TABLE_HEIGHT,
            // afterRender: function(isForced) {
            //     let tbHeight = this.container.getElementsByClassName('htCore')[0].getBoundingClientRect().height;
            //     console.log(tbHeight);

            //     if (tbHeight < MAX_TABLE_HEIGHT) {
            //         $(this.rootElement).css('height', tbHeight + 20);
            //     } else {
            //         $(this.rootElement).css('height', MAX_TABLE_HEIGHT);
            //     }
            //     if (!this.reRendered) {
            //         this.reRendered = true;
            //         setTimeout((hotTb) => {
            //             hotTb.render();
            //         }, 500, this);
            //     }
            // },

            // beforeCreateRow: function(index, amount, source) {
            //     let tableCtrl = listInputInDocument[this.SymperTableName].tableInstance;
            //     console.log(tableCtrl);
            //     let ctrlName = '';
            //     if (docStatus == 'init') {
            //         if (source == 'add_row_on_enter') {
            //             for (ctrlName in tableCtrl.colName2Idx) {
            //                 listInputInDocument[ctrlName].inputCacheSet('', 0);
            //                 listInputInDocument[ctrlName].setExtraProp([0]);
            //             }
            //         } else {
            //             for (ctrlName in tableCtrl.colName2Idx) {
            //                 listInputInDocument[ctrlName].inputCacheSet('', 0);
            //             }
            //         }
            //     } else {
            //         if (source == 'add_row_on_enter') {
            //             for (ctrlName in tableCtrl.colName2Idx) {
            //                 listInputInDocument[ctrlName].inputCacheSet(tableCtrl.sampleRowValues[ctrlName], index);
            //                 listInputInDocument[ctrlName].setExtraProp([index]);
            //             }
            //         } else {
            //             for (ctrlName in tableCtrl.colName2Idx) {
            //                 listInputInDocument[ctrlName].inputCacheSet(tableCtrl.sampleRowValues[ctrlName], index);
            //             }
            //         }
            //         tableCtrl.tableInstance.rowCount += amount;
            //     }
            //     let totalRows = tableCtrl.tableInstance.countRows();
            //     if (totalRows > 4) {
            //         $(tableCtrl.tableInstance.rootElement).parent().addClass('split-span');
            //         $(tableCtrl.tableInstance.rootElement).on('click', function(e) {
            //             if (e.target.parentElement.nodeName == 'SPAN') {
            //                 //do your work here ;)
            //                 let body = $(e.target).parents('body');
            //                 if (!body.find('#spliter').length) {
            //                     body.append('<div id="spliter"></div>');
            //                 }
            //                 let split = body.find('#spliter');
            //                 // clicked on ::before
            //                 let is_full = false;
            //                 if ($(e.target).parent().hasClass('full')) {
            //                     is_full = true;
            //                 }
            //                 if (body.find('.split-span').length) {
            //                     body.find('.split-span').removeClass('full');
            //                 }
            //                 if (is_full) {
            //                     split.hide();
            //                     split.css({
            //                         left: "-150%"
            //                     });
            //                     body.style('width', '29.7cm');
            //                     //  body.find('span.split-span > div:nth-child(1)').css('width', 'unset');
            //                     body.removeClass('split');
            //                 } else {
            //                     split.show();
            //                     split.css({
            //                         left: "50%"
            //                     });
            //                     body.addClass('split');
            //                     $(e.target).parent().addClass('full');
            //                     drag_spliter(split, $(e.target));
            //                 }
            //             }
            //         });
            //     } else {
            //         $(tableCtrl.tableInstance.rootElement).parent().removeClass('split-span');
            //     }
            // },
        });
        this.tableInstance = tableInstance;
        for (let evtName in thisObj.event) {
            Handsontable.hooks.add(evtName, thisObj.event[evtName], tableInstance);
        }
        tableInstance.SymperTableName = thisObj.controlObj.name;
    }
    getColumnsInfo() {

        let thisObj = this
        let headerName = [];
        let columns = [];
        let hiddenColumns = [];
        let num = 0;
        console.log(thisObj.controlObj);

        let ths = thisObj.controlObj.ele.find('th');

        for (let controlName in thisObj.controlObj.listInsideControls) {
            headerName.push($(ths[num]).text());
            // Lấy celltype
            let cellType = thisObj.getCellType(controlName, listInputInDocument[controlName]);
            thisObj.listCellType[controlName] = cellType;
            columns.push(cellType);
            //Khởi tạo giá trị cho dòng mới
            thisObj.sampleRowValues[controlName] = listInputInDocument[controlName].getDefaultValue();
            //Đánh số thứ tự các cột trong bảng
            thisObj.colName2Idx[controlName] = num;
            //ẩn cột
            if (listInputInDocument[controlName].controlProperties.isHidden == 1) {
                hiddenColumns.push(num);
            }

            num += 1;

        }

        return {
            headerNames: headerName,
            columns: columns,
            hiddenColumns: hiddenColumns
        }
    }
    getCellType(name, control) {
        let type = control.type;
        let ctrl = listInputInDocument[name];
        let rsl = {
            data: name,
            type: type,
            // renderer: validateRender
        }
        if (type == 'number') {
            rsl.numericFormat = {
                pattern: listInputInDocument[name].numberFormat
            };
        } else if (type == 'label' || ctrl.controlProperties.isReadOnly == 1) {
            rsl.readOnly = true;
        } else if (type == 'select' && ctrl.fmlData.exeType == 'math') {
            rsl.editor = 'select';
            rsl.selectOptions = ctrl.fmlData.formula.replace(/\'/g, '').split('|');
        } else if (type == 'time') {
            rsl.timeFormat = 'HH:mm:ss',
                rsl.correctFormat = true;
        }
        console.log(type);

        rsl.type = Util.toLowerCaseFirstCharacter(supportCellsType[type].replace('Renderer', ''));
        return rsl;
    }
}
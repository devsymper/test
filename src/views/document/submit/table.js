import Util from './util'
import Handsontable from 'handsontable';
import store from './../../../store/document'
import s from './../../../store'
import ClientSQLManager from './clientSQLManager';

import { SYMPER_APP } from './../../../main.js'
import { Date } from 'core-js';
/**
 * Custom render cho control percent( phần trăm) cho table
 */
Handsontable.renderers.PercentRenderer = function(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.NumericRenderer.apply(this, arguments);
    td.textContent = td.textContent + " %";
}
Handsontable.cellTypes.registerCellType('percent', {
    editor: Handsontable.editors.TextEditor.prototype.extend(),
    renderer: Handsontable.renderers.PercentRenderer
});
Handsontable.renderers.FileRenderer = function(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.NumericRenderer.apply(this, arguments);
    td.innerHTML = listInputInDocument[prop].genFileView(row);
    td.classList.add("upload-file-wrapper-inTb");
    if (isDetailView && !rerenderCtrlFlag[instance.tableName]) {
        let tb = listInputInDocument[prop].inTable;
        listInputInDocument[tb].tableInstance.reRender(tb);
        rerenderCtrlFlag[instance.tableName] = true;
    }
}
Handsontable.cellTypes.registerCellType('file', {
    renderer: Handsontable.renderers.PercentRenderer
});

let listInputInDocument = store.state.submit.listInputInDocument;
//object để lưu thông tin các control ngoài table chờ để chạy công thức
let controlOutsideWaitingRun = {}
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
    fileUpload: 'FileRenderer',
    label: 'TextRenderer',
    percent: 'PercentRenderer',
    user: 'TextRenderer',
    select: 'DropdownRenderer',
    checkbox: 'CheckboxRenderer'
};

/** Đánh dấu set cell value là tự động điền chứ ko phải do user thay đổi  */
const AUTO_SET = 'auto_set';
const INIT_NEW_LINE = 'init_new_line';
let docStatus = 'init';
export default class Table {
    constructor(control, tableName, keyInstance) {
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
            let thisObj = this;

            this.validateValueMap = {};

            /**Tổng số dòng trong table */
            this.rowCount = 0;
            this.tableInstance = null;
            this.columnsInfo = null;
            this.keyInstance = keyInstance;
            /**Danh sách các celltpye trong table */
            this.listCellType = {};
            this.currentSelectedCell = {};
            this.event = {
                afterSelection: (row, column, row2, column2, preventScrolling, selectionLayerLevel) => {
                    // thisObj.currentSelectedCell['row'] = row;
                    // thisObj.currentSelectedCell['column'] = column;
                    // ClientSQLManager.editRow(thisObj.keyInstance, )
                },
                afterBeginEditing: function(row, column) {
                    thisObj.currentSelectedCell['row'] = row;
                    thisObj.currentSelectedCell['column'] = column;

                },
                afterCreateRow: function(index, amount, source) {

                },
                afterChange: function(changes, source) {
                    let controlName = changes[0][1];
                    if (controlName != 's_table_id_sql_lite') {
                        let columns = thisObj.columnsInfo.columns;
                        columns = columns.map(function(c) {
                            return c.data;
                        });
                        let currentRowData = thisObj.tableInstance.getDataAtRow(thisObj.currentSelectedCell['row']);
                        for (let index = 0; index < currentRowData.length; index++) {
                            let cell = currentRowData[index];
                            if (cell == "" || cell == null) {
                                currentRowData[index] = 'NULL';
                            } else {
                                currentRowData[index] = '"' + currentRowData[index] + '"'
                            }
                        }
                        s.commit("document/updateListInputInDocument", {
                            controlName: controlName,
                            key: 'value',
                            value: changes[changes.length - 1][3]
                        });
                        if (currentRowData[currentRowData.length - 1] == 'NULL') {
                            let id = Date.now();
                            currentRowData[currentRowData.length - 1] = id;

                            thisObj.tableInstance.setDataAtCell(thisObj.currentSelectedCell['row'], currentRowData.length - 1, id);
                            ClientSQLManager.insertRow(thisObj.keyInstance, thisObj.tableName, columns, currentRowData, true).then(res => {
                                let s = ClientSQLManager.get(thisObj.keyInstance, "select * from " + thisObj.tableName);

                                thisObj.handlerCheckEffectedControlInTable(controlName);
                            });
                        } else {
                            ClientSQLManager.editRow(thisObj.keyInstance, thisObj.tableName, controlName, changes[thisObj.currentSelectedCell['row']][3],
                                'WHERE s_table_id_sql_lite = ' + currentRowData[currentRowData.length - 1]).then(res => {
                                let s = ClientSQLManager.get(thisObj.keyInstance, "select * from " + thisObj.tableName);
                                thisObj.handlerCheckEffectedControlInTable(controlName);
                            });
                        }

                    }
                }
            }
        }
        /**
         * Hàm xử lí tìm các control bị ảnh hưởng sau khi  change 1 control trong table và chạy công thức cho các control bị ảnh hưởng đó
         * @param {String} controlName Control bị thay đổi dữ liệu
         */
    handlerCheckEffectedControlInTable(controlName) {
            let controlInstance = listInputInDocument[controlName];
            if (controlInstance == null || controlInstance == undefined) {
                return;
            }
            let controlEffected = controlInstance.getEffectedControl();
            if (Object.keys(controlEffected).length > 0) {
                for (let i in controlEffected) {
                    let controlEffectedInstance = listInputInDocument[i];
                    let formulasInstance = controlEffectedInstance.controlFormulas['formulas'].instance;
                    let inputControl = formulasInstance.getInputControl();
                    let dataInput = {};
                    for (let inputControlName in inputControl) {
                        let valueInputControlItem = listInputInDocument[inputControlName].value;
                        dataInput[inputControlName] = valueInputControlItem;
                    }
                    if (controlEffectedInstance.hasOwnProperty('inTable')) {
                        if (controlEffectedInstance.inTable == this.tableName) {
                            this.handlerRunFormulasForControlInTable(controlEffectedInstance.name, dataInput, formulasInstance);
                        } else {

                        }
                    } else {
                        controlOutsideWaitingRun[i] = controlEffectedInstance;
                    }
                }
            }

        }
        /**
         * Hàm xử lí query dữ liệu  từ bảng sqllite
         * @param {*} controlEffectedInstance   Object của 1 control bị ảnh hưởng
         * @param {*} dataInput    dữ liệu đầu vào cho công  thức
         * @param {*} formulasInstance  Object cua formulas giá trị của control bị ảnh hưởng
         */
    handlerRunFormulasForControlInTable(controlEffectedName, dataInput, formulasInstance) {
            let thisObj = this;
            setTimeout(() => {
                formulasInstance.handleBeforeRunFormulas(dataInput).then(res => {
                    thisObj.handlerSetDataToColumnAfterRunFormulas(res.data, controlEffectedName);
                })
            }, 20);
        }
        /**
         * Hàm lấy dữ liệu hiện tại của table và insert vào sql lite table
         */
    handlerSetDataToColumnAfterRunFormulas(data, controlEffectedName) {
        let values = data[0].values;
        console.log(values);

        let vls = [];
        for (let index = 0; index < values.length; index++) {
            let row = values[index];
            vls.push([index, controlEffectedName, row[0]]);

        }
        console.log(vls);

        this.tableInstance.setDataAtRowProp(vls, null, null, AUTO_SET);
        for (let control in controlOutsideWaitingRun) {
            SYMPER_APP.$evtBus.$emit('run-effected-control-when-table-change', { control: controlOutsideWaitingRun[control] })
        }
    }

    render() {
        let thisObj = this;
        let tableContainer = $('<div id="' + thisObj.controlObj.id + '" s-control-type="table"></div>')[0];
        thisObj.controlObj.ele.before(tableContainer);
        thisObj.tableContainer = $(tableContainer);
        thisObj.columnsInfo = this.getColumnsInfo();
        console.log(thisObj.columnsInfo);

        thisObj.controlObj.ele.detach().hide();
        let colHeaders = thisObj.columnsInfo.headerNames;
        thisObj.colHeaders = colHeaders;

        this.tableInstance = new Handsontable(tableContainer, {
            rowHeaders: true,
            dataSchema: Object.assign({}, thisObj.sampleRowValues),
            filters: true,
            dropdownMenu: true,
            licenseKey: 'non-commercial-and-evaluation',
            manualColumnResize: true,
            manualRowResize: true,
            hiddenColumns: {
                columns: thisObj.columnsInfo.hiddenColumns,
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
            columns: thisObj.columnsInfo.columns,
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
            height: 'auto',
            afterRender: function(isForced) {
                let tbHeight = this.container.getElementsByClassName('htCore')[0].getBoundingClientRect().height;
                if (tbHeight < MAX_TABLE_HEIGHT) {
                    $(this.rootElement).css('height', tbHeight + 20);
                } else {
                    $(this.rootElement).css('height', MAX_TABLE_HEIGHT);
                }
                if (!this.reRendered) {
                    this.reRendered = true;
                    setTimeout((hotTb) => {
                        hotTb.render();
                    }, 500, this);
                }
            },

            // beforeCreateRow: function(index, amount, source) {
            //     let tableCtrl = listInputInDocument[this.tableName].tableInstance;
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
        for (let evtName in thisObj.event) {
            Handsontable.hooks.add(evtName, thisObj.event[evtName], this.tableInstance);
        }
    }

    /**
     * Hàm lấy thông tin của các cột
     */
    getColumnsInfo() {
        let thisObj = this
        let headerName = [];
        let columns = [];
        let hiddenColumns = [];
        let num = 0;
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
        // thêm cột ẩn là id của sqllite
        columns.push({ data: 's_table_id_sql_lite', type: 'numeric' });
        hiddenColumns.push(columns.length - 1);
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
            // renderer: this.validateRender
        }
        if (type == 'number') {
            rsl.numericFormat = {
                pattern: listInputInDocument[name].numberFormat
            };
        } else if (type == 'label' || ctrl.controlProperties.isReadOnly == 1) {
            rsl.readOnly = true;
        } else if (type == 'select') {
            rsl.editor = 'select';
            // rsl.selectOptions = ctrl.fmlData.formula.replace(/\'/g, '').split('|');
        } else if (type == 'time') {
            rsl.timeFormat = 'HH:mm:ss',
                rsl.correctFormat = true;
        }
        rsl.type = Util.toLowerCaseFirstCharacter(supportCellsType[type].replace('Renderer', ''));
        console.log(rsl);

        return rsl;
    }
    validateRender(hotInstance, td, row, column, prop, value, cellProperties) {
            if (row + 1 == hotInstance.countRenderedRows()) {
                if (value === null) {
                    arguments[5] = this.sampleRowValues[prop];
                }
            }
            Handsontable.renderers[supportCellsType[listInputInDocument[prop].type]].apply(this, arguments);
            if (listInputInDocument[prop].isCheckbox) {
                td.style.textAlign = "center";
            }
            console.log(this);

            let map = this.validateValueMap[row + '_' + column];
            if (map) {
                let sign = prop + '____' + row;
                let ele = $(td);
                if (map.vld === false) {
                    ele.append(Util.makeErrNoti(map.msg, sign));
                }
                if ((map.require === false || listInputInDocument[prop].originProp.Required == 1) && value === '') {
                    ele.css('position', 'relative').append(Util.requireRedDot(sign));
                }
            }

            if (isDetailView) {
                let indx = prop + '_' + row;
                if (changedVlCtrlCoord[indx]) {
                    td.classList.add('changed-input');
                    for (let typeChange in changedVlCtrlCoord[indx]) {
                        td.setAttribute(typeChange, 'yes');
                    }
                }
            }
        }
        /**
         * set giá trị cho một cột tương ứng với các rowId
         * @param {string} name tên control
         * @param {Object} values {
         *                              "rowId":"value"
         *                          }
         */
    setColValues(name, values, tbName) {
        let vls = [];
        for (let i = 0; i < values.length; i++) {
            vls.push([i, name, values[i]]);
        }
        this.tableInstance.setDataAtRowProp(vls, null, null, AUTO_SET);
        // listInputInDocument[tbName].reCaclSumAndAvg();
    }
}
import Util from './util'
import Handsontable from 'handsontable';
import store from './../../../store/document'
import s from './../../../store'
import ClientSQLManager from './clientSQLManager';
import { SYMPER_APP } from './../../../main.js'
import { Date } from 'core-js';
import { checkCanBeBind, resetImpactedFieldsList, markBinedField } from './handlerCheckRunFormulas';
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
                afterSelectionEnd: function(row, col) {
                    s.commit("document/addToDocumentSubmitStore", {
                        key: 'docStatus',
                        value: 'input'
                    });
                },
                beforeOnCellMouseDown: function(event, coords, td, controller) {

                },
                afterChange: function(changes, source) {

                    let controlName = changes[0][1];
                    let columns = thisObj.columnsInfo.columns;
                    let currentRowData = thisObj.tableInstance.getDataAtRow(thisObj.currentSelectedCell['row']);
                    if (columns[thisObj.currentSelectedCell['column']].type == 'time' &&
                        !thisObj.checkCellIsTime(currentRowData[thisObj.currentSelectedCell['column']])) {
                        return;
                    }
                    if (controlName != 's_table_id_sql_lite') {

                        if (source != AUTO_SET) {
                            s.commit("document/addToDocumentSubmitStore", {
                                key: 'rootChangeFieldName',
                                value: controlName
                            });
                            resetImpactedFieldsList();
                        }
                        columns = columns.map(function(c) {
                            return c.data;
                        });

                        let currentColData = thisObj.tableInstance.getDataAtCol(thisObj.currentSelectedCell['column']);
                        currentColData.pop();
                        s.commit("document/updateListInputInDocument", {
                            controlName: controlName,
                            key: 'value',
                            value: currentColData
                        });

                        if (source != AUTO_SET) {
                            for (let index = 0; index < currentRowData.length; index++) {
                                let cell = currentRowData[index];
                                if (cell == "" || cell == null) {
                                    currentRowData[index] = 'NULL';
                                } else {
                                    currentRowData[index] = '"' + currentRowData[index] + '"'
                                }
                            }
                            if (currentRowData[currentRowData.length - 1] == 'NULL') {
                                let id = Date.now();
                                currentRowData[currentRowData.length - 1] = id;
                                thisObj.tableInstance.setDataAtCell(thisObj.currentSelectedCell['row'], currentRowData.length - 1, id);
                                ClientSQLManager.insertRow(thisObj.keyInstance, thisObj.tableName, columns, currentRowData, true).then(res => {
                                    thisObj.handlerCheckEffectedControlInTable(controlName);
                                });
                            } else {
                                ClientSQLManager.editRow(thisObj.keyInstance, thisObj.tableName, controlName, changes[0][3],
                                    'WHERE s_table_id_sql_lite = ' + currentRowData[currentRowData.length - 1], true).then(res => {
                                    thisObj.handlerCheckEffectedControlInTable(controlName);

                                });
                            }
                        } else {
                            for (let index = 0; index < changes.length; index++) {
                                let colChange = changes[index];
                                let rowData = thisObj.tableInstance.getDataAtRow(colChange[0]);
                                for (let index = 0; index < rowData.length; index++) {
                                    let cell = rowData[index];
                                    if (cell == "" || cell == null) {
                                        rowData[index] = 'NULL';
                                    } else {
                                        rowData[index] = '"' + rowData[index] + '"'
                                    }
                                }
                                if (rowData[rowData.length - 1] == 'NULL') {
                                    let id = Date.now();
                                    rowData[rowData.length - 1] = id;
                                    thisObj.tableInstance.setDataAtCell(colChange[0], rowData.length - 1, id);
                                    ClientSQLManager.insertRow(thisObj.keyInstance, thisObj.tableName, colChange[1], rowData, true).then(res => {
                                        thisObj.handlerCheckEffectedControlInTable(controlName);
                                    });
                                } else {
                                    ClientSQLManager.editRow(thisObj.keyInstance, thisObj.tableName, colChange[1], colChange[3],
                                        'WHERE s_table_id_sql_lite = ' + rowData[rowData.length - 1], true).then(res => {
                                        thisObj.handlerCheckEffectedControlInTable(controlName);
                                    });
                                }
                            }
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
            let thisCpn = this;
            let controlInstance = listInputInDocument[controlName];
            if (controlInstance == null || controlInstance == undefined) {
                return;
            }
            let controlEffected = controlInstance.getEffectedControl();
            // console.log(controlEffected);
            if (Object.keys(controlEffected).length > 0) {
                for (let i in controlEffected) {
                    if (checkCanBeBind(i)) {
                        let controlEffectedInstance = listInputInDocument[i];
                        let formulasInstance = controlEffectedInstance.controlFormulas['formulas'].instance;
                        let inputControl = formulasInstance.getInputControl();
                        let dataInput = {};
                        for (let inputControlName in inputControl) {
                            let valueInputControlItem = this.getColumnIndexFromControlName(inputControlName);
                            valueInputControlItem = this.tableInstance.getDataAtCol(valueInputControlItem);
                            valueInputControlItem.pop();
                            dataInput[inputControlName] = valueInputControlItem;
                        }
                        if (controlEffectedInstance.hasOwnProperty('inTable')) {
                            if (controlEffectedInstance.inTable == this.tableName) {
                                thisCpn.handlerRunFormulasForControlInTable(controlEffectedInstance.name, dataInput, formulasInstance);
                            }
                        }
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
    async handlerRunFormulasForControlInTable(controlEffectedName, dataInput, formulasInstance) {
            let dataColumnAfterRunFOrmulas = [];
            if (Object.keys(dataInput).length > 0) {
                let allRowDataInput = [];
                for (let control in dataInput) {
                    let dataRow = dataInput[control];
                    for (let i = 0; i < dataRow.length; i++) {
                        if (allRowDataInput.length <= i) {
                            allRowDataInput[i] = {};
                        }
                        allRowDataInput[i][control] = dataRow[i];
                    }
                }
                for (let index = 0; index < allRowDataInput.length; index++) {
                    let rowInput = allRowDataInput[index];
                    await formulasInstance.handleBeforeRunFormulas(rowInput).then(res => {
                        dataColumnAfterRunFOrmulas.push(res.data[0].values[0][0]);
                    })
                }
            } else {
                await formulasInstance.handleBeforeRunFormulas(dataInput).then(res => {
                    dataColumnAfterRunFOrmulas.push(res.data[0].values[0][0]);
                })
            }
            s.commit("document/updateListInputInDocument", {
                controlName: controlEffectedName,
                key: 'value',
                value: dataColumnAfterRunFOrmulas
            });
            this.handlerSetDataToColumnAfterRunFormulas(dataColumnAfterRunFOrmulas, controlEffectedName)
        }
        /**
         * Hàm lấy dữ liệu hiện tại của table và insert vào sql lite table
         */
    handlerSetDataToColumnAfterRunFormulas(data, controlEffectedName) {
            let values = data;
            let vls = [];
            for (let index = 0; index < values.length; index++) {
                let row = values[index];
                if (row == null || row == 'null')
                    row = '';
                vls.push([index, controlEffectedName, row]);
            }
            this.tableInstance.setDataAtRowProp(vls, null, null, AUTO_SET);
            markBinedField(controlEffectedName);
            setTimeout(() => {
                let controlInstance = listInputInDocument[controlEffectedName];
                if (controlInstance != null && controlInstance != undefined) {
                    let controlEffected = controlInstance.getEffectedControl();
                    for (let control in controlEffected) {
                        if (!listInputInDocument[control].hasOwnProperty('inTable'))
                            SYMPER_APP.$evtBus.$emit('run-effected-control-when-table-change', { control: listInputInDocument[control] })
                    }
                }
            }, 100);

        }
        // chú mô tả lại ngắn gọn vấn đề
    render() {
        let thisObj = this;
        let tableContainer = $('<div id="' + thisObj.controlObj.id + '" s-control-type="table"></div>')[0];
        thisObj.controlObj.ele.before(tableContainer);
        thisObj.tableContainer = $(tableContainer);
        thisObj.columnsInfo = this.getColumnsInfo();
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
    checkCellIsTime(str) {
        var patt = new RegExp("^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", "g");
        return patt.test(str)
    }
    getColumnIndexFromControlName(name) {
        let column = this.columnsInfo.columns.filter(col => {
            return col.data == name;
        })

        if (column.length > 0) {
            return this.columnsInfo.columns.indexOf(column[0]);
        } else {
            return false
        }

    }
}
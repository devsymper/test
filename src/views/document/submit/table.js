import Util from './util'
import Handsontable from 'handsontable';
import sDocument from './../../../store/document'
import store from './../../../store'
import ClientSQLManager from './clientSQLManager';
import { checkDbOnly, getControlInstanceFromStore } from './../common/common'
import { SYMPER_APP } from './../../../main.js'
import { Date } from 'core-js';
import { checkCanBeBind, resetImpactedFieldsList, markBinedField } from './handlerCheckRunFormulas';
/**
 * Custom render cho control percent( phần trăm) cho table
 */
Handsontable.renderers.PercentRenderer = function(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.NumericRenderer.apply(this, arguments);
    td.textContent = (td.textContent == "" || td.textContent == null) ? 0 + " %" : td.textContent + " %";
}
Handsontable.cellTypes.registerCellType('percent', {
    editor: Handsontable.editors.TextEditor.prototype.extend(),
    renderer: Handsontable.renderers.PercentRenderer
});
Handsontable.renderers.FileRenderer = function(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.NumericRenderer.apply(this, arguments);
    td.innerHTML = listInputInDocument[prop].genFileView(row);
    td.classList.add("upload-file-wrapper-inTb");
    $(td).off('click', '.file-add')
    $(td).on('click', '.file-add', function(e) {
        let el = $(e);
        $("#file-upload-alter").attr('data-rowid', el.attr('data-rowid')).attr('data-ctrlname', el.attr('data-ctrlname'));
        $("#file-upload-alter-" + instance.keyInstance).click();
        $("#file-upload-alter-" + instance.keyInstance).attr('data-control-name', $(this).attr('data-control-name'))
    })
    $(td).off('click', '.remove-file')
    listInputInDocument[prop].setDeleteFileEvent($(td), prop)
        // if (isDetailView && !rerenderCtrlFlag[instance.tableName]) {
        //     let tb = listInputInDocument[prop].inTable;
        //     // listInputInDocument[tb].tableInstance.reRender(tb);
        //     // rerenderCtrlFlag[instance.tableName] = true;
        // }

}
Handsontable.cellTypes.registerCellType('file', {
    renderer: Handsontable.renderers.PercentRenderer
});
var notEmpty = function(value, callback) {
    if (!value || String(value).length === 0) {
        callback(false);
    } else {
        callback(true);
    }
};
let listTableInstance = {}
let listInputInDocument = sDocument.state.submit.listInputInDocument;
let isDetailView = sDocument.state.isDetailView;
const MAX_TABLE_HEIGHT = 300;
/**
 * Các loại cell mà handsontable hỗ trợ hiển thị
 */
const supportCellsType = {
    textInput: 'TextRenderer',
    currency: 'NumericRenderer',
    number: 'NumericRenderer',
    date: 'DateRenderer',
    dateTime: 'DatetimeRenderer',
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
            this.isAutoCompleting = false;
            this.currentControlSelected = null
            this.event = {
                afterSelection: (row, column, row2, column2, preventScrolling, selectionLayerLevel) => {
                    SYMPER_APP.$evtBus.$emit("symper-app-wrapper-clicked", event);
                    thisObj.currentSelectedCell['row'] = row;
                    thisObj.currentSelectedCell['column'] = column;
                    store.commit("document/addToDocumentSubmitStore", {
                        key: 'currentTableInteractive',
                        value: thisObj
                    });
                    store.commit("document/addToDocumentSubmitStore", {
                        key: 'currentCellSelected',
                        value: thisObj.currentSelectedCell
                    });
                    let columns = thisObj.columnsInfo.columns;
                    thisObj.currentControlSelected = columns[column].data;
                    // nếu type cell là time thì emit qua submit mở timepicker
                    if (thisObj.getCellSelectedType(column) == 'time') {
                        // SYMPER_APP.$evtBus.$emit('document-submit-show-time-picker', { event: event });
                    };

                },
                afterBeginEditing: function(row, column) {
                    // nêu cell click là control select
                    if (thisObj.getCellSelectedType(column) == 'dropdown') {
                        thisObj.setSelectCell(event);
                    };
                },
                beforeKeyDown: function(event) {
                    if (event.keyCode != 40 && event.keyCode != 38 &&
                        event.keyCode != 37 && event.keyCode != 39 &&
                        thisObj.isAutoCompleting == false) {
                        var formulasInstance = thisObj.checkIsAutocompleteCell(thisObj.currentControlSelected);
                        if (formulasInstance != false) {
                            SYMPER_APP.$evtBus.$emit('document-submit-autocomplete-input', event);
                            thisObj.isAutoCompleting = formulasInstance;
                        }
                    }
                    // chặn bấm lên xuống trái phải khi có autocomplete
                    if ((event.keyCode == 40 || event.keyCode == 38 ||
                            event.keyCode == 37 || event.keyCode == 39) && thisObj.isAutoCompleting != false) {
                        event.stopImmediatePropagation();
                    }
                    // hoangnd: cần set timeout ở đây tại vì cần thực hiện đoạn này sau khi keydown hoàn tất thì input mới có dữ liệu
                    setTimeout(() => {
                        if (thisObj.isAutoCompleting != false) {
                            let formulasInstance = thisObj.isAutoCompleting
                            if (formulasInstance != false) {
                                SYMPER_APP.$evtBus.$emit('document-submit-autocomplete-key-event', {
                                    e: event,
                                    autocompleteFormulasInstance: formulasInstance,
                                    isSelect: false
                                })
                            }
                        }
                    }, 10);

                },

                afterSelectionEnd: function(row, col) {
                    store.commit("document/addToDocumentSubmitStore", {
                        key: 'docStatus',
                        value: 'input'
                    });
                },

                afterChange: function(changes, source) {
                    if (sDocument.state.submit.docStatus == 'init' && sDocument.state.viewType == 'update') {
                        return;
                    }

                    let controlName = changes[0][1];
                    let columns = thisObj.columnsInfo.columns;
                    let currentRowData = thisObj.tableInstance.getDataAtRow(thisObj.currentSelectedCell['row']);
                    // trường hợp cell type là time khi người dùng gõ ko đúng định dạng thì return
                    if (thisObj.currentSelectedCell.hasOwnProperty('column') &&
                        columns[thisObj.currentSelectedCell['column']].hasOwnProperty('type') &&
                        columns[thisObj.currentSelectedCell['column']].type == 'time' &&
                        !thisObj.checkCellIsTime(currentRowData[thisObj.currentSelectedCell['column']])) {
                        return;
                    }
                    // nếu có sự thay đổi cell mà là id của row sqlite thì ko thực hiện update
                    if (controlName != 's_table_id_sql_lite') {
                        thisObj.checkUniqueTable(controlName);
                        if (source != AUTO_SET) {
                            store.commit("document/addToDocumentSubmitStore", {
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
                        store.commit("document/updateListInputInDocument", {
                            controlName: controlName,
                            key: 'value',
                            value: currentColData
                        });
                        if (source != AUTO_SET) {
                            thisObj.handlerAfterChangeCellByUser(changes, currentRowData, columns, controlName);
                        } else {
                            thisObj.handlerAfterChangeCellByAutoSet(changes, columns, controlName);
                        }
                        let controlUnique = checkDbOnly(controlName);
                        if (controlUnique != false) {
                            let dataInput = {}
                            dataInput[controlName] = [changes[0][3]]
                            thisObj.handlerRunFormulasForControlInTable('uniqueDB', controlUnique, dataInput, controlUnique.controlFormulas.uniqueDB);
                        }


                    }

                }
            }
            listTableInstance[this.tableName] = this;
        }
        /**
         * Hàm xử lí dữ liệu thay đổi ở cell bởi hệ thống (hàm set data của handson)
         */
    handlerAfterChangeCellByAutoSet(changes, columns, controlName) {
            let thisObj = this;
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
                    ClientSQLManager.insertRow(thisObj.keyInstance, thisObj.tableName, columns, rowData, true).then(res => {
                        if (index == changes.length - 1) {
                            thisObj.handlerCheckEffectedControlInTable(controlName);
                        }
                    });
                } else {
                    ClientSQLManager.editRow(thisObj.keyInstance, thisObj.tableName, colChange[1], colChange[3],
                        'WHERE s_table_id_sql_lite = ' + rowData[rowData.length - 1], true).then(res => {
                        if (index == changes.length - 1) {
                            thisObj.handlerCheckEffectedControlInTable(controlName);
                        }
                    });
                }
            }
        }
        /**
         * Hàm xử lí dữ liệu thay đổi ở cell bởi User edit (hàm set data của handson)
         */
    handlerAfterChangeCellByUser(changes, currentRowData, columns, controlName) {
            let thisObj = this;
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
        }
        /**
         * Hàm kiểm tra xem cell có công thức autocomplete hay không
         * @param {String} controlName 
         */

    checkIsAutocompleteCell(controlName) {
            let controlInstance = listInputInDocument[controlName];
            if (controlInstance != null && controlInstance != undefined) {
                let controlFormulas = controlInstance.controlFormulas;
                if (controlFormulas.hasOwnProperty('autocomplete')) {
                    let formulasInstance = controlFormulas['autocomplete'].instance;
                    return formulasInstance;
                }
            }
            return false;
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
        let controlHiddenEffected = controlInstance.getEffectedHiddenControl();
        let controlReadonlyEffected = controlInstance.getEffectedReadonlyControl();
        let controlRequireEffected = controlInstance.getEffectedRequireControl();
        let controlLinkEffected = controlInstance.getEffectedLinkControl();
        let controlValidateEffected = controlInstance.getEffectedValidateControl();
        this.handlerRunOtherFormulasControl(controlHiddenEffected, 'hidden');
        this.handlerRunOtherFormulasControl(controlReadonlyEffected, 'readonly');
        this.handlerRunOtherFormulasControl(controlRequireEffected, 'require');
        this.handlerRunOtherFormulasControl(controlLinkEffected, 'link');
        this.handlerRunOtherFormulasControl(controlValidateEffected, 'validate');
        if (Object.keys(controlEffected).length > 0) {
            for (let i in controlEffected) {
                this.handlerCheckCanBeRunFormulas(i);
            }
        }
    }
    handlerRunOtherFormulasControl(controlEffected, formulasType) {
            if (Object.keys(controlEffected).length > 0) {
                for (let i in controlEffected) {
                    let controlEffectedInstance = listInputInDocument[i];
                    let allFormulas = controlEffectedInstance.controlFormulas;
                    if (allFormulas.hasOwnProperty(formulasType)) {
                        if (allFormulas[formulasType].hasOwnProperty('instance')) {
                            let formulasInstance = allFormulas[formulasType].instance;
                            let dataInput = this.getDataInputForFormulas(formulasInstance);
                            if (controlEffectedInstance.hasOwnProperty('inTable')) {
                                if (controlEffectedInstance.inTable == this.tableName) {
                                    this.handlerRunFormulasForControlInTable(formulasType, controlEffectedInstance, dataInput, formulasInstance);
                                }
                            }
                        }
                    }
                }
            }
        }
        /**
         * Hàm xử lí kiểm tra control đủ điều kiện chạy công thức hay chưa (checkCanBeBind) và lấy ra formulasInstance để chạy
         * @param {String} control 
         */
    handlerCheckCanBeRunFormulas(control) {
            if (checkCanBeBind(control)) {
                let controlInstance = listInputInDocument[control];
                if (controlInstance.controlFormulas.hasOwnProperty('formulas')) {
                    let formulasInstance = controlInstance.controlFormulas['formulas'].instance;
                    let dataInput = this.getDataInputForFormulas(formulasInstance);
                    if (controlInstance.hasOwnProperty('inTable')) {
                        if (controlInstance.inTable == this.tableName) {
                            this.handlerRunFormulasForControlInTable('formulas', controlInstance, dataInput, formulasInstance);
                        }
                    }
                }
            }
        }
        /**
         * Hàm lấy các data input cho 1 công thức
         * @param {Object} formulasInstance đối tượng của công thức 
         */
    getDataInputForFormulas(formulasInstance) {
            let inputControl = formulasInstance.getInputControl();
            let dataInput = {};
            for (let inputControlName in inputControl) {
                let valueInputControlItem = this.getColumnIndexFromControlName(inputControlName);
                valueInputControlItem = this.tableInstance.getDataAtCol(valueInputControlItem);
                valueInputControlItem.pop();
                dataInput[inputControlName] = valueInputControlItem;
            }
            return dataInput;
        }
        /**
         * Hàm xử lí query dữ liệu từ bảng sqllite
         * @param {*} controlEffectedInstance   Object của 1 control bị ảnh hưởng
         * @param {*} dataInput    dữ liệu đầu vào cho công  thức
         * @param {*} formulasInstance  Object cua formulas giá trị của control bị ảnh hưởng
         */
    async handlerRunFormulasForControlInTable(formulasType, controlInstance, dataInput, formulasInstance) {
            let thisObj = this;
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
                        dataColumnAfterRunFOrmulas.push(thisObj.getDataResponseQuery(res));
                    });
                }
            } else {
                await formulasInstance.handleBeforeRunFormulas(dataInput).then(res => {
                    dataColumnAfterRunFOrmulas.push(thisObj.getDataResponseQuery(res));
                })
            }
            store.commit("document/updateListInputInDocument", {
                controlName: controlInstance.name,
                key: 'value',
                value: dataColumnAfterRunFOrmulas
            });
            this.handlerDataAfterRunFormulas(dataColumnAfterRunFOrmulas, controlInstance, formulasType, dataInput)
        }
        /**
         * Hàm lấy dữ liệu hiện tại của table và insert vào sql lite table
         */

    getDataResponseQuery(rs) {
            let result = ""
            if (!rs.server) {
                let data = rs.data;
                if (data.length > 0) {
                    result = data[0].values[0][0]
                }
            } else {
                let data = rs.data.data;
                if (data.length > 0) {
                    result = data[0][Object.keys(data[0])[0]]
                }
            }
            return result;
        }
        /**
         * Hàm xử lí dữ liệu sau khi chạy xong công thức của 1 cột, -> set data cho cột đó -> chạy công thức cho các control ngoài bảng bị ảnh hưởng
         * @param {Object} data 
         * @param {String} controlEffectedName 
         */
    handlerDataAfterRunFormulas(data, controlInstance, formulasType, dataInput = false) {
        switch (formulasType) {
            case "formulas":
                controlInstance.handlerDataAfterRunFormulasValue(data);
                break;
            case "link":
                controlInstance.handlerDataAfterRunFormulasLink(data);
                break;
            case "validate":
                controlInstance.handlerDataAfterRunFormulasValidate(data);
                break;
            case "require":
                controlInstance.handlerDataAfterRunFormulasRequire(data);
                break;
            case "hidden":
                controlInstance.handlerDataAfterRunFormulasHidden(data);
                break;
            case "readOnly":
                controlInstance.handlerDataAfterRunFormulasReadonly(data);
                break;
            case "uniqueDB":
                controlInstance.handlerDataAfterRunFormulasUniqueDB(data, dataInput);
                break;
            case "uniqueTable":
                break;
            default:
                break;
        }
    }


    /**
     * Hàm lấy formulas của cell select -> chạy -> gán lại data cho autocomplete component
     */
    setSelectCell(event) {

        let controlInstance = listInputInDocument[this.currentControlSelected];
        if (controlInstance != null && controlInstance != undefined) {
            let controlFormulas = controlInstance.controlFormulas;
            if (controlFormulas.hasOwnProperty('formulas')) {
                let formulasInstance = controlFormulas['formulas'].instance;
                console.log(formulasInstance);
                SYMPER_APP.$evtBus.$emit('document-submit-select-input', {
                    e: event,
                    selectFormulasInstance: formulasInstance,
                    alias: this.currentControlSelected
                })
                SYMPER_APP.$evtBus.$emit('document-submit-autocomplete-key-event', {
                    e: event,
                    selectFormulasInstance: formulasInstance,
                    isSelect: true
                })
            }
        }
    }
    getCellSelectedType(col) {
        let columns = this.columnsInfo.columns;
        let column = columns[col];
        return column.type;

    }

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
            manualColumnMove: !thisObj.checkDetailView(),
            // manualRowMove: true,
            colHeaders: colHeaders,
            readOnly: thisObj.checkDetailView(),
            viewportColumnRenderingOffset: 50,
            // manualColumnFreeze: true,
            columns: thisObj.columnsInfo.columns,
            allowInsertColumn: false,
            allowRemoveColumn: false,
            columnHeaderHeight: 30,
            viewportRowRenderingOffset: 20,
            viewportColRenderingOffset: 20,
            contextMenu: (thisObj.checkDetailView()) ? false : ['row_above', 'row_below', 'remove_row', 'freeze_column', 'unfreeze_column'],
            dragToScroll: false,
            stretchH: 'all',
            formulas: true,
            autoRowSize: false,
            autoColSize: false,
            width: '100%',
            minSpareRows: (thisObj.checkDetailView()) ? 0 : 1,
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
        this.tableInstance.keyInstance = this.keyInstance;
        this.tableInstance.setCellMeta(2, 0, 'readOnly', true)
        if (!this.checkDetailView()) {
            for (let evtName in thisObj.event) {
                Handsontable.hooks.add(evtName, thisObj.event[evtName], this.tableInstance);
            }
        }

    }

    checkDetailView() {
            if (sDocument.state.viewType == 'detail') {
                return true;
            } else {
                return false;
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

            if (listInputInDocument[controlName].controlProperties.hasOwnProperty('isHidden') &&
                (listInputInDocument[controlName].controlProperties.isHidden.value == 1 ||
                    listInputInDocument[controlName].controlProperties.isHidden.value == "1")) {
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
            allowInvalid: true,
            renderer: this.validateRender
        }
        if (type == 'number') {
            rsl.numericFormat = {
                pattern: listInputInDocument[name].numberFormat
            };
        } else if (type == 'label' || ctrl.controlProperties.isReadOnly == 1) {
            rsl.readOnly = true;
        } else if (type == 'select') {
            rsl.editor = 'select';
        } else if (type == 'time') {
            rsl.timeFormat = 'HH:mm:ss',
                rsl.correctFormat = true;
        }
        rsl.type = Util.toLowerCaseFirstCharacter(supportCellsType[type].replace('Renderer', ''));

        return rsl;
    }
    validateRender(hotInstance, td, row, column, prop, value, cellProperties) {
            let inTable = listInputInDocument[prop].inTable;
            let thisObj = listTableInstance[inTable];
            if (row + 1 == hotInstance.countRenderedRows()) {
                if (value === null) {
                    arguments[5] = thisObj.sampleRowValues[prop];
                }
            }
            Handsontable.renderers[supportCellsType[listInputInDocument[prop].type]].apply(this, arguments);
            if (listInputInDocument[prop].isCheckbox) {
                td.style.textAlign = "center";
            }
            let map = thisObj.validateValueMap[row + '_' + column];
            if (map) {
                let sign = prop + '____' + row;
                let ele = $(td);

                if (map.vld === true) {
                    ele.append(Util.makeErrNoti(map.msg, sign));
                }
                if (map.uniqueDB === true) {
                    ele.append(Util.makeErrNoti(map.msg, sign));
                }
                if (map.require === true && (value === '' || value == null)) {
                    ele.css('position', 'relative').append(Util.requireRedDot(sign));
                }
                ele.off('click', '.validate-icon')
                ele.on('click', '.validate-icon', function(e) {
                    let msg = $(this).attr('title');
                    e.msg = msg;
                    SYMPER_APP.$evtBus.$emit('document-submit-open-validate-message', e)
                })
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
    checkUniqueTable(controlName) {
        let indexColumn = this.getColumnIndexFromControlName(controlName);
        let dataCol = this.tableInstance.getDataAtCol(indexColumn);
        let uniqueData = {}
        for (let index = 0; index < dataCol.length - 1; index++) {
            let row = dataCol[index];
            if (row == "" || row == null) {
                continue;
            }
            if (uniqueData.hasOwnProperty(row)) {
                this.validateValueMap[index + "_" + indexColumn] = { vld: true, msg: 'Trùng dữ liệu' }
            } else {
                uniqueData[row] = true;
                this.validateValueMap[index + "_" + indexColumn] = { vld: false, msg: 'Trùng dữ liệu' }
            }
        }
        this.tableInstance.render()
    }
}
import Util from './util'
import Handsontable from 'handsontable';
import sDocument from './../../../store/document'
import store from './../../../store'
import ClientSQLManager from './clientSQLManager';
import { checkDbOnly, getControlType, getSDocumentSubmitStore } from './../common/common'
import { SYMPER_APP } from './../../../main.js'
import { Date } from 'core-js';
import { checkCanBeBind, resetImpactedFieldsList, markBinedField } from './handlerCheckRunFormulas';
import { util } from '../../../plugins/util';
import moment from "moment-timezone";

class UserEditor extends Handsontable.editors.TextEditor {
    createElements() {
        super.createElements();
        this.TEXTAREA = this.hot.rootDocument.createElement('input');
        this.TEXTAREA.className = 'handsontableInput';
        this.TEXTAREA.setAttribute('data-hot-input', ''); // Makes the element recognizable by HOT as its own component's element.
        this.textareaStyle = this.TEXTAREA.style;
        this.textareaStyle.width = 0;
        this.textareaStyle.height = 0;
        Handsontable.dom.empty(this.TEXTAREA_PARENT);
        this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);
    }
    setValue(newValue) {
        this.TEXTAREA.value = newValue;
    }

}
class SelectEditor extends Handsontable.editors.TextEditor {
    createElements() {
        super.createElements();
        this.TEXTAREA = this.hot.rootDocument.createElement('input');
        this.TEXTAREA.className = 'handsontableInput';
        this.TEXTAREA.setAttribute('data-hot-input', ''); // Makes the element recognizable by HOT as its own component's element.
        Handsontable.dom.empty(this.TEXTAREA_PARENT);
        this.TEXTAREA_PARENT.appendChild(this.TEXTAREA);
    }
    setValue(newValue) {
        this.TEXTAREA.value = newValue;
    }

}


/**
 * Custom render cho control percent( phần trăm) cho table
 */
Handsontable.renderers.PercentRenderer = function(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.NumericRenderer.apply(this, arguments);
    td.style.textAlign = 'left'
    let table = store.state.document.submit[instance.keyInstance];
    td.textContent = (td.textContent == "" || td.textContent == null || !/\d/.test(td.textContent)) ? 0 + " %" : td.textContent + " %";
    if (row == instance.countRows() - 1 && table != undefined && instance.hasOwnProperty('tableName')) {
        let tableControl = table.listInputInDocument[instance.tableName];
        if (tableControl != undefined && tableControl.hasOwnProperty('tableInstance')) {
            let tableInstance = tableControl.tableInstance;
            if (tableInstance.tableHasRowSum) {
                td.textContent = "";
            }
        }

    }
}


Handsontable.cellTypes.registerCellType('percent', {
    editor: Handsontable.editors.TextEditor.prototype.extend(),
    renderer: Handsontable.renderers.PercentRenderer
});

//renderer user
Handsontable.renderers.UserRenderer = function(instance, td, row, col, prop, value, cellProperties) {
        Handsontable.renderers.TextRenderer.apply(this, arguments);
        if (!isNaN(value) && instance.hasOwnProperty('keyInstance')) {
            let listUser = store.state.app.allUsers;
            let user = listUser.filter(user => {
                return user.id === value
            })
            if (user.length > 0) {
                td.textContent = user[0].displayName
            }
        }
    }
    //renderer user
Handsontable.renderers.SelectRenderer = function(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    if (value == null) value = ""
    let div = `<div class="select-cell" style="position:relative;height:22px;width:100%;">` + value + `
                    <span class="select-chervon-bottom" style="position: absolute;right:8px;top:2px;font-size: 10px;color: #eee;">▼</span>
                </div>`
    $(td).off('click')
    $(td).on('click', function(e) {
        let tableControl = store.state.document.submit[instance.keyInstance].listInputInDocument[instance.tableName];
        let tableInstance = tableControl.tableInstance;
        tableInstance.setSelectCell(e)
    })
    let table = store.state.document.submit[instance.keyInstance];
    td.innerHTML = div;
    if (row == instance.countRows() - 1 && table != undefined && instance.tableName != undefined) {
        let tableControl = table.listInputInDocument[instance.tableName];
        if (tableControl != undefined && tableControl.hasOwnProperty('tableInstance')) {
            let tableInstance = tableControl.tableInstance;
            if (tableInstance.tableHasRowSum) {
                td.innerHTML = "";
            }
        }

    }
}

Handsontable.renderers.ValidateRenderer = function(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    if (!isNaN(value) && instance.hasOwnProperty('keyInstance')) {
        let listUser = store.state.document.submit[instance.keyInstance];

    }
}

Handsontable.cellTypes.registerCellType('select', {
    renderer: Handsontable.renderers.SelectRenderer,
    editor: SelectEditor
});

Handsontable.cellTypes.registerCellType('user', {
    editor: UserEditor,
    renderer: Handsontable.renderers.UserRenderer
});
Handsontable.renderers.FileRenderer = function(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    let table = store.state.document.submit[instance.keyInstance];
    if (table && instance.tableName) {
        let btnAdd = table.listInputInDocument[prop].genFileView(row);
        td.innerHTML = btnAdd;
        td.classList.add("upload-file-wrapper-inTb");
        $(td).off('click', '.file-add');
        if (sDocument.state.viewType[instance.keyInstance] != 'detail') {
            $(td).on('click', '.file-add', function(e) {
                let el = $(e.target).closest('.file-add');
                $("#file-upload-alter-" + instance.keyInstance).attr('data-rowid', row).attr('data-control-name', el.attr('data-ctrlname'));
                $("#file-upload-alter-" + instance.keyInstance).click();
            })
            $(td).off('click', '.remove-file')
            table.listInputInDocument[prop].setDeleteFileEvent($(td), prop)
        }
    }

}
Handsontable.cellTypes.registerCellType('file', {
    renderer: Handsontable.renderers.PercentRenderer
});
let listKeyCodeNotChange = [18, 17, 9, 20, 27, 16, 192, 91, 37, 38, 39, 40]
let listTableInstance = {}
const MAX_TABLE_HEIGHT = 500;

const makeDelay = function(ms) {
    var timer = 0;
    return function(callback) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
};
var delay = makeDelay(1000);
var delayTypingEnter = makeDelay(500);
var delayAfterInsertRow = makeDelay(1000);;


/**
 * Các loại cell mà handsontable hỗ trợ hiển thị
 */
const supportCellsType = {
    textInput: 'TextRenderer',
    department: 'TextRenderer',
    currency: 'NumericRenderer',
    number: 'NumericRenderer',
    date: 'DateRenderer',
    dateTime: 'DatetimeRenderer',
    time: 'TimeRenderer',
    image: 'FileRenderer',
    fileUpload: 'FileRenderer',
    label: 'TextRenderer',
    percent: 'PercentRenderer',
    user: 'UserRenderer',
    select: 'SelectRenderer',
    combobox: 'SelectRenderer',
    checkbox: 'CheckboxRenderer',
};

/** Đánh dấu set cell value là tự động điền chứ ko phải do user thay đổi  */
const AUTO_SET = 'auto_set';
export default class Table {
    constructor(control, tableName, controlId, keyInstance) {
        /**
         * Chứa object của Control tương ứng
         */
        this.controlObj = control;
        /**
         * Tên table tương ứng
         */
        this.tableName = tableName;
        /**
         * Biến lưu id element của control table
         */
        this.tableControlId = controlId

        let thisObj = this;

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
        /**
         * Biến lưu lại các cột được tích tính tổng
         */
        this.columnHasSum = {}

        /**
         * Biến đánh dấu table có dòng tính tổng hay không
         */
        this.tableHasRowSum = false;

        /**Tổng số dòng trong table */
        this.rowCount = 0;
        this.tableInstance = null;
        this.columnsInfo = null;
        this.keyInstance = keyInstance;
        this.reRendered = false;
        /**Danh sách các celltpye trong table */
        this.listCellType = {};
        this.isAutoCompleting = false;
        /**Chỉ ra tên của control nào đang setdata để callback sau khi setdata */
        this.controlNameAfterChange = "";
        this.showPopupUser = false;
        this.showPopupTime = false;
        this.dataInsertRows = []; // mảng lưu lại các dòng dữ liệu sau khi ấn enter
        this.currentControlSelected = null;
        this.cellSelected = null;
        this.listAutoCompleteColumns = {};
        this.event = {
            afterSelection: (row, column, row2, column2, preventScrolling, selectionLayerLevel) => {
                store.commit("document/addToDocumentSubmitStore", {
                    key: 'currentTableInteractive',
                    value: thisObj,
                    instance: thisObj.keyInstance
                });
                let cellMeta = this.tableInstance.getSelected();
                let columns = this.columnsInfo.columns;
                let columnIndex = cellMeta[0][1];
                let controlName = columns[columnIndex].data;
                this.currentControlSelected = controlName
            },


            beforeKeyDown: function(event) {
                let cellMeta = this.getSelected();
                if (!cellMeta) {
                    return;
                }
                thisObj.checkEnterInsertRowEvent(event, cellMeta);
                // ấn f2 vào cell thì trace control đó
                if (event.key == 'F2' && store.state.app.baInfo && Object.keys(store.state.app.baInfo).length > 0) {
                    let control = thisObj.getControlInstance(thisObj.currentControlSelected);
                    SYMPER_APP.$evtBus.$emit('document-submit-show-trace-control', { control: control });
                    return;
                }
                // trường hợp ấn enter mà ở dòng cuối cùng thì đưa cell selected vào đầu cột 1 (lỗi xảy ra do có 2 cột mặc định ẩn trong table)
                if (event.keyCode == 13 && thisObj.checkLastCell(cellMeta, this)) {
                    return;
                }
                // trường hợp ấn -> mà ở dòng cuối cùng thì đưa cell selected vào đầu cột 1 (lỗi xảy ra do có 2 cột mặc định ẩn trong table)
                if (event.keyCode == 39 && thisObj.checkLastCellInRow(cellMeta, this)) {
                    return;
                }
                if (thisObj.tableHasRowSum && cellMeta[0][0] == this.countRows() - 1) {
                    return;
                }
                if (event.ctrlKey || event.altKey || event.metaKey) {
                    return;
                }
                let columns = thisObj.columnsInfo.columns;
                let colHeaders = this.getColHeader();
                let columnIndex = cellMeta[0][1];
                let controlName = columns[columnIndex].data;

                if (thisObj.checkControlType('time', columnIndex)) {
                    if (event.keyCode == 13 && thisObj.showPopupTime) {
                        thisObj.showPopupTime = false;
                        event.stopImmediatePropagation();
                        event.stopPropagation();
                        event.preventDefault();
                    }
                    if ((event.keyCode == 40 || event.keyCode == 38 ||
                            event.keyCode == 37 || event.keyCode == 39) && thisObj.showPopupTime != false) {
                        event.stopImmediatePropagation();
                    }
                }
                if (thisObj.checkControlType('user', columnIndex)) { // nếu gõ vào control user thì autocomplete chọn user
                    if (event.keyCode == 13 && thisObj.showPopupUser) {
                        thisObj.showPopupUser = false;
                        event.curTarget = this.getActiveEditor().TEXTAREA;
                        SYMPER_APP.$evtBus.$emit('document-submit-user-input-change', event);
                        event.stopImmediatePropagation();
                        event.stopPropagation();
                        event.preventDefault();
                    }
                    // chặn bấm lên xuống trái phải khi có autocomplete
                    if ((event.keyCode == 40 || event.keyCode == 38 ||
                            event.keyCode == 37 || event.keyCode == 39) && thisObj.showPopupUser != false) {
                        event.stopImmediatePropagation();
                    }
                    if (listKeyCodeNotChange.includes(event.keyCode) && !thisObj.showPopupUser) {
                        return;
                    }
                    if (event.keyCode != 13) {
                        setTimeout((hot) => {
                            thisObj.showPopupUser = true;
                            event.curTarget = hot.getActiveEditor().TEXTAREA;
                            SYMPER_APP.$evtBus.$emit('document-submit-user-input-change', event)
                        }, 50, this);
                    }
                }
                if (thisObj.checkControlType('department', columnIndex)) {
                    if (event.keyCode == 13) {
                        return;
                    }
                    if (thisObj.listAutoCompleteColumns[thisObj.currentControlSelected] != false) {
                        // nếu đang auto complete mà gõ các kí tư lên xuống hay sang trái phải thì chặn sự kiện mặc định của handson
                        // để có thể di chuyển lên xuống trong poup
                        if ((event.keyCode == 40 || event.keyCode == 38 ||
                                event.keyCode == 37 || event.keyCode == 39) && thisObj.isAutoCompleting) {
                            event.stopImmediatePropagation();
                        }
                        if (event.key == 'Tab') { // trường hợp ấn tab trong table thì đóng popup
                            let e = util.cloneDeep(event);
                            e.keyCode = 200;
                            SYMPER_APP.$evtBus.$emit('document-submit-department-key-event', {
                                e: e,
                            })
                        }
                        if (listKeyCodeNotChange.includes(event.keyCode)) {
                            return;
                        }
                        // hoangnd: cần set timeout ở đây tại vì cần thực hiện đoạn này sau khi keydown hoàn tất thì input mới có dữ liệu
                        setTimeout(() => {
                            let columns = thisObj.columnsInfo.columns;
                            let formulasInstance = thisObj.listAutoCompleteColumns[thisObj.currentControlSelected]
                            event.rowIndex = cellMeta[0][0];
                            let colHeaders = this.getColHeader();
                            let columnIndex = cellMeta[0][1];
                            event.curTarget = this.getActiveEditor().TEXTAREA;
                            SYMPER_APP.$evtBus.$emit('document-submit-department-key-event', {
                                e: event,
                                formulasInstance: formulasInstance,
                                controlTitle: colHeaders[columnIndex],
                                controlName: columns[columnIndex].data
                            })
                        }, 50);
                    }
                } else {
                    if (event.keyCode == 13) {
                        return;
                    }
                    if (thisObj.listAutoCompleteColumns[thisObj.currentControlSelected] != false) {

                        // nếu đang auto complete mà gõ các kí tư lên xuống hay sang trái phải thì chặn sự kiện mặc định của handson
                        // để có thể di chuyển lên xuống trong poup
                        if ((event.keyCode == 40 || event.keyCode == 38 ||
                                event.keyCode == 37 || event.keyCode == 39) && thisObj.isAutoCompleting) {
                            event.stopImmediatePropagation();
                        }
                        if (event.key == 'Tab') { // trường hợp ấn tab trong table thì đóng popup
                            let e = util.cloneDeep(event);
                            e.keyCode = 200;
                            SYMPER_APP.$evtBus.$emit('document-submit-autocomplete-key-event', {
                                e: e,
                            })
                        }
                        if (listKeyCodeNotChange.includes(event.keyCode)) {
                            return;
                        }
                        // hoangnd: cần set timeout ở đây tại vì cần thực hiện đoạn này sau khi keydown hoàn tất thì input mới có dữ liệu
                        setTimeout(() => {
                            let formulasInstance = thisObj.listAutoCompleteColumns[thisObj.currentControlSelected]
                            event.rowIndex = cellMeta[0][0];
                            event.curTarget = this.getActiveEditor().TEXTAREA;
                            SYMPER_APP.$evtBus.$emit('document-submit-autocomplete-key-event', {
                                e: event,
                                autocompleteFormulasInstance: formulasInstance,
                                isSelect: false,
                                controlTitle: colHeaders[columnIndex],
                                controlName: controlName
                            })
                        }, 50);
                    }
                }
            },
            /**
             * Xử lí khi click vào cell 
             * với trường hợp là control time thì mở popup timepicker
             * @param {*} event 
             * @param {*} coords 
             * @param {*} TD 
             */
            afterOnCellMouseDown: function(event, coords, TD) {
                let columns = thisObj.columnsInfo.columns;
                if (columns[coords.col] && thisObj.cellSelected == columns[coords.col].data) {
                    // nếu type cell là time thì emit qua submit mở timepicker
                    if (thisObj.getCellSelectedType(coords.col) == 'time') {
                        setTimeout((self) => {
                            var activeEditor = self.getActiveEditor();
                            self.selectCell(coords.row, coords.col);
                            activeEditor.beginEditing();
                            activeEditor.TEXTAREA.value = (activeEditor.originalValue == undefined) ? "" : activeEditor.originalValue
                            thisObj.showPopupTime = true;
                            event.controlName = columns[coords.col].data
                            event.curTarget = activeEditor.TEXTAREA
                            SYMPER_APP.$evtBus.$emit('document-submit-show-time-picker', event);
                        }, 50, this);
                        // activeEditor.enableFullEditoMode();
                    };
                }
                if (columns[coords.col]) {
                    thisObj.cellSelected = columns[coords.col].data;
                }
                SYMPER_APP.$evtBus.$emit("symper-app-wrapper-clicked", event);

            },
            /**
             * Sau khi chọn vào bảng thì đánh dấu doc chuyển qua chế độ input(phục vụ cho việc check process công thức)
             * @param {*} row 
             * @param {*} col 
             */
            afterSelectionEnd: function(row, col) {
                store.commit("document/addToDocumentSubmitStore", {
                    key: 'docStatus',
                    value: 'input',
                    instance: thisObj.keyInstance
                });
            },

            /**
             * Sau khi thay đổi giá trị trong bảng thì cần update hoặc insert lại vào bảng sql lite
             * @param {*} changes 
             * @param {*} source 
             */
            afterChange: function(changes, source) {
                SYMPER_APP.$evtBus.$emit('symper-submit-on-table-change', {
                    data: this.getSourceData(),
                    tableName:thisObj.tableName
                });
                if (thisObj.isAutoCompleting) {
                    return;
                }
                if (!changes) {
                    return
                }
                // check nếu ko có thay đổi trong cell thì return
                if (changes[0][2] == changes[0][3]) {
                    return;
                }
                if (!changes[0][2] && !changes[0][3]) {
                    return;
                }
                if (getSDocumentSubmitStore(thisObj.keyInstance).docStatus == 'init' &&
                    sDocument.state.viewType[thisObj.keyInstance] == 'update') {
                    return;
                }

                if (/=SUM(.*)/.test(changes[0][2]) || /=SUM(.*)/.test(changes[0][3])) {
                    return;
                }

                let controlName = changes[0][1];
                let colIndex = this.propToCol(controlName);
                let columns = thisObj.columnsInfo.columns;
                let currentRowData = thisObj.tableInstance.getDataAtRow(changes[0][0]);

                // nếu có sự thay đổi cell mà là id của row sqlite thì ko thực hiện update
                if (controlName != 's_table_id_sql_lite') {

                    thisObj.checkUniqueTable(controlName, columns);
                    if (source != AUTO_SET) {
                        store.commit("document/addToDocumentSubmitStore", {
                            key: 'rootChangeFieldName',
                            value: controlName,
                            instance: thisObj.keyInstance
                        });
                        resetImpactedFieldsList(thisObj.keyInstance);
                    }
                    let currentColData = thisObj.tableInstance.getDataAtCol(colIndex);
                    if (thisObj.tableHasRowSum) {
                        currentColData.pop();
                    }
                    columns = columns.map(function(c) {
                        return c.data;
                    });
                    if (thisObj.checkControlType('time', colIndex)) {
                        currentColData = thisObj.getTimeValueToStore(currentColData);
                        store.commit("document/updateListInputInDocument", {
                            controlName: controlName,
                            key: 'value',
                            value: currentColData,
                            instance: this.keyInstance
                        });
                    } else {
                        store.commit("document/updateListInputInDocument", {
                            controlName: controlName,
                            key: 'value',
                            value: currentColData,
                            instance: this.keyInstance
                        });

                    }
                    if (source == "edit") {
                        thisObj.handlerAfterChangeCellByUser(changes, currentRowData, columns, controlName);
                    } else {
                        thisObj.handlerAfterChangeCellByAutoSet(changes, columns, controlName);
                    }
                    let controlUnique = checkDbOnly(thisObj.keyInstance, controlName);
                    if (controlUnique != false) {
                        let dataInput = {}
                        dataInput[controlName] = [changes[0][3]]
                        thisObj.handlerRunFormulasForControlInTable('uniqueDB', controlUnique, dataInput, controlUnique.controlFormulas.uniqueDB.instance);
                    }
                    thisObj.isAutoCompleting = false;

                }

            }
        }
        listTableInstance[this.tableName] = this;
    }
        /**
         * Hàm xử lí thêm và xóa dòng sau khi bấm shift + enter, shift + delete
         * @param {*} e 
         */

    checkEnterInsertRowEvent(e, cellMeta) {
        if (!e) {
            return;
        }
        // nếu shift + enter ở dòng tính tổng thì ko làm gì cả
        if (this.tableHasRowSum && cellMeta[0][0] == this.tableInstance.countRows() - 1) {
            return;
        }
        if (e.key === 'Enter' && e.shiftKey === true && cellMeta != undefined) {
            this.tableInstance.alter('insert_row', cellMeta[0][0] + 1, 1, 'auto_set');
            this.dataInsertRows.push([]);
            let thisObj = this;
            delayTypingEnter(function() {
                let listRootTable = sDocument.state.submit[thisObj.keyInstance]['listTableRootControl'];
                if (listRootTable.hasOwnProperty(thisObj.tableName)) {
                    let rowData = util.cloneDeep(listRootTable[thisObj.tableName]['defaultRow']);
                    for (let index = 0; index < thisObj.dataInsertRows.length; index++) {
                        let newRowData = util.cloneDeep(rowData);
                        for (let i = 0; i < newRowData.length; i++) {
                            newRowData[i][0] = cellMeta[0][0] + index + 1;
                        }
                        thisObj.tableInstance.setDataAtRowProp(newRowData, null, null, 'auto_set');
                    }
                }
                thisObj.dataInsertRows = []
            });
        } else if (e.key === 'Delete' && e.shiftKey == true) {
            e.stopImmediatePropagation();
            e.preventDefault();
            e.stopPropagation();
            this.tableInstance.alter('remove_row', cellMeta[0][0], 1);
        }
    }
    // kiểm tra nếu đang edit ở cell cuối cùng mà ấn enter thì cho cell selected về dòng đầu tiên (lỗi do control hidden)
    checkLastCell(cellMeta, hotTb) {
        if (!this.showPopupTime && !this.showPopupUser) {
            let colLength = hotTb.getDataAtRow(0).length;
            let rowLength = hotTb.countRows();
            if (cellMeta[0][1] == colLength - 3 && rowLength - 1 == cellMeta[0][0]) {
                hotTb.selectCell(0, 0, 0, 0, true);
                return true
            }
            return false
        }
        return false
    }
    // kiểm tra nếu đang edit ở cell cuối cùng mà ấn enter thì cho cell selected về dòng đầu tiên (lỗi do control hidden)
    checkLastCellInRow(cellMeta, hotTb) {
        if (!this.showPopupTime && !this.showPopupUser) {
            let colLength = hotTb.getDataAtRow(0).length;
            if (cellMeta[0][1] == colLength - 3) {
                hotTb.selectCell(cellMeta[0][0], 0, 0, 0, true);
                return true
            }
            return false
        }
        return false
    }
    // chuyển giá trị control time về dạng HH:MM:ss để lưu vào db
    getTimeValueToStore(colData) {
        for (let index = 0; index < colData.length; index++) {
            let cellData = colData[index];
            if (cellData == null) {
                continue;
            }
            cellData = cellData.replace(' AM', ":00");
            cellData = cellData.replace(' PM', ":00");
            colData[index] = cellData

        }
        return colData
    }
    /**
     * Hàm xử lí dữ liệu thay đổi ở cell bởi hệ thống (hàm set data của handson)
     */
    async handlerAfterChangeCellByAutoSet(changes, columns, controlName) {
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
                await ClientSQLManager.insertRow(thisObj.keyInstance, thisObj.tableName, columns, rowData, true);
                if (index == changes.length - 1) {
                    thisObj.handlerCheckEffectedControlInTable(controlName, "all");
                }
            } else {
                await ClientSQLManager.editRow(thisObj.keyInstance, thisObj.tableName, colChange[1], colChange[3],
                    'WHERE s_table_id_sql_lite = ' + rowData[rowData.length - 1], true);
                if (index == changes.length - 1) {
                    thisObj.handlerCheckEffectedControlInTable(controlName, "all");
                }
            }
        }
    }
    /**
     * Hàm xử lí dữ liệu thay đổi ở cell bởi User edit (hàm set data của handson)
     */
    async handlerAfterChangeCellByUser(changes, currentRowData, columns, controlName) {
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
            thisObj.controlNameAfterChange = controlName
            thisObj.tableInstance.setDataAtCell(changes[0][0], currentRowData.length - 1, id);
        } else {
            await ClientSQLManager.editRow(thisObj.keyInstance, thisObj.tableName, controlName, changes[0][3],
                'WHERE s_table_id_sql_lite = ' + currentRowData[currentRowData.length - 1], true)
            thisObj.handlerCheckEffectedControlInTable(controlName, changes[0][0]);

        }
    }


    /**
     * Hàm kiểm tra cột của bảng ứng với kiểu control nào
     * @param {*} type 
     * @param {*} col 
     */
    checkControlType(type, col) {
        let columns = this.columnsInfo.columns;
        if (columns[col] == undefined) {
            return false;
        }
        let controlName = columns[col].data;
        let controlInstance = this.getControlInstance(controlName);
        if (controlInstance.type == type) {
            return true;
        } else {
            return false;
        }
    }
    /**
     * Hàm kiểm tra xem cell có công thức autocomplete hay không
     * @param {String} controlName 
     */

    checkIsAutocompleteCell(controlName) {
        let controlInstance = this.getControlInstance(controlName);
        if (controlInstance != null && controlInstance != undefined) {
            let controlFormulas = controlInstance.controlFormulas;
            if (controlFormulas.hasOwnProperty('autocomplete')) {
                let formulasInstance = controlFormulas['autocomplete'].instance;
                if (formulasInstance == undefined) {
                    return false;
                }
                return formulasInstance;
            }
        }
        return false;
    }

    /**
     * Sau khi thay đổi giá trị 1 cell thì lấy các control bị ảnh hưởng và chạy công thức
     * @param {*} controlName 
     * @param {*} rowIndex 
     */
    handlerCheckEffectedControlInTable(controlName, rowIndex = "") {
        if (controlName == "") {
            return
        }
        let controlInstance = this.getControlInstance(controlName);
        if (controlInstance.checkValidValueLength(rowIndex)) {
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
            this.handlerRunOtherFormulasControl(controlLinkEffected, 'linkConfig');
            this.handlerRunOtherFormulasControl(controlValidateEffected, 'validate');
            if (Object.keys(controlEffected).length > 0) {
                for (let i in controlEffected) {
                    this.handlerCheckCanBeRunFormulas(i);
                }
            }
        }

    }
    /**
     * chạy các công thức khác bị ảnh hưởng trong table
     * @param {*} controlEffected 
     * @param {*} formulasType 
     */
    handlerRunOtherFormulasControl(controlEffected, formulasType) {
        if (Object.keys(controlEffected).length > 0) {
            for (let i in controlEffected) {
                let controlEffectedInstance = this.getControlInstance(i);
                let allFormulas = controlEffectedInstance.controlFormulas;
                if (allFormulas.hasOwnProperty(formulasType)) {
                    if (formulasType == 'linkConfig') { // nếu có cấu hình công thức link thì cũng chạy các công thức của nó
                        let configData = allFormulas[formulasType].configData;
                        for (let ind = 0; ind < configData.length; ind++) {
                            let config = configData[ind];
                            let formulasInstance = config.instance;
                            let dataInput = this.getDataInputForFormulas(formulasInstance, controlEffectedInstance.inTable);
                            let fType = formulasType + "_" + config.formula.instance;
                            this.handlerRunFormulasForControlInTable(fType, controlEffectedInstance, dataInput, formulasInstance)
                        }
                    } else {
                        if (allFormulas[formulasType].hasOwnProperty('instance')) {
                            let formulasInstance = allFormulas[formulasType].instance;
                            let dataInput = this.getDataInputForFormulas(formulasInstance, controlEffectedInstance.inTable);
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
    }
    /**
     * Hàm xử lí kiểm tra control đủ điều kiện chạy công thức hay chưa (checkCanBeBind) và lấy ra formulasInstance để chạy
     * @param {String} control 
     */
    handlerCheckCanBeRunFormulas(control) {
        if (checkCanBeBind(this.keyInstance, control)) {
            let controlInstance = this.getControlInstance(control);
            if (controlInstance.controlFormulas.hasOwnProperty('formulas')) {
                let formulasInstance = controlInstance.controlFormulas['formulas'].instance;
                if (controlInstance.type != 'table') {
                    if (controlInstance.inTable == this.tableName) {
                        let dataInput = this.getDataInputForFormulas(formulasInstance, controlInstance.inTable);
                        this.handlerRunFormulasForControlInTable('formulas', controlInstance, dataInput, formulasInstance);
                    } else {
                        SYMPER_APP.$evtBus.$emit('run-formulas-control-outside-table', {
                            formulasInstance: formulasInstance,
                            controlName: control
                        });
                    }
                } else {
                    SYMPER_APP.$evtBus.$emit('run-formulas-control-outside-table', {
                        formulasInstance: formulasInstance,
                        controlName: control
                    });
                }
            }
        }


    }
    /**
     * Hàm lấy các data input cho 1 công thức
     * @param {Object} formulasInstance đối tượng của công thức 
     */
    getDataInputForFormulas(formulasInstance, tableName = false) {
        let inputControl = formulasInstance.getInputControl();
        let dataInput = {};
        let listInputInDocument = this.getListInputInDocument();
        for (let inputControlName in inputControl) {
            if (listInputInDocument.hasOwnProperty(inputControlName)){
                dataInput[inputControlName] = listInputInDocument[inputControlName].value;
                if(listInputInDocument[inputControlName].type == 'date'){
                    dataInput[inputControlName] = listInputInDocument[inputControlName].convertDateToStandard(listInputInDocument[inputControlName].value)
                }
            }
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
        let listIdRow = this.tableInstance.getDataAtCol(this.tableInstance.getDataAtRow(0).length - 1);
        if (this.tableHasRowSum) {
            listIdRow.pop();
        }
        let dataPost = {};
        let thisObj = this;
        /***
         * Chuẩn bị data để gọi api thực thi công thức cho các control trong table
         */
        if (Object.keys(dataInput).length > 0) {
            let allRowDataInput = [];
            for (let control in dataInput) {
                let controlType = getControlType(thisObj.keyInstance, control);
                let dataRow = dataInput[control];
                if (!Array.isArray(dataRow)) {
                    for (let index = 0; index < listIdRow.length; index++) {
                        if (allRowDataInput.length <= index) {
                            allRowDataInput[index] = {};
                        }
                        if (controlType == 'number') {
                            if (dataRow == null) {
                                dataRow = 0
                            } else {
                                dataRow = Number(dataRow);
                            }
                        }
                        if (controlType == 'percent') {
                            if (dataRow == null) {
                                dataRow = 0
                            } else {
                                dataRow = Number(dataRow);
                            }
                        }
                        allRowDataInput[index][control] = dataRow;
                    }
                } else {
                    for (let i = 0; i < dataRow.length; i++) {
                        if (allRowDataInput.length <= i) {
                            allRowDataInput[i] = {};
                        }
                        let value = dataRow[i];
                        if (controlType == 'number') {
                            if (value == null) {
                                value = 0
                            } else {
                                value = Number(value);
                            }
                        }
                        if (controlType == 'percent') {
                            if (value == null) {
                                value = 0
                            } else {
                                value = Number(value);
                            }
                        }
                        allRowDataInput[i][control] = value;
                    }
                }
            }
            for (let index = 0; index < allRowDataInput.length; index++) {
                let rowInput = allRowDataInput[index];
                dataPost[listIdRow[index]] = rowInput;
            }
        } else {
            for (let index = 0; index < listIdRow.length; index++) {
                dataPost[listIdRow[index]] = "";
            }
        }
        let dataForStore = [];
        try {
            await formulasInstance.getDataMultiple(dataPost).then(res => {
                if (res == undefined || !res.hasOwnProperty('data')) {
                    return;
                }
                if (formulasType == 'formulas') {
                    let data = res.data;
                    dataForStore = Object.values(data);
                    let vls = [];
                    for (let index = 0; index < listIdRow.length; index++) {
                        const element = listIdRow[index];
                        vls.push([index, controlInstance.name, data[element]]);
                    }

                    thisObj.tableInstance.setDataAtRowProp(vls, null, null, 'auto_set');
                    /**
                     * Sau khi chạy xong công thức thì đánh dấu là control đã bind giá trị
                     */
                    markBinedField(thisObj.keyInstance, controlInstance.name);
                    store.commit("document/updateListInputInDocument", {
                        controlName: controlInstance.name,
                        key: 'value',
                        value: dataForStore,
                        instance: this.keyInstance
                    });
                } else {
                    this.handlerDataAfterRunFormulas(res.data, controlInstance, formulasType);
                }
            })
        } catch (error) {
            console.log(error,'errorerror');
        }


    }
    /**
     * Hàm lấy dữ liệu hiện tại của table và insert vào sql lite table
     */

    getDataResponseQuery(rs, controlType = "") {
        let result = "";
        if (controlType == 'table') {
            if (!rs.server) {
                let data = rs.data;
                if (data.length > 0) {
                    result = data[0]
                }
            } else {
                result = rs.data.data;

            }
        } else {
            if (!rs.server) {
                let data = rs.data;
                if (data.length > 0) {
                    result = data[0].values[0][0];
                }
            } else {
                let data = rs.data.data;
                if (data.length > 0) {
                    result = data[0][Object.keys(data[0])[0]];
                }
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
        if (formulasType.includes('linkConfig')) {
            controlInstance.handlerDataAfterRunFormulasLink(data, formulasType);
        }
        switch (formulasType) {
            case "formulas":
                controlInstance.handlerDataAfterRunFormulasValue(data);
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
        let controlInstance = this.getControlInstance(this.currentControlSelected);
        if (controlInstance != null && controlInstance != undefined) {
            let controlFormulas = controlInstance.controlFormulas;
            if (controlFormulas.hasOwnProperty('list')) {
                let formulasInstance = controlFormulas['list'].instance;
                event.curTarget = event.target;
                let cellActive = this.tableInstance.getSelected();
                SYMPER_APP.$evtBus.$emit('document-submit-select-input', {
                    e: event,
                    selectFormulasInstance: formulasInstance,
                    alias: this.currentControlSelected,
                    cellActive: cellActive,
                    controlTitle: controlInstance.title,
                    type: controlInstance.type,
                    isSingleSelect: controlInstance.checkProps('isSingleSelect')
                })
            }
        }
    }
    /**
     * Hàm lấy type của cột được select
     */
    getCellSelectedType(col) {
        let columns = this.columnsInfo.columns;
        let column = columns[col];
        if (column == undefined) {
            return false
        }
        return column.type;

    }

    render() {
        let thisObj = this;
        let tableContainer = $('<div id="' + thisObj.controlObj.id + '" s-control-type="table"></div>')[0];
        thisObj.controlObj.ele.before(tableContainer);
        thisObj.tableContainer = $(tableContainer);
        thisObj.columnsInfo = this.getColumnsInfo();

        let colHeaders = thisObj.columnsInfo.headerNames;
        thisObj.colHeaders = colHeaders;
        let defaultData = this.getDefaultData();
        this.tableInstance = new Handsontable(tableContainer, {
            rowHeaders: true,
            filters: true,
            dropdownMenu: true,
            licenseKey: 'non-commercial-and-evaluation',
            manualColumnResize: true,
            manualRowResize: true,
            hiddenColumns: {
                columns: thisObj.columnsInfo.hiddenColumns,
                indicators: true
            },
            data: defaultData,
            manualColumnMove: !thisObj.checkDetailView(),
            colHeaders: colHeaders,
            readOnly: thisObj.checkDetailView(),
            columns: thisObj.columnsInfo.columns,
            allowInsertColumn: false,
            allowRemoveColumn: false,
            contextMenu: (thisObj.checkDetailView()) ? false : thisObj.getContextMenu(),
            stretchH: 'all',
            autoRowSize: false,
            autoColSize: true,
            width: '100%',
            fixedRowsBottom: (thisObj.tableHasRowSum) ? 1 : 0,
            formulas: true,
            height: 'auto',
            afterRender: function(isForced) {

                let tbHeight = this.container.getElementsByClassName('htCore')[0].getBoundingClientRect().height;
                if (tbHeight < MAX_TABLE_HEIGHT) {
                    $(this.rootElement).css('height', 'auto');
                } else {
                    $(this.rootElement).css('height', MAX_TABLE_HEIGHT);
                }
                if (!this.reRendered) {
                    this.reRendered = true;
                    setTimeout((hotTb) => {
                        if (thisObj.tableHasRowSum) {
                            thisObj.setDataForSumRow();
                            for (let index = 0; index < hotTb.getDataAtRow(0).length; index++) {
                                hotTb.setCellMeta(hotTb.countRows() - 1, index, 'readOnly', true);
                            }
                        }
                        hotTb.render();
                    }, 500, this);
                }
            },
            afterGetRowHeader: function(row, TH) {
                if (thisObj.tableHasRowSum && row === this.countRows() - 1) {
                    $(TH).text('Tổng').css({ 'font-weight': 'bold' });
                }
            },

            /**
             * Trường hợp có dòng tính tổng trong table thì cần đặt lại công thức cho dòng cuối cùng tính tổng
             * @param {*} i 
             * @param {*} amount 
             */
            beforeCreateRow: function(i, amount) {
                let hotTb = this;
                delay(function(e) {
                    if (thisObj.tableHasRowSum) {
                        thisObj.setDataForSumRow()
                        for (let index = 0; index < hotTb.getDataAtRow(0).length; index++) {
                            hotTb.setCellMeta(hotTb.countRows() - 1, index, 'readOnly', true);
                            hotTb.setCellMeta(hotTb.countRows() - 2, index, 'readOnly', false);
                        }
                    }
                });
            },
            /**
             * Sau khi set data cho 1 cell thì cần insert data này vào bảng sql lite
             * set xong chạy công thức cho control bị ảnh hưởng
             * @param {*} changes 
             * @param {*} source 
             */
            afterSetDataAtCell: function(changes, source) {
                if (changes.length == 0) {
                    return
                }
                if (changes[0][1] == 's_table_id_sql_lite' && !thisObj.checkDetailView()) {
                    setTimeout(() => {
                        let currentRowData = thisObj.tableInstance.getDataAtRow(changes[0][0]);
                        let columns = thisObj.columnsInfo.columns;
                        columns = columns.map(function(c) {
                            return c.data;
                        });

                        ClientSQLManager.insertRow(thisObj.keyInstance, thisObj.tableName, columns, currentRowData, true).then(res => {
                            thisObj.handlerCheckEffectedControlInTable(thisObj.controlNameAfterChange, changes[0][0]);
                        })
                    }, 10);
                } else if (source == 'timeValidator') {

                } else if (isNaN(changes[0][3]) && changes[0][3].includes("=SUM")) {
                    setTimeout((self) => {
                        self.render()
                    }, 500, this);
                }

            },
            /**
             * Sau khi create row thì set id cho dòng đó (cột id này là cột ẩn)
             * id ở đây là định danh trong bảng sql lite 
             * @param {*} index 
             * @param {*} amount 
             * @param {*} source 
             */
            afterCreateRow: function(index, amount, source) {
                let hotTable = this;
                delayAfterInsertRow(function() {
                    let colData = hotTable.getDataAtCol(hotTable.getDataAtRow(0).length - 1);
                    let vls = [];
                    for (let index = 0; index < colData.length; index++) {
                        let id = Date.now() + index;
                        let cellValue = colData[index];
                        if(!cellValue){
                            vls.push([index, 's_table_id_sql_lite', id]);
                        }
                    }
                    thisObj.tableInstance.setDataAtRowProp(vls, null, null, 'auto_set');
                });
            },
            afterRemoveRow: function(index, amount, physicalRows, source) {
                let listInput = thisObj.getListInputInDocument();
                let rowData = this.getDataAtRow(index);
                console.log(rowData, 'rowDatarowData');
                let rowId = rowData[rowData.length - 1]
                for (let controlName in thisObj.controlObj.listInsideControls) {
                    let controlInstance = listInput[controlName];
                    let controlValue = util.cloneDeep(controlInstance.value);
                    if (Array.isArray(controlValue)) {
                        controlValue.splice(index, 1);
                        store.commit("document/updateListInputInDocument", {
                            controlName: controlName,
                            key: 'value',
                            value: controlValue,
                            instance: thisObj.keyInstance
                        });

                    }
                }
                ClientSQLManager.deleteRow(thisObj.keyInstance, thisObj.tableName, 'where s_table_id_sql_lite = ' + rowId);
                let pattern = index + '_\\d';
                let reg = new RegExp(pattern, 'g');
                for (let key in thisObj.validateValueMap) {
                    if (reg.test(key)) {
                        delete thisObj.validateValueMap[key]
                    }
                }
                this.render();

            },

        });

        this.tableInstance.keyInstance = this.keyInstance;
        this.tableInstance.tableName = this.tableName;
        if (!this.checkDetailView()) {
            for (let evtName in thisObj.event) {
                Handsontable.hooks.add(evtName, thisObj.event[evtName], this.tableInstance);
            }
        }
    }

    /**
     * Context menu cho handson table trong view nhập liệu
     */
    getContextMenu() {
        return {
            callback: function(key, selection, clickEvent) {
                if (key == 'row_below') {
                    var indexArr = this.getSelected();
                    var selectedData = this.getDataAtRow(indexArr[0]);

                    this.populateFromArray(indexArr[2] + 1, 0, [selectedData]);
                } else if (key == 'row_above') {
                    var indexArr = this.getSelected();
                    var selectedData = this.getDataAtRow(indexArr[0]);

                    this.populateFromArray(indexArr[2] - 1, 0, [selectedData]);
                }
            },
            items: {

                "row_above": {
                    name: "Thêm dòng phía trên"
                },
                "row_below": {
                    name: "Thêm dòng phía dưới"
                },
                'remove_row': {
                    name: "Xóa dòng",
                    callback: function(key, selection, clickEvent) { // Callback for specific option
                        setTimeout(function(hotTb) {
                            hotTb.alter(key, selection[0]['start']['row'], 1);
                        }, 0, this);
                    }
                },
                "fixedLeft": {
                    name: "Cố định cột",
                    callback: function(key, selection, clickEvent) { // Callback for specific option
                        let col = selection[0]['start']['col'];
                        setTimeout(function(hotTb) {
                            hotTb.updateSettings({
                                fixedColumnsLeft: col + 1
                            })
                            hotTb.render()
                        }, 0, this);
                    }
                },
                "unFixedLeft": {
                    name: "Bỏ cố định cột",
                    callback: function(key, selection, clickEvent) { // Callback for specific option
                        setTimeout(function(hotTb) {
                            hotTb.updateSettings({
                                fixedColumnsLeft: null
                            })
                            hotTb.render()
                        }, 0, this);
                    }
                },

            }
        }

    }


    // Hàm set data cho table
    // hàm gọi sau khi chạy công thức 
    setData(vls, dateFormat = true) {
        ClientSQLManager.delete(this.keyInstance, this.tableName, false);
        if (vls != false) {
            let data = vls;
            let controlBinding = Object.keys(data[0]);
            let dataToStore = {};
            let dataToSqlLite = [];
            let columnInsert = [];
            for (let index = 0; index < data.length; index++) {
                let rowId = Date.now() + index;
                data[index]['s_table_id_sql_lite'] = rowId;

                let listKey = Object.keys(data[index]);
                columnInsert = listKey;
                let rowData = [];
                for (let j = 0; j < listKey.length; j++) {
                    let controlName = listKey[j];
                    rowData.push("'" + data[index][controlName] + "'");
                    if (controlName == 's_table_id_sql_lite') {
                        continue;
                    }
                    if (!dataToStore.hasOwnProperty(controlName)) {
                        dataToStore[controlName] = [];
                    }
                    let controlIns = this.getControlInstance(controlName);
                    if (dateFormat && controlIns.type == 'date') {
                        data[index][controlName] = moment(data[index][controlName], 'YYYY-MM-DD').format(controlIns.controlProperties.formatDate.value);
                    }
                    if (data[index] != undefined)
                        dataToStore[controlName].push(data[index][controlName]);
                }
                dataToSqlLite.push('(' + rowData.join() + ')');
            }
            ClientSQLManager.insertDataToTable(this.keyInstance, this.tableName, columnInsert.join(), dataToSqlLite.join())
            for (let controlName in dataToStore) {
                store.commit("document/updateListInputInDocument", {
                    controlName: controlName,
                    key: 'value',
                    value: dataToStore[controlName],
                    instance: this.keyInstance
                });
            }
            // nếu table có tính tổng thì thêm 1 dòng trống ở cuối
            if (this.tableHasRowSum && ['submit', 'update'].includes(sDocument.state.viewType[this.keyInstance])) {
                data.push({})
            }

            this.tableInstance.updateSettings({
                data: data
            })
            setTimeout((self) => {
                self.tableInstance.render()
            }, 50, this);
            // sau khi đổ dữ liệu vào table thì ko chạy các sự kiện của table nên cần chạy công thức cho các control liên quan sau khi đỏ dữ liệu
            if (!this.checkDetailView())
                setTimeout((self) => {
                    for (let index = 0; index < controlBinding.length; index++) {
                        self.handlerCheckEffectedControlInTable(controlBinding[index], 'all');
                    }
                    self.setDataForSumRow();
                }, 50, this);

        } else {
            let defaultRow = this.getDefaultData(false);
            this.tableInstance.loadData(defaultRow);
            this.setDataForSumRow();
        }
    }
    /**
     * Hàm đặt lại giá trị cho hàm tính tổng khi có thay đổi về giá trị cũng như số row của table
     */
    setDataForSumRow() {
        if (this.tableHasRowSum) {
            setTimeout((self) => {
                for (let controlName in self.columnHasSum) {
                    let colIndex = self.getColumnIndexFromControlName(controlName);
                    let CharAt = String.fromCharCode(65 + self.columnHasSum[controlName]);
                    let sumValue = '=SUM(' + CharAt + '1:' + CharAt + '' + (self.tableInstance.countRows() - 1) + ')';
                    self.tableInstance.setDataAtCell(self.tableInstance.countRows() - 1, colIndex, sumValue);
                }
            }, 300, this);
        }
    }
    /**
     * Kiểm tra xem đang ở view detail hay submit
     */
    checkDetailView() {
        if (sDocument.state.viewType[this.keyInstance] == 'detail') {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Hàm lấy data default lúc load table
     */
    getDefaultData(isCreateSqlTable = true) {
        if (isCreateSqlTable && !this.checkDetailView())
            this.createSqliteTable();
        let data = [];
        let firstRow = {};
        let id = Date.now();
        firstRow['s_table_id_sql_lite'] = id;
        data.push(firstRow);
        if (this.tableHasRowSum && sDocument.state.viewType[this.keyInstance] == 'submit') {
            data.push([''])
        }
        if (!this.checkDetailView()) {
            ClientSQLManager.insertRow(this.keyInstance, this.tableName, ['s_table_id_sql_lite'], [id], false);
        }
        return data;
    }
    /**
     * Hàm khởi tạo bảng sql lite
     */
    async createSqliteTable() {
        let columns = this.columnsInfo.columns;
        columns = columns.reduce((str, obj) => {
            let type = obj.type;
            if (type != 'text' && type != 'numeric') {
                type = 'text';
            }
            if (obj.data == 's_table_id_sql_lite' || obj.data == 'childObjectId') {
                type = 'integer'
            }
            str += obj.data + " " + type + ",";
            return str
        }, "")
        columns = columns.substring(0, columns.length - 1);
        await ClientSQLManager.createTable(this.keyInstance, this.tableName, columns, "", "");

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
            let controlInstance = this.getControlInstance(controlName)
            let cellType = thisObj.getCellType(controlName, controlInstance);
            this.listAutoCompleteColumns[controlName] = this.checkIsAutocompleteCell(controlName)
            thisObj.listCellType[controlName] = cellType;
            columns.push(cellType);
            //Khởi tạo giá trị cho dòng mới
            thisObj.sampleRowValues[controlName] = controlInstance.getDefaultValue();
            //Đánh số thứ tự các cột trong bảng
            thisObj.colName2Idx[controlName] = num;
            //ẩn cột
            let controlProp = controlInstance.controlProperties;
            if (controlProp.hasOwnProperty('isHidden') &&
                (controlProp.isHidden.value == 1 ||
                    controlProp.isHidden.value === true ||
                    controlProp.isHidden.value == "1")) {
                hiddenColumns.push(num);
            }
            if (controlProp.hasOwnProperty('isSumTable') &&
                (controlProp.isSumTable.value == 1 ||
                    controlProp.isSumTable.value === true ||
                    controlProp.isSumTable.value == "1")) {
                thisObj.columnHasSum[controlName] = num;
                thisObj.tableHasRowSum = true;
            }
            num += 1;

        }
        // thêm cột ẩn là id của sqllite
        columns.push({ data: 'childObjectId', type: 'numeric', renderer: function() {} });
        columns.push({ data: 's_table_id_sql_lite', type: 'numeric', renderer: function() {} });
        hiddenColumns.push(columns.length - 2);
        hiddenColumns.push(columns.length - 1);
        return {
            headerNames: headerName,
            columns: columns,
            hiddenColumns: hiddenColumns
        }
    }

    /**
     * Hàm lấy type của cột (type control)
     * @param {*} name 
     * @param {*} control 
     */
    getCellType(name, control) {
        let type = control.type;
        let ctrl = this.getControlInstance(name);
        let rsl = {
            data: name,
            type: type,
            allowInvalid: true,
            renderer: this.validateRender
        }
        if (type == 'number') {
            rsl.numericFormat = {
                pattern: ctrl.controlProperties.formatNumber.value
            };
        } else if (type == 'label' || type == 'select') {
            rsl.readOnly = true;

        } else if (type == 'time') {
            rsl.timeFormat = 'HH:mm A',
                rsl.correctFormat = true;

        } else if (type == 'date') {
            rsl.dateFormat = ctrl.controlProperties.formatDate.value;
            rsl.correctFormat = true;
        }

        if (ctrl.controlProperties.isReadOnly && ctrl.controlProperties.isReadOnly.value == true) {
            rsl.readOnly = true;
        }
        rsl.type = Util.toLowerCaseFirstCharacter(supportCellsType[type].replace('Renderer', ''));

        return rsl;
    }

    /**
     * Xử lí render validate của table
     * @param {*} hotInstance 
     * @param {*} td 
     * @param {*} row 
     * @param {*} column 
     * @param {*} prop 
     * @param {*} value 
     * @param {*} cellProperties 
     */
    validateRender(hotInstance, td, row, column, prop, value, cellProperties) {
        let tableName = "";
        for (let tbName in listTableInstance) {
            let allColumn = listTableInstance[tbName].colName2Idx;
            if (allColumn.hasOwnProperty(prop)) {
                tableName = tbName;
                break;
            }
        }

        let thisObj = listTableInstance[tableName];
        let control = thisObj.getControlInstance(prop);
        if (row + 1 == hotInstance.countRenderedRows()) {
            if (value === null) {
                arguments[5] = thisObj.sampleRowValues[prop];
            }
        }
        Handsontable.renderers[supportCellsType[control.type]].apply(this, arguments);
        if (control.isCheckbox) {
            td.style.textAlign = "center";
        }
        let map = thisObj.validateValueMap[row + '_' + column];
        let controlTitle = (control.title == "") ? control.name : control.title;
        if (map) {
            let sign = prop + '____' + row;
            let ele = $(td);
            if (map.type === 'linkControl') {
                ele.css({ 'position': 'relative' }).append(Util.renderInfoBtn());
                ele.off('click', '.info-control-btn')
                ele.on('click', '.info-control-btn', function(e) {
                    SYMPER_APP.$evtBus.$emit('on-info-btn-in-table-click', { e: e, row: row, controlName: control.name })
                })
            }
            if (map.vld === true) {
                ele.css({ 'position': 'relative' }).append(Util.makeErrNoti(map.msg, sign, controlTitle));
            }
            if (map.validate === true) {
                ele.css({ 'position': 'relative' }).append(Util.makeErrNoti(map.msg, sign, controlTitle));
            }
            if (map.uniqueDB === true) {
                ele.css({ 'position': 'relative' }).append(Util.makeErrNoti(map.msg, sign, controlTitle));
            }
            if (map.require === true && (value === '' || value == null)) {
                ele.css({ 'position': 'relative' }).append(Util.makeErrNoti("Không được bỏ trống", sign, controlTitle));
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
     * validate time đúng định dạng hay k
     * @param {*} str 
     */
    checkCellIsTime(str) {
            var patt = new RegExp("^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$", "g");
            return patt.test(str)
        }
        /**
         * lấy column index của table theo tên
         * @param {*} name 
         */
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
    getListInputInDocument() {
        return getSDocumentSubmitStore(this.keyInstance).listInputInDocument;
    }
    getControlInstance(controlName) {
            return getSDocumentSubmitStore(this.keyInstance).listInputInDocument[controlName];
        }
        /**
         * Hàm xử lí giá trị duy nhất trong table
         * trùng sẽ thông báo lỗi
         * @param {*} controlName 
         */
    checkUniqueTable(controlName) {
        let controlInstance = this.getControlInstance(controlName);
        if (controlInstance.controlProperties.hasOwnProperty('isTableOnly') &&
            (controlInstance.controlProperties.isTableOnly.value == 1 ||
                controlInstance.controlProperties.isTableOnly.value === true ||
                controlInstance.controlProperties.isTableOnly.value == "1")) {
            let controlTitle = (controlInstance.title == "") ? controlInstance.name : controlInstance.title;
            let tableName = controlInstance.inTable;
            let tableInstance = this.getControlInstance(tableName);
            let tableTitle = (tableInstance.title == "") ? tableInstance.name : tableInstance.title;
            let indexColumn = this.getColumnIndexFromControlName(controlName);
            let dataCol = this.tableInstance.getDataAtCol(indexColumn);
            let uniqueData = {}
            for (let index = 0; index < dataCol.length - 1; index++) {
                let row = dataCol[index];
                if (row == "" || row == null) {
                    continue;
                }
                if (uniqueData.hasOwnProperty(row)) {
                    this.validateValueMap[index + "_" + indexColumn] = { vld: true, msg: 'Trùng dữ liệu cột ' + controlTitle + " trong table " + tableTitle }
                } else {
                    uniqueData[row] = true;
                    this.validateValueMap[index + "_" + indexColumn] = { vld: false, msg: 'Trùng dữ liệu cột ' + controlTitle + " trong table " + tableTitle }
                }
            }
            this.tableInstance.render()
        }
    }

    /**
     * Hàm thêm class thay đổi backgroud cho header của table
     * @param {*} colName tên cột 
     * @param {*} className class cần thêm
     * @param {*} isRemove xóa class hay ko
     */
    traceInputTable(colName, className, isRemove) {
        let colIndex = this.getColumnIndexFromControlName(colName);
        let setting = {
            afterGetColHeader: function(col, TH) {
                function applyClass(elem, className) {
                    if (!Handsontable.dom.hasClass(elem, className)) {
                        Handsontable.dom.addClass(elem, className);
                    }
                }

                function removeClass(elem) {
                    Handsontable.dom.removeClass(elem, 'trace-output-control');
                    Handsontable.dom.removeClass(elem, 'trace-input-control');
                    Handsontable.dom.removeClass(elem, 'trace-current-control');
                }
                if (isRemove) {
                    if (colIndex == col) {
                        removeClass(TH)
                    }
                } else {
                    if (colIndex == col) {
                        applyClass(TH, className)
                    }
                }

            }
        }
        this.tableInstance.updateSettings(setting);
        this.tableInstance.scrollViewportTo(0, colIndex)
    }
    show(){
        this.tableContainer[0].style.maxHeight = 'unset';
        this.tableContainer[0].style.opacity = '1';
    }
    hide(){
        this.tableContainer[0].style.opacity = '0';
        this.tableContainer[0].style.maxHeight = '0';
    }
}
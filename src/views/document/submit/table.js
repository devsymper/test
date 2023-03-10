import Util from './util'
import Handsontable from 'handsontable';
import sDocument from './../../../store/document'
import store from './../../../store'
import { checkControlPropertyProp, getControlType, getSDocumentSubmitStore,getControlInstanceFromStore, minimizeDataAfterRunFormula } from './../common/common'
import { SYMPER_APP } from './../../../main.js'
import { checkCanBeBind, resetImpactedFieldsList, markBinedField, checkDataInputChange, setDataInputBeforeChange } from './handlerCheckRunFormulas';
import { util } from '../../../plugins/util';

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
    td.textContent = (td.textContent == "" || td.textContent == null || !/\d/.test(td.textContent)) ? "" : td.textContent + " %";
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
    $(td).off('click','.select-chervon-bottom')
    $(td).on('click','.select-chervon-bottom', function(e) {
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
                SYMPER_APP.$evtBus.$emit('document-submit-add-file-click', { control: table.listInputInDocument[prop] });
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
var delayTypingEnter = makeDelay(1000);
var delayTypingDelete = makeDelay(500);
var delayAfterInsertRow = makeDelay(1000);;


/**
 * Các loại cell mà handsontable hỗ trợ hiển thị
 */
const supportCellsType = {
    textInput: 'TextRenderer',
    richText: 'TextRenderer',
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
        this.formulasWorker = null;
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
                SYMPER_APP.$evtBus.$emit('document-on-table-change', {
                    data: this.getSourceData(),
                    tableName: thisObj.tableName
                });
                if (!changes) {
                    return
                }
                let controlName = changes[0][1];
                
                // check nếu ko có thay đổi trong cell thì return
                if (changes[0][2] == changes[0][3] && source == 'edit') {
                    return;
                }
                console.log(changes, source,'changes, source');

                /********* lưu giá trị trước khi thay đổi cua 1 cell và các cell bị ảnh hưởng để kiểm tra sự thay đổi của datainput  
                *   tương ứng với chạy công thức từng dòng thì data sẽ là giá trị, từng cột là 1 mảng giá trị của cả cột  
                */
                let controlIns = getControlInstanceFromStore(thisObj.keyInstance, controlName);
                let rowIndexChange = null;
                if(source == 'Autofill.fill' && changes.length == 1){
                    rowIndexChange = changes[0][0]; 
                }
                if(source == 'CopyPaste.paste' && changes.length == 1){
                    rowIndexChange = changes[0][0];
                }
                if(source == 'edit' && changes[0][1] != 's_table_id_sql_lite'){
                    rowIndexChange = changes[0][0];
                }
                if(['Autofill.fill','CopyPaste.paste','edit'].includes(source)){
                    setDataInputBeforeChange(thisObj.keyInstance, controlIns, rowIndexChange, changes[0][2]);
                }
                /**********end */
                if (getSDocumentSubmitStore(thisObj.keyInstance).docStatus == 'init' &&
                    sDocument.state.viewType[thisObj.keyInstance] == 'update') {
                    return;
                }
                if (thisObj.isAutoCompleting) {
                    return;
                }
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
                        thisObj.handlerAfterChangeCellByUser(changes, currentRowData, controlName);
                    } else {
                        thisObj.handlerAfterChangeCellByAutoSet(changes, columns, controlName);
                    }
                    thisObj.handeRunUniqueDBFormula(controlName, changes);
                    thisObj.isAutoCompleting = false;

                }

            }
        }
        listTableInstance[this.tableName] = this;
    }
    setFormulasWorker(formulasWorker){
        this.formulasWorker = formulasWorker;
    }

    handeRunUniqueDBFormula(controlName, changes) {
        let dataInput = {}
        dataInput[controlName] = [changes[0][3]]
        let controlUniqueFormula = checkControlPropertyProp(this.keyInstance, controlName, 'isDBOnly');
        if (controlUniqueFormula != false) {
            this.handleRunFormulaForControlInTable(controlUniqueFormula, dataInput, controlUniqueFormula.controlFormulas.uniqueDB.instance);
        }

    }

    /**
     * Hàm xử lí thêm và xóa dòng sau khi bấm shift + enter, shift + delete
     * @param {*} e 
     */

    checkEnterInsertRowEvent(e, cellMeta) {
        // if(!this.controlObj.controlProperties.isInsertRow.value){
        //     return;
        // }
        if (!e) {
            return;
        }
        // nếu shift + enter ở dòng tính tổng thì ko làm gì cả
        if (this.tableHasRowSum && cellMeta[0][0] == this.tableInstance.countRows() - 1) {
            return;
        }
        
        let thisObj = this;
        if (e.key === 'Enter' && e.shiftKey === true && cellMeta != undefined) {
            e.stopImmediatePropagation();
            e.preventDefault();
            e.stopPropagation();
            this.tableInstance.alter('insert_row', cellMeta[0][0] + 1, 1, 'auto_set');
            this.dataInsertRows.push([]);
            delayTypingEnter(function() {
                let listRootTable = sDocument.state.submit[thisObj.keyInstance]['listTableRootControl'];
                if (listRootTable.hasOwnProperty(thisObj.tableName)) {
                    let rowData = util.cloneDeep(listRootTable[thisObj.tableName]['defaultRow']);
                    for (let index = 0; index < thisObj.dataInsertRows.length; index++) {
                        let newRowData = util.cloneDeep(rowData);
                        let rowBinding = [];
                        for (let i = 0; i < newRowData.length; i++) {
                            if(newRowData[i][2] != null && newRowData[i][2] != undefined){
                                let newRowData = util.cloneDeep(rowData);
                                newRowData[i][0] = cellMeta[0][0] + index + 1;
                                rowBinding.push(newRowData[i]);
                            }
                        }
                        if(rowBinding.length > 0){
                            thisObj.tableInstance.setDataAtRowProp(rowBinding, null, null, 'auto_set');
                        }
                    }
                }
                thisObj.dataInsertRows = [];
            });
            
        } else if (e.key === 'Delete' && e.shiftKey == true) {
            e.stopImmediatePropagation();
            e.preventDefault();
            e.stopPropagation();
            let index = cellMeta[0][0];
            // chặn không được xóa dòng cuối cùng
            if(index == 0 && (this.tableInstance.countRows() == 1 || (this.tableInstance.countRows() == 2 && this.tableHasRowSum))){
                return;
            }
            let listInput = this.getListInputInDocument();
            let rowData = this.tableInstance.getDataAtRow(index);
            console.log(rowData,index, 'rowDatarowData');
            let rowId = rowData[rowData.length - 1]
            for (let controlName in this.controlObj.listInsideControls) {
                let controlInstance = listInput[controlName];
                let controlValue = util.cloneDeep(controlInstance.value);
                if (Array.isArray(controlValue)) {
                    controlValue.splice(index, 1);
                    store.commit("document/updateListInputInDocument", {
                        controlName: controlName,
                        key: 'value',
                        value: controlValue,
                        instance: this.keyInstance
                    });
                }
            }
            this.formulasWorker.postMessage({action:'executeSQliteDB',data:
                {
                    func:'deleteRow',condition:'where s_table_id_sql_lite = ' + rowId,keyInstance:this.keyInstance, tableName: this.tableName
                }
            })
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
        let rowIndex = [];
        if(this.isChangeMultipleCellOnRow(changes)){
            rowIndex.push(changes[0][0]);
            let rowData = this.tableInstance.getDataAtRow(changes[0][0]);
            if (!rowData[rowData.length - 1]) {
                let id = Date.now();
                rowData[rowData.length - 1] = id;
                this.tableInstance.setDataAtCell(changes[0][0], rowData.length - 1, id);
                this.formulasWorker.postMessage({action:'executeSQliteDB',data:
                    {
                        func:'insertRow',
                        columns:columns, 
                        rowData:rowData,
                        keyInstance:this.keyInstance, 
                        tableName: this.tableName,
                        isPromise:true
                    }
                })
            } else {
                for (let index = 0; index < changes.length; index++) {
                    const col = changes[index];
                    this.formulasWorker.postMessage({action:'executeSQliteDB',data:
                        {
                            func:'editRow',
                            columns:col[1], 
                            value:col[3],
                            condition:'WHERE s_table_id_sql_lite = ' + rowData[rowData.length - 1],
                            keyInstance:this.keyInstance, 
                            tableName: this.tableName,
                            isPromise:true
                        }
                    })
                }
            }
        }
        else{
            for (let index = 0; index < changes.length; index++) {
                let colChange = changes[index];
                rowIndex.push(colChange[0]);
                let rowData = this.tableInstance.getDataAtRow(colChange[0]);
                for (let i = 0; i < rowData.length; i++) {
                    let cell = rowData[i];
                    if (cell == "" || cell == null) {
                        rowData[i] = 'NULL';
                    } else {
                        rowData[i] = '"' + rowData[i] + '"'
                    }
                }
                if (rowData[rowData.length - 1] == 'NULL') {
                    let id = Date.now();
                    rowData[rowData.length - 1] = id;
                    this.tableInstance.setDataAtCell(colChange[0], rowData.length - 1, id);
                    this.formulasWorker.postMessage({action:'executeSQliteDB',data:
                        {
                            func:'insertRow',
                            columns:columns, 
                            rowData:rowData,
                            keyInstance:this.keyInstance, 
                            tableName: this.tableName,
                            isPromise:false
                        }
                    })
                } else {
                    this.formulasWorker.postMessage({action:'executeSQliteDB',data:
                        {
                            func:'editRow',
                            columns:colChange[1], 
                            value:colChange[3],
                            condition:'WHERE s_table_id_sql_lite = ' + rowData[rowData.length - 1],
                            keyInstance:this.keyInstance, 
                            tableName: this.tableName,
                            isPromise:true
                        }
                    })
                }
            } 
        }
        this.handlerCheckEffectedControlInTable(controlName, rowIndex);
    }
    /**
     * Hàm kiểm tra xem có phải edit nhiều cell trên 1 dòng hay không
     * @param {} changes 
     */
    isChangeMultipleCellOnRow(changes){
        if(changes && changes.length > 0){
            let oldData = changes[0][0];
            for (let index = 1; index < changes.length; index++) {
                let item = changes[index];
                if(item[0] != oldData){
                    return false
                }
            }
        }
        return true;
        
    }
    /**
     * Hàm xử lí dữ liệu thay đổi ở cell bởi User edit (hàm set data của handson)
     */
    async handlerAfterChangeCellByUser(changes, currentRowData, controlName) {
        for (let index = 0; index < currentRowData.length; index++) {
            let cell = currentRowData[index];
            if (cell == "" || cell == null) {
                currentRowData[index] = 'NULL';
            } else {
                currentRowData[index] = '"' + currentRowData[index] + '"'
            }
        }
        this.formulasWorker.postMessage({action:'executeSQliteDB',data:
            {
                func:'editRow',
                columns:controlName, 
                value:changes[0][3],
                condition:'WHERE s_table_id_sql_lite = ' + currentRowData[currentRowData.length - 1],
                keyInstance:this.keyInstance, 
                tableName: this.tableName
            }
        })
        this.handlerCheckEffectedControlInTable(controlName, [changes[0][0]]);

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
    handlerCheckEffectedControlInTable(controlName, rowIndex = null) {
        if (controlName == "") {
            return
        }
        let controlInstance = this.getControlInstance(controlName);
        if (controlInstance.checkValidValueLength(rowIndex)) {
            if (controlInstance == null || controlInstance == undefined) {
                return;
            }
            let controlEffected = controlInstance.getEffectedControl();
            let controlReadonlyEffected = controlInstance.getEffectedReadonlyControl();
            let controlRequireEffected = controlInstance.getEffectedRequireControl();
            let controlLinkEffected = controlInstance.getEffectedLinkControl();
            let controlValidateEffected = controlInstance.getEffectedValidateControl();
            controlRequireEffected[controlName] = true;
            controlValidateEffected[controlName] = true;
            controlReadonlyEffected[controlName] = true;
            this.handlerRunOtherFormulasControl(controlReadonlyEffected, 'readOnly', rowIndex);
            this.handlerRunOtherFormulasControl(controlRequireEffected, 'require', rowIndex);
            this.handlerRunOtherFormulasControl(controlLinkEffected, 'linkConfig', rowIndex);
            this.handlerRunOtherFormulasControl(controlValidateEffected, 'validate', rowIndex);
            if (Object.keys(controlEffected).length > 0) {
                for (let i in controlEffected) {
                    this.handlerCheckCanBeRunFormulas(i,rowIndex);
                }
            }
        }
    }
    /**
     * chạy các công thức khác bị ảnh hưởng trong table
     * @param {*} controlEffected 
     * @param {*} formulasType 
     */
    handlerRunOtherFormulasControl(controlEffected, formulasType, rowIndex) {
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
                            let dataInput = this.getDataInputForFormulas(formulasInstance, rowIndex);
                            let fType = formulasType + "_" + config.formula.instance;
                            this.handleRunFormulaForControlInTable(controlEffectedInstance, dataInput, formulasInstance, rowIndex)
                        }
                    } else {
                        if (allFormulas[formulasType].hasOwnProperty('instance')) {
                            let formulasInstance = allFormulas[formulasType].instance;
                            let dataInput = this.getDataInputForFormulas(formulasInstance, rowIndex);
                            if (controlEffectedInstance.hasOwnProperty('inTable')) {
                                if (controlEffectedInstance.inTable == this.tableName) {
                                    this.handleRunFormulaForControlInTable(controlEffectedInstance, dataInput, formulasInstance, rowIndex);
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
    handlerCheckCanBeRunFormulas(control, rowIndex) {
        if (checkCanBeBind(this.keyInstance, control)) {
            let controlInstance = this.getControlInstance(control);
            if (controlInstance.controlFormulas.hasOwnProperty('formulas')) {
                let formulaInstance = controlInstance.controlFormulas['formulas'].instance;
                if (controlInstance.type != 'table') {
                    if (controlInstance.inTable == this.tableName) {
                        let dataInput = this.getDataInputForFormulas(formulaInstance, rowIndex);
                        this.handleRunFormulaForControlInTable(controlInstance, dataInput, formulaInstance, rowIndex);
                    } else {
                        SYMPER_APP.$evtBus.$emit('run-formulas-control-outside-table', {
                            formulaInstance: formulaInstance,
                            controlName: control
                        });
                    }
                }
                else {
                    SYMPER_APP.$evtBus.$emit('run-formulas-control-outside-table', {
                        formulaInstance: formulaInstance,
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
    getDataInputForFormulas(formulasInstance, rowIndex = null) {
        let inputControl = formulasInstance.getInputControl();
        let dataInput = {};
        let listInputInDocument = this.getListInputInDocument();
        for (let inputControlName in inputControl) {
            if(inputControlName == 'document_object_id'){
                let docObjId = sDocument.state.submit[this.keyInstance]['documentObjectId'];
                dataInput[inputControlName] = (docObjId) ? docObjId : '';
            }
            else{
                let controlIns = listInputInDocument[inputControlName];
                if(!controlIns){
                    dataInput[inputControlName] = "";
                }
                else{
                    if(controlIns.inTable != false){
                        let colIndex = this.tableInstance.propToCol(inputControlName);
                        let currentColData = '';
                        if(rowIndex != 'all' && rowIndex.length == 1){
                            currentColData = this.tableInstance.getDataAtCell(rowIndex, colIndex);
                        }
                        else if(rowIndex == 'all'){
                            currentColData = this.tableInstance.getDataAtCol(colIndex);
                            if(this.tableHasRowSum){
                                currentColData.pop();
                            }
                        }
                        else if(rowIndex.length > 1){
                            let listRowData = [];
                            currentColData = this.tableInstance.getDataAtCol(colIndex);
                            for (let index = 0; index < rowIndex.length; index++) {
                                let rowInd = rowIndex[index];
                                let rowData = currentColData[rowInd];
                                listRowData.push(rowData);
                                
                            }
                            currentColData = listRowData;
                        }
                        dataInput[inputControlName] = currentColData;
                    }
                    else{
                        if (listInputInDocument.hasOwnProperty(inputControlName)){
                            dataInput[inputControlName] = controlIns.value;
                        }
                    }
                    if(controlIns.type == 'date'){
                        dataInput[inputControlName] = controlIns.convertDateToStandard(dataInput[inputControlName])
                    }
                    if(controlIns.type == 'time'){
                        dataInput[inputControlName] = controlIns.convertTimeToStandard(dataInput[inputControlName])
                    }
                }
                
            }
        }
        return dataInput;
    }

    /**
     * Xử lí data sau khi chạy công thức
     * @param {*} res 
     * @param {*} formulasType 
     * @param {*} controlInstance 
     * @param {*} dataRowId 
     * @param {*} from 
     */
    afterRunFormula(res, formulasType, controlInstance, dataRowId,from){
        switch (from) {
            case 'rowTable':
                this.prepareDataAfterRunFormulaOnRow(res, formulasType, controlInstance, dataRowId);
                break;
            case 'columnTable':
                this.prepareDataAfterRunFormulaOnColumn(res, formulasType, controlInstance, dataRowId)
                break;
            default:
                break;
        }
    }
    /**
     * Xử lí data sau khi chạy công thức theo dòng
     * data gửi lên từ worker
     * @param {*} res 
     * @param {*} formulasType 
     * @param {*} controlInstance 
     * @param {*} sqlRowId 
     */
    prepareDataAfterRunFormulaOnRow(res, formulasType, controlInstance, sqlRowId){
        if (res == undefined || !res.hasOwnProperty('data')) {
            return;
        }
        let value = minimizeDataAfterRunFormula(res);
        this.handleDataAfterRunFormula(value, controlInstance, formulasType, sqlRowId);
    }
    /**
     * Xử lí data sau khi chạy công thức theo cột
     * data gửi lên từ worker
     * @param {*} res 
     * @param {*} formulasType 
     * @param {*} controlInstance 
     * @param {*} sqlRowId 
     */
    prepareDataAfterRunFormulaOnColumn(res, formulasType, controlInstance, listIdRow){
        if (res == undefined || !res.hasOwnProperty('data')) {
            return;
        }
        this.handleDataAfterRunFormula(res.data, controlInstance, formulasType,null,listIdRow);
    }
    
     /**
     * Hàm xử lí chạy công thức theo từng dòng trong bảng
     * @param {*} controlEffectedInstance   Object của 1 control bị ảnh hưởng
     * @param {*} dataInput    dữ liệu đầu vào cho công  thức
     * @param {*} formulasInstance  Object cua formulas giá trị của control bị ảnh hưởng
     * @param {*} controlInstance  control đang chạy công thức
     * 
     */
    handleRunFormulaOnRow(controlInstance, dataInput, formulaInstance, rowIndex){
        let listSqlRowId = this.tableInstance.getDataAtProp('s_table_id_sql_lite');
        let sqlRowId = listSqlRowId[rowIndex];
        this.formulasWorker.postMessage({action:'runFormula',data:
            {
                formulaInstance:formulaInstance, 
                keyInstance:this.keyInstance,
                controlName:controlInstance.name, 
                from:'rowTable', 
                sqlRowId:sqlRowId, 
                rowIndex:rowIndex,
                dataInput:dataInput
            }
        });

    }
    handleRunFormulaOnColumn( controlInstance, dataInput, formulaInstance){
        let listIdRow = this.tableInstance.getDataAtCol(this.tableInstance.getDataAtRow(0).length - 1);
        if (this.tableHasRowSum) {
            listIdRow.pop();
        }
        this.formulasWorker.postMessage({action:'runFormula',data:
            {
                formulaInstance:formulaInstance, 
                controlName:controlInstance.name, 
                from:'columnTable', 
                keyInstance:this.keyInstance,
                listIdRow:listIdRow, 
                controlType:controlInstance.type,
                dataInput:dataInput
            }
        });
        
    }
    /**
     * Hàm xử lý tối ưu chạy công thức khi có nhiều dòng thay đổi
     * nếu các datainput giống nhau chỉ đẩy vào data chạy 1 lần 
     */
    handleRunFormulaOnRowChange(controlInstance, dataInput, formulaInstance, rowIndex){
        let listIdRow = [];
        for (let index = 0; index < rowIndex.length; index++) {
            let rowInd = rowIndex[index];
            let rowData = this.tableInstance.getDataAtRow(rowInd);
            listIdRow.push(rowData[rowData.length - 1]);
            
        }
        this.formulasWorker.postMessage({action:'runFormula',data:
            {
                formulaInstance:formulaInstance, 
                controlName:controlInstance.name, 
                from:'columnTable', 
                keyInstance:this.keyInstance,
                listIdRow:listIdRow, 
                controlType:controlInstance.type,
                dataInput:dataInput
            }
        });
    }

    /**
     * Hàm xử lí chạy công thức theo cột trong bảng
     * @param {*} controlEffectedInstance   Object của 1 control bị ảnh hưởng
     * @param {*} dataInput    dữ liệu đầu vào cho công  thức
     * @param {*} formulaInstance  Object cua formulas giá trị của control bị ảnh hưởng
     * @param {*} controlInstance  control đang chạy công thức
     * 
     */
    handleRunFormulaForControlInTable(controlInstance, dataInput, formulaInstance, rowIndex = null) {
        let sDocumentSubmit = getSDocumentSubmitStore(this.keyInstance);
        if(!checkDataInputChange(sDocumentSubmit.rootChangeFieldName, sDocumentSubmit.dataInputBeforeChange, dataInput)){
            return;
        }
        if(rowIndex.length == 1 && rowIndex != "all"){
            this.handleRunFormulaOnRow(controlInstance, dataInput, formulaInstance, rowIndex);
        }
        else if(rowIndex == "all"){
            this.handleRunFormulaOnColumn(controlInstance, dataInput, formulaInstance)
        }
        else{
            this.handleRunFormulaOnRowChange(controlInstance, dataInput, formulaInstance, rowIndex);
        }
        
    }
    
    /**
     * Hàm xử lí dữ liệu sau khi chạy xong công thức của 1 cột, -> set data cho cột đó -> chạy công thức cho các control ngoài bảng bị ảnh hưởng
     * @param {Object} data 
     * @param {String} controlEffectedName 
     */
    handleDataAfterRunFormula(data, controlInstance, formulasType, rowIndex = null, listIdRow = false) {
        if (formulasType.includes('linkConfig')) {
            controlInstance.handlerDataAfterRunFormulasLink(data, formulasType);
        }
        switch (formulasType) {
            case "formulas":
                controlInstance.handlerDataAfterRunFormulasValue(data, listIdRow, rowIndex);
                break;
            case "validate":
                controlInstance.handlerDataAfterRunFormulasValidate(data, listIdRow, rowIndex);
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
                controlInstance.handlerDataAfterRunFormulasUniqueDB(data, rowIndex);
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
        let tableContainer = $('<div id="' + this.controlObj.id + '" s-control-type="table"></div>')[0];
        this.controlObj.ele.before(tableContainer);
        this.tableContainer = $(tableContainer);
        this.columnsInfo = this.getColumnsInfo();
        let colHeaders = this.columnsInfo.headerNames;
        this.colHeaders = colHeaders;
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
            contextMenu: (thisObj.checkDetailView()) ? false : (thisObj.controlObj.controlProperties.isInsertRow.value?thisObj.getContextMenu('all'):thisObj.getContextMenu('exceptRow')),
            stretchH: 'all',
            autoRowSize: false,
            autoColSize: false,
            viewportRowRenderingOffset:200,
            width: '100%',
            formulas:true,
            fixedRowsBottom: (thisObj.tableHasRowSum) ? 1 : 0,
            height: 'auto',
            afterRender: function(isForced) {
                let tbHeight = this.container.getElementsByClassName('htCore')[0].getBoundingClientRect().height;
                if (tbHeight < MAX_TABLE_HEIGHT) {
                    $(this.rootElement).css('height', 'auto');
                } else {
                    $(this.rootElement).css('height', MAX_TABLE_HEIGHT);
                }
            },
            afterGetRowHeader: function(row, TH) {
                if (thisObj.tableHasRowSum && row === this.countRows() - 1) {
                    $(TH).text('Tổng').css({ 'font-weight': 'bold' });
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
                        if (!cellValue) {
                            vls.push([index, 's_table_id_sql_lite', id]);
                            thisObj.formulasWorker.postMessage({action:'executeSQliteDB',data:
                                {
                                    func:'insertRow',
                                    columns:['s_table_id_sql_lite'], 
                                    rowData:[id],
                                    keyInstance:thisObj.keyInstance, 
                                    tableName: thisObj.tableName
                                }
                            })
                        }
                    }
                    thisObj.tableInstance.setDataAtRowProp(vls, null, null, 'auto_set');
                });
            },
            afterRemoveRow: function(index, amount, physicalRows, source) {
                let pattern = index + '_\\d';
                let reg = new RegExp(pattern, 'g');
                for (let key in thisObj.validateValueMap) {
                    if (reg.test(key)) {
                        delete thisObj.validateValueMap[key]
                    }
                }
                this.render();
            },
            // sau khi đổ dữ liệu vào table thì ko chạy các sự kiện của table nên cần chạy công thức cho các control liên quan sau khi đỏ dữ liệu

            afterUpdateSettings(newSettings){
                if (!thisObj.checkDetailView()){
                    if(thisObj.checkViewType('update') && getSDocumentSubmitStore(thisObj.keyInstance).docStatus == 'init'){
                        return;
                    }
                    if(newSettings.data && newSettings.data.length > 0){
                        let controlBinding = Object.keys(newSettings.data[0]);
                        for (let index = 0; index < controlBinding.length; index++) {
                            if(controlBinding[index] != 's_table_id_sql_lite'){
                                thisObj.handlerCheckEffectedControlInTable(controlBinding[index], 'all');
                            }
                        }
                    }
                }
            }
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
    getContextMenu(value) {
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
                    name: "Thêm dòng phía trên",
                    hidden: function () {
                        return  value == "exceptRow";
                    }
                },
                "row_below": {
                    name: "Thêm dòng phía dưới",
                    hidden: function () {
                        return  value == "exceptRow";
                    }
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
    getSourceData() {
        return this.tableInstance.getSourceData();
    }
    // Hàm set data cho table
    // hàm gọi sau khi chạy công thức 
    setData(vls, dateFormat = true) {
        if(this.formulasWorker){
            this.formulasWorker.postMessage({action:'executeSQliteDB',data:
                {
                    func:'delete',
                    keyInstance:this.keyInstance, 
                    tableName: this.tableName,
                }
            })
        }
        
        if (vls != false) {
            let data = vls;
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
                    rowData.push('"' + data[index][controlName] + '"');
                    if (controlName == 's_table_id_sql_lite') {
                        continue;
                    }
                    if (!dataToStore.hasOwnProperty(controlName)) {
                        dataToStore[controlName] = [];
                    }
                    let controlIns = this.getControlInstance(controlName);
                    if (controlIns && dateFormat && controlIns.type == 'date') {
                        data[index][controlName] = SYMPER_APP.$moment(data[index][controlName], 'YYYY-MM-DD').format(controlIns.controlProperties.formatDate.value);
                    }
                    if (data[index] != undefined)
                        dataToStore[controlName].push(data[index][controlName]);
                }
                dataToSqlLite.push('(' + rowData.join() + ')');
            }
            if(this.formulasWorker){
                this.formulasWorker.postMessage({action:'executeSQliteDB',data:
                    {
                        func:'insertAll',
                        keyInstance:this.keyInstance, 
                        tableName: this.tableName,
                        columns:columnInsert.join(),
                        allData:dataToSqlLite.join()
                    }
                })
            }
            
            for (let controlName in dataToStore) {
                store.commit("document/updateListInputInDocument", {
                    controlName: controlName,
                    key: 'value',
                    value: dataToStore[controlName],
                    instance: this.keyInstance
                });
            }
            // nếu table có tính tổng thì thêm 1 dòng trống ở cuối
            if (this.tableHasRowSum) {
                data.push({})
            }
            this.tableInstance.updateSettings({
                data: data
            })
        } else {
            let defaultRow = this.getDefaultData(false);
            this.tableInstance.loadData(defaultRow);
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
    checkViewType(type) {
        if (sDocument.state.viewType[this.keyInstance] == type) {
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
            this.formulasWorker.postMessage({action:'executeSQliteDB',data:
                {
                    func:'insertRow',
                    columns:['s_table_id_sql_lite'], 
                    rowData:[id],
                    keyInstance:this.keyInstance, 
                    tableName: this.tableName,
                    isPromise:false
                }
            })
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
        this.formulasWorker.postMessage({action:'executeSQliteDB',data:
            {
                func:'createTable',
                columns:columns, 
                keyInstance:this.keyInstance, 
                tableName: this.tableName,
            }
        })

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
        } else if (type == 'label') {
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
        let ele = $(td);
        if (map) {
            for (let index = 0; index < map.length; index++) {
                const cellValidateInfo = map[index];
                if (cellValidateInfo.type === 'linkControl') {
                    ele.addClass('info-control-btn')
                    ele.off('click')
                    ele.on('click', function(e) {
                        SYMPER_APP.$evtBus.$emit('on-info-btn-in-table-click', { e: e, row: row, controlName: control.name })
                    })
                }
                if (cellValidateInfo.type === 'readOnly') {
                    hotInstance.setCellMeta(row, column, 'readOnly', cellValidateInfo.value);
                } else {
                    if (cellValidateInfo.value) {
                        if (ele.find('.validate-icon').length > 0) {
                            let curMsg = ele.find('.validate-icon').attr('title');
                            curMsg = (curMsg) ? cellValidateInfo.msg : curMsg + "\n" + cellValidateInfo.msg;
                            ele.find('.validate-icon').attr('msg', curMsg);
                        } else {
                            ele.css({ 'position': 'relative' }).append(Util.makeErrNoti(control.name, cellValidateInfo.msg));
                        }
                    }
                }
            }
        }
        ele.off('click', '.validate-icon')
        ele.on('click', '.validate-icon', function(e) {
            let msg = $(this).attr('msg');

            e.msg = msg;
            SYMPER_APP.$evtBus.$emit('document-submit-open-validate-message', e)
        })
        if(sDocument.state.viewType[thisObj.keyInstance] != 'detail' && control.checkProps('isRequired')){
            if(value === "" || value === undefined || value === null){
                if(ele.find('.validate-icon').length > 0){
                    ele.find('.validate-icon').attr('msg',"Không được bỏ trống");
                }
                else{
                    ele.css({ 'position': 'relative' }).append(Util.makeErrNoti(control.name,'Không được bỏ trống'));
                }
            }
        }
        else{
            if(control.type == 'number' && (value === "" || value === undefined || value === null)){
                td.textContent = 0;
                td.style.textAlign = 'right'
            }
        }
        thisObj.getColumnSum(hotInstance, row, column, td, ele, prop, control)
        if(thisObj.tableHasRowSum && row == hotInstance.countRows() - 1){
            ele.find('.validate-icon').remove();
        }
    }

    /**
     * Hàm tính tổng của 1 cột được tích vào thuộc tính tính tổng
     * @param {*} hotInstance 
     * @param {*} row 
     * @param {*} column 
     * @param {*} td 
     * @param {*} ele 
     * @param {*} prop 
     */
    getColumnSum(hotInstance, row, column, td, ele, prop, control){
        if(this.tableHasRowSum && row == hotInstance.countRows() - 1){
            ele.find('.validate-icon').remove();
            if(Object.keys(this.columnHasSum).includes(prop)){
                let colData = hotInstance.getDataAtCol(column);
                colData.pop();
                let sum = colData.reduce((a, b)=>{
                    a = Number(a);
                    b = Number(b);
                    return a+b;
                },0)
                sum = control.formatNumberValue(sum);
                td.style.textAlign = 'right'
                td.style.fontWeight = "600";
                td.textContent = sum;
            }
        }
    }
    /**
     * Hàm set các cell được validate
     * @param {*} key 
     * @param {*} value 
     */
    addToValueMap(key, value) {
            if (!this.validateValueMap[key]) {
                this.validateValueMap[key] = [];
            }
            for (let index = 0; index < this.validateValueMap[key].length; index++) {
                const cellVld = this.validateValueMap[key][index];
                if (cellVld.type == value.type) {
                    this.validateValueMap[key][index] = value;
                    return;
                }

            }
            this.validateValueMap[key].push(value);
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
    show() {
        this.tableContainer[0].style.maxHeight = 'unset';
        this.tableContainer[0].style.opacity = '1';
    }
    hide() {
        this.tableContainer[0].style.opacity = '0';
        this.tableContainer[0].style.maxHeight = '0';
    }
}
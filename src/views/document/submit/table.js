import Util from './util'
import Handsontable from 'handsontable';
import sDocument from './../../../store/document'
import store from './../../../store'
import ClientSQLManager from './clientSQLManager';
import { checkDbOnly, getControlType, getSDocumentSubmitStore } from './../common/common'
import { SYMPER_APP } from './../../../main.js'
import { Date } from 'core-js';
import { checkCanBeBind, resetImpactedFieldsList, markBinedField } from './handlerCheckRunFormulas';
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
            let listUser = store.state.document.submit[instance.keyInstance].listUser;
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
    let div = `<div class="select-cell" style="position:relative;height:24px;width:100%;">` + value + `
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
    console.log(instance.tableName, 'instanceinstanceinstance');
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
    td.innerHTML = listInputInDocument[prop].genFileView(row);
    td.classList.add("upload-file-wrapper-inTb");
    $(td).off('click', '.file-add');
    if (sDocument.state.viewType[thisObj.keyInstance] != 'detail') {
        $(td).on('click', '.file-add', function(e) {
            let el = $(e.target).closest('.file-add');
            $("#file-upload-alter-" + instance.keyInstance).attr('data-rowid', row).attr('data-control-name', el.attr('data-ctrlname'));
            $("#file-upload-alter-" + instance.keyInstance).click();
        })
        $(td).off('click', '.remove-file')
        listInputInDocument[prop].setDeleteFileEvent($(td), prop)
    }
}
Handsontable.cellTypes.registerCellType('file', {
    renderer: Handsontable.renderers.PercentRenderer
});
let listKeyCodeNotChange = [18, 17, 9, 20, 27, 16, 192, 91, 37, 38, 39, 40]
let listTableInstance = {}
let columnHasSum = {}
const MAX_TABLE_HEIGHT = 300;

const makeDelay = function(ms) {
    var timer = 0;
    return function(callback) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
};
var delay = makeDelay(1000);

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
    image: 'ImageRenderer',
    fileUpload: 'FileRenderer',
    label: 'TextRenderer',
    percent: 'PercentRenderer',
    user: 'UserRenderer',
    select: 'SelectRenderer',
    checkbox: 'CheckboxRenderer',
};

/** Đánh dấu set cell value là tự động điền chứ ko phải do user thay đổi  */
const AUTO_SET = 'auto_set';
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
            this.validateValueMap = {};

            let thisObj = this;
            this.tableHasRowSum = false;

            /**Tổng số dòng trong table */
            this.rowCount = 0;
            this.tableInstance = null;
            this.columnsInfo = null;
            this.keyInstance = keyInstance;
            /**Danh sách các celltpye trong table */
            this.listCellType = {};
            /**CHỉ ra  vị trí của cell được click */
            this.isAutoCompleting = false;
            /**Chỉ ra tên của control nào đang setdata để callback sau khi setdata */
            this.controlNameAfterChange = "";
            this.showPopupUser = false;
            this.showPopupTime = false;
            this.tableDefaultRow = []
            this.currentControlSelected = null,
                this.listAutoCompleteColumns = {},
                this.event = {
                    afterSelection: (row, column, row2, column2, preventScrolling, selectionLayerLevel) => {
                        store.commit("document/addToDocumentSubmitStore", {
                            key: 'currentTableInteractive',
                            value: thisObj,
                            instance: thisObj.keyInstance
                        });

                    },


                    beforeKeyDown: function(event) {
                        let cellMeta = this.getSelected();
                        if (event.keyCode == 13 && thisObj.checkLastCell(cellMeta, this)) {
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
                        if (thisObj.checkControlType('user', columnIndex)) {
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
                                if ((event.keyCode == 40 || event.keyCode == 38 ||
                                        event.keyCode == 37 || event.keyCode == 39) && thisObj.isAutoCompleting) {
                                    event.stopImmediatePropagation();
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
                                if ((event.keyCode == 40 || event.keyCode == 38 ||
                                        event.keyCode == 37 || event.keyCode == 39) && thisObj.isAutoCompleting) {
                                    event.stopImmediatePropagation();
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
                    afterOnCellMouseDown: function(event, coords, TD) {
                        let columns = thisObj.columnsInfo.columns;
                        if (columns[coords.col] != undefined)
                            thisObj.currentControlSelected = columns[coords.col].data;
                        // nếu type cell là time thì emit qua submit mở timepicker
                        if (thisObj.getCellSelectedType(coords.col) == 'time') {

                            setTimeout((self) => {
                                var activeEditor = self.getActiveEditor();
                                self.selectCell(coords.row, coords.col);
                                activeEditor.beginEditing();
                                thisObj.showPopupTime = true;
                                event.controlName = columns[coords.col].data
                                event.curTarget = activeEditor.TEXTAREA
                                SYMPER_APP.$evtBus.$emit('document-submit-show-time-picker', event);
                            }, 50, this);
                            // activeEditor.enableFullEditoMode();
                        };
                        SYMPER_APP.$evtBus.$emit("symper-app-wrapper-clicked", event);

                    },
                    afterSelectionEnd: function(row, col) {
                        store.commit("document/addToDocumentSubmitStore", {
                            key: 'docStatus',
                            value: 'input',
                            instance: thisObj.keyInstance
                        });
                    },

                    afterDocumentKeyDown: function(e) {
                        let cellMeta = this.getSelected();
                        if (e.key === 'Enter' && e.shiftKey === true) {
                            this.alter('insert_row', cellMeta[0][0] + 1, 1);
                            let rowData = thisObj.tableDefaultRow;
                            rowData[0] = cellMeta[0][0] + 1;
                            thisObj.tableInstance.setDataAtRowProp([rowData], null, null, 'auto_set');
                        } else if (e.key === 'Delete' && e.shiftKey == true) {
                            this.alter('remove_row', cellMeta[0][0], 1);
                        }
                    },
                    afterChange: function(changes, source) {
                        if (changes == null || changes[0][1] == undefined) {
                            return
                        }
                        if (getSDocumentSubmitStore(thisObj.keyInstance).docStatus == 'init' &&
                            sDocument.state.viewType[thisObj.keyInstance] == 'update') {
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
                                thisObj.handlerRunFormulasForControlInTable('uniqueDB', controlUnique, dataInput, controlUnique.controlFormulas.uniqueDB);
                            }
                        }

                    }
                }
            listTableInstance[this.tableName] = this;
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
                if (colChange[2] == undefined) {
                    return;
                }
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
        console.log("asdasda", this.getListInputInDocument());
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
         * Hàm xử lí tìm các control bị ảnh hưởng sau khi  change 1 control trong table và chạy công thức cho các control bị ảnh hưởng đó
         * @param {String} controlName Control bị thay đổi dữ liệu
         */

    checkRunLocalSql() {
        let currentSubmitStoreData = getSDocumentSubmitStore(this.keyInstance);
        let listRelatedLocal = currentSubmitStoreData.localRelated;
        if (listRelatedLocal.hasOwnProperty(this.tableName)) {
            listRelatedLocal = listRelatedLocal[this.tableName];
            for (let index = 0; index < listRelatedLocal.length; index++) {
                const element = listRelatedLocal[index];
                this.handlerCheckCanBeRunFormulas(element);
            }
        }

    }
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
            this.handlerRunOtherFormulasControl(controlLinkEffected, 'link');
            this.handlerRunOtherFormulasControl(controlValidateEffected, 'validate');
            if (Object.keys(controlEffected).length > 0) {
                for (let i in controlEffected) {
                    this.handlerCheckCanBeRunFormulas(i);
                }
            }
        }

    }
    handlerRunOtherFormulasControl(controlEffected, formulasType) {
            if (Object.keys(controlEffected).length > 0) {
                for (let i in controlEffected) {
                    let controlEffectedInstance = this.getControlInstance(i);
                    let allFormulas = controlEffectedInstance.controlFormulas;
                    if (allFormulas.hasOwnProperty(formulasType)) {
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

                        // let dataInput = this.getDataInputForFormulas(formulasInstance, controlInstance.name);
                        // this.handlerRunFormulasForControlInTable('formulas', controlInstance, dataInput, formulasInstance);
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
                console.log("sada0,", listInputInDocument[inputControlName]);
                dataInput[inputControlName] = listInputInDocument[inputControlName].value;
                // if (valueInputControlItem === false) {

                // } else {
                //     let valueInputControlItem = this.getColumnIndexFromControlName(inputControlName);
                //     valueInputControlItem = this.tableInstance.getDataAtCol(valueInputControlItem);
                //     if (listInputInDocument[tableName].tableInstance.tableHasRowSum) {
                //         valueInputControlItem.pop();
                //     }
                //     dataInput[inputControlName] = valueInputControlItem;
                // }

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
                    if (sDocument.state.submit[thisObj.keyInstance]['docStatus'] == 'init' && vls.length > 0) {
                        thisObj.tableDefaultRow = vls[0];
                    }
                    thisObj.tableInstance.setDataAtRowProp(vls, null, null, 'auto_set');
                    markBinedField(thisObj.keyInstance, controlInstance.name);
                    store.commit("document/updateListInputInDocument", {
                        controlName: controlInstance.name,
                        key: 'value',
                        value: dataForStore,
                        instance: this.keyInstance
                    });
                } else {
                    this.handlerDataAfterRunFormulas(res.data, controlInstance, formulasType)
                }
            })


        }
        /**
         * Hàm lấy dữ liệu hiện tại của table và insert vào sql lite table
         */

    getDataResponseQuery(rs, controlType = "") {
            let result = ""
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
                        result = data[0].values[0][0]
                    }
                } else {
                    let data = rs.data.data;
                    if (data.length > 0) {
                        result = data[0][Object.keys(data[0])[0]]
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
        let controlInstance = this.getControlInstance(this.currentControlSelected);
        if (controlInstance != null && controlInstance != undefined) {
            let controlFormulas = controlInstance.controlFormulas;
            if (controlFormulas.hasOwnProperty('list')) {
                let formulasInstance = controlFormulas['list'].instance;
                event.curTarget = event.target;
                SYMPER_APP.$evtBus.$emit('document-submit-select-input', {
                    e: event,
                    selectFormulasInstance: formulasInstance,
                    alias: this.currentControlSelected
                })
            }
        }
    }
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
        thisObj.controlObj.ele.detach().hide();
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
            // rowHeights: 29,
            // minSpareRows: 1,
            data: defaultData,
            manualColumnMove: !thisObj.checkDetailView(),
            // manualRowMove: true,
            colHeaders: colHeaders,
            readOnly: thisObj.checkDetailView(),
            // viewportColumnRenderingOffset: 50,
            manualColumnFreeze: true,
            columns: thisObj.columnsInfo.columns,
            allowInsertColumn: false,
            allowRemoveColumn: false,
            // columnHeaderHeight: 30,
            // viewportRowRenderingOffset: 20,
            // viewportColRenderingOffset: 20,
            contextMenu: (thisObj.checkDetailView()) ? false : thisObj.getContextMenu(),
            // dragToScroll: false,
            stretchH: 'all',
            autoRowSize: false,
            autoColSize: true,
            // defaultRowHeight: 29,
            width: '100%',
            fixedRowsBottom: (thisObj.tableHasRowSum) ? 1 : 0,
            formulas: true,
            // minSpareRows: (thisObj.checkDetailView()) ? 0 : 1,
            height: 'auto',
            afterRender: function(isForced) {
                if (thisObj.tableHasRowSum)
                    $('.handsontable span.rowHeader').last().text('Tổng').css({ 'font-weight': 'bold' })
                let tbHeight = this.container.getElementsByClassName('htCore')[0].getBoundingClientRect().height;
                if (tbHeight < MAX_TABLE_HEIGHT) {} else {
                    $(this.rootElement).css('height', MAX_TABLE_HEIGHT);
                }
                if (!this.reRendered && thisObj.tableHasRowSum) {
                    this.reRendered = true;
                    setTimeout((hotTb) => {
                        for (let index = 0; index < hotTb.getDataAtRow(0).length; index++) {
                            hotTb.setCellMeta(hotTb.countRows() - 1, index, 'readOnly', true);
                        }
                        hotTb.render();
                    }, 500, this);
                }

            },
            beforeCreateRow: function(i, amount) {
                let hotTb = this;
                delay(function(e) {
                    if (thisObj.tableHasRowSum) {
                        for (let controlName in columnHasSum) {
                            let colIndex = thisObj.getColumnIndexFromControlName(controlName);
                            let CharAt = String.fromCharCode(65 + columnHasSum[controlName]);
                            let sumValue = '=SUM(' + CharAt + '1:' + CharAt + '' + (hotTb.countRows() - 1) + ')'
                            hotTb.setDataAtCell(hotTb.countRows() - 1, colIndex, sumValue, AUTO_SET);

                        }
                        for (let index = 0; index < hotTb.getDataAtRow(0).length; index++) {
                            hotTb.setCellMeta(hotTb.countRows() - 1, index, 'readOnly', true);
                            hotTb.setCellMeta(hotTb.countRows() - 2, index, 'readOnly', false);
                        }
                    }
                });
            },
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

                } else {
                    thisObj.isAutoCompleting = false;
                }

            },
            afterCreateRow: function(index, amount, source) {
                let id = Date.now();
                thisObj.tableInstance.setDataAtCell(index, thisObj.tableInstance.getDataAtRow(0).length - 1, id);
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
    getContextMenu() {
        return {
            callback: function(key, selection, clickEvent) {
                // Common callback for all options

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

                },
                "row_below": {

                },
                'remove_row': {
                    callback: function(key, selection, clickEvent) { // Callback for specific option
                        setTimeout(function(hotTb) {
                            hotTb.alter(key, selection[0]['start']['row'], 1);
                        }, 0, this);
                    }
                },

            }
        }

        // ['row_above', 'row_below', 'remove_row', 'freeze_column', 'unfreeze_column']

    }
    setDefaulFotterRowData(value, rowIndex, prop) {
        this.setDataAtRowProp(rowIndex, prop, value, AUTO_SET);
    }

    // Hàm set data cho table
    setData(vls) {
        if (vls != false) {
            ClientSQLManager.delete(this.keyInstance, this.tableName, false)
            let data = vls;
            let controlBinding = Object.keys(data[0]);
            for (let index = 0; index < data.length; index++) {
                let rowId = Date.now() + index;
                data[index]['s_table_id_sql_lite'] = rowId;
            }

            if (this.tableHasRowSum) {
                data.push({})
            }

            this.tableInstance.updateSettings({
                    data: data
                })
                // sau khi đổ dữ liệu vào table thì ko chạy các sự kiện của table nên cần chạy công thức cho các control liên quan sau khi đỏ dữ liệu
            if (!this.checkDetailView())
                setTimeout((thisObj) => {
                    for (let index = 0; index < controlBinding.length; index++) {
                        thisObj.handlerCheckEffectedControlInTable(controlBinding[index], 'all');
                    }
                    if (this.tableHasRowSum) {
                        for (let controlName in columnHasSum) {
                            let colIndex = thisObj.getColumnIndexFromControlName(controlName);
                            let CharAt = String.fromCharCode(65 + columnHasSum[controlName]);
                            let sumValue = '=SUM(' + CharAt + '1:' + CharAt + '' + (this.tableInstance.countRows() - 1) + ')'
                            this.tableInstance.setDataAtCell(this.tableInstance.countRows() - 1, colIndex, sumValue, AUTO_SET);
                        }
                    }
                }, 50, this);

        } else {
            let defaultRow = this.getDefaultData(false);
            this.tableInstance.loadData(defaultRow);
        }
    }

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
        if (this.tableHasRowSum) {
            data.push([''])
        }
        if (!this.checkDetailView()) {
            ClientSQLManager.insertRow(this.keyInstance, this.tableName, ['s_table_id_sql_lite'], [id], false);
        }
        return data;
    }
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
                columnHasSum[controlName] = num;
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
        } else if (type == 'label' || ctrl.controlProperties.isReadOnly == 1) {
            rsl.readOnly = true;

        } else if (type == 'time') {
            rsl.timeFormat = 'HH:mm A',
                rsl.correctFormat = true;

        } else if (type == 'date') {
            rsl.dateFormat = ctrl.controlProperties.formatDate.value;
            rsl.correctFormat = true;
        }
        rsl.type = Util.toLowerCaseFirstCharacter(supportCellsType[type].replace('Renderer', ''));

        return rsl;
    }
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
    getListInputInDocument() {
        return getSDocumentSubmitStore(this.keyInstance).listInputInDocument;
    }
    getControlInstance(controlName) {
        return getSDocumentSubmitStore(this.keyInstance).listInputInDocument[controlName];
    }
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
}
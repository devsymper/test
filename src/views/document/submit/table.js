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

//renderer user
Handsontable.renderers.UserRenderer = function(instance, td, row, col, prop, value, cellProperties) {
    Handsontable.renderers.TextRenderer.apply(this, arguments);
    if (!isNaN(value) && instance.hasOwnProperty('keyInstance')) {
        let listUser = store.state.document.submit[instance.keyInstance].listUser;
        console.log('instanceinstanceinstanceinstance', listUser);

        let user = listUser.filter(user => {
            return user.id === value
        })
        if (user.length > 0) {
            td.textContent = user[0].displayName
        }
    }
}
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
let listKeyCodeNotChange = [18, 17, 9, 20, 27, 16, 192, 91]
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
            this.tableHasRowSum = false;
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
            this.showPopupUser = false;
            this.currentControlSelected = null
            this.event = {
                afterSelection: (row, column, row2, column2, preventScrolling, selectionLayerLevel) => {
                    SYMPER_APP.$evtBus.$emit("symper-app-wrapper-clicked", event);
                    thisObj.currentSelectedCell['row'] = row;
                    thisObj.currentSelectedCell['column'] = column;
                    store.commit("document/addToDocumentSubmitStore", {
                        key: 'currentTableInteractive',
                        value: thisObj,
                        instance: thisObj.keyInstance
                    });
                    store.commit("document/addToDocumentSubmitStore", {
                        key: 'currentCellSelected',
                        value: thisObj.currentSelectedCell,
                        instance: thisObj.keyInstance
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
                    if (listKeyCodeNotChange.includes(event.keyCode)) {
                        return;
                    }

                    if (thisObj.checkControlType('user')) {
                        thisObj.showPopupUser = true;
                        if (event.keyCode == 13) {
                            thisObj.showPopupUser = false;
                        }
                        // chặn bấm lên xuống trái phải khi có autocomplete
                        if ((event.keyCode == 40 || event.keyCode == 38 ||
                                event.keyCode == 37 || event.keyCode == 39) && thisObj.showPopupUser != false) {
                            event.stopImmediatePropagation();
                        }
                        SYMPER_APP.$evtBus.$emit('document-submit-user-input-change', event)
                    } else {
                        thisObj.showPopupUser = false;

                        if (event.keyCode != 40 && event.keyCode != 38 &&
                            event.keyCode != 37 && event.keyCode != 39 &&
                            thisObj.isAutoCompleting == false) {
                            thisObj.isAutoCompleting = thisObj.checkIsAutocompleteCell(thisObj.currentControlSelected);
                            // if (formulasInstance != false) {
                            //     // SYMPER_APP.$evtBus.$emit('document-submit-autocomplete-input', event);
                            //     thisObj.isAutoCompleting = formulasInstance;
                            // }
                        }

                        let colHeaders = this.getColHeader();
                        // hoangnd: cần set timeout ở đây tại vì cần thực hiện đoạn này sau khi keydown hoàn tất thì input mới có dữ liệu
                        if ((event.keyCode == 40 || event.keyCode == 38 ||
                                event.keyCode == 37 || event.keyCode == 39) && thisObj.isAutoCompleting != false) {
                            event.stopImmediatePropagation();
                        }
                        setTimeout(() => {
                            if (thisObj.isAutoCompleting != false) {
                                let columnIndex = thisObj.currentSelectedCell['column'];
                                let columns = thisObj.columnsInfo.columns;
                                // let controlName = 
                                let formulasInstance = thisObj.isAutoCompleting
                                if (formulasInstance != false) {
                                    event.rowIndex = thisObj.currentSelectedCell['row'];
                                    // event['controlName'] = thisObj.controlProperties.name.value;
                                    SYMPER_APP.$evtBus.$emit('document-submit-autocomplete-key-event', {
                                        e: event,
                                        autocompleteFormulasInstance: formulasInstance,
                                        isSelect: false,
                                        controlTitle: colHeaders[columnIndex],
                                        controlName: columns[columnIndex].data
                                    })
                                }
                            }
                        }, 50);
                    }
                },

                afterSelectionEnd: function(row, col) {
                    store.commit("document/addToDocumentSubmitStore", {
                        key: 'docStatus',
                        value: 'input',
                        instance: thisObj.keyInstance
                    });
                },

                afterChange: function(changes, source) {
                    if (changes == null) {
                        return
                    }
                    if (getSDocumentSubmitStore(thisObj.keyInstance).docStatus == 'init' &&
                        sDocument.state.viewType[thisObj.keyInstance] == 'update') {
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
                        thisObj.checkUniqueTable(controlName, columns);
                        if (source != AUTO_SET) {
                            store.commit("document/addToDocumentSubmitStore", {
                                key: 'rootChangeFieldName',
                                value: controlName,
                                instance: thisObj.keyInstance
                            });
                            resetImpactedFieldsList(thisObj.keyInstance);
                        }
                        columns = columns.map(function(c) {
                            return c.data;
                        });

                        let currentColData = thisObj.tableInstance.getDataAtCol(thisObj.currentSelectedCell['column']);
                        if (thisObj.tableHasRowSum) {
                            currentColData.pop();
                        }
                        store.commit("document/updateListInputInDocument", {
                            controlName: controlName,
                            key: 'value',
                            value: currentColData,
                            instance: this.keyInstance
                        });
                        if (source != AUTO_SET) {
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

                    if (event != undefined && event.type == 'keydown' && event.keyCode == 13 && source == 'edit') {
                        if (thisObj.tableHasRowSum) {
                            if (thisObj.currentSelectedCell.row + 2 == this.getData().length) {
                                this.alter('insert_row', thisObj.currentSelectedCell.row + 1, 1);
                            }
                        } else {
                            if (thisObj.currentSelectedCell.row + 1 == this.getData().length) {
                                this.alter('insert_row', thisObj.currentSelectedCell.row + 1, 1);
                            }
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
                            setTimeout(() => {
                                thisObj.handlerCheckEffectedControlInTable(controlName);
                            }, 50);
                        }
                    });
                } else {
                    ClientSQLManager.editRow(thisObj.keyInstance, thisObj.tableName, colChange[1], colChange[3],
                        'WHERE s_table_id_sql_lite = ' + rowData[rowData.length - 1], true).then(res => {
                        if (index == changes.length - 1) {
                            setTimeout(() => {
                                thisObj.handlerCheckEffectedControlInTable(controlName);
                            }, 50);
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
                setTimeout(() => {
                    thisObj.handlerCheckEffectedControlInTable(controlName);
                }, 50);
            });
        } else {
            ClientSQLManager.editRow(thisObj.keyInstance, thisObj.tableName, controlName, changes[0][3],
                'WHERE s_table_id_sql_lite = ' + currentRowData[currentRowData.length - 1], true).then(res => {
                setTimeout(() => {
                    thisObj.handlerCheckEffectedControlInTable(controlName);
                }, 50);
            });
        }
    }


    checkControlType(type) {
            let columns = this.columnsInfo.columns;
            let controlName = columns[this.currentSelectedCell['column']].data;
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
    handlerCheckEffectedControlInTable(controlName) {
        this.checkRunLocalSql();
        let controlInstance = this.getControlInstance(controlName);
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

            }
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
        /**
         * Hàm lấy các data input cho 1 công thức
         * @param {Object} formulasInstance đối tượng của công thức 
         */
    getDataInputForFormulas(formulasInstance, tableName = false) {
            let inputControl = formulasInstance.getInputControl();
            let dataInput = {};
            let listInputInDocument = this.getListInputInDocument();
            for (let inputControlName in inputControl) {
                let valueInputControlItem = this.getColumnIndexFromControlName(inputControlName);
                if (valueInputControlItem === false) {
                    dataInput[inputControlName] = (listInputInDocument.hasOwnProperty(inputControlName)) ? listInputInDocument[inputControlName].value : []
                } else {
                    valueInputControlItem = this.tableInstance.getDataAtCol(valueInputControlItem);
                    if (listInputInDocument[tableName].tableInstance.tableHasRowSum) {
                        valueInputControlItem.pop();
                    }
                    dataInput[inputControlName] = valueInputControlItem;
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
            let dataPost = {};
            let thisObj = this;
            if (Object.keys(dataInput).length > 0) {
                let allRowDataInput = [];
                for (let control in dataInput) {
                    let controlType = getControlType(thisObj.keyInstance, control);
                    let dataRow = dataInput[control];
                    if (!Array.isArray(dataRow)) {
                        for (let index = 0; index < thisObj.tableInstance.countRows(); index++) {
                            if (allRowDataInput.length <= index) {
                                allRowDataInput[index] = {};
                            }
                            if (controlType == 'number' && (dataRow === "" || dataRow === null)) {
                                dataRow = 0
                            }
                            allRowDataInput[index][control] = dataRow;
                        }
                    } else {
                        for (let i = 0; i < dataRow.length; i++) {
                            if (allRowDataInput.length <= i) {
                                allRowDataInput[i] = {};
                            }
                            let value = dataRow[i];
                            if (controlType == 'number' && (value === "" || value === null)) {
                                value = 0
                            }
                            allRowDataInput[i][control] = value;
                        }
                    }
                }
                for (let index = 0; index < allRowDataInput.length; index++) {
                    let rowInput = allRowDataInput[index];
                    dataPost[listIdRow[index]] = rowInput;
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
                    thisObj.tableInstance.setDataAtRowProp(vls, null, null, 'auto_set');
                } else {
                    // this.handlerDataAfterRunFormulas(dataColumnAfterRunFOrmulas, controlInstance, formulasType, dataInput)
                }
            })
            store.commit("document/updateListInputInDocument", {
                controlName: controlInstance.name,
                key: 'value',
                value: dataForStore,
                instance: this.keyInstance
            });

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
            // rowHeights: 29,
            // minSpareRows: 1,
            data: (thisObj.tableHasRowSum) ? [
                [''],
                [''],
            ] : [
                []
            ],
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
            contextMenu: (thisObj.checkDetailView()) ? false : ['row_above', 'row_below', 'remove_row', 'freeze_column', 'unfreeze_column'],
            dragToScroll: false,
            stretchH: 'all',
            formulas: true,
            autoRowSize: false,
            autoColSize: false,
            // defaultRowHeight: 29,
            width: '100%',
            fixedRowsBottom: (thisObj.tableHasRowSum) ? 1 : 0,
            formulas: true,
            // minSpareRows: (thisObj.checkDetailView()) ? 0 : 1,
            height: 'auto',
            afterRender: function(isForced) {
                let tbHeight = this.container.getElementsByClassName('htCore')[0].getBoundingClientRect().height;
                if (tbHeight < MAX_TABLE_HEIGHT) {} else {
                    $(this.rootElement).css('height', MAX_TABLE_HEIGHT);
                }
                if (!this.reRendered && thisObj.tableHasRowSum) {
                    this.reRendered = true;
                    setTimeout((hotTb) => {
                        for (let controlName in columnHasSum) {
                            let colIndex = thisObj.getColumnIndexFromControlName(controlName);
                            let CharAt = String.fromCharCode(65 + columnHasSum[controlName]);
                            let sumValue = '=SUM(' + CharAt + '1:' + CharAt + '' + (hotTb.countRows() - 1) + ')'
                            hotTb.setDataAtCell(this.countRows() - 1, colIndex, sumValue, AUTO_SET);
                        }
                        for (let index = 0; index < hotTb.getDataAtRow(0).length; index++) {
                            hotTb.setCellMeta(hotTb.countRows() - 1, index, 'readOnly', true);
                        }
                        hotTb.render();
                    }, 500, this);
                }
            },
            beforeCreateRow: function(i, amount) {},
            afterCreateRow: function(i, amount) {
                let hotTb = this;
                delay(function(e) {
                    if (thisObj.tableHasRowSum) {
                        for (let controlName in columnHasSum) {
                            let colIndex = thisObj.getColumnIndexFromControlName(controlName);
                            let CharAt = String.fromCharCode(65 + columnHasSum[controlName]);
                            let sumValue = '=SUM(' + CharAt + '1:' + CharAt + '' + (hotTb.countRows() - 1) + ')'
                            hotTb.setDataAtCell(hotTb.countRows() - 1, colIndex, sumValue, AUTO_SET);
                        }
                    }
                });
            }
        });
        this.tableInstance.keyInstance = this.keyInstance;
        if (!this.checkDetailView()) {
            for (let evtName in thisObj.event) {
                Handsontable.hooks.add(evtName, thisObj.event[evtName], this.tableInstance);
            }
        }
    }

    setDefaulFotterRowData(value, rowIndex, prop) {
        this.setDataAtRowProp(rowIndex, prop, value, AUTO_SET);
    }
    setData(vls) {
        this.tableInstance.updateSettings({
            data: (this.tableHasRowSum) ? [
                [''],
                [''],
            ] : [
                []
            ],
        });
        let tb = this;
        if (vls != false) {
            console.log('hgfasdfsdasd', vls);
            setTimeout(() => {
                tb.tableInstance.setDataAtRowProp(vls, null, null, 'auto_set');
            }, 20);
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
        columns.push({ data: 'childObjectId', type: 'numeric' });
        columns.push({ data: 's_table_id_sql_lite', type: 'numeric' });
        hiddenColumns.push(columns.length - 1);
        hiddenColumns.push(columns.length - 2);
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
            // renderer: this.validateRender
        }
        if (type == 'number') {
            rsl.numericFormat = {
                pattern: ctrl.numberFormat
            };
        } else if (type == 'label' || ctrl.controlProperties.isReadOnly == 1) {
            rsl.readOnly = true;
        } else if (type == 'select') {
            rsl.editor = 'select';
        } else if (type == 'time') {
            rsl.timeFormat = 'HH:mm:ss',
                rsl.correctFormat = true;

        } else if (type == 'date') {
            rsl.dateFormat = 'YYYY-MM-DD',
                rsl.correctFormat = true;
        }
        rsl.type = Util.toLowerCaseFirstCharacter(supportCellsType[type].replace('Renderer', ''));

        return rsl;
    }
    validateRender(hotInstance, td, row, column, prop, value, cellProperties) {
            let inTable = listInputInDocument[prop].inTable;
            let thisObj = listTableInstance[inTable];
            let control = thisObj.getControlInstance(listInputInDocument[prop]);
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
                if (map.uniqueDB === true) {
                    ele.css({ 'position': 'relative' }).append(Util.makeErrNoti(map.msg, sign, controlTitle));
                }
                if (map.require === true && (value === '' || value == null)) {
                    ele.css({ 'position': 'relative' }).append(Util.requireRedDot(sign, controlTitle));
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
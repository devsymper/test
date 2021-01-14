import { util } from "@/plugins/util.js";
import { Grid, simpleHttpRequest } from 'ag-grid-community';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import  {ClipboardModule} from '@ag-grid-enterprise/clipboard';
import 'ag-grid-enterprise';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';
import {getControlInstanceFromStore, getListInputInDocument, minimizeDataAfterRunFormula, SQLITE_COLUMN_IDENTIFIER} from './../common/common'
import sDocument from '@/store/document'
import store from './../../../store'

import {NumberCellRenderer} from './table/NumberCellRenderer'
import {
    CheckboxRenderer, 
    FileRenderer, 
    DateRenderer, 
    TimeRenderer, 
    SelectRenderer,
    PercentRenderer, 
    UserRenderer} from './table/cellRenderer'
import {AutoCompleteCellEditor} from './table/AutoCompleteCellEditor';
import { checkCanBeBind } from "./handlerCheckRunFormulas";
window.addNewDataPivotTable = function(el, event, type){
    let tableName = $(el).attr('table-name');
    event.preventDefault();
    event.stopPropagation();
    let thisListItem = util.getClosestVueInstanceFromDom(el,'submitDocument');
    thisListItem.$evtBus.$emit('on-add-data-to-pivot-table',{type:type, tableName:tableName})
    
}
export default class SymperTable {
    constructor(tableControl, keyInstance, groupConfig = {}, pivotConfig = {}) {
        this.init();
        this.tableControl = tableControl;
        this.tableName = tableControl.name;
        this.keyInstance = keyInstance;
        this.gridOptions = null;
        this.rows = groupConfig.rows;
        this.cols = groupConfig.cols;
        this.values = groupConfig.values;
        this.tableContainer = null;
        this.tableHeightDefault = "400px";
        this.columnDefs = this.getColDefs();
        this.allColumnAppend = [];
        this.agInstance = null;
        this.tableMode = this.tableControl.tableMode;
        this.cellRendererValueMap = {}
    }
    init(){
        /**
         * Các loại cell mà table hỗ trợ hiển thị
         */
        this.supportCellsType = {
            currency: 'NumberCellRenderer',
            number: 'NumberCellRenderer',
            date: 'DateRenderer',
            // dateTime: 'DatetimeRenderer',
            time: 'TimeRenderer',
            image: 'FileRenderer',
            fileUpload: 'FileRenderer',
            percent: 'PercentRenderer',
            user: 'UserRenderer',
            select: 'SelectRenderer',
            combobox: 'SelectRenderer',
            checkbox: 'CheckboxRenderer',
            
        };
        this.supportCellEditor = {
            autocomplete: 'AutoCompleteCellEditor',
        }
    }
    setFormulasWorker(formulasWorker){
        this.formulasWorker = formulasWorker
    }
    getColDefs(){
        let colDefs = []
        for (let controlName in this.tableControl.controlInTable){
            let controlInstance = this.tableControl.controlInTable[controlName];
            let col = {
                headerName:controlInstance.title,
                field: controlInstance.name,
                editable:true,
            };
            if(this.supportCellsType[controlInstance.type]){
                col['cellRenderer'] = this.supportCellsType[controlInstance.type]
            }
            if(controlInstance.checkEmptyFormulas('autocomplete')){
                col['cellEditor'] = 'AutoCompleteCellEditor';
                col['cellEditorParams'] = {
                    controlName:controlName
                };
            }
            if(this.rows && this.rows.length > 0){
                let rowGroup = this.rows.find(ele => ele.name == controlName);
                if(rowGroup){
                    col = {...col,...{
                        rowGroup: true,
                        enableRowGroup: true,
                        hide: true,
                    }}
                }
            }
            
            if(this.cols && this.cols.length > 0){
                if(this.cols[0].name == controlName){
                    continue
                }
            }
            if(this.values && this.values.length > 0){
                if(this.values[0].name == controlName){
                    continue
                }
            }
            colDefs.push(col);
        }
        let colObjectId = {
            headerName:'child_object_id',
            field: 'child_object_id',
            hide:true
        };
        let colSqlId = {
            headerName:SQLITE_COLUMN_IDENTIFIER,
            field: SQLITE_COLUMN_IDENTIFIER,
            hide:true,
        };
        colDefs.push(colObjectId);
        colDefs.push(colSqlId);
        return colDefs;
    }
    /**
     * hoangnd
     * Hàm đọc thông tin pivot đã lưu để tạo cấu trúc các cột pivot (bao gồm header và các cột group)
     */
    appendTableColumns(data) {
        if(this.cols && this.cols.length > 0){
            let col = this.cols[0];
            this.allColumnAppend = data.reduce((arr, obj)=>{
                if(obj[col.name] && !arr.includes(obj[col.name])){
                    arr.push(obj[col.name])
                }
                return arr
            },[]);
            for (let index = 0; index < this.allColumnAppend.length; index++) {
                let colItem = this.allColumnAppend[index];
                let colBinding = {
                    headerName:colItem,
                    field: colItem,
                };
                this.columnDefs.push(colBinding);
            }
        }       
    }
    getHashRow(row){
        let columnDataNotChange = [];
        for(let column in row){
            if(this.cols[0].name != column && this.values[0].name != column && column != 'childObjectId'){
                columnDataNotChange.push(row[column]);
            }
        }
        return columnDataNotChange.join('__');
    }
    
    /**
     * Hàm chuyển data dạng flat sang data dạng đã được cấu hình theo group
     * @param {*} data 
     */
    convertDataToGroup(data){
        let mapRowWithData = [];
        let controlValue = this.values[0].name;
        if(this.cols && this.cols.length > 0){
            let newData = [];
            for (let index = 0; index < data.length; index++) {
                let newRow = data[index];
                let rowKey = this.getHashRow(newRow);
                if(!mapRowWithData.includes(rowKey)){
                    mapRowWithData.push(rowKey);
                    for (let i = 0; i < this.allColumnAppend.length; i++) {
                        let column = this.allColumnAppend[i];
                        newRow[column] = (column == newRow[this.cols[0]['name']]) ? newRow[controlValue] : "";
                    }
                    newData.push(newRow);
                }
                else{
                    newData[mapRowWithData.indexOf(rowKey)][newRow[this.cols[0]['name']]] = newRow[controlValue]
                }
            }
            return newData;
        }
        return [];
    }
    /**
     * Hoangnd
     * Hàm xử lí data cho bảng
     * @param {} vl 
     */
    setData(data) {
        if(this.tableMode != 'Flat'){
            this.appendTableColumns(data);
            this.gridOptions.api.setColumnDefs(this.columnDefs);
            data = this.convertDataToGroup(data);
        }
        this.gridOptions.api.setRowData(data);
        let viewType = sDocument.state.viewType[this.keyInstance];
        if(viewType == 'print'){
            this.gridOptions.api.setDomLayout('print');
        }
        this.caculatorHeight();
    }
    /**
     * chuyển data dạng pivot sang data dạng flat thì cần xóa các dữ liệu của các cột được thêm vào
     * @param {*} data 
     */
    minimizeData(data){
        for (let index = 0; index < this.allColumnAppend.length; index++) {
            delete data[this.allColumnAppend[index]];
        }
    }

    /**
     * ham trả về data của table
     */
    getGroupData(){
        let rowData = [];
        this.gridOptions.api.forEachNode(node => {
                if(!node.group){
                    if(this.allColumnAppend.length > 0){
                        for (let index = 0; index < this.allColumnAppend.length; index++) {
                            const column = this.allColumnAppend[index];
                            let newRow = util.cloneDeep(node.data);
                            newRow[this.cols[0].name] = column;
                            newRow[this.values[0].name] = newRow[column];
                            this.minimizeData(newRow);
                            rowData.push(newRow);
                        }
                    }
                    else{
                        rowData.push(node.data)
                    }
                }
            }
        );
        let dataForSubmit = {};
        if(rowData.length > 0){
            for (let index = 0; index < rowData.length; index++) {
                let row = rowData[index];
                for (let control in row){
                    if(!dataForSubmit[control]){
                        dataForSubmit[control] = []
                    }
                    dataForSubmit[control].push(row[control]);
                }
            }
        }
        return dataForSubmit;
    }
    /**
     * Hoangnd:
     * Hàm tính toán chiều cao cho table
     */
    caculatorHeight(){
        let dataHeight = (this.gridOptions.api.getDisplayedRowCount() + 1)*25;
        let headerHeight = 0;
        if(this.cols && this.cols.length > 0){
            headerHeight += 25;
        }
        if(this.rows && this.rows.length > 0){
            headerHeight += 25*this.rows.length;
        }
        let tableHeight = dataHeight + headerHeight + 20;
        if(tableHeight > 500){
            tableHeight = 500;
        }
        $('#ag-'+this.tableControl.id).css({height:tableHeight + "px"});
    }
    render() {
        
        this.gridOptions = {
            columnDefs: this.columnDefs,
            animateRows: true,
            rowHeight:25,
            headerHeight:25,
            rowBuffer: 0,       // số view trong 1 viewport
            groupDefaultExpanded: -1,
            rowData: this.getRowDefaultData(),
            components: {
                NumberCellRenderer: NumberCellRenderer,
                FileRenderer: FileRenderer,
                PercentRenderer: PercentRenderer,
                UserRenderer: UserRenderer,
                SelectRenderer: SelectRenderer,
                CheckboxRenderer: CheckboxRenderer,
                DateRenderer: DateRenderer,
                TimeRenderer: TimeRenderer,
                AutoCompleteCellEditor:AutoCompleteCellEditor
            },
            // debounceVerticalScrollbar:true,
            autoGroupColumnDef: { 
                minWidth: (this.rows && this.rows.length > 1) ? 250 : 150,
                cellRendererParams: {
                    suppressCount: true
                }
            },
            defaultColDef: {
                filter: true,
                width: 150,
                sortable: true,
                resizable: true,
                wrapText:true,
                autoHeight:true,
                editable:true,
            },
            undoRedoCellEditing: true,
            enableFillHandle:true,
            enableRangeSelection: true,
            enableCellTextSelection:false,
            onCellValueChanged:this.onCellValueChanged,
            tableInstance:this
        };
        let viewType = sDocument.state.viewType[this.instance];
        let actionBtn = ""
        // let actionBtn = ` <div class="dropdown">
        //                     <button class="ag-pivot-action"><span class="mdi mdi-plus"></span></button>
        //                     <div class="dropdown-content">
        //                         <a onclick="addNewDataPivotTable(this, event, 'rows')" table-name="`+this.tableName+`">Thêm dòng</a>
        //                         <a onclick="addNewDataPivotTable(this, event, 'cols')" table-name="`+this.tableName+`">Thêm cột</a>
        //                     </div>
        //                 </div>`;
        if(['detail','print'].includes(viewType)){
            actionBtn = ""
        }
        this.tableContainer = $(`<div id="ag-` + this.tableControl.id + `" style="height: `+this.tableHeightDefault+`; width: auto;position:relative;" class="ag-theme-alpine group-table" s-control-type="table">
                                    `+actionBtn+`
                            </div>`)[0];
        this.tableControl.ele.before(this.tableContainer);
        if(viewType == 'print'){
            this.tableControl.ele.parent().find('.wrap-s-control-table').remove();
        }
        this.agInstance = new Grid(this.tableContainer, this.gridOptions, { modules: [ClientSideRowModelModule, RowGroupingModule, ClipboardModule] });
        if(this.tableControl.name == 'tb_demo'){
            this.demoLargeData();
        }
        this.caculatorHeight();
        
    }
    getRowDefaultData(){
        let rowItem = {};
        for (let controlName in this.tableControl.controlInTable){
            let controlInstance = this.tableControl.controlInTable[controlName];
            let defaultControlValue = controlInstance.getValueProp('defaultValue');
            if(['number','percent'].includes(controlInstance.type)){
                rowItem[controlName] = 0;
            }
            rowItem[controlName] = (defaultControlValue) ? defaultControlValue : "";
            if(controlInstance.type == 'date' && controlInstance.formatDate){
                rowItem[controlName] = SYMPER_APP.$moment(rowItem[controlName]).format(controlInstance.formatDate)
            }
        }
        rowItem[SQLITE_COLUMN_IDENTIFIER] = Date.now();
        return [rowItem]
    }
    /**
     * Set dữ liệu cho 1 cell theo key (column name)
     */
    setDataAtCell(key, value, currentRowIndex){
        let rowNode = this.getRowNode(currentRowIndex);
        rowNode.setDataValue(key,value);
    }
    /**
     * Hàm lấy model của 1 row
     * @param {*} rowIndex 
     */
    getRowNode(rowIndex){
        return this.gridOptions.api.getRowNode(rowIndex);
    }
    /**
     * Hàm trả về dữ liệu của 1 dòng theo index
     */
    getDataByRowIndex(rowIndexs){
        let rowData = [];
        for (let index = 0; index < rowIndexs.length; index++) {
            const rowIndex = rowIndexs[index];
            rowData.push(this.gridOptions.api.getRowNode(rowIndex));
        }
        return rowData;
    }
    /**
     * Hàm trả về tất cả dữ liệu của bảng
     */
    getAllData() {
        let rowData = [];
        this.gridOptions.api.forEachNode(node => 
            rowData.push(Object.assign({},node.data))
        );
        return rowData;
    }
    /**
     * Hàm trả về dữ liệu của 1 cột
     * @param {*} colName 
     */
    getColData(colName){
        let allData = this.getAllData();
        let colData = allData.reduce((arr,obj)=>{
            arr.push(obj[colName]);
            return arr;
        },[])
        return colData
    }
    /**
     * Hàm trả về giá trị của 1 cell
     * @param {*} columnName 
     * @param {*} rowIndex 
     */
    getCellData(columnName, rowIndex){
        let rowNode = this.gridOptions.api.getRowNode(rowIndex);
        return rowNode.data[columnName];
    }
    updateItems(mapIndexChange, columnChange, isAll = false) {
        var itemsToUpdate = [];
        this.gridOptions.api.forEachNode(function (rowNode, index) {
            if(isAll){
                var data = rowNode.data;
                itemsToUpdate.push(data);
            }
            else {
                if(mapIndexChange[index]){
                    var data = rowNode.data;
                    data[columnChange] = mapIndexChange[index]
                    itemsToUpdate.push(data);
                }
            }
        });
        this.gridOptions.api.applyTransaction({ update: itemsToUpdate });
      }
    /**
     * Nhận sự kiên khi giá trị của cell thay đổi => chạy công thức cho các control bị ảnh hưởng
     */
    onCellValueChanged(event){
        if(event.newValue != event.oldValue){
            let columnChange = event.colDef.field;
            let controlInstance = getControlInstanceFromStore(this.tableInstance.keyInstance, columnChange);
            let colData = this.tableInstance.getColData(columnChange);
            let controlToWorker = {name:columnChange,type:controlInstance.type,value:colData}
            this.tableInstance.formulasWorker.postMessage({action:'updateWorkerStore',data:{controlIns: controlToWorker, keyInstance:this.tableInstance.keyInstance, type:'submit'}})
            this.tableInstance.handlerAfterChangeCellByUser(columnChange,event.newValue,event.data, event.rowIndex);
        }
    }
    handlerAfterChangeCellByUser(columnName, valueChange, currentRowData, rowIndex) {
        this.formulasWorker.postMessage({action:'executeSQliteDB',data:
            {
                func:'editRow',
                columns:columnName, 
                value:valueChange,
                condition:'WHERE '+SQLITE_COLUMN_IDENTIFIER+' = ' + currentRowData['text_render'],
                keyInstance:this.keyInstance, 
                tableName: this.tableName
            }
        })
        this.handlerCheckEffectedControlInTable(columnName, [rowIndex]);

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
        let controlInstance = getControlInstanceFromStore(this.keyInstance, controlName);
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
            this.handlerRunOtherFormulaControl(controlReadonlyEffected, 'readOnly', rowIndex);
            this.handlerRunOtherFormulaControl(controlRequireEffected, 'require', rowIndex);
            this.handlerRunOtherFormulaControl(controlLinkEffected, 'linkConfig', rowIndex);
            this.handlerRunOtherFormulaControl(controlValidateEffected, 'validate', rowIndex);
            this.handlerRunValueFormulaControl(controlEffected, rowIndex);
            
        }
    }
    /**
     * Kiểm tra các công thức giá trị bị ảnh hưởng để xem có được chạy công thức hay không
     * @param {*} controlEffected 
     * @param {*} rowIndex 
     */
    handlerRunValueFormulaControl(controlEffected, rowIndex){
        if (Object.keys(controlEffected).length > 0) {
            for (let i in controlEffected) {
                this.handlerCheckCanBeRunFormula(i,rowIndex);
            }
        }
    }
     /**
     * chạy các công thức khác bị ảnh hưởng trong table
     * @param {*} controlEffected 
     * @param {*} formulasType 
     */
    handlerRunOtherFormulaControl(controlEffected, formulasType, rowIndex) {
        if (Object.keys(controlEffected).length > 0) {
            for (let i in controlEffected) {
                let controlEffectedInstance = getControlInstanceFromStore(this.keyInstance,i);
                let allFormulas = controlEffectedInstance.controlFormulas;
                // if (allFormulas.hasOwnProperty(formulasType)) {
                //     if (formulasType == 'linkConfig') { // nếu có cấu hình công thức link thì cũng chạy các công thức của nó
                //         let configData = allFormulas[formulasType].configData;
                //         for (let ind = 0; ind < configData.length; ind++) {
                //             let config = configData[ind];
                //             let formulasInstance = config.instance;
                //             let dataInput = this.getDataInputForFormulas(formulasInstance, rowIndex);
                //             let fType = formulasType + "_" + config.formula.instance;
                //             this.handleRunFormulaForControlInTable(controlEffectedInstance, dataInput, formulasInstance, rowIndex)
                //         }
                //     } else {
                //         if (allFormulas[formulasType].hasOwnProperty('instance')) {
                //             let formulasInstance = allFormulas[formulasType].instance;
                //             let dataInput = this.getDataInputForFormulas(formulasInstance, rowIndex);
                //             if (controlEffectedInstance.hasOwnProperty('inTable')) {
                //                 if (controlEffectedInstance.inTable == this.tableName) {
                //                     this.handleRunFormulaForControlInTable(controlEffectedInstance, dataInput, formulasInstance, rowIndex);
                //                 }
                //             }
                //         }
                //     }
                // }
            }
        }
    }
    /**
     * Hàm xử lí kiểm tra control đủ điều kiện chạy công thức hay chưa (checkCanBeBind) và lấy ra formulasInstance để chạy
     * @param {String} control 
     */
    handlerCheckCanBeRunFormula(controlName, rowIndex) {
        if (checkCanBeBind(this.keyInstance, controlName)) {
            let controlInstance = getControlInstanceFromStore(this.keyInstance, controlName);
            if (controlInstance.controlFormulas.hasOwnProperty('formulas')) {
                let formulaInstance = controlInstance.controlFormulas['formulas'].instance;
                if (controlInstance.type != 'table') {
                    if (controlInstance.inTable == this.tableName) {
                        this.handleRunFormulaForControlInTable(controlInstance, formulaInstance, rowIndex);
                        return;
                    } 
                }
                SYMPER_APP.$evtBus.$emit('run-formulas-control-outside-table', {
                    formulaInstance: formulaInstance,
                    controlName: controlName
                });
            }
        }
    }

     /**
     * Hàm xử lí chạy công thức theo cột trong bảng
     * @param {*} controlEffectedInstance   Object của 1 control bị ảnh hưởng
     * @param {*} dataInput    dữ liệu đầu vào cho công  thức
     * @param {*} formulaInstance  Object cua formulas giá trị của control bị ảnh hưởng
     * @param {*} controlInstance  control đang chạy công thức
     * 
     */
    handleRunFormulaForControlInTable(controlInstance, formulaInstance, rowIndex = null) {
        // let sDocumentSubmit = getSDocumentSubmitStore(this.keyInstance);
        // if(!checkDataInputChange(sDocumentSubmit.rootChangeFieldName, sDocumentSubmit.dataInputBeforeChange, dataInput)){
        //     return;
        // }
        if(rowIndex.length == 1 && rowIndex != "all"){
            this.handleRunFormulaOnRow(controlInstance, formulaInstance, rowIndex);
        }
        else if(rowIndex == "all"){
            this.handleRunFormulaOnColumn(controlInstance, formulaInstance)
        }
        else{
            // this.handleRunFormulaOnRowChange(controlInstance, dataInput, formulaInstance, rowIndex);
        }
        
    }
    /**
     * Hàm xử lí chạy công thức theo từng dòng trong bảng
     * @param {*} controlEffectedInstance   Object của 1 control bị ảnh hưởng
     * @param {*} dataInput    dữ liệu đầu vào cho công  thức
     * @param {*} formulasInstance  Object cua formulas giá trị của control bị ảnh hưởng
     * @param {*} controlInstance  control đang chạy công thức
     * 
     */
    handleRunFormulaOnRow(controlInstance, formulaInstance, rowIndex){
        let rowData = this.getDataByRowIndex(rowIndex);
        if(rowData.length > 0){
            rowData = rowData[0];
            let sqlRowId = rowData.data[SQLITE_COLUMN_IDENTIFIER];
            this.formulasWorker.postMessage({action:'runFormula',data:
                {
                    formulaInstance:formulaInstance, 
                    keyInstance:this.keyInstance,
                    controlName:controlInstance.name, 
                    from:'rowTable', 
                    sqlRowId:sqlRowId, 
                    rowIndex:rowIndex,
                }
            });
        }
    }
    handleRunFormulaOnColumn( controlInstance, formulaInstance){
        let listIdRow = this.getColData(SQLITE_COLUMN_IDENTIFIER);
        this.formulasWorker.postMessage({action:'runFormula',data:
            {
                formulaInstance:formulaInstance, 
                controlName:controlInstance.name, 
                from:'columnTable', 
                keyInstance:this.keyInstance,
                listIdRow:listIdRow, 
                controlType:controlInstance.type,
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
    demoLargeData(){
        let self = this;
        var columnDefs = [
            { field: 'athlete' },
            { field: 'country' },
            { field: 'year'},
            { field: 'gold'},
            { field: 'silver'},
            { field: 'bronze'},
            { field: 'total'}
        ];
        this.gridOptions.api.setColumnDefs(columnDefs);
        simpleHttpRequest({ url: 'https://www.ag-grid.com/example-assets/olympic-winners.json' })
        .then(function(data) {
            self.gridOptions.api.setRowData(data);
        });
    }
    /**
     * Hàm lấy các data input cho 1 công thức
     * @param {Object} formulaInstance đối tượng của công thức 
     */
    getDataInputInTableForFormula(formulaInstance, rowIndex = null) {
        let inputControl = formulaInstance.getInputControl();
        let dataInput = {};
        let listInputInDocument = getListInputInDocument(this.keyInstance);
        let sSubmit = sDocument.state.submit[this.keyInstance];
        for (let inputControlName in inputControl) {
            if(inputControlName == 'document_object_id'){
                let docObjId = sSubmit['documentObjectId'];
                dataInput[inputControlName] = (docObjId) ? docObjId : '';
            }
            else if (inputControlName == 'context'){
                let context = sSubmit['context'];
                dataInput[inputControlName] = (context) ? context : '';
            }
            else if (inputControlName == 'action'){
                let action = sSubmit['action'];
                dataInput[inputControlName] = (action) ? action : '';
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
     * Hàm set các cell được validate
     * @param {*} key 
     * @param {*} value 
     */
    addToValueMap(key, value) {
        if (!this.cellRendererValueMap[key]) {
            this.cellRendererValueMap[key] = [];
        }
        for (let index = 0; index < this.cellRendererValueMap[key].length; index++) {
            const cellVld = this.cellRendererValueMap[key][index];
            if (cellVld.type == value.type) {
                this.cellRendererValueMap[key][index] = value;
                return;
            }

        }
        this.cellRendererValueMap[key].push(value);
    }
    show() {
        this.tableContainer.style.maxHeight = 'unset';
        this.tableContainer.style.opacity = '1';
    }
    hide() {
        this.tableContainer.style.opacity = '0';
        this.tableContainer.style.maxHeight = '0';
    }

}
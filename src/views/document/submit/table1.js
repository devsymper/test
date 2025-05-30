import { util } from "@/plugins/util.js";
import { SYMPER_APP } from '@/main.js'
import { Grid, simpleHttpRequest } from 'ag-grid-community';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import  {ClipboardModule} from '@ag-grid-enterprise/clipboard';
import 'ag-grid-enterprise';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';
import '@ag-grid-community/core/dist/styles/ag-theme-balham.css';
import {getControlInstanceFromStore, getListInputInDocument, minimizeDataAfterRunFormula, SQLITE_COLUMN_IDENTIFIER} from './../common/common'
import sDocument from '@/store/document'
import store from './../../../store'

import {NumberCellRenderer} from './table/NumberCellRenderer'
import BaseCellRenderer from './table/BaseCellRenderer'
import {BottomPinnedRowRenderer} from './table/BottomPinnedRowRenderer'
import {SelectCellRenderer} from './table/SelectCellRenderer'
import {DateCellRenderer} from './table/DateCellRenderer'
import {TimeCellRenderer} from './table/TimeCellRenderer'
import {UserCellRenderer} from './table/UserCellRenderer'
import {CheckboxCellRenderer} from './table/CheckboxCellRenderer'
import {PercentCellRenderer} from './table/PercentCellRenderer'
import {ValidateCellRenderer} from './table/ValidateCellRenderer'
import {FileCellRenderer} from './table/FileCellRenderer'
import {AutoCompleteCellRenderer} from './table/AutoCompleteCellRenderer';
import {AutoCompleteCellEditor} from './table/AutoCompleteCellEditor';
import { checkCanBeBind } from "./handlerCheckRunFormulas";
import PerfectScrollbar from "perfect-scrollbar";
import {getDataInputFormula, prepareDataGetMultiple } from "./../../../components/document/dataControl";
import { str } from "../../../plugins/utilModules/str";
import { uiConfigApi } from "../../../api/uiConfig";
window.addNewDataPivotTable = function(el, event, type){
    let tableName = $(el).attr('table-name');
    event.preventDefault();
    event.stopPropagation();
    let thisListItem = util.getClosestVueInstanceFromDom(el,'submitDocument');
    thisListItem.$evtBus.$emit('on-add-data-to-pivot-table',{type:type, tableName:tableName})
}
var delayTimerGridEvent;
var delayTimerGridSize;

export default class SymperTable {
    constructor(tableControl, keyInstance, groupConfig = {}, pivotConfig = {}, formulasWorker) {
        this.keyInstance = keyInstance;
        this.init();
        this.tableControl = tableControl;
        this.tableName = tableControl.name;
        this.gridOptions = null;
        this.rows = groupConfig.rows;
        this.cols = groupConfig.cols;
        this.values = groupConfig.values;
        this.tableContainer = null;
        this.tableHeightDefault = "400px";
        this.tableHasRowSum = false;
        this.sumColumns = {};
        this.tableMode = this.tableControl.tableMode;
        this.columnDefs = this.getColDefs();
        this.allColumnAppend = [];
        this.agInstance = null;
        this.cellRendererValueMap = {};
        this.formulasWorker = formulasWorker;
        this.tableWorker = null;
        this.pinnedRowNode = null;
        this.dataChange = {};
        this.allControlKeyCache = this.tableControl.getAllControlKeyCache();
        this.onEventReady = false;
    }
    init(){
        this.viewType = sDocument.state.viewType[this.keyInstance];
        /**
         * Các loại cell mà table hỗ trợ hiển thị
         */
        this.supportCellsType = {
            currency: 'NumberCellRenderer',
            richText: 'BaseCellRenderer',
            number: 'NumberCellRenderer',
            date: 'DateCellRenderer',
            dateTime: 'DateCellRenderer',
            time: 'TimeCellRenderer',
            image: 'FileCellRenderer',
            fileUpload: 'FileCellRenderer',
            percent: 'PercentCellRenderer',
            user: 'UserCellRenderer',
            select: 'SelectCellRenderer',
            combobox: 'SelectCellRenderer',
            checkbox: 'CheckboxCellRenderer',
            
        };
        this.supportCellEditor = {
            autocomplete: 'AutoCompleteCellEditor',
        }
        this.isCellFilling = false;
        this.isCellPasting = false;
        this.dataForCellpasting = {};
    }
    getContextMenuItems(params){
        let self = params.context.thisComponent;
        if(self.viewType == 'detail'){
            return [
                'autoSizeAll',
                'expandAll',
                'contractAll',
                'resetColumns',
                'excelExport',
            ]
        }
        else{
            let submitContextItem = [
                {
                    name: 'Xóa dòng đã chọn  ',
                    shortcut: "Shift + Backspace",
                    action: function() {
                        // params.api.applyTransaction({ remove: [params.node.data]});
                        self.deleteRowSelection(params)

                    },
                    cssClasses: ['redFont']
                },
                'autoSizeAll',
                'expandAll',
                'contractAll',
                'copy',
                'paste',
                'resetColumns',
                'excelExport',
            ];
            if(self.tableControl.isInsertRow()){
                submitContextItem.unshift(
                    {
                        name: 'Thêm dòng phía dưới  ',
                        shortcut: "Shift + Enter",
                        action: function() {
                            let rowIndex = (params.node) ? params.node.rowIndex : 0;
                            params.api.applyTransaction({ add: [{s_table_id_sql_lite : Date.now()}], addIndex:rowIndex + 1 });
                        },
                        cssClasses: ['blueFont'],
                        // icon:'mdi-table-row-plus-after'
                    }
                )
                submitContextItem.unshift(
                    {
                        name: 'Thêm dòng phía trên  ',
                        action: function() {
                            let rowIndex = (params.node) ? params.node.rowIndex : 0;
                            params.api.applyTransaction({ add: [{s_table_id_sql_lite : Date.now()}], addIndex:rowIndex });
                        },
                        cssClasses: ['blueFont'],
                        // icon:'mdi mdi-table-row-plus-before'
        
                    }
                )
                
            }
            return submitContextItem;
        }
    }
    showLoadingOverlay(){
        this.gridOptions.api.showLoadingOverlay()
    }
    hideOverlay(){
        this.gridOptions.api.hideOverlay()
    }
        
    getUiConfig(){
        if(this.viewType == 'submit'){
            return;
        }
        this.showLoadingOverlay();
        let docName = sDocument.state.submit[this.keyInstance].documentInfo.document.name;
        let tableDefinition = "table_document_instance:"+docName+":"+this.tableName;
        let self = this;
        uiConfigApi.getUiConfig(tableDefinition).then(res=>{
            let uiConfig = {};
            if(res.status == 200){
                uiConfig = res.data.detail;
                try {
                    uiConfig = JSON.parse(uiConfig);
                    uiConfig = uiConfig.tableDefinition;
                } catch (error) {
                    console.warn(error);
                }
            }
            let newColdefs = [];
            for(let control in uiConfig){
                let colItem = self.columnDefs.find(el=>el.field == control);
                if(colItem){
                    // colItem.width = uiConfig[control];
                    newColdefs.push(colItem);
                    self.columnDefs.splice(self.columnDefs.indexOf(colItem),1);
                }
            }
            newColdefs = newColdefs.concat(self.columnDefs);
            self.columnDefs = newColdefs;
            self.gridOptions.api.setColumnDefs([]);
            self.gridOptions.api.setColumnDefs(newColdefs);
            self.autoSizeAll()
        })
        

    }
    
    /**
     * Hàm lấy các định nghĩa của cột
     */
    getColDefs(){
        let colDefs = [];
        if(this.tableMode =='Flat'){
            colDefs.push( {
                field:'index_increment',
                headerName:"",
                minWidth:90,
                width:90,
                valueGetter: function(params) {
                    if(params.node.rowPinned){
                        return ""
                    }
                    return params.node.rowIndex + 1
                },
                headerCheckboxSelection: true,
                checkboxSelection: true,
                rowDrag: true
              })
        }
        
        for (let controlName in this.tableControl.controlInTable){
            let controlInstance = this.tableControl.controlInTable[controlName];
            let col = {
                flex: 1,
                headerName:controlInstance.title,
                field: controlInstance.name,
                editable:this.checkEditableCell(controlInstance),
                hide:controlInstance.checkProps('isHidden'),
                minWidth:controlInstance.getWidth()
            };
            if(this.tableControl.isWrapText()){
                col.wrapText = true;
                col.autoHeight = true;
            }
            if (controlInstance.checkProps('isSumTable')) {
                this.sumColumns[controlName] = controlInstance;
                this.tableHasRowSum = true;
                col['pinnedRowCellRenderer'] = 'BottomPinnedRowRenderer',
                col['pinnedRowCellRendererParams'] = {
                    control:controlInstance,
                    style: { 'font-style': 'italic' },
                }
            }
            if(this.supportCellsType[controlInstance.type]){
                col['cellRenderer'] = this.supportCellsType[controlInstance.type]
            }
            else{
                col['cellRenderer'] = 'ValidateCellRenderer';
            }
            if(controlInstance.checkEmptyFormulas('autocomplete')){
                col['cellEditor'] = 'AutoCompleteCellEditor';
                col['cellEditorParams'] = {
                    control:controlInstance
                };
                col['cellRenderer'] = 'AutoCompleteCellRenderer'
            }
            if(this.rows && this.rows.length > 0){
                let rowGroup = this.rows.find(ele => ele.name == controlName);
                if(rowGroup){
                    col = {...col,...{
                        rowGroup: true,
                        enableRowGroup: true,
                        hide: true,
                        rowDrag: true
                    }}
                }
            }
            if(controlInstance.type == 'user'){
                controlInstance.setMappingUserId();
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
            col['cellRendererParams'] = {
                control:controlInstance,
                viewType:this.viewType
            };
            colDefs.push(col);
        }
        let colObjectId = {
            headerName:'child_object_id',
            field: 'childObjectId',
            hide:true
        };
        let colSqlId = {
            headerName:SQLITE_COLUMN_IDENTIFIER,
            field: SQLITE_COLUMN_IDENTIFIER,
            hide:true
        };
        colDefs.push(colObjectId);
        colDefs.push(colSqlId);
        return colDefs;
    }
    
    checkEditableCell(control){
        if(this.viewType == 'detail'){
            return false;
        }
        if(['label'].includes(control.type)){
            return false;
        }
        if(control.checkProps('isReadOnly')){
            return false;
        }

        return true;
    }
    /**
     * hoangnd
     * Hàm đọc thông tin pivot đã lưu để tạo cấu trúc các cột pivot (bao gồm header và các cột group)
     */
    appendTableColumns(data) {
        if(this.cols && this.cols.length > 0){
            let col = this.cols[0];
            let value = this.values[0];
            this.allColumnAppend = data.reduce((arr, obj)=>{
                if(obj[col.name] && !arr.includes(obj[col.name])){
                    arr.push(obj[col.name]);
                    arr.push(obj[col.name]+"_____s_table_id_sql_lite");
                    arr.push(obj[col.name]+"_____childObjectId");
                }
                return arr
            },[]);
            let controlValue = getControlInstanceFromStore(this.keyInstance, value.name);
            for (let index = 0; index < this.allColumnAppend.length; index++) {
                let colItem = this.allColumnAppend[index];
                let colField = colItem.replace('\.','____');
                let colBinding = {
                    headerName:colItem,
                    field: colField,
                    cellRenderer: this.supportCellsType[value.type],
                    cellRendererParams:{
                        control:controlValue,
                        controlColumn:colField
                    },
                    hide:colField.includes('_____s_table_id_sql_lite') || colField.includes("_____childObjectId"),
                    editable:this.checkEditableCell(controlValue),
                    // cellStyle: function(params) {
                    //     if (params.value=='R') {
                    //         return {color: 'white', backgroundColor: 'green'};
                    //     }
                    //     if (params.value=='A') {
                    //         return {color: 'white', backgroundColor: 'red'};
                    //     }
                    //     if (params.value=='C') {
                    //         return {color: 'white', backgroundColor: 'orange'};
                    //     }
                    //     if (params.value=='I') {
                    //         return {color: 'white', backgroundColor: 'gray'};
                    //     }
                    //     return null;
                    // }
                };
                this.columnDefs.push(colBinding);
            }
        }       
    }
    getHashRow(row){
        let columnDataNotChange = [];
        for(let column in row){
            if(this.cols[0].name != column && this.values[0].name != column && column != 'childObjectId' && column != 's_table_id_sql_lite'){
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
                /**
                 * đánh dấu giá trị theo dòng những trường ko đưa vào cột
                 * tạo ra 1 key tương ứng để các dòng tiếp theo nếu trùng dữ liệu thì chỉ cần đẩy dữ liệu vào cell ứng với cột
                 */
                if(!mapRowWithData.includes(rowKey)){
                    mapRowWithData.push(rowKey);
                    for (let i = 0; i < this.allColumnAppend.length; i++) {
                        let column = util.cloneDeep(this.allColumnAppend[i]);
                        let newColumn = util.cloneDeep(this.allColumnAppend[i]);
                        newColumn = newColumn.replace('\.','____');
                        newRow[newColumn] = (column == newRow[this.cols[0]['name']]) ? newRow[controlValue] : "";
                        if(column == newRow[this.cols[0]['name']]+"_____s_table_id_sql_lite"){
                            newRow[newColumn] = newRow['s_table_id_sql_lite'];
                        }
                        if(column == newRow[this.cols[0]['name']]+"_____childObjectId"){
                            newRow[newColumn] = newRow['childObjectId'];
                        }

                    }
                    newData.push(newRow);
                }
                else{
                    let columnCache = newRow[this.cols[0]['name']];
                    columnCache = columnCache.replace('\.','____');
                    newData[mapRowWithData.indexOf(rowKey)][columnCache+'_____s_table_id_sql_lite'] = newRow['s_table_id_sql_lite']
                    newData[mapRowWithData.indexOf(rowKey)][columnCache+'_____childObjectId'] = newRow['childObjectId']
                    newData[mapRowWithData.indexOf(rowKey)][columnCache] = newRow[controlValue]
                }
            }
            return newData;
        }
        return [];
    }
    /**
     * Trước khi set data cho table thì lấy các giá trị khác từ cache đưa vào data
     * @param {*} newData 
     */
    
    getDataFromCache(newData){
        let allOldKey = this.getAllKeyFromOldData();
        if(this.allControlKeyCache.length == 0){
            return;
        }
        for (let index = 0; index < newData.length; index++) {
            let rowData = newData[index];
            let newRowKey = this.getKeyCache(rowData);
            if(allOldKey[newRowKey]){
                for(let col in allOldKey[newRowKey]){
                    if(!rowData.hasOwnProperty(col)){
                        newData[index][col] = allOldKey[newRowKey][col];
                    }
                }
            }
            
        }
    }
    /**
     * Hàm lấy tát cả dữ liệu cũ và tạo key để set cache cho lần setData tiếp theo
     */
    getAllKeyFromOldData(){
        let oldData = this.getAllData();
        let allKey = {};
        for (let index = 0; index < oldData.length; index++) {
            let row = oldData[index];
            let key = this.getKeyCache(row);
            allKey[key] = row;
        }
        return allKey;
    }
    
    /**
     * Hàm tạo key từ dữ liệu
     * @param {*} rowData 
     */
    getKeyCache(rowData){
        let data = ""
        for(let col in rowData){
            if(this.allControlKeyCache.includes(col)){
                data += rowData[col];
            }
        }
        return str.hashCode(data);
    }
    /**
     * Hoangnd
     * Hàm xử lí data cho bảng
     * @param {} vl 
     */
    setData(data) {
        this.getDataFromCache(data);
        if(this.formulasWorker){
            this.formulasWorker.postMessage({action:'executeSQliteDB',data:
                {
                    func:'delete',
                    keyInstance:this.keyInstance, 
                    tableName: this.tableName,
                }
            })
        }

        if(!data){
            data = this.getRowDefaultData();
        }
        else{
            if(data.length == 0){
                if(this.viewType == 'detail'){
                    this.gridOptions.api.setRowData([{}]);
                }
                else if(this.viewType == 'update'){
                    this.gridOptions.api.setRowData(this.getRowDefaultData(false));
                }
                return;
            }
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
                    let controlIns = getControlInstanceFromStore(this.keyInstance, controlName);
                    if (controlIns.type == 'date') {
                        data[index][controlName] = controlIns.convertDateToStandard(data[index][controlName])
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
            
        }
        if(['Group','Pivot'].includes(this.tableMode)){
            this.appendTableColumns(data);
            this.gridOptions.api.setColumnDefs(this.columnDefs);
            data = this.convertDataToGroup(data);
        }
        this.gridOptions.api.setRowData(data);
        this.autoSizeAll();
        let controlBinding = Object.keys(data[0]);
        for (let index = 0; index < controlBinding.length; index++) {
            if(controlBinding[index] != 's_table_id_sql_lite'){
                this.handlerCheckEffectedControlInTable(controlBinding[index], 'all',null,controlBinding);
            }
        }
        if(this.tableHasRowSum){
            this.gridOptions.api.setPinnedBottomRowData(this.createBottomTotalRow(data))
        }
        if(this.viewType == 'print'){
            this.gridOptions.api.setDomLayout('print');
        }
        this.caculatorHeight();
    }
    /**
     * Hoangnd:
     * Hàm tính toán chiều cao cho table
     */
    caculatorHeight(){
        let h = $('#ag-'+this.tableControl.id).height();
        if(h >= 500){
            $('#ag-'+this.tableControl.id).css({height:"500px"});
            this.gridOptions.api.setDomLayout('normal');
        }
        else{
            $('#ag-'+this.tableControl.id).css({height:""});
            this.gridOptions.api.setDomLayout('autoHeight');
        }
    }
    render() {
        
        this.gridOptions = {
            columnDefs: this.columnDefs,
            animateRows: true,
            headerHeight:25,
            rowBuffer: 0,       // số view trong 1 viewport
            groupDefaultExpanded: -1,
            components: {
                NumberCellRenderer: NumberCellRenderer,
                BaseCellRenderer: BaseCellRenderer,
                FileCellRenderer: FileCellRenderer,
                PercentCellRenderer: PercentCellRenderer,
                UserCellRenderer: UserCellRenderer,
                SelectCellRenderer: SelectCellRenderer,
                CheckboxCellRenderer: CheckboxCellRenderer,
                DateCellRenderer: DateCellRenderer,
                TimeCellRenderer: TimeCellRenderer,
                AutoCompleteCellEditor:AutoCompleteCellEditor,
                AutoCompleteCellRenderer: AutoCompleteCellRenderer,
                BottomPinnedRowRenderer: BottomPinnedRowRenderer,
                ValidateCellRenderer: ValidateCellRenderer,
            },
            popupParent: document.querySelector('.wrapview-contextmenu'),
            getContextMenuItems: this.getContextMenuItems,
            rowDragManaged: true,
            pinnedBottomRowData: (this.tableHasRowSum) ? this.createBottomTotalRow() : false,
            getRowStyle: function (params) {
                if (params.node.rowPinned) {
                  return { 'font-weight': '500' };
                }
            },
            // debounceVerticalScrollbar:true,
            autoGroupColumnDef: { 
                minWidth: 0,
                cellRendererParams: {
                    checkbox: true,
                    suppressCount: true
                }
            },
            defaultColDef: {
                filter: true,
                minWidth: 100,
                flex: 1,
                sortable: true,
                resizable: true,
                editable:true,
            },
            enableRangeSelection: true,
            onGridReady:this.onGridReady,
            onColumnResized:this.onColumnResized,
            onColumnMoved:this.onColumnMoved,
            tableInstance:this,

            
        };
        this.gridOptions.context = {
            thisComponent : this
        };
        if(['submit','update'].includes(this.viewType)){
            let moreOptions = {
                rowData: this.getRowDefaultData(),
                rowSelection:'multiple',
                suppressRowClickSelection: true,
                groupSelectsChildren: true,
                suppressRowTransform:true,
                undoRedoCellEditing: true,
                enableFillHandle:true,
                enableCellTextSelection:false,
                onCellValueChanged:this.onCellValueChanged,
                onCellKeyDown:this.onCellKeyDown,
                onRowDataChanged:this.onRowDataChanged,
                onRowDataUpdated:this.onRowDataUpdated,
                onPasteEnd:this.onPasteEnd,
                onDragStarted:this.onDragStarted,
                onDragStopped:this.onDragStopped,
                onCellClicked:this.onCellClicked,
            }
            this.gridOptions = Object.assign(this.gridOptions,moreOptions);
        }
        let actionBtn = ""
        // let actionBtn = ` <div class="dropdown">
        //                     <button class="ag-pivot-action"><span class="mdi mdi-plus"></span></button>
        //                     <div class="dropdown-content">
        //                         <a onclick="addNewDataPivotTable(this, event, 'rows')" table-name="`+this.tableName+`">Thêm dòng</a>
        //                         <a onclick="addNewDataPivotTable(this, event, 'cols')" table-name="`+this.tableName+`">Thêm cột</a>
        //                     </div>
        //                 </div>`;
        if(['detail','print'].includes(this.viewType)){
            actionBtn = ""
        }
        this.tableContainer = $(`<div id="ag-` + this.tableControl.id + `" style="width: auto;position:relative;" class="ag-theme-balham group-table" s-control-type="table">
                                    `+actionBtn+`
                            </div>`)[0];
        this.tableControl.ele.before(this.tableContainer);
        if(this.viewType == 'print'){
            this.tableControl.ele.parent().find('.wrap-s-control-table').remove();
        }
        this.agInstance = new Grid(this.tableContainer, this.gridOptions, { modules: [ClientSideRowModelModule, RowGroupingModule, ClipboardModule] });
        if(this.tableControl.name == 'tb_demo'){
            // this.demoLargeData();
        }
        this.caculatorHeight();
        
    }
    autoSizeAll() {
        var allColumnIds = [];
        this.gridOptions.columnApi.getAllDisplayedColumns().forEach(function (column) {
            allColumnIds.push(column.colId);
        });
        
        this.gridOptions.api.sizeColumnsToFit();
        if(allColumnIds.length > 5 && !this.tableControl.isWrapText()){
            this.gridOptions.columnApi.autoSizeColumns(allColumnIds, false);
        }
        else{
            if(this.tableMode != 'Flat'){
                this.gridOptions.columnApi.autoSizeColumns(['ag-Grid-AutoColumn'], false);
            }
        }   
    }
    redrawRows(){
        this.gridOptions.api.redrawRows()
    }
    /**
     * tinh lại chiều cao table sau khi paste
     */
    onPasteEnd(){
        let dataForCellpasting = this.tableInstance.dataForCellpasting;
        if(Object.keys(dataForCellpasting).length == 0){
            return;
        }
        for(let column in dataForCellpasting){
            let columnDataPaste = dataForCellpasting[column];
            dataForCellpasting[column] = []; 
            if(columnDataPaste.length == 1){
                columnDataPaste[0].source = 'edit';
                this.onCellValueChanged(columnDataPaste[0])
            }
            else{
                let startRow = columnDataPaste[0].rowIndex;
                let endRow = columnDataPaste[columnDataPaste.length - 1].rowIndex;
                let controlIns = getControlInstanceFromStore(this.tableInstance.keyInstance, column);
                if(this.tableInstance.tableHasRowSum && controlIns.checkProps('isSumTable')){
                    this.tableInstance.pinnedRowNode = params.api.getPinnedBottomRow(0);
                    let sum = this.tableInstance.getColData(column);
                    this.tableInstance.pinnedRowNode.setDataValue(column,sum);
                }
    
                this.tableInstance.handleAfterChangeCellBySystem(column,startRow,endRow);
            }
            
        }
        
    }
    /**
     * Click vào cell
     */
    onCellClicked(){
        store.commit("document/addToDocumentSubmitStore", {
            key: 'tableInteractive',
            value: this.tableInstance.tableName,
            instance: this.tableInstance.keyInstance
        });
    }
    /**
     * Bắt đầu sự kiện kéo thả
     * @param {*} params 
     */
    onDragStarted(params){
        if($(params.target).is('div.ag-fill-handle')){
            this.tableInstance.isCellFilling = true;
        }
    }
    /**
     * kết thúc sự kiện kéo thả
     * @param {*} params 
     */

    onDragStopped(params){

        if($(params.target).is('div.ag-fill-handle')){
            let cellRanges = this.tableInstance.getCellRanges();
            let startRow = cellRanges[0].startRow.rowIndex;
            let endRow = cellRanges[0].endRow.rowIndex;
            if(startRow > endRow){
                let tmp = startRow;
                startRow = endRow;
                endRow = tmp;
            }
            let columns = cellRanges[0].columns;
            for (let index = 0; index < columns.length; index++) {
                const col = columns[index];
                let colName = col.colDef.field;
                let controlIns = getControlInstanceFromStore(this.tableInstance.keyInstance, colName);
                if(this.tableInstance.tableHasRowSum && controlIns.checkProps('isSumTable')){
                    this.tableInstance.pinnedRowNode = params.api.getPinnedBottomRow(0);
                    let sum = this.tableInstance.getColData(colName);
                    this.tableInstance.pinnedRowNode.setDataValue(colName,sum);
                }

                this.tableInstance.handleAfterChangeCellBySystem(colName,startRow,endRow);
                
            }
            this.tableInstance.isCellFilling = false;
        }
    }
    /**
     * Hàm lấy dữ liệu cho việc submit
     */
    getDataSubmit(){
        let data = {};
        if(this.tableMode == 'Flat'){
            data[this.tableName] = this.getDataTableForSubmit();
        }
        else if(this.tableMode == 'Group'){
            data[this.tableName] = this.getGroupData()
        }
        else{
            data[this.tableName] = {}
        }
        return data;
    }

    /**
     * chuyển data dạng pivot sang data dạng flat thì cần xóa các dữ liệu của các cột được thêm vào
     * @param {*} data 
     */
    minimizeData(data){
        for (let index = 0; index < this.allColumnAppend.length; index++) {
            let column = this.allColumnAppend[index];
            column = column.replace('\.','____')
            delete data[column];
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
                            let column = util.cloneDeep(this.allColumnAppend[index]);
                            let columnOld = util.cloneDeep(this.allColumnAppend[index]);
                            column = column.replace('\.','____')
                            if(column.indexOf('_____s_table_id_sql_lite') == -1 && column.indexOf('_____childObjectId') == -1){
                                let newRow = util.cloneDeep(node.data);
                                newRow['child_object_id'] = newRow[column+'_____childObjectId'];
                                newRow[this.cols[0].name] = columnOld;
                                newRow[this.values[0].name] = (newRow[column]) ? newRow[column] : "";
                                this.minimizeData(newRow);
                                rowData.push(newRow);   
                            }
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
                delete row['s_table_id_sql_lite'];
                delete row['childObjectId'];
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

    getDataTableForSubmit(){
        let dataSubmit = {}
        for(let controlName in this.tableControl.controlInTable){
            dataSubmit[controlName] = this.getColData(controlName);
        }
        dataSubmit['child_object_id'] = this.getColData('childObjectId');
        return dataSubmit
    }
    /**
     * Tạo dòng tính tổng
     * @param {*} data 
     */
    createBottomTotalRow(data = []) {
        var result = {};
        for (let controlName in this.sumColumns) {
            result[controlName] = 0;
        }
        return [result];
    }
    caculatorRowHeightAfterColResize(params){
        if(!this.onEventReady){
            return;
        }
        if(params.source != 'uiColumnDragged'){
            return;
        }
        let self = this;
        clearTimeout(delayTimerGridSize);
        delayTimerGridSize = setTimeout(function() {
            self.gridOptions.api.resetRowHeights();
        }, 400);
    }
    /**
     * Sự kiện xảy ra sau khi resize cột
     * @param {*} params 
     */
    onColumnResized(params){
        let thisComponent = this.context.thisComponent;
        thisComponent.onSaveConfigUi(params)
        thisComponent.caculatorRowHeightAfterColResize(params);
    }
    /**
     * Sự kiện xảy ra sau khi ẩn cột
     * @param {*} params 
     */
    onColumnMoved(params){
        let thisComponent = this.context.thisComponent;
        thisComponent.onSaveConfigUi(params)
    }
    onSaveConfigUi(params){
        let self = this;
        if(!self.onEventReady){
            return;
        }
        clearTimeout(delayTimerGridEvent);
        delayTimerGridEvent = setTimeout(function() {
            let configDetail = {tableDefinition:{}};
            params.columnApi.getAllDisplayedColumns().forEach(function (column) {
                let actualWidth = column.actualWidth;
                let colName = column.colDef.field;
                configDetail['tableDefinition'][colName] = actualWidth;
            });
            let userId = store.state.app.endUserInfo.id;
            let docName = sDocument.state.submit[self.keyInstance].documentInfo.document.name;
            let tableDefinition = "table_document_instance:"+docName+":"+self.tableName;
            uiConfigApi.saveUiConfig({detail:JSON.stringify(configDetail), userId: userId, widgetIdentifier:tableDefinition});
        }, 2000);
    }
   
    /**
     * Đổi thanh cuộn trong table
     * @param {*} params 
     */
    onGridReady(params){
        this.tableInstance.getUiConfig()
        setTimeout((self)=>{
            self.onEventReady = true;
        },4000,this.tableInstance)
        const agBodyViewport = $(this.tableInstance.tableContainer).find('.ag-body-viewport')[0];
        const agBodyHorizontalViewport = $(this.tableInstance.tableContainer).find('.ag-body-horizontal-scroll-viewport')[0];
        if (agBodyViewport) {
        const ps = new PerfectScrollbar(agBodyViewport);
            ps.update();
        }
        if (agBodyHorizontalViewport) {
        const ps = new PerfectScrollbar(agBodyHorizontalViewport);
            ps.update();
        }
        this.tableInstance.autoSizeAll();
        this.tableInstance.checkRequireChange();
    }
    checkRequireChange(){
        for (let controlName in this.tableControl.controlInTable){
            let controlInstance = this.tableControl.controlInTable[controlName];
            controlInstance.checkRequireChangeControl();
        }
    }

    /**
     * Thêm mới dòng
     * @param {*} newRow 
     * @param {*} rowIndex 
     */
    addNewRow(newRow, rowIndex) {
        this.gridOptions.api.applyTransaction({ add: newRow, addIndex:rowIndex });
        this.formulasWorker.postMessage({action:'executeSQliteDB',data:
                                {
                                    func:'insertRow',
                                    columns:Object.keys(newRow), 
                                    rowData:Object.values(newRow),
                                    keyInstance:this.keyInstance, 
                                    tableName: this.tableName
                                }
                            })
        this.caculatorHeight();
    }
    /**
     * Xóa dòng
     * @param {*} rowData 
     * @param {*} sqlRowId 
     */
    deleteRow(rowData, sqlRowId){
        this.gridOptions.api.applyTransaction({ remove: rowData});
        this.formulasWorker.postMessage({action:'executeSQliteDB',data:
                {
                    func:'deleteRow',condition:'where s_table_id_sql_lite IN (' + sqlRowId + ") ",keyInstance:this.keyInstance, tableName: this.tableName
                }
            })
        this.caculatorHeight()
    }
    setFocusedCell(rowIndex, columnName){
        this.gridOptions.api.setFocusedCell(rowIndex, columnName)   
    }
    
    /**
     * Xử lý sự kiện shift + enter xuống dòng
     * shift + enter để xóa dòng
     * @param {*} params 
     */
    onCellKeyDown(params){
        let event = params.event;
        let rowData = params.data;
        if(!rowData){
            return;
        }
        if(params.rowPinned){
            return;
        }
        if(event.key == 'Enter' && event.shiftKey && this.tableInstance.tableControl.isInsertRow()){
            if(this.tableInstance.tableMode == 'Flat'){
                let rowData = this.tableInstance.getRowDefaultData(false);
                let listRootTable = sDocument.state.submit[this.tableInstance.keyInstance]['listTableRootControl'];
                if (listRootTable.hasOwnProperty(this.tableInstance.tableName)){
                    let rowDataFromRoot = util.cloneDeep(listRootTable[this.tableInstance.tableName]['defaultRow']);
                    if(rowDataFromRoot){
                        for (let index = 0; index < rowDataFromRoot.length; index++) {
                            let cellValue = rowDataFromRoot[index];
                            rowData[0][cellValue[1]] = cellValue[2];
                        }
                    }
                    rowData[0].s_table_id_sql_lite = Date.now();
                }
                this.tableInstance.addNewRow(rowData, params.rowIndex + 1);
            }
            else{
                let groupRowData = this.tableInstance.getGroupRowData(rowData);
                this.tableInstance.addNewRow([groupRowData], params.rowIndex);
            }
            
        }
        if(event.shiftKey || event.metaKey){
            if(event.key == 'Backspace'){
                this.tableInstance.deleteRowSelection(params)
            }
        }
        else{
            let keyPress = event.keyCode;
            if(keyPress === 8|| keyPress === 46) {
                let cellRanges = params.api.getCellRanges();
                cellRanges.forEach(cells => {
                    let colIds = cells.columns.map(col => col.colId);
                    let startRowIndex = Math.min( cells.startRow.rowIndex, cells.endRow.rowIndex);
                    let endRowIndex = Math.max(cells.startRow.rowIndex, cells.endRow.rowIndex);
                    if(!this.tableInstance.tableControl.controlInTable[colIds].checkProps('isReadOnly')){
                        this.tableInstance.clearCells(startRowIndex, endRowIndex, colIds);
                    }
                });
                
            }
        }
    }
    clearCells(start, end, columns) {
        for(let i = start; i <= end; i++) {
            let rowNode = this.gridOptions.api.getRowNode(i);
            columns.forEach(column => {
                rowNode.setDataValue(column, '');
            });
        }
    }
    /**
     * Hàm xóa các dòng được chọn
     * @param {*} params 
     */
    deleteRowSelection(params){
        let rowCount = params.api.getDisplayedRowCount();
        let rowSelection = this.getSelectedRows();
        let sqlRowId = rowSelection.reduce((arr,obj)=>{
            for(let controlName in obj){
                if(controlName.indexOf('s_table_id_sql_lite') != -1){
                    arr.push('"'+obj[controlName]+'"');
                }
            }
            return arr;
        },[]);
        this.deleteRow(rowSelection, sqlRowId.join(","));
        let newCellIndex = params.rowIndex;
        if(newCellIndex > rowCount - 1){
            newCellIndex = rowCount - 1;
        }
        params.api.setFocusedCell(newCellIndex, params.colDef.field)
    }
    getGroupRowData(rowData){
        let newRow = util.cloneDeep(rowData);
        let i = 0;
        for(let controlName in newRow){
            if(controlName.indexOf('s_table_id_sql_lite') != -1){
                newRow[controlName] = Date.now() + i;
            }
            if(controlName.indexOf('childObjectId') != -1){
                newRow[controlName] = "";
            }
            let rowGroup = this.rows.find(ele => ele.name == controlName);
            if(!rowGroup){
                newRow[controlName] = "";
            }
            i++;
        }
        return newRow;
    }
    /**
     * Kiểm tra xem đang ở view detail hay submit
     */
    checkDetailView() {
        if (this.viewType == 'detail') {
            return true;
        } else {
            return false;
        }
    }
   
    /**
     * Hàm khởi tạo bảng sql lite
     */
    createSqliteTable() {
        let columns = [];
        for (let controlName in this.tableControl.controlInTable){
            let controlInstance = this.tableControl.controlInTable[controlName];
            let type = controlInstance.type;
            if(['number','percent'].includes(type)){
                type = 'numeric';
            }
            else{
                type = 'text';
            }
            columns.push(controlName + " " + type);
        }
        columns.push('s_table_id_sql_lite integer');
        columns.push('childObjectId integer');
        this.formulasWorker.postMessage({action:'executeSQliteDB',data:
            {
                func:'createTable',
                columns:columns.join(','), 
                keyInstance:this.keyInstance, 
                tableName: this.tableName,
            }
        })

    }
    /**
     * Ham trả về dòng có giá trị mặc định
     */
    getRowDefaultData(isCreateSqlTable = true){
        if (isCreateSqlTable && !this.checkDetailView())
            this.createSqliteTable();
        let rowItem = {};
        let columnInsert = [];
        let dataInsert = [];
        for (let controlName in this.tableControl.controlInTable){
            let controlInstance = this.tableControl.controlInTable[controlName];
            let defaultControlValue = controlInstance.getValueProp('defaultValue');
            if(defaultControlValue){
                columnInsert.push(controlName);
                dataInsert.push(defaultControlValue);
            }
            if(['number','percent'].includes(controlInstance.type)){
                rowItem[controlName] = 0;
            }
            rowItem[controlName] = (defaultControlValue) ? defaultControlValue : "";
            if(controlInstance.type == 'date' && controlInstance.formatDate){
                rowItem[controlName] = SYMPER_APP.$moment(rowItem[controlName]).format(controlInstance.formatDate)
            }
        }
        rowItem[SQLITE_COLUMN_IDENTIFIER] = Date.now();
        if (!this.checkDetailView()) {
            columnInsert.push('s_table_id_sql_lite');
            dataInsert.push(rowItem[SQLITE_COLUMN_IDENTIFIER]);
            this.formulasWorker.postMessage({action:'executeSQliteDB',data:
                {
                    func:'insertRow',
                    columns:columnInsert, 
                    rowData:dataInsert,
                    keyInstance:this.keyInstance, 
                    tableName: this.tableName,
                    isPromise:false
                }
            })
        }
        return [rowItem]
    }
    /**
     * Refresh lại cell renderer của 1 cell
     */
    refreshCells(controlName, rowNodeId = null){
        console.trace('oks')
        let allRowRefresh = [];
        for (let index = 0; index < rowNodeId.length; index++) {
            let rowNode = this.getRowNodeById(rowNodeId[index])
            allRowRefresh.push(rowNode)
        }
        let params = {
            force:true
        }
        if(allRowRefresh.length > 0){
            params['columns'] = [controlName];
            params['rowNodes'] = allRowRefresh;
        }
        this.gridOptions.api.refreshCells(params);
    }
    /**
     * Hàm lấy cell đang forcus
     */
    getFocusedCell(){
        return this.gridOptions.api.getFocusedCell();
    }

    getSelectedNodes(){
        return this.gridOptions.api.getSelectedNodes();
    }
    /**
     * Hàm trả về rowNode theo index
     * @param {*} index 
     */
    getDisplayedRowAtIndex(index){
        return this.gridOptions.api.getDisplayedRowAtIndex(index);
    }
    /**
     * Hàm trả về các dòng đang được chọn của table
     */
    getSelectedRows(){
        return this.gridOptions.api.getSelectedRows();
    }
    getCellRanges(){
        return this.gridOptions.api.getCellRanges();
    }
    /**
     * Set dữ liệu cho 1 cell theo key (column name)
     */
    setDataAtCell(key, value, currentRowNodeId){
        this.gridOptions.api.stopEditing(true);
        let rowNode = this.getRowNodeById(currentRowNodeId);
        rowNode.setDataValue(key,value);
    }
    /**
     * Hàm lấy model của 1 row
     * @param {*} rowIndex 
     */
    getRowNode(rowIndex){
        let rowModel = this.gridOptions.api.getModel();
        return rowModel.rowsToDisplay[rowIndex];
    }
    /**
     * Hàm lấy model của 1 row
     * @param {*} rowIndex 
     */
    getRowNodeById(id){
        return this.gridOptions.api.getRowNode(id);
    }
    /**
     * Hàm trả về dữ liệu của 1 dòng theo index
     */
    getDataByRowIndex(rowIndexs){
        let rowData = [];
        for (let index = 0; index < rowIndexs.length; index++) {
            const rowIndex = rowIndexs[index];
            rowData.push(this.getRowNode(rowIndex));
        }
        return rowData;
    }
    /**
     * Hàm trả về dữ liệu của 1 dòng theo id của row node
     */
    getDataByRowId(rowIds){
        let rowData = [];
        for (let index = 0; index < rowIds.length; index++) {
            const rowId = rowIds[index];
            rowData.push(this.gridOptions.api.getRowNode(rowId));
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
     * Hàm trả về tất cả row node id cho trường  hợp chạy công thức cả cột
     */
    getAllRowNodeId() {
        let rowData = [];
        this.gridOptions.api.forEachNode(node => 
            rowData.push(node.id)
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
    getColDataWithRowId(colName){
        let colData = [];
        this.gridOptions.api.forEachNode(node => {
            colData[node.id] = node.data[colName];
        });
        return colData;
    }
    /**
     * Hàm tính tổng 1 cột
     * @param {*} colName 
     */
    getSumColumn(colName){
        let allData = this.getAllData();
        let sum = allData.reduce((arr,obj)=>{
            if(obj[colName]){
                arr += Number(obj[colName])
            }
            return arr;
        },0)
        return sum
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
    /**
     * Hàm trả về giá trị của 1 cell theo nodeId
     * @param {*} columnName 
     * @param {*} rowIndex 
     */
    getCellDataByNodeId(columnName, rowIndex){
        let rowNode = this.gridOptions.api.getRowNode(rowIndex);
        return rowNode.data[columnName];
    }
    
    /**
     * Update dữ liệu vào column
     * @param {*} mapIndexChange 
     * @param {*} columnChange 
     */
    updateColumnData(mapIndexChange, columnChange){
        var itemsToUpdate = [];
        let dataToSqlite = {}
        this.gridOptions.api.forEachNode(function (rowNode, index) {
            if(mapIndexChange[rowNode.id]){
                var data = rowNode.data;
                dataToSqlite[data[SQLITE_COLUMN_IDENTIFIER]] = mapIndexChange[rowNode.id];
                data[columnChange] = mapIndexChange[rowNode.id];
                itemsToUpdate.push(data);
            }
        });
        if(this.formulasWorker){
            this.formulasWorker.postMessage({action:'executeSQliteDB',data:
                {
                    func:'updateMultiRow',
                    keyInstance:this.keyInstance,
                    columnName:columnChange, 
                    tableName:this.tableName, 
                    allData: dataToSqlite,
                }
            })
        }
        this.gridOptions.api.applyTransaction({ update: itemsToUpdate });
        // setTimeout((self) => {
        //     self.handlerCheckEffectedControlInTable(columnChange, 'all');
        // }, 50,this);
    }
    /**
     * Update dữ liệu vào table
     * @param {*} mapIndexChange 
     * @param {*} columnChange 
     */
    updateItems(mapIndexChange, columnChange) {
        if(this.formulasWorker){
            this.formulasWorker.postMessage({action:'executeSQliteDB',data:
                {
                    func:'delete',
                    keyInstance:this.keyInstance, 
                    tableName: this.tableName,
                }
            })
        }
        var itemsToUpdate = [];
        let allRowData = []
        this.gridOptions.api.forEachNode(function (rowNode, index) {
            if(mapIndexChange[rowNode.id]){
                var data = rowNode.data;
                data[columnChange] = mapIndexChange[rowNode.id]
                itemsToUpdate.push(data);
            }
            else{
                var data = rowNode.data;
                allRowData.push(data);
            }
        });
        let dataToSqlLite = [];
        let columnInsert = [];
        let data = allRowData;
        for (let index = 0; index < data.length; index++) {
            let rowId = Date.now() + index;
            if(!data[index]['s_table_id_sql_lite']){
                data[index]['s_table_id_sql_lite'] = rowId;
            }
            let listKey = Object.keys(data[index]);
            columnInsert = listKey;
            let rowData = [];
            for (let j = 0; j < listKey.length; j++) {
                let controlName = listKey[j];
                rowData.push('"' + data[index][controlName] + '"');
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
        this.gridOptions.api.applyTransaction({ update: itemsToUpdate });
        setTimeout((self) => {
            self.handlerCheckEffectedControlInTable(columnChange, 'all');
        }, 50,this);
    }
    /**
     * Nhận sự kiên khi giá trị của cell thay đổi => chạy công thức cho các control bị ảnh hưởng
     */
    onCellValueChanged(event){
        if(this.tableInstance.isCellFilling){
            return;
        }
        if(event.source == 'paste'){
            if(!this.tableInstance.dataForCellpasting[event.colDef.field]){
                this.tableInstance.dataForCellpasting[event.colDef.field] = []
            }
            this.tableInstance.dataForCellpasting[event.colDef.field].push(event);
            return;
        }
        if(event.rowPinned){
            return;
        }
        if(event.newValue != event.oldValue){
            let columnChange = event.colDef.field;
            let rowId = event.node.id;
            this.tableInstance.dataChange['columnName'] = columnChange;
            this.tableInstance.dataChange['currentRowData'] = event.data;
            let controlIns = getControlInstanceFromStore(this.tableInstance.keyInstance, columnChange);
            if(this.tableInstance.tableHasRowSum && controlIns.checkProps('isSumTable')){
                this.tableInstance.pinnedRowNode = event.api.getPinnedBottomRow(0);
                let sum = this.tableInstance.getColData(columnChange);
                this.tableInstance.pinnedRowNode.setDataValue(columnChange,sum);
            }

            this.tableInstance.handlerAfterChangeCellByUser(columnChange,event.newValue,event.data, rowId);
        }
        if(this.tableInstance.tableControl.isWrapText()){
            this.tableInstance.gridOptions.api.resetRowHeights();
        }
    }

    /**
     * Hàm xử lí dữ liệu thay đổi ở cell bởi user 
     */
    handlerAfterChangeCellByUser(columnName, valueChange, currentRowData, rowId) {
        let currentCol = columnName;
        // nếu trường hợp là bảng group thì cần lấy control tương ứng với cột được binding vào
        let sqlRowId = currentRowData[SQLITE_COLUMN_IDENTIFIER];
        if(this.values && this.values.length > 0 && this.tableMode == 'Group'){
            columnName = this.values[0].name;
            sqlRowId = currentRowData[currentCol + "_____" +SQLITE_COLUMN_IDENTIFIER];
        }
        this.formulasWorker.postMessage({action:'executeSQliteDB',data:
            {
                func:'editRow',
                columns:columnName, 
                value:valueChange,
                condition:'WHERE '+SQLITE_COLUMN_IDENTIFIER+' = ' + sqlRowId,
                keyInstance:this.keyInstance, 
                tableName: this.tableName
            }
        })
        this.handlerCheckEffectedControlInTable(columnName, [rowId], currentCol);

    }
    /**
     * Hàm xử lí dữ liệu thay đổi ở cell bởi hệ thống (drag, pas)
     */
    async handleAfterChangeCellBySystem(columnName, startRow, endRow) {
        let currentCol = columnName;
        // nếu trường hợp là bảng group thì cần lấy control tương ứng với cột được binding vào
        if(this.values && this.values.length > 0 && this.tableMode == 'Group'){
            columnName = this.values[0].name;
        }

        let listRowId = [];
        for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
            let rowNode = this.getRowNode(rowIndex);
            let rowData = rowNode.data;
            listRowId.push(rowNode.id);
            let sqlRowId = rowData[SQLITE_COLUMN_IDENTIFIER];
            if(this.values && this.values.length > 0 && this.tableMode == 'Group'){
                sqlRowId = rowData[currentCol + "_____" +SQLITE_COLUMN_IDENTIFIER];
            }
            this.formulasWorker.postMessage({action:'executeSQliteDB',data:
                {
                    func:'editRow',
                    columns:columnName, 
                    value:rowData[currentCol],
                    condition:'WHERE '+SQLITE_COLUMN_IDENTIFIER+' = ' + sqlRowId,
                    keyInstance:this.keyInstance, 
                    tableName: this.tableName
                }
            })
        }
        this.handlerCheckEffectedControlInTable(columnName, listRowId, currentCol);
    }
    /**
     * Sau khi thay đổi giá trị 1 cell thì lấy các control bị ảnh hưởng và chạy công thức
     * @param {*} controlName 
     * @param {*} rowId 
     */
    handlerCheckEffectedControlInTable(controlName, rowId = null, columnName = null, allControlBinding = []) {
        if (controlName == "") {
            return
        }
        let controlInstance = getControlInstanceFromStore(this.keyInstance, controlName);
        if (controlInstance && controlInstance.checkValidValueLength(rowId)) {  // chưa xử lý cho checkvalid
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
            this.handlerRunOtherFormulaControl(controlReadonlyEffected, 'readOnly', rowId, columnName);
            this.handlerRunOtherFormulaControl(controlRequireEffected, 'require', rowId, columnName);
            this.handlerRunOtherFormulaControl(controlLinkEffected, 'linkConfig', rowId, columnName);
            this.handlerRunOtherFormulaControl(controlValidateEffected, 'validate', rowId, columnName);
            this.handlerRunValueFormulaControl(controlEffected, rowId, columnName, allControlBinding);
            
        }
    }
    /**
     * Kiểm tra các công thức giá trị bị ảnh hưởng để xem có được chạy công thức hay không
     * @param {*} controlEffected 
     * @param {*} rowId 
     */
    handlerRunValueFormulaControl(controlEffected, rowId, columnName, allControlBinding = []){
        if (Object.keys(controlEffected).length > 0) {
            for (let i in controlEffected) {
                if(allControlBinding.includes(i)){
                    continue;
                }
                this.handlerCheckCanBeRunFormula(i,rowId, columnName);
            }
        }
    }
     /**
     * chạy các công thức khác bị ảnh hưởng trong table
     * @param {*} controlEffected 
     * @param {*} formulasType 
     */
    handlerRunOtherFormulaControl(controlEffected, formulasType, rowId, columnName) {
        if (Object.keys(controlEffected).length > 0) {
            for (let i in controlEffected) {
                let controlEffectedInstance = getControlInstanceFromStore(this.keyInstance,i);
                let allFormulas = controlEffectedInstance.controlFormulas;
                if (allFormulas.hasOwnProperty(formulasType)) {
                    if (formulasType == 'linkConfig') { // nếu có cấu hình công thức link thì cũng chạy các công thức của nó
                        // let configData = allFormulas[formulasType].configData;
                        // for (let ind = 0; ind < configData.length; ind++) {
                        //     let config = configData[ind];
                        //     let formulasInstance = config.instance;
                        //     let dataInput = this.getDataInputForFormulas(formulasInstance, rowId);
                        //     let fType = formulasType + "_" + config.formula.instance;
                        //     this.handleRunFormulaForControlInTable(controlEffectedInstance, dataInput, formulasInstance, rowId)
                        // }
                    } else {
                        if (allFormulas[formulasType].hasOwnProperty('instance')) {
                            let formulaInstance = allFormulas[formulasType].instance;
                            if (controlEffectedInstance.hasOwnProperty('inTable')) {
                                if (controlEffectedInstance.inTable == this.tableName) {
                                    this.handleRunFormulaForControlInTable(controlEffectedInstance, formulaInstance, rowId, columnName);
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
    handlerCheckCanBeRunFormula(controlName, rowId, columnName) {
        if (checkCanBeBind(this.keyInstance, controlName)) {
            let controlInstance = getControlInstanceFromStore(this.keyInstance, controlName);
            if (controlInstance.controlFormulas.hasOwnProperty('formulas')) {
                let formulaInstance = controlInstance.controlFormulas['formulas'].instance;
                if (controlInstance.type != 'table' && controlInstance.inTable != false) {
                    if (controlInstance.inTable == this.tableName) {
                        this.handleRunFormulaForControlInTable(controlInstance, formulaInstance, rowId);
                        return;
                    } 
                }
                else{
                    SYMPER_APP.$evtBus.$emit('run-formulas-control-outside-table', {
                        formulaInstance: formulaInstance,
                        controlName: controlName
                    });
                }
                
            }
        }
    }

    /**
     * trường hợp bảng đưa giá trị lên group mà công thức cần giá trị cho cột nào đó thì cần lấy giá trị tương ứng
     * @param {*} formulaInstance 
     * @param {*} columnGroupName 
     */
    getDataInputFromGroupTable(listInput, formulaInstance){
        let columnGroupName = this.dataChange['columnName'];
        let currentRowData = this.dataChange['currentRowData'];
        let extraData = {}
        let inputControl = formulaInstance.getInputControl();
        for (let inputControlName in inputControl) {
            if(listInput.hasOwnProperty(inputControlName)){
                let controlIns = listInput[inputControlName];
                if(controlIns.inTable == this.tableName && currentRowData){
                    if(currentRowData[inputControlName]){
                        extraData[inputControlName] = currentRowData[inputControlName];
                    }
                    else if(this.values[0].name == inputControlName){
                        extraData[inputControlName] = currentRowData[columnGroupName];
                    }
                    else if(this.cols[0].name == inputControlName){
                        let colData = columnGroupName.replace('____','\.')
                        extraData[inputControlName] = colData
                    }
                }
            }
        }
        return extraData;
        
    }
     /**
     * Hàm xử lí chạy công thức theo cột trong bảng
     * @param {*} controlEffectedInstance   Object của 1 control bị ảnh hưởng
     * @param {*} dataInput    dữ liệu đầu vào cho công  thức
     * @param {*} formulaInstance  Object cua formulas giá trị của control bị ảnh hưởng
     * @param {*} controlInstance  control đang chạy công thức
     * 
     */
    handleRunFormulaForControlInTable(controlInstance, formulaInstance, rowId = null, columnName = null) {
        let listInput = getListInputInDocument(this.keyInstance);
        // trường hợp bảng group thì cần lấy data input của control đầu vào tương ứng
        let extraData = {};
        if(this.tableMode == 'Group'){
            extraData = this.getDataInputFromGroupTable(listInput,formulaInstance);
        }
        let optionalDataBinding = sDocument.state.submit[this.keyInstance].optionalDataBinding;
        let dataInput = getDataInputFormula(formulaInstance,listInput,optionalDataBinding, rowId, extraData);
        // let sDocumentSubmit = getSDocumentSubmitStore(this.keyInstance);
        // if(!checkDataInputChange(sDocumentSubmit.rootChangeFieldName, sDocumentSubmit.dataInputBeforeChange, dataInput)){
        //     return;
        // }
        if(rowId.length == 1 && rowId != "all"){
            this.handleRunFormulaOnRow(controlInstance,dataInput, formulaInstance, rowId, columnName);
        }
        else if(rowId == "all"){
            let rowNodeId = this.getAllRowNodeId();
            let dataInputAll = prepareDataGetMultiple(dataInput,rowNodeId,listInput)
            this.handleRunFormulaOnColumn(controlInstance, formulaInstance, dataInputAll, rowNodeId)
        }
        else{
            let dataInputAll = prepareDataGetMultiple(dataInput,rowId,listInput)
            this.handleRunFormulaOnColumn(controlInstance, formulaInstance, dataInputAll, rowId);
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
    handleRunFormulaOnRow(controlInstance, dataInput, formulaInstance, rowId, columnName){
        let rowData = this.getDataByRowId(rowId);
        if(rowData.length > 0){
            rowData = rowData[0];
            let sqlRowId = rowData.data[columnName+"_____"+SQLITE_COLUMN_IDENTIFIER];
            this.formulasWorker.postMessage({action:'runFormula',data:
                {
                    formulaInstance:formulaInstance, 
                    keyInstance:this.keyInstance,
                    controlName:controlInstance.name, 
                    sqlRowId:sqlRowId, 
                    rowNodeId:rowId,
                    dataInput:dataInput,
                    columnName:columnName
                }
            });
        }
    }
    handleRunFormulaOnColumn( controlInstance,formulaInstance, dataInput,rowNodeId){
        
        this.formulasWorker.postMessage({action:'runFormula',data:
            {
                formulaInstance:formulaInstance, 
                controlName:controlInstance.name, 
                keyInstance:this.keyInstance,
                rowNodeId:rowNodeId, 
                controlType:controlInstance.type,
                runOnColumn:true,
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
    afterRunFormula(res, formulasType, controlInstance, rowNodeId, columnName, isMultiple = false){
        if(rowNodeId.length == 1 && !isMultiple){
            this.prepareDataAfterRunFormulaOnRow(res, formulasType, controlInstance, rowNodeId, columnName);
        }
        else{
            this.prepareDataAfterRunFormulaOnColumn(res, formulasType, controlInstance, rowNodeId,columnName)
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
    prepareDataAfterRunFormulaOnRow(res, formulasType, controlInstance, rowNodeId, columnName){
        if (res == undefined || !res.hasOwnProperty('data')) {
            return;
        }
        let value = minimizeDataAfterRunFormula(res);
        this.handleDataAfterRunFormula(value, controlInstance, formulasType, [rowNodeId], columnName);
    }
    /**
     * Xử lí data sau khi chạy công thức theo cột
     * data gửi lên từ worker
     * @param {*} res 
     * @param {*} formulasType 
     * @param {*} controlInstance 
     * @param {*} sqlRowId 
     */
    prepareDataAfterRunFormulaOnColumn(res, formulasType, controlInstance, listIdRow, columnName){
        if (res == undefined || !res.hasOwnProperty('data')) {
            return;
        }
        this.handleDataAfterRunFormula(res.data.data, controlInstance, formulasType,listIdRow);
    }
    /**
     * Hàm xử lí dữ liệu sau khi chạy xong công thức của 1 cột, -> set data cho cột đó -> chạy công thức cho các control ngoài bảng bị ảnh hưởng
     * @param {Object} data 
     * @param {String} controlEffectedName 
     */
    handleDataAfterRunFormula(data, controlInstance, formulasType, rowNodeId = null, columnName) {
        if (formulasType.includes('linkConfig')) {
            controlInstance.handlerDataAfterRunFormulasLink(data, formulasType);
        }
        switch (formulasType) {
            case "formulas":
                console.log(controlInstance.name,rowNodeId,'controlInstance');
                controlInstance.handlerDataAfterRunFormulasValue(data, rowNodeId);
                break;
            case "validate":
                controlInstance.handlerDataAfterRunFormulasValidate(data, rowNodeId, columnName);
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

    getRowIndexFromSqlIds(columnName, listIdRow){
        let rowIndexs = {};
        if(this.tableMode == 'Flat'){
            let newListSqlRowId = this.getColData('s_table_id_sql_lite');
            for (let index = 0; index < listIdRow.length; index++) {
                let rowIndex = newListSqlRowId.indexOf(listIdRow[index]);
                rowIndexs[listIdRow[index]] = rowIndex
            }
        }
        else if(this.tableMode == 'Group'){
            let newListSqlRowId = this.getColData('s_table_id_sql_lite');
            for (let index = 0; index < listIdRow.length; index++) {
                let rowIndex = newListSqlRowId.indexOf(listIdRow[index]);
                rowIndexs[listIdRow[index]] = rowIndex
            }
        }
        return rowIndexs;
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
import { util } from "@/plugins/util.js";
import { SYMPER_APP } from '@/main.js'
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
window.addNewDataPivotTable = function(el, event, type){
    let tableName = $(el).attr('table-name');
    event.preventDefault();
    event.stopPropagation();
    let thisListItem = util.getClosestVueInstanceFromDom(el,'submitDocument');
    thisListItem.$evtBus.$emit('on-add-data-to-pivot-table',{type:type, tableName:tableName})
    
}
export default class SymperTable {
    constructor(tableControl, keyInstance, groupConfig = {}, pivotConfig = {}, formulasWorker) {
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
        this.dataChange = {}
        
    }
    init(){
        /**
         * Các loại cell mà table hỗ trợ hiển thị
         */
        this.supportCellsType = {
            currency: 'NumberCellRenderer',
            number: 'NumberCellRenderer',
            date: 'DateCellRenderer',
            // dateTime: 'DatetimeRenderer',
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

    addCheckBoxForFirstColumn(){
        var columnDefs = getColumnDefs();
        columnDefs.forEach(function (colDef) {
            if (colDef.field === 'index_increment') {
                colDef.headerCheckboxSelection = true;
                colDef.checkboxSelection = true
            }
        });
        gridOptions.api.setColumnDefs(columnDefs);
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
                minWidth:50,
                width:50,
                valueGetter: "node.rowIndex + 1",
                pinnedRowCellRenderer:'BottomPinnedRowRenderer',
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
                minWidth: 150,

            };

            if (controlInstance.checkProps('isSumTable')) {
                this.sumColumns[controlName] = controlInstance;
                this.tableHasRowSum = true;
                col['pinnedRowCellRenderer'] = 'BottomPinnedRowRenderer',
                col['pinnedRowCellRendererParams'] = {
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
                control:controlInstance
            };
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
            hide:true
        };
        colDefs.push(colObjectId);
        colDefs.push(colSqlId);
        return colDefs;
    }
    checkEditableCell(control){
        let viewType = sDocument.state.viewType[this.keyInstance];
        if(viewType == 'detail'){
            return false;
        }
        if(['label','select'].includes(control.type)){
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
                    hide:colField.includes('_____s_table_id_sql_lite'),
                    editable:this.checkEditableCell(controlValue),
                    cellStyle: function(params) {
                        if (params.value=='R') {
                            return {color: 'white', backgroundColor: 'green'};
                        }
                        if (params.value=='A') {
                            return {color: 'white', backgroundColor: 'red'};
                        }
                        if (params.value=='C') {
                            return {color: 'white', backgroundColor: 'orange'};
                        }
                        if (params.value=='I') {
                            return {color: 'white', backgroundColor: 'gray'};
                        }
                        return null;
                    }
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

                    }
                    newData.push(newRow);
                }
                else{
                    let columnCache = newRow[this.cols[0]['name']];
                    columnCache = columnCache.replace('\.','____');
                    newData[mapRowWithData.indexOf(rowKey)][columnCache+'_____s_table_id_sql_lite'] = newRow['s_table_id_sql_lite']
                    newData[mapRowWithData.indexOf(rowKey)][columnCache] = newRow[controlValue]
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
        let controlBinding = Object.keys(data[0]);
        for (let index = 0; index < controlBinding.length; index++) {
            if(controlBinding[index] != 's_table_id_sql_lite'){
                this.handlerCheckEffectedControlInTable(controlBinding[index], 'all',null,controlBinding);
            }
        }
        if(this.tableHasRowSum){
            this.gridOptions.api.setPinnedBottomRowData(this.createBottomTotalRow(data))
        }
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
        let tableHeight = dataHeight + headerHeight + 4
        if(this.tableHasRowSum){
            tableHeight += 25
        }
        if(tableHeight > 500){
            tableHeight = 500;
        }
        $('#ag-'+this.tableControl.id).css({height:tableHeight + "px"});
    }
    render() {
        
        this.gridOptions = {
            columnDefs: this.columnDefs,
            animateRows: true,
            // rowHeight:25,
            headerHeight:25,
            rowBuffer: 0,       // số view trong 1 viewport
            groupDefaultExpanded: -1,
            components: {
                NumberCellRenderer: NumberCellRenderer,
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
            rowDragManaged: true,
            pinnedBottomRowData: (this.tableHasRowSum) ? this.createBottomTotalRow() : false,
            getRowStyle: function (params) {
                if (params.node.rowPinned) {
                  return { 'font-weight': '500' };
                }
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
                minWidth: 150,
                sortable: true,
                resizable: true,
                wrapText:true,
                autoHeight:true,
                editable:true,
            },
            getRowHeight:function (params) {
                return 25;
            },
            enableRangeSelection: true,
            onGridReady:this.onGridReady,
            tableInstance:this,

            
        };
        
        let viewType = sDocument.state.viewType[this.keyInstance];
        if(['submit','update'].includes(viewType)){
            let moreOptions = {
                rowData: this.getRowDefaultData(),
                rowSelection:'multiple',
                suppressRowTransform:true,
                undoRedoCellEditing: true,
                enableFillHandle:true,
                enableCellTextSelection:false,
                onCellValueChanged:this.onCellValueChanged,
                onCellKeyDown:this.onCellKeyDown,
                onRowDataChanged:this.onRowDataChanged,
                onRowDataUpdated:this.onRowDataUpdated,
                onPasteStart:this.onPasteStart,
                onPasteEnd:this.onPasteEnd,
                onDragStarted:this.onDragStarted,
                onDragStopped:this.onDragStopped,
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
            // this.demoLargeData();
        }
        this.caculatorHeight();
        
    }

    onPasteStart(params){
    }
    /**
     * tinh lại chiều cao table sau khi paste
     */
    onPasteEnd(){
        this.tableInstance.caculatorHeight();
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
                console.log(startRow, endRow, 'endRowendRow');
                let controlIns = getControlInstanceFromStore(this.tableInstance.keyInstance, column);
                if(this.tableInstance.tableHasRowSum && controlIns.checkProps('isSumTable')){
                    this.tableInstance.pinnedRowNode = params.api.getPinnedBottomRow(0);
                    let sum = this.tableInstance.getSumColumn(column);
                    this.tableInstance.pinnedRowNode.setDataValue(column,sum);
                }
    
                this.tableInstance.handleAfterChangeCellBySystem(column,startRow,endRow);
            }
            
        }
        
    }
    onDragStarted(params){
        if($(params.target).is('div.ag-fill-handle')){
            this.tableInstance.isCellFilling = true;
        }
    }
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
                    let sum = this.tableInstance.getSumColumn(colName);
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
                            let newRow = util.cloneDeep(node.data);
                            newRow[this.cols[0].name] = columnOld;
                            newRow[this.values[0].name] = (newRow[column]) ? newRow[column] : "";
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
                delete row['s_table_id_sql_lite'];
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
        
        dataSubmit['child_object_id'] = this.getColData('child_object_id');
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

    /**
     * Đổi thanh cuộn trong table
     * @param {*} params 
     */
    onGridReady(params){
        // setTimeout((self)=>{
        //     // params.api.sizeColumnsToFit()
        // },1000)
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
    }

    /**
     * Thêm mới dòng
     * @param {*} newRow 
     * @param {*} rowIndex 
     */
    addNewRow(newRow, rowIndex) {
        this.gridOptions.api.applyTransaction({ add: newRow, addIndex:rowIndex });
        console.log(rowIndex,'rowIndexrowIndex');
        this.formulasWorker.postMessage({action:'executeSQliteDB',data:
                                {
                                    func:'insertRow',
                                    columns:Object.keys(newRow), 
                                    rowData:Object.values(newRow),
                                    keyInstance:this.keyInstance, 
                                    tableName: this.tableName
                                }
                            })
        this.caculatorHeight()
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
                    func:'deleteRow',condition:'where s_table_id_sql_lite = ' + sqlRowId,keyInstance:this.keyInstance, tableName: this.tableName
                }
            })
        this.caculatorHeight()
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
        let sqlRowId = rowData.s_table_id_sql_lite;
        if(params.rowPinned){
            return;
        }
        if(event.key == 'Enter' && event.shiftKey && this.tableInstance.tableControl.isInsertRow()){
            let rowData = this.tableInstance.getRowDefaultData(false);
            let listRootTable = sDocument.state.submit[this.tableInstance.keyInstance]['listTableRootControl'];
            if (listRootTable.hasOwnProperty(this.tableInstance.tableName)){
                let rowDataFromRoot = util.cloneDeep(listRootTable[this.tableInstance.tableName]['defaultRow']);
                for (let index = 0; index < rowDataFromRoot.length; index++) {
                    let cellValue = rowDataFromRoot[index];
                    rowData[0][cellValue[1]] = cellValue[2];
                    
                }
                rowData[0].s_table_id_sql_lite = Date.now();
            }
            this.tableInstance.addNewRow(rowData, params.rowIndex + 1);
        }
        else if(event.key == 'Backspace' && event.shiftKey){
            let rowCount = this.api.getDisplayedRowCount();
            let rowSelection = this.tableInstance.getSelectedRows();
            this.tableInstance.deleteRow(rowSelection, sqlRowId);
            let newCellIndex = params.rowIndex;
            if(newCellIndex > rowCount - 1){
                newCellIndex = rowCount - 1;
            }
            this.api.setFocusedCell(newCellIndex, params.colDef.field)
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
                let sum = this.tableInstance.getSumColumn(columnChange);
                this.tableInstance.pinnedRowNode.setDataValue(columnChange,sum);
            }

            this.tableInstance.handlerAfterChangeCellByUser(columnChange,event.newValue,event.data, rowId);
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
                if (controlInstance.type != 'table') {
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
        let columnGroupName = this.dataChange['columnName']
        let currentRowData = this.dataChange['currentRowData']
        let extraData = {}
        let inputControl = formulaInstance.getInputControl();
        for (let inputControlName in inputControl) {
            if(listInput.hasOwnProperty(inputControlName)){
                let controlIns = listInput[inputControlName];
                if(controlIns.inTable == this.tableName){
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
        let dataInput = getDataInputFormula(formulaInstance,listInput,{}, rowId, extraData);
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
    afterRunFormula(res, formulasType, controlInstance, rowNodeId, columnName){
        if(rowNodeId.length == 1){
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
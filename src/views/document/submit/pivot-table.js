import { util } from "@/plugins/util.js";
import { Grid } from 'ag-grid-community';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';

window.addNewDataPivotTable = function(el, event, type){
    let tableName = $(el).attr('table-name');
    event.preventDefault();
    event.stopPropagation();
    let thisListItem = util.getClosestVueInstanceFromDom(el,'submitDocument');
    thisListItem.$evtBus.$emit('on-add-data-to-pivot-table',{type:type, tableName:tableName})
    
}
export default class PivotTable {
    constructor(control, tableName, controlId, pivotConfig, keyInstance) {
        this.controlObj = control;
        this.tableName = tableName;
        this.tableControlId = controlId
        this.keyInstance = keyInstance;
        this.gridOptions = null;
        this.pivotConfig = pivotConfig;
        this.tableContainer = null;
        this.columnDefs = [];
    }
    /**
     * hoangnd
     * Hàm đọc thông tin pivot đã lưu để tạo cấu trúc các cột pivot (bao gồm header và các cột group)
     */
    setPivotColumns() {
        let rows = this.pivotConfig.rows;
        let cols = this.pivotConfig.cols;
        let values = this.pivotConfig.values;
        for (let index = 0; index < cols.length; index++) {
            let colItem = cols[index];
            let colPivot = {
                headerName:colItem.title,
                field: colItem.name,
                otherPivotName:colItem.name,
                pivot: true,
                enablePivot: true,
            };
            this.columnDefs.push(colPivot);
        }

        for (let index = 0; index < rows.length; index++) {
            let colItem = rows[index];
            let colPivot = {
                field: colItem.name,
                headerName:colItem.title,
                rowGroup: true,
                enableRowGroup: true,
            };
            this.columnDefs.push(colPivot);
        }
        for (let index = 0; index < values.length; index++) {
            let colItem = values[index];
            let colPivot = {
                headerName:colItem.title,
                otherName:colItem.name,
                field: colItem.name,
                aggFunc: this.customPivotFunc,
            };
            this.columnDefs.push(colPivot);
        }
    }
    getDataGroup(){
        let allRowGroup = this.gridOptions.columnApi.getRowGroupColumns();
        let allPivotCol = this.gridOptions.columnApi.getPivotColumns();
        let rowGroup = [];
        let colPivotData = [];

        if(allRowGroup.length > 0){
            rowGroup.push(allRowGroup[0].colDef.field);
        }
        if(allRowGroup.length > 0){
            colPivotData.push(allPivotCol[0].colDef.field);
        }
        return {cols:colPivotData,rows:rowGroup}
    }
    setData(vl) {
        this.columnDefs = [];
        this.setPivotColumns();
        this.gridOptions.api.setColumnDefs(this.columnDefs);
        this.gridOptions.api.setRowData(vl);
        this.onBtStartEditing();
    }
    render() {
        this.gridOptions = {
            columnDefs: this.columnDefs,
            headerHeight:24,
            groupHeaderHeight:24,
            pivotHeaderHeight:24,
            pivotGroupHeaderHeight:24,
            animateRows: true,
            getRowHeight: this.getRowHeight,
            groupDefaultExpanded: -1,
            rowData: [],
            autoGroupColumnDef: { minWidth: 250 },
            pivotMode: true,
            defaultColDef: {
                editable: true,
                flex: 1,
                minWidth: 150,
                sortable: true,
                resizable: true,
            },
            sideBar: false,
            suppressAggFuncInHeader: true,
            onCellDoubleClicked: this.onCellDoubleClick,
            onCellClicked: this.onCellClick,
        };
        this.tableContainer = $(`<div id="ag-` + this.controlObj.id + `" style="height: 0px; width: auto;position:relative;" class="ag-theme-alpine" s-control-type="table">
        
        
            <div class="dropdown">
                <button class="ag-pivot-action"><span class="mdi mdi-plus"></span></button>
                <div class="dropdown-content">
                    <a onclick="addNewDataPivotTable(this, event, 'rows')" table-name="`+this.tableName+`">Thêm dòng</a>
                    <a onclick="addNewDataPivotTable(this, event, 'cols')" table-name="`+this.tableName+`">Thêm cột</a>
                </div>
            </div>
            
        
        </div>`)[0];
        this.controlObj.ele.before(this.tableContainer);
        new Grid(this.tableContainer, this.gridOptions, { modules: [ClientSideRowModelModule, RowGroupingModule] });
    }
    onBtStartEditing(key, char, pinned) {
        this.gridOptions.api.setFocusedCell(0, 'tb1_sl', pinned);
      
        this.gridOptions.api.startEditingCell({
          rowIndex: 0,
          colKey: 'tb1_sl',
          // set to 'top', 'bottom' or undefined
          rowPinned: pinned,
          keyPress: key,
          charPress: char,
        });
    }
    getRowHeight(params) {
        if (params.node.group) {
            return 25;
        } else {
            return 25;
        }
    }
    onCellClick(row){
        console.log("sadsadsad",row);
        console.log("sadsadsad",row.api.getSelectedNodes());
    }

    onCellDoubleClick(row){
        let column = row.colDef;
        let columnNameSelected = column.otherName;
        let pivotKeys = column.pivotKeys;
        debugger
        let cellEl = $(row.event.target).closest('.ag-cell');
        let offset = cellEl.offset();
        

        $('.input-pivot').val(cellEl.text());
        $('.input-pivot').css({display:'block',top:offset.top,left:offset.left,width:cellEl.outerWidth()}).focus();
    }
    /**
     * hoangnd
     * hàm set giá trị cho các cột được đưa vào values của pivot
     * @param {} values 
     */
    customPivotFunc(values) {
        var v = 0;
        values.forEach(function(value) {
            if (!value) {
                value = 0;
            }
            v += value;
        });
        if(v==0){
            v=""
        }
        return v;
    }
    show() {
        this.tableContainer.style.height = '400px';
    }

}
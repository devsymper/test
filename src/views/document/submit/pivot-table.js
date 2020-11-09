import { Grid } from 'ag-grid-community';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';

function myCustomAggFunc(values) {
    var sum = "";
    values.forEach(function(value) { sum += value; });
    return sum;
}
export default class PivotTable {
    constructor(control, tableName, controlId, pivotConfig, keyInstance) {
        this.controlObj = control;
        this.tableName = tableName;
        /**
         * Biến lưu id element của control table
         */
        this.tableControlId = controlId
        this.keyInstance = keyInstance;
        this.gridOptions = null;
        this.pivotConfig = pivotConfig;
        this.tableContainer = null;
        this.columnDefs = [];
        this.rowData = []
    }
    setPivotColumns() {
        let rows = this.pivotConfig.rows;
        let cols = this.pivotConfig.cols;
        let values = this.pivotConfig.values;
        for (let index = 0; index < cols.length; index++) {
            let colItem = cols[index];
            let colPivot = {
                field: colItem.name,
                pivot: true,
                enablePivot: true,
            };
            this.columnDefs.push(colPivot);
        }

        for (let index = 0; index < rows.length; index++) {
            let colItem = rows[index];
            let colPivot = {
                field: colItem.name,
                rowGroup: true,
                enableRowGroup: true,
            };
            this.columnDefs.push(colPivot);
        }
        for (let index = 0; index < values.length; index++) {
            let colItem = values[index];
            let colPivot = {
                field: colItem.name,
                aggFunc: myCustomAggFunc
            };
            this.columnDefs.push(colPivot);
        }
    }
    setData(vl) {
        this.setPivotColumns();
        this.rowData = vl;
        this.gridOptions.api.setColumnDefs(this.columnDefs);
        this.gridOptions.api.setRowData(vl);
    }
    render() {

        // specify the data
        // let the grid know which columns and what data to use
        this.gridOptions = {
            columnDefs: this.columnDefs,
            rowData: this.rowData,
            autoGroupColumnDef: { minWidth: 250 },
            pivotMode: true,
            defaultColDef: {
                flex: 1,
                minWidth: 150,
                sortable: true,
                resizable: true,
            },
            sideBar: false,
            suppressAggFuncInHeader: true,
        };
        this.tableContainer = $('<div id="ag-' + this.controlObj.id + '" style="height: 0px; width: 600px" class="ag-theme-alpine" s-control-type="table"></div>')[0];
        this.controlObj.ele.before(this.tableContainer);
        new Grid(this.tableContainer, this.gridOptions, { modules: [ClientSideRowModelModule, RowGroupingModule] });
    }

    show() {
        this.tableContainer.style.height = '400px'
    }

}
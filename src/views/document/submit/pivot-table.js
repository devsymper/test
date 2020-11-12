import { Grid } from 'ag-grid-community';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';

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
                aggFunc: this.customPivotFunc
            };
            this.columnDefs.push(colPivot);
        }
    }
    setData(vl) {
        this.columnDefs = [];
        this.setPivotColumns();
        this.gridOptions.api.setColumnDefs(this.columnDefs);
        this.gridOptions.api.setRowData(vl);
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
            rowData: [],
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
    getRowHeight(params) {
        if (params.node.group) {
            return 25;
        } else {
            return 25;
        }
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
        this.tableContainer.style.height = '400px'
    }

}
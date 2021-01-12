import { util } from "@/plugins/util.js";
import { Grid } from 'ag-grid-community';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-alpine.css';
import store from './../../../store'
import {getControlInstanceFromStore} from './../common/common'
import sDocument from './../../../store/document'

window.addNewDataPivotTable = function(el, event, type){
    let tableName = $(el).attr('table-name');
    event.preventDefault();
    event.stopPropagation();
    let thisListItem = util.getClosestVueInstanceFromDom(el,'submitDocument');
    thisListItem.$evtBus.$emit('on-add-data-to-pivot-table',{type:type, tableName:tableName})
    
}
export default class GroupTable {
    constructor(control, tableName, controlId, groupConfig, keyInstance) {
        this.controlObj = control;
        this.tableName = tableName;
        this.tableControlId = controlId
        this.instance = keyInstance;
        this.gridOptions = null;
        this.groupConfig = groupConfig;
        this.tableContainer = null;
        this.tableHeight = "400px";
        this.columnDefs = this.getColDefs();
    }
    getColDefs(){
        let colDefs = []
        let rows = this.groupConfig.rows;
        let cols = this.groupConfig.cols;
        for (let controlName in this.controlObj.listInsideControls){
            let controlInstance = getControlInstanceFromStore(this.instance,controlName);
            let col = {
                headerName:controlInstance.title,
                field: controlInstance.name,
                editable:true,
            };
            let rowGroup = rows.find(ele => ele.name == controlName);
            if(rowGroup){
                col = {...col,...{
                    rowGroup: true,
                    enableRowGroup: true,
                    hide: true,
                }}
            }
            if(cols.length > 0){
                if(cols[0].name == controlName){
                    continue
                }
            }
            colDefs.push(col);
        }
        return colDefs;
    }
    /**
     * hoangnd
     * Hàm đọc thông tin pivot đã lưu để tạo cấu trúc các cột pivot (bao gồm header và các cột group)
     */
    appendTableColumns(data) {
        let cols = this.groupConfig.cols;
        if(cols.length > 0){
            let col = cols[0];
            let allColumnBinding = data.reduce((arr, obj)=>{
                if(obj[col.name] && !arr.includes(obj[col.name])){
                    arr.push(obj[col.name])
                }
                return arr
            },[]);
            for (let index = 0; index < allColumnBinding.length; index++) {
                let colItem = allColumnBinding[index];
                let colBinding = {
                    headerName:colItem,
                    field: colItem,
                };
                this.columnDefs.push(colBinding);
            }
        }
    }
    /**
     * Hàm lấy thông tin các cột và đong được pivot
     */
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
    /**
     * Hoangnd
     * Hàm xử lí data cho bảng
     * @param {} vl 
     */
    setData(vl) {
        for (let index = 0; index < vl.length; index++) {
            let rowData = vl[index];
            console.log(rowData,'rowDatarowData');
            
        }
        this.autoData(vl);
        this.appendTableColumns(vl);
        this.gridOptions.api.setColumnDefs(this.columnDefs);
        this.gridOptions.api.setRowData(vl);
        let viewType = sDocument.state.viewType[this.instance];
        if(viewType == 'print'){
            this.gridOptions.api.setDomLayout('print');
        }
        this.caculatorHeight();
        
    }
    autoData(vl){
        for (let controlName in this.controlObj.listInsideControls){

        }
    }
    /**
     * Hoangnd:
     * Hàm tính toán chiều cao cho table
     */
    caculatorHeight(){
        let dataHeight = this.gridOptions.api.getDisplayedRowCount()*24;
        let headerHeight = 0;
        if(this.groupConfig.cols.length > 0){
            headerHeight += 24;
        }
        let tableHeight = dataHeight + headerHeight + 3;
        if(tableHeight > 500){
            tableHeight = 500;
        }
        $('#ag-'+this.controlObj.id).css({height:tableHeight + "px"});
    }
    render() {
        this.gridOptions = {
            columnDefs: this.columnDefs,
            animateRows: true,
            rowHeight:24,
            groupDefaultExpanded: -1,
            rowData: [],
            autoGroupColumnDef: { 
                minWidth: 250,
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
            sideBar: false,
        };
        let viewType = sDocument.state.viewType[this.instance];
        let actionBtn = ` <div class="dropdown">
                            <button class="ag-pivot-action"><span class="mdi mdi-plus"></span></button>
                            <div class="dropdown-content">
                                <a onclick="addNewDataPivotTable(this, event, 'rows')" table-name="`+this.tableName+`">Thêm dòng</a>
                                <a onclick="addNewDataPivotTable(this, event, 'cols')" table-name="`+this.tableName+`">Thêm cột</a>
                            </div>
                        </div>`;
        if(['detail','print'].includes(viewType)){
            actionBtn = ""
        }
        this.tableContainer = $(`<div id="ag-` + this.controlObj.id + `" style="height: `+this.tableHeight+`; width: auto;position:relative;" class="ag-theme-alpine group-table" s-control-type="table">
                                    `+actionBtn+`
                            </div>`)[0];
        this.controlObj.ele.before(this.tableContainer);
        if(viewType == 'print'){
            this.controlObj.ele.parent().find('.wrap-s-control-table').remove();
        }
        new Grid(this.tableContainer, this.gridOptions, { modules: [ClientSideRowModelModule, RowGroupingModule] });
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
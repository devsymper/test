<template>
    <div 
        :id="'symper-table-wrapper-' + cellConfigs.sharedConfigs.cellId"
        class="table-title h-100 symper-table-cell" 
        @mousedown="handleCellMouseDown" 
        @mouseover="handleMouseOver()"
        @mouseup="handleCellMouseUp">
        <div ref="styleTag" ></div>
        <ag-grid-vue
            :style="tableStyle" 
            class="ag-theme-balham symper-table-report" 
            :gridOptions="gridOptions"
            :columnDefs="options.columns"
            :rowData="options.data"
            :columnTypes="columnTypes"
            :suppressRowClickSelection="true"
            :rowSelection="'multiple'"
            :getRowStyle="getRowStyle"
            :defaultColDef="defaultColDef"
            :autoGroupColumnDef="autoGroupColumnDef"
            :stopEditingWhenGridLosesFocus="true"
            :modules="modules"
            @model-updated="onTableRender()"
            @column-resized="onColumnResized()"
            @grid-ready="onAgReady"
            @column-visible="onShowHideColumns"
            @column-pinned="afterPinnedColumns">
        </ag-grid-vue>
        <div class="symper-table-pagination" >
            <!-- <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentPageChange"
                :current-page.sync="currentPage"
                :page-sizes="[200, 300, 400]"
                :page-size="100"
                layout="total, sizes, prev, pager, next"
                :total="cellConfigs.sharedConfigs.total">
            </el-pagination> -->
        </div>
    </div>
</template> 
<script>

import {AgGridVue} from "ag-grid-vue";
import { MenuModule } from '@ag-grid-enterprise/menu';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-balham.css';

import agDataTypeStyle from '@/components/dashboard/configPool/agCellRenderer.js'
import agCellRenderer from "@/components/dashboard/configPool/agDataTypeStyle.js";
import PerfectScrollbar from "perfect-scrollbar";
// import { pivotSupport } from '../configPool/translatorGroups';

export default {
    props: {
        cellConfigs: {
            default(){
                return {}
            }
        }
    },

    methods : {
        handleCurrentPageChange(currentPage){
            this.cellConfigs.sharedConfigs.currentPage = currentPage; 
            SDashboardEditor.onChangeCellConfigs('column', this.cellConfigs.sharedConfigs.cellId);
        },
        handleSizeChange(pageSize){
            this.cellConfigs.sharedConfigs.pageSize = pageSize;
            SDashboardEditor.onChangeCellConfigs('column', this.cellConfigs.sharedConfigs.cellId);
        },
        onShowHideColumns(){
            let hiddenCols = {};
            this.gridColumnApi.getColumnState().forEach((colState)=>{
                if(colState.hide){
                    hiddenCols[colState.colId] = true;
                }
            });
            let cellId = this.cellConfigs.sharedConfigs.cellId;
            if(!this.cellConfigs.rawConfigs.extra){
                this.cellConfigs.rawConfigs.extra = {};
            }
            this.cellConfigs.rawConfigs.extra.hiddenCols = hiddenCols;
            // this.applyHiddenToDisplayConfig(hiddenCols);
        },
        applyHiddenToDisplayConfig(hiddenCols){
            let leafCols = [];
            let colDefs = this.options.columns;
            
            pivotSupport.getLeafColFromGroup(colDefs, leafCols);
            for(let col of colDefs){
                col.hide = hiddenCols[col.field] ? true : false;
            }
        },
        handleMouseOver(){
            if(this.inPrintingMode){
                this.inPrintingMode = false;
                this.gridApi.setDomLayout(null);
            }
        },
        printInnerHTML(headerHTML = ''){
            this.gridApi.setDomLayout('print');
            let self = this;
            setTimeout(() => {
                self.inPrintingMode = true;
                let domHTML = $(self.$el).find('.symper-table-report')[0].outerHTML;
                domHTML = headerHTML + domHTML;
                window.printDOM(domHTML);
            }, 500);
        },
        onAgReady($event,gridContainer){
        },
        addPerfectScrollBar(){
            if(this.perfectScrollInstance){
                this.perfectScrollInstance.destroy();
            }
            let array=[ ".ag-body-viewport"," .ag-body-horizontal-scroll-viewport"];
            for(let className of array){
                let container = $(this.$el).find(className);
                if(container[0]){
                    let ps = new PerfectScrollbar(container[0]);
                    ps.update();
                    this.perfectScrollInstance = ps;
                }
            }
        },
        afterPinnedColumns(){
            let pinnedColIdx = {};
            let runner = 0;

            this.gridColumnApi.getColumnState().forEach((colState)=>{
                if(colState.pinned){
                    pinnedColIdx[runner] = colState.pinned;
                }
                runner += 1;
            });

            if(!this.cellConfigs.rawConfigs.extra){
                this.cellConfigs.rawConfigs.extra = {};
            }
            this.cellConfigs.rawConfigs.extra.pinnedColIdx = pinnedColIdx;            
        },
        handleTableScroll(){
            console.log('scrolling');
        },
        handleCellMouseDown(evt){
            if($(evt.target).hasClass('ag-header-cell-resize')){
                this.isResizing = true;
                SDashboardEditor.lockWorkspace();
            }
        },
        handleCellMouseUp(evt){
            if(this.isResizing){
                this.isResizing = false;
                SDashboardEditor.unlockWorkspace();
                this.saveColumnWidth();
            }
        },
        saveColumnWidth(){
            let columns = this.gridColumnApi.getColumnState();
            let colWidths = [];
            for(let col of columns){
                colWidths.push(col.width);
            }
            if(!this.cellConfigs.rawConfigs.extra){
                this.cellConfigs.rawConfigs.extra = {};
            }

            this.cellConfigs.rawConfigs.extra.columnsWidth = colWidths;
        },
        convertCssObjToStr(styleObj){
            let rsl = '';
            for(let styleName in this.options.headerStyle){
                let name = styleName.replace(/([A-Z])/g,'-$1').toLowerCase();
                rsl += `${name} : ${styleObj[styleName]}; \n`;
            }
            return rsl;
        },
        reStyleHeader(){
            let cellId = this.cellConfigs.sharedConfigs.cellId;
            let table = $(`.symper-dashboard-cell[symper-cell-id=${cellId}]`);
            let idCell = 'symper-table-wrapper-' + cellId;
            let style = this.convertCssObjToStr(this.options.headerStyle);
            if(style){
                style = `#${idCell} .ag-header-container {
                    ${style}
                }`;
            }
            let headerStyle = this.options.headerStyle;
            if(headerStyle){
                style += `
                    #${idCell} .ag-floating-bottom {
                        font-weight: bold;
                    }
                    #${idCell} .ag-header-cell {
                        border-top-width: ${headerStyle.borderWidth};
                        border-top-color: ${headerStyle.borderColor};
                        border-bottom-width: ${headerStyle.borderWidth};
                        text-align: ${headerStyle.textAlign};
                        border-bottom-color: ${headerStyle.borderColor};
                    }
                    #${idCell} .ag-header-group-cell {
                        border-top-width: ${headerStyle.borderWidth};
                        border-top-color: ${headerStyle.borderColor};
                        border-bottom-color: ${headerStyle.borderColor};
                    }
                    #${idCell} .ag-header-group-cell .ag-header-group-cell-label,
                    #${idCell} .ag-header-cell .ag-header-cell-label {
                        justify-content: ${headerStyle.textAlign == 'right' ? 'flex-end' : headerStyle.textAlign};
                    }

                    #${idCell} .ag-floating-bottom{
                        border-bottom-width: ${headerStyle.borderWidth}!important;
                        border-bottom-color: ${headerStyle.borderColor}!important;
                        border-top-width: ${headerStyle.borderWidth}!important;
                        border-top-color: ${headerStyle.borderColor}!important;
                        border-bottom-style: inset;
                    }
                    `;
                
                
                if(headerStyle.verticalLine){
                    style += `
                        #${idCell} .ag-header-group-cell,
                        #${idCell} .ag-header-cell {
                            border-right-width: ${headerStyle.borderWidth};
                            border-right-color: ${headerStyle.borderColor};
                        }
                        
                        #${idCell} .ag-floating-bottom .ag-cell{
                            border-right-width: ${headerStyle.borderWidth};
                            border-right-color: ${headerStyle.borderColor};
                            border-bottom-right: inset;
                        }
                    `;
                }else {
                    style += `
                        #${idCell} .ag-header-group-cell,
                        #${idCell} .ag-header-cell {
                            border-right-width: 0px;
                            border-right-color: 0px;
                        }
                    `;
                }
            }
            return style;
        },
        reStyleDataCell(){
            let cellId = this.cellConfigs.sharedConfigs.cellId;
            let table = $(`.symper-dashboard-cell[symper-cell-id=${cellId}]`);
            let idCell = 'symper-table-wrapper-' + cellId;
            let style = this.convertCssObjToStr(this.options.cellStyle);
            if(style){
                style = `#${idCell} .ag-header-container {
                    ${style}
                }`;
            }
            let cellStyle = this.options.cellStyle;
            if(cellStyle){
                if(cellStyle.verticalLine){
                    style += `
                        #${idCell} .ag-cell {
                            border-right-width: ${cellStyle.borderBottomWidth};
                            border-right-color: ${cellStyle.borderBottomColor};
                        }`;
                }else {
                    style += `
                        #${idCell} .ag-cell {
                            border-right-width: 0px;
                            border-right-color: '#00000000';
                        }`;
                }
            }
            return style;
        },
        onTableRender(){
            let customStyle = this.reStyleHeader();
            customStyle += this.reStyleDataCell();
            let styleTag = this.$refs.styleTag;
            styleTag.innerHTML = `<style>${customStyle}</style>`;

            setTimeout((thisCpn) => {
                // thisCpn.setColumnWidth();            
            }, 500, this);
            if(this.options.needTotal && this.options.totalRow && this.options.totalRow[0]){
            //    this.gridApi.setPinnedBottomRowData(_.cloneDeep(this.options.totalRow)); 
            }else{
            //    this.gridApi.setPinnedBottomRowData([]); 
            }
            this.addPerfectScrollBar();
        },

        /**
         * Điều chỉnh chiều rộng của cột trong bảng
         */
        setColumnWidth(){
            // Nếu người dùng resize các cột của table -> có dữ liệu về chiều rộng của từng cột
            if(this.cellConfigs.viewConfigs.needSaveExtraOptions.colWidth){

            }else{
                let mode = this.options.tableColumnWidthMode ;
                if(mode == 'auto'){
                    return;
                }
                if(mode != 'fitCell'){
                    this.autoSizeAll(mode == 'fitData');
                }else{
                    let w = SDashboardEditor.getSizeOfCellContent(this.cellConfigs.sharedConfigs.cellId).w;
                    this.gridColumnApi.sizeColumnsToFit(w);
                }
            }
        },

        checkHasVerticalScroll(){
            let viewportHeight = $(this.$el).find('.ag-body-viewport ').height();
            let bodyHeight = $(this.$el).find('.ag-center-cols-clipper').height();
            return bodyHeight > viewportHeight;
        },

        /**
         * Tự động resize chiều rộng các cột theo chiều dài dữ liệu của cột đó
         * @param {Boolean} skipHeader xét việc co chiều rộng có xét tới chiều rộng của header hay không
         * @returns {void}
         */
        autoSizeAll(skipHeader) {
            var allColumnIds = [];
            let allCols = this.gridColumnApi.getAllColumns();
            if(allCols){
                allCols.forEach(function(column) {
                    allColumnIds.push(column.colId);
                });
                this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
            }
        },

        /**
         * Xử lý khi resize một column của table
         * @returns {void}
         */
        onColumnResized(){
            let widths = [];
            this.gridColumnApi.getColumnState().forEach((colState)=>{
                widths.push(colState.width);
            });
            let cellId = this.cellConfigs.sharedConfigs.cellId;
            SDashboardEditor.dashboardConfigs.allCellConfigs[cellId].viewConfigs.needSaveExtraOptions.columnWidths = widths;
        }
    },
    computed : {
        options (){
            return this.cellConfigs.viewConfigs.displayOptions;
        },
        tableStyle(){
            return Object.assign({
                width: '100%', 
                height: 'calc(100% - 35px)'
            },this.options.cellStyle);
        }
    },
    components:{
        'ag-grid-vue':AgGridVue,
    },
    beforeMount(){
        this.gridOptions = {
             components: {
                'numberRenderer': agCellRenderer.numberRenderer
            },
        };
        let thisCpn = this;
        this.getRowStyle = params => {
            let style = {};
            if (params.node.rowPinned) {
                style = thisCpn.options.totalRowStyle;
            }else{
                style = thisCpn.options.cellStyle;
            }

            if(thisCpn.options.getRowStyle){
                let conditionFormatRowStyle = thisCpn.options.getRowStyle(params);
                if(conditionFormatRowStyle){
                    style = Object.assign(style, conditionFormatRowStyle);
                }
            }
            return style;
        }
    },
    mounted(){
        this.gridApi = this.gridOptions.api;
        this.gridColumnApi = this.gridOptions.columnApi;
    },
    data(){
        return {
            currentPage: 1,
            isResizing: false,
            gridOptions:null,
            gridApi: null,
            columnApi: null,
            modules: [
                MenuModule,
                RowGroupingModule,
                ClientSideRowModelModule,
                RowGroupingModule
            ],
            defaultColDef:{
                editable: true,
                resizable: true
            },
            customRowStyle: null,
            getRowStyle : null,
            exporting:false,
            columnTypes:agDataTypeStyle,
            autoGroupColumnDef:{
                filterValueGetter: params => {
                    var colGettingGrouped = params.colDef.showRowGroup;
                    var valueForOtherCol = params.api.getValue(colGettingGrouped, params.node);
                    return valueForOtherCol;
                }
            }
        }
    },  
}
</script>
<style >
.symper-table-report .ag-root{
    border: none!important;
}

.symper-table-report .ag-root .ag-row{
    border-top: none!important;
}

.symper-table-dashboard-header::after{
    border-right: none!important
}

.symper-table-cell .ag-header{
    border-bottom: none!important;
    background-color: inherit!important;
}

.symper-table-dashboard-header{
    /* padding-left: 6px!important;
    padding-right: 6px!important; */

}
.symper-table-cell .ag-header-icon.ag-header-cell-menu-button {
    position: absolute;
}

.symper-table-cell .ag-cell-label-container:hover .ag-header-icon.ag-header-cell-menu-button {
    position: relative!important;
}


.symper-table-cell .ag-header-group-cell::after,
.symper-table-cell .symper-table-dashboard-header::after{
    border-right: none!important
}


.symper-table-dashboard-header-wraptext .ag-header-cell-text {
    -webkit-line-clamp: 2!important;
    display: -webkit-box!important;
    -webkit-box-orient: vertical!important;
    white-space: normal!important;
}

.symper-table-cell .ag-floating-bottom{
    overflow-y: unset!important;
}

.symper-table-cell .ag-body-viewport,.symper-table-cell .ag-body-horizontal-scroll-viewport{
    position: relative;
    overflow: hidden !important;
}


@media print {
    .ag-layout-normal {
        display: flex!important;
    }
}

@media print {
    .symper-table-cell .ag-floating-bottom {
        /* border-top-width: 0px!important; */
        position: relative;
        top: 10px;
    }
}

@media print {
    .symper-dashboard-layout .ag-root-wrapper, 
    .symper-dashboard-layout .ag-root-wrapper-body,
    .symper-dashboard-layout .ag-root,
    .symper-dashboard-layout .ag-body-viewport,
    .symper-dashboard-layout .ag-center-cols-container,
    .symper-dashboard-layout .ag-center-cols-viewport,
    .symper-dashboard-layout .ag-center-cols-clipper,
    .symper-dashboard-layout .ag-body-horizontal-scroll-viewport,
    .symper-dashboard-layout .ag-virtual-list-viewport {
        height: 100%!important;
        overflow: hidden;
        /* display: flex !important; */
    }
}
</style>
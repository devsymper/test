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
            :columnDefs="columnDefs"
            :rowData="options.data"
            :columnTypes="columnTypes"
            :suppressRowClickSelection="true"
            :rowSelection="'multiple'"
            :getRowStyle="getRowStyle"
            :defaultColDef="defaultColDef"
            :autoGroupColumnDef="autoGroupColumnDef"
            :stopEditingWhenGridLosesFocus="true"
            :modules="modules"
            :pinnedBottomRowData="options.totalRow"
            @model-updated="onTableRender()"
            @column-resized="onColumnResized()"
            @grid-ready="onAgReady"
            @column-visible="onShowHideColumns"
            @column-pinned="afterPinnedColumns">
        </ag-grid-vue>
        <div class="symper-table-pagination pl-1" style="height: 25px; margin-top: 5px" >
            <Pagination
                :contentSize="'mini'"
                :totalVisible="3"
                @on-change-page-size="handleSizeChange"
                @on-change-page="handleCurrentPageChange"
                :total="options.totalRowCount"
                :shortMode="true">
            </Pagination>
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
import treeConditionConverter from "@/components/dashboard/configPool/treeConditionToJSString.js";
import agDataTypeStyle from '@/components/dashboard/configPool/agCellRenderer.js'
import agCellRenderer from "@/components/dashboard/configPool/agDataTypeStyle.js";
import PerfectScrollbar from "perfect-scrollbar";
// import { pivotSupport } from '../configPool/translatorGroups';
import Pagination from '@/components/common/Pagination.vue';
import _cloneDeep from "lodash/cloneDeep";
var mo = treeConditionConverter.mo;
 
export default {
    props: {
        cellConfigs: {
            default(){
                return {}
            }
        },
        instanceKey: {
            default: '',
        },
    },

    methods : {
        handleCurrentPageChange(data){
            this.cellConfigs.sharedConfigs.currentPage = data.page; 
            this.$evtBus.$emit('bi-report-change-display', {
                type: 'data',
                id: this.cellConfigs.sharedConfigs.cellId,
                instanceKey: this.instanceKey
            });
        },
        handleSizeChange(data){
            this.cellConfigs.sharedConfigs.pageSize = data.pageSize;
            this.$evtBus.$emit('bi-report-change-display', {
                type: 'data',
                id: this.cellConfigs.sharedConfigs.cellId,
                instanceKey: this.instanceKey
            });
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
                // SDashboardEditor.lockWorkspace();
            }
        },
        handleCellMouseUp(evt){
            if(this.isResizing){
                this.isResizing = false;
                // SDashboardEditor.unlockWorkspace();
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
                        border-bottom-style: solid;
                        border-top-style: solid;
                    }
                    #${idCell} .ag-header-group-cell {
                        border-top-width: ${headerStyle.borderWidth};
                        border-top-color: ${headerStyle.borderColor};
                        border-bottom-color: ${headerStyle.borderColor};
                        border-bottom-style: solid;
                        border-top-style: solid;
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
                        border-top-style: solid;
                    }
                    `;
                
                
                if(headerStyle.verticalLine){
                    style += `
                        #${idCell} .ag-header-group-cell,
                        #${idCell} .ag-header-cell {
                            border-right-width: ${headerStyle.borderWidth};
                            border-right-color: ${headerStyle.borderColor};
                            border-right-style: solid;
                        }
                        
                        #${idCell} .ag-floating-bottom .ag-cell{
                            border-right-width: ${headerStyle.borderWidth};
                            border-right-color: ${headerStyle.borderColor};
                            border-bottom-right: inset;
                            border-right-style: solid;
                        }
                    `;
                }else {
                    style += `
                        #${idCell} .ag-header-group-cell,
                        #${idCell} .ag-header-cell {
                            border-right-width: 0px;
                            border-right-color: 0px;
                            border-right-style: solid;
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
                            border-right-style: solid;
                        }`;
                }else {
                    style += `
                        #${idCell} .ag-cell {
                            border-right-width: 0px;
                            border-right-color: '#00000000';
                            border-right-style: solid;
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

            setTimeout((self) => {
                // self.setColumnWidth();            
            }, 500, this);
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
                    // let w = SDashboardEditor.getSizeOfCellContent(this.cellConfigs.sharedConfigs.cellId).w;
                    // this.gridColumnApi.sizeColumnsToFit(w);
                }
            }
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
            // SDashboardEditor.dashboardConfigs.allCellConfigs[cellId].viewConfigs.needSaveExtraOptions.columnWidths = widths;
        }
    },
    computed: {
        columnDefs(){
            // if(){
            //     return options.columns;
            // }else{
            let rsl = _cloneDeep(this.options.columns);
            for(let colDef of rsl){
                if(colDef.conditionalFormatInfo){
                    colDef.cellStyle = function(params){
                        var row = params.node.data;
                        let formatConds = colDef.conditionalFormatInfo;
                        for(let item of formatConds){
                            let checkCondition = eval(item.condition);
                            if(checkCondition){
                                return item.style;
                            }
                        }
                        return null;
                    }
                }
            }
            return rsl;   
            // }
        },
        options (){
            return this.cellConfigs.viewConfigs.displayOptions;
        },
        tableStyle(){
            let displayOptions = this.cellConfigs.viewConfigs.displayOptions;
            return Object.assign({
                width: '100%', 
                height: (displayOptions.tableSize.h - 30)+'px'
            }, this.options.cellStyle);
        }
    },
    components:{
        'ag-grid-vue': AgGridVue,
        Pagination
    },
    beforeMount(){
        this.gridOptions = {
            components: {
                'numberRenderer': agCellRenderer.numberRenderer
            },
        };
    },
    mounted(){
        this.gridApi = this.gridOptions.api;
        this.gridColumnApi = this.gridOptions.columnApi;
    },
    data(){
        let self = this;
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
            getRowStyle: function(params) {
                let style = {};
                if (params.node.rowPinned) {
                    style = self.options.totalRowStyle;
                }else{
                    if(self.options.rowFormatCond){
                        let row = params.node.data;
                        let rowFormatCond = self.options.rowFormatCond;
                        for(let item of rowFormatCond){
                            if(eval(item.condition)){
                                style = Object.assign(style, item.style);
                            }
                        }
                    }else{
                        style = self.options.cellStyle;
                    }
                }
                return style;
            },
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
    border-bottom-style: solid;
}

.symper-table-dashboard-header::after{
    border-right: none!important;
    width: 0px!important;
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
    border-right: none!important;
    width: 0px!important;
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
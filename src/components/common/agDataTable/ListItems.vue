<template>
     <div :style="{width:contentWidth}" class="h-100 w-100 d-flex flex-column p-2">
		 <div v-if="showToolbar" class="d-flex mb-2 " ref="topBar">
			<div 
			 	class="fs-17 ml-1 mt-1 font-weight-bold align-items-center flex-grow-1" 
				:class="{'ml-4': dialogMode == true }"
			>
				{{pageTitle}}
			</div>
			 <div>
				<v-text-field
					@input="bindToSearchkey"
					class="d-inline-block mr-2 sym-small-size"
					single-line
					v-if="showSearchBox"
					:append-icon="$i('input.search')"
					outlined
					dense
					label="Search"
					:placeholder="$t('common.search')"
				></v-text-field>
					<v-btn
                            depressed
                            small
                            class="mr-2"
                            v-if="actionPanel "
                            @click="showSearchBox = !showSearchBox"
                        >
                            <v-icon small dark> {{ showSearchBox ? 'mdi-close' : 'mdi-magnify'}} </v-icon>
                        </v-btn>
                         <v-btn
                            v-show="showButtonAdd && !actionPanel && !dialogMode"
                            depressed
                            small
                            :loading="loadingRefresh"
                            :disabled="loadingRefresh"
                            class="mr-2"
                            @click="addItem"
                            v-if="checkShowCreateButton()"
                        >
                            <v-icon left dark>mdi-plus</v-icon>
                            <span >{{$t('common.add')}}</span>
                        </v-btn>
                        <v-btn
                            depressed
                            small
                            :loading="loadingRefresh"
                            :disabled="loadingRefresh"
                            class="mr-2"
                            v-if="!isCompactMode && !actionPanel && !dialogMode"
                            @click="refreshList"
                        >
                            <v-icon left dark>mdi-refresh</v-icon>
                            <span >{{$t('common.refresh')}}</span>
                        </v-btn>

                      
                        <v-btn
                            depressed
                            small
                            @click="exportExcel()"
                            :loading="loadingExportExcel"
                            class="mr-2"
                            :disabled="loadingExportExcel"
                            v-if="!isCompactMode && showExportButton && !actionPanel && !dialogMode"
                        >
                            <v-icon left dark>mdi-microsoft-excel</v-icon>
                            <span v-show="!actionPanel">{{$t('common.export_excel')}}</span>
                        </v-btn>

                        
                        <v-btn
                            depressed
                            small
                            @click="importExcel()"
                            class="mr-2"
                            v-if="showImportButton && !actionPanel && !dialogMode"
                        >
                            <v-icon left dark>mdi-database-import</v-icon>
                            <span>{{$t('common.import_excel')}}</span>
                        </v-btn>
                        
                    
                        <v-btn
                            depressed
                            small
                            @click="showImportHistory()"
                            class="mr-2"
                            v-if="showImportHistoryBtn && !actionPanel && !dialogMode"
                        >
                            <v-icon left dark>mdi-database-import</v-icon>
                            <span>{{$t('common.import_excel_history')}}</span>
                        </v-btn>
                        <v-btn
                            depressed
                            small
							icon
							tile
                            @click="handleCloseClick"
                            class="mr-2"
                            v-if="dialogMode"
                        >
                            <v-icon dark>mdi-close</v-icon>
                        </v-btn>
                         <v-menu
                            
                            bottom
                            left
                            >
                            <template v-slot:activator="{ on, attrs }">
                                 <v-btn 
                                    icon
                                    tile 
                                    v-show="actionPanel"
                                    v-bind="attrs"
                                    v-on="on"
                                    style="width:29px;height:29px;margin:0px 4px"    
                                >
                                        <v-icon>
                                            mdi-dots-vertical
                                        </v-icon>
                                </v-btn>
                            </template>
                            <v-list class="group-action-list">
                                <v-list-item  v-show="showButtonAdd"  @click="addItem">
                                    <v-list-item-icon>
                                         <v-icon>mdi-plus</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                         <v-list-item-title> {{$t('common.add')}}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item  v-show="!isCompactMode"  @click="refreshList">
                                    <v-list-item-icon>
                                         <v-icon>mdi-refresh</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                         <v-list-item-title> {{$t('common.refresh')}}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item  v-show="!isCompactMode && showExportButton"  @click="exportExcel()">
                                    <v-list-item-icon>
                                         <v-icon>mdi-microsoft-excel</v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                         <v-list-item-title>{{$t('common.export_excel')}}</v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                                <v-list-item  v-show="showImportButton"  @click="importExcel()">
                                    <v-list-item-icon>
                                         <v-icon>
                                             mdi-database-import
                                         </v-icon>
                                    </v-list-item-icon>
                                    <v-list-item-content>
                                         <v-list-item-title> 
                                             {{$t('common.import_excel')}}
                                        </v-list-item-title>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                        <component
                            :is="'span'"
                        >
                            <slot name="extra-button"></slot>
                        </component>
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    @click="openTableDisplayConfigPanel"
                                    depressed
                                    small
									v-if="!dialogMode"
                                    v-on="on"
                                >
                                    <v-icon left dark class="ml-1 mr-0 ">mdi-table-cog</v-icon>
                                </v-btn>
                            </template>
                            <span>{{ $t('common.list_config') }}</span>
                        </v-tooltip>
                        
                        <v-tooltip top v-if="showActionPanelInDisplayConfig ">
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    @click="changeAlwayShowSBSState"
                                    depressed
                                    small
                                    class="ml-2"
                                    v-on="on"
                                >
                                    <v-icon left dark class="ml-1 mr-0">{{alwaysShowActionPanel ? 'mdi-flip-horizontal' : 'mdi-format-list-checkbox'}}</v-icon>
                                </v-btn>
                            </template>
                            <span>{{alwaysShowActionPanel ? $t('common.not_always_show_sidebar') : $t('common.always_show_sidebar')}}</span>
                        </v-tooltip>
			 </div>
		 </div>
		 <div
		 	:class="{
				'fs-13 symper-custom-table symper-list-item  w-100': true,
				'clip-text' : tableDisplayConfig.value.wrapTextMode == 1,
				'loosen-row':  tableDisplayConfig.value.densityMode == 0,
				'medium-row':  tableDisplayConfig.value.densityMode == 1,
				'compact-row':  tableDisplayConfig.value.densityMode == 2,
				'list-sbs': alwaysShowActionPanel
				
			}"
			:style="{height:tableHeight + 'px'}"
		 >
			<ag-grid-vue :style="{
				width: '100%',
				height:tableHeight+ 'px',
			}"
				:class="{'ag-theme-balham': true}"
				:defaultColDef="defaultColDef"
				:gridOptions="gridOptions"
				:columnDefs="columnDefs"
				@rowClicked="handlerRowClicked"
				:rowData="rowData"
                :rowSelection="rowSelection"
				:frameworkComponents="frameworkComponents"
				:modules="modules"
				@selection-changed="onSelectionChanged"
				:getContextMenuItems="getContextMenuItems"
				@grid-ready="onGridReady"
			>
			</ag-grid-vue>
			 <display-config
				ref="tableDisplayConfig"
				@drag-columns-stopped="handleStopDragColumn"
				@change-colmn-display-config="configColumnDisplay"
				@save-list-display-config="saveTableDisplayConfig"
				:tableDisplayConfig="tableDisplayConfig"
				:tableColumns="columnDefs"
				:headerPrefixKeypath="headerPrefixKeypath"
				:showActionPanelInDisplayConfig="showActionPanelInDisplayConfig"
			></display-config>
		 </div>
		<div class="mt-2" ref="bottomBar">
			<Pagination
				:total="totalObject"
				:totalVisible="7"
				@on-change-page-size="changePageSize"
				@on-change-page="changePage"
			></Pagination>
		</div>
		 <component
            :is="actionPanelWrapper"
            :width="actionPanelWidth"
            :max-width="actionPanelWidth"
            v-model="actionPanel"
            class="pa-3"
            absolute
            right
            v-show="actionPanel"
            v-if="reComputeActionPanelType != 'drag'"
            :temporary="reComputeActionPanelType == 'temporary'"
        >
            <slot name="right-panel-content" :itemData="currentItemDataClone">
            </slot>
        </component>
        <symper-drag-panel
            v-else
            @before-close="handleCloseDragPanel"
            :showPanel="actionPanel"
            :panelData="currentItemDataClone"
            :actionTitle="itemActionTitle"
            :dragPanelWidth="actionPanelWidth">
            <template slot="drag-panel-content" slot-scope="{panelData}">
                <slot name="right-panel-content" :itemData="panelData">
                   
                </slot>
            </template>
        </symper-drag-panel>
		<table-filter
            ref="tableFilter"
            :columnFilter="tableFilter.currentColumn.colFilter"
            @apply-filter-value="applyFilter"
            @search-autocomplete-items="searchAutocompleteItems"
        ></table-filter>
	 </div>
</template>
<script>
import {AgGridVue} from "ag-grid-vue";
import { MenuModule } from '@ag-grid-enterprise/menu';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-balham.css';
import { util } from '../../../plugins/util';
import Vue from "vue";
import Pagination from '@/components/common/Pagination'
import Api from "@/api/api.js";
import { getDataFromConfig, getDefaultFilterConfig } from "@/components/common/customTable/defaultFilterConfig.js";
import CustomHeader from './CustomAgGrid/CustomHeader'
import DisplayConfig from "@/components/common/listItemComponents/DisplayConfig";
import SymperDragPanel from "@/components/common/SymperDragPanel.vue";
import { VDialog, VNavigationDrawer } from "vuetify/lib";
import TableFilter from '@/components/common/customTable/TableFilter'
import {uiConfigApi} from "@/api/uiConfig";
console.log(PerfectScrollbar,'PerfectScrollbarPerfectScrollbarPerfectScrollbarPerfectScrollbarPerfectScrollbar')
import PerfectScrollbar from "perfect-scrollbar";

let CustomHeaderVue = Vue.extend(CustomHeader);

var apiObj = new Api("");
var testSelectData = [ ];
window.tableDropdownClickHandle = function(el, event) {
    event.preventDefault();
    event.stopPropagation();
	let thisListItem = util.getClosestVueInstanceFromDom(el, "SymperListItem");
    thisListItem.showTableDropdownMenu(
        event.pageX,
        event.pageY,
        $(el).attr("col-name")
    );
};

export default {
    name: "SymperListItem",
    props:{
		/**
		 * Truyeenf vao row height
		 * 
		 */
		rowHeight:{
			type: Number,
			default:21
		},
		 /**
         * Hàm truyền vào context menu 
         */
		getContextMenuItems:{
			type: Function,
			default: null
			// (params) {
			// 	var result = [
			// 		{
			// 			name: 'Alert ' + params.value,
			// 			action: function () {

			// 				window.alert('Alerting about ' + params.value);
			// 			},
			// 			cssClasses: ['redFont', 'bold'],
			// 		},
			// 	];
			// 	return result;
			// },	
		},
		/**
         * Hàm phục vụ cho việc dev tự định nghĩa data khi gọi API để lấy dữ liệu
         * thay vì sử dụng hàm có sẵn, các tham số truyền vào giống như hàm getOptionForGetList trong defaultFilterConfig
         */
        customDataForApi: {
            type: Function,
            // default: (configs, columns, filterData)=>{}
            default: null
        },
		apiMethod:{
			type: String,
			default : "GET"
		},
		dialogMode:{
			type: Boolean,
			default:false
		},
		showToolbar:{
			type:Boolean, 
			default: true
		},
		useWorkFlowHeader:{
			type: Boolean,
			default:false
		},
        widthContentCustom:{
            type: Number,
            default:0
        },
        showImportButton: {
            type: Boolean,
            default: false
        },
        showImportHistoryBtn:{
            type: Boolean,
            default: false
        },
        exportLink: {
            type: String,
            default: ''
        },
        widgetIdentifier: {
            type: String,
            default: ''
        },
        showExportButton: {
            type: Boolean,
            default: true
        },
        debounceRowSelectTime: {
            type: Number,
            default: 100
        },
        currentItemData: {
            type: Object,
            default() {
                return {};
            }
        },
        showButtonAdd:{
            type:Boolean,
            default: true
        },
        showActionPanelInDisplayConfig:{
            type: Boolean,
            default: false,
        },
        /**
         * Prefix cho keypath trong file đa ngôn ngữ để hiển thị header của table
         */
        headerPrefixKeypath: {
            type: String,
            default: ""
        },
        getDataUrl: {
            type: String,
            default: ""
        },
        getDataFromFilterUrl: {
            type: String,
            default: ""
        },
        // Tiêu đề của trang: Danh sách văn bản, danh sách người dùng ...
        pageTitle: {
            type: String,
            default: "Danh sách"
        },
        // Chiều cao của khung chứa danh sách
        containerHeight: {
            type: Number,
            default: 200
        },
        lazyLoad:{
            type:Boolean,
            default:false
        },
        // Chiều rộng của pannel bên phải
        actionPanelWidth: {
            type: Number,
            default: 400
        },
        // Loại hiển thị cho actionPanel - một trong ba loại: modal, temporary, elastic, drag
        actionPanelType: {
            type: String,
            default: "temporary"
        },
        // Các input khi edit hoặc thêm hoặc xem chi tiết một item trong danh sách
        itemInputs: {
            type: Object,
            default() {
                return {};
            }
        },
        itemActionTitle: {
            type: String,
            default: ""
        },
        listItemName: {
            type: String,
            default: "item"
        },
        isCompactMode: {
            type: Boolean,
            default: false
        },
        /**
         * Dùng Trong trường hợp mà gọi đến một API mà không thể thay đổi định dạng trả về của API đó  theo đúng với định dạng chung của ListItem 
         * định dạng: 
         * {
         *     reformatData(res){} // Lấy ra các cột cần hiển thị
         * }
         **/
        customAPIResult: {
            type: Object,
            default(){
                return {}
            }
        },
        /**
         * Có sử dụng action panel để add, edit, clone hay ko. 
         * Nếu có thì mở action panel( ở bên phải hoặc modal ...)
         * Nếu không thì dev cần xử lý bằng cách: các action dẫn sang một page mới
         */
        useActionPanel: {
            type: Boolean,
            default: true
        },

        /**
         * Chứa các thông tin chung cho các action trong context menu cần định nghĩa
         * có dạng : {
         *      "module": "",
         *      "resource": "",
         *      "scope": "",
         * }
         */
        commonActionProps: {
            type: Object,
            default(){
                return {}
            }
        },
        // biến đánh dấu table đươc quyền edit hay ko
        isTablereadOnly:{
            type:Boolean,
            default:true
        },
        /**
         * Thêm điều kiện để quy vấn qua api
         */
        conditionByFormula:{
            type:String
        },
        /**
         * Dữ liệu mặc định cho table
         */
        defaultData:{
            type: Object,
            default(){
                return {
                    listObject:{},
                    columns:{},
                    total:0
                }
            }
        },
        showPagination:{
            type: Boolean,
            default:true
        },
        autoRefreshTopic:{
            type: String,
            default: ''
        }
	},
	created(){
		this.getData();
        this.restoreTableDisplayConfig();
	},
	computed:{
		alwaysShowActionPanel(){
            return this.tableDisplayConfig.value.alwaysShowSidebar;
		},
		reComputeActionPanelType(){
            return this.tableDisplayConfig.value.alwaysShowSidebar ? 'elastic' : this.actionPanelType;
		},
		currentItemDataClone() {
            return util.cloneDeep(this.currentItemData);
		},
		actionTitle() {},
        contentWidth() {
            if (this.actionPanel && this.reComputeActionPanelType == "elastic") {
                return "calc(100% - " + this.actionPanelWidth + "px)";
            } else if (this.tableDisplayConfig.show) {
                return "calc(100% - " + this.tableDisplayConfig.width + "px)";
            } else if(this.showPagination == false) {
                if( this.widthContentCustom > 0){
                   return this.widthContentCustom+"px"
                }else{
                    return "100%";
                }
            }else{
                return "100%";
            }
		},
		tableHeight() {
			let ref = this.$refs;
			let tbHeight = this.containerHeight;
			if (tbHeight <= 250) {
				tbHeight = util.getComponentSize(this).h;
			}
			tbHeight -= 74
			return tbHeight - 15;
		},
		actionPanelWrapper() {
            let mapType = {
                modal: "v-dialog",
                temporary: "v-navigation-drawer",
                elastic: "v-navigation-drawer"
            };
            return mapType[this.reComputeActionPanelType]
                ? mapType[this.reComputeActionPanelType]
                : mapType["temporary"];
        }
       
	},
	watch:{
		actionPanel(){
            if (this.actionPanel == true) {
				this.$emit("open-panel");
				this.showSearchBox = false
            }
        },
        getDataUrl(){   
			this.page = 1
        	this.refreshList();
		},
		'tableDisplayConfig.show'(value){
			if(value = false){
				this.agApi.sizeColumnsToFit()
			}
		},
        'tableDisplayConfig.value.alwaysShowSidebar'(value) {
            if(value && !$.isEmptyObject(this.currentItemDataClone) && this.currentItemDataClone.id){
                this.openactionPanel();
            }else{
				this.closeactionPanel();
				this.showSearchBox = true
            }
		},
		'tableDisplayConfig.value.densityMode'(value){
			switch(value){
				case 0:
					this.gridOptions.rowHeight  = 50
					this.agApi.resetRowHeights()
					break;
				case 1:
					this.gridOptions.rowHeight  = 35
					this.agApi.resetRowHeights()
					break;
				case 2:
					this.gridOptions.rowHeight  = 21
					this.agApi.resetRowHeights()
					break;	
			}
		}
	},
    data(){
		let self = this
        return {
			showSearchBox: true,
            loadingRefresh: false, // có đang chạy refresh dữ liệu hay ko
            loadingExportExcel: false, // có đang chạy export hay ko
			totalObject:0,
			pageSize: 50,
			agApi: null,
			frameworkComponents: null,
            actionPanel: false, // có hiển thị action pannel (create, detail, edit) hay không
            page: 1, // trang hiện tại
			gridOptions:null,
			fixedCols:[],
            allRowChecked:{},   // hoangnd: lưu lại các dòng được checked sau sự kiện after change
			defaultColDef:null,
    	  	rowSelection: null,
			modules:[
				MenuModule
			],
			MedalCellRenderer(){
			},	
			tableDisplayConfig: {
                show: false, // có hiển thị panel cấu hình ko
                width: 300, // Chiều rộng của panel cấu hình
                value: {
                    wrapTextMode: 0,
                    densityMode: 2,
                    alwaysShowSidebar: false,
                    hiddenColumns: [],
                },
                dragOptions: {
                    animation: 200,
                    group: "display-column-drag",
                    disabled: false,
                    ghostClass: "ghost-item"
                },
                drag: false,
			},
            filteredColumns: {}, // tên các cột đã có filter, dạng {tên cột : true},
			tableFilter: {
				// cấu hình filter của danh sách này
				allColumn: {
					// cấu hình filter của tất cả các cột trong bảng này dạng {tên cột : cấu hình filter}
				},
				currentColumn: {
					colFilter: getDefaultFilterConfig(),
					name: ""
				}
			},
            columnDefs:[
				// {headerName: 'Make', field: 'make'},
			],
           	rowData: [
				// {make: 'Toyota', model: 'Celica', price: 35000, test: 'SDASDASD',testA:'SDAdsdSDASD',testB:'SDAdsdSDASD',testC:'SDAdsdSDASD',testD:'SDAdsdSDASD',testE:'SDAdsdSDASD',testF:'SDAdsdSDASD',testG:'SDAdsdSDASD',testH:'SDAdsdSDASD',testJ:'SDAdsdSDASD',testK:'SDAdsdSDASD',testM:'SDAdsdSDASD',resizable: true},
			],
        }
    },
    components: {
		AgGridVue,
		Pagination,
		DisplayConfig,
		"symper-drag-panel": SymperDragPanel,
		VNavigationDrawer,
		VDialog,
		TableFilter

    },
    beforeMount(){
		this.defaultColDef = {
            minWidth: 40,
			filter: true,
			suppressMenu : true,
			sortable: true,
            resizable: true,
        };
		this.gridOptions = {};
		this.gridOptions.rowHeight =  this.rowHeight
		this.gridOptions.getRowStyle = function(params) {
			if (params.node.rowIndex % 2 != 0) {
				return { background: '#fbfbfb' };
			}
		}
		this.frameworkComponents = {
			agColumnHeader: CustomHeaderVue,
		};
		this.rowSelection = 'single';
    },
	methods:{
		 /**
         * Tạo ra các item có check box với trạng thái đã check hay chưa 
         * @param items danh sách các value dạng ['ccc','xxc', ....]
         */
        createSelectableItems(items){
            let colFilter = this.tableFilter.currentColumn.colFilter;
            let selectableItems = [];
            if(colFilter.clickedSelectAll){ // chọn tất cả
                selectableItems = items.reduce((arr, el) => {
                    arr.push({
                        value: el,
                        checked: true
                    });
                    return arr;
                }, []);
            }else if(colFilter.selectAll){ // not in
                selectableItems = items.reduce((arr, el) => {
                    arr.push({
                        value: el,
                        checked: colFilter.valuesNotIn[el] ? false : true
                    });
                    return arr;
                }, []);
            }else{ // in
                selectableItems = items.reduce((arr, el) => {
                    arr.push({
                        value: el,
                        checked: colFilter.valuesIn[el] ? true : false
                    });
                    return arr;
                }, []);
			}  
            return selectableItems;
		},
		searchAutocompleteItems(vl){
            this.tableFilter.currentColumn.colFilter.searchKey = vl;
            this.getItemForValueFilter();
		},
		handleCloseDragPanel() {
            this.actionPanel = false;
        },
		 /**
         * Thực hiện filter khi người dùng click vào nút apply của filter
         */
        applyFilter(filter, source = "filter") {
			this.page = 1
			let colName = this.tableFilter.currentColumn.name;
            this.$set(this.tableFilter.allColumn, colName, filter);
            let hasFilter = this.checkColumnHasFilter(colName, filter);
            this.filteredColumns[colName] = hasFilter;
            let icon = $(this.$el).find(
                ".symper-table-dropdown-button[col-name=" + colName + "]"
			);
            this.getData(false,false,true);
            if(hasFilter && source != "clear-filter"){
                icon.addClass("applied-filter");
            }else{
                this.$delete(this.tableFilter.allColumn, colName);
                icon.removeClass("applied-filter");
            }
		},
		/**
         * Kiểm tra xem một cột trong table có đang áp dụng filter hay ko
         */
        checkColumnHasFilter(colName, filter = false) {
            if (!filter) {
                filter = this.tableFilter.allColumn[colName];
            }
            if (!filter) {
                return false;
            } else {
                if (
                    filter.sort == "" &&
                    $.isEmptyObject(filter.valuesIn) &&
                    $.isEmptyObject(filter.valuesNotIn) &&
                    filter.conditionFilter.items[0].type == "none" &&
                    filter.searchKey == ''
                ) {
                    return false;
                } else {
                    return true;
                }
            }
		},
		closeactionPanel() {
            this.actionPanel = false;
		},
		openactionPanel() {
            this.actionPanel = true;
		},
		saveDataAction() {
            this.closeactionPanel();
            this.$emit("save-item", {});
		},
		refreshList(){
			// Phát sự kiện khi click vào refresh dữ liệu
			this.allRowChecked = {}
			this.$emit('after-selected-row', this.allRowChecked)
            this.getData();
            this.$emit("refresh-list", {});
        },
		showTableDropdownMenu(x, y, colName) {
            var windowWidth = $(window).width()/1.1;
            if(x > windowWidth){
                x -= 190;
            }
            let filterDom = $(this.$refs.tableFilter.$el);
            filterDom.css("left", x + "px").css("top", y + 10 + "px");
            this.$refs.tableFilter.show();
			let colFilter = this.tableFilter.allColumn[colName];
            if (!colFilter) {
                colFilter = getDefaultFilterConfig();
                this.$set(this.tableFilter.allColumn, colName, colFilter);
            }
            for (let col of this.columnDefs) {
                if (col.data == colName) {
                    colFilter.dataType = col.type;
                    break;
                }
            }
            this.$set(this.tableFilter, "currentColumn", {
                name: colName,
                colFilter: colFilter
            });
            this.setSelectItemForFilter();
            $("#symper-platform-app").append(filterDom[0]);
			this.getItemForValueFilter();
		},
		/**
         * Lấy danh sách các giá trị cần đưa vào danh sách lựa chọn autocomplete từ server nếu chưa có danh sách này
         */
        async setSelectItemForFilter(){
            let colFilter = this.tableFilter.currentColumn.colFilter;
            if(colFilter.selectItems.length == 0){
                let textItems = testSelectData;
                colFilter.selectItems = this.createSelectableItems(textItems);
            }
        },
		 /**
         * Lấy các item phục vụ cho việc lựa chọn trong autocomplete cuar filter
         */
        getItemForValueFilter(){
			let columns = [this.tableFilter.currentColumn.name];
            let self = this;
            let options = {
                pageSize: 300,
                getDataMode: 'autocomplete',
                distinct: true,
                page: 1
            };
            let success = (data) => {
                if(data.status == 200){
                    self.tableFilter.currentColumn.colFilter.selectItems = null;
                    let items = data.data.listObject.reduce((arr, el) => {
                        arr.push(el[columns[0]]);
                        return arr;
					}, []);
                    self.tableFilter.currentColumn.colFilter.selectItems = self.createSelectableItems(items);
                }
			}
            this.prepareFilterAndCallApi(columns , false, true, success, options);
        },
		importExcel(){
            this.$emit('import-excel');
		},
		cancelImport(){
            this.$emit('cancel-import');
		},
		
		async exportExcel(){
            let exportUrl = this.exportLink
            if(!exportUrl){
                if(this.getDataUrl[this.getDataUrl.length - 1] == '/'){
                    exportUrl = this.getDataUrl+'export';
                }else{
                    exportUrl = this.getDataUrl+'/export';
                }
            }
            
            window.open(exportUrl,'_blank');
        },
       
        showImportHistory(){
            this.$router.push("/viewHistory");
        },
		changeAlwayShowSBSState(){
            this.tableDisplayConfig.value.alwaysShowSidebar = !this.tableDisplayConfig.value.alwaysShowSidebar;
        },
		checkShowCreateButton(){
            let rsl = !this.isCompactMode;
            let objectType = this.commonActionProps.resource;
            let objectTypePermission = this.$store.state.app.userOperations[objectType];

            let hasCreatePermission = true;
            if(!util.auth.isSupportter()){
                hasCreatePermission = objectTypePermission && objectTypePermission[0] && objectTypePermission[0]['create'];
            }
            return rsl && hasCreatePermission;
        },
		createImageSpan(imageMultiplier, image) {
			var resultElement = document.createElement("span");
			for (var i = 0; i < imageMultiplier; i++) {
				var imageElement = document.createElement("img");
				imageElement.src = "https://raw.githubusercontent.com/ag-grid/ag-grid/master/grid-packages/ag-grid-docs/src/images/" + image;
				resultElement.appendChild(imageElement);
			}
			return resultElement;
		},
		handlerRowClicked(params){
			this.$emit('row-selected', params.data);
			// var selectedRows = this.agApi.getSelectedRows();
			// if(document.querySelector('#selectedRows')){
			// 		document.querySelector('#selectedRows').innerHTML =
			// 	selectedRows.length === 1 ? selectedRows[0].athlete : '';
			// }
		},
		onSelectionChanged() {
			var selectedRows = this.agApi.getSelectedRows();
			document.querySelector('.ag-row-selected').innerHTML = selectedRows.length === 1 ? selectedRows[0].athlete : ''
   		 },
		onGridReady(params){
			params.api.sizeColumnsToFit()
			this.agApi = params.api
			/**
			 * Create perfect scrollbar cho ag grid
			 * Dev-create: dungna
			 * Time Create: 2020/12/15
			 */
			const agBodyViewport = document.querySelector('.ag-theme-balham .ag-body-viewport');
			const agBodyHorizontalViewport = document.querySelector('.ag-theme-balham .ag-body-horizontal-scroll-viewport');
			if (agBodyViewport) {
			const ps = new PerfectScrollbar(agBodyViewport);
				ps.update();
			}
			if (agBodyHorizontalViewport) {
			const ps = new PerfectScrollbar(agBodyHorizontalViewport);
				ps.update();
			}
		},
		configColumnDisplay(type, idx) {
            let column = this.columnDefs[idx];
            column[type] = !column[type];
            let isValue = column[type];
            if (type == "symperHide") {
				this.resetHiddenColumns(column.field,idx);
            } else {
                this.reOrderFixedCols(column);
            }
		},
		resetHiddenColumns(field ,idx){
            let hiddenColumns = {};
            this.columnDefs.forEach((col, idx) => {
                if (col.symperHide) {
                    hiddenColumns[idx] = true;
                }
            });
            hiddenColumns = Object.keys(hiddenColumns).reduce((newArr, el) => {
                newArr.push(Number(el));
                return newArr;
			}, []);
			this.$set(this.tableDisplayConfig.value, "hiddenColumns", hiddenColumns);
			let value  =  this.tableDisplayConfig.value.hiddenColumns.includes(idx) ? true : false
			this.gridOptions.columnApi.setColumnVisible(field, value)
			this.agApi.sizeColumnsToFit()
        },
		reOrderFixedCols(column){
			let pinValue 
			if(!this.fixedCols.includes(column)){
				this.fixedCols.push(column)
				column.symperFixed = true
				this.$set(column, 'pinned', 'left')
				pinValue = 'pinned'
			}else{
				this.fixedCols.splice(this.fixedCols.indexOf(column),1)
				pinValue = 'unpinned'
				delete column.pinned
				column.symperFixed = false
			}
			this.gridOptions.columnApi.setColumnPinned(column.field, pinValue)
        },
		openTableDisplayConfigPanel() {
            this.tableDisplayConfig.show = !this.tableDisplayConfig.show;
		},
		bindToSearchkey(vl) {
            this.searchKey = vl;
            if(this.debounceGetData){
                clearTimeout(this.debounceGetData);
            }
            this.debounceGetData = setTimeout((self) => {
				self.page = 1
                self.getData();
            }, 300, this);
        },
		filterList() {
            // Phát sự kiện khi có filter danh sách
            this.$emit("filter-list", {});
        },
		removeItem() {
            // Phát sự kiện khi xóa danh sách các item trong list
            this.$emit("remove-item", []);
		},
		searchAll() {
            // Phát sự kiện khi người dùng gõ vào ô tìm kiếm
            this.$emit("search-all", {});
		},
		isShowSidebar(){
            return this.alwaysShowActionPanel
        },
		// Hàm trả về các dòng được selected
        getAllRowChecked(){
            return this.allRowChecked;
        },
        removeAllRowChecked(){
            this.allRowChecked = []
        },
		changePageSize(vl){
            this.pageSize = vl.pageSize
            this.getData();
            this.$emit("change-page-size", vl.pageSize);
		},
		changePage(vl){
            this.page = vl.page
            this.getData();
            this.$emit("change-page", vl.page);
		},
		addItem() {
            if(this.useActionPanel){
                this.actionPanel = true;
                // Phát sự kiện khi click vào nút thêm mới
                this.$emit("after-open-add-panel", {});
            }
            this.$emit('on-add-item-clicked', {});
		},
		handleCloseClick(){
			this.$emit('close-popup')
		},
		nextPage(lazyLoad = false){
            this.page += 1
            this.getData(false , false , true ,lazyLoad);
            this.$emit("change-page", this.page);
        },
        prevPage(){
            if(this.page == 1){
                return;
            }
            this.page -= 1
            this.getData();
            this.$emit("change-page", this.page);
        },
		getData(columns = false, cache = false, applyFilter = true, lazyLoad = false ) {
			let thisCpn = this;
            let handler = (data) => {
                if(thisCpn.customAPIResult.reformatData){
                    data = thisCpn.customAPIResult.reformatData(data);
                }else{
                    data = data.data;
                }
                this.totalObject = data.total ? parseInt(data.total) : 0;
                thisCpn.columnDefs = thisCpn.getTableColumns(
                    data.columns
				);
                let resData = data.listObject ? data.listObject : []
                if(lazyLoad){
                    resData.forEach(function(e){
                        thisCpn.rowData.push(e)
                    })
                }else{
					thisCpn.rowData = resData;
                }
                thisCpn.$emit('data-get', data.listObject);
            }
            this.prepareFilterAndCallApi(columns , cache , applyFilter, handler);
		},
		/**
		 * Lấy ra cấu hình cho việc sort
		 */
		prepareFilterAndCallApi(columns = false, cache = false, applyFilter = false, success, configs = {}){
			let url = this.getDataUrl;
			let method = this.apiMethod;
			if (url != "") {
				let thisCpn = this;
				let emptyOption = false;
				let header = {};
				let routeName = this.$getRouteName();
				if(routeName == "deployHistory" || routeName == "listProcessInstances" || thisCpn.useWorkFlowHeader){
					header = {
						Authorization: 'Basic cmVzdC1hZG1pbjp0ZXN0',
						"Content-Type": "application/json",
					};
					emptyOption = true;
				}

				configs.searchKey = this.searchKey;
				configs.page = configs.page ? configs.page :  this.page ;
				configs.pageSize = configs.pageSize ? configs.pageSize : this.pageSize;
				configs.formulaCondition = this.conditionByFormula;
				let tableFilter = this.tableFilter;
				tableFilter.allColumnInTable = this.columnDefs;
				configs.emptyOption = emptyOption;

				if(this.customDataForApi){
					configs.customDataForApi = this.customDataForApi;
				}
				getDataFromConfig(url, configs, columns, tableFilter, success, method, header);
			}
		},
		getTableColumns(columns){
			let columnsReduce = []
			columns.forEach(function(e){
				let obj = {}
				obj.headerName = e.name
				obj.field = e.name
				obj.type = e.type
				obj.suppressMenu = true
				obj.symperHide = true
				obj.symperFixed = false
				if(e.cellRenderer){
					obj.cellRenderer = e.cellRenderer
				}
				if(e.cellRendererParams){
					obj.cellRendererParams = e.cellRendererParams
				}
				columnsReduce.push(obj)
			})
			return columnsReduce
		},
		 /**
         * Khôi phục lại cấu hình của hiển thị của table từ dữ liệu được lưu
         */
        restoreTableDisplayConfig() {
            let widgetIdentifier = this.getWidgetIdentifier();
            uiConfigApi.getUiConfig(widgetIdentifier).then((res)=>{
                if(res.status == 200){
                    let savedConfigs = JSON.parse(res.data.detail);
                    this.tableDisplayConfig.value.wrapTextMode =  savedConfigs.wrapTextMode;
                    this.tableDisplayConfig.value.densityMode =  savedConfigs.densityMode;
                    this.tableDisplayConfig.value.alwaysShowSidebar =  savedConfigs.alwaysShowSidebar;
                    
                    this.savedTableDisplayConfig = savedConfigs.columns;
                    if(this.tableColumns.length > 0){
                        this.tableColumns = this.getTableColumns(this.tableColumns, true);
                        this.handleStopDragColumn();
                    }
                }
            }).catch((err) => {
                console.warn(err, 'error when get user view config');
                thisCpn.$snotify({
                    type: 'error',
                    'title': thisCpn.$t('table.error.get_config'),
                });
            });
		},
		getWidgetIdentifier(){
            let widgetIdentifier = '';
            if(this.widgetIdentifier){
                widgetIdentifier =  this.widgetIdentifier;
            }else{
                widgetIdentifier =  this.$route.path;
            }
			widgetIdentifier = widgetIdentifier.replace(/(\/|\?|=)/g,'');
            return widgetIdentifier;
        },
		getTableDisplayConfigData(){
            let configs = util.cloneDeep(this.tableDisplayConfig.value);
			configs.columns = [];
            let rsl = {
                widgetIdentifier: this.getWidgetIdentifier(),
                detail: '{}',
            };
            for (let col of this.columnDefs) {
                configs.columns.push({
                    data: col.data,
                    symperFixed: col.symperFixed,
                    symperHide: col.symperHide
                });
            }
            rsl.detail = JSON.stringify(configs);
            return rsl;
        },
		/**
         * Lưu lại cấu hình hiển thị của table
         */
        saveTableDisplayConfig() {
            this.savingConfigs = true;
			let thisCpn = this;
            let dataToSave = this.getTableDisplayConfigData();
            uiConfigApi
            .saveUiConfig(dataToSave)
            .then(() => {
                thisCpn.savingConfigs = false;
                thisCpn.$snotify({
                    type: "success",
                    title: thisCpn.$t("table.success.save_config")
                });
            })
            .catch(err => {
                console.warn(err, "error when save config");
                thisCpn.$snotify({
                    type: "error",
                    title: thisCpn.$t("table.error.save_config")
                });
            });
		},
		 /**
         * Xử lý việc sau khi kết thúc kéo thả các cột ở thanh cấu hình hiển thị danh sách
         */
        handleStopDragColumn(tbCols) {
            this.tableDisplayConfig.drag = false;
            if(tbCols){
                this.tableColumns = tbCols;
            }
            this.resetHiddenColumns();
            this.reOrderFixedCols();
            this.$refs.tableDisplayConfig.resetTableColumnsData();
        },
	},

}
    
    
</script>
<style>
.ag-row{
	border-top-style:unset !important;
}
.ag-theme-balham .ag-root-wrapper{
	border: unset !important;
}
.ag-header{
	border: unset !important;
}
.ag-row{
	border-radius: 4px;
}
.ag-row:hover{
	border-radius: 4px;
}
.ag-theme-balham .ag-cell{
	line-height: unset !important
}
.ag-header {
	height: 28px !important;
	min-height: unset !important;
	background-color: #ffffff !important;
	border-top: 1px solid lightgray !important;
	border-bottom: 1px solid lightgray !important;
}
.ag-theme-balham .ag-header-row {
    height: 24px !important;
}
.ag-row-selected{
	background-color: #DBE7FE !important;
}
</style>
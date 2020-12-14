<template>
     <div class="h-100 w-100 d-flex flex-column p-2">
		 <div class="d-flex mb-2 " ref="topBar">
			 <div class="fs-17 ml-1 mt-1 font-weight-bold align-items-center flex-grow-1">{{pageTitle}}</div>
			 <div>
				  <v-text-field
					@input="bindToSearchkey"
					class="d-inline-block mr-2 sym-small-size"
					single-line
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
							 @click="addItem"
                        >
                            <v-icon left dark>mdi-plus</v-icon>
                            <span >{{$t('common.add')}}</span>
                        </v-btn>
                        <v-btn
                            depressed
                            small
                            class="mr-2"
							 @click="refreshList"
                        >
                            <v-icon left dark>mdi-refresh</v-icon>
                            <span >{{$t('common.refresh')}}</span>
                        </v-btn>
						
                      
                        <!-- <v-btn
                            depressed
                            small
                            @click="exportExcel()"
                            class="mr-2"
                        >
                            <v-icon left dark>mdi-microsoft-excel</v-icon>
							<span >{{$t('common.export_excel')}}</span>
                        </v-btn>

                        
                        <v-btn
                            depressed
                            small
                            class="mr-2"
                        >
                            <v-icon left dark>mdi-database-import</v-icon>
                            <span>{{$t('common.import_excel')}}</span>
                        </v-btn>
                        
                    
                        <v-btn
                            depressed
                            small
                            @click="showImportHistory()"
                            class="mr-2"
                        >
                            <v-icon left dark>mdi-database-import</v-icon>
                            <span>{{$t('common.import_excel_history')}}</span>
                        </v-btn> -->
						 <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    @click="openTableDisplayConfigPanel"
                                    depressed
                                    small
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
				height:tableHeight - 5 + 'px',
			}"
				:class="{'ag-theme-balham': true}"
				:defaultColDef="defaultColDef"
				:gridOptions="gridOptions"
				:frameworkComponents="frameworkComponents"
				:columnDefs="columnDefs"
				:rowData="rowData"
				:modules="modules"
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
                <!-- <v-card flat>
                    <v-card-title class="pa-0 pl-2" primary-title>{{itemActionTitle}}</v-card-title>
                    <v-card-text>
                        <form-tpl :allInputs="itemInputs"></form-tpl>
                    </v-card-text>

                    <v-divider></v-divider>
                </v-card> -->
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
                    <!-- <v-card flat>
                        <v-card-text>
                            <form-tpl :allInputs="itemInputs"></form-tpl>
                        </v-card-text>
                        <v-divider></v-divider>
                    </v-card> -->
                </slot>
            </template>
        </symper-drag-panel>
 
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


export default {
    props:{
		 // Đăng ký các component phục vụ việc custom render cell trong table
        customComponents: {
            default(){
                return {}
            }
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
			// 				debugger
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
        // /**
        //  * * Các contextmenu cho các item trong list, có dạng:
        //  * [
        //  *      {
        //  *          name: 'action1' // Tên của context menu để phân biệt với các context menu khác.
        //  *          text: ' Action 1' // Text hiển thị lên .
        //  *      }
        //  * ]
        //  * Khi một menu item được click,
        //  * nó sẽ emit sự kiện tên là: context-selection-tên của menu item
        //  */
        // tableContextMenu: {
        //     default() {
        //         return [];
        //     }
        // },
        // /**
        //  * Mặc định context menu chứa các options: remove, view, edit
        //  */
        // useDefaultContext: {
        //     type: Boolean,
        //     default: true
        // },
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
		
        'tableDisplayConfig.value.alwaysShowSidebar'(value) {
            if(value && !$.isEmptyObject(this.currentItemDataClone) && this.currentItemDataClone.id){
                this.openactionPanel();
            }else{
                this.closeactionPanel();
            }
		},
		'tableDisplayConfig.value.densityMode'(value){
			debugger
			switch(value){
				case 0:
					this.gridOptions.rowHeight  = 70
					this.agApi.resetRowHeights()
					break;
				case 1:
					this.gridOptions.rowHeight  = 50
					this.agApi.resetRowHeights()
					break;
				case 2:
					this.gridOptions.rowHeight  = 30
					this.agApi.resetRowHeights()
					break;	
			}
		}
	},
    data(){
		let self = this
        return {
			totalObject:0,
			pageSize: 50,
			agApi: null,
			frameworkComponents: null,
            actionPanel: false, // có hiển thị action pannel (create, detail, edit) hay không
            page: 1, // trang hiện tại
			gridOptions:null,
			rowHeight: 30,
			fixedCols:[],
            allRowChecked:{},   // hoangnd: lưu lại các dòng được checked sau sự kiện after change
			defaultColDef:null,
			modules:[
				MenuModule
			],
			
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
		CustomHeader,
		DisplayConfig,
		"symper-drag-panel": SymperDragPanel,
		VNavigationDrawer,
		VDialog

    },
    beforeMount(){
		this.defaultColDef = {
            minWidth: 100,
            filter: true,
            sortable: true,
			resizable: true,
			headerComponentParams: { menuIcon: 'fa-bars' },
        };
		this.gridOptions = {};
		this.gridOptions.rowHeight =  this.rowHeight
		this.frameworkComponents = {};
        for(let key in this.customComponents){
            this.frameworkComponents[key] = Vue.extend(this.customComponents[key])
        }
	
    },
	methods:{
		onGridReady(params){
			params.api.sizeColumnsToFit()
			this.agApi = params.api
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
		 refreshList(){
			this.allRowChecked = {}
			this.$emit('after-selected-row', this.allRowChecked)
            this.getData();
            this.$emit("refresh-list", {});
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
				obj.headerName = e.title
				obj.field = e.name
				obj.type = e.type
				obj.suppressMenu = true
				obj.symperHide = true
				obj.symperFixed = false
				if(e.cellRenderer){
					obj.cellRenderer = e.cellRenderer
				}
				columnsReduce.push(obj)
			})
			return columnsReduce
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
.symper-custom-table.clip-text .ht_master.handsontable .htCore td,
.symper-custom-table.clip-text .ht_clone_left.handsontable .htCore td {
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
}
.symper-custom-table.loosen-row .ag-center-cols-container .ag-row,
.symper-custom-table.loosen-row .ag-center-cols-container .ag-row {
    height: 40px !important;
    line-height: 40px !important;
}
.symper-custom-table.medium-row .ht_master.handsontable .htCore td,
.symper-custom-table.medium-row .ht_clone_left.handsontable .htCore td {
    height: 30px !important;
    line-height: 30px !important;
}
.symper-custom-table.compact-row .ht_master.handsontable .htCore td,
.symper-custom-table.compact-row .ht_clone_left.handsontable .htCore td {
    height: 20px !important;
    line-height: 20px !important;
    font-size: 12px !important;
}
</style>
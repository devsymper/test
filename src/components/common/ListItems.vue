<template>
     <div :style="{width:contentWidth}" class="symper-list-items h-100 w-100 d-flex flex-column p-2">
		 <div v-if="showToolbar" class="d-flex mb-2 " ref="topBar">
			<div 
			 	class="align-items-center flex-grow-1" 
				:class="{'ml-4': dialogMode == true }"
			>
				<span class=" ml-1 mt-1 font-weight-bold " style="font-size: 18px !important">
					{{pageTitle}}
				</span>
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
									v-if="!dialogMode && showDisplayConfig"
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

						
						<span v-if="Object.keys(customHeaderBtn).length > 0">
							 <v-btn
								depressed
								small
								v-for="(item, i) in customHeaderBtn"
								:key="i"
								@click="customBtnclick(i)"
								class="mr-2"
							>
								<v-icon left dark>{{item.icon}}</v-icon>
								<span> {{item.title}} </span>
							</v-btn>
						</span>
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
                :getContextMenuItems="getContextMenuItems"
				:columnDefs="columnDefs"
				@rowClicked="handlerRowClicked"
				:rowData="rowData"
				:frameworkComponents="frameworkComponents"
				:overlayLoadingTemplate="overlayLoadingTemplate"
				:overlayNoRowsTemplate="overlayNoRowsTemplate"
				:modules="modules"
				@cell-context-menu="cellContextMenu"
				@cell-mouse-down="cellMouseDown"
				@selection-changed="onSelectionChanged"
				@cell-clicked="onCellClicked"
				@cell-mouse-over="cellMouseOver"
				@grid-ready="onGridReady"
			>
			</ag-grid-vue>
			 <display-config
				ref="tableDisplayConfig"
				@drag-columns-stopped="handleStopDragColumn"
				@change-colmn-display-config="configColumnDisplay"
				@save-list-display-config="saveTableDisplayConfig"
				@re-render="reRender"
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
		  <v-dialog
            v-model="deleteDialogShow"
            max-width="290">
            <v-card>
                <v-card-title class="headline">{{$t('common.remove_confirm_title')}}</v-card-title>
                <v-card-text>
                {{$t('common.remove_confirm_message', {count: deleteItems.length})}}
                </v-card-text>

                <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn
                    color="green darken-1"
                    text
                    @click="deleteDialogShow = false"
                >
                    {{$t('common.close')}}
                </v-btn>

                <v-btn
                    color="red"
                    text
                    @click="confirmDeleteItems()">
                    {{$t('common.delete')}}
                </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
	 </div>
</template>
<script>
import {AgGridVue} from "ag-grid-vue";
import { MenuModule } from '@ag-grid-enterprise/menu';
import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import { RowGroupingModule } from '@ag-grid-enterprise/row-grouping';
import '@ag-grid-community/core/dist/styles/ag-grid.css';
import '@ag-grid-community/core/dist/styles/ag-theme-balham.css';
import { util } from '@/plugins/util';
import Vue from "vue";
import Pagination from '@/components/common/Pagination'
import Api from "@/api/api.js";
import { getDefaultFilterConfig } from "@/components/common/customTable/defaultFilterConfig.js";
import CustomHeader from '@/components/common/agDataTable/CustomAgGrid/CustomHeader'
import DisplayConfig from "@/components/common/listItemComponents/DisplayConfig";
import SymperDragPanel from "@/components/common/SymperDragPanel.vue";
import { VDialog, VNavigationDrawer } from "vuetify/lib";
import TableFilter from '@/components/common/customTable/TableFilter'
import PerfectScrollbar from "perfect-scrollbar";
import ListItemsWorker from 'worker-loader!@/worker/common/listItems/ListItems.Worker.js';
import { actionHelper } from "@/action/actionHelper";
import CheckBoxRendererListItems from "@/components/common/agDataTable/CheckBoxRendererListItems"

let CustomHeaderVue = Vue.extend(CustomHeader);

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
         * Mặc định context menu chứa các options: remove, view, edit
         */
        useDefaultContext: {
            type: Boolean,
            default: false
		},
		/**
		 * Custom thêm các action trong header show list 
		 */
		customHeaderBtn:{
			type: Object,
			default(){
				return {}
			}
		},
		checkedRows:{
			type: Array,
			default(){
				return []
			}
		},
		/**
		 * Truyeenf vao row height
		 * 
		 */
		rowHeight:{
			type: Number,
			default:21
		},
		/**
         * * Các contextmenu cho các item trong list, có dạng:
         * [
         *      {
         *          name: 'action1' // Tên của context menu để phân biệt với các context menu khác.
         *          text: ' Action 1' // Text hiển thị lên .
         *      }
         * ]
         */
        tableContextMenu: {
            default() {
                return [];
            }
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
        showDisplayConfig:{
            type:Boolean,
            default: true
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
        flexMode: {
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
	beforeCreate(){
		
	},
	created(){
		let self = this
		this.$evtBus.$on('list-items-ag-grid-on-change-checkbox',data=>{
			self.$set(data.data, 'checked', true)
			if(!self.allRowChecked.includes(data.data)){
				self.allRowChecked.push(data.data)
			}else{
				data.checked = false
				self.allRowChecked.splice(self.allRowChecked.indexOf(data.data), 1)
			}
			self.$emit('after-selected-row',self.allRowChecked)
			// self.$emit('row-selected',self.allRowChecked)
        })
		this.listItemsWorker = new ListItemsWorker()
        this.listItemsWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'getData':
					
					self.handlerGetData(data.dataAfter)
					break;
                case 'getItemForValueFilter':
					self.tableFilter.currentColumn.colFilter.selectItems = data.dataAfter.selectItems
					break;
                case 'setSelectItemForFilter':
					self.tableFilter.currentColumn.colFilter.selectItems = data.dataAfter.selectItems
					break;
                case 'restoreTableDisplayConfig':
					self.handlerRestoreTableDisplayConfigRes(data.dataAfter)
					break;
                case 'saveTableDisplayConfig':
					self.handlerSaveTableDisplayConfigRes(data.dataAfter)
					break;
                case 'getTableColumns':
					data.dataAfter.forEach(function(e){
						if(e.cellRenderer){
							eval("e.cellRenderer = " + e.cellRenderer)
						}
					})
					self.columnDefs = data.dataAfter
					break;
                default:
                    break;
            }
		});
		this.getData()
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
            }else{
				this.showSearchBox = true
			}
		},
		checkedRows:{
			deep: true,
			immediate: true,
			handler(arr){
				if(arr.length > 0){
					this.allRowChecked = arr
				}
			}
		},
		rowData:{
			deep: true,
			immediate: true,
			handler(arr){
				if(arr.length == 0){
					this.showNoRowsOverlay()
				}
			}
		},
		columnDefs:{
			deep: true,
			immediate: true,
			handler(arr){
				let self = this
				if(arr.length > 0){
					arr.forEach(function(e){
						if(e.symperFixed && !self.fixedCols.includes(e.field)){
							self.fixedCols.push(e.field)
						}
					})
				}
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
		tableContextMenu:{
			deep: true,
			immediate: true,
			handler(arr){
				this.relistContextmenu();
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
		},
		'tableDisplayConfig.value.wrapTextMode'(value){
			this.customRowHeights(value)
		}
	},
    data(){
		let self = this
        return {
			gridApi: null,
			listItemsWorker: null,
			deleteDialogShow: false,
			deleteItems: [],
            savedTableDisplayConfig: [], // cấu hình hiển thị của table đã được lueu trong db
			showSearchBox: true,
            loadingRefresh: false, // có đang chạy refresh dữ liệu hay ko
            loadingExportExcel: false, // có đang chạy export hay ko
			totalObject:0,
			flagGetData: false,
			pageSize: 50,
			agApi: null,
			frameworkComponents: null,
			overlayLoadingTemplate: null,
			allRowChecked: [],
			overlayNoRowsTemplate: null,
            actionPanel: false, // có hiển thị action pannel (create, detail, edit) hay không
            page: 1, // trang hiện tại
			gridOptions:null,
			fixedCols:[],
			defaultColDef:null,
			arrContextMenu: [],
			selectedContextItem: null,
			getContextMenuItems(param){
				self.paramOnContextMenu = param;
				return self.tmpTableContextMenu;
			},
			searchKey: "",
			modules:[
				MenuModule,
			],
			MedalCellRenderer(){
			},	
            cellAboutSelecting: {}, // cell có nguy cơ được lựa chọn, được set mỗi khi chuột hover qua
			tableDisplayConfig: {
                show: false, // có hiển thị panel cấu hình ko
                width: 300, // Chiều rộng của panel cấu hình
                value: {
                    wrapTextMode: 1,
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
            hasColumnsChecked: false,
			selectingParams:null,
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
		TableFilter,
		CheckBoxRendererListItems

	},
	mounted(){
		this.gridApi = this.gridOptions.api;
		
	},
    beforeMount(){
		this.defaultColDef = {
            minWidth: 40,
			filter: true,
			sortable: true,
			resizable: true,
			wrapText: true,
			autoHeight: true,
			headerComponentParams :{
				headerPrefixKeypath: this.headerPrefixKeypath
			}
		};
		this.gridOptions = {
			enableRangeSelection: true,
			// rowSelection: 'multiple',
			onCellKeyDown: this.onCellKeyPress,
			getRowStyle: function(params) {
				if (params.node.rowIndex % 2 != 0) {
					return { background: '#fbfbfb' };
				}
			}
		}
		this.frameworkComponents = {
			agColumnHeader: CustomHeaderVue,
			CheckBoxRendererListitems: CheckBoxRendererListItems
		};
		this.overlayLoadingTemplate =
		  '<span class="ag-overlay-loading-center">Đang tải dữ liệu vui lòng chờ </span>';
		this.overlayNoRowsTemplate =
      	'<span style="padding: 10px; border: 2px solid #444; background: lightgoldenrodyellow;">Không có dữ liệu</span>';
    },
	methods:{
		getAllData(){
			return this.rowData
		},
		
		customRowHeights(value){
			if(value == 1){
				this.gridOptions.rowHeight  = this.rowHeight
			}else{
				this.defaultColDef.autoHeight = true
				this.defaultColDef.wrapText = true
			}
			setTimeout(self=>{
				self.agApi.resetRowHeights()
			},10,this)
		},
		showLoadingOverlay() {
			this.agApi.showLoadingOverlay();
		},
		showNoRowsOverlay() {
			if(this.agApi){
				this.agApi.showNoRowsOverlay();
			}
		},
		hideOverlay() {
			this.agApi.hideOverlay();
		},
		cellContextMenu(params){
			this.changeSelectionRow()
			this.$emit('cell-context-menu', params)
		},
		cellMouseDown(params){
			this.$emit('after-cell-mouse-down', params)
		},
		changeSelectionRow(){
			let arr = document.getElementsByClassName('ag-row-selected')
			for(let i = 0; i < arr.length ; i++){
				$(arr[i]).removeClass('ag-row-selected')
			}
			if(arr.length > 0){
				for(let i = 0; i < arr.length ; i++){
					$(arr[i]).removeClass('ag-row-selected')
				}
			}
			if(document.getElementsByClassName('ag-row-selected').length > 0){
			 	$(document.getElementsByClassName('ag-row-selected')[0]).removeClass('ag-row-selected')
			}	
			$(document.getElementsByClassName('ag-row-focus')).each(function(e){
				$(document.getElementsByClassName('ag-row-focus')[e]).addClass('ag-row-selected')
			}) 
		},
		cellMouseOver(params){
			this.cellAboutSelecting = params.data
			if(this.debounceRelistContextmenu){
				clearTimeout(this.debounceRelistContextmenu);
			}
			this.debounceRelistContextmenu = setTimeout((self) => {
				self.relistContextmenu();
			}, 100, this);
		},
		isShowCheckedRow(){
            return this.hasColumnsChecked
		},
		 // hoangnd: thêm cột checkbox
        addCheckBoxColumn(){
            this.hasColumnsChecked = true;
            this.columnDefs.unshift(
				{ 
					headerName: 'Chọn', 
					field: 'checkbox', 
					editable:true,
					cellRendererFramework : 'CheckBoxRendererListItems',
					width: 50
				}	
			)
			this.gridOptions.api.setColumnDefs([]);
		},
		emptyShowList(){
			this.columnDefs = []
			this.rowData = []
		},
		// dungna doi hasColumnsChecked = true
		addColumnsChecked(){
			this.hasColumnsChecked = true
		},
        removeCheckBoxColumn(){
            this.hasColumnsChecked = false;
            this.columnDefs.shift();
        },
		relistContextmenu(){
            if(!this.cellAboutSelecting){
                return;
			}
			let row = this.cellAboutSelecting
            let id = row.id;
            let items = this.tableContextMenu;
            if(!$.isArray(items)){
                let objectType = this.commonActionProps.resource;
                let parentId = this.commonActionProps.parentId ? this.commonActionProps.parentId : id;
                items = actionHelper.filterAdmittedActions(items, objectType, parentId ,id);
			}
			let tmpTableContextMenu = this.getItemContextMenu(items);

			this.tmpTableContextMenu = this.reduceContextMenuItems(tmpTableContextMenu)
		},
		reduceContextMenuItems(tmpTableContextMenu){
			let arr = []
			let self = this
			for(let i in tmpTableContextMenu.items){
				let obj = {}
				obj.name =  tmpTableContextMenu.items[i].name
				obj.action = () => {
					let param = self.paramOnContextMenu;
					let selection = [{
						start: {
							col: param.column.colDef.field,
							row: param.node.rowIndex,
						},
						end: {
							col: param.column.colDef.field,
							row: param.node.rowIndex,
						},
					}];
					tmpTableContextMenu.callback(i, selection);
				}
				obj.cssClasses = ['redFont', 'bold']
				arr.push(obj)
			}
			return arr;
		},
		exeCallbackOnContextMenu(rowData){
            let thisCpn = this;
            let menuItem = this.selectedContextItem;
            menuItem[0].callback(util.cloneDeep(rowData), () => {
                thisCpn.getData();
            });
        },
        getItemContextMenu(rawItems) {
            let thisCpn = this;
            let contextMenu = {
                callback: function(key, selection) {
                    let col = selection[0].start.col;
					let row = selection[0].start.row;
					
                    let rowData = thisCpn.rowData[row];
                    // let colName = Object.keys(rowData)[col];
                    let callBackOption = thisCpn.tableContextMenu[key];
                    if(callBackOption && callBackOption.multipleSelection){
                        rowData = [];
                        for(let i = selection[0].start.row; i <= selection[0].end.row; i++){
                            rowData.push(thisCpn.rowData[i]);
                        }
                    }
                    /**
                     * Phát sự kiện khi có một hành động đối với một row, hoặc cell.
                     * tham số thứ nhất: row ( index của row đang được chọn)
                     * tham số thứ hai: colName ( Tên của cột (key trong một row) )
                     */
                    // Callback for context menu item
                    let menuItem = rawItems.filter(menu => {
                        return menu.name == key;
                    });
					thisCpn.selectedContextItem = menuItem;
                    if (
                        menuItem.length &&
                        menuItem[0].hasOwnProperty("callback")
                    ) {
                        if(key == 'delete' || key == 'remove'){
                            thisCpn.deleteItems = [];
                            let deletedIndexs = {};
                            for(let item of selection ){
                                for(let idx = item.start.row ; idx <= item.end.row; idx++){
                                    if(!deletedIndexs[idx]){
                                        thisCpn.deleteItems.push(thisCpn.rowData[idx]);
                                        deletedIndexs[idx] = true;
                                    }
                                }
                            }
                            thisCpn.deleteDialogShow = true;
                        }else{
                            thisCpn.exeCallbackOnContextMenu(rowData);
                        }
                    }
                    
                    if (key == "edit" || key == "view") {
                        thisCpn.actionPanel = true;
                    }
                },
                items: {}
            };
            if (this.useDefaultContext) {
                contextMenu.items = {
                    remove: {
                        name: "Xóa"
                    },
                    edit: {
                        name: "Sửa"
                    },
                    view: {
                        name: "Chi tiết"
                    }
                };
            }
            for (let item of rawItems) {
                contextMenu.items[item.name] = {
                    name: item.text
                };
			}
            return contextMenu;
		},
		
		handlerGetData(data){
			let self = this
			if(self.customAPIResult.reformatData){
				data = self.customAPIResult.reformatData(data);
			}else{
				data = data.data;
			}
			this.totalObject = data.total ? parseInt(data.total) : 0;
			let resData = data.listObject ? data.listObject : []
			// if(lazyLoad){
			// 	resData.forEach(function(e){
			// 		thisCpn.rowData.push(e)
			// 	})
			// }else{
			self.rowData = resData;
			// }z
			debugger
			data.columns.forEach(function(e){
				if(e.cellRenderer){
					e.cellRenderer = e.cellRenderer.toString()
				}
			})
			this.listItemsWorker.postMessage({
				action: 'getTableColumns',
				data:{
					column: data.columns,
					forcedReOrder: false,
					savedOrderCols: self.savedTableDisplayConfig,
					filteredColumns: self.filteredColumns
				}
			})
			this.hideOverlay()
			this.$emit('data-loaded', resData)
		},
		handlerRestoreTableDisplayConfigRes(res){
			if(res.savedConfigs){
				if(res.savedConfigs.wrapTextMode){
					this.tableDisplayConfig.value.wrapTextMode =  res.savedConfigs.wrapTextMode;
				}
				if(res.savedConfigs.densityMode){	
					this.tableDisplayConfig.value.densityMode =  res.savedConfigs.densityMode;
				}
				if(res.savedConfigs.alwaysShowSidebar){
					this.tableDisplayConfig.value.alwaysShowSidebar =  res.savedConfigs.alwaysShowSidebar;
				}
				this.savedTableDisplayConfig = res.savedConfigs.columns;
				if(res.columnDefs){
					this.columnDefs = res.columnDefs
					this.handleStopDragColumn();
				}
			}
		},
		handlerSaveTableDisplayConfigRes(res){
			this.savingConfigs = false
			this.$snotify({
				type: "success",
				title: this.$t("table.success.save_config")
			})
		},
		reRender(){
			// this.agApi.sizeColumnsToFit()
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
                $(icon).addClass("applied-filter");
            }else{
                this.$delete(this.tableFilter.allColumn, colName);
                icon.removeClass("applied-filter");
			}
			let widgetIdentifier = this.getWidgetIdentifier()
			this.$store.commit('app/setFilteredColumns', {filteredColumns: this.filteredColumns, widgetIdentifier: widgetIdentifier})
		},
		confirmDeleteItems(){
            this.deleteDialogShow = false;
            this.exeCallbackOnContextMenu(this.deleteItems);
            setTimeout((self) => {
                self.deleteItems = [];
            }, 200, this);
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
			this.allRowChecked = []
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
			let self = this
            if(colFilter.selectItems.length == 0){
				let textItems = testSelectData;
				this.listItemsWorker.postMessage({
					action: 'setSelectItemForFilter',
					data:{
						textItems : textItems,
						colFilter: self.tableFilter.currentColumn.colFilter,
					}
				});
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
			let dataConfig = this.getConfigApiCall()
			dataConfig.options = options
			dataConfig.columns = columns
			dataConfig.colFilter = self.tableFilter.currentColumn.colFilter
			this.listItemsWorker.postMessage({
				action: 'getItemForValueFilter',
				data:{
					dataConfig
				}
			});
		},
		getConfigApiCall(){
			let self = this
			let customDataForApi
			if(self.customDataForApi){
				customDataForApi = self.customDataForApi(false, false, false)
			}
			let obj = {
				url: self.getDataUrl,
				method: self.apiMethod,
				tableFilter: self.tableFilter,
				customDataForApi: customDataForApi,
				routeName: self.$getRouteName(),
				useWorkFlowHeader: self.useWorkFlowHeader,
				searchKey: self.searchKey,
				page: self.page,
				pageSize: self.pageSize,
				conditionByFormula: self.conditionByFormula,
				savedTableDisplayConfig: self.savedTableDisplayConfig
			}
			self.columnDefs.forEach(function(e){
				if(e.cellRenderer){
					e.cellRenderer = e.cellRenderer.toString()
				}
			})
			obj.columnDefs = self.columnDefs
			return obj
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
		handlerRowClicked(params){
			this.$emit('row-selected', params.data);
		},
		onCellClicked(params){
			this.changeSelectionRow()
			this.$emit('row-selected', params.data);
		},
		onSelectionChanged() {
			var selectedRows = this.agApi.getSelectedRows();
			document.querySelector('.ag-row-selected').innerHTML = selectedRows.length === 1 ? selectedRows[0].athlete : ''
		},
		onCellKeyPress(params){
			if(params.event.keyCode == 67){
				this.agApi.copySelectedRowsToClipboard();
			}
		},	
		onGridReady(params){
			params.api.sizeColumnsToFit()
			this.agApi = params.api
			this.agApi.showLoadingOverlay()
			setTimeout(self=>{
				self.customRowHeights(self.tableDisplayConfig.value.wrapTextMode)
			},200, this)
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
				this.gridOptions.columnApi.setColumnVisible(column.field, !isValue)
				this.resetHiddenColumns();
            } else {
				if(isValue){
					column.pinned = 'left' 
				}else{
					delete column.pinned
				}
				this.reOrderFixedCols();
				let flag = false
				this.columnDefs.forEach(function(e){
					if(e.symperFixed){
						flag = true
						return
					}
				})
				if(!flag){
					this.refreshList()
				}
			}
			this.agApi.refreshCells()

		},
		resetHiddenColumns(){
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
        },
		reOrderFixedCols(){
			let fixedCols = [];
            let noneFixedCols = [];
            for (let col of this.columnDefs) {
                if (col.symperFixed) {
                    fixedCols.push(col);
                } else {
                    noneFixedCols.push(col);
                }
            }
            if (fixedCols.length > 0) {
                this.columnDefs = fixedCols.concat(noneFixedCols);
            }
            setTimeout(
                thisCpn => {
                    thisCpn.savedTableDisplayConfig = thisCpn.columnDefs;
                },
                1000,
                this
			);
			this.gridOptions.api.setColumnDefs([]);
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
			this.showLoadingOverlay()
            this.getData();
            this.$emit("change-page-size", vl.pageSize);
		},
		changePage(vl){
			this.page = vl.page
			this.showLoadingOverlay()
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
            this.getData(false , false , true , lazyLoad);
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
		getData(columns = false, cache = false, applyFilter = true, lazyLoad = false ){
			let self = this;
			let dataConfig = this.getConfigApiCall()
			dataConfig.configs = {
				columns: columns,
				cache: cache, 
				applyFilter: applyFilter,
			}
			dataConfig.lazyLoad = lazyLoad
			dataConfig.customAPIResult = self.customAPIResult.reformatData ? self.customAPIResult.reformatData.toString() : null
			dataConfig.filteredColumns = self.filteredColumns
			this.listItemsWorker.postMessage({
				action: 'getData',
				data: dataConfig
			});
		},
		 /**
         * Khôi phục lại cấu hình của hiển thị của table từ dữ liệu được lưu
         */
        restoreTableDisplayConfig() {
			let widgetIdentifier = this.getWidgetIdentifier();
			let self = this
			this.listItemsWorker.postMessage({
				action: 'restoreTableDisplayConfig',
				data:{
					widgetIdentifier: widgetIdentifier,
					columnDefs: self.columnDefs
				}
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
                    data: col.field,
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
			this.listItemsWorker.postMessage({
				action: 'saveTableDisplayConfig',
				data:{
					dataToSave: dataToSave
				}
			});
		},
		 /**
         * Xử lý việc sau khi kết thúc kéo thả các cột ở thanh cấu hình hiển thị danh sách
         */
        handleStopDragColumn(tbCols) {
            this.tableDisplayConfig.drag = false;
            if(tbCols){
                this.columnDefs = tbCols;
            }
            this.resetHiddenColumns();
			this.reOrderFixedCols();		
			this.gridOptions.api.setColumnDefs([]);
        },
	}

}
    
    
</script>
<style scoped>
.symper-list-items >>> .ag-row{
	border-top-style:unset !important;
}
.symper-list-items >>> .ag-theme-balham .ag-root-wrapper{
	border: unset !important;
}
.symper-list-items >>> .ag-header{
	border: unset !important;
}
.symper-list-items >>> .ag-row{
	border-radius: 4px;
}
.symper-list-items >>> .ag-row:hover{
	border-radius: 4px;
}
.symper-list-items >>> .ag-theme-balham .ag-cell{
	line-height: unset !important
}
.symper-list-items >>> .ag-header {
	height: 28px !important;
	min-height: unset !important;
	background-color: #ffffff !important;
	border-top: 1px solid lightgray !important;
	border-bottom: 1px solid lightgray !important;
}
.symper-list-items >>> .ag-theme-balham .ag-header-row {
    height: 24px !important;
}
.symper-list-items >>> .ag-row-selected{
	background-color: #DBE7FE !important;
}
.symper-list-items >>> .clip-text .ag-cell{
	text-overflow: ellipsis !important;
    white-space: nowrap !important;
}
.symper-list-items >>> .applied-filter {
    color: #f58634;
    background-color: #ffdfc8;
}
.symper-list-items >>> .ag-menu-option-text{
	line-height: 12px !important;
	padding-left: unset !important;
}
</style>
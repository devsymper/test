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
                    :value="searchValue"
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
                        <!-- filter button -->
                            <v-menu offset-y nudge-bottom='8' :max-width="210" :min-width="210" :close-on-click="false" >
                            <template v-slot:activator="{ on:menu }">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on:tooltip }">
                                        <v-btn
                                            @click="isClose=true"
                                            depressed
                                            small
                                            v-if="showFilter"
                                            class="mr-2"
                                            v-on="{ ...tooltip, ...menu }">
                                            <v-icon left dark class="mr-0" :style="{color:selectedFilterName?'#FF8C00!important':'black'}">mdi-filter</v-icon>
                                            <span style="color:#FF8C00!important;" >{{selectedFilterName}}</span>
                                            <div v-if="closeBtnFilter"  class="ml-2" style="border-right:1px solid #E0E0E0; height:27px"></div>
                                            <v-icon v-if="closeBtnFilter" class="ml-2" style="font-size:14px" @click="hideCloseBtnFilter()">mdi-close</v-icon>
                                          
                                        </v-btn>
                                    </template>
                                    <span>{{ $t('common.filter')}}</span>
                                </v-tooltip>
                            </template>
                            <config-filter 
                                @set-table="setTable"
                                @config-filter-action="configFilterAction"
                                @add-filter-config="addFilterConfig"
                                :filter="listFilters"/>
                        </v-menu>
                        <!-- filter button -->
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
								@click="customBtnClick(i)"
								class="mr-2"
							>
								<v-icon left dark v-if="item.icon">{{item.icon}}</v-icon>
								<span v-if="item.title"> {{item.title}} </span>
							</v-btn>
						</span>
			 </div>
		 </div>
         <!-- add filter -->
         <add-filter v-if="addFilter" :filterName="filterName" @add-filter="handleAddFilter"/>
         <!-- add filter -->
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
                @dragStopped="columnResized()"
                @columnResized="resize()"
				@rowClicked="handlerRowClicked"
				:rowData="rowData"
				:frameworkComponents="frameworkComponents"
				:overlayLoadingTemplate="overlayLoadingTemplate"
				:overlayNoRowsTemplate="overlayNoRowsTemplate"
				@cell-context-menu="cellContextMenu"
                @cell-mouse-down="cellMouseDown"
				@selection-changed="onSelectionChanged"
				@cell-mouse-over="cellMouseOver"
				@grid-ready="onGridReady"
			>
			</ag-grid-vue>
			 <display-config
				ref="tableDisplayConfig"
                @change-format="changeFormat"
                @change-apply="applyConditionFormat"
                @save-conditional-formatting="saveConditionalFormatting"
				@drag-columns-stopped="handleStopDragColumn"
				@change-colmn-display-config="configColumnDisplay"
				@save-list-display-config="saveTableDisplayConfig"
				@re-render="reRender"
                :rowData="rowData"
                :conditionalFormat="conditionalFormat"
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
        <SymperDialogConfirm 
            @confirm="confirmDeleteFilter()"
            @cancel="showDelPopUp=false"
            :title="'Xóa'" 
            :content="contentDelete" 
            :showDialog="showDelPopUp"
        />
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
import CheckBoxRenderer from "@/components/common/agDataTable/CheckBoxRenderer"
import SymperDialogConfirm from "@/components/common/SymperDialogConfirm"
import ConfigFilter from "./ListItemConfigFilter"
import 'ag-grid-enterprise';
import AddFilter from "./ListItemAddFilter"
import CheckBoxRendererListItems from "@/components/common/agDataTable/CheckBoxRendererListItems"
let CustomHeaderVue = Vue.extend(CustomHeader);
import  {ClipboardModule} from '@ag-grid-enterprise/clipboard';

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
        showDisplayConfig:{
            type:Boolean,
            default: true
        },
         flexMode: {
            type: Boolean,
            default: false
        },
         /**
         * flexColumns : true of false, nếu đúng thì colmn sẽ có thêm thược tính flex đê full màn hinh
         * dev created : dungna
         * 
         */
        flexColumns:{
            type: Boolean,
            default: false
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
        showFilter:{
            type: Boolean,
            default: true
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
	beforeCreate(){
		
	},
	created(){
        this.listItemsWorker = new ListItemsWorker()
		this.restoreTableDisplayConfig();
        let self = this;
		this.$evtBus.$on('list-items-ag-grid-on-change-checkbox',data=>{
            self.$set(data.data, 'checked', true)
			if(!self.allRowChecked.includes(data.data)){
				self.allRowChecked.push(data.data)
			}else{
                data.checked = false
				self.allRowChecked.splice(self.allRowChecked.indexOf(data.data), 1)
			}
			self.$emit('after-selected-row',self.allRowChecked)
        })
        
      
        
        this.listItemsWorker.addEventListener("message", function (event) {
			let data = event.data;
            switch (data.action) {
                case 'getData':
                    self.handlerGetData(data.dataAfter)
					break;
                case 'customGetData':
					self.handleCustomGetData(data.dataAfter)
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
                case 'saveUiConfig':
                    if(self.isNotiSuccess){
                        self.handleSaveUiConfig(data.dataAfter, true)
                    }else{
                        self.handleSaveUiConfig(data.dataAfter, false)
                    }
                    break;
                case 'getTableColumns':
					data.dataAfter.forEach(function(e){
                         if(self.flexColumns){
                            e.flex = 1
                        }
						if(e.cellRenderer){
							eval("e.cellRenderer = " + e.cellRenderer)
						}
						if(e.cellStyle){
							eval("e.cellStyle = " + e.cellStyle)
						}
                    })
                     data.dataAfter.map(column=>{
                        self.widthColumns.map(c=>{
                            if(c){
                                if(column.field==c.colId){
                                    column.width=c.width
                                }
                            }
                        
                        })
                    })
                    self.columnDefs = data.dataAfter;
                    if(self.conditionalFormat&&self.conditionalFormat.length>0){
                        if(self.listSelectedCondition.length==0){
                            self.listSelectedCondition = self.getListSelectedConditionFormat();
                        }
                        self.columnDefs = self.handleConditionalFormat(data.dataAfter);
                    
                    }
					break;
                default:
                    break;
            }
        });
        this.getData();
        // this.getDefaultFilter();
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
		let self = this;
        return {
            searchValue:'',
            typeDelete:'',
            countColumnResized:0,
            isNotiSuccess:false,// có hoặc không hiển thị thông báo khi lưu thành công 
            conditionalFormat:[],
            listSelectedCondition:[],//list cấu hình điều kiện được chọn
            listId:[],// chứa list Id của table
			gridApi: null,
            closeBtnFilter:false,
            isUpdateFilter:false,
            widthColumns:[],// lưu cấu hình độ rộng của các cột showlist
            isClose:true,
            listFilters:[],
            notiFilter:'',
            conditionIndex :-1,
            deleteFilterIdx:0,
            contentDelete:"",
            showDelPopUp:false,// hiển thị pop up xác nhận xóa
            selectedFilterName:'',
			listItemsWorker: null,
			deleteDialogShow: false,
            deleteItems: [],
            filterMenu:false,
            addFilter:false,
            filterName:'',
            savedTableDisplayConfig: [], // cấu hình hiển thị của table đã được lưu trong db
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
        SymperDialogConfirm,
        DisplayConfig,
        "add-filter":AddFilter,
        "config-filter" : ConfigFilter,
		"symper-drag-panel": SymperDragPanel,
		VNavigationDrawer,
		VDialog,
		TableFilter,
        CheckBoxRenderer,
        CheckBoxRendererListItems

	},
	mounted(){
		this.gridApi = this.gridOptions.api;
		
	},
    beforeMount(){
		this.defaultColDef = {
            minWidth: 40,
            filter: true,
			suppressMenu : true,
			sortable: true,
			resizable: true,
			wrapText: true,
			autoHeight: true,
			headerComponentParams :{
				headerPrefixKeypath: this.headerPrefixKeypath
            },
            
        };
		this.gridOptions = {
			enableRangeSelection: true,
			// rowSelection: 'multiple',
			onCellKeyDown: this.onCellKeyPress,
			getRowStyle: function(params) {
				if (params.node.rowIndex % 2 != 0) {
					return { background: '#fbfbfb' };
				}
			},
			suppressCopyRowsToClipboard: true,
			modules:[ClipboardModule]
		},
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
        // lấy ra danh sách cấu hình format được chọn
        getListSelectedConditionFormat(){
            let result = [];
            this.conditionalFormat.map((data,index)=>{
                if(data.isSelected){
                    result.push(index)
                }
            })
            return result;
        },
        resize(){

        },
		customBtnClick(i){
			this.customHeaderBtn[i].callback()
		},
        handleAddFilter(data){
            if(data.type=='save'){
                this.filterName = data.filterName
                this.checkIsAddFilter()
            }else{
                this.addFilter = false;
            }
        },
        configFilterAction(data){
            let type = data.type;
              switch(type){
                case 'setDefaultFilter':
                    this.setDefaultFilter(data.filterIdx);
                    break;
                case 'unsetDefaultFilter':
                    this.unsetDefaultFilter(data.filterIdx);
                    break;
                case 'editFilter':
                    this.editFilter(data.filterIdx)
                    break;
                case 'deleteFilter':
                    this.typeDelete="filter";
                    this.deleteFilter(data.filterIdx)
                    break;
              }
        },
        setSelectedConditional(index, check = true){
            this.conditionalFormat.map((condition,i)=>{
                if(i==index){
                    condition.isSelected = check
                }
            })
        },
        applyConditionFormat(listSelectedCondition){
            // this.applyConfigFormat(listSelectedCondition);
            this.listSelectedCondition.map(data=>{
                this.setSelectedConditional(data)

            });
            this.listSelectedCondition = listSelectedCondition;
            this.saveConditionalFormatting(this.conditionalFormat);
            this.getData();
        },
         saveConditionalFormatting(data){
             this.conditionalFormat = data;
             this.saveUiConfig();
        },
        changeFormat(data){
            switch(data.type){
                case 'view':
                    break;
                case 'edit':
                    this.editConfigFormat(data.index);
                    break
                case 'delete':
                    this.deleteConfigFormat(data.index);
                    break
                case 'disApply':
                    this.disApplyConfigFormat(data.index);
                    break;
            };  
                this.getData();
        },
         disApplyConfigFormat(index){
            let listSelectedCondition = [];
            this.listSelectedCondition.map(data=>{
                 if(data!=index){
                     listSelectedCondition.push(data)
                 }else{ 
                    this.setSelectedConditional(data, false)
                 }
            });
            this.saveConditionalFormatting(this.conditionalFormat);
             this.listSelectedCondition = listSelectedCondition;
            //  this.getData();
         },
        // xử lý format màu trong table
        handleConditionalFormat(data){
            const self = this;
                data.map(column=>{
                    column.cellStyle = function(e){
                        let allColor = {}
                         self.listSelectedCondition.map(conditionalIdx=>{
                             let dataFormat = self.conditionalFormat[conditionalIdx];
                                if(eval(dataFormat.tableColumnsJS)&&self.conditionalFormat){// những cột được set màu
                                    if(dataFormat.displayMode.type=="singleColor"){// nếu là kiểu màu đơn
                                        let conditionalFormat = dataFormat.displayMode.singleColor.conditionFormat;
                                        if(eval(conditionalFormat)){
                                            allColor = {color: dataFormat.displayMode.singleColor.fontColor, backgroundColor:dataFormat.displayMode.singleColor.backgroundColor}
                                        }
                                    }
                                    else{// nếu thang màu
                                        let field = dataFormat.displayMode.colorScale.applyColumn.field;
                                        let valueTable = e.data[field];
                                        let listColors = dataFormat.displayMode.colorScale.listColors;
                                        let color = '';
                                        listColors.map(v=>{
                                            if(v.name==valueTable){
                                                color = v.backgroundColor
                                            }
                                        })
                                            allColor = {backgroundColor:color}
                                    }
                                }
                         })
                        return allColor
                    }
                })
            return data;
        },
        editConfigFormat(index){
            this.conditionIndex = index;
        },
          // lưu cấu hình formatting Table
        deleteConfigFormat(index){
            this.conditionIndex = index;
            this.typeDelete = 'formatTable';
            this.showDelPopUp = true;
            this.contentDelete =" Xóa định dạng "+this.conditionalFormat[index].nameGroup+" khỏi danh sách các định dạng";
        },
        hideCloseBtnFilter(){
            this.selectedFilterName = '';
            this.closeBtnFilter = false;
            this.isClose=false;
            this.searchValue = '';
            this.searchKey = "";
            //set lại trạng thái không filter
            this.tableFilter.allColumn={}
            this.getData();
           

        },
        // xử lý gán tất cả các biến trước khi gửi data
        saveUiConfig(){
            let tableConfig =  this.getTableDisplayConfigData();
            tableConfig.detail = JSON.parse(tableConfig.detail);
            tableConfig.detail.filter = this.listFilters;
            tableConfig.detail.conditionalFormat = this.conditionalFormat;
            tableConfig.detail.widthColumns = this.widthColumns;
            tableConfig.detail= JSON.stringify(tableConfig.detail);
            this.listItemsWorker.postMessage({
                action: 'saveUiConfig',
                data: tableConfig
			})
        },
        // action khi kéo cột showlist
        columnResized(){
            this.widthColumns=[];
            this.gridOptions.columnApi.columnController.allDisplayedColumns.map(column=>{
                this.widthColumns.push({
                    colId:column.colId,
                    width: column.actualWidth
                })
            })
            this.saveUiConfig();
        },
        //
        getDefaultFilter(){
            if(this.listFilters&&this.listFilters.length>0){
                this.listFilters.map((fil,i)=>{
                    if(fil.isDefault){
                        this.searchValue=fil.searchKey?fil.searchKey:''
                        this.selectedFilterName = fil.name;
                        this.closeBtnFilter = true;
                        this.searchKey = this.searchValue;
                        this.tableFilter.allColumn = fil.columns;
                        this.getData();
                        this.closeBtnFilter = true;
                    }
                })
            }
        },
        setDefaultFilter(filterIdx){
            this.listFilters[filterIdx].isDefault= true;
            this.listFilters.map((fil,i)=>{
                if(i!==filterIdx){
                    fil.isDefault=false;
                }
            })
            this.saveUiConfig();
        },
        unsetDefaultFilter(filterIdx){
            this.listFilters[filterIdx].isDefault= false;
            this.saveUiConfig();
        },
        editFilter(filterIdx){
            this.searchValue=this.listFilters[filterIdx].searchKey?this.listFilters[filterIdx].searchKey:'';
            this.searchKey = this.searchValue;
            this.addFilter = true;
            this.filterName = this.listFilters[filterIdx].name;
            this.isUpdateFilter= true;
            this.filterIdx = filterIdx;
        },
        
        deleteFilter(filterIdx){
            this.showDelPopUp = true;
            this.contentDelete =" Xóa bộ lọc "+this.listFilters[filterIdx].name+" khỏi danh sách các bộ lọc";
            this.deleteFilterIdx = filterIdx;
        },
        confirmDeleteFilter(){
            if(this.typeDelete=='filter'){
                let filter = this.listFilters.filter((item,idx)=>idx!=this.deleteFilterIdx);
                this.listFilters = filter;
                this.saveUiConfig();
                this.notiFilter = this.$t("table.success.delete_filter");
            }else{
                this.conditionalFormat = this.conditionalFormat.filter((c,i)=>i!=this.conditionIndex)
                 this.saveConditionalFormatting(this.conditionalFormat);
                //  this.getData()
            }
            this.showDelPopUp=false;
        },
       setTable(filterIdx){
            this.closeBtnFilter = true;
            this.searchValue = this.listFilters[filterIdx].searchKey?this.listFilters[filterIdx].searchKey:'';
            this.searchKey = this.searchValue;
            this.selectedFilterName = this.listFilters[filterIdx].name;
            let filter = this.listFilters;
            this.tableFilter.allColumn = this.listFilters[filterIdx].columns;
            this.getData()
        },
        addFilterConfig(){
            this.addFilter = true;
        },
        checkIsAddFilter(){
            if(!this.isUpdateFilter){
                this.listFilters.push({
                    name:this.filterName,
                    searchKey:this.searchKey,
                    isDefault: false,
                    columns:this.tableFilter.allColumn
                })
                this.notiFilter = this.$t("table.success.save_filter");
            }else{
                this.listFilters[this.filterIdx].name = this.filterName;
                this.listFilters[this.filterIdx].searchKey = this.searchKey;
                this.listFilters[this.filterIdx].columns = this.tableFilter.allColumn;
                this.notiFilter = this.$t("table.success.edit_filter");
            }
            this.isNotiSuccess = true;
            this.saveUiConfig()
        },
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
             this.$emit('cell-mouse-over',params)
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
                let obj = {};
                 obj.name =  tmpTableContextMenu.items[i].name;
                if(tmpTableContextMenu.items[i].subMenu){
                    obj.subMenu = tmpTableContextMenu.items[i].subMenu
                };
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
							let allRow = []
							let allRowRange = thisCpn.agApi.getCellRanges()
							thisCpn.agApi.forEachNode(node=>{
								if(node.rowIndex >= allRowRange[0].startRow.rowIndex && node.rowIndex <= allRowRange[0].endRow.rowIndex){
									allRow.push(node.data)
								}
							})
							thisCpn.deleteItems = allRow;
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
                if(item.subMenu&&item.subMenu.length>0){
                    contextMenu.items[item.name].subMenu = item.subMenu
                }
			}
            return contextMenu;
		},
		getListId(listObject){
            this.listId = [];
            if(listObject){
                listObject.map(obj=>{
                this.listId.push(obj.id)
            })
            }
            this.$emit('get-list-id',this.listId)
		},
		handleCustomGetData(data){
			this.$emit('custom-get-all-data', data.data.listObject)
		},
		handlerGetData(data){
            this.getListId(data.data.listObject);
			let self = this
			if(self.customAPIResult.reformatData){
				data = self.customAPIResult.reformatData(data);
			}else{
				data = data.data;
			}
			this.totalObject = data.total ? parseInt(data.total) : 0;
			let resData = data.listObject ? data.listObject : []
			self.rowData = resData;
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
                    filteredColumns: self.filteredColumns,
				}
			})
			this.hideOverlay()
			this.$emit('data-loaded', resData)

		},
		handlerRestoreTableDisplayConfigRes(res){
            this.listFilters = [];
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
                // xử lý phần filter
                this.listFilters = res.savedConfigs.filter?res.savedConfigs.filter:[];
                this.getDefaultFilter()
                //xử lý set độ rộng cho cột
                this.widthColumns = res.savedConfigs.widthColumns?res.savedConfigs.widthColumns:[];
                if(this.widthColumns){
                    this.columnDefs.map(column=>{
                        // column.width='1000'
                        this.widthColumns.map(c=>{
                            if(column.field==c.colId){
                                column.width=c.width
                            }
                        })
                    })

                    // this.gridOptions.api.setColumnDefs(this.columnDefs);

                 }
                // xử lý phần format conditional
                this.conditionalFormat = res.savedConfigs.conditionalFormat?res.savedConfigs.conditionalFormat:[];
                // this.gridOptions.api.setColumnDefs(this.columnDefs);

			}
		},
		handlerSaveTableDisplayConfigRes(res){
			this.savingConfigs = false
			this.$snotify({
				type: "success",
				title: this.$t("table.success.save_config")
			})
        },
        handleSaveUiConfig(res, notiSuccess = true){
            if(res.status==200){
                this.addFilter = false;
                this.filterName = '';
                this.searchKey = '';
                this.searchValue = '';
                  if(notiSuccess){
                    this.$snotify({
                    type: "success",
                    title: 'Thành công'	})
                }
            }else{
                this.$snotify({
				type: "error",
				title: "Lỗi"	})
            }
        },
		reRender(){
             this.agApi.redrawRows();
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
			let widgetIdentifier = this.getRouteIdentifier()
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
		showTableDropdownMenu(x, y, colName){
			this.searchKey = ""
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
                if(e.cellStyle){
					e.cellStyle = e.cellStyle.toString()
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
        onCellKeyPress(params){
			if(params.event.keyCode == 67){
				this.agApi.copySelectedRowsToClipboard();
			}
		},
		onSelectionChanged() {
			var selectedRows = this.agApi.getSelectedRows();
			document.querySelector('.ag-row-selected').innerHTML = selectedRows.length === 1 ? selectedRows[0].athlete : ''
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
            this.pageSize = vl.pageSize;
			this.showLoadingOverlay()
            this.getData();
            this.$emit("change-page-size", vl.pageSize);
		},
		changePage(vl){
            this.page = vl.page;
			this.showLoadingOverlay()
            this.getData();
            this.$emit("change-page", vl.page);
		},
		customGetData(page){
			this.page = page
			this.pageSize = 1000
			this.getData(false, false, true, false, true);
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
		getData(columns = false, cache = false, applyFilter = true, lazyLoad = false, customGetData = false){
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
			if(customGetData){
				this.listItemsWorker.postMessage({
					action: 'customGetData',
					data: dataConfig
				});
			}else{
				this.listItemsWorker.postMessage({
					action: 'getData',
					data: dataConfig
				});
			}	
			
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
                widgetIdentifier =  this.$route.path+':'+this.$store.state.app.endUserInfo.id;
            }
			widgetIdentifier = widgetIdentifier.replace(/(\/|\?|=)/g,'') ;
            return widgetIdentifier;
		},
		rerenderTable(){
			this.agApi.sizeColumnsToFit()
		},
		getRouteIdentifier(){
			let widgetIdentifier =  this.$route.path;
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
            let dataToSave =  this.getTableDisplayConfigData();
            dataToSave.detail = JSON.parse(dataToSave.detail);
            dataToSave.detail.filter = this.listFilters;
            dataToSave.detail= JSON.stringify(dataToSave.detail);
            //dataToSave.filter = this.filter;
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
.symper-list-items >>> .ag-cell{
	-webkit-touch-callout: none;
	-webkit-user-select: none; 
	-khtml-user-select: none; 
	-moz-user-select: none;
	-ms-user-select: none; 
	user-select: none; 
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
.filter-menu{
    height:35px!important
    /* //height:18px!important; */
}
.filter-menu:hover,.add-filter:hover,.action-filter:hover{
    background: #f5f5f5;
}
.config-filter-icon{
    margin-top:-15px;
    /* //display:none!important */
}
/* .show-icon:hover{
    display:block!important
} */
</style>
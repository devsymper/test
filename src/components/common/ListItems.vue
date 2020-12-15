<template>
    <div class="pl-2 w-100 pr-3 pt-3 list-item-common-symper" >
        <div :style="{width:contentWidth, display: 'inline-block'}">
           <v-row v-if="showToolbar" no-gutters class="pb-2" ref="topBar"> 
                <v-col>
                    <span 
						class="symper-title float-left"
						:class="{'ml-4': dialogMode == true }"
					>
						{{pageTitle}}
					</span>
                    <div :class="{'float-right': true, 'overline' : true , 'show-panel-mode': actionPanel } ">
                        <v-text-field
                            @input="bindToSearchkey"
							v-if="showSearchBox"
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
                </v-col>
            </v-row> 
            <v-row no-gutters>
                <v-col
                    :class="{
                            'fs-13 symper-custom-table symper-list-item': true,
                            'clip-text' : tableDisplayConfig.value.wrapTextMode == 1,
                            'loosen-row':  tableDisplayConfig.value.densityMode == 0,
                            'medium-row':  tableDisplayConfig.value.densityMode == 1,
                            'compact-row':  tableDisplayConfig.value.densityMode == 2,
                            'list-sbs': alwaysShowActionPanel
                        }"
                >
                    <hot-table
                        :height="tableHeight"
                        :settings="tableSettings"
                        :data="data"
                        :rowHeights="21"
                        :renderAllRows="true"
                        :columns="tableColumns"
                        :colHeaders="colHeaders"
                        :hiddenColumns="{
                            columns: tableDisplayConfig.value.hiddenColumns
                        }"
                        ref="dataTable"
                        :fixedColumnsLeft="fixedColumnsCount"
                    ></hot-table>
                </v-col>
            </v-row>
            <v-row v-show="showPagination" no-gutters ref="bottomBar" class="pt-3">
                <Pagination
                    :total="totalObject"
                    :totalVisible="7"
                    @on-change-page-size="changePageSize"
                    @on-change-page="changePage"
                ></Pagination>
            </v-row>
        </div>
        <component
            :is="actionPanelWrapper"
            :width="actionPanelWidth"
            :max-width="actionPanelWidth"
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
 
        <display-config
            ref="tableDisplayConfig"
            @drag-columns-stopped="handleStopDragColumn"
            @change-colmn-display-config="configColumnDisplay"
            @save-list-display-config="saveTableDisplayConfig"
            :tableDisplayConfig="tableDisplayConfig"
            :tableColumns="tableColumns"
            :headerPrefixKeypath="headerPrefixKeypath"
            :showActionPanelInDisplayConfig="showActionPanelInDisplayConfig"
        ></display-config>

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
import { HotTable } from "@handsontable/vue";
import { util } from "./../../plugins/util.js";
import Handsontable from 'handsontable';
// import FormTpl from "./FormTpl.vue";
import { VDialog, VNavigationDrawer } from "vuetify/lib";
import TableFilter from "./customTable/TableFilter.vue";
import { getDataFromConfig, getDefaultFilterConfig } from "./../common/customTable/defaultFilterConfig.js";
import Api from "./../../api/api.js";
import { userApi } from "./../../api/user.js";
import SymperDragPanel from "./SymperDragPanel.vue";
import DisplayConfig from "./../common/listItemComponents/DisplayConfig";
import Pagination from './../common/Pagination'
import { actionHelper } from "./../../action/actionHelper";
import {uiConfigApi} from "./../../api/uiConfig";


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
    watch: {
        actionPanel(){
            if (this.actionPanel == true) {
				this.$emit("open-panel");
				this.showSearchBox = false
            }
            else{
                this.$emit("close-panel");
            }
        },
        getDataUrl(){   
			this.page = 1
			if(this.refreshListWhenChangeUrl){
        		this.refreshList();
			}	
        },
        'tableDisplayConfig.value.alwaysShowSidebar'(value) {
            if(value && !$.isEmptyObject(this.currentItemDataClone) && this.currentItemDataClone.id){
                this.openactionPanel();
            }else{
                this.closeactionPanel();
            }
        },
        defaultData:{
            deep:true,
            immediate:true,
            handler:function(vl){
                if(vl.listObject.length > 0){
                    this.getData()
                }
            }
        }
    },
    data() {
        let self = this;
        return {
			showSearchBox: true,
            tmpTableContextMenu: null,
            deleteDialogShow: false, // có hiển thị cảnh báo xóa hay không
            deleteItems: [], // danh sách các row cần xóa
			savingConfigs: false, // có đang lưu cấu hình của showlist hay không
			
            // các cấu hình cho việc hiển thị và giá trị của panel cấu hình hiển thị của bảng
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
            fixedColumnsCount: 0, // Số lượng cột fix ở bên trái
            tableColumns: [],
            cellAboutSelecting: {}, // cell có nguy cơ được lựa chọn, được set mỗi khi chuột hover qua
            actionPanel: false, // có hiển thị action pannel (create, detail, edit) hay không
            loadingExportExcel: false, // có đang chạy export hay ko
            loadingRefresh: false, // có đang chạy refresh dữ liệu hay ko
            loadingData: false, // có đang loading data cho danh sách hay ko
            page: 1, // trang hiện tại
            currentAction: {
                // hành động hiện tại đang thực thi trong listitem (edit, remove, create ...)
                key: ""
            },
            pageSize: 50,
            tableSettings: {
                // các setting cho handsontable
                filters: true,
                manualColumnMove: true,
                manualColumnResize: true,
                renderAllRows: false,
                manualRowResize: true,
                readOnly: this.isTablereadOnly,
                contextMenu: {},
                currentRowClassName: 'symper-list-item-current-row',
                viewportRowRenderingOffset: 20,
                viewportColumnRenderingOffset: 20,
                rowHeights: 21,
                stretchH: "all",
                licenseKey: "non-commercial-and-evaluation",
                afterRender: isForced => {
                    console.count('list item render table');
                },
                afterSelection: (row, column, row2, column2, preventScrolling, selectionLayerLevel) => {
                    if(self.debounceEmitRowSelectEvt){
                        clearTimeout(self.debounceEmitRowSelectEvt);
                    }
                    let time = self.debounceRowSelectTime;
                    self.debounceEmitRowSelectEvt = setTimeout(() => {
                        self.$emit('row-selected', self.data[row]);
                    }, time);
                    self.focusingRowIndex = row;
                },
                afterScrollVertically(){
                    if(self.lazyLoad){
                        let count = 2;
                        let delayTimer
                        clearTimeout(delayTimer);
                        let value = event
                        delayTimer = setTimeout(function() {
                            if(value.target.scrollTop > $(value.target).height()/6*0.7){
                                if(count != self.page){
                                    self.nextPage(true)
                                    count++;
                                }
                            }
                        },500); 
                    }
                },
                beforeContextMenuSetItems: () => {
                },
                beforeOnCellMouseOver: (event, coords, TD, controller) => {
                    this.cellAboutSelecting = coords;
                    if(this.debounceRelistContextmenu){
                        clearTimeout(this.debounceRelistContextmenu);
                    }
                    this.debounceRelistContextmenu = setTimeout((self) => {
                        self.relistContextmenu();
                    }, 100, this);
                },
                afterChange: function (change, source) {
                     
                    self.handleAfterChangeDataTable(change, source) 
                },
                beforeKeyDown:function(change, source){
                    let cellMeta = this.getSelected();
                    self.$emit('before-keydown',{event:event,cell:{col:cellMeta[0][1],row:cellMeta[0][0]},rowData:self.data[cellMeta[0][0]]});
                },
                afterOnCellMouseDown:function(event, coords, TD){
                    self.$emit('after-cell-mouse-down',{event:event,cell:coords,rowData:self.data[coords.row]});
                },
                afterColumnMove(movedColumns, finalIndex, dropIndex, movePossible, orderChanged){

                },
                beforeOnCellMouseDown(){
                    if(event.which == 3){ // nếu select bằng context menu thì mới set lại các option
                        self.$refs.dataTable.hotInstance.updateSettings({
                            contextMenu: util.cloneDeep(self.tmpTableContextMenu)
                        });
                    }
                }
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
            searchKey: "", //Từ khóa cần tìm kiếm trên tất cả các cột,
            // Tổng số trang của danh sách này
            totalPage: 0,
            totalObject:0,
            /**
             * Cấu hình các cột của bảng danh sách, có dạng
             * [
             *    {
             *        name: 'A1', ứng với một key của data
             *        type: 'B1', Loại dữ liệu của cột này
             *        title: 'C1', Tiêu đề hiển thị lên bảng
             *    },
             *    {
             *        name: 'A2', ứng với một key của data
             *        type: 'B2', Loại dữ liệu của cột này
             *        title: 'C2', Tiêu đề hiển thị lên bảng
             *    }
             * ]
             */
            /**
             * Dữ liệu để hiển thị trong bảng, có dạng
             * [
             *    {
             *        A1: "vl1",
             *        A2: 'V2',
             *        A3: 'vl3',
             *        ...
             *    },
             *    {
             *        A1: "vl4",
             *        A2: 'V5',
             *        A3: 'vl6',
             *        ...
             *    },
             * ]
             */
            data: [],
            filteredColumns: {}, // tên các cột đã có filter, dạng {tên cột : true},
            savedTableDisplayConfig: [], // cấu hình hiển thị của table đã được lueu trong db
            hotTableContextMenuItems: [],
            allRowChecked:{},   // hoangnd: lưu lại các dòng được checked sau sự kiện after change
            hasColumnsChecked: false,
            focusingRowIndex: -1,
        };
    },
    activated(){
        // this.$refs.dataTable.hotInstance.render();
        this.refreshList();
    },
    created() {
        let thisCpn = this;
        this.getData();
        this.restoreTableDisplayConfig();
        document.addEventListener('keyup', function (evt) {
            if (evt.keyCode === 27) {
                thisCpn.closeactionPanel();
            }
        });
    },
    props: {
		refreshListWhenChangeUrl:{
			type: Boolean, 
			default: true
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
        /**
         * * Các contextmenu cho các item trong list, có dạng:
         * [
         *      {
         *          name: 'action1' // Tên của context menu để phân biệt với các context menu khác.
         *          text: ' Action 1' // Text hiển thị lên .
         *      }
         * ]
         * Khi một menu item được click,
         * nó sẽ emit sự kiện tên là: context-selection-tên của menu item
         */
        tableContextMenu: {
            default() {
                return [];
            }
        },
        /**
         * Mặc định context menu chứa các options: remove, view, edit
         */
        useDefaultContext: {
            type: Boolean,
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
    mounted() {
        this.checkMessageAndRefreshData();
        setTimeout(() => {
            this.registerAutoRefresh();        
        }, 3000);
    },
    computed: {
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
            if (ref.topBar) {
                tbHeight -=
                    util.getComponentSize(ref.topBar).h +
                    util.getComponentSize(ref.bottomBar).h + 14;
            }
            return tbHeight - 15 ;
        },
        /**
         * Tạo cấu hình cho hiển thị header của table
         */
        colHeaders() {
            let thisCpn = this;
            let prefix = this.headerPrefixKeypath;
            prefix =
                prefix[prefix.length - 1] == "." || prefix == ""
                    ? prefix
                    : prefix + ".";
            let colNames = [];
            let colTitles = this.tableColumns.reduce((headers, item) => {
                colNames.push(item.data);
                headers.push(item.columnTitle);
                return headers;
            }, []);
            return function(col) {
				let colName = colNames[col];
                let markFilter = "";
                if (thisCpn.filteredColumns[colName]) {
                    markFilter = "applied-filter";
                }
                let headerName = prefix ? thisCpn.$t(prefix + colTitles[col]) : colTitles[col];
                let filterIcon =  '';
                if(!thisCpn.tableColumns[col].noFilter){
                    filterIcon = `<i col-name="${colName}" onclick="tableDropdownClickHandle(this, event)" class="grey-hover mdi mdi-filter-variant symper-table-dropdown-button ${markFilter}"></i>`;
                }
                return `<span class="d-flex justify-space-between">
                            <span class="font-weight-medium">
                                ${headerName}
                            </span>
                            <span class="float-right symper-filter-button">
                                ${filterIcon}
                            </span>
                        </span>`;
                //.replace(/\n|\r\n/g,'')
            };
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
    methods: {
        registerAutoRefresh(){
            let topic = this.autoRefreshTopic.trim();
            if(topic){
                this.$store.dispatch('app/subscribeSystemMessagingTopics', [topic]);
            }
		},
		handleCloseClick(){
			this.$emit('close-popup')
		},
        checkMessageAndRefreshData(msg){
            let self = this;
            this.$evtBus.$on("app-receive-remote-msg", payload => {
                console.log(payload);
                payload = payload.data;
                if(!self._inactive && self.autoRefreshTopic){
                    let info = {};
                    try {
                        info = JSON.parse(payload.body);
                    } catch (error) {}
                    if(info.type == self.autoRefreshTopic && (payload.title == 'create' || payload.title == 'delete')){
                        self.refreshList();
                    }
                }
                
            });
        },
        changeAlwayShowSBSState(){
            this.tableDisplayConfig.value.alwaysShowSidebar = !this.tableDisplayConfig.value.alwaysShowSidebar;
        },
        getHotInstance(){
            return this.$refs.dataTable.hotInstance;
        },  
        rerenderTable(){
            this.$refs.dataTable.hotInstance.render();
        },
        importExcel(){
            this.$emit('import-excel');
        },
        showImportHistory(){
            this.$router.push("/viewHistory");
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
        relistContextmenu(){
            if(this.cellAboutSelecting.row < 0){
                return;
            }
            let row = this.$refs.dataTable.hotInstance.getSourceDataAtRow(this.cellAboutSelecting.row);
            let id = row.id;
            let items = this.tableContextMenu;
            if(!$.isArray(items)){
                let objectType = this.commonActionProps.resource;
                let parentId = this.commonActionProps.parentId ? this.commonActionProps.parentId : id;
                items = actionHelper.filterAdmittedActions(items, objectType, parentId ,id);
            }
            this.tmpTableContextMenu = this.getItemContextMenu(items);
        },
        getItemContextMenu(rawItems) {
            let thisCpn = this;
            let contextMenu = {
                callback: function(key, selection, clickEvent) {
                    let col = selection[0].start.col;
                    let row = selection[0].start.row;
                    let rowData = thisCpn.data[row];
                    let colName = Object.keys(rowData)[col];
                    let callBackOption = thisCpn.tableContextMenu[key];
                    if(callBackOption && callBackOption.multipleSelection){
                        rowData = [];
                        for(let i = selection[0].start.row; i <= selection[0].end.row; i++){
                            rowData.push(thisCpn.data[i]);
                        }
                    }
                    /**
                     * Phát sự kiện khi có một hành động đối với một row, hoặc cell.
                     * tham số thứ nhất: row ( index của row đang được chọn)
                     * tham số thứ hai: colName ( Tên của cột (key trong một row) )
                     */
                    thisCpn.$emit("context-selection-" + key, row, colName);
                    // Datnt
                    // Callback for context menu item
                    let menuItem = rawItems.filter(menu => {
                        return menu.name == key;
                    });
                    thisCpn.selectedContextItem = menuItem;
                    if (
                        menuItem.length &&
                        menuItem[0].hasOwnProperty("callback")
                    ) {
                        if(key == 'remove' || key == 'delete'){
                            thisCpn.deleteItems = [];
                            let deletedIndexs = {};
                            for(let item of selection ){
                                for(let idx = item.start.row ; idx <= item.end.row; idx++){
                                    if(!deletedIndexs[idx]){
                                        thisCpn.deleteItems.push(thisCpn.data[idx]);
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
        searchAutocompleteItems(vl){
            this.tableFilter.currentColumn.colFilter.searchKey = vl;
            this.getItemForValueFilter();
        },
        confirmDeleteItems(){
            this.deleteDialogShow = false;
            this.exeCallbackOnContextMenu(this.deleteItems);
            setTimeout((self) => {
                self.deleteItems = [];
            }, 200, this);
        },
        exeCallbackOnContextMenu(rowData){
            let thisCpn = this;
            let menuItem = this.selectedContextItem;
            menuItem[0].callback(util.cloneDeep(rowData), () => {
                thisCpn.getData();
            });
        },
        // Datnt render image/icon, custom status, date
        imgRenderer (instance, td, row, col, prop, value, cellProperties) {
            let escaped = Handsontable.helper.stringify(value), img;
            if (escaped.indexOf('mdi-') < 0) {
                img = document.createElement('IMG');
                img.src = value;
                img.width = 40;
            }
            else {
                img = document.createElement('I');
                img.classList.add('v-icon');
                img.classList.add('mdi');
                img.classList.add('theme--light');
                img.classList.add('title');
                img.classList.add(escaped);
                img.style.lineHeight = "15px";
            }
            Handsontable.dom.addEvent(img, 'mousedown', function (e){
                e.preventDefault(); // prevent selection quirk
            });
            Handsontable.dom.empty(td);
            td.appendChild(img);
            return td;
        },
        statusRenderer (instance, td, row, col, prop, value, cellProperties) {
            let escaped = Handsontable.helper.stringify(value), icon;
            icon = document.createElement('I');
            icon.classList.add('v-icon');
            icon.classList.add('mdi');
            icon.classList.add('theme--light');
            icon.classList.add('subtitle-1');
            icon.style.lineHeight = "15px";
            if (escaped == 'true' || escaped == '1') {
                icon.classList.add('mdi-check');
                icon.classList.add('success--text');
            }
            else {
                icon.classList.add('mdi-delete');
            }
            Handsontable.dom.addEvent(icon, 'mousedown', function (e){
                e.preventDefault(); // prevent selection quirk
            });
            Handsontable.dom.empty(td);
            td.appendChild(icon);
            return td;
        },
        dateRenderer (instance, td, row, col, prop, value, cellProperties) {
            let format = "";
            for (const col of this.tableColumns) {
                if (col.data == prop) {
                    format = col.dateFormat != undefined ? col.dateFormat : "";
                    break;
                }
            }
            if (!!format) {
                value = this.$moment(value).format(format)
            }
            let span = document.createElement('SPAN');
            span.innerHTML = value;
            span.style.color = 'blue';
            Handsontable.dom.empty(td);
            td.appendChild(span);
            return td;
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
        handleCloseDragPanel() {
            this.actionPanel = false;
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


            for (let col of this.tableColumns) {
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
		emptyShowList(){
			this.tableColumns = []
			this.data = []
		},
        /**
         * Lấy data từ server
         * @param {Array} columns chứa thông tin của các cột cần trả về.
         * @param {Boolean} cache có ưu tiên dữ liệu từ cache hay ko
         *
         */
        getData(columns = false, cache = false, applyFilter = true, lazyLoad = false ) {
            let thisCpn = this;
            let handler = (data) => {
                if(thisCpn.customAPIResult.reformatData){
                    data = thisCpn.customAPIResult.reformatData(data);
                }else{
                    data = data.data;
                }
                this.totalObject = data.total ? parseInt(data.total) : 0;
                thisCpn.loadingData = false;
                thisCpn.tableColumns = thisCpn.getTableColumns(
                    data.columns
                );
                let resData = data.listObject ? data.listObject : []
                if(lazyLoad){
                    resData.forEach(function(e){
                        thisCpn.data.push(e)
                    })
                    // thisCpn.data.concat(resData)
                }else{
                    thisCpn.data = resData;
                }
            }
            this.prepareFilterAndCallApi(columns , cache , applyFilter, handler);
        },
        /**
         * Lấy ra cấu hình cho việc sort
         */
        prepareFilterAndCallApi(columns = false, cache = false, applyFilter = false, success, configs = {}){
            if(Object.keys(this.defaultData.listObject).length > 0){
                success({data:this.defaultData});
                return;
            }
            let url = this.getDataUrl;
			let method = this.apiMethod;
            if (url != "") {
                let thisCpn = this;
                thisCpn.loadingData = true;
                // let options = this.getOptionForGetList(configs, columns);
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
                tableFilter.allColumnInTable = this.tableColumns;
                configs.emptyOption = emptyOption;

                if(this.customDataForApi){
                    configs.customDataForApi = this.customDataForApi;
                }
				getDataFromConfig(url, configs, columns, tableFilter, success, method, header);
            }
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
        resetHiddenColumns() {
            let hiddenColumns = {};
            this.tableColumns.forEach((col, idx) => {
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
        /**
         * Lấy cấu hình các cột của table
         * @param {array} columns mảng các cột ban đầu
         * @param {Boolean} forcedReOrder có phải bắt buộc sắp xếp lại thứ tự các cột hay ko
         */
        getTableColumns(columns, forcedReOrder = false) {
            let savedOrderCols = this.savedTableDisplayConfig;
            let colMap = {};
            let self = this;
            if (forcedReOrder) {
                for (let item of columns) {
                    colMap[item.data] = item;
                }
            } else {
                for (let item of columns) {
                    colMap[item.name] = {
                        data: item.name,
                        type: item.type, // lưu ý khi loại dữ liệu của cột là number (cần format) và dạng html
                        editor: false,
                        symperFixed: false,
                        symperHide: false,
                        columnTitle: item.title,
                        noFilter: item.noFilter ? item.noFilter : false
                    };
                    // Render image - icon
                    if (item.type === 'image') {
                        colMap[item.name].type = 'handsontable';
                        colMap[item.name].renderer = this.imgRenderer;
                    } else if (item.type === 'status') {
                        colMap[item.name].type = 'handsontable';
                        colMap[item.name].renderer = this.statusRenderer;
                    } else if (item.type === 'checkbox') {
                        colMap[item.name].checkedTemplate = item.checkedValue != undefined ? item.checkedValue : 1;
                        colMap[item.name].uncheckedTemplate = item.uncheckedValue != undefined ? item.uncheckedValue : 0;
                    } else if(item.type === 'numeric' && item.hasFormat != undefined) {
                        colMap[item.name].numericFormat = {
                            pattern: item.pattern != undefined && !!item.pattern ? item.pattern : "0,0"
                        };
                    } else if((item.type.indexOf('date') === 0)) {
                        if (item.hasFormat != undefined) {
                            colMap[item.name].dateFormat = item.pattern != undefined && !!item.pattern ? item.pattern : "MM/DD/YYYY";
                            colMap[item.name].correctFormat = true;
                        }
                        colMap[item.name].renderer = this.dateRenderer;
                    }
                    
                    if(item.renderer){
                        colMap[item.name].renderer = item.renderer;
                    }
                    
                    if(!colMap[item.name].renderer){
                        colMap[item.name].renderer = function (instance, td, row, col, prop, value, cellProperties) {
                            Handsontable.dom.empty(td);
                            td.innerHTML = value ;
                            return td;
                        }
                    }

                    let renderer = colMap[item.name].renderer;
                    colMap[item.name].renderer = function(instance, td, row, col, prop, value, cellProperties){
                        td = renderer(instance, td, row, col, prop, value, cellProperties);
                        if(self.focusingRowIndex > 0 && row == self.focusingRowIndex ){
                            $(td).addClass('symper-list-item-current-row-sbs');
                        }
                        return td;
                    }
                }
            }
            if (savedOrderCols.length > 0) {
                let orderedCols = [];
                let noneOrderedCols = [];
                for (let col of savedOrderCols) {
                    if(colMap[col.data]){
                        colMap[col.data].checkedOrder = true;
                        if (colMap[col.data]) {
                            colMap[col.data].symperFixed = col.symperFixed;
                            colMap[col.data].symperHide = col.symperHide;
                            orderedCols.push(colMap[col.data]);
                        } else {
                            noneOrderedCols.push(colMap[col.data]);
                        }
                    }
                }

                for(let colName in colMap){
                    if(!colMap[colName].checkedOrder){
                        noneOrderedCols.push(colMap[colName]);
                    }
                }
                return orderedCols.concat(noneOrderedCols);
            } else {
                return Object.values(colMap);
            }
        },
        configColumnDisplay(type, idx) {
            let column = this.tableColumns[idx];
            column[type] = !column[type];
            let isValue = column[type];
            if (type == "symperHide") {
                this.resetHiddenColumns();
            } else {
                this.reOrderFixedCols();
            }
        },
        reOrderFixedCols() {
            let fixedCols = [];
            let noneFixedCols = [];
            for (let col of this.tableColumns) {
                if (col.symperFixed) {
                    fixedCols.push(col);
                } else {
                    noneFixedCols.push(col);
                }
            }
            if (fixedCols.length > 0) {
                this.tableColumns = fixedCols.concat(noneFixedCols);
            }
            this.fixedColumnsCount = fixedCols.length;
            setTimeout(
                thisCpn => {
                    thisCpn.savedTableDisplayConfig = thisCpn.tableColumns;
                },
                1000,
                this
            );
        },
        openTableDisplayConfigPanel() {
            this.tableDisplayConfig.show = !this.tableDisplayConfig.show;
        },
        showTableDropdownMenu(x, y, colName) {
            var windowWidth = $(window).width()/1.1;
            if(x > windowWidth){
                x -= 190;
            }
            let filterDom = $(this.$refs.tableFilter.$el);
            filterDom.css("left", x + "px").css("top", y + 10 + "px");
            this.$refs.dataTable.hotInstance.deselectCell();
            this.$refs.tableFilter.show();
            let colFilter = this.tableFilter.allColumn[colName];
            if (!colFilter) {
                colFilter = getDefaultFilterConfig();
                this.$set(this.tableFilter.allColumn, colName, colFilter);
            }
            for (let col of this.tableColumns) {
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
        saveDataAction() {
            this.closeactionPanel();
            this.$emit("save-item", {});
        },
        closeactionPanel() {
            this.actionPanel = false;
        },
        openactionPanel() {
            this.actionPanel = true;
        },
        addItem() {
            if(this.useActionPanel){
                this.actionPanel = true;
                // Phát sự kiện khi click vào nút thêm mới
                this.$emit("after-open-add-panel", {});
            }
            this.$emit('on-add-item-clicked', {});
        },
        removeItem() {
            // Phát sự kiện khi xóa danh sách các item trong list
            this.$emit("remove-item", []);
        },
        refreshList(){
			// Phát sự kiện khi click vào refresh dữ liệu
			this.allRowChecked = {}
			this.$emit('after-selected-row', this.allRowChecked)
            this.getData();
            this.$emit("refresh-list", {});
        },
        filterList() {
            // Phát sự kiện khi có filter danh sách
            this.$emit("filter-list", {});
        },
        searchAll() {
            // Phát sự kiện khi người dùng gõ vào ô tìm kiếm
            this.$emit("search-all", {});
        },
        changePageSize(vl){
            this.pageSize = vl.pageSize
            this.getData();
            // Phát sự kiện khi người dùng thay đổi số bản ghi ở mỗi page
            this.$emit("change-page-size", vl.pageSize);
        },
        changePage(vl){
            this.page = vl.page
            this.getData();
            this.$emit("change-page", vl.page);
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
        // hoangnd: thêm cột checkbox
        addCheckBoxColumn(){
            this.hasColumnsChecked = true;
            this.tableColumns.unshift({name:"checkbox_select_item",data:"checkbox_select_item",title:"Chọn",type:"checkbox"});
		},
		// dungna doi hasColumnsChecked = true
		addColumnsChecked(){
			this.hasColumnsChecked = true
		},
        removeCheckBoxColumn(){
            this.hasColumnsChecked = false;
            this.tableColumns.shift();
        },
        // Hàm trả về các dòng được selected
        getAllRowChecked(){
            return this.allRowChecked;
        },
        removeAllRowChecked(){
            this.allRowChecked = []
        },
        isShowCheckedRow(){
            return this.hasColumnsChecked
        },
        /**
         * Đưa dòng được checked vào biến allRowChecked
         * nêu uncheck thì xóa đi
         */
        handleAfterChangeDataTable(change, source) {
            if(source == 'edit' && this.hasColumnsChecked){
                for (let index = 0; index < change.length; index++) {
                    let rowChange = change[index];
                    if(change[index][3] == true){
                        this.allRowChecked[change[index][0]] = this.data[change[index][0]]
                    }else{
                        delete this.allRowChecked[change[index][0]];
                    }
                }
                
                this.$emit('after-selected-row',this.allRowChecked)
            }
        },
        isShowSidebar(){
            return this.alwaysShowActionPanel
        }
        
    },
    components: {
        HotTable,
        // "form-tpl": FormTpl,
        VDialog,
        VNavigationDrawer,
        TableFilter,
        Pagination,
        "symper-drag-panel": SymperDragPanel,
        "display-config": DisplayConfig
    }
};
</script>
<style scoped>
	.list-item-common-symper >>> .v-input__control{
		background-color: #ffffff !important;
	}
    .group-action-list >>> .v-list-item {
        min-height:unset;
        height:30px;
        margin:2px 8px;
        padding: 0;
        overflow: hidden;
    }
    .group-action-list >>> .v-list-item .v-list-item__title{
        font-size: 13px;
    }
    .group-action-list >>> .v-list-item__icon  {
        margin: 18px 2px 0 0;
        font-size: 13px;
        min-height:unset;
    }
    .group-action-list >>> .v-list-item__icon i{
        font-size: 20px;
    }
    .group-action-list >>> .v-list-item i{
        margin-top:-12px;
    }
</style>
<style>
.ht_clone_top.handsontable {
    z-index: 6;
}
.handsontable .wtBorder.current {
    z-index: 5;
}
.symper-custom-table.clip-text .ht_master.handsontable .htCore td,
.symper-custom-table.clip-text .ht_clone_left.handsontable .htCore td {
    text-overflow: ellipsis !important;
    white-space: nowrap !important;
}
.symper-custom-table.loosen-row .ht_master.handsontable .htCore td,
.symper-custom-table.loosen-row .htgetDataUrl_clone_left.handsontable .htCore td {
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
.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}
.flip-list-move {
    transition: transform 0.5s;
}
.no-move {
    transition: transform 0s;
}
.column-drag-pos {
    cursor: move;
    border-bottom: 1px solid #d0d0d0;
    background-color: white;
    padding-left: 8px;
}
.list-group {
    border: 1px solid #d0d0d0;
    border-radius: 3px;
}
i.applied-filter {
    color: #f58634;
    background-color: #ffdfc8;
}
.symper-list-item .ht_clone_left.handsontable table.htCore {
    border-right: 4px solid #f0f0f0;
}

.symper-list-item .handsontable th:nth-child(2) {
    border-left-width: 0px !important;
}

.symper-list-item .ht_clone_top_left_corner thead tr th:nth-last-child(2)  {
    border-right-width: 0px !important;
}
.symper-list-item .handsontable td,
.symper-list-item .handsontable th {
    color: #212529 !important;
    border-color: #bbb;
    border-right: 0;
}
.ht_clone_left {
    z-index: 8;
}
</style>


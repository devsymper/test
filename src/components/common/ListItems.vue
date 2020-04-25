<template>
    <div class="ml-2 w-100 pr-3">
        <div :style="{width:contentWidth, display: 'inline-block'}">
            <v-row no-gutters class="pb-2" ref="topBar">
                <v-col>
                    <span class="title float-left">{{pageTitle}}</span>
                    <div class="float-right overline">
                        <v-text-field
                            v-model="searchKey"
                            class="d-inline-block mr-2 sym-small-size"
                            single-line
                            append-icon="mdi-magnify"
                            outlined
                            dense
                            label="Search"
                            :placeholder="$t('common.search')"
                        ></v-text-field>
                        <v-btn
                            depressed
                            small
                            :loading="loadingRefresh"
                            :disabled="loadingRefresh"
                            class="mr-2"
                            @click="addItem"
                        >
                            <v-icon left dark>mdi-plus</v-icon>
                            {{$t('common.add')}}
                        </v-btn>
                        <v-btn
                            depressed
                            small
                            :loading="loadingRefresh"
                            :disabled="loadingRefresh"
                            class="mr-2"
                            @click="refreshList"
                        >
                            <v-icon left dark>mdi-refresh</v-icon>
                            {{$t('common.refresh')}}
                        </v-btn>
                        <v-btn
                            depressed
                            small
                            :loading="loadingExportExcel"
                            class="mr-2"
                            :disabled="loadingExportExcel"
                        >
                            <v-icon left dark>mdi-microsoft-excel</v-icon>
                            {{$t('common.export_excel')}}
                        </v-btn>
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-btn
                                    @click="openTableDisplayConfigPanel"
                                    depressed
                                    small
                                    v-on="on"
                                >
                                    <v-icon left dark class="ml-1 mr-0">mdi-table-cog</v-icon>
                                </v-btn>
                            </template>
                            <span>{{ $t('common.list_config') }}</span>
                        </v-tooltip>
                    </div>
                </v-col>
            </v-row>
            <v-row no-gutters>
                <v-col
                    :class="{
                            'fs-13 symper-custom-table': true,
                            'clip-text' : tableDisplayConfig.wrapTextMode == 1,
                            'loosen-row':  tableDisplayConfig.densityMode == 0,
                            'medium-row':  tableDisplayConfig.densityMode == 1,
                            'compact-row':  tableDisplayConfig.densityMode == 2,
                        }"
                >
                    <hot-table
                        :height="tableHeight"
                        :settings="tableSettings"
                        :data="data"
                        :columns="tableColumns"
                        :contextMenu="itemContextMenu"
                        :colHeaders="colHeaders"
                        :hiddenColumns="{
                            columns: tableDisplayConfig.hiddenColumns
                        }"
                        ref="dataTable"
                        :fixedColumnsLeft="fixedColumnsCount"
                    ></hot-table>
                </v-col>
            </v-row>
            <v-row no-gutters ref="bottomBar" class="pt-5">
                <v-col>
                    <v-select
                        class="d-inline-block mr-5"
                        style="width:70px"
                        v-model="pageSize"
                        :items="pageSizeOptions"
                        label="Số bản ghi mỗi trang"
                        dense
                        flat
                        @change="changePageSize"
                    ></v-select>
                    <v-pagination
                        style="width:200px"
                        class="sym-small-size ml-10"
                        v-model="page"
                        :length="totalPage"
                        next-icon="mdi-chevron-right"
                        prev-icon="mdi-chevron-left"
                        :page="page"
                        :total-visible="6"
                    ></v-pagination>
                </v-col>
            </v-row>
        </div>

        <component
            :is="actionPanelWrapper"
            :width="actionPanelWidth"
            :max-width="actionPanelWidth"
            v-model="actionPanel"
            class="pa-3"
            absolute
            right
            v-if="actionPanelType != 'drag'"
            :temporary="actionPanelType == 'temporary'"
        >
            <slot name="right-panel-content" :itemData="currentItemData">
                <v-card flat>
                    <v-card-title class="pa-0 pl-2" primary-title>{{itemActionTitle}}</v-card-title>
                    <v-card-text>
                        <form-tpl :allInputs="itemInputs"></form-tpl>
                    </v-card-text>

                    <v-divider></v-divider>
                </v-card>
            </slot>
        </component>
        <div
            ref="symperDragPanel"
            v-else
            v-show="actionPanel"
            class="symper-drag-panel elevation-12"
            :style="{
                width:actionPanelWidth+'px',
                'max-width':actionPanelWidth,
                height: '400px'
            }"
        >
            <div class="pa-2 symper-drag-panel-header" style="height:30px">
                <v-icon
                    @click="actionPanel = false"
                    class="close-btn float-right"
                    style="font-size:16px;position: relative;top: -3px;"
                >mdi-close</v-icon>
            </div>
            <div class="symper-drag-panel-body px-2 pb-2">
                <slot name="right-panel-content">
                    <v-card flat>
                        <v-card-title class="pa-0 pl-2" primary-title>{{itemActionTitle}}</v-card-title>
                        <v-card-text>
                            <form-tpl :allInputs="itemInputs"></form-tpl>
                        </v-card-text>

                        <v-divider></v-divider>
                    </v-card>
                </slot>
            </div>
        </div>

        <v-navigation-drawer
            v-model="tableDisplayConfig.show"
            absolute
            class="pa-2 pl-4"
            right
            :style="{width: tableDisplayConfig.width+'px'}"
        >
            <div class="title">
                <div>
                    {{$t('common.list_config')}}
                    <v-icon
                        class="close-btn float-right"
                        @click="tableDisplayConfig.show = false"
                    >mdi-close</v-icon>
                </div>
                <div class="pb-2">
                    <div class="subtitle-2">{{$t('table.wrap_text_mode')}}</div>
                    <div>
                        <v-btn-toggle
                            dense
                            v-model="tableDisplayConfig.wrapTextMode"
                            mandatory
                            tile
                            color="amber darken-4"
                            group
                        >
                            <v-btn small>{{$t('table.wrap_tex_mode.clip')}}</v-btn>
                            <v-btn small>{{$t('table.wrap_tex_mode.wrap')}}</v-btn>
                        </v-btn-toggle>
                    </div>
                </div>
                <div class="pb-2">
                    <div class="subtitle-2">{{$t('table.display_density')}}</div>
                    <div>
                        <v-btn-toggle
                            dense
                            v-model="tableDisplayConfig.densityMode"
                            mandatory
                            tile
                            color="amber darken-4"
                            group
                        >
                            <v-btn small>{{$t('table.display_density_mode.loosen')}}</v-btn>
                            <v-btn small>{{$t('table.display_density_mode.medium')}}</v-btn>
                            <v-btn small>{{$t('table.display_density_mode.compact')}}</v-btn>
                        </v-btn-toggle>
                    </div>
                </div>
                <div class="pb-2">
                    <div class="subtitle-2">{{$t('table.column_config')}}</div>
                    <draggable
                        class="list-group"
                        tag="div"
                        v-model="tableColumns"
                        v-bind="tableDisplayConfig.dragOptions"
                        @start="tableDisplayConfig.drag = true"
                        @end="handleStopDragColumn"
                    >
                        <transition-group
                            type="transition"
                            :name="!tableDisplayConfig.drag ? 'flip-list' : null"
                        >
                            <div
                                class="fs-13 column-drag-pos"
                                v-for="(column,idx) in tableColumns"
                                :key="column.data"
                            >
                                <v-icon size="18" class="mr-2">{{getDataTypeIcon(column.type)}}</v-icon>
                                <span class="fw-400">{{$t(joinPrefixAndTile(column.columnTitle))}}</span>
                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                        <v-btn
                                            @click="configColumnDisplay('symperFixed',column,idx)"
                                            class="float-right"
                                            small
                                            color="grey"
                                            text
                                            v-on="on"
                                            icon
                                        >
                                            <v-icon
                                                size="18"
                                            >{{column.symperFixed ? 'mdi-roller-skate-off': 'mdi-roller-skate'}}</v-icon>
                                        </v-btn>
                                    </template>
                                    <span>{{ column.symperFixed ? $t('table.unfreeze_column') : $t('table.freeze_column') }}</span>
                                </v-tooltip>
                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                        <v-btn
                                            v-on="on"
                                            class="float-right"
                                            small
                                            text
                                            icon
                                            color="grey"
                                            @click="configColumnDisplay('symperHide',column, idx)"
                                        >
                                            <v-icon
                                                size="18"
                                            >{{column.symperHide ? 'mdi-eye-off-outline': 'mdi-eye-outline'}}</v-icon>
                                        </v-btn>
                                    </template>
                                    <span
                                        class="fw-400"
                                    >{{ column.symperHide ? $t('table.show_column') : $t('table.hide_column') }}</span>
                                </v-tooltip>
                            </div>
                        </transition-group>
                    </draggable>
                </div>
            </div>
            <template v-slot:append>
                <div class="w-100 pt-2">
                    <v-btn
                        :loading="savingConfigs"
                        small
                        color="primary"
                        @click="saveTableDisplayConfig()"
                        class="float-right"
                    >
                        <v-icon class="mr-2">mdi-content-save-outline</v-icon>
                        {{$t('common.save')}}
                    </v-btn>
                </div>
            </template>
        </v-navigation-drawer>
        <table-filter
            ref="tableFilter"
            :columnFilter="tableFilter.currentColumn.colFilter"
            @apply-filter-value="applyFilter"
        ></table-filter>
    </div>
</template>

<script>
require("@/assets/css/handsontable.min.css");
import { HotTable } from "@handsontable/vue";
import { util } from "./../../plugins/util.js";
import FormTpl from "./FormTpl.vue";
import { VDialog, VNavigationDrawer } from "vuetify/lib";
import TableFilter from "./customTable/TableFilter.vue";
import { appConfigs } from "./../../configs.js";
import draggable from "vuedraggable";
import { getDefaultFilterConfig } from "./../common/customTable/defaultFilterConfig.js";
import Api from "./../../api/api.js";
import { userApi } from "./../../api/user.js";

var apiObj = new Api("");

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

window.dragElement = function(elmnt) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById(elmnt.id + "header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(
            elmnt.id + "header"
        ).onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }

    function dragMouseDown(e) {
        if (
            $(e.target).hasClass("symper-drag-panel-header") ||
            $(e.target).parents(".symper-drag-panel-header").length > 0
        ) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = elmnt.offsetTop - pos2 + "px";
        elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    }

    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
};

export default {
    name: "SymperListItem",
    watch: {
        page(newVl) {
            // Phát sự kiện thay đổi trang đang xem
            this.getData();
            this.$emit("change-page", newVl);
        },
        actionPanel() {
            if (this.actionPanel == true) {
                this.$emit("open-panel");
                if (this.actionPanelType == "drag") {
                    setTimeout(
                        thisCpn => {
                            dragElement(thisCpn.$refs.symperDragPanel);
                        },
                        500,
                        this
                    );
                }
            }
        }
    },
    data() {
        return {
            savingConfigs: false, // có đang lưu cấu hình của showlist hay không
            // các cấu hình cho việc hiển thị và giá trị của panel cấu hình hiển thị của bảng
            tableDisplayConfig: {
                show: true, // có hiển thị panel cấu hình ko
                width: 300, // Chiều rộng của panel cấu hình,
                wrapTextMode: 0,
                densityMode: 2,
                hiddenColumns: [],
                dragOptions: {
                    animation: 200,
                    group: "display-column-drag",
                    disabled: false,
                    ghostClass: "ghost-item"
                },
                drag: false
            },
            fixedColumnsCount: 0, // Số lượng cột fix ở bên trái
            tableColumns: [],
            actionPanel: false, // có hiển thị action pannel (create, detail, edit) hay không
            pageSizeOptions: [20, 50, 100], // các lựa chọn cho số lượng bản ghi hiển thị cho mỗi trang
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
                manualRowResize: true,
                stretchH: "all",
                licenseKey: "non-commercial-and-evaluation",
                beforeDropdownMenuShow: function(dropdownMenu) {
                    console.log(dropdownMenu, "beforeDropdownMenuShow");
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
            savedTableDisplayConfig: [] // cấu hình hiển thị của table đã được lueu trong db
        };
    },
    created() {
        let thisCpn = this;
        this.$evtBus.$on("change-user-locale", locale => {
            if (thisCpn.$refs.dataTable) {
                thisCpn.$refs.dataTable.hotInstance.render();
            }
        });
        this.getData();
        this.restoreTableDisplayConfig();
    },
    props: {
        currentItemData: {
            type: Object,
            default() {
                return {};
            }
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
            type: Array,
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
        }
    },
    mounted() {},
    computed: {
        actionTitle() {},
        contentWidth() {
            if (this.actionPanel && this.actionPanelType == "elastic") {
                return "calc(100% - " + this.actionPanelWidth + "px)";
            } else if (this.tableDisplayConfig.show) {
                return "calc(100% - " + this.tableDisplayConfig.width + "px)";
            } else {
                return "100%";
            }
        },
        itemContextMenu() {
            let thisCpn = this;
            let contextMenu = {
                callback: function(key, selection, clickEvent) {
                    let col = selection[0].start.col;
                    let row = selection[0].start.row;
                    let rowData = thisCpn.data[row];
                    let colName = Object.keys(rowData)[col];

                    /**
                     * Phát sự kiện khi có một hành động đối với một row, hoặc cell.
                     * tham số thứ nhất: row ( index của row đang được chọn)
                     * tham số thứ hai: colName ( Tên của cột (key trong một row) )
                     */
                    thisCpn.$emit("context-selection-" + key, row, colName);
                    // Datnt
                    // Callback for context menu item
                    let menuItem = thisCpn.tableContextMenu.filter(menu => {
                        return menu.name == key;
                    });
                    if (
                        menuItem.length &&
                        menuItem[0].hasOwnProperty("callback")
                    ) {
                        menuItem[0].callback(rowData, res => {
                            if (res.status === 200) {
                                thisCpn.getData();
                            }
                        });
                    }
                    if (key == "remove") {
                    } else if (key == "edit" || key == "view") {
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
            for (let item of this.tableContextMenu) {
                contextMenu.items[item.name] = {
                    name: item.text
                };
            }

            return contextMenu;
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
                    util.getComponentSize(ref.bottomBar).h;
            }
            return tbHeight - 50;
        },
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
                return `<span>
                            <span class="font-weight-medium">
                                ${thisCpn.$t(prefix + colTitles[col])}
                            </span>
                            <span class="float-right symper-filter-button">
                                <i col-name="${colName}" onclick="tableDropdownClickHandle(this, event)" class="grey-hover mdi mdi-filter-variant symper-table-dropdown-button ${markFilter}"></i>
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
            return mapType[this.actionPanelType]
                ? mapType[this.actionPanelType]
                : mapType["temporary"];
        }
    },
    methods: {
        joinPrefixAndTile(title) {
            let prefix = this.headerPrefixKeypath;
            prefix =
                prefix[prefix.length - 1] == "." || prefix == ""
                    ? prefix
                    : prefix + ".";
            return prefix + title;
        },
        /**
         * Lưu lại cấu hình hiển thị của table
         */
        saveTableDisplayConfig() {
            this.savingConfigs = true;
            let thisCpn = this;
            let configs = {
                wrapTextMode: this.tableDisplayConfig.wrapTextMode,
                densityMode: this.tableDisplayConfig.densityMode,
                columns: []
            };
            for (let col of this.tableColumns) {
                configs.columns.push({
                    data: col.data,
                    symperFixed: col.symperFixed,
                    symperHide: col.symperHide
                });
            }

            configs = JSON.stringify(configs);
            userApi
                .saveUserViewConfig("showList", this.$route.name, configs)
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
            // userApi.getUserViewConfig(this.$route.name, 'showList').then(()=>{
            //     this.tableDisplayConfig.wrapTextMode =  savedConfigs.wrapTextMode;
            //     this.tableDisplayConfig.densityMode =  savedConfigs.densityMode;
            //     this.savedTableDisplayConfig = savedConfigs.columns;
            //     if(this.tableColumns.length > 0){
            //         this.tableColumns = this.getTableColumns(this.tableColumns, true);
            //         this.handleStopDragColumn();
            //     }
            // }).catch((err) => {
            //     console.warn(err, 'error when get user view config');
            //     thisCpn.$snotify({
            //         type: 'error',
            //         'title': thisCpn.$t('table.error.get_config'),
            //     });
            // });
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
                    filter.conditionFilter.items[0].type == "none"
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
            let colName = this.tableFilter.currentColumn.name;
            this.$set(this.tableFilter.allColumn, colName, filter);
            let hasFilter = this.checkColumnHasFilter(colName, filter);

            this.filteredColumns[colName] = hasFilter;
            let icon = $(this.$el).find(
                ".symper-table-dropdown-button[col-name=" + colName + "]"
            );
            if (hasFilter || source == "clear-filter") {
                this.getData();
                if (source != "clear-filter") {
                    icon.addClass("applied-filter");
                }
            } else {
                this.$delete(this.tableFilter.allColumn, colName);
                icon.removeClass("applied-filter");
            }
        },
        /**
         * Lấy data từ server
         * @param {Array} columns chứa thông tin của các cột cần trả về.
         * @param {Boolean} cache có ưu tiên dữ liệu từ cache hay ko
         *
         */
        getData(columns = false, cache = false) {
            let url = this.getDataUrl;
            if (url != "") {
                let thisCpn = this;
                thisCpn.loadingData = true;
                let options = {
                    filter: this.getFilterConfigs(),
                    sort: this.getSortConfigs(),
                    search: this.searchKey,
                    page: this.page,
                    pageSize: this.pageSize,
                    columns: columns ? columns : []
                };
                apiObj
                    .callApi("GET", url, options, {}, {})
                    .then(data => {
                        data = data.data;
                        let total = data.total ? data.total : 0;
                        let pageSize = thisCpn.pageSize;
                        thisCpn.totalPage =
                            total % pageSize > 0
                                ? Math.floor(total / pageSize) + 1
                                : Math.floor(total / pageSize);
                        if (thisCpn.page > thisCpn.totalPage) {
                            thisCpn.page = 1;
                        }
                        thisCpn.loadingData = false;
                        thisCpn.tableColumns = thisCpn.getTableColumns(
                            data.columns
                        );
                        thisCpn.data = data.listObject;
                        thisCpn.handleStopDragColumn();
                    })
                    .catch(err => {
                        console.warn(err);
                        thisCpn.$snotify({
                            type: "error",
                            title: thisCpn.$t("table.error.cannot_get_data"),
                            text: ""
                        });
                    });
            }
        },
        /**
         * Lấy ra cấu hình cho việc sort
         */
        getSortConfigs() {
            let columnMap = this.tableColumns.reduce((map, item) => {
                map[item.data] = item;
                return map;
            }, {});
            let sort = [];
            for (let colName in this.tableFilter.allColumn) {
                let filter = this.tableFilter.allColumn[colName];
                if (filter.sort != "") {
                    sort.push({
                        column: {
                            name: columnMap[colName].data,
                            title: columnMap[colName].columnTitle,
                            type: columnMap[colName].type
                        },
                        type: filter.sort
                    });
                }
            }
            return sort;
        },
        /**
         * Chuyển đổi cấu hình filter của component này sang dạng api hiểu được
         */
        getFilterConfigs() {
            let configs = [];
            for (let colName in this.tableFilter.allColumn) {
                let filter = this.tableFilter.allColumn[colName];
                let condition = filter.conditionFilter;
                if (condition.items[0].type != "none") {
                    let option = {
                        column: colName, // tên cột cần filter
                        operation: condition.conjunction,
                        conditions: [
                            {
                                name: condition.items[0].type,
                                args: [condition.items[0].value]
                            }
                        ]
                    };
                    if (condition.items[1].type != "none") {
                        option.conditions.push({
                            name: condition.items[1].type,
                            args: [condition.items[1].value]
                        });
                    }
                    configs.push(option);
                }
            }
            return configs;
        },
        handleStopDragColumn() {
            this.tableDisplayConfig.drag = false;
            this.resetHiddenColumns();
            this.reOrderFixedCols();
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
            this.$set(this.tableDisplayConfig, "hiddenColumns", hiddenColumns);
        },
        /**
         * Lấy cấu hình các cột của table
         * @param {array} columns mảng các cột ban đầu
         * @param {Boolean} forcedReOrder có phải bắt buộc sắp xếp lại thứ tự các cột hay ko
         */
        getTableColumns(columns, forcedReOrder = false) {
            let savedOrderCols = this.savedTableDisplayConfig;
            let colMap = {};

            if (forcedReOrder) {
                for (let item of columns) {
                    colMap[item.data] = item;
                }
            } else {
                for (let item of columns) {
                    colMap[item.name] = {
                        data: item.name,
                        type: item.type,
                        editor: false,
                        symperFixed: false,
                        symperHide: false,
                        columnTitle: item.title
                    };
                }
            }

            if (savedOrderCols.length > 0) {
                let orderedCols = [];
                let noneOrderedCols = [];
                for (let col of savedOrderCols) {
                    if (colMap[col.data]) {
                        colMap[col.data].symperFixed = col.symperFixed;
                        colMap[col.data].symperHide = col.symperHide;
                        orderedCols.push(colMap[col.data]);
                    } else {
                        noneOrderedCols.push(colMap[col.data]);
                    }
                }
                return orderedCols.concat(noneOrderedCols);
            } else {
                return Object.values(colMap);
            }
        },
        configColumnDisplay(type, column, idx) {
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
        getDataTypeIcon(type) {
            return appConfigs.dataTypeIcon[type];
        },
        openTableDisplayConfigPanel() {
            this.tableDisplayConfig.show = !this.tableDisplayConfig.show;
        },
        showTableDropdownMenu(x, y, colName) {
            let filterDom = $(this.$refs.tableFilter.$el);
            filterDom.css("left", x + "px").css("top", y + 10 + "px");
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
            $("#symper-platform-app").append(filterDom[0]);
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
            this.actionPanel = true;
            // Phát sự kiện khi click vào nút thêm mới
            this.$emit("after-open-add-panel", {});
        },
        removeItem() {
            // Phát sự kiện khi xóa danh sách các item trong list
            this.$emit("remove-item", []);
        },
        refreshList() {
            // Phát sự kiện khi click vào refresh dữ liệu
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
        changePageSize(vl) {
            this.getData();
            // Phát sự kiện khi người dùng thay đổi số bản ghi ở mỗi page
            this.$emit("change-page-size", vl);
        }
    },

    components: {
        HotTable,
        "form-tpl": FormTpl,
        VDialog,
        VNavigationDrawer,
        TableFilter,
        draggable
    }
};
</script>

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
.symper-custom-table.loosen-row .ht_clone_left.handsontable .htCore td {
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

.column-drag-pos[draggable="true"] {
    background-color: #ffe6d2;
}

.list-group {
    border: 1px solid #d0d0d0;
    border-radius: 3px;
}

i.applied-filter {
    color: #f58634;
    background-color: #ffdfc8;
}

.ht_clone_left.handsontable table.htCore {
    border-right: 4px solid #f0f0f0;
}

.handsontable td,
.handsontable th {
    color: #212529 !important;
    border-color: #bbb;
    border-right: 0;
}

.symper-drag-panel {
    position: fixed;
    top: 100px;
    left: 300px;
    z-index: 500;
    background-color: white;
    border-radius: 3px;
}

.symper-drag-panel .symper-drag-panel-header {
    cursor: move;
    background-color: #efefef;
}
</style>

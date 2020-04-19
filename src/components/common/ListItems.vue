<template>
    <div class="ml-2 w-100">
        <div :style="{width:contentWidth, display: 'inline-block'}">
            <v-row no-gutters class="pb-2" ref="topBar">
                <v-col>
                    <span class="title float-left">{{pageTitle}}</span>
                    <div class="float-right overline">
                        <v-text-field
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
            :temporary="actionPanelType == 'temporary'"
        >
            <slot name="right-panel-content">
                <v-card flat>
                    <v-card-title class="pa-0 pl-2" primary-title>{{itemActionTitle}}</v-card-title>
                    <v-card-text>
                        <form-tpl :allInputs="itemInputs"></form-tpl>
                    </v-card-text>

                    <v-divider></v-divider>
                </v-card>
            </slot>
        </component>

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
                                <span class="fw-400">{{column.columnTitle}}</span>
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
                    <v-btn small color="primary" class="float-right">
                        <v-icon class="mr-2">mdi-content-save-outline</v-icon>
                        {{$t('common.save')}}
                    </v-btn>
                </div>
            </template>
        </v-navigation-drawer>
        <table-filter ref="tableFilter" :columnFilter="tableFilter.currentColumn"></table-filter>
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
        page(newVl) {
            // Phát sự kiện thay đổi trang đang xem
            this.$emit("change-page", newVl);
        }
    },
    data() {
        return {
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
            tableColumns: this.getTableColumns(),
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
                currentColumn: getDefaultFilterConfig()
            }
        };
    },
    created(){
        let thisCpn = this;
        this.$evtBus.$on('change-user-locale',(locale)=>{
            thisCpn.$refs.dataTable.hotInstance.render();
        });
    },
    props: {
        // Tiêu đề của trang: Danh sách văn bản, danh sách người dùng ...
        pageTitle: {
            type: String,
            default: "Danh sách"
        },
        // Tổng số trang của danh sách này
        totalPage: {
            type: Number,
            default: 0
        },
        // Chiều cao của khung chứa danh sách
        containerHeight: {
            type: Number,
            default: 200
        },
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
        columns: {
            type: Array,
            default() {
                return [];
            }
        },
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
        data: {
            type: Array,
            default() {
                return [];
            }
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
        // Loại hiển thị cho actionPanel - một trong ba loại: modal, temporary, elastic
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

            let colNames = [];
            let colTitles = this.tableColumns.reduce((headers, item) => {
                colNames.push(item.data);
                headers.push(item.columnTitle);
                return headers;
            }, []);

            return function(col) {
                return `<span>
                            <span>
                                ${thisCpn.$t(colTitles[col])}
                            </span>
                            <span class="float-right symper-filter-button">
                                <i col-name="${colNames[col]}" onclick="tableDropdownClickHandle(this, event)" class="grey-hover mdi mdi-filter-variant symper-table-dropdown-button"></i>
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
    watch:{
        actionPanel(){
            if(this.actionPanel == true){
                this.$emit("open-panel");
            }
        }
    },
    methods: {
        handleStopDragColumn() {
            this.tableDisplayConfig.drag = false;
            this.resetHiddenColumns();
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
        getTableColumns() {
            return this.columns.reduce((columns, item) => {
                columns.push({
                    data: item.name,
                    type: item.type,
                    editor: false,
                    symperFixed: false,
                    symperHide: false,
                    columnTitle: item.title
                });
                return columns;
            }, []);
        },
        configColumnDisplay(type, column, idx) {
            column[type] = !column[type];
            let isValue = column[type];
            if (type == "symperHide") {
                this.resetHiddenColumns();
            } else {
            }
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
            this.$set(this.tableFilter, 'currentColumn', colFilter);
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
            // Phát sự kiện khi click vào nút thêm mới
            this.$emit("add-item", {});
        },
        removeItem() {
            // Phát sự kiện khi xóa danh sách các item trong list
            this.$emit("remove-item", []);
        },
        refreshList() {
            // Phát sự kiện khi click vào refresh dữ liệu
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
        changePageSize() {
            // Phát sự kiện khi người dùng thay đổi số bản ghi ở mỗi page
            this.$emit("change-page-size");
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

.symper-custom-table.clip-text .ht_master.handsontable .htCore td {
    text-overflow: ellipsis;
    white-space: nowrap;
}

.symper-custom-table.loosen-row .ht_master.handsontable .htCore td {
    height: 40px;
    line-height: 40px;
}

.symper-custom-table.medium-row .ht_master.handsontable .htCore td {
    height: 30px;
    line-height: 30px;
}

.symper-custom-table.compact-row .ht_master.handsontable .htCore td {
    height: 20px;
    line-height: 20px;
    font-size: 12px;
}

.column-drag-pos {
    cursor: move;
}
</style>
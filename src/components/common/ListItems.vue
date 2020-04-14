<template>
    <div class="ml-2 w-100">
        <v-row no-gutters class="pb-2" :style="{width:contentWidth}" ref="topBar">
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
                        placeholder="Tìm kiếm"
                    ></v-text-field>
                    <v-btn
                        depressed
                        small
                        :loading="loadingRefresh"
                        :disabled="loadingRefresh"
                        class="mr-2"
                    >
                        <v-icon left dark>mdi-plus</v-icon>Thêm
                    </v-btn>
                    <v-btn
                        depressed
                        small
                        :loading="loadingRefresh"
                        :disabled="loadingRefresh"
                        class="mr-2"
                    >
                        <v-icon left dark>mdi-refresh</v-icon>Làm mới
                    </v-btn>
                    <v-btn
                        depressed
                        small
                        :loading="loadingExportExcel"
                        :disabled="loadingExportExcel"
                    >
                        <v-icon left dark>mdi-microsoft-excel</v-icon>Xuất Excel
                    </v-btn>
                </div>
            </v-col>
        </v-row>
        <v-row :style="{width:contentWidth}" no-gutters>
            <v-col class="fs-13">
                <hot-table
                    class="symper-custom-table"
                    :height="tableHeight"
                    :settings="tableSettings"
                    :data="data"
                    :columns="tableColumns"
                    :contextMenu="itemContextMenu"
                    :colHeaders="colHeaders"
                ></hot-table>
            </v-col>
        </v-row>
        <v-row :style="{width:contentWidth}" no-gutters ref="bottomBar" class="pt-5">
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
        <table-filter ref="tableFilter"></table-filter>
    </div>
</template>

<script>
import { HotTable } from "@handsontable/vue";
require("@/assets/css/handsontable.min.css");
import { util } from "./../../plugins/util.js";
import FormTpl from "./FormTpl.vue";
import { VDialog, VNavigationDrawer } from "vuetify/lib";
import TableFilter from "./customTable/TableFilter.vue";

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
    data() {
        return {
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
            tableSettings: { // các setting cho handsontable
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
            filterConfigs: {
                filteringColumnName: '', // Tên cột đang được chọn để 
                columnFilterConfigs: { // cấu hình filter cho tất cả các cột trong danh sách
                    
                }
            }
        };
    },
    computed: {
        actionTitle() {},
        contentWidth() {
            if (this.actionPanel && this.actionPanelType == "elastic") {
                return "calc(100% - " + this.actionPanelWidth + "px)";
            } else {
                return "";
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
        tableColumns() {
            return this.columns.reduce((columns, item) => {
                columns.push({
                    data: item.name,
                    type: item.type,
                    editor: false
                });
                return columns;
            }, []);
        },
        colHeaders() {
            let colNames = [];
            let colTitles = this.columns.reduce((headers, item) => {
                colNames.push(item.name);
                headers.push(item.title);
                return headers;
            }, []);

            return function(col) {
                return `<span>
                            <span>
                                ${colTitles[col]}
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
    methods: {
        showTableDropdownMenu(x, y, colName) {
            let filterDom = $(this.$refs.tableFilter.$el);
            filterDom.css('left',x+'px').css('top',(y+10)+'px');
            this.$refs.tableFilter.show();
            $('#symper-platform-app').append(filterDom[0]);
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
        TableFilter
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
</style>
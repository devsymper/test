<template>
    <div
        :class="{'symper-table-filter-container elevation-8':true, 'd-none':!showTableFilter}"
        @click="handleFocusFilter"
        style="height:400px"
    >
        <div
            @click="selectSortType('asc')"
            :class="{'pa-1 dropdown-item grey-hover': true, 'symper-text-orange' : filterConfigs.sort== 'asc'}"
        >
            <i class="mdi body-1 mdi-sort-alphabetical-descending mr-2"></i>
            <span>Sắp xếp tăng dần</span>
            <i
                class="mdi body-1 mdi-check float-right"
                :class="{'d-none': filterConfigs.sort != 'asc'}"
            ></i>
        </div>
        <div
            @click="selectSortType('desc')"
            :class="{'pa-1 dropdown-item grey-hover': true, 'symper-text-orange' : filterConfigs.sort== 'desc'}"
        >
            <i class="mdi body-1 mdi-sort-alphabetical-ascending mr-2"></i>
            <span>Sắp xếp giảm dần</span>
            <i
                class="mdi body-1 mdi-check float-right"
                :class="{'d-none': filterConfigs.sort != 'desc'}"
            ></i>
        </div>
        <div class="pa-1 dropdown-item grey-hover">
            <i class="mdi body-1 mdi-filter-remove-outline mr-2"></i>
            <span>Xóa bộ lọc</span>
        </div>
        <div class="pa-1 dropdown-item grey-hover">
            <span class="mb-2">Lọc bởi điều kiện</span>
            <v-menu offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn
                        dark
                        v-on="on"
                    >{{listConditionType[filterConfigs.conditionFilter.items[0].type]}}</v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="(text, key) in listConditionType" :key="key">
                        <v-list-item-title>{{ text }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-text-field class="sym-small-size" single-line outlined dense></v-text-field>

            <v-menu offset-y>
                <template v-slot:activator="{ on }">
                    <v-btn
                        dark
                        v-on="on"
                    >{{listConditionType[filterConfigs.conditionFilter.items[1].type]}}</v-btn>
                </template>
                <v-list>
                    <v-list-item v-for="(text, key) in listConditionType" :key="key">
                        <v-list-item-title>{{ text }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-text-field class="sym-small-size" single-line outlined dense></v-text-field>
        </div>
        <div class="pa-1 dropdown-item">
            <v-text-field
                class="sym-small-size"
                single-line
                append-icon="mdi-magnify"
                outlined
                dense
                label="Search"
                ref="filterSearchBox"
                @blur="handleBlurFilter"
                placeholder="Tìm kiếm"
            ></v-text-field>
        </div>
        <div class="pa-1 dropdown-item" :style="{height:'calc(100% - 160px)'}">
            <!-- <perfect-scrollbar> -->
            <v-checkbox
                x-small
                class="sym-small-size pa-0"
                v-model="filterConfigs.selectAll"
                label="Chọn tất cả"
            ></v-checkbox>
            <v-checkbox
                v-for="(item, idx) in listOptions"
                :key="idx"
                x-small
                class="sym-small-size pa-0"
                v-model="item.checked"
                :label="item.value"
            ></v-checkbox>
            <!-- </perfect-scrollbar> -->
        </div>
        <div class="pa-1 dropdown-item">
            <v-btn depressed x-small class="float-right" @click="applyFilter()">Áp dụng</v-btn>
            <v-btn depressed x-small text class="mr-2 float-right" @click="hide()">Thoát</v-btn>
        </div>
    </div>
</template>

<script>
import PerfectScrollbar from "vue2-perfect-scrollbar";
import { util } from "./../../../plugins/util.js";
export default {
    methods: {
        applyFilter() {
            this.$emit("apply-filter-value", this.filterConfigs);
            setTimeout(
                thisCpn => {
                    thisCpn.hide();
                },
                300,
                this
            );
        },
        hide() {
            this.showTableFilter = false;
            this.focusing = false;
        },
        show() {
            this.showTableFilter = true;
            setTimeout(
                thisCpn => {
                    thisCpn.focusSearchBox();
                },
                300,
                this
            );
            this.focusing = true;
        },
        focusSearchBox() {
            $(this.$refs.filterSearchBox.$el)
                .find("input")
                .focus();
        },
        selectSortType(type) {
            this.filterConfigs.sort = type;
            this.applyFilter();
        },
        handleFocusFilter() {
            this.focusSearchBox();
            this.focusing = true;
        },
        handleBlurFilter(evt) {
            this.focusing = false;
            setTimeout(
                thisCpn => {
                    if (!thisCpn.focusing) {
                        thisCpn.hide();
                    }
                },
                300,
                this
            );
        }
    },
    data() {
        return {
            showTableFilter: false,
            focusing: true,
            listConditionType: {
                none: "Không chọn",
                empty: "Rỗng",
                notEmpty: "Không rỗng",
                equal: "Bằng",
                notEqual: "Không bằng",
                begin: "Bắt đầu với",
                end: "Kết thúc với",
                contain: "Chứa",
                notContain: "Không chứa"
            }
        };
    },
    components: {
        PerfectScrollbar: PerfectScrollbar
    },
    props: {
        columnFilter: {
            default() {
                return {
                    sort: "",
                    searchKey: "",
                    selectAll: true,
                    total: 0,
                    valuesIn: {},
                    valuesNotIn: {},
                    clickedSelectAll: true,
                    conditionFilter: {
                        // Các giá trị của lọc theo điều kiện
                        conjunction: "and",
                        items: [
                            {
                                type: "none",
                                value: ""
                            },
                            {
                                type: "none",
                                value: ""
                            }
                        ]
                    }
                };
            }
        },
        listOptions: {
            default() {
                return [
                    {
                        value: "xx",
                        checked: true
                    },
                    {
                        value: "xxc",
                        checked: true
                    },
                    {
                        value: "xxd",
                        checked: true
                    },
                    {
                        value: "xxe",
                        checked: true
                    },
                    {
                        value: "xxeg",
                        checked: true
                    },
                    {
                        value: "xxee",
                        checked: true
                    },
                    {
                        value: "xxee",
                        checked: true
                    }
                ];
            }
        }
    },
    computed: {
        filterConfigs() {
            return util.cloneDeep(this.columnFilter);
        }
    }
};
</script>

<style>
</style>
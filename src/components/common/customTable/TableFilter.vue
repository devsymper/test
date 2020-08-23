<template>
    <div
        :class="{'symper-table-filter-container elevation-8':true, 'd-none':!showTableFilter}"
        style="height:450px"
    >
        <div
            ref="it1"
            @click="selectSortType('asc')"
            :class="{'pb-1 dropdown-item grey-hover': true, 'symper-text-orange' : filterConfigs.sort== 'asc'}"
        >
            <i class="pl-2 mdi body-1 mdi-sort-alphabetical-descending mr-2"></i>
            <span>{{$t('table.filter.sort_asc')}}</span>
            <i
                class="mdi body-1 mdi-check float-right"
                :class="{'d-none': filterConfigs.sort != 'asc'}"
            ></i>
        </div>

        <div
            ref="it2"
            @click="selectSortType('desc')"
            :class="{' pb-1 dropdown-item grey-hover': true, 'symper-text-orange' : filterConfigs.sort== 'desc'}"
        >
            <i class="pl-2 mdi body-1 mdi-sort-alphabetical-ascending mr-2"></i>
            <span>{{$t('table.filter.sort_desc')}}</span>
            <i
                class="pl-2 mdi body-1 mdi-check float-right"
                :class="{'d-none': filterConfigs.sort != 'desc'}"
            ></i>
        </div>

        <div ref="it3" class="pb-1 dropdown-item grey-hover" @click="clearFilter">
            <i class="pl-2 mdi body-1 mdi-filter-remove-outline mr-2"></i>
            <span>{{$t('table.filter.clear_filter')}}</span>
        </div>

        <div ref="it4" class="pb-1 dropdown-item">
            <div class="font-weight-medium">{{$t('table.filter.filter_by_condition')}}</div>
            <v-menu offset-y class="w-100" v-model="typeSelect1">
                <template v-slot:activator="{ on }">
                    <v-btn
                        class="w-100"
                        depressed
                        small
                        v-on="on"
                    >{{listConditionType[colType][filterConfigs.conditionFilter.items[0].type]}}</v-btn>
                </template>
                <v-list dense class="symper-list-condition-type">
                    <v-list-item
                        class="v-list-item--link"
                        v-for="(text, key) in listConditionType[colType]"
                        :key="key"
                    >
                        <v-list-item-title @click.stop="selectFilterCondition(0,key)">{{ text }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-text-field
                class="sym-small-size mt-2"
                v-show="checkDisplayCondition('input1')"
                single-line
                outlined
                dense
                v-model="filterConfigs.conditionFilter.items[0].value"
            ></v-text-field>
            <v-radio-group
                class="sym-small-size pt-0"
                row
                v-show="checkDisplayCondition('conjungtion')"
                v-model="filterConfigs.conditionFilter.conjunction"
            >
                <v-radio value="and" class="mb-0">
                    <template v-slot:label>
                        <strong>AND</strong>
                    </template>
                </v-radio>
                <v-radio value="or">
                    <template v-slot:label>
                        <strong>OR</strong>
                    </template>
                </v-radio>
            </v-radio-group>
            <v-menu offset-y class="w-100" v-model="typeSelect2">
                <template v-slot:activator="{ on }">
                    <v-btn
                        v-show="checkDisplayCondition('type2')"
                        class="w-100"
                        depressed
                        small
                        v-on="on"
                    >{{listConditionType[colType][filterConfigs.conditionFilter.items[1].type]}}</v-btn>
                </template>
                <v-list dense class="symper-list-condition-type">
                    <v-list-item
                        class="v-list-item--link"
                        v-for="(text, key) in listConditionType[colType]"
                        :key="key"
                    >
                        <v-list-item-title @click.stop="selectFilterCondition(1,key)">{{ text }}</v-list-item-title>
                    </v-list-item>
                </v-list>
            </v-menu>
            <v-text-field
                v-show="checkDisplayCondition('input2')"
                class="sym-small-size mt-2"
                single-line
                outlined
                dense
                v-model="filterConfigs.conditionFilter.items[1].value"
            ></v-text-field>
        </div>

        <div ref="it5" class="pt-2 font-weight-medium">{{$t('table.filter.filter_by_value')}}</div>
        <div ref="it6" class="pb-1 dropdown-item">
            <v-text-field
                class="sym-small-size"
                single-line
                append-icon="mdi-magnify"
                outlined
                dense
                label="Search"
                ref="filterSearchBox"
                :v-model="columnFilter.searchKey"
                placeholder="Tìm kiếm"
                @input="handleInputSearch"
            ></v-text-field>
        </div>

        <div class="pb-1 dropdown-item" :style="{height:listSelectItemHeight}">
            <VuePerfectScrollbar :style="{height: listSelectItemHeight}">
                <v-checkbox
                    small
                    class="sym-small-size pa-0"
                    v-model="filterConfigs.clickedSelectAll"
                    label="Chọn tất cả"
                    @click="handleSelectAllChange"
                ></v-checkbox>
                <v-checkbox
                    v-for="(item, idx) in filterConfigs.selectItems"
                    :key="idx"
                    x-small
                    class="sym-small-size pa-0"
                    v-model="item.checked"
                    :label="item.value"
                    @change="handleSelectItemChange(item)"
                ></v-checkbox>
            </VuePerfectScrollbar>
        </div>

        <div class="mt-2 dropdown-item">
            <v-btn
                depressed
                small
                color="primary"
                class="float-right"
                @click="applyFilter()"
            >Áp dụng</v-btn>
            <v-btn depressed small text class="mr-2 float-right" @click="hide()">Thoát</v-btn>
        </div>
    </div>
</template>

<script>
import PerfectScrollbar from "vue2-perfect-scrollbar";
import { util } from "./../../../plugins/util.js";
import { getDefaultFilterConfig } from "./defaultFilterConfig.js";
import Vue from "vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

const textConditions = ["none","empty","not_empty","equal","not_equal","begins_with","ends_with","contains","not_contain","gt","gte","lt","lte"];
const numberConditions = ["none","empty","not_empty","equal","not_equal"];

let conditionMap = {
    // Định nghĩa column handsontable như kiểu text cho các trường custom như image, icon
    handsontable: ["none","empty","not_empty","equal","not_equal","begins_with","ends_with","contains","not_contain"],
    text: ["none","empty","not_empty","equal","not_equal","begins_with","ends_with","contains","not_contain"],
    numeric: ["none","empty","not_empty","equal","not_equal","gt","gte","lt","lte"],
    date:["none","empty","not_empty","equal","not_equal","begins_with","ends_with","contains","not_contain","gt","gte","lt","lte"],
    datetime:["none","empty","not_empty","equal","not_equal","begins_with","ends_with","contains","not_contain","gt","gte","lt","lte"]
};

export default {
    created() {
        let thisCpn = this;
        this.$evtBus.$on("symper-app-wrapper-clicked", evt => {
            if (
                !$(evt.target).hasClass("symper-filter-button") &&
                $(evt.target).parents(".symper-table-filter-container")
                    .length == 0 &&
                $(evt.target).parents(".symper-list-condition-type").length == 0
            ) {
                thisCpn.hide();
            }
        });
        this.$evtBus.$on("change-user-locale", evt => {
            let conds = thisCpn.getConditionType();
            for(let name in conds){
                thisCpn.$set(thisCpn.listConditionType,name,conds[name]);
            }
        });
    },
    methods: {
        handleInputSearch(vl){
            this.$emit('search-autocomplete-items', vl);
        },
        handleSelectItemChange(item){
            if(!item.checked){
                if(this.filterConfigs.selectAll){
                    this.filterConfigs.valuesNotIn[item.value] = true;
                    this.filterConfigs.clickedSelectAll = false;
                }
                delete this.filterConfigs.valuesIn[item.value];
            }else{
                delete this.filterConfigs.valuesNotIn[item.value];
                this.filterConfigs.valuesIn[item.value] = true;
            }
        },
        handleSelectAllChange(){
            let self = this;
            setTimeout((self) => {
                let newValue = self.filterConfigs.clickedSelectAll;
                self.filterConfigs.selectAll = newValue;
                for(let item of self.filterConfigs.selectItems){
                    item.checked = newValue;
                }
                self.$set(self.filterConfigs, 'valuesIn', {});
                self.$set(self.filterConfigs, 'valuesNotIn', {});
            }, 10, this);
        },
        // Lấy về các item condition tương ứng với từng loại kiểu dữ liệu
        getConditionType() {
            let rsl = {};
            for(let type in conditionMap){
                rsl[type] = {};
                for(let item of conditionMap[type]){
                    rsl[type][item] = this.$t("table.filter."+item);
                }
            }
            return rsl;
        },
        clearFilter() {
            this.$emit(
                "apply-filter-value",
                getDefaultFilterConfig(),
                "clear-filter"
            );
            setTimeout(
                thisCpn => {
                    thisCpn.hide();
                },
                300,
                this
            );
        },
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
            setTimeout(thisCpn => {
                thisCpn.focusSearchBox();
            },300,this);

            this.focusing = true;
            this.listSelectItemHeight = "0px";

            setTimeout(thisCpn => {
                thisCpn.recalcListSelectItemHeight();
            },100,this);


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
        selectFilterCondition(index, type) {
            this.filterConfigs.conditionFilter.items[index].type = type;
            this["typeSelect" + (index + 1)] = false;
            this.listSelectItemHeight = "0px";
            setTimeout(
                thisCpn => {
                    thisCpn.recalcListSelectItemHeight();
                },
                600,
                this
            );
        },
        recalcListSelectItemHeight() {
            let refs = this.$refs;
            let h = util.getComponentSize(this).h;
            for (let i = 1; i <= 6; i++) {
                h -= util.getComponentSize(refs["it" + i]).h;
            }
            this.listSelectItemHeight = h - 50 + "px";
        },
        /**
         * input1, conjungtion, type2, input2
         */
        checkDisplayCondition(type) {
            let showInputType = {
                equal: true,
                not_equal: true,
                begins_with: true,
                ends_with: true,
                contains: true,
                not_contain: true,
                gt: true,
                lt: true,
                gte: true,
                lte: true
            };
            if (
                this.filterConfigs.conditionFilter &&
                this.filterConfigs.conditionFilter.items &&
                this.filterConfigs.conditionFilter.items[0]
            ) {
                let items = this.filterConfigs.conditionFilter.items;
                if (type == "input1") {
                    return showInputType[items[0].type];
                } else if (type == "input2") {
                    return (
                        items[0].type != "none" && showInputType[items[1].type]
                    );
                } else if (type == "type2") {
                    console.log(items[0].type);
                    return items[0].type != "none";
                } else if (type == "conjungtion") {
                    return items[0].type != "none";
                }
            } else {
                return false;
            }
        }
    },
    data() {
        return {
            listSelectItemHeight: "100px",
            typeSelect2: false,
            typeSelect1: false,
            filterConfigs: null,
            showTableFilter: false,
            focusing: true,
            listConditionType: this.getConditionType()
        };
    },
    components: {
        // PerfectScrollbar: PerfectScrollbar,
        VuePerfectScrollbar: VuePerfectScrollbar
    },
    props: {
        columnFilter: {
            default() {
                return getDefaultFilterConfig();
            }
        }
    },
    watch: {
        columnFilter: {
            deep: true,
            immediate: true,
            handler(newVl) {
                let rsl = util.cloneDeep(newVl);
                this.filterConfigs = null;
                this.filterConfigs = rsl;
            },
        }
    },
    computed: {
        // kiểu dữ liệu của cột hiện tại đang được filter
        colType(){
            return this.columnFilter.dataType;
        }
    }
};
</script>

<style>
</style>
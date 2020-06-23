<template>
    <v-autocomplete
        v-model="myValue"
        :items="myItems"
        :loading="isLoading"
        :search-input.sync="search"
        chips
        clearable
        hide-details
        flat
        small-chips
        :no-filter="true"
        height="28"
        :item-text="textKey"
        dense
        :item-value="valueKey"
        solo
        @change="applyChangeValue"
        @click="reAssignItems()"
    >
        <!-- Kiểu 1: mainAndSub -->
        <template v-slot:selection="{ attr, on, item, selected }">
            <v-chip
                style="height: 22px"
                v-bind="attr"
                :input-value="selected"
                color="grey lighten-3"
                class="fs-13"
                v-on="on"
            >
                <div class="d-inline-block text-ellipsis" style="width: calc(100% - 4px)">
                    <span v-text="item.id " v-if="showId" class="mr-2 font-weight-medium fs-12"></span>
                    <span v-text="item.title ? item.title : item.name" class="fs-12"></span>
                </div>
            </v-chip>
        </template>
        <template v-slot:item="{ item }">
            <div class="pa-2 font-weight-medium">
                <div class="d-flex fs-13">
                    <span v-text="item.id" class="mr-2" v-if="showId"></span>
                    <span v-text="item.name"></span>
                </div>
                <div class="w-100 fs-12 text--grey">
                    <span v-text="item.title"></span>
                </div>
            </div>
        </template>
    </v-autocomplete>
</template>

<script>
import { util } from "../../../plugins/util";
export default {
    props: {
        value: {
            type: String,
            default: ""
        },
        items: {
            type: Array,
            default(){
                return []
            }
        },
        textKey: {
            // key trong object chứa text để hiển thị lên ô input sau khi chọn được giá trị
            type: String,
            default: "title"
        },
        valueKey: {
            // key trong object chứa text để giá trị gán cho component
            type: String,
            default: "id"
        },
        onSearch: {
            // hàm xử lý khi input
            default: false
        },
        showId:{
            default: true
        }
    },
    created(){
        this.reAssignItems();
    },
    activated(){
        this.reAssignItems();
    },
    computed: {
        itemClone() {
            return util.cloneDeep(this.items);
        },
    },
    watch: {
        items: {
            deep: true,
            immediate: true,
            handler: function(after, before){
                // this.myItems = util.cloneDeep(after);
            }
        },
        value: {
            deep: true,
            immediate: true,
            handler: function(after, before){
                this.myValue = after;
            }
        },

        search(){
            let val = this.search;
            if(!this.onSearch){
                this.myItems = this.myItems.filter((el, idx) => {
                    if (
                        String(el.id).includes(val) ||
                        String(el.name).includes(val) ||
                        String(el.title).includes(val)
                    ) {
                        return true;
                    }
                    return false;
                });
            }else{
                this.onSearch(val, this);
            }
        }
    },
    data() {
        return {
            isLoading: false,
            search: '',
            myItems: [],
            myValue: ''
        };
    },
    methods: {
        applyChangeValue(vl){
            this.$emit('input', vl);
            this.$emit('change', { // có thêm items là để set lại danh sách các option trong trường hợp load data từ server
                value: vl,
                items: this.myItems
            });
        },
        reAssignItems(){
            let self = this
            setTimeout((self) => {
                if(self.myItems.length == 0){
                    self.myItems = self.items;
                }
            }, 600, this);
        }
    }
};
</script>

<style>
.column-drag-pos[draggable="true"] {
    background-color: #ffe6d2;
}
</style>
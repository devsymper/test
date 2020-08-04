<template>
    <div ref="tableWrapper" style="padding-top: 2px">
        <hot-table
            ref="dataTable"
            :settings="tableSettings"
            :data="data"
            :renderAllRows="isRenderAllRows"
            :columns="tableColumns"
            :minSpareRows="minSpareRows"
            
        ></hot-table>
    </div>
</template>

<script>
import { HotTable } from "@handsontable/vue";
import { util } from "./../../../plugins/util";
export default {
    mounted(){
        setTimeout((self) => {
            self.$refs.dataTable.hotInstance.render();        
        }, 300, this);
    },
    methods: {
        resetTbWrapperHeight(){
            let tbWrapper = this.$refs.tableWrapper;
            let h = $(tbWrapper).find('.ht_master .htCore').height() + 5;
            $(tbWrapper).height(h);
            $(tbWrapper).find('.ht_master.handsontable .wtHolder').height(h);
        },
        getData(){
            return this.$refs.dataTable.hotInstance.getData();
        },
        getColName(name){
            return this.$refs.dataTable.hotInstance.propToCol(name);
        },
        reRender(){
            this.$refs.dataTable.hotInstance.render()
        },
        getTableInstance(){
            return this.$refs.dataTable.hotInstance
        }
    },
    data() {
        let self = this;
        return {
            tableSettings: {
                stretchH: "all",
                licenseKey: "non-commercial-and-evaluation",
                afterRender: function (param) {
                    self.resetTbWrapperHeight();
                },
                afterChange(changes,source){
                    self.$emit('cell-change',{changes:changes,source:source})
                }
            }
        };
    },
    props: {
        columns: {
            type: Array,
            default() {
                return [];
            }
        },
        data: {
            type: Array,
            default() {
                return [];
            }
        },
        minSpareRows: {
            default: 0
        },
        isRenderAllRows: {
            type:Boolean,
            default: false
        }
    },
    computed: {
        tableColumns() {
            return this.columns.reduce((cols, col, idx) => {
                col = util.cloneDeep(col);
                col.data = col.name;
                cols.push(col);
                return cols;
            }, []);
        }
    },
    components: {
        HotTable
    }
};
</script>

<style>
</style>
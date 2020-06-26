<template>
    <div ref="tableWrapper" style="padding-top: 2px">
        <hot-table
            ref="dataTable"
            :settings="tableSettings"
            :data="data"
            :columns="tableColumns"
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
<template>
    
    <div >
        <div class="my-2 fs-12">
            Chọn hành động cho bản ghi của các văn bản
        </div>
        <hot-table
            :height="tableHeight"
            :settings="tableSettings1"
            :data="tableDataDefinition.tableData"
            :columns="tableDataDefinition.columns"
            :colHeaders="tableDataDefinition.colHeaders"
            :dataSchema="tableDataDefinition.dataSchema"
            
            class="fs-13 mt-2"
            ref="dataTable">
        </hot-table>
    </div>
</template>

<script>
import { HotTable, HotColumn } from "@handsontable/vue";
import { util } from '../../../plugins/util';
export default {
    components: {
        HotTable
    },
    computed: {
        tableSettings1() {
            let self = this;
            let setting = {
                 filters: true,
                manualColumnMove: true,
                manualColumnResize: true,
                manualRowResize: true,
                stretchH: "all",
                rowHeaders: true,
                licenseKey: "non-commercial-and-evaluation",
                afterChange: function(changes, source) {
                    if($.isArray(changes) && changes.length == 1){
                        self.$emit('change-data', {
                            rowIndex: changes[0][0],
                            action: changes[0][1],
                            after: changes[0][3],
                        });
                    }
                },
            }
            // setting.
            return setting;
        }
    },
    props: {

        tableHeight: {
            default: 100
        },
        tableDataDefinition: {
            default(){
                return {
                    tableData: [],
                    columns: [],
                    colHeaders: [],
                    dataSchema: []
                }
            }
        }
    }
}
</script>

<style>
</style>
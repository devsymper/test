<template>
    
    <div >
        <div class="my-2 fs-12">
            Chọn hành động cho bản ghi của các văn bản
        </div>
        <hot-table
            :height="tableHeight"
            :settings="tableSettings"

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
        tableSettings() {
            let setting = util.cloneDeep({
                ...this.commonTableSetting,
            });
            // setting.
            return setting;
        }
    },
    props: {
        /**
         * Các thuộc tính chung của table cần hiển thị
         */
        commonTableSetting: {

        },
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
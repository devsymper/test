<template>
    <div class="w-100">
        <table class="w-100 fs-13">
            <thead>
                <tr style="text-align:left">
                    <th style="padding-left:10px">Select sort columns</th>
                </tr>
            </thead>
            <tr style="border-bottom:1px solid #eee"  v-for="(col,idx) in nodeData.configs.sortColumns" :key="idx" :name="idx">
                <td class="pa-1">
                    <v-select
                        class="sym-select fs-13"
                        dense
                        flat
                        v-model="col.uid"
                        :items="nodeData.configs.allColumns"
                        item-value="columnName"
                        item-text="title"
                        outlined
                    ></v-select>
                </td>
                <td style="width:30%">
                    <div class="w-100 d-flex">
                        <v-select
                            class="sym-select fs-13"
                            dense
                            flat
                            v-model="col.type"
                            :items="dataTypes"
                            outlined
                        ></v-select>
                        <v-icon  @click="removeCol(idx)" class="fs-16 mx-1">mdi-close</v-icon>
                    </div>
                </td>
            </tr>
            <tfoot>
                <tr>
                    <td colspan="2">
                        <div class="w-100">
                            <v-btn  @click="addSortItem" depressed small class="mx-2 mt-1" style="width:95%">Add Column</v-btn>
                        </div>
                    </td>
                </tr>
               
            </tfoot>
        </table>
    </div>
</template>

<script>
export default {
    props:{
        // nodeData:{
        //     type: Object,
        //     default(){
        //         return {}
        //     }
        // },
    },
    data(){
        return{
            nodeData: {
                configs:{"wgName":"","wgDes":"","saveAs":[],"nameToSaveAs":"","newIdDataset":"stmp_1608627530603","selectedDataset":false,"errorList":[],"autoUpdatePeriod":{"time":5,"unit":"minutes"},"nextNodes":["cf695df8-7926-4fee-8362-3771fc156b67"],"prevNodes":["4ed9929d-6b34-46f3-99d9-ae215213fc36"],"allColumns":[{"uid":"stmp_1608623189878_lenh_sx__1","from":"4ed9929d-6b34-46f3-99d9-ae215213fc36","type":"text","title":"Lệnh SX (# 1)","idDataset":"stmp_1608623189878","columnName":"lenh_sx__1","symperDocId":"stmp_1608623189878"},{"uid":"stmp_1608623189878_ma_hang__1","from":"4ed9929d-6b34-46f3-99d9-ae215213fc36","type":"text","title":"Mã hàng (# 1)","idDataset":"stmp_1608623189878","columnName":"ma_hang__1","symperDocId":"stmp_1608623189878"},{"uid":"stmp_1608623189878_tskt__1","from":"4ed9929d-6b34-46f3-99d9-ae215213fc36","type":"text","title":"TSKT (# 1)","idDataset":"stmp_1608623189878","columnName":"tskt__1","symperDocId":"stmp_1608623189878"},{"uid":"stmp_1608623189878_ma_lo__1","from":"4ed9929d-6b34-46f3-99d9-ae215213fc36","type":"text","title":"Mã lô (# 1)","idDataset":"stmp_1608623189878","columnName":"ma_lo__1","symperDocId":"stmp_1608623189878"},{"uid":"stmp_1608623189878_sum_sl_nhap_tru","from":"4ed9929d-6b34-46f3-99d9-ae215213fc36","type":"number","title":" sum SL nhập (trừ)","idDataset":"stmp_1608623189878","columnName":"sum_sl_nhap_tru","symperDocId":"stmp_1608623189878"},{"uid":"stmp_1608623189878_sum_so_luong__2","from":"4ed9929d-6b34-46f3-99d9-ae215213fc36","type":"number","title":" sum Số lượng (# 2)","idDataset":"stmp_1608623189878","columnName":"sum_so_luong__2","symperDocId":"stmp_1608623189878"},{"uid":"stmp_1608623189878_sum_sl_xuat__2","from":"4ed9929d-6b34-46f3-99d9-ae215213fc36","type":"number","title":" sum Sl Xuất (# 2)","idDataset":"stmp_1608623189878","columnName":"sum_sl_xuat__2","symperDocId":"stmp_1608623189878"},{"uid":"stmp_1608623189878_sum_tam_nhap","from":"4ed9929d-6b34-46f3-99d9-ae215213fc36","type":"number","title":" sum Tạm nhập","idDataset":"stmp_1608623189878","columnName":"sum_tam_nhap","symperDocId":"stmp_1608623189878"},{"uid":"stmp_1608623189878_sum_so_luong_xuat__2","from":"4ed9929d-6b34-46f3-99d9-ae215213fc36","type":"number","title":" sum Số lượng xuất (# 2)","idDataset":"stmp_1608623189878","columnName":"sum_so_luong_xuat__2","symperDocId":"stmp_1608623189878"},{"uid":"stmp_1608623189878_sum_nhap_chinh_a1","from":"4ed9929d-6b34-46f3-99d9-ae215213fc36","type":"number","title":" sum Nhập chính A1","idDataset":"stmp_1608623189878","columnName":"sum_nhap_chinh_a1","symperDocId":"stmp_1608623189878"},{"uid":"stmp_1608623189878_sum_so_luong__2___1","from":"4ed9929d-6b34-46f3-99d9-ae215213fc36","type":"number","title":" sum Số lượng (# 2)","idDataset":"stmp_1608623189878","columnName":"sum_so_luong__2___1","symperDocId":"stmp_1608623189878"},{"uid":"stmp_1608623189878_sum_a1","from":"4ed9929d-6b34-46f3-99d9-ae215213fc36","type":"number","title":" sum A1","idDataset":"stmp_1608623189878","columnName":"sum_a1","symperDocId":"stmp_1608623189878"},{"uid":"stmp_1608623189878_cnk","from":"4ed9929d-6b34-46f3-99d9-ae215213fc36","type":"number","title":"cnk","idDataset":"stmp_1608623189878","columnName":"cnk","symperDocId":"stmp_1608623189878"}],"sortColumns":[{"uid":"ma_lo__1","type":"DESC"}]}
            },
            dataTypes:[
                {
                    text:'ASC',
                    value:'ASC'
                },
                {
                    text:'DESC',
                    value:'DESC'
                },
            ],
        }
    },
    methods:{
        removeCol(idx){
            this.nodeData.configs.sortColumns.splice(idx, 1);
        },
        addSortItem() {
            this.nodeData.configs.sortColumns.push({
                uid: "",
                type: "ASC"
            });
        },
    }

}
</script>

<style scoped>
.sym-select {
    height: 30px!important;
}
.sym-select >>> .v-input__slot{
    min-height: 20px!important;
    height: 30px;
}
.sym-select >>> .v-input__append-inner{
    margin-top: 3px!important;
}
</style>
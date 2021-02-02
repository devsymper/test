<template>
    <div class="w-100 fs-13">
        <div class="font-weight-medium ml-1 mt-2">Goods (Mã hàng)</div>
        <select-column 
            class="pl-1"
            :allColumns="nodeData.configs.allColumns"
            :model="nodeData.configs.goods"
            @change-value="changeValue"
            :name="'goods'"
        />
        <div class="font-weight-medium ml-1 mt-2">Stock (Mã kho)</div>
        <select-column 
            class="pl-1"
            :allColumns="nodeData.configs.allColumns"
            :model="nodeData.configs.stock"
            @change-value="changeValue"
            :name="'stock'"
        />
        <div class="font-weight-medium ml-1 mt-2">Exchange Stock (Mã kho điều chuyển)</div>
        <select-column 
            class="pl-1"
            :allColumns="nodeData.configs.allColumns"
            :model="nodeData.configs.exchangeStock"
            @change-value="changeValue"
            :name="'exchangeStock'"
        />
        <div class="font-weight-medium ml-1 mt-2">Quantity (Số lượng)</div>
        <select-column 
            class="pl-1"
            :allColumns="nodeData.configs.allColumns"
            :model="nodeData.configs.quantity"
            @change-value="changeValue"
            :name="'quantity'"
        />
        <div class="font-weight-medium ml-1 mt-2">Total Amount (Thành tiền)</div>
        <select-column 
            class="pl-1"
            :allColumns="nodeData.configs.allColumns"
            :model="nodeData.configs.totalAmount"
            @change-value="changeValue"
            :name="'totalAmount'"
        />
    </div>
</template>

<script>
import SelectColumn from '@/components/common/bi/SelectColumn.vue'
export default {
    components: { 
        SelectColumn,
    },
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
                configs:{"wgName":"","wgDes":"","saveAs":[],"nameToSaveAs":"","newIdDataset":"","selectedDataset":"","errorList":[],"autoUpdatePeriod":{"time":5,"unit":"minutes"},"goods":"tb3_ma_hang","stock":"tb3_ma_kho","quantity":"tb3_so_luong","nextNodes":[],"prevNodes":["c5be6503-dc06-49a0-9f2c-37aeb2bcf575"],"allColumns":[{"uid":"stmp_1605770113025_tb3_so_luong","from":"c5be6503-dc06-49a0-9f2c-37aeb2bcf575","type":"number","title":"Số lượng","selected":true,"idDataset":"stmp_1605770113025","columnName":"tb3_so_luong","symperDocId":"stmp_1605770113025"},{"uid":"stmp_1605770113025_tb3_ngay","from":"c5be6503-dc06-49a0-9f2c-37aeb2bcf575","type":"date","title":"Ngày","selected":true,"idDataset":"stmp_1605770113025","columnName":"tb3_ngay","symperDocId":"stmp_1605770113025"},{"uid":"stmp_1605770113025_tb3_kho_dieu_chuyen","from":"c5be6503-dc06-49a0-9f2c-37aeb2bcf575","type":"text","title":"Kho điều chuyển","selected":true,"idDataset":"stmp_1605770113025","columnName":"tb3_kho_dieu_chuyen","symperDocId":"stmp_1605770113025"},{"uid":"stmp_1605770113025_tb3_gia","from":"c5be6503-dc06-49a0-9f2c-37aeb2bcf575","type":"number","title":"Giá","selected":true,"idDataset":"stmp_1605770113025","columnName":"tb3_gia","symperDocId":"stmp_1605770113025"},{"uid":"stmp_1605770113025_tb3_thanh_tien","from":"c5be6503-dc06-49a0-9f2c-37aeb2bcf575","type":"number","title":"Thành tiền","selected":true,"idDataset":"stmp_1605770113025","columnName":"tb3_thanh_tien","symperDocId":"stmp_1605770113025"},{"uid":"stmp_1605770113025_tb3_loai_phieu","from":"c5be6503-dc06-49a0-9f2c-37aeb2bcf575","type":"text","title":"Loại phiếu","selected":true,"idDataset":"stmp_1605770113025","columnName":"tb3_loai_phieu","symperDocId":"stmp_1605770113025"},{"uid":"stmp_1605770113025_tb3_ma_kho","from":"c5be6503-dc06-49a0-9f2c-37aeb2bcf575","type":"text","title":"MÃ kho","selected":true,"idDataset":"stmp_1605770113025","columnName":"tb3_ma_kho","symperDocId":"stmp_1605770113025"},{"uid":"stmp_1605770113025_tb3_ma_hang","from":"c5be6503-dc06-49a0-9f2c-37aeb2bcf575","type":"text","title":"Mã hàng","selected":true,"idDataset":"stmp_1605770113025","columnName":"tb3_ma_hang","symperDocId":"stmp_1605770113025"}],"totalAmount":"tb3_thanh_tien","exchangeStock":"tb3_kho_dieu_chuyen"}
            },
        }
    },
    methods:{
        changeValue(data){
            this.$set(this.nodeData.configs,data.name,data.value);
        }
    }
}
</script>

<style scoped>

</style>
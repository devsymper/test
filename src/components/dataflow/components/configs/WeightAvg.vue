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
        nodeData:{
            type: Object,
            default(){
                return {}
            }
        },
    },
    data(){
        return{
         
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
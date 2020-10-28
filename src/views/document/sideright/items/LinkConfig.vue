<template>
    <div class="s-list-link">
        <div class="s-list-link__item" v-for="(item,index) in listConfig" :key="index">
            <p>Link1</p>
            <div>
                <div class="title-input">Loại đối tượng</div>
                    <v-autocomplete
                    :items="listObject"
                    v-model="item.objectType"
                    item-text="title"
                    return-object
                    item-value="name"
                    dense
                    solo
                ></v-autocomplete>
            </div>
            <div class="mt-2 mb-2">Công thức lấy đối tượng link đến</div>
            <div class="formula-content">
                 <FormulaEditor
                    ref="edtFormula"
                    class="sym-small-size"
                    :simpleMode="true"
                    :value="item.formula.value"
                    :height="'80px'"
                ></FormulaEditor>
            </div>
            <div class="mt-2 mb-1">
                <div class="title-input">Tiêu đề hiển thị</div>
                    <v-text-field
                    v-model="item.title"
                    dense
                    solo
                ></v-text-field>
            </div>
        </div>

        <div>
            <button class="btn-add-config" @click="addItem">Thêm</button>
        </div>
    </div>
</template>
<script>
import FormulaEditor from "@/components/formula/editor/FormulaEditor";

export default {
    components:{
        FormulaEditor
    },
    data(){
        return {
            listObject:[{type:'document',title:"Văn bản"},{type:'report',title:"Báo cáo"}],
            titleDisplay:"",
            listConfig:[{objectType:{type:'document',title:"Văn bản"},formula:{id:1245,value:"select x"},title:"hoang test"}]
        }
    },
    methods:{
        addItem(){
            this.listConfig.push({objectType:null,formula:{id:0,value:""},title:""})
        },
        saveConfig(){
            // this.$emit('change',)
        }
    }
}
</script>
<style scoped>
    .s-list-link{
        font-size: 11px !important;
    }
    .s-list-link__item .title-input{
        width: 80px;
        display: inline-block;
        margin-right: 2px;
    }
    .s-list-link__item > p{
        font-weight: 500;
    }
    .s-list-link__item {
        border: var(--symper-border);
        margin: 4px;
        padding: 4px;
    }
    .s-list-link__item >>> .v-input{
        display: inline-block;
        width: calc(100% - 86px);
    }
    .s-list-link__item >>> .v-input__icon--append{
        display: none;
    }
    .s-list-link__item >>> .v-input__slot{
        padding: 0 6px !important;
        box-shadow: unset !important;
    }
    .s-list-link__item >>> .v-select__slot{
        padding: 0!important;
        font-size: 11px !important;
    }
    .formula-content{
        border: var(--symper-border);
    }
    .btn-add-config{
        float: right;
        margin: 0 6px 2px 0;
        padding: 0 4px;
        border-radius: 2px;
    }
    .btn-add-config:focus{
        outline: none;
    }
</style>
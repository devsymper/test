<template>
    <div  class="w-100">
        
        <v-select
            class="s-select-page-size  float-left"
            style="width:70px"
            v-model="size"
            :items="pageSizeOptions"
            hide-details
            solo
            dense
            flat
            @change="changePageSize"
        ></v-select>
        <div style="vertical-align: middle;" class="  float-left">
            <v-pagination
                class="s-pagination"
                v-model="page"
                :page="page"
                :length="pageLength"
                next-icon="mdi-chevron-right"
                prev-icon="mdi-chevron-left"
                :total-visible="totalVisible"
                @next="onNextPage"
                @prev="onPrevPage"
                @input="onInputPage"
            ></v-pagination>
        </div>
        <div class="mr-2 fs-13  float-right" style="line-height: 25px">
            {{$t('common.display')}} 
            <span class="font-weight-medium">{{rowRange}}</span> 
            {{$t('common.of')}} 
            <span class="font-weight-medium">{{total}}</span> 
            {{$t('common.entries')}}
        </div>
    </div>
</template>
<script>
export default {
    computed: {
        rowRange(){
            let start = (this.page - 1) * this.size;
            let end = 0;

            if(this.page * this.size >= this.total){
                end = this.total;
            }else{
                end = this.page * this.size;
            }
            return `${start} - ${end}`;
        },
        pageLength(){
            if(this.total % this.size == 0){
                return this.total/this.size;
            }else{
                return Math.floor(this.total/this.size) + 1;
            }
        }
    },
    props:{
        total:{
            type:Number,
            default:0
        },
        pageSizeOptions:{
            type:Array,
            default: function () { 
                return [50,75,100] 
            }
        },
        totalVisible:{
            type:Number,
            default:7
        }
    },
    watch:{
    },
    data:()=>{
        return {
            page:null,
            size:50,
        }
    },
    beforeMount(){
        this.page = 1;
    },
    methods:{
        onNextPage(page){
            this.$emit('on-change-page',{page:this.page,pageSize:this.size})
        },
        onPrevPage(page){
            this.$emit('on-change-page',{page:this.page,pageSize:this.size})
        },
        onInputPage(page){
            this.$emit('on-change-page',{page:this.page,pageSize:this.size})
        },
        changePageSize(){
            this.$emit('on-change-page-size',{page:this.page,pageSize:this.size})
        }
    }


}
</script>

<style scoped>
    .s-select-page-size{
        font-size: 12px !important;
    }
    .s-select-page-size ::v-deep .v-input__control{
        min-height: unset !important;
        width: 65px;
        height: 25px;
    }
    .s-select-page-size ::v-deep .v-input__slot{
        padding: 0 6px !important;
        background: rgb(0 0 0 / 0.05) !important;
    }
    .s-select-page-size ::v-deep .v-input__slot .mdi-menu-down{
        color: rgb(0 0 0 / 0.6) !important;
    }
    .s-pagination{
        margin-left: 8px;
        justify-content: start !important;
    }
    .s-pagination ::v-deep li > button{
        margin: 0 2px !important;
        font-size: 12px !important;
        box-shadow: none !important;
        margin-right: 6px;
        background: white !important;
        transition: all ease-in-out 250ms;
        color: rgb(0 0 0 / 0.6) !important;
        height: 25px;
        min-width: 25px !important;
        padding: 0 !important;
    }
    .s-pagination ::v-deep li > .v-pagination__navigation .mdi{
        font-size: 20px !important;
    }
    .s-pagination ::v-deep li > .v-select__slot{
        height: 25px !important;
    }
    .s-pagination ::v-deep li > .v-pagination__more{
        margin: 0 2px !important;
        font-size: 12px !important;
        box-shadow: none !important;
        margin-right: 6px;
        background: white !important;
        transition: all ease-in-out 250ms;
        color: rgb(0 0 0 / 0.6) !important;
        height: 25px;
        width: 25px;
        min-width: unset !important;
        padding: 0 !important;
    }
    .s-pagination ::v-deep li > button:hover{
        background: rgb(0 0 0 / 0.1) !important;
    }
    .s-pagination ::v-deep li > button:focus{
        outline: none !important;
    }
    .s-pagination ::v-deep li > .v-pagination__item--active{
        background: rgb(0 0 0 / 0.05) !important;
    }
</style>
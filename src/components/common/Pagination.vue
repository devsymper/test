<template>
    <div>
        <v-select
            class="d-inline-block s-select-page-size"
            style="width:70px"
            v-model="size"
            :items="pageSizeOptions"
            hide-details
            solo
            dense
            flat
            @change="changePageSize"
        ></v-select>
        <div class="d-inline-block" style="vertical-align: middle;">
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
    </div>
</template>
<script>
export default {
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
        total(after){
            this.pageLength = Math.floor(this.total/this.size);
        }
    },
    data:()=>{
        return {
            page:null,
            size:50,
            pageLength:0,
        }
    },
    beforeMount(){
        this.page = 1;
        this.pageLength = Math.floor(this.total/this.size);
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
        width: 500px !important;
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
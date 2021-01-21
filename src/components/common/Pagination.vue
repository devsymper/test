<template>
    <div  class="w-100 " :class="{'s-pagination-mini': contentSize == 'mini', 's-pagination-normal': contentSize != 'mini'}">
        <v-select
            class="s-select-page-size  float-left"
            style="width:75px"
            v-model="size"
            :items="pageSizeOptions"
            hide-details
            solo
            dense
            flat
            @change="changePageSize"
        ></v-select>
        <div :style="{
            'vertical-align': 'middle',
            'width': pagesWidth
        }" class="  float-left">
            <v-pagination
                class="s-pagination"
                v-model="page"
                :length="pageLength"
				small
                next-icon="mdi-chevron-right"
                prev-icon="mdi-chevron-left"
                :total-visible="totalVisible"
                @next="onNextPage"
                @prev="onPrevPage"
                @input="onInputPage"
            ></v-pagination>
        </div>
        <div class="mr-2 float-right" style="line-height: 25px" v-show="showRange">
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
        },
        pagesWidth(){
            return (36 * this.totalVisible + 100) + 'px';
        }
    },
    props:{
		contentSize:{
			type: String,
			default: "normal"
		},
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
        },
        showRange: {
            type: Boolean,
            default: true
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
        font-size: 12px;
        box-shadow: none !important;
        margin-right: 6px;
        background: white !important;
        transition: all ease-in-out 250ms;
        color: rgb(0 0 0 / 0.6) !important;
        height: 25px;
        min-width: 25px;
        padding: 0 !important;
    }
    .s-pagination ::v-deep li > .v-pagination__navigation .mdi{
        font-size: 20px ;
    }
    .s-pagination ::v-deep li > .v-select__slot{
        height: 25px ;
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

    .s-pagination ::v-deep ul.v-pagination {
        justify-content: start!important;
    }
	.s-pagination-mini{
		font-size: 11px !important;
	}
	.s-pagination-mini >>> .v-input__control{
		font-size: 11px !important;
	}
	.s-pagination-mini >>> .v-input__control .v-select__selection{
		font-size: 11px !important;
	}
	.s-pagination-mini >>> .v-select__slot{
		height: 20px !important;
	}
	.s-pagination-mini >>> .v-input__slot{
		width: 66px !important;
	}
	.s-pagination-mini >>> ul{
		height: 20px !important;
	}
	.s-pagination-mini >>> li{
	   	width: 20px;
		margin-left: 2px;
		margin-right: 2px;
	}
	.s-pagination-mini >>> li button{
		min-width: 20px !important;
	}
	.s-pagination-mini >>> .v-pagination__navigation,
	.s-pagination-mini >>> .v-pagination__item{
		height: 20px !important;
    	font-size: 10px !important;
		width: 20px !important;
	}
	.s-pagination-mini >>> .v-icon{
    	font-size: 15px !important;
	}
	.s-pagination-normal{
		font-size: 13px !important;
	}
</style>
<template>
    <v-card 
    class="card-validate"
    v-show="isShow"
    :style="positionBox">
        <v-card-title>{{errTitle}}</v-card-title>
        <v-card-text>
            <v-icon class="icon">mdi-information-outline</v-icon>
            <span>{{errMessage}}</span>

        </v-card-text>
        <v-card-actions style="flex-flow: row-reverse;">
            <v-btn @click="isShow = false" text>{{$t('common.close')}}</v-btn>
        </v-card-actions>
    </v-card>
</template>
<script>
export default {
    props:{
        keyInstance:{
            type:Number,
            default:0
        },
        title:{
            type:String,
            default:"Dữ liệu không hợp lệ"
        },
        message:{
            type:String,
            default:""
        }
    },
    watch:{
        title(after){
            this.errTitle = title;
        },
        message(after){
            this.errMessage = after
        }
    },
    data(){
        return {
            isShow:null,
            positionBox:null,
            errTitle:this.title,
            errMessage:this.message,
        }
    },
    created(){
        
    },
    beforeMount(){
        this.isShow = false;
        this.positionBox = {'top':0,'left':0};
    },
    methods:{
        show(e){
            this.isShow = true;
            this.calPosition(e);
        },
        hide(){
            this.isShow = false;
        },
        calPosition(e){
            if(e == false){// trường hợp gọi từ panel save document
                this.positionBox = {'top':'50%','left':'50%',transform: 'translate(-50%, -50%)',position: 'fixed',width:'400px'};
            }
            else{
                if($(e.target).closest('.handsontable').length > 0){
                    let autoEL = $(this.$el).detach();
                    $(e.target).closest('.wrap-table').append(autoEL);
                    let edtos = $(e.delegateTarget).offset();
                    
                    let tbcos = $(e.target).closest('.wrap-table').find('[s-control-type="table"]').offset();
                    this.positionBox = {'top':edtos.top - tbcos.top + $(e.target).height() +'px','left':edtos.left - tbcos.left+'px'};
                }
                //nêu là ngoài bảng
                else{
                    let autoEL = $(this.$el).detach();
                    $(e.target).parent().append(autoEL);
                    this.positionBox = {'top':'20px','left':'0px'};
                }
            }
            
            
        },
        
    }
}
</script>

<style scoped> 
    .card-validate{
        position: absolute;
        z-index: 99999;
        max-width: unset !important;
        width: max-content;
    }
    .card-validate >>> .v-card__title{
        padding: 12px;
        font-size: 15px !important;
    }
    .card-validate >>> .v-card__text{
        font-size: 13px !important;
        padding: 0 8px 8px 8px !important;
    }
    .card-validate >>> .mdi-information-outline{
        font-size: 50px!important;
        color: red !important;
    }
    .icon{
        float: left;
        margin-right: 10px;
    }
</style>
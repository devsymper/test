<template>
    <v-card 
    class="card-validate"
    v-show="isShow"
    :style="positionBox">
        <v-card-title>Lỗi</v-card-title>
        <v-card-text>
        <span>{{message}}</span>

        </v-card-text>
    </v-card>
</template>
<script>
export default {
    props:{
        keyInstance:{
            type:Number,
            default:0
        }
    },
    data(){
        return {
            isShow:null,
            positionBox:null,
            message:null,
        }
    },
    created(){
        
    },
    beforeMount(){
        this.isShow = false;
        this.positionBox = {'top':0,'left':0};
        this.message='Không được bỏ trống trường này';
    },
    methods:{
        show(e){
            this.isShow = true;
            this.calPosition(e);
            this.message=e.msg
        },
        hide(){
            this.isShow = false;
        },
        calPosition(e){
            console.log('lk',e);
            
            console.log('lk',$(e.parentElement));
            console.log('lk',$(e.parentElement).closest('.handsontable'));
            
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
            
        },
        
    }
}
</script>

<style scoped> 
    .card-validate{
        position: absolute;
        z-index: 99999;
        max-width: unset !important;
    }
    
</style>
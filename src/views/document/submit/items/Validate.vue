<template>
    <v-card 
    class="card-validate p-2"
    v-show="isShow"
    :style="positionBox">
        <span>{{message}}</span>
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
            this.positionBox = {'top':$(e.target).offset().top +'px','left':e.pageX - 50+ 'px'};
        },
        
    }
}
</script>

<style scoped> 
    .card-validate{
        position: absolute;
        z-index: 99999;
    }
    
</style>
<template>
    <v-card 
    class="card-validate p-2"
    v-show="isShow"
    :style="positionBox">
        <span>Không được bỏ trống trường này</span>
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
            console.log(e);
            
            this.positionBox = {'top':$(e.target).offset().top +'px','left':e.pageX - e.offsetX/2 + 'px'};
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
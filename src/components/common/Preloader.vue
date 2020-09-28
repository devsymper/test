<template>
    <div v-show="isShow" class="preloader h-100 w-100" :style="styleLoad">
        <div>{{contentText}}</div>
    </div>
</template>

<script>
export default {
    props:{
        styleLoad:{
            type:Object,
            default(){
                return {position:'absolute'}
            }
        },
        contentText:{
            type:String,
            default:"Đang tải.."
        }
    },
    data(){
        return {
            isShow:true
        }
    },
    methods:{
        hide(){
            setTimeout((self) => {
                this.isShow = false
            }, 300,this);
        }
    }
}
</script>
<style scoped>
    .preloader {
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99999;
        /* backdrop-filter: blur(5px); */
    }

    .preloader div {
    position: relative;
    margin: 0 auto;
    transform: rotateY(30deg);
    animation: effect-anime 3000ms infinite;
    font-family: Arial;
    font-size: 30px;
    text-align: center;
    line-height: 100%;
    }

    @keyframes effect-anime {
        0% {
            transform: translateX(50%) rotateY(50deg);
            opacity: 0;
            -webkit-filter: blur(10px);
            filter: blur(10px);
        }
        
        
        50% {
            transform: translateX(0) rotateX(0);
            opacity: 1;
            -webkit-filter: blur(0);
            filter: blur(0);
        }
        
        100% {
            transform: translateX(-50%) rotateY(-50deg);
            opacity: 0;
            -webkit-filter: blur(10px);
            filter: blur(10px);
        }
    }
</style>
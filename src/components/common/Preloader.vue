<template>
    <div v-show="isShow" class="preloader h-100 w-100" :style="styleLoad">
        <transition name="fade" mode="out-in">
            <img :src="require('./../../assets/image/symper_loader.jpg')" alt="" height="50px" width="50px">
        </transition>
        
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
        },
        show(){
            this.isShow = true
        }
    }
}
</script>
<style scoped>
    .preloader {
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 200;
        background: white;
        /* backdrop-filter: blur(5px); */
    }

   
</style>
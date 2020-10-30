<template>
    <div class="s-floatting-popup" :style="popupPosition">

    </div>
</template>
<script>
export default {
    data(){
        return {
            popupPosition:{left:0,right:0}
        }
    },
    methods:{
        setPosition(pos){
            this.popupPosition = pos
        }
    }
}
</script>
<style scoped>
    .s-floatting-popup{
        height: auto;
        max-height: 500px;
        width: 600px;
        background: white;
        box-shadow: var(--symper-box-shadow-top);
        position: absolute;
        z-index: 200;
        height: 300px;
    }
</style>
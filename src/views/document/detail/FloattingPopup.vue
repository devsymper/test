<template>
    <div class="s-floatting-popup" :style="position"
    v-show="isShow" >

    </div>
</template>
<script>
export default {
   props:{
        
        instance:{
            type:Number,
            default:0
        },
        
    },
    data(){
        return {
            date:null,
            isShow:false,
            position:null,
            listLink:{},
            listLinkDisplay:{}
        }
    },
    beforeMount(){
        this.position = {
                        top:'26px',
                        left:'0px'
                    }
    },
  
    methods:{
        hide() {
            this.isShow = false;
        },
        show(e, controlName){
            this.isShow = true;
            this.calculatorPositionBox(e);
        },
        calculatorPositionBox(e){
            // nếu autocomplete từ cell của handsontable  
            let inputOffset = {};
            let input = $(e.target).parent().find('.s-control');
            if($(e.target).closest('.handsontable').length > 0){
                inputOffset = $(e.delegateTarget).offset();
            }
            //nêu là ngoài bảng
            else{
                inputOffset = input.offset();
            }
            let detailFormOffset = $('#sym-Detail-'+this.instance).offset();
            let detailFormWidth = $('#sym-Detail-'+this.instance).width();
            let leftDiff = inputOffset.left - detailFormOffset.left;
            let cardWidth = $('.s-floatting-popup').width();
            let cardHeight = $('.s-floatting-popup').height();
            let inputWidth = input.width();
            if(cardWidth + leftDiff > detailFormWidth){
                this.position = {'top':inputOffset.top - detailFormOffset.top + 26 +30 +'px','left':Math.abs(inputOffset.left + inputWidth -10 - cardWidth)+'px'};
            }
            else{
                this.position = {'top':inputOffset.top - detailFormOffset.top + 26 +30 +'px','left':Math.abs(detailFormOffset.left + leftDiff)+'px'};
            }
            if(window.innerHeight < inputOffset.top + $('.s-floatting-popup').height() + 40){
                this.position.top = Math.abs(inputOffset.top - detailFormOffset.top - cardHeight + 30) + 'px'
            }
        },
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
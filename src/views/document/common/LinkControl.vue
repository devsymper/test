<template>
    <v-card class="card-link-config"
    :style="position"
    v-show="isShow" >
       <div class="item-link" v-for="(link,index) in listLink" :key="index" @click="openLink(link)">
           {{link.title}}
       </div>
    </v-card>
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
            listLink:{}
        }
    },
    beforeMount(){
        this.position = {
                        top:'26px',
                        left:'0px'
                    }
    },
  
    methods:{
        openLink(link){
            if(link.source == "document"){
                this.$goToPage('/documents/objects/'+link.value,"Chi tiết");
            }
        },
        hide() {
            this.isShow = false;
        },
        show(e){
            this.isShow = true;
            this.calculatorPositionBox(e);
        },
        setData(data){
            if(this.listLink.hasOwnProperty(data.key)){
                this.listLink[data.key].value = data.value;
            }
            else{
                this.listLink[data.key] = {title:data.title,value:data.value,source:data.source};
            }
        },
        calculatorPositionBox(e){
            // nếu autocomplete từ cell của handsontable  
            if($(e.target).closest('.handsontable').length > 0 ){
                let autoEL = $(this.$el).detach();
                $(e.target).closest('.wrap-table').append(autoEL);
                let edtos = $(e.target).offset();
                if(!$(e.target).is('.handsontableInput')){
                    edtos = $(e.target).closest('td.htAutocomplete.current.highlight').offset();
                }
                if($(e.target).is('div.htAutocompleteArrow')){
                    edtos = $(e.target).parent().offset();;
                }
                let tbcos = $(e.target).closest('.wrap-table').find('[s-control-type="table"]').offset();
                this.position = {'top':edtos.top - tbcos.top + $(e.target).height() +'px','left':edtos.left - tbcos.left+'px'};
            }
            //nêu là ngoài bảng
            else{
                let inputOffset = $(e.target).offset();
                let submitFormOffset = $('#sym-submit-'+this.instance).offset();
                let submitFormWidth = $('#sym-submit-'+this.instance).width();
                let leftDiff = inputOffset.left - submitFormOffset.left;
                let cardWidth = $('.card-link-config').width();
                let cardHeight = $('.card-link-config').height();
                let inputWidth = $(e.target).width();
                if(cardWidth + leftDiff > submitFormWidth){
                    this.position = {'top':inputOffset.top - submitFormOffset.top + 26 +'px','left':leftDiff + 10 + inputWidth - cardWidth+'px'};
                }
                else{
                    this.position = {'top':inputOffset.top - submitFormOffset.top + 26 +'px','left':inputOffset.left - submitFormOffset.left+'px'};
                }
                if(window.innerHeight < inputOffset.top + $('.card-link-config').height() + 40){
                    this.position.top = inputOffset.top - submitFormOffset.top - cardHeight + 'px'
                }
            }
        },
    }
}

</script>
<style scoped>
    .card-link-config{
        position: absolute;
        z-index: 9999;
        max-width: unset !important;
        width: 200px;
        height: auto;
    }
    .item-link{
        cursor: pointer;
        transition: background ease-in-out 250ms;
        padding: 4px;
    }
    .item-link:hover{
        background: var(--symper-background-hover);
    }
</style>

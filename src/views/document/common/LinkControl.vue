<template>
    <v-card class="card-link-config"
    :style="position"
    v-show="isShow" >
       <div class="item-link" v-for="(link,index) in listLinkDisplay" :key="index" @click="openLink(link)">
           <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <p v-on="on" class="m-0">{{link.title}}</p>
                </template>
                <span>{{link.link}}</span>
            </v-tooltip>
           
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
        openLink(link){
            if(link.source == "document"){
                this.$goToPage('/documents/objects/'+link.value,"Chi tiết");
            }
        },
        getData(){
            return this.listLink;
        },
        hide() {
            this.isShow = false;
        },
        show(e, controlName){
            this.isShow = true;
            this.calculatorPositionBox(e);
            this.listLinkDisplay = this.listLink[controlName]
        },
        setData(controlName, data){
            let link = (data.source == 'document') ? '/documents/objects/'+data.value : data.source+":"+data.value;
            if(!this.listLink.hasOwnProperty(controlName)){
                this.listLink[controlName] = {};
            }
            if(this.listLink[controlName].hasOwnProperty(data.key)){
                this.listLink[controlName][data.key].value = data.value;
                this.listLink[controlName][data.key].link = link;
            }
            else{
                this.listLink[controlName][data.key] = {title:data.title,value:data.value,source:data.source, link:link};
            }
        },
        calculatorPositionBox(e){
            // nếu autocomplete từ cell của handsontable  
            let inputOffset = {};
            if($(e.target).closest('.handsontable').length > 0){
                inputOffset = $(e.delegateTarget).offset();
            }
            //nêu là ngoài bảng
            else{
                inputOffset = $(e.target).offset();
            }
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

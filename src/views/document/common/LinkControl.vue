<template>
    <div class="card-link-config">
       <div class="item-link" v-for="(link,index) in listLinkDisplay" :key="index" @click="openLink(link)">
           <v-tooltip top>
                <template v-slot:activator="{ on }">
                    <p v-on="on" class="m-0">{{link.title}}</p>
                </template>
                <span>{{link.link}}</span>
            </v-tooltip>
           
       </div>
    </div>
</template>
<script>
import {getControlInstanceFromStore} from './common'
export default {
    props:{
        instance:{
            type:Number,
            default:0
        },
        focusingControlName: {
            type: String,
            default: ''
        },
        rowIndex:{
            type:Number
        }
        
    },
    watch:{
        focusingControlName(vl){
            this.show(vl);
        },
        rowIndex(vl){
            this.show(this.focusingControlName);
        }
    },
    data(){
        return {
            listLink:{},
            listLinkDisplay:{}
        }
    },
    computed:{
        listLinkControl() {
            return this.$store.state.document.linkControl[this.instance];
        },
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
        show(controlName){
            if(!controlName){
                return
            }
            let controlIns = getControlInstanceFromStore(this.instance,this.focusingControlName);
            if(this.rowIndex != undefined && controlIns.inTable != false){
                let linkInTable = {};
                let allLinkInCol = this.listLinkControl[this.focusingControlName];
                debugger
                for(let key in allLinkInCol){
                    let reg = new RegExp('linkConfig_(.*)_'+this.rowIndex+'$');
                    if(reg.test(key)){
                        linkInTable[key] = allLinkInCol[key];
                    }
                }
                this.listLinkDisplay = linkInTable
            }
            else{
                this.listLinkDisplay = this.listLinkControl[this.focusingControlName]
            }
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
    }
}

</script>
<style scoped>
    .item-link{
        cursor: pointer;
        transition: background ease-in-out 250ms;
        padding: 4px;
        font-size: 13px;
    }
    .item-link:hover{
        background: var(--symper-background-hover);
    }
</style>

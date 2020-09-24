<template>
    <div class="form-tablet" v-show="isShow" :style={width:width,height:height}>
        <div class="form-tablet__header"> 
            <span v-html="title"></span>
            <span class="mdi mdi-close btn-close-form" @click="isShow = false"></span>
        </div>
        <div class="form-tablet__body">
            <div class="form-tablet__sidebar">
                <div v-for="(printConfig,index) in listPrintConfig" :key="index" class="print-item" @click="chooseItem($event,printConfig)">
                    {{printConfig.title}}
                </div>
            </div>
            <div class="form-tablet__detail">
                <div class="menu-action">

                </div>
                <VuePerfectScrollbar>
                    <PrintView :isAlwaysPrint="false" :allObject="allObject" v-if="formId != 0"/>
                </VuePerfectScrollbar>
            </div>
        </div>
        <div class="form-tablet__footer">
            <button v-for="(action,index) in actions" :key="index" @click="action.action({documentObjectId:docObjectId,formId:formId})">
                {{action.title}}
            </button>
            
        </div>
        
    </div>
</template>

<script>
import PrintView from "./PrintView";
import { documentApi } from "./../../../api/Document.js";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
    components:{
        VuePerfectScrollbar,
        PrintView
    },
    props:{
        documentId: {
            type: Number,
            default: 0 
        },
        width:{
            type: String,
            default: '800px'
        },
        height:{
            type: String,
            default: '400px'
        },
        title:{
            type: String,
            default: ''
        },
        actions:{
            type: Object,
            default(){
                return {
                    close:{
                        title: this.$t('common.close'),
                        icon : '',
                        action: function(data){}

                    }
                }
            }
        }
    },
    created(){
        let thisCpn = this;
        documentApi.getListPrintConfig(this.documentId).then(res=>{
            thisCpn.listPrintConfig = res.data.listObject
        }).catch(err => {}).always(() => {});
    },
    data(){
        return {
            isShow:false,
            docObjectId:0,
            formId:0,
            listPrintConfig:[],
            allObject:{}
        }
    },
    methods:{
        show(){
            this.isShow = true;
        },
        hide(){
            this.isShow = false;
        },
        setDocObjectId(docObjectId){
            this.docObjectId = parseInt(docObjectId);
        },
        chooseItem(event,printConfig){
            $(event.target).siblings().removeClass('active-sb');
            $(event.target).addClass('active-sb');
            this.formId = parseInt(printConfig.formId);
            this.allObject = [{document_object_id:this.docObjectId,formId:this.formId}]
        }
    }
}
</script>
<style scoped>
    .form-tablet{
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        background: white;
        box-shadow: 0px 3px 6px #00000029;
        font-size: 13px;
        z-index: 999;
    }
    .form-tablet__header{
        height: 30px;
        border-bottom: var(--symper-border);
        display: flex;
        padding: 5px 8px;
    }
    .form-tablet__body{
        height: calc(100% - 70px);
        display: flex;
    }
    .form-tablet__sidebar{
        height: 100%;
        width: 150px;
        border-right: var(--symper-border);
        padding: 6px;
    }
    .print-item{
        cursor: pointer;
        transition: all ease-in-out 250ms;
        padding: 5px 8px;
        height: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .print-item:hover{
        background: var(--symper-background-hover);
    }
    .print-item.active-sb{
        background: var(--symper-background-active);
    }

    .btn-close-form{
        margin-left: auto;
        cursor: pointer;
    }
    .form-tablet__detail{
        width: calc(100% - 150px);
        overflow: hidden;
    }
    .form-tablet__footer{
        padding: 4px 0;
        height: 30px;
        text-align: right;
    }
    .form-tablet__footer > button{
        padding: 5px 12px;
        border-radius: 4px;
        margin: 0 8px;
        transition: all ease-in-out 250ms;
        background: var(--symper-background-default);

    }
    .form-tablet__footer > button:focus{
        outline: none;
    }
    .form-tablet__footer > button:hover{
        background: var(--symper-background-hover);
    }
</style>
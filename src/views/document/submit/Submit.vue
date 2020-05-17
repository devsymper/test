<template>
    <div class="sym-form-submit" :style="{'width':docSize}">
        <div v-html="contentDocument">

        </div>
        <button v-on:click="togglePageSize" id="toggle-doc-size">
            <span class="mdi mdi-arrow-horizontal-lock"></span>
        </button>
    </div>
</template>
<script>
import { documentApi } from "./../../../api/Document.js";
import { getInsertionCSS } from "./../../../components/document/documentUtil.js";
import './../../../components/document/documentContent.css';
export default {
    
    data(){
        return {
            contentDocument:null,
            documentId:null,
            docSize:null
        }
    },
    beforeMount(){
        this.docSize = '21cm';
    },
    mounted() {
        
    },
    watch:{
        '$route' (to) {
            console.log(to);
            
            this.documentId = to.params.id;
        }
    },
    created(){
        console.log(getInsertionCSS());
        
        this.documentId = this.$route.params.id;
        let thisCpn = this;
        documentApi.detailDocument(this.documentId).then(res => {
            if (res.status == 200) {
                let content = res.data.document.content;
                thisCpn.contentDocument = content;
            }
        })
        .catch(err => {
            console.log("error from detail document api!!!", err);
        })
        .always(() => {
        });
    },
    watch:{
        
    },
    methods:{
        togglePageSize(){
            this.docSize = (this.docSize == '21cm') ? '100%' : '21cm';
        }
    }
}
</script>
<style  scoped>
    .sym-form-submit{
        width: 21cm;
        padding: 16px;
    }
    .sym-form-submit >>> .on-selected{
        border: none !important;
    }
    .sym-form-submit >>> table:not(.s-control-table) td,
    .sym-form-submit >>> table:not(.s-control-table),
    .sym-form-submit >>> table:not(.s-control-table) th{
        border: none !important;
    }

    #toggle-doc-size{
        position: absolute;
        right: 10px;
        top: 50px;
        padding: 4px 12px;
        font-size: 20px;
        border-radius: 4px;
        background: #fafafa;
        opacity: 1;
        color: #757575;
        transition: ease-in-out 300ms;
    }
    #toggle-doc-size:hover{
        background: #dddddd;
    }
    #toggle-doc-size:focus{
        outline: none;
    }
</style>
<template>
    <div class="sym-document-tab-control">
        <v-text-field
            @input="onSearch($event)"
            placeholder="Tìm kiếm"
            class="tf-search-control fs-13"
            outlined
            dense
            hide-selected
            hide-details
            :height="20"
            >
        </v-text-field>
        <div class="list-control-template">
            <VuePerfectScrollbar style="height:calc(100vh - 115px);">
                <div v-for="i in 100" :key="i" class="control-template-item sym-control" draggable="true">
                    <div class="title-control">
                        <span>Control1</span>
                        <button>...</button>
                    </div>
                    <div class="info-control">
                        <div>
                            <span>Người tạo:</span>
                            <span>Nguyên đình hoàng</span>
                        </div>
                        <div>
                            <span>Thời gian tạo:</span>
                            <span>24/02/2020</span>
                        </div>
                    </div>
                </div>
            </VuePerfectScrollbar>
            
        </div>
        
    </div>
</template>
<script>
import Control from './../../items/Control.vue';
import getControlElement from './../../../../components/document/controlPropsFactory.js';
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
    props:{
        isConfigPrint:{
            type:Boolean,
            default:false
        }
    },
    components:{
        'control' : Control,
        VuePerfectScrollbar
    },
    data: () => ({
        panel: [0, 1, 2, 3, 4],
        listControlPrint:   ['labelPrint'],
        listControlDisplay: ['label','image','qrCode'],
        listControlInput:   ['textInput','richText','number','date','dateTime','time','month','select','department','documentSelect','phone','email','currency','radio','checkbox','color','percent','user','inputFilter','hidden'],
        listControlLayout:  ['table','panel','fileUpload','tabPage'],
        listControlReport:  ['dataFlow','report','approvalHistory','trackingValue'],
        listControlAction:  ['submit','reset','draft']
    }),
    methods:{
        onSearch(event){
            $('.sym-control').removeClass('d-none');
            $('.sym-control:not(:Contains("' + event + '"))').addClass('d-none');
        }
    },
    mounted(){
        $.expr[":"].Contains = jQuery.expr.createPseudo(function(arg) {
            return function( elem ) {
                return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
            };
        });
    }
}
</script>
<style  scoped>
    .sym-document-tab-control .v-list-item{
        min-height : 25px !important;
    }
    .v-expand-header{
        font-size: 13px;
        font-weight: 500;
        min-height: unset;
        padding: 4px 8px;
        background: #f2f2f2;
    }
    .tf-search-control{
        margin: 6px 0px !important;
    }
    
    .sym-document-tab-control .v-expansion-panel{
        margin: 0;
    }
    .sym-list-control{
        overflow: auto;
        max-height: calc(100vh - 110px);
    }
    .control-template-item{
        padding: 4px;
        font-size: 13px;
        cursor: move;
        margin: 4px 0;
        border: var(--symper-border);
        border-radius: 4px;
    }
    .control-template-item .title-control{
        font-weight: 500;
    }
    .control-template-item .info-control{
        font-size: 12px;
    }
</style>

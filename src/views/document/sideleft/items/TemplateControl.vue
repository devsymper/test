<template>
    <div class="sym-document-tab-control">
        <Loader ref="skeletonView"/>
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
                <div v-for="(item,index) in allControlTemplate" :key="index" class="control-template-item" :control-id="item.id" draggable="true">
                    <div class="title-control">
                        <span>{{item.title}}</span>
                            <v-menu offset-y>
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn
                                class="btn-action"
                                dark
                                v-bind="attrs"
                                v-on="on"
                                >
                                <v-icon>mdi-dots-horizontal</v-icon>
                                </v-btn>
                            </template>
                            <v-list class="menu-list">
                                <v-list-item
                                v-for="(action, index) in actions"
                                :key="index+action.title"  @click="action.action(item.id)">
                                    <v-list-item-title>{{ action.title }}</v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                    </div>
                    <div class="info-control">
                        <div>
                            <span>{{$t('common.user_create')}}: </span>
                            <span>{{item.ba_create}}</span>
                        </div>
                        <div>
                            <span>{{$t('common.create_at')}}: </span>
                            <span>{{item.create_at}}</span>
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
import Loader from './../../../../components/common/Loader';
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { documentApi } from '../../../../api/Document';

export default {
    props:{
        isConfigPrint:{
            type:Boolean,
            default:false
        },
        instance:{
            type:Number,
            default:""
        }
    },
    data(){
        return {
            actions: [
                { 
                    title: 'Xóa',action:function(id){
                        let thisCpn = this;
                        documentApi.deleteControlTemplate(id).then(res=>{
                            // let allControlTemplate = thisCpn.allControlTemplate;
                            // let controlTemplate = allControlTemplate.filter(c=>{
                            //     return c.id == id
                            // });
                            // delete allControlTemplate[allControlTemplate.indexOf(controlTemplate[0])]
                            // thisCpn.$store.commit(
                            //     "document/addToDocumentEditorStore",{key:'allControlTemplate',value:allControlTemplate,instance:thisCpn.instance}
                            // );
                        }).catch(err => {
                        })
                        .always(() => {});
                    } 
                    },
                    { title: 'Sửa' ,action:function(){
                        
                    }
                }
            ],
        }
    },
    computed:{
        allControlTemplate(){  
            return this.$store.state.document.editor[this.instance].allControlTemplate;
        },
    },
    components:{
        'control' : Control,
        VuePerfectScrollbar,
        Loader
    },
 
    methods:{
        onSearch(event){
            $('.sym-control').removeClass('d-none');
            $('.sym-control:not(:Contains("' + event + '"))').addClass('d-none');
        },
        getAllControlTemplate(){
            let self = this;
            documentApi.getControlTemplate().then(res=>{
                self.$store.commit(
                    "document/addToDocumentEditorStore",{key:'allControlTemplate',value:res.data,instance:self.instance}
                );
                self.$refs.skeletonView.hide();
            })
        },
    },
    mounted(){
        $.expr[":"].Contains = jQuery.expr.createPseudo(function(arg) {
            return function( elem ) {
                return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
            };
        });
    },
    created(){
        this.getAllControlTemplate()
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
        display: flex;
        font-weight: 500;
    }
    .control-template-item .title-control .btn-action{
        height: 18px;
        width: 20px;
        min-width: 20px;
        background-color:var(--symper-background-default) !important;
        box-shadow: none;
        color: #344750;
        margin-left: auto;
    }
    .control-template-item .title-control .btn-action:focus{
        outline: none;
    }
    .control-template-item .title-control .btn-action >>> .mdi{
        font-size: 16px;
    }
    .control-template-item .info-control{
        font-size: 12px;
    }
    .menu-list >>> .v-list-item{
        min-height: 28px;
        
    }
    .menu-list >>> .v-list-item .v-list-item__title{
        font-size: 13px;
    }
</style>

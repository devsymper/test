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
        <div>
            <v-expansion-panels
            v-model="panel"
            multiple
            class="sym-list-control"
            >
                <v-expansion-panel v-if="isConfigPrint">
                    <v-expansion-panel-header class="v-expand-header">In</v-expansion-panel-header>
                    <v-expansion-panel-content class="sym-v-expand-content">
                        <v-list>
                            <control
                            v-for="control in listControlPrint"
                            :key="control"
                            :type="control"
                            />
                        </v-list>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel v-if="!isConfigPrint">
                    <v-expansion-panel-header class="v-expand-header">Hiển thị</v-expansion-panel-header>
                    <v-expansion-panel-content class="sym-v-expand-content">
                        <v-list>
                            <control
                            v-for="control in listControlDisplay"
                            :key="control"
                            :type="control"
                            />
                        </v-list>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel v-if="!isConfigPrint">
                    <v-expansion-panel-header class="v-expand-header">Input</v-expansion-panel-header>
                    <v-expansion-panel-content class="sym-v-expand-content">
                        <v-list>
                            <control
                            v-for="control in listControlInput"
                            :key="control"
                            :type="control"
                            />
                        </v-list>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel v-if="!isConfigPrint">
                    <v-expansion-panel-header class="v-expand-header">Layout</v-expansion-panel-header>
                    <v-expansion-panel-content class="sym-v-expand-content">
                    <v-list>
                            <control
                            v-for="control in listControlLayout"
                            :key="control"
                            :type="control"
                            />
                        </v-list>
                    </v-expansion-panel-content>
                </v-expansion-panel>

                <v-expansion-panel v-if="!isConfigPrint">
                    <v-expansion-panel-header class="v-expand-header">Report</v-expansion-panel-header>
                    <v-expansion-panel-content class="sym-v-expand-content">
                    <v-list>
                            <control
                            v-for="control in listControlReport"
                            :key="control"
                            :type="control"
                            />
                        </v-list>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel v-if="!isConfigPrint">
                    <v-expansion-panel-header class="v-expand-header">Action</v-expansion-panel-header>
                    <v-expansion-panel-content class="sym-v-expand-content">
                    <v-list>
                            <control
                            v-for="control in listControlAction"
                            :key="control"
                            :type="control"
                            />
                        </v-list>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                
            </v-expansion-panels>
        </div>
        
    </div>
</template>
<script>
import Control from './../../items/Control.vue';
import getControlElement from './../../../../components/document/controlPropsFactory.js';
export default {
    props:{
        isConfigPrint:{
            type:Boolean,
            default:false
        }
    },
    components:{
        'control' : Control,
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
    
</style>
<style>
    .sym-v-expand-content .v-expansion-panel-content__wrap{
        padding: 0;
        
    }
    .sym-v-expand-content .v-list{
        padding: 0 !important;
    }
</style>
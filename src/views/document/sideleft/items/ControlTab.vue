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
            >
                <v-expansion-panel>
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
                <v-expansion-panel>
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
                <v-expansion-panel>
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

                <v-expansion-panel>
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
                <v-expansion-panel>
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
    components:{
        'control' : Control,
    },
    data: () => ({
        panel: [0, 1, 2, 3, 4],
        listControlDisplay: ['label','image','qrCode'],
        listControlInput:   ['textInput','richText','number','date','dateTime','time','month','select','documentSelect','phone','email','currency','radio','checkbox','color','percent','user','inputFilter','hidden'],
        listControlLayout:  ['table','panel','fileUpload'],
        listControlReport:  ['report','approvalHistory','trackingValue'],
        listControlAction:  ['submit','reset','draf']
    }),
    methods:{
        onSearch(event){
            $('.sym-control').removeClass('d-none');
            $('.sym-control:not(:contains("' + event + '"))').addClass('d-none');
        }
    }
}
</script>
<style  scoped>
    .sym-document-tab-control .v-list-item{
        min-height : unset;
    }
    .v-expand-header{
        font-size: 13px;
        font-weight: bold;
        min-height: unset;
        padding: 6px 16px;
        background: #f2f2f2;
    }
    .tf-search-control{
        margin: 12px 6px;
    }
    
    .sym-document-tab-control .v-expansion-panel{
        margin: 0;
    }
    
</style>
<style>
    .sym-v-expand-content .v-expansion-panel-content__wrap{
        padding: 0;
    }
</style>
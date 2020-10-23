<template>
    <v-tabs
        :height="30"
        v-model="sideRightTab"
        grow
        light
        show-arrows
        class="h-100"
        >
        <v-tabs-slider color="sym-tab-slider"></v-tabs-slider>

        <v-tab
            v-for="tab in sideRightTabs"
            :key="tab.id"
            style="margin-bottom: 4px;"
        >
             <v-tooltip right>
                <template v-slot:activator="{ on }">
                    <v-icon style="font-size:16px;color:gray;" v-on="on">{{ tab.icon }}</v-icon>
                </template>
                <span>{{ tab.tab }}</span>
            </v-tooltip>
        </v-tab>
        <v-tab-item
            class="p-2 properties-control-tab"
        >
        <VuePerfectScrollbar style="height:calc(100vh - 90px);">
            <v-expansion-panels
                v-model="panel"
                multiple
                >
                <v-expansion-panel class="m-0" >
                    <v-expansion-panel-header class="v-expand-header">Tên</v-expansion-panel-header>
                    <v-expansion-panel-content class="sym-v-expand-content">
                        <control-props-config  
                        @input-value-keyup="handleKeyupInput"
                        @input-value-changed="handleChangeInput" 
                        @input-blur="handleInputBlur"
                        :singleLine="true" 
                        :labelWidth="`100px`"  
                        :allInputs="controlPropsGroup.name"/>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel class="m-0" >
                    <v-expansion-panel-header class="v-expand-header">Hiển thị</v-expansion-panel-header>
                    <v-expansion-panel-content class="sym-v-expand-content">
                        <control-props-config 
                        @input-value-changed="handleChangeInput" 
                        @input-value-keyup="handleKeyupInput"
                        :singleLine="true" 
                        :labelWidth="`100px`" 
                        :allInputs="controlPropsGroup.display"/>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel class="m-0" >
                    <v-expansion-panel-header class="v-expand-header">In</v-expansion-panel-header>
                    <v-expansion-panel-content class="sym-v-expand-content">
                        <control-props-config 
                        @input-value-changed="handleChangeInput" 
                        :singleLine="true" 
                        :labelWidth="`100px`" 
                        :allInputs="controlPropsGroup.print"/>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel class="m-0" >
                    <v-expansion-panel-header class="v-expand-header">Mapping</v-expansion-panel-header>
                    <v-expansion-panel-content class="sym-v-expand-content">
                        <control-props-config 
                        @input-value-changed="handleChangeInput" 
                        :singleLine="false" 
                        :labelWidth="`100px`" 
                        :allInputs="controlPropsGroup.table"/>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
            </VuePerfectScrollbar>
        </v-tab-item>
        <v-tab-item
            class="h-100 formulas-control-tab"
        >
        <VuePerfectScrollbar style="height:calc(100vh - 90px);">
            <control-props-config 
            @input-blur="handleInputBlur"
            :singleLine="false" 
            @input-value-changed="handleChangeInput" 
            :allInputs="sCurrentDocument.formulas"/>
            <FormAutocomplete/>
        </VuePerfectScrollbar>
        </v-tab-item>

        
    </v-tabs>
</template>
<script>
import FormTpl from "./../../../components/common/FormTpl.vue"
import {checkInTable,checkNameControl,checkTitleControl} from "./../common/common";
import { formulasApi } from "./../../../api/Formulas.js";
import { util } from '../../../plugins/util';
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import FormAutocomplete  from './items/FormAutoComplete'

export default {
    props:{
        instance:{
            type:Number,
            default:Date.now()
        },
        isConfigPrint:{
            type:Boolean,
            default:false
        }
    },
    components:{
        'control-props-config' : FormTpl,
        VuePerfectScrollbar,
        FormAutocomplete
    },
    computed: {
        sCurrentDocument(){
            return this.$store.state.document.editor[this.instance].currentSelectedControl;
        },
        listDataFlow(){
            return this.$store.state.document.editor[this.instance].listDataFlow
        },

        controlPropsGroup(){
            return this.$store.state.document.editor[this.instance].currentSelectedControl.properties;
            // return this.sCurrentDocument.properties;
        }
    },
    watch:{
        "controlPropsGroup.table.mapParamsDataflow.value":function(after){
        },
        /**
         * Tự động focus vào input name sau khi chọn control
         */
        "controlPropsGroup.name":function(){
            setTimeout(() => {
                // $('.sym-v-expand-content input').first().focus();
            }, 200);
        }
        
    },
    data () {
        return {
            panel: [0, 1, 2],
            sideRightTab: null,
            sideRightTabs: [
            {id:'element', tab: 'Thuộc tính' ,icon:'mdi-hammer-screwdriver'},
            {id:'formulas', tab: 'Công thức' ,icon:'mdi-function-variant'},
            
            ],
            listNameValueControl:{},    
            delayTimer:null
        
        }
    },
    methods:{
        handleInputBlur(inputInfo, name){
            
        },
        handleKeyupInput(name, input, data){
            clearTimeout(this.delayTimer);
            this.delayTimer = setTimeout(function(self) {
                self.handleValidateControl(name, input, data)
            }, 100,this);
            if(data.key == 'Tab'){
                this.handleValidateControl(name, input, data)
            }
        },
        setMappingForParamsDataFlow(id,tableId){
            let currentDataflow = this.listDataFlow.filter(df=>{
                return df.id == id;
            })
            try {
                let params = JSON.parse(currentDataflow[0].params);
                this.$store.commit(
                    "document/updateCurrentControlProps",{instance:this.instance,group:'table',prop:'mapParamsDataflow',typeProp:'value',value:params}
                );  
                 this.$store.commit(
                    "document/updateProp",{id:this.sCurrentDocument.id,name:'mapParamsDataflow',value:params,tableId:tableId,type:"value",instance:this.instance}
                );   
            } catch (error) {
                
            }
        },
        handleChangeInput(name, input, data){
            if(input.groupType == "formulas"){
                this.handleValidateControl(name, input, data);
            }
            if(['numberFormat','checkbox','dateFormat'].includes(input.type)){
                input.value = data
                this.handleValidateControl(name, input, data);
            }
            else if(name == 'dataFlowId'){
                input.value = {id:input.value}
                this.handleValidateControl(name, input, data);
            }
        },
        handleValidateControl(name, input, data){
            let value = input.value
            let elements = $('#document-editor-'+this.instance+'_ifr').contents().find('#'+this.sCurrentDocument.id);
            if(name == "width"){
                elements.css({width:value});
                elements.attr('data-mce-style',elements.attr('style'))
            }
            if(name == "height"){
                elements.css({height:value});
                elements.attr('data-mce-style',elements.attr('style'))
            }
            let tableId = checkInTable(elements);
            if( tableId == this.sCurrentDocument.id)
            tableId = '0';
            if(name === "dataFlowId"){
                this.setMappingForParamsDataFlow(data.value,tableId)
            }
            this.$store.commit(
                "document/updateProp",{id:this.sCurrentDocument.id,name:name,value:value,tableId:tableId,type:"value",instance:this.instance}
            );   
            if((name == 'name' || name == 'title') && !this.isConfigPrint){
                checkNameControl(this.instance);
                checkTitleControl(this.instance);
            }
        },
    }
}
</script>
<style scoped>
    .properties-control-tab .v-list-item{
        min-height : unset;
    }
    .v-expand-header{
        font-size: 13px;
        font-weight: 500;
        min-height: unset;
        padding: 4px 8px;
        background: #f2f2f2;
        margin-bottom: 8px;
    }
    .tf-search-control{
        margin: 6px 0px !important;
    }
    
    .properties-control-tab .v-expansion-panel{
        margin: 0;
    }
    .sym-v-expand-content{
        padding-left: 8px;
    }
    .formulas-control-tab ::v-deep .symper-form-input{
        margin-right: 10px;
    }
    .formulas-control-tab{
        padding: 0.5rem 0 0.5rem 0.5rem !important;
    }
</style>
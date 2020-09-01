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
            class="p-2 h-100 properties-control-tab"
        >
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
            <!-- <control-props-config :singleLine="true" :labelWidth="`100px`" :allInputs="sCurrentDocument.properties"/> -->

        </v-tab-item>
        <v-tab-item
            class="p-2 h-100 formulas-control-tab"
        >
            <control-props-config 
            ref="formFormulas"
            @input-blur="handleInputBlur"
            :singleLine="false" 
            @input-value-changed="handleChangeInput" 
            :allInputs="sCurrentDocument.formulas"/>
        </v-tab-item>

        
    </v-tabs>
</template>
<script>
import FormTpl from "./../../../components/common/FormTpl.vue"
import {checkInTable} from "./../common/common";
import { formulasApi } from "./../../../api/Formulas.js";
import { util } from '../../../plugins/util';

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
            // debugger    
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
    created(){
        let thisCpn = this;
        this.$evtBus.$on("symper-app-wrapper-clicked", evt =>{
            if (!$(evt.target).hasClass("mdi-dock-window") && $(evt.target).closest(".symper-drag-panel").length == 0) {
                thisCpn.hideDragPanel();
            }
        })
    },
    methods:{
        hideDragPanel(){
            if(this.$refs.formFormulas != undefined)
                this.$refs.formFormulas.hideDragPanel();
        },
        handleInputBlur(inputInfo, name){
            
        },
        handleKeyupInput(name, input, data){
            clearTimeout(this.delayTimer);
            this.delayTimer = setTimeout(function(self) {
                self.handleValidateControl(name, input, data)
            }, 200,this);
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
            // this.handleValidateControl(name, input, data);
            
        },
        handleValidateControl(name, input, data){
            if(this.isConfigPrint){
                this.savePrintControlConfig(name, input, data);
                return;
            }
            let value = input.value
            let elements = $('#document-editor-'+this.instance+'_ifr').contents().find('#'+this.sCurrentDocument.id);
            if(name == "width"){
                elements.css({width:value});
            }
            if(name == "height"){
                elements.css({height:value});
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

            if(name == 'name' || name == 'title'){
                let currentInput = this.sCurrentDocument.properties.name;
                this.checkNameControl('name', currentInput.name);
                this.checkTitleControl('title', currentInput.title);
            }
        },
        savePrintControlConfig(name, input, data){
            let elements = $('#document-editor-'+this.instance+'_ifr').contents().find('#'+this.sCurrentDocument.id);
            if(name == "formulas"){
                elements.attr('formulas',data);
            }
            else{
                let cssItem = {};
                cssItem[name] = data;
                elements.css(cssItem)
            }
        },
        /**
         * Hàm kiểm tra tên 1 control có bị trùng với các control khác hay không, nếu bị trùng thì thông báo lỗi
         */
        checkTitleControl(name, input){
            let elements = $('#document-editor-'+this.instance+'_ifr').contents().find('#'+this.sCurrentDocument.id);
             elements.removeClass('s-control-error');
            let tableId = checkInTable(elements)
            if( tableId == this.sCurrentDocument.id)
            tableId = '0';
            let errValue = ""
            if(input.value == "" && input.value.length == 0){
                errValue = "Không được bỏ trống tiêu đề control"
                elements.addClass('s-control-error');
            }
            this.$store.commit(
                    "document/updateProp",{id:this.sCurrentDocument.id,name:name,value:errValue,tableId:tableId,type:"errorMessage",instance:this.instance}
                );
            this.$store.commit(
                "document/updateCurrentControlProps",{instance:this.instance,group:'name',prop:'title',typeProp:'errorMessage',value:errValue}
            );   
        },

        /**
         * Hàm kiểm tra tên 1 control có bị trùng với các control khác hay không, nếu bị trùng thì thông báo lỗi
         */
        checkNameControl(name, input){
            let elements = $('#document-editor-'+this.instance+'_ifr').contents().find('#'+this.sCurrentDocument.id);
            let tableId = checkInTable(elements)
            if( tableId == this.sCurrentDocument.id)
            tableId = '0';
            let errValue = ''
            let listValue = Object.values(this.listNameValueControl);
            let dataControl = {value: input.value, match:false,id:this.sCurrentDocument.id};
            if(input.value == "" && input.value.length == 0){
                errValue = "Không được bỏ trống tên control"
                elements.addClass('s-control-error');
            }
            else{
                 if(/^[a-zA-Z_$][a-zA-Z_$0-9]*$/.test(input.value) == false){
                        errValue = "Tên không hợp lệ";
                        elements.addClass('s-control-error');
                    }
                    else{
                        elements.removeClass('s-control-error');
                        let controlConflic = listValue.filter(c=>{
                            return c.value == input.value
                        });
                        if(controlConflic.length > 0){
                            let listContrlIdConflic = controlConflic.reduce((arr,obj)=>[
                                ...arr,obj.id
                            ],[]);
                            dataControl.match = listContrlIdConflic;
                            elements.addClass('s-control-error');
                            for (let index = 0; index < controlConflic.length; index++) {
                                let control = controlConflic[index];
                                // console.log('sa',this.listNameValueControl[control.id]);
                                let newList = util.cloneDeep(listContrlIdConflic);
                                newList.splice(newList.indexOf(control.id),1);
                                newList.push(this.sCurrentDocument.id);
                                this.listNameValueControl[control.id].match = newList;
                                $('#document-editor-'+this.instance+'_ifr').contents().find('#'+control.id).addClass('s-control-error');
                            }
                            if(this.listNameValueControl.hasOwnProperty(this.sCurrentDocument.id)){
                                for (let index = 0; index < this.listNameValueControl[this.sCurrentDocument.id].length; index++) {
                                    const element = this.listNameValueControl[this.sCurrentDocument.id][index];
                                    $('#document-editor-'+this.instance+'_ifr').contents().find('#'+element.id).removeClass('s-control-error')
                                }
                            }
                        }
                        else{
                            if(this.listNameValueControl.hasOwnProperty(this.sCurrentDocument.id)){
                                let controlOldConflic = this.listNameValueControl[this.sCurrentDocument.id].match;
                                for (let index = 0; index < controlOldConflic.length; index++) {
                                    let control = controlOldConflic[index];
                                    this.listNameValueControl[control].match.splice(this.listNameValueControl[control].match.indexOf(this.sCurrentDocument.id),1);
                                    if(this.listNameValueControl[control].match.length == 0)
                                    $('#document-editor-'+this.instance+'_ifr').contents().find('#'+control).removeClass('s-control-error')
                                }
                            }
                            $('#document-editor-'+this.instance+'_ifr').contents().find('#'+this.sCurrentDocument.id).removeClass('s-control-error')
                        }
                    }
                
            }
            this.listNameValueControl[this.sCurrentDocument.id] = dataControl;
            this.$store.commit(
                "document/updateProp",{id:this.sCurrentDocument.id,name:name,value:errValue,tableId:tableId,type:"errorMessage",instance:this.instance}
            );  
            this.$store.commit(
                "document/updateCurrentControlProps",{instance:this.instance,group:'name',prop:'name',typeProp:'errorMessage',value:errValue}
            );   
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
    .properties-control-tab,.formulas-control-tab{
        overflow: auto;
        max-height: calc(100vh - 65px);
    }
    .sym-v-expand-content{
        padding-left: 8px;
    }
</style>
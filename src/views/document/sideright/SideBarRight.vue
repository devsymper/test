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
            style="margin-bottom: 4px;width:30px;min-width:unset;"
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
                :instance="instance"
                :allInputs="sCurrentDocument.formulas"/>
            </VuePerfectScrollbar>
        </v-tab-item>
         <v-tab-item
            class="h-100 style-form-tab"
            >
            <VuePerfectScrollbar style="height:calc(100vh - 90px);">
                <h3 class="pl-2">Thông tin định dạng</h3>
                <table class="general-info">
                    <tr v-for="(value,key) in listStyle" :key="key">
                        <td class="p-2">{{key}}:</td>
                        <td class="pl-2">{{value}}</td>
                    </tr>
                </table>
            </VuePerfectScrollbar>
        </v-tab-item>

        
    </v-tabs>
</template>
<script>
import FormTpl from "./../../../components/common/FormTpl.vue"
import {checkInTable,checkNameControl,checkTitleControl} from "./../common/common";
import VuePerfectScrollbar from "vue-perfect-scrollbar";

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
    },
    computed: {
        sEditor(){
            return this.$store.state.document.editor[this.instance]
        },
        sCurrentDocument(){
            return this.sEditor.currentSelectedControl;
        },
        listDataFlow(){
            return this.sEditor.listDataFlow
        },

        controlPropsGroup(){
            return this.sEditor.currentSelectedControl.properties;
        },
        listStyle(){
            return this.$store.state.document.documentStyle[this.instance];   
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
        },
        /**
         * trường hợp table cần lấy thông tin các control trong table để cho phép chọn cột primary key
         */
        "controlPropsGroup.display.tablePrimaryKey":function(before,after){
            if(before){
                let currentControlId = this.sCurrentDocument.id;
                if(currentControlId && this.sEditor.allControl[currentControlId]){
                    let allControlInTable = this.sEditor.allControl[currentControlId].listFields;
                    let items = [];
                    for(let controlId in allControlInTable){
                        let controlprops = allControlInTable[controlId].properties;
                        let item = {value:controlprops.name.value, text:controlprops.title.value};
                        items.push(item);
                    }
                    this.sCurrentDocument.properties.display.tablePrimaryKey.options = items;
                }
            }
        },
     
    },
    data () {
        return {
            panel: [0, 1, 2],
            sideRightTab: null,
            sideRightTabs: [
                {id:'element', tab: 'Thuộc tính' ,icon:'mdi-hammer-screwdriver'},
                {id:'formulas', tab: 'Công thức' ,icon:'mdi-function-variant'},
                {id:'style', tab: 'Trình bày' ,icon:'mdi-format-line-style'},
            ],
            listNameValueControl:{},    
            delayTimer:null,
            styles:null
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
                let datasets = currentDataflow[0].datasets;
                this.$store.commit(
                    "document/updateCurrentControlProps",{instance:this.instance,group:'table',prop:'mapParamsDataflow',typeProp:'value',value:params}
                );  
                this.$store.commit(
                    "document/updateProp",{id:this.sCurrentDocument.id,name:'mapParamsDataflow',value:params,tableId:tableId,type:"value",instance:this.instance}
                );   
                this.$store.commit(
                    "document/updateProp",{id:this.sCurrentDocument.id,name:'mapParamsDataflow',value:datasets,tableId:tableId,type:"datasets",instance:this.instance}
                );   
            } catch (error) {
                
            }
        },
        handleChangeInput(name, input, data){
            
            if(input.groupType == "formulas"){
                let tableId = this.getTableWrapControl();
                if(name == "autocomplete" && typeof data == 'object'){
                    this.$set(input.configData,'treeData',data.treeData);
                    this.$set(input.configData,'documentSelected',data.documentSelected);
                    this.$set(input.configData,'columnSelected',data.columnSelected);
                    this.$set(input.configData,'rejectInput',data.rejectInput);
                    this.$set(input,'value',data.sql);
                    this.$store.commit(
                        "document/updateProp",{id:this.sCurrentDocument.id,name:name,value:input.configData,tableId:tableId,type:'configData',instance:this.instance}
                    );  
                }
                else if(name == "linkConfig"){
                    this.$set(input,'configData',data);
                    this.$store.commit(
                        "document/updateProp",{id:this.sCurrentDocument.id,name:name,value:input.configData,tableId:tableId,type:'configData',instance:this.instance}
                    );  
                }
                this.handleValidateControl(name, input, data);
            }
            if(['numberFormat','checkbox','dateFormat'].includes(input.type)){
                input.value = data;
                this.handleValidateControl(name, input, data);
            }
            else if(name == 'dataFlowId'){
                input.value = {id:input.value}
                this.handleValidateControl(name, input, data);
            }
            else if(input.type == 'select'){
                this.handleValidateControl(name, input, data);
            }
        },
        /**
         * Hàm lấy id của table chứa control
         */
        getTableWrapControl(){
            let elements = $('#document-editor-'+this.instance+'_ifr').contents().find('#'+this.sCurrentDocument.id);
            let tableId = checkInTable(elements);
            if( tableId == this.sCurrentDocument.id){
                tableId = '0';
            }
            return tableId
        },
        /**
         * Hàm xử lí các thuộc tính của control trước khi đẩy lên store
         */
        handleValidateControl(name, input, data){
            let value = input.value
            let elements = $('#document-editor-'+this.instance+'_ifr').contents().find('#'+this.sCurrentDocument.id);
            if(name == "width"){
                elements.css({width:value});
                elements.attr('data-mce-style',elements.attr('style'));
            }
            if(name == "height"){
                elements.css({height:value});
                elements.attr('data-mce-style',elements.attr('style'));
            }
            let tableId = this.getTableWrapControl();
            if(name === "dataFlowId"){
                this.setMappingForParamsDataFlow(data.value,tableId)
            }
            let propType = "value";
            this.$store.commit(
                "document/updateProp",{id:this.sCurrentDocument.id,name:name,value:value,tableId:tableId,type:propType,instance:this.instance}
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
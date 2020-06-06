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
                        <control-props-config @input-value-changed="handleChangeInput" :singleLine="true" :labelWidth="`100px`"  :allInputs="controlPropsGroup.name"/>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel class="m-0" >
                    <v-expansion-panel-header class="v-expand-header">Hiển thị</v-expansion-panel-header>
                    <v-expansion-panel-content class="sym-v-expand-content">
                        <control-props-config @input-value-changed="handleChangeInput" :singleLine="true" :labelWidth="`100px`" :allInputs="controlPropsGroup.display"/>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel class="m-0" >
                    <v-expansion-panel-header class="v-expand-header">In</v-expansion-panel-header>
                    <v-expansion-panel-content class="sym-v-expand-content">
                        <control-props-config @input-value-changed="handleChangeInput" :singleLine="true" :labelWidth="`100px`" :allInputs="controlPropsGroup.print"/>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
            <!-- <control-props-config :singleLine="true" :labelWidth="`100px`" :allInputs="sCurrentDocument.properties"/> -->

        </v-tab-item>
        <v-tab-item
            class="p-2 h-100 formulas-control-tab"
        >
            <control-props-config :singleLine="false" @input-value-changed="handleChangeInput" :allInputs="sCurrentDocument.formulas"/>
        </v-tab-item>

        
    </v-tabs>
</template>
<script>
import FormTpl from "./../../../components/common/FormTpl.vue"
export default {
    components:{
        'control-props-config' : FormTpl,
    },
    computed: {
        sCurrentDocument(){
            console.log( this.$store.state.document.editor.currentSelectedControl);
            
            return this.$store.state.document.editor.currentSelectedControl;
        },

        controlPropsGroup(){
            return this.sCurrentDocument.properties;
            
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
        
        }
    },
    methods:{
        handleChangeInput(name, input, data){
            let value = input.value
            let elements = $('#editor_ifr').contents().find('#'+this.sCurrentDocument.id);
            if(name == "width"){
                elements.css({width:value});
            }
            if(name == "height"){
                elements.css({height:value});
            }
          
            let table = elements.closest('.s-control-table');
            let tableId = '0'
            if(table.length > 0 && this.sCurrentDocument.id != table.attr('id')){
                let id = table.attr('id');
                tableId = id
            }
            this.$store.commit(
                "document/updateProp",{id:this.sCurrentDocument.id,name:name,value:value,tableId:tableId}
            );   
        }
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
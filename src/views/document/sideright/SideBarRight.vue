<template>
    <v-tabs
        :height="30"
        v-model="sideRightTab"
        grow
        light
        show-arrows
        >
        <v-tabs-slider color="teal lighten-3"></v-tabs-slider>

        <v-tab
            v-for="tab in sideRightTabs"
            :key="tab.id"
        >
            {{ tab.tab }}
        </v-tab>
        <v-tab-item
            class="p-2"
        >
            <!-- <v-expansion-panels
                v-model="panel"
                multiple
                >
                <v-expansion-panel class="m-0">
                    <v-expansion-panel-header class="v-expand-header">Tên</v-expansion-panel-header>
                    <v-expansion-panel-content class="sym-v-expand-content">
                        <control-props-config :allInputs="controlProps.properties"/>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel class="m-0">
                    <v-expansion-panel-header class="v-expand-header">Hiển thị</v-expansion-panel-header>
                    <v-expansion-panel-content class="sym-v-expand-content">
                        <control-props-config :allInputs="controlPropsInSession"/>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel class="m-0">
                    <v-expansion-panel-header class="v-expand-header">In</v-expansion-panel-header>
                    <v-expansion-panel-content class="sym-v-expand-content">
                        <control-props-config :allInputs="controlProps.properties"/>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels> -->
            <control-props-config :singleLine="true" :labelWidth="'100px'" :allInputs="sCurrentDocument.properties"/>

        </v-tab-item>
        <v-tab-item
            class="p-2"
        >
        <control-props-config :allInputs="sCurrentDocument.formulas"/>
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
            return this.$store.state.document.editor.currentSelectedControl;
        },

        controlPropsGroup(){
            let allProps = this.$store.state.document.editor.currentSelectedControl.properties;
            let result = Object.keys(allProps).map(function(key) {
                return { type: key, prop: control[key] };
            });
        }
    },
    data () {
        return {
            panel: [0, 1, 2],
            sideRightTab: null,
            sideRightTabs: [
            {id:'element', tab: 'Thuộc tính' },
            {id:'formulas', tab: 'Công thức' },
            
            ],
        
        }
    },
}
</script>
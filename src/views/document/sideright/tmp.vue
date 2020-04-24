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
            
          
        >
        <v-expansion-panels
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
           <!-- <control-props-config :allInputs="controlProps.properties"/> -->
        </v-expansion-panels>
            
        </v-tab-item>
        <v-tab-item
            class="p-2"
        >
           <control-props-config :allInputs="controlProps.formulas"/>

            
        </v-tab-item>

        
    </v-tabs>
</template>
<script>
import FormTpl from "./../../../components/common/FormTpl.vue"
export default {
  components:{
    'control-props-config' : FormTpl
  },
  computed: {
      controlProps(){ 
          return this.$store.state.document.editor.currentSelectedControl;
      },
      controlPropsInSession(){
          let props = this.$store.state.document.editor.currentSelectedControl;
          for(p of props){
              console.log(p);
              
          }
          return props;
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
<style scoped>
    .v-expand-header{
        font-size: 13px;
        font-weight: bold;
        min-height: unset;
        padding: 6px 16px;
        background: #f2f2f2;
    }
</style>
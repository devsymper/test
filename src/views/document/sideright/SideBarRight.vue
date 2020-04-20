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
           <control-props-config :allInputs="controlProps.properties"/>

            
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
      }
    },
    data () {
      return {
        
        sideRightTab: null,
        sideRightTabs: [
          {id:'element', tab: 'Thuộc tính' },
          {id:'formulas', tab: 'Công thức' },
          
        ],
       
      }
    },
}
</script>
<template>
    <v-tabs
        :height="30"
        v-model="sideLeftTab"
        grow
        light
        show-arrows
        >
        <v-tabs-slider color="teal lighten-3"></v-tabs-slider>

        <v-tab
            v-for="tab in sideLeftTabs"
            :key="tab.id"
        >
            {{ tab.tab }}
        </v-tab>
        <v-tab-item
            v-for="tab in sideLeftTabs"
            :key="tab.id"
        >
            <control-tab v-if="tab.id == 'control'">

            </control-tab>

            
        </v-tab-item>

        
    </v-tabs>
</template>
<script>
import ControlTab from './items/ControlTab'

export default {
    components: {
        'control-tab' : ControlTab,
    },
    data () {
      return {
        sideLeftTab: null,
        sideLeftTabs: [
          {id:'control', tab: 'Control', content: 'Control' },
          {id:'listControl', tab: 'Danh sách control', content: 'Danh sách control' },
          {id:'controlPack', tab: 'Control Package', content: 'Control Package' },
          
        ],
       
       
      }
    },
}
</script>
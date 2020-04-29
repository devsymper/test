<template>
    <v-tabs
        :height="30"
        class="s-tabs"
        v-model="sideLeftTab"
        grow
        light
        show-arrows
        >
        <v-tabs-slider color="teal lighten-3"></v-tabs-slider>

        <v-tab
            class="v-tab-control"
            v-for="tab in sideLeftTabs"
            :key="tab.id"
            style="margin-bottom: 4px;"
        >
            <v-tooltip right>
                <template v-slot:activator="{ on }">
                    <v-icon style="font-size:18px;" v-on="on">{{ tab.icon }}</v-icon>
                </template>
                <span>{{ tab.content }}</span>
            </v-tooltip>
        </v-tab>
        <v-tab-item
            v-for="tab in sideLeftTabs"
            :key="tab.id"
        >
            <control-tab v-if="tab.id == 'control'">

            </control-tab>
            <list-control-tab v-if="tab.id == 'listControl'">

            </list-control-tab>

            
        </v-tab-item>

        
    </v-tabs>
</template>
<script>
import ControlTab from './items/ControlTab'
import ListControlTab from './items/ListControlTab.vue'

export default {
    components: {
        'control-tab' : ControlTab,
        'list-control-tab' : ListControlTab,
    },
    data () {
      return {
        sideLeftTab: null,
        sideLeftTabs: [
          {id:'control', tab: 'Control',icon:'mdi mdi-drag-variant', content: 'Control' },
          {id:'listControl', tab: 'Danh sách control',icon:'mdi mdi-format-list-text', content: 'Danh sách control' },
          {id:'controlPack', tab: 'Control Package',icon:'mdi mdi-package-variant', content: 'Control Package' },
          
        ],
       
       
      }
    },
}
</script>
<style scoped>
    .v-tab-control{
        min-width: unset;
        width: 30px;
    }
    .s-tabs{
        padding-left: 8px;
        padding-right: 8px;
    }
    
</style>
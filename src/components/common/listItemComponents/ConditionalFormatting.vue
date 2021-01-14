<template>
<div class="mt-2 condition-format">
    <AddConditionalFormatting 
        v-if="typeFormart!='config'"
        @changeToConfig="changeToConfig()"
        @click="typeFormart='config'"/>
    <ConfigConditionalFormatting 
        v-else
        @changeToAdd="changeToAdd()"
        v-model="data"
        :tableColumns="tableColumns"
        :headerPrefixKeypath="headerPrefixKeypath"
        @click="typeFormart='config'"/>
</div>
</template>
<script>
import AddConditionalFormatting from "./AddConditionalFormatting";
import ConfigConditionalFormatting from "./ConfigConditionalFormatting";

export default {
    props: {
      value:{
        type: Object,
            default(){
                return {}
            }
      },
      tableColumns: {
            type: Array,
                default(){
                    return []
                }
        },
        headerPrefixKeypath:{
            type: String,
            default: ''
        }
  },
  data () {
    return {
        typeFormart:'add',
        data:{
            nameGroup:'',
            tableColumns:[],
            displayMode:{
                singleColor:{},
                colorScale:{}
            }
        },
        listData:[]
    }
  },
  components:{
    ConfigConditionalFormatting,
    AddConditionalFormatting,
  },
  methods: {
      changeToConfig(){
          this.typeFormart='config'
      },
       changeToAdd(){
          this.typeFormart='add'
      }
  }
}
</script>

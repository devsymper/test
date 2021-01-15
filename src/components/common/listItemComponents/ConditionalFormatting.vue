<template>
<div class="mt-2 condition-format">
    <AddConditionalFormatting 
        v-if="typeFormart!='config'"
        :listData="listData"
        @apply-config="applyConfig"
        @changeToConfig="changeToConfig()"
        @click="typeFormart='config'"/>
    <ConfigConditionalFormatting 
        v-else
        @changeToAdd="changeToAdd()"
        v-model="data"
        @save='save()'
        :conditionalFormat="conditionalFormat"
        :tableColumns="tableColumns"
        :headerPrefixKeypath="headerPrefixKeypath"
        @click="typeFormart='config'"/>
</div>
</template>
<script>
import AddConditionalFormatting from "./AddConditionalFormatting";
import ConfigConditionalFormatting from "./ConfigConditionalFormatting";

export default {
  created () {
     this.listData=this.conditionalFormat
  },
    props: {
         conditionalFormat:{
             type: Array,
                default(){
                    return []
                }
        },
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
            tableColumnsJS:'',
            displayMode:{
                type:'singleColor',
                singleColor:{
                    backgroundColor: '#FFFFFF',
                    fontColor: '#000000',
                    italic: false,
                    bold: false,
                    fontSize: 13,
                    underline: false,
                    strike: false,
                    conditionFormat:'',
                    originCondition:[]
                    },
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
      },
      save(){
          debugger
          this.listData.push(this.data)
          this.$emit('save',this.listData)
      },
      applyConfig(index){
          this.$emit('apply-config',index)
      }
  }
}
</script>

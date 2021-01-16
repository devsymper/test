<template>
<div class="mt-2 condition-format">
    <AddConditionalFormatting 
        v-if="typeFormart!='config'"
        :listData="listData"
        @edit-config="editConfig"
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
                colorScale:{
                    applyColumn:'',
                    config:[
                         {
                            name:'Min point',
                            value:'',
                            disable:false,
                            type:'Min value',
                            color:'red',
                            lists: ['Min value','Number','Percent'],
                        },
                        {
                            name:'Mid point',
                            value:'',
                            disable:false,
                            type:'None',
                            color:'red',
                            lists: ['None','Number','Percent'],
                        },
                        {
                            name:'Max point',
                            value:'',
                            disable:false,
                            type:'Max value',
                            color:'yellow',
                            lists:['Max value','Number','Percent'],
                        }
                    ]
                }
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
          this.typeFormart='config';
          this.data.displayMode = this.typeFormart;
      },
       changeToAdd(){
          this.typeFormart='add';
          this.data.displayMode = this.typeFormart;

      },
      save(){
          debugger
          this.listData.push(this.data)
          this.$emit('save',this.listData)
      },
      applyConfig(index){
          this.$emit('apply-config',index)
      },
       editConfig(index){
        this.typeFormart='config';
        this.data=this.listData[index];
      }
  }
}
</script>

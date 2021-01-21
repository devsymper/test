<template>
<div class="mt-2 condition-format">
    <AddConditionalFormatting 
        v-if="typeFormart!='config'"
        :listData="listData"
        @change-format="changeFormat"
        @changeToConfig="changeToConfig()"
        @click="typeFormart='config'"/>
    <ConfigConditionalFormatting 
        v-else
        @changeToAdd="changeToAdd()"
        v-model="data"
        @save='save()'
        :isUpdate="update"
        :rowData="rowData"
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
  watch: {
      conditionalFormat:{
           deep: true,
            immediate: true,
            handler(value){
                this.listData=this.conditionalFormat
            }
      }
  },
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
        rowData:{
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
        update:true,
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
                            color:'#FF0000',
                            lists: ['Min value','Number'],
                        },
                        {
                            name:'Mid point',
                            value:'',
                            disable:false,
                            type:'None',
                            color:'#FF0000',
                            lists: ['None','Number'],
                        },
                        {
                            name:'Max point',
                            value:'',
                            disable:false,
                            type:'Max value',
                            color:'#FFFF00',
                            lists:['Max value','Number'],
                        }
                    ],
                    listColors:[]
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
          this.update = false;
      },
       changeToAdd(){
           this.update = true;
          this.typeFormart='add';
           this.listData = this.conditionalFormat
      },
      changeFormat(data){
          this.$emit('change-format',data);
          if(data.type == 'edit'){
               this.typeFormart = 'config';
                this.data = this.listData[data.index];
          }
      },
      save(){
          this.listData.push(this.data)
          this.$emit('save',this.listData)
      },
      
  }
}
</script>

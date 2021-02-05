<template>
<div class="mt-2 condition-format">
    <AddConditionalFormatting 
        v-if="typeFormart!='config'"
        :listData="listData"
        @change-format="changeFormat"
        @change-apply="changeApply"
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
     this.listData=this.conditionalFormat;
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
        update:false,
        typeFormart:'add',
        data:{
            nameGroup:'',
            isSelected:false,
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
        dataUpdateIdx:0,
        dataOrigin:{ nameGroup:'',
            isSelected:false,
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
            }},
            
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
          this.update = false
      },
       changeToAdd(){
        this.typeFormart='add';
        this.data = this.dataOrigin
        this.listData = this.conditionalFormat;
        this.update = false
      },
      changeFormat(data){
          this.$emit('change-format',data);
          if(data.type == 'edit'){
              this.update = true;
                this.typeFormart = 'config';
                this.data = this.listData[data.index];
                this.dataUpdateIdx = data.index
          }else{
              this.update = false
          }
      },
       changeApply(data){
          this.$emit('change-apply',data);
          this.update = false
      },
      save(){
          if(!this.update){
            this.listData.push(this.data)
            
          }else{
              this.listData[this.dataUpdateIdx] = this.data
          }
         this.$emit('save',this.listData);
        this.changeToAdd()
      },
      
  }
}
</script>

<template>
    <div class="w-100 mb-1"  >
        <div class="w-100">
       <!-- test -->
       <!-- test -->
       <v-menu v-for="(item, type) in items" :key="type"
            :nudge-top="150"
            :close-on-content-click="false" 
            >
           <template v-slot:activator="{on:menu}"  >
               <v-tooltip top >
                <template v-slot:activator="{ on:tooltip}">
                    <v-btn 
                        @click="highlight(type)" 
                        x-small text
                        v-on="{...menu,...tooltip}"
                        :class="{'hight-light':item.check&&item.check!='color','background-orange':item.check=='color'}"
                        :style="{'color': getColor(item.type)}"
                    >   
                        <v-icon size='16'>{{item.icon}}</v-icon>

                    </v-btn>
                </template>
            <span>{{item.text}}</span>
        </v-tooltip>
           </template>
            <PickColor v-if="item.type=='FontColor'" v-model="value.fontColor"
            />
            <PickColor v-if="item.type=='BackgroundColor'" v-model="value.backgroundColor"
            />
       </v-menu>
        </div>
     <TreeSqlConfig style="margin-left:-15px"
        ref="treeConfig" 
        :listColumn="tableColumnsForTree" 
     />
       
</div>
</template>
<script>
import PickColor from "./PickColor"
import TreeSqlConfig from "./../../../views/document/sideright/items/TreeSqlConfig"
export default {
    components:{
        PickColor,
        TreeSqlConfig
    },
  methods: {
      highlight(actionIdx){
          this.items.map((item,i)=>{
              if(i==actionIdx&&item.check!='color'){
                  this.items[i].check =!this.items[i].check
              }
          })
      },
      getJsScript(){
          this.treeItemToJS(this.treeData);
      },
      treeItemToJS(node){
           if(!node.condition){
            // let varName = node.column;
            let varName = `row['${node.columnTitle}']`;
            let columnDataType = node.columnDataType;
            let value = node.value;
            if(columnDataType != 'number'){
                value = `'${value}'`;
            }
            let functionName = node.operand;
            return ` mo.${functionName}(${varName}, ${value}) `;
        }else if(node.condition){
            let arrCond = [];
            for(let childNode of node.children){
                let itemCond = this.treeItemToJSCondition(childNode);
                arrCond.push(itemCond);
            }
            let opr = logicalOperand[node.label];
            let cond = arrCond.join(opr);
            return ` (${cond}) `;
        }

      },
      getColor(type){
          let color = "black";
          if(type=='BackgroundColor'){
              debugger
              color = this.value.backgroundColor

          }
          if(type=='FontColor'){
              color = this.value.fontColor 
          }
          return color
      },
  },
  created () {
        this.tableColumns.map((column,index)=>{
            if(index!=0){
                this.formatTableColumn.push(column);
                this.tableColumnsForTree.push(column);
                this.tableColumnsForTree[index-1].title=column.field;
            }
      })
  },
  props: {
      tableColumns:{
        type: Array,
            default(){
                return []
            }
      }
  },
     data(){
        return {
            treeData:[],
            tableColumnsForTree:[],
            scriptCondition:'',
            treeConfigData:null,
            listColumn:[],
            formatTableColumn:[],
            items: [
                 {
                    check: false,
                    icon: 'mdi-format-italic',
                    text: 'Italic',
                    type: 'Italic',
                },
                 {
                    check: false,
                    icon: 'mdi-format-bold',
                    text: 'Bold',
                    type: 'Bold',

                },
                 {
                    check: false,
                    icon: 'mdi-format-underline',
                    text: 'Under line',
                    type: 'UnderLine'
                },
                 {
                    check: 'color',
                    icon: 'mdi-format-color-fill',
                    text: 'Background color',
                    type:'BackgroundColor'
                },
                {
                    check: 'color',
                    icon: 'mdi-format-color-text',
                    text: 'Font color',
                    type:'FontColor'

                }],
            value:{
                    backgroundColor: '#FFFFFF',
                    fontColor: '#000000',
                    italic: false,
                    bold: false,
                    fontSize: 13,
                    underline: false,
                    strike: false
            }
        }
    }
}
</script>
<style >
.v-input__slot{
    min-height: 26px!important;
    max-height:26px!important
}
.v-input__icon{
    margin-top:-15px!important
}
.v-select__selections{
    font-size:13px!important
}
.hight-light{
    background-color:#f5863417;
    color:#f58634!important
}
.background-orange{
    background:#f5863417
}
.v-btn:not(.v-btn--round).v-size--x-small{
    padding: 0 2px!important;
    margin-right:2px!important;
    min-width:26px!important
}
.v-menu__content {
    background:white!important;
    left:1237!important
}
</style>
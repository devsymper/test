<template>
    <div class="w-100 mb-1"  >
        <div class="w-100">
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
  watch: {
  },
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
          this.value.conditionFormat = this.treeItemToJS(this.$refs.treeConfig.treeData[0]);
          this.value.originCondition = this.$refs.treeConfig.treeData[0];
          this.$emit('change',this.value )
      },
      checkTypeCol(field){
          let type = 'string';
          if(typeof this.rowData[field]=='number'){
              type = 'number'
          }
          return type;

      },
      getTypeCol(nameTable){
          let type = '';
          this.tableColumns.map(t=>{
              if(t.name==nameTable){
                  type = t.type
              }
          })
          return type;

      },
      getFieldTb(nameTb){
        let field = '';
        this.tableColumns.map(t=>{
              if(t.name==nameTb){
                  field = t.field
              }
        })
        return field
      },
      // kiểm tra toán tử có tồn tại trong list cần format không
      checkIsInListOpr(opr){
          let check = false;
          this.listOperators.map(operator=>{
              if(operator.name==opr){
                  check=true
              }
          })
          return check;
      },
      // chuyển toán tử về dạng đúng format trong js
      formatOperator(name){
        let value = name;
        this.listOperators.map(opr=>{
            if(this.checkIsInListOpr(opr.name)){
                 if(opr.name==name){
                    value = opr.value}
            }else{
                    value = name
                }
        })
        return value
        },

      // chuyển cây điều kiện sang câu lệnh js
      treeItemToJS(node){
           if(!node.condition){
            let field = this.getFieldTb(node.column);
            let typeCol = this.getTypeCol(node.column);
            let conditionName = `e.data.${field}`;
            let column = node.column;
            let value = '';
            if(typeCol=='numeric'&&this.checkTypeCol(field)=='number'){
                 value = node.value;
            }else{
                value = "'"+node.value+"'";
            }
            let functionName = this.formatOperator(node.operator);
            return ` (${conditionName}${functionName} ${value}) `;
        }else if(node.condition){
            let arrCond = [];
            for(let childNode of node.children){
                let itemCond = this.treeItemToJS(childNode);
                arrCond.push(itemCond);
            }
            let opr = node.name=="OR"?'||':'&&';
            let cond = arrCond.join(opr);
            return ` (${cond}) `;
        }

      },
      getColor(type){
          let color = "black";
          if(type=='BackgroundColor'){
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
                this.tableColumnsForTree[index-1].title=column.name;
            }
      });
    //    if(this.value.originCondition){
    //       this.$refs.treeConfig.treeData[0] = this.value.originCondition};
  },
  props: {
        rowData:{
             type: Array,
                default(){
                    return []
                }
        },
      tableColumns:{
        type: Array,
            default(){
                return []
            }
      },
      value:{
          type:Object,
          default(){
                return {}
        }
      }
  },
     data(){
        return {
            treeData:[],
            listOperators:[
                {
                    name:'=',
                    value:'=='
                },
                {
                    name:'<>',
                    value:'!='
                },
                {
                    name:'!>',
                    value:'<='
                },
            ],
            tableColumnsForTree:[],
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
            // value:{
            //         backgroundColor: '#FFFFFF',
            //         fontColor: '#000000',
            //         italic: false,
            //         bold: false,
            //         fontSize: 13,
            //         underline: false,
            //         strike: false,
            //         conditionFormat:'',
            //         originCondition:[]
            // }
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
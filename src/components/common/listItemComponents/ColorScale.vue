<template>
    <div>
        <div class="mb-1">
            Cột lấy giá trị 
        </div>
        <div>
            <v-select 
                 item-value="field"
                item-text="title"
                return-object
                outlined
                :items="formatTableColumn" 
                v-model="applyColumn" >
            </v-select>
        </div>
           <div style="margin-top:-20px" class="mb-10">
            Preview 
            <div style="float:right; " class="mt-1 mr-1">
                <div 
                    :style="{'background-image':'linear-gradient(to right, '+value.config[0].color+','+ value.config[1].color+','+value.config[2].color+')'}"
                    style="width:150px;border:1px solid black;height:20px; background:blue"></div>
            </div>
        </div>
        <div v-for="(item,index) in settingPoint" :key="index" style="margin-top:-30px">
            <div>
                {{item.name}}
            </div>
            <v-row>
                <v-select
                    :items="item.lists" 
                    outlined
                    v-model="item.type"
                    class="mr-2"
                    style="width:100px!important" >
                </v-select>
                <v-text-field
                    outlined
                    dense
                    :disabled="item.disable"
                    v-model="item.value"
                    style="width:75px!important"
                    >
                ></v-text-field>
                <v-menu >
                    <template v-slot:activator="{ on}"  >
                        <v-btn 
                            x-small text
                            v-on="on" >   
                            <v-icon  :style="{'color':item.color}" size='16'>mdi-format-color-fill</v-icon>
                        </v-btn>
                    </template>
                <PickColor v-model="item.color"
                />
        </v-menu>
        </v-row>
        </div>
        <div>
        </div>
    </div>
</template>
<script>

import Gradient from "javascript-color-gradient";
import PickColor from "./PickColor"
export default {
    
  methods: {
      // trường hợp min value và max value với số 
      handleMinMaxValue(){
        let maxValue = Math.max(...this.listsValue);
        let minValue = Math.min(...this.listsValue);
        let midPoint = maxValue-minValue+1;
        const minColor = this.settingPoint?this.settingPoint[0].color:'';
        const midColor = this.settingPoint?this.settingPoint[0].color:'';
        const maxColor = this.settingPoint?this.settingPoint[0].color:''
        const colorGradient = new Gradient();
        let listColor = colorGradient.setGradient(minColor, midColor,maxColor).setMidpoint(midPoint).getArray()
        listColor.map((color,i)=>{
            this.dataColumnsAndColor.map((data,j)=>{
                let distance = data.name-minValue// tính khoảng cách giá trị so với phần tử đầu
                data.backgroundColor = listColor[distance]
            })
     });
     debugger
     this.value.listColors= this.dataColumnsAndColor
        
          
      },
      countMidPoint(){
          let listId = [];
          for(let i = 900;i<1100;i++){
            this.listId.push({name:i,color:''})
          }
          return this.listId.length;
      },
      setValue(){
        this.formatTableColumn=this.tableColumns.filter((t,i)=>i!=0);
        this.value.applyColumn= this.formatTableColumn[0];
        this.settingPoint = this.value.config;
        this.applyColumn = this.value.applyColumn;
        
      }
     
  },
      watch: {
      applyColumn(){
          let dataColumnsAndColor = [];
          let listsValue = [];
          this.rowData.map(r=>{
              dataColumnsAndColor.push({
                  name:r[this.applyColumn.field],
                  backgroundColor: ''
              }),
              listsValue.push(r[this.applyColumn.field]);
          })
          this.dataColumnsAndColor = dataColumnsAndColor
          this.listsValue = listsValue;

      },
      settingPoint:{
            deep: true,
            immediate: true,
            handler(value){
                this.handleMinMaxValue()
                // const colorGradient = new Gradient();
                // const minValue = value.config[0].color;
                // const midValue = value.config[1].color;
                // const maxValue = value.config[2].color;
                // let midPoint = this.countMidPoint();
                // colorGradient.setGradient(minValue, midValue,midValue).setMidpoint(midPoint).getArray().map((c,i)=>{
                //     this.listId[i].color=c
                // });
                
            }
      }
  },
  props: {
     value:{
          type:Object,
          default(){
                return {}
        }
      },
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
  }
  },
    components:{
        PickColor
    },
  created () {
      this.setValue()
      
  },
  data () {
    return {
        listsValue:[],
        dataColumnsAndColor:[], // lưu dữ liệu gán với mảng màu
        applyColumn:[], // cột được áp dụng
        settingPoint:[],
        listId:[],
        formatTableColumn:[],
    }
  },
}
</script>
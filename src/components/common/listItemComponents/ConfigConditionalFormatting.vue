<template>
<div class="mt-2 condition-format">
    <div>
        <div>
          <v-icon size="18">mdi-subtitles-outline</v-icon>
          Tên nhóm định dạng <span class="color-red">*</span>
        </div>
        <div class="w-100 mt-2">
            <v-text-field
                class="sym-small-size"
                single-line
                outlined
                dense
                v-model="value.nameGroup"
                label="Nhập tên nhóm không quá 26 kí tự "
                :placeholder="$t('common.search')"
            ></v-text-field>
        </div>
        <div class="mt-2 mb-1">
            <v-icon style="font-size:18px!important">mdi-format-color-fill</v-icon>
            Quy tắc định dạng 
        </div>
        <div class="mb-1">
            Áp dụng cho
        </div>
        <div style="border:1px solid lightgrey; over-flow:auto; border-radius:4px" >
            <div class="apply-for" v-for="(item,key) in formatTableColumns" :key="key"  @click="check(key)">
                <div  :style="{'color':item.isSelected?'green':'rgba(0, 0, 0,0.87)'}" class="mx-2 check" >
                    <v-icon :style="{'color':item.isSelected?'green':'grey'}" size="18" class="mr-2">
                        {{getDataTypeIcon(item.type)}}
                    </v-icon>
                    <span> 
                        {{item.name}}
                    </span>
                        <v-icon size="16" v-if="item.isSelected" class="color-green" style="float:right">mdi-check</v-icon>
                </div>
            </div>
        </div>
        <div class="mt-2">
            Display mode
        </div>
        <v-row style="margin-top:-10px!important" class="ml-2">
            <v-radio-group
                v-model="colorType"
                row
            >
                <v-radio 
                    label="Single Color"
                    value="singleColor"
                ></v-radio>
                <v-radio
                    label="Color Scale"
                    value="colorScale"
                ></v-radio>
             </v-radio-group>
        </v-row>
        <div v-if="colorType=='singleColor'">
            <SingleColor style="margin-top:-20px" 
                ref="singleColor"
                :rowData="rowData"
                v-model="value.displayMode.singleColor"
                :tableColumns="formatTableColumns"/>
        </div>
        <div style="margin-top:-20px" v-else>
            <ColorScale 
                ref="colorScale"
                v-model="value.displayMode.colorScale"
                :tableColumns="formatTableColumns"/>
        </div>
        <div class="d-flex justify-end">
            <v-btn text  @click="changeToAdd()" >
                Quay lại
            </v-btn>
            <v-btn text class="color-green" @click="save()">
                Lưu
            </v-btn>
        </div>
    </div>
</div>
</template>
<script>
import { appConfigs } from "./../../../configs.js";
import ColorScale from "./ColorScale";
import SingleColor from "./SingleColor";
import TreeSqlConfig from "./../../../views/document/sideright/items/TreeSqlConfig"

export default {
  components:{
    TreeSqlConfig,
    ColorScale,
    SingleColor,
  },
  methods: {
    refreshAll(){
        // this.value.nameGroup = "";
        // this.value.displayMode.singleColor.backgroundColor = '#FFFFFF';
        // this.value.displayMode.singleColor.fontColor = '#000000';
    },
    save(){
        if(this.colorType=='singleColor'){
            this.value.displayMode.type = 'singleColor';
            this.$refs.singleColor.getJsScript();
        }else{
            this.value.displayMode.type = 'colorScale';
        }
        this.$emit("change", this.value);
        this.$emit("save");
    },
    changeToAdd(){
        this.$emit("changeToAdd")
    },
    //chuyển cột được chọn thành script js dạng (column.headerName=='table.id'||column.headerName=='table.note')
    formatSelectedColumnToJS(){
        let selectedCols=[];
        this.formatTableColumns.map(t=>{
            if(t.isSelected){
                if(t.name!='All'){
                    selectedCols.push("column.headerName=='"+t.headerName+"'")
                }
            }
        })
        let result =  selectedCols.join('||')
        return result
    },
    check(index){
        this.formatTableColumns.map((column,i)=>{
            if(i==index){
                this.formatTableColumns[i].isSelected = !this.formatTableColumns[i].isSelected ;
                if(index==0){
                    this.checkAll(column.isSelected)
                }
            }
        })
        this.value.tableColumnsJS= this.formatSelectedColumnToJS();
        this.value.tableColumns = this.formatTableColumns
    },
    checkAll(value = true){
        this.formatTableColumns.map(column=>{
            column.isSelected=value
        });

    },
    columnTitle(title) {
        let prefix = this.headerPrefixKeypath;
        prefix =
            prefix[prefix.length - 1] == "." || prefix == ""
                ? prefix
                : prefix + ".";
            if(prefix&&title!='All'){
                return this.$t(prefix + title);            
            }else{
                return title;
        }
    },
    setTableColumns(){
        let tableColumns = [{
            title:'All',
            name:"All",
            type:"all",
            isSelected:false
        }];
        this.tableColumns.map(column=>{
            tableColumns.push({title:column.headerName,
                name:this.columnTitle(column.headerName),
                type:column.type,
                field:column.field,
                isSelected:false,
                headerName:column.headerName
            })
            
        })
        this.formatTableColumns = tableColumns;
        this.value.tableColumns=this.formatTableColumns;

    },
    getDataTypeIcon(type) {
        return appConfigs.dataTypeIcon[type];
    },
  },
  created(){
      if(!this.isUpdate){
          this.refreshAll()
      }
      this.setTableColumns();
      this.formatTableColumns = this.value.tableColumns;
  },
  props: {
      value:{
        type: Object,
            default(){
                return {}
            }
      },
      isUpdate:{
          type: Boolean,
      },
       rowData:{
             type: Array,
                default(){
                    return []
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
    data(){
        return {
            colorType:'singleColor',
            formatTableColumns:[],
         
        }
    },
}
</script>
<style scoped>
    .condition-format ::v-deep .v-label{
        margin-top:-5px!important
    }
    .check:hover{
        background:#f5f5f5;
    }
</style>
<style >
  .v-label{
        margin-top:-5px!important;
        color:#f5f5f5!important
    }  
</style>
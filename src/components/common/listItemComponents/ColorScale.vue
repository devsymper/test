<template>
    <div>
        <div class="mb-1">
            Cột lấy giá trị
        </div>
        <div>
            <v-select 
                 item-value="title"
                item-text="field"
                return-object
                outlined
                :items="formatTableColumn" 
                v-model="value.applyColumn" >
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
        <div v-for="(item,index) in value.config" :key="index" style="margin-top:-30px">
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
import PickColor from "./PickColor"
export default {
  props: {
     value:{
          type:Object,
          default(){
                return {}
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
      this.formatTableColumn=this.tableColumns.filter((t,i)=>i!=0);
      this.value.applyColumn= this.formatTableColumn[0];
    //   const colorGradient = new Gradient();
    //   const color1 = "#3F2CAF";
    // const color2 = "#8BC2E3";
    // colorGradient.setGradient(color1, color2).setMidpoint(3).getArray();
    // debugger
  },
  data () {
    return {
        formatTableColumn:[],
    }
  },
  methods: {
     
  }
    
}
</script>
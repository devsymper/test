<template>
<div class="ml-5 mb-5">
    <div v-for="(item, index) in value" :key="index" class="d-flex justify-space-between" style="margin-bottom:-10px" >
        <div class="text-ellipsis d-flex justify-start" style="margin-top: -5px;">
            <v-switch
                class="ml-2 category-name"
                style="height: 15px; color:black" 
                v-model="item.isShow"
                :label="`${item.key}-${item.name}`"
            ></v-switch>
            <span class="fs-13">
                
            </span>
        </div>
        <div class="d-flex justify-end col-md-2 ml-2">
            <v-menu>
                <template v-slot:activator="{ on }">
                      <v-avatar class="ml-5 mr-2"
                        style="border:1px solid grey"
                        :color="item.color"
                        v-on="on"
                        size="30"
                    >{{index+1}}
                    </v-avatar>
                </template>
                  <PickColor 
                    v-model="item.color" 
                    />
            </v-menu>
        </div>
    </div>
        <div class="fs-12 color-grey">
            Note: Màu loại công việc sẽ ghi đè lên màu log time đang cấu hình
        </div>
       <div class="d-flex justify-end mt-2">
           <v-btn x-small color="primary" class="mr-5 fs-13 fw-400" @click="save">Áp dụng</v-btn>
       </div>
    </div>
</template>
<script>
import PickColor from "./../../common/listItemComponents/PickColor"
export default {
  watch: {
    value(){
        this.$emit('input',this.value)
    }
  },
  components:{
      PickColor 
  },
  data () {
    return {
        cateColor:null
    }
  },
  props: {
      value:{
          type:Array,
          default:()=>[]
      },
      listColor:{
          type:Object,
          default:()=>{}
      }
  },
  created () {
      this.setCategoryColor()
  },
  methods: {
     save(){
         this.$emit('save',this.value)
     },
     setCategoryColor(){
            let cate = [...this.value];
            let listColor = {...this.listColor};
            cate.map(c=>{
                if(Object.keys(listColor.detail).length > 0&&listColor.detail.colorCate.length>0){
                    listColor.detail.colorCate.map(color=>{
                        if(color.id == c.id){
                            c.color = color.color;
                            c.isShow = color.isShow
                        }
                    })
                    // this.value = cate;
                    this.$emit('input',cate)
                }else{
                    c.isShow=false;
                    c.color="#8FBC8F"
                }
            })
        },
  },
    
}
</script>
<style scoped>
    .category-name ::v-deep .v-label{
        color:black!important
    }
</style>
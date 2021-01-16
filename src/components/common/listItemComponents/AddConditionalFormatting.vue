<template>
    <div>
        <!-- <div v-for="(item, idx) in listData" :key="idx">

        </div> -->
        <v-list dense three-line>
        <template v-for="(item, index) in listData">
          <v-list-item
            style="border-bottom:1px solid lightgrey;"
            dense
            :key="item.title"
          >
            <v-avatar  class="mr-2 my-1" 
              :style="{background:item.displayMode.singleColor.backgroundColor,'background-image':getBackgroundColor(index)}"
              tile style="border:1px solid grey;margin-left:-12px">
              <div :style="{color:item.displayMode.singleColor.fontColor}">{{setNumber(index)}}
              </div>
            </v-avatar>
            <v-list-item-content dense>
              <v-list-item-title >
                  <span class="fs-13 fw-400">
                      Định dạng {{setNumber(index)}}: {{item.nameGroup}}
                  </span>
                  </v-list-item-title>
              <v-list-item-subtitle >
                  <v-btn text x-small  @click="editConfig(index)">
                      Sửa
                  </v-btn>
                   <v-btn text x-small>
                      Chi tiết
                  </v-btn>
                   <v-btn  text x-small @click="deleteConfig(index)">
                      Xóa
                  </v-btn>
                  <v-btn  text x-small @click="applyConfig(index)">
                      Chọn
                  </v-btn>
              </v-list-item-subtitle>
            </v-list-item-content>
              
          </v-list-item>
         
        </template>
      </v-list>
        <div @click="changeToConfig()">
            <span class="color-green fs-13 d-flex justify-center mt-2" >
                <v-icon class="color-green" size='16'>mdi-plus</v-icon>
            Thêm quy tắc định dạng</span>
        </div>
    </div>
</template>
<script>
export default {
  props: {
     listData:{
             type: Array,
                default(){
                    return []
                }
        },
  },
  methods: {
    getBackgroundColor(index){
      let result = '';
      if(this.listData[index].displayMode.type=='singleColor'){
      }else{
        let colorMin = this.listData[index].displayMode.colorScale.config[0].color;
        let colorMid = this.listData[index].displayMode.colorScale.config[1].color;
        let colorMax = this.listData[index].displayMode.colorScale.config[2].color;
        if(colorMid==colorMid){
         result = 'linear-gradient('+colorMin+','+colorMax+')'
          
        }else{
         result = 'linear-gradient('+colorMin+','+colorMid+', '+colorMax+')'

        }
      }
     return result;
    },
    setNumber(index){
      return String(index+1).padStart(3, '0')
    },
      changeToConfig(){
          this.$emit('changeToConfig')
      },
      deleteConfig(index){
          this.$emit('delete-config',index)
      },
      applyConfig(index){
        this.$emit('apply-config',index)
      },
      editConfig(index){
          this.$emit('edit-config',index)
      }
  },
  data () {
    return {
    }
  },
    
}
</script>
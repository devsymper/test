<template>
    <div>
        <!-- <div v-for="(item, idx) in listData" :key="idx">

        </div> -->
        <v-list dense three-line>
        <template v-for="(item, index) in listData">
          <v-list-item
            style="border-bottom:1px solid lightgrey"
            dense
            :key="item.title"
          >
            <v-list-item-avatar style="border:1px solid grey">
              <div :style="{background:item.displayMode.singleColor.backgroundColor,color:item.displayMode.singleColor.fontColor}">00{{index+1}}
              </div>
            </v-list-item-avatar>
            <v-list-item-content dense>
              <v-list-item-title >
                  <span class="fs-13 fw-400">
                      Định dạng 00{{index+1}}: {{item.nameGroup}}
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
      changeToConfig(){
          this.$emit('changeToConfig')
      },
      deleteConfig(){

      },
      applyConfig(index){
        this.$emit('apply-config',index)
      },
      editConfig(){
        alert('edit')

      }
  },
  data () {
    return {
    }
  },
    
}
</script>
<template>
    <div>
        <v-list dense three-line>
        <template v-for="(data, dataIdx) in listData">
          <v-list-item
            style="border-bottom:1px solid lightgrey;"
            dense
            :key="data.title"
          >
            <v-avatar  class="mr-2 my-1" 
              :style="{background:data.displayMode.singleColor.backgroundColor,'background-image':getBackgroundColor(dataIdx)}"
              tile style="border:1px solid grey;margin-left:-12px">
              <div :style="{color:data.displayMode.singleColor.fontColor}">{{setNumber(dataIdx)}}
              </div>
            </v-avatar>
            <v-list-item-content dense>
              <v-list-item-title >
                  <span class="fs-13 fw-400">
                      Định dạng {{setNumber(dataIdx)}}: {{data.nameGroup}}
                  </span>
                  </v-list-item-title>
              <v-list-item-subtitle>
                  <v-btn text x-small  
                    v-for="(action,actionIdx) in listActions.filter(act=>act.isShow)" 
                    :key="actionIdx" 
                    @click="handleAction(actionIdx,dataIdx)">
                      {{action.name}}
                  </v-btn>
                  <v-btn text x-small  v-if="dataIdx==dataIdxSelected" @click="handleAction(4,dataIdx)">
                      {{listActions[4].name}}
                  </v-btn>
                   <v-btn text x-small  v-else @click="handleAction(3,dataIdx)">
                      {{listActions[3].name}}
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
      if(this.listData[index].displayMode.type!='singleColor'){
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
    handleAction(actionIdx,dataIdx){
      if(actionIdx==3){
        this.dataIdxSelected = dataIdx;
      }
      if(actionIdx==4){
        this.dataIdxSelected = -1;
      }
      let data={
        type: this.listActions[actionIdx].name,
        index: dataIdx
      }
      this.$emit('change-format',data )

    },
      changeToConfig(){
          this.$emit('changeToConfig')
      },
  },
  data () {
    return {
      dataIdxSelected:-1,
      listActions:[
        {id:0,name:'Xem',isShow:true},
        {id:1,name:'Sửa',isShow:true},
        {id:2,name:'Xóa',isShow:true},
        {id:3,name:'Chọn',isShow:false},
        {id:4,name:'Bỏ chọn',isShow:false},
      ]
    }
  },
    
}
</script>
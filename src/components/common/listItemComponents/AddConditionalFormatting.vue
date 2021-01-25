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
              <div :style="{color:data.displayMode.singleColor.fontColor}">
                {{setNumber(dataIdx)}}
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
                      {{action.title}}
                  </v-btn>
                  <v-btn color="warning" text x-small  v-if="checkIsSelected(dataIdx)" @click="handleAction(3,dataIdx)">
                      <span>{{listActions[3].title}}</span>
                      
                  </v-btn>
                   <v-btn text x-small  v-else @click="handleAction(2,dataIdx)">
                      {{listActions[2].title}}
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
      if(actionIdx==2){
        this.listDataIdSelected.push(dataIdx);
        this.$emit('change-apply',this.listDataIdSelected )
      }else{
          if(actionIdx==3){
          this.listDataIdSelected = this.listDataIdSelected.filter(i=>i!=dataIdx);
        }
        let data={
          type: this.listActions[actionIdx].name,
          index: dataIdx
        }
        this.$emit('change-format',data )
      }
      
    },
      changeToConfig(){
          this.$emit('changeToConfig')
      },
      checkIsSelected(dataIdxSelected){
        let check = false;
        this.listDataIdSelected.map(data=>{
          if(data==dataIdxSelected){
            check = true
          }
        })
        return check
      }
  },
  data () {
    return {
      dataIdxSelected:-1,
      listDataIdSelected:[],
      listActions:[
        // {id:0,title:'Xem',name:'view',isShow:true},
        {id:1,title:'Sửa',name:'edit',isShow:true},
        {id:2,title:'Xóa',name:'delete',isShow:true},
        {id:3,title:'Chọn',name:'apply',isShow:false},
        {id:4,title:'Đã chọn',name:'disApply',isShow:false},
      ]
    }
  },
    
}
</script>
<template>
    <div class="pl-3 mb-2 mt-2 mr-2" >
        <v-row>
            <v-col>
                <i class="mdi mdi-eye-check-outline"></i> Theo dõi<i class="mdi mdi-information-outline"></i>
            </v-col>
            <v-col>
            </v-col>
        </v-row>
        <div class="fs-13">
            Theo dõi thay đổi: {{name}}
        </div>
        <div class="color-grey fs-11">
            Sẽ nhận thông báo khi một trong các hành động sau được thực hiện 
            <br/>
            đối với bản ghi của đối tượng bạn theo dõi
        </div>
        <div class="mt-2">
            <v-row style="margin-top:-20px" v-for="(item, key) in items" :key="key">
                <v-col class="col-md-10 fs-13">
                    {{item.name}}
                </v-col>
                <v-col style="margin-top:-20px" class="col-md-2">
                    <v-checkbox color="success"
                        v-model="item.selected"
                    ></v-checkbox>
                </v-col>
            </v-row>
        </div>
    </div>
</template>
<script>

import notification from "./../../api/settingNotification";
export default {
    props:['objId','objType'],
  methods: {
      getNameObj(id){
          let name = " ";
          return name;

      },
      getObjIdentifier(){
          debugger
          return this.objType+':'+this.objId;

      },
      async getAllListChanel(){
        // this.items=[];
        // const self= this;
        // let res = await notification.showAllLists();
        //    if(res.status==200){
        //     let format = [];
        //      let listModules = res.data;


        //      self.allListChanel = res.data;
        //      for(let i = 0; i<listModules.length;i++){
        //          if(listModules[i].objectType){
        //              format.push(listModules[i])
        //          }
        //      }
        //      let formatListModules = _.groupBy(format, 'objectType');
        //      let name = Object.keys(formatListModules);
        //      for(let i=0;i<name.length;i++){
        //          let a = name[i];
        //         self.items.push({
        //         title: name[i],
        //         items: [],
        //         icon:name[i]
        //     })      
        //     let groupByEvent= Object.keys(_.groupBy(formatListModules[name[i]], 'event'));
        //         for(let k=0;k<groupByEvent.length;k++){
        //             self.items[i].items.push({
        //                 title: groupByEvent[k],
        //                 name:self.rename(name[i],groupByEvent[k]),
        //                 active: self.checkSubcribe(name[i],groupByEvent[k])
        //             });
        //         }
        //     }
        // }
  },

  data () {
    return {
        name:"Đơn bán hàng",
        items:[
            {
                name: 'Bản ghi tạo ',
                selected: true,
            },
            {
                name: 'Bản ghi tạo ',
                selected: true,
            }
        ]
    }
  },
  created () {
      this.getNameObj(this.objId);
      this.getAllListChanel(); 
      this.getObjIdentifier();
  },
  }
}
</script>
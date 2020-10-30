<template>
    <div class="pl-3 mr-2" >
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
        <div class="mt-2 ">
            <v-row style="margin-top:-10px; margin-bottom:-40px" v-for="(item, key) in items" :key="key">
                <v-col class="col-md-10 fs-13">
                    {{item.actionName}}
                </v-col>
                <v-col style="margin-top:-20px" class="col-md-2">
                    <v-checkbox color="success"
                        v-model="item.subscribed"
                    ></v-checkbox>
                </v-col>
            </v-row>
        </div>
        <div>
            <div>Nhóm đối tượng sẽ theo dõi</div>
            <v-row style="margin-top:-10px; margin-bottom:-40px" >
                <v-col class="col-md-10 fs-13">
                   Theo dõi bản ghi cá nhân
                </v-col>
                <v-col style="margin-top:-20px" class="col-md-2">
                    <v-checkbox color="success"
                        v-model="isPersonal"
                    ></v-checkbox>
                </v-col>
            </v-row>
            <v-row style="margin-top:-10px; margin-bottom:-40px" >
                <v-col class="col-md-10 fs-13">
                   Theo dõi toàn bộ bản ghi
                </v-col>
                <v-col style="margin-top:-20px" class="col-md-2">
                    <v-checkbox color="success"
                        v-model="isAll"
                    ></v-checkbox>
                </v-col>
            </v-row>
        </div>
    </div>
</template>
<script>

import notification from "./../../api/settingNotification";
export default {
    props:['name','objType'],
      data () {
            return {
                items:[],
                isPersonal:false,
                isAll:false
            }
    },
    created () {
      this.getAllListChanel(); 
     },
     watch:{
          items:{ 
            deep: true,
            immediate: true,
            handler(newValue){
                for(let i= 0; i<newValue.length;i++){
                    if(newValue[i].subscribed){
                        this.subcribedAllChanel(newValue[i].id) 
                    }else{
                          this.unsubcribedAllChanel(newValue[i].id) 
                    }

                }
            }
          },
          isAll(){
              if(this.isAll){
                const self = this;
                let data={filter:'all'};
                notification.subscribeChanel(id,data).then(res=>{
                    if(res.status==200){}
                })

              }
          },
          isPersonal(){
              if(this.isPersonal){
                   const self = this;
                    let data={filter:'my_own'};
                    notification.subscribeChanel(id,data).then(res=>{
                        if(res.status==200){}
                    })
              }
          }

     },
  methods: {
      unsubcribedAllChanel(id){
        const self = this;
        let data={state:false};
        notification.subscribeChanel(id,data).then(res=>{
            if(res.status==200){}
        })
        },
      subcribedAllChanel(id){
        notification.subscribeChanel(id).then(res=>{
            if(res.status==200){}
        })
      },
     getAllListChanel(){
        this.items=[];
        const self= this;
        let res = notification.showAllLists().then(res=>{
        if(res.status==200){
            let format = [];
            let listModules = res.data;
            for(let i = 0; i<listModules.length;i++){
                if(listModules[i].objectType==self.objType){
                    format.push(listModules[i])
                }
            }
            let formatListModules = _.groupBy(format, 'objectType');
            let name = Object.keys(formatListModules);
            for(let i=0;i<formatListModules[self.objType].length;i++){
                self.items.push({
                actionName: formatListModules[self.objType][i].event,
                id:formatListModules[self.objType][i].id,
                subscribed:formatListModules[self.objType][i].subscribed})
            }
        }   
        });
    },
  }
  
}
</script>
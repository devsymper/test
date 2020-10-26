<template>
  <div class="ml-4 config-notification">
        <div class="mb-3">
            <h4>Cài đặt thông báo</h4>
        </div>
        <v-row class="pt-0" style="margin-bottom:-10px">
            <v-col class="fs-13 col-md-5" style="margin-top:5px">Module phát sinh</v-col>
            <v-col class="col-md-7">  
                <v-autocomplete
                    outlined
                     class="sym-small-size"
                    :items="listModule"
                    v-model="objectType"
                    dense
                    clearable
                    label="Chọn"
                >
                </v-autocomplete>
            </v-col>
        </v-row>
         <v-row class="pt-0" style="margin-bottom:-10px">
            <v-col class="fs-13 col-md-5" style="margin-top:5px">Hành động sinh ra notification</v-col>
            <v-col class="col-md-7">  
                 <v-autocomplete
                    outlined
                    class="sym-small-size"
                    clearable
                    :items="listAction"
                    v-model="action"
                    dense
                    label="Chọn"
                >
                </v-autocomplete>
            </v-col>
        </v-row>
          <v-row class="pt-0" style="margin-bottom:-10px" >
            <v-col class="fs-13 col-md-5" style="margin-top:5px">Đối tượng nhận notification</v-col>
            <v-col class="col-md-7">  
                <v-autocomplete
                    class="sym-small-size"
                    dense
                    outlined
                    clearable
                    return-object
                    v-model="receiver"
                    :items="listReceiver"
                    item-value="value"
                    item-text="text"
                    label="Chọn"
                >
                </v-autocomplete>
            </v-col>
        </v-row>
          <v-row class="pt-0" style="margin-bottom:-10px">
            <v-col class="fs-13 col-md-5" style="margin-top:5px">Hành động khi click notification</v-col>
            <v-col class="col-md-7">  
                <v-autocomplete
                     class="sym-small-size" 
                    outlined
                    clearable
                    dense
                    item-value="value"
                    item-text="text"
                    v-model="actionClickNotifi"
                    :items="listActionClickNotifi"
                    label="Chọn"
                >
                </v-autocomplete>
            </v-col>
        </v-row>
          <v-row class="pt-0" style="margin-bottom:-35px">
            <v-col class="fs-13 col-md-5">
                Nội dung notification
            </v-col>
            <v-col class="fs-13 col-md-2 ml-15">  
                Tham số
            </v-col>
        </v-row>
        <div class="col-12">
          <draggable tag="ul"
            style="height: 180px!important; border:1px solid white"
            :list="list" class="list-group" handle=".handle">
          <v-row>
            <v-col class="col-md-8" style="margin-top:-12px; margin-left:-40px">
                <v-textarea
                :rows="5" type="text" class="form-control mt-1" 
                  style="width:260px" v-model="description"
              />
            </v-col>
            <v-col class="col-md-4" >
              <div style="border:1px solid grey; margin-top:3px;border: 1px solid grey; height: 143px; margin-top: 4px; margin-left:-30px; margin-right:-49px">
                <i class="fa fa-align-justify handle"></i>
              <v-chip  color="primary" class="text"  
                 v-for="(element, idx) in parameter"  
                 @change="log" style="margin-top:2px; margin-bottom:2px; margin-left:5px; margin-right:2px"
                  :key="element.value">{{ element.text }}</v-chip>
                </div>        
            </v-col>
          </v-row>
          </draggable>
            <v-row class="pt-0" style="margin-bottom:-10px">
            <v-col class="fs-13 col-md-5" style="margin-top:5px">Hình đại diện</v-col>
            <v-col class="col-md-7">  
                 <v-select
                    outlined
                     class="sym-small-size"
                   
                    :items="typeSelected"
                    v-model="typePictureSelected"
                    dense
                >
                </v-select>
            </v-col>
        </v-row>
        <v-row class="pt-0" v-if="typeSelected[0]==typePictureSelected" style="margin-bottom:-20px">
            <v-col class="fs-13 col-md-5" style="margin-top:-5px">Ảnh</v-col>
            <v-col class="col-md-7" style="margin-top:-10px">
                <v-avatar :size="60">
                    <img v-if="avatarUrl != ''"
                        :src="avatarUrl"
                    >
                    <img v-if="avatarUrl== ''"
                        :src="require('./../../../assets/image/avatar_default.jpg')"
                    >
                </v-avatar>
               <UploadFile 
                    ref="uploadAvatar"
                    :fileName="avatarFileName"
                    :autoUpload="false"
                    @click="handleAvatarSelected"
                    :iconName="'mdi mdi-plus-circle'"
                    @selected-file="handleAvatarSelected"
                        />
            </v-col>
        </v-row>
       
         <v-row class="pt-0" style="margin-bottom:-15px" v-if="typeSelected[1]==typePictureSelected">
            <v-col class="fs-13 col-md-5 " style="margin-top:-10px">Icon</v-col>
            <v-col class="col-md-6" style="margin-top:-10px">  
                 <v-icon class="display-3 pt-0">{{iconName.iconName}}</v-icon>
             <iconPicker style="margin-left:-10px" ref="iconPicker" :icon="'mdi mdi-plus-box'" @selected="pickIcon"></iconPicker>
            </v-col >
              
        </v-row>
         <v-row class="pt-0" style="margin-bottom:-25px">
            <v-col class="fs-13 col-md-5 " style="margin-top:5px">Trạng thái</v-col>
            <v-col class="col-md-6">  
               <v-checkbox
                v-model="state" 
                style="margin-top:0px">
               </v-checkbox>
            </v-col>
        </v-row>
        <v-row class="mr-8 mt-5 d-flex justify-end">
            <v-btn text color="green" @click="save()">Lưu</v-btn>
        </v-row>
    </div>
    </div>
</template>
<script>
  import draggable from 'vuedraggable';
import iconPicker from "../../../components/common/pickIcon";
import { util } from '../../../plugins/util';
import UploadFile from "./../../../components/common/UploadFile";
import {userApi} from "./../../../api/user";
import notification from "./../../../api/settingNotification";
export default {
  props: {
  },
   watch: {
      objectType(){
         this.refreshSelected();
          this.getAction(this.objectType);
          this.getSource(this.objectType);
      }
  },
  created () {
      this.getNameModule();
    
  },

  components:{
    UploadFile,
    iconPicker,
    draggable
    },
  data() {
    return {
       typeSelected:[
                "Avatar đối tượng gây ra",
                "Tùy chọn icon"
            ],
            typePictureSelected:'Avatar đối tượng gây ra',
            iconName:{
                icon: "",
                iconName: "mdi-account",
                name: "",
                note: "",
                status: false
            },
            avatarUrl:'',
            parameter:[],
            avatarFileName:'',
            allListObj:{},
            listModule:[],
            objectType:'',
            listAction:[],
            action:'',
            listReceiver:[],
            listActionClickNotifi:[],
            receiver:'',
            actionClickNotifi:'',
            listSource:[],
            state:false,
            avatar:'',
            icon:'',
  
      list: [
        { name: "John", text: "3234234", id: 0 },
         { name: "Johnádasd", text: "", id: 0 },
      ],
      dragging: false,
      description:''
    };
  },
  computed: {
  },
  methods: {
    handleAvatarSelected(tempUrl){
         debugger
           this.avatarUrl = tempUrl;
            this.avatarFileName = 'user_avatar_'+util.str.randomString(6)+Date.now();
            this.$refs.uploadAvatar.uploadFile();
        },
    save(){
        debugger
        let data={
            event: this.action,
            source:this.objectType,
            state:this.state,
            objectIdentifier:this.objectType,
            objectType:this.objectType,
            receiver:this.receiver.value,
            action:this.actionClickNotifi,
            icon:this.iconName.iconName?this.iconName.iconName:this.avatarFileName,
            description:this.description
        };
       const self = this;
        notification.addChanel(data).then(res=>{
            if(res.status==200){
                debugger
            }
        })

    },
      pickIcon(data) {
          debugger
            this.$set(this.iconName, 'iconName', data.icon.trim() )
            this.$set(this.iconName, 'iconType' , data.type)
		},
    refreshSelected(){
         this.listActionClickNotifi = [];
          this.listAction = [];
          this.listReceiver=[];
    },
    getAction(nameModule){
        this.listAction = this.allListObj[nameModule].action.map(x=>x)
    },
    getNameModule(){
        const self = this;
        userApi.getAllListObj()
        .then(res=>{
            if(res.status==200){
                self.allListObj = res.data
                self.listModule = Object.keys(res.data);
            }
        })
    },
     getSource(nameModule){
        const self = this;
        notification.showAllModuleConfig().then(res=>{
            if(res.status==200){
                self.listSource = res.data;
                for(let i = 0; i<res.data[nameModule].receiver.length;i++){
                    self.listReceiver.push(res.data[nameModule].receiver[i])
                };
                 for(let i = 0; i<res.data[nameModule].action.length;i++){
                    self.listActionClickNotifi.push(res.data[nameModule].action[i])
                };
                for(let i = 0; i<res.data[nameModule].parameter.length;i++){
                    self.parameter.push({
                      text:res.data[nameModule].parameter[i].text,
                      value: res.data[nameModule].parameter[i].value
                      })
                }

            }
        })
    },
     log: function(evt) {
      window.console.log(evt);
    },
      replace: function() {
      this.list = [{ name: "Edgard" }];
    },
    clone: function(el) {
      return {
        name: el.name + " cloned"
      };
    },
  }
};
</script>
<style scoped>
.list-group{
  height:60px;
  text-decoration: none

}
.button {
  margin-top: 35px;
}
.handle {
  float: left;
  padding-top: 8px;
  padding-bottom: 8px;
}
.close {
  float: right;
  padding-top: 8px;
  padding-bottom: 8px;
}
input {
  display: inline-block;
  width: 50%;
}
.text {
  margin: 20px;
}
</style>
<style scoped>
    .config-notification ::v-deep fieldset{
        height:35px!important;
    }
    .config-notification ::v-deep .v-label{
        display:none;
    }
    .config-notification ::v-deep .v-text-field__slot{
        border:1px solid grey
     }
    .config-notification >>>.symper-upload-file{
        margin-top:-28px;
        margin-left:12px;
	}
</style>
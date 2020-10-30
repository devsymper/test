<template>
  <div class="ml-4 config-notification choose-picture">
        <div class="mb-3">
            <h4>Cài đặt thông báo</h4>
        </div>
        <v-row class="pt-0" style="margin-top:-10px">
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
               <v-row class="pt-0 " v-if="typeSelected[0]==typePictureSelected" style="margin-bottom:-20px; margin-top:-10px">
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
            <v-col class="col-md-6 ml-2" style="margin-top:-10px">  
                 <v-icon class="display-3 pt-0">{{iconName.iconName}}</v-icon>
             <iconPicker style="margin-left:-10px" ref="iconPicker" :icon="'mdi mdi-plus-box'" @selected="pickIcon"></iconPicker>
            </v-col >
              
        </v-row>
        <v-row class="pt-0" style="margin-bottom:-10px">
            <v-col class="fs-13 col-md-5" style="margin-top:5px">Module phát sinh</v-col>
            <v-col class="col-md-7">  
                <v-autocomplete
                    outlined
                      return-object
                    item-value="value"
                    item-text="name"
                     class="sym-small-size"
                    :items="listModuleObj"
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
                    return-object
                    item-value="value"
                    item-text="text"
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
          <v-row class="col-12" style="margin-bottom:-35px">
           <draggable
              :list="list2"
              group="des"
              @change="log"
              style="height: 180px!important"
              handle=".handle"
            >
            <v-textarea
                :rows="5" type="text"
                style="width:250px" v-model="description"
              />
            </draggable>
          <div class="col-md-4 ml-8" > 
              <div 
                class="mt-1 mt-1" 
                style="border:1px solid grey;height: 143px; margin-left:-30px; margin-right:-49px">
                <draggable
                style="height: 180px!important; border:1px solid white"
                  :list="parameter"
                  :group="{ name: 'des', pull: 'clone', put: false }"
                  :clone="cloneValue"
                  @change="log"
                >
                  <v-chip class="list-group-item"   
                  color="primary"
                    v-for="element in parameter" :key="element.value">
                      {{ element.text }}
                  </v-chip>
              </draggable>
            </div>
          </div>
        </v-row>
        <div class="col-12">
          <v-row class="pt-0" style="margin-bottom:-25px">
              <v-col class="fs-13 col-md-5 " style="margin-top:5px">Trạng thái</v-col>
              <v-col class="col-md-6">  
                <v-checkbox
                  v-model="state" 
                  style="margin-top:0px">
                </v-checkbox>
              </v-col>
          </v-row>
          <v-row class="mt-5 d-flex justify-end" style="margin-top:-20px!important">
              <v-btn text color="green" @click="save()">Lưu</v-btn>
          </v-row>
    </div>
    </div>
</template>
<script>
  import draggable from 'vuedraggable';
  let idGlobal = 8;
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
          this.getSource(this.objectType.value);
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
      list2: [
        { name: "test", id: 5 },
      ],
       typeSelected:[
                "Avatar đối tượng gây ra",
                "Tùy chọn icon"
            ],
            typePictureSelected:'Avatar đối tượng gây ra',
            iconName:{
                icon: "",
                iconName: "",
                name: "",
                note: "",
                status: false
            },
            avatarUrl:'',
            parameter:[],
            avatarFileName:'',
            allListObj:{},
            listModule:[],
            listModuleObj:[],
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
      dragging: false,
      description:''
    };
  },
  computed: {
  },
  methods: {
    handleAvatarSelected(tempUrl){
        this.avatarUrl = tempUrl;
        this.avatarFileName = 'user_avatar_'+util.str.randomString(6)+Date.now();
        this.$refs.uploadAvatar.uploadFile();
    },
    replaceDescription(){
    //  debugger
      let description = this.description;
      for(let i = 0; i<this.parameter.length;i++){
        let oldValue= new RegExp('<'+this.parameter[i].text+'>');
        let newValue = this.parameter[i].value;
        description= description.replace(oldValue,newValue);
      }
     // description = this.description;
      return description;
    },
    save(){
        let data={
            event: this.action.value,
            source:this.objectType.value,
            state:this.state?1:0,
            objectIdentifier:this.objectType,
            objectType:this.objectType,
            receiver:this.receiver.value,
            action:this.actionClickNotifi,
            icon:this.iconName.iconName?this.iconName.iconName:this.avatarFileName,
            description:this.replaceDescription()
        };
       const self = this;
        notification.addChanel(data).then(res=>{
            if(res.status==200){
                self.$snotify({
                      type: "success",
                      title: "Thêm thông báo thành công",
                  });
                self.refreshAll();
                self.$emit("refreshList")
            }else{
                self.$snotify({
                    type: "error",
                    title: "Thêm thông báo thất bại",
                });
              }
          })
    },
      pickIcon(data) {
            this.$set(this.iconName, 'iconName', data.icon.trim() )
            this.$set(this.iconName, 'iconType' , data.type)
		},
    refreshSelected(){
         this.listActionClickNotifi = [];
          this.listAction = [];
          this.listReceiver=[];
    },
    refreshAll(){
      this.objectType='';
      this.state=false;
      this.objectType='';
      this.objectType='';
      this.receiver.value='';
      this.actionClickNotifi='';
      this.iconName.iconName='';
      this.avatarUrl='';
      this.parameter='';
      this.avatarFileName='';
      this.description=''
    },
    getNameModule(){
        const self = this;
        notification.showAllModuleConfig()
        .then(res=>{
            if(res.status==200){
                self.allListObj = res.data
                self.listModule = Object.keys(res.data);
                for(let i = 0;i<self.listModule.length;i++){
                  self.listModuleObj.push({
                    name:self.$t('objects.'+self.listModule[i]),
                    value:self.listModule[i]
                  })
                }
            }
        })
    },
     getSource(nameModule){
        this.listReceiver=[];
        this.listActionClickNotifi =[];
        this.parameter = [];
                //self.listModule = Object.keys(res.data);
        for(let i = 0; i<this.allListObj[nameModule].receiver.length;i++){
            this.listReceiver.push(this.allListObj[nameModule].receiver[i])
        };
          for(let i = 0; i<this.allListObj[nameModule].action.length;i++){
            this.listActionClickNotifi.push(this.allListObj[nameModule].action[i])
        };
        for(let i = 0; i<this.allListObj[nameModule].event.length;i++){
          this.listAction.push({
            text:this.allListObj[nameModule].event[i].text,
            value:this.allListObj[nameModule].event[i].value

          })
        };
        for(let i = 0; i<this.allListObj[nameModule].parameter.length;i++){
            this.parameter.push({
              text:this.allListObj[nameModule].parameter[i].text,
              value: this.allListObj[nameModule].parameter[i].value
              })
        }

          
     
    },
     log: function(evt) {
       this.description+=evt.added.element.name;
    },
    cloneValue(value) {
      return {
        value: value.value,
        name: `<${value.text}>`
      };
    }
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
.choose-picture ::v-deep .v-select__slot{
  margin-top:-5px!important
}
</style>

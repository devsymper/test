<template>
  <div class="h-100">
    <h2 class="header-title">Tạo User</h2>
    <v-stepper v-model="stepper" class="d-flex stepper-create-user">
      <v-stepper-header class="stepper-header">
        <v-stepper-step editable step="1">Thông tin chung</v-stepper-step>
        <v-stepper-step :editable="!formHasErr" @click="loadPermission()" step="2">Phân quyền</v-stepper-step>
        <v-stepper-step :editable="!formHasErr" step="3">Cài đặt thêm</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content step="1">
          <h2>Thông tin cá nhân</h2>
            <v-row class="mt-2">
              <v-col cols="3">
                <v-subheader>Tên</v-subheader>
              </v-col>
              <v-col cols="4">
                <v-text-field
                v-model="user.firstName"
                dense
                ></v-text-field>
              </v-col>
              <v-col cols="1">
                <v-subheader>Họ</v-subheader>
              </v-col>
              <v-col cols="4">
                <v-text-field
                v-model="user.lastName"
                dense
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row >
              <v-col cols="3">
                <v-subheader>Tên hiển thị</v-subheader>
              </v-col>
              <v-col cols="9">
                <v-text-field
                  v-model="user.displayName"
                  dense
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="3">
                <v-subheader>Tên tài khoản</v-subheader>
              </v-col>
              <v-col cols="9">
                <v-text-field
                ref="userName"
                required
                :rules="[rules.required]"
                v-model="user.userName"
                dense
                ></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="3">
                <v-subheader>Email</v-subheader>
              </v-col>
              <v-col cols="9">
                <v-text-field
                  ref="email"
                  v-model="user.email"
                  :rules="[rules.required, rules.email]"
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <v-subheader>Số điện thoại</v-subheader>
              </v-col>
              <v-col cols="9">
                <v-text-field
                  v-model="user.phone"
                  dense
                ></v-text-field>
              </v-col>
            </v-row>

            <h2 class="setting-password">Tùy chọn mật khẩu</h2>
            <v-checkbox dense class="sym-small-size" v-model="autoRenPassword" @click="enabledPassword = !enabledPassword" :label="`Tạo mật khẩu Tự động`"></v-checkbox>
            <v-checkbox dense class="sym-small-size" v-model="enabledPassword" @click="autoRenPassword = !autoRenPassword" :label="`Mật khẩu của bạn`"></v-checkbox>
            <v-row>
              <v-col cols="1">
              </v-col>
              <v-col cols="3">
                <v-subheader>Mật khẩu</v-subheader>
              </v-col>
              <v-col cols="8">
               

                <v-text-field
                  ref="password"
                  v-model="user.password"
                  :disabled="!enabledPassword"
                  dense
                  :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                  :rules="[rules.required, rules.min, rules.max]"
                  :type="showPass ? 'text' : 'password'"
                  counter
                  @click:append="showPass = !showPass"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-checkbox dense class="sym-small-size" v-model="needChangePassword" :label="`yêu cầu người dùng này thay đổi mật khẩu khi họ đăng nhập lần đầu`"></v-checkbox>
            <v-checkbox dense class="sym-small-size" v-model="sendMailAfterChange" :label="`gửi mật khẩu trong email sau khi hoàn thành`"></v-checkbox>
            <v-checkbox dense class="sym-small-size" v-model="user.active" :label="`Kích hoạt tài khoản`"></v-checkbox>
          <v-btn class="btn-next-step"
            :loading="loading"
            :disabled="loading"
            @click="loader = 'loading'"
          >
            {{actionPanel}}
          </v-btn>

        </v-stepper-content>

        <v-stepper-content step="2">
          <v-tabs
            v-model="tabIndex"
            background-color="transparent"
            color="basil"
            grow
          >
            <v-tab
              v-for="itemTab in itemsTypePermission"
              :key="itemTab.title"
            >
              {{ itemTab.title }}
            </v-tab>
          </v-tabs>

          <v-tabs-items  v-model="tabIndex">
            <v-tab-item
              v-for="itemTab in itemsTypePermission"
              :key="itemTab.title"
            >
              <v-autocomplete
                class="mt-2"
                :items="itemTab.listPermission"
                dense
                outlined
                clearable
                item-text="packName"
              >
                
                <template v-slot:selection="dataPackage">
                  {{dataPackage.item.packName}}
                </template>
                <template v-slot:item="dataPackage">
                  <v-list-item-content @click="selectPermission(dataPackage.item)">
                    <v-list-item-title >{{ dataPackage.item.packName }}</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
              <div>
                <v-list dense>
                  <v-list-item
                    class="permission-item"
                    v-for="permission in itemTab.permissionSelected"
                    :key="permission.id"
                  >
                
                    <v-list-item-content>
                        <v-list-item-title>{{ permission.packName }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-icon @click="deletePackage(permission.id)">
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-icon v-on="on">mdi-delete</v-icon>
                            </template>
                            <span>Xóa</span>
                        </v-tooltip>
                    </v-list-item-icon>

                  
                </v-list-item>
                </v-list>
              </div>
            </v-tab-item>
          </v-tabs-items>

          <v-btn class="btn-next-step"
            @click="setStepper(3)"
          >
            Tiếp theo
          </v-btn>

        </v-stepper-content>

        <v-stepper-content step="3" style="width:563px">
          <v-row >
              <v-col cols="3">
                <v-subheader>Cấu hình khác</v-subheader>
              </v-col>
              <v-col cols="9">
                <v-text-field
                  dense
                ></v-text-field>
              </v-col>
            </v-row>

          <v-btn class="btn-next-step"
            @click="resetData();closePanel()"
          >
            Hoàn thành
          </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>
<script>
import { userApi } from "./../../api/user.js";
import { permissionPackageApi } from "./../../api/PermissionPackage.js";
import { str } from "./../../plugins/utilModules/str.js";
export default {
  props:{
    actionType:{    // type là add hay update hay detail user
      type: String,
      default: "add"
    }
  },
  data(){
    return {
        user:{id:'', firstName:'', lastName:'', displayName:'', userName:' ', email:' ', password:null, phone:'', active:true},
        stepper: 1,
        loader: null,
        loading: false,
        actionPanel : 'Tạo User',
        enabledPassword:false,
        autoRenPassword:true,
        needChangePassword : true,
        sendMailAfterChange : true,
        tabIndex:0,
        itemsTypePermission: [
          {title:'Phân quyền theo vị trí',listPermission:[],permissionSelected:[]},
          {title:'Phân quyền theo package',listPermission:[],permissionSelected:[]},
        ],
        showPass: false,
        rules: {
          required: value => !!value || 'Không được bỏ trống.',
          min: v => (typeof v != 'undefined' && v != undefined && v.length >= 8) || 'Yêu cầu mật khẩu lớn hơn 8 kí tự',
          max: v => (typeof v != 'undefined' && v != undefined && v.length < 25) || 'Yêu cầu mật khẩu ít hơn 24 kí tự',
          email: value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return pattern.test(value) || 'Email không hợp lệ';
          },
        },
        formHasErr : true,
      }
  },
  watch: {
    loader () {
      if(this.loader == 'loading'){
        this.loading = true;
        this.validateForm();
      }
    },
    formHasErr(){
      if(this.formHasErr){
        this.loading = false;
        this.loader = null;
        this.formHasErr = !this.formHasErr;
      }
    },
    actionType(){
      this.actionPanel = this.actionType
      if(this.actionType == 'add') {
        this.resetData();
        this.actionPanel = "Tạo User"
      }
      if(this.actionType == 'edit') {
        this.formHasErr = false;
        this.actionPanel = "Cập nhật User"
      }
    }
  },
  methods:{
    setStepper(step){
      this.stepper = step;
    },
    setUser(user){
      this.user = user;
    },
    actionUser(){
      if(this.actionType == 'add'){
        this.addNewUser()
      }
      else if(this.actionType == 'edit'){
        
      }
    },
    resetValidate(){
      this.$refs.userName.reset();
      this.$refs.email.reset();
      this.$refs.password.reset();
    },
    validateForm(){
      this.formHasErr = false;
      let validUserName = this.$refs.userName.validate(true);
      let validEmail = this.$refs.email.validate(true);
      if(validUserName && validEmail){
        if(this.enabledPassword){
          if(this.$refs.password.validate(true))
            this.actionUser();
          else{
            this.formHasErr = true;
          }
        }
        else{
          this.actionUser();
        }
      }
      else{
        this.formHasErr = true;
      }
      return this.formHasErr;
    },
    selectPermission(perPackage){
      let currentPackage = this.itemsTypePermission[this.tabIndex].permissionSelected.find(x => x.id === perPackage.id);
      if(currentPackage == undefined && typeof currentPackage == 'undefined'){
        this.addUserToPackage(this.user.id,perPackage.id,perPackage.packName);
      }
    },

    addUserToPackage(userId,packId,packTitle){
      permissionPackageApi.addUserToPackage({userId:userId,packId:packId}).then(res => {
        if (res.status == 200) {
          this.itemsTypePermission[this.tabIndex].permissionSelected.push({id:packId,packName:packTitle});
        }
      })
      .catch(err => {
        console.log("error from add user api!!!", err);
      })
      .always(() => {

      });
    },
    deletePackage(packId){
      userApi.deleteUserPackage({userId:this.user.id,packId:packId}).then(res => {
        if (res.status == 200) {
          let currentPackage = this.itemsTypePermission[this.tabIndex].permissionSelected.find(x => x.id === packId);
          var index = this.itemsTypePermission[this.tabIndex].permissionSelected.indexOf(currentPackage);
          this.itemsTypePermission[this.tabIndex].permissionSelected.splice(index,1);
          this.itemsTypePermission[this.tabIndex].permissionSelected.push({id:packId,packName:packTitle});
        }
      })
      .catch(err => {
        console.log("error from add user api!!!", err);
      })
      .always(() => {

      });
    },

    addNewUser(){
      const cpn = this;
      let passProps = {
        needChange:this.needChangePassword,
        dueDate:""
      }
      let password = (this.autoRenPassword) ? this.generatePassword() : this.user.password;
      let data = {
        email:this.user.email,firstName:this.user.firstName,lastName:this.user.lastName,
        userName:this.user.userName,displayName:this.user.displayName,
        phone:this.user.phone,status:this.user.active, password: password,passwordProps: JSON.stringify(passProps)
      }
      userApi.addUser(data).then(res => {
        if (res.status == 200) {
          cpn.loadPermission();
          cpn.setStepper(2);
          cpn.loading = false;
          this.actionPanel = "Tiếp theo";
          cpn.loader = null;
          let status = (data.status == 1 || data.status == true) ? 'Đang mở' : 'đã khóa'
          let date = new Date();
          cpn.user.id = res.data.id;
          //phat lai sự kiện thêm item vào list
          cpn.$emit("refresh-new-user", {
            id:res.data.id,firstName:data.firstName,displayName:data.displayName,email:data.email,phone:data.phone,status:status,createAt:str.formatDate(date),updateAt:str.formatDate(date)
          });
        }
      })
      .catch(err => {
        console.log("error from add user api!!!", err);
      })
      .always(() => {

      });
    },
    editUser(){

    },

    loadPermission(){
      this.getPackage();
      this.getUserPackage();
    },

    getPackage(){
      permissionPackageApi.getAllPackage(20).then(res => {
        if (res.status == 200) {
          this.itemsTypePermission[1].listPermission = res.data.data
        }
      })
      .catch(err => {
        console.log("error from get pack api!!!", err);
      })
      .always(() => {

      });
    },
    getUserPackage(){
      console.log(this.user.id);
      
      userApi.getListUserPackage(this.user.id).then(res => {
        if (res.status == 200) {
          this.itemsTypePermission[1].permissionSelected = res.data;
        }
      })
      .catch(err => {
        console.log("error from get pack api!!!", err);
      })
      .always(() => {

      });
    },
    generatePassword() {
      var result      = '';
      var upperCharacters  = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var lowerCharacters  = 'abcdefghijklmnopqrstuvwxyz';
      let number      = "0123456789";
      var charactersLength = upperCharacters.length;
      for ( var i = 0; i < 6; i++ ) {
          result += upperCharacters.charAt(Math.floor(Math.random() * charactersLength));
          result += lowerCharacters.charAt(Math.floor(Math.random() * charactersLength));
      }
        result += number.charAt(Math.floor(Math.random() * number.length));
        result += number.charAt(Math.floor(Math.random() * number.length));      
      return result;
    },
    resetData(){
      this.user = {id:'', firstName:'', lastName:'', displayName:'', userName:'', email:'', password:'', phone:'', active:true},
      this.stepper = 1,
      this.loader = null,
      this.loading = false,
      this.enabledPassword =false,
      this.autoRenPassword =true,
      this.needChangePassword  = true,
      this.sendMailAfterChange  = true,
      this.tabIndex = 0,
      this.itemsTypePermission = [
        {title:'Phân quyền theo vị trí',listPermission:[],permissionSelected:[]},
        {title:'Phân quyền theo package',listPermission:[],permissionSelected:[]},
      ]
    },
    closePanel(){
      this.resetValidate();
      this.$emit("close-panel");
    }

  }
}
</script>
<style scoped>
  .stepper-header{
    width: 230px;
    height: auto;
    display: block;
    border-right: 1px solid #eaeaea;
    box-shadow: none;
  }
  .stepper-header .v-stepper__step{
    height: 30px;
    margin: 10px;
    padding: 20px;
  }
  .stepper-header .v-stepper__step--active{
    background: #f2f2f2;
    border-radius: 4px;
  }
  .v-stepper__content{
    height: 100%;
  }

  .v-subheader{
    padding: 0;
  }
  .v-input--checkbox{ 
    margin-top: 0;
  }
  .setting-password{
    margin: 16px 0;
  }
  .v-stepper__wrapper .row .col{
    padding: 0 12px;
  }
  .btn-next-step{
    position: absolute;
    bottom: 20px;
    right: 20px;
    box-shadow: none ;
    background: white ;
    color: green ;
  }
  .permission-item{
    background: #f2f2f2;
    margin: 4px 0;
    border-radius: 4px;
  }
  .permission-item .mdi{
    cursor: pointer;
  }
  .stepper-create-user{
    box-shadow: none;
    height: calc(100% - 50px);
  }
  .header-title{
    padding: 12px 0;
    border-bottom: 1px solid #eaeaea;
  }
  
</style>
<style >
</style>
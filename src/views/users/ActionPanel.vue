<template>
  <div class="h-100">
    <h2 class="header-title">Tạo User</h2>
    <v-stepper v-model="stepper" class="d-flex stepper-create-user">
      <v-stepper-header class="stepper-header">
        <v-stepper-step editable :complete="stepper > 1" step="1">Thông tin chung</v-stepper-step>
        <v-stepper-step editable :complete="stepper > 2" step="2">Phân quyền</v-stepper-step>
        <v-stepper-step editable step="3">Cài đặt thêm</v-stepper-step>
      </v-stepper-header>

      <v-stepper-items>
        <v-stepper-content  step="1">
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
                  v-model="user.email"
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
            <v-checkbox dense v-model="autoRenPassword" @click="enabledPassword = !enabledPassword" :label="`Tạo mật khẩu Tự động`"></v-checkbox>
            <v-checkbox dense v-model="enabledPassword" @click="autoRenPassword = !autoRenPassword" :label="`Mật khẩu của bạn`"></v-checkbox>
            <v-row>
              <v-col cols="1">
              </v-col>
              <v-col cols="2">
                <v-subheader>Mật khẩu</v-subheader>
              </v-col>
              <v-col cols="9">
                <v-text-field
                  :disabled="!enabledPassword"
                  dense
                ></v-text-field>
              </v-col>
            </v-row>
            <v-checkbox dense class="sym-small-size" :label="`yêu cầu người dùng này thay đổi mật khẩu khi họ đăng nhập lần đầu`"></v-checkbox>
            <v-checkbox dense :label="`gửi mật khẩu trong email sau khi hoàn thành`"></v-checkbox>

            
          <v-btn class="btn-next-step"
            @click="stepper = 2"
          >
            Tiếp theo
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
              v-for="item in itemsTypePermission"
              :key="item.title"
            >
              {{ item.title }}
            </v-tab>
          </v-tabs>

          <v-tabs-items  v-model="tabIndex">
            <v-tab-item
              v-for="item in itemsTypePermission"
              :key="item.title"
            >
              <v-autocomplete
              class="mt-4"
                v-model="selectedPermission"
                :items="item.listPermission"
                dense
                outlined
                @change="selectPermission(selectedPermission)"
              ></v-autocomplete>

              <div>
                <v-list dense>

                  <v-list-item
                    class="permission-item"
                    :inactive="false"
                    v-for="permission in item.permissionSelected"
                    :key="permission.id"
                >
                
                <v-list-item-content>
                        <v-list-item-title>{{ permission.title }}</v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-icon @click="change()">
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
            @click="stepper = 3"
          >
            Tiếp theo
          </v-btn>

        </v-stepper-content>

        <v-stepper-content step="3">
          <v-card
            class="mb-12"
            color="grey lighten-1"
            height="200px"
          ></v-card>

          <v-btn class="btn-next-step"
            @click="done()"
          >
            {{actionDone}}
          </v-btn>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </div>
</template>
<script>
import { userApi } from "./../../api/user.js";
export default {
  props:{
    actionDone:{
      type: String,
      default: ""
    }
  },
  data(){
    return {
        user:{id:'',firstName:'',lastName:'',displayName:'',userName:'',email:'',phone:''},
        stepper: 1,
        enabledPassword:false,
        autoRenPassword:true,
        tabIndex:0,
        selectedPermission:"",
        itemsTypePermission: [
          {title:'Phân quyền theo vị trí',listPermission:['trưởng bộ phận','phòng ban','trưởng bộ phận1','phòng ban1','trưởng bộ phận4','phòng ban4','trưởng bộ phận13','phòng ban13','trưởng bộ phận12','phòng ban12','trưởng bộ phận11','phòng ban11'],permissionSelected:[]},
          {title:'Phân quyền theo package',listPermission:['ok1','hi1'],permissionSelected:[]},
        ],
      }
    
  },
  mounted() {
  },
  created(){
  },
  methods:{
    setUser(user){
      this.user = user;
    },
    done(){
      alert('ok');
    },
    selectPermission(selected){
      this.itemsTypePermission[this.tabIndex].permissionSelected.push({id:selected,title:selected});
      this.selectedPermission = "";
    },
    change(){
      alert('xoa')
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
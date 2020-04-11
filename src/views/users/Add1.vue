<template>
  <ValidationObserver ref="observer" v-slot="{ validate, reset }">
    <h2>Thêm tài khoản mới</h2>
    <form>
      <ValidationProvider v-slot="{ errors }" name="fullName" rules="required">
        <v-text-field
          v-model="fullName"
          :error-messages="errors"
          label="Họ và tên"
          required
        ></v-text-field>
      </ValidationProvider>
      <ValidationProvider v-slot="{ errors }" name="email" rules="required|email">
        <v-text-field
          v-model="email"
          :error-messages="errors"
          type="email"
          label="Email"
          required
        ></v-text-field>
      </ValidationProvider>
      
      <ValidationProvider v-slot="{ errors }" name="password" rules="required|password">
        <v-text-field
          v-model="password"
          :error-messages="errors"
          type="password"
          label="Mật khẩu"
          required
        ></v-text-field>
      </ValidationProvider>

      <ValidationProvider v-slot="{ errors }" name="phone" rules="phone">
        <v-text-field
          v-model="phone"
          type="number"
          :error-messages="errors"
          label="Số điện thoại"
        ></v-text-field>
      </ValidationProvider>
      <ValidationProvider name="note">
        <v-text-field
        v-model="note"
        label="Ghi chú"
        ></v-text-field>
      </ValidationProvider>



      <v-combobox
          :items="permission"
          label="Quyền hạn"
          v-model="permissionSelected"
          multiple
          chips
          dense
        >

          <template v-slot:selection="data">
            <v-chip
              :key="JSON.stringify(data.item)"
              v-bind="data.attrs"
              :input-value="data.selected"
              :disabled="data.disabled"
              @click:close="data.parent.selectItem(data.item)"
            >
              <v-avatar
                class="accent white--text"
                left
                v-text="data.item.slice(0, 1).toUpperCase()"
              ></v-avatar>
              {{ data.item }}
            </v-chip>
          </template>
        </v-combobox>

        <span class="v-label theme--light">Nhóm</span>
        <v-row align="center">
          
          <v-col class="d-flex" cols="12" sm="1" v-for="group in groups" :key="group.id">
            <v-select
              v-model="group.name"
              v-bind:label="group.name"
              :items="itemsGroup"
              dense
              outlined
            ></v-select>
          </v-col>
          
        </v-row>
      <v-switch v-model="active" label="Kích hoạt"></v-switch>

      <v-btn class="mr-4" @click="submit">Tạo</v-btn>
      <v-btn @click="clear">Tạo lại</v-btn>
    </form>
  </ValidationObserver>
</template>
<script>
  import { required, email, max } from 'vee-validate/dist/rules'
  import { extend, ValidationObserver, ValidationProvider, setInteractionMode } from 'vee-validate'
  import { userApi } from "./../../api/user.js";

  setInteractionMode('eager')

  extend('required', {
    ...required,
    message: '{_field_} không được bỏ trống',
  })

  extend('max', {
    ...max,
    message: '{_field_} Không thể lớn hơn {length} Kí tự',
  })

  extend('email', {
    ...email,
    message: 'Email không hợp lệ',
  })
  extend('password', value => {
    if (value.length >= 8 && value.length <= 24) {
      return true;
    }
    return 'Mật khẩu phải lớn hơn 8 kí tự và bé hơn 24 kí tự';
  })
  extend('phone', value => {
    if (value.length >= 9 && value.length <= 11) {
      return true;
    }
    return 'Số điện thoại ko hợp lệ';
  })

  export default {
    components: {
      ValidationProvider,
      ValidationObserver,
    },
    created(){
      this.getListGroup();
    },
    data: () => ({
      fullName: '',
      email: '',
      phone :'',
      note:'',
      avatar:'',
      password:'',
      permission: [
          'User',
          'Backup',
          'Log',
          'Config',
          'Chat',
          'Business',
        ],
      permissionSelected: '',
      groups : [],
      itemsGroup :[
        'Thành viên',
        'Quản lí',
      ],
      active: false,
    }),

    methods: {
      submit () {
        let thisCpn = this;
        let validate = this.$refs.observer.validate();
        validate.then(function(result) {
          if(result == true){
            let status = (thisCpn.active == true) ? 1 : 0;
            let dataPost = {fullName:thisCpn.fullName, email:thisCpn.email,password:thisCpn.password,phone:thisCpn.phone,
            avatar:thisCpn.avatar,note:thisCpn.note,permission:JSON.stringify(thisCpn.permissionSelected),status:status};

            userApi.addUser(dataPost)
              .then(res => {
                  if (res.status == 200) {
                      thisCpn.setListGroup(res.data);

                  }
              })
              .catch(err => {
                  console.log("error from list group user api!!!", res);
              })
              .always(() => {
              });
          }
          else{
            // Dialog.
          }
        })
        
      },
      clear () {
        this.fullName = '',
        this.email = '',
        this.phone = '',
        this.note = '',
        this.password = '',
        this.active = false,
        this.$refs.observer.reset()
      },

      getListGroup(){
        let thisCpn = this;
        userApi
          .getGroupUser()
          .then(res => {
              if (res.status == 200) {
                  thisCpn.setListGroup(res.data);
              }
          })
          .catch(err => {
              console.log("error from list group user api!!!", res);
          })
          .always(() => {
          });
      },
      setListGroup(groups){
        this.groups = groups;
      }
    },
  }
</script>
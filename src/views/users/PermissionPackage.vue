<template>
  <!-- <per-item :v-for="packageItem in listPermissionPackageSelected"
        :title="packageItem.title"
    ></per-item> -->

  <v-stepper v-model="e1" class="d-flex">
    <v-stepper-header class="stepper-header">
      <v-stepper-step :complete="e1 > 1" step="1">Thông tin chung</v-stepper-step>
      <v-stepper-step :complete="e1 > 2" step="2">Phân quyền</v-stepper-step>
      <v-stepper-step :complete="e1 > 3" step="3">Nhóm</v-stepper-step>
      <v-stepper-step step="4">Cài đặt thêm</v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content  step="1">
        <h2>Thông tin cá nhân</h2>
          <v-row>
            <v-col cols="3">
              <v-subheader>Tên</v-subheader>
            </v-col>
            <v-col cols="4">
              <v-text-field
              dense="true"
              ></v-text-field>
            </v-col>
            <v-col cols="1">
              <v-subheader>Họ</v-subheader>
            </v-col>
            <v-col cols="4">
              <v-text-field
              dense="true"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row >
            <v-col cols="3">
              <v-subheader>Tên hiển thị</v-subheader>
            </v-col>
            <v-col cols="9">
              <v-text-field
                dense="true"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="3">
              <v-subheader>Tên tài khoản</v-subheader>
            </v-col>
            <v-col cols="9">
              <v-text-field
              dense="true"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="3">
              <v-subheader>Email</v-subheader>
            </v-col>
            <v-col cols="9">
              <v-text-field
                dense="true"
                suffix="@gmail.com"
              ></v-text-field>
            </v-col>
          </v-row>
        <v-btn
          color="primary"
          @click="e1 = 2"
        >
          Tiếp theo
        </v-btn>

      </v-stepper-content>

      <v-stepper-content step="2">
        <v-card
          class="mb-12"
          color="grey lighten-1"
          height="200px"
        ></v-card>

        <v-btn
          color="primary"
          @click="e1 = 3"
        >
          Tiếp theo
        </v-btn>

        <v-btn text>Cancel</v-btn>
      </v-stepper-content>

      <v-stepper-content step="3">
        <v-card
          class="mb-12"
          color="grey lighten-1"
          height="200px"
        ></v-card>

        <v-btn
          color="primary"
          @click="e1 = 4"
        >
          Tiếp theo
        </v-btn>
      </v-stepper-content>

      <v-stepper-content step="4">
        <v-card
          class="mb-12"
          color="grey lighten-1"
          height="200px"
        ></v-card>

        <v-btn
          color="primary"
          @click="done()"
        >
          Tiếp theo
        </v-btn>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>
<script>
import { userApi } from "./../../api/user.js";
import PermissionPackageItem from "./items/PermissionPackageItem.vue";
export default {
  components: {
      "per-item": PermissionPackageItem
  },
  data(){
    return {
        listPermissionPackage :[],
        listPermissionPackageSelected :[],
        e1: 1,
    }
  },
  mounted() {
  },
  created(){
  },
  methods:{
    done(){
      alert('ok');
    }
    
  }
}
</script>
<style scoped>
  .stepper-header{
    width: 230px;
    height: auto;
    display: block;
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

  v-subheader{
    padding: 0;
  }
  
</style>
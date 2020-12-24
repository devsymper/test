<template>
    <v-flex xs12 sm8 md4>
        <v-card 
            class="elevation-6" 
            style="top: 50%; left: 50%; transform: translate(-50%,-50%);">
            <v-card-text>
                <div class="d-flex justify-center bg-secondary mb-3">
                    <div class="fs-16" style="color:rgba(0, 0, 0, 0.87)!important">Quên thông tin tài khoản</div>
                </div>
                 <v-divider></v-divider>
                <v-form ref="form">
                    <v-text-field
                        :rules="emailRules"
                        v-model="email"
                        color="orange darken"
                        label="Tài khoản"
                        name="login"
                        type="text"
                    >
                        <v-icon slot="prepend">mdi-account-outline</v-icon>
                    </v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    @click="forgotPass()"
                    text
                    class="symper-bg-orange w-100"
                    dark
                >Gửi</v-btn>
            </v-card-actions>
        </v-card>
        <v-dialog
            v-model="showNotification"
            persistent
            max-width="290"
        >
            <v-card>
                <v-card-title class="headline ">
                    <span v-if="isSuccess">Thông báo thành công</span>
                    <span v-else>Gửi yêu cầu thất bại</span>
                </v-card-title>
                <v-card-text  class=" fs-13">
                    <span   v-if="isSuccess">
                        Gửi yêu cầu quên mật khẩu của bạn đã thành công!
                    </br>
                        Vui lòng vào email của bạn để reset mật khẩu!
                    </span>
                    <span  v-if="!isSuccess">
                        Rất tiếc gửi yêu cầu của bạn đã thất bại!
                    </span>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                    color="green darken-1"
                    text
                    @click="showNotification = false"
                    >
                    Đóng
                    </v-btn>
                </v-card-actions>
            </v-card>
      </v-dialog>
    </v-flex>
</template>
<script>
import { userApi } from "./../api/user.js";

export default {
  methods: {
      forgotPass(){
          const self = this;
          userApi.forgotBaPass(this.email).then(res=>{
              if(res.status==200){
                  self.showNotification = true;
                  self.isSuccess = true;
              }
          })
      }
  },
   data(){
         return {
            showNotification: false,
            isSuccess:false,
            email:"",
            emailRules: [
                    v => !!v || "Email không được để trống",
                    v => /.+@.+\..+/.test(v) || "Email không hợp lệ"
                ],
         }
   }
}
</script>
<template>

   <v-flex xs12 sm8 md4>
        <v-card 
            class="elevation-6" 
            style="top: 50%; left: 50%; transform: translate(-50%,-50%);">
             <div class="d-flex justify-center bg-secondary mb-3 ">
                    <div class="fs-16 mt-4" >Đổi mật khẩu cho tài khoản 
                        <span style="color:blue">{{this.$route.query.email}}</span>
                    </div>
                </div>
                 <v-divider class="ml-2 mr-2"></v-divider>
            <v-card-text>
                <v-form ref="form" v-model="valid">
                     <v-text-field
                    class="fs-13 ml-3" 
                    prepend-inner-icon="mdi-lock-open-outline"
                    v-model="newPassword"
                    :append-icon="showPassNew ? 'mdi-eye' : 'mdi-eye-off'"
                    dense 
                    placeholder="Mật khẩu mới"
                    outlined
                    :rules="[rules.required, rules.min, rules.max, rules.notMatch]" 
                    :type="showPassNew ? 'text' : 'password'"
                    @click:append="showPassNew = !showPassNew">
                </v-text-field>
                        <v-icon slot="prepend">mdi-account-outline</v-icon>
              <v-text-field
                    class="fs-13 ml-3" 
                    prepend-inner-icon="mdi-lock-open-outline"
                    v-model="reNewPassword" 
                    ref="reNewPass" 
                    dense 
                    :append-icon="showPassRenew ? 'mdi-eye' : 'mdi-eye-off'"
                    placeholder="Xác nhận mật khẩu mới"
                    outlined
                    :rules="[rules.required, rules.min, rules.max, rules.match,rules.notMatch]" 
                    :type="showPassRenew ? 'text' : 'password'"
                    @click:append="showPassRenew = !showPassRenew">
                </v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions   style="margin-top:-10px">
                <v-btn
                    @click="save()"
                    text
                    class="symper-bg-orange w-100"
                    dark
                >Lưu</v-btn>
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
                    <span v-else>Đổi mật khẩu thất bại</span>
                </v-card-title>
                <v-card-text  class=" fs-13">
                    <span   v-if="isSuccess">
                       Bạn đã đổi mật khẩu thành công!</span>
                    <span  v-if="!isSuccess">
                        Rất tiếc gửi yêu cầu đổi mật khẩu của bạn đã thất bại!
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
    data() {
        return {
            showNotification:false,
            isSuccess:false,
            reNewPassword:'',
            showPassRenew:false,
            showPassNew:false,
            newPassword: "",
            rules: {
                required: value => !!value || 'Không được bỏ trống.',
                min: v => (typeof v != 'undefined' && v != undefined && v.length >= 8) || 'Yêu cầu mật khẩu lớn hơn 8 kí tự',
                max: v => (typeof v != 'undefined' && v != undefined && v.length < 25) || 'Yêu cầu mật khẩu ít hơn 24 kí tự',
                match: v => (v==this.newPassword) || 'Mật khẩu mới và xác nhận không trùng nhau',
            },
        }
    },
    methods: {
        save() {
            debugger
            let query = this.$route.query;
            let check = false;
            if (this.newPassword&&this.newPassword.length>=8&&this.newPassword.length<25&&this.newPassword==this.reNewPassword) {
                check = true;
            }
            const self = this;
            if(check){
                userApi.resetBaPass(query.email,query.expired,query.token,this.newPassword).then(res=>{
                    if(res.status==200){
                        debugger
                        self.showNotification=true;
                        self.isSuccess=true;
                    }else{
                        self.showNotification=true;
                        self.isSuccess=false;
                    }
                })
            }
        },
    },
}
</script>
<style scoped>
.fm{
    font-family:Roboto;
}
.image-change-pass{
    width:140px;
    height:146px 
}
</style>

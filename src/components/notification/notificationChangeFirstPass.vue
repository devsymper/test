<template>

<v-card class="w-100 h-100">
    <v-row class="w-100 h-100">
         <v-row class="fs-14 ml-4 mt-2 w-100">
                <span class="ml-3" style="font-weight:430">Đổi mật khẩu đăng nhập</span>
        </v-row>
        <v-row class="fs-11 fm ml-7" style="color:rgb(0,0,0,0.4)">
                Mật khẩu phải có tối thiểu 8 ký tự và ít hơn 24 kí tự
        </v-row>
        <v-col class="col-md-5 h-100">
            <img class="ml-3 image-change-pass" 
                :src="require('./../../assets/image/changePass.png')">
        </v-col>
        <v-col class="col-md-7 h-100">
          
            <v-row class="mt-1">
                 <v-text-field class="fs-13 ml-3" 
                    v-model="oldPassword" 
                    dense
                    placeholder="Mật khẩu cũ"
                    outlined
                    :append-icon="showPassOld ? 'mdi-eye' : 'mdi-eye-off'"
                    prepend-inner-icon="mdi-lock-outline"
                    :rules="[rules.required, rules.min, rules.max]" 
                    :type="showPassOld ? 'text' : 'password'" 
                    @click:append="showPassOld = !showPassOld">
                </v-text-field>
            </v-row>
            <v-row style="margin-top:-10px" >
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
            </v-row>
            <v-row style="margin-top:-10px" >
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
            </v-row>
        </v-col>
    </v-row>
    <v-card-actions class="d-flex justify-end h-100 mr-1" style="margin-top:-30px">
        <v-btn small color="success" dark @click="submit()">Cập nhật</v-btn>
    </v-card-actions>
</v-card>
</template>
<script>
import { userApi } from "./../../api/user.js";
export default {
    data() {
        return {
            oldPassword: "",
            reNewPassword:'',
            showPassRenew:false,
            showPassNew:false,
            showPassOld:false,
            newPassword: "",
            rules: {
                required: value => !!value || 'Không được bỏ trống.',
                min: v => (typeof v != 'undefined' && v != undefined && v.length >= 8) || 'Yêu cầu mật khẩu lớn hơn 8 kí tự',
                max: v => (typeof v != 'undefined' && v != undefined && v.length < 25) || 'Yêu cầu mật khẩu ít hơn 24 kí tự',
                notMatch: v => (v!=this.oldPassword) || 'Mật khẩu mới không được trùng khớp mật khẩu cũ',
                match: v => (v==this.newPassword) || 'Mật khẩu mới và xác nhận không trùng nhau',

            },
        }
    },
    created() {
      
    },
    computed: {
        sapp() {
            return this.$store.state.app;
        }
    },
    methods: {
        updateBaPass(id,data){
            userApi.updateUser(id, data).then(res => {
                if (res.status == 200) {
                    this.$snotify({
                        type: "success",
                         title: this.$t("user.notification.successChangePass")
                    });
                    this.$emit('cancel');
                } else {
                    this.$snotify({
                        type: "error",
                        title: this.$t("user.notification."+res.message)
                    });
                }
            })
            .catch(err => {
                console.log("error from change pass user api!!!", err);
            })
        },
        refreshAll(){
            this.newPassword ='';
            this.oldPassword = "";
            this.reNewPassword = "";
            this.rules.required="";
            this.rules.min="";
            this.rules.max="";
            this.rules.notMatch="";
            this.rules.match=""

        },
        changePassUser(oldPass,newPass){
            const self = this;
            userApi.changePassUser(oldPass,newPass).then(res => {
                if (res.status == 200) {
                    this.$snotify({
                        type: "success",
                        title: this.$t("user.notification.successChangePass")
                    });
                    debugger
                    self.$emit('cancel');
                   
                } else {
                    this.$snotify({
                        type: "error",
                        title: this.$t("user.notification."+res.message)
                    });
                }
               
            })
            .catch(err => {
                console.log("error from change pass user api!!!", err);
            })
        },
        submit() {
            let data = {
                id: this.sapp.endUserInfo.id
            };
            let check = false;
            if (this.newPassword&&this.oldPassword!=this.newPassword&&this.newPassword.length>=8&&this.newPassword.length<25&&this.newPassword==this.reNewPassword) {
                check = true;
            }
            if(check){
                if(this.$store.state.app.allBA.length>0){
                    this.updateBaPass(this.sapp.endUserInfo.id);
                }else{
                     this.changePassUser(this.oldPassword,this.newPassword);
                }
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

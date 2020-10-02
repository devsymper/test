<template>
<v-card class="w-100 h-100">
    <v-row class="w-100" style="height:176px" >
        <v-col class="col-md-5 h-100">
            <img class="ml-3 mt-5 image-change-pass" 
                :src="require('./../../assets/image/changePass.png')">
        </v-col>
        <v-col class="col-md-7 h-100">
            <div class="fs-13">
                Đổi mật khẩu đăng nhập lần đầu
            </div>
            <div class="fs-10 fm mt-1 mb-2" style="color:rgb(0,0,0,0.4)">
                Mật khẩu phải có tối thiểu 8 ký tự, có ít nhất 1 ký tự hoa, 1 chữ số và 1 chữ thường.
            </div>
            <v-row class="mt-1">
                 <v-text-field class="fs-13 ml-3" 
                    v-model="newPassword" 
                    ref="newPass" dense
                    placeholder="Mật khẩu mới"
                    outlined
                    prepend-inner-icon="mdi-lock-outline"
                    :rules="[rules.required, rules.min, rules.max]" 
                    :type="showPass ? 'text' : 'password'" 
                    @click:prepend-inner="showPass = !showPass">
                </v-text-field>
            </v-row>
            <v-row style="margin-top:-10px" >
                <v-text-field
                    class="fs-13 ml-3" 
                    prepend-inner-icon="mdi-lock-open-outline"
                    v-model="reNewPassword" 
                    ref="reNewPass" 
                    dense 
                    placeholder="Xác nhận mật khẩu"
                    outlined
                    :rules="[rules.required, rules.min, rules.max, rules.match]" 
                    :type="showPass ? 'text' : 'password'"
                    @click:prepend-inner="showPass = !showPass">
                </v-text-field>
            </v-row>
        </v-col>
    </v-row>
    <v-card-actions class="d-flex justify-end h-100">
        <v-btn small color="success" dark @click="submit()">Cập nhật</v-btn>
    </v-card-actions>
</v-card>
</template>
<script>
import { userApi } from "./../../api/user.js";
export default {
    data() {
        return {
            newPassword: "",
            reNewPassword: "",
            showPass: false,
            rules: {
                required: value => !!value || 'Không được bỏ trống.',
                min: v => (typeof v != 'undefined' && v != undefined && v.length >= 8) || 'Yêu cầu mật khẩu lớn hơn 8 kí tự',
                max: v => (typeof v != 'undefined' && v != undefined && v.length < 25) || 'Yêu cầu mật khẩu ít hơn 24 kí tự',
                match: v => (v==this.newPassword) || 'Mật khẩu không trùng khớp',
            },
        }
    },
    created() {
    },
    computed: {
        sapp() {
            debugger
            return this.$store.state.app;
        }
    },
    methods: {
        updateBaPass(id,data){
            userApi.updateUser(id, data).then(res => {
                if (res.status == 200) {
                    debugger
                    this.$snotify({
                        type: "success",
                        title: this.$t("notification.changePass") + " " + this.$t("notification.successTitle")
                    });
                    this.$emit('cancel');
                } else {
                    this.$snotify({
                        type: "error",
                        title: this.$t("notification.changePass") + " " + this.$t("notification.error")
                    });
                }
            })
            .catch(err => {
                console.log("error from change pass user api!!!", err);
            })
        },
        changePassUser(pass){
            userApi.changePassUser(pass).then(res => {
                if (res.status == 200) {
                    this.$snotify({
                        type: "success",
                        title: this.$t("notification.changePass") + " " + this.$t("notification.successTitle")
                    });
                    this.$emit('cancel');
                } else {
                    this.$snotify({
                        type: "error",
                        title: this.$t("notification.changePass") + " " + this.$t("notification.error")
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
            if (this.newPassword&&this.newPassword==this.reNewPassword&&this.newPassword.length>=8&&this.newPassword.length<25) {
                data.password = this.newPassword;
                check = true;
            }
            if(check){
                if(this.$store.state.app.allBA.length>0){
                    this.updateBaPass(this.sapp.endUserInfo.id);
                }else{
                    debugger
                     this.changePassUser(this.newPassword);
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
    width:122px;
    height:136px 
}
</style>

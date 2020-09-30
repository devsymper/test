 <template>
    <v-flex xs12 sm8 md4>
        <v-card class="elevation-6" style="top: 50%;
                                            left: 50%;
                                            transform: translate(-50%,-50%);">
            <v-toolbar flat>
                <v-toolbar-title class="w-100 text-center mt-6">
                    <img height="40px" :src="require('./../assets/image/symper-full-logo.png')" />
                </v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
                <v-form ref="form" v-model="valid">
                    <v-text-field
                        :rules="emailRules"
                        v-model="email"
                        color="orange darken"
                        label="Tài khoản"
                        @keyup.enter="checkAndLogin"
                        name="login"
                        type="text"
                    >
                        <v-icon slot="prepend">mdi-account-outline</v-icon>
                    </v-text-field>
                    <v-text-field
                        v-model="password"
                        :rules="passwordRules"
                        color="orange darken"
                        id="password"
                        label="Mật khẩu"
                        name="password"
                        @keyup.enter="checkAndLogin"
                        prepend-icon="lock"
                        type="password"
                    >
                        <v-icon slot="prepend">mdi-lock-outline</v-icon>
                    </v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    :loading="checkingUser"
                    @click="login()"
                    text
                    class="symper-bg-orange w-100"
                    dark
                >Đăng nhập</v-btn>
            </v-card-actions>
        </v-card>
    </v-flex>
</template>

<script>
import { userApi } from "./../api/user.js";
import { util } from "./../plugins/util.js";

export default {
    methods: {
        checkAndLogin(){
            let canLogin = true;
            if(!this.email.trim()){
                canLogin = false;
                this.$snotifyWarning({}, "Email không được để trống");
            }

            if(!this.password.trim()){
                canLogin = false;
                this.$snotifyWarning({}, "Mật khẩu không được để trống");
            }

            if(canLogin){
                this.login();
            }
        },
        login() {
            this.$refs.form.validate();
            let thisCpn = this;
            if (this.valid) {
                thisCpn.checkingUser = true;
                userApi
                    .login(this.email.trim(), this.password.trim())
                    .then(res => {
                        if (res.status == 200) {
                            this.$store.dispatch('app/setUserInfo', res.data);
                            thisCpn.$router.push('/');
                        } else {
                            thisCpn.$snotifyError( {}, "Không thể đăng nhập","Tài khoản hoặc mật khẩu không chính xác!");
                        }
                    })
                    .catch(err => {
                        console.log("error from login api!!!", err);
                    })
                    .always(() => {
                        setTimeout(() => {
                            thisCpn.checkingUser = false;
                        }, 1000);
                    });
            } else {
                console.log("Login info is not valide!!!!");
            }
        }
    },
    data() {
        return {
            checkingUser: false,
            valid: true,
            email: "",
            // dinhnv@symper.vn
            password: "",
            // email: "dinhnv@symper.vn",
            // password: "Damthatbai@2010",
            emailRules: [
                v => !!v || "Email không được để trống",
                v => /.+@.+\..+/.test(v) || "Email không hợp lệ"
            ],
            passwordRules: [v => !!v || "Mật khẩu không được để trống"]
        };
    }
};
</script>

<style>
</style>
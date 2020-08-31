<template>
    <v-flex xs12 sm8 md4>
        <v-card class="elevation-6">
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
                        label="Account"
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
                        label="Password"
                        name="password"
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
                >Login</v-btn>
            </v-card-actions>
        </v-card>
    </v-flex>
</template>

<script>
import { userApi } from "./../api/user.js";
import { util } from "./../plugins/util.js";

export default {
    methods: {
        login() {
            this.$refs.form.validate();
            let thisCpn = this;
            if (this.valid) {
                thisCpn.checkingUser = true;
                userApi
                    .login(this.email, this.password)
                    .then(res => {
                        if (res.status == 200) {
                            this.$store.dispatch('app/setUserInfo', res.data);
                            thisCpn.$router.push('/');
                        } else {
                            alert("Tài khoản hoặc mật khẩu không đúng!");
                        }
                    })
                    .catch(err => {
                        console.log("error from login api!!!", err);
                    })
                    .always(() => {
                        thisCpn.checkingUser = false;
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
            // Damthatbai@2010
            emailRules: [
                v => !!v || "E-mail is required",
                v => /.+@.+\..+/.test(v) || "E-mail must be valid"
            ],
            passwordRules: [v => !!v || "Password is required"]
        };
    }
};
</script>

<style>
</style>
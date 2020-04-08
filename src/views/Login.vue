<template>
    <v-flex xs12 sm8 md4>
        <v-card class="elevation-6">
            <v-toolbar flat>
                <v-toolbar-title class="w-100 text-center">
                    <img height="30px" :src="require('./../assets/image/symper-full-logo.png')" />
                </v-toolbar-title>
                <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
                <v-form>
                    <v-text-field color="orange darken" label="Account" name="login" type="text">
                        <v-icon slot="prepend">mdi-account-outline</v-icon>
                    </v-text-field>
                    <v-text-field
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
                <v-btn text class="symper-bg-orange w-100" dark>Login</v-btn>
            </v-card-actions>
        </v-card>
    </v-flex>
</template>

<script>
export default {};
</script>

<style>
</style>
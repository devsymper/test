<template>
    <div id="symper-platform-web-app">
        <v-app id="symper-platform-app">
            <v-main>
                <v-container fluid fill-height>
                    <v-layout justify-center>
                        <slot />
                    </v-layout>
                </v-container>
            </v-main>
        </v-app>
    </div>
</template>

<script>
export default {};
</script>

<style>
</style>
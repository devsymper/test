<template>
    <div id="symper-platform-web-app">
        <v-app id="symper-platform-app">
            <ba-sidebar />
            <v-content>
                <v-container fluid fill-height>
                    <v-layout justify-center align-center>
                        <v-flex shrink>
                            <slot/>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-content>
        </v-app>
    </div>
</template>

<script>
import BASidebar from "@/components/common/BASidebar.vue";
export default {
    components: {
        "ba-sidebar": BASidebar,
    },
    created() {}
};
</script>

<style></style>

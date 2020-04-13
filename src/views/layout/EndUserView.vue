<template>
    <v-app id="symper-platform-app">
        <ba-sidebar />
        <v-content>
            <v-container fluid fill-height>
                <v-layout justify-center >
                    <slot/>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
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

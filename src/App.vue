<template>
    <div id="symper-app">
        <component :is="layout">
            <router-view/>
        </component>
    </div>
</template>

<script>
/**
 * Cách tổ chức layout học theo: https://itnext.io/anyway-heres-how-to-create-a-multiple-layout-system-with-vue-and-vue-router-b379baa91a05
 */
import AppSidebar from "./components/common/AppSidebar.vue";
import Content from "./components/common/Content.vue";
import appWorker from "@/worker";

export default {
    computed:{
        layout(){
            let isBA = this.$store.state.app.accountType == 'ba';
            let contentOnly = this.$route.meta && this.$route.meta.layout == 'content-only'

            if(contentOnly){
                return 'content-only-view';
            }else{
                return isBA ? 'ba-view' : 'end-user-view';
            }
        }
    }
};
</script>

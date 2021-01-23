<template>
    <div class="w-100 " style="height: calc(100% - 41px)">
        <div class="w-100 h-100">
            <iframe ref="dashboardItems" class="w-100 h-100" :src="(url) ? url :'https://bi.symper.vn/#/dashboard/'+dashboardId+'/view'" frameborder="0"></iframe>
        </div>
    </div>
</template>

<script>
import { dashboardApi } from "@/api/dashboard.js";
export default {
    watch: {
        dashboardTab(){
            setTimeout((self) => {
                let ifr = self.$refs.dashboardItems[self.dashboardTab];
                ifr.src = ifr.src;
            }, 200, this);
        }
    },
    created(){
        this.dashboardId = this.$route.params.id;
    },
    methods: {
          
    },
    data(){
        return {
            dashboardId:null
        }
    },
    props:{
        url:{
            type:String,
            default:""
        }
    }
    
}
</script>

<style>
.symper-dashboard-item .v-window__container{
    height: 100%!important;
}
</style>
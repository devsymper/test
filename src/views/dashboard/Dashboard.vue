<template>
    <div class="w-100 " style="height: calc(100% - 81px)">
        
        <v-tabs-items v-model="dashboardTab" class="w-100 h-100" >
            <v-tab-item
                v-for="dashboard in listDashboard"
                :key="dashboard.id"
                class="w-100 h-100">
                    <iframe class="w-100 h-100" :src="'https://bi.symper.vn/#/dashboard/'+dashboard.id+'/view'" frameborder="0"></iframe>
            </v-tab-item>
        </v-tabs-items>


         <v-tabs
            height="40"
            v-model="dashboardTab">
            <v-tab
                v-for="dashboard in listDashboard"
                :key="dashboard.id">
                {{ dashboard.name }}
            </v-tab>
        </v-tabs>
    </div>
</template>

<script>
import { dashboardApi } from "@/api/dashboard.js";
export default {
    created(){
        this.getListDashboard();
    },
    methods: {
        async getListDashboard(){
            let self = this;
            let res = await dashboardApi.getAllDashboard();
            let listDashboard = res.data.items.dashboards;
            self.listDashboard = listDashboard;
        }
    },
    data(){
        return {
            listDashboard: [],
            dashboardTab: null
        }
    }
    
}
</script>

<style>
.symper-dashboard-item . .v-window__container{
    height: 100%!important;
}
</style>
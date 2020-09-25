<template>
    <v-navigation-drawer
        v-show="showNavigation"
        absolute
        permanent
        width=800
        right
      >
      
        <v-icon @click="close" style="float:right">mdi-close</v-icon>
        <v-divider></v-divider>
        <v-card class="h-100">
            <v-card-title>
                HỒ SƠ NHÂN VIÊN
            </v-card-title>
            <v-card-subtitle>
                1 THÔNG TIN CHUNG
            </v-card-subtitle>
            <v-card-subtitle>
                2 KIỂU LAO ĐỘNG
            </v-card-subtitle>
        </v-card>
     
      </v-navigation-drawer>
</template>

<script>
export default {
    props:{
        showNavigation:{
            type: Boolean,
            default: false
        }
    },
    methods:{
        close(){
            this.$emit('close-navigation')
        }
        
    }
}
</script>

<style>

</style>
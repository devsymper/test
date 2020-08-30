<template>
    <v-avatar :size="size">
        <img :src="imgUrl" class="symper-avatar-image">
    </v-avatar>
</template>

<script>
import defaultAvatar from "@/assets/image/avatar_default.jpg";
export default {
    data(){
        return {
            imgUrl: defaultAvatar
        }
    },
    props: {
        size: {
            type: Number,
            default: 35
        },
        userId: {
            default: 0
        },
        url: {
            type: String,
            default: ''
        }
    },
    watch: {
        userId(){
            this.checkAndGetUrl();
        },
        url(){
            this.checkAndGetUrl();
        },
    },
    methods: {
        checkAndGetUrl(){
            this.imgUrl = defaultAvatar;
            if(this.userId){
                // if(){

                // }
            }else if(this.url) {

            }else{
                this.imgUrl = defaultAvatar;
            }
        }
    }
}
</script>

<style>
.symper-avatar-image {
    height: unset!important;
}
</style>
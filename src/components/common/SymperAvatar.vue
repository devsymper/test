<template>
    <v-skeleton-loader
        v-if="loading"
        type="avatar"
        :height="size"
        :width="size"
        class="symper-avatar-loading"
    ></v-skeleton-loader>
    <v-avatar v-else :size="size">
        <img :src="imgUrl" class="symper-avatar-image">
    </v-avatar>
</template>

<script>
import defaultAvatar from "@/assets/image/avatar_default.jpg";
import { appConfigs } from '../../configs';
import { ajax } from 'backbone';
export default {
    data(){
        return {
            imgUrl: defaultAvatar,
            loading: false,
        }
    },
    created(){
        this.checkAndGetUrl();
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
        async checkAndGetUrl(){
            this.loading = true;
            this.imgUrl = defaultAvatar;
            let userId = this.userId;
            if(userId){
                let imgUrl = appConfigs.apiDomain.fileManagement+'readFile/user_avatar_' + userId;
                await this.tryUrl(imgUrl);
            }else if(this.url) {
                await this.tryUrl(this.url);
            }else{
                this.imgUrl = defaultAvatar;
            }
            this.loading = false;
        },
        tryUrl(imgUrl){
            return new Promise( async(resolve, reject) => {
                try {
                    let res = await $.ajax(imgUrl);
                    this.imgUrl = imgUrl;
                } catch (error) {
                    this.imgUrl = defaultAvatar;
                } finally{
                    resolve();
                }
            });    
        }
    }
}
</script>

<style>
.symper-avatar-image {
    height: unset!important;
}

.symper-avatar-loading .v-skeleton-loader__avatar {
    height: inherit!important;
    width: inherit!important;
}
</style>
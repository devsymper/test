<template>
    <div class="w-100 mr-10">
        <v-row class="header ml-3">
            <v-col class="col-md-9 col-sm-9 ">
                <span class="fs-15 fw-430" v-if="showMain">Cài đặt thông báo</span>
                <span class="fs-15 fw-430" v-if="showFollow">Danh sách đối tượng đang theo dõi</span>
                <span class="fs-15 fw-430" v-if="showUnfollow">Danh sách đối tượng không theo dõi</span>
            </v-col >
            <v-col class="col-md-3 col-sm-3 d-flex justify-end">
                <v-btn @click="isShowUnFollow()" text class="fw-400 font-normal color-red">
                    Không theo dõi
                </v-btn>
                <v-btn @click="isShowFollow()" text class="fw-400 font-normal color-green">
                    Theo dõi
                </v-btn>
            </v-col >
        </v-row>
        <SettingNotification v-if="showMain" :type="type" :listItems="items"/>
        <SettingNotification v-if="showFollow" :type="type" :listItems ="items1"/>
        <SettingNotification v-if="showUnfollow" :type="type" :listItems ="items"/>
    </div>
</template>
<script>
import SettingNotification from "./../../components/notification/setting/main.vue"
export default {
  watch: {
  },
    components:{
        SettingNotification,
    },
  created () {
  },
  data () {
    return {
        type:'main',
        showMain:true,
        showFollow:false,
        showUnfollow:false,
        items: [
            {
                action: 'mdi-ticket',
                items: [
                    { title: 'List Item' }
                ],
                title: 'Bình luận',
            },
            {
                action: 'mdi-silverware-fork-knife',
                active: true,
                items: [
                    { title: 'Được nhắc đến' },
                    { title: 'Tin nhắn được trả lời' },
                    { title: 'Công việc được bình luận' },
                    ],
                title: 'Thông tin cá nhân',
            },
            {
                action: 'mdi-school',
                items: [{ title: 'List Item' }],
                title: 'Phân quyền',
            },
            {
                action: 'mdi-run',
                items: [
                    { title: 'List Item' }
                ],
                title: 'Công việc',
            },
        ],
        items1: [
            {
                action: 'mdi-ticket',
                items: [
                    { title: 'List Item' }
                ],
                title: 'Bình luận test bỏ theo dõi',
            },
        ],
    }
  },
  methods: {
       isShowUnFollow(){
            this.type="unfollow";
            this.showFollow=false;
            this.showUnfollow=true;
            this.showMain=false;
        },
        isShowFollow(){
            this.type="follow";
            this.showFollow=true;
            this.showUnfollow=false;
            this.showMain=false;
        }
  },
  
    
}
</script>
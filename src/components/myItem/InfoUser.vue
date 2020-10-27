<template>
    <div class="user-info">
        <v-menu
            open-on-hover
            top
            offset-y
            open-delay="500"
            >
            <template v-slot:activator="{ on }">
                <div  
                    v-on="on">
                        <symperAvatar :size="20" :userId="userInfo.id" />
                        {{userInfo.displayName}}
                        <div class="fs-11 ml-5 grey--text" v-if="Object.keys(roleInfo).length>0">{{roleInfo.name}}</div>
                </div>
            </template>
           <userPopup  :userId="userInfo.id" />
        </v-menu>
    </div>
</template>

<script>
import avatarDefault from "@/assets/image/avatar_default.jpg";
import symperAvatar from "@/components/common/SymperAvatar.vue";
import userPopup from "@/components/user/UserPopUp";
export default {
    components: {
        symperAvatar:symperAvatar,
        userPopup
    },
    name: "userInfo",
    props: {
        userId: {
            type: String,
            default: ""
        },
        roleInfo:{
            type:Object,
            default() {
                return {};
            }
        }
    },
    data(){
        return {
            avatarDefault: avatarDefault
        }
    },
    computed: {
        userInfo(){
            if (this.userId) {
                let allUsers=this.$store.state.app.allUsers;
                let obj = allUsers.find(data => data.id === this.userId)
                return obj;
            }else{
                return {};
            }
        }
    }
}
</script>

<style>

</style>
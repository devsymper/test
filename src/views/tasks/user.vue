<template>
    <div>
        <div class="d-inline-block float-left mr-3">
            <v-avatar size="30">
                <v-img 
                    :src="user.avatar ? user.avatar : avatarDefault"
                ></v-img>
                <!-- <v-icon
                    v-else
                    v-text="user.avatar"
                ></v-icon> -->
            </v-avatar>
        </div>
        <div class="d-inline-block">
            <div class="fs-13 ">{{user.displayName}}</div>
            <!-- <div class="grey--text fs-11">{{user.role}}</div> -->
            <div class="grey--text fs-12">{{role.name}}</div>
        </div>
    </div>
</template>

<script>
import avatarDefault from "@/assets/image/avatar_default.jpg";

export default {
    name: "user",
    props: {
        user: {
            type: Object,
            default: () => {}
        }
    },
    data(){
        return {
            avatarDefault: avatarDefault
        }
    },
    computed: {
        role(){
            return {
                id: '',
                orgchart: '',
                vizId: '',
                name: ''
            }
        }
    }
}
</script>

<style>

</style>
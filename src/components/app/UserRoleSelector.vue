<template>
    <div class="bg-white">
        <div  v-if="Object.values(userRoles).length  == 0">
            <span class="title">
                {{$t('userRole.userHasNoRole')}}
            </span>
        </div>
        <div v-else >
            <v-list dense class="pb-0" v-for="(roles, key) in userRoles" :key="key">
                <v-list-item-group class="mx-3 mt-1 mr-0 ml-0" >
                    <div class="font-weight-medium fs-13 px-4">
                        {{mapRoleTitle[key]}}
                    </div>
                    <v-list-item
                        class="py-1 px-0 fs-16 pl-4 pr-2"
                        @click="selectUserRole(item)"
                        v-for="(item, i) in roles"
                        :key="i">
                        <div>
                            <div class="fs-13">
                                {{item.name}}
                            </div>
                            <div class="fs-11 grey--text">
                                {{item.orgchartName}}
                            </div>
                        </div>

                        <v-icon  color="green" v-if="currentRole.id == item.id" class="selected-role-check float-right ml-4">
                            mdi-check
                        </v-icon>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </div>
    </div>
</template>

<script>
import { userApi } from '../../api/user';

export default {
    created(){
        let self = this;
    },
    data(){
        return {
            mapRoleTitle: {
                orgchart: this.$t('common.orgchart'),
                systemRole: this.$t('systemRole.name')
            },
        }
    },
    computed: {
        userRoles(){
            let roles = this.$store.state.app.endUserInfo.roles;
            let rsl = {};

            if(roles.orgchart.length){
                rsl.orgchart = roles.orgchart;
            }
            
            if(roles.systemRole.length){
                rsl.systemRole = roles.systemRole;
            }
            return rsl;
        },
        currentRole(){
            return this.$store.state.app.endUserInfo.currentRole;
        }
    },
    mounted(){

    },
    methods: {
        selectUserRole(role){
            this.$store.dispatch('app/changeUserRole', role);

            /**
             * Cần xét trường hợp khi chuyển user mà thì cần lựa chọn luôn role cho người đó
             * Hoặc khi một người mới đăng nhập mà chưa có role, cần chọn default một role cho họ
             * Hoặc một người bị xóa role thì cần lựa chọn một role khác cho họ
             */
        }
    }
}
</script>

<style>
/* .selected-role-check {
    position: absolute!important;
    right: 5px;
} */
</style>
<template>
    <div class="bg-white">
        <div  v-if="Object.values(userRoles).length  == 0">
            <span class="title">
                {{$t('userRole.userHasNoRole')}}
            </span>
        </div>
        <div v-else >
            <v-list dense class="pb-0" v-for="(roles, key) in userRoles" :key="key">
                <v-list-item-group class="mx-3 mt-1">
                    <div class="font-weight-medium fs-13">
                        {{mapRoleTitle[key]}}
                    </div>
                    <v-list-item
                        @click="selectUserRole(item)"
                        v-for="(item, i) in roles"
                        :key="i">
                        <span class="fs-13">
                            {{item.name}}
                        </span>

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
        async selectUserRole(role){
            let res = await userApi.changeRole(role.id);
            if(res.status == 200){
                this.$store.dispatch('app/setUserInfo', res.data);
                location.reload();
            }else {
                this.$snotifyError(res, "Can not change user role");
            }
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
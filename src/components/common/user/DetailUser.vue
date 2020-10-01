<template>
    <div class="symper-detail-user pl-4 pt-2">
        <!-- panel title -->
        <div class="symper-title">
            {{$t('user.myInfo.title')}}
            <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                    <v-icon
                        v-on="on"
                        class="close-btn float-right"
                        @click="closePanel"
                    >mdi-close</v-icon>
                </template>
                <span>{{$t('common.close')}}</span>
            </v-tooltip>
        </div>

        <div class="d-flex w-100 mt-4">
            <!-- Thông tin chính -->
            <div class="general-info d-inline-block" style="width: 65%">
                <div class="subtitle-2 " style="position: relative">
                    {{$t('user.myInfo.generalInfo')}}

                    <v-tooltip top v-if="!isEditing">
                        <template v-slot:activator="{ on }">
                            <v-btn
                                @click="isEditing = true"
                                icon tile class="float-right" small style="position: absolute; bottom: 2px; right: 0px"
                                >
                                
                                <v-icon
                                v-on="on"
                                size="16"
                                >mdi-grease-pencil</v-icon>
                            </v-btn>
                        </template>
                        <span>{{$t('common.update') + ' ' + $t('user.myInfo.generalInfo')}}</span>
                    </v-tooltip>


                    <v-tooltip top v-else>
                        <template v-slot:activator="{ on }">
                            <v-btn
                                color="blue"
                                @click="saveUserInfo"
                                icon tile class="float-right" small style="position: absolute; bottom: 2px; right: 0px"
                                >
                                
                                <v-icon
                                    class=""
                                    v-on="on"
                                    size="16"
                                >mdi-content-save</v-icon>
                            </v-btn>
                        </template>
                        <span>{{$t('common.save') + ' ' + $t('user.myInfo.generalInfo')}}</span>
                    </v-tooltip>
                </div>
                <div v-for="(value, key) in showableUserInfo" :key="key" class="pl-4 mb-1">
                    <div class="detail-user-label">
                        {{$t('user.general.personalInfo.'+key)}}
                    </div>
                    <div v-if="isEditing" class="detail-user-value editable-value">
                        <v-text-field
                            solo
                            flat
                            hide-details
                            class="sym-small-size sym-style-input"
                            single-line
                            v-model="showableUserInfo[key]">
                        </v-text-field>
                    </div>
                    <div v-else class="detail-user-value read-only-value">
                        {{showableUserInfo[key]}}
                    </div>
                    <v-btn 
                        icon tile class="float-right" v-if=" !isEditing && (key == 'email' || key == 'phone')" small style="position: relative; bottom: 5px">
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <v-icon
                                    class="close-btn float-right"
                                    v-on="on"
                                    v-clipboard:copy="showableUserInfo[key]"  
                                    size="15"
                                    >mdi-content-copy
                                </v-icon>
                            </template>
                            <span>{{$t('common.copy') + ' ' + $t('user.general.personalInfo.'+key) }}</span>
                        </v-tooltip>
                    </v-btn>
                </div>
            </div>

            <!-- Avatar -->
            <div class="user-avatar d-inline-block pa-2" style="width: 35%" >
                <SymperAvatar :userId="lazyUserInfo.id" :size="100" />
            </div>
        </div>
        
        <!-- Vai trò của user -->
        <div class="user-role-info w-100 fs-13 mt-6">
            <div class="subtitle-2 ">
                {{$t('user.myInfo.myPosition')}}
            </div>

            <div class="pl-4 d-flex mt-1" v-if="lazyUserInfo.roles.orgchart.length">
                <div class="detail-user-label  mt-1">
                    {{$t('common.orgchart')}}
                </div>
                <div class="detail-user-value">
                    <div v-for="role in lazyUserInfo.roles.orgchart" :key="role.id">
                        <div >
                            <i class="fs-16 mdi mdi-check text--blue mr-1"></i> 
                            {{role.name}}
                        </div>
                        <div class="text--lighten-2 grey-text pl-6">
                            {{role.path}}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="pl-4 d-flex mt-2" v-if="lazyUserInfo.roles.orgchart.length">
                <div class="detail-user-label mt-1">
                    {{$t('common.system')}}
                </div>
                <div class="detail-user-value">
                    <div v-for="role in lazyUserInfo.roles.systemRole" :key="role.id">
                        <div class="">
                            <i class="fs-16 mdi mdi-check text--blue mr-1"></i> 
                            {{role.name}}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import SymperAvatar from "@/components/common/SymperAvatar";
import { util } from '../../../plugins/util';
import VueClipboard from 'vue-clipboard2';
import Vue from "vue";
Vue.use(VueClipboard)
export default {
    components: {
        SymperAvatar
    },
    data(){
        return {
            lazyUserInfo: {
                id: 0,
                firstName: '',
                lastName: '',
                displayName: '',
                email: '',
                phone: '',
                roles: {
                    orgchart: [],
                    system: []
                }
            },
            isEditing: false
        }
    },
    created(){
        this.reAssignUserInfo();
    },
    computed: {
        showableUserInfo(){
            let rsl = util.cloneDeep(this.lazyUserInfo);
            delete rsl.id;
            delete rsl.roles;
            return rsl;
        }
    },
    methods: {
        saveUserInfo(){
            this.isEditing = false;
        },
        closePanel(){

        }, 
        reAssignUserInfo(){
            let rsl = {};
            for(let key in this.lazyUserInfo){
                if(this.userInfo[key]){
                    rsl[key] = this.userInfo[key];
                }
            }
            this.lazyUserInfo = null;
            this.lazyUserInfo = rsl;
        }
    },
    props: {
        userId: {
            default: 0
        },
        userInfo: {
            default: {}
        }
    },
    watch: {
        userInfo: {
            deep: true,
            immediate: true,
            handler(){
                this.reAssignUserInfo();
            }
        }
    }
}
</script>

<style scoped>
    .symper-detail-user .detail-user-label {
        width: 100px;
        font-weight: 500;
        display: inline-block;
        font-size: 13px;
    }

    .symper-detail-user .detail-user-value{
        font-size: 13px;
        /* width: calc(100% - 100px); */
        display: inline-block;
    }

    .symper-detail-user .detail-user-value.editable-value{
        width: calc(100% - 100px);
    }

    .symper-detail-user .user-avatar{
        display: inline-block;
        text-align: center;
        margin: auto;
    }
</style>
<template>
    <div class="symper-detail-user pl-4 pt-2">
        <!-- panel title -->
        <div class="w-100 h-100 d-flex flex-column flex-grow-1" v-if="isViewUserRole==false">
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
                        <div v-if="isEditing && (key != 'email' && key != 'displayName')" class="detail-user-value editable-value">
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
                            icon tile class="float-right" v-if=" !isEditing && (key == 'email' || key == 'phone')" small style="position: relative; bottom: 2px">
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
                    <div class="ml-4">
                         <div @click="changePass()" class="detail-user-label">
                            {{$t('user.general.personalInfo.pass')}}
                              <v-icon style = "font-size: 16px; margin-top:-2px">mdi-lock-outline</v-icon>
                        </div>
                          <v-dialog
                                v-model="openChangePassForm"
                                width="397"
                                >
                            <NotificationChangePass ref = "changePass" @cancel="cancelDialog()"/>
                        </v-dialog>
                    </div>
                </div>

                <!-- Avatar -->
                <div class="user-avatar d-inline-block pa-2" style="width: 35%" >
                    <v-avatar :size="80">
                        <img v-if="avatarUrl != ''"
                            :src="avatarUrl"
                        >
                        <img v-if="avatarUrl== ''"
                            :src="require('./../../../assets/image/avatar_default.jpg')"
                        >
                     </v-avatar>
                    <!-- <SymperAvatar :userId="lazyUserInfo.id" :size="100" /> -->
                    <UploadFile 
                        :pickAvatar="true"
                        :fileName="avatarFileName"
						@selected-file="handleAvatarSelected"
                        ref="uploadAvatar"
                        :pickAvatar="true"
                    />
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
                                <i class="fs-16 mdi mdi-check  indigo--text text--darken-4 mr-1"></i>
                                <v-btn class="fm fw-400" 
                                    style="margin-bottom:-8px"
                                    text 
                                    @click="viewUserRole(role.id)" >
                                    <span class='fm'>
                                        {{role.name}}
                                    </span>
                                </v-btn>
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
                                <i class="fs-16 mdi mdi-check  indigo--text text--darken-4 mr-1"></i> 
                                <v-btn class="fm fw-400" 
                                    style="margin-bottom:-8px"
                                    text 
                                    @click="viewUserRole(role.id)" >
                                    <span class='fm'>
                                        {{role.name}}
                                    </span>
                                </v-btn>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div  class="w-100 h-100" v-if="isViewUserRole">
            <ViewRoles 
                @show-userInfo="showUserInfo()"
                :rolesList="role"/>
        </div>
    </div>
</template>

<script>
import SymperAvatar from "@/components/common/SymperAvatar";
import { appConfigs } from '../../../configs';
import UploadFile from "./../../../components/common/UploadFile";
import { util } from '../../../plugins/util';
import VueClipboard from 'vue-clipboard2';
import ViewRoles from "../../../views/users/ViewRoles";
import NotificationChangePass from "./../../../components/notification/notificationChangeFirstPass";
import Vue from "vue";
import { userApi } from '../../../api/user';
Vue.use(VueClipboard)
export default {
    components: {
        SymperAvatar,
        ViewRoles,
        UploadFile,
        NotificationChangePass
    },
    data(){
        return {
            role:[],
            dialog:false,
            openChangePassForm:false,
            avatarUrl:'',
            avatarFileName:'',
            isViewUserRole:false,
            lazyUserInfo: {
                id: 0,
                firstName: '',
                lastName: '',
                phone: '',
                displayName: '',
                email: '',
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
        this.getAvatarUrl();
              
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
        cancelDialog(){
            this.openChangePassForm=false;
            //this.$refs.changePass.refreshAll();
        },
        changePass(){
            this.openChangePassForm=!this.openChangePassForm;
        },
         logout(){
            util.auth.logout();
            location.reload();
        },
        getAvatarUrl(){
            this.avatarUrl= appConfigs.apiDomain.fileManagement+'readFile/user_avatar_'+ this.lazyUserInfo.id;
        },
        handleAvatarSelected(tempUrl){
            this.avatarUrl = tempUrl;
            this.avatarFileName = 'user_avatar_' + this.lazyUserInfo.id;
            this.$refs.uploadAvatar.uploadFile();
        },
        showUserInfo(){
            this.isViewUserRole=false; 
            this.$emit('make-small-panel')
        },
        viewUserRole(role){
			this.isViewUserRole =! this.isViewUserRole;
            this.role = role;
            this.$emit("expand-panel")
		},  
        saveUserInfo(){
            let self = this;
            userApi.updateUser(this.lazyUserInfo.id, this.showableUserInfo).then(res => {
                self.$snotifySuccess("Lưu thông tin thành công");
                this.isEditing = false;
            }).catch((err) => {
                self.$snotifySuccess(err, "Không thể lưu thông tin người dùng");
            });
        },
        closePanel(){
            this.$emit('closePanel')
        }, 
        reAssignUserInfo(){
            let rsl = {};
            for(let key in this.lazyUserInfo){
                if(this.userInfo[key] !== null && this.userInfo[key] !== undefined){
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
        },
        close:{
            default:true
        }
    },
    watch: {
        close(){
            if(this.close==false){
                this.isViewUserRole=false
            }
        },
        openChangePassForm(){
            //this.$refs.changePass.refreshAll();
        },
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
    .fm{
		font-family:Roboto!important;
		font-size:13px!important
	}
	.fw-400{
		font-weight:400
	}
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

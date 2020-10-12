<template>
    <div class="symper-detail-user pl-4 pt-2 h-100">
        <!-- panel title -->
        <div class="w-100 h-100 d-flex flex-column flex-grow-1" style="min-height:700px!important" v-if="isViewUserRole==false">
            <div class="symper-title">
                {{$t('user.myInfo.title')}}
                <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                        <v-icon
                            v-on="on"
                            style="font-size:18px"
                            class="close-btn float-right mr-4"
                            @click="closePanel"
                        >mdi-close</v-icon>
                    </template>
                    <span >{{$t('common.close')}}</span>
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
                            icon tile class="float-right" v-if=" !isEditing && (key == 'email' || key == 'phone')" 
                            small
                            style="position: relative; bottom: 2px">
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
                         <div class="detail-user-label">
                            {{$t('user.general.personalInfo.pass')}}
                        </div>
                        <div @click="changePass()" class="detail-user-value editable-value">  
                            Đổi mật khẩu
                               <v-icon style = "font-size: 16px; margin-top:-2px">mdi-lock-outline</v-icon>
                        </div>
                    </div>
                    <div v-if="checkPass" style="margin-top:-10px; margin-bottom:-25px">
                        <v-col cols="12">
                            <span  class="fs-12 st-icon-pandora" style="color:grey">
                                Mật khẩu ít nhất 8 kí tự và ít hơn 24 kí tự
                            </span>
                        </v-col>
                    </div>
                    <v-row  v-if="checkPass"  class="mt-1">
                        <v-col cols="10">
                            <v-text-field class="fs-13 ml-3"
                                v-model="oldPassword" 
                                ref="newPass" dense
                                placeholder="Mật khẩu cũ"
                                outlined
                                prepend-inner-icon="mdi-lock-outline"
                                :rules="[rules.required, rules.min, rules.max]" 
                                :type="showPass ? 'text' : 'password'" 
                                @click:prepend-inner="showPass = !showPass">
                            </v-text-field>
                        </v-col>
                    </v-row>
                    <v-row  v-if="checkPass" style="margin-top:-30px; margin-bottom:-45px" >
                        <v-col cols="10">
                            <v-text-field
                                class="fs-13 ml-3" 
                                prepend-inner-icon="mdi-lock-open-outline"
                                v-model="newPassword" 
                                ref="reNewPass" 
                                dense 
                                placeholder="Mật khẩu mới"
                                outlined
                                :rules="[rules.required, rules.min, rules.max, rules.match]" 
                                :type="showPass ? 'text' : 'password'"
                                @click:prepend-inner="showPass = !showPass">
                        </v-text-field>
                        </v-col>
                            <v-col cols="2">
                            <v-icon @click="submit()" style="color:green; margin-top:5px; font-size: 18px">mdi mdi-check</v-icon>
                            </v-col>
                    </v-row>
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
                        :fileName="avatarFileName"
						@selected-file="handleAvatarSelected"
                        ref="uploadAvatar"
                        :autoUpload="false"
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
        <div  class="w-100 h-100" v-if="isViewUserRole">
            <ViewRoles 
                @show-userInfo="showUserInfo()"
                :rolesList="role"/>
        </div>
         <div class=" mr-4 d-flex align-end" 
            style=" height: 330px!important; align-self: flex-end">
                <v-btn @click="logout" text class="mt-10" style="align-self: flex-end">
                    <span class="fm fw-400  mr-5 " 
                    >Đăng xuất</span>
                </v-btn>
            </div>
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
import Vue from "vue";
import { userApi } from '../../../api/user';
Vue.use(VueClipboard)
export default {
    components: {
        SymperAvatar,
        ViewRoles,
        UploadFile
    },
    data(){
        return {
            role:[],
            checkPass:false,
            newPassword:'',
            oldPassword:'',
             rules: {
                required: value => !!value || 'Không được bỏ trống.',
                min: v => (typeof v != 'undefined' && v != undefined && v.length >= 8) || 'Yêu cầu mật khẩu lớn hơn 8 kí tự',
                max: v => (typeof v != 'undefined' && v != undefined && v.length < 25) || 'Yêu cầu mật khẩu ít hơn 24 kí tự',
                match: v => (v!=this.oldPassword) || 'Mật khẩu không được trùng khớp',
            },
            avatarUrl:'',
            showPass: false,
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
        submit() {
            let check = false;
            if (this.newPassword&&this.oldPassword!=this.newPassword&&this.newPassword.length>=8&&this.newPassword.length<25) {
                check = true;
            }
            if(check){
                 this.changePassUser(this.oldPassword);
            }
        },
        changePassUser(pass){
            userApi.changePassUser(pass).then(res => {
                if (res.status == 200) {
                    this.$snotify({
                        type: "success",
                        title: this.$t("user.notification.successChangePass")
                    });
                    this.$emit('cancel');
                } else {
                    this.$snotify({
                        type: "error",
                        title: this.$t("user.notification."+res.message)
                    });
                }
            })
            .catch(err => {
                console.log("error from change pass user api!!!", err);
            })
        },
        changePass(){
            this.checkPass=!this.checkPass;
        },
         logout(){
            util.auth.logout();
            location.reload();
        },
        getAvatarUrl(){
            this.avatarUrl= appConfigs.apiDomain.fileManagement+'readFile/user_avatar_'+ this.lazyUserInfo.id;
        },
        handleAvatarSelected(tempUrl){
            debugger
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
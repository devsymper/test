<template>
    <div class="h-100">
        <h3 class="header-title" >{{$t('user.passwordSetting.title')}}</h3>
        
        <div class=" ml-3 content-edit-pass">
            <h4 class="mt-2">{{$t('user.passwordSetting.changePassword.title')}}</h4>
			<v-checkbox dense class="sym-small-size mt-2 pl-3" v-model="checkChangePassword" @click="changePassword = !changePassword" :label="$t('user.passwordSetting.changePassword.title')"></v-checkbox>

            <v-row>
                <v-col cols="3">
                    <v-subheader class="fs-13">{{$t('user.passwordSetting.changePassword.newPass')}}</v-subheader>
                </v-col>
                <v-col cols="5">
                    <v-text-field
                        class="fs-13"
                        v-model="newPassword"
                        ref="newPass"
                        dense
                        :disabled="!changePassword"
                        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min, rules.max]"
                        :type="showPass ? 'text' : 'password'"
                        @click:append="showPass = !showPass"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="3">
                    <v-subheader class="fs-13">{{$t('user.passwordSetting.changePassword.reNewPass')}}</v-subheader>
                </v-col>
                <v-col cols="5">
                    <v-text-field
                        class="fs-13"
                        v-model="reNewPassword"
                        ref="reNewPass"
                        dense
                        :disabled="!changePassword"
                        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                        :rules="[rules.required, rules.min, rules.max, rules.match]"
                        :type="showPass ? 'text' : 'password'"
                        @click:append="showPass = !showPass"
                    ></v-text-field>
                </v-col>
            </v-row>

            <h4 class="mt-2 mb-4">{{$t('user.passwordSetting.configChange.title')}}</h4>
			<v-checkbox dense class="sym-small-size mt-2 pl-3" v-model="checkChangeDuedate" @click="changeDuedate = !changeDuedate" :label="$t('user.passwordSetting.configChange.checkChange')"></v-checkbox>
            <label class="title__a">{{$t('user.passwordSetting.configChange.lblSelectTime')}}</label>
                
                <v-text-field
                    ref="dueDate"
                    class="dueDate fs-13"
                    v-model="dueDate"
                    type="number"
                    :disabled="!changeDuedate"
                    :rules="[rules.required]"
                    dense
                ></v-text-field>
                <v-select
                    v-model="typeDueDate"
                    return-object
                    hide-details
                    dense
                    item-text="name"
                    item-value="type"
                    class="select-type-due-date fs-13"
                    :disabled="!changeDuedate"
                    :items="[
                        {name:$t('user.passwordSetting.configChange.month'),type:'month'},
                        {name:$t('user.passwordSetting.configChange.year'),type:'year'}
                        ]"
                ></v-select>
        </div>
        <v-btn
                class="float-right btn-update"
                :loading="loading"
                :disabled="loading"
                @click="loader = 'loading'"
            >
                {{$t('common.update')}}
            </v-btn>
    </div>
</template>
<script>
import { userApi } from "./../../api/user.js";
export default {
    props:{
        user:{
            type: Object,
            default : {id:0}
        }
    },
    data(){
        return {
            changePassword:false,
            changeDuedate:false,
            checkChangePassword:false,
            checkChangeDuedate:false,
            newPassword:"",
            reNewPassword:"",
            loading:false,
            loader:"",
            showPass:false,
            rules: {
				required: value => !!value || 'Không được bỏ trống.',
				min: v => (typeof v != 'undefined' && v != undefined && v.length >= 8) || 'Yêu cầu mật khẩu lớn hơn 8 kí tự',
                max: v => (typeof v != 'undefined' && v != undefined && v.length < 25) || 'Yêu cầu mật khẩu ít hơn 24 kí tự',
                match: v => (v == this.reNewPassword) || "Mật khẩu không khớp",
            },
            typeDueDate:{name:'tháng',type:'month'},
            dueDate:'',
            passProps:{}
        }
    },
    created(){
        this.getTypeDueData();
    },
    computed:{
       
    },
    methods:{
        getTypeDueData(){
            let props = this.user.passwordProps;
            let passwordProps = JSON.parse(props);
            this.dueDate = passwordProps.dueDate.value;
            this.passProps = passwordProps;
            this.checkChangeDuedate = (passwordProps.dueDate.active == 1) ? true : false;
            this.changeDuedate = this.checkChangeDuedate;
        },
        submit(){
            let data = {id:this.user.id};
            this.passProps.dueDate.active = (this.checkChangeDuedate) ? 1 : 0;
            this.passProps.dueDate.value = this.dueDate;
            this.passProps.dueDate.type = this.typeDueDate.type;
            let passwordProps = JSON.stringify(this.passProps);
            data.passwordProps = passwordProps
            if(this.newPassword != ''){
                data.password = this.newPassword
            }
            userApi.updateUser(data).then(res => {
				if (res.status == 200) {
                    this.loader = "";
                    this.loading = false;
				}
			})
			.catch(err => {
				console.log("error from change pass user api!!!", err);
			})
			.always(() => {

			});
        },
        validateForm(){
            let isValid = true;
            if(this.checkChangePassword){
                let validNewPass = this.$refs.newPass.validate(true);
                let validReNewPass = this.$refs.reNewPass.validate(true);
                if(!validNewPass && !validReNewPass){
                    isValid = false;
                }
            }
            if(this.checkChangeDuedate){
                if(!this.$refs.dueDate.validate(true)){
                    isValid = false;
                }
            }
            if(!isValid){
                this.loader = "";
                this.loading = false;
            }
            else {
                this.submit();
            }
            
        },
    },
    watch:{
        loader () {
            if(this.loader == 'loading'){
                this.loading = true;
                this.validateForm();
            }
            
        },
        user(){
            this.getTypeDueData();
        }
    }
   
}
</script>
<style scoped>
    .header-title{
		padding: 0 0 12px 0;
		border-bottom: 1px solid #eaeaea;
    }
    .content-edit-pass{
        height: calc(100% - 100px);
    }
    .btn-update{
        height: 36px;
        min-width: 64px;
        padding: 0 16px;
        margin-right: 20px;
        box-shadow: none;
        background: white;
        color: green;
    }
    .dueDate{
        width: 40px;
        margin-right: 8px;
        display: inline-flex;
    }
    .select-type-due-date{
        width: 80px;
        display: inline-flex;
    }
    .content-edit-pass label{
        color: rgba(0, 0, 0, 0.6);
    }
    .title__a{
        padding-left: 16px;
        padding-right: 4px;
        font-size: 13px;
    }
    .title__b{
        padding-left: 4px;
    }
</style>
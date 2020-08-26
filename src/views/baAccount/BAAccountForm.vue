<template>
    <div class="pa-2 h-100">
        <div class="title py-2">
            {{panelTitle}}
        </div>
        <FormTpl
            ref="comonAttr"
            :viewOnly="action == 'detail'"
            :singleLine="false"
            :allInputs="allInputs"
        >
        </FormTpl> 
        <div class="mt-2" v-if="action != 'view' ">
            <v-btn
                class="float-right mr-1"
                small
                depressed
                color="primary"
                @click="saveBAAccount">

                <v-icon class="mr-2" primary>mdi-content-save</v-icon>
                {{action == 'create' ? $t('common.save') : $t('common.update')}}
            </v-btn>
        </div>
    </div>
</template>

<script>
import FormTpl from "@/components/common/FormTpl.vue";
import { HotTable, HotColumn } from "@handsontable/vue";
import { util } from '../../plugins/util';
import { userApi } from '../../api/user';

export default {
    mounted(){
        this.tableHeight = util.getComponentSize(this).h - util.getComponentSize(this.$refs.comonAttr).h - 180;
    },
    created(){
        
    },
    methods: {
        async saveBAAccount(){
            let dataToSave = {};
            if(this.action == 'update'){
                dataToSave.email = this.allInputs.email.value;
                dataToSave.fullname = this.allInputs.name.value;
                let isValidValue = this.validateUserInfo(dataToSave);
                if(isValidValue){
                    let res = await userApi.updateBAAccountInfo(this.itemData.id, dataToSave);
                    if(res.status == 200){
                        this.$snotifySuccess("Update BA account successfully");
                    }else{
                        this.$snotifyError(res,"Can not update BA account");
                    }
                }
            }else if(this.action == 'updatePassword'){
                dataToSave.password = this.allInputs.newPassword.value;
                dataToSave.oldPassword = this.allInputs.oldPassword.value;
                dataToSave.confirmNewPassword = this.allInputs.confirmNewPassword.value;
                let isValidValue = this.validatePassword(dataToSave);
                if(isValidValue){
                    let res = await userApi.updateBAAccountPassword(this.itemData.id, dataToSave);
                    if(res.status == 200){
                        this.$snotifySuccess("Update BA password successfully");
                    }else{
                        this.$snotifyError(res,"Can not update BA password");
                    }
                }
            }else if(this.action == 'create'){
                dataToSave.email = this.allInputs.email.value;
                dataToSave.fullname = this.allInputs.name.value;
                dataToSave.password = this.allInputs.password.value;

                let isValidValue = this.validateUserInfo(dataToSave);
                if(isValidValue){
                    let res = await userApi.createBAAccount(dataToSave);
                    if(res.status == 200){
                        this.$snotifySuccess("Create BA password successfully");
                    }else{
                        this.$snotifyError(res,"Can not create BA account");
                    }
                }
            }
            this.$emit('saved-item-data');
        },

        validatePassword(data){
            let rsl = true;
            if(data.confirmNewPassword != data.password){
                rsl = false;
                this.$snotifyError({}, "New password not match");
            }
            return rsl;
        },

        validateUserInfo(data){
            let rsl = true;
            for(let key in data){
                if(data[key].trim() == ''){
                    rsl = false;
                    this.$snotifyError({}, key + " can not be empty");
                }
            }

            if(data.email.trim() != '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)){
                rsl = false;
                this.$snotifyError({}, "Email is not valid");
            }
            return rsl;
        },
        handleEditorShow(data){
            this.isEditingCell = data;
        }
    },
    data(){
        let self = this;
        return {
            tableHeight: 200,
        }
    },
    components: {
        FormTpl,
    },
    props: {
        itemData: {
            type: Object,
            default(){
                return {}
            }
        },
        action: {
            type: String,
            default: ''
        },
        panelTitle: {
            type: String,
            default: ''
        },
    },
    computed: {
        allInputs(){
            if(this.action == 'updatePassword'){
                return {
                    oldPassword: {
                        "title": this.$t('user.passwordSetting.changePassword.oldPassword'),
                        "type": "text",
                        "value": '',
                        "info": "",
                    },
                    newPassword: {
                        "title": this.$t('user.passwordSetting.changePassword.newPass'),
                        "type": "text",
                        "value": '',
                        "info": "",
                    },
                    confirmNewPassword: {
                        "title": this.$t('user.passwordSetting.changePassword.reNewPass'),
                        "type": 'text',
                        "value": '',
                        "info": "",
                    }
                };
            }else{
                let rsl =  {
                    name: {
                        "title": this.$t('common.name'),
                        "type": "text",
                        "value": this.itemData.name,
                        "info": "",
                    },
                    email: {
                        "title": this.$t('common.email'),
                        "type": 'text',
                        "value": this.itemData.email,
                        "info": "",
                    }
                };

                if(this.action == 'create'){
                    rsl.password = {
                        "title": this.$t('login.input_text.password'),
                        "type": 'text',
                        "value": '',
                        "info": "",
                    };
                }
                return rsl;
            }
        }
        
    }
}
</script>

<style>
</style>

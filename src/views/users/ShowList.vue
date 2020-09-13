<template>
    <list-items
        ref="listUser"
        @after-open-add-panel="addUser"
        :headerPrefixKeypath="'user'"
        :useDefaultContext="false"
        :pageTitle="$t('user.title')"
        :tableContextMenu="tableContextMenu"
        :containerHeight="containerHeight"
        :customAPIResult="customAPIResult"
        :getDataUrl="getListUrl+'users?page=1&pageSize=50'"
        :actionPanelWidth="actionPanelWidth"
        :commonActionProps="commonActionProps"
    >
        <div slot="right-panel-content" class="h-100">
            <action-panel
            ref="panel"
            @refresh-data="refreshListUser"
            @refresh-new-user="setNewUserItem"
            @close-panel="closePanel"
            :actionType="actionType"
            :isSettingPasswordView="isSettingPasswordView"
            />
        </div>
    </list-items>
</template>
<script>
import { userApi } from "./../../api/user.js";
import ListItems from "./../../components/common/ListItems.vue";
import ActionPanel from "./../../views/users/ActionPanel.vue";
import ChangePassPanel from "./../../views/users/ChangePass.vue";
import { util } from "./../../plugins/util.js";
import { appConfigs } from '../../configs';

export default {
    components: {
        "list-items": ListItems,
        "action-panel": ActionPanel,
    },
    data(){
        return {
            customAPIResult: {
                reformatData(res){
                    let data = res.data;
                    for(let col of data.columns){
                        col.title = col.title.replace('user.','');
                    }
                    return data;
                } 
            },
            commonActionProps: {
                "module": "account",
                "resource": "account",
                "scope": "account",
            },
            getListUrl: appConfigs.apiDomain.user,
            actionPanelWidth:800,
            containerHeight: 200,
            tableContextMenu:{
                change_pass: {
                    name:"passwordsetting",
                    text:this.$t('user.table.contextMenu.passwordSetting'),
                    callback: (user, callback) => {
                        this.showViewSetingPassword(user);
                    }
                },
                update: {
                    name:"edit",
                    text:this.$t('user.table.contextMenu.edit'), 
                    callback: (user, callback) => {
                        this.editUser(user);
                    }
                },
                delete: {
                    name:"delete",
                    text:this.$t('user.table.contextMenu.delete'), 
                    callback: (user, callback) => {
                        this.deleteUser(user);
                    }
                }
            },
            columns: [],
            data: [],
            totalPage: 6,
            actionType:'',
            isSettingPasswordView : false
        }
    },
    mounted() {
        this.calcContainerHeight();
    },
    created(){
        let thisCpn = this;
        this.$evtBus.$on('change-user-locale',(locale)=>{
             thisCpn.tableContextMenu = [
                {name:"passwordsetting",text:this.$t('user.table.contextMenu.passwordSetting')},
                {name:"edit",text:this.$t('user.table.contextMenu.edit')},
                {name:"xóa",text:this.$t('user.table.contextMenu.delete')}

            ]

        });
    },
    watch:{
        
    },
    methods:{
        refreshListUser(){
            this.$refs.listUser.refreshList();
        },
        openPanel(){
            this.$refs.panel.setStepper(1);
            this.$refs.panel.resetPermissionPosittionOrgChart();
        },
        showViewSetingPassword(user){
            this.isSettingPasswordView = true;
            this.$refs.panel.setUser(user);
            this.$refs.listUser.openactionPanel();
        },
        changePage(page){
            alert('ok');
        },
        closePanel(){
            this.isSettingPasswordView = false;
            this.$refs.listUser.closeactionPanel();
        },
        addUser(){
            this.isSettingPasswordView = false;
            this.actionType = 'add';
            this.$refs.listUser.openactionPanel();
            // chỗ này, muốn sửa giá trị của no chỗ này
            // this.$router.push('/users/add');
        },
        editUser(user){
            this.isSettingPasswordView = false;
            this.actionType = 'edit';
            this.$refs.panel.resetData();
            this.$refs.panel.setUser(user);
        },
       deleteUser(user){
           this.$refs.panel.deleteUser(user[0].id);

       },
        setNewUserItem(user){
            this.data.unshift(user);
        },
        calcContainerHeight() {
            this.containerHeight = util.getComponentSize(this).h;
        }
    }
}
</script>

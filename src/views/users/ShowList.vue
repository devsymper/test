<template>
    <list-items
        ref="listUser"
        @change-page="changePage"
        @add-item="addUser"
        @context-selection-edit="editUser"
        @context-selection-passwordsetting="showViewSetingPassword"
        @refresh-list="getListUser"
        @open-panel="openPanel"


        :getDataUrl="'https://v2hoangnd.dev.symper.vn/users'"   
        :useDefaultContext="false"
        :pageTitle="$t('user.title')"
        :tableContextMenu="tableContextMenu"
        :containerHeight="containerHeight"
        :actionPanelWidth="actionPanelWidth"
    >
        <div slot="right-panel-content" class="h-100">
            <action-panel
            ref="panel"
            @refresh-new-user="setNewUserItem"
            @refresh-data="getListUser"
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
export default {
    components: {
        "list-items": ListItems,
        "action-panel": ActionPanel,
    },
    data(){
        return {
            actionPanelWidth:800,
            containerHeight: 200,
            tableContextMenu:[
                {name:"passwordsetting",text:this.$t('user.table.contextMenu.passwordSetting')},
                {name:"edit",text:this.$t('user.table.contextMenu.edit')}
            ],
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
                {name:"edit",text:this.$t('user.table.contextMenu.edit')}
            ]

        });
    },
    watch:{
        
    },
    methods:{
        openPanel(){
            this.$refs.panel.setStepper(1);
            this.$refs.panel.resetPermissionPosittionOrgChart();
        },
        showViewSetingPassword(row,colName){
            this.isSettingPasswordView = true;
            this.$refs.panel.setUser(this.data[row]);
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
        editUser(row,colName){
            this.isSettingPasswordView = false;
            this.actionType = 'edit';
            this.$refs.panel.resetData();
            this.$refs.panel.setUser(this.data[row]);
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

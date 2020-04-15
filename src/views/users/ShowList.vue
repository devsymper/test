<template>
    <list-items
        ref="listUser"
        @change-page="changePage"
        @add-item="addUser"
        @context-selection-edit="editUser"
        @context-selection-passwordsetting="showViewSetingPassword"
        @refresh-list="getListUser"
        @open-panel="openPanel"
        :useDefaultContext="false"
        :pageTitle="'Danh sách User'"
        :tableContextMenu="tableContextMenu"
        :containerHeight="containerHeight"
        :columns="columns"
        :data="data"
        :actionPanelWidth="actionPanelWidth"
        :totalPage="totalPage"
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
            tableContextMenu:[{name:"passwordsetting",text:"Tùy chọn mật khẩu"},{name:"edit",text:"Sửa"}],
            columns: [{"name":"id","title":"Id","type":"numeric"}],
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
        this.getListUser();
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
            this.$refs.panel.setUser(this.data[row]);
        },
        getListUser(){
            let thisCpn = this;
            userApi
                .getListUser(1,50)
                .then(res => {
                    if (res.status == 200) {
                        thisCpn.setListUser(res.data);
                    }
                })
                .catch(err => {
                    console.log("error from show list user api!!!", err);
                })
                .always(() => {
            });
        },
        setListUser(listUser){
            this.columns = listUser.columns;
            this.data = listUser.listObject;
            this.totalPage = listUser.totalPage;
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

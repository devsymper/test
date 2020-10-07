<template>
<div class="w-100">
     <list-items
        ref="listUser"
        @after-open-add-panel="addUser"
        :headerPrefixKeypath="'user.table'"
        :useDefaultContext="false"
        :pageTitle="$t('user.title')"
        :tableContextMenu="tableContextMenu"
        :containerHeight="containerHeight"
        :customAPIResult="customAPIResult"
        :getDataUrl="getListUrl+'users?page=1&pageSize=50'"
        :actionPanelWidth="actionPanelWidth"
        @import-excel="importExcel()"
        :commonActionProps="commonActionProps">
        <div slot="right-panel-content" class="h-100">
            <action-panel
                ref="panel"
                :showDetailView="showDetailView"
                @refresh-data="refreshListUser"
                @refresh-new-user="setNewUserItem"
                @close-panel="closePanel"
                :actionType="actionType"
                :isSettingPasswordView="isSettingPasswordView"
                :showViewInfo="showViewInfo"
            />
        </div>
    </list-items>
          <ImportExcelPanel
            :objType="'user'"
            :nameDocument="'Import User'"
            :nameRows="listRowUser"
            :open="showImportUser" />
    </div>
</template>
<script>
import ImportExcelPanel from "./../../components/document/ImportExelPanel";
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
        ImportExcelPanel: ImportExcelPanel,
    },
    data(){
        return {
            showDetailView:false,
            listRowUser:[],
            showImportUser:false,
            customAPIResult: {
                reformatData(res){
                    let data = res.data;
                    return data;
                } 
            },
            commonActionProps: {
                "module": "account",
                "resource": "account",
                "scope": "account",
            },
            getListUrl: {},
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
                },
                view: {
                    name:"view",
                    text:this.$t('user.table.contextMenu.view'), 
                    callback: (user, callback) => {
                        this.showViewDetailInfo(user);
                    }
                }
            },
            columns: [],
            data: [],
            totalPage: 6,
            actionType:'',
            isSettingPasswordView : false,
            showViewInfo: false
        }
    },
    mounted() {
        this.calcContainerHeight();
    },
    created(){
        this.getListUrl = appConfigs.apiDomain.user+'users?page=1&pageSize=50';
    
        let thisCpn = this;
        this.$evtBus.$on('change-user-locale',(locale)=>{
             thisCpn.tableContextMenu = [
                {name:"passwordsetting",text:this.$t('user.table.contextMenu.passwordSetting')},
                {name:"edit",text:this.$t('user.table.contextMenu.edit')},
                {name:"xóa",text:this.$t('user.table.contextMenu.delete')},
                {name:"xem chi tiết",text:this.$t('user.table.contextMenu.view')}
            ]

        });
    },
    watch:{
        
    },
    methods:{
         getListFieldUser(){
             this.listRowUser =  [{
                sheetMap: '',
                name: 'Thông tin chung',
                title: 'Thông tin chung',
                controls:[
                    {
                        dataColumn:null,
                        dataType:"text",
                        isKeyControl:false,
                        name:"firstName",
                        title:"Tên ",
                        isNull:true
                    },
                     {
                        dataColumn:null,
                        dataType:"text",
                        isKeyControl:false,
                        name:"lastName",
                        title:"Họ",
                        isNull:true
                    },
                     {
                        dataColumn:null,
                        dataType:"text",
                        isKeyControl:false,
                        name:"userName",
                        title:"Tên tên khoản",
                         isNull:false
                    },
                    {
                        dataColumn:null,
                        dataType:"text",
                        isKeyControl:false,
                        name:"displayName",
                        title:"Tên hiển thị",
                        isNull:false
                    },
                     {
                        dataColumn:null,
                        dataType:"text",
                        isKeyControl:false,
                        name:"email",
                        title:"Email",
                         isNull:false
                    },
                    {
                        dataColumn:null,
                        dataType:"text",
                        isKeyControl:false,
                        name:"phone",
                        title:"Điện thoại",
                         isNull:true
                    },
                     {
                        dataColumn:null,
                        dataType:"text",
                        isKeyControl:false,
                        name:"password",
                        title:"Mật khẩu",
                        isNull:true
                    }
                ]
            }]

         },
        importExcel(){
            this.showImportUser = !this.showImportUser;
            this.getListFieldUser();
        },
        refreshListUser(){
            this.$refs.listUser.refreshList();
        },
        openPanel(){
            this.$refs.panel.setStepper(1);
            this.$refs.panel.resetPermissionPosittionOrgChart();
        },
        showViewSetingPassword(user){
            this.isSettingPasswordView = true;
            this.showViewInfo = false;
            this.$refs.panel.setDetailInfo(user);
            this.$refs.listUser.openactionPanel();
        },
        showViewDetailInfo(user){
            this.showDetailView=!this.showDetailView;
            this.showViewInfo = true;
            this.$refs.panel.setDetailInfo(user);
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
            debugger
            this.isSettingPasswordView = false;
            this.showViewInfo = false;
            this.actionType = 'add';
            this.$refs.listUser.openactionPanel();
            // chỗ này, muốn sửa giá trị của no chỗ này
            // this.$router.push('/users/add');
        },
        editUser(user){
            this.isSettingPasswordView = false;
            this.showViewInfo = false;
            this.actionType = 'edit';
            this.$refs.panel.resetData();
            this.$refs.panel.setUser(user);
        },
       deleteUser(user){
           this.$refs.panel.deleteUser(user);

       },
        setNewUserItem(user){
            this.data.unshift(user);
        },
        calcContainerHeight() {
            debugger
            this.containerHeight = util.getComponentSize(this).h;
        }
    }
}
</script>
<style >
    /* .v-navigation-drawer{
        width: 1200px!important
    } */
</style>

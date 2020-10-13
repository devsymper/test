<template>
<div class="w-100">
     <list-items
        ref="listUser"
        @after-open-add-panel="addUser"
        :headerPrefixKeypath="'user.table'"
        :useDefaultContext="false"
        :pageTitle="$t('user.trash')"
        :tableContextMenu="tableContextMenu"
        :containerHeight="containerHeight"
        :customAPIResult="customAPIResult"
        :getDataUrl="getListUrl+'users/deleted?page=1&pageSize=50'"
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
      <UserDetailPopUp :show="isShow" :userInfo="userInfo"/>
    </div>
</template>
<script>
import UserDetailPopUp from "./../../views/users/UserDetailPopUp";
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
        UserDetailPopUp
    },
    data(){
        return {
            showDetailView:false,
            listRowUser:[],
            showImportUser:false,
            userDetailInfo:true,
            isShow:false,
            customAPIResult: {
                 setStatusImport(status){
                    let nameStatus = '';
                    switch(status){
                        case '0':
                            nameStatus = "Đã khóa";
                            break;
                        case '-1':
                            nameStatus = "Đã xóa";
                            break;
                         case '1':
                            nameStatus = "Đang hoạt động";
                            break;
                            
                        case '2':
                            nameStatus = "Mới tạo";
                            break;
                    }
                    return nameStatus;
                },
                reformatData(res){
                    let data = res.data;
                    for(let i = 0; i<data.listObject.length; i++){
                        data.listObject[i].status = this.setStatusImport(data.listObject[i].status);
                      //  data.listObject[i].userId= this.getName(data.listObject[i].userId);
                        

                    }
                        // return test
                    return  data;
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
            userInfo:{},
            tableContextMenu:{           
                restore: {
                    name:"restore",
                    text:this.$t('user.table.contextMenu.restore'), 
                    callback: (user, callback) => {
                        debugger
                        this.restoreUser(user);
                    }
                },
                view: {
                    name:"view",
                    text:this.$t('user.table.contextMenu.view'), 
                    callback: (user, callback) => {
                        this.showViewDetailInfo(user);
                    }
                },
                 test: {
                    name:"test",
                    text:"test component", 
                    callback: (user, callback) => {
                        this.showPopUp(user);
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
        this.getListUrl = appConfigs.apiDomain.user+'';
        let thisCpn = this;
        this.$evtBus.$on('change-user-locale',(locale)=>{
             thisCpn.tableContextMenu = [
                {name:"restore",text:this.$t('user.table.contextMenu.restore')},
                {name:"xem chi tiết",text:this.$t('user.table.contextMenu.view')},
                {name:"test component ",text:this.$t('user.table.contextMenu.view')}

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
                    },
                    {
                        dataColumn:null,
                        dataType:"text",
                        isKeyControl:false,
                        name:"password",
                        title:"Mật khẩu",
                        isNull:true
                    },
                    {
                        dataColumn:null,
                        dataType:"text",
                        isKeyControl:false,
                        name:"password",
                        title:"Mật khẩu",
                        isNull:true
                    },
                    {
                        dataColumn:null,
                        dataType:"number",
                        isKeyControl:false,
                        name:"orgchart_id",
                        title:"Mã sơ đồ tổ chức",
                        isNull:true
                    },
                    {
                        dataColumn:null,
                        dataType:"number",
                        isKeyControl:false,
                        name:"position_id",
                        title:"Vị trí",
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
        showPopUp(user){
            debugger
            this.userInfo = user;
            this.isShow = !this.isShow
            debugger
        },
        editUser(user){
            this.isSettingPasswordView = false;
            this.showViewInfo = false;
            this.actionType = 'edit';
            this.$refs.panel.resetData();
            this.$refs.panel.setUser(user);
        },
       restoreUser(user){
           debugger
           this.restoreOneUser(user.id)
        //   for(let i =0; i<user.length; i++){
		// 		this.restoreOneUser(user[i].id)
		// 	}

       },
       restoreOneUser(id){
			let self = this;
			let data = {
				status:1
			};
			userApi.updateUser(id, data).then(res => {
				if (res.status == 200) {
					self.refreshListUser();
					self.$snotify({
						type: "success",
						title: this.$t("notification.successTitle")});
				}
			})
			.catch(err => {
				console.log("error from add user api!!!", err);
			});
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

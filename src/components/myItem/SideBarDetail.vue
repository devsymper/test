<template>
	<v-navigation-drawer
	class="s-drawer"
	absolute
	permanent
	right
	:width="sidebarWidth"
	:style="{'transform':(isShow) ? 'translateX(0%)' : 'translateX(100%)'}"
	>
	<div class="main-info">
		<div style="display:flex;">
			<span style="font-size:15px;">{{$t('document.detail.sidebar.heading')}}</span>
			<span class="mdi mdi-close" @click="hide"></span>
		</div>

		<v-divider></v-divider>

		<VuePerfectScrollbar style="height:calc(100% - 110px);">
			<v-expansion-panels
			v-model="panel"
			multiple
			class="s-detail-sidebar"
			style="overflow-x: hidden;"
			>
				<v-expansion-panel>
					<v-expansion-panel-header class="v-expand-header">{{$t('document.detail.sidebar.body.general.title')}}</v-expansion-panel-header>
					<v-expansion-panel-content class="sym-v-expand-content">
						<div>
							<table class="general-info">
								<tr>
									<td>{{$t('document.detail.sidebar.body.general.dateCreate')}}</td>
									<td>{{originData.createTime ? $moment(originData.createTime).format('DD/MM/YY HH:mm:ss'):$moment(originData.endTime).format('DD/MM/YY HH:mm:ss')}}</td>
								</tr>
								<!-- <tr>
									<td>{{$t('document.detail.sidebar.body.general.history')}}</td>
									<td @click="showHistory" style="text-decoration: underline;cursor:pointer;color:#F1853B;">Đã sửa 2 lần</td>
								</tr> -->
								<tr>
									<td>{{$t('document.detail.sidebar.body.general.comment')}}</td>
									<td style="text-decoration: underline;cursor:pointer;color:#F1853B;" @click="showComment">
										{{$t('document.detail.sidebar.body.general.has')}} 
										{{countCommentNotResolve}} 
										{{$t('document.detail.sidebar.body.general.commentNotResolve')}}
									</td>
								</tr>
							</table>
						</div>
					</v-expansion-panel-content>
				</v-expansion-panel>
				
				<v-expansion-panel>
					<v-expansion-panel-header class="v-expand-header">{{$t('document.detail.sidebar.body.worflowInfo')}}</v-expansion-panel-header>
					<v-expansion-panel-content class="sym-v-expand-content" style="height:200px">
						<v-row class="border-top-1" style="height:200px">
							<trackingProcessInstance
								v-if="taskInfo.action.parameter.processInstanceId"
								:instanceId="taskInfo.action.parameter.processInstanceId"
								:elementId="taskInfo.action.parameter.activityId"
								@showPopupDiagram="showPopupDiagram"
								>
							</trackingProcessInstance>
						</v-row>
					</v-expansion-panel-content>
				</v-expansion-panel>
				<v-expansion-panel>
					<v-expansion-panel-header class="v-expand-header">{{$t('document.detail.sidebar.body.userRelated.title')}}</v-expansion-panel-header>
					<v-expansion-panel-content class="sym-v-expand-content">
				   		<div class="w-100 pl-2" v-for="(users, role) in dataTask" :key="role" >
							<div v-if="users.length>0 " style="height: 30px" class=" fs-13 font-weight-medium symper-user-role-in-task d-flex">
								<span>
									<v-icon class="mr-3" size="18">mdi-account</v-icon> 
									<span mt-1>{{$t("tasks.header."+role)}}</span>
								</span>
								<!-- <v-btn small icon @click="addUserForRole(role)" class="ml-3 symper-add-user-btn" style="display: none" v-if="roleCanAddUser[role]">
									<v-icon>mdi-plus</v-icon>
								</v-btn> -->
							</div>
							<div class="pl-7 d-flex justify-space-between user-show" v-for="userItem in tabsData[role]" :key="userItem.id" >
								<user :user="userItem" class="float-left"></user>
								<div class="float-right action-for-role d-flex"  >
									<div v-for="(btn, idx) in actionsForRole[role]" :key="idx" class="d-flex" >
										<v-menu v-if="btn.showUserSelect==true" 
											v-model="showDelegatedUser[role+'_'+idx]"
											:offset-y="true"
											class="symper-select-user-autocomplete"
											:close-on-content-click="false"
											:close-on-click="false"
											>
											<template  v-slot:activator="{ on: menu, attrs }">
												<v-tooltip bottom>
													<template v-slot:activator="{ on: tooltip }">
														<v-btn 
															text
															v-bind="attrs"
															depressed
															v-on="{ ...tooltip, ...menu }"
															class="mr-3" 
															small 
															@click="handleAction(btn.name, role, idx)" >
															<v-icon left>{{btn.icon}}</v-icon> {{btn.text}}
														</v-btn>
													</template>
													<span >{{btn.text}}</span>
												</v-tooltip>
											</template>
											<div class="bg-white" style="width: 200px; z-index: 1002" :ref="'selectUserWrapper_'+role+'_'+idx">
											</div>
										</v-menu>

										<!-- <v-btn v-else depressed class="mr-3" small @click="handleAction(btn.name, role, idx)" >
											<v-icon left>{{btn.icon}}</v-icon> {{btn.text}}
										</v-btn> -->
									</div>
								</div>
							</div>
						</div>
					</v-expansion-panel-content>
				</v-expansion-panel>
				<v-expansion-panel>
					<v-expansion-panel-header class="v-expand-header">{{$t('tasks.header.relatedTask')}}</v-expansion-panel-header>
					<v-expansion-panel-content class="sym-v-expand-content">
						<RelatedItems
							:taskInfo="taskInfo"
							:tabsData="tabsData"
							:showMoreTask="showMoreTask"
						 />
						 <span class="showMoreRelated" @click="handleShowMoreTask" v-if="!showMoreTask" >{{$t('myItem.sidebar.showMoreTask')}}</span>
						 <span class="showMoreRelated" @click="handleShowMoreTask" v-else >{{$t('myItem.sidebar.showLess')}}</span>
					</v-expansion-panel-content>
				</v-expansion-panel>
				<v-expansion-panel style="margin-bottom: 20px;">
				<v-expansion-panel-header style="padding:0px" class="v-expand-header">{{$t('tasks.header.attachment')}}
						  <UploadFile
							@uploaded-file="uploaded"
							:objectIdentifier="taskInfo.action.parameter.taskId"
							:objectType="`task`"
							:iconName="`mdi-upload-outline`"
							/>
				</v-expansion-panel-header>
					<v-expansion-panel-content class="sym-v-expand-content">
						<div
							v-for="(item, idex) in listFileAttachment"
							:key="idex"
							
						>
							<v-row  :class="{
								'mr-0 ml-0 single-row': true ,
								'd-active':showByIndex==idex 
								}"
								:style="{
									minHeight: '25px'
								}"
								v-if="checkShowMoreFile(idex)"
								@mouseover="showByIndex = idex"
                    			@mouseout="showByIndex = null"
							>
								<v-col 
									@click="showContentFile(item.serverPath,item.name,item.type,item.id)" 
									cols="5" 
									style="font-size:13px;padding:0px;padding-top:3px!important">
									<v-tooltip bottom>
             							<template v-slot:activator="{ on }">
											<div v-on="on"
												style="font-size:12px;
														padding:0px;
														white-space: nowrap;
														overflow: hidden;
														text-overflow: ellipsis;
														width: 140px;">
											<v-icon v-if="item.type=='doc' ||item.type=='docx' " style="font-size:15px">mdi-file-word</v-icon>
											<v-icon v-else-if="item.type=='pdf'" style="font-size:15px">mdi-file-pdf</v-icon>
											<v-icon v-else-if="item.type=='jpg' ||item.type=='jpeg'||item.type=='png'" style="font-size:15px">mdi-file-image-outline</v-icon>
											<v-icon v-else-if="item.type=='xlsx' ||item.type=='xls' " style="font-size:15px">mdi-file-excel</v-icon>
											<v-icon v-else style="font-size:15px">mdi-file-document-outline</v-icon>
											{{item.name}}</div>
										</template>
										<span>{{ item.name }}</span>
									</v-tooltip>
								</v-col> 
								<v-col 	
									cols="4" 
									style="font-size:12px;padding:0px;padding-top:3px!important">
									<span>{{item.createAt}}</span>
								</v-col>
								<v-col class="pull-right" style="padding:0px;padding-top:3px!important">
									<v-icon  @click="downLoadFile(item.id)"  v-show="showByIndex === idex" style="font-size:18px;margin-left:40px">mdi-download</v-icon>
									<v-icon  @click="actionFileAttachment($event,item.serverPath,item.name,item.type,item.id)"  v-show="showByIndex === idex" style="font-size:18px; margin-left:8px">mdi-dots-horizontal</v-icon>
								</v-col> 
							</v-row>
						     <v-menu
								v-model="context_attachment"
								:position-x="x"
								:position-y="y"
								absolute
								offset-y
							>
								<v-list class="context-menu">
								<v-list-item
									v-for="(item, index) in contextAttachment"
									:key="index"
									@click="item.menuAction(item.title)"
									dense
								>
									<v-icon class="fs-15">{{item.icon}}</v-icon>
									<v-list-item-title class="fs-13">{{ item.title }}</v-list-item-title>
								</v-list-item>
								</v-list>
							</v-menu>
						</div>
						<span class="showMoreRelated" @click="handleShowMoreFile" v-if="!showMoreFile" >{{$t('myItem.sidebar.showMoreFile')}}</span>
						<span class="showMoreRelated" @click="handleShowMoreFile" v-else >{{$t('myItem.sidebar.showLess')}}</span>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-expansion-panels>
		</VuePerfectScrollbar>
	</div>
		<Comment style="height:100%" 
			:objectIdentifier="originData.id"
			ref="commentTaskView"
			/>
	
	<div class="w-100 h-100 symper-select-user-autocomplete " style="z-index:1010" v-show="statusChange" ref="selectUserAutocomplete">
			<v-autocomplete
				ref="selectDelegateUser"
				return-object
				full-width
				solo
				append-icon=""
				:items="sapp.allUsers"
				background-color="grey lighten-4"
				flat
				v-model="selectedUserForAssignment"
				dense
				color="blue-grey lighten-2"
				:label="$t('common.search')"
				item-text="displayName"
				@change="changeUserSelect"
				item-value="name"
				:filter="filterUser">
				<template v-slot:item="data">
					<div class="fs-13 py-1">
						<i class="mdi mdi-account mr-2 fs-16"> </i> <span> {{data.item.displayName}}</span>
					</div>
				</template>
			</v-autocomplete>
	</div>
 	<v-dialog v-model="dialogAlert" max-width="450">
      <v-card>
        <v-card-title class="headline">{{headerDialog}}</v-card-title>
        <v-card-text>{{titleDialog}}</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="removeFileAttach">{{$t("kh.dialog.yes")}}</v-btn>
          <v-btn color="red darken-1" text @click="dialogAlert = false">{{$t("kh.dialog.cancel")}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
	</v-navigation-drawer>
</template>
<script>
import user from "./User";
import { taskApi } from "@/api/task.js";
import { userApi } from "@/api/user.js";
import { documentApi } from "@/api/Document";
import BPMNEngine from "@/api/BPMNEngine.js";
import { util } from "@/plugins/util.js";
import { data } from 'jquery'
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Comment from './Comment'
import trackingProcessInstance from "@/views/process/TrackingProcessInstance.vue";
import UploadFile from "@/components/common/UploadFile.vue";
import RelatedItems from "./RelatedItems.vue";
export default {
	components:{
		VuePerfectScrollbar,
		Comment,
		user,
		trackingProcessInstance,
		UploadFile,
		RelatedItems
	},
	data () {
		return {
			x:0,
			y:0,
			showMoreTask:false,
			showMoreFile:false,
			headerDialog:'',
      		titleDialog:'',
			dialogAlert: false,
			context_attachment:false,
			showByIndex: null,
			selectingPosition: {
                role: '',
                idx: ''
			},
			selectedUserForAssignment: {},
			statusChange:false,
			showDelegatedUser: {},
			isShow:false,
			panel: [0, 1, 2, 3, 4],
			userCreate:"",
			createdDate:"",
			workflowName:"",
			workflowOtherName:"",
			listApprovalUser:[],
			listRelatedUser:[],
			listHistoryControl:[
                {date:'18/08/2020 11:20', userUpdate:'Nguyễn Đình Hoang', historyid:2, controls:[{id:'s-control-id-1596780634836',data:[]},{id:'s-control-id-1596780602772',data:[]},{id:'s-control-id-1596780611212',data:[]}]},
                {date:'18/08/2020 11:20', userUpdate:'Nguyễn Đình Hoang', historyid:1, controls:[{id:'s-control-id-1596780602772',data:[]}]},
			],
			contextAttachment: [
				{
					title: this.$t("kh.contextmenu.rename"),
						menuAction: action => {
							alert("Đổi tên");
						},
					icon: "mdi-pencil"
				},
				{
					title: this.$t("kh.contextmenu.delete"),
						menuAction: action => {
						 	this.headerDialog = this.$t("common.remove_confirm_title");
							this.titleDialog = this.$t("kh.dialog.remove");
							this.dialogAlert = true;
						},
					icon: "mdi-delete-forever"
				},
			],
			actionsForRole: {
                assignee: [
                    {
                        icon: 'mdi-account-switch-outline',
                        name: 'change',
                        text: 'Change',
                        showUserSelect: true
                    },
                    {
                        icon: 'mdi-sitemap',
                        name: 'orgchart',
                        text: 'Orgchart'
                    },
                ],
                owner: [
                    {
                        icon: 'mdi-account-switch-outline',
                        name: 'change',
                        text: 'Change',
                        showUserSelect: false
                    },
                    {
                        icon: 'mdi-sitemap',
                        name: 'orgchart',
                        text: 'Orgchart'
                    },
                ],
                participant: [
                    {
                        icon: 'mdi-delete-outline',
                        name: 'delete',
                        text: 'Remove'
                    },
                    {
                        icon: 'mdi-sitemap',
                        name: 'orgchart',
                        text: 'Orgchart'
                    },
                ],
                watcher: [
                    
                    {
                        icon: 'mdi-delete-outline',
                        name: 'delete',
                        text: 'Remove'
                    },
                    {
                        icon: 'mdi-sitemap',
                        name: 'orgchart',
                        text: 'Orgchart'
                    },
                ]
            }
			
		}
	},
	props:{
		taskInfo: {
			type: Object,
			default: () => {}
		},
		originData:  {
            type: Object,
            default: () => {}
		},
		tabsData: {
            type: Object,
            default: () => {}
        },
		sidebarWidth:{
			type:Number,
			default:300
		},
		isShowSidebar:{
			type:Boolean,
			default:true
		},
		userId:{
			type:String, 
			default:"0"
		},
		taskId:{
			type:String,
			default:""
		},
		workflowId:{
			type:String,
			default:""
		},
		createTime:{
			type:String,
			default:""
		},
		documentObjectId:{
			type:String,
			default:""
		}
	
	},
	watch:{
		isShowSidebar(after){
			this.isShow = !this.isShow
		},
		taskInfo:function(newVl){
			this.getData();
		}
		
	},
	computed:{
		countCommentNotResolve(){
			return this.$store.state.comment.listComment.length
		},
		sapp(){
            return this.$store.state.app;
        },
		roleCanAddUser() {
            let canAddAssignee = false;
            let assignee = this.tabsData.assignee[0];
            if(!assignee && this.tabsData.owner[0]){
                canAddAssignee = this.$store.state.app.endUserInfo.id == this.tabsData.owner[0].id;
            }
            return {
                participant: true,
                watcher: true,
                assignee: canAddAssignee
            }
		},
		dataTask(){
			if (this.tabsData.owner.length==0) {
				this.tabsData.owner=this.tabsData.assignee;
			}
			return this.tabsData;
		},
		stask() {
			return this.$store.state.task;
		},
		listFileAttachment() {
			let arr = this.stask.arrFileAttach;
			return arr;
		}
	},
	created(){
		let thisCpn = this;
		this.getData();
		documentApi.getListApprovalHistory(this.documentObjectId).then(res => {
				if (res.status == 200) {
					let listUser = []
					for (let index = 0; index < res.data.length; index++) {
						let user = res.data[index];
						let userId = user.userId;
						let userInfo = thisCpn.allUsers.filter(user=>{
							return user.id == userId;
						})
						if(userInfo.length > 0){
							user.displayName = userInfo[0].displayName
							thisCpn.listApprovalUser.push(user);
						}
					}
				}
			})
			.catch(err => {

			})
			.always(() => {});

		this.$evtBus.$on('symper-app-wrapper-clicked', (evt) => {
            if(!($(evt.target).hasClass('symper-select-user-autocomplete') || $(evt.target).parents('.symper-select-user-autocomplete').length > 0)){
                for(let key in  this.showDelegatedUser){
                    this.showDelegatedUser[key] = false;
                }
            }
		});
	},
	methods:{
		handleShowMoreTask(){
			this.showMoreTask=!this.showMoreTask;
		},
		handleShowMoreFile(){
			this.showMoreFile=!this.showMoreFile;
		},
		checkShowMoreFile(idex){
            if (this.showMoreFile==false) {
                if (idex<=2) {
                    return true
                }else{
                    return false
                }
            }else{
                return true;
            }
        },
		showPopupDiagram(){
			this.$emit("showPopupTracking");
		},
		removeFileAttach() {
			let data={};
			data.id=this.fileId;
			taskApi
			.deleteFile(data)
			.then(res => {
			if (res.status == 200) {
                this.$store.dispatch("task/removeFileAttachToStore", this.fileId);
                this.$store.commit("file/setWaitingFileCountPerObj", 'task:'+taskInfo.action.parameter.taskId);
                this.$store.commit("comment/setWaitingCommentCountPerObj", 'task:'+taskInfo.action.parameter.taskId);
			} else if (res.status == 403) {
				this.$snotifyError("Error", res.message);
			} else {
				this.$snotifyError(
				"",
				"Error from delete attachment file!!!"
				);
			}
			})
			.catch(err => {
			console.log("error from delete attachment file!!!", err);
			})
			.always(() => {});
		this.dialogAlert = false;
		},
		showContentFile(serverPath, name, type, id){
			let data={};
			data.serverPath=serverPath;
			data.name=name;
			data.type=type;
			data.id=id;
			this.$emit("showContentFile", data);
		},
		downloadOrBackupFile(data) {
			this.downLoadFile(data.fileId);
		},
		downLoadFile(id) {
			taskApi
			.downloadFile(id)
			.then(res => {})
			.catch(err => {
			console.log("error download file!!!", err);
			})
			.always(() => {});
		},
		actionFileAttachment(e, serverPath, name, type, id){
			e.preventDefault();
			this.context_attachment = false;
			this.x = e.clientX;
			this.y = e.clientY;
			this.serverPath = serverPath;
			this.name = name;
			this.type = type;
			this.fileId = id;
			this.$nextTick(() => {
				this.context_attachment = true;
			});
		},
		uploaded(dataObj) {
			this.$store.commit("task/addToListAttachStore", dataObj);
		},
		async changeUserSelect(value){
            let updateData = {};
            for(let role in this.tabsData){
                let userIds = this.tabsData[role].reduce((arr, user) => {
                    arr.push(user.id);
                    return arr;
                }, []);

                if(role == this.selectingPosition.role){
                    userIds[this.selectingPosition.idx] = value.id;
                }
                if(userIds.length > 0){
                    updateData[role] = userIds.join(',');
                }
            }
            this.selectedUserForAssignment = {};
            try {
                let res = await BPMNEngine.updateTask(this.taskInfo.action.parameter.taskId ,updateData);
                this.$evtBus.$emit('symper-update-task-assignment', res);
				this.$snotifySuccess("Update task assignment successfully");
                this.$emit('changeUpdateAsignee');
				
            } catch (error) {
                this.$snotifyError(error, "Update task assignment failed");
            }
            this.statusChange=false;
        },
        filterUser(item, queryText, itemText){
            let lowcaseText = queryText.toLowerCase();
            return item.displayName.toLowerCase().includes(lowcaseText);
        },
		hide(){
			this.isShow = false;
			this.$emit('after-hide-sidebar')
		},
		show(){
			this.isShow = true;
		},
		showHistoryControl(history){
			$('.highlight-history').removeClass('highlight-history');
			for (let index = 0; index < history.controls.length; index++) {
				const control = history.controls[index];
				$("#"+control.id).addClass('highlight-history');
			}
			
		},
		hideHistory(){
			$('.history-info').css({transform:'translateX(400px)'})
		},
		showHistory(){
			$('.history-info').css({transform:'translateX(0px)'})
		},
		showComment(){
			this.$refs.commentTaskView.show();
		},
		handleAction(actionName, role, idx){
            this.statusChange=true;
            this.selectingPosition.role  = role;
            this.selectingPosition.idx  = idx;
            
            let self = this;
            let refKey = 'selectUserWrapper_'+role+'_'+idx;
            if(!this.$refs[refKey]){
                setTimeout(() => {
                    self.showSelectUser(role, idx, refKey);
                }, 200);
            }else{
                self.showSelectUser(role, idx, refKey);
            }
        },
        showSelectUser(role, idx, refKey){
            if(this.actionsForRole[role][idx].showUserSelect){
                $(this.$refs[refKey]).html('');
                $(this.$refs[refKey]).append(this.$refs.selectUserAutocomplete);
                setTimeout((self) => {
                    $(self.$refs[refKey]).find('.v-select__slot').click();
                }, 200, this);
            }
		},
		getData(){
			let data = {};
			data.objectIdentifier = this.taskInfo.action.parameter.taskId;
			data.objectType = "task";
			this.$store.dispatch("task/getArrFileAttachment", data);
    	}
	},
	

}
</script>
<style  scoped>
    .sym-document-tab-control .v-list-item{
        min-height : 25px !important;
    }
    .v-expand-header{
        font-size: 13px;
        font-weight: 500;
		min-height: unset;
		padding: 8px 0;
		border: none !important;
    }
    .tf-search-control{
        margin: 6px 0px !important;
    }
    
    .sym-document-tab-control .v-expansion-panel{
        margin: 0;
    }
    .s-detail-sidebar{
        max-height: 100%;
    }
	
	.sym-v-expand-content ::v-deep .v-expansion-panel-content__wrap{
        padding: 0;
        
    }
	.sym-v-expand-content ::v-deep .v-expansion-panel{
        margin: 0;
        
	}
	.s-detail-sidebar ::v-deep .v-expansion-panel--active:not(:first-child),
	.s-detail-sidebar ::v-deep .v-expansion-panel--active + .v-expansion-panel{
		margin-top: 0px !important;
	}
	.s-drawer{
		z-index: 160;
		padding: 12px 6px 6px 12px;
		top:86px!important;
	}

	::v-deep .v-expansion-panel:not(:first-child)::after{
		border-top:none !important;
	}
	.workflow-info,
	.general-info{
		font-size: 13px;
	}
	.related-user-info img, .approval-info img{
		height: 24px;
		width: 24px;
		border-radius: 50%;
		margin-left: 14px;
		margin-right: 8px;
	}
	.related-user-info, .approval-info{
		font-size: 13px;
	}
	.approval-info__header {
		font-weight: 500;
		display: flex;
	}
	.approval-info__header span:first-child{
		font-size: 18px;
	}
	.approval-info__header span:last-child{
		line-height: 26px;
		margin-left: 8px;
	}
	.user-name{
		line-height: 24px;
	}
	.user-info{
		display: flex;
		margin: 4px 0;
	}
	.fs-20px{
		font-size: 20px;
	}
	.mdi-close{
		margin-left: auto;
		margin-right: 4px;
		font-size: 16px;
		color: #757575;
		transition: all ease-in-out 250ms;
		cursor: pointer;
	} 
	.mdi-close:hover{
		color: rgb(0 0 0 / 1);
	}
	.history-item{
		cursor: pointer;
		display: flex;
		font-size: 13px;
		padding: 6px 0;
		transition: all ease-in-out 300ms;
	}
	.history-item:hover .date-update,
	.history-item:hover .history-item__info span{
		text-shadow: 1px 0px 5px rgba(0,0,0,0.6);
	}
	.history-item .date-update{
		font-weight: 500;
	}
	.history-item img{
		border-radius: 50%;
		margin-bottom: -2px;
		margin-right: 8px;
	}
	.history-item__action{
		margin-left: auto;
		margin-right: 8px;
		margin-top: 5px;
	}
	.history-item__action >>> button{
		box-shadow: none;
	}
	.history-item__action .mdi-backup-restore{
		font-size: 15px;
	}
	.history-info{
		position: absolute;
		top: 0px;
		right: 0;
		width: 99%;
		height: 100%;
		background: white;
		z-index: 9999;
		padding: 12px 6px 6px 11px;
		transition: all ease-in-out 250ms;
	}
	.history-info .mdi-keyboard-backspace{
		font-size: 15px;
		cursor: pointer;
		margin-right: 8px;
	}
	.menuable__content__active{
		z-index: 1010!important;
	}
	.symper-upload-file >>> .v-btn{
		float:right;
	}
	.symper-upload-file >>> .v-btn >>>.v-btn__content >>> .mdi-upload-outline{
		font-size: 19px!important;
	}
	.d-active {
		background: #e5e5e5;
	}
	.single-row{
		cursor: pointer;
	}
	.s-drawer >>> .v-navigation-drawer__content{
		overflow: hidden !important;
	}
	.main-info{
		height: 100%;
	}
	.showMoreRelated{
		float: right;
		cursor:pointer;
		margin-right: 20px;
		margin-bottom: 20px;
	}
	.v-expansion-panel::before{
		box-shadow: none;
	}
</style>
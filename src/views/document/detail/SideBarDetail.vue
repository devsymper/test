<template>
	<v-navigation-drawer
	class="s-drawer"
	absolute
	permanent
	right
	v-show="isShow"
	:width="400"
	:style="{'transform':(isShow) ? 'translateX(0%)' : 'translateX(100%)','display':displaySidebar}"
	>
	<div v-show="showMainInfo" class="main-info">
		<div style="display:flex;">
			<span style="font-size:15px;">{{$t('document.detail.sidebar.heading')}}</span>
			<span class="mdi mdi-close" @click="hide"></span>
		</div>

		<v-divider></v-divider>

		<VuePerfectScrollbar style="calc(100% - 62px);">
			<v-expansion-panels
			v-model="panel"
			multiple
			class="s-detail-sidebar"
			>
				<v-expansion-panel>
					<v-expansion-panel-header class="v-expand-header">{{$t('document.detail.sidebar.body.general.title')}}</v-expansion-panel-header>
					<v-expansion-panel-content class="sym-v-expand-content">
						<div>
							<table class="general-info">
								<tr>
									<td>{{$t('document.detail.sidebar.body.general.dateCreate')}}</td>
									<td>{{createdDate}}</td>
								</tr>
								<tr>
									<td style="width:70px">{{$t('document.detail.sidebar.body.general.userCreate')}}</td>
									<td>{{userCreate}}</td>
								</tr>
								<tr v-if="userRoleInfo">
									<td style="width:70px">{{$t('document.detail.sidebar.body.general.userRole')}}</td>
									<td>{{userRoleInfo}}</td>
								</tr>
								<tr v-if="this.listHistoryControl.length > 0">

									<td>{{$t('document.detail.sidebar.body.general.history')}}</td>
									<td @click="showHistory" style="text-decoration: underline;cursor:pointer;color:#F1853B;">Đã sửa {{countModify}} lần</td>
								</tr>
								<tr>
									<td>{{$t('document.detail.sidebar.body.general.comment')}}</td>
									<td style="text-decoration: underline;cursor:pointer;color:#F1853B;" @click="showComment">
										{{commentNotResolveMessage}} 
										</td>
								</tr>
							</table>
						</div>
					</v-expansion-panel-content>
				</v-expansion-panel>
				<v-expansion-panel>
					<v-expansion-panel-header class="v-expand-header">{{$t('document.detail.sidebar.body.userRelated.title')}}</v-expansion-panel-header>
					<v-expansion-panel-content class="sym-v-expand-content">
						<div class="approval-info">
							<p class="approval-info__header">
								<span class="mdi mdi-account-multiple-outline"></span> 
								<span>{{$t('document.detail.sidebar.body.userRelated.subTitle1')}}</span>
							</p>
							<div v-for="user in listApprovalUser" :key="user.id" class="user-info">
								<img :src="fileDomain + 'readFile/user_avatar_'+user.userId" alt="">
								<span class="user-name">{{user.displayName}}</span>
							</div>
						</div>
						<div class="related-user-info">
							<p class="approval-info__header">
								<span class="mdi mdi-account-multiple-outline"></span> 
								<span>{{$t('document.detail.sidebar.body.userRelated.subTitle2')}}</span>
							</p> 
							<div v-for="user in listRelatedUser" :key="user.id" class="user-info">
								<img :src="fileDomain + 'readFile/user_avatar_'+user.userId" alt="">
								<span class="user-name">{{user.displayName}}</span>
							</div>
						</div>
					</v-expansion-panel-content>
				</v-expansion-panel>
				<v-expansion-panel v-show="showPanelWorkflow">
					<v-expansion-panel-header class="v-expand-header">{{$t('document.detail.sidebar.body.worflowInfo')}}</v-expansion-panel-header>
					<v-expansion-panel-content class="sym-v-expand-content">

						<table class="workflow-info" v-if="workflowId !='' ">
							<tr>
								<td v-if="workflowInfo" style="cursor:pointer;" @click="gotoDetailWorkflow"><v-icon style="font-size:15px ; padding-right:6px">mdi-lan</v-icon> {{workflowInfo.name}}</td>
							<tr>
								<td v-if="taskInfo" style="cursor:pointer;" @click="gotoDetailTask"> <v-icon style="font-size:15px ; padding-right:6px">mdi-format-list-checkbox</v-icon>{{taskInfo.name}}</td>
							</tr>
							
						</table>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-expansion-panels>
		</VuePerfectScrollbar>
	</div>
	<div 
	v-show="showHistoryInfo"
	class="history-info" style="transform:translateX(400px)">
		<div style="display:flex;">
			<span class="mdi mdi-keyboard-backspace" @click="hideHistory"></span>
			<span style="font-size:15px;">LỊCH SỬ CHỈNH SỬA</span>
		</div>

		<v-divider></v-divider>

		<VuePerfectScrollbar style="height: calc(100% - 25px);">
			<div v-for="history in listHistoryControl" 
			:key="history.id" 
			@click="showHistoryControl(history)"
			class="history-item">
				<div class="history-item__info">
					<div class="date-update">
						{{history.date}}
					</div>
					<InfoUser :userId="history.userUpdate"/>
				</div>
				<div class="history-item__action">
					<v-tooltip left>
						<template v-slot:activator="{ on }">
							<div v-on="on">
								<v-btn small>
									<v-icon>mdi-backup-restore</v-icon>
								</v-btn>
							</div>
						</template>
						<span>Khôi phục</span>
					</v-tooltip>
				</div>
			</div>
		</VuePerfectScrollbar>
	</div>
	<Comment v-show="showCommentInfo" 
	v-if="showCommentInDoc" 
	style="height:95%" ref="commentView" 
	@close-comment="hideComment"
	:objectIdentifier="String(documentObjectId)" />

	</v-navigation-drawer>
</template>
<script>

import { documentApi } from "@/api/Document";
import { orgchartApi } from "@/api/orgchart";
import bpmnApi from "@/api/BPMNEngine.js";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Comment from './Comment'
import {logServiceApi} from "@/api/log.js";
import { getControlInstanceFromStore } from '../common/common';
import InfoUser from "@/components/myItem/InfoUser.vue";
import { appConfigs } from '../../../configs';

export default {
	components:{
		VuePerfectScrollbar,
		Comment,
		InfoUser
	},
	data () {
		return {
			isShow:false,
			panel: [0, 1, 2, 3, 4],
			userCreate:"",
			createdDate:"",
			workflowInfo:null,
			taskInfo:null,
			workflowName:"",
			userRoleInfo:"",
			showPanelWorkflow:true,
			fileDomain: appConfigs.apiDomain.fileManagement,
			listApprovalUser:[],
			listRelatedUser:[],
			listHistoryControl:[],
			displaySidebar:'none',
			showMainInfo:false,
			showHistoryInfo:false,
			showCommentInfo:false,
			countModify:0,
			listTableHasChanged:{}
		}
	},
	props:{
		keyInstance: {
			default: null
		},
		isShowSidebar:{
			type:Boolean,
			default:true
		},
		sidebarWidth:{
			type:Number,
			default:400
		},
		showCommentInDoc:{
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
			type:Number,
			default:0
		},
		userRole:{			// role của user submit doc
			type:String
		}
	},
	watch:{
		isShowSidebar(){
			this.isShow = !this.isShow
		},
		userId(after){
			if(!after){
				return;
			}
			let user = this.allUsers.filter(u=>{
				return u.id == after;
			});
			this.userCreate = user[0].displayName;
			let self = this;
			if(self.userRole){
				orgchartApi.getRolesByUser([{idUser: after}]).then(res=>{
					let listRole = res.data[0].roles;
					if(listRole.length > 0){
						let curRole = listRole.find(role=> role.id == self.userRole);
						if(curRole){
							self.userRoleInfo = curRole.name;
						}
					}
				});
			}
		},
		workflowId(after){
			let self = this
			if(after != "" && after != "0"){
				bpmnApi.getProcessInstanceData(this.workflowId).then(res=>{
					self.workflowInfo = res.data.length > 0 ? res.data[0] : null
				});
			}
		},
		taskId(after){
			let self = this
			if(after != "" && after != "0"){
				//Tger chỉnh sửa lại api get detail task
				bpmnApi.postTaskHistory({taskId:this.taskId}).then(res=>{
					if (res.total>0) {
						self.taskInfo = res.data[0];
					}
                });
			}
		},
		createTime(after){
			this.createdDate = after
		},
	},
	computed:{
		allUsers(){
            return this.$store.state.app.allUsers;
		},
		commentNotResolveMessage(){
			let size = this.$store.state.comment.listComment.length;
			if(size == 0){
				return this.$t('document.detail.sidebar.body.general.noComment')
			}
			else{
				return this.$t('document.detail.sidebar.body.general.has') + size + this.$t('document.detail.sidebar.body.general.commentNotResolve')
			}
		}
	},
	created(){
		let thisCpn = this;
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
			.finally(() => {});
	},
	mounted() {
		setTimeout((self) => {
			self.setDocUpdateHistory();
		}, 2000, this);
	},
	methods:{
		gotoDetailWorkflow(){
			this.$goToPage('myitem/work/'+this.workflowInfo.id);
		},
		gotoDetailTask(){
			this.$goToPage('myitem/tasks/'+this.taskInfo.id);
		},
		async setDocUpdateHistory(){
			let res = await logServiceApi.query({
				"query": {
					"bool": {
					"must": [
							{
								"term": {
									"logObjectType": "document_instance"
								}
							},{
								"term": {
									"logAction": "update"
								}
							},{
								"term": {
									"logObjectId": this.documentObjectId
								}
							}
						]
					}
				}
			});
			if(res.status == 200){
				this.listHistoryControl = this.getFormattedUpdateHistory(res.data);
				this.countModify = this.listHistoryControl.length;
				let param = {
					instance: this.keyInstance, 
					data: this.listHistoryControl
				};
        		this.$store.commit("document/setDetailTrackChange",param);
			}else{
				this.$snotifyError(res, "Can not get document update history!");
			}
		},
		getFormattedUpdateHistory(list){
			let rsl = [];
			
			for(let item of list){
				let newValue = typeof item.new == 'string' ? JSON.parse(item.new) : item.new;
				let oldValue = typeof item.old == 'string' ? JSON.parse(item.old) : item.old;

				rsl.push({
					old: oldValue,
					new: newValue,
					date: newValue.document_object_update_time, 
					userUpdate: item.user_update_id, 
					// historyid:2, 
					controls: this.getAllControlValueChange(oldValue, newValue)
				});
			}
			this.refreshTable();
			return rsl;
		},
		refreshTable(){
			for(let tableName in this.listTableHasChanged){
				let table = this.listTableHasChanged[tableName];
				table.tableInstance.redrawRows();
			}
		},
		getAllControlValueChange(oldObj, newObj){
			let changedControls = {
				doc: this.compareTwoRows(oldObj, newObj),
				tables: []
			};

			let mapTableAndControls = {};
			for(let name in newObj){
				if(Array.isArray(newObj[name])){
					mapTableAndControls[name] = {
						new: {},
						old: {}
					};

					if(Array.isArray(newObj[name])){
						for(let row of newObj[name]){
							mapTableAndControls[name].new[row.document_object_id] = row;
						}
					}

					if(Array.isArray(oldObj[name])){
						for(let row of oldObj[name]){
							mapTableAndControls[name].old[row.document_object_id] = row;
						}
					}
				}
			}

			for(let tbName in mapTableAndControls){
				let tbChange = {};
				for(let idRow in mapTableAndControls[tbName].new){
					if(mapTableAndControls[tbName].old[idRow]){
						let oldObj = mapTableAndControls[tbName].old[idRow];
						let newObj = mapTableAndControls[tbName].new[idRow];
						tbChange[idRow] = this.compareTwoRows(oldObj, newObj);
					}
				}
				if(!$.isEmptyObject(tbChange)){
					let mapDocControl = this.$store.state.document.submit[this.keyInstance].listInputInDocument;
					let table = mapDocControl[tbName];
					if(table){
						this.listTableHasChanged[tbName] = table;
						let allColumnId = table.tableInstance.getColData('childObjectId');
						for(let rowId in tbChange){
							let dataChange = tbChange[rowId];
							let curRowIndex = allColumnId.indexOf(rowId);
							for (let index = 0; index < dataChange.length; index++) {
								let cellChange = dataChange[index];
								if(cellChange.data.new != cellChange.data.old){
									let controlIns = getControlInstanceFromStore(this.keyInstance, cellChange.name);
									controlIns.tableCellHistoryData['row_'+curRowIndex] = true;
								}
							}
						}
						changedControls.tables.push({
							id: table.id,
							data: tbChange,
							name: tbName,
							isTable: true
						});
					}
				}
			}
			
			let rsl = changedControls.doc.concat(changedControls.tables);
			return rsl;
		},
		compareTwoRows(oldObj, newObj){
			let mapDocControl = this.$store.state.document.submit[this.keyInstance].listInputInDocument;
			let rsl = [];

			for(let name in newObj){
				let ctrl = mapDocControl[name];
				// [{id:'s-control-id-1596780602772',data:[]}]
				if(	ctrl
					&& oldObj.hasOwnProperty(name) && !Array.isArray(oldObj[name])
					&& newObj.hasOwnProperty(name) && !Array.isArray(newObj[name]) // nếu khác giá trị
				){
					if( ['number','percent'].includes(ctrl.type)){
						if(Number(oldObj[name]) === Number(newObj[name])){
							continue
						}
					}
					if(oldObj[name] === newObj[name]){
						continue
					}
					if([null,""].includes(oldObj[name]) && [null,""].includes(newObj[name])){
						continue
					}
					let item = {
						id: ctrl.id,
						data: {
							new: newObj[name],
							old: oldObj[name],
						},
						name: name,
						isTable: false
					};	
					rsl.push(item);	
					let ctrlObj = getControlInstanceFromStore(this.keyInstance, name);
					if(!ctrlObj.valueChanged){
						ctrlObj.valueChanged = true;
						ctrlObj.renderMoreInfoControlIcon();
					}
				}
			}
			return rsl;
		},
		hide(){
			this.isShow = false;
			setTimeout((self) => {
					self.displaySidebar = 'none';
					self.showMainInfo = false;
				}, 250, this);
			this.$emit('after-hide-sidebar');
		},
		show(){
			this.displaySidebar = '';
			this.showMainInfo = true;
			setTimeout((self) => {
				self.isShow = true;
			}, 10, this);
		},
		showHistoryControl(history){
			$('.highlight-history').removeClass('highlight-history');
			for (let index = 0; index < history.controls.length; index++) {
				const control = history.controls[index];
				$("#"+control.id).addClass('highlight-history');
			}
		},
		showComment(){
			this.showCommentInfo = true;
			setTimeout((self) => {
				self.$refs.commentView.show();
			}, 10, this);
			setTimeout((self) => {
				self.showMainInfo = false;
			}, 250, this);
		},
		hideComment(){
			this.showMainInfo = true;
			setTimeout((self) => {
				self.showCommentInfo = false;
			}, 250, this);
		},
		showHistory(){
			this.showHistoryInfo = true;
			setTimeout((self) => {
				$('.history-info').css({transform:'translateX(0px)'});
			}, 10, this);
			
			setTimeout((self) => {
				self.showMainInfo = false;
			}, 250, this);
		},
		hideHistory(){
			this.showMainInfo = true;
			$('.history-info').css({transform:'translateX(400px)'});
			setTimeout((self) => {
				self.showHistoryInfo = false;
			}, 250, this);
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
        overflow: hidden;
		width:400px;
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
		z-index: 9999;
		padding: 12px 6px 6px 12px;
	}

	::v-deep .v-expansion-panel:not(:first-child)::after{
		border-top:none !important;
	}
	.workflow-info,
	.general-info{
		font-size: 13px;
	}
	.workflow-info td{
		padding:5px 0px;
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
		top: 0;
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

</style>
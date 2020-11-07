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
								<tr>

									<td>{{$t('document.detail.sidebar.body.general.history')}}</td>
									<td @click="showHistory" style="text-decoration: underline;cursor:pointer;color:#F1853B;">Đã sửa 2 lần</td>
								</tr>
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
					<v-expansion-panel-header class="v-expand-header">{{$t('document.detail.sidebar.body.userRelated.title')}}</v-expansion-panel-header>
					<v-expansion-panel-content class="sym-v-expand-content">
						<div class="approval-info">
							<p class="approval-info__header">
								<span class="mdi mdi-account-multiple-outline"></span> 
								<span>{{$t('document.detail.sidebar.body.userRelated.subTitle1')}}</span>
							</p>
							<div v-for="user in listApprovalUser" :key="user.id" class="user-info">
								<img :src="'https://file.symper.vn/readFile/user_avatar_'+user.userId" alt="">
								<span class="user-name">{{user.displayName}}</span>
							</div>
						</div>
						<div class="related-user-info">
							<p class="approval-info__header">
								<span class="mdi mdi-account-multiple-outline"></span> 
								<span>{{$t('document.detail.sidebar.body.userRelated.subTitle2')}}</span>
							</p> 
							<div v-for="user in listRelatedUser" :key="user.id" class="user-info">
								<img :src="'https://file.symper.vn/readFile/user_avatar_'+user.userId" alt="">
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
								<td><v-icon style="font-size:15px ; padding-right:6px">mdi-lan</v-icon> {{workflowName}}</td>
							<tr>
								<td v-if="taskName != ''"> <v-icon style="font-size:15px ; padding-right:6px">mdi-format-list-checkbox</v-icon>{{taskName}}</td>
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

import { userApi } from "@/api/user.js";
import { documentApi } from "@/api/Document";
import { orgchartApi } from "@/api/orgchart";
import bpmnApi from "@/api/BPMNEngine.js";
import { util } from "@/plugins/util.js";
import { data } from 'jquery'
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import Comment from './Comment'
import {logServiceApi} from "@/api/log.js";
import { getControlInstanceFromStore } from '../common/common';
import InfoUser from "@/components/myItem/InfoUser.vue";

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
			workflowName:"",
			userRoleInfo:"",
			showPanelWorkflow:true,
			taskName:"",
			listApprovalUser:[],
			listRelatedUser:[],
			listHistoryControl:[
                {date:'18/08/2020 11:20', userUpdate:'Nguyễn Đình Hoang', historyid:2, controls:[{id:'s-control-id-1596780634836',data:[]},{id:'s-control-id-1596780602772',data:[]},{id:'s-control-id-1596780611212',data:[]}]},
                {date:'18/08/2020 11:20', userUpdate:'Nguyễn Đình Hoang', historyid:1, controls:[{id:'s-control-id-1596780602772',data:[]}]},
			],
			displaySidebar:'none',
			showMainInfo:false,
			showHistoryInfo:false,
			showCommentInfo:false,
		}
	},
	props:{
		keyInstance: {
			default: null
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
						let curRole = listRole.filter(role=>{
							return role.id == self.userRole;
						})
						self.userRoleInfo = curRole[0].name;
					}
				});
			}
		},
		workflowId(after){
			let self = this
			if(after != "" && after != "0"){
				bpmnApi.getProcessInstanceData(this.workflowId).then(res=>{
					self.workflowName = res.data[0].processDefinitionName
				});
			}
		},
		taskId(after){
			let self = this
			if(after != "" && after != "0"){
				bpmnApi.getATaskInfo(this.taskId).then(res=>{
                   self.taskName = res.name == null ? "" : res.name
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
		countCommentNotResolve(){
			return this.$store.state.comment.listComment.length
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
			.always(() => {});
	},
	mounted() {
		setTimeout((self) => {
			self.setDocUpdateHistory();
		}, 2000, this);
	},
	methods:{
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
				let list = [];
				this.listHistoryControl = this.getFormattedUpdateHistory(res.data);
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
			return rsl;
		},
		getAllControlValueChange(oldObj, newObj){
			let controlValueIndoc = {};
			let controlValueInTables = {};

			let changedControls = {
				doc: this.compareTwoRows(oldObj, newObj),
				tables: []
			};

			let mapTableAndControls = {};
			for(let name in newObj){
				if($.isArray(newObj[name])){
					mapTableAndControls[name] = {
						new: {},
						old: {}
					};

					if($.isArray(newObj[name])){
						for(let row of newObj[name]){
							mapTableAndControls[name].new[row.document_object_id] = row;
						}
					}

					if($.isArray(oldObj[name])){
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
					let mapControlToIndex = table.mapControlToIndex;
					let allColumnId = table.tableInstance.tableInstance.getDataAtProp('childObjectId');
					
					for(let rowId in tbChange){
						let dataChange = tbChange[rowId];
						let curRowIndex = allColumnId.indexOf(rowId);
						for (let index = 0; index < dataChange.length; index++) {
							let cellChange = dataChange[index];
							if(cellChange.data.new != cellChange.data.old){
								table.tableInstance.validateValueMap[curRowIndex + "_" + mapControlToIndex[cellChange.name]] = {
									type: 'linkControl',
								};
							}
						}
						
						
					}
					setTimeout(() => {
						table.tableInstance.tableInstance.render()
					}, 50);
					changedControls.tables.push({
						id: table.id,
						data: tbChange,
						name: tbName,
						isTable: true
					});
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
					&& oldObj.hasOwnProperty(name) && !$.isArray(oldObj[name])
					&& newObj.hasOwnProperty(name) && !$.isArray(newObj[name]) // nếu khác giá trị
				){
					if( ['number','percent'].includes(ctrl.type)){
						if(Number(oldObj[name]) === Number(newObj[name])){
							continue
						}
					}
					if(oldObj[name] === newObj[name]){
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
						ctrlObj.renderInfoIconToControl(name);
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
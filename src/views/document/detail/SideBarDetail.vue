<template>
	<v-navigation-drawer
	class="s-drawer"
	absolute
	permanent
	right
	:width="sidebarWidth"
	:style="{'transform':(isShow) ? 'translateX(0%)' : 'translateX(100%)'}"
	>
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
							<tr>
								<td>{{$t('document.detail.sidebar.body.general.history')}}</td>
								<td style="text-decoration: underline;cursor:pointer;color:#F1853B;">Đã sửa 2 lần</td>
							</tr>
							<tr>
								<td>{{$t('document.detail.sidebar.body.general.comment')}}</td>
								<td style="text-decoration: underline;cursor:pointer;color:#F1853B;">Có 2 bình luận chưa giải quyết</td>
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
							<img src="https://randomuser.me/api/portraits/men/81.jpg" alt="">
							<span class="user-name">{{user.displayName}}</span>
						</div>
					</div>
					<div class="related-user-info">
						<p class="approval-info__header">
							<span class="mdi mdi-account-multiple-outline"></span> 
							<span>{{$t('document.detail.sidebar.body.userRelated.subTitle2')}}</span>
						</p> 
						<div v-for="user in listRelatedUser" :key="user.id" class="user-info">
							<img src="https://randomuser.me/api/portraits/men/81.jpg" alt="">
							<span class="user-name">{{user.displayName}}</span>
						</div>
					</div>
				</v-expansion-panel-content>
			</v-expansion-panel>
			<v-expansion-panel>
				<v-expansion-panel-header class="v-expand-header">{{$t('document.detail.sidebar.body.worflowInfo')}}</v-expansion-panel-header>
				<v-expansion-panel-content class="sym-v-expand-content">

					<table class="workflow-info" v-if="workflowId !='' ">
						<tr>
							<td><span class="mdi mdi-share-variant"></span></td>
							<td>{{workflowName}}</td>
						<tr>
							<td><span class="mdi mdi-briefcase-variant-outline"></span></td>
							<td>{{workflowOtherName}}</td>
						</tr>
						
					</table>
				<!-- mdi-share-variant -->
				<!-- mdi-briefcase-variant-outline -->
				</v-expansion-panel-content>
			</v-expansion-panel>

			
			
		</v-expansion-panels>
	</VuePerfectScrollbar>
	</v-navigation-drawer>
</template>
<script>

import { userApi } from "./../../../api/user.js";
import { documentApi } from "./../../../api/Document";
import bpmnApi from "./../../../api/BPMNEngine.js";
import { util } from "./../../../plugins/util.js";
import { data } from 'jquery'
import VuePerfectScrollbar from "vue-perfect-scrollbar";
export default {
	components:{
		 VuePerfectScrollbar
	},
	data () {
		return {
			isShow:false,
			panel: [0, 1, 2, 3, 4],
			userCreate:"",
			createdDate:"",
			workflowName:"",
			workflowOtherName:"",
			listApprovalUser:[],
			listRelatedUser:[]
		}
	},
	props:{
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
		userId(after){
			userApi.getDetailUser(after).then(res=>{
				if(res.status == 200)
				this.userCreate = res.data.user.displayName
			}).always({}).catch({});
		},
		workflowId(after){
			bpmnApi.getDefinitionData(this.workflowId).then(res=>{ 
                    console.log('resresres',res);
				}).always({}).catch({});
		},
		taskId(after){
			bpmnApi.getATaskInfo(this.taskId).then(res=>{
                    console.log('resresres',res);
                }).always({}).catch({});
		},
		createTime(after){
			this.createdDate = after
		},
		
	},
	created(){
		let thisCpn = this;
		documentApi.getListApprovalHistory(this.documentObjectId).then(res => {
				if (res.status == 200) {
					let listUser = []
					for (let index = 0; index < res.data.length; index++) {
						let user = res.data[index];
						let userId = user.userId;
						userApi.getDetailUser(userId).then(res1=>{
							user.displayName = res1.data.user.displayName
							thisCpn.listApprovalUser.push(user)
						}).always({}).catch({});
					}
				}
			})
			.catch(err => {

			})
			.always(() => {});
	},
	methods:{
		hide(){
			this.isShow = false;
			this.$emit('after-hide-sidebar')
		},
		show(){
			this.isShow = true;
		}
	}

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
	.related-user-info img, .approval-info img{
		height: 24px;
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
	

</style>
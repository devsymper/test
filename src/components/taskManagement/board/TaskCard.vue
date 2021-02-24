<template>
	<div class="task-item rounded px-2 pt-2 pb-1 task-hover-poiter" :style="{
		'border-left':(status) ? '4px solid '+ borderColor : ''
	}"
	@click.prevent.stop="handleShowDetailIssue">
		<div class="task-item__header">
			<p class="task-content">{{task.tmg_name}}</p>
		</div>
		<div class="mt-4 card-item__body">
			<div class="left-content">
				<v-icon v-if="issueType">{{issueType.icon}}</v-icon>
				<v-icon v-if="priority" :style="{color:(priority.color) ? priority.color : ''}">{{priority.icon}}</v-icon>
				<span>{{task.tmg_project_key+"-"+task.document_object_id}}</span>
			</div>
			<div class="right-content">
				<v-icon>mdi-calendar-month</v-icon>
				<span>{{getDate(task.tmg_due_date)}}</span>
				<symper-avatar :size="16" :userId="task.tmg_assignee"/>
			</div>
		</div>
		<detail-issue
            :documentObjectId="documentObjectId"
			:issue="issue"
            ref="issue"
        />
  	</div>
</template>
<script>
import SymperAvatar from '../../common/SymperAvatar.vue';
import DetailIssue from '@/components/taskManagement/issue/DetailIssue.vue';

export default {
  	components: { 
		SymperAvatar,
		DetailIssue 
	},
	props: {
		task: {
			type: Object,
			default: () => ({})
		},
		status: {
			type: Object,
			default: () => ({})
		}
	},
	watch:{
		task:{
			deep:true,
			immediate:true,
			handler(after){
			}
		}
	},
	data(){
		return {
			priority:null,
			projectId:null,
			documentObjectId:null,
			issue:null,
			issueType:null,
			borderColor:null
		}
	},
	computed: {
		allPriority(){
			return this.$store.state.taskManagement.allPriority;
		},
		allStatus(){
			return this.$store.state.taskManagement.listStatusInProjects[this.projectId];
		},
		issueTypes(){
			return this.$store.state.taskManagement.currentProject.issueTypes;
		}
	},
	created(){
		this.projectId = this.$route.params.id;
	},
	mounted(){
		this.getPriority();
		this.getIssueType();
		this.borderColor = (this.priority) ? this.priority.color :status.color
	},
	methods:{
		getDate(dateTime){
			dateTime = dateTime.split(' ')[0];
			dateTime = dateTime.split('-');
			let date = dateTime[1]+"-"+dateTime[2];
			return date
		},
		handleShowDetailIssue(){
			this.documentObjectId = this.task.document_object_id;
			this.issue = this.task;
            this.$refs.issue.show();
        },
		getPriority(){
			let priority = this.allPriority.find(ele => ele.id == this.task.tmg_priority_id);
			if(priority){
				this.priority = {icon:priority.icon, color:priority.color}
			}
		},
		getIssueType(){
			let issueType = this.issueTypes.find(ele => ele.id == this.task.tmg_issue_type);
			if(issueType){
				this.issueType = {icon:issueType.icon, name:issueType.name}
			}
		},
	
	}
};
</script>

<style scoped>
	.task-item{
		background: white;
		box-shadow: var(--task-card-box-shadow);	
		font-size: 13px;
	}
	.task-item__header{
		display: flex;
	}
	.card-item__body .user-avatar{
		height: 17px;
		border-radius: 50%;
		margin-bottom: -4px;
	}
	.card-item__body{
		display: flex;
	}
	.card-item__body .right-content{
		margin-left: auto;
	}
	.right-content .mdi{
		font-size: 15px;
		margin-top: -3px;
		margin-right: 6px;
	}
	.right-content span{
		margin-right: 6px;
	}
	.left-content .mdi{
		font-size: 18px;
		margin-bottom: 3px;
	}
	.left-content span{
		margin-left: 4px;
	}
	.status-task{
		display: inline-block;
		width: 14px;
		height: 14px;
		border-radius: 50%;
	}
	.task-hover-poiter{
		cursor: pointer;
		transition: all ease-in-out 250ms;
	}
	.task-hover-poiter:hover{
		box-shadow: var(--symper-box-shadow-bottom);
	}
	.task-content{
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
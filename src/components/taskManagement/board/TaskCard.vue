<template>
	<div class="task-item rounded px-2 pt-2 pb-1">
		<div class="task-item__header">
			<p>{{task.tmg_name}}</p>
			
		</div>
		<div class="mt-4 card-item__body">
			<div class="left-content">
				<v-icon v-if="task.issueType" style="color:green;">{{task.issueType.icon}}</v-icon>
				<v-icon v-if="task.priority" style="color:red;">{{task.priority.icon}}</v-icon>
				<span>DN-12</span>
			</div>
			<div class="right-content">
				<v-icon>mdi-clock-time-four-outline</v-icon>
				<span>{{task.document_object_create_time}}</span>
				<img
					class="user-avatar"
					src="https://pickaface.net/gallery/avatar/unr_sample_161118_2054_ynlrg.png"
					alt="Avatar"
				>
			</div>
			
		</div>
  	</div>
</template>
<script>
export default {
	props: {
		task: {
		type: Object,
		default: () => ({})
		}
	},
	computed: {
		badgeColor() {
		const mappings = {
			Design: "purple",
			"Feature Request": "teal",
			Backend: "blue",
			QA: "green",
			default: "teal"
		};
		return mappings[this.task.type] || mappings.default;
		}
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
</style>
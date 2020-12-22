<template>
	<div class="menu-action-task-life-cycle">
		 <v-menu offset-y>
			<template v-slot:activator="{ on, attrs }">
				<v-btn
					color="#F5F5F5"
					v-bind="attrs"
					v-on="on"
					small
					:disabled="listActions.length == 0"
				>
					Action 
					<v-icon small right dark style="border-left:2px solid lightgrey;padding-left:8px">mdi-plus</v-icon>

				</v-btn>
			</template>
			<v-list>
			<v-list-item
				v-for="(item, index) in listActions"
				:key="index"
				@click="handlerItemClick(item)"
			>
				<v-list-item-title>
					<v-icon small class="mr-1">
						{{item.icon}}
					</v-icon>
					<span class="fs-13">
						{{ item.title }}
					</span>
				</v-list-item-title>
			</v-list-item>
			</v-list>
      </v-menu>
	</div>
	
</template>

<script>
export default {
	props:{
		snackbarMode:{
			type: Boolean,
			default: false
		},
		userType:{
			type: String,
			default: ""
		},
		taskType:{
			type: String,
			default: ""
		},
		showResolveAction:{
			type: Boolean,
			default: false
		}
	},
	computed:{
		listActions(){
			let lists = []
			if(this.userType == 'assignee' && this.taskType == 'assign'){
				this.items.forEach(function(e){
					if(e.value == 'reAssign' || e.value == 'delegate' || e.value == 'complete'){
						lists.push(e)
					}
				})
			}
			if(this.userType == 'assignee' && this.taskType == 'delegate'){
				this.items.forEach(function(e){
					if(e.value == 'resolve' ){
						lists.push(e)
					}
				})
			}
			if(this.userType == 'owner' && this.taskType == 'assign'){
				this.items.forEach(function(e){
					if(e.value == 'reAssign' || e.value == 'delegate' || e.value == 'complete' || e.value == 'unClaim'){
						lists.push(e)
					}
				})
			}
			if(this.taskType == 'unAssign'){
				this.items.forEach(function(e){
					if(e.value == 'claim'){
						lists.push(e)
					}
				})
			}
			return lists
		}
	},
	data(){
		return{
			items: [
				{ 
					title: this.$t('tasks.reAssign'), // giao việc
					icon: 'mdi-account-arrow-right-outline',
					value: 'reAssign'				
				},
				{ 
					title: this.$t('tasks.delegate'), // uwry quyền
					icon: 'mdi-account-switch-outline',
					value: 'delegate'					
				},
				{ 
					title: this.$t('tasks.unClaim'), // Hủy nhận công việc
					icon: 'mdi-account-arrow-right-outline',
					value: 'unClaim'					
				},
				{ 
					title: this.$t('tasks.claim'), //nhận công việc
					icon: 'mdi-account-arrow-right-outline',
					value: 'claim'					
				},
				{ 
					title: this.$t('tasks.resolve'), // Giải quyết
					icon: 'mdi-account-arrow-right-outline',
					value: 'resolve'					
				},
				{ 
					title: this.$t('tasks.complete'), // Hoàn thành
					icon: 'mdi-account-arrow-right-outline',
					value: 'complete'					
				},
				
			],
		}
	},
	methods:{
		handlerItemClick(item){
			this.$emit('action-clicked', item.value)
		}
	}
}
</script>

<style scoped>
.menu-action-task-life-cycle >>> .action-task-life-cycle{
	box-shadow: unset !important;
}
.v-list-item {
	min-height: unset !important;
	height: 20px !important;
	cursor: pointer;
	padding: 16px 8px;
	margin: 2px 8px;
}
.v-list-item:hover{
	background-color: #f5f5f5;
	border-radius: 4px;
}
</style>
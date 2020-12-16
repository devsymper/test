<template>
	<div class="menu-action-task-life-cycle">
		 <v-menu offset-y>
			<template v-slot:activator="{ on, attrs }">
				<v-btn
					color="#F5F5F5"
					v-bind="attrs"
					v-on="on"
					small
				>
					Action 
					<v-icon small right dark style="border-left:2px solid lightgrey;padding-left:8px">mdi-plus</v-icon>

				</v-btn>
			</template>
			<v-list>
			<v-list-item
				v-for="(item, index) in items"
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
			debugger
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
	padding: 8px 4px;
	margin: 8px 8px;
}
.v-list-item:hover{
}
</style>
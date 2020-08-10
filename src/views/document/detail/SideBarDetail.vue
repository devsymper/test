<template>
	<v-navigation-drawer
	absolute
	permanent
	right
	:width="sidebarWidth"
	:style="{'transform':(isShow) ? 'translateX(0%)' : 'translateX(100%)'}"
	>
	<template v-slot:prepend>
		<!-- <v-list-item two-line>
		<v-list-item-avatar>
			<img src="https://randomuser.me/api/portraits/women/81.jpg">
		</v-list-item-avatar>

		<v-list-item-content>
			<v-list-item-title>Jane Smith</v-list-item-title>
			<v-list-item-subtitle>Logged In</v-list-item-subtitle>
		</v-list-item-content>
		</v-list-item> -->
	</template>

	<v-divider></v-divider>

	<!-- <v-list dense> -->
		<!-- <v-list-item
		v-for="item in items"
		:key="item.title"
		>
		<v-list-item-icon>
			<v-icon>{{ item.icon }}</v-icon>
		</v-list-item-icon>

		<v-list-item-content>
			<v-list-item-title>{{ item.title }}</v-list-item-title>
		</v-list-item-content>
		</v-list-item>
	</v-list> -->
	</v-navigation-drawer>
</template>
<script>

import { userApi } from "./../../../api/user.js";
import bpmnApi from "./../../../api/BPMNEngine.js";
import { data } from 'jquery'
export default {
	data () {
		return {
			isShow:false,
		
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
	},
	watch:{
		isShowSidebar(after){
			this.isShow = after
		}
	},
	created(){
		// userApi.getDetailUser(this.userId).then(res=>{
        //             console.log('resresres',res);
		// 		}).always({}).catch({});
		// bpmnApi.getDefinitionData(this.workflowId).then(res=>{ 
        //             console.log('resresres',res);
		// 		}).always({}).catch({});
		// bpmnApi.getATaskInfo(this.taskId).then(res=>{
        //             console.log('resresres',res);
        //         }).always({}).catch({});
	}

}
</script>
<style scoped>

</style>
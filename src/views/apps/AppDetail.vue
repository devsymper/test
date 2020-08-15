<template>
  <div class="app-details">
	  	 <VuePerfectScrollbar :style="{height: menuItemsHeight}">
			<div v-for="(itemT,i) in listItems" :key="i" class="app-item">
				<h4><v-icon>{{itemT.icon}}</v-icon>  {{ itemT.title }}</h4>
					<ul v-for="(childItem,i) in itemT.item" :key="i"  class="app-child-item">
							<li>
								{{childItem.name}}
							<v-icon style="font-size:15px;float:right;padding-top:5px" @click="removeItem(childItem.id,itemT.title)">mdi-cat</v-icon>
							</li>
					</ul>
			</div>
		</VuePerfectScrollbar>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
export default {
 data: function() {
        return {
			menuItemsHeight: '100%',
            listItems:{
			   documents:{
				   icon : 'mdi-folder',
				   title: 'documents',
				   item:[
						{
							id:1,
							name: 'adnsdadas'
						},
						{
							id:3,
							name: 'adnsdadas'
						},{
							id:2,
							name: 'adnsdadas'
						}

				   ]
			   },
			   orgcharts:{
 				   icon : 'mdi-folder',
				   title: 'orgcharts',
				   item:[
						
				   ]
			   },
			   reports:{
				    icon : 'mdi-folder',
				   title: 'reports',
				   item:[
					
				   ]
 				 
			   },
			   workflows:
			   {
			    icon : 'mdi-folder',
				   title: 'workflows',
				   item:[
						
				   ]
			   },
			},  
    	};
	},
	created(){
		// debugger
	},
	computed:{
		// sAppModule(){
		// 	return JSON.parse(JSON.stringify(this.$store.state.appConfig))
		// }
	},
	methods:{
		removeItem(id,type){
			this.listItems[type].item.splice(this.listItems[type].item.indexOf(id));
			console.log(this.listItems[type].item,'this.listItems[type].item');
			this.$emit('update-list-item', this.listItems)
			// console.log(this.listItems,'this.listItems');
		}
	},
	components: {
        VuePerfectScrollbar,
	},
}
</script>

<style scoped>
.app-details >>> .app-item ul{
	list-style: none;
}
.app-details >>> .app-item li{
	cursor: pointer;
	padding: 6px;
	margin-right: 10px;
}
.app-details >>> .app-item li:hover{
	background-color:lightgray;
}
</style>
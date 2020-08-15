<template>
  <div class="app-details">
	  	 <VuePerfectScrollbar :style="{height: menuItemsHeight}">
			<div v-for="(itemT,i) in sAppModule.listItemSelected" :key="i" class="app-item">
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
    	};
	},
	created(){
		// debugger
		// this.$emit('update-list-item', this.listItems)
		// console.log(this.listItems,'this.listItemsthis.listItems');
	},
	computed:{
		sAppModule(){
			return this.$store.state.appConfig
		}
	},
	methods:{
		removeItem(id,type){
			// this.listItems[type].item.splice(this.listItems[type].item.indexOf(id));
			// console.log(this.listItems[type].item,'this.listItems[type].item');
			console.log('click remove');
			this.$store.commit('appConfig/removeItemSelected',{id:id,type:type})
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
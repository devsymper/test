<template>
  <div>
	  	 <!-- <VuePerfectScrollbar :style="{height: menuItemsHeight}">
		<div v-for="(itemT,i) in sAppModules.listItemSelected" :key="i">
				<h4><v-icon>{{itemT.icon}}</v-icon>  {{ itemT.title}}</h4>
					<ul v-for="(childItem,i) in itemT.item" :key="i" @click="clickItem(childItem,itemT.title)">
							<li>
								{{childItem.name}} 
							</li>
					</ul>
			</div>
		</VuePerfectScrollbar> -->
		<span>hello</span>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
export default {
	 data() {
		 menuItemsHeight: '100%'
		 sAppModule:{
			//  documents:{

			//  },

		 }
	},
	created(){
		// debugger
	},
	computed:{
		// sAppModule(){
		// 	return JSON.parse(JSON.stringify(this.$store.state.appConfig))
		// }
	},
	
	components: {
        VuePerfectScrollbar,
	},
}
</script>

<style>

</style>
<template>
  <div>
	  	 <VuePerfectScrollbar :style="{height: menuItemsHeight}">
		<div v-for="(itemT,i) in sAppModule" :key="i">
				<h4><v-icon>{{itemT.icon}}</v-icon>  {{ itemT.title}}</h4>
					<ul v-for="(childItem,i) in itemT.item" :key="i" @click="clickItem(childItem,itemT.title)">
							<li>
								{{childItem.name}} 
							</li>
					</ul>
			</div>
		</VuePerfectScrollbar>
		<span>hello</span>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
export default {
	 data() {
        // return {
		// 	currentSelectedItem:{
		// 		documents: 
		// 		{
		// 			1: {name: 'a32dn'},
		// 			2: {name: 'adn22312'},
		// 			3: {name: 'adn23232'},
		// 		},
		// 		orgcharts:
		// 		{
		// 			1: {name: 'adn'},
		// 			2: {name: 'adn121'},
		// 			3: {name: 'adn112'},
		// 		},
		// 		reports: 
		// 		{
		// 			1: {name: 'adn21'},
		// 			2: {name: 'adn22'},
		// 			3: {name: 'adn23'},
		// 		},
		// 		workflows: 
		// 		{
		// 			1: {name: 'adn'},
		// 			2: {name: 'adn23'},
		// 			3: {name: 'adn23'},
		// 		},
		// 	}
		// };
		sAppModule:{}
    },
	computed:{
		// sAppModule(){
		// 	return this.$store.state.appConfig.listItemSelected
		// }
	},
	components: {
        VuePerfectScrollbar,
	},
}
</script>

<style>

</style>
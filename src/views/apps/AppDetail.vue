<template>
  <div class="app-details">
	  	 <VuePerfectScrollbar :style="{height: menuItemsHeight}">
			<div v-for="(itemT,i) in sAppModule.listItemSelected" :key="i" class="app-item">
					<div class="title-app" v-if="itemT.item.length >0"><v-icon style="font-size:13px">{{itemT.icon}}</v-icon> <h4> {{ itemT.title }} <span> {{'('+itemT.item.length +')' }}</span> </h4></div>
					<ul v-for="(childItem,i) in itemT.item" :key="i"  class="app-child-item">
							<li>
								{{childItem.name}}
							<v-icon class="icon-remove"  @click="removeItem(childItem.id,itemT.name)">mdi-delete-circle</v-icon>
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
	},
	computed:{
		sAppModule(){
			return this.$store.state.appConfig
		}
	},
	methods:{
		removeItem(id,type){
			this.$store.commit('appConfig/removeItemSelected',{id:id,type:type})
		}
	},
	components: {
        VuePerfectScrollbar,
	},
}
</script>

<style scoped>
.app-details{
	font: 13px roboto;
}
.app-details >>> .app-item ul{
	list-style: none;
}
.app-details >>> .app-item .title-app{
	display: flex;
	cursor: pointer;
	padding:10px 15px;
	
}
.app-details >>> .app-item .title-app h4{
	padding-left:8px;
	font-weight: unset;
}
.app-details >>> .app-item .app-child-item .icon-remove{
	font-size:13px;
	float:right;
	padding-top:2px;
}
.app-details >>> .app-item li{
	cursor: pointer;
	padding: 8px;
	margin-right: 10px;
}
.app-details >>> .app-item li:hover{
	background-color:lightgray;
}
</style>
<template>
  <div class="end-user-popup"> 
	  <v-card >
		<v-app-bar dense flat color="white">
			<v-toolbar-title>
				<v-icon>mdi-apps</v-icon>
					Ứng dụng
			</v-toolbar-title>
			<v-spacer></v-spacer>
		</v-app-bar>
		<div class="list-favorite">
			<div class="title-favorite"><v-icon>mdi-star</v-icon><h4>Yêu thích</h4></div>
			<ul style="margin:0 10px;">
				<li v-for="i in 5" :key="i">bản i ádasdasdasdsadasđ <v-icon color="yellow" style="float:right;font-size:13px">mdi-star</v-icon></li>
			</ul>
		</div>
		<!-- <hr> -->
			<div class="title-list-app"> <v-icon>mdi-star</v-icon><h4>Danh sách các ứng dụng</h4></div>
		<div class="list-app-cointaner">
			<div v-for="i in 5" :key="i" 
				class="list-app-item"
				>
			 	 <v-icon style="font-size:90px;padding:10px">mdi-folder</v-icon>
				<h5>bán hàng</h5>
			</div>
		</div>
   	</v-card>
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
	components: {
        VuePerfectScrollbar,
	},
}
</script>

<style scoped>
.end-user-popup {
	font: 13px Roboto;
	overflow: hidden;
}
.end-user-popup >>> .list-favorite li{
	padding: 5px;

}
.end-user-popup >>> .title-favorite,
.end-user-popup >>> .title-list-app{
	display: flex;
	margin: 10px 15px;
}
.end-user-popup >>> .title-favorite h4,
.end-user-popup >>> .title-list-app h4{
	padding-left: 8px;
	padding-top: 3px;
}
.end-user-popup >>> .list-app-cointaner{
	display: flex;
    flex-wrap: wrap;
}
.end-user-popup >>> .list-app-cointaner .list-app-item:hover{
	background-color: lightgray;
	cursor: pointer;
}
.end-user-popup >>> .list-app-cointaner .list-app-item{
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-right:auto;
	margin-bottom: 12px;
}
.end-user-popup >>> .list-app-cointaner .list-app-item h5{
	margin-top: -12px;
}
</style>
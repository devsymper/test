<template>
  <div class="end-user-popup"> 
	  <v-card >
		<v-app-bar dense flat color="white">
			<v-toolbar-title>
				<v-icon>mdi-apps</v-icon>
					{{$t('apps.title')}}
			</v-toolbar-title>
			<v-spacer></v-spacer>
		</v-app-bar>
		<div class="list-favorite">
			<div class="title-favorite"><v-icon >mdi-star</v-icon><h4>{{$t('apps.favorite')}}</h4></div>
			<ul style="margin:0 10px;">
				<li v-for="i in 5" :key="i">Document demo ne ahihi <v-icon color="yellow" style="float:right;font-size:13px">mdi-star</v-icon></li>
			</ul>
		</div>
		<!-- <hr> -->
			<div class="title-list-app"> <v-icon>mdi-playlist-play</v-icon><h4>{{$t('apps.listApp')}}</h4></div>
		<div class="list-app-cointaner">
			<div v-for="i in 5" :key="i" 
				class="list-app-item"
				>
			 	 <v-icon>mdi-folder</v-icon>
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
.end-user-popup >>> .list-favorite ul{
	list-style: none;
}
.end-user-popup >>> .list-favorite li{
	padding: 5px 10px;
}
.end-user-popup >>> .title-favorite,
.end-user-popup >>> .title-list-app{
	display: flex;
	margin: 10px 15px;
}
.end-user-popup >>> .title-favorite .v-icon,
.end-user-popup >>> .title-list-app .v-icon{
	font-size: 13px;
	padding: 3px 8px ;
}
.end-user-popup >>> .title-favorite h4,
.end-user-popup >>> .title-list-app h4{
	padding-left: 2px;
	padding-top: 2px;
	font-weight: unset;
}
.end-user-popup >>> .list-app-cointaner{
	display: flex;
    flex-wrap: wrap;
	width: 350px;
	margin-right:auto;
	margin-left:auto;
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
	/* margin-left:auto; */
	margin-bottom: 12px;
}
.end-user-popup >>> .list-app-cointaner .list-app-item .v-icon{
	font-size:60px;
	padding:10px
}
.end-user-popup >>> .list-app-cointaner .list-app-item h5{
	margin-top: -12px;
}
</style>
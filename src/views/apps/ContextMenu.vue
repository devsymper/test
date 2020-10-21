<template>
   <v-card class="context-menu" v-show="isShowContext" >
		<div class="context-menu-item" v-for="(action,i) in listAction" :key="i" @click="clickAction(action,sideBySide, allAppMode)">
				<span v-html="reduce(action)"></span>
		</div>
   </v-card>
</template>
<script>
import {appManagementApi} from './../../api/AppManagement.js'
import { util } from "../../plugins/util";
export default {
    data: () => ({
		isShowContext:false,
		top:0,
		left:0,
		listAction:[],
		targetItem:{},
		type:'',
		appId:null,
		defineAction:{
			document_definition:{
				 "module": "document",
  				 "resource": "document_definition",
				 "scope": "document",
			},
			workflow_definition:{
				"module": "workflow",
				"resource": "workflow_definition",
				"scope": "workflow",
			},
			dashboard:{
				"module": "dashboard",
				"resource": "dashboard",
				"scope": "dashboard",
			},
			orgchart:{
				 "module": "orgchart",
				 "resource": "orgchart",
				 "scope": "orgchart",
			},
		}
	}),
	created(){
		let self = this
	},
	props:{
		sideBySide:{
			type: Boolean,
			default: false
		},
		allAppMode:{
			type: Boolean,
			default: false,
		}
	},
	methods:{
		clickRow(item){
			item.callback(item);
			this.hide()
		},
		show(e){
			var windowHeight = $(window).height()/1.5;
			var windowWidth = $(window).width()/1.1;
			this.isShowContext = true;
			if(e.clientY > windowHeight && e.clientX <= windowWidth) {
				$(".context-menu").css("left", e.clientX).css("bottom", $(window).height()-e.clientY).css("right", "auto").css("top", "auto")
			} else if(e.clientY > windowHeight && e.clientX > windowWidth) {
				$(".context-menu").css("right", $(window).width()-e.clientX).css("bottom", $(window).height()-e.clientY).css("left", "auto").css("top", "auto");
			} else if(e.clientY <= windowHeight && e.clientX <= windowWidth) {
				$(".context-menu").css("left", e.clientX).css("top", e.clientY).css("right", "auto").css("bottom", "auto");
			} else {
				$(".context-menu").css("right", $(window).width()-e.clientX).css("top", e.clientY).css("left", "auto").css("bottom", "auto");
			}
			$('#symper-app').append(this.$el);
		},
		hide(){
			this.isShowContext = false;
		},
		calPosition(event){
				
		},
		setContextItem(ctx){
			this.listAction = ctx;
		},
		setItem(item){
			this.targetItem = item
		},
		setType(type){
			this.type = type
		},
		setAppId(appId){
			this.appId = appId
		},
		clickAction(action,sideBySide = false,allAppMode = false){
			$(".v-menu__content").css("display", "none")
			let appId
			if(allAppMode == true){
				appId = this.appId
			}else{
				appId = this.$store.state.appConfig.currentAppId
			}
			
			this.defineAction[this.type].action = action;
			this.hide()
			if(this.targetItem.objectIdentifier.includes("document_definition:")){
				this.targetItem.id = this.targetItem.objectIdentifier.replace("document_definition:","")
			}
			if(this.targetItem.objectIdentifier.includes("orgchart:")){
				this.targetItem.id = this.targetItem.objectIdentifier.replace("orgchart:","")
			}
			if(this.targetItem.objectIdentifier.includes("dashboard:")){
				this.targetItem.id = this.targetItem.objectIdentifier.replace("dashboard:","")
			}
			if(this.targetItem.objectIdentifier.includes("workflow_definition:")){
				this.targetItem.id = this.targetItem.objectIdentifier.replace("workflow_definition:","")
			}
				let targetItem = this.targetItem
			if(action == 'unfavorite'){
				    let userId = this.$store.state.app.endUserInfo.id
					appManagementApi.addFavoriteItem(userId,this.targetItem.id,this.type,0).then(res => {
					if (res.status == 200) {
						this.$store.commit('appConfig/delFavorite',this.targetItem)
					}
					});
			}
			if(sideBySide == true){
				this.$store.commit('appConfig/updateActionDef', this.defineAction[this.type])
				this.$store.commit('appConfig/updateParam', {id:targetItem.id,name:targetItem.name,title:targetItem.title,appId:appId })
			}else{
				this.$evtBus.$emit('symper-app-call-action-handler', this.defineAction[this.type], this, {id:targetItem.id,name:targetItem.name,title:targetItem.title,appId:appId });

			}
		},
		reduce(action){
			let str = this.type.concat('.').concat(action)
			let nameIcon = this.$t('actions.iconListActions.'+str)
			let icon =	` <i class="mdi ${nameIcon}" style="padding-right:5px"></i>`
			let name = this.$t('actions.listActions.'+str)
			let res = icon.concat(name)
			return res
		}
	}
}
</script>
<style scoped>
.context-menu{
	position: fixed;
	z-index: 10000;
	width: 170px;
	font:13px roboto;
	background-color: #fff;
	-webkit-box-shadow: 2px 0px 24px 0px rgba(0,0,0,0.75);
	-moz-box-shadow: 2px 0px 24px 0px rgba(0,0,0,0.75);
	box-shadow: 2px 0px 24px 0px rgba(0,0,0,0.75);
}
.context-menu >>> .context-menu-item{
	padding: 8px 10px;
	font-size: 13px;
	cursor: pointer;
	color: black;
	text-align: left;
	border-bottom:unset;
}
.context-menu >>> .context-menu-item:hover{
	background: #f7f7f7;
}
.context-menu >>> .v-icon {
	font-size: 13px;
}
</style>
<template>
	<ListItem 
		:containerHeight="containerHeight"
		 ref="listActionPack"
		:useDefaultContext="false"
		:pageTitle="$t('permissions.actionPack.list')"
		:getDataUrl="getListUrl"
		:headerPrefixKeypath="'common'"
		:customAPIResult="customAPIResult"
		:showActionPanelInDisplayConfig="true"
	/>

</template>

<script>
import { appConfigs } from "@/configs.js";
import ListItem from "@/components/common/ListItems.vue"
export default {
	components:{
		ListItem
	},
	props:{
		containerHeight:{
			type: Number,
		}
	},
	data(){	
		let self = this
		return{
			getListUrl: appConfigs.apiDomain.actionPacks,
			customAPIResult: {
                reformatData(res) {
                    if (res.status == 200) {
						let listBA = self.$store.state.app.allBA;
						debugger
                        res.data.forEach(function(e){
                           if(!e.userCreate){
                             e.userCreateName = ""  
                           }else{
                               listBA.forEach(function(k){
                                    if(k.id == e.userCreate){
                                        e.userCreateName =  k.name
                                    }
                                })
                           }
                           if(!e.userUpdate){
                                e.userUpdateName =""
                           }else{
                               listBA.forEach(function(k){
                                    if(k.id == e.userUpdate){
                                        e.userUpdateName =  k.name
                                    }
                                })
                           }
                        })
                        return {
                            listObject: res.data,
                            columns: [
                                {
                                    name: "id",
                                    title: "id",
                                    type: "numeric"
                                },
                                {
                                    name: "name",
                                    title: "name",
                                    type: "text"
                                },
                                {
                                    name: "description",
                                    title: "description",
                                    type: "text"
                                },
                                {
                                    name: "userCreateName",
                                    title: "userCreateName",
                                    type: "text"
                                },
                                {
                                    name: "userUpdateName",
                                    title: "userUpdateName",
                                    type: "text"
                                },
                                {
                                    name: "createAt",
                                    title: "createAt",
                                    type: "text"
                                },
                                {
                                    name: "updateAt",
                                    title: "updateAt",
                                    type: "text"
                                },

                            ]
                        };
                    } else {
                        this.$snotifyError(res, "Can not get permissions list");
                    }
                }
            },
		}
	},
	mounted(){
    },
}
</script>

<style>

</style>
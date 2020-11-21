<template>
	<ListItem 
		:pageTitle="'Danh sách orgchart'"
		:containerHeight="containerHeight"
		:useDefaultContext="false"
		:tableContextMenu="tableContextMenu"
		:getDataUrl="getListUrl"
		:customAPIResult="customAPIResult"
		:useActionPanel="false"
		:showExportButton="false"
		:headerPrefixKeypath="'common'"
	/>

</template>

<script>
import Handsontable from 'handsontable';
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
		return{
			getListUrl: appConfigs.apiDomain.orgchart+'orgchart',
			customAPIResult:{
				reformatData(res){
                   	return{
                       columns:[
                            {name: "id", title: "id", type: "numeric"},
                            {name: "code", title: "code", type: "text"},
                            {name: "name", title: "name", type: "text"},
                            {name: "isDefault", title: "isDefault", type: "text",
                                renderer:  function(instance, td, row, col, prop, value, cellProperties) {
                                    let span;
                                    Handsontable.dom.empty(td);
                                    span = document.createElement('span')
                                    if(value == "1"){
                                        $(span).text('Mặc định')
                                    }else{
                                        $(span).text('')
                                    }
                                    td.appendChild(span);
                                    return td
                                },
                            },
                            {name: "description", title: "description", type: "text"},
                            {name: "createAt", title: "create_at", type: "date"},
                            {name: "lastUpdateAt", title: "last_update_at", type: "date"}
                       ],
                       listObject:res.data.listObject,
                       total: res.data.listObject.length
                   }
                }
			},
			tableContextMenu: {
				setPermission: {
					name: "set",
					text: "Phân quyền",
					callback: (row, callback) => {
					}
				},
			
			}
		}
	},
	
}
</script>

<style>

</style>
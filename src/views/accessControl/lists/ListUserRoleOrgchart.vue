<template>
	<ListItem 
		ref="listOrgchart"
		:pageTitle="'Danh sách orgchart'"
		:containerHeight="containerHeight"
		:useDefaultContext="false"
		:tableContextMenu="tableContextMenu"
		:getDataUrl="getListUrl"
		:customAPIResult="customAPIResult"
		:useActionPanel="true"
		:showExportButton="false"
		:headerPrefixKeypath="'common'"
		:actionPanelWidth="650"
		:dialogMode="false"
	>
		<template slot="right-panel-content" slot-scope="{itemData}">
			<UserRoleOrgchartPanel 
				:idOrgchart="idOrgchart"
			/>
		</template>
	
	</ListItem>

</template>

<script>
import UserRoleOrgchartPanel from "./../panels/UserRoleOrgchartPanel"
import Handsontable from 'handsontable';
import { appConfigs } from "@/configs.js";
import ListItem from "@/components/common/ListItems.vue"
export default {
	components:{
		ListItem,
		UserRoleOrgchartPanel
	},
	props:{
		containerHeight:{
			type: Number,
		}
	},
	data(){
		let self = this
		return{
			getListUrl: appConfigs.apiDomain.orgchart+'orgchart',
			idOrgchart:null,
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
						self.idOrgchart = row.id
						self.$refs.listOrgchart.actionPanel = true
					}
				},
			
			}
		}
	},
	
}
</script>

<style>

</style>
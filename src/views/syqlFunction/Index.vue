<template>
    <div class="w-100 h-100" >
        <list-items
            ref="listSyqlFunction"
            :useDefaultContext="false"
            :pageTitle="'Danh sách function'"
            :tableContextMenu="tableContextMenu"
            :containerHeight="containerHeight"
            :getDataUrl="getListUrl"
			:customAPIResult="customAPIResult"
            :useActionPanel="true"
            :headerPrefixKeypath="'common'"
			:showExportButton="false"
			:actionPanelWidth="1000"
			@after-open-add-panel="handleAdd"
			:showActionPanelInDisplayConfig="true"
			:actionPanelType="'elastic'"
        >
			<template slot="right-panel-content">  
				<SyqlFunctionForm
					:action="action"
					@add-success="handleAddSuccess"
					:syqlId="syqlId"
				/>
			</template>
        </list-items>
		<DialogShowContent 
			:showDialog="showDialog"
			:content="content"
			@cancel="showDialog = false"
		/>
    </div>
</template>
<script>
import { util } from "@/plugins/util.js";
import { appConfigs } from "@/configs.js";
import ListItems from "@/components/common/ListItems.vue";
import SyqlFunctionForm from './SyqlFunctionForm'
import Handsontable from 'handsontable';
import {syqlFunctionApi} from '@/api/SyqlFunction'
import DialogShowContent from './DialogShowContent'
export default {
	created(){
		this.$store.dispatch("app/getAllBA");
	},
    data() {
        let self = this;
        return {
			getListUrl: appConfigs.apiDomain.syqlFunction+'functions',
			action:'',
			syqlId: '',
			content:'',
			showDialog: false,
			containerHeight:null,
			customAPIResult:{
				reformatData(res){
					let listBA = self.$store.state.app.allBA;
					res.data.listObject.forEach(function(e){
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
					return{
						columns:[
							{name: "id", title: "id", type: "text"},
							{name: "name", title: "name", type: "text"},
							{name: "parameter", title: "parameter", type: "text"},
							{name: "description", title: "description", type: "text"},
							{name: "createAt", title: "createAt", type: "date"},
							{name: "updateAt", title: "updateAt", type: "date"},
							{name: "userCreateName", title: "userCreateName", type: "text"},
							{name: "userUpdateName", title: "userUpdateName", type: "text"},
							{name: "status", title: "status", type: "numeric",
								cellRenderer: function(params) {
									let newValue = params.value == '1' ? "Kích hoạt" : "Không kích hoạt"
									return  '<span style="color: blue">'+ newValue +'</span>'
								}
							}
						],
						listObject: res.data.listObject,
						total: res.data.total
					}
				}
			},
            tableContextMenu: {
                update: {
                    name: "edit",
                    text: this.$t("common.edit"),
                    callback: (row, callback) => {
						self.handleEdit(row)
						self.$store.dispatch('SyqlFunction/getFunctionDetail',row.id)
                    }
                },
                viewContent: {
                    name: "viewContent",
                    text:'Xem nội dung',
                    callback: (row, callback) => {
						self.showDialog = true
						self.content = row.content
                    }
                },
                remove: {
                    name: "remove",
                    text: this.$t("common.delete"),
                    callback:  (row, refreshList) => {
						syqlFunctionApi.deleteFunction(row[0].id).then(res=>{
							if(res.status == 200){
								refreshList()
								self.$snotify({
									type: "success",
									title: "Xóa thành công"
								})
							}else{
								self.$snotify({
									type: "error",
									title: "Đã xảy ra lỗi"
								})
							}
						}).catch(err=>{
							self.$snotify({
								type: "error",
								title: err
							})
						})
                    }
                },
                detail: {
                    name: "detail",
                    text: this.$t("common.detail"),
                    callback: (row, callback) => {
						self.handleView(row)
						self.$store.dispatch('SyqlFunction/getFunctionDetail',row.id)
                    }
                },
            }
        };
	},
	methods:{
		handleView(row){
			this.syqlId = row.id
			this.openPanel('view')
		},
		handleEdit(row){
			this.syqlId = row.id
			this.openPanel('edit')
		},
		handleAdd(){
			this.openPanel('add')
		},
		openPanel(action){
			this.$refs.listSyqlFunction.actionPanel = true
			this.action = action
		},
		handleAddSuccess(){
			this.$refs.listSyqlFunction.actionPanel = false
			this.$refs.listSyqlFunction.refreshList()
		}
	},
    mounted() {
		this.containerHeight = util.getComponentSize(this).h 
    },
    components: {
		ListItems: ListItems,
		SyqlFunctionForm,
		DialogShowContent
    }
};
</script>

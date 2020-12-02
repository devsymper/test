<template>
    <div class="w-100 h-100">
        <list-items
            ref="listSyqlFunction"
            :useDefaultContext="false"
            :pageTitle="'Danh sách function'"
            :tableContextMenu="tableContextMenu"
            :containerHeight="containerHeight"
            :getDataUrl="getListUrl"
            :useActionPanel="true"
            :headerPrefixKeypath="'common'"
			:showExportButton="false"
			:actionPanelWidth="1000"
			:actionPanelType="'elastic'"
			@after-open-add-panel="handleAdd"
			:showActionPanelInDisplayConfig="true"
        >
			<template slot="right-panel-content">  
				<SyqlFunctionForm
					:action="action"
				/>
			</template>
        </list-items>
    </div>
</template>
<script>
import { util } from "@/plugins/util.js";
import { appConfigs } from "@/configs.js";
import ListItems from "@/components/common/ListItems.vue";
import SyqlFunctionForm from './SyqlFunctionForm'
export default {
    data() {
        let self = this;
        return {
			getListUrl: appConfigs.apiDomain.systemRole+'system-role',
			action:'',
			containerHeight:null,
            tableContextMenu: {
                update: {
                    name: "edit",
                    text: this.$t("common.edit"),
                    callback: (row, callback) => {
						self.handleEdit()
                    }
                },
                remove: {
                    name: "remove",
                    text: this.$t("common.delete"),
                    callback: async (rows, refreshList) => {
						self.$snotify({
							type: "success",
							title: "Xóa thành công"
						})
                    }
                },
                detail: {
                    name: "detail",
                    text: this.$t("common.detail"),
                    callback: (row, callback) => {
						self.handleView()
                    }
                },
            }
        };
	},
	methods:{
		handleView(){
			this.openPanel('view')
		},
		handleEdit(){
			this.openPanel('edit')
		},
		handleAdd(){
			this.openPanel('add')
		},
		openPanel(action){
			this.$refs.listSyqlFunction.actionPanel = true
			this.action = action
		}
	},
    mounted() {
		this.containerHeight = util.getComponentSize(this).h - 50
    },
    components: {
		ListItems: ListItems,
		SyqlFunctionForm
    }
};
</script>

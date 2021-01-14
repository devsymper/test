<template>
    <div class="h-100 w-100">
        <ListItems
            ref="listApp"
            :getDataUrl="apiUrl"
            :headerPrefixKeypath="'table'"
            :pageTitle="$t('bi.dashboard.titleShowList')"
            :containerHeight="tableHeight"
            :tableContextMenu="tableContextMenu"
			:customAPIResult="customAPIResult"
            :useDefaultContext="false"
            @after-open-add-panel="addDashboard"
        >
        </ListItems>
    </div>
</template>
<script>
import ListItems from "@/components/common/ListItems";
import { util } from '@/plugins/util.js';
import {
    appConfigs
} from "@/configs";
export default {
    name: "listApps",
    components: {
        ListItems,
    },
    created(){
    },
    data: function() {
		let self = this;
        return {
            apiUrl: appConfigs.apiDomain.biService+"/dashboards",
            tableContextMenu: {
               update: {
                    name: "edit",
                    text: this.$t("common.edit"),
                    callback: (obj, callback) => {
						self.$goToPage("/dashboards/" + obj.id + "/edit",
                            " Chi tiết " + (obj.name ? obj.name : "")
						)
                    },
                },
               view: {
                    name: "view",
                    text: this.$t("common.view"),
                    callback: (obj, callback) => {
						self.$goToPage("/dashboards/" + obj.id + "/view",
                            " Chi tiết " + (obj.name ? obj.name : "")
						)
                    },
                },
               clone: {
                    name: "clone",
                    text: this.$t("common.clone"),
                    callback: (obj, callback) => {
						self.$goToPage("/dashboards/" + obj.id + "/clone",
                            " Chi tiết " + (obj.name ? obj.name : "")
						)
                    },
                },
               delete: {
                    name: "delete",
                    text: this.$t("common.delete"),
                    callback: (obj, callback) => {
						
                    },
                },
               
			},
			customAPIResult:{
				reformatData(res){
					return {
						columns:[
							{"name":"id","title":"id","type":"text"},
							{"name":"createdAt","title":"createdAt","type":"date", flex: 1},
							{"name":"name","title":"name","type":"text", flex: 1},
							{"name":"id","title":"id","type":"text", flex: 1},
							{"name":"updatedAt","title":"updatedAt","type":"text", flex: 1},
							{"name":"userCreate","title":"userCreate","type":"text", flex: 1},
							{"name":"userLastUpdate","title":"userLastUpdate","type":"text", flex: 1}
						],
						listObject: res.data.listObject,
						total: res.data.total
					}
				}
			},
			tableHeight: 0,
        };
    },
    mounted() {
		this.tableHeight = util.getComponentSize(this).h;
    },
    methods: {
		addDashboard(){

		}
	}
};
</script>
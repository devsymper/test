<template>
    <div class="h-100 w-100">
        <ListItems
            ref="listApp"
            :getDataUrl="apiUrl"
            :headerPrefixKeypath="'table'"
            :pageTitle="$t('bi.relation.title-show-list')"
            :containerHeight="tableHeight"
            :tableContextMenu="tableContextMenu"
			:customAPIResult="customAPIResult"
            :useDefaultContext="false"
			@on-add-item-clicked="goToCreatePage"
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
            apiUrl: appConfigs.apiDomain.biService+"/relations",
            tableContextMenu: {
               update: {
                    name: "edit",
                    text: this.$t("common.edit"),
                    callback: (obj, callback) => {
						self.$goToPage( "/relation/" + obj.id + "/edit",
                            self.$t("common.edit")
						);
                    },
                },
               view: {
                    name: "view",
                    text: this.$t("common.view"),
                    callback: (obj, callback) => {
						self.$goToPage( "/relation/" + obj.id + "/view",
							self.$t("common.view")
						);
                    },
                },
               clone: {
                    name: "clone",
                    text: this.$t("common.clone"),
                    callback: (obj, callback) => {
						self.$goToPage( "/relation/" + obj.id + "/clone",
							self.$t("common.clone")
						);
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
					res.data.columns.forEach(function(e){
						e.flex = 1
					})
					return {
						columns:res.data.columns,
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
		goToCreatePage(){
            this.$goToPage('/relation/add',this.$t("orgchart.create.title"));
		}	
	}
};
</script>
<template>
    <div class="w-100 h-100">
        <AgDataTable
			:containerHeight="containerHeight"
			ref="displayTable" 
			:editable="false"
			:pageTitle="'Danh sách Issue Link'"
			:getDataUrl="apiUrl"
			:getContextMenuItems="getContextMenuItems"
			:useActionPanel="true"
			:showActionPanelInDisplayConfig="true"
            :actionPanelWidth="'22cm'"
            :rowHeight="30"
            :showSearchBox="true"
			@row-selected="handlerRowClicked"
		>
			 <template slot="right-panel-content" slot-scope="{}">  
				<Detail :quickView="true" 
                        :docObjInfo="docObjInfo"/>
            </template>
		</AgDataTable>
        <v-dialog v-model="dialogRemoveLink" max-width="350">
            <v-card>
            <v-card-title class="headline">{{$t("common.remove_confirm_title")}}</v-card-title>
            <v-card-text>{{$t("taskManagement.dialog.removeComponent")}}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="red darken-1" text @click="removeLink">Xóa</v-btn>
                <v-btn color="green darken-1" text @click="dialogRemoveLink = false">Hủy</v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { taskManagementApi } from "@/api/taskManagement.js";
import { util } from "@/plugins/util";
import infoUser from "@/components/common/user/InfoUser";
import AgDataTable from '../../common/agDataTable/ListItems.vue';
import Detail from '@/views/document/detail/Detail.vue';
import Submit from '@/views/document/submit/Submit.vue';
import {
    appConfigs
} from "@/configs";
export default {
    name:"listLink",
    components:{
        infoUser,
        AgDataTable,
        Submit,
        Detail
    },
    computed:{
        allLink(){
            let listIssueLink=util.cloneDeep(this.listIssueLink);
            return listIssueLink; 
        },
    },
    props:{
        listIssueLink: {
            type: Array,
            default() {
                return [];
            }
        },
       
    },
    data(){
        return{
            apiUrl:appConfigs.apiDomain.sdocumentManagement+'documents/2159/objects',
            containerHeight:null,
            dialogRemoveLink:false,
            getContextMenuItems(params) {
				var result = [
					{
						name: 'Alert Param',
						action: function () {
							window.alert('Alerting about ' + params.node.data.id);
						},
						cssClasses: ['redFont', 'bold'],
					},
					{
						name: 'Show Panel ',
						action: function () {
							self.$refs.displayTable.actionPanel = true
						},
						cssClasses: ['redFont', 'bold'],
					},
				];
				return result;
            },
            docObjInfo:null
			
        }
    },
    mounted(){
        this.containerHeight = util.getComponentSize(this).h
		// this.MedalCellRenderer.prototype.init = function(params) {
		// 	this.eGui = document.createElement('span');
		// 	this.eGui.innerHTML = '#######';
		// };

		// this.MedalCellRenderer.prototype.getGui = function() {
		// 	return this.eGui;
		// };
	},
    methods:{
        handleDelete(item){
            this.dialogRemoveLink=true;
        },
        removeLink(){
            
        },
     
        handleCreate(){
          
        },
        handelDetailComponent(item){

        },
        handlerRowClicked(params){
			this.$refs.displayTable.actionPanel = true
            this.docObjInfo = {docObjId:parseInt(params.document_object_id),docSize:'21cm'}
            
		}
     
    },
    created(){
    }

}
</script>

<style scoped>
.name-title{
    color:#0000aa;
}
.name-title:hover{
    cursor: pointer;
    text-decoration: underline;
}
.table-list-component >>> td{
    font-size: 13px!important;
}
</style>
<template>
    <div  class="h-100 w-100"
		
	>
        <v-tabs
            hide-slider
            :height="35"
            active-class="symper-tab-active"
            v-model="tabIndex"
            color="grey darken-4"
		>
			<v-tab
				class="symper-app-tab h-100 w-100	"
				v-for="(item) in objectTypes"
				:key="item.key">
				{{ item.text }}
			</v-tab>
		</v-tabs>
        <hot-table
            :height="'auto'"
            :settings="tableSettings"
            :data="tableDataDefinition[openingTabKey].tableData"
            :columns="tableDataDefinition[openingTabKey].columns"
            :colHeaders="tableDataDefinition[openingTabKey].colHeaders"
            :dataSchema="tableDataDefinition[openingTabKey].dataSchema"
            class="fs-13 mt-2 h-100 w-100"
            ref="dataTable">
        </hot-table>
    </div>
</template>

<script>
let defaultTabConfig = {
    tableData: [],
    columns: [],
    colHeaders: [],
    dataSchema: []
};
import { appManagementApi } from '../../../api/AppManagement';
import { HotTable, HotColumn } from "@handsontable/vue";
import { util } from 'jointjs';

export default {
    data(){
        return {
            tabIndex: 0,
            applicationObjects: {}, // các object của các application, có dạng: {idApp: objects},
            tableData: [],
            // cache lại chi tiết các app theo id
            cacheAppDetail: {}
        }
    },
    watch: {
        async idApplication(appId){
            if(!this.applicationObjects[appId]){
                let appDetail = this.cacheAppDetail[appId];
                if(!appDetail){
                    if(appId){
                        let res = await appManagementApi.getAppDetails(appId);                        
                        if(res.status == 200){
                            appDetail = res.data.listObject.childrenApp;
                            this.cacheAppDetail[appId] = appDetail;
                        }else{
                            this.$snotifyError(res, "Can not get application detail!");
                        }
                    }else{
                        appDetail = {};
                        this.cacheAppDetail[appId] = appDetail;
                    }
                }
                
                let data = {};
                for(let key in appDetail){
                    data[key] = appDetail[key];
                }

                this.$emit('app-detail-get', {
                    id: appId,
                    objects: data
                });
            }
        }
    },
    components: {
        HotTable,
    },
    computed: {
        objectTypes(){
            return [
                {
                    key: 'document_definition',
                    text: 'Văn bản',
                },
                {
                    key: 'workflow_definition',
                    text: 'Quy trình',
                },
                {
                    key: 'orgchart',
                    text: 'Sơ đồ tổ chức',
                },
                {
                    key: 'dashboard',
                    text: 'Dashboard',
                },
            ]
        },
        openingTabKey(){
            if(this.objectTypes){
                return this.objectTypes[this.tabIndex].key;
            }else{
                return 'document_definition';
            }
        },
        tableSettings() {
            let setting = util.cloneDeep({
                ...this.commonTableSetting,
            });
            // setting.
            return setting;
        }
    },
    props: {
        objects: {
            default(){
                return {
                    document_definition:[],
                    workflow_definition:[],
                    orgchart:[],
                    dashboard:[],
                }
            }
        },
        idApplication: {
            default: "0"
        },
        /**
         *  các action ứng với từng loại object type, có dạng khớp với định dạng của handson 
         *  {
         *      document_definition: [],...
         *  }
         */
        tableDataDefinition: {
            default(){
                return {
                    document_definition : defaultTabConfig,
                    workflow_definition : defaultTabConfig,
                    orgchart : defaultTabConfig,
                    dashboard : defaultTabConfig,
                }
            }
        },
        /**
         * Các thuộc tính chung của table cần hiển thị
         */
        commonTableSetting: {

        }
    }
}
</script>

<style>

</style>
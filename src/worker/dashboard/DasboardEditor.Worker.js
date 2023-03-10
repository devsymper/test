import { dashboardApi } from "@/api/dashboard.js";
import { biApi } from "@/api/bi.js";
import { autoLoadChartClasses } from "@/components/dashboard/configPool/reportConfig";
import { getDefaultDashboardConfig } from "@/components/dashboard/configPool/dashboardConfigs.js";
import _cloneDeep from 'lodash/cloneDeep';
import { getNewCellConfigLayout } from "@/components/dashboard/configPool/cellLayout";
import { datasetApi } from "../../api/dataset";
import { util } from "../../plugins/util";
import { getColumnDataset } from "@/components/dashboard/configPool/dashboardConfigs.js";

var mapTypeToClass = autoLoadChartClasses();

onmessage = function (event) {
    let data = event.data;
    let action = data.action;
    if(handler[action]){
        handler[action](data.data);
    } else {
        console.error(` action ${action} not found `);
    }
};

var handler = {
    
    /**
     * Khôi phục cấu hình của tất cả các cell từ dữ liệu đã lưu
     * @param {Object} allCell cấu hình của tất cả các cell được lưu
     */
    restoreAllCellConfigs(allCell) {
        let cellConfigs = {};
        let newCell = null;
        let cellType = '';
        for (let cell of allCell) {
            cellType = cell.type;
            if(mapTypeToClass[cellType]){
                newCell = new mapTypeToClass[cellType](cell.id_symper);
                newCell.restoreConfigFromSavedData(cell);
            }else{
                console.error(`class for report type  "${cellType}" not found`, cell);
            }
            cellConfigs[cell.id_symper] = newCell;
        }

        if (!cellConfigs.hasOwnProperty('global')) {
            cellConfigs.global = new mapTypeToClass['global']('global');
        }
        return cellConfigs;
    },

    getLayoutFromConfig(info, allCell) {
        let result = {};
        let configs = info.configs;
        if (configs.hasOwnProperty('tabsAndPages')) {
            for (let tabName in configs.layout) {
                let layout = configs.layout[tabName];
                result[tabName] = [];
                for (let cellId in layout) {
                    let cell = allCell[cellId];
                    if(cell){
                        let newLayoutItem = getNewCellConfigLayout(allCell[cellId].sharedConfigs.type, [], cellId);
                        newLayoutItem = Object.assign(newLayoutItem, layout[cellId]);
                        newLayoutItem.active = false;
                        if (cellId != 'global') {
                            result[tabName].push(newLayoutItem);
                        }
                    }else {
                        console.warn('cell id not found ', configs.layout, cellId);
                    }
                }
            }
        } else {
            result['tab 1'] = [];
            for (let cellId in configs.layout) {
                let cell = allCell[cellId];
                if(cell){
                    let newLayoutItem = getNewCellConfigLayout(cell.sharedConfigs.type, [], cellId);
                    newLayoutItem = Object.assign(newLayoutItem, configs.layout[cellId]);
    
                    if (cellId != 'global') {
                        result['tab 1'].push(newLayoutItem);
                    }
                }else{
                    console.warn('cell id not found ', _cloneDeep(configs.layout), cellId);
                }
            }
        }
        return result;
    },

    getDrillThroughFromConfig(info) {
        let rsl = {
            'tab 1' : []
        };
        
        if(info.configs.drillThrough){
            rsl = info.configs.drillThrough;
        }else{
            if(info.configs.tabsAndPages){
                for(let item of info.configs.tabsAndPages.tabs){
                    rsl[item.name] = [];
                }
            }
        }
        return rsl;
    },

    restoreDashboardConfigs(info, allCell){
        let layout = this.getLayoutFromConfig(info, allCell);
        let result = getDefaultDashboardConfig().dashboardConfigs.info;
        let drillThrough = this.getDrillThroughFromConfig(info);

        result.dashboardName = info.name;
        result.relations = info.configs.extra.relations;
        if (info.configs.hasOwnProperty('tabsAndPages')) {
            for(let tab of info.configs.tabsAndPages.tabs){
                tab.editTabName = false;
                tab.active = false;
                if(!tab.id){
                    tab.id = util.str.randomString(6);
                }
            }
            info.configs.tabsAndPages.tabs[0].active = true;
            result.tabsAndPages = info.configs.tabsAndPages;
            result.currentTabPageKey = result.tabsAndPages.tabs[0].name;
        }
        result.layout = layout;
        result.drillThrough = drillThrough;
        return result;
    },
    
    async getDatasetInfo(datasetIds){
        let filter = {
            filter: [
                {
                    column: 'id',
                    operation: 'and',
                    conditions: [{
                        name: 'in',
                        value: datasetIds
                    }]
                }
            ],
            page: 1,
            pageSize: 500
        }
        let res = await datasetApi.getListByFilter(filter);
        self.postMessage({
            action: 'applySelectedDatasets',
            data: res.data.listObject
        });
    },
    async getDashboardInfo(data){
        let idDashboard = data.idDashboard;
        let response = await dashboardApi.getDashboardInfo(idDashboard);
        let allCellConfigs = this.restoreAllCellConfigs(response.data.reports);
        let dashboardInfo = this.restoreDashboardConfigs(response.data.dashboard, allCellConfigs);
        let needRemoteDataCellCount = 0;

        for(let id in allCellConfigs){
            if(allCellConfigs[id].getType() != 'editor' && allCellConfigs[id].getType() != 'global'){
                needRemoteDataCellCount += 1;
            }
        }
        let relateDatasetIds = response.data.dashboard.relateDatasets.reduce((arr, el) =>{
            arr.push(el.id);
            return arr;
        }, []);
        self.postMessage({
            action: 'setRestoredDashboardConfigs',
            data: {
                allCellConfigs,
                dashboardInfo,
                needRemoteDataCellCount,
                relateDatasets: response.data.dashboard.relateDatasets,
                relateDatasetIds: relateDatasetIds
            }
        });
        if(data.action == 'view'){
            let datasetColInfo = await getColumnDataset(
                response.data.dashboard.relateDatasets,
                {
                    columns: {},
                    subDatasets: []
                }
            );
            self.postMessage({
                action: 'setDatasetAndColumnsOnViewAction',
                data: datasetColInfo
            });
        }
    },
    async deleteRows(data){
        console.log(data, 'dataaaaaaaaaaa')
        let arr = []
        data.rows.forEach(async function(e){
            let res = await biApi.deleteDashboard(e.id)
            self.postMessage({
                action: 'handleDeleteRows',
                data: res.status
            });
        })
        
    }
};
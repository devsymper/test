import { dashboardApi } from "@/api/dashboard.js";

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
        let newCell = {};
        for (let cell of allCell) {
            newCell = this.getDefaultCellConfigs(cell.type, cell.id_symper);
            cell.setting = JSON.parse(cell.settings);
            cell.style = JSON.parse(cell.style);
            newCell.rawConfigs.condition = JSON.parse(cell.condition);

            // chuyển nội dung của editor từ setting sang displayoption
            if (cell.type == 'editor') {
                newCell.viewConfigs.displayOptions.content = cell.setting.content;
                cell.setting = {};
            }
            newCell = this.restoreCellSetting(newCell, cell);
            newCell = this.restoreCellStyle(newCell, cell);
            newCell.rawConfigs.extra = cell.extra ? JSON.parse(cell.extra) : {};
            cellConfigs[cell.id_symper] = newCell;
        }

        if (!cellConfigs.hasOwnProperty('global')) {
            cellConfigs.global = this.getDefaultCellConfigs('global', 'global');
        }
        return cellConfigs;
    },
    
    async getDashboardInfo(data){
        let idDashboard = data.idDashboard;
        let response = await dashboardApi.getDashboardInfo(idDashboard);
        let allCellConfigs = this.restoreAllCellConfigs(response.data.reports);
        let dashboardInfo = this.restoreDashboardConfigs(response.data.dashboard,allCellConfigs);
        let needRemoteDataCellCount = 0;

        for(let id in allCellConfigs){
            if(allCellConfigs[id].sharedConfigs.type != 'editor' && allCellConfigs[id].sharedConfigs.type != 'global'){
                needRemoteDataCellCount += 1;
            }
        }

        self.postMessage({
            allCellConfigs,
            dashboardInfo,
            needRemoteDataCellCount,
            relateDatasets: response.data.dashboard.relateDatasets
        });
    }
};
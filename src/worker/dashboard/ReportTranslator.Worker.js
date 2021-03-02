var cachedReportResponse = {};

onmessage = function (event) {
    let data = event.data;
    let action = data.action;
    if(handler[action]){
        handler[action](data.data);
    } else {
        console.error(` action ${action} not found `);
    }
};
import { autoLoadChartClasses } from "@/components/dashboard/configPool/reportConfig.js";
import { dashboardApi } from "@/api/dashboard";
import { getDataInputForReport } from "@/components/dashboard/configPool/reportConfig.js";
var reportClasses = autoLoadChartClasses();

var handler = {
    
    isDropListFilter(cell) {
        // return cell.sharedConfigs.type == 'filter' && cell.viewConfigs.queryKey;
        return cell.sharedConfigs.type == 'filter';
    },

    async getDataFromServer(options){
        let cell = options.cell;
        let extra = options.extra;
        let cacheKey = options.dashboardId + '--' + cell.sharedConfigs.cellId;
        let data = {};
        if(options.extra.changeType == 'style' && cachedReportResponse[cacheKey]){
            data = cachedReportResponse[cacheKey];
        }else{
            if (options.cell.sharedConfigs.type != 'editor') {
                let dataInput = getDataInputForReport(cell, extra.relations);
                dataInput.dashboardId = extra.dashboardId;
                let res = await dashboardApi.getData(dataInput);
                data = res.data;
                if(!data.error){
                    cachedReportResponse[cacheKey] = data;
                }
            }
        }
        return data;
    },

    async translateReportConfig(options){
        let cell = options.cell;
        let extra = options.extra;
        let oldDisplayOptions = options.oldDisplayOption;
        let reportObj = new reportClasses[cell.sharedConfigs.type](cell.sharedConfigs.cellId);
        reportObj.assignComputedAttrsValue(cell);
        let rsl = {
            cellId: cell.sharedConfigs.cellId,
        };
        if(reportObj.canGetDataFromServer()){
            if(typeof reportObj.translate == 'function'){
                let data = await this.getDataFromServer(options);
                if(data.error){
                    rsl.error = data.error;
                }else{
                    let translatedData = reportObj.translate(cell.rawConfigs,  data, extra, {}, oldDisplayOptions);
                    rsl.translatedData = translatedData;
                }
                rsl.originData  = data ? data.data : null;
            }
        }
        self.postMessage({
            action: 'applyTranslatedConfig',
            data: rsl
        });
    }
}